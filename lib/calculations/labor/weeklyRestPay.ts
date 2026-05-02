/**
 * 주휴수당 계산 — 근로기준법 제55조.
 *
 * 핵심 규칙:
 *   1. 주 15시간 미만 근로자는 발생 X
 *   2. 1주 소정근로일 만근 시 1일분 통상임금 발생
 *   3. 단시간 근로자: (주 소정근로시간 / 40) × 8시간 × 시급 (8시간 상한)
 *   4. 주 5일 8시간 근로자 = 8시간 × 시급
 *
 * 산식 (단시간):
 *   주휴 시간 = (주 소정근로시간 ÷ 40) × 8 (단, 8시간 상한)
 *   주휴수당 = 주휴 시간 × 시급
 */

import { WEEKLY_WORK_HOURS } from "@/lib/constants/labor/laborStandard";

export interface WeeklyRestPayInput {
  /** 시급 (원). hourlyWage 또는 monthlySalary 중 하나 필수. */
  hourlyWage?: number;
  /** 월급 — 시급으로 환산 (월 209시간 기준). */
  monthlySalary?: number;
  /** 주 소정근로시간. 기본 40. */
  weeklyHours?: number;
}

export interface WeeklyRestPayResult {
  ok: boolean;
  errors: ReadonlyArray<{ field: keyof WeeklyRestPayInput | "_root"; messageKey: string }>;
  /** 주휴수당이 발생하는가 (주 15시간 이상). */
  qualified: boolean;
  /** 사용된 시급. */
  hourlyWage: number;
  /** 주 소정근로시간. */
  weeklyHours: number;
  /** 주휴 시간 (1주). */
  restHours: number;
  /** 주휴수당 (1주). */
  weeklyAmount: number;
  /** 월 주휴수당 (4.345주 환산). */
  monthlyAmount: number;
  /** 연 주휴수당. */
  annualAmount: number;
  /** 단계 토큰. */
  steps: ReadonlyArray<{ key: string; values?: Record<string, string | number> }>;
}

const MONTHLY_WEEKS = 4.345;
const MONTHLY_HOURS_209 = 209;

export function calculateWeeklyRestPay(input: WeeklyRestPayInput): WeeklyRestPayResult {
  const errors: WeeklyRestPayResult["errors"][number][] = [];

  const monthlySalary = Number(input.monthlySalary) || 0;
  const inputHourly = Number(input.hourlyWage) || 0;
  const weeklyHours = input.weeklyHours && input.weeklyHours > 0
    ? Math.min(input.weeklyHours, 80)
    : WEEKLY_WORK_HOURS;

  if (inputHourly === 0 && monthlySalary === 0) {
    errors.push({ field: "_root", messageKey: "validation.wageRequired" });
  }
  if (input.weeklyHours !== undefined && input.weeklyHours <= 0) {
    errors.push({ field: "weeklyHours", messageKey: "validation.weeklyHoursPositive" });
  }

  if (errors.length > 0) {
    return {
      ok: false,
      errors,
      qualified: false,
      hourlyWage: 0,
      weeklyHours,
      restHours: 0,
      weeklyAmount: 0,
      monthlyAmount: 0,
      annualAmount: 0,
      steps: [],
    };
  }

  const hourlyWage = inputHourly > 0
    ? Math.round(inputHourly)
    : Math.round(monthlySalary / MONTHLY_HOURS_209);

  const qualified = weeklyHours >= 15;
  const steps: Array<{ key: string; values?: Record<string, string | number> }> = [];

  if (inputHourly === 0) {
    steps.push({
      key: "steps.deriveHourly",
      values: { monthlySalary, hourlyWage },
    });
  }

  if (!qualified) {
    steps.push({
      key: "steps.notQualified",
      values: { weeklyHours },
    });
    return {
      ok: true,
      errors: [],
      qualified: false,
      hourlyWage,
      weeklyHours,
      restHours: 0,
      weeklyAmount: 0,
      monthlyAmount: 0,
      annualAmount: 0,
      steps,
    };
  }

  // 주휴 시간 = (주 근로시간 / 40) × 8, 단 8시간 상한
  const restHoursRaw = (weeklyHours / WEEKLY_WORK_HOURS) * 8;
  const restHours = Math.min(restHoursRaw, 8);
  const weeklyAmount = Math.round(restHours * hourlyWage);
  const monthlyAmount = Math.round(weeklyAmount * MONTHLY_WEEKS);
  const annualAmount = monthlyAmount * 12;

  steps.push({
    key: weeklyHours === WEEKLY_WORK_HOURS ? "steps.fullTime" : "steps.partTime",
    values: { weeklyHours, restHours: restHours.toFixed(1) },
  });
  steps.push({
    key: "steps.weeklyAmount",
    values: { restHours: restHours.toFixed(1), hourlyWage, weeklyAmount },
  });
  steps.push({
    key: "steps.monthlyAmount",
    values: { weeklyAmount, monthlyAmount },
  });
  steps.push({
    key: "steps.annualAmount",
    values: { monthlyAmount, annualAmount },
  });

  return {
    ok: true,
    errors: [],
    qualified: true,
    hourlyWage,
    weeklyHours,
    restHours,
    weeklyAmount,
    monthlyAmount,
    annualAmount,
    steps,
  };
}
