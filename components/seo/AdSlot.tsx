"use client";

import { useEffect, useRef } from "react";

interface AdSlotProps {
  /** 광고 슬롯 ID — AdSense 대시보드에서 발급받은 data-ad-slot. */
  slot: string;
  /**
   * 광고 위치 키워드 (디버깅·분석용).
   * "result-bottom" / "tool-sidebar" / "guide-mid" 등.
   */
  position?: string;
  /** 광고 형식 — "auto" 가 기본 (반응형). */
  format?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  /** 광고 레이아웃 — 인 아티클 광고에 "in-article" 등. */
  layout?: string;
  /** 컨테이너 클래스. */
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

/**
 * Google AdSense 광고 슬롯 — 환경변수 설정 시에만 활성화.
 *
 * 동작:
 *   - NEXT_PUBLIC_ADSENSE_CLIENT 미설정 → 아무것도 렌더하지 않음 (production)
 *   - 개발 모드 (NODE_ENV !== production) → 회색 placeholder 박스
 *   - production + ENV 설정 → 실제 AdSense `<ins>` + push 호출
 *
 * 사용:
 *   <AdSlot slot="1234567890" position="result-bottom" />
 *
 * 광고 슬롯 ID 발급 방법:
 *   1. AdSense → 광고 → 광고 단위별 → "디스플레이 광고" 만들기
 *   2. 발급받은 data-ad-slot 값을 슬롯 prop 에 입력
 *   3. 페이지 종류별로 다른 슬롯 ID 사용 권장 (성과 분리 측정)
 */
export function AdSlot({
  slot,
  position,
  format = "auto",
  layout,
  className = "",
}: AdSlotProps): React.ReactElement | null {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  const insRef = useRef<HTMLModElement | null>(null);
  const pushedRef = useRef(false);

  useEffect(() => {
    if (!client || pushedRef.current || !insRef.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle ?? []).push({});
      pushedRef.current = true;
    } catch {
      // adsbygoogle 미로드 등 — 무시 (다음 렌더에서 재시도). 의도적 silent.
    }
  }, [client]);

  if (!client) {
    if (process.env.NODE_ENV === "development") {
      return (
        <div
          aria-hidden
          className={`my-6 rounded-lg border border-dashed border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]/40 p-6 text-center text-xs text-[color:var(--color-text-tertiary)] ${className}`}
        >
          [Ad placeholder — slot:{slot}{position ? ` · ${position}` : ""}]
        </div>
      );
    }
    return null;
  }

  return (
    <div className={`my-6 ${className}`} data-ad-position={position}>
      <ins
        ref={insRef}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={client}
        data-ad-slot={slot}
        data-ad-format={format}
        data-ad-layout={layout}
        data-full-width-responsive="true"
      />
    </div>
  );
}
