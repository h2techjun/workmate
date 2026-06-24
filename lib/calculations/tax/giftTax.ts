/**
 * 증여세 계산 — 상속세 및 증여세법 제53조·제56조 (2024 기준).
 *
 * 흐름:
 *   과세표준 = 증여재산가액 − 증여재산공제 − 10년내 기증여 합산액
 *   산출세액 = 과세표준 × 세율 − 누진공제
 *   납부세액 = 산출세액 × 0.97  (자진신고 시 3% 공제, 상속세및증여세법 제69조)
 *
 * ※ 재산평가·세대생략할증(30%)·가산세 등은 미반영.
 *    실제 신고는 세무사 또는 국세청 홈택스 이용 권장.
 */

import { z } from "zod";

// ─────────────────────────────────────────────
// 증여자 관계 (수증자 기준, 상속세및증여세법 제53조)
// ─────────────────────────────────────────────
export const DONOR_RELATIONS = [
  "spouse", // 배우자
  "lineal-adult", // 직계존속 → 성년 직계비속
  "lineal-minor", // 직계존속 → 미성년 직계비속
  "lineal-ancestor", // 직계비속 → 직계존속
  "other-relative", // 기타 친족 (6촌 이내 혈족·4촌 이내 인척)
  "other", // 그 외 타인
] as const;

export type DonorRelation = (typeof DONOR_RELATIONS)[number];

/** 증여재산공제액 (10년 한도, 원) */
export const DEDUCTION_MAP: Record<DonorRelation, number> = {
  spouse: 600_000_000, // 6억
  "lineal-adult": 50_000_000, // 5천만
  "lineal-minor": 20_000_000, // 2천만
  "lineal-ancestor": 50_000_000, // 5천만
  "other-relative": 10_000_000, // 1천만
  other: 0,
};

// ─────────────────────────────────────────────
// 세율표 (상속세및증여세법 제56조)
// ─────────────────────────────────────────────
interface TaxBracket {
  upper: number | null; // null = 무한대 (최고 구간)
  rate: number; // 세율 (소수)
  progressiveDeduction: number; // 누진공제 (원)
}

export const GIFT_TAX_BRACKETS: ReadonlyArray<TaxBracket> = [
  { upper: 100_000_000, rate: 0.1, progressiveDeduction: 0 },
  { upper: 500_000_000, rate: 0.2, progressiveDeduction: 10_000_000 },
  { upper: 1_000_000_000, rate: 0.3, progressiveDeduction: 60_000_000 },
  { upper: 3_000_000_000, rate: 0.4, progressiveDeduction: 160_000_000 },
  { upper: null, rate: 0.5, progressiveDeduction: 460_000_000 },
];

// ─────────────────────────────────────────────
// 입력 스키마
// ─────────────────────────────────────────────
export const giftTaxInputSchema = z.object({
  /** 증여재산가액 (원) */
  giftAmount: z.number().min(0),
  /** 증여자 관계 */
  donorRelation: z.enum(DONOR_RELATIONS),
  /** 10년내 기증여 합산액 (원, 기본 0) */
  priorGifts: z.number().min(0).default(0),
  /** 자진신고 여부 (신고세액공제 3% 적용) */
  selfReport: z.boolean().default(true),
});

export type GiftTaxInput = z.input<typeof giftTaxInputSchema>;
export type GiftTaxInputResolved = z.output<typeof giftTaxInputSchema>;

// ─────────────────────────────────────────────
// 결과 타입
// ─────────────────────────────────────────────
export interface GiftTaxResult {
  /** 증여재산공제 (관계별 한도, 원) */
  deduction: number;
  /** 과세표준 (증여재산가액 − 공제 − 기증여, 원) */
  taxBase: number;
  /** 적용 세율 */
  marginalRate: number;
  /** 산출세액 (과세표준 × 세율 − 누진공제, 원) */
  calculatedTax: number;
  /** 신고세액공제 (자진신고 시 산출세액 × 3%, 아니면 0, 원) */
  reportDiscount: number;
  /** 납부세액 = 산출세액 − 신고세액공제 (원) */
  finalTax: number;
}

// ─────────────────────────────────────────────
// 핵심 계산 함수 (순수 함수)
// ─────────────────────────────────────────────
export function calculateGiftTax(input: GiftTaxInputResolved): GiftTaxResult {
  const { giftAmount, donorRelation, priorGifts, selfReport } = input;

  // 1) 증여재산공제 — 10년 한도에서 기증여만큼 이미 사용된 것으로 처리
  const maxDeduction = DEDUCTION_MAP[donorRelation];
  // 기증여가 이미 공제 한도를 초과하면 이번 증여에 사용 가능한 공제 = 0
  const usableDeduction = Math.max(0, maxDeduction - priorGifts);
  const deduction = Math.min(giftAmount, usableDeduction);

  // 2) 과세표준
  const taxBase = Math.max(0, giftAmount - deduction);

  // 3) 산출세액
  let calculatedTax = 0;
  let marginalRate = 0;

  if (taxBase > 0) {
    const bracket =
      GIFT_TAX_BRACKETS.find((b) => b.upper === null || taxBase <= b.upper) ??
      GIFT_TAX_BRACKETS[GIFT_TAX_BRACKETS.length - 1]!;
    marginalRate = bracket.rate;
    calculatedTax = Math.max(
      0,
      Math.round(taxBase * bracket.rate - bracket.progressiveDeduction),
    );
  }

  // 4) 신고세액공제 (3%, 원 미만 절사)
  const reportDiscount = selfReport
    ? Math.floor(calculatedTax * 0.03)
    : 0;

  // 5) 납부세액
  const finalTax = calculatedTax - reportDiscount;

  return {
    deduction,
    taxBase,
    marginalRate,
    calculatedTax,
    reportDiscount,
    finalTax,
  };
}
