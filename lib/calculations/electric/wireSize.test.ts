import { describe, expect, it } from "vitest";
import {
  WireSizeCalculationError,
  calculateWireSize,
  wireSizeInputSchema,
  type CalculationStep,
} from "./wireSize";

const findStep = <K extends CalculationStep["key"]>(
  steps: CalculationStep[],
  key: K,
): Extract<CalculationStep, { key: K }> | undefined =>
  steps.find((s): s is Extract<CalculationStep, { key: K }> => s.key === key);

describe("calculateWireSize - docs/electric-calc.md 표준 케이스", () => {
  it("Test 1: 380V 3상3선식, 100A, 50m, 2% 허용 → 35mm² (전압강하 + 허용전류 동시 만족)", () => {
    const result = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
    });

    expect(result.recommendedCrossSection).toBe(35);
    expect(result.baseAmpacity).toBe(110);
    expect(result.temperatureFactor).toBeCloseTo(1.0, 5);
    expect(result.groupingFactor).toBeCloseTo(1.0, 5);
    expect(result.effectiveAmpacity).toBeCloseTo(110, 5);
    expect(result.actualVoltageDrop).toBeCloseTo(4.4, 2);
    expect(result.actualDropPercent).toBeCloseTo(1.158, 2);
    expect(result.safetyMarginPercent).toBeCloseTo(9.09, 1);
    expect(result.calculationSteps).toHaveLength(7);
  });
});

describe("calculateWireSize - 상 종류별 계수 검증", () => {
  it("단상2선식: 220V, 30A, 30m, 3% 허용 → 6mm²", () => {
    const result = calculateWireSize({
      voltage: 220,
      current: 30,
      distance: 30,
      phaseType: "single-2wire",
      material: "copper",
      allowedDropPercent: 3,
    });
    expect(result.recommendedCrossSection).toBe(6);
    expect(result.baseAmpacity).toBe(41);
  });

  it("3상4선식 (계수 17.8): 380V, 100A, 100m, 3% → 35mm²", () => {
    const result = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 100,
      phaseType: "three-4wire",
      material: "copper",
      allowedDropPercent: 3,
    });
    expect(result.recommendedCrossSection).toBe(35);
    expect(result.baseAmpacity).toBe(110);
  });
});

describe("calculateWireSize - 알루미늄 (전용 표)", () => {
  it("알루미늄은 동선 대비 더 큰 단면적 + 다른 baseAmpacity 사용", () => {
    const copper = calculateWireSize({
      voltage: 220,
      current: 100,
      distance: 30,
      phaseType: "single-2wire",
      material: "copper",
      allowedDropPercent: 3,
    });
    const aluminum = calculateWireSize({
      voltage: 220,
      current: 100,
      distance: 30,
      phaseType: "single-2wire",
      material: "aluminum",
      allowedDropPercent: 3,
    });

    expect(aluminum.recommendedCrossSection).toBeGreaterThanOrEqual(
      copper.recommendedCrossSection,
    );
    expect(aluminum.baseAmpacity).not.toBe(copper.baseAmpacity);
  });

  it("알루미늄은 16mm² 이상에서만 표 시작", () => {
    const result = calculateWireSize({
      voltage: 220,
      current: 20,
      distance: 30,
      phaseType: "single-2wire",
      material: "aluminum",
      allowedDropPercent: 3,
    });
    expect(result.recommendedCrossSection).toBeGreaterThanOrEqual(16);
  });
});

describe("calculateWireSize - 허용전류 우선", () => {
  it("짧은 거리·큰 전류: 50mm² 선정", () => {
    const result = calculateWireSize({
      voltage: 220,
      current: 150,
      distance: 5,
      phaseType: "single-2wire",
      material: "copper",
      allowedDropPercent: 3,
    });
    expect(result.recommendedCrossSection).toBe(50);
    expect(result.baseAmpacity).toBe(151);
    expect(result.actualDropPercent).toBeLessThan(1);
  });
});

