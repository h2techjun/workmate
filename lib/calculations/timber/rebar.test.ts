import { describe, it, expect } from "vitest";
import { calculateRebar, rebarInputSchema } from "./rebar";

describe("calculateRebar", () => {
  it("D10 6m 100본 — 총길이 600m, 정미 336kg + 3% 할증", () => {
    const r = calculateRebar(
      rebarInputSchema.parse({ size: "D10", lengthM: 6, count: 100, waste: 3 }),
    );
    expect(r.totalLengthM).toBe(600); // 6 × 100
    expect(r.netWeightKg).toBe(336); // 600 × 0.560
    expect(r.weightKg).toBe(346.1); // 336 × 1.03 = 346.08 → 346.1
    expect(r.weightTon).toBeCloseTo(0.346, 3);
    expect(r.unitWeight).toBe(0.56);
  });

  it("D13 12m 50본, 할증 0% — 정미와 발주 중량이 같다", () => {
    const r = calculateRebar(
      rebarInputSchema.parse({ size: "D13", lengthM: 12, count: 50, waste: 0 }),
    );
    expect(r.totalLengthM).toBe(600);
    expect(r.netWeightKg).toBe(597); // 600 × 0.995
    expect(r.weightKg).toBe(597);
    expect(r.weightTon).toBeCloseTo(0.597, 3);
  });

  it("D16 5.5m 20본, 3% 할증", () => {
    const r = calculateRebar(
      rebarInputSchema.parse({ size: "D16", lengthM: 5.5, count: 20, waste: 3 }),
    );
    expect(r.totalLengthM).toBe(110);
    expect(r.netWeightKg).toBeCloseTo(171.6, 1); // 110 × 1.560
    expect(r.weightKg).toBeCloseTo(176.7, 1); // 171.6 × 1.03 ≈ 176.748
    expect(r.weightTon).toBeCloseTo(0.177, 3);
  });

  it("D25 대량(10m 200본), 5% 할증 — 톤 단위 확인", () => {
    const r = calculateRebar(
      rebarInputSchema.parse({ size: "D25", lengthM: 10, count: 200, waste: 5 }),
    );
    expect(r.totalLengthM).toBe(2000);
    expect(r.netWeightKg).toBe(7960); // 2000 × 3.980
    expect(r.weightKg).toBe(8358); // 7960 × 1.05
    expect(r.weightTon).toBeCloseTo(8.358, 3);
  });

  it("길이 0이면 전부 0", () => {
    const r = calculateRebar(
      rebarInputSchema.parse({ size: "D10", lengthM: 0, count: 100, waste: 3 }),
    );
    expect(r.totalLengthM).toBe(0);
    expect(r.netWeightKg).toBe(0);
    expect(r.weightKg).toBe(0);
    expect(r.weightTon).toBe(0);
  });

  it("D22 9m 15본, 3% 할증 — 소수점 반올림 확인", () => {
    const r = calculateRebar(
      rebarInputSchema.parse({ size: "D22", lengthM: 9, count: 15, waste: 3 }),
    );
    expect(r.totalLengthM).toBe(135);
    expect(r.netWeightKg).toBeCloseTo(410.4, 1); // 135 × 3.040
    expect(r.weightKg).toBeCloseTo(422.7, 1); // 410.4 × 1.03 ≈ 422.712
    expect(r.weightTon).toBeCloseTo(0.423, 3);
    expect(r.unitWeight).toBe(3.04);
  });
});
