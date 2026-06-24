import { describe, it, expect } from "vitest";
import {
  calculateBrokerageFee,
  brokerageFeeInputSchema,
  convertMonthlyToAmount,
} from "./brokerageFee";

// ── 헬퍼: schema.parse 후 계산 ──────────────────────────────────────
function calc(raw: Parameters<typeof brokerageFeeInputSchema.parse>[0]) {
  return calculateBrokerageFee(brokerageFeeInputSchema.parse(raw));
}

// ── 매매 구간 경계 테스트 ────────────────────────────────────────────
describe("매매 (sale) 요율 구간", () => {
  it("5천만 미만 → 0.6%, 한도 25만 적용", () => {
    // 3천만 × 0.6% = 18만 < 25만 → 한도 미적용
    const r = calc({ transactionType: "sale", price: 30_000_000 });
    expect(r.maxRate).toBe(0.006);
    expect(r.rateCap).toBe(250_000);
    expect(r.feeBeforeVat).toBe(180_000);
    expect(r.cappedByLimit).toBe(false);
  });

  it("5천만 미만 + 요율 초과 시 한도 25만 적용", () => {
    // 4800만 × 0.6% = 288,000 > 250,000 → 한도 적용
    const r = calc({ transactionType: "sale", price: 48_000_000 });
    expect(r.feeBeforeVat).toBe(250_000);
    expect(r.cappedByLimit).toBe(true);
  });

  it("5천만~2억 미만 → 0.5%, 한도 80만", () => {
    // 1억 × 0.5% = 50만 < 80만 → 한도 미적용
    const r = calc({ transactionType: "sale", price: 100_000_000 });
    expect(r.maxRate).toBe(0.005);
    expect(r.feeBeforeVat).toBe(500_000);
    expect(r.cappedByLimit).toBe(false);
  });

  it("5천만~2억 구간 한도 80만 적용", () => {
    // 1.9억 × 0.5% = 95만 > 80만 → 한도 적용
    const r = calc({ transactionType: "sale", price: 190_000_000 });
    expect(r.feeBeforeVat).toBe(800_000);
    expect(r.cappedByLimit).toBe(true);
  });

  it("2억~9억 미만 → 0.4%, 한도 없음", () => {
    // 5억 × 0.4% = 200만
    const r = calc({ transactionType: "sale", price: 500_000_000 });
    expect(r.maxRate).toBe(0.004);
    expect(r.rateCap).toBeNull();
    expect(r.feeBeforeVat).toBe(2_000_000);
    expect(r.cappedByLimit).toBe(false);
  });

  it("9억~12억 미만 → 0.5%, 한도 없음", () => {
    // 10억 × 0.5% = 500만
    const r = calc({ transactionType: "sale", price: 1_000_000_000 });
    expect(r.maxRate).toBe(0.005);
    expect(r.rateCap).toBeNull();
    expect(r.feeBeforeVat).toBe(5_000_000);
  });

  it("12억~15억 미만 → 0.6%, 한도 없음", () => {
    // 13억 × 0.6% = 780만
    const r = calc({ transactionType: "sale", price: 1_300_000_000 });
    expect(r.maxRate).toBe(0.006);
    expect(r.feeBeforeVat).toBe(7_800_000);
  });

  it("15억 이상 → 0.7%, 한도 없음", () => {
    // 20억 × 0.7% = 1400만
    const r = calc({ transactionType: "sale", price: 2_000_000_000 });
    expect(r.maxRate).toBe(0.007);
    expect(r.feeBeforeVat).toBe(14_000_000);
  });
});

// ── 임대차(전세) 구간 경계 테스트 ───────────────────────────────────
describe("전세 (jeonse) 요율 구간", () => {
  it("5천만 미만 → 0.5%, 한도 20만", () => {
    // 4천만 × 0.5% = 20만 = 한도 → min 결과 20만
    const r = calc({ transactionType: "jeonse", price: 40_000_000 });
    expect(r.maxRate).toBe(0.005);
    expect(r.rateCap).toBe(200_000);
    expect(r.feeBeforeVat).toBe(200_000);
  });

  it("5천만~1억 미만 → 0.4%, 한도 30만", () => {
    // 8천만 × 0.4% = 32만 > 30만 → 한도 30만
    const r = calc({ transactionType: "jeonse", price: 80_000_000 });
    expect(r.feeBeforeVat).toBe(300_000);
    expect(r.cappedByLimit).toBe(true);
  });

  it("1억~6억 미만 → 0.3%, 한도 없음", () => {
    // 3억 × 0.3% = 90만
    const r = calc({ transactionType: "jeonse", price: 300_000_000 });
    expect(r.maxRate).toBe(0.003);
    expect(r.rateCap).toBeNull();
    expect(r.feeBeforeVat).toBe(900_000);
  });

  it("6억~12억 미만 → 0.4%, 한도 없음", () => {
    // 8억 × 0.4% = 320만
    const r = calc({ transactionType: "jeonse", price: 800_000_000 });
    expect(r.maxRate).toBe(0.004);
    expect(r.feeBeforeVat).toBe(3_200_000);
  });
});

