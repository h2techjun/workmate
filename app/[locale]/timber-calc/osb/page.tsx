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
    ? "OSB 매수 계산기 — 외벽·지붕 합판 자재 자동 산출"
    : isZh
      ? "OSB板张数计算器 — 外墙·屋顶板材自动核算"
      : "OSB Sheathing Calculator — wall and roof sheets";
  const description = isKo
    ? "외벽·지붕 면적과 손실률만 입력하면 OSB 매수와 못 개수까지 즉시. 4×8자 18mm OSB 표준. 목조주택·창고·증축 시공 필수."
    : isZh
      ? "只需输入外墙·屋顶面积与损耗率，即可立即算出OSB张数与钉子数量。以4×8英尺18mm OSB为标准。木结构住宅·仓库·扩建施工必备。"
      : "Calculate OSB sheets and nail count for walls and roofs. Standard 4×8ft 18mm OSB. Essential for timber framing.";
  const keywords = isKo
    ? [
        "OSB 계산",
        "OSB 매수",
        "OSB sheathing",
        "외벽 OSB",
        "지붕 OSB",
        "11mm OSB",
        "18mm OSB",
        "목조주택 자재",
        "목조 외벽 자재",
      ]
    : isZh
      ? [
          "OSB计算",
          "OSB张数",
          "OSB板计算器",
          "外墙OSB",
          "屋顶OSB",
          "11mm OSB",
          "18mm OSB",
          "木结构住宅材料",
          "木结构外墙材料",
        ]
      : ["OSB calculator", "OSB sheathing", "wall sheathing", "roof OSB", "timber framing"];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/timber-calc/osb`,
      languages: buildLanguagesAlt("/timber-calc/osb"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/timber-calc/osb`,
      locale: locale === "ko" ? "ko_KR" : isZh ? "zh_CN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function OsbPage({
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
            {isKo ? "OSB 매수 계산기" : isZh ? "OSB板张数计算器" : "OSB Sheathing Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "외벽·지붕 면적을 입력하면 OSB 매수와 못 개수까지. 4×8자 (1.2×2.4m) 18mm 표준 기준."
              : isZh
                ? "输入外墙·屋顶面积，即可算出OSB张数与钉子数量。以4×8英尺(1.2×2.4m) 18mm标准为基准。"
                : "Enter wall/roof area — get OSB sheet count and nails. Standard 4×8ft (1.2×2.4m) 18mm."}
          </p>
        </header>
        <MaterialQuantityForm lockedMaterial="osb18" />
        <ToolGuide
          toolKey="timber-osb"
          locale={isZh ? "zh" : locale !== "ko" ? "en" : "ko"}
        />
      </div>
    </main>
  );
}
