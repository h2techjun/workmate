import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BrokerageFeeForm } from "@/components/tools/realestate/BrokerageFeeForm";
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
    ? "부동산 중개수수료(복비) 계산기 — 매매·전세·월세 법정 상한요율"
    : "Korea Real Estate Brokerage Fee Calculator — Sale, Jeonse & Wolse";
  const description = isKo
    ? "2021년 개정 공인중개사법 시행규칙 상한요율로 매매·전세·월세 중개수수료(복비)를 계산합니다. 구간별 요율·한도액·월세 환산·부가세 포함 여부를 한 번에 확인하세요."
    : "Calculate Korea's maximum real estate brokerage fee for sale, jeonse, and monthly rent using the 2021 revised rate table. Covers all price brackets, monthly-rent conversion, and optional VAT.";
  const keywords = isKo
    ? [
        "부동산 중개수수료",
        "복비 계산기",
        "중개보수 요율",
        "공인중개사법",
        "매매 수수료",
        "전세 수수료",
        "월세 수수료",
        "부동산 계산기",
      ]
    : [
        "korea brokerage fee calculator",
        "real estate agent commission korea",
        "jeonse brokerage fee",
        "wolse brokerage fee",
        "licensed real estate agent fee korea",
        "부동산 복비",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/brokerage-fee`,
      languages: buildLanguagesAlt("/brokerage-fee"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/brokerage-fee`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function BrokerageFeePage({
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
              ? "부동산 중개수수료(복비) 계산기"
              : "Korea Real Estate Brokerage Fee Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "2021년 10월 개정된 공인중개사법 시행규칙 [별표1] 상한요율 기준. 매매·전세·월세 모두 지원하며, 월세는 법정 환산식으로 거래금액을 자동 산출합니다. 위 금액은 법정 상한이며 실제는 협의로 더 낮출 수 있습니다."
              : "Based on Annex 1 of the Enforcement Rules of the Licensed Real Estate Agents Act (revised October 2021). Covers sale, jeonse, and monthly rent — monthly rent is converted to a transaction amount via the statutory formula. The result is the legal maximum; actual fees are negotiable."}
          </p>
        </header>
        <BrokerageFeeForm locale={localeKey} />
        <ToolGuide toolKey="brokerage-fee" locale={localeKey} />
      </div>
    </main>
  );
}
