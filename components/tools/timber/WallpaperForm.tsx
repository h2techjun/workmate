"use client";

import { useState } from "react";
import { calculateWallpaper } from "@/lib/calculations/timber/wallpaper";
import { NumberField } from "@/components/ui/NumberField";

interface WallpaperFormProps {
  locale: "ko" | "en" | "zh" | "vi";
}

type WallpaperType = "paper" | "silk" | "import";
type AreaMode = "area" | "room";

const T = {
  ko: {
    areaMode: "면적 입력 방식",
    modeArea: "벽 면적 직접입력",
    modeRoom: "둘레 × 높이",
    wallArea: "벽 면적 (m²)",
    perimeter: "방 둘레 (m)",
    ceilingHeight: "천장 높이 (m)",
    computedArea: "계산된 벽 면적",
    wallpaperType: "벽지 종류",
    types: { paper: "합지", silk: "실크", import: "수입 벽지" },
    patternMatch: "무늬 맞춤(리피트)",
    patternOptions: { off: "무늬 없음", on: "무늬 맞춤" },
    result: "필요 자재량",
    rolls: "필요 롤 수",
    unit: "롤",
    coveragePerRoll: "롤당 커버 면적",
    wastePercent: "적용 로스율",
    areaWithWaste: "로스 포함 시공 면적",
    glueKg: "도배풀 필요량",
    note: "국산 광폭 벽지(합지·실크)는 폭 106cm×길이 15.6m(약 16.5㎡ 커버), 수입 벽지는 폭 53cm×길이 10m(약 5.3㎡ 커버) 기준입니다. 무늬 맞춤(리피트) 시공은 재단 손실이 늘어 로스율이 20%로 올라갑니다. 도배풀은 초배·정배 기준 롤당 약 1kg으로 추정합니다.",
  },
  en: {
    areaMode: "Area input method",
    modeArea: "Enter wall area directly",
    modeRoom: "Perimeter × height",
    wallArea: "Wall area (m²)",
    perimeter: "Room perimeter (m)",
    ceilingHeight: "Ceiling height (m)",
    computedArea: "Computed wall area",
    wallpaperType: "Wallpaper type",
    types: { paper: "Paper (合紙)", silk: "Silk (vinyl-coated)", import: "Imported" },
    patternMatch: "Pattern match (repeat)",
    patternOptions: { off: "No pattern", on: "Pattern match" },
    result: "Materials needed",
    rolls: "Rolls needed",
    unit: "rolls",
    coveragePerRoll: "Coverage per roll",
    wastePercent: "Applied loss rate",
    areaWithWaste: "Area incl. loss",
    glueKg: "Wallpaper glue needed",
    note: "Korean wide-format wallpaper (paper/silk) is 106cm wide × 15.6m long (~16.5m² coverage); imported rolls are 53cm × 10m (~5.3m² coverage). Pattern-match (repeat) installs raise the loss rate to 20% from extra trimming. Glue is estimated at ~1kg per roll (base + finish layer).",
  },
  zh: {
    areaMode: "面积输入方式",
    modeArea: "直接输入墙面面积",
    modeRoom: "周长 × 高度",
    wallArea: "墙面面积 (m²)",
    perimeter: "房间周长 (m)",
    ceilingHeight: "天花板高度 (m)",
    computedArea: "计算所得墙面面积",
    wallpaperType: "壁纸种类",
    types: { paper: "合纸壁纸", silk: "丝绒壁纸", import: "进口壁纸" },
    patternMatch: "对花(花纹拼接)",
    patternOptions: { off: "无花纹", on: "对花施工" },
    result: "所需材料量",
    rolls: "所需卷数",
    unit: "卷",
    coveragePerRoll: "每卷覆盖面积",
    wastePercent: "适用损耗率",
    areaWithWaste: "含损耗施工面积",
    glueKg: "所需壁纸胶",
    note: "韩国国产宽幅壁纸(合纸·丝绒)规格为宽106cm×长15.6m(约覆盖16.5m²)，进口壁纸为宽53cm×长10m(约覆盖5.3m²)。对花(花纹拼接)施工裁剪损耗增加，损耗率提高至20%。壁纸胶按基层+饰面裱糊估算每卷约1kg。",
  },
  vi: {
    areaMode: "Cách nhập diện tích",
    modeArea: "Nhập trực tiếp diện tích tường",
    modeRoom: "Chu vi × chiều cao",
    wallArea: "Diện tích tường (m²)",
    perimeter: "Chu vi phòng (m)",
    ceilingHeight: "Chiều cao trần (m)",
    computedArea: "Diện tích tường đã tính",
    wallpaperType: "Loại giấy dán tường",
    types: { paper: "Giấy hợp chỉ", silk: "Giấy lụa (silk)", import: "Giấy nhập khẩu" },
    patternMatch: "Khớp hoa văn (lặp)",
    patternOptions: { off: "Không hoa văn", on: "Khớp hoa văn" },
    result: "Vật liệu cần dùng",
    rolls: "Số cuộn cần",
    unit: "cuộn",
    coveragePerRoll: "Diện tích phủ mỗi cuộn",
    wastePercent: "Tỷ lệ hao hụt áp dụng",
    areaWithWaste: "Diện tích thi công gồm hao hụt",
    glueKg: "Lượng keo dán cần dùng",
    note: "Giấy dán tường khổ rộng nội địa Hàn Quốc (hợp chỉ·lụa) khổ 106cm × dài 15.6m (phủ khoảng 16.5m²); giấy nhập khẩu khổ 53cm × dài 10m (phủ khoảng 5.3m²). Thi công khớp hoa văn (lặp) làm tăng hao hụt cắt, tỷ lệ hao hụt tăng lên 20%. Keo dán ước tính khoảng 1kg mỗi cuộn (lớp lót + lớp hoàn thiện).",
  },
} as const;

