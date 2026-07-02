/**
 * 실업급여(구직급여) 계산 — 고용보험법 제46조·제50조 (2019.10.1 개정 기준).
 *
 * 1일 구직급여액 = clamp(평균임금 × 60%, 하한액, 상한액)
 *
 * 상한액: 68,100원/일 (2026.1.1 이후 이직자 — 하한 역전 방지 위해 7년 만에 인상.
 *         2019.1.1~2025 이직자는 66,000원)
 * 하한액: 최저시급 × 0.8 × 1일 소정근로시간
 *         = 10,320원 × 0.8 × 8h = 66,048원 (2026 최저임금 기준 — 매년 변동)
 * 2026-07-03 검증. 이직일 기준으로 적용 연도가 결정됨(UI 주의 문구 필수).
 *
 * 소정급여일수 표 (2019.10.1 개정):
 *   가입기간 1년 미만             → 50세미만: 120일 / 50세이상·장애인: 120일
 *   가입기간 1년~3년 미만         → 150일 / 180일
 *   가입기간 3년~5년 미만         → 180일 / 210일
 *   가입기간 5년~10년 미만        → 210일 / 240일
 *   가입기간 10년 이상            → 240일 / 270일
 *
 * 총 예상 수령액 = 1일 구직급여액 × 소정급여일수
 *
 * ※ 실제 수급자격·금액은 거주지 고용센터가 최종 결정.
 *    이직사유·구직활동·대기기간 등 수급요건 별도 충족 필요.
 */

import { z } from "zod";

// ─── 상수 (2026 이직자 기준) ────────────────────────────────────────────────
/** 1일 구직급여 상한액 (원, 2026.1.1 이후 이직자. 2025 이직자는 66,000) */
export const DAILY_BENEFIT_CAP = 68_100;

/** 2026년 최저시급 (원/시간, 고시 제2025-47호) */
export const MIN_HOURLY_WAGE_2026 = 10_320;

/** 하한 계산 계수 (최저임금의 80%) */
export const FLOOR_RATE = 0.8;

/** 기본 1일 소정근로시간 (시간) */
export const DEFAULT_DAILY_WORK_HOURS = 8;

/** 1일 구직급여 하한액 (원, 2026 최저임금 기준) */
export const DAILY_BENEFIT_FLOOR = Math.round(
  MIN_HOURLY_WAGE_2026 * FLOOR_RATE * DEFAULT_DAILY_WORK_HOURS,
); // = 66,048

/** 구직급여 지급률 */
export const BENEFIT_RATE = 0.6;

// ─── 소정급여일수 표 ───────────────────────────────────────────────────────
interface BenefitDaysRow {
  minYears: number;
  maxYears: number | null; // null = 이상 (상한 없음)
  daysUnder50: number;
  daysAbove50: number;
}

const BENEFIT_DAYS_TABLE: ReadonlyArray<BenefitDaysRow> = [
  { minYears: 0, maxYears: 1, daysUnder50: 120, daysAbove50: 120 },
  { minYears: 1, maxYears: 3, daysUnder50: 150, daysAbove50: 180 },
  { minYears: 3, maxYears: 5, daysUnder50: 180, daysAbove50: 210 },
  { minYears: 5, maxYears: 10, daysUnder50: 210, daysAbove50: 240 },
  { minYears: 10, maxYears: null, daysUnder50: 240, daysAbove50: 270 },
];

// ─── Zod 스키마 ────────────────────────────────────────────────────────────
export const unemploymentBenefitInputSchema = z
  .object({
    /** 평균임금 입력 방식 */
    inputMode: z.enum(["daily", "monthly"]).default("daily"),
    /** 1일 평균임금 (원, inputMode=daily 시 직접 입력) */
    dailyAverageWage: z.number().min(0).default(0),
    /** 월평균임금 (원, inputMode=monthly 시 사용, /30 환산) */
    monthlyAverageSalary: z.number().min(0).default(0),
    /** 만 50세 이상 또는 장애인 여부 */
    ageAbove50: z.boolean().default(false),
    /** 고용보험 가입기간 (년) */
    insuranceYears: z.number().min(0).default(1),
    /** 1일 소정근로시간 (하한 계산용) */
    dailyWorkHours: z
      .number()
      .min(1)
      .max(8)
      .default(DEFAULT_DAILY_WORK_HOURS),
  })
  .transform((v) => ({
    ...v,
    // 실제 사용할 1일 평균임금 결정
    resolvedDailyWage:
      v.inputMode === "monthly"
        ? v.monthlyAverageSalary / 30
        : v.dailyAverageWage,
  }));

export type UnemploymentBenefitInput = z.input<
  typeof unemploymentBenefitInputSchema
>;
export type UnemploymentBenefitInputResolved = z.output<
  typeof unemploymentBenefitInputSchema
>;

// ─── 출력 타입 ─────────────────────────────────────────────────────────────
export interface UnemploymentBenefitResult {
  /** 1일 평균임금 × 60% (클램프 전) */
  dailyWageRaw: number;
  /** 실제 1일 구직급여액 (상한·하한 클램프 후) */
  dailyWageClamped: number;
  /** 하한액 (최저시급 × 0.8 × 소정근로시간) */
  dailyWageFloor: number;
  /** 상한액 */
  dailyWageCap: number;
  /** 소정급여일수 */
  benefitDays: number;
  /** 총 예상 수령액 */
  totalBenefit: number;
  /** 상한 적용 여부 */
  isCapApplied: boolean;
  /** 하한 적용 여부 */
  isFloorApplied: boolean;
}

// ─── 내부 헬퍼 ────────────────────────────────────────────────────────────
/** 소정급여일수 산출 */
function getBenefitDays(insuranceYears: number, ageAbove50: boolean): number {
  const row = BENEFIT_DAYS_TABLE.find(
    (r) =>
      insuranceYears >= r.minYears &&
      (r.maxYears === null || insuranceYears < r.maxYears),
  );
  // 테이블에서 반드시 행이 찾아져야 하지만, 방어적으로 처리
  const found = row ?? BENEFIT_DAYS_TABLE[BENEFIT_DAYS_TABLE.length - 1]!;
  return ageAbove50 ? found.daysAbove50 : found.daysUnder50;
}

/** 1일 하한액 계산 (소정근로시간 반영) */
function computeFloor(dailyWorkHours: number): number {
  return Math.round(MIN_HOURLY_WAGE_2026 * FLOOR_RATE * dailyWorkHours);
}

// ─── 메인 계산 함수 ────────────────────────────────────────────────────────
export function calculateUnemploymentBenefit(
  input: UnemploymentBenefitInputResolved,
): UnemploymentBenefitResult {
  const { resolvedDailyWage, ageAbove50, insuranceYears, dailyWorkHours } =
    input;

  const dailyWageRaw = resolvedDailyWage * BENEFIT_RATE;
  const floor = computeFloor(dailyWorkHours);
  const cap = DAILY_BENEFIT_CAP;

  const dailyWageClamped = Math.min(cap, Math.max(floor, dailyWageRaw));

  const isCapApplied = dailyWageRaw > cap;
  const isFloorApplied = dailyWageRaw < floor;

  const benefitDays = getBenefitDays(insuranceYears, ageAbove50);
  const totalBenefit = Math.round(dailyWageClamped * benefitDays);

  return {
    dailyWageRaw: Math.round(dailyWageRaw),
    dailyWageClamped: Math.round(dailyWageClamped),
    dailyWageFloor: floor,
    dailyWageCap: cap,
    benefitDays,
    totalBenefit,
    isCapApplied,
    isFloorApplied,
  };
}
