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
  // 명소 사진 원격 호스트 — 상업이용 가능 소스만 허용(출처표시는 PhotoAttribution).
  // wikimedia=MVP CC/PD, tong.visitkorea=TourAPI(Phase 2), unsplash/pexels=무료 스톡 폴백.
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "upload.wikimedia.org" },
      { protocol: "https", hostname: "tong.visitkorea.or.kr" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "images.pexels.com" },
    ],
  },
  // 정적 임베드 SPA(public/loopla, public/play/*)는 trailingSlash:true 로 빌드된
  // 디렉토리/index.html 구조다. worktool 기본(trailingSlash:false)이 "/loopla/" 를
  // "/loopla" 로 308 정규화하면 디렉토리 인덱스 매핑이 깨져 404 가 된다.
  // 이 옵션으로 자동 trailing-slash 리다이렉트를 끄고 정적 파일서버가 index.html 을
  // 직접 서빙하게 한다. worktool 도구 URL 은 canonical 로 slash 없는 버전에 통합돼
  // 있으므로 SEO 영향 없음 (App Router 는 slash 유무 both 매칭).
  skipTrailingSlashRedirect: true,
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

    // 정적 임베드 SPA 디렉토리 인덱스 매핑 — Next.js 는 public/loopla/index.html 을
    // "/loopla/" 같은 디렉토리 URL 로 자동 서빙하지 않으므로 명시 rewrite 로 index.html
    // 을 붙인다. afterFiles 라 실제 파일(_next 자산·정확 경로)이 항상 우선이고, 존재하지
    // 않는 디렉토리 경로만 해당 index.html 로 fallback 된다.
    const looplaRewrites = [
      { source: "/loopla", destination: "/loopla/index.html" },
      { source: "/loopla/", destination: "/loopla/index.html" },
      // 확장자 있는 실제 정적 파일(.txt RSC flight payload·.js·.json·아이콘 등)은
      // 그대로 서빙(self-rewrite passthrough). 이 rule 이 없으면 아래 디렉토리→index.html
      // rewrite 가 클라이언트 RSC 네비게이션이 요청하는 `.../study/index.txt` 에
      // `/index.html` 을 덧붙여 `.../index.txt/index.html`(404) 로 확장해버린다
      // (rsc/next-router-state-tree 헤더 실린 요청이 정적파일 매칭을 건너뛰어 rewrite 로 떨어짐).
      { source: "/loopla/:path*.:ext", destination: "/loopla/:path*.:ext" },
      { source: "/loopla/:path+", destination: "/loopla/:path+/index.html" },
    ];

    // ktype = Vite SPA(단일 index.html). loopla(Next static export, 디렉토리별 index)와 달리
    // 모든 하위 경로를 하나의 /ktype/index.html 로 보낸다. afterFiles 라 /ktype/assets/* 실제
    // 자산이 항상 우선이고, 존재하지 않는 경로만 SPA 진입점으로 fallback 된다.
    const ktypeRewrites = [
      { source: "/ktype", destination: "/ktype/index.html" },
      { source: "/ktype/", destination: "/ktype/index.html" },
      { source: "/ktype/:path+", destination: "/ktype/index.html" },
    ];

    // kword = 한글 빈칸(크로스워드) Vite SPA. ktype 과 동일 패턴 — 단일 index.html.
    const kwordRewrites = [
      { source: "/kword", destination: "/kword/index.html" },
      { source: "/kword/", destination: "/kword/index.html" },
      { source: "/kword/:path+", destination: "/kword/index.html" },
    ];

    return {
      beforeFiles: [],
      afterFiles: [...proxies, ...looplaRewrites, ...ktypeRewrites, ...kwordRewrites],
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
      // 3) Loopla 정적 앱 루트 → locale 진입점.
      //    Loopla 는 단일 앱(런타임 코스 전환): 로케일 = 모국어 = 학습 코스.
      //      /loopla/ko = 영어 학습 / /loopla/en = 한국어 학습 / /loopla/zh = 중국어→한국어
      //    static export 라 루트 page 의 redirect 가 basePath(/loopla) 없이 튕기므로
      //    여기서 locale 진입점으로 직접 보낸다. permanent:false — 기본 locale 조정 가능.
      { source: "/loopla", destination: "/loopla/ko/", permanent: false },
      { source: "/loopla/", destination: "/loopla/ko/", permanent: false },
      // 구 이중빌드 한국어 URL(/loopla/korean/*) 보존 → 단일 앱 en 로케일(한국어 학습)로
      {
        source: "/loopla/korean",
        destination: "/loopla/en/",
        permanent: false,
      },
      {
        source: "/loopla/korean/",
        destination: "/loopla/en/",
        permanent: false,
      },
      {
        source: "/loopla/korean/:path*",
        destination: "/loopla/en/",
        permanent: false,
      },
    ];
  },
};

export default withNextIntl(nextConfig);