export function WallpaperForm({ locale }: WallpaperFormProps): React.ReactElement {
  const t = T[locale];
  const [areaMode, setAreaMode] = useState<AreaMode>("area");
  const [wallArea, setWallArea] = useState(16.5);
  const [perimeter, setPerimeter] = useState(14);
  const [ceilingHeight, setCeilingHeight] = useState(2.4);
  const [wallpaperType, setWallpaperType] = useState<WallpaperType>("silk");
  const [patternMatch, setPatternMatch] = useState(false);

  const computedArea = perimeter * ceilingHeight;
  const effectiveArea = areaMode === "area" ? wallArea : computedArea;

  const r = calculateWallpaper({
    wallArea: effectiveArea,
    wallpaperType,
    patternMatch,
  });
  const fmt = (n: number) => n.toLocaleString(undefined, { maximumFractionDigits: 2 });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-4 p-5 md:p-7">
        <div>
          <label className="mb-2 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.areaMode}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["area", "room"] as const).map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setAreaMode(m)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${areaMode === m ? "bg-gradient-to-br from-amber-600 to-orange-700 text-white" : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-amber-500"}`}
              >
                {m === "area" ? t.modeArea : t.modeRoom}
              </button>
            ))}
          </div>
        </div>

        {areaMode === "area" ? (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
              {t.wallArea}
            </label>
            <NumberField value={wallArea} onChange={setWallArea} thousands={false} decimals={2} min={0} suffix="㎡" aria-label={t.wallArea} />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
                  {t.perimeter}
                </label>
                <NumberField value={perimeter} onChange={setPerimeter} thousands={false} decimals={2} min={0} suffix="m" aria-label={t.perimeter} />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
                  {t.ceilingHeight}
                </label>
                <NumberField value={ceilingHeight} onChange={setCeilingHeight} thousands={false} decimals={2} min={0} suffix="m" aria-label={t.ceilingHeight} />
              </div>
            </div>
            <p className="text-xs text-[color:var(--color-text-tertiary)]">
              {t.computedArea}: <span className="font-medium tabular-nums text-[color:var(--color-text-secondary)]">{fmt(computedArea)} ㎡</span>
            </p>
          </>
        )}

        <div>
          <label className="mb-2 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.wallpaperType}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {(["paper", "silk", "import"] as const).map((wt) => (
              <button
                key={wt}
                type="button"
                onClick={() => setWallpaperType(wt)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${wallpaperType === wt ? "bg-gradient-to-br from-amber-600 to-orange-700 text-white" : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-amber-500"}`}
              >
                {t.types[wt]}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.patternMatch}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {([false, true] as const).map((pm) => (
              <button
                key={String(pm)}
                type="button"
                onClick={() => setPatternMatch(pm)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${patternMatch === pm ? "bg-gradient-to-br from-amber-600 to-orange-700 text-white" : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-amber-500"}`}
              >
                {pm ? t.patternOptions.on : t.patternOptions.off}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">{t.result}</h2>
        <div className="rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 p-4 ring-1 ring-amber-500/20">
          <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.rolls}</dt>
          <dd className="mt-1 text-3xl font-bold tabular-nums text-[color:var(--color-text-hero)]">
            {fmt(r.rolls)}
            <span className="ml-1 text-sm font-medium text-[color:var(--color-text-secondary)]">{t.unit}</span>
          </dd>
        </div>
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.coveragePerRoll}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{fmt(r.coveragePerRoll)} ㎡</dd></div>
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.wastePercent}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{r.wastePercent}%</dd></div>
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.areaWithWaste}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{fmt(r.areaWithWaste)} ㎡</dd></div>
          <div className="flex justify-between"><dt className="text-[color:var(--color-text-tertiary)]">{t.glueKg}</dt><dd className="tabular-nums text-[color:var(--color-text-secondary)]">{fmt(r.glueKg)} kg</dd></div>
        </dl>
        <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">{t.note}</p>
      </section>
    </div>
  );
}
