import type { Metadata } from "next";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { MaterialQuantityForm } from "@/components/tools/timber/MaterialQuantityForm";
import { locales, type Locale } from "@/i18n";
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
    ? "합판 매수 계산기 — 면적 → 합판 매수 + 못 개수"
    : isZh
      ? "合板张数计算器 — 面积 → 合板张数 + 钉子数量"
      : isVi
        ? "Máy tính số tấm ván ép — diện tích → số tấm + số lượng đinh"
        : "Plywood Sheet Calculator — area to sheets and nails";
  const description = isKo
    ? "벽·바닥·지붕 면적과 손실률만 입력하면 합판 매수와 못 개수까지 즉시 계산합니다. 4×8자(1.2×2.4m) 표준 18mm 합판 기준으로 목조주택·리모델링 현장의 자재 발주 물량을 무료로, 회원가입 없이 바로 확인할 수 있습니다."
    : isZh
      ? "只需输入墙面·地面·屋顶面积与损耗率，即可立即算出合板张数与钉子数量。以4×8英尺(1.2×2.4m)标准18mm合板为基准，适用于木结构住宅·翻新工地的材料备料与施工估算，完全免费，无需注册即可使用。"
      : isVi
        ? "Chỉ cần nhập diện tích tường/sàn/mái và hệ số hao hụt là tính ngay số tấm ván ép và số lượng đinh. Dựa trên ván ép tiêu chuẩn 4×8ft (1.2×2.4m) 18mm. Miễn phí."
        : "Calculate plywood sheets and nail count from area with waste factor. Standard 4×8ft (1.2×2.4m) 18mm plywood. Free.";
  const keywords = isKo
    ? [
        "합판 계산",
        "합판 매수",
        "plywood calculator",
        "12mm 합판",
        "18mm 합판",
        "4x8 합판",
        "1212 합판",
        "벽 합판 자재",
        "바닥 합판",
        "지붕 합판",
      ]
    : isZh
      ? [
          "合板计算",
          "合板张数",
          "合板计算器",
          "12mm合板",
          "18mm合板",
          "4x8合板",
          "墙面合板材料",
          "地面合板",
          "屋顶合板",
        ]
      : isVi
        ? [
            "tính ván ép",
            "số tấm ván ép",
            "máy tính ván ép",
            "ván ép 12mm",
            "ván ép 18mm",
            "ván ép 4x8",
            "vật liệu ốp tường",
            "ván ép sàn",
          ]
        : ["plywood calculator", "plywood sheets", "4x8 plywood", "18mm plywood", "wall sheathing"];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/timber-calc/plywood`,
      languages: buildLanguagesAlt("/timber-calc/plywood"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/timber-calc/plywood`,
      locale: locale === "ko" ? "ko_KR" : isZh ? "zh_CN" : isVi ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function PlywoodPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const isVi = locale === "vi";
  const localeKey: Locale = isKo ? "ko" : isZh ? "zh" : isVi ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs
          path="/timber-calc/plywood"
          locale={localeKey}
          id="timber-plywood"
        />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "합판 매수 계산기" : isZh ? "合板张数计算器" : isVi ? "Máy tính số tấm ván ép" : "Plywood Sheet Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "벽·바닥·지붕 시공 면적을 입력하면 18mm 합판 매수와 못 개수까지 즉시. 4×8자 (1.2×2.4m) 표준 규격 기준."
              : isZh
                ? "输入墙面·地面·屋顶施工面积，即可立即算出18mm合板张数与钉子数量。以4×8英尺(1.2×2.4m)标准规格为基准。"
                : isVi
                  ? "Nhập diện tích thi công tường/sàn/mái — nhận ngay số tấm ván ép 18mm và số lượng đinh. Dựa trên quy cách tiêu chuẩn 4×8ft (1.2×2.4m)."
                  : "Enter wall/floor/roof area — get 18mm plywood sheets and nail count. Standard 4×8ft (1.2×2.4m)."}
          </p>
        </header>
        <MaterialQuantityForm lockedMaterial="plywood18" />
        <ToolGuide toolKey="timber-plywood" locale={localeKey} />
      </div>
    </main>
  );
}
