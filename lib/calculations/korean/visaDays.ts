/**
 * 한국 체류일수 계산 — 입국일 기준 90일 무비자/비자 만료일 추적.
 *
 * 한국 입국 외국인이 가장 헷갈리는 것: 체류 만료일과 남은 일수.
 * - 입국일을 1일째로 셀지(포함) vs 다음날부터(미포함)는 비자 종류·해석에 따라 다름.
 *   본 도구는 출입국 관행에 따라 '입국일 포함' 으로 체류일수를 세고,
 *   허용일수 만료일도 함께 제시한다.
 *
 * 모두 순수 함수 — 기준일(today)을 인자로 받음.
 */

import { z } from "zod";

export const visaDaysInputSchema = z.object({
  entryYear: z.number().int().min(1900).max(2200),
  entryMonth: z.number().int().min(1).max(12),
  entryDay: z.number().int().min(1).max(31),
  /** 허용 체류일수 (무비자 90, 일부 30/60 등) */
  allowedDays: z.number().int().min(1).max(3650).default(90),
  /** 기준일 (오늘) */
  refYear: z.number().int().min(1900).max(2200),
  refMonth: z.number().int().min(1).max(12),
  refDay: z.number().int().min(1).max(31),
});

export type VisaDaysInput = z.input<typeof visaDaysInputSchema>;
export type VisaDaysInputResolved = z.output<typeof visaDaysInputSchema>;

function toUTC(y: number, m: number, d: number): number {
  return Date.UTC(y, m - 1, d);
}
function fromUTC(ms: number): { year: number; month: number; day: number } {
  const d = new Date(ms);
  return {
    year: d.getUTCFullYear(),
    month: d.getUTCMonth() + 1,
    day: d.getUTCDate(),
  };
}

export interface VisaDaysResult {
  /** 입국일 포함 현재까지 체류 일수 */
  daysStayed: number;
  /** 만료일 (허용일수의 마지막 날, 입국일 포함) */
  expiry: { year: number; month: number; day: number };
  /** 만료까지 남은 일수 (음수면 초과) */
  daysRemaining: number;
  /** 이미 만료 초과 여부 */
  isOverstay: boolean;
}

export function calculateVisaDays(
  input: VisaDaysInputResolved,
): VisaDaysResult {
  const entry = toUTC(input.entryYear, input.entryMonth, input.entryDay);
  const ref = toUTC(input.refYear, input.refMonth, input.refDay);

  // 입국일 포함 체류 일수 = (ref - entry) + 1
  const daysStayed = Math.round((ref - entry) / 86_400_000) + 1;

  // 만료일 = 입국일 + (허용일수 - 1) (입국일이 1일째)
  const expiryMs = entry + (input.allowedDays - 1) * 86_400_000;
  const expiry = fromUTC(expiryMs);

  // 남은 일수 = 만료일 - 기준일
  const daysRemaining = Math.round((expiryMs - ref) / 86_400_000);
  const isOverstay = ref > expiryMs;

  return {
    daysStayed,
    expiry,
    daysRemaining,
    isOverstay,
  };
}
