import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { SchoolGradeForm } from "@/components/tools/unit/SchoolGradeForm";
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
    ? "한국 학년 계산기 — 출생연도로 초·중·고·대 학년"
    : "Korean School Grade Calculator — by birth year";
  const description = isKo
    ? "출생연도만 입력하면 현재 초·중·고·대 학년을 계산. 같은 해 출생자가 같은 학년인 한국 학제 기준 + 입학·졸업 연도까지. 학부모·외국인 필수."
    : "Enter a birth year to find the current Korean school grade (elementary, middle, high, university), plus entry and graduation years.";
  const keywords = isKo
    ? ["한국 학년 계산기", "출생연도 학년", "초등학교 입학 나이", "몇 학년", "학년 계산"]
    : [
        "korean school grade calculator",
        "korean school year",
        "what grade in korea",
        "korean school age",
        "korea elementary entry age",
      ];
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/school-grade`,
      languages: buildLanguagesAlt("/school-grade"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/school-grade`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function SchoolGradePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale !== "en";
  const localeKey = isKo ? "ko" : "en";

  // 서버 렌더 시점 KST(Asia/Seoul) 기준 오늘 — hydration mismatch 방지
  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 3600 * 1000); // UTC+9
  const today = {
    year: kst.getUTCFullYear(),
    month: kst.getUTCMonth() + 1,
  };

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
            {isKo ? "한국 학년 계산기" : "Korean School Grade Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "출생연도만 넣으면 현재 학년과 입학·졸업 연도를 한 번에. 같은 해 출생자가 같은 학년인 한국 학제 기준."
              : "Enter a birth year to get the current grade plus entry and graduation years, based on Korea's calendar-year cohort system."}
          </p>
        </header>
        <SchoolGradeForm locale={localeKey} today={today} />
        <ToolGuide toolKey="school-grade" locale={localeKey} />
      </div>
    </main>
  );
}
