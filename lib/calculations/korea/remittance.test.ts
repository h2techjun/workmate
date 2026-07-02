import { describe, it, expect } from "vitest";
import {
  calculateRemittance,
  remittanceInputSchema,
} from "./remittance";
import { METHOD_DEFAULTS } from "@/lib/constants/korea/remittance";

const parse = (o: Record<string, number>) =>
  calculateRemittance(remittanceInputSchema.parse(o));

describe("해외송금 비용 추정 (remittance)", () => {
  it("총비용 = 환율마진 + 고정수수료, 실질률 계산", () => {
    const out = parse({
      sendAmount: 1_000_000,
      fxMarginPercent: 2.5,
      fixedFee: 25_000,
    });
    expect(out.fxCost).toBe(25_000); // 100만 × 2.5%
    expect(out.totalCost).toBe(50_000);
    expect(out.effectiveCostPercent).toBeCloseTo(5, 5); // 5만/100만
    expect(out.amountAfterCost).toBe(950_000);
  });

  it("전문업체가 은행보다 실질 비용률 낮음 (동일 송금액)", () => {
    const bank = parse({
      sendAmount: 1_000_000,
      fxMarginPercent: METHOD_DEFAULTS.bank.fxMarginPercent,
      fixedFee: METHOD_DEFAULTS.bank.fixedFee,
    });
    const specialist = parse({
      sendAmount: 1_000_000,
      fxMarginPercent: METHOD_DEFAULTS.specialist.fxMarginPercent,
      fixedFee: METHOD_DEFAULTS.specialist.fixedFee,
    });
    expect(specialist.effectiveCostPercent).toBeLessThan(
      bank.effectiveCostPercent,
    );
  });

  it("고정수수료 비중은 소액일수록 커진다 (실질률 체감)", () => {
    const small = parse({
      sendAmount: 200_000,
      fxMarginPercent: 0.7,
      fixedFee: 5_000,
    });
    const large = parse({
      sendAmount: 5_000_000,
      fxMarginPercent: 0.7,
      fixedFee: 5_000,
    });
    // 소액은 고정수수료 비중 커서 실질률이 더 높음
    expect(small.effectiveCostPercent).toBeGreaterThan(
      large.effectiveCostPercent,
    );
  });

  it("마진 0 + 수수료 0 = 비용 0, 실수령 = 송금액", () => {
    const out = parse({
      sendAmount: 1_000_000,
      fxMarginPercent: 0,
      fixedFee: 0,
    });
    expect(out.totalCost).toBe(0);
    expect(out.effectiveCostPercent).toBe(0);
    expect(out.amountAfterCost).toBe(1_000_000);
  });

  it("무효: 송금액 0 → valid false", () => {
    const out = parse({ sendAmount: 0, fxMarginPercent: 2, fixedFee: 5_000 });
    expect(out.valid).toBe(false);
    expect(out.totalCost).toBe(0);
  });
});
