import { describe, expect, it } from "vitest";
import {
  BreakerCalculationError,
  calculateBreaker,
} from "./breaker";

describe("calculateBreaker - 표준 케이스", () => {
  it("일반 80A 부하 + 안전율 1.25 → 100A MCCB", () => {
    const r = calculateBreaker({
      loadCurrent: 80,
      loadType: "general",
    });
    // 80 × 1.25 = 100 → MCCB 100A
    expect(r.calculatedMinRating).toBe(100);
    expect(r.recommendedRating).toBe(100);
    expect(r.breakerType).toBe("MCCB");
    expect(r.appliedSafetyFactor).toBe(1.25);
  });

  it("일반 30A 부하 → 40A MCB (소형, 63A 이하)", () => {
    const r = calculateBreaker({
      loadCurrent: 30,
      loadType: "general",
    });
    // 30 × 1.25 = 37.5 → MCB 40A
    expect(r.recommendedRating).toBe(40);
    expect(r.breakerType).toBe("MCB");
  });

  it("모터 직입기동 50A → 80A 또는 100A MCCB", () => {
    const r = calculateBreaker({
      loadCurrent: 50,
      loadType: "motorDirect",
    });
    // 50 × 1.5 = 75 → MCCB 75A
    expect(r.appliedSafetyFactor).toBe(1.5);
    expect(r.recommendedRating).toBe(75);
  });

  it("Y-Δ 모터 100A → 200A 또는 225A MCCB", () => {
    const r = calculateBreaker({
      loadCurrent: 100,
      loadType: "motorYDelta",
    });
    // 100 × 2.0 = 200 → MCCB 200A
    expect(r.appliedSafetyFactor).toBe(2.0);
    expect(r.recommendedRating).toBe(200);
  });
});

describe("calculateBreaker - 사용자 안전율 오버라이드", () => {
  it("custom 1.6 → 80A × 1.6 = 128 → 150A MCCB", () => {
    const r = calculateBreaker({
      loadCurrent: 80,
      loadType: "general",
      customSafetyFactor: 1.6,
    });
    expect(r.appliedSafetyFactor).toBe(1.6);
    expect(r.calculatedMinRating).toBe(128);
    expect(r.recommendedRating).toBe(150);
  });
});

describe("calculateBreaker - 인버터 + ELB 경고", () => {
  it("인버터 부하에 ELB 사용 시 inverterWithElb 경고", () => {
    const r = calculateBreaker({
      loadCurrent: 50,
      loadType: "inverter",
      useElb: true,
    });
    expect(r.warnings.some((w) => w.key === "inverterWithElb")).toBe(true);
  });
  it("인버터 부하에 ELB 미사용 시 경고 없음", () => {
    const r = calculateBreaker({
      loadCurrent: 50,
      loadType: "inverter",
      useElb: false,
    });
    expect(r.warnings.some((w) => w.key === "inverterWithElb")).toBe(false);
  });
});

describe("calculateBreaker - 안전여유 경고", () => {
  it("안전여유가 10% 미만이면 경고", () => {
    // 50A × 1.25 = 62.5 → 63A MCB. 여유 = (63-50)/63 = 20.6% (안전)
    // 60A × 1.25 = 75 → 75A MCCB. 여유 = (75-60)/75 = 20% (안전)
    // 56A × 1.25 = 70 → 75A. 여유 = (75-56)/75 = 25.3%
    // 72A × 1.25 = 90 → 100A. 여유 = (100-72)/100 = 28%
    // 89A × 1.25 = 111.25 → 125. 여유 = (125-89)/125 = 28.8%
    // 안전여유 10% 미만은 표준 정격 차이가 적은 큰 부하에서:
    // 95A × 1.25 = 118.75 → 125. 여유 = (125-95)/125 = 24%
    // 임의로 119A × 1.25 = 148.75 → 150A. 여유 = (150-119)/150 = 20.6%
    // 임의로 145A × 1.25 = 181.25 → 200A. 여유 = 27.5%
    // 임의로 230A × 1.0 (직접 지정) = 230 → 250A. 여유 = 8% → 경고
    const r = calculateBreaker({
      loadCurrent: 230,
      loadType: "general",
      customSafetyFactor: 1.0,
    });
    expect(r.recommendedRating).toBe(250);
    expect(r.safetyMarginPercent).toBeLessThan(10);
    expect(r.warnings.some((w) => w.key === "marginLow")).toBe(true);
  });
});

describe("calculateBreaker - 입력 검증", () => {
  it("음수 부하 거부", () => {
    expect(() =>
      calculateBreaker({ loadCurrent: -10, loadType: "general" }),
    ).toThrow();
  });

  it("표준 정격 초과 부하 → noStandardMatch", () => {
    expect(() =>
      calculateBreaker({
        loadCurrent: 4000,
        loadType: "general",
      }),
    ).toThrow(BreakerCalculationError);
  });
});

describe("calculateBreaker - 결과 토큰", () => {
  it("3단계 calculation steps", () => {
    const r = calculateBreaker({ loadCurrent: 80, loadType: "general" });
    const keys = r.calculationSteps.map((s) => s.key);
    expect(keys).toEqual(["minRating", "selectRating", "safetyMargin"]);
  });
});
