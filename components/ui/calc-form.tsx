"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/cn";
import { AdSlot } from "@/components/seo/AdSlot";
import { ShareButton } from "@/components/ui/ShareButton";
import { OfferSlot } from "@/components/seo/OfferSlot";
import { accentFromPath, ACCENT_HEX } from "@/lib/arcadeAccent";

/** 결과 직후 노출할 관련 도구·글 링크 (전환·체류 강화) */
export interface RelatedLink {
  label: string;
  /** locale prefix 제외 경로 (예: "/compound-calc", "/blog/...") */
  href: string;
}

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
        "rounded-2xl border-2 border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-3.5",
        full && "col-span-2",
      )}
    >
      <dt className="text-xs font-semibold tracking-wide text-[color:var(--color-text-tertiary)]">
        {label}
      </dt>
      <dd className={cn("mt-1 text-lg font-bold tabular-nums", toneClass)}>
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
    <div
      className="animate-pop-in rounded-2xl border-2 p-5"
      style={{
        borderColor:
          "color-mix(in srgb, var(--card-accent, #818cf8) 30%, var(--color-border-subtle))",
        background:
          "linear-gradient(160deg, color-mix(in srgb, var(--card-accent, #818cf8) 15%, transparent), transparent)",
        boxShadow: "0 0 30px -14px var(--card-accent, #818cf8)",
      }}
    >
      <p className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
        {label}
      </p>
      <p className="mt-1 flex items-baseline gap-1.5">
        <span className="text-4xl font-extrabold tracking-tight text-[color:var(--color-text-hero)] tabular-nums md:text-5xl">
          {value}
        </span>
        {unit && (
          <span className="text-xl font-bold text-[color:var(--color-text-primary)] opacity-75 md:text-2xl">
            {unit}
          </span>
        )}
      </p>
    </div>
  );
}

export function ResultShell({
  heading,
  shareText,
  relatedLinks,
  toolKey,
  locale = "ko",
  children,
}: {
  heading: string;
  /** 공유 본문 요약 (결과 수치 포함 권장). 없으면 페이지 제목으로 공유 */
  shareText?: string;
  /** 결과 직후 노출할 관련 도구·글 (전환·체류 강화). 없으면 미표시 */
  relatedLinks?: ReadonlyArray<RelatedLink>;
  /** 맥락 제휴 오퍼 키 (lib/offers.ts). 오퍼 없으면 미노출(휴면) */
  toolKey?: string;
  /** relatedLinks href prefix·라벨 로케일. 기본 ko */
  locale?: "ko" | "en" | "vi" | "zh";
  children: ReactNode;
}): React.ReactElement {
  const t = useTranslations("share");
  const hex = ACCENT_HEX[accentFromPath(usePathname())];
  return (
    <>
      <section
        aria-live="polite"
        style={{ ["--card-accent" as string]: hex }}
        className="arcade-card animate-pop-in overflow-hidden p-5 md:p-7"
      >
        <span
          aria-hidden="true"
          className="mb-4 block h-1.5 w-16 rounded-full"
          style={{ background: `linear-gradient(90deg, ${hex}, transparent)` }}
        />
        <div className="mb-5 flex items-center justify-between gap-3">
          <h2 className="flex min-w-0 items-center gap-2 text-xl font-extrabold text-[color:var(--color-text-primary)]">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full"
              style={{ background: hex }}
            />
            <span className="truncate">{heading}</span>
          </h2>
          <ShareButton
            text={shareText}
            label={t("button")}
            copiedLabel={t("copied")}
          />
        </div>
        {children}
        <OfferSlot toolKey={toolKey} locale={locale} />
        {relatedLinks && relatedLinks.length > 0 && (
          <div className="mt-6 border-t border-[color:var(--color-border-subtle)] pt-4">
            <p className="mb-2.5 text-xs font-semibold tracking-wide text-[color:var(--color-text-tertiary)]">
              {locale === "zh"
                ? "相关工具"
                : locale !== "ko"
                  ? "Related tools"
                  : "함께 보면 좋아요"}
            </p>
            <div className="flex flex-wrap gap-2">
              {relatedLinks.map((l) => (
                <Link
                  key={l.href}
                  href={`/${locale}${l.href}`}
                  className="inline-flex items-center gap-1 rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] px-3 py-1.5 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:border-indigo-500/40 hover:text-indigo-300"
                >
                  {l.label}
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>
        )}
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
      <ol className="space-y-2 rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
        {items.map((it, i) => (
          <li key={i} className="flex gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-[10px] font-bold text-indigo-300">
              {i + 1}
            </span>
            <span>{it}</span>
          </li>
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
    <div className="space-y-1 border-t border-[color:var(--color-border-subtle)] pt-3 text-xs leading-relaxed text-[color:var(--color-text-tertiary)]">
      {lines.map((l, i) => (
        <p key={i}>{l}</p>
      ))}
    </div>
  );
}
