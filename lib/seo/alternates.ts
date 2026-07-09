/**
 * hreflang `alternates.languages` 헬퍼 — 모든 도구 페이지에서 사용.
 *
 * Next.js Metadata API 의 `alternates.languages` 에 x-default 가 누락되면
 * Google Search Console 이 다국어 페이지를 "사용자가 선택한 표준이 없는
 * 중복 페이지" 로 판정 → 색인 거부.
 *
 * 본 헬퍼는 ko/en(+완역 시 vi) + x-default(=ko, 기본 언어) 를 채워서 반환.
 *
 * ⚠️ vi 게이트: vi 는 부분 번역 로케일이므로 lib/viReady.ts 에 등록된
 *    완역 경로에서만 vi hreflang 을 방출한다 (영어 폴백 페이지가
 *    /en 의 중복으로 색인되는 것을 방지).
 *
 * 사용:
 *   alternates: {
 *     canonical: `/${locale}/loan-calc`,
 *     languages: buildLanguagesAlt("/loan-calc"),
 *   },
 */

import { locales, defaultLocale } from "@/i18n";
import { isViReady } from "@/lib/viReady";
import { isZhReady } from "@/lib/zhReady";

/**
 * @param path - locale prefix 를 제외한 절대 경로 (예: "/income-tax", "/timber-calc/studs")
 *               빈 문자열 ("") 은 홈 페이지로 처리됨.
 * @returns hreflang 매핑 (ko/en[/vi] + x-default)
 */
export function buildLanguagesAlt(path: string): Record<string, string> {
  const normalized = path.startsWith("/") || path === "" ? path : `/${path}`;
  const included = locales.filter(
    (l) =>
      (l !== "vi" || isViReady(normalized)) &&
      (l !== "zh" || isZhReady(normalized)),
  );
  const map = Object.fromEntries(
    included.map((l) => [l, `/${l}${normalized}`]),
  );
  // x-default = 기본 언어 (한국어) 페이지로 지정
  return {
    ...map,
    "x-default": `/${defaultLocale}${normalized}`,
  };
}
