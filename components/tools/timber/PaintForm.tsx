"use client";

import { useState } from "react";
import { calculatePaint } from "@/lib/calculations/timber/paint";
import { NumberField } from "@/components/ui/NumberField";
import { formatNumber } from "@/lib/utils/format";

interface PaintFormProps {
  locale: "ko" | "en" | "zh";
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
    countUnit: "개",
    coatsUnit: "회",
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
    countUnit: "",
    coatsUnit: "",
    note: "Standard deduction: door 2m², window 1.5m². Interior water-based paint ~10 m²/L per coat, 2 coats recommended. Adjust spread rate by surface and paint type.",
  },
  zh: {
    wallArea: "墙面总面积 (㎡)",
    doorCount: "门数量",
    windowCount: "窗户数量",
    coats: "涂刷次数",
    spreadRate: "涂布率 (㎡/L)",
    waste: "损耗余量 (%)",
    result: "所需油漆",
    liters: "所需量 (含损耗)",
    litersUnit: "L",
    netArea: "净涂装面积",
    openingArea: "开口扣除",
    totalArea: "总涂装面积",
    cans4: "4L桶",
    cans1: "1L桶",
    cansUnit: "个",
    countUnit: "个",
    coatsUnit: "次",
    note: "标准扣除：门2㎡·窗1.5㎡。一般内墙水性涂料涂布率约10㎡/L/次，建议涂刷2次。可根据表面状态·涂料种类调整涂布率。",
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
    opts: { decimals?: number; suffix?: string } = {},
  ) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
        {label}
      </label>
      <NumberField
        value={value}
        onChange={setter}
        thousands={false}
        decimals={opts.decimals ?? 0}
        min={0}
        suffix={opts.suffix}
        aria-label={label}
      />
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-4 p-5 md:p-7">
        {field(t.wallArea, wallArea, setWallArea, { decimals: 2, suffix: "㎡" })}
        <div className="grid grid-cols-2 gap-3">
          {field(t.doorCount, doorCount, setDoorCount, { decimals: 0, suffix: t.countUnit })}
          {field(t.windowCount, windowCount, setWindowCount, { decimals: 0, suffix: t.countUnit })}
        </div>
        <div className="grid grid-cols-3 gap-3">
          {field(t.coats, coats, setCoats, { decimals: 0, suffix: t.coatsUnit })}
          {field(t.spreadRate, spreadRate, setSpreadRate, { decimals: 1, suffix: "㎡/L" })}
          {field(t.waste, waste, setWaste, { decimals: 0, suffix: "%" })}
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
          <dd className="mt-1 text-4xl font-bold tabular-nums text-[color:var(--color-text-hero)]">
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
