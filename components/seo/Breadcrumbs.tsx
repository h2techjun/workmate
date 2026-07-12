import Link from "next/link";
import { ChevronRight } from "lucide-react";
import type { Locale } from "@/i18n";
import { SITE_URL } from "@/lib/siteConfig";
import { BreadcrumbJsonLd } from "@/components/seo/StructuredData";
import {
  buildBreadcrumbs,
  homeCrumb,
  type BreadcrumbItem,
} from "@/lib/seo/breadcrumbs";

/**
 * 공통 breadcrumb — 시각 nav(홈›카테고리›현재) + BreadcrumbList JSON-LD 동시 방출.
 *
 * 사용 3형태:
 *   1) 자동(계산기·블로그·허브): `<Breadcrumbs path="/net-salary" locale={localeKey} id="net-salary" />`
 *      → toolsCatalog/blogPosts 단일 진실원에서 계층 자동 조회.
 *   2) 자동 + 말단 이름 보강(가이드 등 카탈로그 밖): `path`(예 "/guide/four-insurance") + `currentName`.
 *      buildBreadcrumbs 가 홈만 반환하면 여기서 섹션 노드 + currentName 을 붙인다.
 *   3) 완전 수동: `trail={[{name,url}, ...]}` (절대 URL) 로 계층 직접 지정.
 *
 * JSON-LD `item` 은 절대 URL, 시각 링크는 SITE_URL 을 벗겨 상대 경로로 렌더.
 * itemListElement 2개 미만이면 렌더하지 않는다(Google breadcrumb 최소 요건).
 */
export function Breadcrumbs({
  path,
  locale,
  id,
  currentName,
  trail,
}: {
  path?: string;
  locale: Locale;
  id: string;
  currentName?: string;
  trail?: ReadonlyArray<BreadcrumbItem>;
}): React.ReactElement | null {
  const items: BreadcrumbItem[] = trail
    ? [...trail]
    : path
      ? buildBreadcrumbs(path, locale)
      : [homeCrumb(locale)];

  // 자동 계층이 홈만 반환했는데 currentName 이 있으면 말단 노드 보강
  if (!trail && currentName && path) {
    const last = items[items.length - 1];
    if (items.length === 1) {
      items.push({ name: currentName, url: `${SITE_URL}/${locale}${path}` });
    } else if (last && last.url === `${SITE_URL}/${locale}${path}`) {
      // 자동으로 붙은 말단 이름을 명시 이름으로 교체(slug fallback 방지)
      items[items.length - 1] = { ...last, name: currentName };
    }
  }

  if (items.length < 2) return null;

  return (
    <>
      <BreadcrumbJsonLd id={id} items={items} />
      <nav
        aria-label="Breadcrumb"
        className="mb-4 text-xs text-[color:var(--color-text-tertiary)]"
      >
        <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
          {items.map((item, i) => {
            const isLast = i === items.length - 1;
            const relHref = item.url.replace(SITE_URL, "") || "/";
            return (
              <li key={item.url} className="flex items-center gap-x-1.5">
                {i > 0 && (
                  <ChevronRight
                    className="h-3.5 w-3.5 shrink-0 text-[color:var(--color-text-tertiary)]/60"
                    aria-hidden="true"
                  />
                )}
                {isLast ? (
                  <span
                    aria-current="page"
                    className="font-medium text-[color:var(--color-text-secondary)]"
                  >
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={relHref}
                    className="transition-colors hover:text-indigo-300"
                  >
                    {item.name}
                  </Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
