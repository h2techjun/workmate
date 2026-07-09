import type { Locale } from "@/i18n";
import { renderToolCard, OG_SIZE, OG_CONTENT_TYPE } from "@/lib/og/toolCard";

export const alt = "외국인 단일세율 계산기 — Workmate";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

const COPY: Record<Locale, { sub: string; headline: string }> = {
  ko: { sub: "무료 계산기 · workmate.tools", headline: "외국인 단일세율 계산기" },
  en: { sub: "Free calculator · workmate.tools", headline: "Foreign Flat Tax Calculator" },
  vi: { sub: "Công cụ miễn phí · workmate.tools", headline: "Máy tính thuế suất đơn cho người nước ngoài" },
  zh: { sub: "免费计算器 · workmate.tools", headline: "外国人单一税率计算器" },
};

export default async function Image({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Response> {
  const { locale } = await params;
  return renderToolCard(COPY[(locale as Locale)] ?? COPY.ko);
}
