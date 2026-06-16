/**
 * 국민연금 반환일시금(lump-sum refund) 추정 계산 — 순수 함수.
 *
 * ⚠️ 추정치다. 실제 반환액은 NPS가 월별 납부액에 납부 다음 달부터 지급사유 발생월까지
 * 연도별 3년만기 정기예금 이자율을 복리 누적해 산정한다. 본 함수는
 *   원금 = min(기준소득월액, 상한) × 요율 × 개월
 *   이자 ≈ 원금 × 연이자율 × (개월/12 ÷ 2)   // 평균 적립기간 = 전체기간/2 근사
 * 로 단순화한다. 사업장가입자 기준(사용자 부담분 포함 = 전체 9%).
 *
 * 출처: 국민연금법 §77, NPS 반환일시금 안내.
 */

import { z } from "zod";
import {
  PENSION_BASE_MAX,
  PENSION_BASE_MIN,
} from "@/lib/constants/insurance/nationalPensionRefund";

export const pensionRefundInputSchema = z.object({
  /** 기준소득월액 (원) — 상·하한 적용 */
  monthlySalary: z.number().min(0).default(0),
  /** 납부 개월 수 */
  months: z.number().int().min(0).default(0),
  /** 보험료율 (%) — 기본 9, 2026.1부터 9.5 */
  contributionRatePercent: z.number().min(0).max(100).default(9),
  /** 근사 연이자율 (%) — 3년만기 정기예금, 기본 2.6 */
  depositRatePercent: z.number().min(0).max(100).default(2.6),
});

export type PensionRefundInput = z.input<typeof pensionRefundInputSchema>;
export type PensionRefundInputResolved = z.output<
  typeof pensionRefundInputSchema
>;

export interface PensionRefundResult {
  /** 상·하한 적용된 실제 기준소득월액 */
  effectiveBase: number;
  /** 입력 급여가 상한을 초과해 캡이 적용됐는지 */
  capped: boolean;
  /** 원금(총 납부 보험료, 사용자 부담분 포함) */
  principal: number;
  /** 근사 이자 */
  interest: number;
  /** 추정 총 반환액 */
  total: number;
  /** 이자 계산에 쓴 평균 적립 연수 */
  avgYears: number;
}

/** 상·하한 적용 (0 입력은 0 유지 — 미입력으로 간주) */
function clampBase(salary: number): number {
  if (salary <= 0) return 0;
  if (salary > PENSION_BASE_MAX) return PENSION_BASE_MAX;
  if (salary < PENSION_BASE_MIN) return PENSION_BASE_MIN;
  return salary;
}

export function calcPensionRefund(
  input: PensionRefundInputResolved,
): PensionRefundResult {
  const effectiveBase = clampBase(input.monthlySalary);
  const rate = input.contributionRatePercent / 100;
  const depositRate = input.depositRatePercent / 100;

  const principal = Math.round(effectiveBase * rate * input.months);
  const avgYears = input.months / 12 / 2;
  const interest = Math.round(principal * depositRate * avgYears);

  return {
    effectiveBase,
    capped: input.monthlySalary > PENSION_BASE_MAX,
    principal,
    interest,
    total: principal + interest,
    avgYears,
  };
}
