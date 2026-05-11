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
    ? `심리테스트 · 직장 진단 — ${SITE_BRAND}`
    : `Personality & Workplace Tests — ${SITE_BRAND}`;
  const description = isKo
    ? "AI 가 분석하는 무료 심리테스트. 직장 문화 8개 축 셀프 진단, 익명 커뮤니티 비교, Vertex AI 답변 신뢰도 평가. MBTI 류와 다른 깊이 있는 진단."
    : "Free AI-powered personality tests. 8-axis workplace culture self-assessment, anonymous community comparison, Vertex AI credibility scoring.";
  const keywords = isKo
    ? [
        "심리테스트",
        "MBTI",
        "MBTI 무료",
        "직장 문화 진단",
        "직장 진단",
        "회사 진단",
        "자가진단",
        "AI 심리분석",
        "성격 테스트",
        "익명 커뮤니티",
      ]
    : [
        "personality test",
        "MBTI",
        "workplace culture test",
        "self assessment",
        "AI personality analysis",
        "anonymous community",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/tests`,
      languages: Object.fromEntries(locales.map((l) => [l, `/${l}/tests`])),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/tests`,
      type: "website",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function TestsHubPage({
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
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-400">
          {isKo ? "심리테스트 · 자가진단" : "Tests · Self-Discovery"}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
          {isKo ? "직장 문화·자기 진단" : "Workplace & Self-Assessment"}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
          {isKo
            ? "MBTI 류의 단순 테스트와 다른 깊이. AI 가 답변 신뢰도까지 자동 평가하고, 익명 커뮤니티에서 회사·동료들과 비교한다."
            : "Deeper than MBTI-style quizzes. AI scores answer credibility and lets you compare with peers anonymously."}
        </p>
      </header>

      <ProjectsTabs
        localeKey={localeKey}
        labels={labels}
        visibleTabs={["tests"]}
      />
    </main>
  );
}
