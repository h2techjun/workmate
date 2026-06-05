/**
 * 출산예정일·임신주수 계산 — 네겔레 법칙(Naegele's rule).
 *
 * 출산예정일(EDD) = 마지막 생리 시작일(LMP) + 280일(40주).
 *   = LMP + 1년 − 3개월 + 7일 (네겔레 법칙)
 *
 * 현재 임신 주수 = (오늘 − LMP) / 7.
 * 삼분기: 1기 0~13주, 2기 14~27주, 3기 28주~.
 *
 * 모두 순수 함수 — 기준일(today)을 인자로 받음.
 */

import { z } from "zod";

export const dueDateInputSchema = z.object({
  lmpYear: z.number().int().min(1900).max(2200),
  lmpMonth: z.number().int().min(1).max(12),
  lmpDay: z.number().int().min(1).max(31),
  /** 평균 생리주기 (일, 기본 28) — 배란 보정 */
  cycleLength: z.number().int().min(20).max(45).default(28),
  refYear: z.number().int().min(1900).max(2200),
  refMonth: z.number().int().min(1).max(12),
  refDay: z.number().int().min(1).max(31),
});

export type DueDateInput = z.input<typeof dueDateInputSchema>;
export type DueDateInputResolved = z.output<typeof dueDateInputSchema>;

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

export interface DueDateResult {
  dueDate: { year: number; month: number; day: number };
  /** 현재 임신 주수 (정수 주) */
  weeks: number;
  /** 현재 주차의 일수 (0~6) */
  days: number;
  /** 삼분기 (1·2·3) */
  trimester: 1 | 2 | 3;
  /** 출산까지 남은 일수 */
  daysToGo: number;
  /** 진행률 (%) */
  progress: number;
}

export function calculateDueDate(
  input: DueDateInputResolved,
): DueDateResult {
  const lmp = toUTC(input.lmpYear, input.lmpMonth, input.lmpDay);
  const ref = toUTC(input.refYear, input.refMonth, input.refDay);

  // 주기 보정: 28일 기준 대비 (cycleLength - 28)일 만큼 EDD 이동
  const cycleAdjust = (input.cycleLength - 28) * 86_400_000;
  const dueMs = lmp + 280 * 86_400_000 + cycleAdjust;

  const elapsedDays = Math.floor((ref - lmp) / 86_400_000);
  const weeks = Math.floor(elapsedDays / 7);
  const days = elapsedDays % 7;

  const trimester: 1 | 2 | 3 = weeks < 14 ? 1 : weeks < 28 ? 2 : 3;
  const daysToGo = Math.round((dueMs - ref) / 86_400_000);
  const progress = Math.max(0, Math.min(100, (elapsedDays / 280) * 100));

  return {
    dueDate: fromUTC(dueMs),
    weeks: Math.max(0, weeks),
    days: Math.max(0, days),
    trimester,
    daysToGo,
    progress: Math.round(progress * 10) / 10,
  };
}
