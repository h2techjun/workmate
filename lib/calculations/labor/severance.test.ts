import { describe, expect, it } from "vitest";
import { calculateSeverance } from "./severance";

describe("calculateSeverance - 1년 미만", () => {
  it("11개월 근속: 발생 안 함", () => {
    const r = calculateSeverance({
      hireDate: "2025-06-01",
      resignDate: "2026-05-01",
      recentThreeMonthsSalary: 9_000_000,
    });
    expect(r.ok).toBe(true);
    expect(r.qualified).toBe(false);
    expect(r.severance).toBe(0);
  });

  it("363일: 발생 안 함", () => {
    const r = calculateSeverance({
      hireDate: "2025-05-04",
      resignDate: "2026-05-02",
      recentThreeMonthsSalary: 9_000_000,
    });
    expect(r.qualified).toBe(false);
  });
});

describe("calculateSeverance - 1년 이상 표준 케이스", () => {
  it("3년 근속 + 월 300만원: 평균 100,000 × 30 × 1095/365", () => {
    const r = calculateSeverance({
      hireDate: "2023-05-02",
      resignDate: "2026-05-02",
      recentThreeMonthsSalary: 9_000_000, // 월 300만 × 3
    });
    // 3년 = 365 × 3 = 1095일 (윤년 무시)
    // 평균 = 9,000,000 / 90 = 100,000
    // 퇴직금 = 100,000 × 30 × (1095/365) = 9,000,000
    expect(r.qualified).toBe(true);
    expect(r.averageDailyWage).toBe(100_000);
    // 실제 윤년 영향으로 약간 다를 수 있음, range 검증
    expect(r.severance).toBeGreaterThan(8_900_000);
    expect(r.severance).toBeLessThan(9_100_000);
  });

  it("정확히 1년", () => {
    const r = calculateSeverance({
      hireDate: "2025-05-02",
      resignDate: "2026-05-02",
      recentThreeMonthsSalary: 9_000_000,
    });
    expect(r.qualified).toBe(true);
    // 평균 100,000 × 30 = 3,000,000
    expect(r.severance).toBeGreaterThan(2_900_000);
    expect(r.severance).toBeLessThan(3_100_000);
  });

  it("연간 상여금 + 연차수당 포함", () => {
    const r = calculateSeverance({
      hireDate: "2025-05-02",
      resignDate: "2026-05-02",
      recentThreeMonthsSalary: 9_000_000,
      annualBonus: 4_000_000, // 3/12 = 1,000,000 추가
      annualLeavePay: 800_000, // 3/12 = 200,000 추가
    });
    // 총 3개월 기준 = 9,000,000 + 1,000,000 + 200,000 = 10,200,000
    // 평균 = 10,200,000 / 90 = 113,333.3 → 반올림 113,333
    expect(r.averageDailyWage).toBe(113_333);
  });
});

describe("calculateSeverance - 통상임금 비교", () => {
  it("통상임금이 평균임금보다 높으면 통상임금 적용", () => {
    const r = calculateSeverance({
      hireDate: "2025-05-02",
      resignDate: "2026-05-02",
      recentThreeMonthsSalary: 9_000_000, // 평균 100,000
      monthlyOrdinaryWage: 4_000_000, // 4M / 209 × 8 = 153,110 → 더 높음
    });
    expect(r.ordinaryDailyWage).toBeGreaterThan(r.averageDailyWage);
    expect(r.appliedDailyWage).toBe(r.ordinaryDailyWage);
  });

  it("평균임금이 통상임금보다 높으면 평균임금 적용", () => {
    const r = calculateSeverance({
      hireDate: "2025-05-02",
      resignDate: "2026-05-02",
      recentThreeMonthsSalary: 12_000_000, // 평균 = 133,333
      monthlyOrdinaryWage: 2_000_000, // 일 76,555
    });
    expect(r.appliedDailyWage).toBe(r.averageDailyWage);
  });
});

describe("calculateSeverance - 입력 검증", () => {
  it("입사일 누락", () => {
    const r = calculateSeverance({
      hireDate: "",
      resignDate: "2026-05-02",
      recentThreeMonthsSalary: 9_000_000,
    });
    expect(r.ok).toBe(false);
  });

  it("퇴사일 ≤ 입사일", () => {
    const r = calculateSeverance({
      hireDate: "2026-05-02",
      resignDate: "2025-05-02",
      recentThreeMonthsSalary: 9_000_000,
    });
    expect(r.ok).toBe(false);
    expect(
      r.errors.some((e) => e.messageKey === "validation.hireBeforeResign"),
    ).toBe(true);
  });

  it("월급 0", () => {
    const r = calculateSeverance({
      hireDate: "2024-05-02",
      resignDate: "2026-05-02",
      recentThreeMonthsSalary: 0,
    });
    expect(r.ok).toBe(false);
  });
});

describe("calculateSeverance - 근속 분해", () => {
  it("2년 0개월 0일", () => {
    const r = calculateSeverance({
      hireDate: "2024-05-02",
      resignDate: "2026-05-02",
      recentThreeMonthsSalary: 9_000_000,
    });
    expect(r.serviceBreakdown.years).toBe(2);
    expect(r.serviceBreakdown.months).toBe(0);
  });

  it("1년 6개월", () => {
    const r = calculateSeverance({
      hireDate: "2024-11-02",
      resignDate: "2026-05-02",
      recentThreeMonthsSalary: 9_000_000,
    });
    expect(r.serviceBreakdown.years).toBe(1);
    expect(r.serviceBreakdown.months).toBe(6);
  });
});
