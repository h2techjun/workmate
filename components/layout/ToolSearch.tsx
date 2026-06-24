"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Search, ArrowRight, Star } from "lucide-react";
import {
  TOOL_GROUPS,
  type ToolGroupId,
} from "@/lib/toolsCatalog";
import { useFavorites } from "@/lib/hooks/useFavorites";
import type { Locale } from "@/i18n";

interface ToolSearchProps {
  locale: Locale;
}

/** 검색 인덱스의 평탄화된 도구 1건 — toolsCatalog(단일 진실원)에서 파생 */
interface FlatTool {
  href: string;
  labelKo: string;
  labelEn: string;
  keywordsKo: string;
  groupId: ToolGroupId;
  groupTitleKo: string;
  groupTitleEn: string;
  emoji: string;
}

/** 그룹별 칩 색상 — groupId 는 안정적이므로 정적 매핑 안전 */
const GROUP_ACCENT: Record<ToolGroupId, string> = {
  electric: "bg-indigo-500/10 ring-indigo-500/30 text-indigo-300",
  timber: "bg-amber-500/10 ring-amber-500/30 text-amber-300",
  labor: "bg-emerald-500/10 ring-emerald-500/30 text-emerald-300",
  tax: "bg-yellow-500/10 ring-yellow-500/30 text-yellow-300",
  realestate: "bg-rose-500/10 ring-rose-500/30 text-rose-300",
  car: "bg-sky-500/10 ring-sky-500/30 text-sky-300",
  korea: "bg-red-500/10 ring-red-500/30 text-red-300",
  utility: "bg-cyan-500/10 ring-cyan-500/30 text-cyan-300",
  business: "bg-violet-500/10 ring-violet-500/30 text-violet-300",
  convert: "bg-teal-500/10 ring-teal-500/30 text-teal-300",
};

/** TOOL_GROUPS → 평탄화된 검색 인덱스 (모듈 1회 빌드) */
const ALL_TOOLS: ReadonlyArray<FlatTool> = TOOL_GROUPS.flatMap((group) =>
  group.tools.map((tool) => ({
    href: tool.href,
    labelKo: tool.labelKo,
    labelEn: tool.labelEn,
    keywordsKo: tool.keywordsKo,
    groupId: group.id,
    groupTitleKo: group.i18n.ko.title,
    groupTitleEn: group.i18n.en.title,
    emoji: group.emoji,
  })),
);

const TOOLS_BY_HREF = new Map(ALL_TOOLS.map((tool) => [tool.href, tool]));

export function ToolSearch({ locale }: ToolSearchProps): React.ReactElement {
  const t = useTranslations("homeSearch");
  const [query, setQuery] = useState("");
  const [focused, setFocused] = useState(false);
  const { isFavorite, toggle, favorites, hydrated } = useFavorites();
  const isEn = locale === "en";

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === "") return [];
    return ALL_TOOLS.filter((tool) => {
      const labels = `${tool.labelKo} ${tool.labelEn}`.toLowerCase();
      const keywords = tool.keywordsKo.toLowerCase();
      const group =
        `${tool.groupTitleKo} ${tool.groupTitleEn}`.toLowerCase();
      return (
        labels.includes(q) || keywords.includes(q) || group.includes(q)
      );
    }).slice(0, 8);
  }, [query]);

  const favoriteTools = useMemo(
    () =>
      favorites
        .map((href) => TOOLS_BY_HREF.get(href))
        .filter((tool): tool is FlatTool => Boolean(tool)),
    [favorites],
  );

  const hasQuery = query.trim() !== "";
  // 입력이 비어있고 포커스 상태이며 즐겨찾기가 있으면 즐겨찾기 패널 표시
  const showFavorites =
    !hasQuery && focused && hydrated && favoriteTools.length > 0;

  const Row = ({ tool }: { tool: FlatTool }): React.ReactElement => {
    const fav = isFavorite(tool.href);
    const groupTitle = isEn ? tool.groupTitleEn : tool.groupTitleKo;
    return (
      <li role="option" aria-selected={false} className="flex items-center gap-2">
        <Link
          href={`/${locale}${tool.href}`}
          onClick={() => setQuery("")}
          className="group flex min-w-0 flex-1 items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[color:var(--color-bg-card-hover)]"
        >
          <span
            className={`shrink-0 rounded-md px-2 py-0.5 text-[11px] font-semibold ring-1 ${GROUP_ACCENT[tool.groupId]}`}
          >
            {tool.emoji} {groupTitle}
          </span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm font-semibold text-[color:var(--color-text-primary)]">
              {isEn ? tool.labelEn : tool.labelKo}
            </div>
          </div>
          <ArrowRight className="h-4 w-4 shrink-0 text-[color:var(--color-text-tertiary)] transition-transform group-hover:translate-x-0.5" />
        </Link>
        <button
          type="button"
          onMouseDown={(e) => {
            // blur 로 패널이 닫히기 전에 토글되도록 mousedown 사용
            e.preventDefault();
            toggle(tool.href);
          }}
          aria-label={fav ? t("removeFavorite") : t("addFavorite")}
          aria-pressed={fav}
          className="shrink-0 rounded-lg p-2.5 text-[color:var(--color-text-tertiary)] transition-colors hover:bg-[color:var(--color-bg-card-hover)] hover:text-amber-300"
        >
          <Star
            className="h-4 w-4"
            fill={fav ? "currentColor" : "none"}
            color={fav ? "#fbbf24" : "currentColor"}
          />
        </button>
      </li>
    );
  };

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          role="combobox"
          aria-expanded={hasQuery || showFavorites}
          aria-controls="tool-search-listbox"
          aria-autocomplete="list"
          className="w-full rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] py-3 pl-11 pr-4 text-sm shadow-sm transition-all focus:border-[color:var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {hasQuery && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[60vh] overflow-y-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-2 shadow-2xl backdrop-blur">
          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-[color:var(--color-text-tertiary)]">
              {t("noResults", { query })}
            </p>
          ) : (
            <ul role="listbox" id="tool-search-listbox" className="space-y-1">
              {filtered.map((tool) => (
                <Row key={tool.href} tool={tool} />
              ))}
            </ul>
          )}
        </div>
      )}

      {showFavorites && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[60vh] overflow-y-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-2 shadow-2xl backdrop-blur">
          <p className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
            <Star className="h-3 w-3" fill="#fbbf24" color="#fbbf24" />
            {t("favorites")}
          </p>
          <ul role="listbox" id="tool-search-listbox" className="space-y-1">
            {favoriteTools.map((tool) => (
              <Row key={tool.href} tool={tool} />
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
