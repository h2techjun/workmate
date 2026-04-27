/**
 * 자재 수량 산정용 상수 (시트류 표준 규격, 못/스크류 간격)
 *
 * 출처:
 * - 한국 유통 표준 규격
 * - IRC R602.3 못 박기 기준
 */

/* ===========================================================================
 * 시트형 자재 표준 규격
 * =========================================================================== */

export type SheetMaterial =
  | "osb11" // OSB 11mm 보드
  | "osb18" // OSB 18mm 구조용
  | "plywood12" // 합판 12mm
  | "plywood18" // 합판 18mm
  | "gypsum9" // 석고보드 9.5mm
  | "gypsum12" // 석고보드 12.5mm
  | "cementBoard" // 시멘트보드 (외장 하지)
  | "fiberCementSiding" // 섬유시멘트 사이딩
  | "vinylSiding" // 비닐 사이딩
  | "asphaltShingle" // 아스팔트 슁글 (1 bundle)
  | "battInsulationR19"; // 글라스울 R-19 batt (2x6용)

export interface SheetSpec {
  /** 폭 mm */
  widthMM: number;
  /** 길이 mm */
  lengthMM: number;
  /** 단위 면적 m² (= W × L / 1e6) */
  areaM2: number;
  /** 매당 무게 kg (참고치) */
  weightKg: number;
  /** 표시명 단위 (장/매/번들 등) */
  unit: "sheet" | "bundle" | "batt";
}

export const SHEET_MATERIALS: Record<SheetMaterial, SheetSpec> = {
  osb11: {
    widthMM: 1220,
    lengthMM: 2440,
    areaM2: 2.9768,
    weightKg: 19,
    unit: "sheet",
  },
  osb18: {
    widthMM: 1220,
    lengthMM: 2440,
    areaM2: 2.9768,
    weightKg: 31,
    unit: "sheet",
  },
  plywood12: {
    widthMM: 1220,
    lengthMM: 2440,
    areaM2: 2.9768,
    weightKg: 22,
    unit: "sheet",
  },
  plywood18: {
    widthMM: 1220,
    lengthMM: 2440,
    areaM2: 2.9768,
    weightKg: 33,
    unit: "sheet",
  },
  gypsum9: {
    widthMM: 900,
    lengthMM: 1800,
    areaM2: 1.62,
    weightKg: 12,
    unit: "sheet",
  },
  gypsum12: {
    widthMM: 900,
    lengthMM: 1800,
    areaM2: 1.62,
    weightKg: 16,
    unit: "sheet",
  },
  cementBoard: {
    widthMM: 900,
    lengthMM: 1800,
    areaM2: 1.62,
    weightKg: 22,
    unit: "sheet",
  },
  fiberCementSiding: {
    widthMM: 200,
    lengthMM: 3600,
    areaM2: 0.72,
    weightKg: 9,
    unit: "sheet",
  },
  vinylSiding: {
    widthMM: 250,
    lengthMM: 3700,
    areaM2: 0.93,
    weightKg: 4,
    unit: "sheet",
  },
  asphaltShingle: {
    widthMM: 0, // 번들 단위(면적 기준 매수 산정)
    lengthMM: 0,
    areaM2: 3.1, // 1 bundle ≈ 3.1 m² (33 sq.ft.)
    weightKg: 27,
    unit: "bundle",
  },
  battInsulationR19: {
    widthMM: 600,
    lengthMM: 2400,
    areaM2: 1.44,
    weightKg: 5,
    unit: "batt",
  },
};

/* ===========================================================================
 * 못/스크류 간격 — IRC R602.3 / 한국 시공 관행
 * =========================================================================== */

export interface FastenerSpacing {
  /** 가장자리 못 간격 (mm) */
  edgeMM: number;
  /** 부재 가운데(field) 못 간격 (mm) */
  fieldMM: number;
}

export const SHEATHING_NAIL_SPACING: FastenerSpacing = {
  edgeMM: 150, // 6"
  fieldMM: 300, // 12"
};

export const GYPSUM_SCREW_SPACING: FastenerSpacing = {
  edgeMM: 200, // 8"
  fieldMM: 300, // 12"
};

/* ===========================================================================
 * 손실률 권장 (낭비분)
 * =========================================================================== */

export const DEFAULT_WASTE_FACTOR_PERCENT = 10;
export const MIN_WASTE_FACTOR_PERCENT = 0;
export const MAX_WASTE_FACTOR_PERCENT = 30;
