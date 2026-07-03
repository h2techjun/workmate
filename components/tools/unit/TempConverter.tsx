"use client";

import { useState } from "react";
import {
  convertTemperature,
  type TempUnit,
} from "@/lib/calculations/unit/temperature";
import { NumberField } from "@/components/ui/NumberField";

interface TempConverterProps {
  locale: "ko" | "en" | "vi";
}

const T = {
  ko: {
    value: "값 입력",
    unit: "단위",
    units: { c: "섭씨 (°C)", f: "화씨 (°F)", k: "켈빈 (K)" } as Record<TempUnit, string>,
    result: "변환 결과",
    feels: { freezing: "🥶 영하·결빙", cold: "🧥 쌀쌀함", mild: "🌤️ 선선·쾌적", warm: "☀️ 따뜻함", hot: "🔥 더움" },
    presets: "자주 쓰는 온도",
    note: "°F = °C × 9/5 + 32, K = °C + 273.15. 한국은 섭씨, 미국은 화씨 사용.",
  },
  en: {
    value: "Value",
    unit: "Unit",
    units: { c: "Celsius (°C)", f: "Fahrenheit (°F)", k: "Kelvin (K)" } as Record<TempUnit, string>,
    result: "Conversion",
    feels: { freezing: "🥶 Freezing", cold: "🧥 Cold", mild: "🌤️ Mild", warm: "☀️ Warm", hot: "🔥 Hot" },
    presets: "Common temps",
    note: "°F = °C × 9/5 + 32, K = °C + 273.15. Korea uses Celsius; the US uses Fahrenheit.",
  },
  vi: {
    value: "Nhập giá trị",
    unit: "Đơn vị",
    units: { c: "Độ C (°C)", f: "Độ F (°F)", k: "Kelvin (K)" } as Record<TempUnit, string>,
    result: "Kết quả quy đổi",
    feels: { freezing: "🥶 Đóng băng", cold: "🧥 Lạnh", mild: "🌤️ Mát mẻ", warm: "☀️ Ấm áp", hot: "🔥 Nóng" },
    presets: "Nhiệt độ thường dùng",
    note: "°F = °C × 9/5 + 32, K = °C + 273,15. Hàn Quốc dùng độ C, Mỹ dùng độ F.",
  },
} as const;

const PRESETS: Array<{ v: number; u: TempUnit; labelKo: string; labelEn: string; labelVi: string }> = [
  { v: 0, u: "c", labelKo: "어는점", labelEn: "Freezing", labelVi: "Điểm đóng băng" },
  { v: 36.5, u: "c", labelKo: "체온", labelEn: "Body", labelVi: "Thân nhiệt" },
  { v: 100, u: "c", labelKo: "끓는점", labelEn: "Boiling", labelVi: "Điểm sôi" },
  { v: 98.6, u: "f", labelKo: "체온(°F)", labelEn: "Body(°F)", labelVi: "Thân nhiệt(°F)" },
];

export function TempConverter({ locale }: TempConverterProps): React.ReactElement {
  const t = T[locale];
  const [value, setValue] = useState(25);
  const [unit, setUnit] = useState<TempUnit>("c");

  const r = convertTemperature({ value, unit });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-5 p-5 md:p-7">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">{t.value}</label>
          <NumberField
            value={value}
            onChange={setValue}
            thousands={false}
            decimals={1}
            allowNegative={true}
            aria-label={t.value}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">{t.unit}</label>
          <div className="grid grid-cols-3 gap-2">
            {(["c", "f", "k"] as TempUnit[]).map((u) => (
              <button key={u} type="button" onClick={() => setUnit(u)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${unit === u ? "bg-gradient-to-br from-orange-500 to-rose-500 text-white" : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-orange-400"}`}>
                {t.units[u]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">{t.presets}</label>
          <div className="flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button key={p.labelEn} type="button" onClick={() => { setValue(p.v); setUnit(p.u); }}
                className="rounded-md border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] px-2.5 py-1 text-xs font-medium text-[color:var(--color-text-secondary)] hover:border-orange-400 hover:text-[color:var(--color-text-primary)]">
                {locale === "ko" ? p.labelKo : locale === "vi" ? p.labelVi : p.labelEn}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">{t.result}</h2>
        <div className="rounded-xl bg-gradient-to-br from-orange-500/15 to-rose-500/10 p-4 ring-1 ring-orange-500/20 text-center">
          <p className="text-sm text-[color:var(--color-text-secondary)]">{t.feels[r.feel]}</p>
        </div>
        <dl className="grid grid-cols-3 gap-3">
          {([["°C", r.c], ["°F", r.f], ["K", r.k]] as const).map(([lbl, val]) => (
            <div key={lbl} className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-3 text-center">
              <dt className="text-xs text-[color:var(--color-text-tertiary)]">{lbl}</dt>
              <dd className="mt-1 text-2xl font-bold tabular-nums text-[color:var(--color-text-primary)]">{val}</dd>
            </div>
          ))}
        </dl>
        <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">{t.note}</p>
      </section>
    </div>
  );
}
