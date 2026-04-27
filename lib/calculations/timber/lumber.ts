/**
 * 목재 수량 계산기 (Lumber Quantity Calculator)
 *
 * W × H × L × Qty 로부터 부피·재(才)·보드피트·무게 환산.
 *
 *   volume(m³) = (W × H × L × Qty) / 10⁹
 *   재(才)     = volume(m³) / 0.003342
 *   BF         = volume(m³) / 0.002359737
 *   weight(kg) = volume(m³) × density(kg/m³)
 *
 * @see docs/timber-calc.md
 */

import { z } from "zod";
import {
  M3_TO_BOARD_FEET,
  SAI_PER_M3,
  WOOD_DENSITY_KG_PER_M3,
  type WoodSpecies,
} from "@/lib/constants/timber/standards";

export const lumberInputSchema = z.object({
  widthMM: z
    .number()
    .min(10, "validation.widthMin")
    .max(1000, "validation.widthMax"),
  thicknessMM: z
    .number()
    .min(10, "validation.thicknessMin")
    .max(1000, "validation.thicknessMax"),
  lengthMM: z
    .number()
    .min(100, "validation.lengthMin")
    .max(20000, "validation.lengthMax"),
  quantity: z
    .number()
    .int("validation.quantityInt")
    .min(1, "validation.quantityMin")
    .max(10000, "validation.quantityMax"),
  species: z
    .enum(["pine", "larch", "cedar", "spf", "douglasFir", "oak"])
    .default("spf"),
});

export type LumberInput = z.input<typeof lumberInputSchema>;
export type LumberInputResolved = z.output<typeof lumberInputSchema>;

export type LumberStep =
  | {
      key: "perPieceVolume";
      width: number;
      thickness: number;
      length: number;
      result: number;
    }
  | {
      key: "totalVolume";
      perPiece: number;
      quantity: number;
      result: number;
    }
  | { key: "boardFeet"; volumeM3: number; result: number }
  | { key: "sai"; volumeM3: number; result: number }
  | {
      key: "weight";
      volumeM3: number;
      density: number;
      species: WoodSpecies;
      result: number;
    };

export interface LumberResult {
  perPieceVolumeM3: number;
  totalVolumeM3: number;
  boardFeet: number;
  sai: number;
  weightKg: number;
  density: number;
  calculationSteps: LumberStep[];
}

export function calculateLumber(rawInput: LumberInput): LumberResult {
  const input = lumberInputSchema.parse(rawInput);
  const { widthMM, thicknessMM, lengthMM, quantity, species } = input;

  const perPieceVolumeM3 = (widthMM * thicknessMM * lengthMM) / 1_000_000_000;
  const totalVolumeM3 = perPieceVolumeM3 * quantity;
  const boardFeet = totalVolumeM3 * M3_TO_BOARD_FEET;
  const sai = totalVolumeM3 * SAI_PER_M3;
  const density = WOOD_DENSITY_KG_PER_M3[species];
  const weightKg = totalVolumeM3 * density;

  const calculationSteps: LumberStep[] = [
    {
      key: "perPieceVolume",
      width: widthMM,
      thickness: thicknessMM,
      length: lengthMM,
      result: perPieceVolumeM3,
    },
    {
      key: "totalVolume",
      perPiece: perPieceVolumeM3,
      quantity,
      result: totalVolumeM3,
    },
    { key: "boardFeet", volumeM3: totalVolumeM3, result: boardFeet },
    { key: "sai", volumeM3: totalVolumeM3, result: sai },
    {
      key: "weight",
      volumeM3: totalVolumeM3,
      density,
      species,
      result: weightKg,
    },
  ];

  return {
    perPieceVolumeM3,
    totalVolumeM3,
    boardFeet,
    sai,
    weightKg,
    density,
    calculationSteps,
  };
}
