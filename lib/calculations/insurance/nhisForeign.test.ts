import { describe, it, expect } from "vitest";
import {
  calculateNhisForeign,
  nhisForeignInputSchema,
} from "./nhisForeign";

describe("foreign NHIS premium estimator (2026)", () => {
  it("직장가입자 보수월액 300만 — 건강 3.595% + 장기요양 13.14%", () => {
    const out = calculateNhisForeign(
      nhisForeignInputSchema.parse({
        enrollmentType: "employee",
        monthlyWage: 3_000_000,
      }),
    );
    expect(out.monthlyHealth).toBeCloseTo(107_850, 0); // 300만 × 3.595%
    expect(out.monthlyLongTermCare).toBeCloseTo(14_171.49, 0); // 107,850 × 13.14%
    expect(out.monthlyTotal).toBeCloseTo(122_021.49, 0);
    expect(out.annualTotal).toBeCloseTo(122_021.49 * 12, 0);
    expect(out.employerMonthly).toBeCloseTo(out.monthlyTotal, 0); // 사용자 동일 부담
  });

  it("직장가입자 상한 — 고소득은 건강보험료 상한 4,591,740 캡", () => {
    const out = calculateNhisForeign(
      nhisForeignInputSchema.parse({
        enrollmentType: "employee",
        monthlyWage: 150_000_000,
      }),
    );
    expect(out.monthlyHealth).toBe(4_591_740);
  });

  it("직장가입자 하한 — 저소득은 건강보험료 하한 10,080 적용", () => {
    const out = calculateNhisForeign(
      nhisForeignInputSchema.parse({
        enrollmentType: "employee",
        monthlyWage: 100_000,
      }),
    );
    expect(out.monthlyHealth).toBe(10_080);
  });

  it("지역가입자 일반 외국인 — 평균보험료 158,640원", () => {
    const out = calculateNhisForeign(
      nhisForeignInputSchema.parse({
        enrollmentType: "regional",
        isStudent: false,
      }),
    );
    expect(out.monthlyTotal).toBe(158_640);
    expect(out.annualTotal).toBe(158_640 * 12);
    expect(out.employerMonthly).toBe(0);
    expect(out.studentReductionApplied).toBe(false);
  });

  it("지역가입자 유학생 — 50% 경감 79,320원", () => {
    const out = calculateNhisForeign(
      nhisForeignInputSchema.parse({
        enrollmentType: "regional",
        isStudent: true,
      }),
    );
    expect(out.monthlyTotal).toBe(79_320);
    expect(out.studentReductionApplied).toBe(true);
  });
});
