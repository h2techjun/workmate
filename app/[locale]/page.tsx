import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import { ToolSearch } from "@/components/layout/ToolSearch";
import { CountUp } from "@/components/home/CountUp";
import { Reveal } from "@/components/home/Reveal";
import { TOOL_GROUPS, TOOL_GROUP_ORDER } from "@/lib/toolsCatalog";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { locales, type Locale } from "@/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

type Tx = Awaited<ReturnType<typeof getTranslations>>;

interface FlatTool {
  href: string;
  labelKo: string;
  labelEn: string;
  labelZh: string;
  labelVi: string;
  emoji: string;
}

interface LocalizedToolLabels {
  labelKo: string;
  labelEn: string;
  labelZh: string;
  labelVi: string;
}

/** 로케일별 도구 라벨 선택 — ko/zh/vi 는 전용 라벨, 그 외는 en 폴백 (FlatTool·ToolEntry 공용) */
function toolLabel(tool: LocalizedToolLabels, locale: string): string {
  if (locale === "ko") return tool.labelKo;
  if (locale === "zh") return tool.labelZh;
  if (locale === "vi") return tool.labelVi;
  return tool.labelEn;
}

/** GSC 노출 + 한국 검색량 기반 인기 도구 — 라벨은 toolsCatalog 단일 진실원에서 조회 */
const POPULAR_TOOLS = [
  { href: "/net-salary", i18nKey: "netSalary", emoji: "💼" },
  { href: "/area-convert", i18nKey: "areaConvert", emoji: "📐" },
  { href: "/percent-calc", i18nKey: "percentCalc", emoji: "🔢" },
  { href: "/biznum-check", i18nKey: "biznumCheck", emoji: "🏢" },
  { href: "/electric-bill", i18nKey: "electricBill", emoji: "💡" },
  { href: "/korean-age", i18nKey: "koreanAge", emoji: "🎂" },
] as const;

/** 인기 카드 상단 컬러 바 — 절제된 캔디 팔레트(indigo·emerald·amber·rose·cyan·violet) 순환 */
const POPULAR_ACCENTS = [
  "#818cf8",
  "#34d399",
  "#fbbf24",
  "#fb7185",
  "#22d3ee",
  "#a78bfa",
] as const;

const ROLL_KEYS = [
  "heroRoll1",
  "heroRoll2",
  "heroRoll3",
  "heroRoll4",
  "heroRoll5",
] as const;

export default async function HomePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const t = await getTranslations({ locale: locale as Locale, namespace: "home" });
  const isKo = locale === "ko";

  const groups = TOOL_GROUP_ORDER.map((id) =>
    TOOL_GROUPS.find((g) => g.id === id),
  ).filter((g): g is NonNullable<typeof g> => Boolean(g));

  const allTools: ReadonlyArray<FlatTool> = groups.flatMap((group) =>
    group.tools.map((tool) => ({
      href: tool.href,
      labelKo: tool.labelKo,
      labelEn: tool.labelEn,
      labelZh: tool.labelZh,
      labelVi: tool.labelVi,
      emoji: group.emoji,
    })),
  );
  const toolCount = allTools.length;
  const toolByHref = new Map(allTools.map((tool) => [tool.href, tool]));

  const marqueeRowA = allTools.filter((_, i) => i % 2 === 0);
  const marqueeRowB = allTools.filter((_, i) => i % 2 === 1);

  const latestPosts = [...BLOG_POSTS]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .slice(0, 3);

  return (
    <main>
      <HeroSection
        t={t}
        locale={locale}
        toolCount={toolCount}
        toolByHref={toolByHref}
      />
      <MarqueeSection
        t={t}
        locale={locale}
        toolCount={toolCount}
        rowA={marqueeRowA}
        rowB={marqueeRowB}
      />
      <PopularSection t={t} locale={locale} toolByHref={toolByHref} />
      <CategoriesSection
        t={t}
        locale={locale}
        groups={groups}
        toolCount={toolCount}
      />
      <StatsSection t={t} toolCount={toolCount} groupCount={groups.length} />
      <NotesSection t={t} locale={locale} isKo={isKo} posts={latestPosts} />
      <MakerSection t={t} locale={locale} />
    </main>
  );
}

