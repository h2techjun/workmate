/**
 * 콘크리트 부피 계산기 (Concrete Volume Calculator)
 *
 * 줄기초(strip) 또는 매트기초(mat) 부피 + 철근 추정 + 시멘트·골재 환산.
 *
 *   strip:  V = width × depth × length
 *   mat:    V = width × length × thickness
 *   rebar:  주거용 줄기초 80~100 kg/m³ (간이 추정)
 *
 * @see docs/timber-calc.md
 */

import { z } from "zod";

export type FoundationType = "stripFooting" | "matSlab";

export const concreteInputSchema = z
  .object({
    type: z.enum(["stripFooting", "matSlab"]),
    widthM: z
      .number()
      .min(0.1, "validation.widthMin")
      .max(50, "validation.widthMax"),
    depthOrThicknessM: z
      .number()
      .min(0.05, "validation.depthMin")
      .max(5, "validation.depthMax"),
    lengthM: z
      .number()
      .min(0.1, "validation.lengthMin")
      .max(500, "validation.lengthMax"),
    rebarDensityKgPerM3: z
      .number()
      .min(0, "validation.rebarMin")
      .max(300, "validation.rebarMax")
      .default(90),
    wasteFactorPercent: z
      .number()
      .min(0, "validation.wasteMin")
      .max(30, "validation.wasteMax")
      .default(5),
  })
  .refine(() => true);

export type ConcreteInput = z.input<typeof concreteInputSchema>;
export type ConcreteInputResolved = z.output<typeof concreteInputSchema>;

export type ConcreteStep =
  | {
      key: "rawVolume";
      width: number;
      depth: number;
      length: number;
      result: number;
    }
  | {
      key: "wasteAdjusted";
      raw: number;
      waste: number;
      result: number;
    }
  | {
      key: "rebar";
      volume: number;
      density: number;
      result: number;
    }
  | {
      key: "remicon";
      volume: number;
      result: number;
    };

export interface ConcreteResult {
  type: FoundationType;
  rawVolumeM3: number;
  adjustedVolumeM3: number;
  rebarKg: number;
  remicon6m3Trucks: number;
  calculationSteps: ConcreteStep[];
}

/** 한국 레미콘 표준 트럭 1대당 6 m³ */
const REMICON_TRUCK_M3 = 6;

export function calculateConcrete(rawInput: ConcreteInput): ConcreteResult {
  const input = concreteInputSchema.parse(rawInput);
  const {
    type,
    widthM,
    depthOrThicknessM,
    lengthM,
    rebarDensityKgPerM3,
    wasteFactorPercent,
  } = input;

  const rawVolume = widthM * depthOrThicknessM * lengthM;
  const adjustedVolume = rawVolume * (1 + wasteFactorPercent / 100);
  const rebarKg = adjustedVolume * rebarDensityKgPerM3;
  const remiconTrucks = adjustedVolume / REMICON_TRUCK_M3;

  const calculationSteps: ConcreteStep[] = [
    {
      key: "rawVolume",
      width: widthM,
      depth: depthOrThicknessM,
      length: lengthM,
      result: rawVolume,
    },
    {
      key: "wasteAdjusted",
      raw: rawVolume,
      waste: wasteFactorPercent,
      result: adjustedVolume,
    },
    {
      key: "rebar",
      volume: adjustedVolume,
      density: rebarDensityKgPerM3,
      result: rebarKg,
    },
    {
      key: "remicon",
      volume: adjustedVolume,
      result: remiconTrucks,
    },
  ];

  return {
    type,
    rawVolumeM3: rawVolume,
    adjustedVolumeM3: adjustedVolume,
    rebarKg,
    remicon6m3Trucks: remiconTrucks,
    calculationSteps,
  };
}
