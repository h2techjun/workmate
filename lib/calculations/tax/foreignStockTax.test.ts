import { describe, expect, it } from "vitest";
import { calculateForeignStockTax } from "./foreignStockTax";

describe("calculateForeignStockTax - 표준 시나리오 (이익 +)", () => {
  it("US$1000 매수(@1300) → US$1500 매도(@1400)", () => {
    const r = calculateForeignStockTax({
      buyPriceForeign: 1000,
      buyExchangeRate: 1300,
      sellPriceForeign: 1500,
      sellExchangeRate: 1400,
    });
    expect(r.buyPriceKrw).toBe(1_300_000);
    expect(r.sellPriceKrw).toBe(2_100_000);
    expect(r.capitalGainKrw).toBe(800_000);
    // 800,000 < 250만원 공제 → 과세표준 0
    expect(r.taxableBaseKrw).toBe(0);
    expect(r.taxKrw).toBe(0);
    expect(r.netProfitKrw).toBe(800_000);
  });

  it("이익 500만원: 250만원 공제 후 22% 과세", () => {
    const r = calculateForeignStockTax({
      buyPriceForeign: 10_000,
      buyExchangeRate: 1000,
      sellPriceForeign: 15_000,
      sellExchangeRate: 1000,
    });
    expect(r.capitalGainKrw).toBe(5_000_000);
    // 5,000,000 - 2,500,000 = 2,500,000 과세표준
    expect(r.taxableBaseKrw).toBe(2_500_000);
    // 2,500,000 × 0.22 = 550,000
    expect(r.taxKrw).toBe(550_000);
    expect(r.netProfitKrw).toBe(5_000_000 - 550_000);
  });
});

describe("calculateForeignStockTax - 손실 케이스", () => {
  it("매수가 > 매도가 → 손실, 세금 0", () => {
    const r = calculateForeignStockTax({
      buyPriceForeign: 2000,
      buyExchangeRate: 1300,
      sellPriceForeign: 1500,
      sellExchangeRate: 1400,
    });
    expect(r.capitalGainKrw).toBe(2_100_000 - 2_600_000);
    expect(r.isLoss).toBe(true);
    expect(r.taxableBaseKrw).toBe(0);
    expect(r.taxKrw).toBe(0);
  });
});

describe("calculateForeignStockTax - 환율 변동", () => {
  it("주가는 동일하지만 환율 상승만으로도 양도차익 발생 (환차익 과세)", () => {
    const r = calculateForeignStockTax({
      buyPriceForeign: 10_000,
      buyExchangeRate: 1000,
      sellPriceForeign: 10_000,
      sellExchangeRate: 1500,
    });
    // 매수 1000만원 → 매도 1500만원 = +500만원 양도차익
    expect(r.capitalGainKrw).toBe(5_000_000);
    expect(r.taxKrw).toBe(550_000); // 250만원 공제 후 22%
  });
});

describe("calculateForeignStockTax - 거래비용", () => {
  it("거래비용 차감 후 세금 계산", () => {
    const r = calculateForeignStockTax({
      buyPriceForeign: 10_000,
      buyExchangeRate: 1000,
      sellPriceForeign: 15_000,
      sellExchangeRate: 1000,
      transactionCostKrw: 100_000,
    });
    expect(r.capitalGainKrw).toBe(5_000_000 - 100_000);
    // 4,900,000 - 2,500,000 = 2,400,000
    expect(r.taxableBaseKrw).toBe(2_400_000);
    expect(r.taxKrw).toBe(528_000);
  });
});

describe("calculateForeignStockTax - 기존 공제 사용", () => {
  it("이미 100만원 공제 사용 → 잔여 150만원만 적용", () => {
    const r = calculateForeignStockTax({
      buyPriceForeign: 10_000,
      buyExchangeRate: 1000,
      sellPriceForeign: 15_000,
      sellExchangeRate: 1000,
      prevDeductionUsed: 1_000_000,
    });
    expect(r.remainingDeductionKrw).toBe(1_500_000);
    expect(r.taxableBaseKrw).toBe(5_000_000 - 1_500_000);
    expect(r.taxKrw).toBe(770_000); // 3,500,000 × 0.22
  });

  it("이미 250만원 모두 사용 → 공제 없음", () => {
    const r = calculateForeignStockTax({
      buyPriceForeign: 10_000,
      buyExchangeRate: 1000,
      sellPriceForeign: 15_000,
      sellExchangeRate: 1000,
      prevDeductionUsed: 2_500_000,
    });
    expect(r.remainingDeductionKrw).toBe(0);
    expect(r.taxableBaseKrw).toBe(5_000_000);
    expect(r.taxKrw).toBe(1_100_000);
  });
});

describe("calculateForeignStockTax - 입력 검증", () => {
  it("환율 0 거부", () => {
    expect(() =>
      calculateForeignStockTax({
        buyPriceForeign: 1000,
        buyExchangeRate: 0,
        sellPriceForeign: 1500,
        sellExchangeRate: 1400,
      }),
    ).toThrow();
  });
});
