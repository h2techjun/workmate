import { describe, it, expect } from "vitest";
import { checkVoltage, voltageInputSchema } from "./voltage";

const parse = (o: Record<string, unknown>) => voltageInputSchema.parse(o);

describe("한국 전압·플러그 가이드", () => {
  it("프리볼트(100~240V) 미국 플러그 → 변압기 X, 어댑터 O", () => {
    const out = checkVoltage(
      parse({ deviceMinV: 100, deviceMaxV: 240, plugType: "A" }),
    );
    expect(out.needsTransformer).toBe(false);
    expect(out.isDualVoltage).toBe(true);
    expect(out.needsPlugAdapter).toBe(true); // A 타입은 한국 C/F 와 다름
  });

  it("미국 120V 전용 → 강압 변압기 필요", () => {
    const out = checkVoltage(
      parse({ deviceMinV: 120, deviceMaxV: 120, plugType: "A" }),
    );
    expect(out.needsTransformer).toBe(true);
    expect(out.transformerType).toBe("step-down");
  });

  it("유럽 C 타입 220V → 변압기 X, 어댑터 X (한국 호환)", () => {
    const out = checkVoltage(
      parse({ deviceMinV: 220, deviceMaxV: 240, plugType: "C" }),
    );
    expect(out.needsTransformer).toBe(false);
    expect(out.needsPlugAdapter).toBe(false);
  });

  it("F 타입(독일)도 한국 호환", () => {
    const out = checkVoltage(
      parse({ deviceMinV: 230, deviceMaxV: 230, plugType: "F" }),
    );
    expect(out.needsPlugAdapter).toBe(false);
  });

  it("한국 표준 220V/60Hz 반환", () => {
    const out = checkVoltage(parse({ deviceMinV: 100, deviceMaxV: 240 }));
    expect(out.koreaVoltage).toBe(220);
    expect(out.koreaFrequency).toBe(60);
  });

  it("100V 전용(일본) → 강압 필요", () => {
    const out = checkVoltage(
      parse({ deviceMinV: 100, deviceMaxV: 100, plugType: "A" }),
    );
    expect(out.transformerType).toBe("step-down");
  });
});
