import { describe, it, expect } from "vitest";
import {
  calculateCompound,
  compoundInputSchema,
  calculateRecurring,
  recurringInputSchema,
} from "./compound";

describe("compound interest calculator (회당 이율 + 횟수)", () => {
  it("100만원 회당 5% 10회 — 검증값", () => {
    const input = compoundInputSchema.parse({
      principal: 1_000_000,
      ratePerPeriodPercent: 5,
      periods: 10,
      periodicContribution: 0,
    });
    const out = calculateCompound(input);
    // FV = 1,000,000 × 1.05^10 = 1,628,894.63
    expect(out.finalAmount).toBeCloseTo(1_628_894.63, 0);
    expect(out.totalInterest).toBeCloseTo(628_894.63, 0);
    expect(out.totalContribution).toBe(0);
    expect(out.totalInvested).toBe(1_000_000);
    // 총수익률 = 1.05^10 − 1 = 62.8895%
    expect(out.totalReturnPercent).toBeCloseTo(62.8895, 2);
  });

  it("정기 적립 — PMT 공식 검증", () => {
    // 원금 0, 회당 5%, 10회, 매 회 10만원 적립
    const input = compoundInputSchema.parse({
      principal: 0,
      ratePerPeriodPercent: 5,
      periods: 10,
      periodicContribution: 100_000,
    });
    const out = calculateCompound(input);
    // FV = 100,000 × ((1.05^10 − 1) / 0.05) = 1,257,789.25
    expect(out.finalAmount).toBeCloseTo(1_257_789.25, 0);
    expect(out.totalContribution).toBe(1_000_000); // 100K × 10
    expect(out.totalInterest).toBeCloseTo(257_789.25, 0);
  });

  it("원금 + 적립 동시", () => {
    const input = compoundInputSchema.parse({
      principal: 1_000_000,
      ratePerPeriodPercent: 5,
      periods: 10,
      periodicContribution: 100_000,
    });
    const out = calculateCompound(input);
    // 1,628,894.63 + 1,257,789.25 = 2,886,683.88
    expect(out.finalAmount).toBeCloseTo(2_886_683.88, 0);
    expect(out.totalInvested).toBe(2_000_000); // 1M + 100K×10
  });

  it("이율 0% — 단순 합산", () => {
    const input = compoundInputSchema.parse({
      principal: 1_000_000,
      ratePerPeriodPercent: 0,
      periods: 60,
      periodicContribution: 50_000,
    });
    const out = calculateCompound(input);
    // 1M + 50K × 60 = 4M
    expect(out.finalAmount).toBe(4_000_000);
    expect(out.totalInterest).toBe(0);
    expect(out.totalReturnPercent).toBe(0);
  });

  it("월복리 환산 — 회당 0.4167%(=5/12) × 120회 ≈ 연복리 동등", () => {
    const input = compoundInputSchema.parse({
      principal: 1_000_000,
      ratePerPeriodPercent: 5 / 12,
      periods: 120,
      periodicContribution: 0,
    });
    const out = calculateCompound(input);
    // 1,000,000 × (1 + 0.05/12)^120 = 1,647,009.50
    expect(out.finalAmount).toBeCloseTo(1_647_009.5, 0);
  });

  it("복리 횟수는 정수만 허용 — 소수 입력 시 schema error", () => {
    expect(() =>
      compoundInputSchema.parse({
        principal: 1_000_000,
        ratePerPeriodPercent: 5,
        periods: 9.5,
        periodicContribution: 0,
      }),
    ).toThrow();
  });

  it("복리 횟수 최소 1회 — 0 입력 시 schema error", () => {
    expect(() =>
      compoundInputSchema.parse({
        principal: 1_000_000,
        ratePerPeriodPercent: 5,
        periods: 0,
        periodicContribution: 0,
      }),
    ).toThrow();
  });

  it("회차별 schedule — Fical 기본 예시 (100만·5%·20회)", () => {
    const out = calculateCompound(
      compoundInputSchema.parse({
        principal: 1_000_000,
        ratePerPeriodPercent: 5,
        periods: 20,
        periodicContribution: 0,
      }),
    );
    expect(out.schedule).toHaveLength(20);
    expect(out.truncated).toBe(false);
    const r1 = out.schedule[0]!;
    const r20 = out.schedule[19]!;
    // 1회차: 이자 50,000 / 총액 1,050,000 / 수익률 5.00%
    expect(r1.interest).toBeCloseTo(50_000, 0);
    expect(r1.total).toBeCloseTo(1_050_000, 0);
    expect(r1.cumulativeReturnPercent).toBeCloseTo(5.0, 2);
    // 20회차: 총액 2,653,298 / 수익률 165.33%
    expect(r20.total).toBeCloseTo(2_653_298, 0);
    expect(r20.cumulativeReturnPercent).toBeCloseTo(165.33, 1);
  });

  it("schedule 600행 cap + truncated 플래그", () => {
    const out = calculateCompound(
      compoundInputSchema.parse({
        principal: 1_000_000,
        ratePerPeriodPercent: 0.4,
        periods: 1200,
        periodicContribution: 0,
      }),
    );
    expect(out.schedule).toHaveLength(600);
    expect(out.truncated).toBe(true);
  });
});

