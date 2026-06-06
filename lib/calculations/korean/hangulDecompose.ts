/**
 * 한글 음절 분해 — 문장·단어를 음절별 초성·중성·종성 자모로 분해.
 *
 * 한국어 학습자가 받침(종성) 유무, 자모 구성, 글자별 로마자 음가를 학습할 때 사용.
 * 유니코드 한글 음절(AC00~D7A3)을 (초성×21 + 중성)×28 + 종성 으로 역산하는
 * 공용 모듈(`hangul.ts`)을 재사용한다. 순수 함수 — 부수효과 없음.
 */

import {
  isHangulSyllable,
  decomposeSyllable,
  CHO_ROM,
  JUNG_ROM,
  JONG_ROM,
} from "./hangul";

export interface DecomposedSyllable {
  /** 음절 자체 (예: "한") */
  syllable: string;
  /** 초성 자모 (예: "ㅎ") */
  cho: string;
  /** 중성 자모 (예: "ㅏ") */
  jung: string;
  /** 종성 자모 (받침 없으면 "") */
  jong: string;
  /** 초성 로마자 */
  choRom: string;
  /** 중성 로마자 */
  jungRom: string;
  /** 종성 로마자 (받침 없으면 "") */
  jongRom: string;
  /** 음절 로마자 음역 (초+중+종) */
  romanized: string;
  /** 받침(종성) 유무 */
  hasJong: boolean;
  /** 자모 개수 (2 = 받침 없음, 3 = 받침 있음) */
  jamoCount: number;
}

export interface HangulDecomposeResult {
  input: string;
  /** 한글 음절만 분해한 목록 (비한글 문자는 제외) */
  syllables: DecomposedSyllable[];
  /** 한글 음절 수 */
  syllableCount: number;
  /** 분해된 자모 총 개수 */
  jamoTotal: number;
  /** 자모를 일렬로 나열 (예: ["ㅎ","ㅏ","ㄴ","ㄱ","ㅡ","ㄹ"]) */
  flatJamo: string[];
}

export function decomposeHangul(raw: string): HangulDecomposeResult {
  const syllables: DecomposedSyllable[] = [];
  const flatJamo: string[] = [];

  for (const ch of raw) {
    if (!isHangulSyllable(ch)) continue;
    const p = decomposeSyllable(ch);
    if (!p) continue;

    const choRom = CHO_ROM[p.choIndex] ?? "";
    const jungRom = JUNG_ROM[p.jungIndex] ?? "";
    const jongRom = JONG_ROM[p.jongIndex] ?? "";
    const hasJong = p.jong !== "";

    syllables.push({
      syllable: ch,
      cho: p.cho,
      jung: p.jung,
      jong: p.jong,
      choRom,
      jungRom,
      jongRom,
      romanized: choRom + jungRom + jongRom,
      hasJong,
      jamoCount: hasJong ? 3 : 2,
    });

    flatJamo.push(p.cho, p.jung);
    if (hasJong) flatJamo.push(p.jong);
  }

  return {
    input: raw,
    syllables,
    syllableCount: syllables.length,
    jamoTotal: flatJamo.length,
    flatJamo,
  };
}
