/**
 * 타일 매수 계산기 — Tile Calculator
 *
 * 면적 + 타일 크기 + 줄눈 너비 + 손실률 → 타일 매수 + 본드/줄눈재 수량.
 *
 *   tile_footprint = (w + grout) × (h + grout)   // 줄눈 포함 점유 면적
 *   tile_count     = ceil(area × (1 + waste) / footprint)
 *   adhesive_kg    = area × adhesive_rate (4 kg/m² 기본)
 *   grout_kg       = area × grout_rate    (타일 크기·줄눈 너비별)
 *
 * 한국 시공 가정 (KS L 1001 도자기질 타일):
 *   - 본드(타일 접착제): 3~5 kg/m² 평균 4 kg/m²
 *   - 줄눈 충전재: 큰 타일·좁은 줄눈일수록 적게 들어감. 0.2~0.6 kg/m² 범위.
 */

import { z } from "zod";

export const TILE_PRESETS = [
  { sizeMm: 100, label: "100×100" },
  { sizeMm: 200, label: "200×200" },
  { sizeMm: 300, label: "300×300" },
  { sizeMm: 400, label: "400×400" },
  { sizeMm: 600, label: "600×600" },
  { sizeMm: 800, label: "800×800" },
] as const;

export const tileInputSchema = z.object({
  /** 시공 면적 (m²) */
  areaM2: z
    .number()
    .min(0.5, "validation.areaMin")
    .max(5000, "validation.areaMax"),
  /** 타일 가로 (mm) — 정사각형 가정. 직사각형은 두 변 평균. */
  tileWidthMm: z
    .number()
    .min(50, "validation.tileMin")
    .max(1500, "validation.tileMax"),
  /** 타일 세로 (mm) — 정사각형은 width 와 같음 */
  tileHeightMm: z
    .number()
    .min(50, "validation.tileMin")
    .max(1500, "validation.tileMax"),
  /** 줄눈 너비 (mm) — 보통 자기질 2mm, 도기질 3~5mm */
  groutMm: z
    .number()
    .min(0, "validation.groutMin")
    .max(15, "validation.groutMax")
    .default(2),
  /** 손실률 (%) — 절단·파손 여유 */
  wasteFactorPercent: z
    .number()
    .min(0, "validation.wasteMin")
    .max(50, "validation.wasteMax")
    .default(10),
});

export type TileInput = z.input<typeof tileInputSchema>;
export type TileInputResolved = z.output<typeof tileInputSchema>;

export type TileStep =
  | {
      key: "footprint";
      w: number;
      h: number;
      grout: number;
      result: number;
    }
  | { key: "wasteArea"; area: number; waste: number; result: number }
  | { key: "count"; wasteArea: number; footprint: number; result: number }
  | { key: "adhesive"; area: number; rate: number; result: number }
  | { key: "grout"; area: number; rate: number; result: number };

export interface TileResult {
  /** 타일 매수 (손실률 반영) */
  tileCount: number;
  /** 타일 1매 점유 면적 (m², 줄눈 포함) */
  tileFootprintM2: number;
  /** 손실률 적용 후 면적 (m²) */
  adjustedAreaM2: number;
  /** 본드 무게 (kg) */
  adhesiveKg: number;
  /** 줄눈 충전재 무게 (kg) */
  groutKg: number;
  /** 계산 과정 */
  steps: ReadonlyArray<TileStep>;
}

/**
 * 줄눈 충전재 사용량 (kg/m²) — 타일 크기·줄눈 너비 조합 기반 경험식.
 *   rate = grout_width × (tile_perimeter / tile_area) × 2 × density
 *        ≈ grout_mm × 4 / avg_tile_size_mm × 1.6 (꽉 채움 가정)
 */
function groutRatePerM2(tileW: number, tileH: number, groutMm: number): number {
  if (groutMm <= 0) return 0;
  const avgSize = (tileW + tileH) / 2;
  // 단순화한 경험식: 작은 타일·넓은 줄눈일수록 ↑
  return Math.max(0.1, (groutMm * 4) / avgSize * 1.6);
}

const ADHESIVE_RATE_KG_PER_M2 = 4;

export function calculateTile(input: TileInputResolved): TileResult {
  const groutM = input.groutMm / 1000;
  const tileWM = input.tileWidthMm / 1000;
  const tileHM = input.tileHeightMm / 1000;

  const footprint = (tileWM + groutM) * (tileHM + groutM);
  const adjustedArea = input.areaM2 * (1 + input.wasteFactorPercent / 100);
  const tileCount = Math.ceil(adjustedArea / footprint);

  const adhesiveKg = input.areaM2 * ADHESIVE_RATE_KG_PER_M2;
  const groutRate = groutRatePerM2(
    input.tileWidthMm,
    input.tileHeightMm,
    input.groutMm,
  );
  const groutKg = input.areaM2 * groutRate;

  const steps: TileStep[] = [
    {
      key: "footprint",
      w: input.tileWidthMm,
      h: input.tileHeightMm,
      grout: input.groutMm,
      result: footprint,
    },
    {
      key: "wasteArea",
      area: input.areaM2,
      waste: input.wasteFactorPercent,
      result: adjustedArea,
    },
    {
      key: "count",
      wasteArea: adjustedArea,
      footprint,
      result: tileCount,
    },
    {
      key: "adhesive",
      area: input.areaM2,
      rate: ADHESIVE_RATE_KG_PER_M2,
      result: adhesiveKg,
    },
    {
      key: "grout",
      area: input.areaM2,
      rate: groutRate,
      result: groutKg,
    },
  ];

  return {
    tileCount,
    tileFootprintM2: footprint,
    adjustedAreaM2: adjustedArea,
    adhesiveKg,
    groutKg,
    steps,
  };
}
