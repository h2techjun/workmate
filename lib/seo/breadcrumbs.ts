/**
 * 경로 → breadcrumb 계층 자동 생성 — BreadcrumbList JSON-LD + 시각 nav 단일 진실원.
 *
 * 라벨 소스는 이미 존재하는 단일 진실원을 그대로 참조한다(중복·드리프트 0):
 *   - 계산기 그룹·도구  → `lib/toolsCatalog.ts` TOOL_GROUPS
 *   - 블로그 글 제목     → `lib/blogPosts.ts` BLOG_POSTS
 *   - 홈·섹션 라벨       → 이 파일의 소수 상수(4로케일)
 *
 * 매칭 실패(가이드 상세·게임 랜딩·정책 등)는 홈까지만 반환 → 컴포넌트가
 * `currentName`/`trail` 로 마지막 노드를 보강한다.
 */

import { SITE_URL } from "@/lib/siteConfig";
import { TOOL_GROUPS, type ToolEntry } from "@/lib/toolsCatalog";
import { BLOG_POSTS } from "@/lib/blogPosts";
import type { Locale } from "@/i18n";

export interface BreadcrumbItem {
  name: string;
  /** 절대 URL (JSON-LD `item` 값) */
  url: string;
}

const HOME_LABEL: Record<Locale, string> = {
  ko: "홈",
  en: "Home",
  zh: "首页",
  vi: "Trang chủ",
};

const BLOG_LABEL: Record<Locale, string> = {
  ko: "블로그",
  en: "Blog",
  zh: "博客",
  vi: "Blog",
};

const GUIDE_LABEL: Record<Locale, string> = {
  ko: "가이드",
  en: "Guides",
  zh: "指南",
  vi: "Hướng dẫn",
};

/** 허브 인덱스 라벨 (경로 세그먼트 동적 매칭용) */
const HUB_LABEL: Record<string, Record<Locale, string>> = {
  tools: { ko: "도구 전체", en: "All Tools", zh: "全部工具", vi: "Tất cả công cụ" },
  games: { ko: "게임", en: "Games", zh: "游戏", vi: "Games" },
  tests: { ko: "심리테스트", en: "Tests", zh: "心理测试", vi: "Tests" },
  learn: { ko: "학습", en: "Learn", zh: "学习", vi: "Learn" },
};

function abs(locale: Locale, path: string): string {
  return `${SITE_URL}/${locale}${path}`;
}

function toolLabel(tool: ToolEntry, locale: Locale): string {
  if (locale === "ko") return tool.labelKo;
  if (locale === "zh") return tool.labelZh;
  if (locale === "vi") return tool.labelVi;
  return tool.labelEn;
}

function blogTitle(post: (typeof BLOG_POSTS)[number], locale: Locale): string {
  if (locale === "ko") return post.titleKo;
  if (locale === "zh") return post.titleZh;
  if (locale === "vi") return post.titleVi;
  return post.titleEn;
}

/** 홈 노드 (모든 경로 공통 시작점) */
export function homeCrumb(locale: Locale): BreadcrumbItem {
  return { name: HOME_LABEL[locale], url: `${SITE_URL}/${locale}` };
}

/**
 * locale 제외 경로(leading slash 포함) + locale → breadcrumb 계층.
 * @param path 예: "/net-salary", "/labor-calc/annual-leave", "/blog/loan-30-vs-15-years"
 */
export function buildBreadcrumbs(path: string, locale: Locale): BreadcrumbItem[] {
  const home = homeCrumb(locale);
  const p = path.startsWith("/") ? path : `/${path}`;

  // 1) 계산기 — 그룹 hub 또는 도구
  for (const group of TOOL_GROUPS) {
    if (group.hubHref && group.hubHref === p) {
      return [home, { name: group.i18n[locale].title, url: abs(locale, p) }];
    }
    const tool = group.tools.find((t) => t.href === p);
    if (tool) {
      const items: BreadcrumbItem[] = [home];
      if (group.hubHref) {
        items.push({
          name: group.i18n[locale].title,
          url: abs(locale, group.hubHref),
        });
      }
      items.push({ name: toolLabel(tool, locale), url: abs(locale, p) });
      return items;
    }
  }

  // 2) 블로그
  if (p === "/blog") {
    return [home, { name: BLOG_LABEL[locale], url: abs(locale, "/blog") }];
  }
  if (p.startsWith("/blog/")) {
    const slug = p.slice("/blog/".length);
    const post = BLOG_POSTS.find((b) => b.slug === slug);
    return [
      home,
      { name: BLOG_LABEL[locale], url: abs(locale, "/blog") },
      { name: post ? blogTitle(post, locale) : slug, url: abs(locale, p) },
    ];
  }

  // 3) 가이드 (말단 제목은 카탈로그 밖 → 컴포넌트 currentName 이 slug 교체)
  if (p === "/guide") {
    return [home, { name: GUIDE_LABEL[locale], url: abs(locale, "/guide") }];
  }
  if (p.startsWith("/guide/")) {
    const slug = p.slice("/guide/".length);
    return [
      home,
      { name: GUIDE_LABEL[locale], url: abs(locale, "/guide") },
      { name: slug, url: abs(locale, p) },
    ];
  }

  // 4) 허브 인덱스 (tools·games·tests·learn)
  const seg = p.slice(1);
  const hub = HUB_LABEL[seg];
  if (hub) {
    return [home, { name: hub[locale], url: abs(locale, p) }];
  }

  // 5) 매칭 실패 → 홈만. 컴포넌트가 currentName/trail 로 보강.
  return [home];
}
