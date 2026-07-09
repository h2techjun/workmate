import type { Metadata } from "next";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { WeeklyRestPayForm } from "@/components/tools/labor/WeeklyRestPayForm";
import {
  CalculatorJsonLd,
  BreadcrumbJsonLd,
} from "@/components/seo/StructuredData";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "weeklyRestPayTool.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/labor-calc/weekly-rest-pay`,
      languages: buildLanguagesAlt("/labor-calc/weekly-rest-pay"),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${SITE_URL}/${locale}/labor-calc/weekly-rest-pay`,
      type: "website",
    },
    keywords: [
      "주휴수당 계산기",
      "주휴수당 계산",
      "주휴수당 발생 조건",
      "단시간 근로자 주휴수당",
      "주 15시간 주휴",
      "근로기준법 55조",
    ],
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function WeeklyRestPayPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const localeKey: "ko" | "en" | "vi" =
    locale === "ko" ? "ko" : locale === "vi" ? "vi" : "en";
  const t = await getTranslations({
    locale: localeKey,
    namespace: "weeklyRestPayTool",
  });

  const url = `${SITE_URL}/${localeKey}/labor-calc/weekly-rest-pay`;

  return (
    <>
      <CalculatorJsonLd
        name={t("meta.title")}
        description={t("meta.description")}
        url={url}
        applicationCategory="BusinessApplication"
      />
      <BreadcrumbJsonLd
        id="weekly-rest-pay"
        items={[
          { name: t("breadcrumb.home"), url: `${SITE_URL}/${localeKey}` },
          {
            name: t("breadcrumb.labor"),
            url: `${SITE_URL}/${localeKey}/labor-calc`,
          },
          { name: t("meta.title"), url },
        ]}
      />

      <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/labor-calc`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {locale === "ko" ? "연봉·근로" : "Payroll"}
          </Link>
        </nav>

        <header className="mb-8 max-w-3xl animate-fade-up">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
            {t("eyebrow")}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
            {t("heading")}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[color:var(--color-text-secondary)]">
            {t("intro")}
          </p>
        </header>

        <WeeklyRestPayForm />
        <ToolGuide toolKey="labor-weekly-rest-pay" locale={localeKey} />

        <section className="mt-12 grid gap-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:grid-cols-3">
          <ContextBlock title={t("ctx.law.title")} body={t("ctx.law.body")} />
          <ContextBlock
            title={t("ctx.formula.title")}
            body={t("ctx.formula.body")}
          />
          <ContextBlock
            title={t("ctx.exception.title")}
            body={t("ctx.exception.body")}
          />
        </section>
        </div>
      </main>
    </>
  );
}

function ContextBlock({
  title,
  body,
}: {
  title: string;
  body: string;
}): React.ReactElement {
  return (
    <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-5">
      <h2 className="text-sm font-semibold text-[color:var(--color-text-primary)]">
        {title}
      </h2>
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-tertiary)]">
        {body}
      </p>
    </div>
  );
}
