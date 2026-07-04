/**
 * /rss.xml — 블로그(Field Notes) RSS 2.0 피드.
 *
 * BLOG_POSTS(단일 진실원)에서 빌드 시 생성 — 새 글을 배열에 추가하면
 * 피드도 자동 갱신된다. 항목 링크는 사이트 기본 언어(/ko) 기준이며,
 * 영어 독자는 글 상단 언어 전환으로 /en 버전에 도달한다.
 */
import { BLOG_POSTS } from "@/lib/blogPosts";
import { SITE_URL, SITE_BRAND } from "@/lib/siteConfig";

export const dynamic = "force-static";

function escapeXml(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

export function GET(): Response {
  const sorted = [...BLOG_POSTS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
  const newest = sorted[0]?.publishedAt ?? "2026-01-01";

  const items = sorted
    .map((post) => {
      const url = `${SITE_URL}/ko/blog/${post.slug}`;
      const pubDate = new Date(`${post.publishedAt}T00:00:00+09:00`).toUTCString();
      return [
        "    <item>",
        `      <title>${escapeXml(post.titleKo)}</title>`,
        `      <link>${url}</link>`,
        `      <guid isPermaLink="true">${url}</guid>`,
        `      <pubDate>${pubDate}</pubDate>`,
        `      <description>${escapeXml(post.summaryKo)}</description>`,
        `      <category>${escapeXml(post.category)}</category>`,
        "    </item>",
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_BRAND)} Field Notes</title>
    <link>${SITE_URL}/ko/blog</link>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />
    <description>${escapeXml(
      "한국 실무 기준 계산기·가이드 — 세금, 노무, 부동산, 외국인 생활. 모든 수치는 법령·고시 출처를 명시합니다.",
    )}</description>
    <language>ko</language>
    <lastBuildDate>${new Date(`${newest}T00:00:00+09:00`).toUTCString()}</lastBuildDate>
${items}
  </channel>
</rss>
`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
