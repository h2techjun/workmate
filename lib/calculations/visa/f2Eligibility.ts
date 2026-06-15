/**
 * F-2-7 거주(점수제) 비자 — 기본 신청 자격 체크.
 *
 * ⚠️ 점수 계산 아님. F-2-7 세부 배점(연령·학력·소득 등)은 법무부 내부 지침
 * (체류자격별 안내매뉴얼, 비공개)이라 출처마다 다르고 공식 고정표가 없다. 잘못된
 * 점수 단정은 비자 신청을 그르칠 수 있어, 본 모듈은 "공식 확인된 기본 자격 요건"
 * 충족 여부만 판정한다. 점수제(80점)·세부 항목은 가이드에서 정보로만 안내.
 *
 * 출처: 법무부 비자 내비게이터 (신청 5유형 · 3년 연속 합법체류/연소득 4천만 면제 ·
 *       품행단정·공중보건 공통요건).
 */

import { z } from "zod";

/** F-2-7 신청 가능 유형 (none = 해당 없음/모름) */
export const F2_APPLICANT_TYPES = [
  "listedCompany", // 상장법인 종사자
  "growthIndustry", // 유망산업(GNI 1.5배 소득)
  "professional", // 전문직 D-5~E-7, 3년 연속 합법체류
  "studyTalent", // 국내 석사 이상 유학인재
  "potentialTalent", // 이공계 석·박사 잠재 우수인재
  "none",
] as const;
export type F2ApplicantType = (typeof F2_APPLICANT_TYPES)[number];

export const f2EligibilityInputSchema = z.object({
  /** 신청 유형 (none 이면 기본 자격 미충족) */
  applicantType: z.enum(F2_APPLICANT_TYPES).default("none"),
  /** 전문직 3년 연속 합법체류 또는 연소득 4천만원 이상 충족 */
  meetsStayOrIncome: z.boolean().default(false),
  /** 품행단정·결격사유(금고 이상 형·출입국법 다회위반 등) 없음 */
  goodConduct: z.boolean().default(false),
  /** 공중보건 요건(결핵검진 등) 충족 */
  publicHealth: z.boolean().default(false),
});

export type F2EligibilityInput = z.input<typeof f2EligibilityInputSchema>;
export type F2EligibilityInputResolved = z.output<
  typeof f2EligibilityInputSchema
>;

/** 미충족 항목 키 — UI 메시지 매핑용 */
export type F2Blocker = "type" | "stayIncome" | "conduct" | "health";

export interface F2EligibilityResult {
  /** 기본 신청 자격 충족 (점수제 80점은 별도) */
  baseEligible: boolean;
  /** 미충족 항목 키 목록 */
  blockers: F2Blocker[];
  /** 충족 항목 수 / 전체 4 */
  metCount: number;
}

export function checkF2Eligibility(
  input: F2EligibilityInputResolved,
): F2EligibilityResult {
  const blockers: F2Blocker[] = [];
  if (input.applicantType === "none") blockers.push("type");
  if (!input.meetsStayOrIncome) blockers.push("stayIncome");
  if (!input.goodConduct) blockers.push("conduct");
  if (!input.publicHealth) blockers.push("health");

  return {
    baseEligible: blockers.length === 0,
    blockers,
    metCount: 4 - blockers.length,
  };
}
