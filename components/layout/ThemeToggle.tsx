"use client";

import { Sun, Moon } from "lucide-react";

const STORAGE_KEY = "wm-theme";
const LIGHT_META_COLOR = "#f6f7fb";
const DARK_META_COLOR = "#07080b";

interface ThemeToggleProps {
  /** 서버에서 번역된 aria-label (테마 상태와 무관한 정적 문구) */
  label: string;
}

/**
 * 라이트/다크 토글 — 상태를 React 가 아닌 html[data-theme] 속성으로만 관리.
 *
 * 아이콘 표시는 globals.css 의 .theme-icon-sun / .theme-icon-moon 셀렉터가
 * 담당하므로 SSR 시 테마를 몰라도 hydration mismatch 가 없다.
 * 초기 적용은 layout head 의 인라인 스크립트(FOUC 가드)가 수행.
 */
export function ThemeToggle({ label }: ThemeToggleProps): React.ReactElement {
  const toggle = (): void => {
    const root = document.documentElement;
    const next = root.getAttribute("data-theme") === "light" ? "dark" : "light";

    if (next === "light") {
      root.setAttribute("data-theme", "light");
    } else {
      root.removeAttribute("data-theme");
    }

    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // storage 차단 환경(시크릿 모드 등)에서는 세션 한정 전환만 적용
    }

    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) {
      meta.setAttribute(
        "content",
        next === "light" ? LIGHT_META_COLOR : DARK_META_COLOR,
      );
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={label}
      title={label}
      className="grid h-9 w-9 shrink-0 place-items-center rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-bg-card-hover)] hover:text-[color:var(--color-text-primary)]"
    >
      <Sun className="theme-icon-sun h-4 w-4" aria-hidden="true" />
      <Moon className="theme-icon-moon h-4 w-4" aria-hidden="true" />
    </button>
  );
}
