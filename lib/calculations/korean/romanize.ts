/**
 * 한글 이름 로마자 변환 — 국립국어원 로마자 표기법(2000 개정) 기반.
 *
 * 핵심: 사람 이름은 음운 변화를 표기에 반영하지 않고 음절 단위로 적는다
 * (표기법 제3장 제4항). 예) 홍길동 → Hong Gildong, 한복남 → Han Boknam.
 *
 * 성(姓)은 관습 표기(Kim, Lee, Park, Choi…)가 여권 등에서 널리 쓰이므로
 * 정식 표기와 함께 관습 표기도 제시한다.
 *
 * 음절 분해·로마자 음가는 공용 모듈 `hangul.ts` 단일 진실원을 사용한다
 * (text-romanize·hangul-decompose 와 동일 표 — 중복 정의 금지).
 */

import { isHangulSyllable, romanizeSyllable } from "./hangul";

/** 흔한 성씨의 관습 로마자 (여권 통계 다수) */
const SURNAME_CONVENTIONAL: Record<string, string> = {
  김: "Kim", 이: "Lee", 박: "Park", 최: "Choi", 정: "Jung", 강: "Kang",
  조: "Cho", 윤: "Yoon", 장: "Jang", 임: "Lim", 한: "Han", 오: "Oh",
  서: "Seo", 신: "Shin", 권: "Kwon", 황: "Hwang", 안: "Ahn", 송: "Song",
  전: "Jeon", 홍: "Hong", 유: "Yoo", 고: "Ko", 문: "Moon", 양: "Yang",
  손: "Son", 배: "Bae", 백: "Baek", 허: "Heo", 노: "Noh", 심: "Shim",
  하: "Ha", 곽: "Kwak", 성: "Sung", 차: "Cha", 주: "Joo", 우: "Woo",
  구: "Koo", 민: "Min", 류: "Ryu", 나: "Na", 진: "Jin", 지: "Ji",
  엄: "Eom", 채: "Chae", 원: "Won", 천: "Cheon", 방: "Bang", 공: "Kong",
};

/** 두 글자 복성 */
const COMPOUND_SURNAMES = new Set([
  "남궁", "황보", "제갈", "사공", "선우", "서문", "독고", "동방", "망절",
]);

/** 음절 묶음을 로마자로 (첫 글자 대문자) */
function romanizeBlock(block: string): string {
  let out = "";
  for (const ch of block) {
    out += isHangulSyllable(ch) ? romanizeSyllable(ch) : ch;
  }
  return out.charAt(0).toUpperCase() + out.slice(1);
}

export interface RomanizeResult {
  /** 입력 (정제된 한글) */
  input: string;
  /** 성 (한글) */
  surnameKo: string;
  /** 이름 (한글) */
  givenKo: string;
  /** 성 — 정식 로마자 표기 */
  surnameRevised: string;
  /** 성 — 관습 표기 (있으면) */
  surnameConventional: string | null;
  /** 이름 — 정식 로마자 (음절 붙여쓰기) */
  givenRevised: string;
  /** 이름 — 음절 사이 하이픈 버전 (여권 허용 방식) */
  givenHyphenated: string;
  /** 권장 전체 표기 (정식): "Surname Given" */
  fullRevised: string;
  /** 관습 표기 전체 (성 관습 있으면): "Conventional Given" */
  fullConventional: string;
}

export function romanizeKoreanName(raw: string): RomanizeResult {
  // 한글만 추출 (공백 제거)
  const input = [...raw].filter(isHangulSyllable).join("");

  // 성 길이 판단 (복성 우선)
  let surnameLen = 1;
  if (input.length >= 2 && COMPOUND_SURNAMES.has(input.slice(0, 2))) {
    surnameLen = 2;
  }
  const surnameKo = input.slice(0, surnameLen);
  const givenKo = input.slice(surnameLen);

  const surnameRevised = romanizeBlock(surnameKo);
  const surnameConventional =
    surnameLen === 1 ? (SURNAME_CONVENTIONAL[surnameKo] ?? null) : null;

  const givenRevised = givenKo ? romanizeBlock(givenKo) : "";

  // 하이픈 버전: 음절마다 로마자 후 하이픈 (둘째 음절부터 소문자)
  let givenHyphenated = "";
  const givenChars = [...givenKo];
  givenChars.forEach((ch, i) => {
    const r = isHangulSyllable(ch) ? romanizeSyllable(ch) : ch;
    if (i === 0) {
      givenHyphenated = r.charAt(0).toUpperCase() + r.slice(1);
    } else {
      givenHyphenated += "-" + r;
    }
  });

  const fullRevised = givenRevised
    ? `${surnameRevised} ${givenRevised}`
    : surnameRevised;
  const fullConventional = surnameConventional
    ? givenRevised
      ? `${surnameConventional} ${givenRevised}`
      : surnameConventional
    : fullRevised;

  return {
    input,
    surnameKo,
    givenKo,
    surnameRevised,
    surnameConventional,
    givenRevised,
    givenHyphenated,
    fullRevised,
    fullConventional,
  };
}
