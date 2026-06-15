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
    ? "복리 계산기 — 회당 이율 × 복리 횟수로 만기 금액·이자 즉시"
    : "Compound Interest Calculator — rate per period × number of periods";
  const description = isKo
    ? "원금·회당 이율·복리 횟수·정기 적립을 입력하면 만기 금액·누적 이자·총 수익률을 즉시 계산. 월복리는 회당 이율(연이율÷12)과 횟수로 입력. 예금·적금·투자 시나리오 비교용."
    : "Calculate future value, total interest, and total return from principal, rate per period, number of periods, and periodic contribution.";
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
              ? "원금·회당 이율·복리 횟수와 (선택) 정기 적립을 입력하면 만기 금액·누적 이자·총 수익률을 즉시. 예금·적금·장기 투자 시나리오 비교에."
              : "Enter principal, rate per period, number of periods, and optional contribution — get future value, total interest, and total return instantly."}
          </p>
        </header>
        <CompoundForm locale={localeKey} />
      </div>
    </main>
  );
}
