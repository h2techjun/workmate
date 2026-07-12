import type { Metadata } from "next";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { getTranslations } from "next-intl/server";
import { InsuranceForm } from "@/components/tools/insurance/InsuranceForm";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import type { Locale } from "@/i18n";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "insuranceTool.meta" });
  return {
    title: t("title"),
    description: t("description"),
    alternates: {
      canonical: `/${locale}/insurance-calc`,
      languages: {
        ko: "/ko/insurance-calc",
        en: "/en/insurance-calc",
        zh: "/zh/insurance-calc",
        vi: "/vi/insurance-calc",
      },
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

export default async function InsuranceCalcPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const localeKey: "ko" | "en" | "zh" | "vi" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "insuranceTool",
  });
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/insurance-calc" locale={localeKey} id="insurance-calc" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t("title")}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {t("subtitle")}
          </p>
        </header>
        <InsuranceForm />
        <ToolGuide
          toolKey="insurance-calc"
          locale={locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en"}
        />
      </div>
    </main>
  );
}
