import { describe, it, expect } from "vitest";
import { calculateBtu, btuInputSchema } from "./btu";

const btu = (o: Record<string, unknown>) => btuInputSchema.parse(o);

describe("냉난방 BTU", () => {
  it("20m² 기본 → 12,000 BTU", () => {
    const out = calculateBtu(
      btu({ areaM2: 20, ceilingHeight: 2.4, sunExposure: "normal", occupants: 2, isKitchen: false }),
    );
    expect(out.baseBtu).toBe(12000); // 20 × 600
    expect(out.adjustedBtu).toBe(12000);
  });

  it("일조 강함 → +10%", () => {
    const out = calculateBtu(
      btu({ areaM2: 20, sunExposure: "high", occupants: 2 }),
    );
    expect(out.adjustedBtu).toBe(13200); // 12000 × 1.1
  });

  it("인원 5명 → +1,800 (3명 초과분)", () => {
    const out = calculateBtu(
      btu({ areaM2: 20, occupants: 5 }),
    );
    expect(out.adjustedBtu).toBe(12000 + 1800);
  });

  it("주방 → +4,000", () => {
    const out = calculateBtu(btu({ areaM2: 20, isKitchen: true }));
    expect(out.adjustedBtu).toBe(16000);
  });

  it("천장 3m → 비례 증가", () => {
    const out = calculateBtu(btu({ areaM2: 20, ceilingHeight: 3.0 }));
    expect(out.adjustedBtu).toBeGreaterThan(12000);
  });

  it("한국 평형 환산 + kW", () => {
    const out = calculateBtu(btu({ areaM2: 20 }));
    // 12000 / 1440 ≈ 8.3평형
    expect(out.koreanPyeongType).toBeCloseTo(8.3, 1);
    expect(out.kw).toBeGreaterThan(0);
  });
});
