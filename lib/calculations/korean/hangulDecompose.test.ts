import { describe, it, expect } from "vitest";
import { decomposeHangul } from "./hangulDecompose";

describe("decomposeHangul", () => {
  it("받침 있는 음절 '한' 분해", () => {
    const r = decomposeHangul("한");
    expect(r.syllableCount).toBe(1);
    const s = r.syllables[0]!;
    expect(s.cho).toBe("ㅎ");
    expect(s.jung).toBe("ㅏ");
    expect(s.jong).toBe("ㄴ");
    expect(s.hasJong).toBe(true);
    expect(s.jamoCount).toBe(3);
    expect(s.romanized).toBe("han");
  });

  it("받침 없는 음절 '가' 분해", () => {
    const r = decomposeHangul("가");
    const s = r.syllables[0]!;
    expect(s.cho).toBe("ㄱ");
    expect(s.jung).toBe("ㅏ");
    expect(s.jong).toBe("");
    expect(s.hasJong).toBe(false);
    expect(s.jamoCount).toBe(2);
    expect(s.romanized).toBe("ga");
  });

  it("'한글' → 자모 일렬 + 총 개수", () => {
    const r = decomposeHangul("한글");
    expect(r.syllableCount).toBe(2);
    expect(r.flatJamo).toEqual(["ㅎ", "ㅏ", "ㄴ", "ㄱ", "ㅡ", "ㄹ"]);
    expect(r.jamoTotal).toBe(6);
  });

  it("겹받침 '닭' 분해", () => {
    const r = decomposeHangul("닭");
    const s = r.syllables[0]!;
    expect(s.cho).toBe("ㄷ");
    expect(s.jung).toBe("ㅏ");
    expect(s.jong).toBe("ㄺ");
    expect(s.romanized).toBe("dak");
  });

  it("비한글 문자는 제외", () => {
    const r = decomposeHangul("a한1 글!");
    expect(r.syllableCount).toBe(2);
    expect(r.flatJamo).toEqual(["ㅎ", "ㅏ", "ㄴ", "ㄱ", "ㅡ", "ㄹ"]);
  });

  it("빈 문자열 / 한글 없음", () => {
    expect(decomposeHangul("").syllableCount).toBe(0);
    expect(decomposeHangul("abc 123").syllableCount).toBe(0);
    expect(decomposeHangul("abc 123").jamoTotal).toBe(0);
  });
});
