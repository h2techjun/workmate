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
    ? "단열재 두루마리 매수 — 벽·천장 면적 → 인슐레이션 배트"
    : "Insulation Batt Calculator — wall and ceiling rolls";
  const description = isKo
    ? "벽·천장 면적을 입력하면 R-19 글라스울 두루마리 매수를 즉시. 손실률 10% 기본. 그라스울·미네랄울 호환."
    : "Calculate R-19 fiberglass batt rolls from wall/ceiling area. Default 10% waste. Glasswool/mineral wool compatible.";
  const keywords = isKo
    ? [
        "단열재 계산",
        "단열재 매수",
        "그라스울 계산",
        "미네랄울",
        "R19",
        "R값 단열",
        "인슐레이션",
        "에너지 절약",
        "단열재 시공",
      ]
    : ["insulation calculator", "fiberglass batts", "R-19 insulation", "wall insulation", "ceiling insulation"];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/timber-calc/insulation-batt`,
      languages: buildLanguagesAlt("/timber-calc/insulation-batt"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/timber-calc/insulation-batt`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function InsulationBattPage({
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
            {isKo ? "단열재 두루마리 매수 계산기" : "Insulation Batt Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "벽·천장 면적을 입력하면 R-19 글라스울 두루마리 매수를 즉시. 단열 등급은 별표1 (에너지절약설계기준) 참고."
              : "Enter wall/ceiling area — get R-19 fiberglass batt roll count. Reference Korean Energy Code Annex 1 for R-value."}
          </p>
        </header>
        <MaterialQuantityForm lockedMaterial="battInsulationR19" />
      </div>
    </main>
  );
}
