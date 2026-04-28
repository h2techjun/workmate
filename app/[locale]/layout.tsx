import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AdSenseScript } from "@/components/seo/AdSenseScript";
import { GoogleAnalytics } from "@/components/seo/GoogleAnalytics";
import { SITE_URL, SITE_BRAND } from "@/lib/siteConfig";
import "../globals.css";

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export const viewport: Viewport = {
  themeColor: "#0a0b0e",
  colorScheme: "dark",
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
  };

  const descriptions: Record<Locale, string> = {
    ko: "전기 계산(KEC/KS), 사업자등록 검증, 4대보험·연봉 실수령액, 목조 구조 계산 등 한국 실무자가 매일 쓰는 도구를 무료로 제공합니다. 광고 없는 빠른 계산기.",
    en: "Free online calculators based on Korean standards (KEC, KS, NDS). Electric wire size, breaker, voltage drop, payroll insurance, timber span — built for Korean professionals.",
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

  return (
    <html lang={locale} className="dark">
      <head>
        <AdSenseScript />
        <GoogleAnalytics />
      </head>
      <body>
        <NextIntlClientProvider messages={messages} locale={locale}>
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
