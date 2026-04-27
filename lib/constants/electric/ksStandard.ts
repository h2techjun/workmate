/**
 * KS 표준 전기 설비 상수
 *
 * 출처:
 * - KS C IEC 60364-5-52 (배선설비)
 * - 내선규정 (한국전기기술인협회)
 * - 한국전기설비규정 (KEC) 2021
 *
 * @see docs/electric-calc.md
 */

/** KS 표준 전선 단면적 (mm²) - 오름차순 */
export const KS_WIRE_CROSS_SECTIONS = [
  1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500, 630,
] as const;

export type KsWireCrossSection = (typeof KS_WIRE_CROSS_SECTIONS)[number];

/** 상 종류 */
export type PhaseType =
  | "single-2wire" // 단상 2선식
  | "single-3wire" // 단상 3선식
  | "three-3wire" // 3상 3선식
  | "three-4wire"; // 3상 4선식

/** 도체 재질 */
export type ConductorMaterial = "copper" | "aluminum";

/** 절연 재질 — 도체 최대 허용 온도 (PVC 70°C, XLPE/EPR 90°C) */
export type InsulationType = "PVC" | "XLPE";

/**
 * 전압강하 계수 (내선규정)
 * e = (계수 × L × I) / (1000 × A)
 *
 * 동선 기준. 알루미늄은 ALUMINUM_CORRECTION_FACTOR 곱하기.
 */
export const VOLTAGE_DROP_COEFFICIENT: Record<PhaseType, number> = {
  "single-2wire": 35.6,
  "single-3wire": 17.8,
  "three-3wire": 30.8,
  "three-4wire": 17.8,
};

/** 알루미늄 도체 보정 계수 (저항이 동의 약 1.6배) */
export const ALUMINUM_CORRECTION_FACTOR = 1.6;

/**
 * KS 표준 차단기 정격 전류 (A)
 */
export const KS_BREAKER_RATINGS = {
  /** 소형 차단기 (Miniature Circuit Breaker) */
  mcb: [6, 10, 16, 20, 25, 32, 40, 50, 63] as const,

  /** 배선용 차단기 (Molded Case Circuit Breaker) */
  mccb: [
    15, 20, 30, 40, 50, 60, 75, 100, 125, 150, 175, 200, 225, 250, 300, 350, 400, 500,
    600, 800, 1000, 1200, 1600, 2000,
  ] as const,
} as const;

/**
 * 부하 종류별 안전율 (차단기 선정 시)
 */
export const LOAD_SAFETY_FACTOR = {
  general: 1.25, // 일반 조명/콘센트
  motorDirect: 1.5, // 모터 직입기동
  motorYDelta: 2.0, // 모터 Y-Δ 기동
  inverter: 1.25, // 인버터 부하
  welder: 3.0, // 용접기 (단속 부하)
} as const;

export type LoadType = keyof typeof LOAD_SAFETY_FACTOR;

/**
 * 내선규정 허용 전압강하율 (%)
 * 거리에 따라 차등 적용
 */
export const VOLTAGE_DROP_LIMIT_BY_DISTANCE = [
  { maxDistance: 60, limitPercent: 3 },
  { maxDistance: 120, limitPercent: 5 },
  { maxDistance: 200, limitPercent: 6 },
  { maxDistance: Infinity, limitPercent: 7 },
] as const;

/**
 * 허용 전류 (A) — 동선 / PVC 절연 / 30°C / A1 방식 기준값
 *
 * 출처: KEC 232.5 / KS C IEC 60364-5-52 부속서 B
 * key: 단면적 (mm²)
 */
export const ALLOWED_CURRENT_A1_COPPER: Record<
  number,
  { single: number; three: number }
> = {
  1.5: { single: 17.5, three: 15.5 },
  2.5: { single: 24, three: 21 },
  4: { single: 32, three: 28 },
  6: { single: 41, three: 36 },
  10: { single: 57, three: 50 },
  16: { single: 76, three: 68 },
  25: { single: 101, three: 89 },
  35: { single: 125, three: 110 },
  50: { single: 151, three: 134 },
  70: { single: 192, three: 171 },
  95: { single: 232, three: 207 },
  120: { single: 269, three: 239 },
  150: { single: 309, three: 275 },
  185: { single: 353, three: 314 },
  240: { single: 415, three: 369 },
  300: { single: 477, three: 424 },
};

/**
 * 허용 전류 (A) — 알루미늄 / PVC / 30°C / A1 방식 기준값
 *
 * 출처: KS C IEC 60364-5-52 부속서 B (알루미늄 도체)
 * 알루미늄은 일반적으로 16mm² 미만 사용하지 않음 (작은 단면적은 비표준)
 */
