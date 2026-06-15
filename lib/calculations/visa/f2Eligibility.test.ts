import { describe, it, expect } from "vitest";
import {
  checkF2Eligibility,
  f2EligibilityInputSchema,
} from "./f2Eligibility";

describe("F-2-7 basic eligibility check (점수 단정 아님)", () => {
  it("4개 요건 전부 충족 → baseEligible true", () => {
    const out = checkF2Eligibility(
      f2EligibilityInputSchema.parse({
        applicantType: "professional",
        meetsStayOrIncome: true,
        goodConduct: true,
        publicHealth: true,
      }),
    );
    expect(out.baseEligible).toBe(true);
    expect(out.blockers).toEqual([]);
    expect(out.metCount).toBe(4);
  });

  it("신청 유형 없음 → type blocker", () => {
    const out = checkF2Eligibility(
      f2EligibilityInputSchema.parse({
        applicantType: "none",
        meetsStayOrIncome: true,
        goodConduct: true,
        publicHealth: true,
      }),
    );
    expect(out.baseEligible).toBe(false);
    expect(out.blockers).toContain("type");
    expect(out.metCount).toBe(3);
  });

  it("체류/소득 미충족 → stayIncome blocker", () => {
    const out = checkF2Eligibility(
      f2EligibilityInputSchema.parse({
        applicantType: "studyTalent",
        meetsStayOrIncome: false,
        goodConduct: true,
        publicHealth: true,
      }),
    );
    expect(out.baseEligible).toBe(false);
    expect(out.blockers).toEqual(["stayIncome"]);
  });

  it("기본값(모두 미충족) → 4개 blocker", () => {
    const out = checkF2Eligibility(f2EligibilityInputSchema.parse({}));
    expect(out.baseEligible).toBe(false);
    expect(out.blockers).toEqual(["type", "stayIncome", "conduct", "health"]);
    expect(out.metCount).toBe(0);
  });

  it("잘못된 신청 유형 → schema error", () => {
    expect(() =>
      f2EligibilityInputSchema.parse({ applicantType: "invalid" }),
    ).toThrow();
  });
});
