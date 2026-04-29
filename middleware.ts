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
 *   - /play/*, /app/*, /lab/*: 메이커 프로젝트 통합 경로 — 정적 SPA 또는 외부 rewrite
 *     대상이라 locale prefix 가 붙으면 안 됨.
 */
export const config = {
  matcher: ["/((?!api|_next|_vercel|play|app|lab|.*\\..*).*)"],
};
