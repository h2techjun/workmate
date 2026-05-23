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
    ? "합판 매수 계산기 — 면적 → 합판 매수 + 못 개수"
    : "Plywood Sheet Calculator — area to sheets and nails";
  const description = isKo
    ? "벽·바닥·지붕 면적과 손실률만 입력하면 합판 매수와 못 개수까지 즉시. 4×8자(1.2×2.4m) 표준 18mm 합판 기준. 무료."
    : "Calculate plywood sheets and nail count from area with waste factor. Standard 4×8ft (1.2×2.4m) 18mm plywood. Free.";
  const keywords = isKo
    ? [
        "합판 계산",
        "합판 매수",
        "plywood calculator",
        "12mm 합판",
        "18mm 합판",
        "4x8 합판",
        "1212 합판",
        "벽 합판 자재",
        "바닥 합판",
        "지붕 합판",
      ]
    : ["plywood calculator", "plywood sheets", "4x8 plywood", "18mm plywood", "wall sheathing"];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/timber-calc/plywood`,
      languages: buildLanguagesAlt("/timber-calc/plywood"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/timber-calc/plywood`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function PlywoodPage({
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
            {isKo ? "합판 매수 계산기" : "Plywood Sheet Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "벽·바닥·지붕 시공 면적을 입력하면 18mm 합판 매수와 못 개수까지 즉시. 4×8자 (1.2×2.4m) 표준 규격 기준."
              : "Enter wall/floor/roof area — get 18mm plywood sheets and nail count. Standard 4×8ft (1.2×2.4m)."}
          </p>
        </header>
        <MaterialQuantityForm lockedMaterial="plywood18" />
      </div>
    </main>
  );
}
