import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n";
import { SITE_URL, SITE_BRAND } from "@/lib/siteConfig";
import {
  PROJECTS_CATALOG,
  CATEGORY_LABEL,
  STATUS_LABEL,
  resolveProjectUrl,
  type ProjectEntry,
  type ProjectStatus,
} from "@/lib/projectsCatalog";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale !== "en";

  const title = isKo
    ? `메이커 작업물 — ${SITE_BRAND}`
    : `Maker projects — ${SITE_BRAND}`;
  const description = isKo
    ? "Workmate 운영자가 만든 게임·SaaS·실험 프로젝트 모음. K-Poker, 해원문 타워디펜스, 하크루 학원 SaaS 등 한국 실무·콘텐츠 분야 10개 프로젝트."
    : "Indie maker portfolio behind Workmate — games, SaaS, experiments. K-Poker, Defense, Hakrew academy SaaS, and more.";

  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/projects`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}/projects`]),
      ),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/projects`,
      type: "website",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function ProjectsPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale !== "en";
  const localeKey = (isKo ? "ko" : "en") as Locale;
  const t = await getTranslations({ locale: localeKey, namespace: "projects" });

  const sorted = [...PROJECTS_CATALOG].sort((a, b) => a.order - b.order);
  const featured = sorted.filter((p) => p.featured);
  const others = sorted.filter((p) => !p.featured);

  const cardLabels = {
    open: t("cardOpen"),
    current: t("cardCurrent"),
    external: t("cardExternal"),
    comingSoon: t("cardComingSoon"),
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <header className="mb-12 max-w-3xl animate-fade-up">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
          {t("heading")}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
          {t("intro")}
        </p>
      </header>

      <section className="mb-16">
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-tertiary)]">
          {t("featuredHeading")}
        </h2>
        <div className="grid gap-5 md:grid-cols-2">
          {featured.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              localeKey={localeKey}
              variant="featured"
              labels={cardLabels}
            />
          ))}
        </div>
      </section>

      <section className="mb-16">
        <h2 className="mb-6 text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--color-text-tertiary)]">
          {t("otherHeading")}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {others.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              localeKey={localeKey}
              variant="compact"
              labels={cardLabels}
            />
          ))}
        </div>
      </section>

      <section className="surface-card border-t border-[color:var(--color-border-subtle)] pt-10">
        <h2 className="text-xl font-semibold tracking-tight text-[color:var(--color-text-primary)]">
          {t("philosophyHeading")}
        </h2>
        <div className="mt-4 grid gap-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:grid-cols-3">
          <PhilosophyBlock
            title={t("philo1Title")}
            body={t("philo1Body")}
          />
          <PhilosophyBlock
            title={t("philo2Title")}
            body={t("philo2Body")}
          />
          <PhilosophyBlock
            title={t("philo3Title")}
            body={t("philo3Body")}
          />
        </div>
      </section>
    </main>
  );
}

interface CardLabels {
  open: string;
  current: string;
  external: string;
  comingSoon: string;
}

interface ProjectCardProps {
  project: ProjectEntry;
  localeKey: Locale;
  variant: "featured" | "compact";
  labels: CardLabels;
}

function ProjectCard({
  project,
  localeKey,
  variant,
  labels,
}: ProjectCardProps): React.ReactElement {
  const copy = project.i18n[localeKey];
  const url = resolveProjectUrl(project);
  const isExternal = project.hostType === "external";
  const showOpen = url !== "#";

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-6 transition-all hover:border-[color:var(--color-border-strong)] hover:shadow-lg ${
        variant === "featured" ? "md:p-7" : ""
      }`}
    >
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${project.accent} opacity-70`}
      />

      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge accent={project.accent} variant="solid">
            {CATEGORY_LABEL[project.category][localeKey]}
          </Badge>
          <Badge accent={project.accent} variant="outline" status={project.status}>
            {STATUS_LABEL[project.status][localeKey]}
          </Badge>
        </div>
        {project.githubUrl ? (
          <a
            href={project.githubUrl}
            target="_blank"
            rel="noreferrer noopener"
            aria-label="GitHub repository"
            className="rounded-lg p-1.5 text-[color:var(--color-text-tertiary)] opacity-0 transition-all hover:bg-[color:var(--color-bg-elevated)] hover:text-[color:var(--color-text-primary)] group-hover:opacity-100"
          >
            <GithubIcon />
          </a>
        ) : null}
      </div>

      <h3
        className={`font-bold tracking-tight text-[color:var(--color-text-primary)] ${
          variant === "featured" ? "text-2xl" : "text-lg"
        }`}
      >
        {copy.title}
      </h3>
      <p className="mt-1 text-sm font-medium text-[color:var(--color-text-secondary)]">
        {copy.tagline}
      </p>
      <p
        className={`mt-3 leading-relaxed text-[color:var(--color-text-tertiary)] ${
          variant === "featured" ? "text-[15px]" : "text-sm"
        }`}
      >
        {copy.description}
      </p>

      <div className="mt-5 flex flex-wrap gap-1.5">
        {project.techStack.map((tech) => (
          <span
            key={tech}
            className="rounded-md border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] px-2 py-0.5 text-[11px] font-medium text-[color:var(--color-text-secondary)]"
          >
            {tech}
          </span>
        ))}
      </div>

      {showOpen ? (
        isExternal ? (
          <a
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-text-primary)] transition-colors hover:text-indigo-400"
          >
            <ExternalLink size={14} />
            <span>{labels.external}</span>
          </a>
        ) : (
          <Link
            href={url}
            className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-text-primary)] transition-colors hover:text-indigo-400"
          >
            <span>{project.id === "workmate" ? labels.current : labels.open}</span>
            <ArrowUpRight
              size={14}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </Link>
        )
      ) : (
        <p className="mt-5 text-sm text-[color:var(--color-text-tertiary)]">
          {labels.comingSoon}
        </p>
      )}
    </article>
  );
}

interface BadgeProps {
  accent: string;
  variant: "solid" | "outline";
  status?: ProjectStatus;
  children: React.ReactNode;
}

function Badge({ accent, variant, status, children }: BadgeProps): React.ReactElement {
  if (variant === "solid") {
    return (
      <span
        className={`inline-flex rounded-md bg-gradient-to-br ${accent} px-2 py-0.5 text-[11px] font-bold text-white shadow-sm`}
      >
        {children}
      </span>
    );
  }
  const statusColor: Record<ProjectStatus, string> = {
    live: "border-emerald-500/40 text-emerald-400",
    beta: "border-amber-500/40 text-amber-400",
    wip: "border-slate-500/40 text-slate-400",
    archived: "border-rose-500/40 text-rose-400",
  };
  const cls = status ? statusColor[status] : "border-slate-500/40 text-slate-400";
  return (
    <span
      className={`inline-flex rounded-md border px-2 py-0.5 text-[11px] font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}

interface PhilosophyBlockProps {
  title: string;
  body: string;
}

function PhilosophyBlock({ title, body }: PhilosophyBlockProps): React.ReactElement {
  return (
    <div>
      <h3 className="text-sm font-semibold text-[color:var(--color-text-primary)]">
        {title}
      </h3>
      <p className="mt-1.5 text-sm leading-relaxed text-[color:var(--color-text-tertiary)]">
        {body}
      </p>
    </div>
  );
}

/**
 * GitHub 마크 — lucide 의 Github 가 deprecated 되어 인라인 SVG 로 대체.
 */
function GithubIcon(): React.ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      width={16}
      height={16}
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.4 3-.405 1.02.005 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
    </svg>
  );
}
