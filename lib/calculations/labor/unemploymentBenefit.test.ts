import { describe, it, expect } from "vitest";
import {
  calculateUnemploymentBenefit,
  unemploymentBenefitInputSchema,
  DAILY_BENEFIT_CAP,
  DAILY_BENEFIT_FLOOR,
} from "./unemploymentBenefit";

const parse = (o: Record<string, unknown>) =>
  unemploymentBenefitInputSchema.parse(o);

describe("실업급여(구직급여) 계산", () => {
  // ── 상한 클램프 ──────────────────────────────────────────────────────────
  it("1일 평균임금이 매우 높으면 상한(68,100원 — 2026 이직) 적용", () => {
    // 일 200,000원 × 60% = 120,000 > 68,100 → 상한 적용
    const r = calculateUnemploymentBenefit(
      parse({ inputMode: "daily", dailyAverageWage: 200_000, insuranceYears: 5 }),
    );
    expect(r.dailyWageClamped).toBe(DAILY_BENEFIT_CAP);
    expect(r.isCapApplied).toBe(true);
    expect(r.isFloorApplied).toBe(false);
  });

  // ── 하한 클램프 ──────────────────────────────────────────────────────────
  it("1일 평균임금이 낮으면 하한(66,048원 — 2026 최저임금 기반) 적용", () => {
    // 일 10,000원 × 60% = 6,000 < 66,048 → 하한 적용
    const r = calculateUnemploymentBenefit(
      parse({ inputMode: "daily", dailyAverageWage: 10_000, insuranceYears: 2 }),
    );
    expect(r.dailyWageClamped).toBe(DAILY_BENEFIT_FLOOR);
    expect(r.isFloorApplied).toBe(true);
    expect(r.isCapApplied).toBe(false);
  });

  // ── 정상 범위 (상한·하한 미적용) ─────────────────────────────────────────
  it("1일 평균임금이 적정 범위면 그대로 적용", () => {
    // 일 112,000원 × 60% = 67,200 → 하한(66,048)보다 크고 상한(68,100)보다 작음 → 그대로
    const r = calculateUnemploymentBenefit(
      parse({ inputMode: "daily", dailyAverageWage: 112_000, insuranceYears: 3 }),
    );
    expect(r.dailyWageClamped).toBe(Math.round(112_000 * 0.6));
    expect(r.isCapApplied).toBe(false);
    expect(r.isFloorApplied).toBe(false);
  });

  // ── 소정급여일수 테이블 — 가입기간별 경계 ────────────────────────────────
  it("가입기간 1년 미만, 50세 미만 → 120일", () => {
    const r = calculateUnemploymentBenefit(
      parse({ dailyAverageWage: 80_000, insuranceYears: 0.5, ageAbove50: false }),
    );
    expect(r.benefitDays).toBe(120);
  });

  it("가입기간 1년, 50세 미만 → 150일", () => {
    const r = calculateUnemploymentBenefit(
      parse({ dailyAverageWage: 80_000, insuranceYears: 1, ageAbove50: false }),
    );
    expect(r.benefitDays).toBe(150);
  });

  it("가입기간 3년, 50세 이상 → 210일", () => {
    const r = calculateUnemploymentBenefit(
      parse({ dailyAverageWage: 80_000, insuranceYears: 3, ageAbove50: true }),
    );
    expect(r.benefitDays).toBe(210);
  });

  it("가입기간 5년, 50세 미만 → 210일", () => {
    const r = calculateUnemploymentBenefit(
      parse({ dailyAverageWage: 80_000, insuranceYears: 5, ageAbove50: false }),
    );
    expect(r.benefitDays).toBe(210);
  });

  it("가입기간 10년 이상, 50세 이상 → 270일 (최대)", () => {
    const r = calculateUnemploymentBenefit(
      parse({ dailyAverageWage: 80_000, insuranceYears: 15, ageAbove50: true }),
    );
    expect(r.benefitDays).toBe(270);
  });

  // ── 총 수령액 정합성 ──────────────────────────────────────────────────────
  it("총 수령액 = 1일 구직급여 × 소정급여일수", () => {
    const r = calculateUnemploymentBenefit(
      parse({ dailyAverageWage: 110_000, insuranceYears: 7, ageAbove50: false }),
    );
    expect(r.totalBenefit).toBe(Math.round(r.dailyWageClamped * r.benefitDays));
  });

  // ── 월평균임금 inputMode 환산 ────────────────────────────────────────────
  it("월평균임금 입력 모드: 3,000,000 / 30 = 100,000 일평균임금", () => {
    const r = calculateUnemploymentBenefit(
      parse({
        inputMode: "monthly",
        monthlyAverageSalary: 3_000_000,
        insuranceYears: 2,
        ageAbove50: false,
      }),
    );
    // 100,000 × 60% = 60,000 < 하한 → 하한 적용
    expect(r.isFloorApplied).toBe(true);
    expect(r.dailyWageClamped).toBe(DAILY_BENEFIT_FLOOR);
  });

  // ── 상한 경계값: 정확히 68,100원 ─────────────────────────────────────────
  it("1일 구직급여raw가 상한과 동일하면 isCapApplied = false", () => {
    // 68,100 / 0.6 = 113,500 → raw = 68,100 = cap → isCapApplied false
    const r = calculateUnemploymentBenefit(
      parse({ dailyAverageWage: 113_500, insuranceYears: 1 }),
    );
    expect(r.dailyWageRaw).toBe(68_100);
    expect(r.isCapApplied).toBe(false);
    expect(r.dailyWageClamped).toBe(68_100);
  });
});
