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

/**
 * 차트 축 라벨용 금액 축약 — 3-locale.
 *
 * 공간이 좁은 SVG 축에서 자릿수를 줄여 표기한다.
 *  - ko: 1.5억 / 3,500만 / 9,000
 *  - en: ₩1.5B / ₩350M / ₩12K
 *  - vi: ₩1,5 tỷ / ₩350 tr / ₩12k  (tỷ=10⁹, tr=triệu 10⁶, 소수점=쉼표)
 */
export function formatAxisMoney(
  n: number,
  locale: "ko" | "en" | "vi",
): string {
  if (!Number.isFinite(n)) return "0";
  const sign = n < 0 ? "-" : "";
  const v = Math.abs(n);

  const short = (x: number): string => {
    const s = x.toFixed(1);
    return s.endsWith(".0") ? s.slice(0, -2) : s;
  };

  if (locale === "ko") {
    if (v >= 1e8) return `${sign}${short(v / 1e8)}억`;
    if (v >= 1e4)
      return `${sign}${Math.round(v / 1e4).toLocaleString(NUMBER_LOCALE)}만`;
    return `${sign}${Math.round(v).toLocaleString(NUMBER_LOCALE)}`;
  }
  if (locale === "vi") {
    if (v >= 1e9) return `${sign}₩${short(v / 1e9).replace(".", ",")} tỷ`;
    if (v >= 1e6) return `${sign}₩${short(v / 1e6).replace(".", ",")} tr`;
    if (v >= 1e3) return `${sign}₩${short(v / 1e3).replace(".", ",")}k`;
    return `${sign}₩${Math.round(v)}`;
  }
  if (v >= 1e9) return `${sign}₩${short(v / 1e9)}B`;
  if (v >= 1e6) return `${sign}₩${short(v / 1e6)}M`;
  if (v >= 1e3) return `${sign}₩${short(v / 1e3)}K`;
  return `${sign}₩${Math.round(v)}`;
}

/**
 * 한국식 금액 읽기 — 억·만 단위로 끊어 표기 (예: 12345000 → "1,234만 5,000원").
 *
 * 입력칸에 큰 숫자를 적을 때 백만·천만·억을 한눈에 구분하기 위한 보조 표시용.
 * 만 원 미만은 그대로 원 단위로 붙인다.
 */
export function formatKoreanMoney(n: number): string {
  if (!Number.isFinite(n) || n === 0) return "0원";
  const sign = n < 0 ? "-" : "";
  const v = Math.round(Math.abs(n));
  const eok = Math.floor(v / 1e8);
  const man = Math.floor((v % 1e8) / 1e4);
  const won = v % 1e4;
  const parts: string[] = [];
  if (eok > 0) parts.push(`${eok.toLocaleString(NUMBER_LOCALE)}억`);
  if (man > 0) parts.push(`${man.toLocaleString(NUMBER_LOCALE)}만`);
  if (won > 0) parts.push(`${won.toLocaleString(NUMBER_LOCALE)}`);
  return `${sign}${parts.join(" ")}원`;
}
