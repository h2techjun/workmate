/**
 * 연차 유급휴가 계산 — 근로기준법 제60조.
 *
 * 핵심 규칙:
 *   1. 1년 미만 근로자 (제2항): 매월 만근 시 1일씩, 최대 11일
 *   2. 1년 이상 근로자 (제1항): 80% 이상 출근 시 15일
 *   3. 3년차 이상 (제4항): 15일 + (근속년수 - 1) ÷ 2 의 정수부, 상한 25일
 *
 * 미사용 연차 수당:
 *   = 1일 통상임금 × 미사용 연차 일수
 *   = 미사용 일수 × (월 통상임금 / 209 × 8)
 */

import {
  ANNUAL_LEAVE_BASE,
  ANNUAL_LEAVE_CAP,
  ANNUAL_LEAVE_INCREMENT_INTERVAL,
  MONTHLY_LEAVE_FIRST_YEAR_CAP,
  computeDailyOrdinaryWage,
} from "@/lib/constants/labor/laborStandard";

export interface AnnualLeaveInput {
  /** 입사일 (ISO 8601: YYYY-MM-DD) */
  hireDate: string;
  /** 기준일 — 미입력 시 오늘. (ISO 8601) */
  referenceDate?: string;
  /** 미사용 연차 일수 — 수당 계산 용도. 미입력 시 0. */
  unusedDays?: number;
  /**
   * 통상임금 입력 모드:
   *   "monthly": 월급 입력 (자동으로 209시간 ÷ 8시간 일급 환산)
   *   "daily":   1일 통상임금을 직접 입력
   */
  wageMode?: "monthly" | "daily";
  /** 월급 (wageMode="monthly" 일 때) */
  monthlySalary?: number;
  /** 1일 통상임금 (wageMode="daily" 일 때) */
  dailyOrdinaryWage?: number;
  /** 출근율 80% 이상인가 — 미입력 시 true. */
  attendanceOver80?: boolean;
}

export type AnnualLeaveStepKind =
  | "header"
  | "rule"
  | "monthly-accrual"
  | "annual-base"
  | "annual-increment"
  | "cap-applied"
  | "wage-derive"
  | "compensation";

export interface AnnualLeaveStep {
  kind: AnnualLeaveStepKind;
  /** i18n key (라벨 or 헤더). */
  labelKey: string;
  /** 보간될 값들 — 화면 측 t() 에 전달. */
  values?: Record<string, string | number>;
}

export type AnnualLeaveWarningCode =
  | "future-hire-date"
  | "low-attendance"
  | "missing-wage"
  | "negative-unused";

export interface AnnualLeaveWarning {
  code: AnnualLeaveWarningCode;
  /** 추가 컨텍스트. */
  values?: Record<string, string | number>;
}

export interface AnnualLeaveResult {
  /** 계산 성공 여부. false 인 경우 errors 만 채워짐. */
  ok: boolean;
  /** 입력 검증 실패 메시지 키 모음. */
  errors: ReadonlyArray<{ field: keyof AnnualLeaveInput | "_root"; messageKey: string }>;
  /** 발생 연차 일수. 1년 미만이면 매월 누적 1일(최대 11). */
  daysAccrued: number;
  /** 만근 시 다음 1년차에 발생할 예정 일수 (가이드용). */
  daysAtNextAnniversary: number;
  /** 근속 년수 (정수, 계산 기준일 시점). */
  yearsWorked: number;
  /** 근속 개월 — 1년 미만 매월 발생 산정용. */
  monthsWorked: number;
  /** 미사용 연차 수당 (원). 입력값 누락 시 0. */
  compensation: number;
  /** 1일 통상임금 (원). */
  dailyOrdinaryWage: number;
  /** 단계별 계산 토큰. */
  steps: ReadonlyArray<AnnualLeaveStep>;
  /** 경고 모음. */
  warnings: ReadonlyArray<AnnualLeaveWarning>;
}

/**
 * 입사일과 기준일 사이의 만 근속 년수·개월수 계산.
 *
 * 예: 2024-03-15 ~ 2026-05-02 → 2년 1개월 (정확히 2년 1개월 17일)
 *
 * @returns { years, months, totalMonths } 정수 (소수점 버림)
 */
function computeTenure(
  hireDate: Date,
  referenceDate: Date,
): { years: number; months: number; totalMonths: number } {
  let years = referenceDate.getFullYear() - hireDate.getFullYear();
  let months = referenceDate.getMonth() - hireDate.getMonth();
  const dayDiff = referenceDate.getDate() - hireDate.getDate();
  if (dayDiff < 0) months -= 1;
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  const totalMonths = years * 12 + months;
  return { years, months, totalMonths };
}

/**
 * 1년 이상 근속자의 발생 연차 일수.
 * 3년차부터 2년마다 +1, 상한 25.
 */
function computeAnnualEntitlement(years: number): number {
  if (years < 1) return 0;
  if (years === 1) return ANNUAL_LEAVE_BASE;
  const increments = Math.floor((years - 1) / ANNUAL_LEAVE_INCREMENT_INTERVAL);
  return Math.min(ANNUAL_LEAVE_BASE + increments, ANNUAL_LEAVE_CAP);
}

/**
 * 1년 미만 근속자의 누적 매월 1일 발생.
 */
function computeMonthlyAccrual(totalMonths: number): number {
  if (totalMonths <= 0) return 0;
  return Math.min(totalMonths, MONTHLY_LEAVE_FIRST_YEAR_CAP);
}

