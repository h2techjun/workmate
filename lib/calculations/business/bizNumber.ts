/**
 * 사업자등록번호 형식·체크섬 검증
 *
 * 한국 사업자등록번호는 10자리 — XXX-XX-XXXXX (3-2-5).
 * 마지막 자리가 체크섬이며 다음 알고리즘으로 검증한다.
 *
 * 알고리즘 (국세청 표준):
 *   가중치 [1, 3, 7, 1, 3, 7, 1, 3, 5]를 앞 9자리에 곱한다.
 *   9번째 자리(× 5)는 추가로 floor(d × 5 / 10)을 더 누적한다.
 *   합계를 10으로 나눈 나머지를 10에서 뺀 값(% 10)이 마지막 자리와 같으면 유효.
 *
 * 형식이 맞으면서 체크섬이 통과하면 1차 유효 — 실제 등록·휴폐업 상태는
 * 국세청 홈택스 API로 별도 확인해야 한다.
 *
 * 추가로 가운데 2자리(personal type code)에서 사업자 종류를 추정.
 *
 * 출처:
 * - 국세청 사업자등록번호 검증 알고리즘 공식 문서
 * - https://www.nts.go.kr (홈택스)
 */

import { z } from "zod";

export const bizNumberInputSchema = z.object({
  /** 사업자등록번호 — 하이픈/공백 허용, 내부에서 정규화 */
  number: z.string().min(1, "validation.empty").max(30, "validation.tooLong"),
});

export type BizNumberInput = z.input<typeof bizNumberInputSchema>;
export type BizNumberInputResolved = z.output<typeof bizNumberInputSchema>;

export type BizPersonType =
  | "individualGeneral" // 일반과세자 (01~79)
  | "individualNonProfit" // 비영리법인의 본점 (80)
  | "individualNontaxable" // 비사업자 (89)
  | "individualPersonal" // 개인 — 부가가치세 면세 (90~99)
  | "corporationCommercial" // 법인 — 영리법인의 본점 (81, 86, 87, 88)
  | "corporationBranch" // 법인 — 영리법인의 지점 (85)
  | "corporationNonProfit" // 법인 — 비영리법인의 본점·지점 (82)
  | "corporationStateOwned" // 법인 — 국가·지방자치단체 (83)
  | "corporationCustom" // 법인 — 외국법인 본·지점·연락사무소 (84)
  | "unknown";

export type BizNumberStep =
  | { key: "normalize"; raw: string; result: string }
  | { key: "format"; result: string }
  | {
      key: "weightedSum";
      digits: number[];
      weights: number[];
      sum: number;
    }
  | {
      key: "extraAdd";
      ninth: number;
      extra: number;
      newSum: number;
    }
  | {
      key: "checksum";
      sum: number;
      computed: number;
      actual: number;
      match: boolean;
    }
  | { key: "personType"; middle: string; result: BizPersonType };

export type BizNumberWarning =
  | { key: "formatInvalid" }
  | { key: "checksumFailed"; expected: number; actual: number }
  | { key: "needsExternalApi" };

export interface BizNumberResult {
  normalized: string;
  formatted: string; // "XXX-XX-XXXXX"
  formatValid: boolean;
  checksumValid: boolean;
  isValid: boolean;
  personType: BizPersonType;
  middleCode: string;
  warnings: BizNumberWarning[];
  calculationSteps: BizNumberStep[];
}

/** 입력에서 숫자만 추출 */
function normalize(raw: string): string {
  return raw.replace(/\D/g, "");
}

/** XXX-XX-XXXXX 형식으로 포맷 */
function format(num10: string): string {
  if (num10.length !== 10) return num10;
  return `${num10.slice(0, 3)}-${num10.slice(3, 5)}-${num10.slice(5)}`;
}

/** 가운데 2자리로 사업자 종류 분류 */
function classifyPersonType(middle: string): BizPersonType {
  const code = parseInt(middle, 10);
  if (Number.isNaN(code)) return "unknown";
  if (code >= 1 && code <= 79) return "individualGeneral";
  if (code === 80) return "individualNonProfit";
  if (code >= 90 && code <= 99) return "individualPersonal";
  if (code === 89) return "individualNontaxable";
  if (code === 81 || code === 86 || code === 87 || code === 88)
    return "corporationCommercial";
  if (code === 85) return "corporationBranch";
  if (code === 82) return "corporationNonProfit";
  if (code === 83) return "corporationStateOwned";
  if (code === 84) return "corporationCustom";
  return "unknown";
}

const WEIGHTS = [1, 3, 7, 1, 3, 7, 1, 3, 5] as const;

export function validateBizNumber(rawInput: BizNumberInput): BizNumberResult {
  const input = bizNumberInputSchema.parse(rawInput);
  const normalized = normalize(input.number);

  const formatValid = /^\d{10}$/.test(normalized);
  const formatted = format(normalized);

  const steps: BizNumberStep[] = [];
  steps.push({ key: "normalize", raw: input.number, result: normalized });
  steps.push({ key: "format", result: formatted });

  const warnings: BizNumberWarning[] = [];

  if (!formatValid) {
    warnings.push({ key: "formatInvalid" });
    return {
      normalized,
      formatted,
      formatValid: false,
      checksumValid: false,
      isValid: false,
      personType: "unknown",
      middleCode: normalized.slice(3, 5),
      warnings,
      calculationSteps: steps,
    };
  }

  const digits = normalized.split("").map((d) => parseInt(d, 10));
  const ninth = digits[8] ?? 0;
  const checksumDigit = digits[9] ?? 0;

  // 가중치 합산
  let sum = 0;
  for (let i = 0; i < 9; i += 1) {
    sum += (digits[i] ?? 0) * (WEIGHTS[i] ?? 0);
  }
  steps.push({
    key: "weightedSum",
    digits: digits.slice(0, 9),
    weights: [...WEIGHTS],
    sum,
  });

  // 9번째 자리 × 5 의 두 자리 처리
  const extra = Math.floor((ninth * 5) / 10);
  const newSum = sum + extra;
  steps.push({
    key: "extraAdd",
    ninth,
    extra,
    newSum,
  });

  // 체크섬: (10 - sum % 10) % 10
  const computed = (10 - (newSum % 10)) % 10;
  const checksumValid = computed === checksumDigit;
  steps.push({
    key: "checksum",
    sum: newSum,
    computed,
    actual: checksumDigit,
    match: checksumValid,
  });

  if (!checksumValid) {
    warnings.push({
      key: "checksumFailed",
      expected: computed,
      actual: checksumDigit,
    });
  }

  // 사업자 종류
  const middleCode = normalized.slice(3, 5);
  const personType = classifyPersonType(middleCode);
  steps.push({ key: "personType", middle: middleCode, result: personType });

  // 체크섬 통과해도 휴폐업 상태는 API로만 확인 가능
  if (checksumValid) {
    warnings.push({ key: "needsExternalApi" });
  }

  return {
    normalized,
    formatted,
    formatValid,
    checksumValid,
    isValid: formatValid && checksumValid,
    personType,
    middleCode,
    warnings,
    calculationSteps: steps,
  };
}
