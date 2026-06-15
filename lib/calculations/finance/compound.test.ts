import { describe, it, expect } from "vitest";
import { calculateCompound, compoundInputSchema } from "./compound";

describe("compound interest calculator (회당 이율 + 횟수)", () => {
  it("100만원 회당 5% 10회 — 검증값", () => {
    const input = compoundInputSchema.parse({
      principal: 1_000_000,
      ratePerPeriodPercent: 5,
      periods: 10,
      periodicContribution: 0,
    });
    const out = calculateCompound(input);
    // FV = 1,000,000 × 1.05^10 = 1,628,894.63
    expect(out.finalAmount).toBeCloseTo(1_628_894.63, 0);
    expect(out.totalInterest).toBeCloseTo(628_894.63, 0);
    expect(out.totalContribution).toBe(0);
    expect(out.totalInvested).toBe(1_000_000);
    // 총수익률 = 1.05^10 − 1 = 62.8895%
    expect(out.totalReturnPercent).toBeCloseTo(62.8895, 2);
  });

  it("정기 적립 — PMT 공식 검증", () => {
    // 원금 0, 회당 5%, 10회, 매 회 10만원 적립
    const input = compoundInputSchema.parse({
      principal: 0,
      ratePerPeriodPercent: 5,
      periods: 10,
      periodicContribution: 100_000,
    });
    const out = calculateCompound(input);
    // FV = 100,000 × ((1.05^10 − 1) / 0.05) = 1,257,789.25
    expect(out.finalAmount).toBeCloseTo(1_257_789.25, 0);
    expect(out.totalContribution).toBe(1_000_000); // 100K × 10
    expect(out.totalInterest).toBeCloseTo(257_789.25, 0);
  });

  it("원금 + 적립 동시", () => {
    const input = compoundInputSchema.parse({
      principal: 1_000_000,
      ratePerPeriodPercent: 5,
      periods: 10,
      periodicContribution: 100_000,
    });
    const out = calculateCompound(input);
    // 1,628,894.63 + 1,257,789.25 = 2,886,683.88
    expect(out.finalAmount).toBeCloseTo(2_886_683.88, 0);
    expect(out.totalInvested).toBe(2_000_000); // 1M + 100K×10
  });

  it("이율 0% — 단순 합산", () => {
    const input = compoundInputSchema.parse({
      principal: 1_000_000,
      ratePerPeriodPercent: 0,
      periods: 60,
      periodicContribution: 50_000,
    });
    const out = calculateCompound(input);
    // 1M + 50K × 60 = 4M
    expect(out.finalAmount).toBe(4_000_000);
    expect(out.totalInterest).toBe(0);
    expect(out.totalReturnPercent).toBe(0);
  });

  it("월복리 환산 — 회당 0.4167%(=5/12) × 120회 ≈ 연복리 동등", () => {
    const input = compoundInputSchema.parse({
      principal: 1_000_000,
      ratePerPeriodPercent: 5 / 12,
      periods: 120,
      periodicContribution: 0,
    });
    const out = calculateCompound(input);
    // 1,000,000 × (1 + 0.05/12)^120 = 1,647,009.50
    expect(out.finalAmount).toBeCloseTo(1_647_009.5, 0);
  });

  it("복리 횟수는 정수만 허용 — 소수 입력 시 schema error", () => {
    expect(() =>
      compoundInputSchema.parse({
        principal: 1_000_000,
        ratePerPeriodPercent: 5,
        periods: 9.5,
        periodicContribution: 0,
      }),
    ).toThrow();
  });

  it("복리 횟수 최소 1회 — 0 입력 시 schema error", () => {
    expect(() =>
      compoundInputSchema.parse({
        principal: 1_000_000,
        ratePerPeriodPercent: 5,
        periods: 0,
        periodicContribution: 0,
      }),
    ).toThrow();
  });
});
