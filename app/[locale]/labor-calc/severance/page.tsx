import type { Metadata } from "next";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { SeveranceForm } from "@/components/tools/labor/SeveranceForm";
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
    namespace: "severanceTool.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/labor-calc/severance`,
      languages: buildLanguagesAlt("/labor-calc/severance"),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${SITE_URL}/${locale}/labor-calc/severance`,
      type: "website",
    },
    keywords: [
      "퇴직금 계산기",
      "퇴직금 계산법",
      "평균임금 산정",
      "통상임금 비교 퇴직금",
      "근로자퇴직급여보장법",
      "severance pay calculator korea",
    ],
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function SeverancePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const localeKey = (locale === "ko" ? "ko" : locale === "vi" ? "vi" : "en") as Locale;
  const t = await getTranslations({
    locale: localeKey,
    namespace: "severanceTool",
  });

  const url = `${SITE_URL}/${localeKey}/labor-calc/severance`;

  return (
    <>
      <CalculatorJsonLd
        name={t("meta.title")}
        description={t("meta.description")}
        url={url}
        applicationCategory="BusinessApplication"
      />
      <BreadcrumbJsonLd
        id="severance"
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

        <SeveranceForm />
        <ToolGuide toolKey="labor-severance" locale={localeKey} />

        <section className="mt-12 grid gap-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:grid-cols-3">
          <ContextBlock title={t("ctx.law.title")} body={t("ctx.law.body")} />
          <ContextBlock
            title={t("ctx.average.title")}
            body={t("ctx.average.body")}
          />
          <ContextBlock
            title={t("ctx.dc.title")}
            body={t("ctx.dc.body")}
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
