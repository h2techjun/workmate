import Link from "next/link";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n";

interface FooterProps {
  locale?: Locale;
}

interface FooterLink {
  href: string;
  label: string;
}

export async function Footer({
  locale = "ko",
}: FooterProps): Promise<React.ReactElement> {
  const t = await getTranslations({ locale, namespace: "layout" });

  const groups: Array<{ heading: string; links: FooterLink[] }> = [
    {
      heading: t("footer.groupCatalog"),
      links: [
        { href: `/${locale}/tools`, label: t("tools") },
        { href: `/${locale}/games`, label: t("games") },
        { href: `/${locale}/tests`, label: t("tests") },
        { href: `/${locale}/blog`, label: t("nav.blog") },
      ],
    },
    {
      heading: t("footer.groupCompany"),
      links: [
        { href: `/${locale}/about`, label: t("nav.about") },
        { href: `/${locale}/contact`, label: t("nav.contact") },
      ],
    },
    {
      heading: t("footer.groupLegal"),
      links: [
        { href: `/${locale}/privacy`, label: t("nav.privacy") },
        { href: `/${locale}/terms`, label: t("nav.terms") },
      ],
    },
  ];

  return (
    <footer className="mt-20 border-t border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
      <div className="mx-auto max-w-6xl px-4 py-10 md:px-6 md:py-12">
        <div className="grid gap-8 md:grid-cols-4 md:gap-10">
          {/* 좌측 브랜드 영역 */}
          <div className="md:col-span-1">
            <Link
              href={`/${locale}`}
              className="inline-flex items-center gap-2 font-semibold tracking-tight text-[color:var(--color-text-primary)] transition-opacity hover:opacity-80"
            >
              <span className="grid h-7 w-7 place-items-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/30">
                W
              </span>
              <span className="text-base">Workmate</span>
            </Link>
            <p className="mt-3 text-xs leading-relaxed text-[color:var(--color-text-tertiary)]">
              {t("footer.tagline")}
            </p>
          </div>

          {/* 그룹별 링크 */}
          {groups.map((group) => (
            <nav key={group.heading} className="md:col-span-1">
              <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                {group.heading}
              </h3>
              <ul className="space-y-2 text-sm">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[color:var(--color-text-secondary)] transition-colors hover:text-[color:var(--color-text-primary)]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-10 border-t border-[color:var(--color-border-subtle)] pt-6 text-center text-xs md:text-left">
          <p className="text-[color:var(--color-text-tertiary)]">
            {t("footer.copyright")}
          </p>
          <p className="mt-1.5 text-[color:var(--color-text-muted)]">
            {t("footer.disclaimer")}
          </p>
        </div>
      </div>
    </footer>
  );
}
