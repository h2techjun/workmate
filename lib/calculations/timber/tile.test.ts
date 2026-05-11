import { describe, it, expect } from "vitest";
import { calculateTile, tileInputSchema } from "./tile";

describe("tile calculator", () => {
  it("300x300 타일, 10m², 줄눈 2mm, 손실 10%", () => {
    const input = tileInputSchema.parse({
      areaM2: 10,
      tileWidthMm: 300,
      tileHeightMm: 300,
      groutMm: 2,
      wasteFactorPercent: 10,
    });
    const out = calculateTile(input);
    // footprint = (0.302)² = 0.091204
    // adjustedArea = 11
    // count = ceil(11 / 0.091204) = 121
    expect(out.tileCount).toBe(121);
    expect(out.adhesiveKg).toBe(40); // 10 × 4
    expect(out.groutKg).toBeGreaterThan(0);
  });

  it("600x600 타일, 50m², 큰 타일은 매수 적음", () => {
    const input = tileInputSchema.parse({
      areaM2: 50,
      tileWidthMm: 600,
      tileHeightMm: 600,
      groutMm: 2,
    });
    const out = calculateTile(input);
    // footprint = (0.602)² = 0.362404
    // adjustedArea = 55
    // count = ceil(55 / 0.362404) = 152
    expect(out.tileCount).toBe(152);
  });

  it("줄눈 0 — grout 무게 0", () => {
    const input = tileInputSchema.parse({
      areaM2: 10,
      tileWidthMm: 300,
      tileHeightMm: 300,
      groutMm: 0,
      wasteFactorPercent: 0,
    });
    const out = calculateTile(input);
    expect(out.groutKg).toBe(0);
  });

  it("schema: tile width too small → error", () => {
    expect(() =>
      tileInputSchema.parse({
        areaM2: 10,
        tileWidthMm: 30,
        tileHeightMm: 300,
      }),
    ).toThrow();
  });
});
