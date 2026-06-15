/**
 * 외국인 근로자 단일세율 특례 + 누진 비교 상수 (2026 귀속).
 *
 * 출처:
 *  - 조세특례제한법 §18조의2 (단일세율 특례·일몰·20년 유지)
 *  - 소득세법 §47 (근로소득공제)
 *  - 국세청 NTS (2026 귀속)
 *
 * ⚠️ 변동 파라미터 — 매년 세법 개정 시 이 파일만 갱신한다.
 *    누진세율 구간(BRACKETS_2026)은 incomeTax.ts 단일 진실원을 재사용.
 */

/** 단일세율 소득세율 (조특법 §18조의2) */
export const FLAT_TAX_RATE = 0.19;

/** 지방소득세율 = 소득세의 10% */
export const LOCAL_SURTAX_RATE = 0.1;

/** 단일세율 합산 실효세율 (소득세 19% + 지방세 1.9%) */
export const FLAT_TAX_COMBINED_RATE = 0.209;

/** 단일세율 신규 진입 일몰일 — 이 날까지 국내 최초 근로 시작분만 적용 */
export const FLAT_TAX_SUNSET_DATE = "2026-12-31";

/** 단일세율 적용 유지 기간 (최초 근로일부터, 년) */
export const FLAT_TAX_MAX_YEARS = 20;

/** 인적공제 1인당 (본인·부양가족, 소득세법 §50) */
export const PERSONAL_DEDUCTION_PER_PERSON = 1_500_000;

/** 근로소득공제 한도 (소득세법 §47 단서) */
export const EARNED_INCOME_DEDUCTION_CAP = 20_000_000;

export interface EarnedIncomeDeductionBracket {
  /** 구간 상한 (총급여, 원). null = 무한대 */
  readonly upper: number | null;
  /** 구간 시작점까지의 누적 공제 (원) */
  readonly base: number;
  /** 구간 내 초과분 공제율 */
  readonly rate: number;
  /** 구간 하한 (총급여, 원) */
  readonly floor: number;
}

/**
 * 근로소득공제 구간 (소득세법 §47).
 *   공제 = base + (총급여 − floor) × rate, 한도 EARNED_INCOME_DEDUCTION_CAP
 */
export const EARNED_INCOME_DEDUCTION_BRACKETS: ReadonlyArray<EarnedIncomeDeductionBracket> =
  [
    { upper: 5_000_000, base: 0, rate: 0.7, floor: 0 },
    { upper: 15_000_000, base: 3_500_000, rate: 0.4, floor: 5_000_000 },
    { upper: 45_000_000, base: 7_500_000, rate: 0.15, floor: 15_000_000 },
    { upper: 100_000_000, base: 12_000_000, rate: 0.05, floor: 45_000_000 },
    { upper: null, base: 14_750_000, rate: 0.02, floor: 100_000_000 },
  ];
