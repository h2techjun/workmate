/**
 * 자갈·골재·모래 부피·무게 계산.
 *
 *   부피(m³) = 면적(m²) × 두께(m)
 *   무게(t) = 부피 × 밀도(t/m³)
 *
 * 자재 밀도(다짐 전 느슨한 상태, t/m³):
 *   자갈 1.5, 모래 1.6, 쇄석 1.5, 흙 1.4, 자갈+모래(혼합) 1.55
 * 다짐 시 약 20~30% 부피 감소 → 발주는 다짐 후 면적 × 다짐계수.
 *
 * 출처: 일반 골재 단위중량(KS F 2505 부근) + 조경·토목 관행.
 */

import { z } from "zod";

export const gravelInputSchema = z.object({
  /** 면적 (m²) — 길이×너비 또는 직접 */
  area: z.number().min(0).default(0),
  /** 깔기 두께 (cm) */
  depthCm: z.number().min(0).max(200).default(10),
  /** 자재 종류 */
  material: z.enum(["gravel", "sand", "crushed", "soil", "mixed"]).default("gravel"),
  /** 다짐 여유 (%) — 다짐 시 추가 발주분 */
  compaction: z.number().min(0).max(50).default(20),
});

export type GravelInput = z.input<typeof gravelInputSchema>;
export type GravelInputResolved = z.output<typeof gravelInputSchema>;

const DENSITY: Record<string, number> = {
  gravel: 1.5,
  sand: 1.6,
  crushed: 1.5,
  soil: 1.4,
  mixed: 1.55,
};

export interface GravelResult {
  volumeM3: number; // 부피 (다짐 전)
  volumeWithCompaction: number; // 다짐 여유 포함 발주 부피
  density: number; // 적용 밀도 t/m³
  weightTon: number; // 무게 (톤)
  weightKg: number; // 무게 (kg)
  /** 25kg 포대 기준 개수 */
  bags25kg: number;
  /** 1톤 마대(톤백) 개수 */
  tonBags: number;
}

export function calculateGravel(input: GravelInputResolved): GravelResult {
  const { area, depthCm, material, compaction } = input;
  const depthM = depthCm / 100;
  const density = DENSITY[material]!;

  const volumeM3 = area * depthM;
  const volumeWithCompaction = volumeM3 * (1 + compaction / 100);
  const weightTon = volumeWithCompaction * density;
  const weightKg = weightTon * 1000;

  return {
    volumeM3: Math.round(volumeM3 * 100) / 100,
    volumeWithCompaction: Math.round(volumeWithCompaction * 100) / 100,
    density,
    weightTon: Math.round(weightTon * 100) / 100,
    weightKg: Math.round(weightKg),
    bags25kg: Math.ceil(weightKg / 25),
    tonBags: Math.ceil(weightTon),
  };
}
