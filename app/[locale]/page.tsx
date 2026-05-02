import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight } from "lucide-react";
import { ToolSearch } from "@/components/layout/ToolSearch";
import type { Locale } from "@/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

interface ToolEntry {
  id: string;
  href: string | null;
  available: boolean;
  tag: string;
  title: string;
  description: string;
}

export default async function HomePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "home" });

  const tools: ReadonlyArray<ToolEntry> = [
    {
      id: "electric-calc",
      href: `/${locale}/electric-calc`,
      available: true,
      tag: t("tools.electricCalc.tag"),
      title: t("tools.electricCalc.title"),
      description: t("tools.electricCalc.description"),
    },
    {
      id: "timber-calc",
      href: `/${locale}/timber-calc`,
      available: true,
      tag: t("tools.timberCalc.tag"),
      title: t("tools.timberCalc.title"),
      description: t("tools.timberCalc.description"),
    },
    {
      id: "labor-calc",
      href: `/${locale}/labor-calc`,
      available: true,
      tag: t("tools.laborCalc.tag"),
      title: t("tools.laborCalc.title"),
      description: t("tools.laborCalc.description"),
    },
    {
      id: "insurance-calc",
      href: `/${locale}/insurance-calc`,
      available: true,
      tag: t("tools.insurance.tag"),
      title: t("tools.insurance.title"),
      description: t("tools.insurance.description"),
    },
    {
      id: "vat-calc",
      href: `/${locale}/vat-calc`,
      available: true,
      tag: t("tools.vatCalc.tag"),
      title: t("tools.vatCalc.title"),
      description: t("tools.vatCalc.description"),
    },
    {
      id: "foreign-stock-tax",
      href: `/${locale}/foreign-stock-tax`,
      available: true,
      tag: t("tools.foreignStockTax.tag"),
      title: t("tools.foreignStockTax.title"),
      description: t("tools.foreignStockTax.description"),
    },
    {
      id: "json-csv",
      href: `/${locale}/json-csv`,
      available: true,
      tag: t("tools.jsonCsv.tag"),
      title: t("tools.jsonCsv.title"),
      description: t("tools.jsonCsv.description"),
    },
    {
      id: "biznum-check",
      href: `/${locale}/biznum-check`,
      available: true,
      tag: t("tools.bizNumber.tag"),
      title: t("tools.bizNumber.title"),
      description: t("tools.bizNumber.description"),
    },
    {
      id: "biznum",
      href: null,
      available: false,
      tag: t("tools.biznum.tag"),
      title: t("tools.biznum.title"),
      description: t("tools.biznum.description"),
    },
    {
      id: "msds",
      href: null,
      available: false,
      tag: t("tools.msds.tag"),
      title: t("tools.msds.title"),
      description: t("tools.msds.description"),
    },
  ];

  return (
    <main className="px-4 pb-16 pt-8 md:px-6 md:pt-16">
      <div className="mx-auto max-w-6xl">
        {/* Hero */}
        <section className="mb-12 text-center md:mb-20 md:pt-8">
          <div className="mx-auto inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] px-3 py-1 text-xs font-medium text-[color:var(--color-text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {t("tagline")}
          </div>
          <h1 className="mt-5 bg-gradient-to-br from-white via-white to-[color:var(--color-text-secondary)] bg-clip-text text-4xl font-bold tracking-tight text-transparent md:text-6xl">
            {t("title")}
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-[color:var(--color-text-secondary)] md:text-lg">
            {t("subtitle")}
          </p>
          <div className="mt-8">
            <ToolSearch locale={locale as Locale} />
          </div>
        </section>

        {/* Tools */}
        <section>
          <h2 className="mb-5 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
            {t("toolsHeading")}
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => (
              <ToolCard
                key={tool.id}
                tool={tool}
                openLabel={t("openTool")}
                comingLabel={t("comingSoon")}
              />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

function ToolCard({
  tool,
  openLabel,
  comingLabel,
}: {
  tool: ToolEntry;
  openLabel: string;
  comingLabel: string;
}): React.ReactElement {
  const card = (
    <article
      className={`surface-card group flex h-full flex-col p-5 transition-all duration-200 md:p-6 ${
        tool.available
          ? "hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-bg-card-hover)]"
          : "opacity-60"
      }`}
    >
      <div className="mb-4 flex items-center justify-between">
        <span className="rounded-md border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-secondary)]">
          {tool.tag}
        </span>
        {!tool.available && (
          <span className="text-[10px] font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">
            {comingLabel}
          </span>
        )}
      </div>
      <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)] md:text-xl">
        {tool.title}
      </h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
        {tool.description}
      </p>
      {tool.available && (
        <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-accent-hover)] transition-colors group-hover:text-white">
          {openLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
        </div>
      )}
    </article>
  );

  if (tool.available && tool.href) {
    return (
      <Link href={tool.href} className="block">
        {card}
      </Link>
    );
  }
  return card;
}
