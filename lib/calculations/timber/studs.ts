/**
 * 스터드(각목) 계산기 — Stud / Framing Calculator
 *
 * 벽 길이·층고·스터드 간격으로부터 스터드 본수 + 상하 플레이트(top/bottom plate)
 * + 헤더(header, 개구부 위 보강재) + 못 개수 산출.
 *
 *   stud_count = ceil(wall_length / spacing) + 1   // 양 끝 포함
 *   stud_length = ceiling_height − (top_plates + bottom_plate)  // 보통 3.5인치 × 3장
 *   top_plate_length = wall_length × 2   // 더블 탑 플레이트
 *   bottom_plate_length = wall_length    // 싱글 솔 플레이트
 *
 * 한국형 시공 가정:
 *   - 일반 표준 스터드 간격: 16인치(406mm) 또는 24인치(610mm).
 *     KBC·KS 는 명시적 표준 없음 → 미국 IRC 관행 차용 (목조주택 협회 가이드).
 *   - 각목(2×4 SPF): 38×89mm. 1본 길이 옵션 (8ft=2438mm, 10ft=3048mm, 12ft=3658mm).
 *   - 헤더(header): 개구부 폭별 보강. 보통 2-2x10 + 1/2 합판 (라미네이트).
 *
 * 출처: NDS 2018, IRC 2018 Chapter 6 (Wall Construction), 미국 목조주택 협회 가이드.
 *      한국 시공은 NDS 차용이 일반적 (자체 표준 부재).
 */

import { z } from "zod";

export const STUD_SPACINGS = [406, 610] as const; // mm (16", 24")
export const PLATE_THICKNESS_MM = 38; // 2x4 38mm
export const DEFAULT_LUMBER_LENGTH_MM = 2438; // 8ft

export const studsInputSchema = z.object({
  /** 벽 길이 (m) — 한 벽 또는 여러 벽 합계 */
  wallLengthM: z
    .number()
    .min(0.5, "validation.wallLengthMin")
    .max(1000, "validation.wallLengthMax"),
  /** 층고 (mm) — 일반적으로 2400~3000mm */
  ceilingHeightMm: z
    .number()
    .min(2100, "validation.ceilingMin")
    .max(4500, "validation.ceilingMax")
    .default(2400),
  /** 스터드 간격 (mm) — 16" (406) 또는 24" (610) */
  spacingMm: z
    .number()
    .refine((v) => STUD_SPACINGS.includes(v as 406 | 610), {
      message: "validation.spacingChoice",
    })
    .default(406),
  /** 개구부 (창문/문) 개수 — 헤더 추가 산정용 */
  openings: z
    .number()
    .int()
    .min(0, "validation.openingsMin")
    .max(50, "validation.openingsMax")
    .default(0),
  /** 손실률 (%) — 절단 손실·여유분 */
  wasteFactorPercent: z
    .number()
    .min(0, "validation.wasteMin")
    .max(50, "validation.wasteMax")
    .default(10),
});

export type StudsInput = z.input<typeof studsInputSchema>;
export type StudsInputResolved = z.output<typeof studsInputSchema>;

export type StudsStep =
  | { key: "studCount"; wallLength: number; spacing: number; result: number }
  | {
      key: "studLength";
      ceilingHeight: number;
      plates: number;
      result: number;
    }
  | { key: "plateLength"; wallLength: number; result: number }
  | { key: "headerCount"; openings: number; result: number }
  | { key: "totalStuds"; base: number; waste: number; result: number }
  | { key: "nails"; studs: number; nailsPerStud: number; result: number };

export interface StudsResult {
  /** 스터드 본수 (손실률 반영, 정수) */
  studCount: number;
  /** 스터드 1본 길이 (mm) */
  studLengthMm: number;
  /** 상부 플레이트 (더블) 총 길이 (m) */
  topPlateTotalLengthM: number;
  /** 솔 플레이트 (싱글) 총 길이 (m) */
  solePlateTotalLengthM: number;
  /** 헤더 본수 (개구부 위) */
  headerCount: number;
  /** 못 총 개수 추정 */
  nailCount: number;
  /** 계산 과정 */
  steps: ReadonlyArray<StudsStep>;
}

/**
 * 스터드 계산.
 *
 * 가정:
 *   - 더블 탑 플레이트 + 싱글 솔 플레이트 = 총 3장 (각 38mm 두께)
 *   - 헤더 본수 = 개구부 1개당 2본 (2×10 더블 헤더)
 *   - 못 8개/스터드 (양 끝 4개씩, 토네일 방식)
 */
export function calculateStuds(input: StudsInputResolved): StudsResult {
  const wallLengthMm = input.wallLengthM * 1000;
  const plateThicknessTotal = PLATE_THICKNESS_MM * 3; // 더블 탑(2) + 솔(1)
  const studLength = input.ceilingHeightMm - plateThicknessTotal;

  // 스터드 본수: ceil(벽 길이 / 간격) + 1 (양 끝 포함)
  const baseStudCount = Math.ceil(wallLengthMm / input.spacingMm) + 1;
  // 개구부 1개당 추가 자크 스터드 (jack stud) 2본 + 킹 스터드 2본 = 4본
  const openingExtraStuds = input.openings * 4;
  const beforeWaste = baseStudCount + openingExtraStuds;
  const studCount = Math.ceil(beforeWaste * (1 + input.wasteFactorPercent / 100));

  // 헤더: 개구부당 2본 (더블 2×10)
  const headerCount = input.openings * 2;

  // 못: 본당 8개 (토네일 4 × 2 단)
  const nailsPerStud = 8;
  const nailCount = studCount * nailsPerStud;

  const steps: StudsStep[] = [
    {
      key: "studCount",
      wallLength: input.wallLengthM,
      spacing: input.spacingMm,
      result: baseStudCount,
    },
    {
      key: "studLength",
      ceilingHeight: input.ceilingHeightMm,
      plates: plateThicknessTotal,
      result: studLength,
    },
    {
      key: "plateLength",
      wallLength: input.wallLengthM,
      result: input.wallLengthM * 3, // 탑 더블 + 솔 싱글
    },
    {
      key: "headerCount",
      openings: input.openings,
      result: headerCount,
    },
    {
      key: "totalStuds",
      base: beforeWaste,
      waste: input.wasteFactorPercent,
      result: studCount,
    },
    {
      key: "nails",
      studs: studCount,
      nailsPerStud,
      result: nailCount,
    },
  ];

  return {
    studCount,
    studLengthMm: studLength,
    topPlateTotalLengthM: input.wallLengthM * 2,
    solePlateTotalLengthM: input.wallLengthM,
    headerCount,
    nailCount,
    steps,
  };
}