describe("적립식 복리 (recurring)", () => {
  it("Fical 예시: 시작 10만·매월 10만·3년·연 5%·연복리 → 3,885,456", () => {
    const out = calculateRecurring(
      recurringInputSchema.parse({
        startAmount: 100_000,
        monthlyContribution: 100_000,
        periodValue: 3,
        periodUnit: "year",
        ratePercent: 5,
        rateUnit: "year",
        compounding: "annual",
      }),
    );
    expect(out.totalMonths).toBe(36);
    expect(out.totalInvested).toBe(3_600_000);
    expect(out.finalAmount).toBeCloseTo(3_885_456, 0);
    expect(out.totalInterest).toBeCloseTo(285_456, 0);
    expect(out.yearly).toHaveLength(3);
    const y1 = out.yearly[0]!;
    const y2 = out.yearly[1]!;
    const y3 = out.yearly[2]!;
    // 1년차: 원금 1,200,000 / 수익 32,500 / 최종 1,232,500
    expect(y1.principal).toBeCloseTo(1_200_000, 0);
    expect(y1.interest).toBeCloseTo(32_500, 0);
    expect(y1.total).toBeCloseTo(1_232_500, 0);
    // 2년차: 원금 2,432,500 / 수익 94,125 / 최종 2,526,625
    expect(y2.interest).toBeCloseTo(94_125, 0);
    expect(y2.total).toBeCloseTo(2_526_625, 0);
    // 3년차: 최종 3,885,456
    expect(y3.total).toBeCloseTo(3_885_456, 0);
  });

  it("월복리: 시작 10만·매월 10만·12개월·연 6%·월복리 (12회 월초 적립)", () => {
    const out = calculateRecurring(
      recurringInputSchema.parse({
        startAmount: 100_000,
        monthlyContribution: 100_000,
        periodValue: 12,
        periodUnit: "month",
        ratePercent: 6,
        rateUnit: "year",
        compounding: "monthly",
      }),
    );
    // 월초 적립 연금: FV = 100,000 × ((1.005^12 − 1)/0.005) × 1.005 ≈ 1,239,728
    expect(out.totalMonths).toBe(12);
    expect(out.totalInvested).toBe(1_200_000); // 12회 × 10만
    expect(out.finalAmount).toBeCloseTo(1_239_728, -2);
    expect(out.monthly).toHaveLength(12);
  });

  it("기간 단위 개월 + 이자율 단위 월 직접 입력", () => {
    const out = calculateRecurring(
      recurringInputSchema.parse({
        startAmount: 1_000_000,
        monthlyContribution: 0,
        periodValue: 24,
        periodUnit: "month",
        ratePercent: 0.5,
        rateUnit: "month",
        compounding: "monthly",
      }),
    );
    // 100만 × 1.005^24 = 1,127,160 (적립 없음)
    expect(out.finalAmount).toBeCloseTo(1_127_160, -1);
    expect(out.totalInvested).toBe(1_000_000);
  });

  it("이율 0% — 적립식 단순 합산", () => {
    const out = calculateRecurring(
      recurringInputSchema.parse({
        startAmount: 100_000,
        monthlyContribution: 100_000,
        periodValue: 1,
        periodUnit: "year",
        ratePercent: 0,
        rateUnit: "year",
        compounding: "annual",
      }),
    );
    expect(out.finalAmount).toBe(1_200_000); // 10만 + 10만×11
    expect(out.totalInterest).toBe(0);
  });
});
