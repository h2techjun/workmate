/**
 * 프리랜서 3.3% 원천징수 계산 — 사업소득 원천세.
 *
 * 한국에서 프리랜서·인적용역 사업소득은 지급 시 3.3%를 원천징수한다.
 *   소득세 3% + 지방소득세 0.3% = 3.3%
 *
 * 지급액(세전)에서 3.3%를 떼고 실수령. 다음해 5월 종합소득세 신고로 정산.
 * 본 도구는 세전↔세후 양방향 + 연 환산 + 예상 종소세 안내.
 */

import { z } from "zod";

export const freelancerInputSchema = z.object({
  /** 입력 금액 */
  amount: z.number().min(0),
  /** 입력 기준: gross(세전 지급액) 또는 net(실수령) */
  basis: z.enum(["gross", "net"]).default("gross"),
});

export type FreelancerInput = z.input<typeof freelancerInputSchema>;
export type FreelancerInputResolved = z.output<typeof freelancerInputSchema>;

const INCOME_TAX_RATE = 0.03; // 소득세 3%
const LOCAL_TAX_RATE = 0.003; // 지방소득세 0.3%
const TOTAL_RATE = 0.033;

export interface FreelancerResult {
  gross: number; // 세전 지급액
  incomeTax: number; // 소득세 (3%)
  localTax: number; // 지방소득세 (0.3%)
  totalWithholding: number; // 원천징수 합계 (3.3%)
  net: number; // 실수령액
  /** 연 환산 (월 지급 가정) */
  annualGross: number;
  annualWithholding: number;
}

export function calculateFreelancerTax(
  input: FreelancerInputResolved,
): FreelancerResult {
  const { amount, basis } = input;

  // 세전 지급액 산정
  const gross = basis === "gross" ? amount : amount / (1 - TOTAL_RATE);

  const incomeTax = Math.floor(gross * INCOME_TAX_RATE);
  const localTax = Math.floor(gross * LOCAL_TAX_RATE);
  const totalWithholding = incomeTax + localTax;
  const net = gross - totalWithholding;

  return {
    gross: Math.round(gross),
    incomeTax,
    localTax,
    totalWithholding,
    net: Math.round(net),
    annualGross: Math.round(gross * 12),
    annualWithholding: Math.round(totalWithholding * 12),
  };
}