describe("calculateWireSize - 주위 온도 보정 (Ct)", () => {
  it("기본 30°C → Ct=1.00", () => {
    const result = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
      ambientTemperature: 30,
    });
    expect(result.temperatureFactor).toBeCloseTo(1.0, 5);
  });

  it("PVC 40°C → Ct=0.87, 더 큰 단면적 필요", () => {
    const ref = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
    });
    const hot = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
      ambientTemperature: 40,
    });
    expect(hot.temperatureFactor).toBeCloseTo(0.87, 2);
    expect(hot.recommendedCrossSection).toBeGreaterThanOrEqual(
      ref.recommendedCrossSection,
    );
  });

  it("PVC 33°C 선형 보간 → 0.964", () => {
    const result = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
      ambientTemperature: 33,
    });
    expect(result.temperatureFactor).toBeCloseTo(0.964, 3);
  });

  it("XLPE 40°C 보정이 PVC보다 약함", () => {
    const pvc = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
      ambientTemperature: 40,
      insulation: "PVC",
    });
    const xlpe = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
      ambientTemperature: 40,
      insulation: "XLPE",
    });
    expect(xlpe.temperatureFactor).toBeGreaterThan(pvc.temperatureFactor);
  });
});

describe("calculateWireSize - 회로 묶음 보정 (Cg)", () => {
  it("1회로 → Cg=1.00", () => {
    const result = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
      numberOfCircuits: 1,
    });
    expect(result.groupingFactor).toBeCloseTo(1.0, 5);
  });

  it("3회로 → Cg=0.70", () => {
    const result = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
      numberOfCircuits: 3,
    });
    expect(result.groupingFactor).toBeCloseTo(0.7, 5);
  });

  it("회로 수 증가 → 더 큰 단면적", () => {
    const single = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
      numberOfCircuits: 1,
    });
    const grouped = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
      numberOfCircuits: 4,
    });
    expect(grouped.recommendedCrossSection).toBeGreaterThan(
      single.recommendedCrossSection,
    );
  });
});

describe("calculateWireSize - XLPE", () => {
  it("XLPE → 더 작거나 같은 단면적", () => {
    const pvc = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
      insulation: "PVC",
    });
    const xlpe = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
      insulation: "XLPE",
    });
    expect(xlpe.recommendedCrossSection).toBeLessThanOrEqual(
      pvc.recommendedCrossSection,
    );
  });

  it("동일 단면적 강제 케이스: XLPE base = PVC base × 1.25", () => {
    const pvc = calculateWireSize({
      voltage: 220,
      current: 200,
      distance: 100,
      phaseType: "single-2wire",
      material: "copper",
      allowedDropPercent: 3,
      insulation: "PVC",
    });
    const xlpe = calculateWireSize({
      voltage: 220,
      current: 200,
      distance: 100,
      phaseType: "single-2wire",
      material: "copper",
      allowedDropPercent: 3,
      insulation: "XLPE",
    });
    if (pvc.recommendedCrossSection === xlpe.recommendedCrossSection) {
      expect(xlpe.baseAmpacity).toBeCloseTo(pvc.baseAmpacity * 1.25, 3);
    } else {
      expect(xlpe.recommendedCrossSection).toBeLessThanOrEqual(
        pvc.recommendedCrossSection,
      );
    }
  });
});

describe("calculateWireSize - Ct × Cg 보정 합산", () => {
  it("40°C + 4회로 → 0.566", () => {
    const result = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
      ambientTemperature: 40,
      numberOfCircuits: 4,
    });
    expect(result.temperatureFactor * result.groupingFactor).toBeCloseTo(
      0.5655,
      3,
    );
    expect(result.baseAmpacity).toBeGreaterThanOrEqual(176);
    expect(result.recommendedCrossSection).toBeGreaterThanOrEqual(70);
  });
});

describe("calculateWireSize - 경고 토큰", () => {
  it("안전여유 10% 미만 → safetyMarginLow 토큰", () => {
    const result = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
    });
    const w = result.warnings.find((x) => x.key === "safetyMarginLow");
    expect(w).toBeDefined();
    if (w?.key === "safetyMarginLow") {
      expect(w.threshold).toBe(10);
    }
  });

  it("여유 충분 → safetyMarginLow 없음", () => {
    const result = calculateWireSize({
      voltage: 380,
      current: 30,
      distance: 30,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 3,
    });
    expect(result.safetyMarginPercent).toBeGreaterThan(10);
    expect(result.warnings.find((x) => x.key === "safetyMarginLow")).toBeUndefined();
  });
});

