/**
 * 도배 벽지 수량 계산 — 벽 면적 기준 필요 롤 수 + 도배풀 소요량.
 *
 *   필요 롤 수 = ceil( 벽 면적(m²) × (1 + 로스율) / 롤당 커버 면적(m²) )
 *   도배풀(kg) = 필요 롤 수 × 롤당 풀 소요량(kg)
 *
 * 롤 규격 및 커버 면적(벽면 시공 기준, 이음·재단 여유 반영):
 *   국산 광폭 벽지(합지·실크) — 폭 106cm × 길이 15.6m → 약 16.5㎡(5평) 커버
 *   수입 벽지 — 폭 53cm × 길이 10m → 약 5.3㎡ 커버
 *
 * 로스율(재단·이음 손실):
 *   무늬 없음(민무늬) — 10%
 *   무늬 맞춤(리피트, patternMatch) — 20% (패턴 반복 간격만큼 버려지는 자투리가 늘어남)
 *
 * 도배풀은 초배지·정배 시공 기준 1롤당 약 1kg 소요.
 *
 * 출처: 한국 도배 시공업계 표준 관행(국산 광폭합지·실크 15.6m/롤, 수입지 10m/롤) +
 *      한국벽지산업협회 시공 가이드.
 */

import { z } from "zod";

export const wallpaperInputSchema = z.object({
  /** 벽 면적 (m²) — 개구부(문·창) 제외한 순수 도배 면적 */
  wallArea: z.number().min(0).default(0),
  /** 벽지 종류 — 합지·실크(국산 광폭 동일 규격) / 수입 */
  wallpaperType: z.enum(["paper", "silk", "import"]).default("silk"),
  /** 무늬 맞춤(리피트) 시공 여부 */
  patternMatch: z.boolean().default(false),
});

export type WallpaperInput = z.input<typeof wallpaperInputSchema>;
export type WallpaperInputResolved = z.output<typeof wallpaperInputSchema>;

interface RollSpec {
  widthCm: number;
  lengthM: number;
  coverageM2: number;
}

/** 국산 광폭 벽지(합지·실크 공용) 규격 */
const WIDE_ROLL: RollSpec = { widthCm: 106, lengthM: 15.6, coverageM2: 16.5 };
/** 수입 벽지 규격 */
const IMPORT_ROLL: RollSpec = { widthCm: 53, lengthM: 10, coverageM2: 5.3 };

export const WALLPAPER_ROLL = {
  paper: WIDE_ROLL,
  silk: WIDE_ROLL,
  import: IMPORT_ROLL,
} as const;

/** 로스율 (%) — 무늬 없음 / 무늬 맞춤(리피트) */
const PLAIN_WASTE_PERCENT = 10;
const PATTERN_WASTE_PERCENT = 20;

/** 롤당 도배풀 소요량 (kg, 초배+정배 기준) */
const GLUE_KG_PER_ROLL = 1;

export interface WallpaperResult {
  /** 로스율 반영 시공 면적 (m²) */
  areaWithWaste: number;
  /** 필요 롤 수 */
  rolls: number;
  /** 적용 롤당 커버 면적 (m²) */
  coveragePerRoll: number;
  /** 적용 로스율 (%) */
  wastePercent: number;
  /** 도배풀 필요량 (kg) */
  glueKg: number;
}

export function calculateWallpaper(
  input: WallpaperInputResolved,
): WallpaperResult {
  const { wallArea, wallpaperType, patternMatch } = input;
  const roll = WALLPAPER_ROLL[wallpaperType];
  const wastePercent = patternMatch
    ? PATTERN_WASTE_PERCENT
    : PLAIN_WASTE_PERCENT;

  const areaWithWaste = wallArea * (1 + wastePercent / 100);
  const rolls = Math.ceil(areaWithWaste / roll.coverageM2);
  const glueKg = rolls * GLUE_KG_PER_ROLL;

  return {
    areaWithWaste: Math.round(areaWithWaste * 100) / 100,
    rolls,
    coveragePerRoll: roll.coverageM2,
    wastePercent,
    glueKg: Math.round(glueKg * 10) / 10,
  };
}
