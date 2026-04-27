import { describe, expect, it } from "vitest";
import { calculateVoltageDrop } from "./voltageDrop";

describe("calculateVoltageDrop - docs Test 1", () => {
  it("380V 3상3선식, 50A, 100m, 16mm² → 9.625V (2.53%)", () => {
    const r = calculateVoltageDrop({
      voltage: 380,
      current: 50,
      distance: 100,
      crossSection: 16,
      phaseType: "three-3wire",
      material: "copper",
    });
    // e = (30.8 × 100 × 50) / (1000 × 16) = 9.625V
    expect(r.voltageDropV).toBeCloseTo(9.625, 3);
    // 9.625 / 380 × 100 ≈ 2.533%
    expect(r.voltageDropPercent).toBeCloseTo(2.533, 2);
    expect(r.receivingVoltage).toBeCloseTo(370.375, 2);
    // 100m 거리 → limit 5%, 2.53% 통과
    expect(r.limitPercent).toBe(5);
    expect(r.pass).toBe(true);
  });
});

describe("calculateVoltageDrop - 거리별 허용치", () => {
  it("50m → 3% 한계", () => {
    const r = calculateVoltageDrop({
      voltage: 220,
      current: 30,
      distance: 50,
      crossSection: 6,
      phaseType: "single-2wire",
      material: "copper",
    });
    expect(r.limitPercent).toBe(3);
  });
  it("100m → 5% 한계", () => {
    const r = calculateVoltageDrop({
      voltage: 220,
      current: 30,
      distance: 100,
      crossSection: 6,
      phaseType: "single-2wire",
      material: "copper",
    });
    expect(r.limitPercent).toBe(5);
  });
  it("180m → 6% 한계", () => {
    const r = calculateVoltageDrop({
      voltage: 380,
      current: 50,
      distance: 180,
      crossSection: 35,
      phaseType: "three-3wire",
      material: "copper",
    });
    expect(r.limitPercent).toBe(6);
  });
  it("250m → 7% 한계", () => {
    const r = calculateVoltageDrop({
      voltage: 380,
      current: 50,
      distance: 250,
      crossSection: 70,
      phaseType: "three-3wire",
      material: "copper",
    });
    expect(r.limitPercent).toBe(7);
  });
});

describe("calculateVoltageDrop - 알루미늄 보정", () => {
  it("동선 9.625V → 알루미늄은 1.6배 = 15.4V", () => {
    const cu = calculateVoltageDrop({
      voltage: 380,
      current: 50,
      distance: 100,
      crossSection: 16,
      phaseType: "three-3wire",
      material: "copper",
    });
    const al = calculateVoltageDrop({
      voltage: 380,
      current: 50,
      distance: 100,
      crossSection: 16,
      phaseType: "three-3wire",
      material: "aluminum",
    });
    expect(al.voltageDropV).toBeCloseTo(cu.voltageDropV * 1.6, 3);
  });
});

describe("calculateVoltageDrop - 미통과 케이스", () => {
  it("작은 단면적 + 긴 거리 → 미통과", () => {
    const r = calculateVoltageDrop({
      voltage: 220,
      current: 30,
      distance: 100,
      crossSection: 2.5,
      phaseType: "single-2wire",
      material: "copper",
    });
    // e = (35.6 × 100 × 30) / (1000 × 2.5) = 42.72V → 19.4% > 5%
    expect(r.pass).toBe(false);
    expect(r.voltageDropPercent).toBeGreaterThan(5);
  });
});

describe("calculateVoltageDrop - 입력 검증", () => {
  it("KS 표준이 아닌 단면적 거부", () => {
    expect(() =>
      calculateVoltageDrop({
        voltage: 220,
        current: 30,
        distance: 50,
        crossSection: 8, // KS 표준 아님 (6 또는 10)
        phaseType: "single-2wire",
        material: "copper",
      }),
    ).toThrow();
  });
  it("음수 거리 거부", () => {
    expect(() =>
      calculateVoltageDrop({
        voltage: 220,
        current: 30,
        distance: -10,
        crossSection: 6,
        phaseType: "single-2wire",
        material: "copper",
      }),
    ).toThrow();
  });
});
