import { describe, expect, it } from "vitest";
import { formatAxisMoney } from "./format";

describe("formatAxisMoney — 차트 축 금액 축약 (3-locale)", () => {
  it("ko: 억 단위", () => {
    expect(formatAxisMoney(150_000_000, "ko")).toBe("1.5억");
    expect(formatAxisMoney(100_000_000, "ko")).toBe("1억");
    expect(formatAxisMoney(1_234_000_000, "ko")).toBe("12.3억");
  });

  it("ko: 만 단위 (반올림, 천단위 콤마)", () => {
    expect(formatAxisMoney(35_000_000, "ko")).toBe("3,500만");
    expect(formatAxisMoney(12_345, "ko")).toBe("1만");
  });

  it("ko: 만 미만은 원 단위 콤마", () => {
    expect(formatAxisMoney(9_000, "ko")).toBe("9,000");
    expect(formatAxisMoney(0, "ko")).toBe("0");
  });

  it("en: B/M/K 축약", () => {
    expect(formatAxisMoney(1_500_000_000, "en")).toBe("₩1.5B");
    expect(formatAxisMoney(350_000_000, "en")).toBe("₩350M");
    expect(formatAxisMoney(12_000, "en")).toBe("₩12K");
    expect(formatAxisMoney(500, "en")).toBe("₩500");
  });

  it("vi: tỷ/tr 축약 + 소수점 쉼표", () => {
    expect(formatAxisMoney(1_500_000_000, "vi")).toBe("₩1,5 tỷ");
    expect(formatAxisMoney(350_000_000, "vi")).toBe("₩350 tr");
    expect(formatAxisMoney(12_000, "vi")).toBe("₩12k");
  });

  it("음수는 부호 유지", () => {
    expect(formatAxisMoney(-150_000_000, "ko")).toBe("-1.5억");
    expect(formatAxisMoney(-350_000_000, "en")).toBe("-₩350M");
  });

  it("정수 배율은 소수점 생략 (trailing .0 제거)", () => {
    expect(formatAxisMoney(200_000_000, "ko")).toBe("2억");
    expect(formatAxisMoney(2_000_000_000, "en")).toBe("₩2B");
  });
});
