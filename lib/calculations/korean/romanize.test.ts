import { describe, it, expect } from "vitest";
import { romanizeKoreanName } from "./romanize";

describe("한글 이름 로마자 변환", () => {
  it("홍길동 → Hong Gildong (정식)", () => {
    const out = romanizeKoreanName("홍길동");
    expect(out.surnameKo).toBe("홍");
    expect(out.givenKo).toBe("길동");
    expect(out.surnameRevised).toBe("Hong");
    expect(out.givenRevised).toBe("Gildong");
    expect(out.fullRevised).toBe("Hong Gildong");
  });

  it("김민수 → 정식 Gim Minsu, 관습 Kim", () => {
    const out = romanizeKoreanName("김민수");
    expect(out.surnameRevised).toBe("Gim");
    expect(out.surnameConventional).toBe("Kim");
    expect(out.givenRevised).toBe("Minsu");
    expect(out.fullConventional).toBe("Kim Minsu");
  });

  it("이서연 → 정식 I Seoyeon, 관습 Lee", () => {
    const out = romanizeKoreanName("이서연");
    expect(out.surnameRevised).toBe("I");
    expect(out.surnameConventional).toBe("Lee");
    expect(out.givenRevised).toBe("Seoyeon");
  });

  it("박지훈 → 관습 Park", () => {
    const out = romanizeKoreanName("박지훈");
    expect(out.surnameConventional).toBe("Park");
    expect(out.givenRevised).toBe("Jihun");
  });

  it("복성 남궁민 → 성 2글자", () => {
    const out = romanizeKoreanName("남궁민");
    expect(out.surnameKo).toBe("남궁");
    expect(out.givenKo).toBe("민");
    expect(out.surnameRevised).toBe("Namgung");
    expect(out.givenRevised).toBe("Min");
  });

  it("하이픈 버전: 길동 → Gil-dong", () => {
    const out = romanizeKoreanName("홍길동");
    expect(out.givenHyphenated).toBe("Gil-dong");
  });

  it("받침 ㅇ → ng, 종성 처리: 강동원", () => {
    const out = romanizeKoreanName("강동원");
    // 강=gang(관습 Kang), 동원=Dongwon
    expect(out.surnameRevised).toBe("Gang");
    expect(out.surnameConventional).toBe("Kang");
    expect(out.givenRevised).toBe("Dongwon");
  });

  it("공백·비한글 제거", () => {
    const out = romanizeKoreanName(" 홍 길동 123");
    expect(out.input).toBe("홍길동");
  });
});
