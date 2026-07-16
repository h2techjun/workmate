import type { Metadata } from "next";
import { TextRomanizeForm } from "@/components/tools/korean/TextRomanizeForm";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
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
    ? "한글 문장과 단어를 국립국어원이 고시한 로마자 표기법 규칙에 따라 정확하게 음역합니다. 간판·메뉴·지명·인명을 영문으로 옮기거나 여권 서류 작성 시 활용하기 좋고, 공백과 구두점을 보존해 음절 단위로 변환하며 무료로 즉시 확인할 수 있습니다."
    : isZh
      ? "按照韩国国立国语院制定的罗马字标记法规则，将韩文句子和单词准确音译为罗马字。适合把招牌、菜单、地名和人名转写成英文字母，或用于护照文件、外国人指南的撰写，保留原有空格与标点符号，并按音节逐一转换。免注册，打开页面即可免费即时查看结果。"
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
        <Breadcrumbs path="/text-romanize" locale={localeKey} id="text-romanize" />
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
