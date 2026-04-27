import { describe, expect, it } from "vitest";
import { calculateMaterialQuantity } from "./materialQuantity";

describe("calculateMaterialQuantity - OSB 11mm", () => {
  it("100m² 시공 + 10% 손실 → 110/2.9768 = 37매 (올림)", () => {
    const r = calculateMaterialQuantity({
      material: "osb11",
      areaM2: 100,
      wasteFactorPercent: 10,
    });
    // 110 ÷ 2.9768 = 36.95 → 37매
    expect(r.sheetsRequired).toBe(37);
    expect(r.adjustedAreaM2).toBeCloseTo(110, 5);
    expect(r.totalWeightKg).toBe(37 * 19);
    expect(r.unit).toBe("sheet");
  });

  it("손실률 0% → 정확히 (100/2.9768 = 33.6 → 34매)", () => {
    const r = calculateMaterialQuantity({
      material: "osb11",
      areaM2: 100,
      wasteFactorPercent: 0,
    });
    expect(r.sheetsRequired).toBe(34);
  });
});

describe("calculateMaterialQuantity - 석고보드", () => {
  it("50m² 12.5mm 석고 + 10% → 12.5/0.9 ≈ 34매", () => {
    const r = calculateMaterialQuantity({
      material: "gypsum12",
      areaM2: 50,
      wasteFactorPercent: 10,
    });
    // 55 / 1.62 = 33.95 → 34
    expect(r.sheetsRequired).toBe(34);
  });
});

describe("calculateMaterialQuantity - 못/스크류 추정", () => {
  it("OSB는 nail로 카운트", () => {
    const r = calculateMaterialQuantity({
      material: "osb11",
      areaM2: 100,
      wasteFactorPercent: 10,
    });
    expect(r.fastenerType).toBe("nail");
    expect(r.estimatedFasteners).toBeGreaterThan(0);
  });

  it("석고보드는 screw로 카운트", () => {
    const r = calculateMaterialQuantity({
      material: "gypsum12",
      areaM2: 100,
      wasteFactorPercent: 10,
    });
    expect(r.fastenerType).toBe("screw");
  });

  it("estimateFasteners=false면 추정 없음", () => {
    const r = calculateMaterialQuantity({
      material: "osb11",
      areaM2: 100,
      wasteFactorPercent: 10,
      estimateFasteners: false,
    });
    expect(r.estimatedFasteners).toBeUndefined();
  });

  it("아스팔트 슁글은 못 추정 안 함 (시트 아님)", () => {
    const r = calculateMaterialQuantity({
      material: "asphaltShingle",
      areaM2: 50,
      wasteFactorPercent: 5,
    });
    expect(r.estimatedFasteners).toBeUndefined();
    expect(r.unit).toBe("bundle");
  });
});

describe("calculateMaterialQuantity - 입력 검증", () => {
  it("면적 0 거부", () => {
    expect(() =>
      calculateMaterialQuantity({
        material: "osb11",
        areaM2: 0,
        wasteFactorPercent: 10,
      }),
    ).toThrow();
  });
  it("손실률 50% 거부", () => {
    expect(() =>
      calculateMaterialQuantity({
        material: "osb11",
        areaM2: 100,
        wasteFactorPercent: 50,
      }),
    ).toThrow();
  });
});
