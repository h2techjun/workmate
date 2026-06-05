import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { VisaDaysForm } from "@/components/tools/korean/VisaDaysForm";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale !== "en";
  const title = isKo
    ? "한국 체류일수 계산기 — 90일 무비자·체류 만료일"
    : "Korea Stay Days Calculator — visa expiry & 90-day tracker";
  const description = isKo
    ? "입국일과 허용 체류일수로 현재 체류 일수·만료일·남은 일수를 즉시 계산. 90일 무비자, 30/60/180일 비자 추적. 초과체류 경고 포함."
    : "Track your stay in Korea: days stayed, expiry date, and days remaining from entry date and allowed days. 90-day visa-free, 30/60/180-day visas, overstay warning.";
  const keywords = isKo
    ? [
        "한국 체류일수",
        "90일 무비자",
        "체류 만료일 계산",
        "비자 만료일",
        "체류기간 계산기",
      ]
    : [
        "korea stay days calculator",
        "korea 90 day visa free",
        "korea visa expiry calculator",
        "how many days can i stay in korea",
        "korea overstay calculator",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/visa-days`,
      languages: buildLanguagesAlt("/visa-days"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/visa-days`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function VisaDaysPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale !== "en";
  const localeKey = isKo ? "ko" : "en";

  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 3600 * 1000);
  const today = {
    year: kst.getUTCFullYear(),
    month: kst.getUTCMonth() + 1,
    day: kst.getUTCDate(),
  };

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "툴 모음" : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "한국 체류일수 계산기" : "Korea Stay Days Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "입국일과 허용 체류일수만 넣으면 현재 체류 일수·만료일·남은 일수를 즉시 확인. 초과체류 전에 미리 점검하세요."
              : "Enter your entry date and allowed days to see days stayed, expiry date, and days remaining — check before you overstay."}
          </p>
        </header>
        <VisaDaysForm locale={localeKey} today={today} />
        <ToolGuide toolKey="visa-days" locale={localeKey} />
      </div>
    </main>
  );
}
