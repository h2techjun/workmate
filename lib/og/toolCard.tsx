import { ImageResponse } from "next/og";

/**
 * OG 카드 단일 진실원 — 공유 링크 미리보기용 1200×630 브랜드 카드.
 *
 * 사이트 전역(opengraph-image.tsx)과 개별 도구 페이지가 동일한 비주얼을 공유한다.
 * 도구별 카드는 headline 에 그 도구 이름을 넣어 링크 미리보기를 구분시킨다.
 */

export const OG_SIZE = { width: 1200, height: 630 } as const;
export const OG_CONTENT_TYPE = "image/png";

export interface ToolCardCopy {
  /** 헤드라인 위 작은 라벨 (예: "한국 실무자가 매일 쓰는", "무료 계산기") */
  sub: string;
  /** 큰 그라디언트 헤드라인 (도구 이름 또는 사이트 태그라인) */
  headline: string;
  /** 하단 칩 (선택) */
  chips?: string[];
}

export function renderToolCard(copy: ToolCardCopy): ImageResponse {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background:
            "linear-gradient(135deg, #0a0b0e 0%, #14151b 50%, #1a1530 100%)",
          color: "white",
          fontFamily: "system-ui, sans-serif",
          padding: "80px 96px",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 60,
            right: 96,
            width: 380,
            height: 380,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,85,247,0.35) 0%, rgba(99,102,241,0.15) 50%, transparent 70%)",
            filter: "blur(20px)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 18,
              background: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 44,
              fontWeight: 800,
              boxShadow: "0 20px 60px rgba(99,102,241,0.45)",
            }}
          >
            W
          </div>
          <div
            style={{
              fontSize: 36,
              fontWeight: 700,
              letterSpacing: "-0.02em",
              color: "rgba(255,255,255,0.95)",
              display: "flex",
            }}
          >
            Workmate
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
            marginTop: "auto",
            zIndex: 1,
          }}
        >
          <div
            style={{
              fontSize: 38,
              fontWeight: 500,
              color: "rgba(255,255,255,0.65)",
              letterSpacing: "-0.01em",
              display: "flex",
            }}
          >
            {copy.sub}
          </div>
          <div
            style={{
              fontSize: 76,
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              background: "linear-gradient(135deg, #ffffff 0%, #c7d2fe 100%)",
              backgroundClip: "text",
              color: "transparent",
              display: "flex",
            }}
          >
            {copy.headline}
          </div>

          {copy.chips && copy.chips.length > 0 && (
            <div
              style={{
                display: "flex",
                gap: 12,
                marginTop: 32,
                flexWrap: "wrap",
              }}
            >
              {copy.chips.map((chip) => (
                <div
                  key={chip}
                  style={{
                    padding: "10px 20px",
                    borderRadius: 999,
                    border: "1px solid rgba(255,255,255,0.15)",
                    background: "rgba(255,255,255,0.05)",
                    color: "rgba(255,255,255,0.85)",
                    fontSize: 22,
                    fontWeight: 500,
                    display: "flex",
                  }}
                >
                  {chip}
                </div>
              ))}
            </div>
          )}
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 48,
            right: 96,
            color: "rgba(255,255,255,0.4)",
            fontSize: 22,
            fontWeight: 500,
            display: "flex",
          }}
        >
          workmate.tools
        </div>
      </div>
    ),
    { ...OG_SIZE },
  );
}
