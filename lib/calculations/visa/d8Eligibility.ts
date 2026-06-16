/**
 * D-8 창업·투자 비자 — 기본 신청 자격 체크.
 *
 * ⚠️ OASIS 점수 계산 아님. D-8-4(기술창업) OASIS 점수제는 공식 최소 60점이지만
 * 출처마다 80~120점으로 제각각이고, 항목별 배점표는 법무부 내부 지침(비공개)이라
 * 고정표가 없다. 잘못된 점수 단정은 비자 준비를 그르칠 수 있어, 본 모듈은 "공식
 * 확인된 고정 요건" 충족 여부만 판정한다. OASIS 점수·배점은 가이드에서 정보로만 안내.
 *
 * 출처: 외국인투자촉진법 시행령 §2②(최소 투자 1억·지분 10%), HiKorea 기술창업이민
 *       안내, OASIS 공식(oasisvisa.com).
 */

import { z } from "zod";

/** D-8 신청 유형 (none = 해당 없음/모름) */
export const D8_VISA_TYPES = [
  "corporateInvestment", // D-8-1 한국 법인 신설/투자
  "individualInvestment", // D-8-3 한국인 운영 법인에 투자
  "techStartup", // D-8-4 기술창업 (신규 법인 + IP)
  "none",
] as const;
export type D8VisaType = (typeof D8_VISA_TYPES)[number];

export const d8EligibilityInputSchema = z.object({
  /** 신청 유형 (none 이면 기본 자격 미충족) */
  visaType: z.enum(D8_VISA_TYPES).default("none"),
  // 투자형 (D-8-1 / D-8-3)
  /** 외국인 투자금 1억원 이상 */
  meetsInvestment: z.boolean().default(false),
  /** 의결권 주식 10% 이상 (D-8-3 은 임원 계약 포함) */
  meetsShares: z.boolean().default(false),
  /** 법인 설립 + 사업자등록(투자형은 외국인투자기업 등록) 완료 */
  corpRegistered: z.boolean().default(false),
  // 기술창업 (D-8-4)
  /** 학력: 국내 전문학사 또는 해외 학사 이상 (취득 완료) */
  hasDegree: z.boolean().default(false),
  /** 지식재산권: 특허/실용신안/디자인권 등록 또는 출원 중 */
  hasIP: z.boolean().default(false),
  /** 신규 법인 설립 (기존 법인 인수 아님) */
  newCorp: z.boolean().default(false),
  /** OASIS 필수항목 최소 1개 이상 충족 */
  oasisMandatory: z.boolean().default(false),
  // 공통
  /** 품행단정: 범죄경력 없음 · 출입국 위반 4회 미만 · 세금 미체납 */
  goodConduct: z.boolean().default(false),
});

export type D8EligibilityInput = z.input<typeof d8EligibilityInputSchema>;
export type D8EligibilityInputResolved = z.output<
  typeof d8EligibilityInputSchema
>;

/** 미충족 항목 키 — UI 메시지 매핑용 */
export type D8Blocker =
  | "type"
  | "investment"
  | "shares"
  | "corp"
  | "degree"
  | "ip"
  | "newCorp"
  | "oasis"
  | "conduct";

export interface D8EligibilityResult {
  /** 기본 신청 자격 충족 (OASIS 점수는 별도) */
  baseEligible: boolean;
  /** 미충족 항목 키 목록 */
  blockers: D8Blocker[];
  /** 충족 항목 수 */
  metCount: number;
  /** 선택 유형의 전체 요건 수 */
  requiredCount: number;
}

/**
 * 유형별 필수 요건 키 → 입력 boolean 필드 매핑.
 * 점수 단정 없이 "이 항목들이 모두 충족됐는가"만 본다.
 */
const REQUIRED_BY_TYPE: Record<
  Exclude<D8VisaType, "none">,
  ReadonlyArray<{ blocker: D8Blocker; field: keyof D8EligibilityInputResolved }>
> = {
  corporateInvestment: [
    { blocker: "investment", field: "meetsInvestment" },
    { blocker: "shares", field: "meetsShares" },
    { blocker: "corp", field: "corpRegistered" },
    { blocker: "conduct", field: "goodConduct" },
  ],
  individualInvestment: [
    { blocker: "investment", field: "meetsInvestment" },
    { blocker: "shares", field: "meetsShares" },
    { blocker: "corp", field: "corpRegistered" },
    { blocker: "conduct", field: "goodConduct" },
  ],
  techStartup: [
    { blocker: "degree", field: "hasDegree" },
    { blocker: "ip", field: "hasIP" },
    { blocker: "newCorp", field: "newCorp" },
    { blocker: "oasis", field: "oasisMandatory" },
    { blocker: "conduct", field: "goodConduct" },
  ],
};

export function checkD8Eligibility(
  input: D8EligibilityInputResolved,
): D8EligibilityResult {
  if (input.visaType === "none") {
    return { baseEligible: false, blockers: ["type"], metCount: 0, requiredCount: 0 };
  }

  const required = REQUIRED_BY_TYPE[input.visaType];
  const blockers = required
    .filter((req) => input[req.field] !== true)
    .map((req) => req.blocker);

  return {
    baseEligible: blockers.length === 0,
    blockers,
    metCount: required.length - blockers.length,
    requiredCount: required.length,
  };
}
