"use client";

import { useState } from "react";
import { calculateGravel } from "@/lib/calculations/timber/gravel";
import { NumberField } from "@/components/ui/NumberField";

interface GravelFormProps {
  locale: "ko" | "en" | "zh" | "vi";
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
  zh: {
    area: "面积 (m²)",
    depth: "铺设厚度 (cm)",
    material: "材料种类",
    materials: { gravel: "砾石", sand: "沙子", crushed: "碎石", soil: "土壤", mixed: "混合" },
    compaction: "压实余量 (%)",
    result: "所需材料量",
    volume: "发注体积",
    volumeUnit: "m³",
    weight: "重量",
    weightUnit: "吨",
    bags: "25kg包装",
    tonBags: "1吨吨袋",
    count: "个",
    density: "密度",
    note: "面积 × 厚度 = 体积，× 密度 = 重量。压实后体积会减少，发注时应包含压实余量(通常20%)。密度会因材料·含水率而有所不同。",
  },
  vi: {
    area: "Diện tích (m²)",
    depth: "Độ dày rải (cm)",
    material: "Loại vật liệu",
    materials: { gravel: "Đá dăm", sand: "Cát", crushed: "Đá vụn", soil: "Đất", mixed: "Hỗn hợp" },
    compaction: "Tỷ lệ hao hụt do lu lèn (%)",
    result: "Lượng vật liệu cần dùng",
    volume: "Thể tích đặt hàng",
    volumeUnit: "m³",
    weight: "Trọng lượng",
    weightUnit: "tấn",
    bags: "Bao 25kg",
    tonBags: "Bao jumbo 1 tấn",
    count: "bao",
    density: "Mật độ",
    note: "Diện tích × độ dày = thể tích, × mật độ = trọng lượng. Lu lèn làm giảm thể tích, nên khi đặt hàng cần cộng thêm tỷ lệ hao hụt (thường 20%). Mật độ có thể thay đổi theo vật liệu và độ ẩm.",
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
            <NumberField value={area} onChange={setArea} thousands={false} decimals={2} min={0} suffix="㎡" aria-label={t.area} />
          </div>
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">{t.depth}</label>
            <NumberField value={depth} onChange={setDepth} thousands={false} decimals={1} min={0} suffix="cm" aria-label={t.depth} />
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
          <NumberField value={compaction} onChange={setCompaction} thousands={false} decimals={0} min={0} max={100} suffix="%" aria-label={t.compaction} />
        </div>
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">{t.result}</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 p-4 ring-1 ring-amber-500/20">
            <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.volume}</dt>
            <dd className="mt-1 text-3xl font-bold tabular-nums text-[color:var(--color-text-hero)]">{fmt(r.volumeWithCompaction)}<span className="ml-1 text-sm font-medium text-[color:var(--color-text-secondary)]">{t.volumeUnit}</span></dd>
          </div>
          <div className="rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 p-4 ring-1 ring-amber-500/20">
            <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.weight}</dt>
            <dd className="mt-1 text-3xl font-bold tabular-nums text-[color:var(--color-text-hero)]">{fmt(r.weightTon)}<span className="ml-1 text-sm font-medium text-[color:var(--color-text-secondary)]">{t.weightUnit}</span></dd>
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
