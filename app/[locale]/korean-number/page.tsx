import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { KoreanNumberForm } from "@/components/tools/korean/KoreanNumberForm";
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
    ? "한글 숫자 변환기 — 한자어·고유어 수사 읽기"
    : "Korean Number Reader — Sino & Native Korean numbers";
  const description = isKo
    ? "숫자를 한자어 수사(일·이·삼)와 고유어 수사(하나·둘·셋)로 동시 변환. 관형사형(한·두·스무)과 용법(날짜·나이·시간)까지 안내. 한국어 학습 필수."
    : "Convert numbers into both Sino-Korean (il, i, sam) and Native Korean (hana, dul, set), with attributive forms and when to use each.";
  const keywords = isKo
    ? ["한글 숫자", "한자어 수사", "고유어 수사", "숫자 읽기", "한국어 숫자"]
    : [
        "korean numbers",
        "sino korean numbers",
        "native korean numbers",
        "korean number reader",
        "how to count in korean",
      ];
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/korean-number`,
      languages: buildLanguagesAlt("/korean-number"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/korean-number`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function KoreanNumberPage({
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
            {isKo ? "한글 숫자 변환기" : "Korean Number Reader"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "숫자를 한자어·고유어 수사로 동시에. 관형사형과 용법(날짜·나이·시간)까지."
              : "See any number in both Sino-Korean and Native Korean, with attributive forms and usage."}
          </p>
        </header>
        <KoreanNumberForm locale={localeKey} />
        <ToolGuide toolKey="korean-number" locale={localeKey} />
      </div>
    </main>
  );
}
