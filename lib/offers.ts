/**
 * 맥락 제휴 오퍼 — 단일 진실원 (결과 하단 CTA). 휴면 기본.
 *
 * `OFFERS` 가 비어 있으면 `OfferSlot` 이 아무것도 렌더하지 않는다(= 사이트에 아무 변화 없음).
 * AdSense 심사에 무해하다.
 *
 * 활성화 절차 (파트너 링크 확보 후 — 상세: docs/monetization-strategy.md):
 *   1) AdSense 승인 완료 확인 (심사 중 활성화 금지).
 *   2) 아래 OFFERS 에 도구별 오퍼를 추가 (href = 추적 URL).
 *   3) 해당 도구 폼의 <ResultShell ...> 에 toolKey="<도구키>" 를 전달.
 *   → 결과 하단에 "제휴 링크" 공시와 함께 자동 노출 (rel="sponsored").
 *
 * ⚠️ 표시광고법 + AdSense 정책: 모든 오퍼는 제휴/광고임을 명시하고, 내비·다운로드로
 *    오인되지 않게 배치한다. 저품질 페이지 양산 금지(각 페이지 ToolGuide 고유 본문 유지).
 */

export interface Offer {
  /** 오퍼 라벨 (버튼 텍스트) */
  labelKo: string;
  labelEn: string;
  /** 한 줄 설명 (맥락) */
  descKo: string;
  descEn: string;
  /** 제휴 추적 URL. 비어 있으면 미노출 */
  href: string;
}

/**
 * toolKey → Offer. 현재 비어 있음(휴면).
 * 예시(활성화 시 참고):
 *   "loan-calc": {
 *     labelKo: "내 조건 대출 금리 비교", labelEn: "Compare loan rates",
 *     descKo: "여러 은행 금리를 한 번에 비교하고 한도를 확인하세요.",
 *     descEn: "Compare rates across lenders and check your limit.",
 *     href: "https://partner.example.com/track?...",
 *   },
 */
export const OFFERS: Record<string, Offer> = {
  // 파트너 링크 확보 후 채운다. (docs/monetization-strategy.md)
};

/** 해당 도구에 노출할 오퍼 조회. 링크 없으면 null(휴면). */
export function getOffer(toolKey: string | undefined): Offer | null {
  if (!toolKey) return null;
  const offer = OFFERS[toolKey];
  if (!offer || !offer.href) return null;
  return offer;
}
