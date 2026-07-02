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

  // Loopla — ko 방문자: Loopla English(영어 학습) / en 방문자: Loopla Korean(한국어 학습)
  const title = isKo
    ? `영어 학습 · Loopla English SRS — ${SITE_BRAND}`
    : `Learn Korean · Loopla Korean SRS — ${SITE_BRAND}`;
  const description = isKo
    ? "기억력 곡선(FSRS)에 맞춘 생활 영어 간격 반복 학습. A1~C2 3,400+ 카드, 발음기호+한국어 발음, 플래시카드+빈칸 퀴즈. 가입 없이 브라우저에서 바로."
    : "Loopla Korean — learn everyday Korean with spaced repetition on the FSRS memory curve. 3,400+ cards A1–C2, Hangul + romanization, flashcards + cloze quiz. No signup, runs in your browser.";
  const keywords = isKo
    ? [
        "영어 학습",
        "생활 영어",
        "영어 회화",
        "영어 단어 암기",
        "간격 반복 학습",
        "SRS",
        "플래시카드",
        "영어 발음",
        "무료 영어 공부",
      ]
    : [
        "learn korean",
        "korean for beginners",
        "korean vocabulary",
        "everyday korean",
        "spaced repetition korean",
        "hangul",
        "korean flashcards",
        "study korean free",
        "korean SRS",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/learn`,
      languages: buildLanguagesAlt("/learn"),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/learn`,
      type: "website",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function LearnHubPage({
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
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
            {isKo ? "영어 학습 · 간격 반복" : "Learn Korean · Spaced Repetition"}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
            {isKo ? "기억에 남는 영어 학습" : "Korean That Sticks"}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
            {isKo
              ? "잊을 만할 때 다시 만나는 생활 영어. 망각곡선(FSRS)이 복습 타이밍을 자동 계산하고, 발음기호와 한국어 발음까지 함께 익힌다."
              : "Everyday Korean that comes back right before you forget. Loopla Korean's FSRS engine schedules your reviews automatically, with Hangul and romanization hints."}
          </p>
        </header>

        <ProjectsTabs
          localeKey={localeKey}
          labels={labels}
          visibleTabs={["learn"]}
        />
      </div>
    </main>
  );
}
