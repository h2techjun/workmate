import { describe, expect, it } from "vitest";
import { calculateSpan } from "./span";

describe("calculateSpan - 표준 케이스", () => {
  it("SPF #2 2x10 floor joist @ 400mm — 4~5m 범위", () => {
    const r = calculateSpan({
      memberType: "floorJoist",
      lumberSize: "2x10",
      spacingMM: 400,
      grade: "spf2",
    });
    // IRC R502.3.1(2) 비교: SPF #2 2x10 @ 16" ≈ 5.13m. 본 도구(보정 일부 미적용) 4~5m 합리적.
    expect(r.maxSpanMM).toBeGreaterThan(4000);
    expect(r.maxSpanMM).toBeLessThan(5500);
    expect(r.governingCheck).toBe("deflection"); // 일반적으로 처짐 지배
  });

  it("2x12가 2x10보다 더 멀리 간다", () => {
    const a = calculateSpan({
      memberType: "floorJoist",
      lumberSize: "2x10",
      spacingMM: 400,
      grade: "spf2",
    });
    const b = calculateSpan({
      memberType: "floorJoist",
      lumberSize: "2x12",
      spacingMM: 400,
      grade: "spf2",
    });
    expect(b.maxSpanMM).toBeGreaterThan(a.maxSpanMM);
  });

  it("간격 600mm는 400mm보다 짧다", () => {
    const a = calculateSpan({
      memberType: "floorJoist",
      lumberSize: "2x10",
      spacingMM: 400,
      grade: "spf2",
    });
    const b = calculateSpan({
      memberType: "floorJoist",
      lumberSize: "2x10",
      spacingMM: 600,
      grade: "spf2",
    });
    expect(b.maxSpanMM).toBeLessThan(a.maxSpanMM);
  });
});

describe("calculateSpan - 수종 영향", () => {
  it("Douglas Fir #2가 SPF #2보다 길다 (Fb·E 모두 큼)", () => {
    const spf = calculateSpan({
      memberType: "floorJoist",
      lumberSize: "2x10",
      spacingMM: 400,
      grade: "spf2",
    });
    const df = calculateSpan({
      memberType: "floorJoist",
      lumberSize: "2x10",
      spacingMM: 400,
      grade: "df2",
    });
    expect(df.maxSpanMM).toBeGreaterThan(spf.maxSpanMM);
  });
});

describe("calculateSpan - 적설하중 (서까래)", () => {
  it("강원 영동(3.0kN/m²)이 서울(0.5kN/m²)보다 짧다", () => {
    const seoul = calculateSpan({
      memberType: "rafter",
      lumberSize: "2x10",
      spacingMM: 400,
      grade: "spf2",
      snowRegion: "seoulMetro",
    });
    const yeongdong = calculateSpan({
      memberType: "rafter",
      lumberSize: "2x10",
      spacingMM: 400,
      grade: "spf2",
      snowRegion: "gangwonYeongdong",
    });
    expect(yeongdong.maxSpanMM).toBeLessThan(seoul.maxSpanMM);
    expect(yeongdong.totalLoadKnPerM2).toBeGreaterThan(seoul.totalLoadKnPerM2);
  });
});

describe("calculateSpan - 반복부재 보정 (Cr)", () => {
  it("간격 600mm 이하 장선은 Cr=1.15 적용", () => {
    const r = calculateSpan({
      memberType: "floorJoist",
      lumberSize: "2x10",
      spacingMM: 400,
      grade: "spf2",
    });
    // baseFb = 7.6, effectiveFb = 7.6 × 1.15 = 8.74
    expect(r.effectiveFbMPa).toBeCloseTo(7.6 * 1.15, 5);
  });

  it("헤더는 Cr 미적용 (반복부재 아님)", () => {
    const r = calculateSpan({
      memberType: "header",
      lumberSize: "2x10",
      spacingMM: 400,
      grade: "spf2",
    });
    expect(r.effectiveFbMPa).toBe(7.6);
  });
});

describe("calculateSpan - 입력 검증", () => {
  it("간격 100mm 거부", () => {
    expect(() =>
      calculateSpan({
        memberType: "floorJoist",
        lumberSize: "2x10",
        spacingMM: 100,
        grade: "spf2",
      }),
    ).toThrow();
  });
});

describe("calculateSpan - 결과 형태", () => {
  it("calculationSteps 7단계 모두 포함", () => {
    const r = calculateSpan({
      memberType: "floorJoist",
      lumberSize: "2x10",
      spacingMM: 400,
      grade: "spf2",
    });
    const keys = r.calculationSteps.map((s) => s.key);
    expect(keys).toEqual([
      "loads",
      "lineLoad",
      "section",
      "fbAdjusted",
      "bendingSpan",
      "deflectionSpan",
      "governing",
    ]);
  });
});
