import { describe, it, expect } from "vitest";
import {
  calculateGiftTax,
  giftTaxInputSchema,
  DEDUCTION_MAP,
  GIFT_TAX_BRACKETS,
} from "./giftTax";

const parse = (o: Record<string, unknown>) => giftTaxInputSchema.parse(o);

describe("증여세 계산기", () => {
  // ── 공제표 상수 검증 ─────────────────────────────
  describe("공제 상수", () => {
    it("배우자 공제 = 6억", () => {
      expect(DEDUCTION_MAP["spouse"]).toBe(600_000_000);
    });
    it("성년 직계비속 공제 = 5천만", () => {
      expect(DEDUCTION_MAP["lineal-adult"]).toBe(50_000_000);
    });
    it("미성년 직계비속 공제 = 2천만", () => {
      expect(DEDUCTION_MAP["lineal-minor"]).toBe(20_000_000);
    });
    it("직계존속 공제 = 5천만", () => {
      expect(DEDUCTION_MAP["lineal-ancestor"]).toBe(50_000_000);
    });
    it("기타친족 공제 = 1천만", () => {
      expect(DEDUCTION_MAP["other-relative"]).toBe(10_000_000);
    });
    it("타인 공제 = 0", () => {
      expect(DEDUCTION_MAP["other"]).toBe(0);
    });
  });

  // ── 세율 구간 경계 ─────────────────────────────
  describe("세율표", () => {
    it("세율표 5구간", () => {
      expect(GIFT_TAX_BRACKETS.length).toBe(5);
    });
    it("최저 구간 세율 10%", () => {
      expect(GIFT_TAX_BRACKETS[0]!.rate).toBe(0.1);
    });
    it("최고 구간 세율 50%", () => {
      expect(GIFT_TAX_BRACKETS[4]!.rate).toBe(0.5);
    });
  });

  // ── 배우자 공제 케이스 ─────────────────────────
  describe("배우자 증여", () => {
    it("6억 증여 → 공제 6억 → 과세표준 0 → 세금 0", () => {
      const out = calculateGiftTax(
        parse({ giftAmount: 600_000_000, donorRelation: "spouse" }),
      );
      expect(out.deduction).toBe(600_000_000);
      expect(out.taxBase).toBe(0);
      expect(out.calculatedTax).toBe(0);
      expect(out.finalTax).toBe(0);
    });

    it("10억 증여 → 공제 6억 → 과세표준 4억 → 세율 20% 구간", () => {
      const out = calculateGiftTax(
        parse({ giftAmount: 1_000_000_000, donorRelation: "spouse" }),
      );
      expect(out.deduction).toBe(600_000_000);
      expect(out.taxBase).toBe(400_000_000);
      expect(out.marginalRate).toBe(0.2);
      // 4억 × 20% - 1천만 = 7천만
      expect(out.calculatedTax).toBe(70_000_000);
    });
  });

  // ── 직계비속 성년 케이스 ──────────────────────
  describe("직계존속→성년 직계비속 증여", () => {
    it("5천만 이하 증여 → 공제 5천만 → 세금 0", () => {
      const out = calculateGiftTax(
        parse({ giftAmount: 50_000_000, donorRelation: "lineal-adult" }),
      );
      expect(out.deduction).toBe(50_000_000);
      expect(out.taxBase).toBe(0);
      expect(out.finalTax).toBe(0);
    });

    it("1억 증여 → 공제 5천만 → 과세표준 5천만 → 세율 10%", () => {
      const out = calculateGiftTax(
        parse({ giftAmount: 100_000_000, donorRelation: "lineal-adult" }),
      );
      expect(out.taxBase).toBe(50_000_000);
      expect(out.marginalRate).toBe(0.1);
      // 5천만 × 10% = 5백만
      expect(out.calculatedTax).toBe(5_000_000);
    });
  });

  // ── 미성년 직계비속 케이스 ───────────────────
  describe("직계존속→미성년 직계비속 증여", () => {
    it("2천만 증여 → 공제 2천만 → 세금 0", () => {
      const out = calculateGiftTax(
        parse({ giftAmount: 20_000_000, donorRelation: "lineal-minor" }),
      );
      expect(out.taxBase).toBe(0);
      expect(out.finalTax).toBe(0);
    });

    it("5천만 증여 → 공제 2천만 → 과세표준 3천만", () => {
      const out = calculateGiftTax(
        parse({ giftAmount: 50_000_000, donorRelation: "lineal-minor" }),
      );
      expect(out.deduction).toBe(20_000_000);
      expect(out.taxBase).toBe(30_000_000);
      // 3천만 × 10% = 3백만
      expect(out.calculatedTax).toBe(3_000_000);
    });
  });

  // ── 세율 구간 경계 테스트 ────────────────────
  describe("세율 구간 경계 (타인 증여 — 공제 0)", () => {
    it("과세표준 1억 정확히 → 10% 구간", () => {
      const out = calculateGiftTax(
        parse({ giftAmount: 100_000_000, donorRelation: "other", selfReport: false }),
      );
      expect(out.taxBase).toBe(100_000_000);
      expect(out.marginalRate).toBe(0.1);
      expect(out.calculatedTax).toBe(10_000_000);
    });

    it("과세표준 1억1원 → 20% 구간", () => {
      const out = calculateGiftTax(
        parse({ giftAmount: 100_000_001, donorRelation: "other", selfReport: false }),
      );
      expect(out.marginalRate).toBe(0.2);
    });

    it("과세표준 5억 → 20% 구간, 누진공제 1천만", () => {
      const out = calculateGiftTax(
        parse({ giftAmount: 500_000_000, donorRelation: "other", selfReport: false }),
      );
      expect(out.marginalRate).toBe(0.2);
      // 5억 × 20% - 1천만 = 9천만
      expect(out.calculatedTax).toBe(90_000_000);
    });

    it("과세표준 10억 → 30% 구간, 누진공제 6천만", () => {
      const out = calculateGiftTax(
        parse({ giftAmount: 1_000_000_000, donorRelation: "other", selfReport: false }),
      );
      expect(out.marginalRate).toBe(0.3);
      // 10억 × 30% - 6천만 = 2억4천만
      expect(out.calculatedTax).toBe(240_000_000);
    });

    it("과세표준 30억 초과 → 50% 구간, 누진공제 4억6천만", () => {
      const out = calculateGiftTax(
        parse({ giftAmount: 4_000_000_000, donorRelation: "other", selfReport: false }),
      );
      expect(out.marginalRate).toBe(0.5);
      // 40억 × 50% - 4억6천만 = 15억4천만
      expect(out.calculatedTax).toBe(1_540_000_000);
    });
  });

  // ── 신고세액공제 ─────────────────────────────
  describe("신고세액공제 3%", () => {
    it("자진신고 ON → 산출세액의 3% 공제", () => {
      const out = calculateGiftTax(
        parse({
          giftAmount: 200_000_000,
          donorRelation: "lineal-adult",
          selfReport: true,
        }),
      );
      // 과세표준 = 2억 - 5천만 = 1억5천만, 세율 20%, 산출세액 = 1억5천만×20% - 1천만 = 2천만
      expect(out.calculatedTax).toBe(20_000_000);
      expect(out.reportDiscount).toBe(Math.floor(20_000_000 * 0.03)); // 600_000
      expect(out.finalTax).toBe(out.calculatedTax - out.reportDiscount);
    });

    it("자진신고 OFF → 공제 0, 납부세액 = 산출세액", () => {
      const out = calculateGiftTax(
        parse({
          giftAmount: 200_000_000,
          donorRelation: "lineal-adult",
          selfReport: false,
        }),
      );
      expect(out.reportDiscount).toBe(0);
      expect(out.finalTax).toBe(out.calculatedTax);
    });
  });

  // ── 10년 기증여 합산 ──────────────────────────
  describe("10년 기증여 합산", () => {
    it("기증여 5천만 → 공제 잔액 0 (성년 자녀, 한도 5천만)", () => {
      const out = calculateGiftTax(
        parse({
          giftAmount: 100_000_000,
          donorRelation: "lineal-adult",
          priorGifts: 50_000_000,
          selfReport: false,
        }),
      );
      // 공제 한도 5천만, 기증여 5천만 → usable = 0
      expect(out.deduction).toBe(0);
      expect(out.taxBase).toBe(100_000_000);
    });

    it("기증여 3천만 → 공제 잔액 2천만 (성년 자녀)", () => {
      const out = calculateGiftTax(
        parse({
          giftAmount: 50_000_000,
          donorRelation: "lineal-adult",
          priorGifts: 30_000_000,
          selfReport: false,
        }),
      );
      // usable = 5천만 - 3천만 = 2천만
      expect(out.deduction).toBe(20_000_000);
      expect(out.taxBase).toBe(30_000_000);
    });
  });

  // ── 엣지 케이스 ─────────────────────────────
  describe("엣지 케이스", () => {
    it("증여재산가액 0 → 모든 결과 0", () => {
      const out = calculateGiftTax(
        parse({ giftAmount: 0, donorRelation: "lineal-adult" }),
      );
      expect(out.deduction).toBe(0);
      expect(out.taxBase).toBe(0);
      expect(out.calculatedTax).toBe(0);
      expect(out.finalTax).toBe(0);
    });

    it("타인 증여 → 공제 0, 전액 과세", () => {
      const out = calculateGiftTax(
        parse({ giftAmount: 50_000_000, donorRelation: "other", selfReport: false }),
      );
      expect(out.deduction).toBe(0);
      expect(out.taxBase).toBe(50_000_000);
      expect(out.calculatedTax).toBe(5_000_000);
    });
  });
});
