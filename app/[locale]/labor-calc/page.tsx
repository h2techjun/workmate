import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n";
import { SITE_URL } from "@/lib/siteConfig";

interface PageProps {
  params: Promise<{ locale: string }>;
}

interface SubTool {
  slug: string;
  available: boolean;
}

const SUB_TOOLS: ReadonlyArray<SubTool> = [
  { slug: "annual-leave", available: true },
  { slug: "weekly-rest-pay", available: false },
  { slug: "severance", available: false },
  { slug: "min-wage-monthly", available: false },
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
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}/labor-calc`]),
      ),
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

      <div className="grid gap-4 md:grid-cols-2">
        {SUB_TOOLS.map((tool) => (
          <ToolCard
            key={tool.slug}
            slug={tool.slug}
            available={tool.available}
            locale={localeKey}
            title={t(`tools.${tool.slug}.title`)}
            description={t(`tools.${tool.slug}.description`)}
          />
        ))}
      </div>
    </main>
  );
}

interface ToolCardProps {
  slug: string;
  available: boolean;
  locale: Locale;
  title: string;
  description: string;
}

function ToolCard({
  slug,
  available,
  locale,
  title,
  description,
}: ToolCardProps): React.ReactElement {
  const cls =
    "group relative overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-6 transition-all";

  if (!available) {
    return (
      <div className={`${cls} opacity-60`}>
        <span className="absolute right-4 top-4 rounded-md border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 text-[11px] font-semibold text-amber-300">
          {locale === "ko" ? "준비 중" : "Coming"}
        </span>
        <h2 className="text-xl font-bold text-[color:var(--color-text-primary)]">
          {title}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-tertiary)]">
          {description}
        </p>
      </div>
    );
  }

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
