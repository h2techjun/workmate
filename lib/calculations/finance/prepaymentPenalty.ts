/**
 * 중도상환수수료 계산기 — Loan Prepayment Penalty Calculator
 *
 * 계산 방식: 은행 여신거래기본약관 슬라이딩 방식
 *
 * 중도상환수수료 = 중도상환원금 × 수수료율 × (잔존일수 / 면제기준기간일수)
 *
 * 잔존일수 = max(0, 면제기준기간일수 − 경과일수)
 * 면제기준기간일수 = 면제기준기간(년) × 365
 * 경과일수 = 경과개월 × 30.4  (단순화 가정: 1개월 = 30.4일)
 *
 * 경과 기간 ≥ 면제기준기간 → 잔존일수 = 0 → 수수료 면제
 *
 * 출처: 은행 여신거래기본약관, 각 은행 여신상품설명서
 */

import { z } from "zod";

export const prepaymentPenaltyInputSchema = z.object({
  /** 중도상환원금 (원) */
  principal: z
    .number()
    .min(10_000, "validation.principalMin")
    .max(1e11, "validation.principalMax"),
  /** 수수료율 (%) */
  penaltyRatePercent: z
    .number()
    .min(0, "validation.rateMin")
    .max(10, "validation.rateMax"),
  /** 대출 경과 기간 (개월) */
  elapsedMonths: z
    .number()
    .min(0, "validation.elapsedMin")
    .max(600, "validation.elapsedMax"),
  /** 면제기준기간 (년) */
  exemptionYears: z
    .number()
    .min(1, "validation.exemptionMin")
    .max(10, "validation.exemptionMax"),
});

export type PrepaymentPenaltyInput = z.input<typeof prepaymentPenaltyInputSchema>;
export type PrepaymentPenaltyInputResolved = z.output<typeof prepaymentPenaltyInputSchema>;

export interface PrepaymentPenaltyResult {
  /** 중도상환수수료액 (원) */
  penaltyAmount: number;
  /** 면제기준기간 총 일수 */
  exemptionDays: number;
  /** 경과 일수 (개월 × 30.4) */
  elapsedDays: number;
  /** 잔존 일수 (0 이하면 면제) */
  remainingDays: number;
  /** 수수료 면제 여부 */
  isExempt: boolean;
  /** 실효 수수료율 (%) = 수수료액 / 원금 × 100 */
  effectiveRatePercent: number;
}

/**
 * 중도상환수수료 계산.
 *
 * 슬라이딩 방식: 경과 기간이 길수록 수수료 감소.
 * 잔존일수가 0 이하이면 수수료 면제 (0원 반환).
 */
export function calculatePrepaymentPenalty(
  input: PrepaymentPenaltyInputResolved
): PrepaymentPenaltyResult {
  const exemptionDays = input.exemptionYears * 365;
  // 1개월 = 30.4일 단순화 (실제 은행은 달력 기준이지만 편의상)
  const elapsedDays = input.elapsedMonths * 30.4;
  const remainingDays = Math.max(0, exemptionDays - elapsedDays);
  const isExempt = remainingDays === 0;

  const penaltyAmount = isExempt
    ? 0
    : input.principal * (input.penaltyRatePercent / 100) * (remainingDays / exemptionDays);

  const effectiveRatePercent =
    input.principal > 0 ? (penaltyAmount / input.principal) * 100 : 0;

  return {
    penaltyAmount,
    exemptionDays,
    elapsedDays,
    remainingDays,
    isExempt,
    effectiveRatePercent,
  };
}
