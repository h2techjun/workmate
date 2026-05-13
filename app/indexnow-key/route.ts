/**
 * IndexNow 키 검증 엔드포인트 — Bing/Yandex/Naver(yet to support) 색인 가속.
 *
 * 위치: https://workmate.tools/indexnow-key
 *   - IndexNow ping 요청 시 keyLocation 파라미터로 이 URL 명시
 *   - 본문에 키 그대로 반환 → 검색엔진이 도메인 소유 검증
 *
 * 사용법:
 *   1. 32+자 영숫자 키 발급 (예: `openssl rand -hex 16`)
 *   2. Vercel 환경변수에 INDEXNOW_KEY=<발급키> 추가
 *   3. https://workmate.tools/indexnow-key 가 200 + 키 본문 반환 확인
 *   4. URL 변경/추가 시 `lib/seo/indexNow.ts` submitToIndexNow() 호출
 *
 * 미설정 시 404 (정상 — 키 없으면 검증 불가).
 */
export const dynamic = "force-static";

export function GET(): Response {
  const key = process.env.INDEXNOW_KEY?.trim();
  if (!key) {
    return new Response("Not configured", { status: 404 });
  }
  return new Response(key, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
