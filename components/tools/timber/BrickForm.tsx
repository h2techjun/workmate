"use client";

import { useState } from "react";
import { calculateBrick } from "@/lib/calculations/timber/brick";
import { NumberField } from "@/components/ui/NumberField";

interface BrickFormProps {
  locale: "ko" | "en" | "zh" | "vi";
}

type BrickType = "standard" | "cement" | "block";
type Bond = "half" | "one" | "oneHalf" | "two";

const T = {
  ko: {
    wallArea: "벽 면적 (m²)",
    brickType: "벽돌 종류",
    types: { standard: "표준형 벽돌", cement: "시멘트 벽돌", block: "콘크리트 블록" },
    bond: "쌓기 두께",
    bonds: { half: "0.5B 반장", one: "1.0B 한장", oneHalf: "1.5B", two: "2.0B" },
    waste: "할증 (%)",
    result: "필요 자재량",
    bricks: "벽돌 (발주)",
    bricksNet: "정미 수량",
    unit: "매",
    mortar: "모르타르",
    cement: "시멘트 (40kg)",
    cementBags: "포대",
    sand: "모래",
    perM2: "단위 수량 (매/m²)",
    note: "건설공사 표준품셈 기준(줄눈 10mm). 개구부를 제외한 순수 벽 면적을 입력하세요. 콘크리트 블록은 쌓기 두께와 무관한 단일 규격입니다.",
  },
  en: {
    wallArea: "Wall area (m²)",
    brickType: "Brick type",
    types: { standard: "Standard brick", cement: "Cement brick", block: "Concrete block" },
    bond: "Wall thickness",
    bonds: { half: "0.5B", one: "1.0B", oneHalf: "1.5B", two: "2.0B" },
    waste: "Waste (%)",
    result: "Materials needed",
    bricks: "Bricks (order)",
    bricksNet: "Net count",
    unit: "pcs",
    mortar: "Mortar",
    cement: "Cement (40kg)",
    cementBags: "bags",
    sand: "Sand",
    perM2: "Units per m²",
    note: "Based on Korean standard estimation (10mm joint). Enter net wall area excluding openings. Concrete block is a single size regardless of wall thickness.",
  },
  zh: {
    wallArea: "墙面面积 (m²)",
    brickType: "砖块种类",
    types: { standard: "标准砖", cement: "水泥砖", block: "混凝土砌块" },
    bond: "砌筑厚度",
    bonds: { half: "0.5B(半砖)", one: "1.0B(整砖)", oneHalf: "1.5B", two: "2.0B" },
    waste: "损耗率 (%)",
    result: "所需材料量",
    bricks: "砖块(发注)",
    bricksNet: "净数量",
    unit: "块",
    mortar: "砂浆",
    cement: "水泥(40kg)",
    cementBags: "袋",
    sand: "沙子",
    perM2: "单位数量(块/m²)",
    note: "依据韩国建设工程标准估算(灰缝10mm)。请输入扣除门窗洞口后的净墙面面积。混凝土砌块为单一规格，与砌筑厚度无关。",
  },
  vi: {
    wallArea: "Diện tích tường (m²)",
    brickType: "Loại gạch",
    types: { standard: "Gạch tiêu chuẩn", cement: "Gạch xi măng", block: "Block bê tông" },
    bond: "Độ dày tường",
    bonds: { half: "0.5B", one: "1.0B", oneHalf: "1.5B", two: "2.0B" },
    waste: "Hao hụt (%)",
    result: "Vật liệu cần dùng",
    bricks: "Gạch (đặt hàng)",
    bricksNet: "Số lượng thực",
    unit: "viên",
    mortar: "Vữa",
    cement: "Xi măng (40kg)",
    cementBags: "bao",
    sand: "Cát",
    perM2: "Số lượng mỗi m²",
    note: "Theo định mức xây dựng Hàn Quốc (mạch vữa 10mm). Nhập diện tích tường thực đã trừ ô cửa. Block bê tông là một kích cỡ duy nhất, không phụ thuộc độ dày tường.",
  },
} as const;

export function BrickForm({ locale }: BrickFormProps): React.ReactElement {
  const t = T[locale];
  const [wallArea, setWallArea] = useState(10);
  const [brickType, setBrickType] = useState<BrickType>("standard");
  const [bond, setBond] = useState<Bond>("one");
  const [waste, setWaste] = useState(5);

  const isBlock = brickType === "block";
  const r = calculateBrick({ wallArea, brickType, bond, waste });
  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-4 p-5 md:p-7">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.wallArea}
          </label>
          <NumberField value={wallArea} onChange={setWallArea} thousands={false} decimals={2} min={0} suffix="㎡" aria-label={t.wallArea} />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.brickType}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["standard", "cement", "block"] as const).map((bt) => (
              <button
                key={bt}
                type="button"
                onClick={() => setBrickType(bt)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${brickType === bt ? "bg-gradient-to-br from-amber-600 to-orange-700 text-white" : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-amber-500"}`}
              >
                {t.types[bt]}
              </button>
            ))}
          </div>
        </div>
        {!isBlock && (
          <div>
            <label className="mb-2 block text-sm font-medium text-[color:var(--color-text-secondary)]">
              {t.bond}
            </label>
            <div className="grid grid-cols-4 gap-2">
              {(["half", "one", "oneHalf", "two"] as const).map((b) => (
                <button
                  key={b}
                  type="button"
                  onClick={() => setBond(b)}
                  className={`rounded-lg px-2 py-2 text-xs font-medium transition-colors ${bond === b ? "bg-gradient-to-br from-amber-600 to-orange-700 text-white" : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-amber-500"}`}
                >
                  {t.bonds[b]}
                </button>
              ))}
            </div>
          </div>
        )}
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
          <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.bricks}</dt>
          <dd className="mt-1 text-3xl font-bold tabular-nums text-[color:var(--color-text-hero)]">
            {fmt(r.bricks)}
            <span className="ml-1 text-sm font-medium text-[color:var(--color-text-secondary)]">{t.unit}</span>
          </dd>
        </div>
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.bricksNet}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{fmt(r.bricksNet)} {t.unit}</dd></div>
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.perM2}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{r.perM2}</dd></div>
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.mortar}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{fmt(r.mortarM3)} m³</dd></div>
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.cement}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{r.cementBags} {t.cementBags}</dd></div>
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.sand}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{fmt(r.sandM3)} m³</dd></div>
        </dl>
        <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">{t.note}</p>
      </section>
    </div>
  );
}
