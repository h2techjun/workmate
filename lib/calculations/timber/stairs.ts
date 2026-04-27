/**
 * 계단 계산기 (Stair Calculator)
 *
 * 총 높이와 권장 단높이로부터 단수·실제 단높이·단너비·각도·Blondel 검증.
 *
 *   numSteps    = round(totalRise / preferredRiser)
 *   actualRiser = totalRise / numSteps
 *   tread       = totalRun / (numSteps - 1)  // 진행거리 입력 시
 *               = 620 - 2 × actualRiser      // Blondel 추천
 *   stairLen    = √(totalRise² + (tread × (numSteps-1))²)
 *   angle       = atan(actualRiser / tread)
 *   blondel     = 2 × actualRiser + tread
 *
 * 안전 검증:
 *   - actualRiser ≤ maxRiser
 *   - tread ≥ minTread
 *   - blondelMin ≤ 2R+T ≤ blondelMax
 *
 * @see docs/timber-calc.md
 */

import { z } from "zod";
import {
  BLONDEL_TARGET,
  STAIR_STANDARDS,
} from "@/lib/constants/timber/standards";

export const stairsInputSchema = z.object({
  totalRise: z
    .number()
    .min(100, "validation.totalRiseMin")
    .max(10000, "validation.totalRiseMax"),
  totalRun: z
    .number()
    .min(0, "validation.totalRunNonNegative")
    .max(20000, "validation.totalRunMax")
    .optional(),
  preferredRiser: z
    .number()
    .min(80, "validation.preferredRiserMin")
    .max(250, "validation.preferredRiserMax"),
  useType: z.enum(["residential", "public"]).default("residential"),
});

export type StairsInput = z.input<typeof stairsInputSchema>;
export type StairsInputResolved = z.output<typeof stairsInputSchema>;

export type StairWarning =
  | { key: "riserTooHigh"; actual: number; max: number }
  | { key: "treadTooSmall"; actual: number; min: number }
  | { key: "blondelOutOfRange"; value: number; min: number; max: number }
  | { key: "preferredRiserExceedsLimit"; preferred: number; max: number };

export type StairsStep =
  | { key: "numSteps"; totalRise: number; preferred: number; result: number }
  | { key: "actualRiser"; totalRise: number; steps: number; result: number }
  | {
      key: "treadFromRun";
      totalRun: number;
      stepsMinus1: number;
      result: number;
    }
  | { key: "treadFromBlondel"; target: number; riser: number; result: number }
  | {
      key: "stairLength";
      totalRise: number;
      runDist: number;
      result: number;
    }
  | { key: "angle"; riser: number; tread: number; result: number }
  | {
      key: "blondel";
      riser: number;
      tread: number;
      result: number;
      min: number;
      max: number;
    };

export interface StairsResult {
  numSteps: number;
  actualRiser: number;
  tread: number;
  stairLength: number;
  angleDegrees: number;
  blondelValue: number;
  blondelOk: boolean;
  riserOk: boolean;
  treadOk: boolean;
  warnings: StairWarning[];
  calculationSteps: StairsStep[];
}

const radToDeg = (r: number): number => (r * 180) / Math.PI;

export function calculateStairs(rawInput: StairsInput): StairsResult {
  const input = stairsInputSchema.parse(rawInput);
  const { totalRise, totalRun, preferredRiser, useType } = input;
  const std = STAIR_STANDARDS[useType];

  const numSteps = Math.max(2, Math.round(totalRise / preferredRiser));
  const actualRiser = totalRise / numSteps;

  let tread: number;
  let treadStep: StairsStep;
  if (totalRun && totalRun > 0) {
    tread = totalRun / (numSteps - 1);
    treadStep = {
      key: "treadFromRun",
      totalRun,
      stepsMinus1: numSteps - 1,
      result: tread,
    };
  } else {
    tread = BLONDEL_TARGET - 2 * actualRiser;
    treadStep = {
      key: "treadFromBlondel",
      target: BLONDEL_TARGET,
      riser: actualRiser,
      result: tread,
    };
  }

  const runDistance = tread * (numSteps - 1);
  const stairLength = Math.sqrt(totalRise * totalRise + runDistance * runDistance);
  const angleDegrees = radToDeg(Math.atan(actualRiser / tread));
  const blondelValue = 2 * actualRiser + tread;

  const riserOk = actualRiser <= std.maxRiser;
  const treadOk = tread >= std.minTread;
  const blondelOk =
    blondelValue >= std.blondelMin && blondelValue <= std.blondelMax;

  const warnings: StairWarning[] = [];
  if (!riserOk) {
    warnings.push({
      key: "riserTooHigh",
      actual: actualRiser,
      max: std.maxRiser,
    });
  }
  if (!treadOk) {
    warnings.push({ key: "treadTooSmall", actual: tread, min: std.minTread });
  }
  if (!blondelOk) {
    warnings.push({
      key: "blondelOutOfRange",
      value: blondelValue,
      min: std.blondelMin,
      max: std.blondelMax,
    });
  }
  if (preferredRiser > std.maxRiser) {
    warnings.push({
      key: "preferredRiserExceedsLimit",
      preferred: preferredRiser,
      max: std.maxRiser,
    });
  }

  const calculationSteps: StairsStep[] = [
    { key: "numSteps", totalRise, preferred: preferredRiser, result: numSteps },
    {
      key: "actualRiser",
      totalRise,
      steps: numSteps,
      result: actualRiser,
    },
    treadStep,
    { key: "stairLength", totalRise, runDist: runDistance, result: stairLength },
    { key: "angle", riser: actualRiser, tread, result: angleDegrees },
    {
      key: "blondel",
      riser: actualRiser,
      tread,
      result: blondelValue,
      min: std.blondelMin,
      max: std.blondelMax,
    },
  ];

  return {
    numSteps,
    actualRiser,
    tread,
    stairLength,
    angleDegrees,
    blondelValue,
    blondelOk,
    riserOk,
    treadOk,
    warnings,
    calculationSteps,
  };
}
