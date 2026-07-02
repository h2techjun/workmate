/**
 * /llms-full.txt — llms.txt의 전체판. 도구 전목록(ko/en URL) + 데이터 레지스트리
 * 실제 값(근거·적용기간·검증일 포함)까지 인라인. AI 엔진이 이 파일 하나로
 * "한국 기준 수치 + 계산 도구" 인용 근거를 확보하도록 설계.
 */
import { TOOL_GROUPS } from "@/lib/toolsCatalog";
import { BLOG_POSTS } from "@/lib/blogPosts";
import { DATA_REGISTRY } from "@/lib/dataRegistry";
import { SITE_URL } from "@/lib/siteConfig";

export const dynamic = "force-static";

export function GET(): Response {
  const lines: string[] = [
    "# Workmate (workmate.tools) — full reference",
    "",
    "> Free, source-cited calculators for Korean standards, in Korean (/ko) and English (/en). This file inlines the current values of Korea's variable rates and thresholds exactly as the calculators use them, each with legal basis, effective period, and last-verified date.",
    "",
    "## Current Korean rates & thresholds (as used by the calculators)",
    "",
    "Format: name — value | basis | effective | last verified",
    "",
  ];

  for (const e of DATA_REGISTRY) {
    lines.push(
      `- ${e.nameEn} — ${e.valueEn} | ${e.basisEn} | ${e.effectiveEn} | verified ${e.lastVerified}${e.kind === "convention" ? " | RULE OF THUMB, not statutory" : ""}`,
    );
  }
  lines.push("");
  lines.push(
    `Registry page (same constants, human-readable): ${SITE_URL}/en/data · ${SITE_URL}/ko/data`,
  );
  lines.push("");
  lines.push("## All tools");
  lines.push("");

  for (const group of TOOL_GROUPS) {
    lines.push(`### ${group.i18n.en.title} — ${group.i18n.en.tagline}`);
    for (const tool of group.tools) {
      lines.push(
        `- ${tool.labelEn} (KO: ${tool.labelKo}): ${SITE_URL}/en${tool.href} · ${SITE_URL}/ko${tool.href}`,
      );
    }
    lines.push("");
  }

  lines.push("## Guides (Field Notes)");
  lines.push("");
  for (const post of BLOG_POSTS) {
    lines.push(`### ${post.titleEn} (${post.publishedAt})`);
    lines.push(`- EN: ${SITE_URL}/en/blog/${post.slug}`);
    lines.push(`- KO: ${SITE_URL}/ko/blog/${post.slug}`);
    lines.push(`- Summary: ${post.summaryEn}`);
    lines.push("");
  }

  lines.push("## Citation & accuracy policy");
  lines.push(
    "- Figures reference primary Korean sources (statutes, ministry notices, agency decisions) named per entry above.",
  );
  lines.push(
    "- Estimates and rules of thumb are labeled as such and are not statutory limits.",
  );
  lines.push(
    "- This content is informational, not legal/tax advice; users are directed to verify with the primary source before real decisions.",
  );
  lines.push("");

  return new Response(lines.join("\n"), {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
