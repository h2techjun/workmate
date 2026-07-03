import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { FreelancerTaxForm } from "@/components/tools/tax/FreelancerTaxForm";
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
    ? "프리랜서 3.3% 계산기 — 세전·세후 원천징수"
    : isVi
      ? "Máy tính thuế 3,3% cho freelancer tại Hàn Quốc — khấu trừ trước và sau thuế"
      : "Korean Freelancer 3.3% Tax Calculator";
  const description = isKo
    ? "프리랜서 사업소득 3.3%(소득세 3% + 지방세 0.3%) 원천징수를 즉시 계산. 세전→세후, 실수령→세전 역산, 연 환산까지. 5월 종합소득세 신고 정산 안내."
    : isVi
      ? "Tính ngay khoản khấu trừ tại nguồn 3,3% (thuế thu nhập 3% + thuế địa phương 0,3%) trên thu nhập kinh doanh của freelancer. Từ trước thuế sang sau thuế, tính ngược từ thực nhận sang trước thuế, và quy đổi theo năm. Kèm hướng dẫn quyết toán thuế thu nhập tổng hợp vào tháng 5."
      : "Calculate Korean freelancer 3.3% withholding (3% income + 0.3% local). Gross to net and net to gross, with annual figures and filing notes.";
  const keywords = isKo
    ? [
        "프리랜서 3.3",
        "3.3% 계산기",
        "프리랜서 세금",
        "원천징수 계산",
        "사업소득 3.3%",
        "프리랜서 실수령",
      ]
    : isVi
      ? [
          "thuế freelancer 3.3",
          "máy tính thuế 3,3%",
          "thuế freelancer Hàn Quốc",
          "tính khấu trừ tại nguồn",
          "thu nhập kinh doanh 3,3%",
          "thực nhận của freelancer",
        ]
      : [
        "korean freelancer tax",
        "korea 3.3 percent tax",
        "freelance withholding korea",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/freelancer-tax`,
      languages: buildLanguagesAlt("/freelancer-tax"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/freelancer-tax`,
      locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function FreelancerTaxPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const lang: "ko" | "en" | "vi" =
    locale === "ko" ? "ko" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
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
              ? "프리랜서 3.3% 계산기"
              : lang === "vi"
                ? "Máy tính thuế 3,3% cho freelancer"
                : "Korean Freelancer 3.3% Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {lang === "ko"
              ? "프리랜서 사업소득 3.3% 원천징수를 즉시 계산. 세전→세후, 실수령→세전 역산까지 양방향."
              : lang === "vi"
                ? "Tính ngay khoản khấu trừ tại nguồn 3,3% trên thu nhập kinh doanh của freelancer — hai chiều, từ trước thuế sang sau thuế và ngược lại."
                : "Instantly calculate the 3.3% withholding on Korean freelance income — both gross-to-net and net-to-gross."}
          </p>
        </header>
        <FreelancerTaxForm locale={lang} />
        <ToolGuide toolKey="freelancer-tax" locale={lang} />
      </div>
    </main>
  );
}
