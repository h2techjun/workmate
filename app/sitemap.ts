import type { MetadataRoute } from "next";
import { locales } from "@/i18n";
import { SITE_URL } from "@/lib/siteConfig";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { ATTRACTIONS } from "@/lib/attractionsCatalog";
import { isPublished } from "@/lib/attractionsFeature";
import { isViReady } from "@/lib/viReady";
import { isZhReady } from "@/lib/zhReady";

const TOOL_PATHS = [
  "",
  "/electric-calc",
  "/electric-calc/wire-size",
  "/electric-calc/breaker",
  "/electric-calc/voltage-drop",
  "/timber-calc",
  "/timber-calc/span",
  "/timber-calc/insulation",
  "/timber-calc/material-quantity",
  "/timber-calc/stairs",
  "/timber-calc/rafter",
  "/timber-calc/roof-pitch",
  "/timber-calc/roof-area",
  "/timber-calc/concrete",
  "/timber-calc/lumber",
  "/timber-calc/drywall",
  "/timber-calc/plywood",
  "/timber-calc/osb",
  "/timber-calc/siding",
  "/timber-calc/insulation-batt",
  "/timber-calc/studs",
  "/timber-calc/tile",
  "/insurance-calc",
  "/foreign-stock-tax",
  "/json-csv",
  "/biznum-check",
  "/labor-calc",
  "/labor-calc/annual-leave",
  "/labor-calc/weekly-rest-pay",
  "/labor-calc/severance",
  "/labor-calc/min-wage-monthly",
  "/vat-calc",
  "/compound-calc",
  "/area-convert",
  "/distance-convert",
  "/temp-convert",
  "/text-romanize",
  "/voltage-guide",
  "/korean-age",
  "/cost-of-living",
  "/remittance",
  "/korean-number",
  "/hangul-decompose",
  "/school-grade",
  "/name-romanize",
  "/size-convert",
  "/visa-days",
  "/f2-residence-visa",
  "/d8-startup-visa",
  "/net-salary",
  "/freelancer-tax",
  "/car-acquisition-tax",
  "/car-tax",
  "/gift-money",
  "/due-date",
  "/electric-bill",
  "/btu-calc",
  "/capital-gains-tax",
  "/paint-calc",
  "/gravel-calc",
  "/deck-calc",
  "/percent-calc",
  "/loan-calc",
  "/rent-cap",
  "/apartment-area",
  "/jeonse-wolse",
  "/deposit-risk",
  "/income-tax",
  "/foreign-flat-tax",
  "/foreign-health-insurance",
  "/pension-refund",
  "/data",
  "/tools",
  "/games",
  "/tests",
  "/learn",
  "/korean-typing",
  "/korean-crossword",
  "/blog",
  "/guide",
  "/guide/foreign-work-visa-korea",
  "/guide/eps-e9-work-visa",
  "/guide/e7-professional-visa",
  "/guide/korea-passport-visa-free",
  "/guide/wire-size",
  "/guide/four-insurance",
  "/guide/span",
  "/guide/insulation",
  "/guide/biz-number",
  "/attractions",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const path of TOOL_PATHS) {
    // vi·zh 는 완역 경로만 sitemap 에 포함 (부분 번역 색인 방지)
    const pathLocales = locales.filter(
      (l) =>
        (l !== "vi" || isViReady(path)) && (l !== "zh" || isZhReady(path)),
    );
    for (const locale of pathLocales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: path === "" ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            pathLocales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
          ),
        },
      });
    }
  }
  // 블로그 글 — zh/vi 는 완역 경로만 포함 (zhReady/viReady 게이트, 부분 번역 색인 방지)
  for (const post of BLOG_POSTS) {
    const path = `/blog/${post.slug}`;
    const postLocales = locales.filter(
      (l) => (l !== "vi" || isViReady(path)) && (l !== "zh" || isZhReady(path)),
    );
    for (const locale of postLocales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            postLocales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
          ),
        },
      });
    }
  }
  // 명소 상세 — zh/vi 는 완역 경로만 포함(viReady/zhReady 게이트)
  for (const attraction of ATTRACTIONS.filter((a) =>
    isPublished(a.publishedAt, now),
  )) {
    const path = `/attractions/${attraction.slug}`;
    const attractionLocales = locales.filter(
      (l) => (l !== "vi" || isViReady(path)) && (l !== "zh" || isZhReady(path)),
    );
    for (const locale of attractionLocales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(attraction.publishedAt),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            attractionLocales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
          ),
        },
      });
    }
  }
  return entries;
}
