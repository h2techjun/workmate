import { describe, it, expect } from "vitest";
import { convertArea, areaInputSchema, SQM_PER_PYEONG } from "./area";

describe("area unit conversion", () => {
  it("1평 = 3.30578... m² = 36 자²", () => {
    const r = convertArea(areaInputSchema.parse({ value: 1, unit: "pyeong" }));
    expect(r.sqm).toBeCloseTo(SQM_PER_PYEONG, 6);
    expect(r.ja2).toBe(36);
    expect(r.pyeongRounded05).toBe(1);
  });

  it("100㎡ ≈ 30.25 평 ≈ 1089 자²", () => {
    const r = convertArea(areaInputSchema.parse({ value: 100, unit: "sqm" }));
    expect(r.pyeong).toBeCloseTo(30.25, 2);
    expect(r.ja2).toBeCloseTo(1089, 2);
    expect(r.pyeongRounded05).toBe(30.5);
  });

  it("36 자² = 1평 = 3.30578 m²", () => {
    const r = convertArea(areaInputSchema.parse({ value: 36, unit: "ja2" }));
    expect(r.pyeong).toBeCloseTo(1, 6);
    expect(r.sqm).toBeCloseTo(SQM_PER_PYEONG, 6);
  });

  it("84㎡ (국민주택규모) ≈ 25.41 평 → 25.5 평 광고용", () => {
    const r = convertArea(areaInputSchema.parse({ value: 84, unit: "sqm" }));
    expect(r.pyeong).toBeCloseTo(25.41, 2);
    expect(r.pyeongRounded05).toBe(25.5);
  });

  it("invalid unit → schema error", () => {
    expect(() =>
      areaInputSchema.parse({ value: 100, unit: "acre" }),
    ).toThrow();
  });
});
