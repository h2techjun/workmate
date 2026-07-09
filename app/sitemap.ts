import type { MetadataRoute } from "next";
import { locales } from "@/i18n";
import { SITE_URL } from "@/lib/siteConfig";
import { BLOG_POSTS } from "@/lib/blogPosts";
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
  "/blog",
  "/guide",
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
  // 블로그 글 — vi·zh 번역 전이므로 ko/en 만 (publishedAt = lastModified)
  const blogLocales = locales.filter((l) => l !== "vi" && l !== "zh");
  for (const post of BLOG_POSTS) {
    const path = `/blog/${post.slug}`;
    for (const locale of blogLocales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            blogLocales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
          ),
        },
      });
    }
  }
  return entries;
}
