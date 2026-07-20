import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseScript } from "@/components/seo/AdSenseScript";
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";
import { SiteStructuredData } from "@/components/seo/StructuredData";
import { SITE_URL, SITE_BRAND } from "@/lib/siteConfig";
import "../globals.css";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const viewport: Viewport = {
  // colorScheme 메타는 넣지 않는다 — CSS 의 color-scheme(다크 기본,
  // html[data-theme="light"] 시 light)이 담당. 메타로 고정하면 라이트
  // 전환 시 브라우저 폼 컨트롤이 다크로 렌더되는 충돌이 생긴다.
  themeColor: "#07080b",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  viewportFit: "cover",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;

  const titles: Record<Locale, string> = {
    ko: `${SITE_BRAND} — 한국 실무자가 매일 쓰는 무료 도구·계산기 모음`,
    en: `${SITE_BRAND} — Free Tools & Calculators for Korean Standards`,
    vi: `${SITE_BRAND} — Bộ công cụ và máy tính miễn phí theo tiêu chuẩn Hàn Quốc`,
    zh: `${SITE_BRAND} — 韩国职场人每天使用的免费工具·计算器合集`,
  };

  const descriptions: Record<Locale, string> = {
    ko: "한국 실무자를 위한 무료 계산기 허브. 전기 KEC, 4대보험 2026, 사업자번호 검증, 목조 NDS 구조, 연봉 실수령액까지 근로기준법·KS표준·세법 출처를 명시한 계산기를 회원가입 없이 바로 씁니다.",
    en: "Korean calculators: wire (KEC), 4 insurances, biz number, timber NDS, salary.",
    vi: "Máy tính Hàn Quốc: dây điện (KEC), 4 loại bảo hiểm, mã số doanh nghiệp, nhà gỗ (NDS), lương thực nhận.",
    zh: "面向韩国职场人打造的免费计算器合集。电气布线KEC计算、四大保险2026年费率、事业者登记号验证、木结构NDS设计、年薪实领金额等，每个计算器都标明劳动基准法、KS标准与税法出处，无需注册即可直接使用查询。",
  };

  const localeKey = (locales.includes(locale as Locale) ? locale : "ko") as Locale;
  const title = titles[localeKey];
  const description = descriptions[localeKey];
  const canonicalPath = `/${localeKey}`;

  return {
    metadataBase: new URL(SITE_URL),
    title,
    description,
    applicationName: SITE_BRAND,
    authors: [{ name: SITE_BRAND, url: SITE_URL }],
    creator: SITE_BRAND,
    publisher: SITE_BRAND,
    keywords:
      localeKey === "ko"
        ? [
            "전기 계산기",
            "전선 굵기",
            "차단기 용량",
            "전압강하",
            "4대보험 계산기",
            "연봉 실수령액",
            "사업자등록 조회",
            "목조 주택 계산",
            "한국 실무 도구",
            SITE_BRAND,
          ]
        : [
            "Korean electric calculator",
            "wire size KEC",
            "breaker capacity",
            "voltage drop",
            "Korean payroll insurance",
            "salary calculator Korea",
            SITE_BRAND,
          ],
    alternates: {
      canonical: canonicalPath,
      languages: {
        ko: "/ko",
        en: "/en",
        "x-default": "/ko",
      },
      types: {
        "application/rss+xml": "/rss.xml",
      },
    },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${canonicalPath}`,
      siteName: SITE_BRAND,
      title,
      description,
      locale: localeKey === "ko" ? "ko_KR" : "en_US",
      alternateLocale: localeKey === "ko" ? ["en_US"] : ["ko_KR"],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      site: `@${SITE_BRAND.toLowerCase()}`,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    icons: {
      icon: [{ url: "/icon", type: "image/png" }],
      shortcut: "/icon",
      apple: "/icon",
    },
    verification: {
      google: "google978ab54addb768c4",
      other: {
        "naver-site-verification":
          "naver327b3085cb9b92823257202340586670",
      },
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: LocaleLayoutProps): Promise<React.ReactElement> {
  const { locale } = await params;

  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const messages = await getMessages();
  // toolGuides(messages 의 83%, 71도구×본문×4로케일)는 서버 컴포넌트
  // ToolGuide.tsx 에서만 getTranslations 로 사용한다. 클라이언트 provider 에서
  // 제외해 모든 페이지의 HTML/RSC payload 크기를 대폭 축소한다(홈 841KB → ~150KB).
  const clientMessages: typeof messages = { ...messages };
  delete (clientMessages as Record<string, unknown>).toolGuides;

  return (
    // suppressHydrationWarning: theme-init.js 가 페인트 전에 html 에
    // data-theme 속성을 넣을 수 있어 서버 HTML 과 달라진다.
    <html lang={locale} className="dark" suppressHydrationWarning>
      <head>
        <AdSenseScript />
        <GoogleAnalytics />
        {/* 라이트 테마 FOUC 가드 — 의도적 동기 로드(페인트 전 실행 보장).
            내용: public/theme-init.js (localStorage 'light' 일 때만 전환) */}
        {/* eslint-disable-next-line @next/next/no-sync-scripts */}
        <script src="/theme-init.js" />
      </head>
      <body>
        <SiteStructuredData
          siteUrl={SITE_URL}
          locale={locale !== "ko" ? "en" : "ko"}
        />
        <NextIntlClientProvider messages={clientMessages} locale={locale}>
          <div className="flex min-h-screen flex-col">
            <Header locale={locale as Locale} />
            <div className="flex-1">{children}</div>
            <Footer locale={locale as Locale} />
          </div>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
