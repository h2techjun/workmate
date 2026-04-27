/**
 * 차단기 용량 계산기 (Breaker Capacity Calculator)
 *
 * 부하 전류 × 안전율 → KS 표준 차단기 정격 중 가장 작은 값 선정.
 * MCB ≤ 63A / MCCB > 63A 자동 분기.
 *
 * 핵심 공식:
 *   minRating = loadCurrent × safetyFactor
 *   recommendedRating = ceiling(minRating, 표준 정격 리스트)
 *   safetyMargin = (rating - loadCurrent) / rating × 100
 *
 * @see docs/electric-calc.md - 2. 차단기 용량 계산기
 */

import { z } from "zod";
import {
  KS_BREAKER_RATINGS,
  LOAD_SAFETY_FACTOR,
  type LoadType,
} from "@/lib/constants/electric/ksStandard";

export const breakerInputSchema = z.object({
  loadCurrent: z
    .number()
    .positive("validation.loadCurrentPositive")
    .max(5000, "validation.loadCurrentMax"),
  loadType: z.enum([
    "general",
    "motorDirect",
    "motorYDelta",
    "inverter",
    "welder",
  ]),
  /** 사용자 지정 안전율 (없으면 loadType 기본값 적용) */
  customSafetyFactor: z.number().min(1).max(5).optional(),
  /** ELB 사용 여부 — 인버터 부하와 함께 사용 시 경고 */
  useElb: z.boolean().default(false),
});

export type BreakerInput = z.input<typeof breakerInputSchema>;
export type BreakerInputResolved = z.output<typeof breakerInputSchema>;

export type BreakerType = "MCB" | "MCCB";

export type BreakerStep =
  | {
      key: "minRating";
      loadCurrent: number;
      safetyFactor: number;
      result: number;
    }
  | {
      key: "selectRating";
      minRating: number;
      breakerType: BreakerType;
      result: number;
    }
  | {
      key: "safetyMargin";
      rating: number;
      loadCurrent: number;
      result: number;
    };

export type BreakerWarning =
  | { key: "inverterWithElb" }
  | { key: "marginLow"; threshold: number }
  | { key: "highCurrentMcb" };

export interface BreakerResult {
  recommendedRating: number;
  breakerType: BreakerType;
  appliedSafetyFactor: number;
  calculatedMinRating: number;
  safetyMarginPercent: number;
  warnings: BreakerWarning[];
  calculationSteps: BreakerStep[];
}

export class BreakerCalculationError extends Error {
  public readonly i18nKey: string;
  constructor(i18nKey: string = "noStandardMatch") {
    super(i18nKey);
    this.name = "BreakerCalculationError";
    this.i18nKey = i18nKey;
  }
}

/** loadType → 기본 안전율 매핑 */
function getDefaultSafetyFactor(loadType: LoadType): number {
  return LOAD_SAFETY_FACTOR[loadType];
}

/** 표준 정격 중 minRating 이상의 가장 작은 값 선정 */
function findStandardRating(
  minRating: number,
): { rating: number; type: BreakerType } | undefined {
  // MCB 우선 (소형 부하)
  for (const r of KS_BREAKER_RATINGS.mcb) {
    if (r >= minRating) return { rating: r, type: "MCB" };
  }
  // MCCB 검색
  for (const r of KS_BREAKER_RATINGS.mccb) {
    if (r >= minRating) return { rating: r, type: "MCCB" };
  }
  return undefined;
}

const SAFETY_MARGIN_WARNING_THRESHOLD = 10;

export function calculateBreaker(rawInput: BreakerInput): BreakerResult {
  const input = breakerInputSchema.parse(rawInput);
  const { loadCurrent, loadType, customSafetyFactor, useElb } = input;

  const safetyFactor = customSafetyFactor ?? getDefaultSafetyFactor(loadType);
  const minRating = loadCurrent * safetyFactor;

  const selected = findStandardRating(minRating);
  if (!selected) {
    throw new BreakerCalculationError("noStandardMatch");
  }
  const { rating, type } = selected;
  const safetyMarginPercent = ((rating - loadCurrent) / rating) * 100;

  const warnings: BreakerWarning[] = [];
  if (loadType === "inverter" && useElb) {
    warnings.push({ key: "inverterWithElb" });
  }
  if (safetyMarginPercent < SAFETY_MARGIN_WARNING_THRESHOLD) {
    warnings.push({
      key: "marginLow",
      threshold: SAFETY_MARGIN_WARNING_THRESHOLD,
    });
  }
  // MCB는 63A 이하만 — 그보다 큰 부하에 MCB 선정되는 일은 없지만 경계 경고
  if (type === "MCB" && rating === 63) {
    warnings.push({ key: "highCurrentMcb" });
  }

  const calculationSteps: BreakerStep[] = [
    {
      key: "minRating",
      loadCurrent,
      safetyFactor,
      result: minRating,
    },
    {
      key: "selectRating",
      minRating,
      breakerType: type,
      result: rating,
    },
    {
      key: "safetyMargin",
      rating,
      loadCurrent,
      result: safetyMarginPercent,
    },
  ];

  return {
    recommendedRating: rating,
    breakerType: type,
    appliedSafetyFactor: safetyFactor,
    calculatedMinRating: minRating,
    safetyMarginPercent,
    warnings,
    calculationSteps,
  };
}
