import { describe, it, expect } from "vitest";
import {
  calculateCapitalGainsTax,
  capitalGainsInputSchema,
} from "./capitalGainsTax";

const parse = (o: Record<string, unknown>) =>
  capitalGainsInputSchema.parse(o);

describe("부동산 양도소득세", () => {
  it("양도차익 계산: 5억 매도 - 3억 매입 - 2천만 경비 = 1.8억", () => {
    const out = calculateCapitalGainsTax(
      parse({
        salePrice: 500_000_000,
        purchasePrice: 300_000_000,
        expenses: 20_000_000,
        holdingYears: 5,
        assetType: "house",
      }),
    );
    expect(out.gain).toBe(180_000_000);
    expect(out.isShortTerm).toBe(false);
  });

  it("장기보유 5년 일반주택 → 공제율 10% (6% + 2년×2%)", () => {
    const out = calculateCapitalGainsTax(
      parse({
        salePrice: 500_000_000,
        purchasePrice: 300_000_000,
        expenses: 20_000_000,
        holdingYears: 5,
        assetType: "house",
        isOneHouse: false,
      }),
    );
    expect(out.longTermRate).toBeCloseTo(0.1, 4); // 6% + (5-3)*2% = 10%
    expect(out.longTermDeduction).toBe(18_000_000); // 1.8억 × 10%
  });

  it("1세대1주택 10년 보유 10년 거주 → 80% 공제", () => {
    const out = calculateCapitalGainsTax(
      parse({
        salePrice: 1_500_000_000,
        purchasePrice: 500_000_000,
        expenses: 0,
        holdingYears: 10,
        residingYears: 10,
        assetType: "house",
        isOneHouse: true,
      }),
    );
    expect(out.longTermRate).toBeCloseTo(0.8, 4);
    // 양도차익 10억 × 80% = 8억 공제
    expect(out.longTermDeduction).toBe(800_000_000);
  });

  it("단기 양도(주택 1년 미만) → 70% 단일세율", () => {
    const out = calculateCapitalGainsTax(
      parse({
        salePrice: 400_000_000,
        purchasePrice: 300_000_000,
        expenses: 0,
        holdingYears: 0.5,
        assetType: "house",
      }),
    );
    expect(out.isShortTerm).toBe(true);
    expect(out.marginalRate).toBe(0.7);
    expect(out.longTermDeduction).toBe(0); // 3년 미만 장특공제 없음
    // 과세표준 = 1억 - 250만 = 9,750만, 세금 = × 70%
    expect(out.taxBase).toBe(97_500_000);
    expect(out.calculatedTax).toBe(68_250_000);
  });

  it("기본공제 250만원 적용", () => {
    const out = calculateCapitalGainsTax(
      parse({
        salePrice: 310_000_000,
        purchasePrice: 300_000_000,
        expenses: 0,
        holdingYears: 4,
        assetType: "house",
      }),
    );
    // 양도차익 1천만, 보유 4년 장특 8%(6%+1년×2%) = 80만, 양도소득금액 920만, 과표 = 920만-250만 = 670만
    expect(out.taxBase).toBe(6_700_000);
  });

  it("지방소득세 = 산출세액 10%", () => {
    const out = calculateCapitalGainsTax(
      parse({
        salePrice: 500_000_000,
        purchasePrice: 300_000_000,
        expenses: 20_000_000,
        holdingYears: 5,
        assetType: "house",
      }),
    );
    expect(out.localTax).toBe(Math.floor((out.calculatedTax * 0.1) / 10) * 10);
    expect(out.totalTax).toBe(out.calculatedTax + out.localTax);
  });

  it("손실(양도차익 음수) → 세금 0", () => {
    const out = calculateCapitalGainsTax(
      parse({
        salePrice: 300_000_000,
        purchasePrice: 400_000_000,
        expenses: 0,
        holdingYears: 5,
        assetType: "house",
      }),
    );
    expect(out.gain).toBe(0);
    expect(out.totalTax).toBe(0);
  });
});
