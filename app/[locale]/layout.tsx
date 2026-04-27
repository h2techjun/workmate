import type { Metadata, Viewport } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { notFound } from "next/navigation";
import { locales, type Locale } from "@/i18n";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
    ko: "WorkTool — 한국 실무자를 위한 무료 도구 모음",
    en: "WorkTool — Free Tools for Korean Standards",
  };

  const descriptions: Record<Locale, string> = {
    ko: "전기 계산, 사업자등록 조회, MSDS 검색 등 한국 실무자가 매일 쓰는 도구를 무료로 제공합니다.",
    en: "Free online calculators and tools based on Korean standards. Electric calculations, business registration lookup, and more.",
  };

  return {
    title: titles[locale as Locale] ?? titles.ko,
    description: descriptions[locale as Locale] ?? descriptions.ko,
    alternates: {
      languages: {
        ko: "/ko",
        en: "/en",
      },
    },
    icons: {
      icon: [{ url: "/icon", type: "image/png" }],
      shortcut: "/icon",
      apple: "/icon",
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
