/**
 * 한국 종합소득세 8구간 누진세 계산 (2026년 기준).
 *
 * 종합소득 = 근로 + 사업 + 이자 + 배당 + 기타 (분리과세·연금 일부 제외).
 * 본 계산기는 "과세표준 → 산출세액 → 결정세액" 까지 산출.
 * 세액공제(자녀·연금저축·의료비 등) 는 사용자가 직접 차감.
 *
 * 누진세율 (소득세법 §55, 2023 개정):
 *  ~ 1,400만 이하      6%
 *  ~ 5,000만 이하     15%
 *  ~ 8,800만 이하     24%
 *  ~ 1.5억 이하       35%
 *  ~ 3억 이하         38%
 *  ~ 5억 이하         40%
 *  ~ 10억 이하        42%
 *   10억 초과         45%
 *
 * 누진공제는 각 구간의 시작점 × (상위 세율 - 하위 세율 누계). 동일 공식 변형.
 *
 * 추가:
 *  - 지방소득세 = 소득세의 10% (별도 신고지만 자동 산출)
 *  - 근로소득세액공제 (선택적)
 */

import { z } from "zod";

export const incomeTaxInputSchema = z.object({
  /** 종합소득 과세표준 (원) — 종합소득금액 - 종합소득공제 결과값 */
  taxableIncome: z.number().min(0).default(0),
  /** 근로소득세액공제 적용 여부 (근로소득자에 한함) */
  applyWageEarnerCredit: z.boolean().default(false),
});

export type IncomeTaxInput = z.input<typeof incomeTaxInputSchema>;
export type IncomeTaxInputResolved = z.output<typeof incomeTaxInputSchema>;

export interface TaxBracket {
  /** 구간 상한 (원). null = 무한대 (10억 초과) */
  upper: number | null;
  /** 세율 (소수, 0.06 = 6%) */
  rate: number;
  /** 누진공제 (원) */
  deduction: number;
}

export const BRACKETS_2026: ReadonlyArray<TaxBracket> = [
  { upper: 14_000_000, rate: 0.06, deduction: 0 },
  { upper: 50_000_000, rate: 0.15, deduction: 1_260_000 },
  { upper: 88_000_000, rate: 0.24, deduction: 5_760_000 },
  { upper: 150_000_000, rate: 0.35, deduction: 15_440_000 },
  { upper: 300_000_000, rate: 0.38, deduction: 19_940_000 },
  { upper: 500_000_000, rate: 0.40, deduction: 25_940_000 },
  { upper: 1_000_000_000, rate: 0.42, deduction: 35_940_000 },
  { upper: null, rate: 0.45, deduction: 65_940_000 },
];

export interface IncomeTaxResult {
  /** 과세표준 */
  taxableIncome: number;
  /** 적용 한계세율 (소수) */
  marginalRate: number;
  /** 적용 누진공제 */
  appliedDeduction: number;
  /** 산출세액 (소득세, 원) */
  calculatedTax: number;
  /** 근로소득세액공제 (선택) */
  wageEarnerCredit: number;
  /** 결정세액 (산출 - 공제) */
  finalTax: number;
  /** 지방소득세 (소득세의 10%) */
  localIncomeTax: number;
  /** 총 세부담 (결정세액 + 지방세) */
  totalTax: number;
  /** 실효세율 = 총 세부담 / 과세표준 */
  effectiveRate: number;
  /** 적용 구간 (디버깅·UI 표시용) */
  bracket: TaxBracket;
}

/** 근로소득세액공제 (소득세법 §59) — 산출세액 130만 이하 55%, 초과분 30%, 최대 한도 차등 */
function calculateWageEarnerCredit(
  calculatedTax: number,
  taxableIncome: number,
): number {
  // 산출세액 130만원 이하 → 55%, 초과 → 30% 가산
  const baseCredit =
    calculatedTax <= 1_300_000
      ? calculatedTax * 0.55
      : 1_300_000 * 0.55 + (calculatedTax - 1_300_000) * 0.3;

  // 총급여(=과세표준 근사치) 구간별 한도
  let maxCredit: number;
  if (taxableIncome <= 33_000_000) {
    maxCredit = 740_000;
  } else if (taxableIncome <= 70_000_000) {
    maxCredit = Math.max(660_000, 740_000 - (taxableIncome - 33_000_000) * 0.008);
  } else if (taxableIncome <= 120_000_000) {
    maxCredit = Math.max(500_000, 660_000 - (taxableIncome - 70_000_000) * 0.5 / 100);
  } else {
    maxCredit = Math.max(200_000, 500_000 - (taxableIncome - 120_000_000) * 0.5 / 100);
  }

  return Math.min(baseCredit, maxCredit);
}

export function calculateIncomeTax(
  input: IncomeTaxInputResolved,
): IncomeTaxResult {
  const { taxableIncome, applyWageEarnerCredit } = input;

  const bracket =
    BRACKETS_2026.find((b) => b.upper === null || taxableIncome <= b.upper) ??
    BRACKETS_2026[BRACKETS_2026.length - 1]!;

  const calculatedTax = Math.max(
    0,
    taxableIncome * bracket.rate - bracket.deduction,
  );

  const wageEarnerCredit = applyWageEarnerCredit
    ? calculateWageEarnerCredit(calculatedTax, taxableIncome)
    : 0;

  const finalTax = Math.max(0, calculatedTax - wageEarnerCredit);
  const localIncomeTax = Math.floor(finalTax * 0.1);
  const totalTax = finalTax + localIncomeTax;
  const effectiveRate = taxableIncome > 0 ? totalTax / taxableIncome : 0;

  return {
    taxableIncome,
    marginalRate: bracket.rate,
    appliedDeduction: bracket.deduction,
    calculatedTax,
    wageEarnerCredit,
    finalTax,
    localIncomeTax,
    totalTax,
    effectiveRate,
    bracket,
  };
}
