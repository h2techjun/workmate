import { describe, it, expect } from "vitest";
import {
  calculateCostOfLiving,
  costOfLivingInputSchema,
} from "./costOfLiving";
import { suggestDefaults } from "@/lib/constants/korea/costOfLiving";

const parse = (o: Record<string, number | string>) =>
  calculateCostOfLiving(costOfLivingInputSchema.parse(o));

describe("한국 생활비 추정 (cost of living)", () => {
  it("합계 = 항목의 단순 합, 연간 = ×12", () => {
    const out = parse({
      household: "single",
      rent: 1_300_000,
      utilities: 130_000,
      food: 500_000,
      transport: 80_000,
      mobile: 40_000,
      healthInsurance: 150_000,
      other: 300_000,
    });
    expect(out.monthlyTotal).toBe(2_500_000);
    expect(out.annualTotal).toBe(30_000_000);
  });

  it("1인당 = 합계 ÷ 인원 (커플)", () => {
    const out = parse({
      household: "couple",
      rent: 1_000_000,
      utilities: 0,
      food: 0,
      transport: 0,
      mobile: 0,
      healthInsurance: 0,
      other: 0,
    });
    expect(out.householdSize).toBe(2);
    expect(out.perPersonMonthly).toBe(500_000);
  });

  it("가족(4인) 인원 반영", () => {
    const out = parse({ household: "family", rent: 4_000_000 });
    expect(out.householdSize).toBe(4);
    expect(out.perPersonMonthly).toBe(1_000_000);
  });

  it("빈 입력 = 0 합계 (음수/NaN 없음)", () => {
    const out = parse({ household: "single" });
    expect(out.monthlyTotal).toBe(0);
    expect(out.perPersonMonthly).toBe(0);
  });

  it("suggestDefaults: 서울 중심 1인 = 합계 250만 근처", () => {
    const d = suggestDefaults("seoulCore", "single");
    const total =
      d.rent + d.utilities + d.food + d.transport + d.mobile + d.healthInsurance + d.other;
    expect(d.rent).toBe(1_300_000);
    expect(total).toBeGreaterThan(2_000_000);
    expect(total).toBeLessThan(3_000_000);
  });

  it("suggestDefaults: 지방 1인 월세 < 서울 중심 1인 월세", () => {
    const seoul = suggestDefaults("seoulCore", "single");
    const other = suggestDefaults("other", "single");
    expect(other.rent).toBeLessThan(seoul.rent);
  });

  it("suggestDefaults: 가족 월세 > 1인 월세 (면적 배수)", () => {
    const single = suggestDefaults("gyeonggi", "single");
    const family = suggestDefaults("gyeonggi", "family");
    expect(family.rent).toBeGreaterThan(single.rent);
  });
});
