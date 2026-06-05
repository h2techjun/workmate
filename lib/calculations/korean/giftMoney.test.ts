import { describe, it, expect } from "vitest";
import { calculateGiftMoney, giftMoneyInputSchema } from "./giftMoney";
import { calculateDueDate, dueDateInputSchema } from "./dueDate";

const gift = (o: Record<string, unknown>) => giftMoneyInputSchema.parse(o);
const due = (o: Record<string, number>) => dueDateInputSchema.parse(o);

describe("축의금/부의금", () => {
  it("결혼식 지인 불참 → 5만 권장", () => {
    const out = calculateGiftMoney(
      gift({ event: "wedding", relation: "acquaintance", attending: false }),
    );
    expect(out.recommended).toBe(5);
  });

  it("결혼식 동료 참석(식대) → 상향 권장 10만", () => {
    const out = calculateGiftMoney(
      gift({ event: "wedding", relation: "colleague", attending: true }),
    );
    expect(out.recommended).toBe(10);
    expect(out.attendingNote).toBe(true);
  });

  it("절친 결혼식 → 10~20만 범위", () => {
    const out = calculateGiftMoney(
      gift({ event: "wedding", relation: "closeFriend" }),
    );
    expect(out.min).toBe(10);
    expect(out.max).toBe(20);
  });

  it("부의금 지인 → 3~5만", () => {
    const out = calculateGiftMoney(
      gift({ event: "funeral", relation: "acquaintance" }),
    );
    expect(out.min).toBe(3);
    expect(out.max).toBe(5);
  });
});

describe("출산예정일 (네겔레)", () => {
  it("LMP 2026-01-01 → EDD 약 2026-10-08 (280일)", () => {
    const out = calculateDueDate(
      due({
        lmpYear: 2026, lmpMonth: 1, lmpDay: 1, cycleLength: 28,
        refYear: 2026, refMonth: 1, refDay: 1,
      }),
    );
    // 2026-01-01 + 280일 = 2026-10-08
    expect(out.dueDate).toEqual({ year: 2026, month: 10, day: 8 });
  });

  it("LMP 후 70일 → 10주 0일, 1삼분기", () => {
    const out = calculateDueDate(
      due({
        lmpYear: 2026, lmpMonth: 1, lmpDay: 1, cycleLength: 28,
        refYear: 2026, refMonth: 3, refDay: 12, // 70일 후
      }),
    );
    expect(out.weeks).toBe(10);
    expect(out.days).toBe(0);
    expect(out.trimester).toBe(1);
  });

  it("20주 → 2삼분기", () => {
    const out = calculateDueDate(
      due({
        lmpYear: 2026, lmpMonth: 1, lmpDay: 1, cycleLength: 28,
        refYear: 2026, refMonth: 5, refDay: 21, // 140일 = 20주
      }),
    );
    expect(out.weeks).toBe(20);
    expect(out.trimester).toBe(2);
  });

  it("주기 35일 → EDD 7일 뒤로 이동", () => {
    const c28 = calculateDueDate(
      due({ lmpYear: 2026, lmpMonth: 1, lmpDay: 1, cycleLength: 28, refYear: 2026, refMonth: 1, refDay: 1 }),
    );
    const c35 = calculateDueDate(
      due({ lmpYear: 2026, lmpMonth: 1, lmpDay: 1, cycleLength: 35, refYear: 2026, refMonth: 1, refDay: 1 }),
    );
    // 35-28=7일 차이
    const ms28 = Date.UTC(c28.dueDate.year, c28.dueDate.month - 1, c28.dueDate.day);
    const ms35 = Date.UTC(c35.dueDate.year, c35.dueDate.month - 1, c35.dueDate.day);
    expect((ms35 - ms28) / 86_400_000).toBe(7);
  });

  it("진행률·남은 일수", () => {
    const out = calculateDueDate(
      due({ lmpYear: 2026, lmpMonth: 1, lmpDay: 1, cycleLength: 28, refYear: 2026, refMonth: 4, refDay: 11 }),
    );
    expect(out.progress).toBeGreaterThan(0);
    expect(out.daysToGo).toBeGreaterThan(0);
  });
});
