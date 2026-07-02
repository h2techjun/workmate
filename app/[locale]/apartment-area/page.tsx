import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ApartmentAreaForm } from "@/components/tools/realestate/ApartmentAreaForm";
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
  const isKo = locale === "ko";
  const title = isKo
    ? "전용·공급면적 / 평당가 계산기 — 84㎡ 아파트는 실제 몇 평 거주?"
    : "Korean Apartment Area & Price per Pyeong — Exclusive vs Supply Area";
  const description = isKo
    ? "공급·전용면적(㎡)으로 전용률·평 환산·평당가(공급/전용 기준)를 즉시 계산. 외국인이 가장 헷갈리는 전용/공급면적 함정 해설. 국민평형 84㎡의 실거주 면적까지."
    : "Enter supply and exclusive area (㎡) to get the exclusive ratio, pyeong, and price per pyeong. Decodes the exclusive-vs-supply trap behind Korean apartment listings — why an \"84㎡\" flat isn't 84㎡ of living space.";
  const keywords = isKo
    ? [
        "전용면적 공급면적",
        "전용률 계산",
        "평당가 계산",
        "공급면적 전용면적 차이",
        "국민평형",
        "84제곱미터 실면적",
      ]
    : [
        "korea exclusive vs supply area",
        "price per pyeong korea",
        "korean apartment area explained",
        "exclusive ratio korea",
        "supply area korea",
        "korean apartment listing area",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/apartment-area`,
      languages: buildLanguagesAlt("/apartment-area"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/apartment-area`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function ApartmentAreaPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const localeKey = isKo ? "ko" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
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
            {isKo
              ? "전용·공급면적 / 평당가 계산기"
              : "Korea Apartment Area & Price-per-Pyeong"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "매물의 '84㎡'는 공급면적이고, 실제 거주 공간(전용면적)은 더 작습니다. 공급·전용면적을 넣으면 평 환산·전용률·평당가를 한눈에 보여줍니다."
              : "A listing's '84㎡' is the supply area — your actual living space (exclusive area) is smaller. Enter both to see pyeong, exclusive ratio, and price per pyeong at a glance."}
          </p>
        </header>
        <ApartmentAreaForm locale={localeKey} />
        <ToolGuide toolKey="apartment-area" locale={localeKey} />
      </div>
    </main>
  );
}
