/**
 * 해외주식 양도세 계산기 (Foreign Stock Capital Gains Tax)
 *
 * 한국 거주자가 해외주식을 매도할 때 양도세 산출.
 * 2026년 기준:
 *   - 양도세율: 22% (소득세 20% + 지방소득세 2%)
 *   - 기본공제: 연간 250만원
 *   - 환율 적용: 매수일·매도일 기준환율 (한국은행 고시)
 *   - 손실 통산: 같은 해 손익 통산 가능 (본 도구는 단일 거래만)
 *
 * 계산 흐름:
 *   매수가_KRW = 매수가_외화 × 매수환율
 *   매도가_KRW = 매도가_외화 × 매도환율
 *   양도차익 = 매도가_KRW - 매수가_KRW - 거래비용
 *   과세표준 = max(0, 양도차익 - 기본공제)
 *   양도세 = 과세표준 × 22%
 */

import { z } from "zod";

const FOREIGN_STOCK_TAX_RATE = 0.22; // 22% (소득세 20 + 지방세 2)
const ANNUAL_DEDUCTION_KRW = 2_500_000; // 250만원

export const foreignStockTaxInputSchema = z.object({
  buyPriceForeign: z
    .number()
    .nonnegative("validation.buyPricePositive"),
  buyExchangeRate: z
    .number()
    .positive("validation.exchangeRatePositive"),
  sellPriceForeign: z
    .number()
    .nonnegative("validation.sellPricePositive"),
  sellExchangeRate: z
    .number()
    .positive("validation.exchangeRatePositive"),
  /** 매수·매도 거래비용 합계 (KRW) — 수수료, 세금 제외 */
  transactionCostKrw: z
    .number()
    .nonnegative("validation.costNonNegative")
    .default(0),
  /** 연간 누적 기본공제 사용액 (KRW). 미사용시 0. 250만원에서 차감되어 잔여공제만 적용. */
  prevDeductionUsed: z
    .number()
    .nonnegative("validation.deductionNonNegative")
    .max(ANNUAL_DEDUCTION_KRW)
    .default(0),
});

export type ForeignStockTaxInput = z.input<typeof foreignStockTaxInputSchema>;
export type ForeignStockTaxInputResolved = z.output<
  typeof foreignStockTaxInputSchema
>;

export type ForeignStockTaxStep =
  | { key: "buyKrw"; foreign: number; rate: number; result: number }
  | { key: "sellKrw"; foreign: number; rate: number; result: number }
  | {
      key: "gain";
      sell: number;
      buy: number;
      cost: number;
      result: number;
    }
  | {
      key: "deduction";
      annual: number;
      used: number;
      remaining: number;
    }
  | {
      key: "taxableBase";
      gain: number;
      deduction: number;
      result: number;
    }
  | {
      key: "tax";
      base: number;
      rate: number;
      result: number;
    }
  | {
      key: "netProfit";
      gain: number;
      tax: number;
      result: number;
    };

export interface ForeignStockTaxResult {
  buyPriceKrw: number;
  sellPriceKrw: number;
  capitalGainKrw: number;
  remainingDeductionKrw: number;
  taxableBaseKrw: number;
  taxKrw: number;
  netProfitKrw: number;
  isLoss: boolean;
  calculationSteps: ForeignStockTaxStep[];
}

export function calculateForeignStockTax(
  rawInput: ForeignStockTaxInput,
): ForeignStockTaxResult {
  const input = foreignStockTaxInputSchema.parse(rawInput);
  const {
    buyPriceForeign,
    buyExchangeRate,
    sellPriceForeign,
    sellExchangeRate,
    transactionCostKrw,
    prevDeductionUsed,
  } = input;

  const buyKrw = buyPriceForeign * buyExchangeRate;
  const sellKrw = sellPriceForeign * sellExchangeRate;
  const gain = sellKrw - buyKrw - transactionCostKrw;
  const isLoss = gain < 0;

  const remainingDeduction = Math.max(
    0,
    ANNUAL_DEDUCTION_KRW - prevDeductionUsed,
  );
  const taxableBase = Math.max(0, gain - remainingDeduction);
  const tax = Math.floor(taxableBase * FOREIGN_STOCK_TAX_RATE);
  const netProfit = gain - tax;

  const steps: ForeignStockTaxStep[] = [
    {
      key: "buyKrw",
      foreign: buyPriceForeign,
      rate: buyExchangeRate,
      result: buyKrw,
    },
    {
      key: "sellKrw",
      foreign: sellPriceForeign,
      rate: sellExchangeRate,
      result: sellKrw,
    },
    {
      key: "gain",
      sell: sellKrw,
      buy: buyKrw,
      cost: transactionCostKrw,
      result: gain,
    },
    {
      key: "deduction",
      annual: ANNUAL_DEDUCTION_KRW,
      used: prevDeductionUsed,
      remaining: remainingDeduction,
    },
    {
      key: "taxableBase",
      gain,
      deduction: remainingDeduction,
      result: taxableBase,
    },
    {
      key: "tax",
      base: taxableBase,
      rate: FOREIGN_STOCK_TAX_RATE,
      result: tax,
    },
    {
      key: "netProfit",
      gain,
      tax,
      result: netProfit,
    },
  ];

  return {
    buyPriceKrw: buyKrw,
    sellPriceKrw: sellKrw,
    capitalGainKrw: gain,
    remainingDeductionKrw: remainingDeduction,
    taxableBaseKrw: taxableBase,
    taxKrw: tax,
    netProfitKrw: netProfit,
    isLoss,
    calculationSteps: steps,
  };
}
