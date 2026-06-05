/**
 * 부동산 양도소득세 계산 — 소득세법 §94~§104 (2024 기준).
 *
 * 흐름:
 *   양도차익 = 양도가액 − 취득가액 − 필요경비
 *   장기보유특별공제 = 양도차익 × 공제율(보유기간별)
 *   양도소득금액 = 양도차익 − 장기보유특별공제
 *   과세표준 = 양도소득금액 − 기본공제 250만원
 *   산출세액 = 과세표준 × 누진세율 − 누진공제 (보유 1년 미만 등 단기는 단일세율)
 *   지방소득세 = 산출세액 × 10%
 *
 * 장기보유특별공제율:
 *   일반(토지·건물): 3년 6%, 이후 1년당 +2%, 15년 이상 30% 한도.
 *   1세대1주택(2년 거주): 보유 1년당 4% + 거주 1년당 4%, 최대 80% (10년).
 *
 * 단기 양도 세율(주택·조합원입주권):
 *   1년 미만 70%, 2년 미만 60%.  토지·건물 1년 미만 50%, 2년 미만 40%.
 *
 * ※ 1세대1주택 12억 이하 비과세, 다주택 중과 등 특례는 단순화/옵션 처리.
 */

import { z } from "zod";

export const capitalGainsInputSchema = z.object({
  /** 양도가액 (판매가, 원) */
  salePrice: z.number().min(0),
  /** 취득가액 (매입가, 원) */
  purchasePrice: z.number().min(0),
  /** 필요경비 (취득세·중개수수료·자본적지출, 원) */
  expenses: z.number().min(0).default(0),
  /** 보유기간 (년, 소수 허용) */
  holdingYears: z.number().min(0).default(0),
  /** 거주기간 (년) — 1세대1주택 장특공제용 */
  residingYears: z.number().min(0).default(0),
  /** 자산 종류 */
  assetType: z.enum(["house", "land"]).default("house"),
  /** 1세대1주택 여부 (장특공제 우대표 적용) */
  isOneHouse: z.boolean().default(false),
});

export type CapitalGainsInput = z.input<typeof capitalGainsInputSchema>;
export type CapitalGainsInputResolved = z.output<typeof capitalGainsInputSchema>;

interface Bracket {
  upper: number | null;
  rate: number;
  deduction: number;
}

// 종합소득세와 동일한 8구간 누진 (장기 양도)
const BRACKETS: ReadonlyArray<Bracket> = [
  { upper: 14_000_000, rate: 0.06, deduction: 0 },
  { upper: 50_000_000, rate: 0.15, deduction: 1_260_000 },
  { upper: 88_000_000, rate: 0.24, deduction: 5_760_000 },
  { upper: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { upper: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { upper: 500_000_000, rate: 0.4, deduction: 25_940_000 },
  { upper: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { upper: null, rate: 0.45, deduction: 65_940_000 },
];

const BASIC_DEDUCTION = 2_500_000; // 양도소득 기본공제 (연 1회)

export interface CapitalGainsResult {
  gain: number; // 양도차익
  longTermDeduction: number; // 장기보유특별공제
  longTermRate: number; // 적용 공제율
  taxableIncome: number; // 양도소득금액 (장특공제 후)
  taxBase: number; // 과세표준 (기본공제 후)
  marginalRate: number; // 한계세율 (또는 단기 단일세율)
  isShortTerm: boolean;
  calculatedTax: number; // 산출세액
  localTax: number; // 지방소득세
  totalTax: number; // 총 세부담
  netProceeds: number; // 세후 실수령 (양도차익 − 총세금)
  effectiveRate: number; // 양도차익 대비 실효세율
}

/** 장기보유특별공제율 (소수) */
function longTermRate(input: CapitalGainsInputResolved): number {
  const { holdingYears, residingYears, isOneHouse, assetType } = input;
  if (holdingYears < 3) return 0;

  if (isOneHouse && assetType === "house") {
    // 1세대1주택: 보유 4%/년 + 거주 4%/년, 각 최대 40%, 합 80%
    const holdRate = Math.min(0.4, Math.floor(holdingYears) * 0.04);
    const liveRate = Math.min(0.4, Math.floor(residingYears) * 0.04);
    return Math.min(0.8, holdRate + liveRate);
  }
  // 일반: 3년 6%, 이후 1년당 +2%, 15년 30% 한도
  const years = Math.floor(holdingYears);
  return Math.min(0.3, 0.06 + (years - 3) * 0.02);
}

/** 단기 양도 단일세율 (해당 없으면 null) */
function shortTermRate(input: CapitalGainsInputResolved): number | null {
  const { holdingYears, assetType } = input;
  if (assetType === "house") {
    if (holdingYears < 1) return 0.7;
    if (holdingYears < 2) return 0.6;
  } else {
    if (holdingYears < 1) return 0.5;
    if (holdingYears < 2) return 0.4;
  }
  return null;
}

export function calculateCapitalGainsTax(
  input: CapitalGainsInputResolved,
): CapitalGainsResult {
  const { salePrice, purchasePrice, expenses } = input;

  const gain = Math.max(0, salePrice - purchasePrice - expenses);

  const ltRate = longTermRate(input);
  const longTermDeduction = Math.round(gain * ltRate);
  const taxableIncome = gain - longTermDeduction;
  const taxBase = Math.max(0, taxableIncome - BASIC_DEDUCTION);

  const shortRate = shortTermRate(input);
  const isShortTerm = shortRate !== null;

  let calculatedTax: number;
  let marginalRate: number;
  if (isShortTerm) {
    // 단기는 장특공제 미적용 (보유 3년 미만이라 어차피 0). 단일세율.
    marginalRate = shortRate!;
    calculatedTax = Math.round(taxBase * shortRate!);
  } else {
    const bracket =
      BRACKETS.find((b) => b.upper === null || taxBase <= b.upper) ??
      BRACKETS[BRACKETS.length - 1]!;
    marginalRate = bracket.rate;
    calculatedTax = Math.max(
      0,
      Math.round(taxBase * bracket.rate - bracket.deduction),
    );
  }

  const localTax = Math.floor((calculatedTax * 0.1) / 10) * 10;
  const totalTax = calculatedTax + localTax;
  const netProceeds = gain - totalTax;
  const effectiveRate = gain > 0 ? totalTax / gain : 0;

  return {
    gain,
    longTermDeduction,
    longTermRate: ltRate,
    taxableIncome,
    taxBase,
    marginalRate,
    isShortTerm,
    calculatedTax,
    localTax,
    totalTax,
    netProceeds,
    effectiveRate,
  };
}