export function calculateAnnualLeave(input: AnnualLeaveInput): AnnualLeaveResult {
  const errors: AnnualLeaveResult["errors"][number][] = [];
  const warnings: AnnualLeaveWarning[] = [];

  // ── 입력 검증 ──
  if (!input.hireDate) {
    errors.push({ field: "hireDate", messageKey: "validation.hireDateRequired" });
  }

  const hire = input.hireDate ? new Date(input.hireDate) : null;
  const ref = input.referenceDate ? new Date(input.referenceDate) : new Date();
  const today = new Date();

  if (hire && Number.isNaN(hire.getTime())) {
    errors.push({ field: "hireDate", messageKey: "validation.hireDateInvalid" });
  }
  if (input.referenceDate && Number.isNaN(ref.getTime())) {
    errors.push({
      field: "referenceDate",
      messageKey: "validation.referenceDateInvalid",
    });
  }
  if (hire && ref && hire.getTime() > ref.getTime()) {
    errors.push({ field: "hireDate", messageKey: "validation.hireAfterReference" });
  }
  if (hire && hire.getTime() > today.getTime() + 86_400_000) {
    warnings.push({ code: "future-hire-date" });
  }

  if (input.unusedDays !== undefined && input.unusedDays < 0) {
    errors.push({
      field: "unusedDays",
      messageKey: "validation.unusedDaysNegative",
    });
  }

  if (errors.length > 0 || !hire) {
    return {
      ok: false,
      errors,
      daysAccrued: 0,
      daysAtNextAnniversary: 0,
      yearsWorked: 0,
      monthsWorked: 0,
      compensation: 0,
      dailyOrdinaryWage: 0,
      steps: [],
      warnings,
    };
  }

  // ── 근속 ──
  const { years, totalMonths } = computeTenure(hire, ref);
  const steps: AnnualLeaveStep[] = [];

  steps.push({
    kind: "header",
    labelKey: "steps.tenure",
    values: { years, totalMonths },
  });

  // ── 발생 연차 ──
  const attendance = input.attendanceOver80 !== false;
  let daysAccrued = 0;
  let daysAtNextAnniversary = 0;

  if (years < 1) {
    daysAccrued = computeMonthlyAccrual(totalMonths);
    steps.push({
      kind: "monthly-accrual",
      labelKey: "steps.monthlyAccrual",
      values: { totalMonths, daysAccrued, cap: MONTHLY_LEAVE_FIRST_YEAR_CAP },
    });
    daysAtNextAnniversary = ANNUAL_LEAVE_BASE;
  } else {
    if (!attendance) {
      // 80% 미만은 매월 1일만 발생 (제60조 제2항·제3항)
      daysAccrued = computeMonthlyAccrual(totalMonths % 12 === 0 ? 12 : totalMonths % 12);
      warnings.push({ code: "low-attendance" });
      steps.push({
        kind: "rule",
        labelKey: "steps.lowAttendance",
        values: { daysAccrued },
      });
    } else {
      daysAccrued = computeAnnualEntitlement(years);
      steps.push({
        kind: "annual-base",
        labelKey: "steps.annualBase",
        values: { years, base: ANNUAL_LEAVE_BASE },
      });
      if (years >= 3) {
        const increments = Math.floor((years - 1) / ANNUAL_LEAVE_INCREMENT_INTERVAL);
        steps.push({
          kind: "annual-increment",
          labelKey: "steps.annualIncrement",
          values: {
            years,
            interval: ANNUAL_LEAVE_INCREMENT_INTERVAL,
            increments,
            total: ANNUAL_LEAVE_BASE + increments,
          },
        });
      }
      if (daysAccrued >= ANNUAL_LEAVE_CAP) {
        steps.push({
          kind: "cap-applied",
          labelKey: "steps.capApplied",
          values: { cap: ANNUAL_LEAVE_CAP },
        });
      }
      daysAtNextAnniversary = computeAnnualEntitlement(years + 1);
    }
  }

  // ── 통상임금 / 미사용 수당 ──
  const wageMode = input.wageMode ?? "monthly";
  let dailyOrdinaryWage = 0;

  if (wageMode === "daily") {
    if (input.dailyOrdinaryWage && input.dailyOrdinaryWage > 0) {
      dailyOrdinaryWage = Math.round(input.dailyOrdinaryWage);
    }
  } else if (input.monthlySalary && input.monthlySalary > 0) {
    dailyOrdinaryWage = computeDailyOrdinaryWage(input.monthlySalary);
    steps.push({
      kind: "wage-derive",
      labelKey: "steps.wageDerive",
      values: {
        monthly: input.monthlySalary,
        daily: dailyOrdinaryWage,
      },
    });
  }

  const unused = input.unusedDays ?? 0;
  const compensation = dailyOrdinaryWage > 0 && unused > 0
    ? dailyOrdinaryWage * unused
    : 0;

  if (compensation > 0) {
    steps.push({
      kind: "compensation",
      labelKey: "steps.compensation",
      values: {
        unused,
        daily: dailyOrdinaryWage,
        total: compensation,
      },
    });
  } else if (unused > 0 && dailyOrdinaryWage === 0) {
    warnings.push({ code: "missing-wage" });
  }

  return {
    ok: true,
    errors: [],
    daysAccrued,
    daysAtNextAnniversary,
    yearsWorked: years,
    monthsWorked: totalMonths,
    compensation,
    dailyOrdinaryWage,
    steps,
    warnings,
  };
}
