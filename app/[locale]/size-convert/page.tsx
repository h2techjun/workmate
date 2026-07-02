import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SizeConvertForm } from "@/components/tools/korean/SizeConvertForm";
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
    ? "한국 옷·신발 사이즈 변환표 — US/EU/UK/JP"
    : "Korean Clothing & Shoe Size Converter — US/EU/UK/JP";
  const description = isKo
    ? "한국 의류·신발 사이즈를 US·EU·UK·일본 사이즈로 변환. 남녀 신발(mm)·의류(가슴둘레) 대조표. K-패션 직구·해외 쇼핑에 바로."
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
      locale: locale === "ko" ? "ko_KR" : "en_US",
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
  const isKo = locale === "ko";
  const localeKey = isKo ? "ko" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
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
            {isKo ? "한국 옷·신발 사이즈 변환표" : "Korean Size Converter"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "한국 사이즈를 US·EU·UK·일본으로. 남녀 신발(mm)·의류 대조표를 한눈에. 직구·K-패션 쇼핑 필수."
              : "Korean sizes to US, EU, UK, Japan. Men's & women's shoe and clothing charts at a glance — essential for K-fashion shopping."}
          </p>
        </header>
        <SizeConvertForm locale={localeKey} />
        <ToolGuide toolKey="size-convert" locale={localeKey} />
      </div>
    </main>
  );
}
