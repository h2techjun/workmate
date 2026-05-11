"use client";

import { useState } from "react";
import { convertArea, type AreaUnit } from "@/lib/calculations/unit/area";

interface AreaConverterProps {
  locale: "ko" | "en";
}

const fmt = (n: number, d = 2): string =>
  n.toLocaleString(undefined, {
    minimumFractionDigits: d,
    maximumFractionDigits: d,
  });

const T = {
  ko: {
    inputLabel: "값 입력",
    unitLabel: "단위 선택",
    units: { pyeong: "평", sqm: "㎡ (제곱미터)", ja2: "자² (제곱자)" } as Record<AreaUnit, string>,
    result: "변환 결과",
    pyeongLabel: "평",
    pyeongRounded: "0.5평 단위 (부동산 광고용)",
    sqmLabel: "제곱미터 (㎡)",
    ja2Label: "제곱자 (자²)",
    presetTitle: "자주 쓰는 면적",
    presets: [
      { value: 59, unit: "sqm" as AreaUnit, label: "59㎡ (소형 아파트)" },
      { value: 84, unit: "sqm" as AreaUnit, label: "84㎡ (국민주택규모)" },
      { value: 114, unit: "sqm" as AreaUnit, label: "114㎡ (중형 아파트)" },
      { value: 30, unit: "pyeong" as AreaUnit, label: "30평 (전용)" },
      { value: 50, unit: "pyeong" as AreaUnit, label: "50평 (대형)" },
    ],
    notes: [
      "1평 = 6자 × 6자 = 36자² = 3600/1089 ≈ 3.30578 ㎡",
      "부동산 광고는 보통 0.5평 단위로 반올림. 등기·공급계약은 ㎡ 의무 (2007~).",
      "전용면적 = 계약면적에서 공용 부분 제외한 실 사용 면적.",
    ],
  },
  en: {
    inputLabel: "Value",
    unitLabel: "Unit",
    units: { pyeong: "Pyeong (평)", sqm: "Square meters (㎡)", ja2: "Square ja (자²)" } as Record<AreaUnit, string>,
    result: "Conversion",
    pyeongLabel: "Pyeong",
    pyeongRounded: "0.5 pyeong rounded (real-estate)",
    sqmLabel: "Square meters",
    ja2Label: "Square ja",
    presetTitle: "Common sizes",
    presets: [
      { value: 59, unit: "sqm" as AreaUnit, label: "59㎡ (small apt)" },
      { value: 84, unit: "sqm" as AreaUnit, label: "84㎡ (national housing standard)" },
      { value: 114, unit: "sqm" as AreaUnit, label: "114㎡ (mid-size apt)" },
      { value: 30, unit: "pyeong" as AreaUnit, label: "30 pyeong" },
      { value: 50, unit: "pyeong" as AreaUnit, label: "50 pyeong" },
    ],
    notes: [
      "1 pyeong = 6 ja × 6 ja = 36 ja² = 3600/1089 ≈ 3.30578 m²",
      "Real-estate ads round to 0.5 pyeong. Official deeds use ㎡ (mandatory since 2007).",
      "Exclusive area = contract area minus shared spaces (corridors, lobbies, etc.).",
    ],
  },
} as const;

export function AreaConverter({ locale }: AreaConverterProps): React.ReactElement {
  const t = T[locale];
  const [value, setValue] = useState<number>(84);
  const [unit, setUnit] = useState<AreaUnit>("sqm");

  const result = convertArea({ value, unit });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-5 p-5 md:p-7">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.inputLabel}
          </label>
          <input
            type="number"
            step="0.1"
            inputMode="decimal"
            className="input-base text-2xl font-bold tabular-nums"
            value={value}
            onChange={(e) => setValue(parseFloat(e.target.value) || 0)}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.unitLabel}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(t.units) as AreaUnit[]).map((u) => (
              <button
                key={u}
                type="button"
                onClick={() => setUnit(u)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  unit === u
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30"
                    : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-indigo-400 hover:text-[color:var(--color-text-primary)]"
                }`}
              >
                {t.units[u]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.presetTitle}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {t.presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => {
                  setValue(p.value);
                  setUnit(p.unit);
                }}
                className="rounded-md border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] px-2.5 py-1 text-xs font-medium text-[color:var(--color-text-secondary)] transition-colors hover:border-indigo-500 hover:text-[color:var(--color-text-primary)]"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-card space-y-5 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          {t.result}
        </h2>

        <dl className="space-y-3">
          <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4">
            <dt className="text-xs font-medium text-[color:var(--color-text-tertiary)]">
              {t.pyeongLabel}
            </dt>
            <dd className="mt-1 text-3xl font-bold tabular-nums text-[color:var(--color-text-primary)]">
              {fmt(result.pyeong)}
              <span className="ml-1 text-base font-medium text-[color:var(--color-text-secondary)]">
                {locale === "ko" ? "평" : ""}
              </span>
            </dd>
            <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
              {t.pyeongRounded}: <span className="font-semibold text-[color:var(--color-text-secondary)]">{fmt(result.pyeongRounded05, 1)}{locale === "ko" ? "평" : " pyeong"}</span>
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-3">
              <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.sqmLabel}</dt>
              <dd className="mt-1 text-xl font-bold tabular-nums text-[color:var(--color-text-primary)]">
                {fmt(result.sqm)} ㎡
              </dd>
            </div>
            <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-3">
              <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.ja2Label}</dt>
              <dd className="mt-1 text-xl font-bold tabular-nums text-[color:var(--color-text-primary)]">
                {fmt(result.ja2)}
              </dd>
            </div>
          </div>
        </dl>

        <ul className="space-y-1 border-t border-[color:var(--color-border-subtle)] pt-3 text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
          {t.notes.map((n, i) => (
            <li key={i}>• {n}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
