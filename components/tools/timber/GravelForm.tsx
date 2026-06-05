"use client";

import { useState } from "react";
import { calculateGravel } from "@/lib/calculations/timber/gravel";

interface GravelFormProps {
  locale: "ko" | "en";
}

const T = {
  ko: {
    area: "면적 (m²)",
    depth: "깔기 두께 (cm)",
    material: "자재 종류",
    materials: { gravel: "자갈", sand: "모래", crushed: "쇄석", soil: "흙", mixed: "혼합" },
    compaction: "다짐 여유 (%)",
    result: "필요 자재량",
    volume: "발주 부피",
    volumeUnit: "m³",
    weight: "무게",
    weightUnit: "톤",
    bags: "25kg 포대",
    tonBags: "1톤 톤백",
    count: "개",
    density: "밀도",
    note: "면적 × 두께 = 부피, × 밀도 = 무게. 다짐 시 부피가 줄어 발주는 다짐 여유(보통 20%) 포함. 자재·함수율로 밀도가 달라질 수 있음.",
  },
  en: {
    area: "Area (m²)",
    depth: "Depth (cm)",
    material: "Material",
    materials: { gravel: "Gravel", sand: "Sand", crushed: "Crushed stone", soil: "Soil", mixed: "Mixed" },
    compaction: "Compaction allowance (%)",
    result: "Material needed",
    volume: "Order volume",
    volumeUnit: "m³",
    weight: "Weight",
    weightUnit: "tons",
    bags: "25kg bags",
    tonBags: "1-ton bags",
    count: "",
    density: "Density",
    note: "Area × depth = volume, × density = weight. Compaction reduces volume, so order includes an allowance (usually 20%). Density varies by material and moisture.",
  },
} as const;

export function GravelForm({ locale }: GravelFormProps): React.ReactElement {
  const t = T[locale];
  const [area, setArea] = useState(20);
  const [depth, setDepth] = useState(10);
  const [material, setMaterial] = useState<"gravel" | "sand" | "crushed" | "soil" | "mixed">("gravel");
  const [compaction, setCompaction] = useState(20);

  const r = calculateGravel({ area, depthCm: depth, material, compaction: compaction });
  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-4 p-5 md:p-7">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">{t.area}</label>
            <input type="number" className="input-base" value={area} onChange={(e) => setArea(parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">{t.depth}</label>
            <input type="number" className="input-base" value={depth} onChange={(e) => setDepth(parseFloat(e.target.value) || 0)} />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[color:var(--color-text-secondary)]">{t.material}</label>
          <div className="grid grid-cols-3 gap-2">
            {(["gravel", "sand", "crushed", "soil", "mixed"] as const).map((mtl) => (
              <button key={mtl} type="button" onClick={() => setMaterial(mtl)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${material === mtl ? "bg-gradient-to-br from-amber-600 to-orange-700 text-white" : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-amber-500"}`}>
                {t.materials[mtl]}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">{t.compaction}</label>
          <input type="number" className="input-base" value={compaction} onChange={(e) => setCompaction(parseFloat(e.target.value) || 0)} />
        </div>
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">{t.result}</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 p-4 ring-1 ring-amber-500/20">
            <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.volume}</dt>
            <dd className="mt-1 text-3xl font-bold tabular-nums text-[#eef0f5]">{fmt(r.volumeWithCompaction)}<span className="ml-1 text-sm font-medium text-[color:var(--color-text-secondary)]">{t.volumeUnit}</span></dd>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 p-4 ring-1 ring-amber-500/20">
            <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.weight}</dt>
            <dd className="mt-1 text-3xl font-bold tabular-nums text-[#eef0f5]">{fmt(r.weightTon)}<span className="ml-1 text-sm font-medium text-[color:var(--color-text-secondary)]">{t.weightUnit}</span></dd>
          </div>
        </div>
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.density}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{r.density} t/m³</dd></div>
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.bags}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{r.bags25kg} {t.count}</dd></div>
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.tonBags}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{r.tonBags} {t.count}</dd></div>
        </dl>
        <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">{t.note}</p>
      </section>
    </div>
  );
}
