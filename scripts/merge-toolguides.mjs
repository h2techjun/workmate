#!/usr/bin/env node
/**
 * tmp/tg-*.json (각 에이전트가 쓴 ToolGuide 조각)을 messages/{ko,en}.json 의
 * toolGuides 객체(_labels 앞)에 텍스트로 삽입한다. 전체 재포맷 없이 추가만 →
 * 작은 diff + i18n 정합 보존(동일 키를 ko/en 양쪽에 삽입).
 *
 * 사용: node scripts/merge-toolguides.mjs
 */
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TMP = join(ROOT, "tmp");
// CRLF/LF 무관 앵커: toolGuides 열고 바로 _labels
const ANCHOR_RE = / {2}"toolGuides": \{\r?\n {4}"_labels": \{/;

const files = readdirSync(TMP).filter((f) => /^tg-.*\.json$/.test(f)).sort();
if (files.length === 0) {
  console.error("tmp/tg-*.json 없음");
  process.exit(1);
}

// 1) 조각 수집 + 검증
const merged = { ko: {}, en: {} };
for (const f of files) {
  const d = JSON.parse(readFileSync(join(TMP, f), "utf8"));
  for (const lang of ["ko", "en"]) {
    if (!d[lang]) throw new Error(`${f}: ${lang} 누락`);
    for (const [k, v] of Object.entries(d[lang])) {
      if (merged[lang][k]) throw new Error(`중복 키 ${k} (${f})`);
      merged[lang][k] = v;
    }
  }
}
const koKeys = Object.keys(merged.ko).sort();
const enKeys = Object.keys(merged.en).sort();
if (JSON.stringify(koKeys) !== JSON.stringify(enKeys)) {
  throw new Error(`ko/en 키 불일치\nko: ${koKeys}\nen: ${enKeys}`);
}
console.log(`조각 ${files.length}개 → 도구 ${koKeys.length}개:`, koKeys.join(", "));

// 2) 각 lang messages 에 텍스트 삽입
function buildBlock(entries, nl) {
  const block = Object.entries(entries)
    .map(([k, v]) => {
      const body = JSON.stringify(v, null, 2);
      const indented = body
        .split("\n")
        .map((line, i) => (i === 0 ? line : "    " + line))
        .join("\n");
      return "    " + JSON.stringify(k) + ": " + indented + ",";
    })
    .join("\n");
  // 구조적 줄바꿈만 파일 줄바꿈으로 변환 (문자열 내 \\n 은 영향 없음)
  return block.replace(/\n/g, nl);
}

for (const lang of ["ko", "en"]) {
  const p = join(ROOT, "messages", `${lang}.json`);
  let src = readFileSync(p, "utf8");
  if (!ANCHOR_RE.test(src)) throw new Error(`${lang}: 앵커 미발견`);
  const nl = src.includes("\r\n") ? "\r\n" : "\n";
  const block = buildBlock(merged[lang], nl);
  src = src.replace(
    ANCHOR_RE,
    '  "toolGuides": {' + nl + block + nl + '    "_labels": {',
  );
  JSON.parse(src); // 유효 JSON 검증
  writeFileSync(p, src);
  console.log(`${lang}.json: ${koKeys.length}개 삽입 OK`);
}
console.log("완료. node scripts/audit.mjs 로 i18n 정합 확인 권장.");
