import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { HeaderNav } from "./HeaderNav";
import { ThemeToggle } from "./ThemeToggle";
import type { Locale } from "@/i18n";

interface HeaderProps {
  locale: Locale;
}

export async function Header({
  locale,
}: HeaderProps): Promise<React.ReactElement> {
  const t = await getTranslations({ locale, namespace: "layout" });

  const navItems = [
    { href: `/${locale}/tools`, label: t("tools"), pathMatch: "/tools" },
    { href: `/${locale}/games`, label: t("games"), pathMatch: "/games" },
    { href: `/${locale}/tests`, label: t("tests"), pathMatch: "/tests" },
    { href: `/${locale}/learn`, label: t("learn"), pathMatch: "/learn" },
    { href: `/${locale}/blog`, label: t("nav.blog"), pathMatch: "/blog" },
  ];

  return (
    <header className="sticky top-0 z-40 surface-glass border-b border-[color:var(--color-border-subtle)]">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 md:h-16 md:px-6">
        <Link
          href={`/${locale}`}
          className="flex shrink-0 items-center gap-2 font-semibold tracking-tight text-[color:var(--color-text-primary)] transition-opacity hover:opacity-80"
        >
          <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/30">
            W
          </span>
          <span className="text-base md:text-lg">Workmate</span>
        </Link>

        <HeaderNav items={navItems} locale={locale}>
          <ThemeToggle label={t("themeToggle")} />
          <LanguageSwitcher currentLocale={locale} />
        </HeaderNav>
      </div>
    </header>
  );
}
