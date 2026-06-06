/**
 * 한국 학년 계산 — 출생연도 → 현재 학년(초·중·고·대).
 *
 * 2009년 이후 초등학교 취학 기준: "만 6세가 된 날이 속하는 해의 다음 해 3월 1일".
 * 결과적으로 같은 연도(1월 1일~12월 31일)에 태어난 아이들이 같은 학년이 된다
 * (생일 무관, 출생연도 코호트). 학년도는 3월에 시작해 다음 해 2월에 끝난다.
 *
 * 초1 입학 연도 = 출생연도 + 7  (예: 2018년생 → 2025년 3월 초1).
 *
 * 순수 함수 — 기준일(refYear·refMonth)을 인자로 받아 부수효과 없음.
 * ※ 대학 학년은 "정규 진학" 가정. 재수·휴학·검정고시 등은 반영하지 않는다.
 */

import { z } from "zod";

export const schoolGradeInputSchema = z.object({
  /** 출생 연도 (4자리) */
  birthYear: z.number().int().min(1900).max(2100),
  /** 기준 연도 (오늘) */
  refYear: z.number().int().min(1950).max(2200),
  /** 기준 월 (1~12) — 3월 학년도 시작 판정용 */
  refMonth: z.number().int().min(1).max(12),
});

export type SchoolGradeInput = z.input<typeof schoolGradeInputSchema>;
export type SchoolGradeInputResolved = z.output<typeof schoolGradeInputSchema>;

export type SchoolLevel =
  | "preschool"
  | "elementary"
  | "middle"
  | "high"
  | "university"
  | "adult";

export interface SchoolGradeResult {
  /** 현재 학년도 (3월 시작 기준) */
  schoolYear: number;
  /** 학교급 */
  level: SchoolLevel;
  /** 학년 (초 1~6 · 중 1~3 · 고 1~3 · 대 1~4). 미취학/성인은 0 */
  grade: number;
  /** 초등학교 1학년 입학 연도 (3월) */
  elementaryEntryYear: number;
  /** 중학교 1학년 입학 연도 (3월) */
  middleEntryYear: number;
  /** 고등학교 1학년 입학 연도 (3월) */
  highEntryYear: number;
  /** 고등학교 졸업 연도 (2월) */
  highGraduationYear: number;
  /** 세는나이 (참고) */
  countingAge: number;
}

export function calculateSchoolGrade(
  input: SchoolGradeInputResolved,
): SchoolGradeResult {
  const { birthYear, refYear, refMonth } = input;

  // 학년도: 3월~다음 해 2월. 1~2월은 직전 학년도에 속함.
  const schoolYear = refMonth >= 3 ? refYear : refYear - 1;

  const elementaryEntryYear = birthYear + 7; // 초1 입학(3월)
  const middleEntryYear = birthYear + 13;
  const highEntryYear = birthYear + 16;
  const highGraduationYear = birthYear + 19; // 고3 졸업(2월)

  // g = 0 → 초1
  const g = schoolYear - elementaryEntryYear;

  let level: SchoolLevel;
  let grade: number;
  if (g < 0) {
    level = "preschool";
    grade = 0;
  } else if (g <= 5) {
    level = "elementary";
    grade = g + 1; // 1~6
  } else if (g <= 8) {
    level = "middle";
    grade = g - 5; // 1~3
  } else if (g <= 11) {
    level = "high";
    grade = g - 8; // 1~3
  } else if (g <= 15) {
    level = "university";
    grade = g - 11; // 1~4
  } else {
    level = "adult";
    grade = 0;
  }

  const countingAge = refYear - birthYear + 1;

  return {
    schoolYear,
    level,
    grade,
    elementaryEntryYear,
    middleEntryYear,
    highEntryYear,
    highGraduationYear,
    countingAge,
  };
}
