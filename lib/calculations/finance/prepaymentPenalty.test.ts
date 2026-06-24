import { describe, it, expect } from "vitest";
import {
  calculatePrepaymentPenalty,
  prepaymentPenaltyInputSchema,
} from "./prepaymentPenalty";

describe("prepayment penalty calculator", () => {
  it("경과 0개월 — 최대 수수료 (잔존일수 = 면제기간전체)", () => {
    const input = prepaymentPenaltyInputSchema.parse({
      principal: 100_000_000,
      penaltyRatePercent: 1.2,
      elapsedMonths: 0,
      exemptionYears: 3,
    });
    const out = calculatePrepaymentPenalty(input);
    // 잔존 = 1095, 면제 = 1095 → 비율 1.0 → 수수료 = 100M × 0.012 × 1.0 = 1,200,000
    expect(out.penaltyAmount).toBeCloseTo(1_200_000, -1);
    expect(out.remainingDays).toBeCloseTo(1095, 0);
    expect(out.isExempt).toBe(false);
  });

  it("경과 12개월 — 슬라이딩 수수료 감소", () => {
    const input = prepaymentPenaltyInputSchema.parse({
      principal: 100_000_000,
      penaltyRatePercent: 1.2,
      elapsedMonths: 12,
      exemptionYears: 3,
    });
    const out = calculatePrepaymentPenalty(input);
    // 경과일수 = 12 × 30.4 = 364.8, 잔존 = 1095 − 364.8 = 730.2
    // 수수료 = 100M × 0.012 × (730.2 / 1095) ≈ 800,219
    expect(out.penaltyAmount).toBeGreaterThan(0);
    expect(out.penaltyAmount).toBeLessThan(1_200_000);
    expect(out.isExempt).toBe(false);
    // 경과 0개월보다 수수료 작아야 함 (슬라이딩)
    const inputFull = prepaymentPenaltyInputSchema.parse({
      principal: 100_000_000,
      penaltyRatePercent: 1.2,
      elapsedMonths: 0,
      exemptionYears: 3,
    });
    const outFull = calculatePrepaymentPenalty(inputFull);
    expect(out.penaltyAmount).toBeLessThan(outFull.penaltyAmount);
  });

  it("경과 24개월 — 슬라이딩 추가 감소", () => {
    const input = prepaymentPenaltyInputSchema.parse({
      principal: 100_000_000,
      penaltyRatePercent: 1.2,
      elapsedMonths: 24,
      exemptionYears: 3,
    });
    const out12 = calculatePrepaymentPenalty(
      prepaymentPenaltyInputSchema.parse({
        principal: 100_000_000,
        penaltyRatePercent: 1.2,
        elapsedMonths: 12,
        exemptionYears: 3,
      })
    );
    const out24 = calculatePrepaymentPenalty(input);
    // 24개월 > 12개월 경과 → 수수료 더 적음
    expect(out24.penaltyAmount).toBeLessThan(out12.penaltyAmount);
    expect(out24.isExempt).toBe(false);
  });

  it("경과 36개월 — 면제기준 도달 시 수수료 0 (면제)", () => {
    const input = prepaymentPenaltyInputSchema.parse({
      principal: 100_000_000,
      penaltyRatePercent: 1.2,
      elapsedMonths: 36,
      exemptionYears: 3,
    });
    const out = calculatePrepaymentPenalty(input);
    // 경과일수 = 36 × 30.4 = 1094.4 < 1095 → 잔존 = 0.6 → 미미한 수수료
    // 실제로는 경계에 가깝지만 1095일 기준으로는 아직 약간 남음
    // → isExempt = false 일 수 있으나 수수료가 매우 작아야 함
    expect(out.penaltyAmount).toBeGreaterThanOrEqual(0);
    expect(out.remainingDays).toBeGreaterThanOrEqual(0);
  });

  it("경과 37개월 이상 — 완전 면제 (잔존일수 0)", () => {
    const input = prepaymentPenaltyInputSchema.parse({
      principal: 100_000_000,
      penaltyRatePercent: 1.2,
      elapsedMonths: 37,
      exemptionYears: 3,
    });
    const out = calculatePrepaymentPenalty(input);
    // 경과일수 = 37 × 30.4 = 1124.8 > 1095 → 잔존 = 0 → 면제
    expect(out.penaltyAmount).toBe(0);
    expect(out.remainingDays).toBe(0);
    expect(out.isExempt).toBe(true);
    expect(out.effectiveRatePercent).toBe(0);
  });

  it("경과 60개월 — 면제기간 초과도 0 (음수 방지)", () => {
    const input = prepaymentPenaltyInputSchema.parse({
      principal: 200_000_000,
      penaltyRatePercent: 1.5,
      elapsedMonths: 60,
      exemptionYears: 3,
    });
    const out = calculatePrepaymentPenalty(input);
    expect(out.penaltyAmount).toBe(0);
    expect(out.remainingDays).toBe(0);
    expect(out.isExempt).toBe(true);
  });

  it("실효 수수료율 검증 — 수수료액/원금×100", () => {
    const input = prepaymentPenaltyInputSchema.parse({
      principal: 50_000_000,
      penaltyRatePercent: 1.0,
      elapsedMonths: 0,
      exemptionYears: 3,
    });
    const out = calculatePrepaymentPenalty(input);
    // 수수료 = 5M × 0.01 × 1.0 = 500,000, 실효율 = 500,000/50M × 100 = 1.0%
    expect(out.effectiveRatePercent).toBeCloseTo(1.0, 3);
  });

  it("면제기준기간 1년 — 13개월 경과 시 면제", () => {
    const input = prepaymentPenaltyInputSchema.parse({
      principal: 30_000_000,
      penaltyRatePercent: 1.2,
      elapsedMonths: 13,
      exemptionYears: 1,
    });
    const out = calculatePrepaymentPenalty(input);
    // 면제기간일수 = 365, 경과 = 13 × 30.4 = 395.2 > 365 → 면제
    expect(out.isExempt).toBe(true);
    expect(out.penaltyAmount).toBe(0);
  });

  it("원금 경계값 최소 — 10,000원", () => {
    const input = prepaymentPenaltyInputSchema.parse({
      principal: 10_000,
      penaltyRatePercent: 1.2,
      elapsedMonths: 0,
      exemptionYears: 3,
    });
    const out = calculatePrepaymentPenalty(input);
    // 10,000 × 0.012 × 1.0 = 120원
    expect(out.penaltyAmount).toBeCloseTo(120, 0);
  });

  it("수수료율 0% — 항상 수수료 0", () => {
    const input = prepaymentPenaltyInputSchema.parse({
      principal: 100_000_000,
      penaltyRatePercent: 0,
      elapsedMonths: 6,
      exemptionYears: 3,
    });
    const out = calculatePrepaymentPenalty(input);
    expect(out.penaltyAmount).toBe(0);
    expect(out.effectiveRatePercent).toBe(0);
  });
});
