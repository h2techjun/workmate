import type { Metadata } from "next";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { getTranslations } from "next-intl/server";
import { ForeignStockTaxForm } from "@/components/tools/tax/ForeignStockTaxForm";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import type { Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({
    locale,
    namespace: "foreignStockTaxTool.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/foreign-stock-tax`,
      languages: buildLanguagesAlt("/foreign-stock-tax"),
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      type: "website",
      locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : locale === "zh" ? "zh_CN" : "en_US",
    },
  };
}

export default async function ForeignStockTaxPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const localeKey: "ko" | "en" | "zh" | "vi" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "foreignStockTaxTool",
  });
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/foreign-stock-tax" locale={localeKey} id="foreign-stock-tax" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {t("subtitle")}
          </p>
        </header>
        <ForeignStockTaxForm />
        <ToolGuide toolKey="foreign-stock-tax" locale={localeKey} />
      </div>
    </main>
  );
}
