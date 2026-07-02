import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ElectricBillForm } from "@/components/tools/utility/ElectricBillForm";
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
    ? "전기요금 계산기 — 주택용 누진제 + 여름철 + 부가세"
    : "Korean Electricity Bill Calculator — progressive tariff";
  const description = isKo
    ? "월 사용량(kWh)으로 전기요금을 즉시 계산. 주택용 저압·고압 누진제 3단계 + 여름철 완화 + 기후환경요금 + 연료비조정 + 부가세 + 전력기금까지 한전 2024 기준."
    : "Calculate your Korean residential electricity bill from monthly kWh. KEPCO progressive tariff (3 tiers), summer relaxation, climate/fuel charges, VAT.";
  const keywords = isKo
    ? [
        "전기요금 계산기",
        "전기세 계산",
        "누진세 전기요금",
        "주택용 전기요금",
        "여름 전기요금",
        "한전 요금",
        "전기요금 누진제",
        "kWh 요금",
      ]
    : [
        "korean electricity bill calculator",
        "KEPCO bill",
        "korea electricity tariff",
        "progressive electricity rate korea",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/electric-bill`,
      languages: buildLanguagesAlt("/electric-bill"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/electric-bill`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function ElectricBillPage({
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
            {isKo ? "전기요금 계산기" : "Korean Electricity Bill Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "월 사용량만 넣으면 누진제 3단계 + 여름철 완화 + 부가세·기금까지 청구금액을 즉시 산출. 한전 주택용 2024 기준."
              : "Enter monthly kWh to get the full bill: 3-tier progressive tariff, summer relaxation, VAT and power fund. KEPCO residential 2024 rates."}
          </p>
        </header>
        <ElectricBillForm locale={localeKey} />
        <ToolGuide toolKey="electric-bill" locale={localeKey} />
      </div>
    </main>
  );
}
