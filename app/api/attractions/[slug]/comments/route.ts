/**
 * 명소 댓글 API — 프로젝트 최초의 동적 route handler.
 *   GET  ?cursor=&limit=  → 최신순 목록(soft-delete 제외)
 *   POST { nickname, content, locale, botcheck } → 작성
 *
 * 방어선(클라 검증은 우회 가능 → 서버가 최종): honeypot·Zod·sanitize·금칙어·
 * 링크수·IP 해시·rate limit·파라미터 바인딩. Node 런타임(crypto 사용).
 */

import { NextResponse, type NextRequest } from "next/server";
import { findAttraction } from "@/lib/attractionsCatalog";
import { sql, isDbConfigured } from "@/lib/db/neonClient";
import {
  commentInputSchema,
  sanitizeContent,
  containsBannedWord,
  hasTooManyLinks,
} from "@/lib/comments/validation";
import { getClientIp, hashIp, isRateLimited } from "@/lib/comments/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Ctx {
  params: Promise<{ slug: string }>;
}

const DEFAULT_LIMIT = 20;
const MAX_LIMIT = 50;

export async function GET(req: NextRequest, { params }: Ctx): Promise<Response> {
  const { slug } = await params;
  if (!findAttraction(slug)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ items: [], nextCursor: null });
  }

  const url = new URL(req.url);
  const cursor = Number(url.searchParams.get("cursor")) || null;
  const limit = Math.min(
    Math.max(Number(url.searchParams.get("limit")) || DEFAULT_LIMIT, 1),
    MAX_LIMIT,
  );

  const rows = cursor
    ? await sql`
        SELECT id, nickname, content, created_at
        FROM attraction_comments
        WHERE attraction_slug = ${slug} AND is_deleted = false AND id < ${cursor}
        ORDER BY created_at DESC LIMIT ${limit + 1}`
    : await sql`
        SELECT id, nickname, content, created_at
        FROM attraction_comments
        WHERE attraction_slug = ${slug} AND is_deleted = false
        ORDER BY created_at DESC LIMIT ${limit + 1}`;

  const hasMore = rows.length > limit;
  const items = rows.slice(0, limit).map((r) => ({
    id: Number(r.id),
    nickname: r.nickname as string,
    content: r.content as string,
    createdAt: new Date(r.created_at as string).toISOString(),
  }));
  const nextCursor = hasMore ? items[items.length - 1]?.id ?? null : null;

  return NextResponse.json({ items, nextCursor });
}

export async function POST(req: NextRequest, { params }: Ctx): Promise<Response> {
  const { slug } = await params;
  if (!findAttraction(slug)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "db_unconfigured" }, { status: 503 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "bad_json" }, { status: 400 });
  }

  const parsed = commentInputSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 });
  }
  const { nickname, content, locale, botcheck } = parsed.data;

  // honeypot: 봇에게 탐지 사실을 알리지 않도록 성공처럼 응답하되 저장 안 함
  if (botcheck && botcheck.length > 0) {
    return NextResponse.json({ ok: true, skipped: true }, { status: 201 });
  }

  const cleanNickname = sanitizeContent(nickname);
  const cleanContent = sanitizeContent(content);
  if (cleanNickname.length < 1 || cleanContent.length < 2) {
    return NextResponse.json({ error: "empty_after_sanitize" }, { status: 400 });
  }
  if (containsBannedWord(cleanContent) || hasTooManyLinks(cleanContent)) {
    return NextResponse.json({ error: "blocked_content" }, { status: 400 });
  }

  const ipHash = hashIp(getClientIp(req.headers));
  const recent = await sql`
    SELECT created_at FROM attraction_comments
    WHERE ip_hash = ${ipHash} AND created_at > now() - interval '10 minutes'`;
  const recentMs = recent.map((r) =>
    new Date(r.created_at as string).getTime(),
  );
  if (isRateLimited(recentMs, Date.now())) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const inserted = await sql`
    INSERT INTO attraction_comments (attraction_slug, nickname, content, locale, ip_hash)
    VALUES (${slug}, ${cleanNickname}, ${cleanContent}, ${locale}, ${ipHash})
    RETURNING id, nickname, content, created_at`;
  const row = inserted[0];
  if (!row) {
    return NextResponse.json({ error: "insert_failed" }, { status: 500 });
  }

  return NextResponse.json(
    {
      id: Number(row.id),
      nickname: row.nickname as string,
      content: row.content as string,
      createdAt: new Date(row.created_at as string).toISOString(),
    },
    { status: 201 },
  );
}
