import Link from "next/link";
import { ArrowRight, GraduationCap, BookOpen } from "lucide-react";
import { CROSS_LINKS } from "@/lib/crossLinks";

/**
 * K-생태계 크로스링크 섹션 — 계산기 하단(ToolGuide 안).
 *  - learn: Loopla 한국어 학습(/learn) 유도 카드. 4로케일(ko/en/zh/vi) 라벨.
 *  - reads: 관련 생활 가이드·글. blog/guide 가 ko/en 콘텐츠라 ko/en 방문자에게만 노출.
 * zh/vi 방문자는 learn 카드만 보여 "한국어 학습" 으로 유도한다(K-생태계 핵심 동선).
 */
const LEARN_COPY = {
  ko: { heading: "이 주제, 한국어로도 익혀보세요", cta: "한국어 학습 시작" },
  en: { heading: "Learn the Korean behind this", cta: "Start learning Korean" },
  zh: { heading: "顺便学一学相关韩语", cta: "开始学韩语" },
  vi: { heading: "Học luôn tiếng Hàn liên quan", cta: "Bắt đầu học tiếng Hàn" },
} as const;

const READS_HEADING = {
  ko: "함께 보면 좋은 글",
  en: "Related reads",
  zh: "延伸阅读",
  vi: "Bài viết liên quan",
} as const;

export function CrossLinks({
  toolKey,
  locale,
}: {
  toolKey: string;
  locale: "ko" | "en" | "zh" | "vi";
}): React.ReactElement | null {
  const entry = CROSS_LINKS[toolKey];
  if (!entry) return null;

  const learnCopy = LEARN_COPY[locale];
  // blog/guide 는 4로케일 콘텐츠 → 방문자 로케일 그대로 노출
  const readsLang = locale;
  const showReads = entry.reads !== undefined && entry.reads.length > 0;

  if (!entry.learn && !showReads) return null;

  return (
    <div className="mt-10 space-y-5 border-t border-[color:var(--color-border-subtle)] pt-8">
      {entry.learn && (
        <Link
          href={`/${locale}/learn`}
          className="group flex items-center justify-between gap-4 rounded-xl border border-cyan-500/25 bg-gradient-to-r from-cyan-500/10 via-cyan-500/5 to-transparent p-4 transition-colors hover:border-cyan-400/50"
        >
          <span className="flex items-center gap-3">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-cyan-500/15 text-cyan-300">
              <GraduationCap className="h-5 w-5" />
            </span>
            <span className="text-sm font-semibold text-[color:var(--color-text-primary)] md:text-base">
              {learnCopy.heading}
            </span>
          </span>
          <span className="inline-flex shrink-0 items-center gap-1 text-sm font-semibold text-cyan-300">
            {learnCopy.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      )}

      {showReads && entry.reads && (
        <div>
          <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
            {READS_HEADING[readsLang]}
          </h3>
          <div className="flex flex-wrap gap-2">
            {entry.reads.map((r) => (
              <Link
                key={r.href}
                href={`/${locale}${r.href}`}
                className="inline-flex items-center gap-1.5 rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] px-3.5 py-1.5 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:border-indigo-500/40 hover:text-indigo-300"
              >
                <BookOpen className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                {r[readsLang]}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
