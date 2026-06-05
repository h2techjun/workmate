import { describe, it, expect } from "vitest";
import { calculatePaint, paintInputSchema } from "./paint";

const parse = (o: Record<string, unknown>) => paintInputSchema.parse(o);

describe("페인트 도장 계산", () => {
  it("벽 50㎡, 문1 창1, 2회, 도포율 10 → 개구부 3.5㎡ 차감", () => {
    const out = calculatePaint(
      parse({ wallArea: 50, doorCount: 1, windowCount: 1, coats: 2, spreadRate: 10 }),
    );
    expect(out.openingArea).toBe(3.5); // 2.0 + 1.5
    expect(out.netArea).toBe(46.5);
    expect(out.totalCoatArea).toBe(93); // 46.5 × 2
  });

  it("필요 페인트: 93㎡ / 10 = 9.3L, 손실 10% = 10.23L", () => {
    const out = calculatePaint(
      parse({ wallArea: 50, doorCount: 1, windowCount: 1, coats: 2, spreadRate: 10, wastePercent: 10 }),
    );
    expect(out.litersBase).toBe(9.3);
    expect(out.litersWithWaste).toBeCloseTo(10.23, 2);
    expect(out.cans4L).toBe(3); // ceil(10.23/4)
  });

  it("개구부 없음: 벽 = 순면적", () => {
    const out = calculatePaint(parse({ wallArea: 30, coats: 1, spreadRate: 10 }));
    expect(out.netArea).toBe(30);
    expect(out.totalCoatArea).toBe(30);
  });

  it("도장 횟수 증가 → 페인트 비례 증가", () => {
    const c1 = calculatePaint(parse({ wallArea: 40, coats: 1, spreadRate: 10 }));
    const c3 = calculatePaint(parse({ wallArea: 40, coats: 3, spreadRate: 10 }));
    expect(c3.litersBase).toBeCloseTo(c1.litersBase * 3, 2);
  });

  it("개구부가 벽보다 크면 순면적 0", () => {
    const out = calculatePaint(parse({ wallArea: 1, doorCount: 1, coats: 1, spreadRate: 10 }));
    expect(out.netArea).toBe(0);
    expect(out.litersWithWaste).toBe(0);
  });

  it("4L 통 올림 계산", () => {
    const out = calculatePaint(
      parse({ wallArea: 100, coats: 2, spreadRate: 10, wastePercent: 0 }),
    );
    // 200㎡/10 = 20L → 4L통 5개
    expect(out.litersBase).toBe(20);
    expect(out.cans4L).toBe(5);
  });
});
