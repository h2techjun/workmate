/**
 * 전선 굵기 계산기 (Wire Size Calculator)
 *
 * 순수 계산 함수. 결과는 i18n-friendly token 객체로 반환되며, 사람이 읽는 텍스트는
 * UI 레이어에서 next-intl 의 t() 와 messages/*.json 으로 보간한다.
 *
 *   (1) 전압강하 조건 — 실제 전압강하 ≤ 허용 전압강하
 *   (2) 허용전류 조건 — 기준 허용전류 × Ct × Cg ≥ 부하전류
 *
 * 공식 (내선규정):
 *   e = (계수 × L × I) / (1000 × A)
 *   단상2선식 35.6 / 3상3선식 30.8 / 단상3선식·3상4선식 17.8 (동선)
 *   알루미늄: 동선 계수 × 1.6
 *
 * 보정 계수:
 *   - 절연 종류 (PVC vs XLPE) — XLPE 는 PVC 기준 × 1.25
 *   - 주위 온도 (Ct) — KS C IEC 60364-5-52 표 B.52.14
 *   - 회로 묶음 (Cg) — KS C IEC 60364-5-52 표 B.52.17
 *
 * @see docs/electric-calc.md
 */

import { z } from "zod";
import {
  ALLOWED_CURRENT_A1_ALUMINUM,
  ALLOWED_CURRENT_A1_COPPER,
  ALUMINUM_CORRECTION_FACTOR,
  ALUMINUM_MIN_CROSS_SECTION,
  GROUPING_FACTOR_TABLE,
  KS_WIRE_CROSS_SECTIONS,
  PARALLEL_CABLE_RECOMMENDATION_THRESHOLD,
  SAFETY_MARGIN_WARNING_THRESHOLD,
  TEMP_CORRECTION_FACTOR_PVC,
  TEMP_CORRECTION_FACTOR_XLPE,
  VOLTAGE_DROP_COEFFICIENT,
  XLPE_AMPACITY_MULTIPLIER,
  type ConductorMaterial,
  type InsulationType,
  type PhaseType,
} from "@/lib/constants/electric/ksStandard";

export const wireSizeInputSchema = z.object({
  voltage: z.number().positive("validation.voltage"),
  current: z.number().positive("validation.current"),
  distance: z.number().positive("validation.distance"),
  phaseType: z.enum([
    "single-2wire",
    "single-3wire",
    "three-3wire",
    "three-4wire",
  ]),
  material: z.enum(["copper", "aluminum"]),
  allowedDropPercent: z
    .number()
    .min(0.5, "validation.allowedDropMin")
    .max(10, "validation.allowedDropMax"),
  insulation: z.enum(["PVC", "XLPE"]).default("PVC"),
  ambientTemperature: z
    .number()
    .min(-10, "validation.ambientMin")
    .max(80, "validation.ambientMax")
    .default(30),
  numberOfCircuits: z
    .number()
    .int("validation.circuitsInt")
    .min(1, "validation.circuitsMin")
    .max(20, "validation.circuitsMax")
    .default(1),
});

export type WireSizeInput = z.input<typeof wireSizeInputSchema>;
export type WireSizeInputResolved = z.output<typeof wireSizeInputSchema>;

export type CalculationStep =
  | { key: "allowedDrop"; voltage: number; percent: number; drop: number }
  | {
      key: "minSection";
      coefficient: number;
      distance: number;
      current: number;
      drop: number;
      result: number;
    }
  | {
      key: "derating";
      insulation: InsulationType;
      ambient: number;
      ct: number;
      circuits: number;
      cg: number;
      total: number;
    }
  | {
      key: "requiredAmpacity";
      current: number;
      total: number;
      result: number;
    }
  | {
      key: "selected";
      minSection: number;
      requiredAmpacity: number;
      chosen: number;
      material: ConductorMaterial;
      insulation: InsulationType;
      baseAmpacity: number;
    }
  | {
      key: "effectiveAmpacity";
      baseAmpacity: number;
      total: number;
      effective: number;
      current: number;
      margin: number;
    }
  | {
      key: "verify";
      coefficient: number;
      distance: number;
      current: number;
      chosen: number;
      drop: number;
      percent: number;
    };

