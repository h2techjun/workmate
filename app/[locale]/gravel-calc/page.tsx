import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { GravelForm } from "@/components/tools/timber/GravelForm";
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
    ? "자갈·골재 계산기 — 부피·무게·포대 수량"
    : "Gravel Calculator — volume, weight, bags";
  const description = isKo
    ? "면적과 두께로 자갈·모래·쇄석 부피(m³)와 무게(톤)를 즉시 계산. 다짐 여유 + 25kg 포대·1톤 톤백 개수까지. 조경·토목 발주에 바로."
    : "Calculate gravel, sand, and crushed stone volume (m³) and weight (tons) from area and depth, with compaction allowance and bag counts.";
  const keywords = isKo
    ? ["자갈 계산기", "골재 계산", "자갈 부피", "모래 무게", "쇄석 수량"]
    : ["gravel calculator", "how much gravel do i need", "aggregate calculator", "gravel weight calculator"];

  return {
    title, description, keywords,
    alternates: { canonical: `/${locale}/gravel-calc`, languages: buildLanguagesAlt("/gravel-calc") },
    openGraph: { title, description, type: "website", url: `${SITE_URL}/${locale}/gravel-calc`, locale: locale === "ko" ? "ko_KR" : "en_US" },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function GravelCalcPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale !== "en";
  const localeKey = isKo ? "ko" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link href={`/${locale}/tools`} className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]">
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "툴 모음" : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "자갈·골재 계산기" : "Gravel Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "면적과 두께만 넣으면 자갈·모래·쇄석 부피·무게·포대 수량을 즉시 산출. 다짐 여유까지 포함."
              : "Enter area and depth to get gravel, sand, or crushed stone volume, weight, and bag counts — with compaction allowance."}
          </p>
        </header>
        <GravelForm locale={localeKey} />
        <ToolGuide toolKey="gravel-calc" locale={localeKey} />
      </div>
    </main>
  );
}
