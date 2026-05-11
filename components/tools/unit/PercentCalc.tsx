"use client";

import { useState } from "react";
import {
  ofValue,
  increase,
  decrease,
  changePercent,
  reverseFromIncrease,
  type PercentMode,
} from "@/lib/calculations/unit/percent";

interface PercentCalcProps {
  locale: "ko" | "en";
}

const fmt = (n: number): string =>
  n.toLocaleString(undefined, { maximumFractionDigits: 4 });

const T = {
  ko: {
    modes: {
      ofValue: "X의 Y% (예: 50,000의 15%)",
      increase: "X에 Y% 인상 (예: 가격 인상)",
      decrease: "X에서 Y% 할인 (예: 세일가)",
      changePercent: "X → Y 변화율 (몇 %?)",
      reverse: "역산: Y% 인상 후가 Z면 원본은?",
    } satisfies Record<PercentMode, string>,
    presets: [
      { label: "VAT 10%", value: 10 },
      { label: "팁 15%", value: 15 },
      { label: "세일 30%", value: 30 },
      { label: "세일 50%", value: 50 },
      { label: "인상 5%", value: 5 },
    ],
    fieldX: "기준값 (X)",
    fieldFrom: "변경 전 (X)",
    fieldTo: "변경 후 (Y)",
    fieldAfter: "인상 후 값 (Z)",
    fieldPercent: "퍼센트 (%)",
    resultValue: "결과",
    resultDelta: "변화량",
    resultPercent: "변화율 (%)",
  },
  en: {
    modes: {
      ofValue: "Y% of X (e.g., 15% of 50,000)",
      increase: "X increased by Y% (price increase)",
      decrease: "X decreased by Y% (sale)",
      changePercent: "X → Y change % (how much?)",
      reverse: "Reverse: Z is X +Y%, find X",
    } satisfies Record<PercentMode, string>,
    presets: [
      { label: "VAT 10%", value: 10 },
      { label: "Tip 15%", value: 15 },
      { label: "Sale 30%", value: 30 },
      { label: "Sale 50%", value: 50 },
      { label: "Raise 5%", value: 5 },
    ],
    fieldX: "Base (X)",
    fieldFrom: "Before (X)",
    fieldTo: "After (Y)",
    fieldAfter: "After increase (Z)",
    fieldPercent: "Percent (%)",
    resultValue: "Result",
    resultDelta: "Delta",
    resultPercent: "Change %",
  },
} as const;

export function PercentCalc({ locale }: PercentCalcProps): React.ReactElement {
  const t = T[locale];
  const [mode, setMode] = useState<PercentMode>("ofValue");
  const [x, setX] = useState<number>(50000);
  const [y, setY] = useState<number>(15);
  const [from, setFrom] = useState<number>(100);
  const [to, setTo] = useState<number>(130);

  const result = (() => {
    switch (mode) {
      case "ofValue":
        return ofValue(x, y);
      case "increase":
        return increase(x, y);
      case "decrease":
        return decrease(x, y);
      case "changePercent":
        return changePercent(from, to);
      case "reverse":
        return reverseFromIncrease(x, y);
    }
  })();

  const modes = Object.keys(t.modes) as PercentMode[];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-5 p-5 md:p-7">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {locale === "ko" ? "계산 모드" : "Mode"}
          </label>
          <div className="space-y-1.5">
            {modes.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                  mode === m
                    ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30"
                    : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-indigo-400 hover:text-[color:var(--color-text-primary)]"
                }`}
              >
                {t.modes[m]}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {mode === "changePercent" ? (
            <>
              <NumberField label={t.fieldFrom} value={from} onChange={setFrom} />
              <NumberField label={t.fieldTo} value={to} onChange={setTo} />
            </>
          ) : mode === "reverse" ? (
            <>
              <NumberField label={t.fieldAfter} value={x} onChange={setX} />
              <NumberField label={t.fieldPercent} value={y} onChange={setY} step={0.1} />
            </>
          ) : (
            <>
              <NumberField label={t.fieldX} value={x} onChange={setX} />
              <NumberField label={t.fieldPercent} value={y} onChange={setY} step={0.1} />
            </>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {locale === "ko" ? "자주 쓰는 퍼센트" : "Common percents"}
          </label>
          <div className="flex flex-wrap gap-1.5">
            {t.presets.map((p) => (
              <button
                key={p.label}
                type="button"
                onClick={() => setY(p.value)}
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
          {t.resultValue}
        </h2>

        <div className="rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 p-4">
          <p className="text-xs font-medium text-[color:var(--color-text-tertiary)]">
            {mode === "changePercent" ? t.resultPercent : t.resultValue}
          </p>
          <p className="mt-1 text-4xl font-bold tabular-nums text-[color:var(--color-text-primary)]">
            {fmt(result.value)}
            {mode === "changePercent" ? <span className="ml-1 text-2xl">%</span> : null}
          </p>
        </div>

        {mode !== "ofValue" && (
          <dl className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-3">
              <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.resultDelta}</dt>
              <dd className="mt-1 text-xl font-bold tabular-nums text-[color:var(--color-text-primary)]">
                {result.delta > 0 ? "+" : ""}
                {fmt(result.delta)}
              </dd>
            </div>
            <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-3">
              <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.resultPercent}</dt>
              <dd className="mt-1 text-xl font-bold tabular-nums text-[color:var(--color-text-primary)]">
                {fmt(result.percent)}%
              </dd>
            </div>
          </dl>
        )}
      </section>
    </div>
  );
}

function NumberField({
  label,
  value,
  onChange,
  step = 1,
}: {
  label: string;
  value: number;
  onChange: (n: number) => void;
  step?: number;
}): React.ReactElement {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
        {label}
      </label>
      <input
        type="number"
        step={step}
        inputMode="decimal"
        className="input-base tabular-nums"
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
      />
    </div>
  );
}
