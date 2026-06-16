import { describe, it, expect } from "vitest";
import {
  checkD8Eligibility,
  d8EligibilityInputSchema,
} from "./d8Eligibility";

/** 스키마 기본값으로 시작해 일부만 덮어쓰는 헬퍼 */
function build(overrides: Record<string, unknown>) {
  return d8EligibilityInputSchema.parse(overrides);
}

describe("checkD8Eligibility", () => {
  it("유형 미선택(none)이면 type 차단 + 자격 미충족", () => {
    const r = checkD8Eligibility(build({}));
    expect(r.baseEligible).toBe(false);
    expect(r.blockers).toEqual(["type"]);
    expect(r.metCount).toBe(0);
    expect(r.requiredCount).toBe(0);
  });

  it("D-8-1 투자형 4요건 모두 충족 시 자격 충족", () => {
    const r = checkD8Eligibility(
      build({
        visaType: "corporateInvestment",
        meetsInvestment: true,
        meetsShares: true,
        corpRegistered: true,
        goodConduct: true,
      }),
    );
    expect(r.baseEligible).toBe(true);
    expect(r.blockers).toEqual([]);
    expect(r.metCount).toBe(4);
    expect(r.requiredCount).toBe(4);
  });

  it("D-8-1 투자금·지분 미충족 시 해당 항목만 차단", () => {
    const r = checkD8Eligibility(
      build({
        visaType: "corporateInvestment",
        meetsInvestment: false,
        meetsShares: false,
        corpRegistered: true,
        goodConduct: true,
      }),
    );
    expect(r.baseEligible).toBe(false);
    expect(r.blockers).toEqual(["investment", "shares"]);
    expect(r.metCount).toBe(2);
    expect(r.requiredCount).toBe(4);
  });

  it("D-8-3 개인투자형도 동일한 4요건 구조", () => {
    const r = checkD8Eligibility(
      build({
        visaType: "individualInvestment",
        meetsInvestment: true,
        meetsShares: true,
        corpRegistered: true,
        goodConduct: true,
      }),
    );
    expect(r.baseEligible).toBe(true);
    expect(r.requiredCount).toBe(4);
  });

  it("D-8-4 기술창업 5요건 모두 충족 시 자격 충족", () => {
    const r = checkD8Eligibility(
      build({
        visaType: "techStartup",
        hasDegree: true,
        hasIP: true,
        newCorp: true,
        oasisMandatory: true,
        goodConduct: true,
      }),
    );
    expect(r.baseEligible).toBe(true);
    expect(r.blockers).toEqual([]);
    expect(r.metCount).toBe(5);
    expect(r.requiredCount).toBe(5);
  });

  it("D-8-4 IP·OASIS 필수항목 미충족 시 해당 항목 차단", () => {
    const r = checkD8Eligibility(
      build({
        visaType: "techStartup",
        hasDegree: true,
        hasIP: false,
        newCorp: true,
        oasisMandatory: false,
        goodConduct: true,
      }),
    );
    expect(r.baseEligible).toBe(false);
    expect(r.blockers).toEqual(["ip", "oasis"]);
    expect(r.metCount).toBe(3);
    expect(r.requiredCount).toBe(5);
  });

  it("투자형 입력에 기술창업 필드가 섞여도 유형 요건만 평가", () => {
    // 투자형인데 hasDegree 등은 켜져 있고 corpRegistered 만 빠진 경우
    const r = checkD8Eligibility(
      build({
        visaType: "corporateInvestment",
        meetsInvestment: true,
        meetsShares: true,
        corpRegistered: false,
        goodConduct: true,
        hasDegree: true,
        hasIP: true,
      }),
    );
    expect(r.blockers).toEqual(["corp"]);
    expect(r.requiredCount).toBe(4);
  });
});
