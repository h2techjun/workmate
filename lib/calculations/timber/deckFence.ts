/**
 * 데크 보드·울타리 자재 수량 계산.
 *
 * [데크] 바닥 면적을 보드로 덮는 데 필요한 장수·길이.
 *   보드 1장 유효폭 = 보드폭 + 이격(gap)
 *   필요 보드 길이(m) = 데크면적 / 유효폭
 *   보드 장수 = 필요 길이 / 보드 1장 길이 (할증 10%)
 *   장선(joist) = 데크 길이 / 장선 간격 + 1
 *
 * [울타리] 둘레 길이에 기둥·패널.
 *   기둥 수 = ceil(둘레 / 기둥 간격) + 1
 *   패널/세로살 = 둘레 / 살 간격
 *
 * 출처: 일반 목공·조경 시공 관행.
 */

import { z } from "zod";

export const deckInputSchema = z.object({
  /** 데크 면적 (m²) */
  area: z.number().min(0).default(0),
  /** 보드 폭 (mm) */
  boardWidth: z.number().min(50).max(300).default(140),
  /** 보드 길이 (m) */
  boardLength: z.number().min(0.5).max(6).default(3.6),
  /** 보드 간 이격 (mm) */
  gap: z.number().min(0).max(20).default(5),
  /** 장선 간격 (mm) */
  joistSpacing: z.number().min(200).max(600).default(400),
  /** 데크 한 변 길이 (장선 산정용, m) */
  deckLength: z.number().min(0).default(0),
  /** 손실 할증 (%) */
  waste: z.number().min(0).max(30).default(10),
});

export type DeckInput = z.input<typeof deckInputSchema>;
export type DeckInputResolved = z.output<typeof deckInputSchema>;

export interface DeckResult {
  /** 보드 1장 유효 커버 면적 (m²) */
  effectiveBoardArea: number;
  /** 필요 보드 장수 (할증 포함) */
  boardCount: number;
  /** 총 보드 길이 (m) */
  totalBoardLength: number;
  /** 장선 개수 */
  joistCount: number;
}

export function calculateDeck(input: DeckInputResolved): DeckResult {
  const { area, boardWidth, boardLength, gap, joistSpacing, deckLength, waste } =
    input;

  const effectiveWidthM = (boardWidth + gap) / 1000;
  const effectiveBoardArea = effectiveWidthM * boardLength;
  const boardsRaw = effectiveBoardArea > 0 ? area / effectiveBoardArea : 0;
  const boardCount = Math.ceil(boardsRaw * (1 + waste / 100));
  const totalBoardLength = boardCount * boardLength;

  const joistCount =
    deckLength > 0
      ? Math.ceil(deckLength / (joistSpacing / 1000)) + 1
      : 0;

  return {
    effectiveBoardArea: Math.round(effectiveBoardArea * 1000) / 1000,
    boardCount,
    totalBoardLength: Math.round(totalBoardLength * 10) / 10,
    joistCount,
  };
}

// ─────────── 울타리 ───────────
export const fenceInputSchema = z.object({
  /** 울타리 총 길이 (m) */
  length: z.number().min(0).default(0),
  /** 기둥 간격 (m) */
  postSpacing: z.number().min(0.5).max(5).default(2),
  /** 세로살 간격 (mm) — 0이면 패널 미산정 */
  picketSpacing: z.number().min(0).max(500).default(0),
});

export type FenceInput = z.input<typeof fenceInputSchema>;
export type FenceInputResolved = z.output<typeof fenceInputSchema>;

export interface FenceResult {
  postCount: number;
  /** 가로 레일 (보통 2~3단, 칸당 2개) */
  railCount: number;
  picketCount: number;
}

export function calculateFence(input: FenceInputResolved): FenceResult {
  const { length, postSpacing, picketSpacing } = input;
  const sections = length > 0 ? Math.ceil(length / postSpacing) : 0;
  const postCount = sections > 0 ? sections + 1 : 0;
  const railCount = sections * 2; // 상·하 2단
  const picketCount =
    picketSpacing > 0 ? Math.ceil((length * 1000) / picketSpacing) : 0;

  return { postCount, railCount, picketCount };
}
