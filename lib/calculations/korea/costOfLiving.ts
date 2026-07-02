/**
 * 한국 월 생활비 추정 — 순수 함수.
 *
 * 계산 자체는 "사용자가 통제하는 항목들의 합"이다(투명성 = 정직성). 지역·가구는
 * 편집 가능한 기본값(prefill)을 제공할 뿐, 최종 합계는 화면에 입력된 값의 총합이다.
 * 1인당 월 비용과 연간 환산도 함께 제공한다.
 *
 * ⚠️ 결과는 추정치다. USD 환산은 환율 변동으로 오해를 낳을 수 있어 제공하지 않는다
 *    (원화 기준만 표시). 상세 근거는 constants/korea/costOfLiving.ts 참조.
 */

import { z } from "zod";
import {
  HOUSEHOLD_SIZE,
  type Household,
} from "@/lib/constants/korea/costOfLiving";

export const costOfLivingInputSchema = z.object({
  household: z
    .enum(["single", "couple", "family"])
    .default("single"),
  rent: z.number().min(0).max(1e9).default(0),
  utilities: z.number().min(0).max(1e9).default(0),
  food: z.number().min(0).max(1e9).default(0),
  transport: z.number().min(0).max(1e9).default(0),
  mobile: z.number().min(0).max(1e9).default(0),
  healthInsurance: z.number().min(0).max(1e9).default(0),
  other: z.number().min(0).max(1e9).default(0),
});

export type CostOfLivingInput = z.input<typeof costOfLivingInputSchema>;
export type CostOfLivingInputResolved = z.output<
  typeof costOfLivingInputSchema
>;

export interface CostOfLivingResult {
  /** 월 합계 (원) */
  monthlyTotal: number;
  /** 연간 합계 (원) = 월 × 12 */
  annualTotal: number;
  /** 1인당 월 비용 (원) */
  perPersonMonthly: number;
  /** 가구 인원 */
  householdSize: number;
}

export function calculateCostOfLiving(
  input: CostOfLivingInputResolved,
): CostOfLivingResult {
  const household: Household = input.household;
  const monthlyTotal =
    input.rent +
    input.utilities +
    input.food +
    input.transport +
    input.mobile +
    input.healthInsurance +
    input.other;

  const householdSize = HOUSEHOLD_SIZE[household];

  return {
    monthlyTotal,
    annualTotal: monthlyTotal * 12,
    perPersonMonthly: householdSize > 0 ? monthlyTotal / householdSize : monthlyTotal,
    householdSize,
  };
}
