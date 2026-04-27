import { describe, expect, it } from "vitest";
import { calculateInsulation } from "./insulation";

describe("calculateInsulation - 표준 외벽 (중부2)", () => {
  it("9.5mm 석고 + 140mm 글라스울24 + 11mm OSB + 12mm 합판 → 통과 (외벽 직접)", () => {
    const r = calculateInsulation({
      region: "central2",
      element: "exteriorWallDirect",
      layers: [
        { material: "gypsum9", thicknessMM: 9.5 },
        { material: "glasswool24", thicknessMM: 140 },
        { material: "osb11", thicknessMM: 11 },
        { material: "plywood12", thicknessMM: 12 },
      ],
    });
    // U_limit (중부2 외벽 직접) = 0.17 W/m²·K
    expect(r.uLimit).toBe(0.17);
    // 단열재 R = 0.140/0.038 = 3.68
    // 석고 R = 0.0095/0.18 = 0.053
    // OSB R = 0.011/0.13 = 0.085
    // 합판 R = 0.012/0.13 = 0.092
    // 표면 R = 0.11 + 0.04 = 0.15
    // total R ≈ 4.06 m²·K/W → U ≈ 0.246 (실패)
    expect(r.uValue).toBeCloseTo(0.246, 2);
    expect(r.pass).toBe(false); // 단열 부족
  });

  it("두꺼운 단열(220mm 글라스울48) → 중부2 통과", () => {
    const r = calculateInsulation({
      region: "central2",
      element: "exteriorWallDirect",
      layers: [
        { material: "gypsum9", thicknessMM: 9.5 },
        { material: "glasswool48", thicknessMM: 220 },
        { material: "osb11", thicknessMM: 11 },
      ],
    });
    expect(r.pass).toBe(true);
    expect(r.uValue).toBeLessThan(0.17);
  });

  it("제주 외벽 직접 한계 0.29 — 140mm 글라스울24면 통과", () => {
    const r = calculateInsulation({
      region: "jeju",
      element: "exteriorWallDirect",
      layers: [
        { material: "gypsum9", thicknessMM: 9.5 },
        { material: "glasswool24", thicknessMM: 140 },
        { material: "osb11", thicknessMM: 11 },
      ],
    });
    expect(r.uLimit).toBe(0.29);
    // 140mm/0.038 = 3.68 + 0.053 + 0.085 + 0.15 = 3.97 → U = 0.252 (통과)
    expect(r.pass).toBe(true);
    expect(r.uValue).toBeLessThan(0.29);
  });
});

describe("calculateInsulation - 단일 레이어", () => {
  it("XPS 100mm: R = 0.1/0.029 ≈ 3.45", () => {
    const r = calculateInsulation({
      region: "central2",
      element: "exteriorWallDirect",
      layers: [{ material: "xps", thicknessMM: 100 }],
    });
    const xpsR = r.layers[0]?.R ?? 0;
    expect(xpsR).toBeCloseTo(3.448, 2);
  });

  it("공기층은 fixedR 적용 (두께 무관 0.18)", () => {
    const r = calculateInsulation({
      region: "central2",
      element: "exteriorWallDirect",
      layers: [{ material: "airSpace", thicknessMM: 50 }],
    });
    expect(r.layers[0]?.R).toBeCloseTo(0.18, 5);
  });
});

describe("calculateInsulation - U값 = 1/R", () => {
  it("R=4.0이면 U=0.25", () => {
    // R 직접 입력 어려우니 단열재로 맞춤
    const r = calculateInsulation({
      region: "central2",
      element: "exteriorWallDirect",
      // 0.038 × R / 1000 = thickness  →  R 4.0 = 152mm 글라스울24
      layers: [{ material: "glasswool24", thicknessMM: 146 }],
    });
    // total = 146/0.038/1000 + 0.15 = 3.842 + 0.15 = 3.99
    expect(r.totalR).toBeCloseTo(3.992, 2);
    expect(r.uValue).toBeCloseTo(0.2505, 3);
  });
});

describe("calculateInsulation - 입력 검증", () => {
  it("0층 거부", () => {
    expect(() =>
      calculateInsulation({
        region: "central2",
        element: "exteriorWallDirect",
        layers: [],
      }),
    ).toThrow();
  });
  it("두께 0 거부", () => {
    expect(() =>
      calculateInsulation({
        region: "central2",
        element: "exteriorWallDirect",
        layers: [{ material: "xps", thicknessMM: 0 }],
      }),
    ).toThrow();
  });
});
