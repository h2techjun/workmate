import { describe, it, expect } from "vitest";
import { calculateBrick, brickInputSchema } from "./brick";

describe("calculateBrick", () => {
  it("표준형 벽돌 1.0B 10m² — 정미 1490매 + 5% 할증", () => {
    const r = calculateBrick(
      brickInputSchema.parse({ wallArea: 10, brickType: "standard", bond: "one", waste: 5 }),
    );
    expect(r.bricksNet).toBe(1490); // 10 × 149
    expect(r.bricks).toBe(1565); // ceil(1490 × 1.05)
    expect(r.perM2).toBe(149);
  });

  it("0.5B 반장쌓기는 75매/m²", () => {
    const r = calculateBrick(
      brickInputSchema.parse({ wallArea: 10, brickType: "standard", bond: "half", waste: 0 }),
    );
    expect(r.bricksNet).toBe(750);
    expect(r.bricks).toBe(750);
  });

  it("콘크리트 블록은 bond 무관하게 12.5매/m²", () => {
    const r = calculateBrick(
      brickInputSchema.parse({ wallArea: 20, brickType: "block", bond: "two", waste: 0 }),
    );
    expect(r.perM2).toBe(12.5);
    expect(r.bricksNet).toBe(250); // 20 × 12.5
  });

  it("모르타르·시멘트·모래 배합 (1.0B 10m²)", () => {
    const r = calculateBrick(
      brickInputSchema.parse({ wallArea: 10, brickType: "standard", bond: "one", waste: 5 }),
    );
    expect(r.mortarM3).toBeCloseTo(0.49, 2); // 10 × 0.049
    expect(r.cementKg).toBe(250); // 0.49 × 510 ≈ 249.9 → 250
    expect(r.cementBags).toBe(7); // ceil(250 / 40)
    expect(r.sandM3).toBeCloseTo(0.54, 2); // 0.49 × 1.1
  });

  it("면적 0이면 전부 0", () => {
    const r = calculateBrick(brickInputSchema.parse({ wallArea: 0 }));
    expect(r.bricks).toBe(0);
    expect(r.mortarM3).toBe(0);
    expect(r.cementBags).toBe(0);
  });

  it("할증률은 올림 처리로 실발주 수량 보장", () => {
    const r = calculateBrick(
      brickInputSchema.parse({ wallArea: 5, brickType: "cement", bond: "oneHalf", waste: 5 }),
    );
    expect(r.bricksNet).toBe(1120); // 5 × 224
    expect(r.bricks).toBe(1176); // ceil(1120 × 1.05)
  });
});
