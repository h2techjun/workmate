import { describe, it, expect } from "vitest";
import { calculateRentCap, rentCapInputSchema } from "./rentCap";

describe("rent cap (주임법 5% 인상한도)", () => {
  it("전세 보증금 5억 → 5% 인상 = 5억 2,500만, 제안 5억 3,000만은 초과", () => {
    const input = rentCapInputSchema.parse({
      oldDeposit: 500_000_000,
      oldMonthlyRent: 0,
      proposedDeposit: 530_000_000,
      proposedMonthlyRent: 0,
    });
    const out = calculateRentCap(input);
    expect(out.maxEquivalentDeposit).toBeCloseTo(525_000_000, 0);
    expect(out.withinCap).toBe(false);
    expect(out.overage).toBeCloseTo(5_000_000, 0);
    expect(out.proposedIncreaseRate).toBeCloseTo(0.06, 4);
  });

  it("전세 5억 → 5억 2,000만 (4%) 통과", () => {
    const input = rentCapInputSchema.parse({
      oldDeposit: 500_000_000,
      proposedDeposit: 520_000_000,
    });
    const out = calculateRentCap(input);
    expect(out.withinCap).toBe(true);
    expect(out.remaining).toBeCloseTo(5_000_000, 0);
    expect(out.proposedIncreaseRate).toBeCloseTo(0.04, 4);
  });

  it("월세만: 보증금 5천 + 월세 50만 → 월세 53만 (6%) 초과 검증", () => {
    const input = rentCapInputSchema.parse({
      oldDeposit: 50_000_000,
      oldMonthlyRent: 500_000,
      proposedDeposit: 50_000_000,
      proposedMonthlyRent: 530_000,
    });
    const out = calculateRentCap(input);
    // 기존 환산보증금 = 5천만 + (50만 × 12 / 0.05) = 5천만 + 1.2억 = 1.7억
    expect(out.oldEquivalentDeposit).toBeCloseTo(170_000_000, 0);
    // 5% 한도 = 1.785억
    expect(out.maxEquivalentDeposit).toBeCloseTo(178_500_000, 0);
    // 제안 환산 = 5천 + (53만 × 12 / 0.05) = 5천 + 1.272억 = 1.772억
    expect(out.proposedEquivalentDeposit).toBeCloseTo(177_200_000, -3);
    // 1.772 < 1.785 → 통과
    expect(out.withinCap).toBe(true);
  });

  it("반전세: 보증금 1억 + 월세 80만 → 보증금만 인상 추천", () => {
    const input = rentCapInputSchema.parse({
      oldDeposit: 100_000_000,
      oldMonthlyRent: 800_000,
      proposedDeposit: 100_000_000,
      proposedMonthlyRent: 800_000,
    });
    const out = calculateRentCap(input);
    // 기존 환산 = 1억 + (80만 × 12 / 0.05) = 1억 + 1.92억 = 2.92억
    expect(out.oldEquivalentDeposit).toBeCloseTo(292_000_000, -3);
    expect(out.maxEquivalentDeposit).toBeCloseTo(306_600_000, -3);
    // 보증금만 인상 시: 306.6M - 1.92억 = 1.146억
    expect(out.recommendedDepositOnly).toBeCloseTo(114_600_000, -3);
    // 월세만 인상 시: (306.6M - 1억) × 0.05 / 12 = 86.08만
    expect(out.recommendedMonthlyOnly).toBeCloseTo(860_833, -2);
  });

  it("환산율 변경: 6% 환산율 시 월세 가중치 ↓", () => {
    const input = rentCapInputSchema.parse({
      oldDeposit: 100_000_000,
      oldMonthlyRent: 1_000_000,
      proposedDeposit: 100_000_000,
      proposedMonthlyRent: 1_050_000,
      conversionRatePercent: 6,
    });
    const out = calculateRentCap(input);
    // 기존 환산 = 1억 + (100만 × 12 / 0.06) = 1억 + 2억 = 3억
    expect(out.oldEquivalentDeposit).toBeCloseTo(300_000_000, -3);
    expect(out.maxEquivalentDeposit).toBeCloseTo(315_000_000, -3);
  });

  it("정확히 5% 인상은 통과", () => {
    const input = rentCapInputSchema.parse({
      oldDeposit: 200_000_000,
      proposedDeposit: 210_000_000,
    });
    const out = calculateRentCap(input);
    expect(out.withinCap).toBe(true);
    expect(out.overage).toBe(0);
    expect(out.proposedIncreaseRate).toBeCloseTo(0.05, 4);
  });
});
