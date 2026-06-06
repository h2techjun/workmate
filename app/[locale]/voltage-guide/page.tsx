import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { VoltageForm } from "@/components/tools/korean/VoltageForm";
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
    ? "한국 전압·플러그 가이드 — 변압기·돼지코 필요?"
    : "Korea Voltage & Plug Guide — do you need a converter?";
  const description = isKo
    ? "한국 220V·60Hz·C/F 플러그. 기기 전압과 출신국 플러그로 변압기·어댑터(돼지코) 필요 여부를 즉시 판정. 여행·이주 전 필수 점검."
    : "Korea uses 220V/60Hz, plug type C/F. Check whether your device needs a transformer or plug adapter from its voltage and your plug type.";
  const keywords = isKo
    ? ["한국 전압", "한국 플러그", "돼지코", "변압기 필요", "220V 110V"]
    : [
        "korea voltage converter",
        "korea plug type",
        "do i need adapter korea",
        "korea 220v",
      ];
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/voltage-guide`,
      languages: buildLanguagesAlt("/voltage-guide"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/voltage-guide`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function VoltageGuidePage({
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
            {isKo ? "한국 전압·플러그 가이드" : "Korea Voltage & Plug Guide"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "기기 전압과 플러그만 고르면 한국(220V·C/F)에서 변압기·돼지코가 필요한지 즉시 알려줍니다."
              : "Pick your device voltage and plug to instantly see if you need a transformer or adapter in Korea (220V, C/F)."}
          </p>
        </header>
        <VoltageForm locale={localeKey} />
        <ToolGuide toolKey="voltage-guide" locale={localeKey} />
      </div>
    </main>
  );
}
