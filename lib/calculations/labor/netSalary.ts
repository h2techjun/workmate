/**
 * 연봉 실수령액 계산 — 4대보험 + 근로소득세 (2026 기준).
 *
 * 월 급여 = 연봉 / 12
 * 과세대상 = 월 급여 − 비과세(식대 등)
 *
 * 4대보험 (근로자 부담분):
 *   국민연금 = 과세대상(기준소득월액) × 4.75% (2026.1~, 상·하한 적용)
 *   건강보험 = 보수월액 × 3.595% (2026)
 *   장기요양 = 건강보험료 × 13.14% (2026)
 *   고용보험 = 보수월액 × 0.9%
 *
 * 근로소득세 (간이세액 추정):
 *   근로소득공제 → 근로소득금액
 *   − 인적공제(본인+부양가족 ×150만) − 표준세액공제 근사
 *   → 종합소득세 누진세율로 연 산출세액 → /12
 *   지방소득세 = 소득세 × 10%
 *
 * ※ 실제 원천징수는 국세청 근로소득 간이세액표를 따르며 본 값과 ±5% 차이 가능.
 */

import { z } from "zod";
import {
  HEALTH_INSURANCE,
  LONG_TERM_CARE,
  NATIONAL_PENSION,
} from "@/lib/constants/insurance/rates2026";

export const netSalaryInputSchema = z.object({
  /** 연봉 (원) */
  annualSalary: z.number().min(0),
  /** 부양가족 수 (본인 포함) */
  dependents: z.number().int().min(1).max(15).default(1),
  /** 20세 이하 자녀 수 (자녀세액공제용) */
  childrenUnder20: z.number().int().min(0).max(10).default(0),
  /** 월 비과세액 (식대 등, 원) */
  monthlyNonTax: z.number().min(0).default(200_000),
});

export type NetSalaryInput = z.input<typeof netSalaryInputSchema>;
export type NetSalaryInputResolved = z.output<typeof netSalaryInputSchema>;

// 2026 4대보험 요율 (근로자 부담) — rates2026 단일 진실원
const PENSION_RATE = NATIONAL_PENSION.employeeRate; // 2026.1~: 4.75%
const HEALTH_RATE = HEALTH_INSURANCE.employeeRate; // 2026: 3.595%
const LONGTERM_RATE = LONG_TERM_CARE.rateOnHealth; // 2026: 13.14%
const EMPLOYMENT_RATE = 0.009;

// 국민연금 기준소득월액 상·하한 (2025.7~2026.6) — rates2026 단일 진실원
const PENSION_MAX = NATIONAL_PENSION.maxBase;
const PENSION_MIN = NATIONAL_PENSION.minBase;

