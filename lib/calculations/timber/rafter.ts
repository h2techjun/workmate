/**
 * 서까래 계산기 (Rafter Calculator)
 *
 * run + rise + 처마 길이로부터 절단 길이·각도·구배율·면적 보정 계수 산출.
 *
 *   length = √(run² + rise²)
 *   angle  = atan(rise / run)
 *   slope% = (rise / run) × 100
 *   sec(θ) = 1 / cos(θ)
 *
 * @see docs/timber-calc.md
 */

import { z } from "zod";

export const rafterInputSchema = z.object({
  run: z.number().positive("validation.runPositive"),
  rise: z.number().positive("validation.risePositive"),
  eaveOverhang: z
    .number()
    .min(0, "validation.eaveNonNegative")
    .max(2000, "validation.eaveMax")
    .default(0),
});

export type RafterInput = z.input<typeof rafterInputSchema>;
export type RafterInputResolved = z.output<typeof rafterInputSchema>;

export type RafterStep =
  | { key: "baseLength"; run: number; rise: number; result: number }
  | { key: "angle"; rise: number; run: number; result: number }
  | { key: "slope"; rise: number; run: number; result: number }
  | {
      key: "eaveDiagonal";
      eave: number;
      angle: number;
      sec: number;
      result: number;
    }
  | {
      key: "totalLength";
      base: number;
      eaveDiagonal: number;
      result: number;
    }
  | { key: "secCorrection"; angle: number; result: number };

export interface RafterResult {
  baseLength: number;
  eaveDiagonal: number;
  totalLength: number;
  angleDegrees: number;
  slopePercent: number;
  pitchRise12: number;
  secCorrection: number;
  calculationSteps: RafterStep[];
}

const radToDeg = (rad: number): number => (rad * 180) / Math.PI;

export function calculateRafter(rawInput: RafterInput): RafterResult {
  const input = rafterInputSchema.parse(rawInput);
  const { run, rise, eaveOverhang } = input;

  const baseLength = Math.sqrt(run * run + rise * rise);
  const angleRad = Math.atan(rise / run);
  const angleDegrees = radToDeg(angleRad);
  const slopePercent = (rise / run) * 100;
  const pitchRise12 = (rise / run) * 12;
  const secCorrection = 1 / Math.cos(angleRad);
  const eaveDiagonal = eaveOverhang * secCorrection;
  const totalLength = baseLength + eaveDiagonal;

  const steps: RafterStep[] = [
    { key: "baseLength", run, rise, result: baseLength },
    { key: "angle", rise, run, result: angleDegrees },
    { key: "slope", rise, run, result: slopePercent },
    { key: "secCorrection", angle: angleDegrees, result: secCorrection },
  ];
  if (eaveOverhang > 0) {
    steps.push({
      key: "eaveDiagonal",
      eave: eaveOverhang,
      angle: angleDegrees,
      sec: secCorrection,
      result: eaveDiagonal,
    });
    steps.push({
      key: "totalLength",
      base: baseLength,
      eaveDiagonal,
      result: totalLength,
    });
  }

  return {
    baseLength,
    eaveDiagonal,
    totalLength,
    angleDegrees,
    slopePercent,
    pitchRise12,
    secCorrection,
    calculationSteps: steps,
  };
}
