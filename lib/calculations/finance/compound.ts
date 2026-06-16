/**
 * 복리 계산기 — Compound Interest Calculator
 *
 * 두 가지 모드:
 *  1) 기본(lump-sum): 회당 이율 i + 복리 횟수 n. FV = P(1+i)^n.
 *  2) 적립식(recurring): 시작금액 + 매월 적립 + 기간(년/개월) + 이율(년/월) + 연/월복리.
 *
 * 적립식 연복리 모델 = 한국 적금 방식: 매월 초 적립금은 연 이율 × (남은 개월/12)
 * 만큼의 단리 이자를 그 해에 받고, 매년 말에 자본화(복리)된다. 월복리는 매월 자본화.
 *
 * 출처: 일반 복리 공식 (Investopedia) + 한국 적금 이자 계산 관행.
 * 이자소득세(15.4%)·인플레이션 미반영 (세전 명목).
 */

import { z } from "zod";

/* ===========================================================================
 * 기본 모드 (회당 이율 + 횟수)
 * =========================================================================== */

export const compoundInputSchema = z.object({
  /** 초기 원금 (원) */
  principal: z
    .number()
    .min(0, "validation.principalMin")
    .max(1e12, "validation.principalMax"),
  /** 회당 이율 (%, 한 번 복리될 때 적용되는 이율) */
  ratePerPeriodPercent: z
    .number()
    .min(-50, "validation.rateMin")
    .max(100, "validation.rateMax"),
  /** 복리 횟수 (회) — 복리가 적용되는 총 횟수 */
  periods: z
    .number()
    .int("validation.periodsInt")
    .min(1, "validation.periodsMin")
    .max(2400, "validation.periodsMax"),
  /** 매 회 말 정기 적립액 (원) — 0 이면 추가 적립 없음 */
  periodicContribution: z
    .number()
    .min(0, "validation.contribMin")
    .max(1e10, "validation.contribMax")
    .default(0),
});

export type CompoundInput = z.input<typeof compoundInputSchema>;
export type CompoundInputResolved = z.output<typeof compoundInputSchema>;

/** 회차별 상세 한 줄 */
export interface CompoundScheduleRow {
  /** 회차 (1부터) */
  period: number;
  /** 이번 회차에 발생한 이자 */
  interest: number;
  /** 회차 말 누적 총액 */
  total: number;
  /** 누적 수익률 (%) — 총액 / 총 투입 − 1 */
  cumulativeReturnPercent: number;
}

export interface CompoundResult {
  /** 만기 금액 */
  finalAmount: number;
  /** 원금 (변동 없음) */
  principal: number;
  /** 누적 적립 총액 (PMT × 횟수) */
  totalContribution: number;
  /** 누적 이자 (만기 금액 − 원금 − 누적 적립) */
  totalInterest: number;
  /** 총 투입 원금 (원금 + 누적 적립) */
  totalInvested: number;
  /** 총 수익률 (%) — 만기 금액 / 총 투입 − 1 */
  totalReturnPercent: number;
  /** 회차별 상세 (최대 600행, 초과 시 truncated) */
  schedule: CompoundScheduleRow[];
  /** schedule 이 전체 회차를 담지 못하고 잘렸는지 */
  truncated: boolean;
}

/** 기본 모드: 회차별 시뮬레이션으로 표까지 생성. PMT 는 매 회 말 적립 가정. */
const BASIC_SCHEDULE_CAP = 600;

export function calculateCompound(input: CompoundInputResolved): CompoundResult {
  const P = input.principal;
  const i = input.ratePerPeriodPercent / 100;
  const n = input.periods;
  const PMT = input.periodicContribution;

  const schedule: CompoundScheduleRow[] = [];
  const rowCount = Math.min(n, BASIC_SCHEDULE_CAP);

  let balance = P;
  for (let k = 1; k <= rowCount; k++) {
    const interest = balance * i;
    balance = balance + interest + PMT;
    const invested = P + PMT * k;
    schedule.push({
      period: k,
      interest,
      total: balance,
      cumulativeReturnPercent: invested > 0 ? (balance / invested - 1) * 100 : 0,
    });
  }

  // 만기 금액은 닫힌 공식으로 정확히 (큰 n 에서도 정확).
  let finalAmount: number;
  if (i === 0) {
    finalAmount = P + PMT * n;
  } else {
    const growth = Math.pow(1 + i, n);
    finalAmount = P * growth + (PMT === 0 ? 0 : PMT * ((growth - 1) / i));
  }

  const totalContribution = PMT * n;
  const totalInvested = P + totalContribution;
  const totalInterest = finalAmount - totalInvested;
  const totalReturnPercent =
    totalInvested > 0 ? (finalAmount / totalInvested - 1) * 100 : 0;

  return {
    finalAmount,
    principal: P,
    totalContribution,
    totalInterest,
    totalInvested,
    totalReturnPercent,
    schedule,
    truncated: n > rowCount,
  };
}

