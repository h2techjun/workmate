/**
 * 지붕 면적 계산기 (Roof Area Calculator)
 *
 * 평면적 → 실제 경사면 면적 (sec(θ) 보정) + 처마 면적.
 *
 *   slopeArea = planArea / cos(θ)
 *   eaveArea  = perimeter × eaveOverhang / cos(θ)
 *   total     = slopeArea + eaveArea
 *
 * @see docs/timber-calc.md
 */

import { z } from "zod";

export const roofAreaInputSchema = z.object({
  planAreaM2: z
    .number()
    .min(1, "validation.planAreaMin")
    .max(10000, "validation.planAreaMax"),
  perimeterM: z
    .number()
    .min(0, "validation.perimeterMin")
    .max(1000, "validation.perimeterMax")
    .default(0),
  angleDegrees: z
    .number()
    .min(0, "validation.angleMin")
    .max(89.99, "validation.angleMax"),
  eaveOverhangMM: z
    .number()
    .min(0, "validation.eaveMin")
    .max(2000, "validation.eaveMax")
    .default(0),
});

export type RoofAreaInput = z.input<typeof roofAreaInputSchema>;
export type RoofAreaInputResolved = z.output<typeof roofAreaInputSchema>;

export type RoofAreaStep =
  | { key: "secCorrection"; angle: number; result: number }
  | { key: "slopeArea"; planArea: number; sec: number; result: number }
  | {
      key: "eaveArea";
      perimeter: number;
      eaveOverhang: number;
      sec: number;
      result: number;
    }
  | { key: "totalArea"; slope: number; eave: number; result: number };

export interface RoofAreaResult {
  slopeAreaM2: number;
  eaveAreaM2: number;
  totalAreaM2: number;
  secCorrection: number;
  calculationSteps: RoofAreaStep[];
}

const degToRad = (d: number): number => (d * Math.PI) / 180;

export function calculateRoofArea(rawInput: RoofAreaInput): RoofAreaResult {
  const input = roofAreaInputSchema.parse(rawInput);
  const { planAreaM2, perimeterM, angleDegrees, eaveOverhangMM } = input;

  const cosTheta = Math.cos(degToRad(angleDegrees));
  const secCorrection = 1 / cosTheta;

  const slopeArea = planAreaM2 * secCorrection;
  const eaveArea = (perimeterM * eaveOverhangMM) / 1000 * secCorrection;
  const totalArea = slopeArea + eaveArea;

  const steps: RoofAreaStep[] = [
    { key: "secCorrection", angle: angleDegrees, result: secCorrection },
    {
      key: "slopeArea",
      planArea: planAreaM2,
      sec: secCorrection,
      result: slopeArea,
    },
  ];
  if (perimeterM > 0 && eaveOverhangMM > 0) {
    steps.push({
      key: "eaveArea",
      perimeter: perimeterM,
      eaveOverhang: eaveOverhangMM,
      sec: secCorrection,
      result: eaveArea,
    });
    steps.push({
      key: "totalArea",
      slope: slopeArea,
      eave: eaveArea,
      result: totalArea,
    });
  }

  return {
    slopeAreaM2: slopeArea,
    eaveAreaM2: eaveArea,
    totalAreaM2: totalArea,
    secCorrection,
    calculationSteps: steps,
  };
}
