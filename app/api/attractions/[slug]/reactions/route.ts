/**
 * 명소 이모지 반응 API.
 *   GET  → { heart, thumbsup, wow } 카운트
 *   POST { emoji } → IP당 이모지당 토글(있으면 취소). 최신 카운트 반환.
 *
 * UNIQUE(slug, emoji, ip_hash) 제약이 "IP당 1회"를 스키마 레벨에서 강제한다.
 */

import { NextResponse, type NextRequest } from "next/server";
import { findAttraction } from "@/lib/attractionsCatalog";
import { sql, isDbConfigured } from "@/lib/db/neonClient";
import { getClientIp, hashIp } from "@/lib/comments/rateLimit";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

interface Ctx {
  params: Promise<{ slug: string }>;
}

const EMOJIS = ["heart", "thumbsup", "wow"] as const;
type Emoji = (typeof EMOJIS)[number];

type Counts = Record<Emoji, number>;
const emptyCounts = (): Counts => ({ heart: 0, thumbsup: 0, wow: 0 });

async function readCounts(slug: string): Promise<Counts> {
  const rows = await sql`
    SELECT emoji, COUNT(*)::int AS n
    FROM attraction_reactions
    WHERE attraction_slug = ${slug}
    GROUP BY emoji`;
  const counts = emptyCounts();
  for (const r of rows) {
    const e = r.emoji as Emoji;
    if (e in counts) counts[e] = Number(r.n);
  }
  return counts;
}

export async function GET(_req: NextRequest, { params }: Ctx): Promise<Response> {
  const { slug } = await params;
  if (!findAttraction(slug)) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }
  if (!isDbConfigured()) {
    return NextResponse.json({ counts: emptyCounts() });
  }
  return NextResponse.json({ counts: await readCounts(slug) });
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
  const emoji = (body as { emoji?: string })?.emoji;
  if (!emoji || !EMOJIS.includes(emoji as Emoji)) {
    return NextResponse.json({ error: "invalid_emoji" }, { status: 400 });
  }

  const ipHash = hashIp(getClientIp(req.headers));

  // 토글: INSERT 시도 → UNIQUE 위반이면 DELETE(취소)
  const inserted = await sql`
    INSERT INTO attraction_reactions (attraction_slug, emoji, ip_hash)
    VALUES (${slug}, ${emoji}, ${ipHash})
    ON CONFLICT (attraction_slug, emoji, ip_hash) DO NOTHING
    RETURNING id`;
  const toggledOn = inserted.length > 0;
  if (!toggledOn) {
    await sql`
      DELETE FROM attraction_reactions
      WHERE attraction_slug = ${slug} AND emoji = ${emoji} AND ip_hash = ${ipHash}`;
  }

  return NextResponse.json({ counts: await readCounts(slug), active: toggledOn });
}
