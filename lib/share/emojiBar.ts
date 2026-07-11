/**
 * Wordle식 이모지 바 — 계산 결과를 한 줄 이모지 그래프로 표현해 공유 텍스트에 실는다.
 *
 * "다크 아케이드 퍼즐" 톤의 핵심 공유 장치: 카톡·커뮤니티에 결과를 붙여넣으면
 * 색 블록으로 비율이 한눈에 보여 자랑·재방문(트래픽 루프)을 유도한다.
 *
 * 순수 함수만 — UI·부수효과 없음 (SSR/클라이언트 양쪽 안전).
 */

/** 채움/빈칸 기본 이모지 */
export const FILL_EMOJI = "🟩";
export const EMPTY_EMOJI = "⬜";

/** 세그먼트 바용 색 이모지 팔레트 (색맹 배려: 색+위치로 구분되도록 순서 고정) */
export const BAR_EMOJI = {
  green: "🟩",
  blue: "🟦",
  purple: "🟪",
  yellow: "🟨",
  red: "🟥",
  orange: "🟧",
  white: "⬜",
} as const;

export type BarColor = keyof typeof BAR_EMOJI;

export interface EmojiSegment {
  /** 세그먼트 크기 (비율 산출용, 0 이상) */
  value: number;
  /** 이 세그먼트를 그릴 색 */
  color: BarColor;
}

/**
 * 0~1 비율을 length 칸 이모지 바로. (실수령률·달성률 등 단일 비율 도구용)
 * 예: ratioBar(0.78) → "🟩🟩🟩🟩🟩🟩🟩🟩⬜⬜"
 */
export function ratioBar(ratio: number, length = 10): string {
  const clamped = Math.max(0, Math.min(1, ratio));
  const filled = Math.round(clamped * length);
  return FILL_EMOJI.repeat(filled) + EMPTY_EMOJI.repeat(length - filled);
}

/**
 * 세그먼트들을 비율대로 length 칸 이모지 바로. (월급 구성·지출 분해 등 다구간 도구용)
 * 칸 합계가 정확히 length 가 되도록 최대잉여법으로 배분한다.
 * 예: segmentBar([{value: net, color:"green"}, {value: tax, color:"red"}]) → "🟩🟩🟩🟩🟩🟩🟩🟩🟥🟥"
 */
export function segmentBar(
  segments: ReadonlyArray<EmojiSegment>,
  length = 10,
): string {
  const total = segments.reduce((sum, s) => sum + Math.max(0, s.value), 0);
  if (total <= 0) return EMPTY_EMOJI.repeat(length);

  const raw = segments.map((s) => (Math.max(0, s.value) / total) * length);
  const cells = raw.map((r) => Math.floor(r));
  const used = cells.reduce((sum, c) => sum + c, 0);
  let remaining = length - used;

  // 남은 칸을 소수부가 큰 세그먼트부터 1칸씩 채워 합계 = length 보장
  const byFraction = raw
    .map((r, i) => ({ i, frac: r - Math.floor(r) }))
    .sort((a, b) => b.frac - a.frac);

  for (let k = 0; remaining > 0 && byFraction.length > 0; k += 1) {
    const target = byFraction[k % byFraction.length];
    if (target) {
      cells[target.i] = (cells[target.i] ?? 0) + 1;
      remaining -= 1;
    }
  }

  return segments
    .map((s, i) => BAR_EMOJI[s.color].repeat(cells[i] ?? 0))
    .join("");
}

export interface ShareTextParts {
  /** 첫 줄 — 아이콘 + 결과 요약 (예: "💰 월 실수령 352만원") */
  headline: string;
  /** 이모지 바 (segmentBar/ratioBar 결과) */
  bar: string;
  /** 선택 부가 줄 (예: "실수령률 78%") */
  detail?: string;
}

/**
 * 공유 텍스트 조립 — URL 은 ShareButton 이 자동 첨부하므로 본문만 만든다.
 * 결과:
 *   💰 월 실수령 352만원
 *   🟩🟩🟩🟩🟩🟩🟩🟩🟥🟥
 *   실수령률 78%
 */
export function buildShareText({ headline, bar, detail }: ShareTextParts): string {
  return [headline, bar, detail].filter(Boolean).join("\n");
}
