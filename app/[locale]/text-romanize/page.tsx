import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TextRomanizeForm } from "@/components/tools/korean/TextRomanizeForm";
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
    ? "한글 로마자 변환기 — 문장·단어 음역"
    : "Korean Romanizer — Hangul to roman letters";
  const description = isKo
    ? "한글 문장·단어를 국립국어원 로마자 표기법으로 음역. 간판·메뉴·지명 읽기에 적합. 공백·구두점 보존, 음절 단위 변환."
    : "Romanize Korean sentences and words with the Revised Romanization. Great for signs, menus, and place names — preserves spacing and punctuation.";
  const keywords = isKo
    ? ["한글 로마자 변환", "한글 영문 변환", "로마자 표기", "한글 음역", "한국어 로마자"]
    : [
        "korean romanizer",
        "hangul to roman",
        "romanize korean",
        "korean transliteration",
        "korean to english letters",
      ];
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/text-romanize`,
      languages: buildLanguagesAlt("/text-romanize"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/text-romanize`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function TextRomanizePage({
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
            {isKo ? "한글 로마자 변환기" : "Korean Romanizer"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "한글 문장·단어를 로마자로 음역. 간판·메뉴·지명을 영문으로 읽을 때."
              : "Romanize Korean sentences and words — read signs, menus, and place names in roman letters."}
          </p>
        </header>
        <TextRomanizeForm locale={localeKey} />
        <ToolGuide toolKey="text-romanize" locale={localeKey} />
      </div>
    </main>
  );
}
