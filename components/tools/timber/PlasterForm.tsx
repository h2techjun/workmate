"use client";

import { useState } from "react";
import { calculatePlaster } from "@/lib/calculations/timber/plaster";
import { NumberField } from "@/components/ui/NumberField";

interface PlasterFormProps {
  locale: "ko" | "en" | "zh" | "vi";
}

type MixRatio = "1:2" | "1:3" | "1:4";

const T = {
  ko: {
    area: "미장 면적 (m²)",
    thickness: "미장 두께 (mm)",
    mixRatio: "배합비 (시멘트:모래)",
    mixRatios: { "1:2": "1:2 (고강도)", "1:3": "1:3 (일반)", "1:4": "1:4 (저강도)" },
    waste: "할증 (%)",
    result: "필요 자재량",
    mortar: "모르타르 부피",
    cement: "시멘트 (40kg)",
    cementBags: "포대",
    cementKg: "시멘트 중량",
    sand: "모래",
    mixRatioLabel: "적용 배합비",
    note: "건설공사 표준품셈 기준. 두께 24mm는 초벌+재벌+정벌 3회 미장의 통상값입니다. 배합비는 시멘트:모래 부피비이며, 고강도(1:2)일수록 시멘트 소요량이 늘어납니다.",
  },
  en: {
    area: "Plaster area (m²)",
    thickness: "Plaster thickness (mm)",
    mixRatio: "Mix ratio (cement:sand)",
    mixRatios: { "1:2": "1:2 (high strength)", "1:3": "1:3 (standard)", "1:4": "1:4 (low strength)" },
    waste: "Waste (%)",
    result: "Materials needed",
    mortar: "Mortar volume",
    cement: "Cement (40kg)",
    cementBags: "bags",
    cementKg: "Cement weight",
    sand: "Sand",
    mixRatioLabel: "Mix ratio applied",
    note: "Based on Korean standard estimation. A 24mm thickness is the typical total for 3-coat plastering (base + middle + finish). The ratio is cement:sand by volume — richer mixes (1:2) need more cement.",
  },
  zh: {
    area: "抹灰面积 (m²)",
    thickness: "抹灰厚度 (mm)",
    mixRatio: "配合比 (水泥:沙子)",
    mixRatios: { "1:2": "1:2 (高强度)", "1:3": "1:3 (标准)", "1:4": "1:4 (低强度)" },
    waste: "损耗率 (%)",
    result: "所需材料量",
    mortar: "砂浆体积",
    cement: "水泥(40kg)",
    cementBags: "袋",
    cementKg: "水泥重量",
    sand: "沙子",
    mixRatioLabel: "适用配合比",
    note: "依据韩国建设工程标准估算。厚度24mm是底层+中层+面层三道抹灰的常见总厚度。配合比为水泥:沙子体积比，比例越浓(1:2)所需水泥越多。",
  },
  vi: {
    area: "Diện tích trát (m²)",
    thickness: "Độ dày trát (mm)",
    mixRatio: "Tỷ lệ pha (xi măng:cát)",
    mixRatios: { "1:2": "1:2 (cường độ cao)", "1:3": "1:3 (tiêu chuẩn)", "1:4": "1:4 (cường độ thấp)" },
    waste: "Hao hụt (%)",
    result: "Vật liệu cần dùng",
    mortar: "Thể tích vữa",
    cement: "Xi măng (40kg)",
    cementBags: "bao",
    cementKg: "Khối lượng xi măng",
    sand: "Cát",
    mixRatioLabel: "Tỷ lệ áp dụng",
    note: "Theo định mức xây dựng Hàn Quốc. Độ dày 24mm là tổng thông thường của 3 lớp trát (lót + giữa + hoàn thiện). Tỷ lệ là xi măng:cát theo thể tích — tỷ lệ đậm hơn (1:2) cần nhiều xi măng hơn.",
  },
} as const;

export function PlasterForm({ locale }: PlasterFormProps): React.ReactElement {
  const t = T[locale];
  const [area, setArea] = useState(10);
  const [thickness, setThickness] = useState(24);
  const [mixRatio, setMixRatio] = useState<MixRatio>("1:3");
  const [waste, setWaste] = useState(5);

  const r = calculatePlaster({ area, thickness, mixRatio, waste });
  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-4 p-5 md:p-7">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.area}
          </label>
          <NumberField value={area} onChange={setArea} thousands={false} decimals={2} min={0} suffix="㎡" aria-label={t.area} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.thickness}
          </label>
          <NumberField value={thickness} onChange={setThickness} thousands={false} decimals={0} min={1} max={200} suffix="mm" aria-label={t.thickness} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.mixRatio}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["1:2", "1:3", "1:4"] as const).map((mr) => (
              <button
                key={mr}
                type="button"
                onClick={() => setMixRatio(mr)}
                className={`rounded-lg px-2 py-3 text-xs font-medium transition-colors ${mixRatio === mr ? "bg-gradient-to-br from-amber-600 to-orange-700 text-white" : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-amber-500"}`}
              >
                {t.mixRatios[mr]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.waste}
          </label>
          <NumberField value={waste} onChange={setWaste} thousands={false} decimals={0} min={0} max={30} suffix="%" aria-label={t.waste} />
        </div>
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">{t.result}</h2>
        <div className="rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 p-4 ring-1 ring-amber-500/20">
          <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.cement}</dt>
          <dd className="mt-1 text-3xl font-bold tabular-nums text-[color:var(--color-text-hero)]">
            {fmt(r.cementBags)}
            <span className="ml-1 text-sm font-medium text-[color:var(--color-text-secondary)]">{t.cementBags}</span>
          </dd>
        </div>
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.mortar}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{fmt(r.mortarM3)} m³</dd></div>
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.cementKg}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{fmt(r.cementKg)} kg</dd></div>
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.sand}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{fmt(r.sandM3)} m³</dd></div>
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.mixRatioLabel}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{r.mixRatio}</dd></div>
        </dl>
        <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">{t.note}</p>
      </section>
    </div>
  );
}
