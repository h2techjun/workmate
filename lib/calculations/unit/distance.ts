/**
 * 거리·길이 단위 변환 — 한국 전통(리·자·보) ↔ 미터법·야드파운드.
 *
 *   1자(尺) = 10/33 m ≈ 0.303030 m
 *   1보(步) = 6자 ≈ 1.81818 m
 *   1리(里) = 1,296자 ≈ 392.727 m  (10리 ≈ 3.93km, "십리 길")
 *   1마장 = 5리 또는 10리(지역차) — 본 도구는 10리 = 1마장 채택 안 함, 리만 제공
 *
 * 국제:
 *   1 mile = 1609.344 m, 1 yard = 0.9144 m, 1 ft = 0.3048 m, 1 inch = 0.0254 m
 *
 * 출처: 한국 도량형 관습 + 국제 야드파운드 정의.
 */

import { z } from "zod";

export const JA_M = 10 / 33; // 0.3030303...
export const BO_M = 6 * JA_M; // 1.818...
export const RI_M = 1296 * JA_M; // 392.7272...
export const MILE_M = 1609.344;
export const YARD_M = 0.9144;
export const FT_M = 0.3048;
export const INCH_M = 0.0254;

export type DistanceUnit =
  | "ri"
  | "ja"
  | "bo"
  | "m"
  | "km"
  | "mile"
  | "yard"
  | "ft"
  | "inch";

const TO_M: Record<DistanceUnit, number> = {
  ri: RI_M,
  ja: JA_M,
  bo: BO_M,
  m: 1,
  km: 1000,
  mile: MILE_M,
  yard: YARD_M,
  ft: FT_M,
  inch: INCH_M,
};

export const distanceInputSchema = z.object({
  value: z.number().min(0).max(1e12),
  unit: z.enum(["ri", "ja", "bo", "m", "km", "mile", "yard", "ft", "inch"]),
});

export type DistanceInput = z.input<typeof distanceInputSchema>;
export type DistanceInputResolved = z.output<typeof distanceInputSchema>;

export type DistanceResult = Record<DistanceUnit, number>;

export function convertDistance(input: DistanceInputResolved): DistanceResult {
  const meters = input.value * TO_M[input.unit];
  const out = {} as DistanceResult;
  (Object.keys(TO_M) as DistanceUnit[]).forEach((u) => {
    out[u] = meters / TO_M[u];
  });
  return out;
}
