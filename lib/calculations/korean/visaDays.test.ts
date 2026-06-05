import { describe, it, expect } from "vitest";
import { calculateVisaDays, visaDaysInputSchema } from "./visaDays";

const parse = (o: Record<string, number>) => visaDaysInputSchema.parse(o);

describe("비자 체류일수", () => {
  it("입국일 당일 = 1일째 (입국일 포함)", () => {
    const out = calculateVisaDays(
      parse({
        entryYear: 2026,
        entryMonth: 6,
        entryDay: 1,
        allowedDays: 90,
        refYear: 2026,
        refMonth: 6,
        refDay: 1,
      }),
    );
    expect(out.daysStayed).toBe(1);
    expect(out.daysRemaining).toBe(89); // 90일째가 만료일
  });

  it("90일 무비자: 6/1 입국 → 만료 8/29", () => {
    const out = calculateVisaDays(
      parse({
        entryYear: 2026,
        entryMonth: 6,
        entryDay: 1,
        allowedDays: 90,
        refYear: 2026,
        refMonth: 6,
        refDay: 1,
      }),
    );
    // 6/1 + 89일 = 8/29 (6월30 + 7월31 + 8월29 = 90일째)
    expect(out.expiry).toEqual({ year: 2026, month: 8, day: 29 });
  });

  it("체류 30일째 → 남은 60일", () => {
    const out = calculateVisaDays(
      parse({
        entryYear: 2026,
        entryMonth: 6,
        entryDay: 1,
        allowedDays: 90,
        refYear: 2026,
        refMonth: 6,
        refDay: 30,
      }),
    );
    expect(out.daysStayed).toBe(30); // 6/1~6/30 = 30일
    expect(out.daysRemaining).toBe(60);
    expect(out.isOverstay).toBe(false);
  });

  it("만료일 당일 → 남은 0일, 초과 아님", () => {
    const out = calculateVisaDays(
      parse({
        entryYear: 2026,
        entryMonth: 6,
        entryDay: 1,
        allowedDays: 90,
        refYear: 2026,
        refMonth: 8,
        refDay: 29,
      }),
    );
    expect(out.daysRemaining).toBe(0);
    expect(out.isOverstay).toBe(false);
    expect(out.daysStayed).toBe(90);
  });

  it("초과 체류 감지", () => {
    const out = calculateVisaDays(
      parse({
        entryYear: 2026,
        entryMonth: 6,
        entryDay: 1,
        allowedDays: 90,
        refYear: 2026,
        refMonth: 9,
        refDay: 1,
      }),
    );
    expect(out.isOverstay).toBe(true);
    expect(out.daysRemaining).toBeLessThan(0);
  });

  it("30일 비자 옵션", () => {
    const out = calculateVisaDays(
      parse({
        entryYear: 2026,
        entryMonth: 6,
        entryDay: 1,
        allowedDays: 30,
        refYear: 2026,
        refMonth: 6,
        refDay: 1,
      }),
    );
    expect(out.expiry).toEqual({ year: 2026, month: 6, day: 30 });
  });
});
