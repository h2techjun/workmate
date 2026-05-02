import { describe, expect, it } from "vitest";
import { calculateMinWageMonthly } from "./minWageMonthly";

describe("calculateMinWageMonthly - 표준 케이스", () => {
  it("2025 최저시급 10,030원 + 주 40시간 + 주휴포함 → 월 2,096,270원", () => {
    const r = calculateMinWageMonthly({ year: "2025" });
    // 10,030 × 209 = 2,096,270
    expect(r.hourlyWage).toBe(10_030);
    expect(r.monthlyHours).toBe(209);
    expect(r.monthlySalary).toBe(2_096_270);
  });

  it("연봉 = 월급 × 12", () => {
    const r = calculateMinWageMonthly({ year: "2025" });
    expect(r.annualSalary).toBe(2_096_270 * 12);
  });

  it("주휴 미포함 — 월 174시간 (주 40 × 4.345)", () => {
    const r = calculateMinWageMonthly({
      year: "2025",
      includeWeeklyRest: false,
    });
    // 40 × 4.345 = 173.8 → 반올림 174
    expect(r.monthlyHours).toBe(174);
    expect(r.monthlySalary).toBe(10_030 * 174);
  });
});

describe("calculateMinWageMonthly - 단축 근로", () => {
  it("주 20시간 + 주휴 포함 (단시간 근로자)", () => {
    const r = calculateMinWageMonthly({
      hourlyWage: 12_000,
      weeklyHours: 20,
      includeWeeklyRest: true,
    });
    // dailyRest = min(20/5, 8) = 4
    // 월 시간 = (20 + 4) × 4.345 = 104.28 → 반올림 104
    expect(r.monthlyHours).toBe(104);
    expect(r.monthlySalary).toBe(12_000 * 104);
  });

  it("주 15시간 + 주휴 포함", () => {
    const r = calculateMinWageMonthly({
      hourlyWage: 10_030,
      weeklyHours: 15,
    });
    // dailyRest = min(15/5, 8) = 3
    // 월 시간 = (15 + 3) × 4.345 = 78.21 → 78
    expect(r.monthlyHours).toBe(78);
  });
});

describe("calculateMinWageMonthly - 시급 입력", () => {
  it("시급 직접 입력: 15,000원 × 209시간", () => {
    const r = calculateMinWageMonthly({ hourlyWage: 15_000 });
    expect(r.monthlySalary).toBe(15_000 * 209);
  });

  it("시급 0 또는 미입력: 최저시급 fallback", () => {
    const r = calculateMinWageMonthly({ year: "2025" });
    expect(r.hourlyWage).toBe(10_030);
  });
});

describe("calculateMinWageMonthly - 주휴수당 분리", () => {
  it("주 40시간 주휴 포함: 주휴분 = 8시간/주 × 4.345주", () => {
    const r = calculateMinWageMonthly({ year: "2025" });
    // 주휴 시간 = 209 - round(40 × 4.345) = 209 - 174 = 35
    // 주휴수당 = 10030 × 35 = 351,050
    expect(r.weeklyRestPay).toBe(10_030 * 35);
  });

  it("주휴 미포함 시 weeklyRestPay = 0", () => {
    const r = calculateMinWageMonthly({
      year: "2025",
      includeWeeklyRest: false,
    });
    expect(r.weeklyRestPay).toBe(0);
  });
});
