/**
 * 한글 숫자 읽기 — 아라비아 숫자 → 한자어 수사 / 고유어 수사.
 *
 * 한국어 학습자가 가장 헷갈려 하는 두 수 체계를 동시에 보여준다:
 *
 *  1) 한자어 수사 (일·이·삼···): 날짜·금액·전화번호·층·분·번호.
 *     자릿수 무제한(만·억·조 단위). 1은 천/백/십 앞에서 생략(천, 백, 십),
 *     만 단위가 정확히 1일 때 '일만' → '만'.
 *
 *  2) 고유어 수사 (하나·둘·셋···): 나이·개수·시(時)·사람 수. 1~99 만 존재
 *     (100 이상은 한자어 사용). 관형사형(한·두·세·네·스무)도 함께 제공.
 *
 * 모두 순수 함수 — 부수효과 없음.
 */

import { z } from "zod";

/** JS 안전 정수 + 조 단위까지 실용 범위 */
export const KOREAN_NUMBER_MAX = 9_999_999_999_999;

export const koreanNumberInputSchema = z.object({
  value: z.number().int().min(0).max(KOREAN_NUMBER_MAX),
});

export type KoreanNumberInput = z.input<typeof koreanNumberInputSchema>;
export type KoreanNumberInputResolved = z.output<typeof koreanNumberInputSchema>;

export interface KoreanNumberResult {
  value: number;
  /** 한자어 수사 (예: 12345 → "만이천삼백사십오") */
  sino: string;
  /** 고유어 수사 (1~99, 그 외 null) */
  native: string | null;
  /** 고유어 관형사형 (수량 앞, 예: 21 → "스물한", 20 → "스무") */
  nativeAttributive: string | null;
  /** 고유어 표기가 가능한 범위(1~99)인지 */
  nativeSupported: boolean;
}

const SINO_DIGIT = ["", "일", "이", "삼", "사", "오", "육", "칠", "팔", "구"] as const;
const SINO_PLACE = ["", "십", "백", "천"] as const; // 1의 자리 ~ 천의 자리
const SINO_BIG = ["", "만", "억", "조"] as const; // 4자리 그룹 단위

/** 0~9999 한 그룹을 한자어로 (1은 십/백/천 앞에서 생략) */
function sinoGroup(n: number): string {
  let s = "";
  const padded = String(n).padStart(4, "0");
  for (let i = 0; i < 4; i++) {
    const d = Number(padded[i]);
    const place = 3 - i; // 천(3)·백(2)·십(1)·일(0)
    if (d === 0) continue;
    if (d === 1 && place > 0) {
      s += SINO_PLACE[place] ?? "";
    } else {
      s += (SINO_DIGIT[d] ?? "") + (SINO_PLACE[place] ?? "");
    }
  }
  return s;
}

export function numberToSino(num: number): string {
  if (num === 0) return "영";
  const groups: number[] = [];
  let n = num;
  while (n > 0) {
    groups.push(n % 10000);
    n = Math.floor(n / 10000);
  }
  let result = "";
  for (let g = groups.length - 1; g >= 0; g--) {
    const gv = groups[g]!;
    if (gv === 0) continue;
    let gstr = sinoGroup(gv);
    // 만 단위가 정확히 1이면 '일만' → '만' (억·조는 '일억'·'일조' 유지)
    if (g === 1 && gv === 1) gstr = "";
    result += gstr + SINO_BIG[g];
  }
  return result;
}

const NATIVE_ONES = ["", "하나", "둘", "셋", "넷", "다섯", "여섯", "일곱", "여덟", "아홉"] as const;
const NATIVE_ONES_ATTR = ["", "한", "두", "세", "네", "다섯", "여섯", "일곱", "여덟", "아홉"] as const;
const NATIVE_TENS = ["", "열", "스물", "서른", "마흔", "쉰", "예순", "일흔", "여든", "아흔"] as const;

export function numberToNative(num: number): string | null {
  if (num < 1 || num > 99) return null;
  const t = Math.floor(num / 10);
  const o = num % 10;
  return (NATIVE_TENS[t] ?? "") + (NATIVE_ONES[o] ?? "");
}

export function numberToNativeAttributive(num: number): string | null {
  if (num < 1 || num > 99) return null;
  const t = Math.floor(num / 10);
  const o = num % 10;
  // 20 단독은 '스무' (스무 살), 그 외 일의 자리 없으면 십 단위 그대로
  if (o === 0) return t === 2 ? "스무" : (NATIVE_TENS[t] ?? "");
  return (NATIVE_TENS[t] ?? "") + (NATIVE_ONES_ATTR[o] ?? "");
}

export function convertKoreanNumber(
  input: KoreanNumberInputResolved,
): KoreanNumberResult {
  const { value } = input;
  const native = numberToNative(value);
  return {
    value,
    sino: numberToSino(value),
    native,
    nativeAttributive: numberToNativeAttributive(value),
    nativeSupported: native !== null,
  };
}
