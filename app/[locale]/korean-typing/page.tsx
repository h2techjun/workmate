import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { ArrowRight, Home } from "lucide-react";
import { locales, type Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL, SITE_BRAND } from "@/lib/siteConfig";
import { AdSlot } from "@/components/seo/AdSlot";
import { KOREAN_TYPING_COPY } from "@/lib/koreanTypingCopy";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const PAGE_BOTTOM_AD_SLOT =
  (process.env.NEXT_PUBLIC_ADSENSE_PAGE_BOTTOM_SLOT?.trim() ?? "") ||
  "0000000002";

function localeKeyOf(locale: string): Locale {
  if (locale === "ko") return "ko";
  if (locale === "zh") return "zh";
  if (locale === "vi") return "vi";
  return "en";
}

/** 게임 랜딩 상단 네비 라벨 (홈·게임 목록) */
const NAV_LABEL: Record<Locale, { home: string; games: string }> = {
  ko: { home: "홈", games: "게임 목록" },
  en: { home: "Home", games: "All games" },
  zh: { home: "首页", games: "所有游戏" },
  vi: { home: "Trang chủ", games: "Tất cả game" },
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const c = KOREAN_TYPING_COPY[localeKeyOf(locale)];
  return {
    title: `${c.metaTitle} — ${SITE_BRAND}`,
    description: c.metaDesc,
    keywords: [...c.keywords],
    alternates: {
      canonical: `/${locale}/korean-typing`,
      languages: buildLanguagesAlt("/korean-typing"),
    },
    openGraph: {
      title: `${c.metaTitle} — ${SITE_BRAND}`,
      description: c.metaDesc,
      url: `${SITE_URL}/${locale}/korean-typing`,
      type: "website",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function KoreanTypingPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const lk = localeKeyOf(locale);
  const c = KOREAN_TYPING_COPY[lk];

  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: c.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  });

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <Script
        id="ld-faq-korean-typing"
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {faqJsonLd}
      </Script>

      <div className="mx-auto max-w-4xl">
        <nav className="mb-6 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1.5 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <Home className="h-4 w-4" />
            {NAV_LABEL[lk].home}
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            href={`/${locale}/games`}
            className="transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            {NAV_LABEL[lk].games}
          </Link>
        </nav>
        <header className="mb-8 animate-fade-up">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-violet-400">
            {c.eyebrow}
          </p>
          <h1 className="text-4xl font-extrabold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
            {c.h1}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
            {c.intro}
          </p>
        </header>

        {/* 게임 임베드 — 아케이드 카드 안에 K-Type SPA(iframe) */}
        <section
          style={{ ["--card-accent" as string]: "#a78bfa" }}
          className="arcade-card overflow-hidden p-4 md:p-5"
        >
          <div className="mb-3 flex items-center gap-2">
            <span className="game-badge">🎮 {c.playLabel}</span>
          </div>
          <div className="overflow-hidden rounded-xl border-2 border-[color:var(--color-border-subtle)] bg-black">
            <iframe
              src="/ktype"
              title={c.h1}
              loading="lazy"
              className="h-[600px] w-full md:h-[680px]"
            />
          </div>
          <p className="mt-3 text-sm text-[color:var(--color-text-tertiary)]">
            {c.playHint}
          </p>
        </section>

        {/* 가이드 본문 (고유 콘텐츠 — thin 방지) */}
        <section className="mt-12 space-y-10 border-t border-[color:var(--color-border-subtle)] pt-10">
          {c.sections.map((s, i) => (
            <div key={i}>
              <h2 className="mb-3 text-2xl font-bold text-[color:var(--color-text-primary)] md:text-3xl">
                {s.h2}
              </h2>
              <p className="text-[15px] leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
                {s.body}
              </p>
            </div>
          ))}

          <div>
            <h2 className="mb-4 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
              {c.faqHeading}
            </h2>
            <div className="space-y-3">
              {c.faq.map((f, i) => (
                <details
                  key={i}
                  className="group rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-4"
                >
                  <summary className="cursor-pointer text-[15px] font-semibold text-[color:var(--color-text-primary)]">
                    {f.q}
                  </summary>
                  <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                    {f.a}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>

        {/* 게임 유도 (K-생태계 크로스링크) */}
        <section className="mt-12 border-t border-[color:var(--color-border-subtle)] pt-10">
          <h2 className="text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
            {c.gamesHeading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {c.gamesBody}
          </p>
          <Link
            href={`/${locale}/games`}
            className="group mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-400 transition-colors hover:text-violet-300"
          >
            {c.gamesCta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>

        <div className="mt-10">
          <AdSlot
            slot={PAGE_BOTTOM_AD_SLOT}
            position="page-bottom"
            format="auto"
          />
        </div>
      </div>
    </main>
  );
}
