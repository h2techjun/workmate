/**
 * 철근 무게·수량 계산 — 규격별 단위중량 기준 총길이·총중량·톤 산출.
 *
 *   총길이(m) = 1본 길이(m) × 본수
 *   총중량(정미, kg) = 총길이 × 단위중량(kg/m)
 *   발주 중량(kg) = 총중량(정미) × (1 + 할증률)
 *   톤(t) = 발주 중량 / 1000
 *
 * 단위중량(kg/m, KS D 3504 이형철근 공칭치수 기준):
 *   D10 0.560, D13 0.995, D16 1.560, D19 2.250, D22 3.040,
 *   D25 3.980, D29 5.040, D32 6.230
 *
 * 출처: KS D 3504(철근 콘크리트용 봉강) 이형철근 단위중량 표.
 */

import { z } from "zod";

export const rebarInputSchema = z.object({
  /** 철근 규격 (KS D 3504 이형철근 호칭) */
  size: z
    .enum(["D10", "D13", "D16", "D19", "D22", "D25", "D29", "D32"])
    .default("D13"),
  /** 1본 길이 (m) */
  lengthM: z.number().min(0).default(6),
  /** 본수 (개) */
  count: z.number().min(0).default(100),
  /** 할증률 (%) — 이음·손실 여분 */
  waste: z.number().min(0).max(30).default(3),
});

export type RebarInput = z.input<typeof rebarInputSchema>;
export type RebarInputResolved = z.output<typeof rebarInputSchema>;

export type RebarSize = "D10" | "D13" | "D16" | "D19" | "D22" | "D25" | "D29" | "D32";

/** KS D 3504 이형철근 단위중량 (kg/m) */
export const REBAR_UNIT_WEIGHT: Record<RebarSize, number> = {
  D10: 0.56,
  D13: 0.995,
  D16: 1.56,
  D19: 2.25,
  D22: 3.04,
  D25: 3.98,
  D29: 5.04,
  D32: 6.23,
};

export interface RebarResult {
  /** 총길이 (m) = 1본 길이 × 본수 */
  totalLengthM: number;
  /** 총중량 정미 (kg) = 총길이 × 단위중량 */
  netWeightKg: number;
  /** 발주 중량 (kg) = 총중량 정미 × (1 + 할증률) */
  weightKg: number;
  /** 발주 중량 (t) */
  weightTon: number;
  /** 적용 단위중량 (kg/m) */
  unitWeight: number;
}

export function calculateRebar(input: RebarInputResolved): RebarResult {
  const { size, lengthM, count, waste } = input;
  const unitWeight = REBAR_UNIT_WEIGHT[size];

  const totalLengthM = lengthM * count;
  const netWeightKg = totalLengthM * unitWeight;
  const weightKg = netWeightKg * (1 + waste / 100);
  const weightTon = weightKg / 1000;

  return {
    totalLengthM: Math.round(totalLengthM * 100) / 100,
    netWeightKg: Math.round(netWeightKg * 10) / 10,
    weightKg: Math.round(weightKg * 10) / 10,
    weightTon: Math.round(weightTon * 1000) / 1000,
    unitWeight,
  };
}
