import Link from "next/link";
import { ChevronLeft, Construction } from "lucide-react";
import { getTranslations } from "next-intl/server";
import type { Locale } from "@/i18n";

interface ComingSoonProps {
  locale: Locale;
  toolKey: "breaker" | "voltageDrop";
}

export async function ComingSoon({
  locale,
  toolKey,
}: ComingSoonProps): Promise<React.ReactElement> {
  const t = await getTranslations({ locale, namespace: "electricCalc" });
  const toolT = await getTranslations({
    locale,
    namespace: `electricCalc.${toolKey}`,
  });

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/electric-calc`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {t("comingSoon.back")}
          </Link>
        </nav>

        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {toolT("title")}
          </h1>
          <p className="mt-2.5 text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {toolT("description")}
          </p>
        </header>

        <div className="surface-card p-8 text-center md:p-12">
          <div className="mx-auto mb-5 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 ring-1 ring-amber-500/30">
            <Construction className="h-6 w-6 text-amber-300" />
          </div>
          <h2 className="text-xl font-semibold">{t("comingSoon.title")}</h2>
          <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            {t("comingSoon.description")}
          </p>
          <Link
            href={`/${locale}/electric-calc`}
            className="btn-primary mt-6 inline-flex"
          >
            {t("comingSoon.back")}
          </Link>
        </div>
      </div>
    </main>
  );
}
