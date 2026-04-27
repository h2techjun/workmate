import { describe, expect, it } from "vitest";
import { calculateInsurance } from "./fourMajorInsurance";

describe("calculateInsurance - 표준 케이스 (월 300만원)", () => {
  it("국민연금: 3,000,000 × 4.5% = 135,000 (각 부담)", () => {
    const r = calculateInsurance({ monthlySalary: 3_000_000 });
    const pension = r.lines.find((l) => l.key === "nationalPension");
    expect(pension?.employee).toBe(135_000);
    expect(pension?.employer).toBe(135_000);
  });

  it("건강보험: 3,000,000 × 3.545% = 106,350 (각)", () => {
    const r = calculateInsurance({ monthlySalary: 3_000_000 });
    const health = r.lines.find((l) => l.key === "healthInsurance");
    expect(health?.employee).toBe(106_350);
    expect(health?.employer).toBe(106_350);
  });

  it("장기요양: 건강보험료 합계 × 12.95% / 2 ≈ 13,770", () => {
    const r = calculateInsurance({ monthlySalary: 3_000_000 });
    const ltc = r.lines.find((l) => l.key === "longTermCare");
    // (106350 × 2) × 0.1295 / 2 = 13,772.32... → 절사 13,770
    expect(ltc?.employee).toBe(13_770);
    expect(ltc?.employer).toBe(13_770);
  });

  it("고용보험 실업급여: 3,000,000 × 0.9% = 27,000 (각)", () => {
    const r = calculateInsurance({ monthlySalary: 3_000_000 });
    const emp = r.lines.find((l) => l.key === "employmentUnemployment");
    expect(emp?.employee).toBe(27_000);
    expect(emp?.employer).toBe(27_000);
  });

  it("산재보험: 사용자만 (평균 0.86%)", () => {
    const r = calculateInsurance({ monthlySalary: 3_000_000 });
    const accident = r.lines.find((l) => l.key === "industrialAccident");
    expect(accident?.employee).toBe(0);
    // 3,000,000 × 0.0086 = 25,800
    expect(accident?.employer).toBe(25_800);
  });
});

describe("calculateInsurance - 합계 검증", () => {
  it("월 300만원: 근로자 부담 합 + 실수령액 = 월급여", () => {
    const r = calculateInsurance({ monthlySalary: 3_000_000 });
    expect(r.totalEmployee + r.netSalary).toBe(3_000_000);
    expect(r.totalEmployer).toBeGreaterThan(0);
  });
});

describe("calculateInsurance - 국민연금 상한", () => {
  it("월 700만원 → 기준소득월액 상한 617만원 적용", () => {
    const r = calculateInsurance({ monthlySalary: 7_000_000 });
    expect(r.pensionBase).toBe(6_170_000);
    const pension = r.lines.find((l) => l.key === "nationalPension");
    // 6,170,000 × 4.5% = 277,650
    expect(pension?.employee).toBe(277_650);
    expect(r.warnings.some((w) => w.key === "pensionCapped")).toBe(true);
  });
});

describe("calculateInsurance - 산재보험 요율 변경", () => {
  it("custom 0.02 (2%) 적용", () => {
    const r = calculateInsurance({
      monthlySalary: 3_000_000,
      industrialAccidentRate: 0.02,
    });
    const accident = r.lines.find((l) => l.key === "industrialAccident");
    // 3,000,000 × 0.02 = 60,000
    expect(accident?.employer).toBe(60_000);
  });
});

describe("calculateInsurance - 입력 검증", () => {
  it("음수 급여 거부", () => {
    expect(() => calculateInsurance({ monthlySalary: -100 })).toThrow();
  });
  it("월 1억 초과 거부", () => {
    expect(() =>
      calculateInsurance({ monthlySalary: 200_000_000 }),
    ).toThrow();
  });
});
