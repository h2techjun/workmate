import createMiddleware from "next-intl/middleware";
import { locales, defaultLocale } from "./i18n";

export default createMiddleware({
  locales,
  defaultLocale,
  localePrefix: "always",
});

/**
 * Middleware 적용 범위.
 *
 * 제외 대상:
 *   - /api, /_next, /_vercel : Next.js 시스템 경로
 *   - .* \\..* : 파일 확장자 포함 경로 (정적 자산, robots.txt, sitemap.xml 등)
 *   - /play/*, /app/*, /lab/*: 메이커 프로젝트 통합 경로 — 정적 SPA / 외부 rewrite.
 *   - /icon, /apple-icon, /opengraph-image, /twitter-image, /favicon: Next.js
 *     특수 메타데이터 라우트. 확장자가 없어서 위 정규식으로는 못 잡힘.
 */
export const config = {
  matcher: [
    "/((?!api|_next|_vercel|play|app|lab|icon|apple-icon|opengraph-image|twitter-image|favicon|.*\\..*).*)",
  ],
};
