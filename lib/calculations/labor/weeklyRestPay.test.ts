import { describe, expect, it } from "vitest";
import { calculateWeeklyRestPay } from "./weeklyRestPay";

describe("calculateWeeklyRestPay - 표준 (주 40시간)", () => {
  it("시급 10,030원 + 주 40시간: 주 80,240 / 월 348,643", () => {
    const r = calculateWeeklyRestPay({ hourlyWage: 10_030, weeklyHours: 40 });
    expect(r.qualified).toBe(true);
    expect(r.restHours).toBe(8);
    expect(r.weeklyAmount).toBe(80_240); // 10030 × 8
    // 80240 × 4.345 = 348,642.8 → 반올림 348,643
    expect(r.monthlyAmount).toBe(348_643);
  });

  it("월급 입력 시 시급 자동 환산 (월 209시간 기준)", () => {
    const r = calculateWeeklyRestPay({
      monthlySalary: 2_096_270,
      weeklyHours: 40,
    });
    // 시급 = 2,096,270 / 209 = 10,029.999... → 10,030
    expect(r.hourlyWage).toBe(10_030);
    expect(r.weeklyAmount).toBe(80_240);
  });
});

describe("calculateWeeklyRestPay - 단시간 근로", () => {
  it("주 20시간: (20/40) × 8 = 4시간 × 시급", () => {
    const r = calculateWeeklyRestPay({ hourlyWage: 10_030, weeklyHours: 20 });
    expect(r.qualified).toBe(true);
    expect(r.restHours).toBe(4);
    expect(r.weeklyAmount).toBe(40_120); // 10030 × 4
  });

  it("주 15시간: 3시간 × 시급", () => {
    const r = calculateWeeklyRestPay({ hourlyWage: 10_030, weeklyHours: 15 });
    expect(r.qualified).toBe(true);
    expect(r.restHours).toBe(3); // (15/40) × 8 = 3
    expect(r.weeklyAmount).toBe(30_090);
  });

  it("주 30시간: 6시간 × 시급", () => {
    const r = calculateWeeklyRestPay({ hourlyWage: 12_000, weeklyHours: 30 });
    expect(r.restHours).toBe(6); // (30/40) × 8 = 6
    expect(r.weeklyAmount).toBe(72_000);
  });
});

describe("calculateWeeklyRestPay - 미발생", () => {
  it("주 14시간: qualified=false", () => {
    const r = calculateWeeklyRestPay({ hourlyWage: 10_030, weeklyHours: 14 });
    expect(r.qualified).toBe(false);
    expect(r.weeklyAmount).toBe(0);
  });

  it("주 10시간: 미발생", () => {
    const r = calculateWeeklyRestPay({ hourlyWage: 15_000, weeklyHours: 10 });
    expect(r.qualified).toBe(false);
  });
});

describe("calculateWeeklyRestPay - 8시간 상한", () => {
  it("주 50시간: 주휴 8시간으로 상한 적용", () => {
    // (50/40) × 8 = 10시간 → 8시간 상한
    const r = calculateWeeklyRestPay({ hourlyWage: 10_030, weeklyHours: 50 });
    expect(r.restHours).toBe(8);
    expect(r.weeklyAmount).toBe(80_240);
  });
});

describe("calculateWeeklyRestPay - 입력 검증", () => {
  it("시급·월급 모두 미입력: 에러", () => {
    const r = calculateWeeklyRestPay({ weeklyHours: 40 });
    expect(r.ok).toBe(false);
  });

  it("주 시간 0: 에러", () => {
    const r = calculateWeeklyRestPay({ hourlyWage: 10_030, weeklyHours: 0 });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.field === "weeklyHours")).toBe(true);
  });

  it("주 시간 음수: 에러", () => {
    const r = calculateWeeklyRestPay({ hourlyWage: 10_030, weeklyHours: -5 });
    expect(r.ok).toBe(false);
  });
});
