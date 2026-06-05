import { describe, it, expect } from "vitest";
import { calculateKoreanAge, koreanAgeInputSchema } from "./koreanAge";

const parse = (o: Record<string, number>) => koreanAgeInputSchema.parse(o);

describe("한국식 나이 계산", () => {
  it("생일 지난 경우: 1990-03-15 출생, 2026-06-06 기준", () => {
    const out = calculateKoreanAge(
      parse({
        birthYear: 1990,
        birthMonth: 3,
        birthDay: 15,
        refYear: 2026,
        refMonth: 6,
        refDay: 6,
      }),
    );
    expect(out.birthdayPassed).toBe(true);
    expect(out.internationalAge).toBe(36); // 2026-1990, 생일 지남
    expect(out.countingAge).toBe(37); // 2026-1990+1
    expect(out.yearAge).toBe(36); // 2026-1990
  });

  it("생일 안 지난 경우: 1990-12-25 출생, 2026-06-06 기준", () => {
    const out = calculateKoreanAge(
      parse({
        birthYear: 1990,
        birthMonth: 12,
        birthDay: 25,
        refYear: 2026,
        refMonth: 6,
        refDay: 6,
      }),
    );
    expect(out.birthdayPassed).toBe(false);
    expect(out.internationalAge).toBe(35); // 생일 안 지나 -1
    expect(out.countingAge).toBe(37); // 세는나이는 연도 차 +1 그대로
    expect(out.yearAge).toBe(36); // 연나이도 연도 차 그대로
  });

  it("생일 당일: 만나이 +1 반영 (생일 포함)", () => {
    const out = calculateKoreanAge(
      parse({
        birthYear: 2000,
        birthMonth: 6,
        birthDay: 6,
        refYear: 2026,
        refMonth: 6,
        refDay: 6,
      }),
    );
    expect(out.birthdayPassed).toBe(true); // 생일 당일은 지난 것으로
    expect(out.internationalAge).toBe(26);
    expect(out.daysUntilNextBirthday).toBe(365); // 다음 생일까지 (2027 평년)
  });

  it("신생아: 2026년 출생 → 세는나이 1, 만나이 0", () => {
    const out = calculateKoreanAge(
      parse({
        birthYear: 2026,
        birthMonth: 1,
        birthDay: 1,
        refYear: 2026,
        refMonth: 6,
        refDay: 6,
      }),
    );
    expect(out.countingAge).toBe(1);
    expect(out.internationalAge).toBe(0);
    expect(out.yearAge).toBe(0);
  });

  it("세는나이 vs 만나이 차이: 연초 출생이면 최대 2살 차", () => {
    // 12월생, 다음해 1월 기준 → 만 0, 세는 2
    const out = calculateKoreanAge(
      parse({
        birthYear: 2025,
        birthMonth: 12,
        birthDay: 31,
        refYear: 2026,
        refMonth: 1,
        refDay: 1,
      }),
    );
    expect(out.internationalAge).toBe(0); // 태어난 지 하루
    expect(out.countingAge).toBe(2); // 2026-2025+1 = 2
    // 세는나이 - 만나이 = 2 (12월생 함정)
    expect(out.countingAge - out.internationalAge).toBe(2);
  });

  it("다음 생일까지 남은 일수: 6/6 기준 12/25 생일 = 202일", () => {
    const out = calculateKoreanAge(
      parse({
        birthYear: 1990,
        birthMonth: 12,
        birthDay: 25,
        refYear: 2026,
        refMonth: 6,
        refDay: 6,
      }),
    );
    // 2026-06-06 → 2026-12-25
    expect(out.daysUntilNextBirthday).toBe(202);
  });
});
