import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { InsulationForm } from "@/components/tools/timber/InsulationForm";
import { ToolGuide } from "@/components/tools/ToolGuide";
import type { Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "insulationTool.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/timber-calc/insulation`,
      languages: buildLanguagesAlt("/timber-calc/insulation"),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale:
        locale === "ko"
          ? "ko_KR"
          : locale === "zh"
            ? "zh_CN"
            : locale === "vi"
              ? "vi_VN"
              : "en_US",
    },
  };
}

export default async function InsulationPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "insulationTool",
  });
  const localeKey: "ko" | "en" | "zh" | "vi" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs
          path="/timber-calc/insulation"
          locale={localeKey}
          id="timber-insulation"
        />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {t("subtitle")}
          </p>
        </header>
        <InsulationForm />
        <ToolGuide toolKey="timber-insulation" locale={localeKey} />
      </div>
    </main>
  );
}
