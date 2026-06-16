import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CompoundForm } from "@/components/tools/finance/CompoundForm";
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
    ? "복리 계산기 — 기본·적립식 + 회차별·연차별 상세표"
    : "Compound Interest Calculator — lump-sum & recurring, with schedule";
  const description = isKo
    ? "기본(목돈 복리)과 적립식(매월 적립)을 한 화면에서. 회차별·연차별 상세표로 매 기간 수익·총액·수익률까지. 연복리/월복리·년/개월·년/월 이율 선택. 예금·적금·장기 투자 비교용."
    : "Lump-sum and recurring compound interest in one place, with a period-by-period and year-by-year schedule. Annual/monthly compounding, year/month units. For deposits, savings, and long-term investing.";
  const keywords = isKo
    ? [
        "복리 계산기",
        "복리 계산",
        "복리 공식",
        "예금 이자 계산",
        "적금 계산기",
        "투자 수익률",
        "CAGR 계산",
        "EAR 실효이율",
        "월복리",
        "연복리",
        "정기 적립 계산",
        "재무 계산기",
      ]
    : [
        "compound interest calculator",
        "compound calculator",
        "future value FV",
        "rate per period",
        "periodic contribution",
        "savings calculator",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/compound-calc`,
      languages: buildLanguagesAlt("/compound-calc"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/compound-calc`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function CompoundCalcPage({
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
            {isKo ? "복리 계산기" : "Compound Interest Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "기본(목돈 복리)과 적립식(매월 적립) 두 가지 모드. 회차별·연차별 상세표로 매 기간 수익·총액·수익률을 한눈에. 예금·적금·장기 투자 비교에."
              : "Two modes — lump-sum and recurring (monthly deposits). A period-by-period and year-by-year schedule shows the profit, balance, and return at every step."}
          </p>
        </header>
        <CompoundForm locale={localeKey} />
      </div>
    </main>
  );
}
