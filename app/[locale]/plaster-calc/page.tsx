import type { Metadata } from "next";
import { PlasterForm } from "@/components/tools/timber/PlasterForm";
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
    ? "미장 모르타르 배합 계산기 — 시멘트·모래 배합량"
    : isZh
      ? "抹灰砂浆配合比计算器 — 水泥·沙子用量"
      : isVi
        ? "Máy tính pha trộn vữa trát — tỷ lệ xi măng·cát"
        : "Plaster Mortar Mix Calculator — cement & sand ratio";
  const description = isKo
    ? "미장 면적과 두께만 넣으면 모르타르 부피와 배합비(1:2/1:3/1:4)별 시멘트·모래 소요량을 즉시 계산합니다. 건설공사 표준품셈 기준으로 초벌·재벌·정벌 3회 미장 두께 24mm를 기본값으로 적용하며, 회원가입 없이 무료로 이용할 수 있습니다."
    : isZh
      ? "只需输入抹灰面积与厚度，即可立即算出砂浆体积以及不同配合比(1:2/1:3/1:4)下所需的水泥·沙子用量。依据韩国建设工程标准估算，默认厚度24mm(底层+中层+面层三道抹灰)，完全免费在线使用，无需注册。"
      : isVi
        ? "Chỉ cần nhập diện tích và độ dày trát để tính ngay thể tích vữa cùng lượng xi măng·cát cần dùng theo từng tỷ lệ pha (1:2/1:3/1:4). Dựa trên định mức xây dựng Hàn Quốc, mặc định độ dày 24mm (lót+giữa+hoàn thiện), miễn phí không cần đăng ký."
        : "Enter plaster area and thickness to instantly get mortar volume and cement/sand requirements for mix ratios 1:2, 1:3, or 1:4. Based on Korean standard estimation with a default 24mm thickness (base + middle + finish coats) — free, no signup.";
  const keywords = isKo
    ? ["미장 계산기", "모르타르 배합비", "미장 모르타르 계산", "시멘트 모래 배합", "미장 두께 24mm", "미장 자재량"]
    : isZh
      ? ["抹灰计算器", "砂浆配合比", "抹灰砂浆计算", "水泥沙子配比", "抹灰材料用量"]
      : isVi
        ? ["tính vữa trát", "tỷ lệ pha vữa", "máy tính vữa trát", "xi măng cát tỷ lệ", "độ dày trát"]
        : ["plaster calculator", "mortar mix ratio", "cement sand ratio calculator", "plaster mortar calculator", "plastering material calculator"];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/${locale}/plaster-calc`, languages: buildLanguagesAlt("/plaster-calc") },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/plaster-calc`,
      locale: locale === "ko" ? "ko_KR" : locale === "zh" ? "zh_CN" : locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function PlasterCalcPage({
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
        <Breadcrumbs path="/plaster-calc" locale={localeKey} id="plaster-calc" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "미장 모르타르 배합 계산기" : isZh ? "抹灰砂浆配合比计算器" : isVi ? "Máy tính pha trộn vữa trát" : "Plaster Mortar Mix Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "미장 면적과 두께만 넣으면 모르타르 부피와 배합비별 시멘트·모래 소요량을 즉시 산출. 표준품셈 기준 두께 24mm 기본값."
              : isZh
                ? "只需输入抹灰面积与厚度，即可立即算出砂浆体积与配合比对应的水泥·沙子用量。标准估算默认厚度24mm。"
                : isVi
                  ? "Chỉ cần nhập diện tích và độ dày trát để có ngay thể tích vữa và lượng xi măng·cát theo tỷ lệ pha. Định mức mặc định độ dày 24mm."
                  : "Enter plaster area and thickness to get mortar volume and cement/sand requirements by mix ratio — standard default thickness 24mm."}
          </p>
        </header>
        <PlasterForm locale={localeKey} />
        <ToolGuide toolKey="plaster-calc" locale={localeKey} />
      </div>
    </main>
  );
}
