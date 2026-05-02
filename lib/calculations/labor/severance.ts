/**
 * 퇴직금 계산 — 근로자퇴직급여 보장법 제8조.
 *
 * 핵심 규칙:
 *   1. 계속근로기간 1년 이상 시 발생 (1년 미만 = 0)
 *   2. 퇴직금 = 1일 평균임금 × 30 × (근속일수 / 365)
 *   3. 평균임금 = 퇴직 직전 3개월 임금총액 / 3개월 일수
 *   4. 통상임금이 평균임금보다 높으면 통상임금 적용
 *
 * 평균임금 산정 시 포함:
 *   - 퇴직 직전 3개월 기본급 + 고정수당
 *   - + (연간 상여금 × 3/12) — 정기 상여금이 있는 경우
 *   - + (연차수당 × 3/12) — 직전 1년에 발생한 연차수당
 *
 * 정기 상여금이 비정기적이거나 일회성인 경우 평균임금 산정에서 제외.
 */

import { STANDARD_MONTHLY_WORK_HOURS, DAILY_WORK_HOURS } from "@/lib/constants/labor/laborStandard";

export interface SeveranceInput {
  /** 입사일 (ISO 8601). */
  hireDate: string;
  /** 퇴사일 (ISO 8601). */
  resignDate: string;
  /** 퇴직 직전 3개월 임금총액 (월급 × 3 + 고정수당). */
  recentThreeMonthsSalary: number;
  /** 직전 1년 정기 상여금 합계 (옵션). */
  annualBonus?: number;
  /** 직전 1년 연차수당 (옵션). */
  annualLeavePay?: number;
  /** 통상임금 비교 — 월 통상임금 (옵션). 평균임금보다 높으면 통상임금 사용. */
  monthlyOrdinaryWage?: number;
}

export interface SeveranceResult {
  ok: boolean;
  errors: ReadonlyArray<{ field: keyof SeveranceInput | "_root"; messageKey: string }>;
  /** 계속근로기간 (일). */
  serviceDays: number;
  /** 계속근로기간 — 연/월/일 분해. */
  serviceBreakdown: { years: number; months: number; days: number };
  /** 평균임금 (1일). */
  averageDailyWage: number;
  /** 통상임금 환산 (1일) — monthlyOrdinaryWage 입력 시. */
  ordinaryDailyWage: number;
  /** 적용된 1일 임금 (둘 중 큰 값). */
  appliedDailyWage: number;
  /** 퇴직금 총액. */
  severance: number;
  /** 자격 요건 충족 (1년 이상). */
  qualified: boolean;
  steps: ReadonlyArray<{ key: string; values?: Record<string, string | number> }>;
}

const MS_PER_DAY = 86_400_000;

function daysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / MS_PER_DAY);
}

function breakdownTenure(
  hire: Date,
  resign: Date,
): { years: number; months: number; days: number } {
  let years = resign.getFullYear() - hire.getFullYear();
  let months = resign.getMonth() - hire.getMonth();
  let days = resign.getDate() - hire.getDate();
  if (days < 0) {
    months -= 1;
    // 직전 달의 일수
    const prev = new Date(resign.getFullYear(), resign.getMonth(), 0).getDate();
    days += prev;
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

export function calculateSeverance(input: SeveranceInput): SeveranceResult {
  const errors: SeveranceResult["errors"][number][] = [];

  if (!input.hireDate) {
    errors.push({ field: "hireDate", messageKey: "validation.hireDateRequired" });
  }
  if (!input.resignDate) {
    errors.push({ field: "resignDate", messageKey: "validation.resignDateRequired" });
  }
  if (!input.recentThreeMonthsSalary || input.recentThreeMonthsSalary <= 0) {
    errors.push({
      field: "recentThreeMonthsSalary",
      messageKey: "validation.salaryPositive",
    });
  }

  const hire = input.hireDate ? new Date(input.hireDate) : null;
  const resign = input.resignDate ? new Date(input.resignDate) : null;

  if (hire && resign && hire.getTime() >= resign.getTime()) {
    errors.push({ field: "hireDate", messageKey: "validation.hireBeforeResign" });
  }

  if (errors.length > 0 || !hire || !resign) {
    return {
      ok: false,
      errors,
      serviceDays: 0,
      serviceBreakdown: { years: 0, months: 0, days: 0 },
      averageDailyWage: 0,
      ordinaryDailyWage: 0,
      appliedDailyWage: 0,
      severance: 0,
      qualified: false,
      steps: [],
    };
  }

  // 계속근로기간
  const serviceDays = daysBetween(hire, resign);
  const breakdown = breakdownTenure(hire, resign);
  const qualified = serviceDays >= 365;
  const steps: Array<{ key: string; values?: Record<string, string | number> }> = [];

  steps.push({
    key: "steps.tenure",
    values: {
      years: breakdown.years,
      months: breakdown.months,
      days: breakdown.days,
      totalDays: serviceDays,
    },
  });

  if (!qualified) {
    steps.push({ key: "steps.notQualified", values: { totalDays: serviceDays } });
    return {
      ok: true,
      errors: [],
      serviceDays,
      serviceBreakdown: breakdown,
      averageDailyWage: 0,
      ordinaryDailyWage: 0,
      appliedDailyWage: 0,
      severance: 0,
      qualified: false,
      steps,
    };
  }

  // 평균임금 = 직전 3개월 임금 + (연간 상여금 × 3/12) + (연차수당 × 3/12)
  // → 산식상 90일 평균
  const threeMonthDays = 90; // 평균 (28+30+31 = 89~92, 표준 90)
  const bonusPortion = (input.annualBonus ?? 0) * (3 / 12);
  const leavePayPortion = (input.annualLeavePay ?? 0) * (3 / 12);
  const totalThreeMonths =
    input.recentThreeMonthsSalary + bonusPortion + leavePayPortion;
  const averageDailyWage = Math.round(totalThreeMonths / threeMonthDays);

  steps.push({
    key: "steps.averageWage",
    values: {
      threeMonthSalary: input.recentThreeMonthsSalary,
      bonusPortion: Math.round(bonusPortion),
      leavePayPortion: Math.round(leavePayPortion),
      total: Math.round(totalThreeMonths),
      averageDailyWage,
    },
  });

  // 통상임금 비교
  let ordinaryDailyWage = 0;
  if (input.monthlyOrdinaryWage && input.monthlyOrdinaryWage > 0) {
    ordinaryDailyWage = Math.round(
      (input.monthlyOrdinaryWage / STANDARD_MONTHLY_WORK_HOURS) * DAILY_WORK_HOURS,
    );
    steps.push({
      key: "steps.ordinaryWage",
      values: {
        monthlyOrdinary: input.monthlyOrdinaryWage,
        ordinaryDailyWage,
      },
    });
  }

  const appliedDailyWage = Math.max(averageDailyWage, ordinaryDailyWage);
  if (ordinaryDailyWage > 0 && ordinaryDailyWage > averageDailyWage) {
    steps.push({
      key: "steps.ordinaryApplied",
      values: { averageDailyWage, ordinaryDailyWage },
    });
  }

  // 퇴직금 = 일평균 × 30 × (근속일수 / 365)
  const severance = Math.round(appliedDailyWage * 30 * (serviceDays / 365));

  steps.push({
    key: "steps.severance",
    values: {
      appliedDailyWage,
      serviceDays,
      severance,
    },
  });

  return {
    ok: true,
    errors: [],
    serviceDays,
    serviceBreakdown: breakdown,
    averageDailyWage,
    ordinaryDailyWage,
    appliedDailyWage,
    severance,
    qualified: true,
    steps,
  };
}
