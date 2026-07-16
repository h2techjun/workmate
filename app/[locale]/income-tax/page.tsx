import type { Metadata } from "next";
import { IncomeTaxForm } from "@/components/tools/tax/IncomeTaxForm";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
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
    ? "종합소득세 계산기 — 8구간 누진세 + 누진공제 + 지방세"
    : isVi
      ? "Máy tính thuế thu nhập tổng hợp Hàn Quốc — thuế suất lũy tiến 8 bậc + khấu trừ lũy tiến + thuế địa phương"
      : isZh
        ? "综合所得税计算器 — 8级累进税率 + 累进扣除 + 地方税"
        : "Korean Income Tax Calculator — 8 progressive brackets";
  const description = isKo
    ? "2026년 귀속 종합소득세를 8구간 누진세율로 즉시 계산합니다. 과세표준에서 산출세액, 결정세액, 지방소득세까지 단계별로 산출하고 근로소득세액공제도 반영합니다. 6%부터 45%까지 8개 구간별 세율을 그래프로 시각화해 한눈에 보여줍니다."
    : isVi
      ? "Tính ngay thuế thu nhập tổng hợp Hàn Quốc theo thuế suất lũy tiến 8 bậc năm 2026. Cơ sở tính thuế → thuế tính toán → thuế quyết định → thuế thu nhập địa phương + khấu trừ thuế cho người lao động. Trực quan hóa từng bậc 6%·15%·24%·35%·38%·40%·42%·45%."
      : isZh
        ? "即时计算2026纳税年度韩国综合所得税的8级累进税率。从计税基数到应纳税额、决定税额、地方所得税逐层计算，并反映工资所得税额抵免。以图表可视化呈现6%、15%、24%、35%、38%、40%、42%、45%各级税率区间，一目了然。"
        : "Korean comprehensive income tax with 2026 8-bracket progressive rates (6% to 45%), wage earner credit, local income tax breakdown.";
  const keywords = isKo
    ? [
        "종합소득세 계산",
        "소득세 계산기",
        "종합소득세율표",
        "누진세 계산",
        "누진공제",
        "근로소득세액공제",
        "지방소득세",
        "소득세 구간",
        "8구간 세율",
        "프리랜서 종합소득세",
        "사업자 종합소득세",
      ]
    : isVi
      ? [
          "tính thuế thu nhập tổng hợp",
          "máy tính thuế thu nhập Hàn Quốc",
          "biểu thuế thu nhập tổng hợp",
          "tính thuế suất lũy tiến",
          "khấu trừ lũy tiến",
          "khấu trừ thuế người lao động",
          "thuế thu nhập địa phương",
          "bậc thuế thu nhập",
          "thuế suất 8 bậc",
          "thuế thu nhập tổng hợp freelancer",
          "thuế thu nhập tổng hợp hộ kinh doanh",
        ]
      : isZh
        ? [
            "综合所得税计算",
            "所得税计算器",
            "综合所得税率表",
            "累进税计算",
            "累进扣除",
            "工资所得税额抵免",
            "地方所得税",
            "所得税级距",
            "8级税率",
            "自由职业者综合所得税",
            "个体户综合所得税",
          ]
        : [
        "Korean income tax calculator",
        "Korean tax brackets 2026",
        "progressive tax Korea",
        "wage earner credit Korea",
        "local income tax",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/income-tax`,
      languages: buildLanguagesAlt("/income-tax"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/income-tax`,
      locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : locale === "zh" ? "zh_CN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function IncomeTaxPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const lang: "ko" | "en" | "vi" | "zh" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/income-tax" locale={lang} id="income-tax" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo
              ? "종합소득세 계산기"
              : lang === "zh"
                ? "综合所得税计算器"
                : lang === "vi"
                  ? "Máy tính thuế thu nhập tổng hợp Hàn Quốc"
                  : "Korean Income Tax Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "2026 종합소득세 8구간 누진세를 즉시 산출. 과세표준 → 산출세액 → 지방세 + 근로소득세액공제까지."
              : lang === "zh"
                ? "即时计算2026年韩国综合所得税8级累进税率。从计税基数 → 应纳税额 → 地方所得税 + 工资所得税额抵免，一站算清。"
                : lang === "vi"
                  ? "Tính ngay thuế thu nhập tổng hợp Hàn Quốc theo thuế suất lũy tiến 8 bậc (2026). Từ cơ sở tính thuế → thuế tính toán → thuế địa phương + khấu trừ thuế cho người lao động."
                  : "Calculate Korean comprehensive income tax with 8 progressive brackets (2026). Includes local income tax and wage earner credit."}
          </p>
        </header>
        <IncomeTaxForm locale={lang} />
        <ToolGuide toolKey="income-tax" locale={lang} />
      </div>
    </main>
  );
}
