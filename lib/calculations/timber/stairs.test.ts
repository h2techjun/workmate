import { describe, expect, it } from "vitest";
import { calculateStairs } from "./stairs";

describe("calculateStairs - 표준 케이스", () => {
  it("주거용 totalRise=2700, preferred=180 → 15단, 단높이 180, 단너비 260, Blondel 620", () => {
    const r = calculateStairs({
      totalRise: 2700,
      preferredRiser: 180,
      useType: "residential",
    });
    expect(r.numSteps).toBe(15);
    expect(r.actualRiser).toBeCloseTo(180, 5);
    expect(r.tread).toBeCloseTo(260, 5);
    expect(r.blondelValue).toBeCloseTo(620, 5);
    expect(r.blondelOk).toBe(true);
    expect(r.riserOk).toBe(true);
    expect(r.treadOk).toBe(true);
    expect(r.warnings).toHaveLength(0);
  });

  it("진행거리 입력 시 단너비 = totalRun / (단수-1)", () => {
    const r = calculateStairs({
      totalRise: 2700,
      totalRun: 4200,
      preferredRiser: 180,
    });
    expect(r.numSteps).toBe(15);
    expect(r.tread).toBeCloseTo(300, 5);
    expect(r.angleDegrees).toBeCloseTo(Math.atan(180 / 300) * (180 / Math.PI), 3);
  });

  it("계단 빗변 길이 = √(rise² + run²)", () => {
    const r = calculateStairs({
      totalRise: 2700,
      preferredRiser: 180,
    });
    const expectedRun = r.tread * (r.numSteps - 1);
    const expectedLen = Math.sqrt(2700 ** 2 + expectedRun ** 2);
    expect(r.stairLength).toBeCloseTo(expectedLen, 1);
  });
});

describe("calculateStairs - 안전 경고", () => {
  it("주거용 단높이 220mm 입력 → preferredRiserExceedsLimit + riserTooHigh", () => {
    const r = calculateStairs({
      totalRise: 2200,
      preferredRiser: 220,
      useType: "residential",
    });
    const keys = r.warnings.map((w) => w.key);
    expect(keys).toContain("preferredRiserExceedsLimit");
  });

  it("공용 단너비가 너무 좁으면 treadTooSmall 경고", () => {
    // 공용 minTread=280. 진행거리 작게 주면 단너비가 240 정도로 떨어짐
    const r = calculateStairs({
      totalRise: 2700,
      totalRun: 3360,
      preferredRiser: 180,
      useType: "public",
    });
    expect(r.tread).toBeLessThan(280);
    expect(r.warnings.find((w) => w.key === "treadTooSmall")).toBeDefined();
  });

  it("Blondel 범위 벗어나면 blondelOutOfRange 경고", () => {
    const r = calculateStairs({
      totalRise: 2700,
      totalRun: 6000,
      preferredRiser: 180,
    });
    // tread = 6000 / 14 ≈ 428.57 → blondel = 360 + 428.57 = 788.57
    expect(r.blondelOk).toBe(false);
    expect(
      r.warnings.find((w) => w.key === "blondelOutOfRange"),
    ).toBeDefined();
  });
});

describe("calculateStairs - 입력 검증", () => {
  it("totalRise 50mm 거부 (최소 100)", () => {
    expect(() =>
      calculateStairs({ totalRise: 50, preferredRiser: 180 }),
    ).toThrow();
  });
  it("preferredRiser 300mm 거부 (최대 250)", () => {
    expect(() =>
      calculateStairs({ totalRise: 2700, preferredRiser: 300 }),
    ).toThrow();
  });
});
