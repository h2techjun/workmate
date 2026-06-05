/**
 * 페인트 도장 면적·소요량 계산.
 *
 *   순 도장면적 = 벽 총면적 − 문/창 면적
 *   필요 페인트(L) = 순면적 × 도장 횟수 / 도포율(㎡/L)
 *
 * 도포율(spreading rate)은 도료·표면에 따라 6~12 ㎡/L. 일반 내벽 수성 약 10 ㎡/L/회.
 * 기본 2회 도장(초벌+정벌) 권장. 손실·재도장 여유 10% 가산.
 *
 * 출처: 일반 도료 제조사 표준 도포율 + KCS 41 47 00(도장공사).
 */

import { z } from "zod";

export const paintInputSchema = z.object({
  /** 벽 총면적 (㎡) — 직접 입력하거나 둘레×높이로 산정 */
  wallArea: z.number().min(0).default(0),
  /** 문 개수 */
  doorCount: z.number().int().min(0).default(0),
  /** 창문 개수 */
  windowCount: z.number().int().min(0).default(0),
  /** 도장 횟수 (회) */
  coats: z.number().int().min(1).max(5).default(2),
  /** 도포율 (㎡/L/회) */
  spreadRate: z.number().min(1).max(30).default(10),
  /** 손실 여유율 (%) */
  wastePercent: z.number().min(0).max(50).default(10),
});

export type PaintInput = z.input<typeof paintInputSchema>;
export type PaintInputResolved = z.output<typeof paintInputSchema>;

// 표준 개구부 면적 (㎡)
const DOOR_AREA = 2.0; // 0.9m × 2.1m ≈ 1.9, 여유 2.0
const WINDOW_AREA = 1.5; // 1.2m × 1.2m ≈ 1.44, 여유 1.5

export interface PaintResult {
  /** 개구부(문·창) 차감 면적 */
  openingArea: number;
  /** 순 도장면적 */
  netArea: number;
  /** 총 도장면적 (순면적 × 횟수) */
  totalCoatArea: number;
  /** 손실 전 페인트 (L) */
  litersBase: number;
  /** 손실 포함 페인트 (L) */
  litersWithWaste: number;
  /** 권장 구매량 — 4L 통 기준 개수 */
  cans4L: number;
  /** 권장 구매량 — 1L 통 기준 개수 */
  cans1L: number;
}

export function calculatePaint(input: PaintInputResolved): PaintResult {
  const { wallArea, doorCount, windowCount, coats, spreadRate, wastePercent } =
    input;

  const openingArea = doorCount * DOOR_AREA + windowCount * WINDOW_AREA;
  const netArea = Math.max(0, wallArea - openingArea);
  const totalCoatArea = netArea * coats;

  const litersBase = totalCoatArea / spreadRate;
  const litersWithWaste = litersBase * (1 + wastePercent / 100);

  const cans4L = Math.ceil(litersWithWaste / 4);
  const cans1L = Math.ceil(litersWithWaste);

  return {
    openingArea,
    netArea,
    totalCoatArea,
    litersBase: Math.round(litersBase * 100) / 100,
    litersWithWaste: Math.round(litersWithWaste * 100) / 100,
    cans4L,
    cans1L,
  };
}
