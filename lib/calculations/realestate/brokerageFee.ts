/**
 * 부동산 중개수수료(복비) 계산기.
 *
 * 공인중개사법 시행규칙 별표1 (2021.10.19 개정) 기준 법정 상한요율.
 * 시·도 조례로 9억 이상 구간을 세분할 수 있으나, 이 계산기는 법정 상한만 다룸.
 *
 * ─ 매매·교환 상한요율 ─
 *   5천만 미만   0.6%  한도 25만
 *   5천만~2억    0.5%  한도 80만
 *   2억~9억      0.4%  한도 없음
 *   9억~12억     0.5%  한도 없음
 *   12억~15억    0.6%  한도 없음
 *   15억 이상    0.7%  한도 없음
 *
 * ─ 임대차(전세·월세) 상한요율 ─
 *   5천만 미만   0.5%  한도 20만
 *   5천만~1억    0.4%  한도 30만
 *   1억~6억      0.3%  한도 없음
 *   6억~12억     0.4%  한도 없음
 *   12억~15억    0.5%  한도 없음
 *   15억 이상    0.6%  한도 없음
 *
 * ─ 월세 거래금액 환산 ─
 *   환산액 = 보증금 + (월세 × 100). 단 이 값이 5천만 미만이면 보증금 + (월세 × 70).
 *
 * 중개보수 = min(거래금액 × 상한요율, 한도액). 한도없으면 상한요율 그대로.
 * 부가가치세(10%)는 옵션.
 *
 * 출처: 공인중개사법 시행규칙 [별표1], 국토교통부 (2021.10.19 시행).
 */

import { z } from "zod";

// ── 거래유형 ───────────────────────────────────────────────────────────
export const TRANSACTION_TYPES = ["sale", "jeonse", "monthly"] as const;
export type TransactionType = (typeof TRANSACTION_TYPES)[number];

// ── 요율 테이블 타입 ───────────────────────────────────────────────────
interface RateTier {
  /** 이 구간 최소 거래금액 (원, 이상) */
  minAmount: number;
  /** 상한요율 (소수점, 예: 0.006) */
  rate: number;
  /** 한도액 (원, null = 한도 없음) */
  cap: number | null;
}

// ── 매매·교환 요율 테이블 ─────────────────────────────────────────────
export const SALE_RATE_TIERS: readonly RateTier[] = [
  { minAmount: 0,             rate: 0.006, cap: 250_000 },
  { minAmount: 50_000_000,    rate: 0.005, cap: 800_000 },
  { minAmount: 200_000_000,   rate: 0.004, cap: null },
  { minAmount: 900_000_000,   rate: 0.005, cap: null },
  { minAmount: 1_200_000_000, rate: 0.006, cap: null },
  { minAmount: 1_500_000_000, rate: 0.007, cap: null },
] as const;

// ── 임대차(전세·월세) 요율 테이블 ────────────────────────────────────
export const RENT_RATE_TIERS: readonly RateTier[] = [
  { minAmount: 0,             rate: 0.005, cap: 200_000 },
  { minAmount: 50_000_000,    rate: 0.004, cap: 300_000 },
  { minAmount: 100_000_000,   rate: 0.003, cap: null },
  { minAmount: 600_000_000,   rate: 0.004, cap: null },
  { minAmount: 1_200_000_000, rate: 0.005, cap: null },
  { minAmount: 1_500_000_000, rate: 0.006, cap: null },
] as const;

// ── Zod 스키마 ────────────────────────────────────────────────────────
export const brokerageFeeInputSchema = z
  .object({
    /** 거래유형: 매매(sale) / 전세(jeonse) / 월세(monthly) */
    transactionType: z.enum(TRANSACTION_TYPES).default("sale"),
    /** 매매가 또는 전세 보증금 (원) */
    price: z.number().min(0).max(1e13).default(0),
    /** 월세 보증금 (원) — transactionType === 'monthly' 시에만 사용 */
    monthlyDeposit: z.number().min(0).max(1e13).default(0),
    /** 월세 (원/월) — transactionType === 'monthly' 시에만 사용 */
    monthlyRent: z.number().min(0).max(1e10).default(0),
    /** 부가가치세(10%) 포함 여부 */
    includeVat: z.boolean().default(false),
  });

