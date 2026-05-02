/**
 * 부가가치세(VAT) 계산 — 부가가치세법.
 *
 * 모드:
 *   - "extract":  공급대가(부가세 포함) → 공급가액 + 부가세 분리
 *   - "add":      공급가액(부가세 별도) → 부가세 + 공급대가 합산
 *   - "general":  일반과세자 매출/매입 차감 신고세액
 *   - "simple":   간이과세자 — 업종별 부가가치율 적용 (개정 2021)
 *
 * 출처:
 *   - 부가가치세법 제30조 (세율 10%)
 *   - 부가가치세법 제63조 (간이과세 부가가치율)
 *   - 부가가치세법 시행령 제111조 (업종별 부가가치율)
 */

import { VAT_RATE } from "@/lib/constants/labor/laborStandard";

export type VatMode = "extract" | "add" | "general" | "simple";

/**
 * 간이과세자 업종별 부가가치율 (2021-07-01 이후).
 * 부가가치세법 시행령 제111조 제2항.
 */
export const SIMPLE_INDUSTRY_RATE = {
  retail: 0.15, // 소매업, 음식점업
  manufacturing: 0.2, // 제조업, 농임어업, 소화물 운송업
  lodging: 0.25, // 숙박업
  construction: 0.3, // 건설업, 운수창고업, 정보통신업
  finance: 0.4, // 금융보험업, 부동산임대업, 기타 서비스업
} as const;

export type SimpleIndustry = keyof typeof SIMPLE_INDUSTRY_RATE;

export interface VatInput {
  mode: VatMode;
  /** 금액 (원). extract=공급대가, add=공급가액, general/simple=매출액 (공급대가) */
  amount: number;
  /** general 모드 — 매입 공급가액 (매입세액 공제용). 옵션. */
  purchaseAmount?: number;
  /** simple 모드 — 업종 */
  industry?: SimpleIndustry;
}

export interface VatLine {
  key: "supply" | "vat" | "total" | "purchase-vat" | "payable" | "added-value";
  /** 화면 측 i18n 키 (선택) — 비어있으면 라벨 직접 표기. */
  labelKey?: string;
  amount: number;
}

export interface VatResult {
  ok: boolean;
  errors: ReadonlyArray<{ field: keyof VatInput; messageKey: string }>;
  mode: VatMode;
  lines: ReadonlyArray<VatLine>;
  /** 단계 설명 (i18n 키 + values). */
  steps: ReadonlyArray<{
    key: string;
    values?: Record<string, string | number>;
  }>;
}

/**
 * 1원 단위 절사 (홈택스 신고 양식 기준).
 */
function floor1(n: number): number {
  return Math.floor(n);
}

export function calculateVat(input: VatInput): VatResult {
  const errors: VatResult["errors"][number][] = [];
  if (!input.amount || input.amount <= 0) {
    errors.push({ field: "amount", messageKey: "validation.amountPositive" });
  }
  if (input.mode === "general" && input.purchaseAmount !== undefined && input.purchaseAmount < 0) {
    errors.push({ field: "purchaseAmount", messageKey: "validation.purchaseNegative" });
  }
  if (input.mode === "simple" && !input.industry) {
    errors.push({ field: "industry", messageKey: "validation.industryRequired" });
  }
  if (errors.length > 0) {
    return { ok: false, errors, mode: input.mode, lines: [], steps: [] };
  }

  const amt = input.amount;

  if (input.mode === "extract") {
    // 부가세 포함 가격에서 공급가액·부가세 분리.
    // 공급가액 = 공급대가 × 10 / 11 (정수 안정 + 부동소수 오차 회피)
    const supply = Math.round((amt * 10) / 11);
    const vat = amt - supply;
    return {
      ok: true,
      errors: [],
      mode: input.mode,
      lines: [
        { key: "supply", amount: supply },
        { key: "vat", amount: vat },
        { key: "total", amount: amt },
      ],
      steps: [
        {
          key: "steps.extract",
          values: { total: amt, supply, vat, rate: VAT_RATE * 100 },
        },
      ],
    };
  }

  if (input.mode === "add") {
    const vat = floor1(amt * VAT_RATE);
    const total = amt + vat;
    return {
      ok: true,
      errors: [],
      mode: input.mode,
      lines: [
        { key: "supply", amount: amt },
        { key: "vat", amount: vat },
        { key: "total", amount: total },
      ],
      steps: [
        {
          key: "steps.add",
          values: { supply: amt, vat, total, rate: VAT_RATE * 100 },
        },
      ],
    };
  }

  if (input.mode === "general") {
    // 일반과세자 — 매출세액 - 매입세액 = 납부세액
    // 매출 공급대가 입력 가정 → 공급가액·매출세액 분리
    const salesSupply = Math.round((amt * 10) / 11);
    const salesVat = amt - salesSupply;
    const purchase = input.purchaseAmount ?? 0;
    const purchaseVat = floor1(purchase * VAT_RATE);
    const payable = salesVat - purchaseVat;
    return {
      ok: true,
      errors: [],
      mode: input.mode,
      lines: [
        { key: "supply", amount: salesSupply },
        { key: "vat", amount: salesVat },
        { key: "purchase-vat", amount: purchaseVat },
        { key: "payable", amount: payable },
      ],
      steps: [
        {
          key: "steps.general.sales",
          values: { total: amt, supply: salesSupply, vat: salesVat },
        },
        {
          key: "steps.general.purchase",
          values: { purchase, purchaseVat },
        },
        {
          key: "steps.general.payable",
          values: { salesVat, purchaseVat, payable },
        },
      ],
    };
  }

  // simple — 간이과세자
  const industry = input.industry as SimpleIndustry;
  const rate = SIMPLE_INDUSTRY_RATE[industry];
  // 납부세액 = 공급대가 × 부가가치율 × 10%
  const addedValue = floor1(amt * rate);
  const payable = floor1(addedValue * VAT_RATE);
  return {
    ok: true,
    errors: [],
    mode: input.mode,
    lines: [
      { key: "supply", amount: amt },
      { key: "added-value", amount: addedValue },
      { key: "payable", amount: payable },
    ],
    steps: [
      {
        key: "steps.simple",
        values: {
          total: amt,
          industry,
          rate: rate * 100,
          addedValue,
          payable,
          vatRate: VAT_RATE * 100,
        },
      },
    ],
  };
}
