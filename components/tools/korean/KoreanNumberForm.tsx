"use client";

import { useState } from "react";
import {
  convertKoreanNumber,
  KOREAN_NUMBER_MAX,
} from "@/lib/calculations/korean/koreanNumber";

interface KoreanNumberFormProps {
  locale: "ko" | "en";
}

const T = {
  ko: {
    label: "숫자 입력",
    placeholder: "예: 21",
    sino: "한자어 수사",
    sinoUse: "날짜·금액·전화번호·층·분·번호",
    native: "고유어 수사",
    nativeUse: "나이·개수·시(時)·사람 수",
    attr: "관형사형 (수량 앞)",
    attrUse: "예: 스무 살, 세 개, 네 시",
    nativeNone: "고유어는 1~99만 — 100 이상은 한자어를 사용합니다.",
    presets: "자주 쓰는 숫자",
    invalid: "0 이상의 정수를 입력하세요.",
    note: "한국어는 두 수 체계를 함께 씁니다. 시간은 '시'는 고유어(한 시), '분'은 한자어(십 분). 나이는 고유어(스물한 살) 또는 한자어(이십일 세) 둘 다 쓰입니다.",
  },
  en: {
    label: "Enter a number",
    placeholder: "e.g. 21",
    sino: "Sino-Korean",
    sinoUse: "dates, money, phone numbers, floors, minutes, IDs",
    native: "Native Korean",
    nativeUse: "age, counting things, hours, people",
    attr: "Attributive (before counters)",
    attrUse: "e.g. 스무 살 (20 yrs), 세 개 (3 items), 네 시 (4 o'clock)",
    nativeNone: "Native Korean only goes 1–99 — use Sino-Korean for 100+.",
    presets: "Common numbers",
    invalid: "Enter an integer 0 or greater.",
    note: "Korean uses two number systems together. For time, the hour is Native (한 시) but minutes are Sino (십 분). Age can be either Native (스물한 살) or Sino (이십일 세).",
  },
} as const;

const PRESETS = [1, 2, 3, 10, 20, 100, 1000, 10000];

export function KoreanNumberForm({
  locale,
}: KoreanNumberFormProps): React.ReactElement {
  const t = T[locale];
  const [raw, setRaw] = useState("21");

  const parsed = Number(raw.replace(/[^0-9]/g, ""));
  const valid =
    raw.trim() !== "" &&
    Number.isFinite(parsed) &&
    parsed >= 0 &&
    parsed <= KOREAN_NUMBER_MAX;
  const r = valid ? convertKoreanNumber({ value: parsed }) : null;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-5 p-5 md:p-7">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.label}
          </label>
          <input
            type="text"
            inputMode="numeric"
            className="input-base text-center text-2xl font-bold tabular-nums"
            placeholder={t.placeholder}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
          />
          {!valid && (
            <p className="mt-2 text-xs text-red-400">{t.invalid}</p>
          )}
        </div>
        <div>
          <p className="mb-2 text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.presets}
          </p>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setRaw(String(p))}
                className="rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] px-3 py-1.5 text-sm font-medium tabular-nums text-[color:var(--color-text-secondary)] transition-colors hover:border-indigo-400 hover:text-[color:var(--color-text-primary)]"
              >
                {p.toLocaleString()}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        {r ? (
          <div className="space-y-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/10 p-4 ring-1 ring-indigo-500/20">
              <p className="text-xs font-medium text-[color:var(--color-text-tertiary)]">
                {t.sino}
              </p>
              <p className="mt-1 break-words text-3xl font-bold text-[#eef0f5]">
                {r.sino}
              </p>
              <p className="mt-1 text-[11px] text-[color:var(--color-text-tertiary)]">
                {t.sinoUse}
              </p>
            </div>

            <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4">
              <p className="text-xs font-medium text-[color:var(--color-text-tertiary)]">
                {t.native}
              </p>
              {r.nativeSupported ? (
                <>
                  <p className="mt-1 break-words text-2xl font-bold text-[color:var(--color-text-primary)]">
                    {r.native}
                  </p>
                  <p className="mt-1 text-[11px] text-[color:var(--color-text-tertiary)]">
                    {t.nativeUse}
                  </p>
                </>
              ) : (
                <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
                  {t.nativeNone}
                </p>
              )}
            </div>

            {r.nativeAttributive && (
              <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4">
                <p className="text-xs font-medium text-[color:var(--color-text-tertiary)]">
                  {t.attr}
                </p>
                <p className="mt-1 text-2xl font-bold text-[color:var(--color-text-primary)]">
                  {r.nativeAttributive}
                </p>
                <p className="mt-1 text-[11px] text-[color:var(--color-text-tertiary)]">
                  {t.attrUse}
                </p>
              </div>
            )}

            <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
              {t.note}
            </p>
          </div>
        ) : (
          <p className="text-sm text-[color:var(--color-text-tertiary)]">
            {t.invalid}
          </p>
        )}
      </section>
    </div>
  );
}
