/**
 * 한국 아파트 면적·평당가 분석 — 전용/공급면적 함정 + 평당가.
 *
 * 외국인이 한국 부동산 계약에서 가장 많이 혼동하는 지점:
 *   - 공급면적(supply) = 전용면적 + 주거공용면적 (매물 광고의 "84㎡")
 *   - 전용면적(exclusive) = 실제 거주 공간 (방·거실·주방·화장실)
 *   - 전용률 = 전용 / 공급 (아파트 보통 70~80%, 오피스텔 50~60%)
 *
 * 공급/전용면적(㎡)을 입력하면 평 환산·전용률·평당가(공급·전용 기준)를 산출.
 * 평 환산 계수는 lib/calculations/unit/area.ts 단일 진실원을 재사용.
 *
 * 출처: 1평 = 3600/1089 ㎡ (한국 관습). 면적 정의 = 주택법·부동산 광고 관행.
 */

import { z } from "zod";
import { PYEONG_PER_SQM } from "@/lib/calculations/unit/area";

export const apartmentAreaInputSchema = z.object({
  /** 공급면적 (㎡) — 매물 광고 표기 면적 */
  supplyAreaSqm: z
    .number()
    .min(0, "validation.supplyMin")
    .max(100000, "validation.supplyMax"),
  /** 전용면적 (㎡) — 실제 거주 공간 */
  exclusiveAreaSqm: z
    .number()
    .min(0, "validation.exclusiveMin")
    .max(100000, "validation.exclusiveMax")
    .default(0),
  /** 매매·전세가 (원) — 0 이면 평당가 계산 생략 */
  price: z
    .number()
    .min(0, "validation.priceMin")
    .max(1e13, "validation.priceMax")
    .default(0),
});

export type ApartmentAreaInput = z.input<typeof apartmentAreaInputSchema>;
export type ApartmentAreaInputResolved = z.output<
  typeof apartmentAreaInputSchema
>;

export interface ApartmentAreaResult {
  /** 공급면적 평 환산 */
  supplyPyeong: number;
  /** 전용면적 평 환산 */
  exclusivePyeong: number;
  /** 전용률 (전용/공급, 소수) */
  exclusiveRate: number;
  /** 평당가 — 공급면적 기준 (원/평). 가격 미입력 시 0 */
  pricePerPyeongSupply: number;
  /** 평당가 — 전용면적 기준 (원/평). 가격 미입력 시 0 */
  pricePerPyeongExclusive: number;
}

export function calculateApartmentArea(
  input: ApartmentAreaInputResolved,
): ApartmentAreaResult {
  const supplyPyeong = input.supplyAreaSqm * PYEONG_PER_SQM;
  const exclusivePyeong = input.exclusiveAreaSqm * PYEONG_PER_SQM;
  const exclusiveRate =
    input.supplyAreaSqm > 0 ? input.exclusiveAreaSqm / input.supplyAreaSqm : 0;

  const pricePerPyeongSupply =
    input.price > 0 && supplyPyeong > 0 ? input.price / supplyPyeong : 0;
  const pricePerPyeongExclusive =
    input.price > 0 && exclusivePyeong > 0 ? input.price / exclusivePyeong : 0;

  return {
    supplyPyeong,
    exclusivePyeong,
    exclusiveRate,
    pricePerPyeongSupply,
    pricePerPyeongExclusive,
  };
}
