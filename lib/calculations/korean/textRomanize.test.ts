import { describe, it, expect } from "vitest";
import { romanizeText } from "./textRomanize";

describe("한글 일반 텍스트 로마자", () => {
  it("안녕하세요 → Annyeonghaseyo", () => {
    const out = romanizeText("안녕하세요");
    expect(out.romanized).toBe("Annyeonghaseyo");
    expect(out.syllableCount).toBe(5);
  });

  it("공백·구두점 보존: 서울 시청 → Seoul... 음역", () => {
    const out = romanizeText("서울 시청");
    // 서울=Seoul(음역 Seoul), 시청=Sicheong → "Seoul Sicheong"
    expect(out.romanized).toBe("Seoul Sicheong");
    expect(out.syllableCount).toBe(4);
  });

  it("받침 ㅇ → ng, 일반 음역: 강남 → Gangnam", () => {
    const out = romanizeText("강남");
    expect(out.romanized).toBe("Gangnam");
  });

  it("영문·숫자 혼합 보존", () => {
    const out = romanizeText("커피 2잔");
    expect(out.romanized).toContain("2");
    expect(out.syllableCount).toBe(3); // 커피잔
  });

  it("음운 변화 미반영 (음역): 신라 → Sinra (Silla 아님)", () => {
    const out = romanizeText("신라");
    expect(out.romanized).toBe("Sinra");
  });

  it("빈 문자열 → 빈 결과", () => {
    const out = romanizeText("");
    expect(out.romanized).toBe("");
    expect(out.syllableCount).toBe(0);
  });
});
