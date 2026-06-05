/**
 * 냉난방 용량(BTU) 계산 — 방 면적 기준 에어컨/난방기 용량 추정.
 *
 *   기본 냉방 BTU = 면적(ft²) × 20 (BTU/ft²) — 일반 기준
 *   또는 면적(m²) × 약 600 BTU/m² 근사.
 *
 * 보정:
 *   천장 높이 2.7m 초과 시 +10%, 일조 강함 +10%, 인원 1명당 +600 BTU,
 *   주방 +4,000 BTU.
 *
 * 한국은 에어컨을 '평형'(예: 6평형 = 약 2,200kcal/h ≈ 8,700 BTU)으로도 표기.
 *   1평형 ≈ 363 kcal/h ≈ 1,440 BTU.
 *
 * 출처: 일반 HVAC 사이징 가이드(ASHRAE 근사) + 한국 평형 환산.
 */

import { z } from "zod";

export const btuInputSchema = z.object({
  /** 방 면적 (m²) */
  areaM2: z.number().min(0).default(0),
  /** 천장 높이 (m) */
  ceilingHeight: z.number().min(2).max(6).default(2.4),
  /** 일조량 */
  sunExposure: z.enum(["low", "normal", "high"]).default("normal"),
  /** 상주 인원 */
  occupants: z.number().int().min(0).max(20).default(2),
  /** 주방 여부 */
  isKitchen: z.boolean().default(false),
});

export type BtuInput = z.input<typeof btuInputSchema>;
export type BtuInputResolved = z.output<typeof btuInputSchema>;

const BTU_PER_M2 = 600; // 기본 냉방 부하

export interface BtuResult {
  baseBtu: number;
  adjustedBtu: number;
  /** 한국 에어컨 평형 환산 */
  koreanPyeongType: number;
  /** kW 환산 (1 BTU/h ≈ 0.000293 kW) */
  kw: number;
  /** 권장 에어컨 표기 (BTU 반올림) */
  recommendedBtu: number;
}

export function calculateBtu(input: BtuInputResolved): BtuResult {
  const { areaM2, ceilingHeight, sunExposure, occupants, isKitchen } = input;

  let btu = areaM2 * BTU_PER_M2;

  // 천장 높이 보정 (2.7m 초과 시 비례)
  if (ceilingHeight > 2.7) {
    btu *= ceilingHeight / 2.7;
  }
  // 일조 보정
  if (sunExposure === "high") btu *= 1.1;
  else if (sunExposure === "low") btu *= 0.9;
  // 인원 (2명 기본, 초과분 1명당 +600)
  if (occupants > 2) btu += (occupants - 2) * 600;
  // 주방
  if (isKitchen) btu += 4000;

  const adjustedBtu = Math.round(btu);
  // 권장: 100 BTU 단위 반올림 올림
  const recommendedBtu = Math.ceil(adjustedBtu / 1000) * 1000;
  const koreanPyeongType = Math.round((adjustedBtu / 1440) * 10) / 10; // 1평형≈1440 BTU
  const kw = Math.round(adjustedBtu * 0.000293 * 100) / 100;

  return {
    baseBtu: Math.round(areaM2 * BTU_PER_M2),
    adjustedBtu,
    koreanPyeongType,
    kw,
    recommendedBtu,
  };
}
