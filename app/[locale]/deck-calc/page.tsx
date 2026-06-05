import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { DeckForm } from "@/components/tools/timber/DeckForm";
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
    ? "데크·울타리 자재 계산기 — 보드·기둥·살 수량"
    : "Deck & Fence Calculator — boards, posts, pickets";
  const description = isKo
    ? "데크 면적으로 필요한 보드 장수·장선 개수를, 울타리 길이로 기둥·레일·세로살 수량을 즉시 계산. 손실 할증 포함. 목공·조경 DIY에 바로."
    : "Calculate deck board count and joists from area, and fence posts, rails, and pickets from length. With waste allowance. For woodworking and landscaping DIY.";
  const keywords = isKo
    ? ["데크 계산기", "데크 보드 수량", "울타리 자재", "장선 개수", "펜스 기둥"]
    : ["deck board calculator", "fence calculator", "decking calculator", "how many deck boards"];

  return {
    title, description, keywords,
    alternates: { canonical: `/${locale}/deck-calc`, languages: buildLanguagesAlt("/deck-calc") },
    openGraph: { title, description, type: "website", url: `${SITE_URL}/${locale}/deck-calc`, locale: locale === "ko" ? "ko_KR" : "en_US" },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function DeckCalcPage({
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
            {isKo ? "데크·울타리 자재 계산기" : "Deck & Fence Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "데크 면적으로 보드·장선을, 울타리 길이로 기둥·레일·살 수량을 즉시 산출. 손실 할증까지 포함."
              : "Get deck boards and joists from area, and fence posts, rails, and pickets from length — with waste allowance."}
          </p>
        </header>
        <DeckForm locale={localeKey} />
        <ToolGuide toolKey="deck-calc" locale={localeKey} />
      </div>
    </main>
  );
}
