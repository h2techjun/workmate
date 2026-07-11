import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/siteConfig";
import { VI_READY_PATHS } from "@/lib/viReady";
import { ZH_READY_PATHS } from "@/lib/zhReady";

/**
 * vi·zh 는 부분 번역 로케일 — 완역 경로만 크롤 허용하고 /vi/·/zh/ 나머지는
 * 차단해 "영어 폴백 페이지 = /en 중복 콘텐츠" 색인을 방지한다.
 * (Google/Bing 은 더 구체적인 규칙(Allow)이 Disallow 를 이긴다.)
 */
export default function robots(): MetadataRoute.Robots {
  const viAllow = VI_READY_PATHS.map((p) => (p === "" ? "/vi$" : `/vi${p}`));
  const zhAllow = ZH_READY_PATHS.map((p) => (p === "" ? "/zh$" : `/zh${p}`));
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", ...viAllow, ...zhAllow],
        // /ktype = 게임 SPA(콘텐츠 title 뿐, thin) → 색인 제외. 색인 본체는 /korean-typing 랜딩.
        disallow: ["/api/", "/ktype", "/vi/", "/zh/"],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
