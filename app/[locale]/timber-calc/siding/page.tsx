import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { MaterialQuantityForm } from "@/components/tools/timber/MaterialQuantityForm";
import { locales, type Locale } from "@/i18n";
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
    ? "사이딩 매수 계산기 — 외벽 면적 → 사이딩 보드 매수"
    : "Siding Calculator — exterior wall area to board count";
  const description = isKo
    ? "외벽 면적과 손실률을 입력하면 시멘트 사이딩 보드 매수를 즉시. 처마·창문 공제 손실률 10% 기본. 무료, 회원가입 없음."
    : "Calculate fiber-cement siding board count from exterior wall area with 10% default waste. Free, no signup.";
  const keywords = isKo
    ? [
        "사이딩 계산",
        "사이딩 매수",
        "siding calculator",
        "시멘트 사이딩",
        "파이버 시멘트",
        "외벽 사이딩 자재",
        "사이딩 견적",
        "사이딩 시공",
      ]
    : ["siding calculator", "fiber cement siding", "exterior wall material", "siding board count"];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/timber-calc/siding`,
      languages: buildLanguagesAlt("/timber-calc/siding"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/timber-calc/siding`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function SidingPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale !== "en";
  const localeKey = (isKo ? "ko" : "en") as Locale;

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${localeKey}/timber-calc`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "목조 계산기" : "Timber Calculators"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "사이딩 매수 계산기" : "Siding Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "외벽 면적을 입력하면 파이버 시멘트 사이딩 보드 매수까지. 처마·창문 공제 위해 손실률 10~15% 권장."
              : "Enter exterior wall area — get fiber cement siding board count. 10-15% waste recommended for eaves and windows."}
          </p>
        </header>
        <MaterialQuantityForm lockedMaterial="fiberCementSiding" />
      </div>
    </main>
  );
}
