/**
 * 익명 댓글 rate limit + IP 해시 — 서버 전용(API route 에서만 import).
 *
 * 서버리스라 in-memory 카운터를 못 쓰므로, 최근 댓글 타임스탬프(DB 조회)로 판정한다.
 * 원본 IP 는 저장하지 않고 SHA-256 해시만 기록(프라이버시).
 */

import { createHash } from "node:crypto";

const IP_SALT = process.env.IP_HASH_SALT ?? "workmate-attractions-v1";

/** 프록시 헤더에서 클라이언트 IP 추출 (Vercel: x-forwarded-for) */
export function getClientIp(headers: Headers): string {
  const xff = headers.get("x-forwarded-for");
  if (xff) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return headers.get("x-real-ip")?.trim() ?? "0.0.0.0";
}

/** IP → 되돌릴 수 없는 해시 (원본 미저장) */
export function hashIp(ip: string): string {
  return createHash("sha256").update(`${IP_SALT}:${ip}`).digest("hex");
}

export const RATE_RULES = {
  /** 연속 작성 최소 간격 */
  minGapMs: 60_000,
  /** 슬라이딩 윈도우 길이 */
  windowMs: 600_000,
  /** 윈도우 내 최대 작성 수 */
  windowMax: 5,
} as const;

/**
 * 같은 IP 의 최근 댓글 타임스탬프(ms) 배열을 받아 rate limit 여부 판정.
 * 60초 내 재작성 또는 10분 내 5개 초과 → true(차단).
 */
export function isRateLimited(
  recentMs: readonly number[],
  nowMs: number,
): boolean {
  if (recentMs.length === 0) return false;
  const newest = Math.max(...recentMs);
  if (nowMs - newest < RATE_RULES.minGapMs) return true;
  const inWindow = recentMs.filter(
    (t) => nowMs - t < RATE_RULES.windowMs,
  ).length;
  return inWindow >= RATE_RULES.windowMax;
}
