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
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const isVi = locale === "vi";
  const title = isKo
    ? "한국 학년 계산기 — 출생연도로 몇 학년? (초·중·고 입학)"
    : isZh
      ? "韩国学年计算器 — 出生年份对应几年级？(小·初·高入学)"
      : isVi
        ? "Máy tính lớp học Hàn Quốc — Sinh năm nào thì học lớp mấy? (Tiểu học·THCS·THPT)"
        : "Korean School Grade Calculator — What Grade Am I in Korea? (by birth year)";
  const description = isKo
    ? "출생연도를 입력하면 올해 기준 한국 학년(초·중·고)과 입학 나이를 즉시 계산. 한국 학년 컷오프(초등 입학 기준) 해설 포함."
    : isZh
      ? "输入出生年份，即时算出今年对应的韩国学年(小·初·高)与入学年龄。附韩国学年分界(小学入学基准)说明。"
      : isVi
        ? "Nhập năm sinh để tính ngay lớp học hiện tại ở Hàn Quốc (Tiểu học·THCS·THPT) và tuổi nhập học theo năm nay. Bao gồm giải thích về mốc cắt tuổi nhập học tiểu học của Hàn Quốc."
        : "If you were born in a given year, what grade are you in Korea? Enter your birth year to get your Korean school grade (elementary/middle/high), entry age, and how the Korean school-year cutoff works.";
  const keywords = isKo
    ? ["한국 학년 계산", "출생연도 학년", "초등학교 입학 나이", "몇 학년", "한국 학제", "연 나이 학년"]
    : isZh
      ? ["韩国学年计算", "出生年份学年", "小学入学年龄", "几年级", "韩国学制", "虚岁学年"]
      : isVi
        ? [
            "tính lớp học Hàn Quốc",
            "năm sinh lớp mấy",
            "tuổi nhập học tiểu học Hàn Quốc",
            "học lớp mấy",
            "hệ thống giáo dục Hàn Quốc",
            "tuổi Hàn theo lớp học",
          ]
        : [
          "korean school grade calculator",
          "what grade am i in korea",
          "born 2010 what grade korea",
          "korean school year by birth year",
          "korean grade level",
          "korea school age cutoff",
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
      locale: locale === "ko" ? "ko_KR" : locale === "zh" ? "zh_CN" : locale === "vi" ? "vi_VN" : "en_US",
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
  const isKo = locale === "ko";
  const localeKey: "ko" | "en" | "vi" | "zh" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

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
            {isKo ? "툴 모음" : localeKey === "zh" ? "全部工具" : localeKey === "vi" ? "Tất cả công cụ" : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo
              ? "한국 학년 계산기"
              : localeKey === "zh"
                ? "韩国学年计算器"
                : localeKey === "vi"
                  ? "Máy tính lớp học Hàn Quốc"
                  : "Korean School Grade Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "출생연도만 넣으면 현재 학년과 입학·졸업 연도를 한 번에. 같은 해 출생자가 같은 학년인 한국 학제 기준."
              : localeKey === "zh"
                ? "只需输入出生年份，即可一次看清当前学年与入学·毕业年份。基于韩国学制，同年出生者为同一学年。"
                : localeKey === "vi"
                  ? "Chỉ cần nhập năm sinh là biết ngay lớp học hiện tại cùng năm nhập học và tốt nghiệp. Dựa trên hệ thống Hàn Quốc, những người sinh cùng năm dương lịch học cùng một lớp."
                  : "Enter a birth year to get the current grade plus entry and graduation years, based on Korea's calendar-year cohort system."}
          </p>
        </header>
        <SchoolGradeForm locale={localeKey} today={today} />
        <ToolGuide toolKey="school-grade" locale={localeKey} />
      </div>
    </main>
  );
}
