import type { MetadataRoute } from "next";
import { locales } from "@/i18n";
import { SITE_URL } from "@/lib/siteConfig";

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
  "/insurance-calc",
  "/foreign-stock-tax",
  "/json-csv",
  "/biznum-check",
  "/projects",
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
  return entries;
}
