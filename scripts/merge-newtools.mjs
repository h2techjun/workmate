/**
 * tmp/newtool-*.json 의 toolGuide(ko/en)를 messages/ko.json·en.json 의
 * toolGuides 네임스페이스에 병합한다. ko/en parity 를 위해 배열형(faq 등)은
 * min 길이로 정렬. CRLF 보존, _labels 위치 무의존(toolGuides 여는 괄호 직후 삽입).
 */
import fs from "node:fs";
import path from "node:path";

const TMP_DIR = "tmp";
const files = fs
  .readdirSync(TMP_DIR)
  .filter((f) => f.startsWith("newtool-") && f.endsWith(".json"));

/** ko/en 배열 길이를 맞춰 parity 보장 (faq·useCases·cautions·examples.items) */
function alignParity(ko, en) {
  const arrKeys = ["useCases", "cautions"];
  for (const k of arrKeys) {
    if (Array.isArray(ko[k]) && Array.isArray(en[k])) {
      const n = Math.min(ko[k].length, en[k].length);
      ko[k] = ko[k].slice(0, n);
      en[k] = en[k].slice(0, n);
    }
  }
  if (Array.isArray(ko.faq) && Array.isArray(en.faq)) {
    const n = Math.min(ko.faq.length, en.faq.length);
    ko.faq = ko.faq.slice(0, n);
    en.faq = en.faq.slice(0, n);
  }
  for (const side of [ko, en]) {
    // nothing else dynamic
    void side;
  }
  if (ko.examples?.items && en.examples?.items) {
    const n = Math.min(ko.examples.items.length, en.examples.items.length);
    ko.examples.items = ko.examples.items.slice(0, n);
    en.examples.items = en.examples.items.slice(0, n);
  }
  if (Array.isArray(ko.howTo?.steps) && Array.isArray(en.howTo?.steps)) {
    const n = Math.min(ko.howTo.steps.length, en.howTo.steps.length);
    ko.howTo.steps = ko.howTo.steps.slice(0, n);
    en.howTo.steps = en.howTo.steps.slice(0, n);
  }
  if (Array.isArray(ko.related) && Array.isArray(en.related)) {
    const n = Math.min(ko.related.length, en.related.length);
    ko.related = ko.related.slice(0, n);
    en.related = en.related.slice(0, n);
  }
}

/** 객체를 4칸 들여쓰기 + 파일 newline 으로 직렬화한 "키": {...}, 블록 */
function buildEntry(key, obj, nl) {
  const json = JSON.stringify(obj, null, 2);
  const indented = json
    .split("\n")
    .map((line) => "    " + line)
    .join(nl);
  return `    ${JSON.stringify(key)}: ${indented.trimStart()},${nl}`;
}

function mergeInto(file, entriesByKey) {
  let s = fs.readFileSync(file, "utf8");
  const nl = s.includes("\r\n") ? "\r\n" : "\n";
  // 이미 존재하는 키는 건너뜀
  let block = "";
  for (const [key, obj] of entriesByKey) {
    if (s.includes(`"${key}": {`)) {
      console.log(`  ${path.basename(file)}: "${key}" 이미 존재 — skip`);
      continue;
    }
    block += buildEntry(key, obj, nl);
  }
  if (block === "") return;
  // "toolGuides": { 여는 괄호 직후 삽입
  const re = /( {2}"toolGuides":\s*\{\r?\n)/;
  if (!re.test(s)) throw new Error(`${file}: toolGuides 앵커 미발견`);
  s = s.replace(re, (m) => m + block);
  fs.writeFileSync(file, s);
}

const koEntries = [];
const enEntries = [];
for (const f of files) {
  const j = JSON.parse(fs.readFileSync(path.join(TMP_DIR, f), "utf8"));
  const ko = j.toolGuide.ko;
  const en = j.toolGuide.en;
  alignParity(ko, en);
  koEntries.push([j.toolKey, ko]);
  enEntries.push([j.toolKey, en]);
  console.log(`수집: ${j.toolKey} (faq ${ko.faq.length}/${en.faq.length})`);
}

mergeInto("messages/ko.json", koEntries);
mergeInto("messages/en.json", enEntries);
console.log("병합 완료");
