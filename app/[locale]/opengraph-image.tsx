import { ImageResponse } from "next/og";
import type { Locale } from "@/i18n";

export const alt = "Workmate — 한국 실무자가 매일 쓰는 무료 도구·계산기 모음";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

interface ImageParams {
  params: Promise<{ locale: string }>;
}

const COPY: Record<Locale, { title: string; subtitle: string; tagline: string }> = {
  ko: {
    title: "Workmate",
    subtitle: "한국 실무자가 매일 쓰는",
    tagline: "무료 도구·계산기 모음",
  },
  en: {
    title: "Workmate",
    subtitle: "Free tools & calculators",
    tagline: "for Korean standards (KEC, KS, NDS)",
  },
};

export default async function Image({ params }: ImageParams): Promise<ImageResponse> {
  const { locale } = await params;
  const copy = COPY[locale as Locale] ?? COPY.ko;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "linear-gradient(135deg, #0a0b0e 0%, #14151b 50%, #1a1530 100%)",
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
            {copy.title}
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
            {copy.subtitle}
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
            {copy.tagline}
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              marginTop: 32,
              flexWrap: "wrap",
            }}
          >
            {["전기 KEC", "4대보험 2026", "사업자번호", "목조 NDS", "연봉 실수령"].map(
              (chip) => (
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
              ),
            )}
          </div>
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
    { ...size },
  );
}
