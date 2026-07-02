import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CostOfLivingForm } from "@/components/tools/korea/CostOfLivingForm";
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
    ? "한국 생활비 계산기 — 지역·가구별 월 예산 추정 (서울·경기·지방)"
    : "Cost of Living in Korea Calculator — Monthly Budget by City & Household";
  const description = isKo
    ? "지역(서울 도심·외곽·경기·광역시·지방)과 가구(1인·커플·가족)를 고르면 월세·공과금·식비·교통·통신·건강보험·기타 항목이 채워지고, 각 항목을 직접 수정해 나만의 월 생활비를 추정합니다. 연간·1인당 환산까지."
    : "Pick a region (central/outer Seoul, Gyeonggi, metro, smaller city) and household (single, couple, family) to prefill rent, utilities, food, transport, mobile, health insurance and more — then edit each line to build your own monthly budget, with annual and per-person totals.";
  const keywords = isKo
    ? [
        "한국 생활비",
        "서울 생활비",
        "한국 월 생활비 계산",
        "외국인 한국 생활비",
        "서울 1인 생활비",
        "한국 월세 생활비",
      ]
    : [
        "cost of living in korea",
        "seoul cost of living",
        "korea monthly budget",
        "living in korea expenses",
        "cost of living seoul calculator",
        "korea budget foreigner",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/cost-of-living`,
      languages: buildLanguagesAlt("/cost-of-living"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/cost-of-living`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function CostOfLivingPage({
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
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "툴 모음" : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "한국 생활비 계산기" : "Cost of Living in Korea"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "지역과 가구를 고르면 대표적인 월 항목이 채워집니다. 각 값은 추정 중앙값일 뿐이니, 본인 상황에 맞게 수정하면 합계가 곧 나만의 예산이 됩니다. '한국 생활비는 얼마'라는 단정이 아니라, 스스로 조립하는 예산 도구입니다."
              : "Pick a region and household to prefill typical monthly lines. Every value is just a mid-range estimate — edit them to your situation and the total becomes your own budget. This isn't a claim about what Korea 'costs'; it's a budget you assemble yourself."}
          </p>
        </header>
        <CostOfLivingForm locale={localeKey} />
        <ToolGuide toolKey="cost-of-living" locale={localeKey} />
      </div>
    </main>
  );
}
