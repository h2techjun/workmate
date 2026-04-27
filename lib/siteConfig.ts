/**
 * 사이트 전역 설정 — 도메인·브랜드명 등의 단일 진실원.
 * 환경변수 NEXT_PUBLIC_SITE_URL 이 우선이고, 미설정 시 fallback 으로 사용.
 *
 * 모든 sitemap·robots·schema·OG 메타데이터가 여기 한 곳을 참조하므로
 * 도메인 변경 시 이 파일과 .env 만 바꾸면 된다.
 */

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://workmate.tools";

export const SITE_BRAND = "Workmate" as const;

/** OG·schema 등에서 운영자 표기 */
export const SITE_AUTHOR = "Workmate" as const;
