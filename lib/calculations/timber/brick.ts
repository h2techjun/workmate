/**
 * 벽돌·블록 조적 수량 계산 — 벽 면적 기준 정미 수량 + 할증 + 모르타르.
 *
 *   벽돌 수량 = 벽 면적(m²) × 단위 수량(매/m²) × (1 + 할증)
 *   모르타르(m³) = 벽 면적 × 모르타르 정미량(m³/m²)
 *   시멘트(kg) = 모르타르 × 배합 시멘트량, 모래(m³) = 모르타르 × 배합 모래량
 *
 * 단위 수량(매/m², 줄눈 10mm 기준) — 건설공사 표준품셈:
 *   표준형 벽돌(190×90×57): 0.5B 75, 1.0B 149, 1.5B 224, 2.0B 298
 *   콘크리트 기본블록(390×190×190): 12.5
 * 모르타르 정미량(m³/m²): 0.5B 0.019, 1.0B 0.049, 1.5B 0.078, 2.0B 0.104 / 블록 0.010
 * 시멘트 모르타르 1:3 배합 = 1m³당 시멘트 510kg + 모래 1.1m³.
 *
 * 출처: 건설공사 표준품셈(한국건설기술연구원) 조적공사 + KS L 4201(점토벽돌)·KS F 4002(콘크리트 블록).
 */

import { z } from "zod";

export const brickInputSchema = z.object({
  /** 벽 면적 (m²) — 개구부 제외 순수 조적 면적 */
  wallArea: z.number().min(0).default(0),
  /** 벽돌 종류 */
  brickType: z.enum(["standard", "cement", "block"]).default("standard"),
  /** 쌓기 두께 (0.5B 반장 / 1.0B 한장 / 1.5B / 2.0B) — 블록은 무시 */
  bond: z.enum(["half", "one", "oneHalf", "two"]).default("one"),
  /** 할증률 (%) — 파손·여분 */
  waste: z.number().min(0).max(30).default(5),
});

export type BrickInput = z.input<typeof brickInputSchema>;
export type BrickInputResolved = z.output<typeof brickInputSchema>;

type Bond = "half" | "one" | "oneHalf" | "two";

/** 표준형·시멘트 벽돌 정미 수량 (매/m², 줄눈 10mm) */
const BRICK_PER_M2: Record<Bond, number> = {
  half: 75,
  one: 149,
  oneHalf: 224,
  two: 298,
};
/** 콘크리트 기본블록 정미 수량 (매/m²) */
const BLOCK_PER_M2 = 12.5;
/** 모르타르 정미량 (m³/m²) */
const MORTAR_PER_M2: Record<Bond, number> = {
  half: 0.019,
  one: 0.049,
  oneHalf: 0.078,
  two: 0.104,
};
const BLOCK_MORTAR_PER_M2 = 0.01;
/** 1:3 시멘트 모르타르 1m³당 배합량 */
const CEMENT_KG_PER_M3 = 510;
const SAND_M3_PER_M3 = 1.1;
const CEMENT_BAG_KG = 40;

export interface BrickResult {
  /** 정미 수량 (매) */
  bricksNet: number;
  /** 할증 포함 발주 수량 (매) */
  bricks: number;
  /** 적용 단위 수량 (매/m²) */
  perM2: number;
  /** 모르타르 부피 (m³) */
  mortarM3: number;
  /** 시멘트 (kg) */
  cementKg: number;
  /** 시멘트 40kg 포대 수 */
  cementBags: number;
  /** 모래 (m³) */
  sandM3: number;
}

export function calculateBrick(input: BrickInputResolved): BrickResult {
  const { wallArea, brickType, bond, waste } = input;
  const isBlock = brickType === "block";
  const perM2 = isBlock ? BLOCK_PER_M2 : BRICK_PER_M2[bond];
  const mortarPerM2 = isBlock ? BLOCK_MORTAR_PER_M2 : MORTAR_PER_M2[bond];

  const bricksNet = wallArea * perM2;
  const bricks = Math.ceil(bricksNet * (1 + waste / 100));
  const mortarM3 = wallArea * mortarPerM2;
  const cementKg = mortarM3 * CEMENT_KG_PER_M3;
  const sandM3 = mortarM3 * SAND_M3_PER_M3;

  return {
    bricksNet: Math.round(bricksNet),
    bricks,
    perM2,
    mortarM3: Math.round(mortarM3 * 1000) / 1000,
    cementKg: Math.round(cementKg),
    cementBags: Math.ceil(cementKg / CEMENT_BAG_KG),
    sandM3: Math.round(sandM3 * 100) / 100,
  };
}
