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
    ? `무료 게임·인터랙티브 스토리·심리테스트 모음 — ${SITE_BRAND}`
    : `Free Games · Interactive Stories · Personality Tests — ${SITE_BRAND}`;
  const description = isKo
    ? "브라우저에서 바로 즐기는 무료 게임(화투 로그라이크 K-Poker, 한국형 타워디펜스), 6시간 정치 텍스트 어드벤처, 직장 문화 심리테스트. 회원가입·결제 없이 즉시 플레이."
    : "Free browser games (hwatu roguelike, Korean tower defense), 6-hour political text adventure, workplace culture personality test. Play instantly — no signup.";
  const keywords = isKo
    ? [
        "무료 게임",
        "웹게임",
        "한국 인디 게임",
        "화투 게임",
        "화투 로그라이크",
        "타워디펜스",
        "텍스트 어드벤처",
        "인터랙티브 픽션",
        "정치 스릴러",
        "심리테스트",
        "MBTI",
        "직장 문화 진단",
        "자가진단",
        "AI 심리분석",
      ]
    : [
        "free browser games",
        "Korean indie games",
        "hwatu game",
        "tower defense",
        "text adventure",
        "interactive fiction",
        "personality test",
        "MBTI",
        "workplace culture test",
        "self assessment",
        "AI personality analysis",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/projects`,
      languages: Object.fromEntries(
        locales.map((l) => [l, `/${l}/projects`]),
      ),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/projects`,
      type: "website",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function ProjectsPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale !== "en";
  const localeKey = (isKo ? "ko" : "en") as Locale;
  const t = await getTranslations({ locale: localeKey, namespace: "projects" });

  const cardLabels = {
    open: t("cardOpen"),
    external: t("cardExternal"),
    comingSoon: t("cardComingSoon"),
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-12 md:py-16">
      <header className="mb-10 max-w-3xl animate-fade-up">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
          {t("heading")}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
          {t("intro")}
        </p>
      </header>

      <ProjectsTabs localeKey={localeKey} labels={cardLabels} />
    </main>
  );
}
