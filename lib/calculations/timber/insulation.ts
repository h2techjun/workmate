/**
 * 단열 R/U값 계산기 (Insulation R-value & U-value Calculator)
 *
 * 다층 벽체의 합성 R값과 U값을 계산하고 한국 에너지절약 설계기준 별표1과 비교.
 *
 *   R_layer = thickness(m) / λ  또는 fixedR (공기층)
 *   R_total = ΣR_layer + R_si + R_se
 *   U       = 1 / R_total
 *
 *   통과: U ≤ U_limit(지역, 부위)
 *
 * @see docs/timber-calc.md
 */

import { z } from "zod";
import {
  CLIMATE_REGION_DESCRIPTION,
  ENVELOPE_LABELS,
  LAYER_MATERIALS,
  SURFACE_RESISTANCE,
  U_VALUE_LIMITS,
  getInteriorSurfaceR,
  type ClimateRegion,
  type EnvelopeElement,
  type LayerMaterial,
} from "@/lib/constants/timber/thermal";

const layerSchema = z.object({
  material: z.enum([
    "glasswool24",
    "glasswool48",
    "mineralwool",
    "eps1",
    "eps2",
    "xps",
    "pirFoam",
    "puFoam",
    "cellulose",
    "phenolic",
    "osb11",
    "osb18",
    "plywood12",
    "gypsum9",
    "gypsum12",
    "fiberCement",
    "brick",
    "concrete",
    "airSpace",
  ]),
  thicknessMM: z
    .number()
    .min(1, "validation.thicknessMin")
    .max(1000, "validation.thicknessMax"),
});

export const insulationInputSchema = z.object({
  region: z.enum(["central1", "central2", "south", "jeju"]),
  element: z.enum([
    "exteriorWallDirect",
    "exteriorWallIndirect",
    "roof",
    "floorDirect",
    "floorIndirect",
  ]),
  layers: z
    .array(layerSchema)
    .min(1, "validation.layersMin")
    .max(15, "validation.layersMax"),
});

export type InsulationInput = z.input<typeof insulationInputSchema>;
export type InsulationInputResolved = z.output<typeof insulationInputSchema>;

export interface LayerComputed {
  material: LayerMaterial;
  thicknessMM: number;
  conductivity: number;
  R: number;
}

export type InsulationStep =
  | { key: "surfaceR"; interior: number; exterior: number; total: number }
  | { key: "layerSum"; sum: number; layerCount: number }
  | { key: "totalR"; layers: number; surface: number; result: number }
  | { key: "uValue"; totalR: number; result: number }
  | {
      key: "compare";
      uValue: number;
      limit: number;
      pass: boolean;
      region: ClimateRegion;
      element: EnvelopeElement;
    };

export interface InsulationResult {
  totalR: number;
  uValue: number;
  uLimit: number;
  pass: boolean;
  surplusOrDeficitR: number;
  layers: LayerComputed[];
  interiorSurfaceR: number;
  exteriorSurfaceR: number;
  calculationSteps: InsulationStep[];
}

export function calculateInsulation(
  rawInput: InsulationInput,
): InsulationResult {
  const input = insulationInputSchema.parse(rawInput);
  const { region, element, layers } = input;

  // 각 층 R값 계산
  const computedLayers: LayerComputed[] = layers.map((l) => {
    const props = LAYER_MATERIALS[l.material];
    let R: number;
    if (props.fixedR !== undefined) {
      R = props.fixedR;
    } else {
      R = l.thicknessMM / 1000 / props.conductivity;
    }
    return {
      material: l.material,
      thicknessMM: l.thicknessMM,
      conductivity: props.conductivity,
      R,
    };
  });

  const layerSum = computedLayers.reduce((acc, l) => acc + l.R, 0);

  // 표면 열저항
  const interiorSurfaceR = getInteriorSurfaceR(element);
  const exteriorSurfaceR = SURFACE_RESISTANCE.exterior;
  const surfaceR = interiorSurfaceR + exteriorSurfaceR;

  const totalR = layerSum + surfaceR;
  const uValue = 1 / totalR;

  // 기준 비교
  const uLimit = U_VALUE_LIMITS[element][region];
  const pass = uValue <= uLimit;

  // 부족/잉여 R값 — U_limit에 해당하는 R = 1/U_limit
  const requiredR = 1 / uLimit;
  const surplusOrDeficitR = totalR - requiredR;

  const calculationSteps: InsulationStep[] = [
    {
      key: "layerSum",
      sum: layerSum,
      layerCount: computedLayers.length,
    },
    {
      key: "surfaceR",
      interior: interiorSurfaceR,
      exterior: exteriorSurfaceR,
      total: surfaceR,
    },
    {
      key: "totalR",
      layers: layerSum,
      surface: surfaceR,
      result: totalR,
    },
    { key: "uValue", totalR, result: uValue },
    {
      key: "compare",
      uValue,
      limit: uLimit,
      pass,
      region,
      element,
    },
  ];

  return {
    totalR,
    uValue,
    uLimit,
    pass,
    surplusOrDeficitR,
    layers: computedLayers,
    interiorSurfaceR,
    exteriorSurfaceR,
    calculationSteps,
  };
}

export {
  CLIMATE_REGION_DESCRIPTION,
  ENVELOPE_LABELS,
  LAYER_MATERIALS,
};
