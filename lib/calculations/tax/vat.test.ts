import { describe, expect, it } from "vitest";
import { calculateVat } from "./vat";

describe("calculateVat - extract (부가세 포함 → 분리)", () => {
  it("110,000원 → 공급가액 100,000 + 부가세 10,000", () => {
    const r = calculateVat({ mode: "extract", amount: 110_000 });
    expect(r.ok).toBe(true);
    const supply = r.lines.find((l) => l.key === "supply")?.amount;
    const vat = r.lines.find((l) => l.key === "vat")?.amount;
    expect(supply).toBe(100_000);
    expect(vat).toBe(10_000);
  });

  it("33,000원 → 30,000 + 3,000", () => {
    const r = calculateVat({ mode: "extract", amount: 33_000 });
    expect(r.lines.find((l) => l.key === "supply")?.amount).toBe(30_000);
    expect(r.lines.find((l) => l.key === "vat")?.amount).toBe(3_000);
  });

  it("1,234,567원 (홀수 금액)", () => {
    const r = calculateVat({ mode: "extract", amount: 1_234_567 });
    // 1,234,567 × 10 / 11 = 1,122,333.6... → 반올림 1,122,334
    // 부가세 = 1,234,567 - 1,122,334 = 112,233
    expect(r.lines.find((l) => l.key === "supply")?.amount).toBe(1_122_334);
    expect(r.lines.find((l) => l.key === "vat")?.amount).toBe(112_233);
  });
});

describe("calculateVat - add (공급가액 → 부가세 별도 추가)", () => {
  it("100,000 → 부가세 10,000, 합계 110,000", () => {
    const r = calculateVat({ mode: "add", amount: 100_000 });
    expect(r.lines.find((l) => l.key === "vat")?.amount).toBe(10_000);
    expect(r.lines.find((l) => l.key === "total")?.amount).toBe(110_000);
  });
});

describe("calculateVat - general (일반과세자 신고)", () => {
  it("매출 11,000,000 + 매입 5,500,000 (공급대가) → 납부 500,000", () => {
    const r = calculateVat({
      mode: "general",
      amount: 11_000_000, // 매출 공급대가
      purchaseAmount: 5_000_000, // 매입 공급가액
    });
    // 매출세액 = 1,000,000, 매입세액 = 500,000 → 납부 500,000
    expect(r.lines.find((l) => l.key === "vat")?.amount).toBe(1_000_000);
    expect(r.lines.find((l) => l.key === "purchase-vat")?.amount).toBe(500_000);
    expect(r.lines.find((l) => l.key === "payable")?.amount).toBe(500_000);
  });

  it("매입 누락: 매출세액 그대로 납부", () => {
    const r = calculateVat({ mode: "general", amount: 11_000_000 });
    expect(r.lines.find((l) => l.key === "payable")?.amount).toBe(1_000_000);
  });
});

describe("calculateVat - simple (간이과세자)", () => {
  it("소매업 11,000,000 매출 → 부가가치율 15% × 10%", () => {
    const r = calculateVat({
      mode: "simple",
      amount: 11_000_000,
      industry: "retail",
    });
    // 부가가치 = 11M × 0.15 = 1,650,000
    // 납부 = 1,650,000 × 0.1 = 165,000
    expect(r.lines.find((l) => l.key === "added-value")?.amount).toBe(1_650_000);
    expect(r.lines.find((l) => l.key === "payable")?.amount).toBe(165_000);
  });

  it("제조업 부가가치율 20%", () => {
    const r = calculateVat({
      mode: "simple",
      amount: 10_000_000,
      industry: "manufacturing",
    });
    // 부가가치 = 2,000,000, 납부 = 200,000
    expect(r.lines.find((l) => l.key === "payable")?.amount).toBe(200_000);
  });
});

describe("calculateVat - 입력 검증", () => {
  it("금액 0: 에러", () => {
    const r = calculateVat({ mode: "extract", amount: 0 });
    expect(r.ok).toBe(false);
    expect(r.errors[0]?.field).toBe("amount");
  });

  it("simple 모드 + 업종 누락: 에러", () => {
    const r = calculateVat({ mode: "simple", amount: 1_000_000 });
    expect(r.ok).toBe(false);
    expect(r.errors.some((e) => e.field === "industry")).toBe(true);
  });

  it("general 모드 + 매입 음수: 에러", () => {
    const r = calculateVat({
      mode: "general",
      amount: 1_000_000,
      purchaseAmount: -100,
    });
    expect(r.ok).toBe(false);
  });
});
