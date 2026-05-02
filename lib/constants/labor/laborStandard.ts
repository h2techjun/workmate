/**
 * 한국 근로기준법 (Labor Standards Act) 핵심 상수.
 *
 * 출처:
 *   - 근로기준법 제60조 (연차 유급휴가)
 *   - 근로기준법 제55조 (주휴일 — 주휴수당)
 *   - 근로기준법 제2조 (통상임금 — 행정해석)
 *   - 2026년 최저임금법 고시 (10,030원/시간 가정. 2025년 결정 후 갱신 필요)
 */

/**
 * 1년 미만 근로자의 연차 발생 — 매월 만근 1일.
 * 근로기준법 제60조 제2항.
 *
 * 단, 법 개정(2018-05-29) 이후 1년 차에 받은 매월 1일은 1년 후 발생하는 15일과
 * 별개로 인정되므로, 1년 차에 최대 11일 + 1년 차 종료 후 15일 = 누적 26일까지 가능.
 */
export const MONTHLY_LEAVE_FIRST_YEAR_CAP = 11;

/**
 * 1년 이상 근로자의 기본 연차 일수.
 */
export const ANNUAL_LEAVE_BASE = 15;

/**
 * 가산 연차 — 3년차부터 매 2년마다 +1일.
 * 근로기준법 제60조 제4항.
 */
export const ANNUAL_LEAVE_INCREMENT_INTERVAL = 2;

/**
 * 연차 일수 법정 상한.
 * 근로기준법 제60조 제4항 단서.
 */
export const ANNUAL_LEAVE_CAP = 25;

/**
 * 통상임금 산정 기준 시간 (월 209시간).
 *
 * 산식:
 *   주 40시간 + 주휴 8시간 = 주 48시간
 *   월 평균 주수 ≈ 4.345 (52주 ÷ 12개월)
 *   48 × 4.345 ≈ 208.56 → 행정해석상 209시간
 */
export const STANDARD_MONTHLY_WORK_HOURS = 209;

/**
 * 1일 통상근로시간 (8시간).
 */
export const DAILY_WORK_HOURS = 8;

/**
 * 주 통상근로시간 (40시간 — 주 5일제).
 */
export const WEEKLY_WORK_HOURS = 40;

/**
 * 2026년 최저임금 (시간급, 원).
 *
 * NOTE: 매년 8월 5일 결정·고시 → 익년 1월 1일 적용. 갱신 시 반드시 반영.
 * 2025년 = 10,030원 / 2026년은 미고시 시점에는 동일 가정 후 표시.
 */
export const MIN_WAGE_2025 = 10_030;
export const MIN_WAGE_2026 = 10_030; // 미고시 시 2025 값 사용 (UI 에서 명시)

/**
 * 부가가치세율 (10%).
 */
export const VAT_RATE = 0.1;

/**
 * 연차 수당 산정 시 통상임금이 입력되지 않은 경우 자동 계산:
 *   1일 통상임금 = 월급 / 209 × 8
 */
export function computeDailyOrdinaryWage(monthlySalary: number): number {
  return Math.round((monthlySalary / STANDARD_MONTHLY_WORK_HOURS) * DAILY_WORK_HOURS);
}

/**
 * 시간 통상임금 (시급 환산).
 */
export function computeHourlyOrdinaryWage(monthlySalary: number): number {
  return Math.round(monthlySalary / STANDARD_MONTHLY_WORK_HOURS);
}
