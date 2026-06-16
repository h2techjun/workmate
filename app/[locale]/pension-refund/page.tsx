import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PensionRefundForm } from "@/components/tools/insurance/PensionRefundForm";
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
    ? "국민연금 반환일시금 계산기 (출국 외국인 환급)"
    : "Korea National Pension Lump-Sum Refund Calculator (for Leaving Foreigners)";
  const description = isKo
    ? "한국에서 일한 외국인이 출국 시 돌려받는 국민연금 반환일시금을 추정. 기준소득월액·납부 개월로 원금(사용자 부담분 포함)+이자를 계산하고, 국적·E-9/H-2 비자별 수령 가능 여부와 세금까지 안내."
    : "Estimate the National Pension lump-sum refund foreigners can reclaim when leaving Korea. Calculates principal (employer's share included) + interest from your income base and months, and explains eligibility by nationality / E-9·H-2 visa, plus tax.";
  const keywords = isKo
    ? [
        "국민연금 반환일시금",
        "외국인 국민연금 환급",
        "출국 국민연금",
        "국민연금 돌려받기",
        "E-9 국민연금",
        "반환일시금 계산",
      ]
    : [
        "korea pension refund",
        "national pension lump sum refund",
        "foreigner pension refund korea",
        "leaving korea pension",
        "reclaim korean pension",
        "korea pension E-9 refund",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/pension-refund`,
      languages: buildLanguagesAlt("/pension-refund"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/pension-refund`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function PensionRefundPage({
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
            {isKo
              ? "국민연금 반환일시금 계산기"
              : "Korea National Pension Lump-Sum Refund"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "한국에서 일한 외국인이 영구 출국할 때 낸 국민연금을 돌려받는 '반환일시금'의 예상액을 계산합니다. 직장인은 회사 부담분까지 포함됩니다 — 단, 수령 가능 여부는 국적·비자에 따라 다르니 아래 가이드를 꼭 확인하세요."
              : "Estimate the National Pension 'lump-sum refund' that foreigners can reclaim when they permanently leave Korea — for workplace subscribers, the employer's share is included too. Whether you can claim it depends on your nationality and visa, so read the guide below."}
          </p>
        </header>
        <PensionRefundForm locale={localeKey} />
        <ToolGuide toolKey="pension-refund" locale={localeKey} />
      </div>
    </main>
  );
}
