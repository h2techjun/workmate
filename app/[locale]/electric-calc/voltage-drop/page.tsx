import type { Metadata } from "next";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { getTranslations } from "next-intl/server";
import { VoltageDropForm } from "@/components/tools/electric-calc/VoltageDropForm";
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
  const t = await getTranslations({
    locale,
    namespace: "voltageDropTool.meta",
  });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/electric-calc/voltage-drop`,
      languages: buildLanguagesAlt("/electric-calc/voltage-drop"),
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

export default async function VoltageDropPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "voltageDropTool",
  });
  const localeKey: "ko" | "en" | "zh" | "vi" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs
          path="/electric-calc/voltage-drop"
          locale={localeKey}
          id="electric-voltage-drop"
        />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {t("subtitle")}
          </p>
        </header>
        <VoltageDropForm />
        <ToolGuide toolKey="electric-voltage-drop" locale={localeKey} />
      </div>
    </main>
  );
}
