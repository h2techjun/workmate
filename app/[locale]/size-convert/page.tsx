import type { Metadata } from "next";
import { SizeConvertForm } from "@/components/tools/korean/SizeConvertForm";
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
  const isZh = locale === "zh";
  const isVi = locale === "vi";
  const title = isKo
    ? "한국 옷·신발 사이즈 변환표 — US/EU/UK/JP"
    : isZh
      ? "韩国服装·鞋码换算表 — US/EU/UK/JP"
      : isVi
        ? "Bảng quy đổi size quần áo·giày Hàn Quốc — US/EU/UK/JP"
        : "Korean Clothing & Shoe Size Converter — US/EU/UK/JP";
  const description = isKo
    ? "한국 의류·신발 사이즈를 US·EU·UK·일본 사이즈로 변환. 남녀 신발(mm)·의류(가슴둘레) 대조표. K-패션 직구·해외 쇼핑에 바로."
    : isZh
      ? "将韩国服装·鞋码换算为US·EU·UK·日本尺码。男女鞋码(mm)·服装(胸围)对照表一目了然，海淘K-fashion必备。"
      : isVi
        ? "Quy đổi size quần áo, giày Hàn Quốc sang size US·EU·UK·Nhật Bản. Bảng đối chiếu giày nam nữ (mm)·quần áo (vòng ngực). Dùng ngay khi mua hàng xách tay K-fashion."
        : "Convert Korean clothing and shoe sizes to US, EU, UK, and Japanese sizes. Men's & women's shoe (mm) and clothing charts for K-fashion shopping.";
  const keywords = isKo
    ? [
        "한국 사이즈 변환",
        "신발 사이즈 변환",
        "옷 사이즈 변환표",
        "한국 미국 사이즈",
        "mm 신발 사이즈",
        "의류 사이즈 표",
      ]
    : isZh
      ? [
          "韩国尺码换算",
          "鞋码换算",
          "服装尺码对照表",
          "韩国美国尺码",
          "mm鞋码",
          "服装尺码表",
        ]
      : isVi
        ? [
            "quy đổi size Hàn Quốc",
            "quy đổi size giày",
            "bảng size quần áo",
            "size Hàn Quốc và Mỹ",
            "size giày mm",
            "bảng size quần áo Hàn Quốc",
          ]
        : [
            "korean size converter",
            "korean shoe size to us",
            "korean clothing size",
            "korea size chart",
            "korean to us size",
            "k-fashion size",
          ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/size-convert`,
      languages: buildLanguagesAlt("/size-convert"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/size-convert`,
      locale: locale === "ko" ? "ko_KR" : isZh ? "zh_CN" : isVi ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function SizeConvertPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const lang: "ko" | "en" | "vi" | "zh" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/size-convert" locale={lang} id="size-convert" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {lang === "ko"
              ? "한국 옷·신발 사이즈 변환표"
              : lang === "zh"
                ? "韩国服装·鞋码换算表"
                : lang === "vi"
                  ? "Bảng quy đổi size quần áo·giày Hàn Quốc"
                  : "Korean Size Converter"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {lang === "ko"
              ? "한국 사이즈를 US·EU·UK·일본으로. 남녀 신발(mm)·의류 대조표를 한눈에. 직구·K-패션 쇼핑 필수."
              : lang === "zh"
                ? "韩国尺码换算US·EU·UK·日本尺码。男女鞋码(mm)·服装对照表一目了然，海淘·K-fashion购物必备。"
                : lang === "vi"
                  ? "Size Hàn Quốc sang US·EU·UK·Nhật. Xem nhanh bảng đối chiếu giày nam nữ (mm)·quần áo. Cần thiết khi mua hàng xách tay·K-fashion."
                  : "Korean sizes to US, EU, UK, Japan. Men's & women's shoe and clothing charts at a glance — essential for K-fashion shopping."}
          </p>
        </header>
        <SizeConvertForm locale={lang} />
        <ToolGuide toolKey="size-convert" locale={lang} />
      </div>
    </main>
  );
}
