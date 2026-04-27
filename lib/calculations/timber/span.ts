/**
 * 부재 경간 계산기 (Span Calculator)
 *
 * 휨응력과 처짐 기준을 동시에 만족하는 최대 경간을 산출.
 *
 *   휨 검토:  M = wL²/8,  σ = M/S ≤ Fb  →  L_b = √(8 × Fb × S / w)
 *   처짐 검토: δ = 5wL⁴/(384EI) ≤ L/k  →  L_d = ∛(384 × E × I / (5 × w × k))
 *   최대 경간 = min(L_b, L_d)
 *
 * 보정계수: 반복부재(장선·서까래 600mm 이하 간격, 3개 이상) Cr = 1.15
 *
 * 한계:
 *   - NDS 다른 보정계수(CD/CM/Ct/CL/CF/Ci) 미적용 — 주거용 일반 가정
 *   - 전단·압축수직 검토 미포함
 *   - 실제 시공 전 구조사 검토 필수
 *
 * @see docs/timber-calc.md
 */

import { z } from "zod";
import {
  DEFAULT_DEAD_LOAD_KN_PER_M2,
  DEFAULT_LIVE_LOAD_KN_PER_M2,
  DEFLECTION_LIMIT_DENOMINATOR,
  REPETITIVE_MEMBER_FACTOR,
  SNOW_LOAD_BY_REGION_KN_PER_M2,
  SPAN_LUMBER_OPTIONS,
  WOOD_MECHANICAL,
  findLumber,
  getSectionProperties,
} from "@/lib/constants/timber/structural";

export const spanInputSchema = z.object({
  memberType: z.enum(["floorJoist", "ceilingJoist", "rafter", "header"]),
  lumberSize: z.enum(SPAN_LUMBER_OPTIONS),
  spacingMM: z
    .number()
    .min(150, "validation.spacingMin")
    .max(1200, "validation.spacingMax"),
  grade: z.enum(["spf2", "spfStud", "df2", "hf2", "larch2"]).default("spf2"),
  snowRegion: z
    .enum([
      "seoulMetro",
      "gangwonYeongdong",
      "gangwonYeongseo",
      "chungcheong",
      "jeolla",
      "gyeongsang",
      "jeju",
      "ulleung",
    ])
    .default("seoulMetro"),
  liveLoadOverride: z.number().min(0).max(20).optional(),
  deadLoadOverride: z.number().min(0).max(20).optional(),
});

export type SpanInput = z.input<typeof spanInputSchema>;
export type SpanInputResolved = z.output<typeof spanInputSchema>;

export type SpanStep =
  | {
      key: "loads";
      live: number;
      dead: number;
      snow: number;
      total: number;
    }
  | {
      key: "lineLoad";
      total: number;
      spacing: number;
      result: number;
    }
  | { key: "section"; b: number; d: number; I: number; S: number }
  | {
      key: "fbAdjusted";
      base: number;
      cr: number;
      result: number;
    }
  | { key: "bendingSpan"; fb: number; S: number; w: number; result: number }
  | {
      key: "deflectionSpan";
      E: number;
      I: number;
      w: number;
      k: number;
      result: number;
    }
  | {
      key: "governing";
      bending: number;
      deflection: number;
      result: number;
      check: "bending" | "deflection";
    };

export type SpanWarning =
  | { key: "spacingUnusual"; actual: number }
  | { key: "rafterNeedsSnow" }
  | { key: "lumberNotFound"; size: string };

export interface SpanResult {
  maxSpanMM: number;
  maxSpanByBendingMM: number;
  maxSpanByDeflectionMM: number;
  governingCheck: "bending" | "deflection";
  totalLoadKnPerM2: number;
  loadPerLinearMeterKnPerM: number;
  sectionModulusMM3: number;
  momentOfInertiaMM4: number;
  effectiveFbMPa: number;
  warnings: SpanWarning[];
  calculationSteps: SpanStep[];
}

export class SpanCalculationError extends Error {
  public readonly i18nKey: string;
  constructor(i18nKey: string = "noLumberData") {
    super(i18nKey);
    this.name = "SpanCalculationError";
    this.i18nKey = i18nKey;
  }
}

