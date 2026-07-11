import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { CapitalGainsForm } from "@/components/tools/tax/CapitalGainsForm";
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
  const isZh = locale === "zh";
  const title = isKo
    ? "부동산 양도소득세 계산기 — 장기보유공제 + 누진세"
    : isVi
      ? "Máy tính thuế chuyển nhượng bất động sản Hàn Quốc — khấu trừ sở hữu dài hạn + thuế suất lũy tiến"
      : isZh
        ? "房地产转让所得税计算器 — 长期持有扣除 + 累进税"
        : "Korean Real Estate Capital Gains Tax Calculator";
  const description = isKo
    ? "부동산 양도차익으로 양도소득세를 즉시 계산. 장기보유특별공제(최대 80%) + 1세대1주택 우대 + 기본공제 250만 + 8구간 누진세 + 지방세. 단기 양도 중과까지."
    : isVi
      ? "Tính ngay thuế chuyển nhượng từ lãi chuyển nhượng bất động sản Hàn Quốc. Khấu trừ đặc biệt sở hữu dài hạn (tối đa 80%) + ưu đãi hộ 1 nhà 1 căn + khấu trừ cơ bản 2,5 triệu won + thuế suất lũy tiến 8 bậc + thuế địa phương. Bao gồm cả mức thuế nặng cho chuyển nhượng ngắn hạn."
      : isZh
        ? "根据房地产转让差价即时计算转让所得税。长期持有特别扣除(最高80%) + 一世帯一住宅优惠 + 基本扣除250万韩元 + 8级累进税 + 地方税。涵盖短期转让重课税率。"
        : "Calculate Korean real estate capital gains tax. Long-term holding deduction (up to 80%), single-house benefit, KRW 2.5M basic deduction, 8-bracket progressive tax.";
  const keywords = isKo
    ? [
        "양도소득세 계산기",
        "부동산 양도세",
        "양도세 계산",
        "장기보유특별공제",
        "1세대1주택 양도세",
        "부동산 세금 계산",
        "주택 양도소득세",
      ]
    : isVi
      ? [
          "tính thuế chuyển nhượng",
          "thuế chuyển nhượng bất động sản",
          "tính thuế chuyển nhượng",
          "khấu trừ đặc biệt sở hữu dài hạn",
          "thuế chuyển nhượng hộ 1 nhà 1 căn",
          "tính thuế bất động sản Hàn Quốc",
          "thuế chuyển nhượng nhà ở",
        ]
      : isZh
        ? [
            "转让所得税计算器",
            "房地产转让税",
            "转让税计算",
            "长期持有特别扣除",
            "一世帯一住宅转让税",
            "房地产税金计算",
            "住宅转让所得税",
          ]
        : [
        "korean capital gains tax",
        "korea real estate tax calculator",
        "property capital gains korea",
        "korean property tax",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/capital-gains-tax`,
      languages: buildLanguagesAlt("/capital-gains-tax"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/capital-gains-tax`,
      locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : locale === "zh" ? "zh_CN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function CapitalGainsTaxPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const lang: "ko" | "en" | "vi" | "zh" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo
              ? "툴 모음"
              : lang === "zh"
                ? "所有工具"
                : lang === "vi"
                  ? "Tất cả công cụ"
                  : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo
              ? "부동산 양도소득세 계산기"
              : lang === "zh"
                ? "房地产转让所得税计算器"
                : lang === "vi"
                  ? "Máy tính thuế chuyển nhượng bất động sản Hàn Quốc"
                  : "Korean Capital Gains Tax Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "양도가·취득가·보유기간으로 양도소득세를 즉시 산출. 장기보유특별공제(최대 80%)·1세대1주택 우대·단기 중과까지 반영."
              : lang === "zh"
                ? "根据转让价、取得价、持有期限即时计算转让所得税。涵盖长期持有特别扣除(最高80%)、一世帯一住宅优惠、短期转让重课税率。"
                : lang === "vi"
                  ? "Tính ngay thuế chuyển nhượng từ giá bán, giá mua và thời gian sở hữu. Áp dụng khấu trừ đặc biệt sở hữu dài hạn (tối đa 80%), ưu đãi hộ 1 nhà 1 căn và mức thuế nặng cho chuyển nhượng ngắn hạn."
                  : "Estimate Korean real estate capital gains tax from sale price, purchase price, and holding period — with long-term deduction and short-term penalty."}
          </p>
        </header>
        <CapitalGainsForm locale={lang} />
        <ToolGuide toolKey="capital-gains-tax" locale={lang} />
      </div>
    </main>
  );
}
