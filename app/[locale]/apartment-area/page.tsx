import type { Metadata } from "next";
import { ApartmentAreaForm } from "@/components/tools/realestate/ApartmentAreaForm";
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
    ? "전용·공급면적 / 평당가 계산기 — 84㎡ 아파트는 실제 몇 평 거주?"
    : isZh
      ? "专有·供给面积 / 每坪价格计算器 — 84㎡公寓实际居住面积是多少坪？"
      : isVi
        ? "Máy tính diện tích riêng·cung cấp / giá theo pyeong — Căn hộ 84㎡ thực tế ở được bao nhiêu pyeong?"
        : "Korean Apartment Area & Price per Pyeong — Exclusive vs Supply Area";
  const description = isKo
    ? "공급면적과 전용면적(㎡)을 입력하면 전용률·평 환산·공급/전용 기준 평당가를 즉시 계산합니다. 외국인이 가장 헷갈리는 전용면적과 공급면적의 차이를 쉽게 설명하며, '국민평형' 84㎡ 아파트의 실제 거주 면적이 몇 평인지 확인할 수 있습니다."
    : isZh
      ? "输入供给面积与专有面积(㎡)，即可立即计算专有率、坪换算，以及按供给面积或专有面积计价的每坪价格。详细解析外国人最容易混淆的专有面积与供给面积区别，还能直接查看国民标准户型84㎡公寓的实际居住面积是多少坪。"
      : isVi
        ? "Nhập diện tích cung cấp và diện tích riêng (㎡) để tính ngay tỷ lệ diện tích riêng, quy đổi pyeong và giá theo pyeong (theo diện tích cung cấp/diện tích riêng). Giải thích bẫy diện tích riêng và diện tích cung cấp mà người nước ngoài hay nhầm lẫn nhất — kể cả diện tích thực ở của căn hộ 'diện tích tiêu chuẩn quốc dân' 84㎡."
        : "Enter supply and exclusive area (㎡) to get the exclusive ratio, pyeong, and price per pyeong. Decodes the exclusive-vs-supply trap behind Korean apartment listings — why an \"84㎡\" flat isn't 84㎡ of living space.";
  const keywords = isKo
    ? [
        "전용면적 공급면적",
        "전용률 계산",
        "평당가 계산",
        "공급면적 전용면적 차이",
        "국민평형",
        "84제곱미터 실면적",
      ]
    : isZh
      ? [
          "专有面积供给面积",
          "专有率计算",
          "每坪价格计算",
          "供给面积专有面积区别",
          "国民标准户型",
          "84平方米实际面积",
        ]
      : isVi
        ? [
            "diện tích riêng và diện tích cung cấp Hàn Quốc",
            "tính giá theo pyeong",
            "tỷ lệ diện tích riêng",
            "phân biệt diện tích riêng diện tích cung cấp",
            "diện tích tiêu chuẩn quốc dân",
            "diện tích thực căn hộ 84 mét vuông",
          ]
        : [
            "korea exclusive vs supply area",
            "price per pyeong korea",
            "korean apartment area explained",
            "exclusive ratio korea",
            "supply area korea",
            "korean apartment listing area",
          ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/apartment-area`,
      languages: buildLanguagesAlt("/apartment-area"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/apartment-area`,
      locale:
        locale === "ko"
          ? "ko_KR"
          : locale === "zh"
            ? "zh_CN"
            : locale === "vi"
              ? "vi_VN"
              : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function ApartmentAreaPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const localeKey = isKo
    ? "ko"
    : locale === "zh"
      ? "zh"
      : locale === "vi"
        ? "vi"
        : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/apartment-area" locale={localeKey} id="apartment-area" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {localeKey === "ko"
              ? "전용·공급면적 / 평당가 계산기"
              : localeKey === "zh"
                ? "专有·供给面积 / 每坪价格计算器"
                : localeKey === "vi"
                  ? "Diện tích riêng·cung cấp / Giá theo pyeong"
                  : "Korea Apartment Area & Price-per-Pyeong"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {localeKey === "ko"
              ? "매물의 '84㎡'는 공급면적이고, 실제 거주 공간(전용면적)은 더 작습니다. 공급·전용면적을 넣으면 평 환산·전용률·평당가를 한눈에 보여줍니다."
              : localeKey === "zh"
                ? "房源标示的\"84㎡\"是供给面积，实际居住空间（专有面积）更小。输入供给·专有面积，即可一目了然地查看坪换算·专有率·每坪价格。"
                : localeKey === "vi"
                  ? "'84㎡' trong tin rao là diện tích cung cấp — không gian sống thực tế (diện tích riêng) của bạn nhỏ hơn. Nhập cả hai diện tích để xem quy đổi pyeong, tỷ lệ diện tích riêng và giá theo pyeong chỉ trong một lần nhìn."
                  : "A listing's '84㎡' is the supply area — your actual living space (exclusive area) is smaller. Enter both to see pyeong, exclusive ratio, and price per pyeong at a glance."}
          </p>
        </header>
        <ApartmentAreaForm locale={localeKey} />
        <ToolGuide toolKey="apartment-area" locale={localeKey} />
      </div>
    </main>
  );
}
