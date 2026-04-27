import { describe, expect, it } from "vitest";
import { calculateLumber } from "./lumber";

describe("calculateLumber - 표준 케이스 (2x4 SPF × 10개, 3600mm)", () => {
  it("부피·BF·재·무게 정확", () => {
    const r = calculateLumber({
      widthMM: 89,
      thicknessMM: 38,
      lengthMM: 3600,
      quantity: 10,
      species: "spf",
    });
    // 1개 부피 = 89 × 38 × 3600 / 1e9 = 0.0121752 m³
    expect(r.perPieceVolumeM3).toBeCloseTo(0.0121752, 6);
    // 10개 → 0.121752 m³
    expect(r.totalVolumeM3).toBeCloseTo(0.121752, 5);
    // 보드피트 = 0.121752 / 0.002359737 ≈ 51.59
    expect(r.boardFeet).toBeCloseTo(51.59, 1);
    // 재 = 0.121752 / 0.003342 ≈ 36.43
    expect(r.sai).toBeCloseTo(36.43, 1);
    // 무게 = 0.121752 × 460 ≈ 56kg
    expect(r.weightKg).toBeCloseTo(56.006, 1);
    expect(r.density).toBe(460);
  });
});

describe("calculateLumber - 수종별 비중", () => {
  it("참나무가 삼나무보다 무겁다", () => {
    const oak = calculateLumber({
      widthMM: 100,
      thicknessMM: 100,
      lengthMM: 1000,
      quantity: 1,
      species: "oak",
    });
    const cedar = calculateLumber({
      widthMM: 100,
      thicknessMM: 100,
      lengthMM: 1000,
      quantity: 1,
      species: "cedar",
    });
    expect(oak.weightKg).toBeGreaterThan(cedar.weightKg);
    expect(oak.density).toBe(750);
    expect(cedar.density).toBe(380);
  });

  it("species 미지정 시 기본 spf 적용", () => {
    const r = calculateLumber({
      widthMM: 89,
      thicknessMM: 38,
      lengthMM: 3600,
      quantity: 1,
    });
    expect(r.density).toBe(460);
  });
});

describe("calculateLumber - 입력 검증", () => {
  it("폭 5mm 거부", () => {
    expect(() =>
      calculateLumber({
        widthMM: 5,
        thicknessMM: 38,
        lengthMM: 3600,
        quantity: 1,
      }),
    ).toThrow();
  });
  it("수량 0 거부", () => {
    expect(() =>
      calculateLumber({
        widthMM: 89,
        thicknessMM: 38,
        lengthMM: 3600,
        quantity: 0,
      }),
    ).toThrow();
  });
  it("수량 정수 아니면 거부", () => {
    expect(() =>
      calculateLumber({
        widthMM: 89,
        thicknessMM: 38,
        lengthMM: 3600,
        quantity: 2.5,
      }),
    ).toThrow();
  });
});
