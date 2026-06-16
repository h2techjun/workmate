/**
 * 전세 ↔ 월세 환산 (전월세전환율).
 *
 *   전세 → 월세:  월세 = (전세보증금 − 전환 후 보증금) × 전환율 ÷ 12
 *   월세 → 전세:  환산 전세금 = 월세보증금 + (월세 × 12) ÷ 전환율
 *
 * 전환율은 "법정 상한"(기준금리+2%, 현재 4.5%)이 아니라 협의 대상이므로 사용자 입력.
 * 법정 상한은 참고로 함께 표시(LEGAL_CONVERSION_RATE).
 *
 * ⚠️ 법적 단서: 전환율 상한은 계약기간 중·갱신 시 "전세→월세 전환"에만 적용되고
 *    신규 계약에는 적용되지 않는다 (UI 경고 필수).
 *
 * 출처: 주택임대차보호법 §7조의2, 한국부동산원 환산 공식.
 */

import { z } from "zod";
import { LEGAL_CONVERSION_RATE } from "@/lib/constants/realestate/jeonseRate";

export const jeonseWolseInputSchema = z
  .object({
    /** 변환 방향 */
    mode: z.enum(["toMonthly", "toDeposit"]).default("toMonthly"),
    /** [toMonthly] 전세보증금 (원) */
    jeonseDeposit: z.number().min(0).max(1e12).default(0),
    /** [toMonthly] 월세 전환 후 남길 보증금 (원) */
    keepDeposit: z.number().min(0).max(1e12).default(0),
    /** [toDeposit] 월세 보증금 (원) */
    monthlyDeposit: z.number().min(0).max(1e12).default(0),
    /** [toDeposit] 월세 (원) */
    monthlyRent: z.number().min(0).max(1e9).default(0),
    /** 전월세전환율 (%, 기본 = 법정 상한) */
    conversionRatePercent: z
      .number()
      .min(0.1, "validation.rateMin")
      .max(20, "validation.rateMax")
      .default(LEGAL_CONVERSION_RATE * 100),
  });

export type JeonseWolseInput = z.input<typeof jeonseWolseInputSchema>;
export type JeonseWolseInputResolved = z.output<typeof jeonseWolseInputSchema>;

export interface JeonseWolseResult {
  mode: "toMonthly" | "toDeposit";
  /** [toMonthly] 산출 월세 (원) */
  monthlyRent: number;
  /** [toMonthly] 월세로 전환된 보증금 (전세보증금 − 남길 보증금) */
  convertedDeposit: number;
  /** [toDeposit] 환산 전세금 (원) */
  jeonseEquivalent: number;
  /** 적용 전환율 (%) */
  appliedRatePercent: number;
  /** 법정 상한 전환율 (%) — 참고 */
  legalCapPercent: number;
  /** 적용 전환율이 법정 상한을 초과하는가 (전환 시 위법 소지) */
  exceedsLegalCap: boolean;
}

export function calculateJeonseWolse(
  input: JeonseWolseInputResolved,
): JeonseWolseResult {
  const rate = input.conversionRatePercent / 100;
  const legalCapPercent = LEGAL_CONVERSION_RATE * 100;

  let monthlyRent = 0;
  let convertedDeposit = 0;
  let jeonseEquivalent = 0;

  if (input.mode === "toMonthly") {
    convertedDeposit = Math.max(input.jeonseDeposit - input.keepDeposit, 0);
    monthlyRent = (convertedDeposit * rate) / 12;
  } else {
    jeonseEquivalent =
      rate > 0
        ? input.monthlyDeposit + (input.monthlyRent * 12) / rate
        : input.monthlyDeposit;
  }

  return {
    mode: input.mode,
    monthlyRent,
    convertedDeposit,
    jeonseEquivalent,
    appliedRatePercent: input.conversionRatePercent,
    legalCapPercent,
    exceedsLegalCap: input.conversionRatePercent > legalCapPercent + 1e-9,
  };
}
