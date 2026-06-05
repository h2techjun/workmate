import { describe, it, expect } from "vitest";
import {
  calculateFreelancerTax,
  freelancerInputSchema,
} from "./freelancerTax";

const parse = (o: Record<string, unknown>) =>
  freelancerInputSchema.parse(o);

describe("프리랜서 3.3% 원천징수", () => {
  it("세전 100만 → 원천징수 33,000, 실수령 967,000", () => {
    const out = calculateFreelancerTax(
      parse({ amount: 1_000_000, basis: "gross" }),
    );
    expect(out.incomeTax).toBe(30_000);
    expect(out.localTax).toBe(3_000);
    expect(out.totalWithholding).toBe(33_000);
    expect(out.net).toBe(967_000);
  });

  it("실수령 967,000 → 세전 역산 100만 근사", () => {
    const out = calculateFreelancerTax(
      parse({ amount: 967_000, basis: "net" }),
    );
    expect(out.gross).toBeCloseTo(1_000_000, -2);
  });

  it("세전 300만 → 원천 99,000", () => {
    const out = calculateFreelancerTax(
      parse({ amount: 3_000_000, basis: "gross" }),
    );
    expect(out.totalWithholding).toBe(99_000);
    expect(out.net).toBe(2_901_000);
  });

  it("연 환산 = 월 × 12", () => {
    const out = calculateFreelancerTax(
      parse({ amount: 2_000_000, basis: "gross" }),
    );
    expect(out.annualGross).toBe(24_000_000);
    expect(out.annualWithholding).toBe(out.totalWithholding * 12);
  });

  it("0원 → 모두 0", () => {
    const out = calculateFreelancerTax(parse({ amount: 0, basis: "gross" }));
    expect(out.totalWithholding).toBe(0);
    expect(out.net).toBe(0);
  });
});