// ── 월세 환산 테스트 ─────────────────────────────────────────────────
describe("월세 (monthly) 거래금액 환산", () => {
  it("환산액 5천만 이상이면 보증금 + 월세×100", () => {
    // 보증금 1천만 + 월세 50만 → 1천만 + 5000만 = 6천만 ≥ 5천만 → ×100
    const { amount, multiplier } = convertMonthlyToAmount(10_000_000, 500_000);
    expect(amount).toBe(60_000_000);
    expect(multiplier).toBe(100);
  });

  it("환산액 5천만 미만이면 보증금 + 월세×70", () => {
    // 보증금 5백만 + 월세 20만 → 5백만 + 2000만 = 2500만 < 5천만 → ×70
    // 5백만 + 20만×70 = 5백만 + 1400만 = 1900만
    const { amount, multiplier } = convertMonthlyToAmount(5_000_000, 200_000);
    expect(amount).toBe(19_000_000);
    expect(multiplier).toBe(70);
  });

  it("월세 계산기: 보증금 1천만 + 월세 50만 → 6천만 → 0.4%, 한도 30만", () => {
    const r = calc({
      transactionType: "monthly",
      monthlyDeposit: 10_000_000,
      monthlyRent: 500_000,
    });
    expect(r.transactionAmount).toBe(60_000_000);
    expect(r.monthlyMultiplier).toBe(100);
    // 6천만은 임대차 5천만~1억 미만 구간 → 0.4%, 한도 30만
    // 6천만 × 0.4% = 24만 < 30만 → 한도 미적용
    expect(r.maxRate).toBe(0.004);
    expect(r.rateCap).toBe(300_000);
    expect(r.feeBeforeVat).toBe(240_000);
    expect(r.cappedByLimit).toBe(false);
  });

  it("월세 계산기 ×70 구간: 보증금 5백만 + 월세 20만", () => {
    const r = calc({
      transactionType: "monthly",
      monthlyDeposit: 5_000_000,
      monthlyRent: 200_000,
    });
    // 5백만 + 20만×100 = 2500만 < 5천만 → ×70 = 5백만 + 1400만 = 1900만
    // 1900만 < 5천만 → 0.5%, 한도 20만
    // 1900만 × 0.5% = 9.5만 < 20만 → 한도 미적용
    expect(r.monthlyMultiplier).toBe(70);
    expect(r.feeBeforeVat).toBe(95_000);
    expect(r.cappedByLimit).toBe(false);
  });
});

// ── 부가가치세 ───────────────────────────────────────────────────────
describe("부가가치세 옵션", () => {
  it("includeVat=true 이면 feeBeforeVat × 10% 추가", () => {
    // 5억 매매 → 200만, VAT 20만
    const r = calc({
      transactionType: "sale",
      price: 500_000_000,
      includeVat: true,
    });
    expect(r.feeBeforeVat).toBe(2_000_000);
    expect(r.vatAmount).toBe(200_000);
    expect(r.totalFee).toBe(2_200_000);
  });

  it("includeVat=false(기본) 이면 vatAmount=0, totalFee=feeBeforeVat", () => {
    const r = calc({ transactionType: "sale", price: 500_000_000 });
    expect(r.vatAmount).toBe(0);
    expect(r.totalFee).toBe(r.feeBeforeVat);
  });
});

// ── 경계값: 구간 경계 정확도 ─────────────────────────────────────────
describe("구간 경계 정확도", () => {
  it("정확히 2억이면 2억~9억 구간(0.4%) 적용", () => {
    const r = calc({ transactionType: "sale", price: 200_000_000 });
    expect(r.maxRate).toBe(0.004);
  });

  it("정확히 9억이면 9억~12억 구간(0.5%) 적용 — 매매", () => {
    const r = calc({ transactionType: "sale", price: 900_000_000 });
    expect(r.maxRate).toBe(0.005);
  });

  it("정확히 6억이면 6억~12억 구간(0.4%) 적용 — 전세", () => {
    const r = calc({ transactionType: "jeonse", price: 600_000_000 });
    expect(r.maxRate).toBe(0.004);
  });
});
