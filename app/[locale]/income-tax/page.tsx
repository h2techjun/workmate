import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { IncomeTaxForm } from "@/components/tools/tax/IncomeTaxForm";
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
    ? "종합소득세 계산기 — 8구간 누진세 + 누진공제 + 지방세"
    : "Korean Income Tax Calculator — 8 progressive brackets";
  const description = isKo
    ? "2026 종합소득세 8구간 누진세율 즉시 계산. 과세표준 → 산출세액 → 결정세액 → 지방소득세 + 근로소득세액공제. 6%·15%·24%·35%·38%·40%·42%·45% 구간별 시각화."
    : "Korean comprehensive income tax with 2026 8-bracket progressive rates (6% to 45%), wage earner credit, local income tax breakdown.";
  const keywords = isKo
    ? [
        "종합소득세 계산",
        "소득세 계산기",
        "종합소득세율표",
        "누진세 계산",
        "누진공제",
        "근로소득세액공제",
        "지방소득세",
        "소득세 구간",
        "8구간 세율",
        "프리랜서 종합소득세",
        "사업자 종합소득세",
      ]
    : [
        "Korean income tax calculator",
        "Korean tax brackets 2026",
        "progressive tax Korea",
        "wage earner credit Korea",
        "local income tax",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/income-tax`,
      languages: buildLanguagesAlt("/income-tax"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/income-tax`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function IncomeTaxPage({
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
            {isKo ? "종합소득세 계산기" : "Korean Income Tax Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "2026 종합소득세 8구간 누진세를 즉시 산출. 과세표준 → 산출세액 → 지방세 + 근로소득세액공제까지."
              : "Calculate Korean comprehensive income tax with 8 progressive brackets (2026). Includes local income tax and wage earner credit."}
          </p>
        </header>
        <IncomeTaxForm locale={localeKey} />
        <ToolGuide toolKey="income-tax" locale={localeKey} />
      </div>
    </main>
  );
}
