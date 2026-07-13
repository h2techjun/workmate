/**
 * 댓글 입력 검증·정제 — 클라이언트(react-hook-form resolver)와 서버(API route)가
 * 동일 스키마를 재사용한다. 클라이언트 검증은 우회 가능하므로 서버가 최종 방어선.
 */

import { z } from "zod";

export const COMMENT_LIMITS = {
  nicknameMin: 1,
  nicknameMax: 20,
  contentMin: 2,
  contentMax: 300,
} as const;

export const commentInputSchema = z.object({
  nickname: z
    .string()
    .trim()
    .min(COMMENT_LIMITS.nicknameMin)
    .max(COMMENT_LIMITS.nicknameMax),
  content: z
    .string()
    .trim()
    .min(COMMENT_LIMITS.contentMin)
    .max(COMMENT_LIMITS.contentMax),
  locale: z.enum(["ko", "en", "zh", "vi"]),
  /** honeypot — 봇만 채운다. 있으면 서버가 조용히 무시 */
  botcheck: z.string().optional(),
});

export type CommentInput = z.infer<typeof commentInputSchema>;

// C0 제어문자 매칭 (탭 U+0009, 개행 U+000A, 캐리지리턴 U+000D 은 보존).
// 소스에 리터럴 제어문자를 넣지 않도록 RegExp 생성자 + 이스케이프 문자열로 구성.
const CONTROL_CHARS = new RegExp(
  "[\\u0000-\\u0008\\u000B\\u000C\\u000E-\\u001F]",
  "g",
);

/**
 * 제어문자 제거 + 개행 정리. React 가 텍스트 노드로만 렌더하므로 HTML escape 는
 * 불필요하지만, 보이지 않는 제어문자·과도한 개행은 정리한다.
 */
export function sanitizeContent(raw: string): string {
  return raw
    .replace(CONTROL_CHARS, "")
    .replace(/\r\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

/**
 * 최소 스팸/금칙어 필터. 운영하며 확장. 대소문자 무시 부분일치.
 * (정교한 모더레이션은 Phase 2 — 여기선 명백한 스팸 시드만)
 */
const BANNED_WORDS: readonly string[] = [
  "viagra",
  "cialis",
  "casino",
  "카지노",
  "포르노",
  "onlyfans",
  "bit.ly/",
  "://t.me/",
];

export function containsBannedWord(text: string): boolean {
  const lower = text.toLowerCase();
  return BANNED_WORDS.some((w) => lower.includes(w));
}

/** URL 3개 이상 = 스팸 의심 */
export function hasTooManyLinks(text: string): boolean {
  const matches = text.match(/https?:\/\//gi);
  return matches !== null && matches.length >= 3;
}
