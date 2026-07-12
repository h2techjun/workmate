import type { Metadata } from "next";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { WeeklyRestPayForm } from "@/components/tools/labor/WeeklyRestPayForm";
import { CalculatorJsonLd } from "@/components/seo/StructuredData";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

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
  const localeKey: "ko" | "en" | "zh" | "vi" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";
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
      <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs
          path="/labor-calc/weekly-rest-pay"
          locale={localeKey}
          id="weekly-rest-pay"
        />

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
        <ToolGuide
          toolKey="labor-weekly-rest-pay"
          locale={localeKey}
        />

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
