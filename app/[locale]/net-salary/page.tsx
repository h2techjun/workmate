import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { NetSalaryForm } from "@/components/tools/labor/NetSalaryForm";
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
    ? "연봉 실수령액 계산기 — 4대보험·소득세 공제 후 월급"
    : "Korean Salary Take-Home Calculator — net pay after tax";
  const description = isKo
    ? "연봉을 넣으면 4대보험·소득세·지방세를 공제한 월 실수령액을 즉시 계산. 부양가족·자녀·비과세 반영. 2026 요율 기준 세전→세후 한눈에."
    : "Enter your annual salary to get monthly take-home pay after the 4 insurances, income tax, and local tax. Reflects dependents and non-taxable amounts. 2026 rates.";
  const keywords = isKo
    ? [
        "연봉 실수령액",
        "연봉 계산기",
        "실수령액 계산기",
        "월급 실수령액",
        "세후 월급",
        "4대보험 공제",
        "연봉 실수령",
        "2026 연봉",
      ]
    : [
        "korean salary calculator",
        "korea take home pay",
        "net salary korea",
        "korean income after tax",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/net-salary`,
      languages: buildLanguagesAlt("/net-salary"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/net-salary`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function NetSalaryPage({
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
            {isKo ? "연봉 실수령액 계산기" : "Korean Salary Take-Home Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "연봉만 넣으면 4대보험·소득세·지방세를 뺀 월 실수령액을 즉시 산출. 부양가족·자녀·비과세까지 반영해 세전→세후 한눈에."
              : "Enter your annual salary for instant monthly take-home pay after the 4 insurances and taxes — with dependents, children, and non-taxable amounts."}
          </p>
        </header>
        <NetSalaryForm locale={localeKey} />
        <ToolGuide toolKey="net-salary" locale={localeKey} />
      </div>
    </main>
  );
}
