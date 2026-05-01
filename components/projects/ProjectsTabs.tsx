"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import type { Locale } from "@/i18n";
import {
  PROJECTS_CATALOG,
  TAB_LABEL,
  TAB_TAGLINE,
  TAB_ORDER,
  STATUS_LABEL,
  resolveProjectUrl,
  type ProjectEntry,
  type ProjectTab,
  type ProjectStatus,
} from "@/lib/projectsCatalog";

interface ProjectsTabsProps {
  localeKey: Locale;
  labels: {
    open: string;
    external: string;
    comingSoon: string;
  };
}

/**
 * /projects 의 탭 인터랙션 — 게임 / 체험 / 서비스 중 하나만 표시.
 *
 * 첫 진입 시 가장 앞 탭(games) 활성. 탭은 페이지 새로고침 없이 즉시 전환.
 */
export function ProjectsTabs({
  localeKey,
  labels,
}: ProjectsTabsProps): React.ReactElement {
  const [activeTab, setActiveTab] = useState<ProjectTab>("games");
  const projects = PROJECTS_CATALOG.filter((p) => p.tab === activeTab).sort(
    (a, b) => a.order - b.order,
  );

  return (
    <>
      <nav
        role="tablist"
        aria-label="Project categories"
        className="mb-2 flex flex-wrap gap-2"
      >
        {TAB_ORDER.map((tab) => {
          const isActive = tab === activeTab;
          const count = PROJECTS_CATALOG.filter((p) => p.tab === tab).length;
          return (
            <button
              key={tab}
              type="button"
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(tab)}
              className={`group flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-all ${
                isActive
                  ? "border-transparent bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/30"
                  : "border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] text-[color:var(--color-text-secondary)] hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text-primary)]"
              }`}
            >
              <span>{TAB_LABEL[tab][localeKey]}</span>
              <span
                className={`grid h-5 min-w-5 place-items-center rounded-full px-1.5 text-[11px] font-bold tabular-nums ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-tertiary)]"
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </nav>

      <p className="mb-8 text-sm text-[color:var(--color-text-tertiary)]">
        {TAB_TAGLINE[activeTab][localeKey]}
      </p>

      <div
        key={activeTab}
        role="tabpanel"
        className="grid animate-fade-up gap-5 md:grid-cols-2"
      >
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            localeKey={localeKey}
            labels={labels}
          />
        ))}
      </div>
    </>
  );
}

interface ProjectCardProps {
  project: ProjectEntry;
  localeKey: Locale;
  labels: {
    open: string;
    external: string;
    comingSoon: string;
  };
}

function ProjectCard({
  project,
  localeKey,
  labels,
}: ProjectCardProps): React.ReactElement {
  const copy = project.i18n[localeKey];
  const url = resolveProjectUrl(project);
  const isExternal = project.hostType === "external";
  const showOpen = url !== "#";

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-6 transition-all hover:border-[color:var(--color-border-strong)] hover:shadow-lg md:p-7">
      <div
        className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${project.accent} opacity-70`}
      />

      <div className="mb-4 flex items-start justify-between gap-3">
        <StatusBadge status={project.status} localeKey={localeKey} />
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

      <h3 className="text-2xl font-bold tracking-tight text-[color:var(--color-text-primary)]">
        {copy.title}
      </h3>
      <p className="mt-1 text-sm font-medium text-[color:var(--color-text-secondary)]">
        {copy.tagline}
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-[color:var(--color-text-tertiary)]">
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
            <span>{labels.open}</span>
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

interface StatusBadgeProps {
  status: ProjectStatus;
  localeKey: Locale;
}

function StatusBadge({ status, localeKey }: StatusBadgeProps): React.ReactElement {
  const color: Record<ProjectStatus, string> = {
    live: "border-emerald-500/40 text-emerald-400 bg-emerald-500/10",
    beta: "border-amber-500/40 text-amber-400 bg-amber-500/10",
    wip: "border-slate-500/40 text-slate-400 bg-slate-500/10",
    archived: "border-rose-500/40 text-rose-400 bg-rose-500/10",
  };
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[11px] font-semibold ${color[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "live"
            ? "bg-emerald-400"
            : status === "beta"
              ? "bg-amber-400"
              : status === "wip"
                ? "bg-slate-400"
                : "bg-rose-400"
        }`}
      />
      {STATUS_LABEL[status][localeKey]}
    </span>
  );
}

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
