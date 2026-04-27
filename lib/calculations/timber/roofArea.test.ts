import { describe, expect, it } from "vitest";
import { calculateRoofArea } from "./roofArea";

describe("calculateRoofArea - 평면적 보정", () => {
  it("100m² 평면, 30° 경사 → 실면적 ≈ 115.47m²", () => {
    const r = calculateRoofArea({
      planAreaM2: 100,
      angleDegrees: 30,
    });
    expect(r.secCorrection).toBeCloseTo(1.1547, 3);
    expect(r.slopeAreaM2).toBeCloseTo(115.47, 1);
    expect(r.totalAreaM2).toBeCloseTo(115.47, 1);
  });

  it("평지붕 0° → sec=1.0, 평면적과 동일", () => {
    const r = calculateRoofArea({ planAreaM2: 100, angleDegrees: 0 });
    expect(r.secCorrection).toBe(1);
    expect(r.slopeAreaM2).toBe(100);
  });

  it("45° → sec≈√2", () => {
    const r = calculateRoofArea({ planAreaM2: 100, angleDegrees: 45 });
    expect(r.secCorrection).toBeCloseTo(Math.SQRT2, 5);
  });
});

describe("calculateRoofArea - 처마 추가 면적", () => {
  it("둘레 40m + 처마 600mm + 30° → 처마 면적 ≈ 27.7m²", () => {
    const r = calculateRoofArea({
      planAreaM2: 100,
      perimeterM: 40,
      angleDegrees: 30,
      eaveOverhangMM: 600,
    });
    // 40 × 0.6 × sec(30°) = 24 × 1.1547 = 27.71
    expect(r.eaveAreaM2).toBeCloseTo(27.71, 1);
    expect(r.totalAreaM2).toBeCloseTo(115.47 + 27.71, 1);
  });

  it("처마 0이면 eaveArea=0, totalArea=slopeArea", () => {
    const r = calculateRoofArea({
      planAreaM2: 100,
      perimeterM: 40,
      angleDegrees: 30,
      eaveOverhangMM: 0,
    });
    expect(r.eaveAreaM2).toBe(0);
    expect(r.totalAreaM2).toBeCloseTo(r.slopeAreaM2, 5);
  });
});

describe("calculateRoofArea - 입력 검증", () => {
  it("90° 거부", () => {
    expect(() =>
      calculateRoofArea({ planAreaM2: 100, angleDegrees: 90 }),
    ).toThrow();
  });
  it("음수 평면적 거부", () => {
    expect(() =>
      calculateRoofArea({ planAreaM2: -10, angleDegrees: 30 }),
    ).toThrow();
  });
});
