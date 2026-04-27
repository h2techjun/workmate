/**
 * 2026년 4대보험 요율 (한국)
 *
 * 출처:
 * - 국민연금공단 — https://www.nps.or.kr
 * - 국민건강보험공단 — https://www.nhis.or.kr
 * - 근로복지공단 — https://www.kcomwel.or.kr (산재보험)
 * - 고용보험 — https://www.ei.go.kr
 *
 * 본 요율은 2026년 1월 기준이며, 정부 발표 시 변경 가능.
 */

/* ===========================================================================
 * 국민연금 (National Pension)
 * 근로자 + 사용자 각 4.5%
 * 기준소득월액 상한·하한 적용 (2026년 기준)
 * =========================================================================== */

export const NATIONAL_PENSION = {
  employeeRate: 0.045, // 근로자 부담률
  employerRate: 0.045, // 사용자 부담률
  totalRate: 0.09,
  /** 기준소득월액 하한 (월 기준) */
  minBase: 390000,
  /** 기준소득월액 상한 */
  maxBase: 6170000,
};

/* ===========================================================================
 * 건강보험 (Health Insurance)
 * 보수월액 × 7.09% (2026 기준), 근로자/사용자 각 절반
 * =========================================================================== */

export const HEALTH_INSURANCE = {
  /** 총 요율 (근로자+사용자) */
  totalRate: 0.0709,
  employeeRate: 0.03545,
  employerRate: 0.03545,
};

/* ===========================================================================
 * 장기요양보험 (Long-term Care Insurance)
 * 건강보험료 × 12.95% (2026 기준)
 * 근로자·사용자 각 절반 부담
 * =========================================================================== */

export const LONG_TERM_CARE = {
  /** 건강보험료 대비 비율 */
  rateOnHealth: 0.1295,
};

/* ===========================================================================
 * 고용보험 (Employment Insurance)
 * 실업급여: 근로자·사용자 각 0.9%
 * 고용안정·직업능력개발: 사용자만 (사업장 규모별 0.25~0.85%, 단순화 0.25%)
 * =========================================================================== */

export const EMPLOYMENT_INSURANCE = {
  /** 실업급여 — 근로자 부담률 */
  unemploymentEmployeeRate: 0.009,
  /** 실업급여 — 사용자 부담률 */
  unemploymentEmployerRate: 0.009,
  /** 고용안정·직업능력개발 (150인 미만 사업장 기준) */
  employerExtraRate: 0.0025,
};

/* ===========================================================================
 * 산재보험 (Workers' Compensation Insurance)
 * 업종별 차등 적용. 사용자 100% 부담.
 * 본 도구는 평균 0.86% (전체 산업 평균, 2026 기준) 적용 — 사용자가 변경 가능.
 * =========================================================================== */

export const INDUSTRIAL_ACCIDENT = {
  /** 평균 요율 (사용자 100% 부담) */
  averageEmployerRate: 0.0086,
};

/** 모든 보험 합산 라벨 */
export const INSURANCE_KEYS = [
  "nationalPension",
  "healthInsurance",
  "longTermCare",
  "employmentUnemployment",
  "employmentExtra",
  "industrialAccident",
] as const;

export type InsuranceKey = (typeof INSURANCE_KEYS)[number];
