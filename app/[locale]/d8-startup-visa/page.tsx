import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { D8EligibilityForm } from "@/components/tools/visa/D8EligibilityForm";
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
    ? "D-8 창업·투자 비자 자격 체크리스트 (외국인 가이드)"
    : "Korea D-8 Startup & Investment Visa Eligibility Checklist";
  const description = isKo
    ? "외국인이 한국에서 창업/투자해 D-8 비자(D-8-1 기업투자 · D-8-3 개인투자 · D-8-4 기술창업)를 받을 수 있는지 기본 자격을 체크. 최소 투자금 1억원·지분 10%, 학력·특허·OASIS 점수제까지 정확히 안내."
    : "Check whether you qualify for Korea's D-8 visa as a foreign founder/investor — D-8-1 corporate investment, D-8-3 individual investment, D-8-4 technology startup. Covers the ₩100M / 10% rule, degree & patent requirements, and the OASIS points system.";
  const keywords = isKo
    ? [
        "D-8 비자",
        "기술창업 비자",
        "D-8-4 OASIS",
        "외국인 창업 비자",
        "외국인 투자 비자",
        "한국 창업 비자 자격",
      ]
    : [
        "korea d-8 visa",
        "korea startup visa",
        "d-8-4 oasis visa",
        "korea business investment visa",
        "foreigner start company korea",
        "korea tech startup visa requirements",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/d8-startup-visa`,
      languages: buildLanguagesAlt("/d8-startup-visa"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/d8-startup-visa`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function D8StartupVisaPage({
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
              ? "D-8 창업·투자 비자 자격 체크리스트"
              : "Korea D-8 Startup & Investment Visa Eligibility"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "한국에서 창업하거나 투자해 D-8 비자를 받으려는 외국인을 위한 기본 자격 체크리스트입니다. 유형(D-8-1/3/4)을 고르고 요건을 확인하세요 — OASIS 점수는 비공개·변동이라 단정하지 않고 가이드로 안내합니다."
              : "A basic eligibility checklist for foreigners who want a D-8 visa by founding or investing in a company in Korea. Pick your type (D-8-1/3/4) and check the requirements — the OASIS score is unpublished and variable, so this tool guides rather than asserts a number."}
          </p>
        </header>
        <D8EligibilityForm locale={localeKey} />
        <ToolGuide toolKey="d8-startup-visa" locale={localeKey} />
      </div>
    </main>
  );
}
