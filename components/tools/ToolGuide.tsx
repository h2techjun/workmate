/**
 * 도구 페이지 하단 가이드 섹션 — thin content 거절 방지용 본문 보강.
 *
 * 모든 도구 페이지가 form + 결과만 표시해서 GSC·AdSense 가 "low value content"
 * 판정 → 페이지당 본문 텍스트 1,500~3,000자 추가하여 검색 의도 + 교육 가치
 * 둘 다 충족.
 *
 * 데이터는 i18n messages (`messages/ko.json` · `messages/en.json`) 의
 * `toolGuides.<toolKey>` 네임스페이스에서 가져옴.
 *
 * 사용:
 *   <ToolGuide toolKey="income-tax" locale={localeKey} />
 */

import { getTranslations } from "next-intl/server";
import Link from "next/link";
import Script from "next/script";

interface ToolGuideProps {
  /** messages/<locale>.json 의 toolGuides.<toolKey> 와 매칭 */
  toolKey: string;
  locale: "ko" | "en";
}

interface FAQItem {
  question: string;
  answer: string;
}

interface ExampleItem {
  title: string;
  body: string;
}

interface HowToData {
  title: string;
  steps: string[];
}

interface FormulaData {
  title: string;
  body: string;
}

interface RelatedItem {
  label: string;
  href: string;
}

interface ExamplesData {
  title: string;
  items: ExampleItem[];
}

interface ChecklistGroup {
  heading: string;
  items: string[];
}

interface ChecklistData {
  title: string;
  groups: ChecklistGroup[];
}

interface ToolGuideData {
  overview: string;
  useCases: string[];
  howTo: HowToData;
  formula: FormulaData;
  examples: ExamplesData;
  faq: FAQItem[];
  cautions: string[];
  related: RelatedItem[];
  lastReviewed: string;
}

