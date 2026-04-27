/**
 * 4대보험 계산기 (Korean 4-Major Insurance Calculator)
 *
 * 월 급여(보수월액)로부터 근로자·사용자 각각의 4대보험 부담액 산출.
 * 2026년 요율 기준.
 *
 * @see lib/constants/insurance/rates2026.ts
 */

import { z } from "zod";
import {
  EMPLOYMENT_INSURANCE,
  HEALTH_INSURANCE,
  INDUSTRIAL_ACCIDENT,
  LONG_TERM_CARE,
  NATIONAL_PENSION,
} from "@/lib/constants/insurance/rates2026";

export const insuranceInputSchema = z.object({
  monthlySalary: z
    .number()
    .min(100000, "validation.salaryMin")
    .max(100000000, "validation.salaryMax"),
  /** 산재보험 요율 (사용자가 업종별로 변경 가능). 미입력 시 평균 0.86%. */
  industrialAccidentRate: z
    .number()
    .min(0)
    .max(0.5)
    .default(INDUSTRIAL_ACCIDENT.averageEmployerRate),
});

export type InsuranceInput = z.input<typeof insuranceInputSchema>;
export type InsuranceInputResolved = z.output<typeof insuranceInputSchema>;

export interface InsuranceLine {
  /** i18n key under insuranceTool.lines.* */
  key:
    | "nationalPension"
    | "healthInsurance"
    | "longTermCare"
    | "employmentUnemployment"
    | "employmentExtra"
    | "industrialAccident";
  /** 근로자 부담 (원) */
  employee: number;
  /** 사용자 부담 (원) */
  employer: number;
  /** 적용 요율 표시용 */
  rateNote: string;
}

export interface InsuranceResult {
  monthlySalary: number;
  pensionBase: number; // 국민연금 기준소득월액 (상·하한 적용된 값)
  lines: InsuranceLine[];
  /** 합산 */
  totalEmployee: number;
  totalEmployer: number;
  netSalary: number;
  totalCost: number;
  warnings: InsuranceWarning[];
}

export type InsuranceWarning =
  | { key: "pensionCapped"; cap: number }
  | { key: "pensionFloored"; floor: number };

function clamp(v: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, v));
}

/** 10원 단위 절사 — 부동소수점 오차 보정을 위해 Math.round 선행 */
function roundDown10(v: number): number {
  return Math.floor(Math.round(v) / 10) * 10;
}

export function calculateInsurance(rawInput: InsuranceInput): InsuranceResult {
  const input = insuranceInputSchema.parse(rawInput);
  const { monthlySalary, industrialAccidentRate } = input;

  // 국민연금: 기준소득월액 상·하한 적용
  const pensionBase = clamp(
    monthlySalary,
    NATIONAL_PENSION.minBase,
    NATIONAL_PENSION.maxBase,
  );
  const pensionEmployee = roundDown10(pensionBase * NATIONAL_PENSION.employeeRate);
  const pensionEmployer = roundDown10(pensionBase * NATIONAL_PENSION.employerRate);

  // 건강보험
  const healthEmployee = roundDown10(monthlySalary * HEALTH_INSURANCE.employeeRate);
  const healthEmployer = roundDown10(monthlySalary * HEALTH_INSURANCE.employerRate);
  const healthTotal = healthEmployee + healthEmployer;

  // 장기요양보험: 건강보험료 × 12.95%, 절반씩 부담
  const ltcTotal = healthTotal * LONG_TERM_CARE.rateOnHealth;
  const ltcEmployee = roundDown10(ltcTotal / 2);
  const ltcEmployer = roundDown10(ltcTotal / 2);

  // 고용보험 — 실업급여
  const empEmployee = roundDown10(
    monthlySalary * EMPLOYMENT_INSURANCE.unemploymentEmployeeRate,
  );
  const empEmployer = roundDown10(
    monthlySalary * EMPLOYMENT_INSURANCE.unemploymentEmployerRate,
  );

  // 고용보험 — 고용안정·직업능력개발 (사용자만)
  const empExtra = roundDown10(
    monthlySalary * EMPLOYMENT_INSURANCE.employerExtraRate,
  );

  // 산재보험 (사용자만)
  const accidentEmployer = roundDown10(monthlySalary * industrialAccidentRate);

  const lines: InsuranceLine[] = [
    {
      key: "nationalPension",
      employee: pensionEmployee,
      employer: pensionEmployer,
      rateNote: "각 4.5% (기준소득 상·하한 적용)",
    },
    {
      key: "healthInsurance",
      employee: healthEmployee,
      employer: healthEmployer,
      rateNote: "총 7.09% (각 3.545%)",
    },
    {
      key: "longTermCare",
      employee: ltcEmployee,
      employer: ltcEmployer,
      rateNote: "건강보험료 × 12.95%",
    },
    {
      key: "employmentUnemployment",
      employee: empEmployee,
      employer: empEmployer,
      rateNote: "각 0.9% (실업급여)",
    },
    {
      key: "employmentExtra",
      employee: 0,
      employer: empExtra,
      rateNote: "0.25% (사용자만, 150인 미만 기준)",
    },
    {
      key: "industrialAccident",
      employee: 0,
      employer: accidentEmployer,
      rateNote: `${(industrialAccidentRate * 100).toFixed(2)}% (사용자만, 업종별 차등)`,
    },
  ];

  const totalEmployee = lines.reduce((s, l) => s + l.employee, 0);
  const totalEmployer = lines.reduce((s, l) => s + l.employer, 0);
  const netSalary = monthlySalary - totalEmployee;
  const totalCost = monthlySalary + totalEmployer;

  const warnings: InsuranceWarning[] = [];
  if (monthlySalary > NATIONAL_PENSION.maxBase) {
    warnings.push({ key: "pensionCapped", cap: NATIONAL_PENSION.maxBase });
  }
  if (monthlySalary < NATIONAL_PENSION.minBase) {
    warnings.push({ key: "pensionFloored", floor: NATIONAL_PENSION.minBase });
  }

  return {
    monthlySalary,
    pensionBase,
    lines,
    totalEmployee,
    totalEmployer,
    netSalary,
    totalCost,
    warnings,
  };
}
