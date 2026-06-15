/**
 * 복리 계산기 — Compound Interest Calculator
 *
 * 회당 이율 + 복리 횟수 모델. 기간(년)·복리 빈도 개념 없이 사용자가
 * "한 번 복리될 때 이율(i)"과 "복리가 적용되는 총 횟수(n)"를 직접 입력한다.
 *
 *   FV_principal = P × (1 + i)^n
 *   FV_pmt       = PMT × ((1+i)^n − 1) / i      // 매 회 말 적립 가정
 *   FV_total     = FV_principal + FV_pmt
 *   총수익률      = FV_total / (P + PMT×n) − 1
 *
 *   i = 회당 이율, n = 복리 횟수
 *   i = 0 이면 단순 합산 P + PMT × n (0으로 나누기 회피)
 *
 * 예) 월복리 연 5%·10년 = 회당 0.4167%(=5/12) × 120회.
 *     연복리 5%·10년    = 회당 5% × 10회.
 *
 * 출처: 일반 복리 공식 (Investopedia). 한국 표준 부재 — 국제 관행 차용.
 */

import { z } from "zod";

export const compoundInputSchema = z.object({
  /** 초기 원금 (원) */
  principal: z
    .number()
    .min(0, "validation.principalMin")
    .max(1e12, "validation.principalMax"),
  /** 회당 이율 (%, 한 번 복리될 때 적용되는 이율) */
  ratePerPeriodPercent: z
    .number()
    .min(-50, "validation.rateMin")
    .max(100, "validation.rateMax"),
  /** 복리 횟수 (회) — 복리가 적용되는 총 횟수 */
  periods: z
    .number()
    .int("validation.periodsInt")
    .min(1, "validation.periodsMin")
    .max(2400, "validation.periodsMax"),
  /** 매 회 말 정기 적립액 (원) — 0 이면 추가 적립 없음 */
  periodicContribution: z
    .number()
    .min(0, "validation.contribMin")
    .max(1e10, "validation.contribMax")
    .default(0),
});

export type CompoundInput = z.input<typeof compoundInputSchema>;
export type CompoundInputResolved = z.output<typeof compoundInputSchema>;

export interface CompoundResult {
  /** 만기 금액 */
  finalAmount: number;
  /** 원금 (변동 없음) */
  principal: number;
  /** 누적 적립 총액 (PMT × 횟수) */
  totalContribution: number;
  /** 누적 이자 (만기 금액 − 원금 − 누적 적립) */
  totalInterest: number;
  /** 총 투입 원금 (원금 + 누적 적립) */
  totalInvested: number;
  /** 총 수익률 (%) — 만기 금액 / 총 투입 − 1 */
  totalReturnPercent: number;
}

/**
 * 복리 계산.
 *
 *   FV = P(1 + i)^n + PMT × ((1+i)^n − 1) / i
 *
 * PMT 는 매 회 말에 적립한다고 가정한다.
 * i = 0 인 경우 단순 P + PMT × n 으로 처리 (0으로 나누기 회피).
 */
export function calculateCompound(input: CompoundInputResolved): CompoundResult {
  const P = input.principal;
  const i = input.ratePerPeriodPercent / 100;
  const n = input.periods;
  const PMT = input.periodicContribution;

  let finalAmount: number;
  if (i === 0) {
    finalAmount = P + PMT * n;
  } else {
    const growth = Math.pow(1 + i, n);
    const fvPrincipal = P * growth;
    const fvPMT = PMT === 0 ? 0 : PMT * ((growth - 1) / i);
    finalAmount = fvPrincipal + fvPMT;
  }

  const totalContribution = PMT * n;
  const totalInvested = P + totalContribution;
  const totalInterest = finalAmount - totalInvested;
  const totalReturnPercent =
    totalInvested > 0 ? (finalAmount / totalInvested - 1) * 100 : 0;

  return {
    finalAmount,
    principal: P,
    totalContribution,
    totalInterest,
    totalInvested,
    totalReturnPercent,
  };
}
