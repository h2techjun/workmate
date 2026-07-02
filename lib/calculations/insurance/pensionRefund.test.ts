import { describe, it, expect } from "vitest";
import {
  calcPensionRefund,
  pensionRefundInputSchema,
} from "./pensionRefund";

function build(overrides: Record<string, unknown>) {
  return pensionRefundInputSchema.parse(overrides);
}

describe("calcPensionRefund", () => {
  it("기본 케이스: 월 300만 × 9% × 24개월 원금 + 이자", () => {
    const r = calcPensionRefund(
      build({
        monthlySalary: 3_000_000,
        months: 24,
        contributionRatePercent: 9,
        depositRatePercent: 2.6,
      }),
    );
    // 원금 = 3,000,000 × 0.09 × 24 = 6,480,000
    expect(r.principal).toBe(6_480_000);
    expect(r.effectiveBase).toBe(3_000_000);
    expect(r.capped).toBe(false);
    // avgYears = 24/12/2 = 1, 이자 = 6,480,000 × 0.026 × 1 = 168,480
    expect(r.avgYears).toBe(1);
    expect(r.interest).toBe(168_480);
    expect(r.total).toBe(6_648_480);
  });

  it("기준소득월액 상한(6,590,000 — 2026.7~) 초과 시 캡 적용", () => {
    const r = calcPensionRefund(
      build({
        monthlySalary: 10_000_000,
        months: 12,
        contributionRatePercent: 9,
        depositRatePercent: 0,
      }),
    );
    expect(r.effectiveBase).toBe(6_590_000);
    expect(r.capped).toBe(true);
    // 원금 = 6,590,000 × 0.09 × 12 = 7,117,200
    expect(r.principal).toBe(7_117_200);
    expect(r.interest).toBe(0);
    expect(r.total).toBe(7_117_200);
  });

  it("하한(410,000 — 2026.7~) 미만 급여는 하한으로 보정", () => {
    const r = calcPensionRefund(
      build({ monthlySalary: 100_000, months: 12, contributionRatePercent: 9, depositRatePercent: 0 }),
    );
    expect(r.effectiveBase).toBe(410_000);
    expect(r.capped).toBe(false);
  });

  it("2026 요율 9.5% 반영", () => {
    const r = calcPensionRefund(
      build({ monthlySalary: 3_000_000, months: 12, contributionRatePercent: 9.5, depositRatePercent: 0 }),
    );
    // 3,000,000 × 0.095 × 12 = 3,420,000
    expect(r.principal).toBe(3_420_000);
  });

  it("이자율 0이면 이자 0, 총액 = 원금", () => {
    const r = calcPensionRefund(
      build({ monthlySalary: 2_000_000, months: 36, contributionRatePercent: 9, depositRatePercent: 0 }),
    );
    expect(r.interest).toBe(0);
    expect(r.total).toBe(r.principal);
  });

  it("미입력(0)이면 전부 0", () => {
    const r = calcPensionRefund(build({}));
    expect(r.effectiveBase).toBe(0);
    expect(r.principal).toBe(0);
    expect(r.total).toBe(0);
  });
});
