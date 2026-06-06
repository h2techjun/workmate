/**
 * 한글 일반 텍스트 → 로마자 변환 (국립국어원 표기법, 음역 방식).
 *
 * 음절 단위로 초성·중성·종성을 로마자로 옮긴다. 음운 변화(자음동화 등)는
 * 반영하지 않는 단순 음역(transliteration) — 간판·메뉴·단어 읽기에 적합.
 * 공백·구두점·숫자·영문은 그대로 보존.
 *
 * ※ 발음 기준 정밀 표기(예: 신라 → Silla)는 음운 규칙이 필요해 미반영.
 *   본 도구는 글자 단위 음역이라 '신라' → 'Sinra' 로 나온다(주의 안내).
 */

import { isHangulSyllable, romanizeSyllable } from "./hangul";

export interface TextRomanizeResult {
  input: string;
  /** 로마자 (음절 음역) */
  romanized: string;
  /** 한글 음절 수 */
  syllableCount: number;
}

export function romanizeText(raw: string): TextRomanizeResult {
  let out = "";
  let syllableCount = 0;

  for (const ch of raw) {
    if (isHangulSyllable(ch)) {
      out += romanizeSyllable(ch);
      syllableCount++;
    } else {
      out += ch; // 공백·구두점·영문·숫자 보존
    }
  }

  // 단어 첫 글자 대문자화 (공백 기준)
  const capitalized = out.replace(/(^|\s)([a-z])/g, (_m, sp, c) => sp + c.toUpperCase());

  return {
    input: raw,
    romanized: capitalized,
    syllableCount,
  };
}
