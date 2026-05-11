import { describe, it, expect } from "vitest";
import { calculateLoan, loanInputSchema } from "./loan";

describe("loan calculator", () => {
  it("원리금균등: 1억원 5% 10년 = 월 약 106만원", () => {
    const input = loanInputSchema.parse({
      principal: 100_000_000,
      annualRatePercent: 5,
      years: 10,
      loanType: "equalPayment",
    });
    const out = calculateLoan(input);
    // M = 100M × (0.05/12)(1.00417)^120 / ((1.00417)^120 − 1) ≈ 1,060,655
    expect(out.firstPayment).toBeCloseTo(1_060_655, -2); // 100원 단위
    expect(out.lastPayment).toBeCloseTo(out.firstPayment, 0);
    expect(out.totalInterest).toBeCloseTo(27_278_618, -3);
  });

  it("원금균등: 1억원 5% 10년 — 초반 ↑ 후반 ↓", () => {
    const input = loanInputSchema.parse({
      principal: 100_000_000,
      annualRatePercent: 5,
      years: 10,
      loanType: "equalPrincipal",
    });
    const out = calculateLoan(input);
    // 첫달 = 100M/120 + 100M × (0.05/12) = 833,333 + 416,667 = 1,250,000
    expect(out.firstPayment).toBeCloseTo(1_250_000, 0);
    // 마지막달 = 833,333 + 833,333 × (0.05/12) = 833,333 + 3,472 ≈ 836,806
    expect(out.lastPayment).toBeCloseTo(836_806, -1);
    // 균등보다 총이자 ↓
    expect(out.totalInterest).toBeLessThan(27_278_618);
  });

  it("만기일시: 1억원 5% 10년 — 매월 이자 41만, 만기 1억 + 이자", () => {
    const input = loanInputSchema.parse({
      principal: 100_000_000,
      annualRatePercent: 5,
      years: 10,
      loanType: "balloon",
    });
    const out = calculateLoan(input);
    // 매월 이자 = 100M × 0.05/12 = 416,667
    expect(out.firstPayment).toBeCloseTo(416_667, 0);
    // 만기 = 1억 + 416,667
    expect(out.lastPayment).toBeCloseTo(100_416_667, 0);
    // 총 이자 = 41만 × 120 = 50M
    expect(out.totalInterest).toBeCloseTo(50_000_000, -3);
  });

  it("0% 이율 — 균등은 원금/n", () => {
    const input = loanInputSchema.parse({
      principal: 1_200_000,
      annualRatePercent: 0,
      years: 1,
      loanType: "equalPayment",
    });
    const out = calculateLoan(input);
    expect(out.firstPayment).toBe(100_000);
    expect(out.totalInterest).toBe(0);
  });

  it("스케줄 샘플링: 30년 = 360회 → 6개월 단위", () => {
    const input = loanInputSchema.parse({
      principal: 300_000_000,
      annualRatePercent: 4,
      years: 30,
      loanType: "equalPayment",
    });
    const out = calculateLoan(input);
    expect(out.fullSchedule).toBe(false);
    expect(out.schedule.length).toBeLessThan(360);
  });
});
