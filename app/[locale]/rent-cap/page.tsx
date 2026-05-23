import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { RentCapForm } from "@/components/tools/realestate/RentCapForm";
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
    ? "임대료 5% 인상한도 검증 — 전월세 갱신 보증금/월세 환산"
    : "Korean Rent Cap Calculator — 5% renewal limit verification";
  const description = isKo
    ? "주택임대차보호법 시행령 8조 5% 인상 한도 즉시 검증. 보증금↔월세 환산보증금 + 갱신요구권 행사 시 한도 초과 여부 + 보증금만/월세만 인상 추천."
    : "Verify Korean Housing Lease Act 5% renewal cap. Deposit-to-monthly conversion + breakdown of how much rent or deposit can increase.";
  const keywords = isKo
    ? [
        "임대료 5%",
        "전월세 인상한도",
        "보증금 인상한도",
        "갱신요구권 5%",
        "주임법 5%",
        "임대료 인상 계산",
        "월세 5% 인상",
        "환산보증금",
        "전월세 전환율",
        "주택임대차보호법 5%",
      ]
    : [
        "Korean rent cap",
        "Housing Lease Act 5%",
        "Korean deposit increase limit",
        "monthly rent increase",
        "Korean rental renewal",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/rent-cap`,
      languages: buildLanguagesAlt("/rent-cap"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/rent-cap`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function RentCapPage({
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
            {isKo ? "임대료 5% 인상한도 검증" : "Korean Rent Cap Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "주임법 시행령 8조 갱신요구권 5% 인상 한도를 즉시 검증. 보증금·월세 환산 + 한도 내 인상 추천까지."
              : "Verify Korean Housing Lease Act 5% rent cap on renewal. Deposit-monthly conversion + within-cap recommendation."}
          </p>
        </header>
        <RentCapForm locale={localeKey} />
        <ToolGuide toolKey="rent-cap" locale={localeKey} />
      </div>
    </main>
  );
}
