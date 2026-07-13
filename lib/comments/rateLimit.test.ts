import { describe, it, expect } from "vitest";
import {
  getClientIp,
  hashIp,
  isRateLimited,
  RATE_RULES,
} from "./rateLimit";

describe("getClientIp", () => {
  it("x-forwarded-for 의 첫 IP 사용", () => {
    const h = new Headers({ "x-forwarded-for": "1.2.3.4, 5.6.7.8" });
    expect(getClientIp(h)).toBe("1.2.3.4");
  });
  it("헤더 없으면 0.0.0.0 폴백", () => {
    expect(getClientIp(new Headers())).toBe("0.0.0.0");
  });
});

describe("hashIp", () => {
  it("결정론적이고 원본 IP를 노출하지 않는다", () => {
    const a = hashIp("203.0.113.5");
    const b = hashIp("203.0.113.5");
    expect(a).toBe(b);
    expect(a).not.toContain("203.0.113.5");
    expect(a).toMatch(/^[0-9a-f]{64}$/); // sha256 hex
  });
  it("다른 IP는 다른 해시", () => {
    expect(hashIp("1.1.1.1")).not.toBe(hashIp("2.2.2.2"));
  });
});

describe("isRateLimited", () => {
  const now = 1_000_000_000_000;

  it("이력 없으면 허용", () => {
    expect(isRateLimited([], now)).toBe(false);
  });

  it("60초 내 재작성 차단", () => {
    expect(isRateLimited([now - 30_000], now)).toBe(true);
  });

  it("60초 지났고 윈도우 여유 있으면 허용", () => {
    expect(isRateLimited([now - 120_000], now)).toBe(false);
  });

  it("10분 내 5개 초과 차단", () => {
    const recent = [
      now - 90_000,
      now - 150_000,
      now - 200_000,
      now - 300_000,
      now - 400_000,
    ];
    expect(recent.length).toBe(RATE_RULES.windowMax);
    expect(isRateLimited(recent, now)).toBe(true);
  });
});
