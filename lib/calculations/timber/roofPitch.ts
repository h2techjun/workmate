/**
 * 지붕 경사 계산기 (Roof Pitch Converter)
 *
 * 세 가지 표현(angle/slope/ratio) 사이의 양방향 변환 + 카테고리 분류.
 *
 *   slope% = tan(θ) × 100
 *   ratio  = tan(θ) × 12   (rise/12)
 *   sec(θ) = 1 / cos(θ)    면적 보정
 *
 * @see docs/timber-calc.md
 */

import { z } from "zod";
import {
  ROOF_PITCH_CATEGORIES,
  type RoofPitchCategory,
} from "@/lib/constants/timber/standards";

export const roofPitchInputSchema = z
  .object({
    mode: z.enum(["angle", "slope", "ratio"]),
    angle: z.number().min(0).max(89.99).optional(),
    slope: z.number().min(0).max(5000).optional(),
    rise: z.number().min(0).max(60).optional(),
  })
  .refine(
    (v) =>
      (v.mode === "angle" && v.angle !== undefined) ||
      (v.mode === "slope" && v.slope !== undefined) ||
      (v.mode === "ratio" && v.rise !== undefined),
    { message: "validation.modeMissingValue" },
  );

export type RoofPitchInput = z.input<typeof roofPitchInputSchema>;
export type RoofPitchInputResolved = z.output<typeof roofPitchInputSchema>;

export interface RoofPitchResult {
  angleDegrees: number;
  slopePercent: number;
  pitchRise12: number;
  category: RoofPitchCategory;
  secCorrection: number;
}

const degToRad = (d: number): number => (d * Math.PI) / 180;
const radToDeg = (r: number): number => (r * 180) / Math.PI;

function classifyPitch(angleDegrees: number): RoofPitchCategory {
  for (const c of ROOF_PITCH_CATEGORIES) {
    if (angleDegrees < c.maxAngle) return c.category;
  }
  return "extremeSlope";
}

export function calculateRoofPitch(rawInput: RoofPitchInput): RoofPitchResult {
  const input = roofPitchInputSchema.parse(rawInput);

  let angleDegrees: number;
  switch (input.mode) {
    case "angle":
      angleDegrees = input.angle ?? 0;
      break;
    case "slope":
      angleDegrees = radToDeg(Math.atan((input.slope ?? 0) / 100));
      break;
    case "ratio":
      angleDegrees = radToDeg(Math.atan((input.rise ?? 0) / 12));
      break;
  }

  const angleRad = degToRad(angleDegrees);
  const slopePercent = Math.tan(angleRad) * 100;
  const pitchRise12 = Math.tan(angleRad) * 12;
  const secCorrection = 1 / Math.cos(angleRad);
  const category = classifyPitch(angleDegrees);

  return {
    angleDegrees,
    slopePercent,
    pitchRise12,
    secCorrection,
    category,
  };
}
