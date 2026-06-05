"use client";

import type { ReactNode } from "react";
// PDF/인쇄·공유 버튼은 사용자 요청으로 제거됨 (계산 결과만 표시).
import { cn } from "@/lib/utils/cn";
import { AdSlot } from "@/components/seo/AdSlot";

const RESULT_AD_SLOT =
  (process.env.NEXT_PUBLIC_ADSENSE_RESULT_SLOT?.trim() ?? "") || "0000000001";
const PAGE_BOTTOM_AD_SLOT =
  (process.env.NEXT_PUBLIC_ADSENSE_PAGE_BOTTOM_SLOT?.trim() ?? "") ||
  "0000000002";

export function FieldGroup({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}): React.ReactElement {
  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
        {title}
      </h3>
      <div className="space-y-3.5">{children}</div>
    </div>
  );
}

export function Field({
  label,
  hint,
  error,
  children,
}: {
  label: string;
  hint?: string;
  error?: string;
  children: ReactNode;
}): React.ReactElement {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
        {label}
      </span>
      {children}
      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
      {hint && !error && (
        <p className="mt-1.5 text-xs leading-relaxed text-[color:var(--color-text-muted)]">
          {hint}
        </p>
      )}
    </label>
  );
}

export type StatTone = "default" | "success" | "warning" | "danger";

export function Stat({
  label,
  value,
  tone = "default",
  full = false,
}: {
  label: string;
  value: string;
  tone?: StatTone;
  full?: boolean;
}): React.ReactElement {
  const toneClass = {
    default: "text-white",
    success: "text-emerald-300",
    warning: "text-amber-300",
    danger: "text-red-300",
  }[tone];

  return (
    <div
      className={cn(
        "rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-3.5",
        full && "col-span-2",
      )}
    >
      <dt className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
        {label}
      </dt>
      <dd className={cn("mt-1 font-semibold tabular-nums", toneClass)}>
        {value}
      </dd>
    </div>
  );
}

/** 결과 패널의 핵심 단일 수치를 강조하는 hero 카드 */
export function HeroResult({
  label,
  value,
  unit,
}: {
  label: string;
  value: string;
  unit?: string;
}): React.ReactElement {
  return (
    <div className="rounded-xl bg-gradient-to-br from-indigo-500/15 via-indigo-500/5 to-transparent p-5 ring-1 ring-indigo-500/20">
      <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
        {label}
      </p>
      <p className="mt-1 flex items-baseline gap-1.5">
        <span className="text-4xl font-bold tracking-tight text-[#eef0f5] tabular-nums md:text-5xl">
          {value}
        </span>
        {unit && (
          <span className="text-xl font-semibold text-[color:var(--color-text-secondary)] md:text-2xl">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

export function ResultShell({
  heading,
  children,
}: {
  heading: string;
  children: ReactNode;
  /** @deprecated PDF/인쇄·공유 버튼 제거됨 — prop 호환만 유지 */
  showActions?: boolean;
  /** @deprecated */
  shareLabel?: string;
  /** @deprecated */
  shareCopiedLabel?: string;
  /** @deprecated */
  printLabel?: string;
}): React.ReactElement {
  return (
    <>
      <section
        aria-live="polite"
        className="surface-card overflow-hidden p-5 md:p-7"
      >
        <h2 className="mb-5 flex items-center gap-2 text-lg font-semibold text-[color:var(--color-text-primary)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[color:var(--color-accent)]" />
          {heading}
        </h2>
        {children}
      </section>
      {/* 결과 직후 광고 — 사용자가 가치를 막 받은 시점 = 가장 단가 높은 위치 */}
      <div>
        <AdSlot slot={RESULT_AD_SLOT} position="result-bottom" format="auto" />
      </div>
    </>
  );
}

export function FormShell({
  children,
  ...props
}: React.FormHTMLAttributes<HTMLFormElement>): React.ReactElement {
  return (
    <form
      noValidate
      {...props}
      className={cn(
        "surface-card animate-fade-up overflow-hidden p-5 md:p-7",
        props.className,
      )}
    >
      <div className="space-y-7">{children}</div>
    </form>
  );
}

export function CalcLayout({
  children,
}: {
  children: ReactNode;
}): React.ReactElement {
  return (
    <>
      <div className="grid gap-6 lg:grid-cols-[1fr,1.1fr] lg:gap-8">
        {children}
      </div>
      {/* 페이지 하단 광고 — 출처 박스 아래 자리, 스크롤 끝까지 본 사용자 타깃 */}
      <div className="no-print mt-8">
        <AdSlot
          slot={PAGE_BOTTOM_AD_SLOT}
          position="page-bottom"
          format="auto"
        />
      </div>
    </>
  );
}

export function ActionRow({
  primary,
  secondary,
}: {
  primary: ReactNode;
  secondary?: ReactNode;
}): React.ReactElement {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center">
      {secondary}
      <div className="flex-1 flex">{primary}</div>
    </div>
  );
}

export function EmptyResult({
  message,
}: {
  message: string;
}): React.ReactElement {
  return (
    <div className="flex min-h-[200px] flex-col items-center justify-center rounded-xl border border-dashed border-[color:var(--color-border-subtle)] p-6 text-center">
      <p className="text-sm text-[color:var(--color-text-tertiary)]">{message}</p>
    </div>
  );
}

export function ErrorBox({
  message,
}: {
  message: string;
}): React.ReactElement {
  return (
    <div
      role="alert"
      className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
    >
      {message}
    </div>
  );
}

export function WarningsBox({
  title,
  items,
}: {
  title: string;
  items: string[];
}): React.ReactElement {
  return (
    <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs text-amber-200">
      <h3 className="mb-2 font-semibold">{title}</h3>
      <ul className="list-inside list-disc space-y-1.5 leading-relaxed">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ul>
    </div>
  );
}

export function StepsBox({
  title,
  items,
}: {
  title: string;
  items: string[];
}): React.ReactElement {
  return (
    <div>
      <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
        {title}
      </h3>
      <ol className="space-y-1.5 rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
        {items.map((it, i) => (
          <li key={i}>{it}</li>
        ))}
      </ol>
    </div>
  );
}

export function SourceBox({
  lines,
}: {
  lines: string[];
}): React.ReactElement {
  return (
    <div className="border-t border-[color:var(--color-border-subtle)] pt-3 text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
      {lines.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
    </div>
  );
}
