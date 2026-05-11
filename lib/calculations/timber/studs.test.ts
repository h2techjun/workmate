import { describe, it, expect } from "vitest";
import { calculateStuds, studsInputSchema } from "./studs";

describe("studs calculator", () => {
  it("8m 벽, 층고 2400, 16인치 간격 — 본수·길이 검증", () => {
    const input = studsInputSchema.parse({
      wallLengthM: 8,
      ceilingHeightMm: 2400,
      spacingMm: 406,
      openings: 0,
      wasteFactorPercent: 0,
    });
    const out = calculateStuds(input);
    // 8000mm / 406 = 19.7 → ceil = 20, +1 = 21
    expect(out.studCount).toBe(21);
    // 2400 − 38×3 = 2286
    expect(out.studLengthMm).toBe(2286);
    expect(out.topPlateTotalLengthM).toBe(16); // 8 × 2
    expect(out.solePlateTotalLengthM).toBe(8);
    expect(out.headerCount).toBe(0);
  });

  it("개구부 2개 — jack/king 추가 + 헤더 본수", () => {
    const input = studsInputSchema.parse({
      wallLengthM: 6,
      ceilingHeightMm: 2400,
      spacingMm: 406,
      openings: 2,
      wasteFactorPercent: 0,
    });
    const out = calculateStuds(input);
    // 6000/406 = 14.78 → 15, +1 = 16
    // +개구부 2×4 = 8
    // 16+8 = 24
    expect(out.studCount).toBe(24);
    // 개구부 2개 × 2본 = 4 헤더
    expect(out.headerCount).toBe(4);
  });

  it("손실률 10% 적용", () => {
    const input = studsInputSchema.parse({
      wallLengthM: 10,
      ceilingHeightMm: 2400,
      spacingMm: 406,
      openings: 0,
      wasteFactorPercent: 10,
    });
    const out = calculateStuds(input);
    // 10000/406 = 24.63 → 25, +1 = 26
    // 26 × 1.1 = 28.6 → ceil = 29
    expect(out.studCount).toBe(29);
  });

  it("24인치 간격 — 본수 감소", () => {
    const input = studsInputSchema.parse({
      wallLengthM: 8,
      ceilingHeightMm: 2400,
      spacingMm: 610,
      openings: 0,
      wasteFactorPercent: 0,
    });
    const out = calculateStuds(input);
    // 8000/610 = 13.11 → 14, +1 = 15
    expect(out.studCount).toBe(15);
  });

  it("invalid spacing → schema error", () => {
    expect(() =>
      studsInputSchema.parse({
        wallLengthM: 5,
        ceilingHeightMm: 2400,
        spacingMm: 500, // not in [406, 610]
      }),
    ).toThrow();
  });
});
