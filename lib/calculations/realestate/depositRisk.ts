/**
 * 깡통전세(underwater jeonse) 위험도 계산 — 순수 함수.
 *
 * 세입자가 "이 집에 보증금을 넣어도 되나?"를 정량적으로 판단하도록 돕는다.
 * 핵심 지표는 두 개:
 *   전세가율  = 내 보증금 ÷ 매매시세
 *   부채비율  = (선순위 담보채권 + 내 보증금) ÷ 매매시세   ← "깡통" 판정의 핵심
 *
 * 그리고 최악의 경우(경매) 회수 시뮬레이션:
 *   예상 낙찰액   = 매매시세 × 낙찰가율(가정)
 *   내 회수가능액 = max(0, 예상 낙찰액 − 선순위 채권)   (선순위가 먼저 배당)
 *   예상 손실     = max(0, 내 보증금 − 내 회수가능액)
 *
 * ⚠️ 모든 임계값은 경험칙이며 법정 기준이 아니다. 낙찰가율은 물건별로 크게 다르므로
 *    사용자가 조정하는 가정치다. 결과는 참고용 — 등기부등본·HUG·전문가 확인 필수.
 *
 * 출처: 주택임대차보호법(대항력·우선변제), HUG 전세보증금반환보증 심사지표(부채비율),
 *       한국부동산원·법원경매 낙찰가율 통계(물건별 상이).
 */

import { z } from "zod";
import {
  DEFAULT_AUCTION_RECOVERY_PERCENT,
  RATIO_CAUTION_MAX,
  RATIO_DANGER_MAX,
  RATIO_SAFE_MAX,
  type RiskLevel,
} from "@/lib/constants/realestate/depositRisk";

export const depositRiskInputSchema = z.object({
  /** 매매 시세 (원) */
  marketPrice: z.number().min(0).max(1e13).default(0),
  /** 선순위 담보채권 = 근저당 설정액 등, 경매 시 나보다 먼저 배당 (원) */
  seniorDebt: z.number().min(0).max(1e13).default(0),
  /** 내 임차보증금 (원) */
  myDeposit: z.number().min(0).max(1e13).default(0),
  /** 경매 낙찰가율 가정 (%) — 물건별 상이, 사용자 조정 */
  auctionRecoveryPercent: z
    .number()
    .min(1, "validation.recoveryMin")
    .max(100, "validation.recoveryMax")
    .default(DEFAULT_AUCTION_RECOVERY_PERCENT),
});

export type DepositRiskInput = z.input<typeof depositRiskInputSchema>;
export type DepositRiskInputResolved = z.output<typeof depositRiskInputSchema>;

export interface DepositRiskResult {
  /** 입력이 유효한가 (시세 > 0). false면 나머지 값은 0 */
  valid: boolean;
  /** 전세가율 = 보증금 ÷ 시세 (0~) */
  jeonseRatio: number;
  /** 부채비율 = (선순위 + 보증금) ÷ 시세 (0~) — 핵심 지표 */
  debtRatio: number;
  /** 위험 등급 (부채비율 기준, 손실 발생 시 최소 danger로 상향) */
  level: RiskLevel;
  /** 예상 낙찰액 = 시세 × 낙찰가율 (원) */
  expectedAuctionProceeds: number;
  /** 내 회수가능액 = max(0, 예상 낙찰액 − 선순위) (원) */
  recoverableForMe: number;
  /** 예상 손실 = max(0, 보증금 − 회수가능액) (원) */
  shortfall: number;
  /** 내 보증금 중 회수 가능 비율 (0~1, 보증금 0이면 1) */
  recoveryRatioOfDeposit: number;
}

function ratioToLevel(debtRatio: number): RiskLevel {
  if (debtRatio <= RATIO_SAFE_MAX) return "safe";
  if (debtRatio <= RATIO_CAUTION_MAX) return "caution";
  if (debtRatio <= RATIO_DANGER_MAX) return "danger";
  return "critical";
}

export function calculateDepositRisk(
  input: DepositRiskInputResolved,
): DepositRiskResult {
  const { marketPrice, seniorDebt, myDeposit, auctionRecoveryPercent } = input;

  if (marketPrice <= 0) {
    return {
      valid: false,
      jeonseRatio: 0,
      debtRatio: 0,
      level: "safe",
      expectedAuctionProceeds: 0,
      recoverableForMe: 0,
      shortfall: 0,
      recoveryRatioOfDeposit: 1,
    };
  }

  const jeonseRatio = myDeposit / marketPrice;
  const debtRatio = (seniorDebt + myDeposit) / marketPrice;

  const expectedAuctionProceeds =
    marketPrice * (auctionRecoveryPercent / 100);
  const recoverableForMe = Math.max(0, expectedAuctionProceeds - seniorDebt);
  const cappedRecoverable = Math.min(recoverableForMe, myDeposit);
  const shortfall = Math.max(0, myDeposit - recoverableForMe);
  const recoveryRatioOfDeposit =
    myDeposit > 0 ? cappedRecoverable / myDeposit : 1;

  // 부채비율이 안전권이라도 실제 경매 시뮬에서 손실이 나면 최소 위험으로 상향.
  let level = ratioToLevel(debtRatio);
  if (shortfall > 0 && (level === "safe" || level === "caution")) {
    level = "danger";
  }

  return {
    valid: true,
    jeonseRatio,
    debtRatio,
    level,
    expectedAuctionProceeds,
    recoverableForMe,
    shortfall,
    recoveryRatioOfDeposit,
  };
}
