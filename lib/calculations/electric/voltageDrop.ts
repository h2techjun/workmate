/**
 * 전압강하 계산기 (Voltage Drop Calculator)
 *
 * 입력된 단면적·전류·거리·상 종류로부터 전압강하 계산 + 내선규정 허용치 비교.
 *
 * 핵심 공식:
 *   e = (계수 × L × I) / (1000 × A)
 *     단상2선식 35.6 / 3상3선식 30.8 / 단상3선식·3상4선식 17.8 (동선)
 *     알루미늄: 동선 계수 × 1.6
 *   e_percent = (e / V) × 100
 *
 * 내선규정 허용 전압강하율 (거리별):
 *   60m 이하 — 3%, 120m 이하 — 5%, 200m 이하 — 6%, 200m 초과 — 7%
 *
 * @see docs/electric-calc.md - 3. 전압강하 계산기
 */

import { z } from "zod";
import {
  ALUMINUM_CORRECTION_FACTOR,
  KS_WIRE_CROSS_SECTIONS,
  VOLTAGE_DROP_COEFFICIENT,
  VOLTAGE_DROP_LIMIT_BY_DISTANCE,
  type ConductorMaterial,
  type PhaseType,
} from "@/lib/constants/electric/ksStandard";

export const voltageDropInputSchema = z.object({
  voltage: z.number().positive("validation.voltagePositive"),
  current: z.number().positive("validation.currentPositive"),
  distance: z
    .number()
    .positive("validation.distancePositive")
    .max(2000, "validation.distanceMax"),
  crossSection: z
    .number()
    .positive("validation.crossSectionPositive")
    .refine(
      (v) => (KS_WIRE_CROSS_SECTIONS as readonly number[]).includes(v),
      { message: "validation.crossSectionStandard" },
    ),
  phaseType: z.enum([
    "single-2wire",
    "single-3wire",
    "three-3wire",
    "three-4wire",
  ]),
  material: z.enum(["copper", "aluminum"]),
});

export type VoltageDropInput = z.input<typeof voltageDropInputSchema>;
export type VoltageDropInputResolved = z.output<typeof voltageDropInputSchema>;

export type VoltageDropStep =
  | {
      key: "coefficient";
      base: number;
      material: ConductorMaterial;
      result: number;
    }
  | {
      key: "drop";
      coefficient: number;
      distance: number;
      current: number;
      crossSection: number;
      result: number;
    }
  | { key: "dropPercent"; drop: number; voltage: number; result: number }
  | {
      key: "receivingVoltage";
      voltage: number;
      drop: number;
      result: number;
    }
  | {
      key: "limitCheck";
      distance: number;
      limitPercent: number;
      actualPercent: number;
      pass: boolean;
    };

export interface VoltageDropResult {
  voltageDropV: number;
  voltageDropPercent: number;
  receivingVoltage: number;
  limitPercent: number;
  pass: boolean;
  marginPercent: number;
  calculationSteps: VoltageDropStep[];
}

function getCoefficient(
  phaseType: PhaseType,
  material: ConductorMaterial,
): number {
  const base = VOLTAGE_DROP_COEFFICIENT[phaseType];
  return material === "aluminum" ? base * ALUMINUM_CORRECTION_FACTOR : base;
}

function getLimitByDistance(distanceM: number): number {
  for (const r of VOLTAGE_DROP_LIMIT_BY_DISTANCE) {
    if (distanceM <= r.maxDistance) return r.limitPercent;
  }
  return 7;
}

export function calculateVoltageDrop(
  rawInput: VoltageDropInput,
): VoltageDropResult {
  const input = voltageDropInputSchema.parse(rawInput);
  const { voltage, current, distance, crossSection, phaseType, material } =
    input;

  const baseCoefficient = VOLTAGE_DROP_COEFFICIENT[phaseType];
  const coefficient = getCoefficient(phaseType, material);

  const dropV = (coefficient * distance * current) / (1000 * crossSection);
  const dropPercent = (dropV / voltage) * 100;
  const receivingVoltage = voltage - dropV;

  const limitPercent = getLimitByDistance(distance);
  const pass = dropPercent <= limitPercent;
  const marginPercent = limitPercent - dropPercent;

  const calculationSteps: VoltageDropStep[] = [
    {
      key: "coefficient",
      base: baseCoefficient,
      material,
      result: coefficient,
    },
    {
      key: "drop",
      coefficient,
      distance,
      current,
      crossSection,
      result: dropV,
    },
    {
      key: "dropPercent",
      drop: dropV,
      voltage,
      result: dropPercent,
    },
    {
      key: "receivingVoltage",
      voltage,
      drop: dropV,
      result: receivingVoltage,
    },
    {
      key: "limitCheck",
      distance,
      limitPercent,
      actualPercent: dropPercent,
      pass,
    },
  ];

  return {
    voltageDropV: dropV,
    voltageDropPercent: dropPercent,
    receivingVoltage,
    limitPercent,
    pass,
    marginPercent,
    calculationSteps,
  };
}
