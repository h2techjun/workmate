/**
 * /ads.txt — Google AdSense 검증용 동적 라우트.
 *
 * 환경변수 `NEXT_PUBLIC_ADSENSE_CLIENT` (예: `ca-pub-1234567890123456`) 가 설정되면
 * 자동으로 publisher ID 부분을 채워 라이브로 서빙됨. 미설정 시 placeholder.
 *
 * IAB Tech Lab ads.txt v1.0.2 스펙 준수:
 *   domain, publisher_id, account_type, certification_authority_id
 *   - account_type: DIRECT (Google과 직접 계약)
 *   - certification_authority_id: f08c47fec0942fa0 (Google의 TAG-ID)
 *
 * AdSense 심사·승인 후 publisher ID 를 Vercel 환경변수에 추가하면 즉시 반영.
 */
export const dynamic = "force-static";

export function GET(): Response {
  const client = (process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim() ?? "").replace(
    /^ca-/,
    "",
  );
  const publisherId = client || "pub-XXXXXXXXXXXXXXXX";
  const body = `google.com, ${publisherId}, DIRECT, f08c47fec0942fa0\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
