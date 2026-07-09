#!/usr/bin/env node
// 웨이브2: messages/zh-guide-*.json 조각들을 messages/zh.json 의 toolGuides 로 병합.
// part 파일 구조 3가지(flat / zh 래핑 / toolGuides 래핑)를 폴백으로 흡수한다.
// 공통 섹션 라벨(_labels) zh 도 여기서 주입한다.
// 사용: node scripts/merge-zh-guides.mjs
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const MSG = join(ROOT, "messages");

const files = readdirSync(MSG)
  .filter((f) => /^zh-guide-.*\.json$/.test(f))
  .sort();
if (files.length === 0) {
  console.error("messages/zh-guide-*.json 없음");
  process.exit(1);
}

const guides = {};
let count = 0;
for (const f of files) {
  const raw = JSON.parse(readFileSync(join(MSG, f), "utf8"));
  // 3구조 폴백: flat / .zh 래핑 / .toolGuides 래핑
  const tools = raw.toolGuides ?? raw.zh ?? raw;
  for (const [k, v] of Object.entries(tools)) {
    if (k === "_labels") continue;
    if (guides[k]) console.warn("중복 키 " + k + " (in " + f + ") — 덮어씀");
    guides[k] = v;
    count++;
  }
  const n = Object.keys(tools).filter((k) => k !== "_labels").length;
  console.log("  " + f + ": " + n + " tools");
}

// 공통 섹션 라벨 zh (ToolGuide._labels)
guides._labels = {
  overview: "此工具的用途",
  useCases: "适合这些人使用",
  faq: "常见问题",
  cautions: "注意事项",
  related: "相关工具",
  lastReviewedPrefix: "最后审阅日期：",
};

const zhPath = join(MSG, "zh.json");
const zh = JSON.parse(readFileSync(zhPath, "utf8"));
zh.toolGuides = guides;
writeFileSync(zhPath, JSON.stringify(zh, null, 2) + "\n");

console.log(
  "\n[OK] " + count + " tools + _labels -> zh.json.toolGuides (" +
    files.length + " part files, " + Object.keys(guides).length + " keys)",
);
