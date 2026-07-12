import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PaintForm } from "@/components/tools/timber/PaintForm";
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
    ? "페인트 양 계산기 — 벽 면적 × 도장 횟수 소요량"
    : isZh
      ? "油漆用量计算器 — 墙面面积 × 涂刷次数算用量"
      : isVi
        ? "Máy tính lượng sơn — diện tích tường × số lớp sơn"
        : "Paint Calculator — coverage, coats & liters needed";
  const description = isKo
    ? "벽 면적과 도장 횟수로 필요한 페인트 양(L)을 즉시 계산. 문·창 면적 자동 차감 + 도포율 + 손실 여유 + 4L/1L 통 개수 환산."
    : isZh
      ? "根据墙面面积和涂刷次数即时计算所需油漆量(L)。自动扣除门窗面积 + 涂布率 + 损耗余量 + 换算4L/1L桶数。"
      : isVi
        ? "Tính ngay lượng sơn cần dùng (L) từ diện tích tường và số lớp sơn. Tự động trừ diện tích cửa ra vào/cửa sổ + định mức phủ + tỷ lệ hao hụt + quy đổi số thùng 4L/1L."
        : "Calculate paint needed (liters) from wall area and number of coats. Auto-deducts doors/windows, applies spread rate, waste, and converts to cans.";
  const keywords = isKo
    ? [
        "페인트 양 계산기",
        "페인트 소요량",
        "도장 면적 계산",
        "페인트 계산",
        "벽 페인트 양",
      ]
    : isZh
      ? [
          "油漆用量计算器",
          "油漆需求量",
          "涂装面积计算",
          "油漆计算",
          "墙面油漆用量",
        ]
      : isVi
        ? [
            "máy tính lượng sơn",
            "cần bao nhiêu sơn",
            "tính diện tích sơn",
            "tính lượng sơn tường",
            "định mức sơn",
          ]
        : [
            "paint calculator",
            "how much paint do i need",
            "paint coverage calculator",
            "wall paint estimator",
            "paint quantity calculator",
          ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/paint-calc`,
      languages: buildLanguagesAlt("/paint-calc"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/paint-calc`,
      locale: locale === "ko" ? "ko_KR" : locale === "zh" ? "zh_CN" : locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function PaintCalcPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const isVi = locale === "vi";
  const localeKey: "ko" | "en" | "zh" | "vi" = isKo ? "ko" : isZh ? "zh" : isVi ? "vi" : "en";

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
            {isKo ? "페인트 양 계산기" : isZh ? "油漆用量计算器" : isVi ? "Máy tính lượng sơn" : "Paint Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "벽 면적과 도장 횟수만 넣으면 필요한 페인트 양(L)과 통 개수를 즉시 산출. 문·창 자동 차감 + 손실 여유 포함."
              : isZh
                ? "只需输入墙面面积和涂刷次数，即可立即算出所需油漆量(L)与桶数。自动扣除门窗面积 + 含损耗余量。"
                : isVi
                  ? "Chỉ cần nhập diện tích tường và số lớp sơn để có ngay lượng sơn (L) và số thùng cần mua. Tự động trừ diện tích cửa/cửa sổ + gồm tỷ lệ hao hụt."
                  : "Enter wall area and coats to get the liters of paint and number of cans you need. Auto-deducts doors and windows, includes waste."}
          </p>
        </header>
        <PaintForm locale={localeKey} />
        <ToolGuide toolKey="paint-calc" locale={localeKey} />
      </div>
    </main>
  );
}
