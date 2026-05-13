import { describe, it, expect } from "vitest";
import { calculateIncomeTax, incomeTaxInputSchema } from "./incomeTax";

describe("종합소득세 8구간 누진세 (2026)", () => {
  it("과세표준 1,000만원 — 6% 구간, 산출세액 60만원", () => {
    const input = incomeTaxInputSchema.parse({ taxableIncome: 10_000_000 });
    const out = calculateIncomeTax(input);
    expect(out.marginalRate).toBe(0.06);
    expect(out.calculatedTax).toBe(600_000);
    expect(out.localIncomeTax).toBe(60_000);
    expect(out.totalTax).toBe(660_000);
  });

  it("과세표준 4,000만원 — 15% 구간, 산출 4000만 × 15% − 126만 = 474만", () => {
    const input = incomeTaxInputSchema.parse({ taxableIncome: 40_000_000 });
    const out = calculateIncomeTax(input);
    expect(out.marginalRate).toBe(0.15);
    expect(out.calculatedTax).toBe(4_740_000);
    expect(out.totalTax).toBe(4_740_000 + 474_000);
  });

  it("과세표준 8,000만원 — 24% 구간, 산출 8000만 × 24% − 576만 = 1,344만", () => {
    const input = incomeTaxInputSchema.parse({ taxableIncome: 80_000_000 });
    const out = calculateIncomeTax(input);
    expect(out.marginalRate).toBe(0.24);
    expect(out.calculatedTax).toBe(13_440_000);
  });

  it("과세표준 1억 5,000만원 — 35% 구간, 산출 1.5억 × 35% − 1,544만 = 3,706만", () => {
    const input = incomeTaxInputSchema.parse({ taxableIncome: 150_000_000 });
    const out = calculateIncomeTax(input);
    expect(out.marginalRate).toBe(0.35);
    expect(out.calculatedTax).toBe(37_060_000);
  });

  it("과세표준 5억원 — 40% 구간, 산출 5억 × 40% − 2,594만 = 1억 7,406만", () => {
    const input = incomeTaxInputSchema.parse({ taxableIncome: 500_000_000 });
    const out = calculateIncomeTax(input);
    expect(out.marginalRate).toBe(0.40);
    expect(out.calculatedTax).toBe(174_060_000);
  });

  it("과세표준 15억원 — 45% 구간, 산출 15억 × 45% − 6,594만 = 6억 1,406만", () => {
    const input = incomeTaxInputSchema.parse({ taxableIncome: 1_500_000_000 });
    const out = calculateIncomeTax(input);
    expect(out.marginalRate).toBe(0.45);
    expect(out.calculatedTax).toBe(609_060_000);
  });

  it("0원 — 산출세액 0", () => {
    const input = incomeTaxInputSchema.parse({ taxableIncome: 0 });
    const out = calculateIncomeTax(input);
    expect(out.calculatedTax).toBe(0);
    expect(out.totalTax).toBe(0);
    expect(out.effectiveRate).toBe(0);
  });

  it("근로소득세액공제 적용: 산출 60만원 → 55% = 33만, 한도 내", () => {
    const input = incomeTaxInputSchema.parse({
      taxableIncome: 10_000_000,
      applyWageEarnerCredit: true,
    });
    const out = calculateIncomeTax(input);
    expect(out.calculatedTax).toBe(600_000);
    expect(out.wageEarnerCredit).toBe(330_000);
    expect(out.finalTax).toBe(270_000);
  });

  it("실효세율: 1억 과표 → 35% 구간 (1.5억 이하) 산출 1,956만 + 지방세 = 2,151.6만", () => {
    const input = incomeTaxInputSchema.parse({ taxableIncome: 100_000_000 });
    const out = calculateIncomeTax(input);
    expect(out.marginalRate).toBe(0.35);
    // 1억 × 35% − 1,544만 = 1,956만 → 지방세 195.6만 → 합계 2,151.6만
    expect(out.calculatedTax).toBe(19_560_000);
    expect(out.totalTax).toBe(21_516_000);
    expect(out.effectiveRate).toBeCloseTo(0.21516, 4);
  });
});
