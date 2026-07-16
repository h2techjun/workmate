import type { Metadata } from "next";
import { BrickForm } from "@/components/tools/timber/BrickForm";
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
    ? "벽돌·블록 수량 계산기 — 조적 자재·모르타르"
    : isZh
      ? "砖块·砌块数量计算器 — 砌筑材料·砂浆"
      : isVi
        ? "Máy tính số lượng gạch·block — vật liệu xây·vữa"
        : "Brick & Block Calculator — masonry & mortar";
  const description = isKo
    ? "벽 면적만 넣으면 표준형·시멘트 벽돌, 콘크리트 블록의 발주 수량과 줄눈 모르타르(시멘트·모래)량을 즉시 산출합니다. 건설공사 표준품셈 정미량에 할증을 더해 0.5B~2.0B 쌓기별로 계산하며, 회원가입 없이 무료로 이용할 수 있습니다."
    : isZh
      ? "只需输入墙面面积，即可立即算出标准砖·水泥砖·混凝土砌块的发注数量与灰缝砂浆(水泥·沙子)用量。依据韩国建设工程标准估算净数量并加上损耗率，按0.5B~2.0B砌筑厚度分别计算，完全免费在线使用，无需注册。"
      : isVi
        ? "Chỉ cần nhập diện tích tường để tính ngay số lượng đặt hàng gạch tiêu chuẩn, gạch xi măng, block bê tông và lượng vữa mạch (xi măng·cát). Dựa trên định mức xây dựng Hàn Quốc cộng hao hụt, tính riêng theo độ dày 0.5B~2.0B, miễn phí không cần đăng ký."
        : "Enter wall area to instantly get order counts for standard bricks, cement bricks, or concrete blocks plus joint mortar (cement and sand). Based on Korean standard estimation with a waste margin, calculated per 0.5B–2.0B bond — free, no signup.";
  const keywords = isKo
    ? ["벽돌 수량 계산", "벽돌 계산기", "시멘트벽돌 장수", "블록 수량", "조적 모르타르", "벽돌 쌓기 자재"]
    : isZh
      ? ["砖块数量计算", "砖块计算器", "水泥砖数量", "砌块数量", "砌筑砂浆用量"]
      : isVi
        ? ["tính số lượng gạch", "máy tính gạch xây", "số viên gạch mỗi m2", "block bê tông", "vữa xây"]
        : ["brick calculator", "how many bricks per m2", "brick quantity calculator", "concrete block calculator", "mortar calculator"];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/${locale}/brick-calc`, languages: buildLanguagesAlt("/brick-calc") },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/brick-calc`,
      locale: locale === "ko" ? "ko_KR" : locale === "zh" ? "zh_CN" : locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function BrickCalcPage({
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
        <Breadcrumbs path="/brick-calc" locale={localeKey} id="brick-calc" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "벽돌·블록 수량 계산기" : isZh ? "砖块·砌块数量计算器" : isVi ? "Máy tính số lượng gạch·block" : "Brick & Block Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "벽 면적만 넣으면 벽돌·블록 발주 수량과 줄눈 모르타르(시멘트·모래)량을 즉시 산출. 표준품셈 정미량 + 할증."
              : isZh
                ? "只需输入墙面面积，即可立即算出砖块·砌块发注数量与灰缝砂浆(水泥·沙子)用量。标准估算净量 + 损耗。"
                : isVi
                  ? "Chỉ cần nhập diện tích tường để có ngay số lượng gạch·block cần đặt và lượng vữa mạch (xi măng·cát). Định mức + hao hụt."
                  : "Enter wall area to get brick/block order counts and joint mortar (cement, sand) — standard net quantity plus waste."}
          </p>
        </header>
        <BrickForm locale={localeKey} />
        <ToolGuide toolKey="brick-calc" locale={localeKey} />
      </div>
    </main>
  );
}
