import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TileForm } from "@/components/tools/timber/TileForm";
import { locales } from "@/i18n";
import { SITE_URL } from "@/lib/siteConfig";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale !== "en";
  const title = isKo
    ? "타일 매수 계산기 — 면적 + 타일 크기 → 매수 + 줄눈재 + 본드"
    : "Tile Calculator — area × tile size → count + grout + adhesive";
  const description = isKo
    ? "면적과 타일 크기(300/600/800mm 등 표준 프리셋)를 선택하면 타일 매수, 접착제(본드) kg, 줄눈 충전재 kg까지 즉시. 손실률 자동 반영."
    : "Pick tile size (300/600/800mm presets) and area — get tile count, adhesive kg, and grout kg instantly. Auto waste factor.";
  const keywords = isKo
    ? [
        "타일 계산",
        "타일 계산기",
        "타일 매수",
        "tile calculator",
        "300x300 타일",
        "600x600 타일",
        "800x800 타일",
        "타일 본드",
        "줄눈 충전재",
        "욕실 타일",
        "주방 타일",
        "바닥 타일",
        "벽 타일",
      ]
    : [
        "tile calculator",
        "tile count",
        "300x300 tile",
        "600x600 tile",
        "porcelain tile",
        "ceramic tile",
        "tile adhesive",
        "grout calculator",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/timber-calc/tile`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}/timber-calc/tile`]),
      ),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/timber-calc/tile`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function TilePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale !== "en";
  const localeKey = isKo ? "ko" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/timber-calc`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "목조 계산기" : "Timber Calculators"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "타일 매수 계산기" : "Tile Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "욕실·주방·바닥·벽 면적에 타일 크기를 입력하면 매수·본드·줄눈재까지 즉시. 표준 크기 6종 (100~800mm) 프리셋 + 줄눈 너비 조정."
              : "Bathroom, kitchen, floor, wall — enter area and tile size, get count, adhesive, and grout. 6 size presets (100~800mm) + grout width adjustment."}
          </p>
        </header>
        <TileForm locale={localeKey} />
      </div>
    </main>
  );
}