export async function ToolGuide({
  toolKey,
  locale,
}: ToolGuideProps): Promise<React.ReactElement | null> {
  const t = await getTranslations({ locale, namespace: `toolGuides.${toolKey}` });
  const tLabels = await getTranslations({
    locale,
    namespace: "toolGuides._labels",
  });

  // 데이터가 messages 에 없으면 렌더하지 않음 (점진적 적용 안전).
  let data: ToolGuideData;
  try {
    data = {
      overview: t("overview"),
      useCases: t.raw("useCases") as string[],
      howTo: t.raw("howTo") as HowToData,
      formula: t.raw("formula") as FormulaData,
      examples: t.raw("examples") as ExamplesData,
      faq: t.raw("faq") as FAQItem[],
      cautions: t.raw("cautions") as string[],
      related: t.raw("related") as RelatedItem[],
      lastReviewed: t("lastReviewed"),
    };
  } catch {
    return null;
  }

  // 선택적 checklist — 없는 도구는 null (점진 적용 안전, 기존 도구 영향 X).
  // t.has() 로 먼저 확인해 next-intl MISSING_MESSAGE 콘솔 에러를 피한다.
  let checklist: ChecklistData | null = null;
  if (t.has("checklist")) {
    const raw = t.raw("checklist") as ChecklistData | undefined;
    if (raw && Array.isArray(raw.groups) && raw.groups.length > 0) {
      checklist = raw;
    }
  }

  // JSON-LD — Next.js <Script> children 패턴 (XSS 안전)
  // 데이터는 i18n messages 에서만 오므로 신뢰 가능 (사용자 입력 X)
  const faqJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faq.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  });
  const howToJsonLd = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: data.howTo.title,
    step: data.howTo.steps.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      text: step,
    })),
  });

  return (
    <section className="mt-12 space-y-10 border-t border-[color:var(--color-border-subtle)] pt-10">
      <Script
        id={`ld-faq-${toolKey}`}
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {faqJsonLd}
      </Script>
      <Script
        id={`ld-howto-${toolKey}`}
        type="application/ld+json"
        strategy="afterInteractive"
      >
        {howToJsonLd}
      </Script>

      {/* Overview */}
      <div>
        <h2 className="mb-3 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
          {tLabels("overview")}
        </h2>
        <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
          {data.overview}
        </p>
      </div>

      {/* Use cases */}
      <div>
        <h2 className="mb-3 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
          {tLabels("useCases")}
        </h2>
        <ul className="space-y-2 text-sm text-[color:var(--color-text-secondary)] md:text-base">
          {data.useCases.map((useCase, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="mt-1 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
              <span>{useCase}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* How to */}
      <div>
        <h2 className="mb-3 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
          {data.howTo.title}
        </h2>
        <ol className="space-y-3 text-sm text-[color:var(--color-text-secondary)] md:text-base">
          {data.howTo.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-500/15 text-xs font-bold text-indigo-300">
                {i + 1}
              </span>
              <span className="leading-relaxed">{step}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Formula */}
      <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-5">
        <h2 className="mb-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
          {data.formula.title}
        </h2>
        <p className="whitespace-pre-line text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
          {data.formula.body}
        </p>
      </div>

      {/* Examples */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
          {data.examples.title}
        </h2>
        <div className="space-y-4">
          {data.examples.items.map((item, i) => (
            <div
              key={i}
              className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-4"
            >
              <h3 className="mb-1.5 font-semibold text-[color:var(--color-text-primary)]">
                {item.title}
              </h3>
              <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                {item.body}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Checklist (선택적 — 한국 생활 상황별 체크리스트) */}
      {checklist && (
        <div>
          <h2 className="mb-4 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
            {checklist.title}
          </h2>
          <div className="space-y-5">
            {checklist.groups.map((group, gi) => (
              <div
                key={gi}
                className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-4 md:p-5"
              >
                <h3 className="mb-3 font-semibold text-[color:var(--color-text-primary)]">
                  {group.heading}
                </h3>
                <ul className="space-y-2.5">
                  {group.items.map((item, ii) => (
                    <li
                      key={ii}
                      className="flex gap-3 text-sm leading-relaxed text-[color:var(--color-text-secondary)]"
                    >
                      <span
                        aria-hidden="true"
                        className="mt-0.5 inline-flex h-4 w-4 shrink-0 items-center justify-center rounded border border-indigo-400/50 text-[10px] text-indigo-400"
                      >
                        ✓
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAQ */}
      <div>
        <h2 className="mb-4 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
          {tLabels("faq")}
        </h2>
        <div className="space-y-4">
          {data.faq.map((item, i) => (
            <details
              key={i}
              className="group rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-4 [&[open]>summary>span]:rotate-45"
            >
              <summary className="flex cursor-pointer items-start justify-between gap-3 text-sm font-semibold text-[color:var(--color-text-primary)] md:text-base">
                <span className="flex-1">{item.question}</span>
                <span className="mt-1 inline-block h-4 w-4 shrink-0 text-indigo-400 transition-transform">
                  +
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                {item.answer}
              </p>
            </details>
          ))}
        </div>
      </div>

      {/* Cautions */}
      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <h2 className="mb-2.5 text-lg font-bold text-amber-300 md:text-xl">
          {tLabels("cautions")}
        </h2>
        <ul className="space-y-1.5 text-sm text-[color:var(--color-text-secondary)]">
          {data.cautions.map((caution, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-amber-400">•</span>
              <span>{caution}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Related tools */}
      {data.related.length > 0 && (
        <div>
          <h2 className="mb-3 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
            {tLabels("related")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {data.related.map((item, i) => (
              <Link
                key={i}
                href={`/${locale}${item.href}`}
                className="inline-flex items-center rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] px-3.5 py-1.5 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-indigo-300"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Last reviewed (E-A-T 신뢰성 시그널) */}
      <p className="text-xs text-[color:var(--color-text-tertiary)]">
        {tLabels("lastReviewedPrefix")} {data.lastReviewed}
      </p>
    </section>
  );
}
