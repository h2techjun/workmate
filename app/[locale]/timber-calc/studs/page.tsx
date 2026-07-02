import type { Metadata } from "next";
import { ToolGuide } from "@/components/tools/ToolGuide";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { StudsForm } from "@/components/tools/timber/StudsForm";
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
  const title = isKo
    ? "스터드(각목) 본수 계산기 — 벽 길이 × 층고 × 간격"
    : "Stud Framing Calculator — wall length × ceiling × spacing";
  const description = isKo
    ? "벽 길이·층고·스터드 간격(16\"/24\")·개구부 개수만 입력하면 2×4 SPF 각목 본수, 1본 길이, 탑·솔 플레이트 길이, 헤더 본수, 못 개수까지 즉시. 손실률 자동 반영."
    : "Calculate 2×4 SPF stud count, stud length, top/sole plate length, header count, and nails from wall length, ceiling height, and spacing. Auto waste factor.";
  const keywords = isKo
    ? [
        "스터드 계산",
        "각목 본수",
        "2x4 SPF",
        "목조 골조",
        "벽 자재 계산",
        "스터드 간격",
        "16인치 스터드",
        "층고",
        "헤더 보강재",
        "탑 플레이트",
        "솔 플레이트",
        "목조주택 시공",
      ]
    : [
        "stud calculator",
        "wall framing",
        "2x4 SPF studs",
        "stud spacing",
        "header beam",
        "top plate",
        "sole plate",
        "timber framing",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/timber-calc/studs`,
      languages: buildLanguagesAlt("/timber-calc/studs"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/timber-calc/studs`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function StudsPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const localeKey = isKo ? "ko" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/timber-calc`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "목조 계산기" : "Timber Calculators"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "스터드(각목) 본수 계산기" : "Stud Framing Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "벽 길이와 층고만 알면 스터드 본수, 1본 길이, 상하 플레이트, 헤더, 못 개수까지. 16\"/24\" 간격 + 개구부 보강재 (jack/king/header) 자동 반영."
              : "Enter wall length and ceiling height — get stud count, length, plates, headers, and nails. Supports 16\"/24\" spacing + opening reinforcement (jack/king/header) auto-calculated."}
          </p>
        </header>
        <StudsForm locale={localeKey} />
        <ToolGuide toolKey="timber-studs" locale={locale !== "ko" ? "en" : "ko"} />
      </div>
    </main>
  );
}
