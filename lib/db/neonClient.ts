/**
 * Neon Postgres 클라이언트 — ⚠️ 서버 전용.
 *
 * API route(app/api/**)에서만 import 한다. 클라이언트 컴포넌트에서 import 하면
 * DATABASE_URL(서버 시크릿)이 번들에 노출될 위험이 있으므로 절대 금지.
 *
 * `@neondatabase/serverless` HTTP 드라이버라 커넥션 풀 관리가 불필요하고
 * Vercel 서버리스 함수와 궁합이 좋다. 태그 템플릿(sql`...`)이 파라미터를
 * 자동 바인딩해 SQL 인젝션을 막는다.
 */

import { neon } from "@neondatabase/serverless";

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  // 빌드 타임(정적 페이지 생성)에는 API route 코드가 실행되지 않으므로 안전.
  // 런타임에 DATABASE_URL 없이 sql 을 쓰면 여기서 명확히 실패한다.
  console.warn(
    "[neonClient] DATABASE_URL 미설정 — 댓글/반응 API는 DB 연결 후 동작합니다.",
  );
}

/** DB 연결이 준비됐는지 (API route에서 사전 체크용) */
export function isDbConfigured(): boolean {
  return typeof DATABASE_URL === "string" && DATABASE_URL.length > 0;
}

/**
 * 파라미터 바인딩 태그 함수. 예:
 *   const rows = await sql`SELECT * FROM t WHERE slug = ${slug}`;
 *
 * DATABASE_URL 미설정 시(빌드·미연결)에도 모듈 로드가 실패하지 않도록 유효 *형식*의
 * 더미 URL 로 초기화한다. 실제 쿼리는 API route 가 isDbConfigured() 로 사전 차단하므로
 * 더미로 연결이 시도되는 일은 없다(neon 은 첫 쿼리 시점에 lazy 연결).
 */
export const sql = neon(
  DATABASE_URL ?? "postgresql://user:pass@localhost:5432/placeholder",
);
