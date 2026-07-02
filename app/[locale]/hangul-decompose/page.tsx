import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { HangulDecomposeForm } from "@/components/tools/korean/HangulDecomposeForm";
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
    ? "한글 음절 분해기 — 초성·중성·종성 + 받침"
    : "Hangul Syllable Decomposer — initial, medial, final jamo";
  const description = isKo
    ? "한글을 음절별로 초성·중성·종성 자모로 분해. 받침(종성) 유무와 자모 로마자 음가를 표시. 한국어 학습·조사 선택·타이핑 분석에 유용."
    : "Break Korean syllables into initial, medial, and final jamo. See whether each syllable has a final consonant (batchim) and its roman sounds.";
  const keywords = isKo
    ? ["한글 음절 분해", "초성 중성 종성", "받침 분리", "자모 분해", "한글 분해"]
    : [
        "hangul decomposer",
        "korean syllable breakdown",
        "jamo decomposition",
        "batchim checker",
        "korean initial medial final",
      ];
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/hangul-decompose`,
      languages: buildLanguagesAlt("/hangul-decompose"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/hangul-decompose`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function HangulDecomposePage({
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
            {isKo ? "한글 음절 분해기" : "Hangul Syllable Decomposer"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "한글을 초성·중성·종성으로 분해하고 받침 유무·로마자 음가를 한눈에."
              : "Split Hangul into initial, medial, and final jamo with batchim and roman sounds at a glance."}
          </p>
        </header>
        <HangulDecomposeForm locale={localeKey} />
        <ToolGuide toolKey="hangul-decompose" locale={localeKey} />
      </div>
    </main>
  );
}