/* ── Hero ──────────────────────────────────────────────────────────────── */

function HeroSection({
  t,
  locale,
  toolCount,
  toolByHref,
}: {
  t: Tx;
  locale: string;
  toolCount: number;
  toolByHref: ReadonlyMap<string, FlatTool>;
}): React.ReactElement {
  return (
    <section className="relative overflow-hidden">
      <div aria-hidden="true" className="hero-aurora hero-aurora-a" />
      <div aria-hidden="true" className="hero-aurora hero-aurora-b" />
      <div aria-hidden="true" className="hero-dots" />

      <div className="relative mx-auto max-w-6xl px-4 pb-14 pt-12 md:px-6 md:pb-20 md:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)]/80 px-3 py-1 text-xs font-medium text-[color:var(--color-text-secondary)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
              </span>
              {t("badge", { tools: toolCount })}
            </div>

            <h1 className="mt-6 break-keep text-4xl font-extrabold leading-[1.18] tracking-tight text-[color:var(--color-text-primary)] md:text-6xl md:leading-[1.12]">
              {t("heroLine1")}
              <br />
              <span className="hero-roll" aria-hidden="true">
                {ROLL_KEYS.map((key, i) => (
                  <span
                    key={key}
                    className="hero-roll-word"
                    style={{ animationDelay: `${i * 2.6}s` }}
                  >
                    {t(key)}
                  </span>
                ))}
              </span>
              <span className="sr-only">{t("heroRoll1")}</span>
              <span className="block">{t("heroLine2End")}</span>
            </h1>

            <p className="mt-5 max-w-xl break-keep text-base leading-relaxed text-[color:var(--color-text-secondary)] md:text-lg">
              {t("heroSubtitle", { tools: toolCount })}
            </p>

            <div className="mt-8 max-w-xl [&>div]:mx-0">
              <ToolSearch locale={locale as Locale} />
            </div>

            <div className="mt-5 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                {t("popularChipsLabel")}
              </span>
              {POPULAR_TOOLS.map((item) => {
                const tool = toolByHref.get(item.href);
                if (tool === undefined) return null;
                return (
                  <Link
                    key={item.href}
                    href={`/${locale}${item.href}`}
                    className="rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)]/70 px-3 py-1.5 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-indigo-400/50 hover:text-[color:var(--color-text-primary)]"
                  >
                    {toolLabel(tool, locale)}
                  </Link>
                );
              })}
            </div>
          </div>

          <FloatingCards t={t} locale={locale} />
        </div>
      </div>
    </section>
  );
}

