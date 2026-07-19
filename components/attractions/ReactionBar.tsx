"use client";

import { useState, useEffect, useCallback } from "react";
import type { Locale } from "@/i18n";

type Emoji = "heart" | "thumbsup" | "wow";
type Counts = Record<Emoji, number>;

const REACTIONS: { key: Emoji; icon: string }[] = [
  { key: "heart", icon: "❤️" },
  { key: "thumbsup", icon: "👍" },
  { key: "wow", icon: "😮" },
];

const LABEL: Record<Locale, string> = {
  ko: "이 곳 어때요?",
  en: "How's this place?",
  zh: "这里怎么样？",
  vi: "Nơi này thế nào?",
};

/**
 * 익명 이모지 반응 — IP당 이모지당 1회 토글. optimistic 업데이트 후 서버 카운트로 확정.
 */
export function ReactionBar({
  slug,
  locale,
}: {
  slug: string;
  locale: Locale;
}): React.ReactElement {
  const [counts, setCounts] = useState<Counts>({
    heart: 0,
    thumbsup: 0,
    wow: 0,
  });
  const [active, setActive] = useState<Set<Emoji>>(new Set());
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    fetch(`/api/attractions/${slug}/reactions`)
      .then((r) => r.json())
      .then((d) => {
        if (alive && d?.counts) setCounts(d.counts as Counts);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [slug]);

  const toggle = useCallback(
    async (key: Emoji) => {
      if (busy) return;
      setBusy(true);
      try {
        const res = await fetch(`/api/attractions/${slug}/reactions`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ emoji: key }),
        });
        const d = await res.json();
        if (d?.counts) setCounts(d.counts as Counts);
        setActive((prev) => {
          const next = new Set(prev);
          if (d?.active) next.add(key);
          else next.delete(key);
          return next;
        });
      } catch {
        // 실패 시 조용히 무시(다음 로드 시 서버 카운트로 복구)
      } finally {
        setBusy(false);
      }
    },
    [busy, slug],
  );

  return (
    <div className="flex flex-wrap items-center gap-3">
      <span className="text-sm font-medium text-[color:var(--color-text-secondary)]">
        {LABEL[locale]}
      </span>
      <div className="flex gap-2">
        {REACTIONS.map((r) => (
          <button
            key={r.key}
            type="button"
            onClick={() => toggle(r.key)}
            disabled={busy}
            aria-pressed={active.has(r.key)}
            className={`inline-flex min-h-11 items-center gap-1.5 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors disabled:opacity-60 ${
              active.has(r.key)
                ? "border-rose-400/60 bg-rose-500/15 text-rose-200"
                : "border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] text-[color:var(--color-text-secondary)] hover:border-rose-400/40"
            }`}
          >
            <span aria-hidden="true">{r.icon}</span>
            <span className="tabular-nums">{counts[r.key]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
