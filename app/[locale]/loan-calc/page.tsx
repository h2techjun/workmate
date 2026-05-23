import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { LoanForm } from "@/components/tools/finance/LoanForm";
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
    ? "대출 이자 계산기 — 원리금균등·원금균등·만기일시 + 상환표"
    : "Loan Calculator — equal payment/principal/balloon + schedule";
  const description = isKo
    ? "주택담보·신용·전세자금 대출 3가지 상환 방식 통합 계산. 원리금균등 매월 같은 금액, 원금균등 초반 ↑ 후반 ↓, 만기일시 이자만 매월 + 회차별 상환표."
    : "Korean loan calculator with 3 repayment types: equal payment, equal principal, balloon. Monthly schedule included.";
  const keywords = isKo
    ? [
        "대출 이자 계산",
        "대출 계산기",
        "주택담보대출 계산",
        "원리금균등 계산",
        "원금균등 계산",
        "만기일시 대출",
        "신용대출 이자",
        "전세자금대출",
        "대출 상환 계획",
        "월 이자 계산",
        "월 상환액",
        "이자 총액",
      ]
    : [
        "loan calculator",
        "Korean mortgage calculator",
        "equal payment loan",
        "equal principal loan",
        "balloon loan",
        "monthly payment",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/loan-calc`,
      languages: buildLanguagesAlt("/loan-calc"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/loan-calc`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function LoanCalcPage({
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
            {isKo ? "대출 이자 계산기" : "Loan Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "주담대·신용대출·전세자금 — 원리금균등/원금균등/만기일시 3가지 상환 방식 한 번에 비교. 회차별 원금·이자·잔금 상환표까지."
              : "Compare 3 Korean loan repayment types in one place. Monthly schedule with principal, interest, and balance breakdown."}
          </p>
        </header>
        <LoanForm locale={localeKey} />
      </div>
    </main>
  );
}
