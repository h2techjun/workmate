/**
 * 한국 전압·플러그 가이드 — 외국인/여행자용.
 *
 * 한국: 220V, 60Hz, 플러그 타입 C/F (둥근 핀 2개).
 *
 * 기기 입력전압 범위로 변압기(변환기) 필요 여부 판정:
 *   - 기기가 220V를 수용(예: 100~240V 프리볼트) → 변압기 불필요, 플러그 어댑터만
 *   - 기기 최대 전압 < 220V (예: 미국 120V 전용) → 강압 변압기(220→해당전압) 필요
 *   - 기기 최소 전압 > 220V → 승압 필요 (드묾)
 *
 * 플러그: 한국과 다른 핀 형태(미국 A/B, 영국 G 등)면 어댑터(돼지코) 필요.
 */

import { z } from "zod";

export const voltageInputSchema = z.object({
  /** 기기 입력 최소 전압 (V) */
  deviceMinV: z.number().min(0).max(1000),
  /** 기기 입력 최대 전압 (V) */
  deviceMaxV: z.number().min(0).max(1000),
  /** 출신 국가 플러그 타입 */
  plugType: z.enum(["A", "B", "C", "F", "G", "I", "other"]).default("A"),
});

export type VoltageInput = z.input<typeof voltageInputSchema>;
export type VoltageInputResolved = z.output<typeof voltageInputSchema>;

const KOREA_V = 220;
// 한국에서 그대로 꽂을 수 있는 플러그 타입 (C/F 호환)
const KOREA_COMPATIBLE_PLUGS = new Set(["C", "F"]);

export interface VoltageResult {
  /** 변압기 필요 여부 */
  needsTransformer: boolean;
  /** 변압기 종류 */
  transformerType: "none" | "step-down" | "step-up";
  /** 플러그 어댑터(돼지코) 필요 여부 */
  needsPlugAdapter: boolean;
  /** 기기가 프리볼트(220 수용)인지 */
  isDualVoltage: boolean;
  /** 한국 표준 */
  koreaVoltage: number;
  koreaFrequency: number;
}

export function checkVoltage(input: VoltageInputResolved): VoltageResult {
  const { deviceMinV, deviceMaxV, plugType } = input;

  const acceptsKorea = deviceMinV <= KOREA_V && deviceMaxV >= KOREA_V;
  const isDualVoltage = deviceMaxV - deviceMinV >= 100; // 100~240 같은 프리볼트

  let transformerType: VoltageResult["transformerType"] = "none";
  if (!acceptsKorea) {
    transformerType = deviceMaxV < KOREA_V ? "step-down" : "step-up";
  }

  const needsPlugAdapter = !KOREA_COMPATIBLE_PLUGS.has(plugType);

  return {
    needsTransformer: transformerType !== "none",
    transformerType,
    needsPlugAdapter,
    isDualVoltage,
    koreaVoltage: KOREA_V,
    koreaFrequency: 60,
  };
}
