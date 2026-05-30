/**
 * 페이지 골격 통일 — 모든 페이지의 main 래퍼.
 *
 * 이전 문제: 4가지 다른 padding 패턴 (pt-6/pt-8/py-10/py-12) 혼재.
 * 해결: 페이지 너비별 단일 컴포넌트.
 *
 * 사용:
 *   <PageShell>           // default: max-w-6xl (도구·홈·게임·테스트)
 *   <PageShell width="article">    // max-w-3xl (정책·블로그·about)
 *   <PageShell width="narrow">     // max-w-2xl (이용약관·짧은 콘텐츠)
 */

import type { ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export type PageWidth = "default" | "article" | "narrow" | "wide";

const WIDTH_CLASSES: Record<PageWidth, string> = {
  narrow: "max-w-2xl",
  article: "max-w-3xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
};

interface PageShellProps {
  children: ReactNode;
  width?: PageWidth;
  /** main 추가 클래스 (예: 배경 그라디언트) */
  className?: string;
}

export function PageShell({
  children,
  width = "default",
  className,
}: PageShellProps): React.ReactElement {
  return (
    <main className={cn("px-4 pb-16 pt-6 md:px-6 md:pt-10", className)}>
      <div className={cn("mx-auto", WIDTH_CLASSES[width])}>{children}</div>
    </main>
  );
}
