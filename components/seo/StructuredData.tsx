import Script from "next/script";

interface CalculatorJsonLdProps {
  /** 도구 이름 (예: "전선 굵기 계산기") */
  name: string;
  /** 한 줄 설명 */
  description: string;
  /** 절대 URL */
  url: string;
  /** 운영자 정보 */
  authorName?: string;
  /** 카테고리 (전기/목조/재무 등) */
  applicationCategory?: string;
  /** 주요 단계 (HowTo) — 도구의 사용 절차 */
  howToSteps?: ReadonlyArray<{ name: string; text: string }>;
}

/**
 * Schema.org JSON-LD — SoftwareApplication + 선택적 HowTo.
 * Google 검색 풍부 결과에 영향. 페이지당 한 번만 렌더.
 *
 * 구현 메모:
 *   `next/script` 컴포넌트의 children prop을 사용해 인라인 JSON-LD를 안전하게
 *   주입한다. 데이터는 모두 빌드 타임 상수이므로 XSS 위험 없음.
 */
export function CalculatorJsonLd({
  name,
  description,
  url,
  authorName = "Workmate",
  applicationCategory = "BusinessApplication",
  howToSteps,
}: CalculatorJsonLdProps): React.ReactElement {
  const data: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name,
    description,
    url,
    applicationCategory,
    operatingSystem: "Web Browser",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "KRW",
    },
    author: {
      "@type": "Organization",
      name: authorName,
    },
    inLanguage: ["ko-KR", "en-US"],
  };

  const graph: Record<string, unknown>[] = [data];

  if (howToSteps && howToSteps.length > 0) {
    graph.push({
      "@context": "https://schema.org",
      "@type": "HowTo",
      name: `${name} 사용법`,
      description,
      step: howToSteps.map((s, i) => ({
        "@type": "HowToStep",
        position: i + 1,
        name: s.name,
        text: s.text,
      })),
    });
  }

  const json = JSON.stringify(graph.length === 1 ? graph[0] : graph);
  return (
    <Script
      id={`ld-${url.replace(/[^a-z0-9]/gi, "-")}`}
      type="application/ld+json"
      strategy="afterInteractive"
    >
      {json}
    </Script>
  );
}

interface BreadcrumbJsonLdProps {
  items: ReadonlyArray<{ name: string; url: string }>;
  /** unique id suffix */
  id: string;
}

export function BreadcrumbJsonLd({
  items,
  id,
}: BreadcrumbJsonLdProps): React.ReactElement {
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: it.url,
    })),
  };
  return (
    <Script
      id={`bc-${id}`}
      type="application/ld+json"
      strategy="afterInteractive"
    >
      {JSON.stringify(data)}
    </Script>
  );
}

interface OrganizationJsonLdProps {
  url: string;
}

export function OrganizationJsonLd({
  url,
}: OrganizationJsonLdProps): React.ReactElement {
  const data = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Workmate",
    url,
    description:
      "한국 표준(KS·KEC·건축법)에 기반한 무료 실무 계산 도구 모음.",
  };
  return (
    <Script
      id="ld-organization"
      type="application/ld+json"
      strategy="afterInteractive"
    >
      {JSON.stringify(data)}
    </Script>
  );
}

interface SiteStructuredDataProps {
  /** 사이트 루트 절대 URL (예: https://workmate.tools) */
  siteUrl: string;
  /** 현재 locale */
  locale: "ko" | "en";
}

/**
 * 사이트 전역 구조화 데이터 — 모든 페이지에 적용.
 *
 * 포함:
 *   1. WebSite + potentialAction (검색박스 후보. Google 사이트링크 + 네이버)
 *   2. Organization (사이트 연관채널 시드. SNS sameAs 추가 가능)
 *
 * 네이버 서치어드바이저 "구조화된 데이터 마크업" 가이드 충족.
 */
export function SiteStructuredData({
  siteUrl,
  locale,
}: SiteStructuredDataProps): React.ReactElement {
  const localizedUrl = `${siteUrl}/${locale}`;
  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Workmate",
    alternateName: ["워크메이트", "한국 실무 계산기"],
    url: localizedUrl,
    description:
      locale === "ko"
        ? "한국 실무자를 위한 무료 계산기 모음. 전기 KEC, 4대보험 2026, 사업자번호 검증, 목조 NDS, 연봉 실수령액."
        : "Korean calculators: wire (KEC), 4 insurances, biz number, timber NDS, salary.",
    inLanguage: locale === "ko" ? "ko-KR" : "en-US",
    publisher: {
      "@type": "Organization",
      name: "Workmate",
      url: siteUrl,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${localizedUrl}?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Workmate",
    alternateName: ["워크메이트"],
    url: siteUrl,
    logo: `${siteUrl}/icon`,
    description:
      "한국 표준(KEC·KS·NDS·건축법) 기반 무료 실무 계산기 운영. 전기·4대보험·사업자등록·목조 구조 등 한국 실무자가 매일 쓰는 도구를 광고 없이 제공한다.",
    foundingDate: "2026",
    knowsLanguage: ["ko-KR", "en-US"],
  };

  return (
    <>
      <Script
        id="ld-website"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(websiteData)}
      </Script>
      <Script
        id="ld-organization-site"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {JSON.stringify(organizationData)}
      </Script>
    </>
  );
}
