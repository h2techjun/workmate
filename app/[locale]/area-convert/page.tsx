import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { AreaConverter } from "@/components/tools/unit/AreaConverter";
import { locales } from "@/i18n";
import { SITE_URL } from "@/lib/siteConfig";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale !== "en";
  const title = isKo
    ? "평수 계산기 — 평 ↔ ㎡ ↔ 자² 즉시 변환"
    : "Pyeong Converter — pyeong ↔ m² ↔ ja² instant";
  const description = isKo
    ? "평·㎡·제곱자(자²) 양방향 변환. 1평 = 3.30578㎡ = 36자² 정확 공식 + 0.5평 단위 부동산 광고용 반올림. 59㎡·84㎡·114㎡ 프리셋 제공."
    : "Convert between Korean pyeong, square meters, and square ja. 1 pyeong = 3.30578 m² = 36 ja² exact + 0.5 pyeong real-estate rounding.";
  const keywords = isKo
    ? [
        "평수 계산",
        "평수 계산기",
        "평 제곱미터 변환",
        "평수 환산",
        "㎡ 평 변환",
        "84제곱미터 평수",
        "59제곱미터 평수",
        "전용면적 평수",
        "공급면적",
        "부동산 평수",
        "아파트 평수",
        "자 단위 변환",
      ]
    : [
        "pyeong converter",
        "Korean area units",
        "pyeong to square meter",
        "84 square meters in pyeong",
        "Korean real estate area",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/area-convert`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}/area-convert`]),
      ),
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
  const isKo = locale !== "en";
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
      </div>
    </main>
  );
}
