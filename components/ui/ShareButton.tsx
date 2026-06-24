"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

interface ShareButtonProps {
  /** 공유 제목 (없으면 document.title) */
  title?: string;
  /** 공유 본문 요약 — 결과 수치 포함 권장 (예: "연봉 5,000만원 → 월 실수령 352만원"). 없으면 제목만 */
  text?: string;
  /** 버튼 라벨 (i18n) */
  label: string;
  /** 복사 완료 라벨 (i18n) */
  copiedLabel: string;
}

/**
 * 결과 공유 버튼 — 모바일은 네이티브 공유 시트(Web Share API),
 * 데스크탑은 클립보드 복사로 폴백한다. 잡동사니 없이 단일 버튼만 노출.
 *
 * 과거 제거됐던 PDF/인쇄 버튼 행은 복원하지 않으며, 트래픽 유입(카톡·커뮤니티 공유)
 * 목적의 깔끔한 공유 하나만 제공한다.
 */
export function ShareButton({
  title,
  text,
  label,
  copiedLabel,
}: ShareButtonProps): React.ReactElement {
  const [copied, setCopied] = useState(false);

  async function handleShare(): Promise<void> {
    if (typeof window === "undefined") return;
    const url = window.location.href;
    const shareTitle = title ?? document.title;
    const shareText = text ?? shareTitle;

    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({ title: shareTitle, text: shareText, url });
        return;
      } catch (e) {
        // 사용자가 공유 시트를 취소한 경우는 폴백하지 않음
        if (e instanceof DOMException && e.name === "AbortError") return;
      }
    }

    try {
      await navigator.clipboard.writeText(`${shareText} ${url}`.trim());
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* 클립보드 미지원 환경 무시 */
    }
  }

  return (
    <button
      type="button"
      onClick={handleShare}
      aria-label={label}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] px-3 py-1.5 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-[color:var(--color-accent)] hover:text-[color:var(--color-text-primary)]"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-emerald-400" />
      ) : (
        <Share2 className="h-3.5 w-3.5" />
      )}
      {copied ? copiedLabel : label}
    </button>
  );
}
