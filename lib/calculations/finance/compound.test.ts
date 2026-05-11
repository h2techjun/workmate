import { describe, it, expect } from "vitest";
import { calculateCompound, compoundInputSchema } from "./compound";

describe("compound interest calculator", () => {
  it("100만원 5% 연복리 10년 — 검증값", () => {
    const input = compoundInputSchema.parse({
      principal: 1_000_000,
      annualRatePercent: 5,
      years: 10,
      compoundFrequency: 1,
      periodicContribution: 0,
    });
    const out = calculateCompound(input);
    // FV = 1_000_000 × 1.05^10 = 1,628,894.63 (소수점 둘째 자리 반올림)
    expect(out.finalAmount).toBeCloseTo(1_628_894.63, 0);
    expect(out.totalInterest).toBeCloseTo(628_894.63, 0);
    expect(out.totalContribution).toBe(0);
    expect(out.effectiveAnnualRatePercent).toBeCloseTo(5, 5);
    expect(out.yearly).toHaveLength(10);
  });

  it("월복리 vs 연복리 — 같은 명목금리에서 실효이율 차이", () => {
    const inputMonthly = compoundInputSchema.parse({
      principal: 1_000_000,
      annualRatePercent: 12,
      years: 1,
      compoundFrequency: 12,
    });
    const monthly = calculateCompound(inputMonthly);
    // 월복리 12% 명목 → 실효 12.6825%
    expect(monthly.effectiveAnnualRatePercent).toBeCloseTo(12.6825, 2);
    expect(monthly.finalAmount).toBeCloseTo(1_126_825.03, 0);
  });

  it("정기 적립 시 — PMT 공식 검증", () => {
    // 매월 10만원 적립, 5% 월복리, 5년 → 약 6,829,000원
    const input = compoundInputSchema.parse({
      principal: 0,
      annualRatePercent: 5,
      years: 5,
      compoundFrequency: 12,
      periodicContribution: 100_000,
    });
    const out = calculateCompound(input);
    expect(out.finalAmount).toBeGreaterThan(6_700_000);
    expect(out.finalAmount).toBeLessThan(6_900_000);
    expect(out.totalContribution).toBe(6_000_000); // 100K × 60
  });

  it("이율 0% — 단순 합산", () => {
    const input = compoundInputSchema.parse({
      principal: 1_000_000,
      annualRatePercent: 0,
      years: 5,
      compoundFrequency: 12,
      periodicContribution: 50_000,
    });
    const out = calculateCompound(input);
    // 1M + 50K × 60 = 4M
    expect(out.finalAmount).toBe(4_000_000);
    expect(out.totalInterest).toBe(0);
  });

  it("invalid frequency → schema error", () => {
    expect(() =>
      compoundInputSchema.parse({
        principal: 1000,
        annualRatePercent: 5,
        years: 1,
        compoundFrequency: 3, // not in [1, 4, 12, 365]
      }),
    ).toThrow();
  });
});
