/**
 * 한국 생활비 추정 기본값.
 *
 * ⚠️ 핵심 원칙 — "과장·확정 정보 금지":
 *   아래 숫자는 2026년 기준의 "일반적 추정 범위의 중앙값"이며, 개인의 생활 방식·
 *   계약 조건에 따라 크게 달라진다. 도구에서는 모든 항목을 사용자가 직접 수정하도록
 *   하고(= 본인이 통제하는 예산), 이 값은 어디까지나 편집 가능한 출발점(prefill)이다.
 *   "한국은 얼마다"라고 단정하지 않는다.
 *
 * 참고 근거(범위 성격): 국가·민간 통계 및 공개 생활비 가이드(Numbeo 등 집계),
 *   국토부 실거래·시세, NHIS 지역가입자 안내. 수치는 범위의 대표값일 뿐이다.
 */

export type Region =
  | "seoulCore"
  | "seoulOuter"
  | "gyeonggi"
  | "metro"
  | "other";

export type Household = "single" | "couple" | "family";

export const REGIONS: readonly Region[] = [
  "seoulCore",
  "seoulOuter",
  "gyeonggi",
  "metro",
  "other",
];

export const HOUSEHOLDS: readonly Household[] = ["single", "couple", "family"];

/** 가구 인원 (1인당 비용 환산용) */
export const HOUSEHOLD_SIZE: Record<Household, number> = {
  single: 1,
  couple: 2,
  family: 4,
};

/** 지역별 월세 기준값 (원/월) — 전용면적 소형 기준 대표값 */
const RENT_BASE: Record<Region, number> = {
  seoulCore: 1_300_000,
  seoulOuter: 850_000,
  gyeonggi: 700_000,
  metro: 600_000,
  other: 450_000,
};

/** 가구별 주거 면적 배수 (월세 스케일) */
const RENT_MULT: Record<Household, number> = {
  single: 1.0,
  couple: 1.3,
  family: 1.8,
};

/** 가구별 항목 기준값 (원/월) — 지역 무관, 인원 스케일 */
const BY_HOUSEHOLD: Record<
  Exclude<CostLineKey, "rent">,
  Record<Household, number>
> = {
  utilities: { single: 130_000, couple: 180_000, family: 250_000 },
  food: { single: 500_000, couple: 800_000, family: 1_200_000 },
  transport: { single: 80_000, couple: 150_000, family: 250_000 },
  mobile: { single: 40_000, couple: 80_000, family: 130_000 },
  healthInsurance: { single: 150_000, couple: 200_000, family: 250_000 },
  other: { single: 300_000, couple: 500_000, family: 700_000 },
};

export type CostLineKey =
  | "rent"
  | "utilities"
  | "food"
  | "transport"
  | "mobile"
  | "healthInsurance"
  | "other";

export const COST_LINE_KEYS: readonly CostLineKey[] = [
  "rent",
  "utilities",
  "food",
  "transport",
  "mobile",
  "healthInsurance",
  "other",
];

const roundTo10k = (n: number): number => Math.round(n / 10_000) * 10_000;

/** 지역·가구 기준 편집 가능한 기본값(prefill) 세트 반환 */
export function suggestDefaults(
  region: Region,
  household: Household,
): Record<CostLineKey, number> {
  return {
    rent: roundTo10k(RENT_BASE[region] * RENT_MULT[household]),
    utilities: BY_HOUSEHOLD.utilities[household],
    food: BY_HOUSEHOLD.food[household],
    transport: BY_HOUSEHOLD.transport[household],
    mobile: BY_HOUSEHOLD.mobile[household],
    healthInsurance: BY_HOUSEHOLD.healthInsurance[household],
    other: BY_HOUSEHOLD.other[household],
  };
}