export type Warning =
  | { key: "aluminumMinSize"; min: number }
  | { key: "safetyMarginLow"; threshold: number }
  | { key: "parallelRecommended"; chosen: number };

export interface WireSizeResult {
  recommendedCrossSection: number;
  actualVoltageDrop: number;
  actualDropPercent: number;
  baseAmpacity: number;
  temperatureFactor: number;
  groupingFactor: number;
  effectiveAmpacity: number;
  safetyMarginPercent: number;
  warnings: Warning[];
  calculationSteps: CalculationStep[];
}

export class WireSizeCalculationError extends Error {
  /** i18n key under wireSizeTool.errors */
  public readonly i18nKey: string;
  constructor(i18nKey: string = "noStandardMatch") {
    super(i18nKey);
    this.name = "WireSizeCalculationError";
    this.i18nKey = i18nKey;
  }
}

function isThreePhase(phaseType: PhaseType): boolean {
  return phaseType === "three-3wire" || phaseType === "three-4wire";
}

function getCoefficient(
  phaseType: PhaseType,
  material: ConductorMaterial,
): number {
  const base = VOLTAGE_DROP_COEFFICIENT[phaseType];
  return material === "aluminum" ? base * ALUMINUM_CORRECTION_FACTOR : base;
}

function getBaseAmpacity(
  crossSection: number,
  phaseType: PhaseType,
  material: ConductorMaterial,
  insulation: InsulationType,
): number | undefined {
  const table =
    material === "copper"
      ? ALLOWED_CURRENT_A1_COPPER
      : ALLOWED_CURRENT_A1_ALUMINUM;
  const row = table[crossSection];
  if (!row) return undefined;
  const pvcAmpacity = isThreePhase(phaseType) ? row.three : row.single;
  return insulation === "XLPE" ? pvcAmpacity * XLPE_AMPACITY_MULTIPLIER : pvcAmpacity;
}

function getTemperatureFactor(
  ambientTemperature: number,
  insulation: InsulationType,
): number {
  const table =
    insulation === "PVC"
      ? TEMP_CORRECTION_FACTOR_PVC
      : TEMP_CORRECTION_FACTOR_XLPE;

  const sorted = [...table].sort((a, b) => a.temperature - b.temperature);
  const first = sorted[0];
  const last = sorted[sorted.length - 1];
  if (!first || !last) {
    throw new WireSizeCalculationError("noStandardMatch");
  }
  if (ambientTemperature <= first.temperature) return first.factor;
  if (ambientTemperature >= last.temperature) return last.factor;

  for (let i = 0; i < sorted.length - 1; i += 1) {
    const lo = sorted[i];
    const hi = sorted[i + 1];
    if (!lo || !hi) continue;
    if (ambientTemperature >= lo.temperature && ambientTemperature <= hi.temperature) {
      const ratio =
        (ambientTemperature - lo.temperature) / (hi.temperature - lo.temperature);
      return lo.factor + (hi.factor - lo.factor) * ratio;
    }
  }

  return 1.0;
}

function getGroupingFactor(numberOfCircuits: number): number {
  const sorted = [...GROUPING_FACTOR_TABLE].sort(
    (a, b) => a.circuits - b.circuits,
  );
  const last = sorted[sorted.length - 1];
  if (!last) {
    throw new WireSizeCalculationError("noStandardMatch");
  }
  for (const entry of sorted) {
    if (numberOfCircuits <= entry.circuits) return entry.factor;
  }
  return last.factor;
}

function calcVoltageDrop(
  coefficient: number,
  distance: number,
  current: number,
  crossSection: number,
): number {
  return (coefficient * distance * current) / (1000 * crossSection);
}

