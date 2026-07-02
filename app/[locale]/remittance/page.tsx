import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { RemittanceForm } from "@/components/tools/korea/RemittanceForm";
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
    ? "해외송금 비용 계산기 — 환율 마진 + 수수료 실질 비용률 (규정 안내)"
    : "Send Money From Korea — Remittance Cost Calculator (FX Margin + Fee)";
  const description = isKo
    ? "해외송금의 진짜 비용은 수수료 + 숨은 환율 마진입니다. 송금액과 마진·수수료를 넣으면 총비용과 실질 비용률, 실수령 상당액을 계산합니다. 연간 한도·신고 의무·증빙 등 외국환거래 규정 안내 포함."
    : "The real cost of sending money from Korea is the fee PLUS the hidden FX margin. Enter your amount, margin, and fee to see total cost, effective rate, and what's delivered. Includes Korea's remittance rules — annual limits, reporting, and proof.";
  const keywords = isKo
    ? [
        "해외송금 수수료",
        "해외송금 비용",
        "환율 마진 스프레드",
        "외국인 송금 한도",
        "한국 해외송금 규정",
        "송금 실질 비용",
      ]
    : [
        "send money from korea",
        "korea remittance cost",
        "remittance fee calculator",
        "korea money transfer limit",
        "fx margin remittance",
        "transfer money out of korea",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/remittance`,
      languages: buildLanguagesAlt("/remittance"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/remittance`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function RemittancePage({
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
            {isKo ? "해외송금 비용 계산기" : "Send Money From Korea"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "송금 수수료만 보면 진짜 비용을 놓칩니다. 대부분의 비용은 고시환율과 실제 적용환율의 차이(환율 마진)에 숨어 있습니다. 방식을 고르고 실제 마진·수수료를 넣어 실질 비용률을 비교하세요. 특정 업체를 권유하지 않으며, 규정은 아래 가이드와 공식 안내로 확인합니다."
              : "Looking only at the transfer fee hides the real cost — most of it sits in the gap between the mid-market rate and the rate you actually get (the FX margin). Pick a method, enter the real margin and fee, and compare the effective cost rate. This doesn't recommend any provider; check the rules in the guide and official sources below."}
          </p>
        </header>
        <RemittanceForm locale={localeKey} />
        <ToolGuide toolKey="remittance" locale={localeKey} />
      </div>
    </main>
  );
}
