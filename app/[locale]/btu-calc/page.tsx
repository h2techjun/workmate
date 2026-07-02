import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { BtuForm } from "@/components/tools/utility/BtuForm";
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
  const isVi = locale === "vi";
  const title = isKo
    ? "에어컨 용량 계산기 — 방 면적별 BTU·평형"
    : isVi
      ? "Máy tính công suất điều hòa (BTU) theo diện tích phòng"
      : "BTU Calculator — AC sizing by room area";
  const description = isKo
    ? "방 면적으로 필요한 냉방 용량(BTU)과 한국 에어컨 평형을 즉시 계산. 천장 높이·일조·인원·주방 보정 + kW 환산. 에어컨 구매 전 적정 용량 확인."
    : isVi
      ? "Tính ngay công suất làm lạnh cần thiết (BTU) và loại điều hòa theo pyeong của Hàn Quốc từ diện tích phòng. Có điều chỉnh theo chiều cao trần, ánh nắng, số người, nhà bếp + quy đổi sang kW. Xác nhận công suất phù hợp trước khi mua điều hòa."
      : "Calculate the cooling capacity (BTU) and Korean AC 'pyeong type' from room area, with ceiling, sun, occupant, and kitchen adjustments plus kW conversion.";
  const keywords = isKo
    ? ["에어컨 용량 계산", "BTU 계산기", "에어컨 평형", "냉방 용량", "에어컨 BTU"]
    : isVi
      ? [
          "máy tính BTU điều hòa",
          "công suất điều hòa Hàn Quốc",
          "loại điều hòa theo pyeong",
          "tính công suất làm lạnh",
          "chọn điều hòa theo diện tích phòng",
        ]
      : ["btu calculator", "ac size calculator", "air conditioner sizing", "how many btu do i need"];

  return {
    title, description, keywords,
    alternates: { canonical: `/${locale}/btu-calc`, languages: buildLanguagesAlt("/btu-calc") },
    openGraph: { title, description, type: "website", url: `${SITE_URL}/${locale}/btu-calc`, locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : "en_US" },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function BtuCalcPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const localeKey: "ko" | "en" | "vi" = isKo ? "ko" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link href={`/${locale}/tools`} className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]">
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "툴 모음" : localeKey === "vi" ? "Tất cả công cụ" : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo
              ? "에어컨 용량 계산기 (BTU)"
              : localeKey === "vi"
                ? "Máy tính công suất điều hòa (BTU)"
                : "BTU / AC Sizing Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "방 면적만 넣으면 필요한 냉방 용량(BTU)과 한국 에어컨 평형을 즉시 산출. 천장·일조·인원·주방 보정까지."
              : localeKey === "vi"
                ? "Chỉ cần nhập diện tích phòng, công cụ sẽ tính ngay công suất làm lạnh cần thiết (BTU) và loại điều hòa theo pyeong của Hàn Quốc, kèm điều chỉnh theo trần nhà, ánh nắng, số người, nhà bếp."
                : "Enter room area for the cooling capacity (BTU) and Korean AC 'pyeong type', with ceiling, sun, occupant, and kitchen adjustments."}
          </p>
        </header>
        <BtuForm locale={localeKey} />
        <ToolGuide toolKey="btu-calc" locale={localeKey} />
      </div>
    </main>
  );
}
