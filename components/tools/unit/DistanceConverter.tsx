"use client";

import { useState } from "react";
import {
  convertDistance,
  type DistanceUnit,
} from "@/lib/calculations/unit/distance";
import { NumberField } from "@/components/ui/NumberField";

interface DistanceConverterProps {
  locale: "ko" | "en" | "vi" | "zh";
}

const fmt = (n: number): string =>
  n.toLocaleString(undefined, { maximumFractionDigits: 4 });

const T = {
  ko: {
    value: "값 입력",
    unit: "단위 선택",
    units: { ri: "리(里)", ja: "자(尺)", bo: "보(步)", m: "미터(m)", km: "킬로미터(km)", mile: "마일", yard: "야드", ft: "피트", inch: "인치" } as Record<DistanceUnit, string>,
    result: "변환 결과",
    korean: "한국 전통",
    metric: "미터법",
    imperial: "야드파운드",
    note: "1자 = 10/33m ≈ 0.303m, 1리 = 1,296자 ≈ 392.7m (10리 ≈ 3.93km). 시대·지역별로 리 정의가 달랐으나 가장 널리 쓰이는 값 기준.",
  },
  en: {
    value: "Value",
    unit: "Unit",
    units: { ri: "Ri (里)", ja: "Ja (尺)", bo: "Bo (步)", m: "Meter (m)", km: "Kilometer (km)", mile: "Mile", yard: "Yard", ft: "Feet", inch: "Inch" } as Record<DistanceUnit, string>,
    result: "Conversion",
    korean: "Korean traditional",
    metric: "Metric",
    imperial: "Imperial",
    note: "1 ja = 10/33 m ≈ 0.303 m, 1 ri = 1,296 ja ≈ 392.7 m (10 ri ≈ 3.93 km). Ri varied by era/region; the most common value is used.",
  },
  zh: {
    value: "输入数值",
    unit: "选择单位",
    units: { ri: "里", ja: "尺", bo: "步", m: "米 (m)", km: "千米 (km)", mile: "英里 (mile)", yard: "码 (yard)", ft: "英尺 (ft)", inch: "英寸 (inch)" } as Record<DistanceUnit, string>,
    result: "换算结果",
    korean: "韩国传统单位",
    metric: "公制",
    imperial: "英制",
    note: "1尺 = 10/33m ≈ 0.303m，1里 = 1,296尺 ≈ 392.7m (10里 ≈ 3.93km)。里的定义因时代和地区而异，此处采用最常用的数值为准。",
  },
  vi: {
    value: "Nhập giá trị",
    unit: "Chọn đơn vị",
    units: { ri: "Ri (里)", ja: "Ja (尺)", bo: "Bo (步)", m: "Mét (m)", km: "Ki-lô-mét (km)", mile: "Dặm (mile)", yard: "Yard", ft: "Feet", inch: "Inch" } as Record<DistanceUnit, string>,
    result: "Kết quả quy đổi",
    korean: "Đơn vị truyền thống Hàn Quốc",
    metric: "Hệ mét",
    imperial: "Hệ Anh - Mỹ",
    note: "1 ja = 10/33 m ≈ 0,303 m, 1 ri = 1.296 ja ≈ 392,7 m (10 ri ≈ 3,93 km). Giá trị của ri từng khác nhau theo thời đại/vùng miền; ở đây dùng giá trị phổ biến nhất.",
  },
} as const;

const KOREAN_UNITS: DistanceUnit[] = ["ri", "bo", "ja"];
const METRIC_UNITS: DistanceUnit[] = ["km", "m"];
const IMPERIAL_UNITS: DistanceUnit[] = ["mile", "yard", "ft", "inch"];

export function DistanceConverter({
  locale,
}: DistanceConverterProps): React.ReactElement {
  const t = T[locale];
  const [value, setValue] = useState(10);
  const [unit, setUnit] = useState<DistanceUnit>("ri");

  const r = convertDistance({ value, unit });

  const group = (title: string, units: DistanceUnit[]) => (
    <div>
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">{title}</h3>
      <dl className="space-y-1.5">
        {units.map((u) => (
          <div key={u} className="flex items-center justify-between rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] px-3 py-2">
            <dt className="text-sm text-[color:var(--color-text-secondary)]">{t.units[u]}</dt>
            <dd className="text-base font-bold tabular-nums text-[color:var(--color-text-primary)]">{fmt(r[u])}</dd>
          </div>
        ))}
      </dl>
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-5 p-5 md:p-7">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">{t.value}</label>
          <NumberField
            value={value}
            onChange={setValue}
            thousands={true}
            decimals={4}
            aria-label={t.value}
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">{t.unit}</label>
          <div className="grid grid-cols-3 gap-2">
            {(Object.keys(t.units) as DistanceUnit[]).map((u) => (
              <button key={u} type="button" onClick={() => setUnit(u)}
                className={`rounded-lg px-2 py-2 text-xs font-medium transition-colors ${unit === u ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white" : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-indigo-400"}`}>
                {t.units[u]}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">{t.result}</h2>
        {group(t.korean, KOREAN_UNITS)}
        {group(t.metric, METRIC_UNITS)}
        {group(t.imperial, IMPERIAL_UNITS)}
        <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">{t.note}</p>
      </section>
    </div>
  );
}
