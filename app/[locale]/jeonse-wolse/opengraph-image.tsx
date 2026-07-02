import type { Locale } from "@/i18n";
import { renderToolCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/toolCard";

export const alt = "전세 월세 전환 계산기 — Workmate";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const COPY: Record<Locale, { sub: string; headline: string }> = {
  ko: { sub: "무료 계산기 · workmate.tools", headline: "전세 월세 전환 계산기" },
  en: { sub: "Free calculator · workmate.tools", headline: "Jeonse–Wolse Converter" },
  vi: { sub: "Công cụ miễn phí · workmate.tools", headline: "Máy tính quy đổi Jeonse–Wolse" },
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Response> {
  const { locale } = await params;
  return renderToolCard(COPY[(locale as Locale)] ?? COPY.ko);
}
