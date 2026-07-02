import { describe, it, expect } from "vitest";
import {
  calculateDepositRisk,
  depositRiskInputSchema,
} from "./depositRisk";

const parse = (o: Record<string, number>) =>
  calculateDepositRisk(depositRiskInputSchema.parse(o));

describe("깡통전세 위험도 계산 (deposit risk)", () => {
  it("안전: 선순위 없음, 전세가율 50% → safe", () => {
    const out = parse({
      marketPrice: 400_000_000,
      seniorDebt: 0,
      myDeposit: 200_000_000,
      auctionRecoveryPercent: 80,
    });
    expect(out.jeonseRatio).toBeCloseTo(0.5, 5);
    expect(out.debtRatio).toBeCloseTo(0.5, 5);
    expect(out.level).toBe("safe");
    expect(out.shortfall).toBe(0);
    // 낙찰 3.2억 − 선순위 0 = 3.2억 회수가능 > 보증금 2억
    expect(out.recoverableForMe).toBe(320_000_000);
    expect(out.recoveryRatioOfDeposit).toBe(1);
  });

  it("핵심: 부채비율 = (선순위+보증금)/시세", () => {
    const out = parse({
      marketPrice: 300_000_000,
      seniorDebt: 50_000_000,
      myDeposit: 200_000_000,
      auctionRecoveryPercent: 80,
    });
    // (5천만 + 2억) / 3억 = 0.8333
    expect(out.debtRatio).toBeCloseTo(0.8333, 3);
    expect(out.jeonseRatio).toBeCloseTo(0.6667, 3);
  });

  it("손실 시뮬: 낙찰 2.4억 − 선순위 5천만 = 1.9억 회수 < 보증금 2억 → 1천만 손실", () => {
    const out = parse({
      marketPrice: 300_000_000,
      seniorDebt: 50_000_000,
      myDeposit: 200_000_000,
      auctionRecoveryPercent: 80,
    });
    expect(out.expectedAuctionProceeds).toBe(240_000_000);
    expect(out.recoverableForMe).toBe(190_000_000);
    expect(out.shortfall).toBe(10_000_000);
    // 부채비율 83% = danger 구간 (손실도 발생)
    expect(out.level).toBe("danger");
    expect(out.recoveryRatioOfDeposit).toBeCloseTo(0.95, 5);
  });

  it("매우위험: 부채비율 95% → critical", () => {
    const out = parse({
      marketPrice: 200_000_000,
      seniorDebt: 40_000_000,
      myDeposit: 150_000_000,
      auctionRecoveryPercent: 80,
    });
    // (4천만 + 1.5억)/2억 = 0.95
    expect(out.debtRatio).toBeCloseTo(0.95, 5);
    expect(out.level).toBe("critical");
    expect(out.shortfall).toBeGreaterThan(0);
  });

  it("부채비율 안전권이라도 경매 손실 나면 최소 danger로 상향", () => {
    // 전세가율/부채비율은 낮지만 낙찰가율을 낮게 잡으면 손실 가능
    const out = parse({
      marketPrice: 300_000_000,
      seniorDebt: 150_000_000,
      myDeposit: 60_000_000,
      auctionRecoveryPercent: 60,
    });
    // 부채비율 = (1.5억+6천만)/3억 = 0.70 → 원래 safe 경계
    expect(out.debtRatio).toBeCloseTo(0.7, 5);
    // 낙찰 1.8억 − 선순위 1.5억 = 3천만 회수 < 보증금 6천만 → 손실
    expect(out.shortfall).toBe(30_000_000);
    expect(out.level).toBe("danger");
  });

  it("무효 입력: 시세 0 → valid false", () => {
    const out = parse({
      marketPrice: 0,
      seniorDebt: 0,
      myDeposit: 100_000_000,
      auctionRecoveryPercent: 80,
    });
    expect(out.valid).toBe(false);
    expect(out.debtRatio).toBe(0);
  });

  it("보증금 0 → 회수비율 1, 안전", () => {
    const out = parse({
      marketPrice: 300_000_000,
      seniorDebt: 0,
      myDeposit: 0,
      auctionRecoveryPercent: 80,
    });
    expect(out.recoveryRatioOfDeposit).toBe(1);
    expect(out.level).toBe("safe");
    expect(out.shortfall).toBe(0);
  });
});
