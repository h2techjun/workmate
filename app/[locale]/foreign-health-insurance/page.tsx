import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { ForeignHealthInsuranceForm } from "@/components/tools/insurance/ForeignHealthInsuranceForm";
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
    ? "외국인 건강보험료 계산기 — 직장·지역가입자 NHIS 월 보험료"
    : isVi
      ? "Máy tính bảo hiểm y tế cho người nước ngoài — phí bảo hiểm NHIS hàng tháng (lao động·tự do)"
      : "Korea Health Insurance Calculator for Foreigners — NHIS Premium";
  const description = isKo
    ? "한국 거주 외국인의 NHIS 건강보험료를 직장가입자(보수월액)·지역가입자(평균보험료)별로 즉시 추정. 유학생 50% 경감, 장기요양보험 포함, 의무가입 6개월 안내. 2026 기준."
    : isVi
      ? "Ước tính ngay phí bảo hiểm y tế NHIS cho người nước ngoài sống tại Hàn Quốc — theo lương (lao động) hoặc phí bình quân (tự do). Giảm 50% cho du học sinh, bao gồm bảo hiểm chăm sóc dài hạn, quy định bắt buộc tham gia sau 6 tháng. Cơ sở 2026."
      : "Estimate your Korean NHIS health insurance premium as a foreigner — employee (salary-based) or self-employed (average premium). Student 50% reduction, long-term care, 6-month mandatory enrollment. 2026 basis.";
  const keywords = isKo
    ? [
        "외국인 건강보험료",
        "외국인 건강보험 계산",
        "유학생 건강보험료",
        "지역가입자 보험료",
        "NHIS 외국인",
        "외국인 의료보험",
      ]
    : isVi
      ? [
          "phí bảo hiểm y tế người nước ngoài",
          "tính bảo hiểm y tế người nước ngoài",
          "phí bảo hiểm y tế du học sinh",
          "phí bảo hiểm người tự do",
          "NHIS người nước ngoài",
          "bảo hiểm y tế người nước ngoài Hàn Quốc",
        ]
      : [
        "korea health insurance foreigner",
        "NHIS premium calculator",
        "korea health insurance cost",
        "foreigner health insurance korea",
        "korea student health insurance",
        "korea national health insurance foreigner",
        "NHIS premium foreigner",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/foreign-health-insurance`,
      languages: buildLanguagesAlt("/foreign-health-insurance"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/foreign-health-insurance`,
      locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function ForeignHealthInsurancePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const lang: "ko" | "en" | "vi" =
    locale === "ko" ? "ko" : locale === "vi" ? "vi" : "en";

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
              ? "외국인 건강보험료 계산기"
              : lang === "vi"
                ? "Máy tính bảo hiểm y tế cho người nước ngoài"
                : "Korea Health Insurance Calculator for Foreigners"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {lang === "ko"
              ? "한국에 6개월 이상 살면 NHIS 건강보험 의무가입입니다. 직장가입자는 보수월액 기준, 지역가입자는 외국인 평균보험료 기준으로 월 보험료를 추정합니다. (2026 기준)"
              : lang === "vi"
                ? "Nếu bạn sống tại Hàn Quốc từ 6 tháng trở lên, việc tham gia bảo hiểm y tế NHIS là bắt buộc. Ước tính phí bảo hiểm hàng tháng — theo lương nếu là lao động, theo phí bình quân nếu tự do. (Cơ sở 2026)"
                : "If you live in Korea for 6+ months, NHIS enrollment is mandatory. Estimate your monthly premium — salary-based if employed, average premium if self-employed. (2026 basis)"}
          </p>
        </header>
        <ForeignHealthInsuranceForm locale={lang} />
        <ToolGuide toolKey="foreign-health-insurance" locale={lang} />
      </div>
    </main>
  );
}
