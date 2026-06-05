/**
 * 한국식 나이 계산 — 만나이 · 세는나이 · 연나이.
 *
 * 한국에는 역사적으로 세 가지 나이 체계가 공존했다:
 *
 *  1) 만나이 (international age): 국제 표준. 생일이 지나면 +1.
 *     2023-06-28 부터 한국 법령·행정상 공식 나이로 통일.
 *
 *  2) 세는나이 (Korean counting age): 태어나면 1살, 매년 1월 1일 모두 +1.
 *     = 기준연도 − 출생연도 + 1. 문화적으로 여전히 일상에서 쓰임.
 *
 *  3) 연나이 (year age): 병역법·청소년보호법 등 일부 법에서 사용.
 *     = 기준연도 − 출생연도. (생일 무관, 연도 차이만)
 *
 * 모두 순수 함수 — 기준일(reference)을 인자로 받아 부수효과 없음.
 */

import { z } from "zod";

export const koreanAgeInputSchema = z.object({
  /** 출생 연도 (4자리) */
  birthYear: z.number().int().min(1900).max(2100),
  /** 출생 월 (1~12) */
  birthMonth: z.number().int().min(1).max(12),
  /** 출생 일 (1~31) */
  birthDay: z.number().int().min(1).max(31),
  /** 기준 연도 (오늘) */
  refYear: z.number().int().min(1900).max(2200),
  /** 기준 월 */
  refMonth: z.number().int().min(1).max(12),
  /** 기준 일 */
  refDay: z.number().int().min(1).max(31),
});

export type KoreanAgeInput = z.input<typeof koreanAgeInputSchema>;
export type KoreanAgeInputResolved = z.output<typeof koreanAgeInputSchema>;

export interface KoreanAgeResult {
  /** 만나이 (국제 표준, 2023~ 한국 공식) */
  internationalAge: number;
  /** 세는나이 (전통 한국식, 태어나면 1살) */
  countingAge: number;
  /** 연나이 (병역·청소년보호법) */
  yearAge: number;
  /** 올해 생일이 이미 지났는가 (기준일 기준) */
  birthdayPassed: boolean;
  /** 다음 생일까지 남은 일수 */
  daysUntilNextBirthday: number;
  birthYear: number;
}

/** 윤년 고려한 두 날짜 간 일수 차 (정수, ref - target) */
function daysBetween(
  fromY: number,
  fromM: number,
  fromD: number,
  toY: number,
  toM: number,
  toD: number,
): number {
  const from = Date.UTC(fromY, fromM - 1, fromD);
  const to = Date.UTC(toY, toM - 1, toD);
  return Math.round((to - from) / 86_400_000);
}

export function calculateKoreanAge(
  input: KoreanAgeInputResolved,
): KoreanAgeResult {
  const { birthYear, birthMonth, birthDay, refYear, refMonth, refDay } = input;

  // 올해(기준연도) 생일이 지났는가
  const birthdayPassed =
    refMonth > birthMonth ||
    (refMonth === birthMonth && refDay >= birthDay);

  // 만나이: 연도 차 − (생일 안 지났으면 1)
  const internationalAge = refYear - birthYear - (birthdayPassed ? 0 : 1);

  // 세는나이: 연도 차 + 1
  const countingAge = refYear - birthYear + 1;

  // 연나이: 연도 차
  const yearAge = refYear - birthYear;

  // 다음 생일까지 남은 일수
  const nextBirthdayYear = birthdayPassed ? refYear + 1 : refYear;
  let daysUntilNextBirthday = daysBetween(
    refYear,
    refMonth,
    refDay,
    nextBirthdayYear,
    birthMonth,
    birthDay,
  );
  // 2월 29일생이 평년이면 음수가 될 수 있어 보정
  if (daysUntilNextBirthday < 0) {
    daysUntilNextBirthday = daysBetween(
      refYear,
      refMonth,
      refDay,
      nextBirthdayYear + 1,
      birthMonth,
      birthDay,
    );
  }

  return {
    internationalAge: Math.max(0, internationalAge),
    countingAge: Math.max(1, countingAge),
    yearAge: Math.max(0, yearAge),
    birthdayPassed,
    daysUntilNextBirthday,
    birthYear,
  };
}
