import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL, SITE_BRAND } from "@/lib/siteConfig";
import { ProjectsTabs } from "@/components/projects/ProjectsTabs";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";

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
      languages: buildLanguagesAlt("/games"),
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
  const isKo = locale === "ko";
  const localeKey = (isKo ? "ko" : "en") as Locale;
  const t = await getTranslations({ locale: localeKey, namespace: "projects" });

  const labels = {
    open: t("cardOpen"),
    external: t("cardExternal"),
    comingSoon: t("cardComingSoon"),
  };

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
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

      <section className="mt-14 max-w-3xl space-y-6 border-t border-[color:var(--color-border-subtle)] pt-10">
        <h2 className="text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
          {isKo ? "직접 만든 게임과 이야기" : "Built in-house, not embedded"}
        </h2>
        <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
          {isKo
            ? "여기 있는 게임과 인터랙티브 스토리는 모두 Workmate를 만든 사람이 직접 개발해 운영하는 프로젝트입니다. 외부 광고용 임베드가 아니라, 같은 제작자가 만든 작품들을 한곳에 모았습니다."
            : "Every game and interactive story here is built and operated by the same person who makes Workmate. These are not third-party ad embeds — they are the maker's own projects gathered in one place."}
        </p>
        <ul className="space-y-2.5 text-sm text-[color:var(--color-text-secondary)] md:text-base">
          {(isKo
            ? [
                "게임 — 한국형 화투 로그라이크(K-Poker), 무협 타워디펜스. 브라우저에서 설치 없이 바로 플레이.",
                "인터랙티브 스토리 — 6시간 정치 스릴러 텍스트 어드벤처 등 선택지로 전개되는 서사형 작품.",
                "전부 무료·무가입. 모바일에서도 동작하며, 결제나 앱 설치가 필요 없습니다.",
              ]
            : [
                "Games — a Korean hwatu (flower-card) roguelike (K-Poker) and a martial-arts tower defense, playable instantly in the browser.",
                "Interactive stories — a 6-hour political-thriller text adventure and other choice-driven narrative pieces.",
                "All free, no signup. They run on mobile, with no payment or app install.",
              ]
          ).map((item, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
      </div>
    </main>
  );
}
