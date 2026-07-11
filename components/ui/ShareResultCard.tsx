"use client";

import { ShareButton } from "@/components/ui/ShareButton";
import { cn } from "@/lib/utils/cn";
import { ACCENT_HEX, type ArcadeAccent } from "@/lib/arcadeAccent";

/**
 * 다크 아케이드 퍼즐 톤의 결과 카드 — "정답 공개"처럼 핵심 수치를 퍼즐 타일로
 * 리빌하고, 성취 배지 + Wordle식 이모지 바 + 원탭 공유를 한 카드에 담는다.
 *
 * 설계 계약: CLAUDE.md "🕹️ 다크 아케이드 퍼즐 디자인 시스템".
 * 공유 텍스트(이모지 바 포함)는 lib/share/emojiBar.ts 의 buildShareText 로 조립해 넘긴다.
 * accent 색 팔레트는 lib/arcadeAccent.ts 단일 진실원.
 */

export type BadgeTone = "accent" | "success" | "warning";
export type { ArcadeAccent };

export interface ResultBadge {
  text: string;
  tone?: BadgeTone;
}

interface ShareResultCardProps {
  /** 상단 라벨 (예: "월 실수령액") */
  label: string;
  /** 표시 수치 — 포맷된 문자열 (예: "3,520,000"). 숫자 문자는 타일로 리빌 */
  value: string;
  /** 수치 단위 (예: "원") */
  unit?: string;
  /** 이모지 바 (segmentBar/ratioBar 결과). 없으면 미표시 */
  bar?: string;
  /** 이모지 바 스크린리더 설명 (시각 장식이므로 의미를 텍스트로 보완) */
  barLabel?: string;
  /** 성취 배지들 */
  badges?: ReadonlyArray<ResultBadge>;
  /** 공유 본문 (이모지 바 포함 권장). ShareButton 이 URL 자동 첨부 */
  shareText: string;
  /** 공유 버튼 라벨 (i18n) */
  shareLabel: string;
  /** 복사 완료 라벨 (i18n) */
  copiedLabel: string;
  /** 도구 테마 색 — 타일 글로우·상단 바. 기본 indigo */
  accent?: ArcadeAccent;
  className?: string;
}

const badgeToneClass: Record<BadgeTone, string> = {
  accent: "game-badge",
  success: "game-badge game-badge-success",
  warning: "game-badge game-badge-warning",
};

/** 수치 문자열을 타일(숫자)과 구분자(쉼표 등)로 분해해 순차 팝 리빌 */
function ValueTiles({ value }: { value: string }): React.ReactElement {
  let tileIndex = 0;
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      {Array.from(value).map((ch, i) => {
        if (/\d/.test(ch)) {
          const delay = tileIndex * 55;
          tileIndex += 1;
          return (
            <span
              key={i}
              className="arcade-tile animate-tile-pop"
              style={{ animationDelay: `${delay}ms` }}
            >
              {ch}
            </span>
          );
        }
        return (
          <span
            key={i}
            aria-hidden="true"
            className="self-end pb-1.5 text-2xl font-black text-[color:var(--color-text-tertiary)]"
          >
            {ch}
          </span>
        );
      })}
    </div>
  );
}

export function ShareResultCard({
  label,
  value,
  unit,
  bar,
  barLabel,
  badges,
  shareText,
  shareLabel,
  copiedLabel,
  accent = "indigo",
  className,
}: ShareResultCardProps): React.ReactElement {
  const hex = ACCENT_HEX[accent];
  return (
    <section
      aria-live="polite"
      style={{ ["--card-accent" as string]: hex }}
      className={cn("arcade-card animate-pop-in p-5 md:p-6", className)}
    >
      {/* 상단 컬러 액센트 바 — 도구 테마 색 포인트 */}
      <span
        aria-hidden="true"
        className="mb-4 block h-1.5 w-16 rounded-full"
        style={{ background: `linear-gradient(90deg, ${hex}, transparent)` }}
      />

      <div className="mb-4 flex items-start justify-between gap-3">
        <p className="text-xs font-bold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          {label}
        </p>
        <ShareButton text={shareText} label={shareLabel} copiedLabel={copiedLabel} />
      </div>

      <div className="flex flex-wrap items-end gap-x-2.5 gap-y-2">
        <ValueTiles value={value} />
        {unit && (
          <span className="pb-1 text-xl font-bold text-[color:var(--color-text-secondary)] md:text-2xl">
            {unit}
          </span>
        )}
      </div>

      {badges && badges.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {badges.map((badge, i) => (
            <span key={i} className={badgeToneClass[badge.tone ?? "accent"]}>
              {badge.text}
            </span>
          ))}
        </div>
      )}

      {bar && (
        <p
          className="mt-4 select-all text-lg leading-none tracking-[0.15em] md:text-xl"
          role="img"
          aria-label={barLabel ?? label}
        >
          {bar}
        </p>
      )}
    </section>
  );
}
