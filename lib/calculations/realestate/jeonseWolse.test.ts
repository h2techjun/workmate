import { describe, it, expect } from "vitest";
import {
  calculateJeonseWolse,
  jeonseWolseInputSchema,
} from "./jeonseWolse";

describe("jeonse ↔ wolse converter (전월세전환율)", () => {
  it("전세→월세: 3억 중 1억을 월세로(전환율 5.3%)", () => {
    const out = calculateJeonseWolse(
      jeonseWolseInputSchema.parse({
        mode: "toMonthly",
        jeonseDeposit: 300_000_000,
        keepDeposit: 200_000_000,
        conversionRatePercent: 5.3,
      }),
    );
    expect(out.convertedDeposit).toBe(100_000_000);
    // 1억 × 5.3% ÷ 12 = 441,666.67
    expect(out.monthlyRent).toBeCloseTo(441_666.67, 1);
    expect(out.exceedsLegalCap).toBe(true); // 5.3% > 법정 4.5%
  });

  it("전세→월세: 법정 상한 4.5% 이내면 exceedsLegalCap false", () => {
    const out = calculateJeonseWolse(
      jeonseWolseInputSchema.parse({
        mode: "toMonthly",
        jeonseDeposit: 100_000_000,
        keepDeposit: 0,
        conversionRatePercent: 4.5,
      }),
    );
    expect(out.monthlyRent).toBeCloseTo(375_000, 0); // 1억 × 4.5% ÷ 12
    expect(out.legalCapPercent).toBeCloseTo(4.5, 5);
    expect(out.exceedsLegalCap).toBe(false);
  });

  it("월세→전세: 보증금 1천만 + 월세 50만 (전환율 4.5%) 환산", () => {
    const out = calculateJeonseWolse(
      jeonseWolseInputSchema.parse({
        mode: "toDeposit",
        monthlyDeposit: 10_000_000,
        monthlyRent: 500_000,
        conversionRatePercent: 4.5,
      }),
    );
    // 1천만 + (50만 × 12) / 0.045 = 1천만 + 133,333,333 = 143,333,333
    expect(out.jeonseEquivalent).toBeCloseTo(143_333_333, -1);
  });

  it("기본 전환율 = 법정 상한 4.5% (기준금리 2.5% + 2%)", () => {
    const out = calculateJeonseWolse(
      jeonseWolseInputSchema.parse({
        mode: "toMonthly",
        jeonseDeposit: 100_000_000,
      }),
    );
    expect(out.appliedRatePercent).toBeCloseTo(4.5, 5);
    expect(out.legalCapPercent).toBeCloseTo(4.5, 5);
  });

  it("남길 보증금이 전세금보다 크면 전환 보증금 0 (음수 방지)", () => {
    const out = calculateJeonseWolse(
      jeonseWolseInputSchema.parse({
        mode: "toMonthly",
        jeonseDeposit: 100_000_000,
        keepDeposit: 150_000_000,
        conversionRatePercent: 4.5,
      }),
    );
    expect(out.convertedDeposit).toBe(0);
    expect(out.monthlyRent).toBe(0);
  });
});
