/**
 * 한글 음절 분해 + 자모 로마자 매핑 — 공용 모듈.
 *
 * 유니코드 한글 음절(AC00~D7A3)을 (초성×21 + 중성)×28 + 종성 으로 역산.
 * 국립국어원 로마자 표기법(2000) 자모 매핑.
 */

export const HANGUL_BASE = 0xac00;
export const HANGUL_END = 0xd7a3;

/** 초성 19 — 자모 문자 */
export const CHO_JAMO = [
  "ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ",
  "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ",
] as const;
/** 중성 21 */
export const JUNG_JAMO = [
  "ㅏ", "ㅐ", "ㅑ", "ㅒ", "ㅓ", "ㅔ", "ㅕ", "ㅖ", "ㅗ", "ㅘ", "ㅙ", "ㅚ",
  "ㅛ", "ㅜ", "ㅝ", "ㅞ", "ㅟ", "ㅠ", "ㅡ", "ㅢ", "ㅣ",
] as const;
/** 종성 28 (0 = 없음) */
export const JONG_JAMO = [
  "", "ㄱ", "ㄲ", "ㄳ", "ㄴ", "ㄵ", "ㄶ", "ㄷ", "ㄹ", "ㄺ", "ㄻ", "ㄼ", "ㄽ",
  "ㄾ", "ㄿ", "ㅀ", "ㅁ", "ㅂ", "ㅄ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅊ", "ㅋ",
  "ㅌ", "ㅍ", "ㅎ",
] as const;

/** 초성 로마자 */
export const CHO_ROM = [
  "g", "kk", "n", "d", "tt", "r", "m", "b", "pp", "s", "ss", "", "j", "jj",
  "ch", "k", "t", "p", "h",
] as const;
/** 중성 로마자 */
export const JUNG_ROM = [
  "a", "ae", "ya", "yae", "eo", "e", "yeo", "ye", "o", "wa", "wae", "oe",
  "yo", "u", "wo", "we", "wi", "yu", "eu", "ui", "i",
] as const;
/** 종성 로마자 (받침) */
export const JONG_ROM = [
  "", "k", "k", "k", "n", "n", "n", "t", "l", "k", "m", "l", "l", "l", "p",
  "l", "m", "p", "p", "t", "t", "ng", "t", "t", "k", "t", "p", "t",
] as const;

export function isHangulSyllable(ch: string): boolean {
  const code = ch.codePointAt(0) ?? -1;
  return code >= HANGUL_BASE && code <= HANGUL_END;
}

export interface SyllableParts {
  choIndex: number;
  jungIndex: number;
  jongIndex: number;
  cho: string;
  jung: string;
  jong: string; // "" if none
}

/** 한 음절 → 자모 분해 (한글이 아니면 null) */
export function decomposeSyllable(ch: string): SyllableParts | null {
  if (!isHangulSyllable(ch)) return null;
  const code = (ch.codePointAt(0) ?? 0) - HANGUL_BASE;
  const choIndex = Math.floor(code / (21 * 28));
  const jungIndex = Math.floor((code % (21 * 28)) / 28);
  const jongIndex = code % 28;
  return {
    choIndex,
    jungIndex,
    jongIndex,
    cho: CHO_JAMO[choIndex]!,
    jung: JUNG_JAMO[jungIndex]!,
    jong: JONG_JAMO[jongIndex]!,
  };
}

/** 한 음절 → 로마자 (음운 변화 미반영, 음절 단위 음역) */
export function romanizeSyllable(ch: string): string {
  const p = decomposeSyllable(ch);
  if (!p) return ch;
  return CHO_ROM[p.choIndex]! + JUNG_ROM[p.jungIndex]! + JONG_ROM[p.jongIndex]!;
}
