"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { Search, ArrowRight } from "lucide-react";
import { TOOLS, type ToolCategory } from "@/lib/tools-registry";
import type { Locale } from "@/i18n";

interface ToolSearchProps {
  locale: Locale;
}

const CATEGORY_ACCENT: Record<ToolCategory, string> = {
  electric: "text-indigo-300",
  timber: "text-amber-300",
  finance: "text-emerald-300",
  util: "text-cyan-300",
  business: "text-rose-300",
};

const CATEGORY_BG: Record<ToolCategory, string> = {
  electric: "bg-indigo-500/10 ring-indigo-500/30",
  timber: "bg-amber-500/10 ring-amber-500/30",
  finance: "bg-emerald-500/10 ring-emerald-500/30",
  util: "bg-cyan-500/10 ring-cyan-500/30",
  business: "bg-rose-500/10 ring-rose-500/30",
};

export function ToolSearch({ locale }: ToolSearchProps): React.ReactElement {
  const t = useTranslations("homeSearch");
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (q === "") return [];
    return TOOLS.filter((tool) => {
      const title = t(`tools.${tool.i18nKey}.title`).toLowerCase();
      const desc = t(`tools.${tool.i18nKey}.description`).toLowerCase();
      const keywords = t(`tools.${tool.i18nKey}.keywords`).toLowerCase();
      const cat = t(`category.${tool.category}`).toLowerCase();
      return (
        title.includes(q) ||
        desc.includes(q) ||
        keywords.includes(q) ||
        cat.includes(q)
      );
    }).slice(0, 8);
  }, [query, t]);

  return (
    <div className="relative mx-auto max-w-2xl">
      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--color-text-tertiary)]" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("placeholder")}
          aria-label={t("placeholder")}
          className="w-full rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] py-3 pl-11 pr-4 text-sm shadow-sm transition-all focus:border-[color:var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
        />
      </div>

      {query.trim() !== "" && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 max-h-[60vh] overflow-y-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-2 shadow-2xl backdrop-blur">
          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-[color:var(--color-text-tertiary)]">
              {t("noResults", { query })}
            </p>
          ) : (
            <ul className="space-y-1">
              {filtered.map((tool) => (
                <li key={tool.path}>
                  <Link
                    href={`/${locale}${tool.path}`}
                    onClick={() => setQuery("")}
                    className="group flex items-center gap-3 rounded-lg px-3 py-2.5 transition-colors hover:bg-[color:var(--color-bg-card-hover)]"
                  >
                    <span
                      className={`shrink-0 rounded-md px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider ring-1 ${CATEGORY_BG[tool.category]} ${CATEGORY_ACCENT[tool.category]}`}
                    >
                      {t(`category.${tool.category}`)}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-sm font-semibold text-[color:var(--color-text-primary)]">
                        {t(`tools.${tool.i18nKey}.title`)}
                      </div>
                      <div className="truncate text-xs text-[color:var(--color-text-tertiary)]">
                        {t(`tools.${tool.i18nKey}.description`)}
                      </div>
                    </div>
                    <ArrowRight className="h-4 w-4 shrink-0 text-[color:var(--color-text-tertiary)] transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
