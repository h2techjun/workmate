/**
 * 외국인 근로자 단일세율(19%) vs 일반 누진세 비교 (2026 귀속).
 *
 * 한국에서 일하는 외국인은 조세특례제한법 §18조의2 단일세율 특례(20.9%)와
 * 일반 누진세율(6~45%) 중 유리한 쪽을 선택할 수 있다. 연봉을 입력하면 두 방식의
 * 세액을 계산해 어느 쪽이 유리한지 비교한다.
 *
 * 누진세율 구간(BRACKETS_2026)은 incomeTax.ts 단일 진실원을 재사용한다.
 * 변동 파라미터(세율·공제)는 lib/constants/tax/foreignFlatTax.ts 에 격리.
 *
 * 거주자 기준. 4대보험·특별세액공제·비과세 급여는 미반영(면책 참조) — 참고용 추정.
 */

import { z } from "zod";
import { BRACKETS_2026 } from "./incomeTax";
import {
  FLAT_TAX_RATE,
  LOCAL_SURTAX_RATE,
  PERSONAL_DEDUCTION_PER_PERSON,
  EARNED_INCOME_DEDUCTION_CAP,
  EARNED_INCOME_DEDUCTION_BRACKETS,
} from "@/lib/constants/tax/foreignFlatTax";

export const foreignFlatTaxInputSchema = z.object({
  /** 연 총급여 (원) */
  grossSalary: z
    .number()
    .min(0, "validation.grossMin")
    .max(1e11, "validation.grossMax"),
  /** 부양가족 수 (본인 제외) — 인적공제용 */
  dependents: z
    .number()
    .int("validation.dependentsInt")
    .min(0, "validation.dependentsMin")
    .max(20, "validation.dependentsMax")
    .default(0),
});

export type ForeignFlatTaxInput = z.input<typeof foreignFlatTaxInputSchema>;
export type ForeignFlatTaxInputResolved = z.output<
  typeof foreignFlatTaxInputSchema
>;

export interface TaxBreakdown {
  /** 소득세 (원) */
  incomeTax: number;
  /** 지방소득세 (원) */
  localTax: number;
  /** 합산 세액 (원) */
  total: number;
  /** 실효세율 (총급여 대비, 소수) */
  effectiveRate: number;
}

export interface ProgressiveBreakdown extends TaxBreakdown {
  /** 근로소득공제 */
  earnedIncomeDeduction: number;
  /** 인적공제 */
  personalDeduction: number;
  /** 과세표준 */
  taxableIncome: number;
  /** 산출세액 (세액공제 전) */
  calculatedTax: number;
  /** 근로소득세액공제 */
  wageEarnerCredit: number;
}

export interface ForeignFlatTaxResult {
  /** 연 총급여 */
  grossSalary: number;
  /** 단일세율 결과 */
  flat: TaxBreakdown;
  /** 누진세 결과 */
  progressive: ProgressiveBreakdown;
  /** 유리한 쪽 */
  recommended: "flat" | "progressive";
  /** 절세액 (유리한 쪽이 불리한 쪽보다 적게 내는 금액, 원) */
  savings: number;
}

/** 근로소득공제 (소득세법 §47), 한도 적용. */
export function earnedIncomeDeduction(grossSalary: number): number {
  const bracket =
    EARNED_INCOME_DEDUCTION_BRACKETS.find(
      (b) => b.upper === null || grossSalary <= b.upper,
    ) ?? EARNED_INCOME_DEDUCTION_BRACKETS[EARNED_INCOME_DEDUCTION_BRACKETS.length - 1]!;
  const deduction = bracket.base + (grossSalary - bracket.floor) * bracket.rate;
  return Math.min(Math.max(deduction, 0), EARNED_INCOME_DEDUCTION_CAP);
}

/**
 * 근로소득세액공제 (소득세법 §59).
 * 산출세액 130만 이하 55%, 초과분 30%. 총급여 구간별 한도.
 */
export function wageEarnerCredit(
  calculatedTax: number,
  grossSalary: number,
): number {
  const base =
    calculatedTax <= 1_300_000
      ? calculatedTax * 0.55
      : 1_300_000 * 0.55 + (calculatedTax - 1_300_000) * 0.3;

  let cap: number;
  if (grossSalary <= 33_000_000) {
    cap = 740_000;
  } else if (grossSalary <= 70_000_000) {
    cap = Math.max(660_000, 740_000 - (grossSalary - 33_000_000) * 0.008);
  } else if (grossSalary <= 120_000_000) {
    cap = Math.max(500_000, 660_000 - (grossSalary - 70_000_000) * 0.005);
  } else {
    cap = Math.max(200_000, 500_000 - (grossSalary - 120_000_000) * 0.005);
  }

  return Math.min(base, cap);
}

/** 단일세율 vs 누진세 비교 계산. */
export function calculateForeignFlatTax(
  input: ForeignFlatTaxInputResolved,
): ForeignFlatTaxResult {
  const { grossSalary, dependents } = input;

  // ── 단일세율 (20.9%) ──
  const flatIncomeTax = grossSalary * FLAT_TAX_RATE;
  const flatLocalTax = flatIncomeTax * LOCAL_SURTAX_RATE;
  const flatTotal = flatIncomeTax + flatLocalTax;
  const flat: TaxBreakdown = {
    incomeTax: flatIncomeTax,
    localTax: flatLocalTax,
    total: flatTotal,
    effectiveRate: grossSalary > 0 ? flatTotal / grossSalary : 0,
  };

  // ── 누진세 (거주자 기준) ──
  const eid = earnedIncomeDeduction(grossSalary);
  const personalDeduction = PERSONAL_DEDUCTION_PER_PERSON * (1 + dependents);
  const taxableIncome = Math.max(grossSalary - eid - personalDeduction, 0);

  const bracket =
    BRACKETS_2026.find((b) => b.upper === null || taxableIncome <= b.upper) ??
    BRACKETS_2026[BRACKETS_2026.length - 1]!;
  const calculatedTax = Math.max(
    0,
    taxableIncome * bracket.rate - bracket.deduction,
  );
  const credit = wageEarnerCredit(calculatedTax, grossSalary);
  const progIncomeTax = Math.max(0, calculatedTax - credit);
  const progLocalTax = progIncomeTax * LOCAL_SURTAX_RATE;
  const progTotal = progIncomeTax + progLocalTax;

  const progressive: ProgressiveBreakdown = {
    earnedIncomeDeduction: eid,
    personalDeduction,
    taxableIncome,
    calculatedTax,
    wageEarnerCredit: credit,
    incomeTax: progIncomeTax,
    localTax: progLocalTax,
    total: progTotal,
    effectiveRate: grossSalary > 0 ? progTotal / grossSalary : 0,
  };

  const recommended: "flat" | "progressive" =
    flatTotal < progTotal ? "flat" : "progressive";
  const savings = Math.abs(flatTotal - progTotal);

  return { grossSalary, flat, progressive, recommended, savings };
}
