import { describe, expect, it } from "vitest";
import { calculateRafter } from "./rafter";

describe("calculateRafter - 표준 케이스", () => {
  it("run=4000, rise=1000, eave=600 → length≈4123, angle≈14.04°, slope=25%, pitch=3/12", () => {
    const r = calculateRafter({ run: 4000, rise: 1000, eaveOverhang: 600 });
    expect(r.baseLength).toBeCloseTo(4123.106, 1);
    expect(r.angleDegrees).toBeCloseTo(14.036, 2);
    expect(r.slopePercent).toBeCloseTo(25, 5);
    expect(r.pitchRise12).toBeCloseTo(3.0, 5);
    expect(r.secCorrection).toBeCloseTo(1.030776, 4);
    expect(r.eaveDiagonal).toBeCloseTo(618.466, 1);
    expect(r.totalLength).toBeCloseTo(r.baseLength + r.eaveDiagonal, 5);
  });

  it("정사각형 직각삼각형 (rise=run) → 45°, slope=100%", () => {
    const r = calculateRafter({ run: 3000, rise: 3000 });
    expect(r.angleDegrees).toBeCloseTo(45, 5);
    expect(r.slopePercent).toBeCloseTo(100, 5);
    expect(r.pitchRise12).toBeCloseTo(12, 5);
    expect(r.baseLength).toBeCloseTo(3000 * Math.SQRT2, 2);
  });

  it("처마 미입력 시 totalLength = baseLength", () => {
    const r = calculateRafter({ run: 4000, rise: 1500 });
    expect(r.eaveDiagonal).toBe(0);
    expect(r.totalLength).toBeCloseTo(r.baseLength, 5);
  });
});

describe("calculateRafter - 입력 검증", () => {
  it("음수 run 거부", () => {
    expect(() => calculateRafter({ run: -1, rise: 1000 })).toThrow();
  });
  it("처마 2001mm 거부", () => {
    expect(() =>
      calculateRafter({ run: 4000, rise: 1000, eaveOverhang: 2001 }),
    ).toThrow();
  });
});

describe("calculateRafter - 계산 단계", () => {
  it("처마 0이면 4단계, 처마 있으면 6단계", () => {
    const a = calculateRafter({ run: 4000, rise: 1000 });
    expect(a.calculationSteps).toHaveLength(4);
    const b = calculateRafter({ run: 4000, rise: 1000, eaveOverhang: 600 });
    expect(b.calculationSteps).toHaveLength(6);
  });
});
