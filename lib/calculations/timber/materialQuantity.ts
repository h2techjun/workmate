/**
 * 자재 수량 계산기 (Sheet Material Quantity Calculator)
 *
 * 시공 면적 × (1 + 손실률) ÷ 매당 면적 → 매수
 * 못 개수: 시공 면적 기반 추정 (가장자리 + 가운데 못 간격)
 *
 * @see docs/timber-calc.md
 */

import { z } from "zod";
import {
  DEFAULT_WASTE_FACTOR_PERCENT,
  GYPSUM_SCREW_SPACING,
  MAX_WASTE_FACTOR_PERCENT,
  MIN_WASTE_FACTOR_PERCENT,
  SHEATHING_NAIL_SPACING,
  SHEET_MATERIALS,
  type SheetMaterial,
} from "@/lib/constants/timber/materials";

export const materialQuantityInputSchema = z.object({
  material: z.enum([
    "osb11",
    "osb18",
    "plywood12",
    "plywood18",
    "gypsum9",
    "gypsum12",
    "cementBoard",
    "fiberCementSiding",
    "vinylSiding",
    "asphaltShingle",
    "battInsulationR19",
  ]),
  areaM2: z
    .number()
    .min(0.1, "validation.areaMin")
    .max(10000, "validation.areaMax"),
  wasteFactorPercent: z
    .number()
    .min(MIN_WASTE_FACTOR_PERCENT, "validation.wasteMin")
    .max(MAX_WASTE_FACTOR_PERCENT, "validation.wasteMax")
    .default(DEFAULT_WASTE_FACTOR_PERCENT),
  /** 못/스크류 개수 추정 (시트형 보드만) */
  estimateFasteners: z.boolean().default(true),
});

export type MaterialQuantityInput = z.input<typeof materialQuantityInputSchema>;
export type MaterialQuantityInputResolved = z.output<
  typeof materialQuantityInputSchema
>;

export type MaterialStep =
  | {
      key: "wasteAdjusted";
      area: number;
      waste: number;
      result: number;
    }
  | {
      key: "sheetCount";
      adjustedArea: number;
      sheetArea: number;
      result: number;
    }
  | { key: "totalWeight"; sheets: number; perSheet: number; result: number }
  | { key: "fasteners"; sheets: number; perSheet: number; result: number };

export interface MaterialQuantityResult {
  material: SheetMaterial;
  unit: "sheet" | "bundle" | "batt";
  sheetsRequired: number;
  adjustedAreaM2: number;
  sheetAreaM2: number;
  totalWeightKg: number;
  estimatedFasteners?: number;
  fastenerType?: "nail" | "screw";
  calculationSteps: MaterialStep[];
}

/** 시트 1매당 추정 못 개수 (가장자리 둘레 + 내부 부재 추정) */
function estimateFastenersPerSheet(
  material: SheetMaterial,
  spec: { widthMM: number; lengthMM: number },
): { count: number; type: "nail" | "screw" } | undefined {
  // 시트형이 아닌 자재는 스킵
  if (
    material === "asphaltShingle" ||
    material === "battInsulationR19" ||
    material === "vinylSiding" ||
    material === "fiberCementSiding"
  ) {
    return undefined;
  }
  const { widthMM: w, lengthMM: h } = spec;
  if (w === 0 || h === 0) return undefined;

  const isGypsum = material === "gypsum9" || material === "gypsum12";
  const spacing = isGypsum ? GYPSUM_SCREW_SPACING : SHEATHING_NAIL_SPACING;

  // 가장자리: 둘레 / edgeSpacing (양 끝점 포함을 위해 +4 보정)
  const perimeter = 2 * (w + h);
  const edgeCount = Math.ceil(perimeter / spacing.edgeMM) + 4;

  // 가운데(field): 내부에 가로 부재가 있다고 가정.
  // 표준 1220×2440 시트, 스터드/장선 600mm 간격이면 내부에 ~3줄.
  // 한 줄당 길이방향으로 fieldMM 간격 못.
  const interiorRows = Math.max(0, Math.floor(w / 600) - 1);
  const fieldPerRow = Math.ceil(h / spacing.fieldMM) + 1;
  const fieldCount = interiorRows * fieldPerRow;

  return {
    count: edgeCount + fieldCount,
    type: isGypsum ? "screw" : "nail",
  };
}

export function calculateMaterialQuantity(
  rawInput: MaterialQuantityInput,
): MaterialQuantityResult {
  const input = materialQuantityInputSchema.parse(rawInput);
  const { material, areaM2, wasteFactorPercent, estimateFasteners } = input;

  const spec = SHEET_MATERIALS[material];
  const adjustedArea = areaM2 * (1 + wasteFactorPercent / 100);
  const sheetsRequired = Math.ceil(adjustedArea / spec.areaM2);
  const totalWeight = sheetsRequired * spec.weightKg;

  const fastenerInfo = estimateFasteners
    ? estimateFastenersPerSheet(material, spec)
    : undefined;
  const estimatedFasteners = fastenerInfo
    ? sheetsRequired * fastenerInfo.count
    : undefined;

  const calculationSteps: MaterialStep[] = [
    {
      key: "wasteAdjusted",
      area: areaM2,
      waste: wasteFactorPercent,
      result: adjustedArea,
    },
    {
      key: "sheetCount",
      adjustedArea,
      sheetArea: spec.areaM2,
      result: sheetsRequired,
    },
    {
      key: "totalWeight",
      sheets: sheetsRequired,
      perSheet: spec.weightKg,
      result: totalWeight,
    },
  ];
  if (estimatedFasteners !== undefined && fastenerInfo) {
    calculationSteps.push({
      key: "fasteners",
      sheets: sheetsRequired,
      perSheet: fastenerInfo.count,
      result: estimatedFasteners,
    });
  }

  return {
    material,
    unit: spec.unit,
    sheetsRequired,
    adjustedAreaM2: adjustedArea,
    sheetAreaM2: spec.areaM2,
    totalWeightKg: totalWeight,
    estimatedFasteners,
    fastenerType: fastenerInfo?.type,
    calculationSteps,
  };
}
