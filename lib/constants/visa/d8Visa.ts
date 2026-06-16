/**
 * D-8 창업·투자 비자 상수 — 단일 진실원.
 *
 * 고정·공식 근거가 있는 값만 상수로 둔다. OASIS 점수(60~120 출처별 불일치)·
 * 배점표(법무부 비공개)·최소 자본금(법령 미명시)은 상수로 두지 않고
 * 가이드에서 정보로만 안내한다.
 *
 * 출처: 외국인투자촉진법 시행령 §2②(최소 투자 1억·지분 10%), HiKorea 기술창업이민
 *       안내(학력·IP·신규법인·OASIS 필수항목), OASIS 공식(oasisvisa.com).
 */

/** D-8-1/D-8-3 최소 외국인 투자금 (원) — 외국인투자촉진법 시행령 §2② */
export const D8_MIN_INVESTMENT_KRW = 100_000_000;

/** D-8-1/D-8-3 최소 의결권 지분율 */
export const D8_MIN_SHARE_RATIO = 0.1;

/** OASIS 공식 최소 통과 점수 (HiKorea·oasisvisa.com 기준, 실무 합격선은 더 높을 수 있음) */
export const OASIS_OFFICIAL_PASS_MIN = 60;

/** OASIS 총점 */
export const OASIS_TOTAL = 300;
