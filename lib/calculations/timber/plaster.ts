/**
 * 미장 모르타르 배합 계산기 — 미장 면적·두께 기준 모르타르 부피 + 배합비별 재료(시멘트·모래).
 *
 *   모르타르 부피(m³) = 면적(m²) × (두께(mm)/1000) × (1 + 할증)
 *   시멘트(kg) = 모르타르 부피 × 배합 시멘트량, 모래(m³) = 모르타르 부피 × 배합 모래량
 *
 * 미장 두께(mm) — 건설공사 표준품셈 미장공사 기준: 초벌+재벌+정벌 합산 시 통상 24mm.
 * 배합비별 1m³당 재료(시멘트 모르타르) — 건설공사 표준품셈:
 *   1:2 → 시멘트 680kg + 모래 0.98m³ (고강도·방수 등 정밀 마감용)
 *   1:3 → 시멘트 510kg + 모래 1.10m³ (일반 벽·바닥 미장)
 *   1:4 → 시멘트 385kg + 모래 1.10m³ (초벌·저강도용)
 * 시멘트 40kg 포대.
 *
 * 출처: 건설공사 표준품셈(한국건설기술연구원) 미장공사.
 */

import { z } from "zod";

export const plasterInputSchema = z.object({
  /** 미장 면적 (m²) */
  area: z.number().min(0).default(0),
  /** 미장 두께 (mm) — 기본 24 = 초벌+재벌+정벌 */
  thickness: z.number().min(1).max(200).default(24),
  /** 배합비 (시멘트:모래) */
  mixRatio: z.enum(["1:2", "1:3", "1:4"]).default("1:3"),
  /** 할증률 (%) — 손실·여분 */
  waste: z.number().min(0).max(30).default(5),
});

export type PlasterInput = z.input<typeof plasterInputSchema>;
export type PlasterInputResolved = z.output<typeof plasterInputSchema>;

type MixRatio = "1:2" | "1:3" | "1:4";

/** 배합비별 1m³당 시멘트(kg)·모래(m³) — 건설공사 표준품셈 */
export const MIX_RATIO: Record<MixRatio, { cementKgPerM3: number; sandM3PerM3: number }> = {
  "1:2": { cementKgPerM3: 680, sandM3PerM3: 0.98 },
  "1:3": { cementKgPerM3: 510, sandM3PerM3: 1.1 },
  "1:4": { cementKgPerM3: 385, sandM3PerM3: 1.1 },
};
const CEMENT_BAG_KG = 40;

export interface PlasterResult {
  /** 모르타르 부피 (m³, 할증 포함) */
  mortarM3: number;
  /** 시멘트 (kg) */
  cementKg: number;
  /** 시멘트 40kg 포대 수 */
  cementBags: number;
  /** 모래 (m³) */
  sandM3: number;
  /** 적용 배합비 */
  mixRatio: MixRatio;
}

export function calculatePlaster(input: PlasterInputResolved): PlasterResult {
  const { area, thickness, mixRatio, waste } = input;
  const { cementKgPerM3, sandM3PerM3 } = MIX_RATIO[mixRatio];

  const mortarM3 = area * (thickness / 1000) * (1 + waste / 100);
  const cementKg = mortarM3 * cementKgPerM3;
  const sandM3 = mortarM3 * sandM3PerM3;

  return {
    mortarM3: Math.round(mortarM3 * 1000) / 1000,
    cementKg: Math.round(cementKg),
    cementBags: Math.ceil(cementKg / CEMENT_BAG_KG),
    sandM3: Math.round(sandM3 * 100) / 100,
    mixRatio,
  };
}
