import { describe, expect, it } from "vitest";
import { validateBizNumber } from "./bizNumber";

describe("validateBizNumber - 유효 번호", () => {
  it("국세청 표본 유효번호 (220-81-62517) → 통과", () => {
    const r = validateBizNumber({ number: "220-81-62517" });
    expect(r.formatValid).toBe(true);
    expect(r.checksumValid).toBe(true);
    expect(r.isValid).toBe(true);
    expect(r.personType).toBe("corporationCommercial"); // 81 = 영리법인 본점
    expect(r.formatted).toBe("220-81-62517");
  });

  it("하이픈 없이 입력해도 정규화", () => {
    const r = validateBizNumber({ number: "2208162517" });
    expect(r.normalized).toBe("2208162517");
    expect(r.formatted).toBe("220-81-62517");
    expect(r.isValid).toBe(true);
  });

  it("공백 포함도 정규화", () => {
    const r = validateBizNumber({ number: " 220 81 62517" });
    expect(r.isValid).toBe(true);
  });
});

describe("validateBizNumber - 체크섬 실패", () => {
  it("마지막 자리 변경 → 체크섬 미통과", () => {
    const r = validateBizNumber({ number: "104-81-39240" });
    expect(r.formatValid).toBe(true);
    expect(r.checksumValid).toBe(false);
    expect(r.isValid).toBe(false);
    expect(
      r.warnings.find((w) => w.key === "checksumFailed"),
    ).toBeDefined();
  });
});

describe("validateBizNumber - 형식 오류", () => {
  it("9자리 번호 → 형식 오류", () => {
    const r = validateBizNumber({ number: "220816251" });
    expect(r.formatValid).toBe(false);
    expect(r.isValid).toBe(false);
    expect(r.warnings.find((w) => w.key === "formatInvalid")).toBeDefined();
  });
  it("문자 포함 (숫자 아님) → 형식 오류", () => {
    const r = validateBizNumber({ number: "abc-de-fghij" });
    expect(r.formatValid).toBe(false);
  });
});

describe("validateBizNumber - 사업자 종류 분류", () => {
  it("01~79 → 일반 개인사업자", () => {
    // 50번 코드 사용 — 체크섬은 일치 안 해도 분류는 확인
    const r = validateBizNumber({ number: "100-50-12345" });
    expect(r.personType).toBe("individualGeneral");
  });
  it("82 → 비영리법인 본·지점", () => {
    const r = validateBizNumber({ number: "100-82-12345" });
    expect(r.personType).toBe("corporationNonProfit");
  });
  it("90~99 → 면세 개인", () => {
    const r = validateBizNumber({ number: "100-95-12345" });
    expect(r.personType).toBe("individualPersonal");
  });
});

describe("validateBizNumber - 입력 검증", () => {
  it("3자리 입력 → 형식 오류 (throw 아님)", () => {
    const r = validateBizNumber({ number: "104" });
    expect(r.formatValid).toBe(false);
    expect(r.isValid).toBe(false);
  });
  it("빈 문자열 거부", () => {
    expect(() => validateBizNumber({ number: "" })).toThrow();
  });
});
