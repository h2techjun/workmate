import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n";

interface FooterProps {
  locale?: Locale;
}

export async function Footer({
  locale = "ko",
}: FooterProps): Promise<React.ReactElement> {
  const t = await getTranslations({ locale, namespace: "layout" });

  return (
    <footer className="mt-16 border-t border-[color:var(--color-border-subtle)] py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 px-4 text-center text-xs md:px-6">
        <nav className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[color:var(--color-text-secondary)]">
          <Link
            href={`/${locale}/about`}
            className="transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            {t("nav.about")}
          </Link>
          <Link
            href={`/${locale}/privacy`}
            className="transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            {t("nav.privacy")}
          </Link>
          <Link
            href={`/${locale}/terms`}
            className="transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            {t("nav.terms")}
          </Link>
          <Link
            href={`/${locale}/contact`}
            className="transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            {t("nav.contact")}
          </Link>
        </nav>
        <div className="text-[color:var(--color-text-tertiary)]">
          <p>{t("footer.copyright")}</p>
          <p className="mt-1 text-[color:var(--color-text-muted)]">
            {t("footer.disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
