/**
 * 전월세전환율 상수 (2026 기준).
 *
 * 출처: 주택임대차보호법 제7조의2 + 시행령 제9조, 한국은행 기준금리.
 *  - 법정 상한 = min( 연 10%(곱하기 기준), 기준금리 + 2%(더하기 기준) )
 *  - 실무상 거의 항상 "기준금리 + 2%"가 더 낮아 상한이 된다.
 *
 * ⚠️ 변동 파라미터 — 한국은행 기준금리는 수시 변경(한국부동산원 공식 계산기조차
 *    옛 값 노출 사례). 폼에서 사용자 입력으로 덮어쓸 수 있게 하고, 이 값은 기본값.
 */

/** 한국은행 기준금리 (2025-05-29 변경, 2026-05 동결 유지) */
export const BOK_BASE_RATE = 0.025;

/** 시행령 제9조 더하기 가산이율 (2020-09-29 개정으로 3.5%→2%) */
export const CONVERSION_ADDED_RATE = 0.02;

/** 시행령 제9조 곱하기 기준 상한 (연 10%) */
export const CONVERSION_RATE_MULT_CAP = 0.1;

/** 현행 법정 전환율 상한 = min(10%, 기준금리+2%) = 4.5% */
export const LEGAL_CONVERSION_RATE = Math.min(
  CONVERSION_RATE_MULT_CAP,
  BOK_BASE_RATE + CONVERSION_ADDED_RATE,
);
