/**
 * 단열·열관류율 계산용 상수
 *
 * 출처:
 * - 건축물의 에너지절약 설계기준 (국토교통부 고시) 별표1
 * - KS L 9016 (단열재 열전도율 시험)
 * - 한국패시브건축협회(PHIKO) 자료
 *
 * 단위:
 *   λ (열전도율) — W/m·K
 *   R (열저항)   — m²·K/W
 *   U (열관류율) — W/m²·K  (R의 역수)
 */

/* ===========================================================================
 * 한국 기후 지역 (에너지절약 설계기준 별표1)
 * =========================================================================== */

export type ClimateRegion = "central1" | "central2" | "south" | "jeju";

export const CLIMATE_REGION_DESCRIPTION: Record<ClimateRegion, string> = {
  central1: "중부1 (강원·경기북부 일부)",
  central2: "중부2 (서울·인천·경기 대부분·충북·세종)",
  south: "남부 (대전·대구·부산·광주·울산·전라·경상남도)",
  jeju: "제주",
};

/* ===========================================================================
 * 부위 종류
 * =========================================================================== */

export type EnvelopeElement =
  | "exteriorWallDirect" // 외벽 — 직접외기 (거실)
  | "exteriorWallIndirect" // 외벽 — 간접외기 (비거실)
  | "roof" // 지붕
  | "floorDirect" // 최하층 바닥 — 직접외기
  | "floorIndirect"; // 최하층 바닥 — 간접외기

export const ENVELOPE_LABELS: Record<EnvelopeElement, string> = {
  exteriorWallDirect: "외벽 (직접외기·거실)",
  exteriorWallIndirect: "외벽 (간접외기·비거실)",
  roof: "지붕",
  floorDirect: "바닥 (직접외기·거실)",
  floorIndirect: "바닥 (간접외기·비거실)",
};

/* ===========================================================================
 * 지역별·부위별 U값 한계 (W/m²·K) — 건축물의 에너지절약 설계기준 별표1
 * 값 이하여야 통과.
 * =========================================================================== */

export const U_VALUE_LIMITS: Record<
  EnvelopeElement,
  Record<ClimateRegion, number>
> = {
  exteriorWallDirect: {
    central1: 0.15,
    central2: 0.17,
    south: 0.22,
    jeju: 0.29,
  },
  exteriorWallIndirect: {
    central1: 0.21,
    central2: 0.24,
    south: 0.31,
    jeju: 0.41,
  },
  roof: { central1: 0.15, central2: 0.15, south: 0.18, jeju: 0.25 },
  floorDirect: {
    central1: 0.17,
    central2: 0.17,
    south: 0.22,
    jeju: 0.29,
  },
  floorIndirect: {
    central1: 0.24,
    central2: 0.24,
    south: 0.31,
    jeju: 0.41,
  },
};

/* ===========================================================================
 * 단열재·구조재 열전도율 (W/m·K) — KS L 9016 / 제품 카탈로그 평균
 * =========================================================================== */

export type LayerMaterial =
  | "glasswool24" // 글라스울 24K
  | "glasswool48" // 글라스울 48K (고밀도)
  | "mineralwool" // 미네랄울
  | "eps1" // EPS 비드법 1종
  | "eps2" // EPS 비드법 2종
  | "xps" // 압출법 보온판 (XPS)
  | "pirFoam" // PIR 폼
  | "puFoam" // PU 스프레이 폼
  | "cellulose" // 셀룰로오스
  | "phenolic" // 페놀폼
  | "osb11" // OSB 11mm
  | "osb18" // OSB 18mm 구조용
  | "plywood12" // 합판 12mm
  | "gypsum9" // 석고보드 9.5mm
  | "gypsum12" // 석고보드 12.5mm
  | "fiberCement" // 섬유시멘트 사이딩
  | "brick" // 적벽돌
  | "concrete" // 콘크리트
  | "airSpace"; // 공기층 (정지·20mm 이상)

export interface LayerMaterialProperty {
  /** 열전도율 W/m·K (공기층은 R 직접 적용 시 0 처리) */
  conductivity: number;
  /** 공기층 등 R을 직접 부여하는 경우 사용 (m²·K/W). undefined면 thickness/conductivity 사용. */
  fixedR?: number;
}

export const LAYER_MATERIALS: Record<LayerMaterial, LayerMaterialProperty> = {
  glasswool24: { conductivity: 0.038 },
  glasswool48: { conductivity: 0.034 },
  mineralwool: { conductivity: 0.04 },
  eps1: { conductivity: 0.04 },
  eps2: { conductivity: 0.034 },
  xps: { conductivity: 0.029 },
  pirFoam: { conductivity: 0.022 },
  puFoam: { conductivity: 0.024 },
  cellulose: { conductivity: 0.04 },
  phenolic: { conductivity: 0.02 },
  osb11: { conductivity: 0.13 },
  osb18: { conductivity: 0.13 },
  plywood12: { conductivity: 0.13 },
  gypsum9: { conductivity: 0.18 },
  gypsum12: { conductivity: 0.18 },
  fiberCement: { conductivity: 0.3 },
  brick: { conductivity: 0.81 },
  concrete: { conductivity: 1.6 },
  airSpace: { conductivity: 0, fixedR: 0.18 },
};

/* ===========================================================================
 * 표면 열저항 (m²·K/W)
 * =========================================================================== */

export const SURFACE_RESISTANCE = {
  /** 실내 표면 — 벽체 */
  interiorWall: 0.11,
  /** 실내 표면 — 지붕(천장) */
  interiorRoof: 0.1,
  /** 실내 표면 — 바닥 (열류 하향) */
  interiorFloor: 0.17,
  /** 외기 표면 (어떤 부위든 동일) */
  exterior: 0.04,
} as const;

export function getInteriorSurfaceR(element: EnvelopeElement): number {
  if (element === "roof") return SURFACE_RESISTANCE.interiorRoof;
  if (element === "floorDirect" || element === "floorIndirect")
    return SURFACE_RESISTANCE.interiorFloor;
  return SURFACE_RESISTANCE.interiorWall;
}
