import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "./LanguageSwitcher";
import type { Locale } from "@/i18n";

interface HeaderProps {
  locale: Locale;
}

export async function Header({ locale }: HeaderProps): Promise<React.ReactElement> {
  const t = await getTranslations({ locale, namespace: "layout" });

  const navItems = [
    { href: `/${locale}/tools`, label: t("tools") },
    { href: `/${locale}/games`, label: t("games") },
    { href: `/${locale}/tests`, label: t("tests") },
  ];

  return (
    <header className="sticky top-0 z-40 surface-glass border-b border-[color:var(--color-border-subtle)]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 md:h-16 md:px-6">
        <Link
          href={`/${locale}`}
          className="flex items-center gap-2 font-semibold tracking-tight text-[color:var(--color-text-primary)] transition-opacity hover:opacity-80"
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/30">
            W
          </span>
          <span className="text-base md:text-lg">Workmate</span>
        </Link>

        <nav className="flex items-center gap-1 md:gap-2">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-2.5 py-1.5 text-sm font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-bg-card)] hover:text-[color:var(--color-text-primary)] md:px-3"
            >
              {item.label}
            </Link>
          ))}
          <LanguageSwitcher currentLocale={locale} />
        </nav>
      </div>
    </header>
  );
}
