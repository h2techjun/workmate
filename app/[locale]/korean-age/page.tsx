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
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const isVi = locale === "vi";
  const title = isKo
    ? "한국식 나이 계산기 — 만나이 · 세는나이 · 연나이"
    : isZh
      ? "韩国年龄计算器 — 国际年龄·虚岁·年度年龄"
      : isVi
        ? "Máy tính tuổi Hàn Quốc — tuổi quốc tế · tuổi đếm · tuổi theo năm"
        : "Korean Age Calculator — international, counting & year age";
  const description = isKo
    ? "생년월일로 만나이·세는나이·연나이를 한 번에 계산. 2023년 만나이 통일 이후 기준 + 전통 세는나이 차이까지 설명. 다음 생일까지 남은 일수 표시."
    : isZh
      ? "输入生日即可一次算出国际年龄、虚岁、年度年龄三种韩国年龄。基于2023年统一使用国际年龄的标准，并说明与传统虚岁的差异，同时显示距下次生日的天数。"
      : isVi
        ? "Tính cùng lúc tuổi quốc tế, tuổi đếm truyền thống và tuổi theo năm từ ngày sinh của bạn. Giải thích theo tiêu chuẩn thống nhất tuổi quốc tế từ 2023 và sự khác biệt với tuổi đếm truyền thống. Hiển thị số ngày còn lại đến sinh nhật tiếp theo."
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
    : isZh
      ? [
          "韩国年龄计算器",
          "国际年龄计算器",
          "虚岁",
          "韩国年度年龄",
          "满岁统一",
          "年龄计算",
          "韩国式年龄",
          "生日年龄计算",
        ]
      : isVi
        ? [
            "máy tính tuổi Hàn Quốc",
            "tuổi Hàn Quốc",
            "tuổi quốc tế Hàn Quốc",
            "tuổi đếm Hàn Quốc",
            "cách tính tuổi Hàn Quốc",
            "hệ thống tuổi Hàn Quốc",
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
      locale:
        locale === "ko"
          ? "ko_KR"
          : locale === "zh"
            ? "zh_CN"
            : locale === "vi"
              ? "vi_VN"
              : "en_US",
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
  const lang: "ko" | "en" | "zh" | "vi" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

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
            {lang === "ko"
              ? "툴 모음"
              : lang === "zh"
                ? "所有工具"
                : lang === "vi"
                  ? "Tất cả công cụ"
                  : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {lang === "ko"
              ? "한국식 나이 계산기"
              : lang === "zh"
                ? "韩国年龄计算器"
                : lang === "vi"
                  ? "Máy tính tuổi Hàn Quốc"
                  : "Korean Age Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {lang === "ko"
              ? "생년월일을 넣으면 만나이·세는나이·연나이 세 가지를 한 번에. 2023년 만나이 통일 이후에도 헷갈리는 차이를 명확히 정리."
              : lang === "zh"
                ? "输入生日即可一次看到国际年龄、虚岁、年度年龄三种韩国年龄。清晰梳理2023年统一使用国际年龄之后仍然容易混淆的差异。"
                : lang === "vi"
                  ? "Nhập ngày sinh để xem cùng lúc cả ba loại tuổi Hàn Quốc — tuổi quốc tế, tuổi đếm và tuổi theo năm — và hiểu rõ vì sao chúng khác nhau."
                  : "Enter your birth date to see all three Korean ages at once — international, counting, and year age — and understand why they differ."}
          </p>
        </header>
        <KoreanAgeForm locale={lang} today={today} />
        <ToolGuide toolKey="korean-age" locale={lang} />
      </div>
    </main>
  );
}