/* ===========================================================================
 * 적립식 모드 (시작금액 + 매월 적립)
 * =========================================================================== */

export const recurringInputSchema = z.object({
  /** 시작 금액 (원) — 1개월차 적립으로 간주 */
  startAmount: z.number().min(0).max(1e12).default(0),
  /** 매월 적립 금액 (원) — 2개월차부터 가산 */
  monthlyContribution: z.number().min(0).max(1e10).default(0),
  /** 투자 기간 값 */
  periodValue: z.number().int().min(1).max(1200),
  /** 투자 기간 단위 */
  periodUnit: z.enum(["year", "month"]).default("year"),
  /** 이자율 (%) */
  ratePercent: z.number().min(-50).max(100),
  /** 이자율 단위 (연/월) */
  rateUnit: z.enum(["year", "month"]).default("year"),
  /** 복리 방식 */
  compounding: z.enum(["annual", "monthly"]).default("annual"),
});

export type RecurringInput = z.input<typeof recurringInputSchema>;
export type RecurringInputResolved = z.output<typeof recurringInputSchema>;

/** 적립식 표 한 줄 (연차 또는 월차) */
export interface RecurringScheduleRow {
  /** 연차 또는 월차 번호 */
  label: number;
  /** 원금 (해당 구간 시작 잔액 + 구간 적립액) */
  principal: number;
  /** 해당 구간 발생 이자 */
  interest: number;
  /** 구간 말 총액 */
  total: number;
}

export interface RecurringResult {
  /** 만기 금액 */
  finalAmount: number;
  /** 총 투자금 (시작금액 + 매월적립 × (개월−1)) */
  totalInvested: number;
  /** 총 수익 (이자) */
  totalInterest: number;
  /** 총 수익률 (%) */
  totalReturnPercent: number;
  /** 적용된 총 개월수 */
  totalMonths: number;
  /** 연차별 표 */
  yearly: RecurringScheduleRow[];
  /** 월차별 표 */
  monthly: RecurringScheduleRow[];
}

const RECURRING_MONTH_CAP = 1200; // 최대 100년

export function calculateRecurring(
  input: RecurringInputResolved,
): RecurringResult {
  const totalMonths = Math.min(
    input.periodUnit === "year" ? input.periodValue * 12 : input.periodValue,
    RECURRING_MONTH_CAP,
  );
  const annualRate =
    input.rateUnit === "year"
      ? input.ratePercent / 100
      : (input.ratePercent / 100) * 12;
  const mRate = annualRate / 12;
  const isMonthly = input.compounding === "monthly";

  let capitalized = 0; // 연복리: 확정 잔액 / 월복리: 잔액
  let pending = 0; // 연복리: 아직 자본화 안 된 누적 이자
  let depositsThisYear = 0;
  let cumulativePrincipal = 0;
  let prevYearEndBalance = 0;
  let balance = 0;

  const monthly: RecurringScheduleRow[] = [];
  const yearly: RecurringScheduleRow[] = [];

  for (let m = 1; m <= totalMonths; m++) {
    const deposit = m === 1 ? input.startAmount : input.monthlyContribution;
    cumulativePrincipal += deposit;
    depositsThisYear += deposit;

    if (isMonthly) {
      capitalized += deposit;
      capitalized += capitalized * mRate;
      balance = capitalized;
    } else {
      // 연복리: 이번 달 적립 포함 당년 누적 원금에 월할 이자 가산 (연말 자본화)
      pending += (capitalized + depositsThisYear) * mRate;
      balance = capitalized + depositsThisYear + pending;
    }

    monthly.push({
      label: m,
      principal: cumulativePrincipal,
      interest: balance - cumulativePrincipal,
      total: balance,
    });

    const isYearEnd = m % 12 === 0 || m === totalMonths;
    if (isYearEnd) {
      const principalCol = prevYearEndBalance + depositsThisYear;
      yearly.push({
        label: Math.ceil(m / 12),
        principal: principalCol,
        interest: balance - principalCol,
        total: balance,
      });
      if (!isMonthly && m % 12 === 0) {
        capitalized = balance; // 연말 자본화
        pending = 0;
      }
      prevYearEndBalance = balance;
      depositsThisYear = 0;
    }
  }

  const finalAmount = balance;
  const totalInvested = cumulativePrincipal;
  const totalInterest = finalAmount - totalInvested;
  const totalReturnPercent =
    totalInvested > 0 ? (finalAmount / totalInvested - 1) * 100 : 0;

  return {
    finalAmount,
    totalInvested,
    totalInterest,
    totalReturnPercent,
    totalMonths,
    yearly,
    monthly,
  };
}
