import { describe, it, expect } from "vitest";
import { calculateSchoolGrade } from "./schoolGrade";

describe("calculateSchoolGrade", () => {
  it("2018년생 → 2025년 6월 = 초1", () => {
    const r = calculateSchoolGrade({ birthYear: 2018, refYear: 2025, refMonth: 6 });
    expect(r.level).toBe("elementary");
    expect(r.grade).toBe(1);
    expect(r.elementaryEntryYear).toBe(2025);
  });

  it("1~2월은 직전 학년도 — 2018년생 2025년 1월 = 미취학", () => {
    const r = calculateSchoolGrade({ birthYear: 2018, refYear: 2025, refMonth: 1 });
    expect(r.level).toBe("preschool");
    expect(r.grade).toBe(0);
  });

  it("2013년생 → 2025년 = 초6", () => {
    const r = calculateSchoolGrade({ birthYear: 2013, refYear: 2025, refMonth: 9 });
    expect(r.level).toBe("elementary");
    expect(r.grade).toBe(6);
  });

  it("2012년생 → 2025년 = 중1", () => {
    const r = calculateSchoolGrade({ birthYear: 2012, refYear: 2025, refMonth: 9 });
    expect(r.level).toBe("middle");
    expect(r.grade).toBe(1);
  });

  it("2009년생 → 2025년 = 고1", () => {
    const r = calculateSchoolGrade({ birthYear: 2009, refYear: 2025, refMonth: 9 });
    expect(r.level).toBe("high");
    expect(r.grade).toBe(1);
    expect(r.highEntryYear).toBe(2025);
    expect(r.highGraduationYear).toBe(2028);
  });

  it("2006년생 → 2025년 = 대1", () => {
    const r = calculateSchoolGrade({ birthYear: 2006, refYear: 2025, refMonth: 9 });
    expect(r.level).toBe("university");
    expect(r.grade).toBe(1);
  });

  it("성인 + 세는나이 참고", () => {
    const r = calculateSchoolGrade({ birthYear: 1990, refYear: 2025, refMonth: 6 });
    expect(r.level).toBe("adult");
    expect(r.grade).toBe(0);
    expect(r.countingAge).toBe(36);
  });
});
