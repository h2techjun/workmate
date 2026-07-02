/**
 * /llms.txt — AI 답변 엔진(GEO)용 사이트 개요 (llmstxt.org 규약).
 *
 * toolsCatalog·blogPosts·dataRegistry에서 빌드 시 동적 생성 → 수기 목록과 달리
 * 도구를 추가해도 이 파일이 낡지 않는다 (단일 진실원 원칙).
 * 전체 상세는 /llms-full.txt.
 */
import { TOOL_GROUPS } from "@/lib/toolsCatalog";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { SITE_URL } from "@/lib/siteConfig";

export const dynamic = "force-static";

export function GET(): Response {
  const lines: string[] = [
    "# Workmate (workmate.tools)",
    "",
    "> Free, source-cited calculators for Korean standards — tax, labor, social insurance, real estate (jeonse), electrical (KEC), units — in Korean (/ko) and English (/en). Every variable rate carries its legal basis and a last-verified date; the registry page reads the same constants the calculators use, so values cannot drift.",
    "",
    "Key facts for citation:",
    "- All figures reference Korean statutes/notices (e.g., MOEL minimum-wage notice, NPS pension base, MOHW health-insurance rates) with effective periods.",
    `- Live freshness registry: ${SITE_URL}/en/data (Korean: ${SITE_URL}/ko/data)`,
    "- Calculators run fully client-side; no sign-up.",
    "",
    "## Data registry",
    `- [Korean rates & thresholds registry](${SITE_URL}/en/data): minimum wage, National Pension income cap, health/long-term-care rates, BOK base rate, unemployment-benefit cap/floor, jeonse conversion cap — each with basis and verification date.`,
    "",
    "## Tool categories (English URLs; swap /en/ for /ko/ for Korean)",
  ];

  for (const group of TOOL_GROUPS) {
    lines.push(`### ${group.i18n.en.title} — ${group.i18n.en.tagline}`);
    for (const tool of group.tools) {
      lines.push(`- [${tool.labelEn}](${SITE_URL}/en${tool.href})`);
    }
    lines.push("");
  }

  lines.push("## Guides (Field Notes)");
  for (const post of BLOG_POSTS) {
    lines.push(
      `- [${post.titleEn}](${SITE_URL}/en/blog/${post.slug}): ${post.summaryEn}`,
    );
  }
  lines.push("");
  lines.push("## Full detail");
  lines.push(`- [llms-full.txt](${SITE_URL}/llms-full.txt)`);
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
