import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";

interface PageProps {
  params: Promise<{ locale: string }>;
}

interface SubTool {
  slug: string;
}

const SUB_TOOLS: ReadonlyArray<SubTool> = [
  { slug: "annual-leave" },
  { slug: "weekly-rest-pay" },
  { slug: "severance" },
  { slug: "min-wage-monthly" },
];

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "laborCalcHub.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/labor-calc`,
      languages: buildLanguagesAlt("/labor-calc"),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      url: `${SITE_URL}/${locale}/labor-calc`,
      type: "website",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function LaborCalcHub({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const localeKey = (locale === "en" ? "en" : "ko") as Locale;
  const t = await getTranslations({
    locale: localeKey,
    namespace: "laborCalcHub",
  });

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
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

      <div className="grid gap-4 md:grid-cols-2">
        {SUB_TOOLS.map((tool) => (
          <ToolCard
            key={tool.slug}
            slug={tool.slug}
            locale={localeKey}
            title={t(`tools.${tool.slug}.title`)}
            description={t(`tools.${tool.slug}.description`)}
          />
        ))}
      </div>
      </div>
    </main>
  );
}

interface ToolCardProps {
  slug: string;
  locale: Locale;
  title: string;
  description: string;
}

function ToolCard({
  slug,
  locale,
  title,
  description,
}: ToolCardProps): React.ReactElement {
  const cls =
    "group relative overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-6 transition-all";

  return (
    <Link
      href={`/${locale}/labor-calc/${slug}`}
      className={`${cls} hover:border-[color:var(--color-border-strong)] hover:shadow-lg`}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-70" />
      <div className="flex items-start justify-between">
        <h2 className="text-xl font-bold text-[color:var(--color-text-primary)]">
          {title}
        </h2>
        <ArrowRight
          size={18}
          className="text-[color:var(--color-text-tertiary)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[color:var(--color-text-primary)]"
        />
      </div>
      <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-tertiary)]">
        {description}
      </p>
    </Link>
  );
}
