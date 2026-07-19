/**
 * 페이지 헤더 통일 — breadcrumb + h1 + subtitle 표준화.
 *
 * 이전 문제: 각 페이지마다 직접 <nav>·<header>·<h1> 마크업 → 간격·hierarchy drift.
 *
 * 사용:
 *   <PageHeader
 *     back={{ href: "/ko/tools", label: "툴 모음" }}
 *     title="종합소득세 계산기"
 *     description="2026 8구간 누진세를 즉시 산출..."
 *   />
 */

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { ReactNode } from "react";

interface BackLink {
  href: string;
  label: string;
}

interface PageHeaderProps {
  title: string;
  description?: ReactNode;
  /** 좌측 상단 뒤로가기 링크 — 도구 페이지는 /tools, 블로그 글은 /blog 등 */
  back?: BackLink;
  /** 우측 영역 (예: tag·필터·액션 버튼) */
  meta?: ReactNode;
  /** title 아래 작은 메타 (작성일·읽기시간 등 — 블로그 글에서 활용) */
  eyebrow?: ReactNode;
}

export function PageHeader({
  title,
  description,
  back,
  meta,
  eyebrow,
}: PageHeaderProps): React.ReactElement {
  return (
    <header className="mb-8">
      {back && (
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={back.href}
            className="inline-flex min-h-11 items-center gap-1 py-2.5 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {back.label}
          </Link>
        </nav>
      )}
      <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-6">
        <div className="min-w-0 flex-1">
          {eyebrow && (
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              {eyebrow}
            </p>
          )}
          <h1 className="text-2xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-3xl">
            {title}
          </h1>
          {description && (
            <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
              {description}
            </p>
          )}
        </div>
        {meta && <div className="shrink-0">{meta}</div>}
      </div>
    </header>
  );
}
