/**
 * 주택용 전기요금 계산 — 누진제 3단계 (한국전력 2024 기준).
 *
 * 주택용 저압/고압 누진제:
 *   1단계 (0~200kWh)   : 저압 기본 910원 / 전력량 120.0원, 고압 기본 730원 / 105.0원
 *   2단계 (201~400kWh) : 저압 기본 1,600원 / 214.6원,      고압 기본 1,260원 / 174.0원
 *   3단계 (400kWh 초과): 저압 기본 7,300원 / 307.3원,      고압 기본 6,060원 / 242.3원
 *
 * 여름철 (7.1~8.31) 완화 구간: 1단계 300kWh, 2단계 450kWh 로 확대.
 *
 * 추가 요금:
 *   기후환경요금 = 9.0원/kWh (2024)
 *   연료비조정요금 = +5.0원/kWh (2024 4분기 기준, 분기별 변동)
 *   부가가치세 = 전기요금계 × 10%
 *   전력산업기반기금 = 전기요금계 × 3.7%
 *   청구금액 = (전기요금계 + 부가세 + 기금), 10원 미만 절사
 *
 * 출처: 한국전력공사 전기공급약관 별표 (주택용 전력).
 */

import { z } from "zod";

export const VoltageType = ["low", "high"] as const;
export type Voltage = (typeof VoltageType)[number];

export const electricBillInputSchema = z.object({
  /** 월 사용량 (kWh) */
  usageKwh: z.number().min(0).max(100000),
  /** 저압(아파트 외 단독·다세대 다수) / 고압(대단지 아파트) */
  voltage: z.enum(["low", "high"]).default("low"),
  /** 여름철(7~8월) 완화 구간 적용 */
  isSummer: z.boolean().default(false),
  /** 기후환경요금 단가 (원/kWh) */
  climateRate: z.number().min(0).default(9.0),
  /** 연료비조정 단가 (원/kWh, 음수 가능) */
  fuelAdjustRate: z.number().default(5.0),
});

export type ElectricBillInput = z.input<typeof electricBillInputSchema>;
export type ElectricBillInputResolved = z.output<typeof electricBillInputSchema>;

interface TierDef {
  /** 구간 상한 (kWh). null = 무제한 */
  upto: number | null;
  baseLow: number;
  rateLow: number;
  baseHigh: number;
  rateHigh: number;
}

// 평상시 구간
const TIERS_NORMAL: ReadonlyArray<TierDef> = [
  { upto: 200, baseLow: 910, rateLow: 120.0, baseHigh: 730, rateHigh: 105.0 },
  { upto: 400, baseLow: 1600, rateLow: 214.6, baseHigh: 1260, rateHigh: 174.0 },
  { upto: null, baseLow: 7300, rateLow: 307.3, baseHigh: 6060, rateHigh: 242.3 },
];

// 여름철(7~8월) 완화 구간: 200→300, 400→450
const TIERS_SUMMER: ReadonlyArray<TierDef> = [
  { upto: 300, baseLow: 910, rateLow: 120.0, baseHigh: 730, rateHigh: 105.0 },
  { upto: 450, baseLow: 1600, rateLow: 214.6, baseHigh: 1260, rateHigh: 174.0 },
  { upto: null, baseLow: 7300, rateLow: 307.3, baseHigh: 6060, rateHigh: 242.3 },
];

export interface ElectricBillTierBreakdown {
  tier: number;
  /** 이 구간에서 사용한 kWh */
  kwh: number;
  /** 적용 단가 (원/kWh) */
  rate: number;
  /** 이 구간 전력량요금 */
  amount: number;
}

export interface ElectricBillResult {
  /** 적용된 최고 누진 단계 (기본요금 = 최고 단계 기본요금) */
  appliedTier: number;
  baseFee: number;
  /** 전력량요금 합계 */
  energyFee: number;
  /** 구간별 분해 */
  tierBreakdown: ElectricBillTierBreakdown[];
  climateFee: number;
  fuelAdjustFee: number;
  /** 전기요금계 = 기본 + 전력량 + 기후 + 연료조정 */
  subtotal: number;
  vat: number;
  powerFund: number;
  /** 최종 청구금액 (10원 미만 절사) */
  total: number;
  /** 평균 단가 (총액/사용량) */
  avgRate: number;
}

export function calculateElectricBill(
  input: ElectricBillInputResolved,
): ElectricBillResult {
  const { usageKwh, voltage, isSummer, climateRate, fuelAdjustRate } = input;
  const tiers = isSummer ? TIERS_SUMMER : TIERS_NORMAL;
  const isLow = voltage === "low";

  let remaining = usageKwh;
  let prevUpper = 0;
  let energyFee = 0;
  let appliedTier = 1;
  let baseFee = isLow ? tiers[0]!.baseLow : tiers[0]!.baseHigh;
  const tierBreakdown: ElectricBillTierBreakdown[] = [];

  for (let i = 0; i < tiers.length; i++) {
    const tier = tiers[i]!;
    const upper = tier.upto ?? Infinity;
    const span = upper - prevUpper;
    const used = Math.min(remaining, span);
    if (used <= 0) break;

    const rate = isLow ? tier.rateLow : tier.rateHigh;
    const amount = used * rate;
    energyFee += amount;
    tierBreakdown.push({ tier: i + 1, kwh: used, rate, amount });
    appliedTier = i + 1;
    baseFee = isLow ? tier.baseLow : tier.baseHigh;

    remaining -= used;
    prevUpper = upper;
    if (remaining <= 0) break;
  }

  const climateFee = usageKwh * climateRate;
  const fuelAdjustFee = usageKwh * fuelAdjustRate;

  // 전기요금계 (원 단위 반올림)
  const subtotalRaw = baseFee + energyFee + climateFee + fuelAdjustFee;
  const subtotal = Math.round(subtotalRaw);

  const vat = Math.round(subtotal * 0.1);
  const powerFund = Math.floor((subtotal * 0.037) / 10) * 10; // 기금은 10원 미만 절사

  // 청구금액 10원 미만 절사
  const total = Math.floor((subtotal + vat + powerFund) / 10) * 10;
  const avgRate = usageKwh > 0 ? total / usageKwh : 0;

  return {
    appliedTier,
    baseFee,
    energyFee: Math.round(energyFee),
    tierBreakdown,
    climateFee: Math.round(climateFee),
    fuelAdjustFee: Math.round(fuelAdjustFee),
    subtotal,
    vat,
    powerFund,
    total,
    avgRate,
  };
}