interface Bracket {
  upper: number | null;
  rate: number;
  deduction: number;
}
const INCOME_BRACKETS: ReadonlyArray<Bracket> = [
  { upper: 14_000_000, rate: 0.06, deduction: 0 },
  { upper: 50_000_000, rate: 0.15, deduction: 1_260_000 },
  { upper: 88_000_000, rate: 0.24, deduction: 5_760_000 },
  { upper: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { upper: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { upper: 500_000_000, rate: 0.4, deduction: 25_940_000 },
  { upper: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { upper: null, rate: 0.45, deduction: 65_940_000 },
];

/** 근로소득공제 (총급여 구간별) */
function earnedIncomeDeduction(grossAnnual: number): number {
  if (grossAnnual <= 5_000_000) return grossAnnual * 0.7;
  if (grossAnnual <= 15_000_000) return 3_500_000 + (grossAnnual - 5_000_000) * 0.4;
  if (grossAnnual <= 45_000_000)
    return 7_500_000 + (grossAnnual - 15_000_000) * 0.15;
  if (grossAnnual <= 100_000_000)
    return 12_000_000 + (grossAnnual - 45_000_000) * 0.05;
  return Math.min(20_000_000, 14_750_000 + (grossAnnual - 100_000_000) * 0.02);
}

export interface NetSalaryResult {
  monthlyGross: number; // 월 급여 (세전)
  pension: number;
  health: number;
  longTerm: number;
  employment: number;
  totalInsurance: number; // 4대보험 합계 (월)
  incomeTax: number; // 소득세 (월)
  localTax: number; // 지방소득세 (월)
  totalTax: number; // 세금 합계 (월)
  monthlyNet: number; // 월 실수령액
  annualNet: number; // 연 실수령액
  deductionRate: number; // 공제율 (공제합/세전)
}

export function calculateNetSalary(
  input: NetSalaryInputResolved,
): NetSalaryResult {
  const { annualSalary, dependents, childrenUnder20, monthlyNonTax } = input;

  const monthlyGross = annualSalary / 12;
  const taxableMonthly = Math.max(0, monthlyGross - monthlyNonTax);

  // 4대보험 (월)
  const pensionBase = Math.min(
    PENSION_MAX,
    Math.max(PENSION_MIN, taxableMonthly),
  );
  const pension = Math.floor((pensionBase * PENSION_RATE) / 10) * 10;
  const health = Math.floor((taxableMonthly * HEALTH_RATE) / 10) * 10;
  const longTerm = Math.floor((health * LONGTERM_RATE) / 10) * 10;
  const employment = Math.floor((taxableMonthly * EMPLOYMENT_RATE) / 10) * 10;
  const totalInsurance = pension + health + longTerm + employment;

  // 근로소득세 (연 추정)
  const grossAnnualTaxable = taxableMonthly * 12;
  const earnedDeduction = earnedIncomeDeduction(grossAnnualTaxable);
  const earnedIncome = grossAnnualTaxable - earnedDeduction;
  // 인적공제: 부양가족 × 150만
  const personalDeduction = dependents * 1_500_000;
  // 연금보험료공제 (국민연금 연납)
  const pensionDeduction = pension * 12;
  const taxBase = Math.max(
    0,
    earnedIncome - personalDeduction - pensionDeduction,
  );

  const bracket =
    INCOME_BRACKETS.find((b) => b.upper === null || taxBase <= b.upper) ??
    INCOME_BRACKETS[INCOME_BRACKETS.length - 1]!;
  let annualIncomeTax = Math.max(0, taxBase * bracket.rate - bracket.deduction);

  // 근로소득세액공제 (산출세액의 일부, 간이)
  const wageCredit =
    annualIncomeTax <= 1_300_000
      ? annualIncomeTax * 0.55
      : 1_300_000 * 0.55 + (annualIncomeTax - 1_300_000) * 0.3;
  const wageCreditCap =
    grossAnnualTaxable <= 33_000_000 ? 740_000 : grossAnnualTaxable <= 70_000_000 ? 660_000 : 500_000;
  annualIncomeTax = Math.max(0, annualIncomeTax - Math.min(wageCredit, wageCreditCap));

  // 자녀세액공제 (8세~20세, 1명 15만, 2명 35만, 3명+ 35만+30만/인)
  let childCredit = 0;
  if (childrenUnder20 === 1) childCredit = 150_000;
  else if (childrenUnder20 === 2) childCredit = 350_000;
  else if (childrenUnder20 >= 3)
    childCredit = 350_000 + (childrenUnder20 - 2) * 300_000;
  annualIncomeTax = Math.max(0, annualIncomeTax - childCredit);

  const incomeTax = Math.floor(annualIncomeTax / 12 / 10) * 10;
  const localTax = Math.floor((incomeTax * 0.1) / 10) * 10;
  const totalTax = incomeTax + localTax;

  const monthlyNet = monthlyGross - totalInsurance - totalTax;
  const annualNet = monthlyNet * 12;
  const deductionRate =
    monthlyGross > 0 ? (totalInsurance + totalTax) / monthlyGross : 0;

  return {
    monthlyGross: Math.round(monthlyGross),
    pension,
    health,
    longTerm,
    employment,
    totalInsurance,
    incomeTax,
    localTax,
    totalTax,
    monthlyNet: Math.round(monthlyNet),
    annualNet: Math.round(annualNet),
    deductionRate,
  };
}
