/**
 * DB 마이그레이션 실행 — lib/db/schema.sql 을 세미콜론 단위로 분리해 순차 실행.
 *
 * 사용: DATABASE_URL 을 환경변수로 준 뒤
 *   node scripts/db/migrate.mjs
 * (PowerShell: `$env:DATABASE_URL="postgres://..."; node scripts/db/migrate.mjs`)
 *
 * schema.sql 이 CREATE ... IF NOT EXISTS 라 재실행해도 안전(idempotent).
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { neon } from "@neondatabase/serverless";

const __dirname = dirname(fileURLToPath(import.meta.url));
const schemaPath = resolve(__dirname, "../../lib/db/schema.sql");

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("[migrate] DATABASE_URL 환경변수가 필요합니다.");
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const raw = readFileSync(schemaPath, "utf8");

// 주석 줄 제거 후 세미콜론으로 분리
const statements = raw
  .split("\n")
  .filter((line) => !line.trim().startsWith("--"))
  .join("\n")
  .split(";")
  .map((s) => s.trim())
  .filter((s) => s.length > 0);

console.log(`[migrate] ${statements.length}개 statement 실행 시작...`);

for (const [i, stmt] of statements.entries()) {
  const preview = stmt.replace(/\s+/g, " ").slice(0, 60);
  try {
    await sql.query(stmt);
    console.log(`  [${i + 1}/${statements.length}] OK  ${preview}...`);
  } catch (err) {
    console.error(`  [${i + 1}/${statements.length}] FAIL ${preview}`);
    console.error(err);
    process.exit(1);
  }
}

console.log("[migrate] ✅ 완료. Neon 콘솔에서 테이블을 확인하세요.");
