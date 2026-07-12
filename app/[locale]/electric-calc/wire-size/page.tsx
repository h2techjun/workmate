import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { WireSizeForm } from "@/components/tools/electric-calc/WireSizeForm";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { CalculatorJsonLd } from "@/components/seo/StructuredData";
import { SITE_URL } from "@/lib/siteConfig";
import type { Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "wireSizeTool.meta" });

  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/electric-calc/wire-size`,
      languages: buildLanguagesAlt("/electric-calc/wire-size"),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale:
        locale === "ko"
          ? "ko_KR"
          : locale === "zh"
            ? "zh_CN"
            : locale === "vi"
              ? "vi_VN"
              : "en_US",
    },
  };
}

export default async function WireSizePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "wireSizeTool",
  });
  const localeKey: "ko" | "en" | "zh" | "vi" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <CalculatorJsonLd
        name={t("title")}
        description={t("subtitle")}
        url={`${SITE_URL}/${locale}/electric-calc/wire-size`}
        applicationCategory="BusinessApplication"
        howToSteps={[
          {
            name:
              locale === "ko"
                ? "전압·전류·거리 입력"
                : locale === "vi"
                  ? "Nhập điện áp, dòng điện, khoảng cách"
                  : "Enter voltage, current, distance",
            text:
              locale === "ko"
                ? "송전단 전압, 부하 전류, 편도 거리, 상 종류를 입력합니다."
                : locale === "vi"
                  ? "Nhập điện áp nguồn, dòng điện tải, khoảng cách một chiều và loại pha."
                  : "Enter source voltage, load current, one-way distance, and phase type.",
          },
          {
            name:
              locale === "ko"
                ? "케이블 사양 선택"
                : locale === "vi"
                  ? "Chọn thông số cáp"
                  : "Pick cable spec",
            text:
              locale === "ko"
                ? "도체 재질(동·알루미늄)과 절연 종류(PVC·XLPE)를 선택합니다."
                : locale === "vi"
                  ? "Chọn vật liệu dây dẫn (đồng/nhôm) và loại cách điện (PVC/XLPE)."
                  : "Choose conductor material (Cu/Al) and insulation type (PVC/XLPE).",
          },
          {
            name:
              locale === "ko"
                ? "환경 보정 입력"
                : locale === "vi"
                  ? "Nhập hiệu chỉnh môi trường"
                  : "Apply derating",
            text:
              locale === "ko"
                ? "주위 온도와 동시 사용 회로 수를 입력하면 KS 표 B.52.14·B.52.17 보정이 자동 적용됩니다."
                : locale === "vi"
                  ? "Nhập nhiệt độ môi trường xung quanh và số mạch dùng đồng thời để tự động áp dụng hiệu chỉnh theo Bảng KS B.52.14 và B.52.17."
                  : "Ambient temperature and circuit grouping auto-apply KS Tables B.52.14 and B.52.17.",
          },
          {
            name:
              locale === "ko"
                ? "결과 확인"
                : locale === "vi"
                  ? "Xem kết quả"
                  : "Review the result",
            text:
              locale === "ko"
                ? "권장 단면적과 7단계 계산 과정, 출처가 함께 표시됩니다."
                : locale === "vi"
                  ? "Tiết diện dây khuyến nghị, quy trình tính toán 7 bước và nguồn tham khảo sẽ được hiển thị."
                  : "The recommended cross-section, 7-step calculation, and source citations are shown.",
          },
        ]}
      />
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/electric-calc`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("breadcrumb.parent")}
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

        <WireSizeForm />
        <ToolGuide toolKey="electric-wire-size" locale={localeKey} />
      </div>
    </main>
  );
}
