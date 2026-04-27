import Script from "next/script";

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
 */
export function AdSenseScript(): React.ReactElement | null {
  const client = process.env.NEXT_PUBLIC_ADSENSE_CLIENT?.trim();
  if (!client) return null;

  return (
    <Script
      id="adsense"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${client}`}
      crossOrigin="anonymous"
    />
  );
}