describe("calculateWireSize - 입력 검증 (Zod i18n key)", () => {
  it("음수 전류 거부 (validation.current key)", () => {
    expect(() =>
      calculateWireSize({
        voltage: 220,
        current: -10,
        distance: 30,
        phaseType: "single-2wire",
        material: "copper",
        allowedDropPercent: 3,
      }),
    ).toThrow();
  });

  it("음수 전압 → validation.voltage key", () => {
    const result = wireSizeInputSchema.safeParse({
      voltage: -1,
      current: 30,
      distance: 30,
      phaseType: "single-2wire",
      material: "copper",
      allowedDropPercent: 3,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("validation.voltage");
    }
  });

  it("주위 온도 90°C → validation.ambientMax key", () => {
    const result = wireSizeInputSchema.safeParse({
      voltage: 220,
      current: 30,
      distance: 30,
      phaseType: "single-2wire",
      material: "copper",
      allowedDropPercent: 3,
      ambientTemperature: 90,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("validation.ambientMax");
    }
  });

  it("회로 수 0 → validation.circuitsMin key", () => {
    const result = wireSizeInputSchema.safeParse({
      voltage: 220,
      current: 30,
      distance: 30,
      phaseType: "single-2wire",
      material: "copper",
      allowedDropPercent: 3,
      numberOfCircuits: 0,
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toBe("validation.circuitsMin");
    }
  });
});

describe("calculateWireSize - 표준 규격 초과 → i18nKey", () => {
  it("거대 부하 → noStandardMatch", () => {
    try {
      calculateWireSize({
        voltage: 220,
        current: 1000,
        distance: 1000,
        phaseType: "single-2wire",
        material: "copper",
        allowedDropPercent: 2,
      });
      throw new Error("should have thrown");
    } catch (e) {
      expect(e).toBeInstanceOf(WireSizeCalculationError);
      if (e instanceof WireSizeCalculationError) {
        expect(e.i18nKey).toBe("noStandardMatch");
      }
    }
  });

  it("60°C+16회로 보정으로 매칭 불가 → noStandardMatch", () => {
    expect(() =>
      calculateWireSize({
        voltage: 380,
        current: 200,
        distance: 50,
        phaseType: "three-3wire",
        material: "copper",
        allowedDropPercent: 2,
        ambientTemperature: 60,
        numberOfCircuits: 16,
      }),
    ).toThrow(WireSizeCalculationError);
  });
});

describe("calculateWireSize - 결과 토큰 형태", () => {
  it("calculationSteps 7단계 모두 올바른 key", () => {
    const result = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
    });
    const keys = result.calculationSteps.map((s) => s.key);
    expect(keys).toEqual([
      "allowedDrop",
      "minSection",
      "derating",
      "requiredAmpacity",
      "selected",
      "effectiveAmpacity",
      "verify",
    ]);
  });

  it("derating step에 모든 보정 정보 포함", () => {
    const result = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
      ambientTemperature: 40,
      numberOfCircuits: 4,
    });
    const step = findStep(result.calculationSteps, "derating");
    expect(step).toBeDefined();
    if (step) {
      expect(step.insulation).toBe("PVC");
      expect(step.ambient).toBe(40);
      expect(step.circuits).toBe(4);
      expect(step.ct).toBeCloseTo(0.87, 2);
      expect(step.cg).toBeCloseTo(0.65, 2);
    }
  });

  it("selected step에 선정 단면적·재질·절연 정보", () => {
    const result = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
    });
    const step = findStep(result.calculationSteps, "selected");
    expect(step).toBeDefined();
    if (step) {
      expect(step.chosen).toBe(35);
      expect(step.material).toBe("copper");
      expect(step.insulation).toBe("PVC");
      expect(step.baseAmpacity).toBe(110);
    }
  });

  it("기본값 자동 적용 (PVC/30°C/1회로)", () => {
    const result = calculateWireSize({
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
    });
    expect(result.temperatureFactor).toBeCloseTo(1.0, 5);
    expect(result.groupingFactor).toBeCloseTo(1.0, 5);
    expect(result.effectiveAmpacity).toBeCloseTo(result.baseAmpacity, 5);
  });
});
