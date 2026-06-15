import { describe, it, expect } from "vitest";
import {
  calculateApartmentArea,
  apartmentAreaInputSchema,
} from "./apartmentArea";

const PYEONG_PER_SQM = 1089 / 3600; // 0.3025

describe("apartment area & price per pyeong", () => {
  it("84㎡ 공급 / 59㎡ 전용 — 평 환산 + 전용률 (국민평형)", () => {
    const out = calculateApartmentArea(
      apartmentAreaInputSchema.parse({
        supplyAreaSqm: 84,
        exclusiveAreaSqm: 59,
      }),
    );
    expect(out.supplyPyeong).toBeCloseTo(25.41, 2); // 84 × 0.3025
    expect(out.exclusivePyeong).toBeCloseTo(17.8475, 3); // 59 × 0.3025
    expect(out.exclusiveRate).toBeCloseTo(0.70238, 4); // 59 / 84
    expect(out.pricePerPyeongSupply).toBe(0); // 가격 미입력
    expect(out.pricePerPyeongExclusive).toBe(0);
  });

  it("평당가 — 매매가 10억, 공급/전용 기준 차이", () => {
    const out = calculateApartmentArea(
      apartmentAreaInputSchema.parse({
        supplyAreaSqm: 84,
        exclusiveAreaSqm: 59,
        price: 1_000_000_000,
      }),
    );
    // 공급 25.41평 → 평당 약 3,935만, 전용 17.85평 → 평당 약 5,603만
    expect(out.pricePerPyeongSupply).toBeCloseTo(
      1_000_000_000 / (84 * PYEONG_PER_SQM),
      0,
    );
    expect(out.pricePerPyeongExclusive).toBeCloseTo(
      1_000_000_000 / (59 * PYEONG_PER_SQM),
      0,
    );
    // 전용 기준 평당가가 공급 기준보다 높다 (분모가 작으므로)
    expect(out.pricePerPyeongExclusive).toBeGreaterThan(
      out.pricePerPyeongSupply,
    );
  });

  it("전용률 — 오피스텔 수준(50%대)도 계산", () => {
    const out = calculateApartmentArea(
      apartmentAreaInputSchema.parse({
        supplyAreaSqm: 50,
        exclusiveAreaSqm: 28,
      }),
    );
    expect(out.exclusiveRate).toBeCloseTo(0.56, 2);
  });

  it("공급면적 0 — 전용률 0 (0으로 나누기 회피)", () => {
    const out = calculateApartmentArea(
      apartmentAreaInputSchema.parse({
        supplyAreaSqm: 0,
        exclusiveAreaSqm: 0,
      }),
    );
    expect(out.exclusiveRate).toBe(0);
    expect(out.supplyPyeong).toBe(0);
  });
});
