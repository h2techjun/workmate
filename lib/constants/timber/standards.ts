/**
 * 목조 주택 시공 KS 표준 / 건축법 상수
 *
 * 출처:
 * - KS F 3020 (목재의 단면 치수)
 * - KS F 3019 (침엽수 구조용 제재)
 * - 건축법 시행령 제48조 (계단의 설치 기준)
 * - 건축물의 피난·방화구조 등의 기준에 관한 규칙 제15조
 *
 * @see docs/timber-calc.md
 */

/* ===========================================================================
 * 계단 안전 기준 (건축법 + Blondel 공식)
 * =========================================================================== */

export type StairUseType = "residential" | "public";

export interface StairStandard {
  /** 최소 단너비 (Tread depth) mm */
  minTread: number;
  /** 최대 단높이 (Riser height) mm */
  maxRiser: number;
  /** 최소 계단 폭 mm */
  minWidth: number;
  /** 최소 헤드룸 mm */
  minHeadroom: number;
  /** Blondel 식 권장 하한 (2R + T ≥) mm */
  blondelMin: number;
  /** Blondel 식 권장 상한 (2R + T ≤) mm */
  blondelMax: number;
}

/**
 * 건축법 시행령 제48조 + 피난·방화구조 규칙 제15조 기준 계단 안전치수.
 * 주거용은 단독주택·공동주택 세대 내부 기준.
 * 공용은 공동주택 공용부·공공시설 기준.
 */
export const STAIR_STANDARDS: Record<StairUseType, StairStandard> = {
  residential: {
    minTread: 240,
    maxRiser: 200,
    minWidth: 750,
    minHeadroom: 2100,
    blondelMin: 600,
    blondelMax: 640,
  },
  public: {
    minTread: 280,
    maxRiser: 180,
    minWidth: 1200,
    minHeadroom: 2100,
    blondelMin: 600,
    blondelMax: 640,
  },
};

/** Blondel 공식 기준값 (2R + T) — 인간공학적 평균 보폭 */
export const BLONDEL_TARGET = 620;

/* ===========================================================================
 * 지붕 경사 분류 (한국 건축 관행 + AIK)
 * =========================================================================== */

export type RoofPitchCategory =
  | "flat"
  | "lowSlope"
  | "mediumSlope"
  | "steepSlope"
  | "extremeSlope";

export interface PitchCategoryRange {
  category: RoofPitchCategory;
  /** 이 카테고리의 최대 각도 (deg, exclusive 상한) */
  maxAngle: number;
}

export const ROOF_PITCH_CATEGORIES: ReadonlyArray<PitchCategoryRange> = [
  { category: "flat", maxAngle: 10 },
  { category: "lowSlope", maxAngle: 30 },
  { category: "mediumSlope", maxAngle: 45 },
  { category: "steepSlope", maxAngle: 60 },
  { category: "extremeSlope", maxAngle: 90 },
];

/* ===========================================================================
 * 목재 수종별 비중 (kg/m³, 기건 상태 함수율 12% 기준)
 * =========================================================================== */

export type WoodSpecies =
  | "pine" // 소나무
  | "larch" // 낙엽송
  | "cedar" // 삼나무
  | "spf" // SPF (가문비/소나무/전나무)
  | "douglasFir" // 더글러스 퍼
  | "oak"; // 참나무

export const WOOD_DENSITY_KG_PER_M3: Record<WoodSpecies, number> = {
  pine: 500,
  larch: 540,
  cedar: 380,
  spf: 460,
  douglasFir: 530,
  oak: 750,
};

/* ===========================================================================
 * KS F 3020 표준 단면 (구조용 제재) — 폭 × 두께 (mm, 마감 후 실제 치수)
 * 미국 명목치수와의 매핑도 함께 제공.
 * =========================================================================== */

export interface LumberDimension {
  /** 미국 명목 표시 (예: "2x4") */
  nominal: string;
  /** 실제 폭 mm */
  widthMM: number;
  /** 실제 두께 mm */
  thicknessMM: number;
}

export const KS_LUMBER_DIMENSIONS: ReadonlyArray<LumberDimension> = [
  { nominal: "2x4", widthMM: 89, thicknessMM: 38 },
  { nominal: "2x6", widthMM: 140, thicknessMM: 38 },
  { nominal: "2x8", widthMM: 184, thicknessMM: 38 },
  { nominal: "2x10", widthMM: 235, thicknessMM: 38 },
  { nominal: "2x12", widthMM: 286, thicknessMM: 38 },
  { nominal: "4x4", widthMM: 89, thicknessMM: 89 },
  { nominal: "4x6", widthMM: 140, thicknessMM: 89 },
];

/** 1才(재) = 1치(寸) × 1치 × 12자(尺) ≈ 0.003342 m³ */
export const SAI_PER_M3 = 1 / 0.003342;

/** 1 board foot = 144 in³ = 2360.65 cm³ */
export const M3_TO_BOARD_FEET = 1 / 0.002359737;

/* ===========================================================================
 * 표준 처마 길이 (한국 단독주택 관행)
 * =========================================================================== */

export const COMMON_EAVE_LENGTHS_MM = [300, 450, 600, 900, 1200];
