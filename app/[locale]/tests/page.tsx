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
      languages: buildLanguagesAlt("/tests"),
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
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
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

      <section className="mt-14 max-w-3xl space-y-6 border-t border-[color:var(--color-border-subtle)] pt-10">
        <h2 className="text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
          {isKo ? "이 심리테스트는 무엇이 다른가요" : "What makes these tests different"}
        </h2>
        <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
          {isKo
            ? "MBTI 류의 단순 분류를 넘어, 직장 문화 진단과 자기 이해에 초점을 둔 자가진단 도구입니다. AI가 응답의 일관성·신뢰도를 평가하고, 결과를 익명으로 비교할 수 있습니다. 같은 제작자가 만든 프로젝트로, 외부 광고용 임베드가 아닙니다."
            : "Beyond MBTI-style labels, these self-assessment tools focus on workplace culture and self-understanding. An AI layer scores the consistency and credibility of your answers, and results can be compared anonymously. They are projects by the same maker — not third-party ad embeds."}
        </p>
        <ul className="space-y-2.5 text-sm text-[color:var(--color-text-secondary)] md:text-base">
          {(isKo
            ? [
                "직장 문화 진단 — 우리 회사·팀의 분위기를 항목별로 점검하고 익명 비교.",
                "AI 신뢰도 평가 — 대충 찍은 응답을 걸러 결과의 신뢰도를 높임.",
                "무료·무가입. 결과는 개인 참고용이며 진단·의학적 판단이 아닙니다.",
              ]
            : [
                "Workplace culture check — assess your company or team by category and compare anonymously.",
                "AI credibility scoring — filters careless answers to make the result more reliable.",
                "Free, no signup. Results are for personal reflection, not a clinical diagnosis.",
              ]
          ).map((item, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
      </div>
    </main>
  );
}