export function calculateSpan(rawInput: SpanInput): SpanResult {
  const input = spanInputSchema.parse(rawInput);
  const {
    memberType,
    lumberSize,
    spacingMM,
    grade,
    snowRegion,
    liveLoadOverride,
    deadLoadOverride,
  } = input;

  const lumber = findLumber(lumberSize);
  if (!lumber) {
    throw new SpanCalculationError("noLumberData");
  }
  const section = getSectionProperties(lumber);

  // 하중 산정
  const live = liveLoadOverride ?? DEFAULT_LIVE_LOAD_KN_PER_M2[memberType];
  const dead = deadLoadOverride ?? DEFAULT_DEAD_LOAD_KN_PER_M2[memberType];
  const snow =
    memberType === "rafter" ? SNOW_LOAD_BY_REGION_KN_PER_M2[snowRegion] : 0;
  const totalLoad = live + dead + snow;

  // 단위 환산: kN/m² × (간격 mm / 1000) = kN/m = N/mm
  const wNperMM = totalLoad * (spacingMM / 1000);

  // 반복부재 보정 (간격 600mm 이하 + 부재 종류가 장선/서까래)
  const isRepetitive =
    spacingMM <= 600 &&
    (memberType === "floorJoist" ||
      memberType === "ceilingJoist" ||
      memberType === "rafter");
  const baseFb = WOOD_MECHANICAL[grade].Fb;
  const effectiveFb = isRepetitive
    ? baseFb * REPETITIVE_MEMBER_FACTOR
    : baseFb;
  const E = WOOD_MECHANICAL[grade].E;

  // 휨 검토: L_b = √(8 × Fb × S / w)
  const bendingSpan = Math.sqrt((8 * effectiveFb * section.S) / wNperMM);

  // 처짐 검토: L_d = ∛(384 × E × I / (5 × w × k))
  const k = DEFLECTION_LIMIT_DENOMINATOR[memberType];
  const deflectionSpan = Math.cbrt(
    (384 * E * section.I) / (5 * wNperMM * k),
  );

  const maxSpan = Math.min(bendingSpan, deflectionSpan);
  const governingCheck: "bending" | "deflection" =
    bendingSpan < deflectionSpan ? "bending" : "deflection";

  // 경고
  const warnings: SpanWarning[] = [];
  if (![400, 450, 600].includes(spacingMM)) {
    warnings.push({ key: "spacingUnusual", actual: spacingMM });
  }
  if (memberType === "rafter" && snow === 0) {
    warnings.push({ key: "rafterNeedsSnow" });
  }

  // 계산 단계
  const calculationSteps: SpanStep[] = [
    {
      key: "loads",
      live,
      dead,
      snow,
      total: totalLoad,
    },
    {
      key: "lineLoad",
      total: totalLoad,
      spacing: spacingMM,
      result: wNperMM,
    },
    {
      key: "section",
      b: section.b,
      d: section.d,
      I: section.I,
      S: section.S,
    },
    {
      key: "fbAdjusted",
      base: baseFb,
      cr: isRepetitive ? REPETITIVE_MEMBER_FACTOR : 1,
      result: effectiveFb,
    },
    {
      key: "bendingSpan",
      fb: effectiveFb,
      S: section.S,
      w: wNperMM,
      result: bendingSpan,
    },
    {
      key: "deflectionSpan",
      E,
      I: section.I,
      w: wNperMM,
      k,
      result: deflectionSpan,
    },
    {
      key: "governing",
      bending: bendingSpan,
      deflection: deflectionSpan,
      result: maxSpan,
      check: governingCheck,
    },
  ];

  return {
    maxSpanMM: maxSpan,
    maxSpanByBendingMM: bendingSpan,
    maxSpanByDeflectionMM: deflectionSpan,
    governingCheck,
    totalLoadKnPerM2: totalLoad,
    loadPerLinearMeterKnPerM: wNperMM,
    sectionModulusMM3: section.S,
    momentOfInertiaMM4: section.I,
    effectiveFbMPa: effectiveFb,
    warnings,
    calculationSteps,
  };
}
