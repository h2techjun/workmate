import { describe, it, expect } from "vitest";
import { convertTemperature, tempInputSchema } from "./temperature";

const parse = (o: Record<string, unknown>) => tempInputSchema.parse(o);

describe("온도 변환", () => {
  it("0°C = 32°F = 273.15K", () => {
    const out = convertTemperature(parse({ value: 0, unit: "c" }));
    expect(out.f).toBe(32);
    expect(out.k).toBe(273.15);
  });

  it("100°C = 212°F (끓는점)", () => {
    const out = convertTemperature(parse({ value: 100, unit: "c" }));
    expect(out.f).toBe(212);
  });

  it("화씨 입력: 98.6°F ≈ 37°C (체온)", () => {
    const out = convertTemperature(parse({ value: 98.6, unit: "f" }));
    expect(out.c).toBeCloseTo(37, 1);
  });

  it("켈빈 입력: 300K ≈ 26.85°C", () => {
    const out = convertTemperature(parse({ value: 300, unit: "k" }));
    expect(out.c).toBeCloseTo(26.85, 1);
  });

  it("-40°C = -40°F (교차점)", () => {
    const out = convertTemperature(parse({ value: -40, unit: "c" }));
    expect(out.f).toBe(-40);
  });

  it("체감 분류: 0이하 freezing, 25 warm, 35 hot", () => {
    expect(convertTemperature(parse({ value: -5, unit: "c" })).feel).toBe("freezing");
    expect(convertTemperature(parse({ value: 25, unit: "c" })).feel).toBe("warm");
    expect(convertTemperature(parse({ value: 35, unit: "c" })).feel).toBe("hot");
  });
});
