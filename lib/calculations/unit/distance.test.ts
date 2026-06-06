import { describe, it, expect } from "vitest";
import { convertDistance, distanceInputSchema, RI_M, JA_M } from "./distance";

const parse = (o: Record<string, unknown>) => distanceInputSchema.parse(o);

describe("거리 단위 변환", () => {
  it("1리 ≈ 392.7m, 10리 ≈ 3.93km", () => {
    const out = convertDistance(parse({ value: 1, unit: "ri" }));
    expect(out.m).toBeCloseTo(392.727, 1);
    const ten = convertDistance(parse({ value: 10, unit: "ri" }));
    expect(ten.km).toBeCloseTo(3.927, 2);
  });

  it("1자 = 10/33 m", () => {
    const out = convertDistance(parse({ value: 1, unit: "ja" }));
    expect(out.m).toBeCloseTo(JA_M, 5);
    expect(out.m).toBeCloseTo(0.30303, 4);
  });

  it("1리 = 1296자", () => {
    const out = convertDistance(parse({ value: 1, unit: "ri" }));
    expect(out.ja).toBeCloseTo(1296, 0);
  });

  it("1보 = 6자", () => {
    const out = convertDistance(parse({ value: 1, unit: "bo" }));
    expect(out.ja).toBeCloseTo(6, 3);
  });

  it("1 mile = 1609.344 m", () => {
    const out = convertDistance(parse({ value: 1, unit: "mile" }));
    expect(out.m).toBeCloseTo(1609.344, 2);
  });

  it("1km → 모든 단위 역수 관계", () => {
    const out = convertDistance(parse({ value: 1, unit: "km" }));
    expect(out.m).toBe(1000);
    expect(out.mile).toBeCloseTo(0.6214, 3);
    expect(out.ri).toBeCloseTo(1000 / RI_M, 3);
  });

  it("0 → 모두 0", () => {
    const out = convertDistance(parse({ value: 0, unit: "ri" }));
    expect(out.m).toBe(0);
    expect(out.km).toBe(0);
  });
});
