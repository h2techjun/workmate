import { describe, it, expect } from "vitest";
import {
  sanitizeNumericInput,
  groupThousands,
  parseNumeric,
  countSignificantBeforeCaret,
  caretAfterSignificant,
  formatForField,
} from "./numberInput";

describe("sanitizeNumericInput", () => {
  it("콤마·문자·공백을 제거하고 숫자만 남긴다", () => {
    expect(sanitizeNumericInput("50,000,000")).toBe("50000000");
    expect(sanitizeNumericInput("1 234 원")).toBe("1234");
    expect(sanitizeNumericInput("abc12de3")).toBe("123");
  });

  it("정수 모드에서 소수점을 제거한다", () => {
    expect(sanitizeNumericInput("12.34")).toBe("1234");
  });

  it("소수 허용 시 첫 소수점만 유지하고 자릿수를 제한한다", () => {
    expect(sanitizeNumericInput("1.2.3", { decimals: 2 })).toBe("1.23");
    expect(sanitizeNumericInput("1.239", { decimals: 2 })).toBe("1.23");
    expect(sanitizeNumericInput("1.", { decimals: 2 })).toBe("1.");
  });

  it("선행 0을 편집 중에는 보존한다 (자릿수 소실 방지)", () => {
    // 핵심 버그: "50000000"에서 앞 5를 지운 "0000000"이 0으로 무너지면 안 됨
    expect(sanitizeNumericInput("0,000,000")).toBe("0000000");
  });

  it("음수 허용/비허용을 처리한다", () => {
    expect(sanitizeNumericInput("-100", { allowNegative: true })).toBe("-100");
    expect(sanitizeNumericInput("-100")).toBe("100");
  });

  it("'-' 단독 입력은 편집 중 중간값으로 보존한다 (음수 입력 허용 시)", () => {
    // 빈 필드에서 '-' 타이핑 → 다음 숫자 타이핑 전까지 '-'가 유지돼야
    expect(sanitizeNumericInput("-", { allowNegative: true })).toBe("-");
    // 음수 허용 안 하면 빈 문자열
    expect(sanitizeNumericInput("-", { allowNegative: false })).toBe("");
  });
});

describe("groupThousands", () => {
  it("정수부에 천단위 콤마를 넣는다", () => {
    expect(groupThousands("50000000")).toBe("50,000,000");
    expect(groupThousands("1000")).toBe("1,000");
    expect(groupThousands("999")).toBe("999");
  });

  it("선행 0을 보존하며 그룹화한다", () => {
    expect(groupThousands("0000000")).toBe("0,000,000");
  });

  it("소수부와 트레일링 점을 유지한다", () => {
    expect(groupThousands("1234.5")).toBe("1,234.5");
    expect(groupThousands("1234.")).toBe("1,234.");
  });

  it("음수 부호를 유지한다", () => {
    expect(groupThousands("-1000")).toBe("-1,000");
  });

  it("빈 문자열은 그대로", () => {
    expect(groupThousands("")).toBe("");
  });
});

describe("parseNumeric", () => {
  it("정리된 문자열을 숫자로", () => {
    expect(parseNumeric("0000007")).toBe(7);
    expect(parseNumeric("1234.5")).toBe(1234.5);
  });
  it("부분/빈 입력은 0", () => {
    expect(parseNumeric("")).toBe(0);
    expect(parseNumeric("-")).toBe(0);
    expect(parseNumeric(".")).toBe(0);
  });
});

describe("캐럿 매핑 (콤마 무시)", () => {
  it("콤마를 제외한 좌측 문자 수를 센다", () => {
    // "50,000,000" 에서 캐럿이 첫 콤마 직전(인덱스 2)
    expect(countSignificantBeforeCaret("50,000,000", 2)).toBe(2);
    // 캐럿이 끝
    expect(countSignificantBeforeCaret("50,000,000", 10)).toBe(8);
  });

  it("재포맷 후 같은 의미 위치로 캐럿을 복원한다", () => {
    // 의미문자 2개 뒤 → "50,000,000"의 인덱스 2(콤마 앞)
    expect(caretAfterSignificant("50,000,000", 2)).toBe(2);
    // 의미문자 0개 → 맨 앞
    expect(caretAfterSignificant("50,000,000", 0)).toBe(0);
    // 의미문자 8개(전부) → 끝
    expect(caretAfterSignificant("50,000,000", 8)).toBe(10);
  });

  it("앞자리 편집 왕복: 5 삭제 후 6 입력 시나리오", () => {
    // "50,000,000"에서 앞 5(인덱스 0~1 사이, 캐럿 1)을 백스페이스
    const raw = "50,000,000";
    const sig = countSignificantBeforeCaret(raw, 1); // 1
    // 백스페이스로 "0,000,000" 가 됐다고 가정 → sanitize → group
    const cleaned = sanitizeNumericInput("0,000,000");
    const formatted = groupThousands(cleaned);
    expect(formatted).toBe("0,000,000");
    // 6 입력 위치를 위해 캐럿 복원
    expect(caretAfterSignificant(formatted, sig)).toBe(1);
  });
});

describe("formatForField", () => {
  it("숫자를 콤마 표시로", () => {
    expect(formatForField(50000000)).toBe("50,000,000");
  });
  it("0/비유한값은 빈 문자열", () => {
    expect(formatForField(0)).toBe("");
    expect(formatForField(NaN)).toBe("");
  });
  it("thousands=false 면 콤마 없이", () => {
    expect(formatForField(1000, false)).toBe("1000");
  });
});
