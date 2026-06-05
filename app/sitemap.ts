import type { MetadataRoute } from "next";
import { locales } from "@/i18n";
import { SITE_URL } from "@/lib/siteConfig";
import { BLOG_POSTS } from "@/lib/blogPosts";

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
  "/korean-age",
  "/name-romanize",
  "/size-convert",
  "/visa-days",
  "/net-salary",
  "/freelancer-tax",
  "/electric-bill",
  "/capital-gains-tax",
  "/paint-calc",
  "/percent-calc",
  "/loan-calc",
  "/rent-cap",
  "/income-tax",
  "/tools",
  "/games",
  "/tests",
  "/blog",
  "/guide",
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const entries: MetadataRoute.Sitemap = [];
  for (const path of TOOL_PATHS) {
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: now,
        changeFrequency: "weekly",
        priority: path === "" ? 1.0 : 0.8,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
          ),
        },
      });
    }
  }
  // 블로그 글 — publishedAt 을 lastModified 로 사용 (정확한 색인 시그널)
  for (const post of BLOG_POSTS) {
    const path = `/blog/${post.slug}`;
    for (const locale of locales) {
      entries.push({
        url: `${SITE_URL}/${locale}${path}`,
        lastModified: new Date(post.publishedAt),
        changeFrequency: "monthly",
        priority: 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((l) => [l, `${SITE_URL}/${l}${path}`]),
          ),
        },
      });
    }
  }
  return entries;
}