function FloatingCards({
  t,
  locale,
}: {
  t: Tx;
  locale: string;
}): React.ReactElement {
  return (
    <div className="relative hidden h-[420px] lg:block">
      <Link
        href={`/${locale}/area-convert`}
        className="float-card absolute right-8 top-0 block w-[260px]"
        style={{ "--tilt": "-2deg", animationDuration: "8s" } as React.CSSProperties}
      >
        <div className="surface-card relative overflow-hidden p-4 shadow-2xl shadow-black/40 transition-colors hover:border-rose-400/40">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-rose-400/70 to-transparent"
          />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
            {t("floatAreaLabel")}
          </p>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)] tabular-nums">
            {t("floatAreaExpr")}
          </p>
          <p className="mt-1 text-xl font-bold text-[color:var(--color-text-primary)] tabular-nums">
            {t("floatAreaResult")}
          </p>
        </div>
      </Link>

      <Link
        href={`/${locale}/vat-calc`}
        className="float-card absolute left-0 top-36 block w-[270px]"
        style={{
          "--tilt": "1.5deg",
          animationDuration: "9.5s",
          animationDelay: "-3s",
        } as React.CSSProperties}
      >
        <div className="surface-card relative overflow-hidden p-4 shadow-2xl shadow-black/40 transition-colors hover:border-amber-400/40">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-amber-400/70 to-transparent"
          />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
            {t("floatVatLabel")}
          </p>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)] tabular-nums">
            {t("floatVatExpr")}
          </p>
          <p className="mt-1 text-xl font-bold text-[color:var(--color-text-primary)] tabular-nums">
            {t("floatVatResult")}
          </p>
        </div>
      </Link>

      <Link
        href={`/${locale}/net-salary`}
        className="float-card absolute bottom-0 right-0 block w-[280px]"
        style={{
          "--tilt": "-1deg",
          animationDuration: "11s",
          animationDelay: "-6s",
        } as React.CSSProperties}
      >
        <div className="surface-card relative overflow-hidden p-4 shadow-2xl shadow-indigo-950/50 ring-1 ring-indigo-500/30 transition-shadow hover:shadow-indigo-900/60">
          <div
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-indigo-400/80 via-cyan-400/50 to-transparent"
          />
          <p className="text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
            {t("floatSalaryLabel")}
          </p>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)] tabular-nums">
            {t("floatSalaryExpr")}
          </p>
          <p className="mt-1 text-xl font-bold text-[color:var(--color-text-primary)]">
            {t("floatSalaryQuestion")}
          </p>
          <p className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-accent-hover)]">
            {t("floatSalaryCta")}
            <ArrowRight className="h-4 w-4" />
          </p>
        </div>
      </Link>
    </div>
  );
}

/* ── Marquee ───────────────────────────────────────────────────────────── */

function MarqueeSection({
  t,
  locale,
  toolCount,
  rowA,
  rowB,
}: {
  t: Tx;
  locale: string;
  toolCount: number;
  rowA: ReadonlyArray<FlatTool>;
  rowB: ReadonlyArray<FlatTool>;
}): React.ReactElement {
  return (
    <section className="border-y border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]/40 py-8 md:py-10">
      <p className="px-4 text-center text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-tertiary)]">
        {t("marqueeLabel", { tools: toolCount })}
      </p>
      <div className="marquee mt-6">
        <div
          className="marquee-track"
          style={{ "--marquee-duration": "85s" } as React.CSSProperties}
        >
          <MarqueeRow tools={rowA} locale={locale} />
          <MarqueeRow tools={rowA} locale={locale} decorative />
        </div>
      </div>
      <div className="marquee mt-3">
        <div
          className="marquee-track marquee-track-reverse"
          style={{ "--marquee-duration": "70s" } as React.CSSProperties}
        >
          <MarqueeRow tools={rowB} locale={locale} />
          <MarqueeRow tools={rowB} locale={locale} decorative />
        </div>
      </div>
    </section>
  );
}

function MarqueeRow({
  tools,
  locale,
  decorative = false,
}: {
  tools: ReadonlyArray<FlatTool>;
  locale: string;
  decorative?: boolean;
}): React.ReactElement {
  const chipClass =
    "flex shrink-0 items-center gap-2 rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] px-4 py-2 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:border-indigo-400/50 hover:text-[color:var(--color-text-primary)]";

  return (
    <ul
      className="flex shrink-0 gap-3 pr-3"
      aria-hidden={decorative ? "true" : undefined}
    >
      {tools.map((tool) => {
        const label = toolLabel(tool, locale);
        return (
          <li key={tool.href} className="shrink-0">
            {decorative ? (
              <span className={chipClass}>
                <span aria-hidden="true">{tool.emoji}</span>
                {label}
              </span>
            ) : (
              <Link href={`/${locale}${tool.href}`} className={chipClass}>
                <span aria-hidden="true">{tool.emoji}</span>
                {label}
              </Link>
            )}
          </li>
        );
      })}
    </ul>
  );
}

/* ── Popular tools ─────────────────────────────────────────────────────── */

