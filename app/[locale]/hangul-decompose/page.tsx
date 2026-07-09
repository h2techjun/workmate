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
  const isZh = locale === "zh";
  const isVi = locale === "vi";
  const title = isKo
    ? "한글 음절 분해기 — 초성·중성·종성 + 받침"
    : isZh
      ? "韩文音节分解器 — 初声·中声·终声 + 收音"
      : isVi
        ? "Bộ phân tách âm tiết tiếng Hàn — phụ âm đầu, nguyên âm, phụ âm cuối"
        : "Hangul Syllable Decomposer — initial, medial, final jamo";
  const description = isKo
    ? "한글을 음절별로 초성·중성·종성 자모로 분해. 받침(종성) 유무와 자모 로마자 음가를 표시. 한국어 학습·조사 선택·타이핑 분석에 유용."
    : isZh
      ? "将韩文按音节分解为初声·中声·终声字母。显示收音(终声)有无及各字母的罗马字读音。适合韩语学习·助词选择·输入法分析。"
      : isVi
        ? "Phân tách từng âm tiết tiếng Hàn thành phụ âm đầu, nguyên âm và phụ âm cuối. Hiển thị âm tiết có patchim (phụ âm cuối) hay không cùng cách đọc La-tinh hóa. Hữu ích khi học tiếng Hàn, chọn trợ từ và phân tích cách gõ."
        : "Break Korean syllables into initial, medial, and final jamo. See whether each syllable has a final consonant (batchim) and its roman sounds.";
  const keywords = isKo
    ? ["한글 음절 분해", "초성 중성 종성", "받침 분리", "자모 분해", "한글 분해"]
    : isZh
      ? ["韩文音节分解", "初声中声终声", "收音分离", "字母分解", "韩文分解"]
      : isVi
        ? [
            "phân tách âm tiết tiếng Hàn",
            "phụ âm đầu nguyên âm phụ âm cuối",
            "tách patchim",
            "phân tách jamo",
            "phân tách chữ Hàn",
          ]
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
      locale: locale === "ko" ? "ko_KR" : locale === "zh" ? "zh_CN" : locale === "vi" ? "vi_VN" : "en_US",
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
  const localeKey: "ko" | "en" | "vi" | "zh" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";
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
              ? "한글 음절 분해기"
              : localeKey === "zh"
                ? "韩文音节分解器"
                : localeKey === "vi"
                  ? "Bộ phân tách âm tiết tiếng Hàn"
                  : "Hangul Syllable Decomposer"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "한글을 초성·중성·종성으로 분해하고 받침 유무·로마자 음가를 한눈에."
              : localeKey === "zh"
                ? "将韩文分解为初声·中声·终声，收音有无与罗马字读音一目了然。"
                : localeKey === "vi"
                  ? "Phân tách chữ Hàn thành phụ âm đầu, nguyên âm và phụ âm cuối — xem ngay tình trạng patchim và cách đọc La-tinh hóa."
                  : "Split Hangul into initial, medial, and final jamo with batchim and roman sounds at a glance."}
          </p>
        </header>
        <HangulDecomposeForm locale={localeKey} />
        <ToolGuide toolKey="hangul-decompose" locale={localeKey} />
      </div>
    </main>
  );
}
