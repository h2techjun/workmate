/**
 * 해외송금 총비용 추정 — 순수 함수.
 *
 * 송금의 진짜 비용은 눈에 보이는 "수수료"만이 아니라, 숨은 "환율 마진(스프레드)"을
 * 더한 값이다. 이 함수는 그 둘을 합쳐 실질 비용과 실질 비용률을 보여준다.
 *
 *   환율 마진 비용 = 송금액 × 마진율
 *   총비용        = 환율 마진 비용 + 고정 수수료
 *   실질 비용률   = 총비용 ÷ 송금액
 *   실수령 상당액 = 송금액 − 총비용  (원화 가치 기준)
 *
 * ⚠️ 실시간 환율·특정 업체 요율은 다루지 않는다. 결과는 사용자가 입력한 마진·수수료
 *    가정에 따른 추정이며, 규정(연간 한도·신고 의무)은 ToolGuide 및 공식 출처를 확인.
 */

import { z } from "zod";

export const remittanceInputSchema = z.object({
  /** 송금액 (원) */
  sendAmount: z.number().min(0).max(1e12).default(0),
  /** 환율 마진(스프레드) (%) */
  fxMarginPercent: z.number().min(0).max(20).default(0),
  /** 건당 고정 수수료 (원) */
  fixedFee: z.number().min(0).max(1e8).default(0),
});

export type RemittanceInput = z.input<typeof remittanceInputSchema>;
export type RemittanceInputResolved = z.output<typeof remittanceInputSchema>;

export interface RemittanceResult {
  valid: boolean;
  /** 환율 마진 비용 (원) */
  fxCost: number;
  /** 고정 수수료 (원) */
  fixedFee: number;
  /** 총비용 (원) = 환율 마진 + 고정 수수료 */
  totalCost: number;
  /** 실질 비용률 (%) */
  effectiveCostPercent: number;
  /** 실수령 상당액 (원) = 송금액 − 총비용 */
  amountAfterCost: number;
}

export function calculateRemittance(
  input: RemittanceInputResolved,
): RemittanceResult {
  const { sendAmount, fxMarginPercent, fixedFee } = input;

  if (sendAmount <= 0) {
    return {
      valid: false,
      fxCost: 0,
      fixedFee,
      totalCost: 0,
      effectiveCostPercent: 0,
      amountAfterCost: 0,
    };
  }

  const fxCost = sendAmount * (fxMarginPercent / 100);
  const totalCost = fxCost + fixedFee;
  const effectiveCostPercent = (totalCost / sendAmount) * 100;
  const amountAfterCost = Math.max(0, sendAmount - totalCost);

  return {
    valid: true,
    fxCost,
    fixedFee,
    totalCost,
    effectiveCostPercent,
    amountAfterCost,
  };
}
