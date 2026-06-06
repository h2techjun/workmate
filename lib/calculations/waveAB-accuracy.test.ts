import { describe, it, expect } from "vitest";
import { numberToSino, numberToNative } from "./korean/koreanNumber";
import { convertDistance } from "./unit/distance";
import { convertTemperature } from "./unit/temperature";
import { romanizeText } from "./korean/textRomanize";
import { decomposeHangul } from "./korean/hangulDecompose";
import { CHO_ROM, JUNG_ROM, JONG_ROM } from "./korean/hangul";

// 두 로마자 엔진(hangul.ts vs romanize.ts)이 같은 표를 쓰는지 — 다르면 같은 입력이
// name-romanize와 text-romanize에서 다르게 나오는 버그.
describe("로마자 표 일관성 (RR 공식표 대조)", () => {
  it("초성 19 = 공식 RR", () => {
    expect([...CHO_ROM]).toEqual(["g","kk","n","d","tt","r","m","b","pp","s","ss","","j","jj","ch","k","t","p","h"]);
  });
  it("중성 21 = 공식 RR", () => {
    expect([...JUNG_ROM]).toEqual(["a","ae","ya","yae","eo","e","yeo","ye","o","wa","wae","oe","yo","u","wo","we","wi","yu","eu","ui","i"]);
  });
  it("종성 28 = 공식 RR 받침 위치음", () => {
    expect([...JONG_ROM]).toEqual(["","k","k","k","n","n","n","t","l","k","m","l","l","l","p","l","m","p","p","t","t","ng","t","t","k","t","p","t"]);
  });
});

describe("korean-number 적대적 엣지", () => {
  it("천/백 앞 1 생략 + 조합", () => {
    expect(numberToSino(1004)).toBe("천사");
    expect(numberToSino(1100)).toBe("천백");
    expect(numberToSino(305)).toBe("삼백오");
    expect(numberToSino(5000)).toBe("오천");
  });
  it("만/억 단위 — 2 이상은 일 유지", () => {
    expect(numberToSino(20000)).toBe("이만");
    expect(numberToSino(200000000)).toBe("이억");
    expect(numberToSino(110000000)).toBe("일억천만");
  });
  it("고유어 십단위 정확", () => {
    expect(numberToNative(70)).toBe("일흔");
    expect(numberToNative(11)).toBe("열하나");
    expect(numberToNative(90)).toBe("아흔");
  });
});

describe("distance 적대적 엣지 (역방향)", () => {
  it("1 mile → km ≈ 1.609344", () => {
    expect(convertDistance({ value: 1, unit: "mile" }).km).toBeCloseTo(1.609344, 6);
  });
  it("1 km → 리 ≈ 2.5463 (1리=392.727m)", () => {
    expect(convertDistance({ value: 1, unit: "km" }).ri).toBeCloseTo(1000 / 392.727272, 3);
  });
  it("100 자 → 30.303 m", () => {
    expect(convertDistance({ value: 100, unit: "ja" }).m).toBeCloseTo(30.30303, 4);
  });
});

describe("temperature 적대적 엣지", () => {
  it("-40°C = -40°F (교차점)", () => {
    expect(convertTemperature({ value: -40, unit: "c" }).f).toBeCloseTo(-40, 6);
  });
  it("37°C → 98.6°F (체온)", () => {
    expect(convertTemperature({ value: 37, unit: "c" }).f).toBeCloseTo(98.6, 6);
  });
  it("212°F → 100°C (끓는점)", () => {
    expect(convertTemperature({ value: 212, unit: "f" }).c).toBeCloseTo(100, 6);
  });
});

describe("romanize 음역 (문서화된 동작 = 음운변화 미반영)", () => {
  it("신라 → Sinra (Silla 아님)", () => {
    expect(romanizeText("신라").romanized).toBe("Sinra");
  });
  it("종로 → Jongro (Jongno 아님)", () => {
    expect(romanizeText("종로").romanized).toBe("Jongro");
  });
  it("받침 분해 — 값 → ㄱ ㅏ ㅄ", () => {
    const s = decomposeHangul("값").syllables[0]!;
    expect([s.cho, s.jung, s.jong]).toEqual(["ㄱ", "ㅏ", "ㅄ"]);
    expect(s.romanized).toBe("gap");
  });
});
