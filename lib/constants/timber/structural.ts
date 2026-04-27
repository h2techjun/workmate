/**
 * 목조 구조 계산용 상수
 *
 * 출처:
 * - KDS 41 33 02 (목구조 설계기준)
 * - KDS 41 10 15 (건축구조기준 설계하중)
 * - NDS 2018 (National Design Specification for Wood Construction)
 * - Canada Wood Korea — 경골목구조 표준 상세
 */

import type { LumberDimension } from "./standards";
import { KS_LUMBER_DIMENSIONS } from "./standards";

/* ===========================================================================
 * 부재 종류
 * =========================================================================== */

export type SpanMemberType =
  | "floorJoist" // 바닥 장선
  | "ceilingJoist" // 천장 장선
  | "rafter" // 서까래
  | "header"; // 헤더 (개구부 보)

/* ===========================================================================
 * 수종·등급별 허용응력 (NDS / KS F 3019 단순화)
 * 단위: MPa (= N/mm²)
 *
 * Fb : 허용 휨응력 (Allowable bending stress)
 * E  : 탄성계수 (Modulus of elasticity)
 *
 * 주: 실제 NDS에는 다수의 보정계수(CD, CM, Ct, CL, CF, Cfu, Ci, Cr)가 곱해진다.
 *     본 도구는 주거용 계획·검토용으로 Cr=1.15 (반복부재) 만 적용한다.
 *     실제 시공 전 구조사 검토 필수.
 * =========================================================================== */

export type WoodGrade =
  | "spf2" // SPF #2 (가문비-소나무-전나무, 캐나다 표준 수입재)
  | "spfStud" // SPF Stud Grade
  | "df2" // Douglas Fir-Larch #2
  | "hf2" // Hem-Fir #2
  | "larch2"; // 국내 낙엽송 #2

export interface WoodMechanicalProperties {
  /** 허용 휨응력 (MPa) */
  Fb: number;
  /** 탄성계수 (MPa) */
  E: number;
  /** 표시명(영문) */
  displayName: string;
}

export const WOOD_MECHANICAL: Record<WoodGrade, WoodMechanicalProperties> = {
  spf2: { Fb: 7.6, E: 9500, displayName: "SPF #2" },
  spfStud: { Fb: 6.5, E: 9500, displayName: "SPF Stud" },
  df2: { Fb: 12.4, E: 12400, displayName: "Douglas Fir-Larch #2" },
  hf2: { Fb: 8.6, E: 11000, displayName: "Hem-Fir #2" },
  larch2: { Fb: 9.0, E: 11000, displayName: "Larch #2" },
};

/** 반복부재 보정계수 Cr (장선/서까래 등 600mm 이하 간격, 3개 이상 그룹) */
export const REPETITIVE_MEMBER_FACTOR = 1.15;

/* ===========================================================================
 * 한국 지역별 적설하중 (kN/m²) — KDS 41 10 15 부록 B 단순화
 * =========================================================================== */

export type SnowRegion =
  | "seoulMetro" // 서울·인천·경기 (대부분)
  | "gangwonYeongdong" // 강원 영동 (고성·속초·양양·강릉·동해·삼척)
  | "gangwonYeongseo" // 강원 영서
  | "chungcheong" // 충청
  | "jeolla" // 전라
  | "gyeongsang" // 경상
  | "jeju" // 제주
  | "ulleung"; // 울릉도

export const SNOW_LOAD_BY_REGION_KN_PER_M2: Record<SnowRegion, number> = {
  seoulMetro: 0.5,
  gangwonYeongdong: 3.0,
  gangwonYeongseo: 0.5,
  chungcheong: 0.5,
  jeolla: 0.5,
  gyeongsang: 0.5,
  jeju: 0.5,
  ulleung: 3.0,
};

/* ===========================================================================
 * 부재 종류별 기본 하중 (kN/m²) — 거주공간 기준
 * =========================================================================== */

/** 기본 활하중 (KDS 41 10 15) */
export const DEFAULT_LIVE_LOAD_KN_PER_M2: Record<SpanMemberType, number> = {
  floorJoist: 2.0, // 거실/침실
  ceilingJoist: 0.5, // 천장 (다락 미사용)
  rafter: 0, // 서까래는 적설하중으로 대체
  header: 2.0, // 위층 부담 가정
};

/** 기본 자중 (Dead load) */
export const DEFAULT_DEAD_LOAD_KN_PER_M2: Record<SpanMemberType, number> = {
  floorJoist: 0.5,
  ceilingJoist: 0.3,
  rafter: 0.5,
  header: 1.0,
};

/* ===========================================================================
 * 처짐 한계 (KDS 41 33 02 / IRC R301.7)
 * 표시 의미: span / value
 * 예: floorJoist 360 → δ_max = L/360
 * =========================================================================== */

export const DEFLECTION_LIMIT_DENOMINATOR: Record<SpanMemberType, number> = {
  floorJoist: 360, // 활하중 기준
  ceilingJoist: 240,
  rafter: 180,
  header: 240,
};

/* ===========================================================================
 * 표준 부재 간격 (mm)
 * =========================================================================== */

export const COMMON_SPACING_MM = [400, 450, 600] as const;

/* ===========================================================================
 * 단면 특성 헬퍼 (사각형 부재)
 * =========================================================================== */

export interface SectionProperties {
  /** 폭(수평) mm */
  b: number;
  /** 춤(수직, 하중방향) mm */
  d: number;
  /** 단면 2차모멘트 mm⁴ */
  I: number;
  /** 단면계수 mm³ */
  S: number;
  /** 단면적 mm² */
  A: number;
}

/**
 * 부재 단면 특성 계산.
 * 장선·서까래는 깊이(d) 방향이 하중방향이므로 KS 표준 부재의 thicknessMM(38)이 b,
 * widthMM(140 등)이 d가 된다.
 */
export function getSectionProperties(lumber: LumberDimension): SectionProperties {
  const b = lumber.thicknessMM;
  const d = lumber.widthMM;
  return {
    b,
    d,
    A: b * d,
    I: (b * d ** 3) / 12,
    S: (b * d ** 2) / 6,
  };
}

/** 명목치수 → KS 부재 객체 매핑 */
export function findLumber(nominal: string): LumberDimension | undefined {
  return KS_LUMBER_DIMENSIONS.find((l) => l.nominal === nominal);
}

/** 경간 계산기에서 지원하는 부재 명목치수 */
export const SPAN_LUMBER_OPTIONS = [
  "2x4",
  "2x6",
  "2x8",
  "2x10",
  "2x12",
] as const;

export type SpanLumberNominal = (typeof SPAN_LUMBER_OPTIONS)[number];
