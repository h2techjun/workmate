import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n.ts");

/**
 * 메이커 프로젝트 통합 호스팅.
 *
 * - public/play/<slug>/   : Flutter 게임 정적 빌드 (K-Poker, Defense) — Next.js 가 자동 서빙
 * - public/app/<slug>/    : Flutter 앱 정적 빌드 (Hakrew web)
 * - rewrites              : Next.js 앱은 별도 Vercel 프로젝트로 프록시
 *
 * 환경변수 (Vercel 에 등록):
 *   NEXT_PUBLIC_DOC_TRANSLATOR_URL  = https://doc-translator.vercel.app
 *   NEXT_PUBLIC_OFFICE_HUNTER_URL   = https://office-hunter.vercel.app
 *   NEXT_PUBLIC_JEONJU_URL          = https://jeonju.vercel.app
 *   NEXT_PUBLIC_6HOURS_URL          = https://6hours.vercel.app
 *
 * 미설정 시 rewrite 항목 자체가 추가되지 않으므로 카드는 외부 링크로 fallback 동작.
 *
 * 향후 서브도메인 분리:
 *   public/play/<slug>/ 삭제 + DNS CNAME 추가 + 카탈로그 hostType 만 변경.
 */
const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  async rewrites() {
    const proxies: Array<{ source: string; destination: string }> = [];

    if (process.env.NEXT_PUBLIC_DOC_TRANSLATOR_URL) {
      proxies.push({
        source: "/app/doc-translator/:path*",
        destination: `${process.env.NEXT_PUBLIC_DOC_TRANSLATOR_URL}/app/doc-translator/:path*`,
      });
    }
    if (process.env.NEXT_PUBLIC_OFFICE_HUNTER_URL) {
      proxies.push({
        source: "/app/office-hunter/:path*",
        destination: `${process.env.NEXT_PUBLIC_OFFICE_HUNTER_URL}/app/office-hunter/:path*`,
      });
    }
    if (process.env.NEXT_PUBLIC_JEONJU_URL) {
      proxies.push({
        source: "/app/jeonju/:path*",
        destination: `${process.env.NEXT_PUBLIC_JEONJU_URL}/app/jeonju/:path*`,
      });
    }
    if (process.env.NEXT_PUBLIC_6HOURS_URL) {
      proxies.push({
        source: "/lab/6hours/:path*",
        destination: `${process.env.NEXT_PUBLIC_6HOURS_URL}/lab/6hours/:path*`,
      });
    }

    return {
      beforeFiles: [],
      afterFiles: proxies,
      fallback: [],
    };
  },
  /**
   * 리다이렉트 규칙.
   * 1) www → apex (301/308): 단일 표준 도메인 강제 → GSC "중복 페이지(표준 없음)" 해소.
   *    canonical 은 이미 apex 를 가리키지만, www 가 본문을 서빙하면 Google 이 중복으로
   *    잠시 잡는다. host 조건 리다이렉트로 www 가 아예 본문을 안 내보내게 한다.
   *
   *    ⚠️ 단, 루트 텍스트 파일(ads.txt·indexnow-key·llms.txt·llms-full.txt)은
   *    negative-lookahead 로 리다이렉트에서 제외한다 — 이들은 전용 크롤러
   *    (Google-Adstxt / IndexNow / AI 엔진)가 "정확한 URL 에서 직접 200"을 기대하는데,
   *    www 로 크롤할 때 308 을 만나면 리다이렉트 본문("Redirecting...")을 파일 내용으로
   *    오인하거나, 배포 중 apex/www alias 재설정 순간과 겹쳐 간헐적으로 "찾을 수 없음"이
   *    된다 (AdSense ads.txt "됐다 안됐다" 사고 2026-07-06). 예외 시 apex/www 양쪽 항상 200.
   *    robots.txt·sitemap.xml 은 검색 크롤러가 리다이렉트를 잘 따르고 통합이 오히려
   *    바람직하므로 제외 대상에 넣지 않는다.
   * 2) 구 /projects URL → /games (308): 이전 백링크/색인 호환.
   */
  async redirects() {
    return [
      {
        source:
          "/:path((?!ads\\.txt|indexnow-key|llms\\.txt|llms-full\\.txt).*)",
        has: [{ type: "host", value: "www.workmate.tools" }],
        destination: "https://workmate.tools/:path",
        permanent: true,
      },
      {
        source: "/:locale(ko|en)/projects",
        destination: "/:locale/games",
        permanent: true,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
