/**
 * Google AdSense 코드 — 환경변수에 publisher ID 설정 시에만 활성화.
 *
 * 사용법:
 *   1. .env.local 또는 Vercel 환경변수에 다음 추가
 *      NEXT_PUBLIC_ADSENSE_CLIENT=ca-pub-XXXXXXXXXXXXXXXX
 *   2. public/ads.txt 의 pub-XXXX 부분도 같은 값으로 교체
 *   3. <AdSenseScript /> 를 root layout 의 head 에 한 번만 렌더
 *
 * 미설정(빈 문자열) 시 광고 코드가 페이지에 삽입되지 않음.
 *
 * ⚠️ next/script 를 쓰지 않는 이유: next/script 가 주입하는 data-nscript
 *    속성을 adsbygoogle.js 가 "AdSense head tag doesn't support data-n..."
 *    콘솔 경고로 거부한다. 심사 전 콘솔 청정 유지를 위해 raw <script async>
 *    로 렌더 (async 라 no-sync-scripts lint 도 통과).
 */
export function AdSenseScript(): React.ReactElement | null {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  if (!client) return null;

  return (
    // eslint-disable-next-line @next/next/no-sync-scripts -- async 스크립트임
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  );
}
