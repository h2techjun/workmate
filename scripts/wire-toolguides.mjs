#!/usr/bin/env node
/**
 * thin 도구 24개 page.tsx 에 <ToolGuide> 배선:
 *  ① 첫 import 다음 줄에 ToolGuide import 추가 (없을 때만)
 *  ② 폼 컴포넌트 JSX 다음 줄에 <ToolGuide toolKey=... locale=... /> 추가
 * 멱등: 이미 ToolGuide 있으면 건너뜀.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

// route(앱 경로) → { form: JSX 매칭 문자열, key: toolKey }
const MAP = {
  "timber-calc/concrete": { form: "<ConcreteForm />", key: "timber-concrete" },
  "timber-calc/lumber": { form: "<LumberForm />", key: "timber-lumber" },
  "timber-calc/plywood": { form: '<MaterialQuantityForm lockedMaterial="plywood18" />', key: "timber-plywood" },
  "timber-calc/osb": { form: '<MaterialQuantityForm lockedMaterial="osb18" />', key: "timber-osb" },
  "timber-calc/drywall": { form: '<MaterialQuantityForm lockedMaterial="gypsum12" />', key: "timber-drywall" },
  "timber-calc/siding": { form: '<MaterialQuantityForm lockedMaterial="fiberCementSiding" />', key: "timber-siding" },
  "timber-calc/insulation-batt": { form: '<MaterialQuantityForm lockedMaterial="battInsulationR19" />', key: "timber-insulation-batt" },
  "timber-calc/material-quantity": { form: "<MaterialQuantityForm />", key: "timber-material-quantity" },
  "timber-calc/tile": { form: "<TileForm locale={localeKey} />", key: "timber-tile" },
  "timber-calc/rafter": { form: "<RafterForm />", key: "timber-rafter" },
  "timber-calc/roof-pitch": { form: "<RoofPitchForm />", key: "timber-roof-pitch" },
  "timber-calc/span": { form: "<SpanForm />", key: "timber-span" },
  "timber-calc/stairs": { form: "<StairsForm />", key: "timber-stairs" },
  "timber-calc/studs": { form: "<StudsForm locale={localeKey} />", key: "timber-studs" },
  "labor-calc/annual-leave": { form: "<AnnualLeaveForm />", key: "labor-annual-leave" },
  "labor-calc/min-wage-monthly": { form: "<MinWageMonthlyForm />", key: "labor-min-wage-monthly" },
  "labor-calc/severance": { form: "<SeveranceForm />", key: "labor-severance" },
  "labor-calc/weekly-rest-pay": { form: "<WeeklyRestPayForm />", key: "labor-weekly-rest-pay" },
  "compound-calc": { form: "<CompoundForm locale={localeKey} />", key: "compound-calc" },
  "insurance-calc": { form: "<InsuranceForm />", key: "insurance-calc" },
  "vat-calc": { form: "<VatForm />", key: "vat-calc" },
  "json-csv": { form: "<JsonCsvForm />", key: "json-csv" },
  "foreign-stock-tax": { form: "<ForeignStockTaxForm />", key: "foreign-stock-tax" },
  "electric-calc/voltage-drop": { form: "<VoltageDropForm />", key: "electric-voltage-drop" },
};

const IMPORT = 'import { ToolGuide } from "@/components/tools/ToolGuide";';
let wired = 0;
const problems = [];

for (const [route, { form, key }] of Object.entries(MAP)) {
  const p = join(ROOT, "app", "[locale]", ...route.split("/"), "page.tsx");
  let src = readFileSync(p, "utf8");
  if (src.includes("ToolGuide")) {
    continue; // 이미 배선됨
  }
  if (!src.includes(form)) {
    problems.push(`${route}: 폼 '${form}' 미발견`);
    continue;
  }
  const nl = src.includes("\r\n") ? "\r\n" : "\n";
  // ① import 추가 (첫 import 줄 다음)
  const lines = src.split(nl);
  const firstImport = lines.findIndex((l) => l.startsWith("import "));
  if (firstImport < 0) {
    problems.push(`${route}: import 줄 없음`);
    continue;
  }
  lines.splice(firstImport + 1, 0, IMPORT);
  src = lines.join(nl);
  // ② 폼 다음에 ToolGuide 컴포넌트 추가 (폼의 들여쓰기 8칸 가정)
  const guide = `        <ToolGuide toolKey="${key}" locale={locale === "en" ? "en" : "ko"} />`;
  src = src.replace(form, form + nl + guide);
  writeFileSync(p, src);
  wired++;
}

console.log(`배선 완료: ${wired}개`);
if (problems.length) {
  console.log("문제:");
  for (const pr of problems) console.log("  - " + pr);
  process.exit(1);
}
