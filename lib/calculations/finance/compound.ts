/**
 * 복리 계산기 — Compound Interest Calculator
 *
 * 원금 + 추가 적립 + 연이율 + 복리 빈도 + 기간 → 만기 금액·이자·연간 잔액표.
 *
 *   FV_principal = P × (1 + r/n)^(n×t)
 *   FV_pmt       = PMT × ((1+r/n)^(n×t) − 1) / (r/n)   // 매 기간 말 적립 가정
 *   FV_total     = FV_principal + FV_pmt
 *   CAGR         = (FV / 초기투자) ^ (1/t) − 1
 *
 * 한국 적금·예금 관행:
 *   - 은행 적금/예금 = 보통 월복리
 *   - 미국 주식 평균 수익률 = 연복리 가정 (S&P500 historical)
 *   - 한국 정기예금 이자 = 표면이율 vs 실효이율 (복리 빈도에 따라 다름)
 *
 * 출처: 일반 금융 공식 (Investopedia, Bank for International Settlements).
 *      한국 표준 부재 — 국제 관행 차용.
 */

import { z } from "zod";

export const COMPOUND_FREQUENCIES = [1, 4, 12, 365] as const;
export type CompoundFrequency = (typeof COMPOUND_FREQUENCIES)[number];

export const compoundInputSchema = z.object({
  /** 초기 원금 (원) */
  principal: z
    .number()
    .min(0, "validation.principalMin")
    .max(1e12, "validation.principalMax"),
  /** 연이율 (%, 명목금리) */
  annualRatePercent: z
    .number()
    .min(-50, "validation.rateMin")
    .max(100, "validation.rateMax"),
  /** 기간 (년) — 소수점 허용 (예: 1.5년) */
  years: z
    .number()
    .min(0.01, "validation.yearsMin")
    .max(80, "validation.yearsMax"),
  /** 복리 빈도 (1=연1회, 4=분기, 12=월, 365=일) */
  compoundFrequency: z
    .number()
    .refine((v) => COMPOUND_FREQUENCIES.includes(v as CompoundFrequency), {
      message: "validation.frequencyChoice",
    })
    .default(12),
  /** 매 기간 말 정기 적립액 (원) — 0 이면 적금/추가 적립 없음 */
  periodicContribution: z
    .number()
    .min(0, "validation.contribMin")
    .max(1e10, "validation.contribMax")
    .default(0),
});

export type CompoundInput = z.input<typeof compoundInputSchema>;
export type CompoundInputResolved = z.output<typeof compoundInputSchema>;

export interface YearRow {
  /** 1, 2, 3, ... 년차 (연말 기준) */
  year: number;
  /** 연말 잔액 (원금 + 누적 적립 + 누적 이자) */
  balance: number;
  /** 연간 적립 누계 */
  totalContrib: number;
  /** 연간 이자 누계 (잔액 − 원금 − 누적 적립) */
  totalInterest: number;
}

export interface CompoundResult {
  /** 만기 금액 */
  finalAmount: number;
  /** 원금 (변동 없음) */
  principal: number;
  /** 누적 적립 총액 */
  totalContribution: number;
  /** 누적 이자 (만기 금액 − 원금 − 누적 적립) */
  totalInterest: number;
  /** 연복리 환산 (실효이율) — Effective Annual Rate */
  effectiveAnnualRatePercent: number;
  /** CAGR (총 투입 대비 만기 금액의 기하 평균 수익률) */
  cagrPercent: number;
  /** 연도별 잔액 표 */
  yearly: ReadonlyArray<YearRow>;
}

/**
 * 복리 계산.
 *
 *   FV = P(1 + r/n)^(nt) + PMT × ((1+r/n)^(nt) − 1) / (r/n)
 *
 * PMT 는 매 복리 기간 말에 적립한다고 가정 (월복리면 매월 말 적립).
 * r = 0 인 경우 단순 P + PMT × n × t 로 처리 (0으로 나누기 회피).
 */
export function calculateCompound(input: CompoundInputResolved): CompoundResult {
  const P = input.principal;
  const r = input.annualRatePercent / 100;
  const n = input.compoundFrequency;
  const t = input.years;
  const PMT = input.periodicContribution;
  const periods = n * t;

  let finalAmount: number;
  if (r === 0) {
    finalAmount = P + PMT * periods;
  } else {
    const ratePerPeriod = r / n;
    const growth = Math.pow(1 + ratePerPeriod, periods);
    const fvPrincipal = P * growth;
    const fvPMT = PMT === 0 ? 0 : PMT * ((growth - 1) / ratePerPeriod);
    finalAmount = fvPrincipal + fvPMT;
  }

  const totalContribution = PMT * periods;
  const totalInterest = finalAmount - P - totalContribution;

  // EAR (실효 연이율): 명목금리 → 복리 빈도 반영한 연 환산
  const ear = r === 0 ? 0 : Math.pow(1 + r / n, n) - 1;

  // CAGR: 만기금액 / 총투입의 기하 평균 (적립도 포함)
  const totalInvested = P + totalContribution;
  const cagr =
    totalInvested > 0 && t > 0
      ? Math.pow(finalAmount / totalInvested, 1 / t) - 1
      : 0;

  // 연도별 표 (1년 단위 스냅샷)
  const yearly: YearRow[] = [];
  const wholeYears = Math.floor(t);
  for (let y = 1; y <= wholeYears; y++) {
    const periodsAtY = n * y;
    let balance: number;
    if (r === 0) {
      balance = P + PMT * periodsAtY;
    } else {
      const rPer = r / n;
      const grow = Math.pow(1 + rPer, periodsAtY);
      balance = P * grow + (PMT === 0 ? 0 : PMT * ((grow - 1) / rPer));
    }
    const contribAtY = PMT * periodsAtY;
    yearly.push({
      year: y,
      balance,
      totalContrib: contribAtY,
      totalInterest: balance - P - contribAtY,
    });
  }
  // 마지막 행이 정수년이 아니면 만기 시점 행 추가
  if (wholeYears < t) {
    yearly.push({
      year: Number(t.toFixed(2)),
      balance: finalAmount,
      totalContrib: totalContribution,
      totalInterest,
    });
  }

  return {
    finalAmount,
    principal: P,
    totalContribution,
    totalInterest,
    effectiveAnnualRatePercent: ear * 100,
    cagrPercent: cagr * 100,
    yearly,
  };
}
