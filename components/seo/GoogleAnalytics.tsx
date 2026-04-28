import Script from "next/script";

/**
 * Google Analytics 4 추적 코드.
 *
 * 측정 ID 우선순위:
 *   1) 환경변수 NEXT_PUBLIC_GA_ID
 *   2) fallback: G-SB1N3M6YM1 (workmate.tools 의 production 측정 ID)
 *
 * 향상된 측정(Enhanced Measurement)은 GA 대시보드에서 ON 되어 있어
 * 페이지 조회·스크롤·이탈 클릭 등이 자동 측정된다.
 */
const FALLBACK_GA_ID = "G-SB1N3M6YM1";

export function GoogleAnalytics(): React.ReactElement | null {
  const gaId = (process.env.NEXT_PUBLIC_GA_ID?.trim() ?? "") || FALLBACK_GA_ID;
  if (!gaId) return null;

  return (
    <>
      <Script
        id="ga-loader"
        async
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
      />
      <Script id="ga-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${gaId}', { anonymize_ip: true });
        `}
      </Script>
    </>
  );
}
