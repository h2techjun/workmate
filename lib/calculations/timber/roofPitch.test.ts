import { describe, expect, it } from "vitest";
import { calculateRoofPitch } from "./roofPitch";

describe("calculateRoofPitch - 양방향 변환", () => {
  it("angle=30 → slope≈57.74%, pitch≈6.93/12", () => {
    const r = calculateRoofPitch({ mode: "angle", angle: 30 });
    expect(r.angleDegrees).toBe(30);
    expect(r.slopePercent).toBeCloseTo(57.735, 2);
    expect(r.pitchRise12).toBeCloseTo(6.928, 2);
    expect(r.secCorrection).toBeCloseTo(1.1547, 3);
  });

  it("slope=100 → angle=45°, pitch=12/12", () => {
    const r = calculateRoofPitch({ mode: "slope", slope: 100 });
    expect(r.angleDegrees).toBeCloseTo(45, 5);
    expect(r.pitchRise12).toBeCloseTo(12, 5);
  });

  it("ratio rise=4 → 4/12 slope ≈ 33.33%, angle ≈ 18.43°", () => {
    const r = calculateRoofPitch({ mode: "ratio", rise: 4 });
    expect(r.slopePercent).toBeCloseTo(33.333, 2);
    expect(r.angleDegrees).toBeCloseTo(18.435, 2);
  });
});

describe("calculateRoofPitch - 카테고리 분류", () => {
  it("8° → flat", () => {
    expect(calculateRoofPitch({ mode: "angle", angle: 8 }).category).toBe(
      "flat",
    );
  });
  it("20° → lowSlope", () => {
    expect(calculateRoofPitch({ mode: "angle", angle: 20 }).category).toBe(
      "lowSlope",
    );
  });
  it("40° → mediumSlope", () => {
    expect(calculateRoofPitch({ mode: "angle", angle: 40 }).category).toBe(
      "mediumSlope",
    );
  });
  it("55° → steepSlope", () => {
    expect(calculateRoofPitch({ mode: "angle", angle: 55 }).category).toBe(
      "steepSlope",
    );
  });
  it("70° → extremeSlope", () => {
    expect(calculateRoofPitch({ mode: "angle", angle: 70 }).category).toBe(
      "extremeSlope",
    );
  });
});

describe("calculateRoofPitch - 입력 검증", () => {
  it("mode=angle인데 angle 미지정 거부", () => {
    expect(() => calculateRoofPitch({ mode: "angle" })).toThrow();
  });
  it("mode=ratio인데 rise 미지정 거부", () => {
    expect(() => calculateRoofPitch({ mode: "ratio" })).toThrow();
  });
});
