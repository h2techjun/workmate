import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { WireSizeForm } from "@/components/tools/electric-calc/WireSizeForm";
import { CalculatorJsonLd } from "@/components/seo/StructuredData";
import type { Locale } from "@/i18n";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://worktool.kr";

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
      languages: {
        ko: "/ko/electric-calc/wire-size",
        en: "/en/electric-calc/wire-size",
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale === "ko" ? "ko_KR" : "en_US",
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

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <CalculatorJsonLd
        name={t("title")}
        description={t("subtitle")}
        url={`${SITE_URL}/${locale}/electric-calc/wire-size`}
        applicationCategory="BusinessApplication"
        howToSteps={[
          {
            name: locale === "ko" ? "전압·전류·거리 입력" : "Enter voltage, current, distance",
            text:
              locale === "ko"
                ? "송전단 전압, 부하 전류, 편도 거리, 상 종류를 입력합니다."
                : "Enter source voltage, load current, one-way distance, and phase type.",
          },
          {
            name: locale === "ko" ? "케이블 사양 선택" : "Pick cable spec",
            text:
              locale === "ko"
                ? "도체 재질(동·알루미늄)과 절연 종류(PVC·XLPE)를 선택합니다."
                : "Choose conductor material (Cu/Al) and insulation type (PVC/XLPE).",
          },
          {
            name: locale === "ko" ? "환경 보정 입력" : "Apply derating",
            text:
              locale === "ko"
                ? "주위 온도와 동시 사용 회로 수를 입력하면 KS 표 B.52.14·B.52.17 보정이 자동 적용됩니다."
                : "Ambient temperature and circuit grouping auto-apply KS Tables B.52.14 and B.52.17.",
          },
          {
            name: locale === "ko" ? "결과 확인" : "Review the result",
            text:
              locale === "ko"
                ? "권장 단면적과 7단계 계산 과정, 출처가 함께 표시됩니다."
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
      </div>
    </main>
  );
}
