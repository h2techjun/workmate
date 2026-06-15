import { describe, it, expect } from "vitest";
import {
  calculateForeignFlatTax,
  earnedIncomeDeduction,
  foreignFlatTaxInputSchema,
} from "./foreignFlatTax";

describe("foreign flat tax vs progressive (2026)", () => {
  it("단일세율 합산은 항상 총급여 × 20.9%", () => {
    const out = calculateForeignFlatTax(
      foreignFlatTaxInputSchema.parse({ grossSalary: 50_000_000 }),
    );
    expect(out.flat.total).toBeCloseTo(10_450_000, 0); // 5천만 × 0.209
    expect(out.flat.incomeTax).toBeCloseTo(9_500_000, 0);
    expect(out.flat.localTax).toBeCloseTo(950_000, 0);
  });

  it("중소득(5천만, 본인만) → 누진세가 압도적 유리", () => {
    const out = calculateForeignFlatTax(
      foreignFlatTaxInputSchema.parse({ grossSalary: 50_000_000 }),
    );
    expect(out.progressive.earnedIncomeDeduction).toBeCloseTo(12_250_000, 0);
    expect(out.progressive.taxableIncome).toBeCloseTo(36_250_000, 0);
    expect(out.progressive.total).toBeCloseTo(3_869_250, 0);
    expect(out.recommended).toBe("progressive");
  });

  it("손익분기 부근(1.4억, 본인만) → 단일세율이 근소하게 유리", () => {
    const out = calculateForeignFlatTax(
      foreignFlatTaxInputSchema.parse({ grossSalary: 140_000_000 }),
    );
    expect(out.flat.total).toBeCloseTo(29_260_000, 0);
    expect(out.progressive.total).toBeCloseTo(29_911_750, 0);
    expect(out.recommended).toBe("flat");
    expect(out.savings).toBeCloseTo(651_750, 0);
  });

  it("고소득(2억, 본인만) → 단일세율 유리", () => {
    const out = calculateForeignFlatTax(
      foreignFlatTaxInputSchema.parse({ grossSalary: 200_000_000 }),
    );
    expect(out.flat.total).toBeCloseTo(41_800_000, 0);
    expect(out.recommended).toBe("flat");
  });

  it("부양가족이 많으면 손익분기가 올라가 누진세가 유리해진다", () => {
    // 1.4억: 본인만이면 단일세율 유리, 부양 4명이면 누진세 유리로 역전
    const single = calculateForeignFlatTax(
      foreignFlatTaxInputSchema.parse({ grossSalary: 140_000_000, dependents: 0 }),
    );
    const family = calculateForeignFlatTax(
      foreignFlatTaxInputSchema.parse({ grossSalary: 140_000_000, dependents: 4 }),
    );
    expect(single.recommended).toBe("flat");
    expect(family.recommended).toBe("progressive");
    // 부양가족 인적공제만큼 과세표준 감소
    expect(family.progressive.personalDeduction).toBe(7_500_000); // 150만 × 5
    expect(family.progressive.taxableIncome).toBeLessThan(
      single.progressive.taxableIncome,
    );
  });

  it("근로소득공제 §47 — 구간별 값 검증", () => {
    expect(earnedIncomeDeduction(50_000_000)).toBeCloseTo(12_250_000, 0); // 1200만+(5천만-4500만)×5%
    expect(earnedIncomeDeduction(100_000_000)).toBeCloseTo(14_750_000, 0); // 1200만+(1억-4500만)×5%
    expect(earnedIncomeDeduction(200_000_000)).toBeCloseTo(16_750_000, 0); // 1475만+(2억-1억)×2%
  });

  it("근로소득공제 한도 2,000만 — 초고소득에서 상한", () => {
    // 1475만 + (gross-1억)×2% = 2000만 → gross = 3.625억에서 한도 도달
    expect(earnedIncomeDeduction(1_000_000_000)).toBe(20_000_000);
  });

  it("총급여 0 → 양쪽 0, savings 0", () => {
    const out = calculateForeignFlatTax(
      foreignFlatTaxInputSchema.parse({ grossSalary: 0 }),
    );
    expect(out.flat.total).toBe(0);
    expect(out.progressive.total).toBe(0);
    expect(out.savings).toBe(0);
  });

  it("부양가족 수는 정수만 — 소수 입력 시 schema error", () => {
    expect(() =>
      foreignFlatTaxInputSchema.parse({ grossSalary: 50_000_000, dependents: 1.5 }),
    ).toThrow();
  });
});
