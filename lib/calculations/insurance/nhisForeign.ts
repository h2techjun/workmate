/**
 * 외국인 국민건강보험(NHIS) 보험료 추정 (2026 기준).
 *
 * 직장가입자: 보수월액 × 근로자 요율(3.595%) + 장기요양(건보료 × 13.14%), 상·하한 캡.
 * 지역가입자: 외국인 특례 평균보험료(약 158,640원), 유학생 50% 경감.
 *
 * 변동 파라미터는 lib/constants/insurance/nhisForeign2026.ts 에 격리.
 * 지역가입자 소득·재산 점수제는 미반영(면책 참조) — 평균보험료 하한 단순화.
 */

import { z } from "zod";
import { NHIS_FOREIGN_2026 } from "@/lib/constants/insurance/nhisForeign2026";

export const nhisForeignInputSchema = z
  .object({
    /** 가입 유형 */
    enrollmentType: z.enum(["employee", "regional"]).default("employee"),
    /** 직장가입자 보수월액 (원) */
    monthlyWage: z
      .number()
      .min(0, "validation.wageMin")
      .max(1e9, "validation.wageMax")
      .default(0),
    /** 지역가입자 유학생(D-2/D-4) 50% 경감 여부 */
    isStudent: z.boolean().default(false),
  });

export type NhisForeignInput = z.input<typeof nhisForeignInputSchema>;
export type NhisForeignInputResolved = z.output<typeof nhisForeignInputSchema>;

export interface NhisForeignResult {
  enrollmentType: "employee" | "regional";
  /** 월 본인부담 건강보험료 */
  monthlyHealth: number;
  /** 월 본인부담 장기요양보험료 (지역가입자는 평균보험료에 포함 가정 → 0) */
  monthlyLongTermCare: number;
  /** 월 본인부담 합계 */
  monthlyTotal: number;
  /** 연 본인부담 합계 */
  annualTotal: number;
  /** 사용자(회사) 부담 월액 — 직장가입자만, 참고용 (지역은 0) */
  employerMonthly: number;
  /** 적용된 경감 여부 (지역 유학생) */
  studentReductionApplied: boolean;
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function calculateNhisForeign(
  input: NhisForeignInputResolved,
): NhisForeignResult {
  const {
    healthRateEmployee,
    longTermCareRate,
    employeeHealthMin,
    employeeHealthMax,
    regionalAveragePremium,
    studentReductionRate,
  } = NHIS_FOREIGN_2026;

  if (input.enrollmentType === "employee") {
    const health = clamp(
      input.monthlyWage * healthRateEmployee,
      employeeHealthMin,
      employeeHealthMax,
    );
    const longTermCare = health * longTermCareRate;
    const monthlyTotal = health + longTermCare;
    return {
      enrollmentType: "employee",
      monthlyHealth: health,
      monthlyLongTermCare: longTermCare,
      monthlyTotal,
      annualTotal: monthlyTotal * 12,
      employerMonthly: monthlyTotal, // 사용자도 동일액 부담
      studentReductionApplied: false,
    };
  }

  // 지역가입자 — 외국인 평균보험료(납부총액) 기준, 유학생 50% 경감
  const reduced = input.isStudent;
  const monthlyTotal = reduced
    ? regionalAveragePremium * studentReductionRate
    : regionalAveragePremium;

  return {
    enrollmentType: "regional",
    monthlyHealth: monthlyTotal,
    monthlyLongTermCare: 0,
    monthlyTotal,
    annualTotal: monthlyTotal * 12,
    employerMonthly: 0,
    studentReductionApplied: reduced,
  };
}
