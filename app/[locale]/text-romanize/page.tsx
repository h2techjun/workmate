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
  const isZh = locale === "zh";
  const isVi = locale === "vi";
  const title = isKo
    ? "한글 로마자 변환기 — 문장·단어 음역"
    : isZh
      ? "韩文罗马字转换器 — 句子·单词音译"
      : isVi
        ? "Công cụ phiên âm La-tinh tiếng Hàn — chuyển câu, từ Hangul sang chữ La-tinh"
        : "Korean Romanizer — Hangul to roman letters";
  const description = isKo
    ? "한글 문장·단어를 국립국어원 로마자 표기법으로 음역. 간판·메뉴·지명 읽기에 적합. 공백·구두점 보존, 음절 단위 변환."
    : isZh
      ? "按韩国国立国语院罗马字标记法音译韩文句子·单词。适合阅读招牌·菜单·地名，保留空格与标点，按音节转换。"
      : isVi
        ? "Phiên âm câu và từ tiếng Hàn sang chữ La-tinh theo quy tắc phiên âm chính thức của Viện Ngôn ngữ Quốc gia Hàn Quốc. Phù hợp để đọc biển hiệu, thực đơn, địa danh. Giữ nguyên khoảng trắng và dấu câu, chuyển đổi theo từng âm tiết."
        : "Romanize Korean sentences and words with the Revised Romanization. Great for signs, menus, and place names — preserves spacing and punctuation.";
  const keywords = isKo
    ? ["한글 로마자 변환", "한글 영문 변환", "로마자 표기", "한글 음역", "한국어 로마자"]
    : isZh
      ? ["韩文罗马字转换", "韩文英文转换", "罗马字标记", "韩文音译", "韩语罗马字"]
      : isVi
        ? [
            "phiên âm La-tinh tiếng Hàn",
            "chuyển Hangul sang chữ La-tinh",
            "phiên âm tiếng Hàn",
            "chuyển đổi tiếng Hàn sang tiếng Anh",
            "cách đọc tiếng Hàn",
          ]
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

export default async function TextRomanizePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const isVi = locale === "vi";
  const localeKey: "ko" | "en" | "vi" | "zh" = isKo ? "ko" : isZh ? "zh" : isVi ? "vi" : "en";
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "툴 모음" : isZh ? "全部工具" : isVi ? "Tất cả công cụ" : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo
              ? "한글 로마자 변환기"
              : isZh
                ? "韩文罗马字转换器"
                : isVi
                  ? "Công cụ phiên âm tiếng Hàn"
                  : "Korean Romanizer"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "한글 문장·단어를 로마자로 음역. 간판·메뉴·지명을 영문으로 읽을 때."
              : isZh
                ? "将韩文句子·单词音译为罗马字。用于将招牌·菜单·地名读成英文字母。"
                : isVi
                  ? "Phiên âm câu, từ tiếng Hàn sang chữ La-tinh. Dùng khi cần đọc biển hiệu, thực đơn, địa danh bằng chữ La-tinh."
                  : "Romanize Korean sentences and words — read signs, menus, and place names in roman letters."}
          </p>
        </header>
        <TextRomanizeForm locale={localeKey} />
        <ToolGuide toolKey="text-romanize" locale={localeKey} />
      </div>
    </main>
  );
}
