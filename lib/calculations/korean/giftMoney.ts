/**
 * 축의금/부의금 적정액 추천 — 한국 경조사 관습 기반.
 *
 * 정해진 법칙은 없으나 관계 친밀도·참석 여부·식사 여부로 통념적 금액대가 있다.
 * 한국은 홀수(3·5·7·10만) 선호. 본 도구는 관계와 상황으로 권장 구간을 제시.
 *
 * 출처: 일반적 경조사 관습(2024~2025 물가 반영). 절대 기준 아님 — 참고용.
 */

import { z } from "zod";

export const giftMoneyInputSchema = z.object({
  event: z.enum(["wedding", "funeral"]).default("wedding"),
  /** 관계 친밀도 */
  relation: z.enum([
    "acquaintance", // 직장 지인·가끔 보는 사이
    "colleague", // 같은 부서·자주 보는 동료
    "friend", // 친한 친구
    "closeFriend", // 절친
    "family", // 친척
  ]).default("colleague"),
  /** 결혼식 직접 참석(식사) 여부 */
  attending: z.boolean().default(true),
});

export type GiftMoneyInput = z.input<typeof giftMoneyInputSchema>;
export type GiftMoneyInputResolved = z.output<typeof giftMoneyInputSchema>;

export interface GiftMoneyResult {
  /** 권장 금액 (만원) */
  recommended: number;
  /** 최소~최대 범위 (만원) */
  min: number;
  max: number;
  /** 참석 시 식대 고려 메모 키 */
  attendingNote: boolean;
}

// 관계별 기본 권장액 (만원) — 결혼식 기준
const WEDDING_BASE: Record<string, { rec: number; min: number; max: number }> = {
  acquaintance: { rec: 5, min: 5, max: 5 },
  colleague: { rec: 5, min: 5, max: 10 },
  friend: { rec: 10, min: 5, max: 10 },
  closeFriend: { rec: 10, min: 10, max: 20 },
  family: { rec: 10, min: 10, max: 30 },
};

// 부의금 기준 (만원)
const FUNERAL_BASE: Record<string, { rec: number; min: number; max: number }> = {
  acquaintance: { rec: 5, min: 3, max: 5 },
  colleague: { rec: 5, min: 5, max: 10 },
  friend: { rec: 5, min: 5, max: 10 },
  closeFriend: { rec: 10, min: 10, max: 20 },
  family: { rec: 10, min: 10, max: 30 },
};

export function calculateGiftMoney(
  input: GiftMoneyInputResolved,
): GiftMoneyResult {
  const { event, relation, attending } = input;
  const table = event === "wedding" ? WEDDING_BASE : FUNERAL_BASE;
  const base = table[relation]!;

  let recommended = base.rec;
  // 결혼식 직접 참석(식대 발생) 시 한 단계 상향 권장
  if (event === "wedding" && attending && recommended < 10) {
    recommended = Math.min(base.max, recommended === 5 ? 10 : recommended);
  }

  return {
    recommended,
    min: base.min,
    max: base.max,
    attendingNote: event === "wedding" && attending,
  };
}
