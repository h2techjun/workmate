"use client";

import { useState } from "react";
import { calculateRebar, type RebarSize } from "@/lib/calculations/timber/rebar";
import { NumberField } from "@/components/ui/NumberField";

interface RebarFormProps {
  locale: "ko" | "en" | "zh" | "vi";
}

const SIZES: RebarSize[] = ["D10", "D13", "D16", "D19", "D22", "D25", "D29", "D32"];

const T = {
  ko: {
    size: "철근 규격",
    length: "1본 길이 (m)",
    count: "본수",
    unit: "본",
    waste: "할증 (%)",
    result: "필요 자재량",
    weight: "발주 중량",
    kg: "kg",
    ton: "톤(t) 환산",
    netWeight: "총중량 (정미)",
    totalLength: "총길이",
    unitWeight: "단위중량 (kg/m)",
    note: "KS D 3504 이형철근 단위중량 기준입니다. 발주 중량은 총중량(정미)에 할증률을 더해 산출하며, 실제 발주 시 이음·가공 손실을 고려해 여유량을 확인하세요.",
  },
  en: {
    size: "Rebar size",
    length: "Length per bar (m)",
    count: "Bar count",
    unit: "bars",
    waste: "Waste (%)",
    result: "Materials needed",
    weight: "Order weight",
    kg: "kg",
    ton: "In tons (t)",
    netWeight: "Net weight",
    totalLength: "Total length",
    unitWeight: "Unit weight (kg/m)",
    note: "Based on KS D 3504 deformed rebar unit weight. Order weight adds the waste margin to net weight — confirm extra allowance for splicing and cutting loss before ordering.",
  },
  zh: {
    size: "钢筋规格",
    length: "单根长度 (m)",
    count: "根数",
    unit: "根",
    waste: "损耗率 (%)",
    result: "所需材料量",
    weight: "发注重量",
    kg: "kg",
    ton: "换算吨(t)",
    netWeight: "总重量(净)",
    totalLength: "总长度",
    unitWeight: "单位重量 (kg/m)",
    note: "依据韩国 KS D 3504 异形钢筋单位重量标准。发注重量在净重量基础上加上损耗率，实际发注时请另行确认搭接·加工损耗余量。",
  },
  vi: {
    size: "Quy cách thép",
    length: "Chiều dài mỗi thanh (m)",
    count: "Số thanh",
    unit: "thanh",
    waste: "Hao hụt (%)",
    result: "Vật liệu cần dùng",
    weight: "Khối lượng đặt hàng",
    kg: "kg",
    ton: "Quy đổi tấn (t)",
    netWeight: "Tổng khối lượng (thực)",
    totalLength: "Tổng chiều dài",
    unitWeight: "Khối lượng đơn vị (kg/m)",
    note: "Theo khối lượng đơn vị thép gân KS D 3504 (Hàn Quốc). Khối lượng đặt hàng = khối lượng thực cộng hao hụt — khi đặt hàng thực tế hãy tính thêm phần nối buộc, hao hụt gia công.",
  },
} as const;

export function RebarForm({ locale }: RebarFormProps): React.ReactElement {
  const t = T[locale];
  const [size, setSize] = useState<RebarSize>("D13");
  const [lengthM, setLengthM] = useState(6);
  const [count, setCount] = useState(100);
  const [waste, setWaste] = useState(3);

  const r = calculateRebar({ size, lengthM, count, waste });
  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-4 p-5 md:p-7">
        <div>
          <label className="mb-2 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.size}
          </label>
          <div className="grid grid-cols-4 gap-2">
            {SIZES.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={`rounded-lg px-2 py-2 text-sm font-medium transition-colors ${size === s ? "bg-gradient-to-br from-amber-600 to-orange-700 text-white" : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-amber-500"}`}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.length}
          </label>
          <NumberField value={lengthM} onChange={setLengthM} thousands={false} decimals={2} min={0} suffix="m" aria-label={t.length} />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.count}
          </label>
          <NumberField value={count} onChange={setCount} thousands={true} decimals={0} min={0} suffix={t.unit} aria-label={t.count} />
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
          <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.weight}</dt>
          <dd className="mt-1 text-3xl font-bold tabular-nums text-[color:var(--color-text-hero)]">
            {fmt(r.weightKg)}
            <span className="ml-1 text-sm font-medium text-[color:var(--color-text-secondary)]">{t.kg}</span>
          </dd>
          <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
            {t.ton}: {fmt(r.weightTon)} t
          </p>
        </div>
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.totalLength}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{fmt(r.totalLengthM)} m</dd></div>
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.netWeight}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{fmt(r.netWeightKg)} {t.kg}</dd></div>
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.unitWeight}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{r.unitWeight}</dd></div>
        </dl>
        <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">{t.note}</p>
      </section>
    </div>
  );
}
