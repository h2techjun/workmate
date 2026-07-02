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
  const title = isKo
    ? "평 ↔ ㎡ 변환기 — 제곱미터를 평으로 즉시 (1평=3.3058㎡)"
    : "Square Meters to Pyeong Converter — What Is a Pyeong? (1 pyeong = 3.3058 m²)";
  const description = isKo
    ? "평·㎡·제곱자(자²) 양방향 즉시 변환. 1평 = 3.30578㎡ = 36자², 84㎡ ≈ 25평. 0.5평 단위 부동산 반올림 + 59·84·114㎡ 프리셋 제공."
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
      locale: locale === "ko" ? "ko_KR" : "en_US",
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
  const localeKey = isKo ? "ko" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "툴 모음" : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "평수 계산기 (평 ↔ ㎡ ↔ 자²)" : "Pyeong / m² / ja² Converter"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "부동산 면적 단위를 즉시 변환. 84㎡ 같은 국민주택규모를 한 번에 평수로, 자(尺) 단위까지. 0.5평 단위 광고용 반올림 자동 제공."
              : "Convert real-estate area units instantly. National housing standard 84㎡ to pyeong + ja unit support. Auto 0.5-pyeong rounding for ads."}
          </p>
        </header>
        <AreaConverter locale={localeKey} />
        <ToolGuide toolKey="area-convert" locale={localeKey} />
      </div>
    </main>
  );
}
