import type { Metadata } from "next";
import { GravelForm } from "@/components/tools/timber/GravelForm";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const isVi = locale === "vi";
  const title = isKo
    ? "자갈·골재 계산기 — 부피·무게·포대 수량"
    : isZh
      ? "砂石·骨料计算器 — 体积·重量·包数"
      : isVi
        ? "Máy tính đá dăm·sỏi — thể tích·trọng lượng·số bao"
        : "Gravel Calculator — volume, weight, bags";
  const description = isKo
    ? "면적과 두께로 자갈·모래·쇄석 부피(m³)와 무게(톤)를 즉시 계산합니다. 다짐 여유를 반영하고 25kg 포대·1톤 톤백 개수까지 환산해 조경·토목 현장 발주에 바로 활용하며, 무료로 회원가입 없이 이용 가능합니다."
    : isZh
      ? "根据面积与厚度即时计算砂石·沙子·碎石所需的体积(m³)与重量(吨)。反映压实余量，并换算成25kg包装袋·1吨吨袋数量，方便景观工程·土建施工现场发注备料、采购清单与预算估算参考，完全免费在线使用。"
      : isVi
        ? "Tính ngay thể tích (m³) và trọng lượng (tấn) đá dăm, cát, đá vụn từ diện tích và độ dày. Gồm tỷ lệ hao hụt do lu lèn + quy đổi số bao 25kg·bao jumbo 1 tấn. Dùng ngay cho đặt hàng cảnh quan·xây dựng."
        : "Calculate gravel, sand, and crushed stone volume (m³) and weight (tons) from area and depth, with compaction allowance and bag counts.";
  const keywords = isKo
    ? ["자갈 계산기", "골재 계산", "자갈 부피", "모래 무게", "쇄석 수량"]
    : isZh
      ? ["砂石计算器", "骨料计算", "砂石体积", "沙子重量", "碎石数量"]
      : isVi
        ? ["máy tính đá dăm", "cần bao nhiêu sỏi", "tính thể tích đá dăm", "trọng lượng cát", "số lượng đá vụn"]
        : ["gravel calculator", "how much gravel do i need", "aggregate calculator", "gravel weight calculator"];

  return {
    title, description, keywords,
    alternates: { canonical: `/${locale}/gravel-calc`, languages: buildLanguagesAlt("/gravel-calc") },
    openGraph: { title, description, type: "website", url: `${SITE_URL}/${locale}/gravel-calc`, locale: locale === "ko" ? "ko_KR" : locale === "zh" ? "zh_CN" : locale === "vi" ? "vi_VN" : "en_US" },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function GravelCalcPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const isVi = locale === "vi";
  const localeKey: "ko" | "en" | "zh" | "vi" = isKo ? "ko" : isZh ? "zh" : isVi ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/gravel-calc" locale={localeKey} id="gravel-calc" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "자갈·골재 계산기" : isZh ? "砂石·骨料计算器" : isVi ? "Máy tính đá dăm·sỏi" : "Gravel Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "면적과 두께만 넣으면 자갈·모래·쇄석 부피·무게·포대 수량을 즉시 산출. 다짐 여유까지 포함."
              : isZh
                ? "只需输入面积和厚度，即可立即算出砂石·沙子·碎石的体积·重量·包装数量，含压实余量。"
                : isVi
                  ? "Chỉ cần nhập diện tích và độ dày để có ngay thể tích·trọng lượng·số bao đá dăm, cát, hoặc đá vụn — gồm cả tỷ lệ hao hụt do lu lèn."
                  : "Enter area and depth to get gravel, sand, or crushed stone volume, weight, and bag counts — with compaction allowance."}
          </p>
        </header>
        <GravelForm locale={localeKey} />
        <ToolGuide toolKey="gravel-calc" locale={localeKey} />
      </div>
    </main>
  );
}
