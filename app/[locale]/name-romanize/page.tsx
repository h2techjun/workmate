import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { NameRomanizeForm } from "@/components/tools/korean/NameRomanizeForm";
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
    ? "한글 이름 로마자 변환기 — 여권·국립국어원 표기"
    : "Korean Name Romanizer — Revised Romanization & passport spelling";
  const description = isKo
    ? "한글 이름을 국립국어원 로마자 표기법으로 변환. 정식 표기 + 여권 관습 표기(Kim·Lee·Park) + 하이픈 방식까지 한 번에. 가입 없이 브라우저에서."
    : "Convert Korean names to romanized spelling. Official Revised Romanization + conventional passport spellings (Kim, Lee, Park) + hyphenated form.";
  const keywords = isKo
    ? [
        "한글 이름 로마자",
        "이름 영문 변환",
        "여권 영문 이름",
        "로마자 표기법",
        "한글 영문 변환",
        "이름 로마자 변환",
      ]
    : [
        "korean name romanizer",
        "korean name to english",
        "romanize korean name",
        "korean name spelling",
        "revised romanization korean",
        "korean passport name",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/name-romanize`,
      languages: buildLanguagesAlt("/name-romanize"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/name-romanize`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function NameRomanizePage({
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
            {isKo ? "한글 이름 로마자 변환기" : "Korean Name Romanizer"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "한글 이름을 국립국어원 정식 표기 + 여권 관습 표기로 즉시 변환. 성씨는 Kim·Lee·Park 같은 통용 표기도 함께 제시."
              : "Convert any Korean name to official Revised Romanization plus conventional passport spellings (Kim, Lee, Park)."}
          </p>
        </header>
        <NameRomanizeForm locale={localeKey} />
        <ToolGuide toolKey="name-romanize" locale={localeKey} />
      </div>
    </main>
  );
}
