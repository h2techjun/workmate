import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CarAnnualTaxForm } from "@/components/tools/tax/CarAnnualTaxForm";
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
    ? "자동차세 계산기 — 배기량·차령별 연간 자동차세"
    : "Korean Annual Car Tax Calculator";
  const description = isKo
    ? "배기량과 차령으로 연간 자동차세를 즉시 계산. cc당 단가 + 지방교육세 30% + 차령 경감(최대 50%) + 전기차 정액. 6·12월 반기 납부액도 표시."
    : "Calculate Korean annual car tax from engine displacement and vehicle age, with 30% education tax and age reduction up to 50%.";
  const keywords = isKo
    ? ["자동차세", "자동차세 계산기", "배기량 자동차세", "차령 경감", "전기차 자동차세", "연간 자동차세"]
    : ["korean car tax", "korea annual vehicle tax", "car tax by displacement korea"];

  return {
    title, description, keywords,
    alternates: { canonical: `/${locale}/car-tax`, languages: buildLanguagesAlt("/car-tax") },
    openGraph: { title, description, type: "website", url: `${SITE_URL}/${locale}/car-tax`, locale: locale === "ko" ? "ko_KR" : "en_US" },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function CarTaxPage({
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
            {isKo ? "자동차세 계산기" : "Korean Annual Car Tax"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "배기량·차령으로 연간 자동차세를 즉시 산출. 지방교육세·차령 경감·전기차 정액까지 반영."
              : "Estimate Korean annual car tax from displacement and age, including education tax and age reduction."}
          </p>
        </header>
        <CarAnnualTaxForm locale={localeKey} />
        <ToolGuide toolKey="car-tax" locale={localeKey} />
      </div>
    </main>
  );
}
