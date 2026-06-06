import { describe, it, expect } from "vitest";
import {
  numberToSino,
  numberToNative,
  numberToNativeAttributive,
  convertKoreanNumber,
} from "./koreanNumber";

describe("numberToSino (한자어 수사)", () => {
  it("0~10 기본", () => {
    expect(numberToSino(0)).toBe("영");
    expect(numberToSino(1)).toBe("일");
    expect(numberToSino(10)).toBe("십");
    expect(numberToSino(11)).toBe("십일");
  });

  it("1은 십/백/천 앞에서 생략", () => {
    expect(numberToSino(100)).toBe("백");
    expect(numberToSino(1000)).toBe("천");
    expect(numberToSino(110)).toBe("백십");
    expect(numberToSino(101)).toBe("백일");
  });

  it("만 단위 — 정확히 1이면 '만'", () => {
    expect(numberToSino(10000)).toBe("만");
    expect(numberToSino(12345)).toBe("만이천삼백사십오");
    expect(numberToSino(110000)).toBe("십일만");
  });

  it("억·조는 '일억'·'일조' 유지", () => {
    expect(numberToSino(100000000)).toBe("일억");
    expect(numberToSino(1000000000000)).toBe("일조");
  });

  it("큰 수 조합", () => {
    expect(numberToSino(1234)).toBe("천이백삼십사");
    expect(numberToSino(20250606)).toBe("이천이십오만육백육");
  });
});

describe("numberToNative (고유어 수사)", () => {
  it("1~10", () => {
    expect(numberToNative(1)).toBe("하나");
    expect(numberToNative(5)).toBe("다섯");
    expect(numberToNative(10)).toBe("열");
  });

  it("십 단위 + 조합", () => {
    expect(numberToNative(20)).toBe("스물");
    expect(numberToNative(21)).toBe("스물하나");
    expect(numberToNative(99)).toBe("아흔아홉");
  });

  it("범위 밖은 null (0, 100+)", () => {
    expect(numberToNative(0)).toBeNull();
    expect(numberToNative(100)).toBeNull();
  });
});

describe("numberToNativeAttributive (관형사형)", () => {
  it("한·두·세·네", () => {
    expect(numberToNativeAttributive(1)).toBe("한");
    expect(numberToNativeAttributive(2)).toBe("두");
    expect(numberToNativeAttributive(3)).toBe("세");
    expect(numberToNativeAttributive(4)).toBe("네");
  });

  it("스무(20 단독) vs 스물한(21)", () => {
    expect(numberToNativeAttributive(20)).toBe("스무");
    expect(numberToNativeAttributive(21)).toBe("스물한");
    expect(numberToNativeAttributive(30)).toBe("서른");
  });
});

describe("convertKoreanNumber (통합)", () => {
  it("21 → 한자어/고유어 동시", () => {
    const r = convertKoreanNumber({ value: 21 });
    expect(r.sino).toBe("이십일");
    expect(r.native).toBe("스물하나");
    expect(r.nativeAttributive).toBe("스물한");
    expect(r.nativeSupported).toBe(true);
  });

  it("12345 → 고유어 미지원", () => {
    const r = convertKoreanNumber({ value: 12345 });
    expect(r.sino).toBe("만이천삼백사십오");
    expect(r.native).toBeNull();
    expect(r.nativeSupported).toBe(false);
  });
});
