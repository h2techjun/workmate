import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { locales, type Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL, SITE_BRAND } from "@/lib/siteConfig";
import { TOOL_GROUPS, TOOL_GROUP_ORDER } from "@/lib/toolsCatalog";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale !== "en";

  const title = isKo
    ? `한국 실무자를 위한 무료 계산기 모음 — ${SITE_BRAND}`
    : `Free Calculators for Korean Professionals — ${SITE_BRAND}`;
  const description = isKo
    ? "연봉 실수령액·연차·주휴수당·퇴직금·부가세·해외주식 양도세·전기 KEC·목조 NDS·사업자번호 검증·JSON CSV 변환. 한국 표준 기반 무료 계산기 20여 가지를 카테고리별로."
    : "Korean payroll, tax, electric KEC, timber NDS, business number validation, and JSON/CSV converter. 20+ free calculators grouped by category.";
  const keywords = isKo
    ? [
        "연봉 실수령액",
        "연차 계산기",
        "주휴수당",
        "퇴직금 계산",
        "4대보험 계산",
        "부가세 계산기",
        "해외주식 양도세",
        "전선 굵기 계산",
        "차단기 용량",
        "단열 R값",
        "목조 주택",
        "사업자번호 검증",
        "JSON CSV 변환",
      ]
    : [
        "Korean payroll calculator",
        "annual leave Korea",
        "VAT calculator",
        "Korean electric code KEC",
        "timber NDS Korea",
        "business number validation",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/tools`,
      languages: buildLanguagesAlt("/tools"),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/tools`,
      type: "website",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function ToolsHubPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale !== "en";
  const localeKey = (isKo ? "ko" : "en") as Locale;

  const groups = TOOL_GROUP_ORDER.map(
    (id) => TOOL_GROUPS.find((g) => g.id === id),
  ).filter((g): g is NonNullable<typeof g> => Boolean(g));

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
      <header className="mb-10 max-w-3xl animate-fade-up">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
          {isKo ? "무료 계산기 모음" : "Free Calculator Library"}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
          {isKo ? "한국 실무자를 위한 계산기" : "Calculators for Korean Professionals"}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
          {isKo
            ? "연봉 실수령액부터 전기 KEC, 목조 NDS, 부가세까지 — 한국 표준에 정확히 맞춘 20여 가지 계산기. 회원가입·결제·앱 설치 없이 즉시 사용."
            : "From payroll take-home to Korean electric code, timber NDS, and VAT — 20+ calculators aligned to Korean standards. No signup, no payment, no app install."}
        </p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        {groups.map((group) => {
          const copy = group.i18n[localeKey];
          const target = `/${locale}${group.hubHref ?? group.tools[0]?.href ?? ""}`;
          return (
            <article
              key={group.id}
              className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-6 transition-all hover:border-[color:var(--color-border-strong)] hover:shadow-lg md:p-7"
            >
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${group.accent} opacity-70`}
              />

              <div className="mb-4 flex items-start gap-3">
                <span className="text-3xl" aria-hidden="true">
                  {group.emoji}
                </span>
                <div className="flex-1">
                  <h2 className="text-xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-2xl">
                    {copy.title}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                    {copy.tagline}
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-1.5">
                {group.tools.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={`/${locale}${tool.href}`}
                      className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-bg-elevated)] hover:text-[color:var(--color-text-primary)]"
                    >
                      <span className="truncate">
                        {localeKey === "ko" ? tool.labelKo : tool.labelEn}
                      </span>
                      <ArrowUpRight size={14} className="flex-shrink-0 opacity-60" />
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href={target}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-text-primary)] transition-colors hover:text-indigo-400"
              >
                <span>
                  {isKo ? "카테고리 열기" : "Open category"}
                </span>
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </article>
          );
        })}
      </div>
      </div>
    </main>
  );
}
