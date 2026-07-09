import { ArrowUpRight } from "lucide-react";
import { getOffer } from "@/lib/offers";

interface OfferSlotProps {
  /** lib/offers.ts 의 OFFERS 키 (도구 식별자). 오퍼 없으면 미노출 */
  toolKey?: string;
  locale: "ko" | "en" | "vi" | "zh";
}

/**
 * 결과 하단 맥락 제휴 CTA. 계산 직후(고관심 시점)에 관련 금융 서비스로 연결.
 *
 * `lib/offers.ts` 에 해당 toolKey 오퍼가 없거나 href 가 비면 **아무것도 렌더하지 않는다**
 * (휴면 — AdSense 심사 무해). 활성화 절차: docs/monetization-strategy.md.
 *
 * 표시광고법 + AdSense 정책 준수: "제휴 링크" 공시 명시, rel="sponsored",
 * 내비/다운로드로 오인되지 않는 명확한 카드 형태.
 */
export function OfferSlot({
  toolKey,
  locale,
}: OfferSlotProps): React.ReactElement | null {
  const offer = getOffer(toolKey);
  if (!offer) return null;

  const isEn = locale !== "ko";

  return (
    <div className="mt-4 rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
        {isEn ? "Sponsored · affiliate" : "제휴 링크 · 광고"}
      </p>
      <a
        href={offer.href}
        target="_blank"
        rel="sponsored noopener noreferrer"
        className="group inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-300 transition-colors hover:text-indigo-200"
      >
        <span>{isEn ? offer.labelEn : offer.labelKo}</span>
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
      </a>
      <p className="mt-1 text-xs leading-relaxed text-[color:var(--color-text-tertiary)]">
        {isEn ? offer.descEn : offer.descKo}
      </p>
    </div>
  );
}