export type BrokerageFeeInput = z.input<typeof brokerageFeeInputSchema>;
export type BrokerageFeeInputResolved = z.output<typeof brokerageFeeInputSchema>;

// ── 결과 타입 ─────────────────────────────────────────────────────────
export interface BrokerageFeeResult {
  /** 최종 거래금액 (월세 환산 후) */
  transactionAmount: number;
  /** 월세 환산 시 사용된 승수 (70 또는 100, 직거래면 null) */
  monthlyMultiplier: 70 | 100 | null;
  /** 상한요율 (소수점, 예: 0.005) */
  maxRate: number;
  /** 한도액 (원, null = 한도 없음) */
  rateCap: number | null;
  /** 중개보수(VAT 전) */
  feeBeforeVat: number;
  /** 부가가치세 (includeVat=false 면 0) */
  vatAmount: number;
  /** 최종 중개보수 (feeBeforeVat + vatAmount) */
  totalFee: number;
  /** 한도액에 의해 상한이 적용됐는가 */
  cappedByLimit: boolean;
  /** 적용 거래유형 */
  transactionType: TransactionType;
}

// ── 내부 유틸 ─────────────────────────────────────────────────────────

/**
 * 요율 테이블에서 해당 거래금액의 구간을 찾아 RateTier를 반환.
 * 테이블은 오름차순이므로 마지막으로 minAmount <= amount 인 항목을 선택.
 */
function findTier(amount: number, tiers: readonly RateTier[]): RateTier {
  // 테이블은 항상 minAmount=0 인 첫 항목을 가지므로 fallback 은 첫 항목.
  // 단언을 최소화하기 위해 명시적 초기값 처리.
  const first = tiers[0];
  if (!first) {
    throw new Error("요율 테이블이 비어 있습니다.");
  }
  let matched: RateTier = first;
  for (const tier of tiers) {
    if (amount >= tier.minAmount) {
      matched = tier;
    }
  }
  return matched;
}

/**
 * 월세 거래금액 환산.
 * 환산액(보증금 + 월세×100)이 5천만 미만이면 보증금 + 월세×70.
 * 반환: { amount, multiplier }
 */
export function convertMonthlyToAmount(
  deposit: number,
  rent: number,
): { amount: number; multiplier: 70 | 100 } {
  const withHundred = deposit + rent * 100;
  if (withHundred < 50_000_000) {
    return { amount: deposit + rent * 70, multiplier: 70 };
  }
  return { amount: withHundred, multiplier: 100 };
}

// ── 핵심 계산 함수 ────────────────────────────────────────────────────

export function calculateBrokerageFee(
  input: BrokerageFeeInputResolved,
): BrokerageFeeResult {
  const { transactionType, price, monthlyDeposit, monthlyRent, includeVat } =
    input;

  // 1. 거래금액 결정
  let transactionAmount: number;
  let monthlyMultiplier: 70 | 100 | null = null;

  if (transactionType === "monthly") {
    const { amount, multiplier } = convertMonthlyToAmount(
      monthlyDeposit,
      monthlyRent,
    );
    transactionAmount = amount;
    monthlyMultiplier = multiplier;
  } else {
    transactionAmount = price;
  }

  // 2. 요율 구간 선택
  const tiers =
    transactionType === "sale" ? SALE_RATE_TIERS : RENT_RATE_TIERS;
  const tier = findTier(transactionAmount, tiers);

  const maxRate = tier.rate;
  const rateCap = tier.cap;

  // 3. 중개보수 계산 (상한요율 적용 → 한도액 min)
  const rawFee = transactionAmount * maxRate;
  const feeBeforeVat =
    rateCap !== null ? Math.min(rawFee, rateCap) : rawFee;
  const cappedByLimit = rateCap !== null && rawFee > rateCap;

  // 4. 부가가치세
  const vatAmount = includeVat ? Math.round(feeBeforeVat * 0.1) : 0;
  const totalFee = Math.round(feeBeforeVat) + vatAmount;

  return {
    transactionAmount,
    monthlyMultiplier,
    maxRate,
    rateCap,
    feeBeforeVat: Math.round(feeBeforeVat),
    vatAmount,
    totalFee,
    cappedByLimit,
    transactionType,
  };
}
