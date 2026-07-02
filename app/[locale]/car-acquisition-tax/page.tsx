import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CarAcquisitionForm } from "@/components/tools/tax/CarAcquisitionForm";
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
    ? "자동차 취득세 계산기 — 승용·경차·친환경차 7%·4%"
    : "Korean Car Acquisition Tax Calculator";
  const description = isKo
    ? "차량 취득가액으로 취득세를 즉시 계산. 승용 7%·경차 4%·승합화물 5% + 친환경차 최대 140만 감면. 신차·중고차 등록 전 세금 확인."
    : "Calculate Korean car acquisition tax: passenger 7%, light 4%, van/cargo 5%, with eco-car discount up to KRW 1.4M.";
  const keywords = isKo
    ? ["자동차 취득세", "자동차 취등록세", "취득세 계산기", "차량 취득세", "중고차 취득세", "전기차 취득세"]
    : ["korean car acquisition tax", "korea vehicle registration tax", "car tax korea"];

  return {
    title, description, keywords,
    alternates: { canonical: `/${locale}/car-acquisition-tax`, languages: buildLanguagesAlt("/car-acquisition-tax") },
    openGraph: { title, description, type: "website", url: `${SITE_URL}/${locale}/car-acquisition-tax`, locale: locale === "ko" ? "ko_KR" : "en_US" },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function CarAcquisitionTaxPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
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
            {isKo ? "자동차 취득세 계산기" : "Korean Car Acquisition Tax"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "차량 취득가액으로 취득세를 즉시 산출. 승용 7%·경차 4%·친환경차 감면까지 반영해 등록 전 세금 확인."
              : "Estimate Korean car acquisition tax from the purchase price — passenger 7%, light 4%, eco-car discount."}
          </p>
        </header>
        <CarAcquisitionForm locale={localeKey} />
        <ToolGuide toolKey="car-acquisition-tax" locale={localeKey} />
      </div>
    </main>
  );
}
