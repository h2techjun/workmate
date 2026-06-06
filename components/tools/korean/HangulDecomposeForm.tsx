"use client";

import { useState } from "react";
import { decomposeHangul } from "@/lib/calculations/korean/hangulDecompose";

interface HangulDecomposeFormProps {
  locale: "ko" | "en";
}

const T = {
  ko: {
    label: "한글 입력",
    placeholder: "예: 한글 받침",
    result: "음절 분해",
    syllables: "음절",
    jamoTotal: "자모 수",
    cho: "초성",
    jung: "중성",
    jong: "종성",
    rom: "로마자",
    hasJong: "받침 있음",
    noJong: "받침 없음",
    none: "—",
    empty: "한글을 입력하세요.",
    note: "각 음절을 초성·중성·종성으로 분해하고 자모별 로마자 음가를 표시합니다. 받침(종성) 유무는 조사(은/는, 이/가) 선택에 중요합니다. 로마자는 음절 단위 음역(음운 변화 미반영).",
  },
  en: {
    label: "Korean input",
    placeholder: "e.g. 한글 받침",
    result: "Syllable breakdown",
    syllables: "Syllables",
    jamoTotal: "Jamo count",
    cho: "Initial",
    jung: "Medial",
    jong: "Final",
    rom: "Roman",
    hasJong: "has batchim",
    noJong: "no batchim",
    none: "—",
    empty: "Enter Korean text.",
    note: "Each syllable is split into initial, medial, and final jamo with roman sounds. Whether a syllable has a final consonant (batchim) matters for particle choice (은/는, 이/가). Roman is syllable-level transliteration.",
  },
} as const;

export function HangulDecomposeForm({
  locale,
}: HangulDecomposeFormProps): React.ReactElement {
  const t = T[locale];
  const [text, setText] = useState("한글");

  const r = decomposeHangul(text);

  return (
    <div className="space-y-6">
      <section className="surface-card space-y-4 p-5 md:p-7">
        <label className="block text-sm font-semibold text-[color:var(--color-text-primary)]">
          {t.label}
        </label>
        <textarea
          rows={2}
          className="input-base resize-none text-lg"
          placeholder={t.placeholder}
          value={text}
          onChange={(e) => setText(e.target.value)}
          maxLength={200}
        />
        <div className="flex gap-4 text-sm text-[color:var(--color-text-tertiary)]">
          <span>
            {t.syllables}:{" "}
            <span className="font-bold text-[color:var(--color-text-primary)]">
              {r.syllableCount}
            </span>
          </span>
          <span>
            {t.jamoTotal}:{" "}
            <span className="font-bold text-[color:var(--color-text-primary)]">
              {r.jamoTotal}
            </span>
          </span>
        </div>
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          {t.result}
        </h2>
        {r.syllableCount > 0 ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {r.syllables.map((s, i) => (
              <div
                key={i}
                className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4"
              >
                <div className="mb-3 flex items-baseline justify-between">
                  <span className="text-3xl font-bold text-[#eef0f5]">
                    {s.syllable}
                  </span>
                  <span className="font-mono text-sm text-indigo-300">
                    {s.romanized}
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <Jamo label={t.cho} jamo={s.cho} rom={s.choRom} />
                  <Jamo label={t.jung} jamo={s.jung} rom={s.jungRom} />
                  <Jamo
                    label={t.jong}
                    jamo={s.jong || t.none}
                    rom={s.jongRom}
                  />
                </div>
                <p
                  className={`mt-3 text-center text-xs font-medium ${s.hasJong ? "text-amber-300" : "text-emerald-300"}`}
                >
                  {s.hasJong ? t.hasJong : t.noJong}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[color:var(--color-text-tertiary)]">
            {t.empty}
          </p>
        )}
        <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
          {t.note}
        </p>
      </section>
    </div>
  );
}

function Jamo({
  label,
  jamo,
  rom,
}: {
  label: string;
  jamo: string;
  rom: string;
}): React.ReactElement {
  return (
    <div className="rounded-lg bg-[color:var(--color-bg-card)] py-2">
      <p className="text-[10px] text-[color:var(--color-text-muted)]">{label}</p>
      <p className="text-xl font-semibold text-[color:var(--color-text-primary)]">
        {jamo}
      </p>
      <p className="font-mono text-[11px] text-[color:var(--color-text-tertiary)]">
        {rom || "·"}
      </p>
    </div>
  );
}
