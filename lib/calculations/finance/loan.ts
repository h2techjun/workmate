/**
 * 대출 상환 계산기 — Loan Repayment Calculator
 *
 * 3가지 상환 방식 + 매월 상환 스케줄:
 *
 * 1) **원리금균등 (equalPayment)** — 매월 같은 금액 (원금+이자 합계 일정)
 *    M = P × r(1+r)^n / ((1+r)^n − 1)
 *    이자 비중 ↑ 초반, 원금 비중 ↑ 후반.
 *    한국 주택담보대출·신용대출 보편.
 *
 * 2) **원금균등 (equalPrincipal)** — 매월 원금 같음, 이자 점차 감소
 *    원금 = P / n
 *    이자 = 잔금 × r
 *    초반 부담 ↑, 총 이자 ↓ (균등 대비 약 4~5% 절감).
 *
 * 3) **만기일시 (balloon)** — 이자만 매월, 만기에 원금 일시상환
 *    매월 = P × r (이자만)
 *    만기 = P + 마지막 달 이자
 *    한국 신용대출·전세자금대출에 사용.
 *
 *   r = monthly_rate = annual_rate / 12
 *   n = months = years × 12
 *
 * 출처: 일반 금융 공식. 한국 대출 관행 기준.
 */

import { z } from "zod";

export type LoanType = "equalPayment" | "equalPrincipal" | "balloon";

export const loanInputSchema = z.object({
  /** 대출 원금 (원) */
  principal: z
    .number()
    .min(10_000, "validation.principalMin")
    .max(1e11, "validation.principalMax"),
  /** 연이율 (%, 명목) */
  annualRatePercent: z
    .number()
    .min(0, "validation.rateMin")
    .max(50, "validation.rateMax"),
  /** 대출 기간 (년) */
  years: z
    .number()
    .min(0.1, "validation.yearsMin")
    .max(50, "validation.yearsMax"),
  /** 상환 방식 */
  loanType: z.enum(["equalPayment", "equalPrincipal", "balloon"]),
});

export type LoanInput = z.input<typeof loanInputSchema>;
export type LoanInputResolved = z.output<typeof loanInputSchema>;

export interface ScheduleRow {
  /** 회차 (1, 2, 3, ...) */
  month: number;
  /** 해당 회차 상환 총액 (원금 + 이자) */
  payment: number;
  /** 해당 회차 원금 */
  principal: number;
  /** 해당 회차 이자 */
  interest: number;
  /** 회차 후 남은 잔금 */
  balance: number;
}

export interface LoanResult {
  loanType: LoanType;
  /** 첫 회차 상환액 (균등 방식이면 매월 동일) */
  firstPayment: number;
  /** 마지막 회차 상환액 (만기일시면 원금+이자) */
  lastPayment: number;
  /** 총 상환 원금 (= principal) */
  totalPrincipal: number;
  /** 총 상환 이자 */
  totalInterest: number;
  /** 총 상환 (원금 + 이자) */
  totalPayment: number;
  /** 매월 상환 스케줄 (최대 60회까지만 반환, 그 이상은 6개월 단위 샘플링) */
  schedule: ReadonlyArray<ScheduleRow>;
  /** 전체 스케줄을 다 보여줄지 (60 이하 = true) */
  fullSchedule: boolean;
}

/**
 * 대출 상환 계산.
 *
 * 0% 이율 처리: 균등은 원금 / n, 원금균등도 동일, 만기일시는 이자 0.
 */
export function calculateLoan(input: LoanInputResolved): LoanResult {
  const P = input.principal;
  const r = input.annualRatePercent / 100 / 12; // 월이율
  const n = Math.round(input.years * 12);

  let firstPayment: number;
  let lastPayment: number;
  let totalInterest: number;
  const schedule: ScheduleRow[] = [];

  if (input.loanType === "equalPayment") {
    // M = P × r(1+r)^n / ((1+r)^n − 1)
    const monthly =
      r === 0 ? P / n : (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    firstPayment = monthly;
    lastPayment = monthly;

    let balance = P;
    let totInt = 0;
    for (let m = 1; m <= n; m++) {
      const interest = balance * r;
      const principalPay = monthly - interest;
      balance = Math.max(0, balance - principalPay);
      totInt += interest;
      schedule.push({
        month: m,
        payment: monthly,
        principal: principalPay,
        interest,
        balance,
      });
    }
    totalInterest = totInt;
  } else if (input.loanType === "equalPrincipal") {
    // 원금 = P / n 고정, 이자 = 잔금 × r
    const principalPay = P / n;
    let balance = P;
    let totInt = 0;
    for (let m = 1; m <= n; m++) {
      const interest = balance * r;
      const payment = principalPay + interest;
      balance = Math.max(0, balance - principalPay);
      totInt += interest;
      if (m === 1) firstPayment = payment;
      if (m === n) lastPayment = payment;
      schedule.push({
        month: m,
        payment,
        principal: principalPay,
        interest,
        balance,
      });
    }
    totalInterest = totInt;
    firstPayment ??= 0;
    lastPayment ??= 0;
  } else {
    // balloon: 매월 이자만, 만기에 원금 일시
    const monthlyInterest = P * r;
    firstPayment = monthlyInterest;
    lastPayment = P + monthlyInterest;
    let balance = P;
    let totInt = 0;
    for (let m = 1; m <= n; m++) {
      const interest = balance * r;
      const isLast = m === n;
      const principalPay = isLast ? P : 0;
      const payment = interest + principalPay;
      balance = isLast ? 0 : balance;
      totInt += interest;
      schedule.push({
        month: m,
        payment,
        principal: principalPay,
        interest,
        balance,
      });
    }
    totalInterest = totInt;
  }

  // 스케줄 샘플링: 60회 이하면 전부, 그 이상이면 6개월 단위
  const fullSchedule = schedule.length <= 60;
  const displaySchedule = fullSchedule
    ? schedule
    : schedule.filter((row, i) => i === 0 || i === schedule.length - 1 || (row.month % 6 === 0));

  return {
    loanType: input.loanType,
    firstPayment,
    lastPayment,
    totalPrincipal: P,
    totalInterest,
    totalPayment: P + totalInterest,
    schedule: displaySchedule,
    fullSchedule,
  };
}
