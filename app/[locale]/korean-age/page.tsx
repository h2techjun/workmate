import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { KoreanAgeForm } from "@/components/tools/unit/KoreanAgeForm";
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
  const isKo = locale !== "en";
  const title = isKo
    ? "한국식 나이 계산기 — 만나이 · 세는나이 · 연나이"
    : "Korean Age Calculator — international, counting & year age";
  const description = isKo
    ? "생년월일로 만나이·세는나이·연나이를 한 번에 계산. 2023년 만나이 통일 이후 기준 + 전통 세는나이 차이까지 설명. 다음 생일까지 남은 일수 표시."
    : "Calculate your Korean age from your birth date: international age, Korean counting age, and year age. Understand why Koreans may say you're 1-2 years older.";
  const keywords = isKo
    ? [
        "한국 나이 계산기",
        "만나이 계산기",
        "세는나이",
        "연나이",
        "만나이 통일",
        "나이 계산",
        "한국식 나이",
        "생일 나이 계산",
      ]
    : [
        "korean age calculator",
        "korean age",
        "international age korea",
        "korean counting age",
        "how old am i in korea",
        "korean age system",
        "seoul age calculator",
        "k-pop idol age",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/korean-age`,
      languages: buildLanguagesAlt("/korean-age"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/korean-age`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function KoreanAgePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale !== "en";
  const localeKey = isKo ? "ko" : "en";

  // 서버 렌더 시점의 KST(Asia/Seoul) 기준 오늘 — hydration mismatch 방지를 위해
  // 서버에서 계산해 props 로 전달.
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 3600 * 1000); // UTC+9
  const today = {
    year: kst.getUTCFullYear(),
    month: kst.getUTCMonth() + 1,
    day: kst.getUTCDate(),
  };

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
            {isKo ? "한국식 나이 계산기" : "Korean Age Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "생년월일을 넣으면 만나이·세는나이·연나이 세 가지를 한 번에. 2023년 만나이 통일 이후에도 헷갈리는 차이를 명확히 정리."
              : "Enter your birth date to see all three Korean ages at once — international, counting, and year age — and understand why they differ."}
          </p>
        </header>
        <KoreanAgeForm locale={localeKey} today={today} />
        <ToolGuide toolKey="korean-age" locale={localeKey} />
      </div>
    </main>
  );
}
