import { describe, it, expect } from "vitest";
import {
  calculateCarAcquisitionTax,
  calculateCarAnnualTax,
  carAcqInputSchema,
  carAnnualInputSchema,
} from "./carTax";

const acq = (o: Record<string, unknown>) => carAcqInputSchema.parse(o);
const ann = (o: Record<string, unknown>) => carAnnualInputSchema.parse(o);

describe("자동차 취득세", () => {
  it("승용차 3,000만 → 7% = 210만", () => {
    const out = calculateCarAcquisitionTax(
      acq({ price: 30_000_000, carType: "passenger" }),
    );
    expect(out.rate).toBe(0.07);
    expect(out.acquisitionTax).toBe(2_100_000);
    expect(out.total).toBe(2_100_000);
  });

  it("경차 1,000만 → 4% = 40만, 50만 이하 면제", () => {
    const out = calculateCarAcquisitionTax(
      acq({ price: 10_000_000, carType: "light" }),
    );
    // 40만 ≤ 50만 → 면제
    expect(out.total).toBe(0);
  });

  it("친환경차 5,000만 → 7% 350만 − 140만 감면 = 210만", () => {
    const out = calculateCarAcquisitionTax(
      acq({ price: 50_000_000, carType: "eco" }),
    );
    expect(out.acquisitionTax).toBe(3_500_000);
    expect(out.ecoDiscount).toBe(1_400_000);
    expect(out.total).toBe(2_100_000);
  });
});

describe("자동차세 (연간)", () => {
  it("1600cc 신차 → 1600×140 = 224,000 + 교육세 30%", () => {
    const out = calculateCarAnnualTax(ann({ displacement: 1600, carAge: 0 }));
    expect(out.baseTax).toBe(224_000);
    expect(out.carTax).toBe(224_000);
    expect(out.eduTax).toBe(67_200);
    expect(out.total).toBe(291_200);
  });

  it("2000cc → cc당 200원 = 40만", () => {
    const out = calculateCarAnnualTax(ann({ displacement: 2000, carAge: 0 }));
    expect(out.baseTax).toBe(400_000);
  });

  it("차령 5년 → 15% 경감 (3년차부터 5%씩)", () => {
    const out = calculateCarAnnualTax(ann({ displacement: 2000, carAge: 5 }));
    expect(out.ageDiscountRate).toBeCloseTo(0.15, 4);
    expect(out.carTax).toBeLessThan(400_000);
  });

  it("차령 12년+ → 최대 50% 경감", () => {
    const out = calculateCarAnnualTax(ann({ displacement: 2000, carAge: 15 }));
    expect(out.ageDiscountRate).toBe(0.5);
  });

  it("전기차 정액 13만원", () => {
    const out = calculateCarAnnualTax(
      ann({ displacement: 0, carAge: 0, isElectric: true }),
    );
    expect(out.baseTax).toBe(130_000);
  });

  it("반기 납부 = 연간/2", () => {
    const out = calculateCarAnnualTax(ann({ displacement: 1600, carAge: 0 }));
    expect(out.halfYear).toBeCloseTo(out.total / 2, -1);
  });
});
