import { describe, it, expect } from "vitest";
import {
  ofValue,
  increase,
  decrease,
  changePercent,
  reverseFromIncrease,
} from "./percent";

describe("percent calculator", () => {
  it("50000의 15% = 7500", () => {
    expect(ofValue(50000, 15).value).toBe(7500);
  });

  it("50000 에 15% 인상 = 57500", () => {
    const r = increase(50000, 15);
    expect(r.value).toBe(57500);
    expect(r.delta).toBe(7500);
  });

  it("50000 에서 15% 할인 = 42500", () => {
    const r = decrease(50000, 15);
    expect(r.value).toBe(42500);
    expect(r.delta).toBe(-7500);
  });

  it("100 → 130 = +30%", () => {
    expect(changePercent(100, 130).percent).toBe(30);
    expect(changePercent(100, 80).percent).toBe(-20);
  });

  it("110 이 10% 인상이라면 원본 = 100", () => {
    const r = reverseFromIncrease(110, 10);
    expect(r.value).toBeCloseTo(100, 6);
  });

  it("from = 0 안전 처리", () => {
    expect(changePercent(0, 100).percent).toBe(0);
  });
});
