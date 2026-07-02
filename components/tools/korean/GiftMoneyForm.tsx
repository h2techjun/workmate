"use client";

import { useState } from "react";
import { calculateGiftMoney } from "@/lib/calculations/korean/giftMoney";
import { formatNumber } from "@/lib/utils/format";

interface GiftMoneyFormProps {
  locale: "ko" | "en" | "vi";
}

const T = {
  ko: {
    event: "경조사",
    wedding: "결혼식 (축의금)",
    funeral: "장례식 (부의금)",
    relation: "관계",
    relations: {
      acquaintance: "지인 (가끔)",
      colleague: "동료 (자주)",
      friend: "친구",
      closeFriend: "절친",
      family: "친척",
    },
    attending: "결혼식 직접 참석 (식사)",
    result: "권장 금액",
    recommended: "권장",
    range: "통상 범위",
    manwon: "만원",
    attendingNote: "직접 참석하면 식대(보통 5만 내외)를 고려해 한 단계 높게 내는 게 관례입니다.",
    oddNote: "한국은 홀수(3·5·7·10만) 선호. 짝수는 '나뉜다'는 의미로 기피하나 10만은 예외.",
    note: "정해진 법칙은 없으며 관계·지역·물가로 달라집니다. 본 도구는 일반적 관습 기반 참고용.",
  },
  en: {
    event: "Occasion",
    wedding: "Wedding (축의금)",
    funeral: "Funeral (부의금)",
    relation: "Relationship",
    relations: {
      acquaintance: "Acquaintance",
      colleague: "Colleague",
      friend: "Friend",
      closeFriend: "Close friend",
      family: "Relative",
    },
    attending: "Attending the wedding (meal)",
    result: "Recommended amount",
    recommended: "Recommended",
    range: "Typical range",
    manwon: "0,000 KRW",
    attendingNote: "If you attend in person, custom is to give one tier higher to cover the meal (~50,000 KRW).",
    oddNote: "Koreans prefer odd amounts (30/50/70/100K). Even numbers imply 'division' and are avoided — 100K is the exception.",
    note: "No fixed rule; it varies by relationship, region, and prices. Reference based on common custom.",
  },
  vi: {
    event: "Dịp lễ nghi",
    wedding: "Đám cưới (tiền mừng cưới)",
    funeral: "Đám tang (tiền phúng viếng)",
    relation: "Mối quan hệ",
    relations: {
      acquaintance: "Người quen (thỉnh thoảng)",
      colleague: "Đồng nghiệp (thường xuyên)",
      friend: "Bạn bè",
      closeFriend: "Bạn thân",
      family: "Người thân",
    },
    attending: "Trực tiếp tham dự đám cưới (dùng bữa)",
    result: "Số tiền khuyến nghị",
    recommended: "Khuyến nghị",
    range: "Mức thông thường",
    manwon: "0.000 KRW",
    attendingNote: "Nếu trực tiếp tham dự, tập quán là gửi cao hơn một mức để bù chi phí bữa ăn (thường khoảng 50.000 KRW).",
    oddNote: "Người Hàn ưa chuộng số lẻ (30/50/70/100 nghìn KRW). Số chẵn mang ý nghĩa 'chia cắt' nên thường tránh, riêng 100 nghìn là ngoại lệ.",
    note: "Không có quy tắc cố định — tùy theo mối quan hệ, vùng miền và mức giá cả mà thay đổi. Công cụ này chỉ mang tính tham khảo dựa trên tập quán phổ biến.",
  },
} as const;

export function GiftMoneyForm({
  locale,
}: GiftMoneyFormProps): React.ReactElement {
  const t = T[locale];
  const [event, setEvent] = useState<"wedding" | "funeral">("wedding");
  const [relation, setRelation] = useState<
    "acquaintance" | "colleague" | "friend" | "closeFriend" | "family"
  >("colleague");
  const [attending, setAttending] = useState(true);

  const r = calculateGiftMoney({ event, relation, attending });
  const unit = locale === "ko" ? "만원" : "0,000 KRW";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-5 p-5 md:p-7">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.event}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["wedding", "funeral"] as const).map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEvent(e)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  event === e
                    ? "bg-gradient-to-br from-rose-500 to-pink-600 text-white"
                    : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-rose-400"
                }`}
              >
                {e === "wedding" ? t.wedding : t.funeral}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.relation}
          </label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {(["acquaintance", "colleague", "friend", "closeFriend", "family"] as const).map((rel) => (
              <button
                key={rel}
                type="button"
                onClick={() => setRelation(rel)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  relation === rel
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                    : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-indigo-400"
                }`}
              >
                {t.relations[rel]}
              </button>
            ))}
          </div>
        </div>
        {event === "wedding" && (
          <label className="flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)]">
            <input
              type="checkbox"
              className="h-4 w-4"
              checked={attending}
              onChange={(e) => setAttending(e.target.checked)}
            />
            {t.attending}
          </label>
        )}
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          {t.result}
        </h2>
        <div className="rounded-xl bg-gradient-to-br from-rose-500/15 to-pink-500/10 p-4 ring-1 ring-rose-500/20">
          <dt className="text-xs font-medium text-[color:var(--color-text-tertiary)]">
            {t.recommended}
          </dt>
          <dd className="mt-1 text-4xl font-bold tabular-nums text-[#eef0f5]">
            {formatNumber(r.recommended)}
            <span className="ml-1 text-base font-medium text-[color:var(--color-text-secondary)]">
              {unit}
            </span>
          </dd>
          <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
            {t.range}: {formatNumber(r.min)}~{formatNumber(r.max)} {unit}
          </p>
        </div>
        {r.attendingNote && (
          <p className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3 text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
            {t.attendingNote}
          </p>
        )}
        <p className="text-xs leading-relaxed text-[color:var(--color-text-tertiary)]">
          {t.oddNote}
        </p>
        <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
          {t.note}
        </p>
      </section>
    </div>
  );
}
