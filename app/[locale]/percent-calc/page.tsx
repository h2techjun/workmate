import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PercentCalc } from "@/components/tools/unit/PercentCalc";
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
  const isVi = locale === "vi";
  const title = isKo
    ? "퍼센트 계산기 — 인상·할인·변화율·역산 5가지 모드"
    : isVi
      ? "Máy tính phần trăm — 5 chế độ (tăng, giảm giá, thay đổi, tính ngược)"
      : "Percent Calculator — 5 modes (increase, sale, change, reverse)";
  const description = isKo
    ? "X의 Y%, 인상/할인 후 가격, 변화율(%), 역산(인상 후가 Z면 원본은?) — 5가지 모드 통합. VAT 10%·세일 30% 같은 자주 쓰는 퍼센트 프리셋 제공."
    : isVi
      ? "Máy tính phần trăm tất cả trong một: Y% của X, tăng/giảm giá, tỷ lệ thay đổi, tính ngược. Có sẵn các mẫu thường dùng (VAT 10%, giảm giá 30%)."
      : "All-in-one percent calc: Y% of X, increase/decrease, change rate, reverse. Common presets (VAT 10%, sale 30%).";
  const keywords = isKo
    ? [
        "퍼센트 계산기",
        "퍼센트 계산",
        "할인율 계산",
        "인상율 계산",
        "변화율 계산",
        "마진 계산",
        "세일 가격",
        "퍼센트 역산",
        "10퍼센트 계산",
        "30퍼센트 할인",
      ]
    : isVi
      ? [
          "máy tính phần trăm",
          "tính phần trăm",
          "tính tỷ lệ giảm giá",
          "tính tỷ lệ tăng giá",
          "tính tỷ lệ thay đổi",
          "tính lợi nhuận",
          "giá sau giảm giá",
          "tính ngược phần trăm",
          "tính 10 phần trăm",
          "giảm giá 30 phần trăm",
        ]
      : [
        "percent calculator",
        "percentage change",
        "sale price calculator",
        "discount calculator",
        "markup calculator",
        "reverse percentage",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/percent-calc`,
      languages: buildLanguagesAlt("/percent-calc"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/percent-calc`,
      locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function PercentCalcPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const isVi = locale === "vi";
  const localeKey: "ko" | "en" | "vi" = isKo ? "ko" : isVi ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "툴 모음" : isVi ? "Tất cả công cụ" : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "퍼센트 계산기" : isVi ? "Máy tính phần trăm" : "Percent Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "쇼핑·연봉 협상·세금·통계 — 일상의 모든 퍼센트 계산. 입력 즉시 결과 + 변화량까지."
              : isVi
                ? "Mua sắm, đàm phán lương, thuế, thống kê — mọi phép tính phần trăm trong đời sống. Kết quả tức thì kèm mức thay đổi."
                : "Shopping, salary negotiation, taxes, stats — every percent calculation. Live result + delta."}
          </p>
        </header>
        <PercentCalc locale={localeKey} />
        <ToolGuide toolKey="percent-calc" locale={localeKey} />
      </div>
    </main>
  );
}
