import { describe, it, expect } from "vitest";
import {
  calculateElectricBill,
  electricBillInputSchema,
} from "./electricBill";

const parse = (o: Record<string, unknown>) =>
  electricBillInputSchema.parse(o);

describe("주택용 전기요금 (누진제)", () => {
  it("저압 200kWh — 1단계만 적용", () => {
    const out = calculateElectricBill(
      parse({ usageKwh: 200, voltage: "low" }),
    );
    expect(out.appliedTier).toBe(1);
    expect(out.baseFee).toBe(910);
    // 전력량 = 200 × 120.0 = 24,000
    expect(out.energyFee).toBe(24000);
    // 기후 = 200×9 = 1,800, 연료 = 200×5 = 1,000
    expect(out.climateFee).toBe(1800);
    expect(out.fuelAdjustFee).toBe(1000);
    // 전기요금계 = 910+24000+1800+1000 = 27,710
    expect(out.subtotal).toBe(27710);
  });

  it("저압 350kWh — 2단계 진입", () => {
    const out = calculateElectricBill(
      parse({ usageKwh: 350, voltage: "low" }),
    );
    expect(out.appliedTier).toBe(2);
    expect(out.baseFee).toBe(1600);
    // 1단계 200×120 = 24,000 + 2단계 150×214.6 = 32,190 → 56,190
    expect(out.energyFee).toBe(56190);
    expect(out.tierBreakdown.length).toBe(2);
  });

  it("저압 500kWh — 3단계 진입", () => {
    const out = calculateElectricBill(
      parse({ usageKwh: 500, voltage: "low" }),
    );
    expect(out.appliedTier).toBe(3);
    expect(out.baseFee).toBe(7300);
    // 200×120 + 200×214.6 + 100×307.3 = 24000+42920+30730 = 97,650
    expect(out.energyFee).toBe(97650);
    expect(out.tierBreakdown.length).toBe(3);
  });

  it("여름철 300kWh — 완화 구간으로 1단계 유지", () => {
    const normal = calculateElectricBill(
      parse({ usageKwh: 300, voltage: "low", isSummer: false }),
    );
    const summer = calculateElectricBill(
      parse({ usageKwh: 300, voltage: "low", isSummer: true }),
    );
    // 평상시 300kWh = 2단계, 여름 300kWh = 1단계 유지
    expect(normal.appliedTier).toBe(2);
    expect(summer.appliedTier).toBe(1);
    // 여름이 기본요금 더 저렴
    expect(summer.baseFee).toBeLessThan(normal.baseFee);
  });

  it("부가세 10% + 전력기금 3.7% + 청구금액 10원 절사", () => {
    const out = calculateElectricBill(
      parse({ usageKwh: 200, voltage: "low" }),
    );
    // subtotal 27,710
    expect(out.vat).toBe(2771); // 10%
    // 전력기금 = floor(27710 × 0.037 / 10) × 10 = floor(102.5)×10... = 1020
    expect(out.powerFund).toBe(1020);
    // 청구금액 = floor((27710+2771+1020)/10)×10 = 31,500
    expect(out.total).toBe(31500);
    expect(out.total % 10).toBe(0); // 10원 절사
  });

  it("고압이 저압보다 저렴", () => {
    const low = calculateElectricBill(parse({ usageKwh: 400, voltage: "low" }));
    const high = calculateElectricBill(parse({ usageKwh: 400, voltage: "high" }));
    expect(high.total).toBeLessThan(low.total);
  });

  it("0kWh — 기본요금만, 평균단가 0", () => {
    const out = calculateElectricBill(parse({ usageKwh: 0, voltage: "low" }));
    expect(out.energyFee).toBe(0);
    expect(out.avgRate).toBe(0);
  });
});
