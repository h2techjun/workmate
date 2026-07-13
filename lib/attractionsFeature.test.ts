import { describe, it, expect } from "vitest";
import { kstDateString, pickTodayAttraction } from "./attractionsFeature";

describe("kstDateString", () => {
  it("UTC 시각을 KST(+9) 날짜로 변환한다", () => {
    // 2026-07-13 00:00 UTC = 2026-07-13 09:00 KST
    expect(kstDateString(new Date("2026-07-13T00:00:00Z"))).toBe("2026-07-13");
  });

  it("자정 직전 UTC는 KST 기준 다음 날이 된다", () => {
    // 2026-07-12 20:00 UTC = 2026-07-13 05:00 KST
    expect(kstDateString(new Date("2026-07-12T20:00:00Z"))).toBe("2026-07-13");
  });
});

describe("pickTodayAttraction", () => {
  const list = ["a", "b", "c", "d", "e"] as const;

  it("빈 목록은 null", () => {
    expect(pickTodayAttraction([], new Date("2026-07-13T00:00:00Z"))).toBeNull();
  });

  it("같은 KST 날짜는 항상 같은 항목을 반환(결정론)", () => {
    const d1 = new Date("2026-07-13T01:00:00Z");
    const d2 = new Date("2026-07-13T10:00:00Z"); // 같은 KST 날짜
    expect(pickTodayAttraction(list, d1)).toBe(pickTodayAttraction(list, d2));
  });

  it("반환값은 항상 목록 안의 원소", () => {
    for (let day = 1; day <= 28; day += 1) {
      const dd = String(day).padStart(2, "0");
      const picked = pickTodayAttraction(list, new Date(`2026-07-${dd}T03:00:00Z`));
      expect(list).toContain(picked);
    }
  });

  it("서로 다른 날짜는 목록을 고루 순회한다(전부 같지 않음)", () => {
    const picks = new Set<string>();
    for (let day = 1; day <= 20; day += 1) {
      const dd = String(day).padStart(2, "0");
      const p = pickTodayAttraction(list, new Date(`2026-07-${dd}T03:00:00Z`));
      if (p) picks.add(p);
    }
    expect(picks.size).toBeGreaterThan(1);
  });
});
