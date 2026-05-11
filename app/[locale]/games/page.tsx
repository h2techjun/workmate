import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n";
import { SITE_URL, SITE_BRAND } from "@/lib/siteConfig";
import { ProjectsTabs } from "@/components/projects/ProjectsTabs";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale !== "en";

  const title = isKo
    ? `무료 웹게임 모음 — ${SITE_BRAND}`
    : `Free Browser Games — ${SITE_BRAND}`;
  const description = isKo
    ? "회원가입·결제·설치 없이 브라우저에서 바로 플레이하는 무료 게임. 한국형 화투 로그라이크 K-Poker, 무협 타워디펜스 해원문, 6시간 정치 스릴러 텍스트 어드벤처."
    : "Free browser games — no signup, no install. Korean hwatu roguelike, martial-arts tower defense, 6-hour political text adventure.";
  const keywords = isKo
    ? [
        "무료 게임",
        "웹게임",
        "한국 인디 게임",
        "화투 게임",
        "화투 로그라이크",
        "K-Poker",
        "타워디펜스",
        "텍스트 어드벤처",
        "인터랙티브 픽션",
        "정치 스릴러",
      ]
    : [
        "free browser games",
        "Korean indie games",
        "hwatu roguelike",
        "tower defense",
        "text adventure",
        "interactive fiction",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/games`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/games`])),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/games`,
      type: "website",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function GamesHubPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale !== "en";
  const localeKey = (isKo ? "ko" : "en") as Locale;
  const t = await getTranslations({ locale: localeKey, namespace: "projects" });

  const labels = {
    open: t("cardOpen"),
    external: t("cardExternal"),
    comingSoon: t("cardComingSoon"),
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <header className="mb-10 max-w-3xl animate-fade-up">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-rose-400">
          {isKo ? "무료 게임" : "Free Games"}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
          {isKo ? "브라우저에서 바로 플레이" : "Play Instantly in Browser"}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
          {isKo
            ? "회원가입·결제·설치 없이 클릭 한 번. 한국형 화투 로그라이크, 무협 타워디펜스, 6시간 정치 텍스트 어드벤처까지."
            : "One click and you're in — no signup, no install. Korean hwatu roguelike, martial-arts tower defense, and a 6-hour political text adventure."}
        </p>
      </header>

      <ProjectsTabs
        localeKey={localeKey}
        labels={labels}
        visibleTabs={["games", "stories"]}
      />
    </main>
  );
}