function PopularSection({
  t,
  locale,
  toolByHref,
}: {
  t: Tx;
  locale: string;
  toolByHref: ReadonlyMap<string, FlatTool>;
}): React.ReactElement {
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
          {t("popularSub")}
        </p>
        <h2 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          {t("popularHeading")}
        </h2>
      </Reveal>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {POPULAR_TOOLS.map((item, i) => {
          const tool = toolByHref.get(item.href);
          if (tool === undefined) return null;
          return (
            <Reveal key={item.href} delayMs={(i % 3) * 80} className="h-full">
              <Link
                href={`/${locale}${item.href}`}
                className="arcade-card-interactive group relative flex h-full flex-col overflow-hidden p-6 hover:bg-[color:var(--color-bg-card-hover)]"
              >
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-0 top-0 h-1"
                  style={{
                    background: `linear-gradient(90deg, ${POPULAR_ACCENTS[i % POPULAR_ACCENTS.length]}, transparent)`,
                  }}
                />
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-4 right-2 select-none text-[88px] font-black leading-none text-white/[0.04] transition-colors duration-300 group-hover:text-indigo-400/15"
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden="true" className="text-2xl">
                  {item.emoji}
                </span>
                <h3 className="mt-3 text-lg font-bold text-[color:var(--color-text-primary)]">
                  {toolLabel(tool, locale)}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                  {t(`popular.${item.i18nKey}`)}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-accent-hover)]">
                  {t("openTool")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ── Category grid ─────────────────────────────────────────────────────── */

function CategoriesSection({
  t,
  locale,
  groups,
  toolCount,
}: {
  t: Tx;
  locale: string;
  groups: ReadonlyArray<(typeof TOOL_GROUPS)[number]>;
  toolCount: number;
}): React.ReactElement {
  const localeKey =
    locale === "ko" || locale === "zh" || locale === "vi"
      ? (locale as Locale)
      : ("en" as Locale);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 md:px-6 md:pb-24">
      <Reveal>
        <h2 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          {t("categoriesHeading")}
        </h2>
        <p className="mt-2 text-base text-[color:var(--color-text-secondary)]">
          {t("categoriesSub", { groups: groups.length, tools: toolCount })}
        </p>
      </Reveal>

      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {groups.map((group, i) => {
          const copy = group.i18n[localeKey];
          const hubTarget = `/${locale}${group.hubHref ?? group.tools[0]?.href ?? ""}`;
          const visibleTools = group.tools.slice(0, 6);
          const restCount = group.tools.length - visibleTools.length;

          return (
            <Reveal key={group.id} delayMs={(i % 3) * 80} className="h-full">
              <article className="arcade-card group relative h-full overflow-hidden p-6 transition-transform duration-200 hover:-translate-y-0.5">
                <div
                  aria-hidden="true"
                  className={`pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r ${group.accent} opacity-60 transition-opacity group-hover:opacity-100`}
                />
                <Link href={hubTarget} className="flex items-start gap-3">
                  <span aria-hidden="true" className="text-2xl">
                    {group.emoji}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-1.5 text-lg font-bold text-[color:var(--color-text-primary)]">
                      <span className="truncate">{copy.title}</span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 opacity-50 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:opacity-100" />
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-[color:var(--color-text-tertiary)]">
                      {copy.tagline}
                    </span>
                  </span>
                </Link>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {visibleTools.map((tool) => (
                    <Link
                      key={tool.href}
                      href={`/${locale}${tool.href}`}
                      className="rounded-md border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] px-2.5 py-1 text-xs text-[color:var(--color-text-secondary)] transition-colors hover:border-indigo-400/50 hover:text-[color:var(--color-text-primary)]"
                    >
                      {toolLabel(tool, locale)}
                    </Link>
                  ))}
                  {restCount > 0 && (
                    <Link
                      href={hubTarget}
                      className="rounded-md border border-dashed border-[color:var(--color-border-default)] px-2.5 py-1 text-xs font-semibold text-[color:var(--color-text-tertiary)] transition-colors hover:border-indigo-400/50 hover:text-[color:var(--color-text-primary)]"
                    >
                      {t("moreTools", { count: restCount })}
                    </Link>
                  )}
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ── Stats ─────────────────────────────────────────────────────────────── */

function StatsSection({
  t,
  toolCount,
  groupCount,
}: {
  t: Tx;
  toolCount: number;
  groupCount: number;
}): React.ReactElement {
  const numberClass =
    "bg-gradient-to-br from-indigo-300 via-[color:var(--color-text-primary)] to-cyan-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent tabular-nums md:text-5xl";

  const stats = [
    { key: "statsTools", value: toolCount, suffix: "" },
    { key: "statsCategories", value: groupCount, suffix: "" },
    { key: "statsLanguages", value: locales.length, suffix: "" },
    { key: "statsSources", value: 100, suffix: "%" },
  ] as const;

  return (
    <section className="border-y border-[color:var(--color-border-subtle)] bg-gradient-to-b from-transparent via-indigo-500/[0.05] to-transparent">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-10 px-4 py-14 md:grid-cols-4 md:px-6 md:py-16">
        {stats.map((stat) => (
          <div key={stat.key} className="text-center">
            <CountUp
              value={stat.value}
              suffix={stat.suffix}
              className={numberClass}
            />
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              {t(stat.key)}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── Field notes (blog) ────────────────────────────────────────────────── */

function NotesSection({
  t,
  locale,
  isKo,
  posts,
}: {
  t: Tx;
  locale: string;
  isKo: boolean;
  posts: ReadonlyArray<(typeof BLOG_POSTS)[number]>;
}): React.ReactElement {
  const dateFormat = new Intl.DateTimeFormat(isKo ? "ko-KR" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 md:px-6 md:py-24">
      <Reveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
              {t("notesSub")}
            </p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
              {t("notesHeading")}
            </h2>
          </div>
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            {t("notesAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </Reveal>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        {posts.map((post, i) => (
          <Reveal key={post.slug} delayMs={i * 80} className="h-full">
            <Link
              href={`/${locale}/blog/${post.slug}`}
              className="arcade-card-interactive group flex h-full flex-col p-6 hover:bg-[color:var(--color-bg-card-hover)]"
            >
              <div className="flex items-center gap-2 text-xs text-[color:var(--color-text-tertiary)]">
                <time dateTime={post.publishedAt}>
                  {dateFormat.format(new Date(post.publishedAt))}
                </time>
                <span aria-hidden="true">·</span>
                <span>{t("readMinutes", { minutes: post.readingMinutes })}</span>
              </div>
              <h3 className="mt-3 text-lg font-bold leading-snug text-[color:var(--color-text-primary)]">
                {isKo ? post.titleKo : post.titleEn}
              </h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                {isKo ? post.summaryKo : post.summaryEn}
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-accent-hover)]">
                {t("readPost")}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </span>
            </Link>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ── Maker hub CTA ─────────────────────────────────────────────────────── */

function MakerSection({
  t,
  locale,
}: {
  t: Tx;
  locale: string;
}): React.ReactElement {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 md:px-6 md:pb-28">
      <Reveal>
        <div className="rounded-3xl bg-gradient-to-r from-indigo-500/50 via-fuchsia-500/30 to-cyan-400/50 p-px">
          <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-[#0b0d13] px-6 py-10 md:px-12 md:py-14">
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-3xl"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-20 -left-10 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl"
            />
            <div className="relative flex flex-wrap items-center justify-between gap-6">
              <div className="max-w-xl">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-300/90">
                  {t("makerEyebrow")}
                </p>
                <h2 className="mt-2 text-2xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-3xl">
                  {t("makerTitle")}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
                  {t("makerDesc")}
                </p>
              </div>
              <Link href={`/${locale}/games`} className="btn-primary">
                {t("makerCta")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </div>
      </Reveal>

      <Reveal delayMs={120}>
        <p className="mt-10 text-center text-sm text-[color:var(--color-text-tertiary)]">
          {t("ctaTitle")}{" "}
          <Link
            href={`/${locale}/contact`}
            className="font-semibold text-[color:var(--color-accent-hover)] underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            {t("ctaButton")}
          </Link>
        </p>
      </Reveal>
    </section>
  );
}
