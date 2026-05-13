/**
 * 임대료 5% 인상한도 검증 (주택임대차보호법 시행령 제8조).
 *
 * 갱신요구권 행사 시 인상률 상한 = 5%.
 * 보증금↔월세 환산: 환산율 (전월세 전환율, 시행령 9조) = 한국은행 기준금리 + 2% (변동).
 * 본 계산기는 2026-05 기준 기준금리 3.0% 가정으로 5.0% 환산율 default.
 *
 * 핵심 공식:
 *  - 보증금만 (전세): newDeposit = oldDeposit × (1+rate)
 *  - 월세만: newMonthly = oldMonthly × (1+rate)
 *  - 보증금+월세 (반전세): 총 환산보증금 = deposit + (monthly × 12 / 환산율) → 그 위에 5% 인상
 *      → 신규 보증금/월세 분배는 사용자 협의 사항 (계산기는 한도 총액만 제시)
 *
 * 적용 제한 (주임법 6조의3):
 *  - 갱신요구권 1회 한정 (최대 2년 추가)
 *  - 임대인 거주 등 사유 시 갱신 거절 가능
 *  - 신규 계약 (갱신 X) 은 5% 룰 미적용
 */

import { z } from "zod";

export const rentCapInputSchema = z.object({
  oldDeposit: z.number().min(0).default(0),
  oldMonthlyRent: z.number().min(0).default(0),
  /** 임차인이 제시받은(혹은 협상 중) 신규 보증금 */
  proposedDeposit: z.number().min(0).default(0),
  /** 임차인이 제시받은(혹은 협상 중) 신규 월세 */
  proposedMonthlyRent: z.number().min(0).default(0),
  /** 전월세 전환율 (% 단위, 2026 default 5.0%) */
  conversionRatePercent: z.number().min(0.1).max(20).default(5.0),
  /** 상한 인상률 (% 단위, 주임법 5%) */
  capPercent: z.number().min(0).max(20).default(5.0),
});

export type RentCapInput = z.input<typeof rentCapInputSchema>;
export type RentCapInputResolved = z.output<typeof rentCapInputSchema>;

export interface RentCapResult {
  /** 기존 환산 보증금 (보증금 + 월세 연환산/환산율) */
  oldEquivalentDeposit: number;
  /** 5% 인상 한도 환산 보증금 */
  maxEquivalentDeposit: number;
  /** 신규 제안 환산 보증금 */
  proposedEquivalentDeposit: number;
  /** 신규 제안 인상률 (소수, 0.05 = 5%) */
  proposedIncreaseRate: number;
  /** 5% 한도 통과 여부 */
  withinCap: boolean;
  /** 한도 초과 시 초과 환산금액 */
  overage: number;
  /** 한도 도달까지 남은 환산금액 (음수면 초과) */
  remaining: number;
  /** 추천: 보증금만 인상 시 최대 보증금 (월세 유지 가정) */
  recommendedDepositOnly: number;
  /** 추천: 월세만 인상 시 최대 월세 (보증금 유지 가정) */
  recommendedMonthlyOnly: number;
}

/** 환산보증금 = 보증금 + (월세 × 12 / 환산율) */
function toEquivalentDeposit(
  deposit: number,
  monthly: number,
  conversionRate: number,
): number {
  if (conversionRate <= 0) return deposit;
  return deposit + (monthly * 12) / conversionRate;
}

export function calculateRentCap(input: RentCapInputResolved): RentCapResult {
  const {
    oldDeposit,
    oldMonthlyRent,
    proposedDeposit,
    proposedMonthlyRent,
    conversionRatePercent,
    capPercent,
  } = input;

  const conversionRate = conversionRatePercent / 100;
  const cap = capPercent / 100;

  const oldEquiv = toEquivalentDeposit(oldDeposit, oldMonthlyRent, conversionRate);
  const maxEquiv = oldEquiv * (1 + cap);
  const proposedEquiv = toEquivalentDeposit(
    proposedDeposit,
    proposedMonthlyRent,
    conversionRate,
  );

  const proposedIncreaseRate = oldEquiv > 0 ? proposedEquiv / oldEquiv - 1 : 0;
  const overage = Math.max(0, proposedEquiv - maxEquiv);
  const remaining = maxEquiv - proposedEquiv;

  // 추천 1: 월세 유지 시 보증금 최대치
  // maxEquiv = newDeposit + (oldMonthly × 12 / rate)
  // → newDeposit = maxEquiv - oldMonthly × 12 / rate
  const monthlyContribution = (oldMonthlyRent * 12) / conversionRate;
  const recommendedDepositOnly = Math.max(0, maxEquiv - monthlyContribution);

  // 추천 2: 보증금 유지 시 월세 최대치
  // maxEquiv = oldDeposit + (newMonthly × 12 / rate)
  // → newMonthly = (maxEquiv - oldDeposit) × rate / 12
  const recommendedMonthlyOnly = Math.max(
    0,
    ((maxEquiv - oldDeposit) * conversionRate) / 12,
  );

  return {
    oldEquivalentDeposit: oldEquiv,
    maxEquivalentDeposit: maxEquiv,
    proposedEquivalentDeposit: proposedEquiv,
    proposedIncreaseRate,
    withinCap: proposedEquiv <= maxEquiv + 1, // 1원 오차 허용
    overage,
    remaining,
    recommendedDepositOnly,
    recommendedMonthlyOnly,
  };
}
