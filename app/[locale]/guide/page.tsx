import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Wrench } from "lucide-react";
import { locales, type Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { sortedBlogPosts } from "@/lib/blogPosts";

interface PageProps {
  params: Promise<{ locale: string }>;
}

interface GuideEntry {
  slug: string;
  titleKo: string;
  titleEn: string;
  summaryKo: string;
  summaryEn: string;
}

const GUIDES: ReadonlyArray<GuideEntry> = [
  {
    slug: "wire-size",
    titleKo: "전선 굵기 — 표 보지 않고 정하는 법",
    titleEn: "Wire size — selecting without the table",
    summaryKo: "KEC 232.5 표를 매번 들춰보는 대신, 전류·거리·전압강하만으로 단면적을 추산하는 절차.",
    summaryEn: "Estimate cross-section from current, distance, and voltage drop — without the KEC table.",
  },
  {
    slug: "biz-number",
    titleKo: "사업자등록번호 체크섬 — 가짜 번호 거르는 알고리즘",
    titleEn: "Korean business registration number — what the checksum tells you",
    summaryKo: "1-3-7-1-3-7-1-3-5 가중치 검산법. 거래 전 가짜 사업자 한 번에 거르기.",
    summaryEn: "The 1-3-7 weighted checksum that catches fake Korean business numbers before a deal.",
  },
  {
    slug: "four-insurance",
    titleKo: "4대보험 — 2026 요율과 실수령액 계산",
    titleEn: "Korean 4-major insurance — 2026 rates and net pay",
    summaryKo: "국민연금·건강·고용·산재 요율 정리 + 월급에서 빠지는 정확한 금액.",
    summaryEn: "Pension, health, employment, accident — current rates and exact deductions.",
  },
  {
    slug: "insulation",
    titleKo: "단열 R값·U값 — 에너지절약 별표1 통과 가이드",
    titleEn: "Insulation R-value · U-value — Korean building code path",
    summaryKo: "지역별 부위별 U값 한도 + 실제 자재로 통과시키는 두께 산정.",
    summaryEn: "Korean zonal U-value limits and the thickness needed with real materials.",
  },
  {
    slug: "span",
    titleKo: "부재 경간 — 장선·서까래·헤더 최대 길이",
    titleEn: "Span tables — joist, rafter, header limits",
    summaryKo: "NDS 기준 실무용 경간 한계 + 처짐·휨 검증 순서.",
    summaryEn: "Practical NDS-based span limits and the deflection-then-bending check order.",
  },
];

const CATEGORIES = [
  { emoji: "💼", href: "/labor-calc", titleKo: "연봉 · 근로", titleEn: "Payroll · Labor", descriptionKo: "연차·주휴수당·퇴직금·최저시급", descriptionEn: "Annual leave · weekly rest · severance · min wage" },
  { emoji: "💰", href: "/income-tax", titleKo: "재무 · 세금", titleEn: "Finance · Tax", descriptionKo: "종합소득세·대출·복리·부가세·해외주식", descriptionEn: "Income tax · loan · compound · VAT · foreign stock" },
  { emoji: "🏘️", href: "/rent-cap", titleKo: "부동산 · 임대", titleEn: "Real Estate", descriptionKo: "임대료 5% 인상한도 검증", descriptionEn: "Korean rent cap (5%) verification" },
  { emoji: "⚡", href: "/electric-calc", titleKo: "전기 (KEC)", titleEn: "Electric (KEC)", descriptionKo: "전선 굵기·차단기·전압강하", descriptionEn: "Wire size · breaker · voltage drop" },
  { emoji: "🏠", href: "/timber-calc", titleKo: "목조 · 자재", titleEn: "Timber · Materials", descriptionKo: "서까래·지붕·계단·단열·자재 수량", descriptionEn: "Rafter · roof · stairs · insulation · materials" },
  { emoji: "🔄", href: "/area-convert", titleKo: "변환 · 일상", titleEn: "Convert · Daily", descriptionKo: "평수↔㎡·퍼센트·JSON↔CSV", descriptionEn: "Pyeong↔m² · percent · JSON↔CSV" },
] as const;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const title = isKo
    ? "도구 가이드 — 사용법·공식·법령 인용"
    : "Tool Guides — How-to, formulas, and law citations";
  const description = isKo
    ? "33개 도구의 깊이 있는 가이드 모음. 가이드·현장 노트·도구가 한 곳에 연결되어 있어요."
    : "In-depth guides for 33 Korean tools. Guides, field notes, and tools cross-linked.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/guide`,
      languages: buildLanguagesAlt("/guide"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/guide`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function GuideIndexPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const localeKey = (isKo ? "ko" : "en") as Locale;
  const blogPosts = sortedBlogPosts();

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
            {isKo ? "도구 가이드" : "Tool Guides"}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
            {isKo
              ? "한국 실무 도구의 깊이 있는 가이드"
              : "In-depth guides to Korean practical tools"}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[color:var(--color-text-secondary)]">
            {isKo
              ? "도구 사용법은 도구 페이지에. 깊이 있는 배경·실제 사례·법령 인용은 여기에. 가이드·블로그·도구가 서로 연결되어 있어요."
              : "How-to lives on the tool page. Background, real-world cases, and law citations live here. Guides, blog, and tools cross-link freely."}
          </p>
        </header>

        <section className="mb-14">
          <div className="mb-5 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              {isKo ? "도구 — 6개 카테고리" : "Tools — 6 categories"}
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={`/${localeKey}${cat.href}`}
                className="surface-card group flex items-start gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)]"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[color:var(--color-text-primary)]">
                    {isKo ? cat.titleKo : cat.titleEn}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
                    {isKo ? cat.descriptionKo : cat.descriptionEn}
                  </p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[color:var(--color-text-tertiary)] transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-5 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              {isKo ? "가이드 — 도구 깊이 읽기" : "Guides — read tools deeper"}
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/${localeKey}/guide/${guide.slug}`}
                className="surface-card group block p-5 transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)]"
              >
                <h3 className="font-semibold text-[color:var(--color-text-primary)]">
                  {isKo ? guide.titleKo : guide.titleEn}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                  {isKo ? guide.summaryKo : guide.summaryEn}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-300 transition-transform group-hover:translate-x-0.5">
                  {isKo ? "가이드 읽기" : "Read guide"}
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              {isKo ? "현장 노트 — 실무자 관점" : "Field Notes — practitioner view"}
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/${localeKey}/blog/${post.slug}`}
                className="surface-card group block p-5 transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)]"
              >
                <p className="mb-2 text-xs text-[color:var(--color-text-tertiary)]">
                  {post.publishedAt} ·{" "}
                  {isKo
                    ? `약 ${post.readingMinutes}분`
                    : `~${post.readingMinutes} min`}
                </p>
                <h3 className="font-semibold text-[color:var(--color-text-primary)]">
                  {isKo ? post.titleKo : post.titleEn}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                  {isKo ? post.summaryKo : post.summaryEn}
                </p>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-center">
            <Link
              href={`/${localeKey}/blog`}
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200"
            >
              {isKo ? "현장 노트 모두 보기" : "All field notes"}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
