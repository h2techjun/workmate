import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { GiftMoneyForm } from "@/components/tools/korean/GiftMoneyForm";
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
    ? "축의금·부의금 계산기 — 관계별 적정 금액 추천"
    : "Korean Gift Money Calculator (축의금/부의금)";
  const description = isKo
    ? "결혼식 축의금·장례식 부의금 적정액을 관계와 참석 여부로 추천. 지인·동료·친구·절친·친척별 통상 범위 + 홀수 관습 안내."
    : "Recommended Korean wedding (축의금) and funeral (부의금) gift money amounts by relationship and attendance, with the odd-number custom.";
  const keywords = isKo
    ? ["축의금", "부의금", "축의금 계산기", "결혼식 축의금", "축의금 금액", "부조금", "경조사비"]
    : ["korean wedding gift money", "korean funeral money", "chukuigeum", "korea gift money amount"];

  return {
    title, description, keywords,
    alternates: { canonical: `/${locale}/gift-money`, languages: buildLanguagesAlt("/gift-money") },
    openGraph: { title, description, type: "website", url: `${SITE_URL}/${locale}/gift-money`, locale: locale === "ko" ? "ko_KR" : "en_US" },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function GiftMoneyPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale !== "en";
  const localeKey = isKo ? "ko" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link href={`/${locale}/tools`} className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]">
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "툴 모음" : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "축의금·부의금 계산기" : "Korean Gift Money Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "결혼식 축의금·장례식 부의금 적정액을 관계와 참석 여부로 추천. 얼마를 내야 할지 고민될 때 기준으로."
              : "Recommended Korean wedding and funeral gift money by relationship and attendance — a reference when you're unsure how much to give."}
          </p>
        </header>
        <GiftMoneyForm locale={localeKey} />
        <ToolGuide toolKey="gift-money" locale={localeKey} />
      </div>
    </main>
  );
}