function buildWarnings(
  chosen: number,
  material: ConductorMaterial,
  safetyMarginPercent: number,
): Warning[] {
  const warnings: Warning[] = [];

  if (material === "aluminum" && chosen < ALUMINUM_MIN_CROSS_SECTION) {
    warnings.push({ key: "aluminumMinSize", min: ALUMINUM_MIN_CROSS_SECTION });
  }
  if (safetyMarginPercent < SAFETY_MARGIN_WARNING_THRESHOLD) {
    warnings.push({
      key: "safetyMarginLow",
      threshold: SAFETY_MARGIN_WARNING_THRESHOLD,
    });
  }
  if (chosen > PARALLEL_CABLE_RECOMMENDATION_THRESHOLD) {
    warnings.push({ key: "parallelRecommended", chosen });
  }

  return warnings;
}

export function calculateWireSize(rawInput: WireSizeInput): WireSizeResult {
  const input = wireSizeInputSchema.parse(rawInput);
  const {
    voltage,
    current,
    distance,
    phaseType,
    material,
    allowedDropPercent,
    insulation,
    ambientTemperature,
    numberOfCircuits,
  } = input;

  const allowedDrop = (voltage * allowedDropPercent) / 100;
  const coefficient = getCoefficient(phaseType, material);
  const minCrossSectionByDrop =
    (coefficient * distance * current) / (1000 * allowedDrop);

  const temperatureFactor = getTemperatureFactor(ambientTemperature, insulation);
  const groupingFactor = getGroupingFactor(numberOfCircuits);
  const totalDeratingFactor = temperatureFactor * groupingFactor;
  const requiredBaseAmpacity = current / totalDeratingFactor;

  let chosen: number | undefined;
  let chosenBase: number | undefined;
  let chosenEffective: number | undefined;
  for (const section of KS_WIRE_CROSS_SECTIONS) {
    if (section < minCrossSectionByDrop) continue;
    const baseAmpacity = getBaseAmpacity(section, phaseType, material, insulation);
    if (baseAmpacity === undefined) continue;
    if (baseAmpacity < requiredBaseAmpacity) continue;
    chosen = section;
    chosenBase = baseAmpacity;
    chosenEffective = baseAmpacity * totalDeratingFactor;
    break;
  }

  if (
    chosen === undefined ||
    chosenBase === undefined ||
    chosenEffective === undefined
  ) {
    throw new WireSizeCalculationError("noStandardMatch");
  }

  const actualVoltageDrop = calcVoltageDrop(
    coefficient,
    distance,
    current,
    chosen,
  );
  const actualDropPercent = (actualVoltageDrop / voltage) * 100;
  const safetyMarginPercent =
    ((chosenEffective - current) / chosenEffective) * 100;

  const calculationSteps: CalculationStep[] = [
    {
      key: "allowedDrop",
      voltage,
      percent: allowedDropPercent,
      drop: allowedDrop,
    },
    {
      key: "minSection",
      coefficient,
      distance,
      current,
      drop: allowedDrop,
      result: minCrossSectionByDrop,
    },
    {
      key: "derating",
      insulation,
      ambient: ambientTemperature,
      ct: temperatureFactor,
      circuits: numberOfCircuits,
      cg: groupingFactor,
      total: totalDeratingFactor,
    },
    {
      key: "requiredAmpacity",
      current,
      total: totalDeratingFactor,
      result: requiredBaseAmpacity,
    },
    {
      key: "selected",
      minSection: minCrossSectionByDrop,
      requiredAmpacity: requiredBaseAmpacity,
      chosen,
      material,
      insulation,
      baseAmpacity: chosenBase,
    },
    {
      key: "effectiveAmpacity",
      baseAmpacity: chosenBase,
      total: totalDeratingFactor,
      effective: chosenEffective,
      current,
      margin: safetyMarginPercent,
    },
    {
      key: "verify",
      coefficient,
      distance,
      current,
      chosen,
      drop: actualVoltageDrop,
      percent: actualDropPercent,
    },
  ];

  const warnings = buildWarnings(chosen, material, safetyMarginPercent);

  return {
    recommendedCrossSection: chosen,
    actualVoltageDrop,
    actualDropPercent,
    baseAmpacity: chosenBase,
    temperatureFactor,
    groupingFactor,
    effectiveAmpacity: chosenEffective,
    safetyMarginPercent,
    warnings,
    calculationSteps,
  };
}
