"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect, useRef, type ReactNode } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import type { Locale } from "@/i18n";

interface NavItem {
  href: string;
  label: string;
  /** 활성 매칭용 경로 (locale prefix 제외, 예: "/tools") */
  pathMatch: string;
}

interface HeaderNavProps {
  items: ReadonlyArray<NavItem>;
  locale: Locale;
  /** 우측 추가 영역 (LanguageSwitcher 등) */
  children?: ReactNode;
}

/**
 * 헤더 네비 — 데스크탑은 인라인, 모바일은 햄버거 드로어.
 *
 * 활성 메뉴는 현재 경로가 pathMatch 로 시작하면 highlight.
 */
export function HeaderNav({
  items,
  locale,
  children,
}: HeaderNavProps): React.ReactElement {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  // 경로 변경 시 모바일 드로어 자동 닫기
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // 드로어 열릴 때 첫 링크로 포커스 이동
  useEffect(() => {
    if (open) {
      firstLinkRef.current?.focus();
    }
  }, [open]);

  // 활성 매칭: /ko/tools 또는 /ko/tools/... 가 시작이면 active
  const isActive = (pathMatch: string): boolean => {
    if (!pathname) return false;
    const localePrefix = `/${locale}`;
    const relative = pathname.startsWith(localePrefix)
      ? pathname.slice(localePrefix.length)
      : pathname;
    return relative === pathMatch || relative.startsWith(`${pathMatch}/`);
  };

  const linkClass = (active: boolean): string =>
    cn(
      "rounded-lg px-2.5 py-1.5 text-sm font-medium transition-colors md:px-3",
      active
        ? "bg-[color:var(--color-bg-card)] text-[color:var(--color-text-primary)]"
        : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-card)] hover:text-[color:var(--color-text-primary)]",
    );

  return (
    <>
      {/* 데스크탑: 인라인 */}
      <nav className="hidden items-center gap-1 sm:flex md:gap-2">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={linkClass(isActive(item.pathMatch))}
          >
            {item.label}
          </Link>
        ))}
        {children}
      </nav>

      {/* 모바일: 햄버거 + 드로어 */}
      <div className="flex items-center gap-2 sm:hidden">
        {children}
        <button
          type="button"
          aria-label={
            open
              ? locale === "ko"
                ? "메뉴 닫기"
                : "Close menu"
              : locale === "ko"
                ? "메뉴 열기"
                : "Open menu"
          }
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((prev) => !prev)}
          className="grid h-9 w-9 place-items-center rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-bg-card-hover)] hover:text-[color:var(--color-text-primary)]"
        >
          {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </button>
      </div>

      {open && (
        <div
          id="mobile-menu"
          role="dialog"
          aria-modal="true"
          aria-label={locale === "ko" ? "내비게이션 메뉴" : "Navigation menu"}
          className="surface-glass fixed inset-x-0 top-14 z-30 border-b border-[color:var(--color-border-subtle)] sm:hidden"
        >
          <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-3">
            {items.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                ref={index === 0 ? firstLinkRef : undefined}
                className={cn(
                  "rounded-lg px-3 py-2.5 text-base font-medium transition-colors",
                  isActive(item.pathMatch)
                    ? "bg-[color:var(--color-bg-card)] text-[color:var(--color-text-primary)]"
                    : "text-[color:var(--color-text-secondary)] hover:bg-[color:var(--color-bg-card)] hover:text-[color:var(--color-text-primary)]",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
