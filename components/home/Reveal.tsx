"use client";

import { useEffect, useRef, useState } from "react";

type RevealState = "initial" | "hidden" | "visible";

interface RevealProps {
  children: React.ReactNode;
  /** stagger 용 등장 지연 (ms) */
  delayMs?: number;
  className?: string;
}

/**
 * 스크롤 진입 시 fade-up 리빌.
 * SSR/JS 미로드 상태에서는 클래스 없이 그대로 보이므로 콘텐츠가 가려지지 않는다.
 * hydration 후에만 숨김 → IntersectionObserver 로 표시 전환.
 */
export function Reveal({
  children,
  delayMs = 0,
  className,
}: RevealProps): React.ReactElement {
  const ref = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<RevealState>("initial");

  useEffect(() => {
    const el = ref.current;
    if (el === null) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setState("visible");
      return;
    }

    setState("hidden");
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setState("visible");
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const revealClass =
    state === "hidden" ? "reveal" : state === "visible" ? "reveal is-visible" : "";

  return (
    <div
      ref={ref}
      className={`${revealClass} ${className ?? ""}`.trim()}
      style={delayMs > 0 ? { transitionDelay: `${delayMs}ms` } : undefined}
    >
      {children}
    </div>
  );
}
