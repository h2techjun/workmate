import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Ruler,
  Boxes,
  Cable,
  Construction,
  Layers,
  Mountain,
  StretchHorizontal,
  Triangle,
  TrendingUp,
} from "lucide-react";
import type { Locale } from "@/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const titles: Record<Locale, string> = {
    ko: "목조 주택 계산기 | WorkTool",
    en: "Timber Construction Calculator | WorkTool",
  };
  const descriptions: Record<Locale, string> = {
    ko: "부재 경간·단열 R/U값·자재 수량 등 KS 표준과 건축법에 준거한 목조 시공 계산기 모음.",
    en: "Span, R/U-value, material quantity, and more — timber construction calculators based on KS standards and Korean building code.",
  };
  return {
    title: titles[locale as Locale] ?? titles.ko,
    description: descriptions[locale as Locale] ?? descriptions.ko,
    alternates: {
      languages: {
        ko: "/ko/timber-calc",
        en: "/en/timber-calc",
      },
    },
  };
}

interface CalcEntry {
  slug: string;
  Icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
  highlight?: boolean;
}

export default async function TimberCalcPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "timberCalc",
  });
  const tLayout = await getTranslations({
    locale: locale as Locale,
    namespace: "layout",
  });

  // Tier 1 — 핵심 (구조·단열·수량)
  const tier1: CalcEntry[] = [
    {
      slug: "span",
      Icon: Ruler,
      title: t("span.title"),
      description: t("span.description"),
      highlight: true,
    },
    {
      slug: "insulation",
      Icon: Layers,
      title: t("insulation.title"),
      description: t("insulation.description"),
      highlight: true,
    },
    {
      slug: "material-quantity",
      Icon: Cable,
      title: t("materialQuantity.title"),
      description: t("materialQuantity.description"),
      highlight: true,
    },
  ];

  // Tier 2 — 보조 (지붕·계단·기초)
  const tier2: CalcEntry[] = [
    {
      slug: "stairs",
      Icon: StretchHorizontal,
      title: t("stairs.title"),
      description: t("stairs.description"),
    },
    {
      slug: "rafter",
      Icon: Triangle,
      title: t("rafter.title"),
      description: t("rafter.description"),
    },
    {
      slug: "roof-pitch",
      Icon: TrendingUp,
      title: t("roofPitch.title"),
      description: t("roofPitch.description"),
    },
    {
      slug: "roof-area",
      Icon: Mountain,
      title: t("roofArea.title"),
      description: t("roofArea.description"),
    },
    {
      slug: "concrete",
      Icon: Construction,
      title: t("concrete.title"),
      description: t("concrete.description"),
    },
    {
      slug: "lumber",
      Icon: Boxes,
      title: t("lumber.title"),
      description: t("lumber.description"),
    },
  ];

  const renderCard = (c: CalcEntry, accent: "amber" | "indigo"): React.ReactElement => {
    const accentClasses =
      accent === "indigo"
        ? "bg-gradient-to-br from-indigo-500/20 to-purple-500/10 ring-indigo-500/30"
        : "bg-gradient-to-br from-amber-500/20 to-orange-500/10 ring-amber-500/30";
    const iconColor = accent === "indigo" ? "text-indigo-300" : "text-amber-300";
    const ctaColor = accent === "indigo" ? "text-indigo-300" : "text-amber-300";

    return (
      <Link
        key={c.slug}
        href={`/${locale}/timber-calc/${c.slug}`}
        className="block"
      >
        <article className="surface-card group flex h-full flex-col p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-bg-card-hover)]">
          <div
            className={`mb-4 grid h-11 w-11 place-items-center rounded-xl ring-1 ${accentClasses}`}
          >
            <c.Icon className={`h-5 w-5 ${iconColor}`} />
          </div>
          <h3 className="text-lg font-semibold">{c.title}</h3>
          <p className="mt-2 flex-1 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            {c.description}
          </p>
          <div
            className={`mt-5 flex items-center gap-1.5 text-sm font-semibold ${ctaColor} transition-colors group-hover:text-white`}
          >
            <span>{tLayout("open")}</span>
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </div>
        </article>
      </Link>
    );
  };

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}`}
            className="transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            {t("breadcrumb.home")}
          </Link>
          <span className="text-[color:var(--color-text-muted)]">/</span>
          <span className="text-[color:var(--color-text-primary)]">
            {t("breadcrumb.current")}
          </span>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-3xl text-[color:var(--color-text-secondary)]">
            {t("subtitle")}
          </p>
        </header>

        {/* Tier 1 — 핵심 */}
        <section className="mb-10">
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
            {t("hub.tier1")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tier1.map((c) => renderCard(c, "indigo"))}
          </div>
        </section>

        {/* Tier 2 — 보조 */}
        <section>
          <h2 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
            {t("hub.tier2")}
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tier2.map((c) => renderCard(c, "amber"))}
          </div>
        </section>
      </div>
    </main>
  );
}
