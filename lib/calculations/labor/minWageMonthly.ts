/**
 * 최저시급 → 월급 환산 계산.
 *
 * 한국에서 "최저시급으로 월급 얼마?" 검색은 주휴수당 포함/미포함이 논점.
 * 통상적으로 "월급 환산"은 주휴 포함 209시간 기준.
 *
 * 산식:
 *   월 통상근로시간 = (주 근로시간 × 주수) + 주휴시간 × 주수
 *   주 40시간 + 주 8시간(주휴) = 주 48시간
 *   월 평균 주수 = 4.345 → 48 × 4.345 ≈ 209시간
 *
 * 주 단축 근로 (예: 주 30시간) 도 동일하게 비례 처리.
 */

import {
  STANDARD_MONTHLY_WORK_HOURS,
  WEEKLY_WORK_HOURS,
  MIN_WAGE_2025,
  MIN_WAGE_2026,
} from "@/lib/constants/labor/laborStandard";

export interface MinWageInput {
  /** 시급 (원). 미입력 시 최저시급 사용. */
  hourlyWage?: number;
  /** 주 소정 근로시간. 기본 40 (주 5일·주 8시간). */
  weeklyHours?: number;
  /** 주휴수당 포함 환산 여부. 기본 true. */
  includeWeeklyRest?: boolean;
  /** 기준 연도 — "2025" / "2026". UI 표기용. */
  year?: "2025" | "2026";
}

export interface MinWageResult {
  ok: boolean;
  hourlyWage: number;
  weeklyHours: number;
  includeWeeklyRest: boolean;
  /** 월 통상근로시간 (주휴 포함 시 209 등). */
  monthlyHours: number;
  /** 월급 (원). */
  monthlySalary: number;
  /** 연봉 (원). */
  annualSalary: number;
  /** 주휴수당만 별도 (포함 모드일 때만 양수). */
  weeklyRestPay: number;
  /** 사용된 최저시급 (UI 비교용). */
  minWageReference: number;
  /** 단계별 토큰. */
  steps: ReadonlyArray<{
    key: string;
    values?: Record<string, string | number>;
  }>;
}

const MONTHLY_WEEKS = 4.345; // 52주 / 12개월

export function calculateMinWageMonthly(input: MinWageInput): MinWageResult {
  const year = input.year ?? "2026";
  const minWageRef = year === "2025" ? MIN_WAGE_2025 : MIN_WAGE_2026;
  const hourlyWage = input.hourlyWage && input.hourlyWage > 0
    ? Math.round(input.hourlyWage)
    : minWageRef;
  const weeklyHours = input.weeklyHours && input.weeklyHours > 0
    ? Math.min(input.weeklyHours, 52)
    : WEEKLY_WORK_HOURS;
  const includeWeeklyRest = input.includeWeeklyRest !== false;

  // 월 통상근로시간 산정
  let monthlyHours: number;
  if (weeklyHours === WEEKLY_WORK_HOURS && includeWeeklyRest) {
    monthlyHours = STANDARD_MONTHLY_WORK_HOURS; // 209
  } else if (includeWeeklyRest) {
    // 주휴 시간 = 주 근로시간 ÷ 5 (= 1일분, 단 8시간 상한)
    const dailyRest = Math.min(weeklyHours / 5, 8);
    monthlyHours = Math.round((weeklyHours + dailyRest) * MONTHLY_WEEKS);
  } else {
    monthlyHours = Math.round(weeklyHours * MONTHLY_WEEKS);
  }

  const monthlySalary = hourlyWage * monthlyHours;
  const annualSalary = monthlySalary * 12;

  // 주휴수당 부분 (참고)
  let weeklyRestPay = 0;
  if (includeWeeklyRest) {
    const restHoursPerMonth = monthlyHours - Math.round(weeklyHours * MONTHLY_WEEKS);
    weeklyRestPay = hourlyWage * Math.max(0, restHoursPerMonth);
  }

  const steps: MinWageResult["steps"] = [
    {
      key: "steps.input",
      values: { hourlyWage, weeklyHours, year },
    },
    {
      key: includeWeeklyRest
        ? "steps.monthlyHoursWithRest"
        : "steps.monthlyHoursNoRest",
      values: {
        weeklyHours,
        monthlyHours,
        weeks: MONTHLY_WEEKS,
      },
    },
    {
      key: "steps.monthlySalary",
      values: { hourlyWage, monthlyHours, monthlySalary },
    },
    {
      key: "steps.annualSalary",
      values: { monthlySalary, annualSalary },
    },
  ];

  return {
    ok: true,
    hourlyWage,
    weeklyHours,
    includeWeeklyRest,
    monthlyHours,
    monthlySalary,
    annualSalary,
    weeklyRestPay,
    minWageReference: minWageRef,
    steps,
  };
}