export const ALLOWED_CURRENT_A1_ALUMINUM: Record<
  number,
  { single: number; three: number }
> = {
  16: { single: 59, three: 52 },
  25: { single: 78, three: 69 },
  35: { single: 96, three: 85 },
  50: { single: 117, three: 103 },
  70: { single: 149, three: 132 },
  95: { single: 180, three: 159 },
  120: { single: 208, three: 184 },
  150: { single: 240, three: 212 },
  185: { single: 273, three: 242 },
  240: { single: 320, three: 284 },
  300: { single: 367, three: 326 },
};

/**
 * 알루미늄 최소 표준 단면적 (mm²)
 * 16mm² 미만은 KEC상 알루미늄 사용 비권장
 */
export const ALUMINUM_MIN_CROSS_SECTION = 16;

/**
 * XLPE/EPR 절연 도체 허용전류 보정 (PVC 대비)
 * XLPE는 도체 최대 온도 90°C로 PVC(70°C)보다 약 25% 높은 허용전류 가능
 *
 * 출처: KS C IEC 60364-5-52 (절연 종류별 보정)
 */
export const XLPE_AMPACITY_MULTIPLIER = 1.25;

/**
 * 주위 온도 보정 계수 (Ct) — PVC 절연
 * 기준 30°C에서의 보정값
 *
 * 출처: KS C IEC 60364-5-52 표 B.52.14
 */
export const TEMP_CORRECTION_FACTOR_PVC: ReadonlyArray<{
  temperature: number;
  factor: number;
}> = [
  { temperature: 10, factor: 1.22 },
  { temperature: 15, factor: 1.17 },
  { temperature: 20, factor: 1.12 },
  { temperature: 25, factor: 1.06 },
  { temperature: 30, factor: 1.0 },
  { temperature: 35, factor: 0.94 },
  { temperature: 40, factor: 0.87 },
  { temperature: 45, factor: 0.79 },
  { temperature: 50, factor: 0.71 },
  { temperature: 55, factor: 0.61 },
  { temperature: 60, factor: 0.5 },
];

/**
 * 주위 온도 보정 계수 (Ct) — XLPE/EPR 절연
 *
 * 출처: KS C IEC 60364-5-52 표 B.52.14
 */
export const TEMP_CORRECTION_FACTOR_XLPE: ReadonlyArray<{
  temperature: number;
  factor: number;
}> = [
  { temperature: 10, factor: 1.15 },
  { temperature: 15, factor: 1.12 },
  { temperature: 20, factor: 1.08 },
  { temperature: 25, factor: 1.04 },
  { temperature: 30, factor: 1.0 },
  { temperature: 35, factor: 0.96 },
  { temperature: 40, factor: 0.91 },
  { temperature: 45, factor: 0.87 },
  { temperature: 50, factor: 0.82 },
  { temperature: 55, factor: 0.76 },
  { temperature: 60, factor: 0.71 },
  { temperature: 65, factor: 0.65 },
  { temperature: 70, factor: 0.58 },
  { temperature: 75, factor: 0.5 },
  { temperature: 80, factor: 0.41 },
];

/**
 * 회로 묶음 보정 계수 (Cg)
 * 같은 전선관/트레이에 동시 부하 회로가 여러 개 있을 때
 *
 * 출처: KS C IEC 60364-5-52 표 B.52.17 (방법 A~F)
 */
export const GROUPING_FACTOR_TABLE: ReadonlyArray<{
  circuits: number;
  factor: number;
}> = [
  { circuits: 1, factor: 1.0 },
  { circuits: 2, factor: 0.8 },
  { circuits: 3, factor: 0.7 },
  { circuits: 4, factor: 0.65 },
  { circuits: 5, factor: 0.6 },
  { circuits: 6, factor: 0.57 },
  { circuits: 7, factor: 0.54 },
  { circuits: 8, factor: 0.52 },
  { circuits: 9, factor: 0.5 },
  { circuits: 12, factor: 0.45 },
  { circuits: 16, factor: 0.41 },
  { circuits: 20, factor: 0.38 },
];

/**
 * 안전여유 권장 임계값 (%) — 미만이면 경고
 */
export const SAFETY_MARGIN_WARNING_THRESHOLD = 10;

/**
 * 병렬 케이블 권장 단면적 (mm²) — 초과 시 단일선 대신 병렬 권장
 */
export const PARALLEL_CABLE_RECOMMENDATION_THRESHOLD = 240;
