/**
 * 온도 변환 — 섭씨(°C) ↔ 화씨(°F) ↔ 켈빈(K).
 *
 *   °F = °C × 9/5 + 32
 *   K  = °C + 273.15
 *
 * 한국은 섭씨, 미국은 화씨 사용 — 외국인·여행자 빈번 변환.
 */

import { z } from "zod";

export type TempUnit = "c" | "f" | "k";

export const tempInputSchema = z.object({
  value: z.number().min(-1000).max(1e6),
  unit: z.enum(["c", "f", "k"]),
});

export type TempInput = z.input<typeof tempInputSchema>;
export type TempInputResolved = z.output<typeof tempInputSchema>;

export interface TempResult {
  c: number;
  f: number;
  k: number;
  /** 체감 설명 키 (very-cold/cold/mild/warm/hot) */
  feel: "freezing" | "cold" | "mild" | "warm" | "hot";
}

function toCelsius(value: number, unit: TempUnit): number {
  if (unit === "c") return value;
  if (unit === "f") return ((value - 32) * 5) / 9;
  return value - 273.15; // k
}

export function convertTemperature(input: TempInputResolved): TempResult {
  const c = toCelsius(input.value, input.unit);
  const f = (c * 9) / 5 + 32;
  const k = c + 273.15;

  let feel: TempResult["feel"];
  if (c <= 0) feel = "freezing";
  else if (c < 12) feel = "cold";
  else if (c < 23) feel = "mild";
  else if (c < 30) feel = "warm";
  else feel = "hot";

  return {
    c: Math.round(c * 100) / 100,
    f: Math.round(f * 100) / 100,
    k: Math.round(k * 100) / 100,
    feel,
  };
}
