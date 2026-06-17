#!/usr/bin/env node
/**
 * 🔍 Workmate 시스템 통합 audit
 *
 * 사용:
 *   node scripts/audit.mjs            # human readable
 *   node scripts/audit.mjs --json     # JSON
 *
 * 체크 항목:
 *   A. 메타 (CLAUDE.md / README)
 *   B. Next.js 설정
 *   C. 환경변수 (.env.local)
 *   D. 시크릿 누출 (NEXT_PUBLIC_ 외 키가 클라이언트에)
 *   E. TS strict
 *   F. 메이커 허브 카탈로그 (projectsCatalog.ts) 존재 + hub 항목 5개
 *   G. i18n ko/en 키 개수 일치
 */
import { readFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");

const args = process.argv.slice(2);
const JSON_OUT = args.includes("--json");

class Report {
  constructor() { this.checks = []; }
  add(category, name, ok, detail = "", severity = "error") {
    this.checks.push({ category, name, ok, detail, severity });
  }
  get total() { return this.checks.length; }
  get passed() { return this.checks.filter(c => c.ok).length; }
}
const report = new Report();

// A. 메타
report.add("A.메타", "CLAUDE.md", existsSync(join(ROOT, "CLAUDE.md")));
report.add("A.메타", "README.md", existsSync(join(ROOT, "README.md")), "", "warn");

// B. Next.js
const nextCfg = ["next.config.ts", "next.config.mjs", "next.config.js"].find(f => existsSync(join(ROOT, f)));
report.add("B.빌드", "next.config.*", !!nextCfg, nextCfg || "");

// C. 환경변수
let envLocal = "";
if (existsSync(join(ROOT, ".env.local"))) envLocal = readFileSync(join(ROOT, ".env.local"), "utf-8");
report.add("C.환경변수", ".env.local 존재", !!envLocal, "", "warn");

// D. 시크릿 누출
const leakHits = [];
function walk(dir) {
  if (!existsSync(dir)) return;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    let st; try { st = statSync(full); } catch { continue; }
    if (st.isDirectory()) {
      if (entry === "node_modules" || entry.startsWith(".")) continue;
      walk(full);
    } else if (/\.(ts|tsx|js|jsx|mjs)$/.test(entry)) {
      let src; try { src = readFileSync(full, "utf-8"); } catch { continue; }
      if (src.includes("'use server'") || full.includes("/api/") || full.includes("\\api\\")) continue;
      if (/middleware\.(ts|js)$/.test(full)) continue;
      if (/route\.(ts|js)$/.test(full)) continue;  // Next.js Route Handler = 서버
      // 'use client' 없으면 RSC = 서버 (Next.js App Router 기본)
      const isClientComponent = /^\s*['"]use client['"]/m.test(src);
      if (!isClientComponent) continue;
      for (const m of src.matchAll(/process\.env\.(\w+)/g)) {
        const key = m[1];
        if (!key.startsWith("NEXT_PUBLIC_") && key !== "NODE_ENV") {
          leakHits.push(`${full.replace(ROOT, "").replace(/\\/g, "/")}: ${key}`);
        }
      }
    }
  }
}
for (const sub of ["app", "components", "lib"]) walk(join(ROOT, sub));
report.add("D.보안", "클라이언트 코드에 비공개 env 누출 없음",
  leakHits.length === 0,
  leakHits.length ? `${leakHits.length}건: ${leakHits.slice(0, 3).join(" | ")}` : "안전"
);

// E. TS strict
const tsCfg = join(ROOT, "tsconfig.json");
if (existsSync(tsCfg)) {
  try {
    const cfg = JSON.parse(readFileSync(tsCfg, "utf-8").replace(/\/\/.*$/gm, "").replace(/\/\*[\s\S]*?\*\//g, ""));
    const strict = cfg.compilerOptions?.strict !== false;
    report.add("E.TS", "tsconfig strict", strict);
  } catch (e) {
    report.add("E.TS", "tsconfig parse", false, e.message, "warn");
  }
}

// F. 메이커 허브 카탈로그 (Hakrew 2026-05-04 제외 — SaaS 책임 분리)
const catalog = join(ROOT, "lib", "projectsCatalog.ts");
if (existsSync(catalog)) {
  const src = readFileSync(catalog, "utf-8");
  const idMatches = [...src.matchAll(/id:\s*["'](\w[\w-]*)["']/g)].map(m => m[1]);
  report.add("F.카탈로그", "projectsCatalog.ts 존재 + 항목 ≥4",
    idMatches.length >= 4,
    `${idMatches.length}개: ${idMatches.join(", ")}`
  );
  const expectedHubProjects = ["6hours", "office-hunter", "k-poker", "defense"];
  const missing = expectedHubProjects.filter(p => !idMatches.includes(p));
  report.add("F.카탈로그", "hub 4개 (6hours/office-hunter/k-poker/defense) 포함",
    missing.length === 0,
    missing.length ? `missing: ${missing.join(", ")}` : "all present"
  );
} else {
  report.add("F.카탈로그", "lib/projectsCatalog.ts", false, `missing: ${catalog}`);
}

// G. i18n ko/en 키 개수 일치
const messagesDir = join(ROOT, "messages");
if (existsSync(messagesDir)) {
  const counts = {};
  for (const lang of ["ko", "en"]) {
    const f = join(messagesDir, `${lang}.json`);
    if (existsSync(f)) {
      try {
        const json = JSON.parse(readFileSync(f, "utf-8"));
        const flatten = (obj, prefix = "") => Object.entries(obj).flatMap(([k, v]) =>
          typeof v === "object" && v !== null ? flatten(v, `${prefix}${k}.`) : [`${prefix}${k}`]
        );
        counts[lang] = flatten(json).length;
      } catch { counts[lang] = 0; }
    } else counts[lang] = 0;
  }
  report.add("G.i18n", "ko/en 키 개수 일치",
    counts.ko === counts.en && counts.ko > 0,
    `ko=${counts.ko} en=${counts.en}`
  );
}

// H. AdSense 가치 게이트 — ToolGuide 없는(=thin) 도구 페이지 검출
// 정책: 인덱스되는 계산기 페이지는 ToolGuide(고유 본문) 필수, 아니면 noindex.
// 상세: docs/adsense-compliance.md
{
  const localeRoot = join(ROOT, "app", "[locale]");
  // 리프 계산기가 아닌(=ToolGuide 불필요) 라우트. 허브·정책·콘텐츠·동적.
  const ALLOW = new Set([
    "", "about", "contact", "privacy", "terms",
    "tools", "games", "tests", "learn", "blog", "guide", "projects",
    // 서브 허브 인덱스 (하위 도구 목록 페이지)
    "electric-calc", "timber-calc", "labor-calc",
  ]);
  const thin = [];
  const walkPages = (dir, rel = "") => {
    if (!existsSync(dir)) return;
    for (const entry of readdirSync(dir)) {
      const full = join(dir, entry);
      let st; try { st = statSync(full); } catch { continue; }
      if (st.isDirectory()) {
        walkPages(full, rel ? `${rel}/${entry}` : entry);
      } else if (entry === "page.tsx") {
        const route = rel; // "" = 랜딩
        // 허브·정책·동적·콘텐츠(blog/guide 하위)는 ToolGuide 불필요
        if (ALLOW.has(route)) continue;
        if (route.includes("[")) continue; // 동적 라우트
        if (route.startsWith("blog/") || route.startsWith("guide/")) continue;
        let src; try { src = readFileSync(full, "utf-8"); } catch { continue; }
        const hasGuide = src.includes("ToolGuide");
        const isNoindex = /index:\s*false/.test(src);
        if (!hasGuide && !isNoindex) thin.push(route);
      }
    }
  };
  walkPages(localeRoot);
  report.add(
    "H.AdSense",
    "도구 페이지 ToolGuide 보유 (thin=가치없는 콘텐츠 방지)",
    thin.length === 0,
    thin.length
      ? `thin ${thin.length}개 (ToolGuide 또는 noindex 필요): ${thin.join(", ")}`
      : "모든 도구 페이지가 ToolGuide 또는 noindex",
    "warn",
  );
}

// 출력
if (JSON_OUT) {
  console.log(JSON.stringify({
    total: report.total,
    passed: report.passed,
    failed: report.total - report.passed,
    checks: report.checks,
  }, null, 2));
} else {
  console.log("\n" + "=".repeat(60));
  console.log(`Workmate 시스템 audit -- ${report.passed}/${report.total} 통과`);
  console.log("=".repeat(60) + "\n");
  const byCat = {};
  for (const c of report.checks) (byCat[c.category] ||= []).push(c);
  for (const cat of Object.keys(byCat).sort()) {
    console.log(`[${cat}]`);
    for (const c of byCat[cat]) {
      const icon = c.ok ? "OK " : (c.severity === "warn" ? "WRN" : "ERR");
      console.log(`  ${icon}  ${c.name}`);
      if (c.detail) console.log(`        ${c.detail}`);
    }
    console.log("");
  }
}

const errorFailures = report.checks.filter(c => !c.ok && c.severity === "error").length;
process.exit(errorFailures > 0 ? 1 : 0);
