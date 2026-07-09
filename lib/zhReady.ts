/**
 * 중국어(zh) 완역 경로 레지스트리 — 단일 진실원. (lib/viReady.ts 와 동일 패턴)
 *
 * zh 는 부분 번역 로케일: 모든 페이지가 /zh 로 열리지만(미번역 = 영어 폴백),
 * **여기 등록된 경로만** 색인 대상이 된다:
 *   - sitemap.ts: zh URL 은 이 목록만 포함
 *   - lib/seo/alternates.ts: hreflang zh 는 이 목록만 방출
 *   - app/robots.ts: /zh/ 전체 Disallow + 이 목록만 Allow
 *
 * 새 도구의 zh 번역(페이지 분기 + 폼 + ToolGuide)이 끝나면 여기 한 줄 추가.
 * 반쪽 번역 페이지를 색인에 올리지 않기 위한 AdSense·중복콘텐츠 가드다.
 */

export const ZH_READY_PATHS: readonly string[] = [
  "", // 홈 (공통 UI + home/layout 네임스페이스 zh 완역)
];

const SET = new Set(ZH_READY_PATHS);

/** path 는 locale prefix 제외 (예: "/jeonse-wolse", 홈 = "") */
export function isZhReady(path: string): boolean {
  const normalized = path === "/" ? "" : path;
  return SET.has(normalized);
}
