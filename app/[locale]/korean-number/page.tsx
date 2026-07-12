import type { Metadata } from "next";
import { KoreanNumberForm } from "@/components/tools/korean/KoreanNumberForm";
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
    ? "한글 숫자 변환기 — 한자어·고유어 수사 읽기"
    : isZh
      ? "韩文数字转换器 — 汉字词·固有词数词读法"
      : isVi
        ? "Bộ chuyển đổi số tiếng Hàn — Cách đọc số Hán-Hàn và số thuần Hàn"
        : "Korean Number Reader — Sino & Native Korean numbers";
  const description = isKo
    ? "숫자를 한자어 수사(일·이·삼)와 고유어 수사(하나·둘·셋)로 동시 변환. 관형사형(한·두·스무)과 용법(날짜·나이·시간)까지 안내. 한국어 학습 필수."
    : isZh
      ? "将数字同时转换为汉字词数词(일·이·삼)与固有词数词(하나·둘·셋)。并提供冠形词形(한·두·스무)及用法(日期·年龄·时间)说明，韩语学习必备。"
      : isVi
        ? "Chuyển đổi số sang cả số Hán-Hàn (일·이·삼) và số thuần Hàn (하나·둘·셋) cùng lúc. Hướng dẫn cả dạng định ngữ (한·두·스무) và cách dùng (ngày tháng·tuổi·giờ). Kiến thức bắt buộc khi học tiếng Hàn."
        : "Convert numbers into both Sino-Korean (il, i, sam) and Native Korean (hana, dul, set), with attributive forms and when to use each.";
  const keywords = isKo
    ? ["한글 숫자", "한자어 수사", "고유어 수사", "숫자 읽기", "한국어 숫자"]
    : isZh
      ? ["韩文数字", "汉字词数词", "固有词数词", "数字读法", "韩语数字"]
      : isVi
        ? [
            "số tiếng Hàn",
            "số Hán-Hàn",
            "số thuần Hàn",
            "cách đọc số tiếng Hàn",
            "học số đếm tiếng Hàn",
          ]
        : [
          "korean numbers",
          "sino korean numbers",
          "native korean numbers",
          "korean number reader",
          "how to count in korean",
        ];
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/korean-number`,
      languages: buildLanguagesAlt("/korean-number"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/korean-number`,
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

export default async function KoreanNumberPage({
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
        <Breadcrumbs path="/korean-number" locale={localeKey} id="korean-number" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo
              ? "한글 숫자 변환기"
              : isZh
                ? "韩文数字转换器"
                : isVi
                  ? "Bộ chuyển đổi số tiếng Hàn"
                  : "Korean Number Reader"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "숫자를 한자어·고유어 수사로 동시에. 관형사형과 용법(날짜·나이·시간)까지."
              : isZh
                ? "同时以汉字词·固有词数词呈现数字，并附冠形词形与用法(日期·年龄·时间)。"
                : isVi
                  ? "Xem mọi số ở cả dạng số Hán-Hàn và số thuần Hàn cùng lúc, kèm dạng định ngữ và cách dùng."
                  : "See any number in both Sino-Korean and Native Korean, with attributive forms and usage."}
          </p>
        </header>
        <KoreanNumberForm locale={localeKey} />
        <ToolGuide toolKey="korean-number" locale={localeKey} />
      </div>
    </main>
  );
}
