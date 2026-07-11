import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ChevronLeft } from "lucide-react";
import { BizNumberForm } from "@/components/tools/business/BizNumberForm";
import { ToolGuide } from "@/components/tools/ToolGuide";
import type { Locale } from "@/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "bizNumberTool.meta" });
  const keywords =
    locale === "ko"
      ? [
          "사업자등록번호 검증",
          "사업자번호 진위확인",
          "체크섬 검산",
          "사업자번호 조회",
          "1-3-7 가중치",
          "가짜 사업자번호",
        ]
      : locale === "zh"
        ? [
            "事业者登记号验证",
            "事业者号码真伪确认",
            "校验位验算",
            "事业者号码查询",
            "1-3-7权重",
            "假事业者登记号",
          ]
        : locale === "vi"
          ? [
              "kiểm tra mã số đăng ký kinh doanh Hàn Quốc",
              "xác minh mã số doanh nghiệp Hàn Quốc",
              "thuật toán checksum 1-3-7",
              "tra cứu mã số kinh doanh Hàn Quốc",
              "trọng số 1-3-7 Hàn Quốc",
              "mã số kinh doanh giả",
            ]
          : [
              "korean business registration number checksum algorithm",
              "validate korean business number",
              "korean company number check",
              "1-3-7 checksum korea",
              "korean biznum validator",
              "verify korean business registration",
            ];
  return {
    title: t("title"),
    description: t("description"),
    keywords,
    alternates: {
      canonical: `/${locale}/biznum-check`,
      languages: {
        ko: "/ko/biznum-check",
        en: "/en/biznum-check",
        vi: "/vi/biznum-check",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export default async function BizNumberPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "bizNumberTool",
  });
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("breadcrumb.home")}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {t("subtitle")}
          </p>
        </header>
        <BizNumberForm />
        <ToolGuide
          toolKey="biznum-check"
          locale={locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en"}
        />
      </div>
    </main>
  );
}
