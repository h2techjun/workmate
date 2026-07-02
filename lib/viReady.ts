/**
 * 베트남어(vi) 완역 경로 레지스트리 — 단일 진실원.
 *
 * vi 는 부분 번역 로케일: 모든 페이지가 /vi 로 열리지만(미번역 = 영어 폴백),
 * **여기 등록된 경로만** 색인 대상이 된다:
 *   - sitemap.ts: vi URL 은 이 목록만 포함
 *   - lib/seo/alternates.ts: hreflang vi 는 이 목록만 방출
 *   - app/robots.ts: /vi/ 전체 Disallow + 이 목록만 Allow
 *
 * 새 도구의 vi 번역(페이지 분기 + 폼 + ToolGuide)이 끝나면 여기 한 줄 추가.
 * 반쪽 번역 페이지를 색인에 올리지 않기 위한 AdSense·중복콘텐츠 가드다.
 */

export const VI_READY_PATHS: readonly string[] = [
  "", // 홈 (공통 UI + 랜딩 네임스페이스 번역)
  "/net-salary",
  "/labor-calc/min-wage-monthly",
  "/labor-calc/severance",
  "/jeonse-wolse",
  "/deposit-risk",
  "/cost-of-living",
  "/remittance",
  "/korean-age",
  "/visa-days",
  "/foreign-health-insurance",
  "/pension-refund",
  "/foreign-flat-tax",
];

const SET = new Set(VI_READY_PATHS);

/** path 는 locale prefix 제외 (예: "/jeonse-wolse", 홈 = "") */
export function isViReady(path: string): boolean {
  const normalized = path === "/" ? "" : path;
  return SET.has(normalized);
}
