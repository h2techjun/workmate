import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n";
import { SITE_URL } from "@/lib/siteConfig";
import { SeveranceForm } from "@/components/tools/labor/SeveranceForm";
import {
  CalculatorJsonLd,
  BreadcrumbJsonLd,
} from "@/components/seo/StructuredData";

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
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}/labor-calc/severance`]),
      ),
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
  const localeKey = (locale === "en" ? "en" : "ko") as Locale;
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

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
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
