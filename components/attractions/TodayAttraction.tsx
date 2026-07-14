"use client";

import { useState, useEffect } from "react";
import { AttractionCard } from "./AttractionCard";
import {
  pickTodayAttraction,
  publishedAttractions,
} from "@/lib/attractionsFeature";
import { ATTRACTIONS, type AttractionEntry } from "@/lib/attractionsCatalog";
import type { Locale } from "@/i18n";

/**
 * "오늘의 명소" — 클라이언트 전용 렌더.
 *
 * 순수 SSG(ISR·cron 없음) 제약에서 매일 다른 명소를 피처하기 위해, 서버·최초
 * 클라이언트 렌더는 동일한 스켈레톤을 그리고(→ 하이드레이션 mismatch 0),
 * useEffect 에서 실제 오늘(KST) 명소로 교체한다. 스켈레톤은 카드와 같은
 * aspect-ratio 로 CLS 를 방지한다.
 */
export function TodayAttraction({
  locale,
}: {
  locale: Locale;
}): React.ReactElement {
  const [today, setToday] = useState<AttractionEntry | null>(null);

  useEffect(() => {
    const now = new Date();
    setToday(pickTodayAttraction(publishedAttractions(ATTRACTIONS, now), now));
  }, []);

  if (!today) {
    return (
      <div className="overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)]">
        <div className="aspect-[4/3] animate-pulse bg-[color:var(--color-bg-elevated)]" />
        <div className="space-y-2 p-4">
          <div className="h-5 w-1/2 animate-pulse rounded bg-[color:var(--color-bg-elevated)]" />
          <div className="h-4 w-full animate-pulse rounded bg-[color:var(--color-bg-elevated)]" />
        </div>
      </div>
    );
  }

  return <AttractionCard attraction={today} locale={locale} priority />;
}
