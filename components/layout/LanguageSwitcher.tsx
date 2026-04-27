"use client";

import { usePathname, useRouter } from "next/navigation";
import { locales, type Locale } from "@/i18n";

interface LanguageSwitcherProps {
  currentLocale: Locale;
}

export function LanguageSwitcher({
  currentLocale,
}: LanguageSwitcherProps): React.ReactElement {
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (next: Locale): void => {
    if (next === currentLocale) return;
    const segments = pathname.split("/");
    const idx = segments.findIndex((s) => locales.includes(s as Locale));
    if (idx >= 0) {
      segments[idx] = next;
      router.push(segments.join("/") || "/");
    } else {
      router.push(`/${next}`);
    }
  };

  return (
    <div className="flex items-center rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-0.5">
      {locales.map((loc) => {
        const isActive = loc === currentLocale;
        return (
          <button
            key={loc}
            type="button"
            onClick={() => switchTo(loc)}
            aria-pressed={isActive}
            className={`rounded-md px-2.5 py-1 text-xs font-semibold uppercase transition-colors ${
              isActive
                ? "bg-[color:var(--color-bg-card-hover)] text-[color:var(--color-text-primary)]"
                : "text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-primary)]"
            }`}
          >
            {loc}
          </button>
        );
      })}
    </div>
  );
}
