/**
 * 퍼센트 계산기 — Percent Calculator
 *
 * 5가지 모드 지원:
 *   1) ofValue       : X 의 Y% = ?         (예: 50,000의 15% = 7,500)
 *   2) increase      : X 에 Y% 인상 = ?     (예: 50,000 → 57,500)
 *   3) decrease      : X 에서 Y% 할인 = ?   (예: 50,000 → 42,500)
 *   4) changePercent : X → Y 변화율 = ?     (예: 100 → 130 = +30%)
 *   5) reverse       : Y% 인상된 결과가 Z 라면 원본 = ? (예: 110이 10% 인상이라면 원본 100)
 *
 * 모든 결과는 순수 산술. 통화 단위 가정 없음.
 */

export type PercentMode =
  | "ofValue"
  | "increase"
  | "decrease"
  | "changePercent"
  | "reverse";

export interface PercentResult {
  /** 최종 계산 값 */
  value: number;
  /** 변화량 (절대값) */
  delta: number;
  /** 변화율 (%) — changePercent 모드에서 의미 있음, 외 모드는 입력 percent 그대로 */
  percent: number;
}

/**
 * X 의 Y% 계산.
 */
export function ofValue(x: number, percent: number): PercentResult {
  const value = (x * percent) / 100;
  return { value, delta: value, percent };
}

/**
 * X 에 Y% 인상.
 */
export function increase(x: number, percent: number): PercentResult {
  const delta = (x * percent) / 100;
  return { value: x + delta, delta, percent };
}

/**
 * X 에서 Y% 할인.
 */
export function decrease(x: number, percent: number): PercentResult {
  const delta = (x * percent) / 100;
  return { value: x - delta, delta: -delta, percent };
}

/**
 * X → Y 변화율 (Y/X 가 아닌 (Y-X)/X × 100).
 *   X = 0 인 경우 0 반환 (정의 불가, 무한대 대신 안전 fallback).
 */
export function changePercent(from: number, to: number): PercentResult {
  if (from === 0) return { value: 0, delta: to - from, percent: 0 };
  const delta = to - from;
  const percent = (delta / from) * 100;
  return { value: percent, delta, percent };
}

/**
 * 인상 후 값이 Z 라면 원본은? (Z / (1 + p/100))
 *   예: 110이 10% 인상이라면 원본 = 110/1.1 = 100
 */
export function reverseFromIncrease(after: number, percent: number): PercentResult {
  const factor = 1 + percent / 100;
  if (factor === 0) return { value: 0, delta: 0, percent };
  const original = after / factor;
  return { value: original, delta: after - original, percent };
}
