/**
 * 해외송금 비용 추정 기본값.
 *
 * ⚠️ "과장·확정 정보 금지" 원칙:
 *   실시간 환율이나 특정 업체의 실제 수수료를 인용하지 않는다(변동 → 허위 위험).
 *   대신 송금 비용의 "구조"(환율 마진 + 고정 수수료)를 가르치고, 방식별로 흔히
 *   관찰되는 대략적 범위의 대표값을 편집 가능한 기본값으로만 제공한다.
 *   최종 비용은 사용자가 자기 은행·업체의 실제 값으로 바꿔 계산한다.
 *
 * 근거(범위 성격): 공개된 송금 비용 비교 자료 일반론.
 *   은행 창구 송금은 통상 환율 스프레드가 넓고 고정 수수료(전신료 등)가 큼.
 *   전문 송금업체는 스프레드가 좁고 고정 수수료가 낮은 경향. 수치는 대표값일 뿐.
 */

export type RemittanceMethod = "bank" | "specialist";

export const REMITTANCE_METHODS: readonly RemittanceMethod[] = [
  "bank",
  "specialist",
];

export interface MethodDefault {
  /** 환율 마진(스프레드) 대표값 (%) */
  fxMarginPercent: number;
  /** 건당 고정 수수료 대표값 (원) */
  fixedFee: number;
}

/** 방식별 편집 가능한 기본값 (대표 범위값) */
export const METHOD_DEFAULTS: Record<RemittanceMethod, MethodDefault> = {
  // 은행 창구: 스프레드 약 1.5~3%, 전신료+수수료 약 1~3만원 (대표값)
  bank: { fxMarginPercent: 2.5, fixedFee: 25_000 },
  // 전문 송금업체: 스프레드 약 0.3~1.5%, 낮은 고정 수수료 (대표값)
  specialist: { fxMarginPercent: 0.7, fixedFee: 5_000 },
};
