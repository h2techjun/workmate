import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CapitalGainsForm } from "@/components/tools/tax/CapitalGainsForm";
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
    ? "부동산 양도소득세 계산기 — 장기보유공제 + 누진세"
    : "Korean Real Estate Capital Gains Tax Calculator";
  const description = isKo
    ? "부동산 양도차익으로 양도소득세를 즉시 계산. 장기보유특별공제(최대 80%) + 1세대1주택 우대 + 기본공제 250만 + 8구간 누진세 + 지방세. 단기 양도 중과까지."
    : "Calculate Korean real estate capital gains tax. Long-term holding deduction (up to 80%), single-house benefit, KRW 2.5M basic deduction, 8-bracket progressive tax.";
  const keywords = isKo
    ? [
        "양도소득세 계산기",
        "부동산 양도세",
        "양도세 계산",
        "장기보유특별공제",
        "1세대1주택 양도세",
        "부동산 세금 계산",
        "주택 양도소득세",
      ]
    : [
        "korean capital gains tax",
        "korea real estate tax calculator",
        "property capital gains korea",
        "korean property tax",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/capital-gains-tax`,
      languages: buildLanguagesAlt("/capital-gains-tax"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/capital-gains-tax`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function CapitalGainsTaxPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
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
            {isKo ? "부동산 양도소득세 계산기" : "Korean Capital Gains Tax Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "양도가·취득가·보유기간으로 양도소득세를 즉시 산출. 장기보유특별공제(최대 80%)·1세대1주택 우대·단기 중과까지 반영."
              : "Estimate Korean real estate capital gains tax from sale price, purchase price, and holding period — with long-term deduction and short-term penalty."}
          </p>
        </header>
        <CapitalGainsForm locale={localeKey} />
        <ToolGuide toolKey="capital-gains-tax" locale={localeKey} />
      </div>
    </main>
  );
}
