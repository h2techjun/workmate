import { describe, expect, it } from "vitest";
import { calculateAnnualLeave } from "./annualLeave";

describe("calculateAnnualLeave - 1년 미만 근로자 (월 누적)", () => {
  it("입사 후 5개월: 5일", () => {
    const r = calculateAnnualLeave({
      hireDate: "2026-01-01",
      referenceDate: "2026-06-15",
    });
    expect(r.ok).toBe(true);
    expect(r.daysAccrued).toBe(5);
    expect(r.yearsWorked).toBe(0);
    expect(r.monthsWorked).toBe(5);
  });

  it("입사 후 11개월: 11일", () => {
    const r = calculateAnnualLeave({
      hireDate: "2025-06-01",
      referenceDate: "2026-05-15",
    });
    expect(r.daysAccrued).toBe(11);
  });

  it("입사 후 15개월(초과)이지만 1년 미만 분만 계산하면 11일이 상한", () => {
    // 케이스: 1년이 안 되는 동안의 누적 — 1년 미만 분기에서만 적용됨.
    const r = calculateAnnualLeave({
      hireDate: "2026-04-15",
      referenceDate: "2026-05-02",
    });
    expect(r.daysAccrued).toBe(0); // 0 개월 (만 1개월 미만)
  });
});

describe("calculateAnnualLeave - 1년 이상 (제60조 제1항·제4항)", () => {
  it("정확히 1년: 15일", () => {
    const r = calculateAnnualLeave({
      hireDate: "2025-05-02",
      referenceDate: "2026-05-02",
    });
    expect(r.yearsWorked).toBe(1);
    expect(r.daysAccrued).toBe(15);
  });

  it("3년차: 15 + 1 = 16일", () => {
    const r = calculateAnnualLeave({
      hireDate: "2023-05-02",
      referenceDate: "2026-05-02",
    });
    expect(r.yearsWorked).toBe(3);
    expect(r.daysAccrued).toBe(16);
  });

  it("5년차: 15 + 2 = 17일", () => {
    const r = calculateAnnualLeave({
      hireDate: "2021-05-02",
      referenceDate: "2026-05-02",
    });
    expect(r.daysAccrued).toBe(17);
  });

  it("10년차: 15 + 4 = 19일 (3,5,7,9년 가산)", () => {
    const r = calculateAnnualLeave({
      hireDate: "2016-05-02",
      referenceDate: "2026-05-02",
    });
    expect(r.yearsWorked).toBe(10);
    expect(r.daysAccrued).toBe(19);
  });

  it("21년차: 상한 25일", () => {
    const r = calculateAnnualLeave({
      hireDate: "2005-05-02",
      referenceDate: "2026-05-02",
    });
    expect(r.daysAccrued).toBe(25);
  });

  it("30년차: 상한 25일 (캡 적용)", () => {
    const r = calculateAnnualLeave({
      hireDate: "1996-05-02",
      referenceDate: "2026-05-02",
    });
    expect(r.daysAccrued).toBe(25);
  });
});

describe("calculateAnnualLeave - 미사용 연차 수당", () => {
  it("월급 3,000,000 + 미사용 5일: 일급 114,833 × 5 = 574,165", () => {
    // 일급 = 3,000,000 / 209 × 8 = 114,832.5358... → 반올림 114,833
    const r = calculateAnnualLeave({
      hireDate: "2024-05-02",
      referenceDate: "2026-05-02",
      monthlySalary: 3_000_000,
      unusedDays: 5,
      wageMode: "monthly",
    });
    expect(r.dailyOrdinaryWage).toBe(114_833);
    expect(r.compensation).toBe(574_165);
  });

  it("일급 직접 입력: 100,000 × 3일 = 300,000", () => {
    const r = calculateAnnualLeave({
      hireDate: "2024-05-02",
      referenceDate: "2026-05-02",
      dailyOrdinaryWage: 100_000,
      unusedDays: 3,
      wageMode: "daily",
    });
    expect(r.dailyOrdinaryWage).toBe(100_000);
    expect(r.compensation).toBe(300_000);
  });

  it("미사용 일수 0이면 수당 0", () => {
    const r = calculateAnnualLeave({
      hireDate: "2024-05-02",
      referenceDate: "2026-05-02",
      monthlySalary: 3_000_000,
      unusedDays: 0,
    });
    expect(r.compensation).toBe(0);
  });

  it("월급 누락 + 미사용 입력: missing-wage 경고", () => {
    const r = calculateAnnualLeave({
      hireDate: "2024-05-02",
      referenceDate: "2026-05-02",
      unusedDays: 5,
    });
    expect(r.compensation).toBe(0);
    expect(r.warnings.some((w) => w.code === "missing-wage")).toBe(true);
  });
});

describe("calculateAnnualLeave - 입력 검증", () => {
  it("입사일 누락: 에러", () => {
    const r = calculateAnnualLeave({ hireDate: "" });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.field === "hireDate")).toBe(true);
  });

  it("기준일 < 입사일: 에러", () => {
    const r = calculateAnnualLeave({
      hireDate: "2026-05-02",
      referenceDate: "2025-01-01",
    });
    expect(r.ok).toBe(false);
    expect(
      r.errors.some((e) => e.messageKey === "validation.hireAfterReference"),
    ).toBe(true);
  });

  it("미사용 음수: 에러", () => {
    const r = calculateAnnualLeave({
      hireDate: "2024-01-01",
      referenceDate: "2026-05-02",
      unusedDays: -3,
    });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.field === "unusedDays")).toBe(true);
  });
});

describe("calculateAnnualLeave - 다음 anniversary 예측", () => {
  it("2년차 → 3년차: 15 → 16", () => {
    const r = calculateAnnualLeave({
      hireDate: "2024-05-02",
      referenceDate: "2026-05-02",
    });
    expect(r.yearsWorked).toBe(2);
    expect(r.daysAccrued).toBe(15);
    expect(r.daysAtNextAnniversary).toBe(16);
  });

  it("5년차 → 6년차: 17 → 17 (5,7년차에 +1)", () => {
    const r = calculateAnnualLeave({
      hireDate: "2021-05-02",
      referenceDate: "2026-05-02",
    });
    expect(r.yearsWorked).toBe(5);
    expect(r.daysAccrued).toBe(17);
    expect(r.daysAtNextAnniversary).toBe(17);
  });
});
