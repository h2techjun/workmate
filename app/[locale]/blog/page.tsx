import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ArrowRight, Clock } from "lucide-react";
import { postsByCategory, CATEGORY_LABELS } from "@/lib/blogPosts";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";

interface PageProps {
  params: Promise<{ locale: string }>;
}

type LK = "ko" | "en" | "zh" | "vi";
function lkOf(locale: string): LK {
  if (locale === "ko") return "ko";
  if (locale === "zh") return "zh";
  if (locale === "vi") return "vi";
  return "en";
}

const META: Record<LK, { title: string; desc: string; og: string }> = {
  ko: {
    title: "현장 노트 — Workmate 블로그",
    desc: "한국 실무자의 시선에서 풀어본 대출·세금·임대차·근로 이슈. 도구만으로 풀리지 않는 디테일을 글로 정리합니다.",
    og: "ko_KR",
  },
  en: {
    title: "Field Notes — Workmate Blog",
    desc: "Korean real-world notes on loans, tax, rentals, and labor. Details that calculators alone can't capture.",
    og: "en_US",
  },
  zh: {
    title: "实地笔记 — Workmate 博客",
    desc: "从韩国实务者视角解读贷款·税务·租赁·劳动问题。整理仅靠工具无法涵盖的细节。",
    og: "zh_CN",
  },
  vi: {
    title: "Ghi chép thực tế — Blog Workmate",
    desc: "Góc nhìn người trong nghề ở Hàn về vay vốn, thuế, thuê nhà, lao động. Những chi tiết mà công cụ tính toán không thể hiện hết.",
    og: "vi_VN",
  },
};

const PAGE: Record<LK, { home: string; title: string; intro: string; read: string }> = {
  ko: {
    home: "홈",
    title: "현장 노트",
    intro:
      "도구 페이지에 다 담기 어려운 실무 디테일을 글로 정리합니다. 매일 쓰면서 보이는 함정과 디테일 위주.",
    read: "읽기",
  },
  en: {
    home: "Home",
    title: "Field Notes",
    intro:
      "Practical details that don't fit on a calculator page. Pitfalls and nuances learned from daily use.",
    read: "Read",
  },
  zh: {
    home: "首页",
    title: "实地笔记",
    intro:
      "整理难以全部放进工具页面的实务细节。聚焦每天使用中发现的陷阱与要点。",
    read: "阅读",
  },
  vi: {
    home: "Trang chủ",
    title: "Ghi chép thực tế",
    intro:
      "Những chi tiết thực tế khó gói gọn trong trang công cụ. Tập trung vào cạm bẫy và điểm tinh tế thấy được khi dùng hằng ngày.",
    read: "Đọc",
  },
};

function minLabel(lk: LK, n: number): string {
  if (lk === "ko") return `약 ${n}분`;
  if (lk === "zh") return `约 ${n} 分钟`;
  if (lk === "vi") return `~${n} phút đọc`;
  return `~${n} min read`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const m = META[lkOf(locale)];
  return {
    title: m.title,
    description: m.desc,
    alternates: {
      canonical: `/${locale}/blog`,
      languages: buildLanguagesAlt("/blog"),
    },
    openGraph: {
      title: m.title,
      description: m.desc,
      type: "website",
      url: `${SITE_URL}/${locale}/blog`,
      locale: m.og,
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
  const lk = lkOf(locale);
  const p = PAGE[lk];
  const groups = postsByCategory();

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {p.home}
          </Link>
        </nav>

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
            {p.title}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-relaxed text-[color:var(--color-text-secondary)]">
            {p.intro}
          </p>
        </header>

        <div className="space-y-12">
          {groups.map(({ category, posts }) => (
            <section key={category}>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                <span className="h-1.5 w-1.5 rounded-full bg-indigo-400" />
                {CATEGORY_LABELS[category][lk]}
              </h2>
              <ul className="space-y-4">
                {posts.map((post) => {
                  const title =
                    lk === "ko"
                      ? post.titleKo
                      : lk === "en"
                        ? post.titleEn
                        : lk === "zh"
                          ? post.titleZh
                          : post.titleVi;
                  const summary =
                    lk === "ko"
                      ? post.summaryKo
                      : lk === "en"
                        ? post.summaryEn
                        : lk === "zh"
                          ? post.summaryZh
                          : post.summaryVi;
                  return (
                    <li key={post.slug}>
                      <Link
                        href={`/${locale}/blog/${post.slug}`}
                        className="group block rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-5 transition-colors hover:border-indigo-500/30 hover:bg-[color:var(--color-bg-card-hover)] md:p-6"
                      >
                        <div className="mb-2.5 flex items-center gap-3 text-xs text-[color:var(--color-text-tertiary)]">
                          <span>{post.publishedAt}</span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {minLabel(lk, post.readingMinutes)}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-[color:var(--color-text-primary)] md:text-xl">
                          {title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                          {summary}
                        </p>
                        <div className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-indigo-300 transition-transform group-hover:translate-x-0.5">
                          {p.read}
                          <ArrowRight className="h-4 w-4" />
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
