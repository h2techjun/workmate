import { describe, expect, it } from "vitest";
import { calculateConcrete } from "./concrete";

describe("calculateConcrete - 줄기초", () => {
  it("0.4×0.6×40m + 5% 손실 → 9.6m³ × 1.05 = 10.08m³", () => {
    const r = calculateConcrete({
      type: "stripFooting",
      widthM: 0.4,
      depthOrThicknessM: 0.6,
      lengthM: 40,
      wasteFactorPercent: 5,
    });
    expect(r.rawVolumeM3).toBeCloseTo(9.6, 5);
    expect(r.adjustedVolumeM3).toBeCloseTo(10.08, 5);
  });

  it("기본 철근 밀도 90kg/m³ 적용", () => {
    const r = calculateConcrete({
      type: "stripFooting",
      widthM: 0.4,
      depthOrThicknessM: 0.6,
      lengthM: 40,
    });
    // raw = 9.6, +5% = 10.08, rebar = 10.08 × 90 = 907.2
    expect(r.rebarKg).toBeCloseTo(907.2, 1);
  });

  it("레미콘 트럭 = 부피 / 6m³", () => {
    const r = calculateConcrete({
      type: "stripFooting",
      widthM: 0.4,
      depthOrThicknessM: 0.6,
      lengthM: 40,
      wasteFactorPercent: 0,
    });
    expect(r.remicon6m3Trucks).toBeCloseTo(9.6 / 6, 3);
  });
});

describe("calculateConcrete - 매트기초", () => {
  it("10m × 10m × 0.3m → 30m³", () => {
    const r = calculateConcrete({
      type: "matSlab",
      widthM: 10,
      depthOrThicknessM: 0.3,
      lengthM: 10,
      wasteFactorPercent: 0,
    });
    expect(r.rawVolumeM3).toBe(30);
    expect(r.type).toBe("matSlab");
  });
});

describe("calculateConcrete - 입력 검증", () => {
  it("폭 0 거부", () => {
    expect(() =>
      calculateConcrete({
        type: "stripFooting",
        widthM: 0,
        depthOrThicknessM: 0.6,
        lengthM: 40,
      }),
    ).toThrow();
  });
  it("철근 400kg/m³ 거부 (최대 300)", () => {
    expect(() =>
      calculateConcrete({
        type: "stripFooting",
        widthM: 0.4,
        depthOrThicknessM: 0.6,
        lengthM: 40,
        rebarDensityKgPerM3: 400,
      }),
    ).toThrow();
  });
});

describe("calculateConcrete - 결과 형태", () => {
  it("calculationSteps 4단계", () => {
    const r = calculateConcrete({
      type: "stripFooting",
      widthM: 0.4,
      depthOrThicknessM: 0.6,
      lengthM: 40,
    });
    expect(r.calculationSteps.map((s) => s.key)).toEqual([
      "rawVolume",
      "wasteAdjusted",
      "rebar",
      "remicon",
    ]);
  });
});
