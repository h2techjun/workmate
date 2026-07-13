import { describe, it, expect } from "vitest";
import {
  commentInputSchema,
  sanitizeContent,
  containsBannedWord,
  hasTooManyLinks,
} from "./validation";

describe("commentInputSchema", () => {
  const valid = {
    nickname: "여행자",
    content: "경복궁 다녀왔어요!",
    locale: "ko" as const,
  };

  it("정상 입력 통과", () => {
    expect(commentInputSchema.safeParse(valid).success).toBe(true);
  });

  it("빈 닉네임 거부", () => {
    expect(
      commentInputSchema.safeParse({ ...valid, nickname: "   " }).success,
    ).toBe(false);
  });

  it("너무 짧은 내용 거부", () => {
    expect(commentInputSchema.safeParse({ ...valid, content: "a" }).success).toBe(
      false,
    );
  });

  it("300자 초과 내용 거부", () => {
    expect(
      commentInputSchema.safeParse({ ...valid, content: "가".repeat(301) })
        .success,
    ).toBe(false);
  });

  it("잘못된 로케일 거부", () => {
    expect(
      commentInputSchema.safeParse({ ...valid, locale: "jp" }).success,
    ).toBe(false);
  });

  it("botcheck(honeypot)는 선택 필드", () => {
    expect(
      commentInputSchema.safeParse({ ...valid, botcheck: "bot" }).success,
    ).toBe(true);
  });
});

describe("sanitizeContent", () => {
  it("C0 제어문자를 제거하되 탭·개행은 보존", () => {
    // \x00 = NULL 제어문자(제거 대상), \t·\n 은 보존
    const raw = "a\x00bc\td\ne";
    expect(sanitizeContent(raw)).toBe("abc\td\ne");
  });

  it("3줄 이상 연속 개행을 2줄로 축소", () => {
    expect(sanitizeContent("a\n\n\n\nb")).toBe("a\n\nb");
  });

  it("CRLF를 LF로 정규화하고 앞뒤 공백 제거", () => {
    expect(sanitizeContent("  a\r\nb  ")).toBe("a\nb");
  });
});

describe("containsBannedWord", () => {
  it("금칙어 대소문자 무시 매칭", () => {
    expect(containsBannedWord("Best CASINO ever")).toBe(true);
    expect(containsBannedWord("카지노 홍보")).toBe(true);
  });
  it("정상 문장은 false", () => {
    expect(containsBannedWord("좋은 여행지네요")).toBe(false);
  });
});

describe("hasTooManyLinks", () => {
  it("URL 3개 이상이면 true", () => {
    expect(
      hasTooManyLinks("http://a.com http://b.com https://c.com"),
    ).toBe(true);
  });
  it("URL 2개 이하는 false", () => {
    expect(hasTooManyLinks("참고 https://a.com")).toBe(false);
  });
});
