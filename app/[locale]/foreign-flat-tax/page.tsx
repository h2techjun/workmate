import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ForeignFlatTaxForm } from "@/components/tools/tax/ForeignFlatTaxForm";
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
    ? "외국인 단일세율(19%) vs 누진세 비교 계산기 — 어느 쪽이 유리?"
    : isVi
      ? "So sánh thuế suất đơn nhất (19%) và thuế lũy tiến cho người nước ngoài — Bên nào có lợi hơn?"
      : "Korea Foreign Flat Tax (19%) vs Progressive — Which Saves More?";
  const description = isKo
    ? "한국 거주 외국인 근로자의 19% 단일세율(지방세 포함 20.9%)과 일반 누진세를 연봉 기준으로 즉시 비교. 손익분기·실효세율·근로소득공제 반영. 2026 귀속 기준."
    : isVi
      ? "So sánh ngay thuế suất đơn nhất 19% (bao gồm thuế địa phương là 20.9%) và thuế lũy tiến thông thường dành cho người lao động nước ngoài tại Hàn Quốc, dựa trên mức lương năm. Phản ánh điểm hòa vốn, thuế suất thực tế, khấu trừ thu nhập từ lao động. Áp dụng năm thuế 2026."
      : "Compare Korea's 19% flat tax (20.9% incl. local) vs progressive income tax for foreign workers by salary. Breakeven, effective rate, deductions — 2026 basis.";
  const keywords = isKo
    ? [
        "외국인 단일세율",
        "외국인 소득세",
        "외국인 19% 세율",
        "외국인 연말정산",
        "단일세율 누진세 비교",
        "외국인 근로자 세금",
      ]
    : isVi
      ? [
          "thuế suất đơn nhất người nước ngoài",
          "thuế thu nhập người nước ngoài Hàn Quốc",
          "thuế suất 19% người nước ngoài",
          "quyết toán thuế cuối năm người nước ngoài",
          "so sánh thuế đơn nhất và thuế lũy tiến",
          "thuế người lao động nước ngoài",
        ]
      : [
          "korea flat tax",
          "korea 19 percent flat tax",
          "foreign worker tax korea",
          "korea flat tax vs progressive",
          "korea income tax foreigner",
          "korea year end tax settlement foreigner",
          "flat tax calculator korea",
        ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/foreign-flat-tax`,
      languages: buildLanguagesAlt("/foreign-flat-tax"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/foreign-flat-tax`,
      locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function ForeignFlatTaxPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const lang: "ko" | "en" | "vi" = locale === "ko" ? "ko" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {lang === "ko" ? "툴 모음" : lang === "vi" ? "Tất cả công cụ" : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {lang === "ko"
              ? "외국인 단일세율 vs 누진세 비교"
              : lang === "vi"
                ? "So sánh thuế suất đơn nhất và thuế lũy tiến cho người nước ngoài"
                : "Korea Foreign Flat Tax vs Progressive"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {lang === "ko"
              ? "한국에서 일하는 외국인은 19% 단일세율(지방세 포함 20.9%)과 일반 누진세 중 유리한 쪽을 고를 수 있습니다. 연봉을 넣으면 어느 쪽이 덜 내는지 바로 비교합니다. (2026 귀속 기준)"
              : lang === "vi"
                ? "Người nước ngoài làm việc tại Hàn Quốc có thể chọn giữa thuế suất đơn nhất 19% (bao gồm thuế địa phương là 20.9%) và thuế lũy tiến thông thường, tùy vào bên nào có lợi hơn. Nhập mức lương năm để so sánh ngay bên nào đóng ít thuế hơn. (Áp dụng năm thuế 2026)"
                : "Foreign workers in Korea can choose between a 19% flat tax (20.9% incl. local tax) and the regular progressive rates. Enter your salary to see which one costs less. (2026 tax year)"}
          </p>
        </header>
        <ForeignFlatTaxForm locale={lang} />
        <ToolGuide toolKey="foreign-flat-tax" locale={lang} />
      </div>
    </main>
  );
}
