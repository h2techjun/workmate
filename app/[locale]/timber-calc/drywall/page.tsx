import type { Metadata } from "next";
import { ToolGuide } from "@/components/tools/ToolGuide";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MaterialQuantityForm } from "@/components/tools/timber/MaterialQuantityForm";
import { locales, type Locale } from "@/i18n";
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
  const isZh = locale === "zh";
  const title = isKo
    ? "석고보드 매수 계산기 — 벽·천장 면적 → 매수 + 피스 + 손실률"
    : isZh
      ? "石膏板张数计算器 — 墙面·天花板面积 → 张数 + 螺丝 + 损耗率"
      : "Drywall Sheet Calculator — area to sheets, fasteners, waste factor";
  const description = isKo
    ? "벽·천장 면적과 손실률만 입력하면 석고보드 매수와 피스(스크류) 개수까지 즉시 산출. KS F 3504 표준 9.5/12.5mm 두께 지원. 무료, 회원가입 없음."
    : isZh
      ? "只需输入墙面·天花板面积与损耗率，即可立即算出石膏板张数与螺丝数量。支持KS F 3504标准9.5/12.5mm厚度。免费，无需注册。"
      : "Calculate drywall sheets and fastener count from wall/ceiling area with waste factor. Supports KS F 3504 9.5/12.5mm thickness. Free, no signup.";
  const keywords = isKo
    ? [
        "석고보드 계산",
        "석고보드 매수",
        "드라이월 계산",
        "drywall calculator",
        "석고보드 피스",
        "석고보드 두께",
        "9.5mm 석고보드",
        "12.5mm 석고보드",
        "벽 자재 계산",
        "천장 자재",
      ]
    : isZh
      ? [
          "石膏板计算",
          "石膏板张数",
          "干式墙计算",
          "石膏板螺丝",
          "石膏板厚度",
          "9.5mm石膏板",
          "12.5mm石膏板",
          "墙体材料计算",
          "天花板材料",
        ]
      : ["drywall calculator", "gypsum board sheets", "drywall fasteners", "Korean drywall KS F 3504"];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/timber-calc/drywall`,
      languages: buildLanguagesAlt("/timber-calc/drywall"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/timber-calc/drywall`,
      locale: locale === "ko" ? "ko_KR" : isZh ? "zh_CN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function DrywallPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const localeKey = (isKo ? "ko" : isZh ? "zh" : "en") as Locale;

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${localeKey}/timber-calc`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "목조 계산기" : isZh ? "木结构住宅计算器" : "Timber Calculators"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "석고보드 매수 계산기" : isZh ? "石膏板张数计算器" : "Drywall Sheet Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "벽·천장 면적과 손실률을 입력하면 석고보드 매수, 피스 개수, 총 무게까지 즉시. 12.5mm KS F 3504 900×1800mm 표준 규격 기준."
              : isZh
                ? "输入墙面·天花板面积与损耗率，即可立即算出石膏板张数、螺丝数量、总重量。以12.5mm KS F 3504 900×1800mm标准规格为基准。"
                : "Enter wall/ceiling area and waste factor — get sheet count, fasteners, and total weight. Based on KS F 3504 12.5mm standard 900×1800mm."}
          </p>
        </header>
        <MaterialQuantityForm lockedMaterial="gypsum12" />
        <ToolGuide
          toolKey="timber-drywall"
          locale={isZh ? "zh" : locale !== "ko" ? "en" : "ko"}
        />
      </div>
    </main>
  );
}
