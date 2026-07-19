"use client";

import { useState } from "react";
import { calculateBtu } from "@/lib/calculations/utility/btu";
import { NumberField } from "@/components/ui/NumberField";

interface BtuFormProps {
  locale: "ko" | "en" | "vi" | "zh";
}

const T = {
  ko: {
    area: "방 면적 (m²)",
    ceiling: "천장 높이 (m)",
    sun: "일조량",
    suns: { low: "약함", normal: "보통", high: "강함" },
    occupants: "상주 인원",
    kitchen: "주방 (조리 열 +4,000 BTU)",
    result: "권장 냉방 용량",
    btu: "권장 BTU",
    pyeong: "한국 평형",
    pyeongUnit: "평형",
    kw: "전력 환산",
    base: "기본 부하",
    adjusted: "보정 후",
    note: "면적 × 600 BTU/m² 기준 + 천장·일조·인원·주방 보정. 한국 에어컨 '평형'(1평형≈1,440 BTU)으로도 환산. 단열·창 크기로 ±20% 차이 가능.",
  },
  en: {
    area: "Room area (m²)",
    ceiling: "Ceiling height (m)",
    sun: "Sun exposure",
    suns: { low: "Low", normal: "Normal", high: "High" },
    occupants: "Occupants",
    kitchen: "Kitchen (+4,000 BTU)",
    result: "Recommended capacity",
    btu: "Recommended BTU",
    pyeong: "Korean type",
    pyeongUnit: "pyeong",
    kw: "Power",
    base: "Base load",
    adjusted: "Adjusted",
    note: "Based on area × 600 BTU/m² plus ceiling/sun/occupant/kitchen adjustments. Also converts to Korean AC 'pyeong type' (1 pyeong ≈ 1,440 BTU). ±20% by insulation and windows.",
  },
  vi: {
    area: "Diện tích phòng (m²)",
    ceiling: "Chiều cao trần (m)",
    sun: "Mức độ ánh nắng",
    suns: { low: "Yếu", normal: "Bình thường", high: "Mạnh" },
    occupants: "Số người thường trú",
    kitchen: "Nhà bếp (nhiệt nấu ăn +4.000 BTU)",
    result: "Công suất làm lạnh khuyến nghị",
    btu: "BTU khuyến nghị",
    pyeong: "Loại điều hòa Hàn Quốc",
    pyeongUnit: "pyeong",
    kw: "Quy đổi công suất",
    base: "Tải cơ bản",
    adjusted: "Sau điều chỉnh",
    note: "Tính theo diện tích × 600 BTU/m² cộng với điều chỉnh trần nhà·ánh nắng·số người·nhà bếp. Cũng quy đổi sang loại điều hòa Hàn Quốc theo 'pyeong' (1 pyeong ≈ 1.440 BTU). Có thể chênh lệch ±20% tùy cách nhiệt và kích thước cửa sổ.",
  },
  zh: {
    area: "房间面积 (m²)",
    ceiling: "天花板高度 (m)",
    sun: "日照量",
    suns: { low: "弱", normal: "一般", high: "强" },
    occupants: "常住人数",
    kitchen: "厨房 (烹饪热量 +4,000 BTU)",
    result: "建议制冷量",
    btu: "建议BTU",
    pyeong: "韩国坪数",
    pyeongUnit: "坪",
    kw: "功率换算",
    base: "基础负荷",
    adjusted: "修正后",
    note: "以面积 × 600 BTU/m² 为基准 + 天花板·日照·人数·厨房修正。同时换算为韩国空调'坪数'(1坪≈1,440 BTU)。因隔热·窗户大小不同，可能有±20%差异。",
  },
} as const;

export function BtuForm({ locale }: BtuFormProps): React.ReactElement {
  const t = T[locale];
  const [area, setArea] = useState(20);
  const [ceiling, setCeiling] = useState(2.4);
  const [sun, setSun] = useState<"low" | "normal" | "high">("normal");
  const [occupants, setOccupants] = useState(2);
  const [kitchen, setKitchen] = useState(false);

  const r = calculateBtu({ areaM2: area, ceilingHeight: ceiling, sunExposure: sun, occupants, isKitchen: kitchen });
  const num = (n: number) => n.toLocaleString();

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-4 p-5 md:p-7">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">{t.area}</label>
            <NumberField
              value={area}
              onChange={setArea}
              thousands={false}
              decimals={1}
              suffix="㎡"
              aria-label={t.area}
            />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">{t.ceiling}</label>
            <NumberField
              value={ceiling}
              onChange={setCeiling}
              thousands={false}
              decimals={1}
              suffix="m"
              aria-label={t.ceiling}
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[color:var(--color-text-secondary)]">{t.sun}</label>
          <div className="grid grid-cols-3 gap-2">
            {(["low", "normal", "high"] as const).map((s) => (
              <button key={s} type="button" onClick={() => setSun(s)}
                className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors ${sun === s ? "bg-gradient-to-br from-amber-500 to-yellow-500 text-white" : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-amber-400"}`}>
                {t.suns[s]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">{t.occupants}</label>
          <NumberField
            value={occupants}
            onChange={setOccupants}
            thousands={false}
            decimals={0}
            aria-label={t.occupants}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)]">
          <input type="checkbox" className="h-4 w-4" checked={kitchen} onChange={(e) => setKitchen(e.target.checked)} />
          {t.kitchen}
        </label>
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">{t.result}</h2>
        <div className="rounded-xl bg-gradient-to-br from-amber-500/15 to-yellow-500/10 p-4 ring-1 ring-amber-500/20">
          <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.btu}</dt>
          <dd className="mt-1 text-4xl font-bold tabular-nums text-[color:var(--color-text-hero)]">{num(r.recommendedBtu)}<span className="ml-1 text-base font-medium text-[color:var(--color-text-secondary)]">BTU</span></dd>
          <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">{t.pyeong} {r.koreanPyeongType}{t.pyeongUnit} · {t.kw} {r.kw} kW</p>
        </div>
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.base}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{num(r.baseBtu)} BTU</dd></div>
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.adjusted}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{num(r.adjustedBtu)} BTU</dd></div>
        </dl>
        <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">{t.note}</p>
      </section>
    </div>
  );
}
