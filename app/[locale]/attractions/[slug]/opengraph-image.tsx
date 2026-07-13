import { renderToolCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/toolCard";
import { findAttraction, localizedAttraction } from "@/lib/attractionsCatalog";
import type { Locale } from "@/i18n";

export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;
export const alt = "Korea attraction — Workmate";

function localeKeyOf(locale: string): Locale {
  if (locale === "ko") return "ko";
  if (locale === "zh") return "zh";
  if (locale === "vi") return "vi";
  return "en";
}

/**
 * 명소 상세 OG — 브랜드 텍스트 카드(사진 미포함=저작권 안전). renderToolCard 재사용.
 */
export default async function Image({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  const attraction = findAttraction(slug);
  if (!attraction) {
    return renderToolCard({ sub: "Korea Attractions", headline: "Workmate" });
  }
  const t = localizedAttraction(attraction, localeKeyOf(locale));
  return renderToolCard({
    sub: `${t.regionLabel} · ${t.categoryLabel}`,
    headline: t.name,
    chips: t.tags.slice(0, 3) as string[],
  });
}
