"use client";

import { useState } from "react";
import { calculatePaint } from "@/lib/calculations/timber/paint";
import { formatNumber } from "@/lib/utils/format";

interface PaintFormProps {
  locale: "ko" | "en";
}

const T = {
  ko: {
    wallArea: "벽 총면적 (㎡)",
    doorCount: "문 개수",
    windowCount: "창문 개수",
    coats: "도장 횟수",
    spreadRate: "도포율 (㎡/L)",
    waste: "손실 여유 (%)",
    result: "필요 페인트",
    liters: "필요량 (손실 포함)",
    litersUnit: "L",
    netArea: "순 도장면적",
    openingArea: "개구부 차감",
    totalArea: "총 도장면적",
    cans4: "4L 통",
    cans1: "1L 통",
    cansUnit: "개",
    note: "문 2㎡·창 1.5㎡ 표준 차감. 일반 내벽 수성 도포율 약 10㎡/L/회, 2회 도장 권장. 표면 상태·도료 종류로 도포율 조정.",
  },
  en: {
    wallArea: "Total wall area (m²)",
    doorCount: "Doors",
    windowCount: "Windows",
    coats: "Number of coats",
    spreadRate: "Spread rate (m²/L)",
    waste: "Waste allowance (%)",
    result: "Paint needed",
    liters: "Liters needed (incl. waste)",
    litersUnit: "L",
    netArea: "Net paint area",
    openingArea: "Openings deducted",
    totalArea: "Total coat area",
    cans4: "4L cans",
    cans1: "1L cans",
    cansUnit: "",
    note: "Standard deduction: door 2m², window 1.5m². Interior water-based paint ~10 m²/L per coat, 2 coats recommended. Adjust spread rate by surface and paint type.",
  },
} as const;

export function PaintForm({ locale }: PaintFormProps): React.ReactElement {
  const t = T[locale];
  const [wallArea, setWallArea] = useState(50);
  const [doorCount, setDoorCount] = useState(1);
  const [windowCount, setWindowCount] = useState(2);
  const [coats, setCoats] = useState(2);
  const [spreadRate, setSpreadRate] = useState(10);
  const [waste, setWaste] = useState(10);

  const result = calculatePaint({
    wallArea,
    doorCount,
    windowCount,
    coats,
    spreadRate,
    wastePercent: waste,
  });

  const field = (
    label: string,
    value: number,
    setter: (v: number) => void,
    step = 1,
  ) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
        {label}
      </label>
      <input
        type="number"
        step={step}
        inputMode="decimal"
        className="input-base"
        value={value}
        onChange={(e) => setter(parseFloat(e.target.value) || 0)}
      />
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-4 p-5 md:p-7">
        {field(t.wallArea, wallArea, setWallArea)}
        <div className="grid grid-cols-2 gap-3">
          {field(t.doorCount, doorCount, setDoorCount)}
          {field(t.windowCount, windowCount, setWindowCount)}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {field(t.coats, coats, setCoats)}
          {field(t.spreadRate, spreadRate, setSpreadRate)}
          {field(t.waste, waste, setWaste)}
        </div>
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          {t.result}
        </h2>

        <div className="rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 p-4 ring-1 ring-emerald-500/20">
          <dt className="text-xs font-medium text-[color:var(--color-text-tertiary)]">
            {t.liters}
          </dt>
          <dd className="mt-1 text-4xl font-bold tabular-nums text-[#eef0f5]">
            {formatNumber(result.litersWithWaste)}
            <span className="ml-1 text-base font-medium text-[color:var(--color-text-secondary)]">
              {t.litersUnit}
            </span>
          </dd>
          <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
            {t.cans4} {formatNumber(result.cans4L)}
            {t.cansUnit} · {t.cans1} {formatNumber(result.cans1L)}
            {t.cansUnit}
          </p>
        </div>

        <dl className="space-y-1.5 text-sm">
          {[
            [t.openingArea, `${formatNumber(result.openingArea)} ㎡`],
            [t.netArea, `${formatNumber(result.netArea)} ㎡`],
            [t.totalArea, `${formatNumber(result.totalCoatArea)} ㎡`],
          ].map(([label, val]) => (
            <div key={label} className="flex justify-between">
              <dt className="text-[color:var(--color-text-tertiary)]">{label}</dt>
              <dd className="tabular-nums text-[color:var(--color-text-secondary)]">
                {val}
              </dd>
            </div>
          ))}
        </dl>

        <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
          {t.note}
        </p>
      </section>
    </div>
  );
}
