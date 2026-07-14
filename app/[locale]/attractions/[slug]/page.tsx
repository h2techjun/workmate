import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL, SITE_BRAND } from "@/lib/siteConfig";
import {
  findAttraction,
  localizedAttraction,
  ATTRACTIONS,
} from "@/lib/attractionsCatalog";
import { publishedAttractions, isPublished } from "@/lib/attractionsFeature";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { TouristAttractionJsonLd } from "@/components/seo/StructuredData";
import { PhotoAttribution } from "@/components/attractions/PhotoAttribution";
import { AttractionMap } from "@/components/attractions/AttractionMap";
import { ReactionBar } from "@/components/attractions/ReactionBar";
import { CommentsSection } from "@/components/attractions/CommentsSection";

interface PageProps {
  params: Promise<{ locale: string; slug: string }>;
}

function localeKeyOf(locale: string): Locale {
  if (locale === "ko") return "ko";
  if (locale === "zh") return "zh";
  if (locale === "vi") return "vi";
  return "en";
}

// ISR + 예약발행 — 공개된 명소만 정적 생성, 미래 명소는 공개일에 자동 등장.
export const revalidate = 86400;
export const dynamicParams = true;

export function generateStaticParams(): Array<{ slug: string }> {
  return publishedAttractions(ATTRACTIONS, new Date()).map((a) => ({
    slug: a.slug,
  }));
}

const TIPS_HEADING: Record<Locale, string> = {
  ko: "방문 팁",
  en: "Visitor tips",
  zh: "参观贴士",
  vi: "Mẹo tham quan",
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const attraction = findAttraction(slug);
  if (!attraction) return {};
  const lk = localeKeyOf(locale);
  const t = localizedAttraction(attraction, lk);
  const url = `${SITE_URL}/${locale}/attractions/${slug}`;
  const title = `${t.name} — ${SITE_BRAND}`;

  return {
    title,
    description: t.summary,
    keywords: [...t.tags],
    alternates: {
      canonical: `/${locale}/attractions/${slug}`,
      languages: buildLanguagesAlt(`/attractions/${slug}`),
    },
    openGraph: {
      title,
      description: t.summary,
      url,
      type: "article",
      // OG 이미지는 opengraph-image.tsx(브랜드 텍스트 카드)가 자동 제공 — 사진 저작권 안전
    },
  };
}

export default async function AttractionDetailPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale, slug } = await params;
  const attraction = findAttraction(slug);
  // 미공개(publishedAt 미래) 명소는 공개일 전까지 404 — 예약발행
  if (!attraction || !isPublished(attraction.publishedAt, new Date())) {
    notFound();
  }
  const lk = localeKeyOf(locale);
  const t = localizedAttraction(attraction, lk);
  const url = `${SITE_URL}/${locale}/attractions/${slug}`;

  return (
    <>
      <TouristAttractionJsonLd
        id={slug}
        name={t.name}
        description={t.summary}
        url={url}
        image={attraction.image.url}
        lat={attraction.lat}
        lng={attraction.lng}
        address={attraction.addressEn}
      />

      <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
        <div className="mx-auto max-w-3xl">
          <Breadcrumbs
            locale={lk}
            id={`attraction-${slug}`}
            trail={[
              { name: lk === "ko" ? "홈" : "Home", url: `${SITE_URL}/${locale}` },
              {
                name: lk === "ko" ? "명소" : lk === "zh" ? "景点" : lk === "vi" ? "Điểm đến" : "Attractions",
                url: `${SITE_URL}/${locale}/attractions`,
              },
              { name: t.name, url },
            ]}
          />

          <header className="mb-6 animate-fade-up">
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-rose-400">
              {t.regionLabel} · {t.categoryLabel}
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
              {t.name}
            </h1>
            <p className="mt-3 text-base leading-relaxed text-[color:var(--color-text-secondary)]">
              {t.summary}
            </p>
          </header>

          <figure className="mb-6">
            <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-[color:var(--color-bg-elevated)]">
              <Image
                src={attraction.image.url}
                alt={attraction.image.alt}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
              />
            </div>
            <PhotoAttribution image={attraction.image} />
          </figure>

          <div className="mb-8">
            <ReactionBar slug={slug} locale={lk} />
          </div>

          <article className="space-y-4 text-[15px] leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {t.overview.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </article>

          <section className="mt-8 rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-5">
            <h2 className="mb-3 text-lg font-bold text-[color:var(--color-text-primary)]">
              {TIPS_HEADING[lk]}
            </h2>
            <ul className="space-y-2">
              {t.tips.map((tip, i) => (
                <li
                  key={i}
                  className="flex items-start gap-2 text-sm leading-relaxed text-[color:var(--color-text-secondary)]"
                >
                  <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          <div className="mt-6">
            <AttractionMap
              lat={attraction.lat}
              lng={attraction.lng}
              name={attraction.nameEn}
              address={lk === "ko" ? attraction.addressKo : attraction.addressEn}
              locale={lk}
            />
          </div>

          <CommentsSection slug={slug} locale={lk} />
        </div>
      </main>
    </>
  );
}
