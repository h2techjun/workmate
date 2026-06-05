/**
 * 자동차 취득세·등록세 + 자동차세(연간) 계산.
 *
 * [취득세] 지방세법. 차량 취득 시 1회.
 *   비영업용 승용차: 취득가액 × 7%
 *   경차(배기량 1000cc 이하): 4% (단 50만원 이하 면제)
 *   영업용/승합/화물: 4~5% (단순화)
 *   전기·수소차: 취득세 최대 140만원 감면
 *   ※ 공채매입은 지역·차량가에 따라 변동 — 본 도구는 미반영(별도 안내).
 *
 * [자동차세] 연간. 배기량 기준 (비영업용 승용).
 *   1000cc 이하: cc당 80원
 *   1600cc 이하: cc당 140원
 *   1600cc 초과: cc당 200원
 *   + 지방교육세 = 자동차세 × 30%
 *   차령 3년차부터 5%씩 경감(최대 50%, 12년차).
 */

import { z } from "zod";

// ─────────── 취득세 ───────────
export const carAcqInputSchema = z.object({
  /** 취득가액 (부가세 제외 과세표준, 원) */
  price: z.number().min(0),
  /** 차종 */
  carType: z.enum(["passenger", "light", "eco", "commercial"]).default("passenger"),
});

export type CarAcqInput = z.input<typeof carAcqInputSchema>;
export type CarAcqInputResolved = z.output<typeof carAcqInputSchema>;

export interface CarAcqResult {
  rate: number;
  acquisitionTax: number;
  ecoDiscount: number;
  total: number;
}

export function calculateCarAcquisitionTax(
  input: CarAcqInputResolved,
): CarAcqResult {
  const { price, carType } = input;
  let rate: number;
  switch (carType) {
    case "light":
      rate = 0.04;
      break;
    case "commercial":
      rate = 0.05;
      break;
    case "eco":
      rate = 0.07; // 승용 기준 후 감면
      break;
    default:
      rate = 0.07;
  }
  let tax = Math.floor(price * rate);
  // 경차 50만원 이하 면제
  if (carType === "light" && tax <= 500_000) tax = 0;
  // 친환경차 최대 140만 감면
  const ecoDiscount = carType === "eco" ? Math.min(1_400_000, tax) : 0;
  const total = Math.max(0, tax - ecoDiscount);
  return { rate, acquisitionTax: tax, ecoDiscount, total };
}

// ─────────── 자동차세 (연간) ───────────
export const carAnnualInputSchema = z.object({
  /** 배기량 (cc) */
  displacement: z.number().min(0).max(10000),
  /** 차령 (년) */
  carAge: z.number().int().min(0).max(30).default(0),
  /** 전기차 여부 (정액) */
  isElectric: z.boolean().default(false),
});

export type CarAnnualInput = z.input<typeof carAnnualInputSchema>;
export type CarAnnualInputResolved = z.output<typeof carAnnualInputSchema>;

export interface CarAnnualResult {
  baseTax: number; // 자동차세 (경감 전)
  ageDiscountRate: number; // 차령 경감율
  carTax: number; // 경감 후 자동차세
  eduTax: number; // 지방교육세 30%
  total: number; // 연간 총액
  halfYear: number; // 반기 납부액 (6월·12월)
}

/** cc당 단가 (비영업용 승용) */
function ccRate(cc: number): number {
  if (cc <= 1000) return 80;
  if (cc <= 1600) return 140;
  return 200;
}

export function calculateCarAnnualTax(
  input: CarAnnualInputResolved,
): CarAnnualResult {
  const { displacement, carAge, isElectric } = input;

  // 전기차는 정액 13만원 (비영업용 승용)
  const baseTax = isElectric ? 130_000 : Math.floor(displacement * ccRate(displacement));

  // 차령 경감: 3년차부터 매년 5%, 최대 50%
  const ageDiscountRate = carAge >= 3 ? Math.min(0.5, (carAge - 2) * 0.05) : 0;
  const carTax = Math.floor((baseTax * (1 - ageDiscountRate)) / 10) * 10;
  const eduTax = Math.floor((carTax * 0.3) / 10) * 10;
  const total = carTax + eduTax;

  return {
    baseTax,
    ageDiscountRate,
    carTax,
    eduTax,
    total,
    halfYear: Math.floor(total / 2 / 10) * 10,
  };
}
