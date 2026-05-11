/**
 * 한국 면적 단위 변환 — 평·㎡·자² 양방향.
 *
 *   1평 = 6자 × 6자 = 36자²
 *   1자 = 10/33 m ≈ 0.30303030... m
 *   1평 = 36 × (10/33)² m² = 3600/1089 m² ≈ 3.30578512 m²
 *   1㎡ = 1089/3600 평 = 0.30250 평
 *   1㎡ = 10.89 자²
 *
 * 출처: 한국 도량형법(폐지) → 미터법 전환 후 관습. 부동산 광고/등기는 ㎡ 의무 (2007~).
 */

import { z } from "zod";

export const SQM_PER_PYEONG = 3600 / 1089; // ≈ 3.30578512396694...
export const PYEONG_PER_SQM = 1089 / 3600; // ≈ 0.302500
export const JA2_PER_PYEONG = 36;
export const SQM_PER_JA2 = SQM_PER_PYEONG / JA2_PER_PYEONG; // ≈ 0.09182736
export const JA2_PER_SQM = JA2_PER_PYEONG / SQM_PER_PYEONG; // ≈ 10.89

export type AreaUnit = "pyeong" | "sqm" | "ja2";

export const areaInputSchema = z.object({
  value: z.number().min(0, "validation.valueMin").max(1e10, "validation.valueMax"),
  unit: z.enum(["pyeong", "sqm", "ja2"]),
});

export type AreaInput = z.input<typeof areaInputSchema>;
export type AreaInputResolved = z.output<typeof areaInputSchema>;

export interface AreaResult {
  pyeong: number;
  sqm: number;
  ja2: number;
  /** 0.5 평 단위 반올림 — 부동산 광고 관행 */
  pyeongRounded05: number;
}

/**
 * 단위 한 가지 입력 → 세 단위 모두 반환.
 *
 * 부동산 광고는 보통 0.5평 단위 (예: "전용 24.5평"). 정확한 값과 광고용 값 둘 다 제공.
 */
export function convertArea(input: AreaInputResolved): AreaResult {
  let sqm: number;
  if (input.unit === "pyeong") {
    sqm = input.value * SQM_PER_PYEONG;
  } else if (input.unit === "ja2") {
    sqm = input.value * SQM_PER_JA2;
  } else {
    sqm = input.value;
  }
  const pyeong = sqm * PYEONG_PER_SQM;
  const ja2 = sqm * JA2_PER_SQM;
  return {
    pyeong,
    sqm,
    ja2,
    pyeongRounded05: Math.round(pyeong * 2) / 2,
  };
}
