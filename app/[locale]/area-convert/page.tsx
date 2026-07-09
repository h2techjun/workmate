import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AreaConverter } from "@/components/tools/unit/AreaConverter";
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
    ? "평 ↔ ㎡ 변환기 — 제곱미터를 평으로 즉시 (1평=3.3058㎡)"
    : isZh
      ? "坪 ↔ ㎡ 换算器 — 平方米即时转换为坪数 (1坪=3.3058㎡)"
      : isVi
        ? "Chuyển đổi Pyeong ↔ m² — Đổi mét vuông sang pyeong tức thì (1 pyeong = 3,3058 m²)"
        : "Square Meters to Pyeong Converter — What Is a Pyeong? (1 pyeong = 3.3058 m²)";
  const description = isKo
    ? "평·㎡·제곱자(자²) 양방향 즉시 변환. 1평 = 3.30578㎡ = 36자², 84㎡ ≈ 25평. 0.5평 단위 부동산 반올림 + 59·84·114㎡ 프리셋 제공."
    : isZh
      ? "坪·㎡·平方尺(尺²) 双向即时换算。1坪 = 3.30578㎡ = 36尺², 84㎡ ≈ 25坪。提供0.5坪单位房产四舍五入 + 59·84·114㎡ 常用预设。"
      : isVi
        ? "Chuyển đổi hai chiều giữa pyeong, m² và ja² (thước vuông) tức thì. 1 pyeong = 3,30578 m² = 36 ja², 84 m² ≈ 25 pyeong. Tự động làm tròn 0,5 pyeong theo kiểu bất động sản + mẫu có sẵn 59·84·114 m²."
        : "Convert square meters to pyeong and back instantly — 1 pyeong = 3.3058 m² (so 84 m² ≈ 25 pyeong). What a pyeong is, how big one is, plus square-ja. The Korean area units every foreigner needs.";
  const keywords = isKo
    ? [
        "평 제곱미터 변환",
        "제곱미터 평 변환",
        "84제곱미터 몇 평",
        "평수 환산",
        "제곱자 변환",
        "0.5평 반올림",
      ]
    : isZh
      ? [
          "坪 平方米 换算",
          "平方米 坪 换算",
          "84平方米 几坪",
          "坪数 换算",
          "平方尺 换算",
          "0.5坪 四舍五入",
        ]
      : isVi
        ? [
            "chuyển đổi pyeong mét vuông",
            "chuyển đổi mét vuông pyeong",
            "84 mét vuông bao nhiêu pyeong",
            "quy đổi pyeong",
            "chuyển đổi ja vuông",
            "làm tròn 0.5 pyeong",
          ]
        : [
          "square meters to pyeong",
          "what is a pyeong",
          "how big is a pyeong",
          "pyeong to square meters",
          "84 square meters to pyeong",
          "korean area unit converter",
        ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/area-convert`,
      languages: buildLanguagesAlt("/area-convert"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/area-convert`,
      locale: locale === "ko" ? "ko_KR" : locale === "zh" ? "zh_CN" : locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function AreaConvertPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const isVi = locale === "vi";
  const isZh = locale === "zh";
  const localeKey: "ko" | "en" | "vi" = isKo ? "ko" : isVi ? "vi" : "en";
  const lang: "ko" | "en" | "vi" | "zh" = isZh ? "zh" : localeKey;

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "툴 모음" : isZh ? "全部工具" : isVi ? "Tất cả công cụ" : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo
              ? "평수 계산기 (평 ↔ ㎡ ↔ 자²)"
              : isZh
                ? "坪数计算器 (坪 ↔ ㎡ ↔ 尺²)"
                : isVi
                  ? "Máy tính diện tích (Pyeong ↔ m² ↔ ja²)"
                  : "Pyeong / m² / ja² Converter"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "부동산 면적 단위를 즉시 변환. 84㎡ 같은 국민주택규모를 한 번에 평수로, 자(尺) 단위까지. 0.5평 단위 광고용 반올림 자동 제공."
              : isZh
                ? "即时换算房产面积单位。84㎡等国民住宅标准面积一键转换为坪数，还支持尺单位。自动提供0.5坪单位广告用四舍五入。"
                : isVi
                  ? "Chuyển đổi đơn vị diện tích bất động sản tức thì. Quy đổi diện tích tiêu chuẩn nhà ở quốc gia như 84 m² sang pyeong, cả đơn vị ja (尺). Tự động làm tròn 0,5 pyeong dùng cho quảng cáo bất động sản."
                  : "Convert real-estate area units instantly. National housing standard 84㎡ to pyeong + ja unit support. Auto 0.5-pyeong rounding for ads."}
          </p>
        </header>
        <AreaConverter locale={lang} />
        <ToolGuide toolKey="area-convert" locale={lang} />
      </div>
    </main>
  );
}
