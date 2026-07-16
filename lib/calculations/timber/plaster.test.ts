import { describe, it, expect } from "vitest";
import { calculatePlaster, plasterInputSchema } from "./plaster";

describe("calculatePlaster", () => {
  it("1:3 배합 10m² 24mm 할증 5% — 기본값", () => {
    const r = calculatePlaster(
      plasterInputSchema.parse({ area: 10, thickness: 24, mixRatio: "1:3", waste: 5 }),
    );
    expect(r.mortarM3).toBeCloseTo(0.252, 3); // 10 × 0.024 × 1.05
    expect(r.cementKg).toBe(129); // 0.252 × 510 ≈ 128.52 → 129
    expect(r.cementBags).toBe(4); // ceil(129 / 40)
    expect(r.sandM3).toBeCloseTo(0.28, 2); // 0.252 × 1.10 ≈ 0.2772
    expect(r.mixRatio).toBe("1:3");
  });

  it("1:2 배합(고강도)은 1m³당 시멘트 680kg", () => {
    const r = calculatePlaster(
      plasterInputSchema.parse({ area: 10, thickness: 24, mixRatio: "1:2", waste: 0 }),
    );
    expect(r.mortarM3).toBeCloseTo(0.24, 3); // 10 × 0.024
    expect(r.cementKg).toBe(163); // 0.24 × 680 = 163.2 → 163
    expect(r.cementBags).toBe(5); // ceil(163 / 40)
    expect(r.sandM3).toBeCloseTo(0.24, 2); // 0.24 × 0.98 = 0.2352
  });

  it("1:4 배합(저강도)은 1m³당 시멘트 385kg", () => {
    const r = calculatePlaster(
      plasterInputSchema.parse({ area: 10, thickness: 24, mixRatio: "1:4", waste: 0 }),
    );
    expect(r.mortarM3).toBeCloseTo(0.24, 3);
    expect(r.cementKg).toBe(92); // 0.24 × 385 = 92.4 → 92
    expect(r.cementBags).toBe(3); // ceil(92 / 40)
    expect(r.sandM3).toBeCloseTo(0.26, 2); // 0.24 × 1.10 = 0.264
  });

  it("면적 0이면 전부 0", () => {
    const r = calculatePlaster(plasterInputSchema.parse({ area: 0 }));
    expect(r.mortarM3).toBe(0);
    expect(r.cementKg).toBe(0);
    expect(r.cementBags).toBe(0);
    expect(r.sandM3).toBe(0);
  });

  it("두께·할증률을 바꾸면 부피에 비례 반영 (20m² 30mm 할증 10%)", () => {
    const r = calculatePlaster(
      plasterInputSchema.parse({ area: 20, thickness: 30, mixRatio: "1:3", waste: 10 }),
    );
    expect(r.mortarM3).toBeCloseTo(0.66, 3); // 20 × 0.03 × 1.10
    expect(r.cementKg).toBe(337); // 0.66 × 510 = 336.6 → 337
    expect(r.cementBags).toBe(9); // ceil(337 / 40)
    expect(r.sandM3).toBeCloseTo(0.73, 2); // 0.66 × 1.10 = 0.726
  });

  it("기본값(파라미터 미지정)은 두께 24mm·배합비 1:3·할증 5%", () => {
    const r = calculatePlaster(plasterInputSchema.parse({ area: 10 }));
    expect(r.mixRatio).toBe("1:3");
    expect(r.mortarM3).toBeCloseTo(0.252, 3);
  });
});
