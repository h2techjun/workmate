import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CompoundForm } from "@/components/tools/finance/CompoundForm";
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
    ? "복리 계산기 — 원금·이율·기간 × 정기 적립 + 연도별 잔액표"
    : "Compound Interest Calculator — principal × rate × period + yearly table";
  const description = isKo
    ? "원금·연이율·기간·복리 빈도(월/분기/연)·정기 적립을 입력하면 만기 금액·총 이자·실효이율(EAR)·CAGR·연도별 잔액표까지 즉시. 예금·적금·투자 시나리오 비교용."
    : "Calculate future value, total interest, EAR, CAGR, and yearly balance table from principal, rate, period, compound frequency, and periodic contribution.";
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
        "CAGR calculator",
        "effective annual rate EAR",
        "periodic contribution",
        "savings calculator",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/compound-calc`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}/compound-calc`]),
      ),
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
              ? "원금·연이율·기간·복리 빈도와 (선택) 정기 적립을 입력하면 만기 금액·총 이자·실효이율(EAR)·CAGR·연도별 잔액표까지 즉시. 예금·적금·장기 투자 시나리오 비교에."
              : "Enter principal, rate, period, frequency, and optional contribution — get future value, total interest, EAR, CAGR, and yearly balance instantly."}
          </p>
        </header>
        <CompoundForm locale={localeKey} />
      </div>
    </main>
  );
}
