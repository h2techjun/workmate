import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PaintForm } from "@/components/tools/timber/PaintForm";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
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
    ? "페인트 양 계산기 — 벽 면적 × 도장 횟수 소요량"
    : "Paint Calculator — coverage, coats & liters needed";
  const description = isKo
    ? "벽 면적과 도장 횟수로 필요한 페인트 양(L)을 즉시 계산. 문·창 면적 자동 차감 + 도포율 + 손실 여유 + 4L/1L 통 개수 환산."
    : "Calculate paint needed (liters) from wall area and number of coats. Auto-deducts doors/windows, applies spread rate, waste, and converts to cans.";
  const keywords = isKo
    ? [
        "페인트 양 계산기",
        "페인트 소요량",
        "도장 면적 계산",
        "페인트 계산",
        "벽 페인트 양",
      ]
    : [
        "paint calculator",
        "how much paint do i need",
        "paint coverage calculator",
        "wall paint estimator",
        "paint quantity calculator",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/paint-calc`,
      languages: buildLanguagesAlt("/paint-calc"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/paint-calc`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function PaintCalcPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale !== "en";
  const localeKey = isKo ? "ko" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "툴 모음" : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "페인트 양 계산기" : "Paint Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "벽 면적과 도장 횟수만 넣으면 필요한 페인트 양(L)과 통 개수를 즉시 산출. 문·창 자동 차감 + 손실 여유 포함."
              : "Enter wall area and coats to get the liters of paint and number of cans you need. Auto-deducts doors and windows, includes waste."}
          </p>
        </header>
        <PaintForm locale={localeKey} />
        <ToolGuide toolKey="paint-calc" locale={localeKey} />
      </div>
    </main>
  );
}
