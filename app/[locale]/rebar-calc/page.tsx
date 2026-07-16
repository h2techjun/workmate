import type { Metadata } from "next";
import { RebarForm } from "@/components/tools/timber/RebarForm";
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
    ? "철근 무게·수량 계산기 — 규격별 단위중량"
    : isZh
      ? "钢筋重量·数量计算器 — 各规格单位重量"
      : isVi
        ? "Máy tính khối lượng·số lượng thép — theo quy cách"
        : "Rebar Weight Calculator — size unit weight";
  const description = isKo
    ? "철근 규격(D10~D32)과 1본 길이·본수만 입력하면 총길이, 총중량(정미), 할증 적용 발주 중량과 톤(t) 환산을 즉시 계산합니다. KS D 3504 이형철근 단위중량 표를 그대로 적용하며, 회원가입 없이 무료로 이용할 수 있습니다."
    : isZh
      ? "只需输入钢筋规格(D10~D32)、单根长度和根数，即可立即算出总长度、净重量、加损耗后的发注重量及换算吨数(t)。依据韩国 KS D 3504 异形钢筋单位重量表计算，完全免费在线使用，无需注册。"
      : isVi
        ? "Chỉ cần nhập quy cách thép (D10~D32), chiều dài mỗi thanh và số thanh để tính ngay tổng chiều dài, khối lượng thực, khối lượng đặt hàng đã cộng hao hụt và quy đổi ra tấn (t). Áp dụng bảng khối lượng đơn vị thép gân KS D 3504 Hàn Quốc, miễn phí không cần đăng ký."
        : "Enter rebar size (D10–D32), length per bar, and bar count to instantly get total length, net weight, order weight with waste margin, and the ton (t) conversion. Based on the KS D 3504 deformed rebar unit weight table — free, no signup.";
  const keywords = isKo
    ? ["철근 무게 계산", "철근 수량 계산기", "이형철근 단위중량", "D13 철근 무게", "철근 톤수 계산", "KS D 3504"]
    : isZh
      ? ["钢筋重量计算", "钢筋数量计算器", "异形钢筋单位重量", "钢筋吨数计算", "KS D 3504"]
      : isVi
        ? ["tính khối lượng thép", "máy tính số lượng thép", "khối lượng thép gân", "quy đổi tấn thép", "KS D 3504"]
        : ["rebar weight calculator", "rebar unit weight", "how much does rebar weigh", "D13 rebar weight", "KS D 3504"];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/${locale}/rebar-calc`, languages: buildLanguagesAlt("/rebar-calc") },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/rebar-calc`,
      locale: locale === "ko" ? "ko_KR" : locale === "zh" ? "zh_CN" : locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function RebarCalcPage({
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
        <Breadcrumbs path="/rebar-calc" locale={localeKey} id="rebar-calc" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "철근 무게·수량 계산기" : isZh ? "钢筋重量·数量计算器" : isVi ? "Máy tính khối lượng·số lượng thép" : "Rebar Weight Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "규격·길이·본수만 넣으면 총길이·총중량과 할증 적용 발주 중량, 톤(t) 환산을 즉시 산출. KS D 3504 단위중량 기준."
              : isZh
                ? "只需输入规格·长度·根数，即可立即算出总长度·总重量与加损耗后的发注重量、换算吨数(t)。依据 KS D 3504 单位重量标准。"
                : isVi
                  ? "Chỉ cần nhập quy cách·chiều dài·số thanh để có ngay tổng chiều dài·tổng khối lượng, khối lượng đặt hàng đã cộng hao hụt và quy đổi tấn (t). Theo khối lượng đơn vị KS D 3504."
                  : "Enter size, length, and bar count to get total length, net weight, order weight with waste, and ton conversion — based on KS D 3504 unit weight."}
          </p>
        </header>
        <RebarForm locale={localeKey} />
        <ToolGuide toolKey="rebar-calc" locale={localeKey} />
      </div>
    </main>
  );
}
