/**
 * 숫자 표시 포맷 — 단일 진실원.
 *
 * 모든 도구의 결과·계산 과정 숫자 출력은 이 유틸을 통해 천단위 구분(1,000)을 적용한다.
 * locale 을 명시 고정("ko-KR")해 SSR/CSR hydration mismatch 를 방지한다
 * (인자 없는 toLocaleString 은 서버·클라이언트 환경에 따라 결과가 달라질 수 있음).
 */

/** 천단위 구분 locale (한국·영문 모두 콤마+점 표기로 동일) */
const NUMBER_LOCALE = "ko-KR";

/**
 * 천단위 구분 + 소수점 포맷.
 *
 * 정수는 소수점을 생략하고(예: 1500 → "1,500"),
 * 소수는 정확히 `digits` 자리로 고정한다(예: 1234.5 → "1,234.50", digits=2).
 * 기존 `Number.isInteger(n) ? n.toString() : n.toFixed(digits)` 시맨틱을 보존하면서 천단위만 추가.
 */
export function formatNumber(n: number, digits: number = 2): string {
  if (!Number.isFinite(n)) return "0";
  if (Number.isInteger(n)) {
    return n.toLocaleString(NUMBER_LOCALE);
  }
  return n.toLocaleString(NUMBER_LOCALE, {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}

/** 원화 금액 — 반올림 후 천단위 구분 (예: 1234567 → "1,234,567"). */
export function formatKrw(n: number): string {
  return new Intl.NumberFormat(NUMBER_LOCALE).format(Math.round(n));
}
