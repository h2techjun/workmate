import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
  /**
   * 브라우저/OS 언어 자동 감지 (명시).
   *
   * 루트(/) 또는 locale 없는 경로 진입 시 우선순위:
   *   1. NEXT_LOCALE 쿠키 (사용자가 LanguageSwitcher 로 직접 선택한 값 — 영속)
   *   2. Accept-Language 헤더 (브라우저/OS 설정 언어)
   *   3. defaultLocale (ko) — 매칭 실패 시
   *
   * 결과: 영어 브라우저 → /en, 한국어 브라우저 → /ko, 제3국 → /ko.
   * 사용자가 한 번 언어를 바꾸면 쿠키로 그 선택이 우선됨.
   */
  localeDetection: true,
});

/**
 * Middleware 적용 범위.
 *
 * 제외 대상:
 *   - /api, /_next, /_vercel : Next.js 시스템 경로
 *   - .* \\..* : 파일 확장자 포함 경로 (정적 자산, robots.txt, sitemap.xml 등)
 *   - /play/*, /app/*, /lab/*, /loopla/*: 메이커 프로젝트 통합 경로 — 정적 SPA / 외부 rewrite.
 *     (loopla = Loopla 한국어/영어 SRS 학습앱, public/loopla/ 정적 임베드 — Next.js 자동 서빙)
 *   - /icon, /apple-icon, /opengraph-image, /twitter-image, /favicon: Next.js
 *     특수 메타데이터 라우트. 확장자가 없어서 위 정규식으로는 못 잡힘.
 *   - /ads.txt, /indexnow-key: AdSense·IndexNow 검증용 루트 텍스트 응답.
 *     locale prefix 가 붙으면 검색엔진/AdSense 가 못 찾음.
 *   - /llms.txt, /llms-full.txt: AI 답변 엔진(GEO)용 루트 텍스트. 동일 이유로 제외.
 */
export const config = {
  matcher: [
    "/((?!api|_next|_vercel|play|app|lab|loopla|icon|apple-icon|opengraph-image|twitter-image|favicon|ads\\.txt|indexnow-key|llms\\.txt|llms-full\\.txt|.*\\..*).*)",
  ],
};
