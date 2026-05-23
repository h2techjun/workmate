import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ArrowRight, Clock } from "lucide-react";
import { sortedBlogPosts } from "@/lib/blogPosts";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale !== "en";
  const title = isKo
    ? "현장 노트 — Workmate 블로그"
    : "Field Notes — Workmate Blog";
  const description = isKo
    ? "한국 실무자의 시선에서 풀어본 대출·세금·임대차·근로 이슈. 도구만으로 풀리지 않는 디테일을 글로 정리합니다."
    : "Korean real-world notes on loans, tax, rentals, and labor. Details that calculators alone can't capture.";
  return {
    title,
    description,
    alternates: {
      canonical: `/${locale}/blog`,
      languages: buildLanguagesAlt("/blog"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/blog`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function BlogIndexPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale !== "en";
  const posts = sortedBlogPosts();

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "홈" : "Home"}
          </Link>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
            {isKo ? "현장 노트" : "Field Notes"}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[color:var(--color-text-secondary)]">
            {isKo
              ? "도구 페이지에 다 담기 어려운 실무 디테일을 글로 정리합니다. 매일 쓰면서 보이는 함정과 디테일 위주."
              : "Practical details that don't fit on a calculator page. Pitfalls and nuances learned from daily use."}
          </p>
        </header>

        <ul className="space-y-4">
          {posts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/${locale}/blog/${post.slug}`}
                className="group block rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-5 transition-colors hover:border-indigo-500/30 hover:bg-[color:var(--color-bg-card-hover)] md:p-6"
              >
                <div className="mb-2.5 flex items-center gap-3 text-xs text-[color:var(--color-text-tertiary)]">
                  <span>{post.publishedAt}</span>
                  <span className="inline-flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {isKo
                      ? `약 ${post.readingMinutes}분`
                      : `~${post.readingMinutes} min read`}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)] md:text-xl">
                  {isKo ? post.titleKo : post.titleEn}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                  {isKo ? post.summaryKo : post.summaryEn}
                </p>
                <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-300 transition-transform group-hover:translate-x-0.5">
                  {isKo ? "읽기" : "Read"}
                  <ArrowRight className="h-4 w-4" />
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
