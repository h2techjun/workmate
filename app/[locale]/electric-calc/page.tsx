import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { ArrowRight, Cable, ShieldCheck, Activity } from "lucide-react";
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
  const titles: Record<Locale, string> = {
    ko: "산업용 전기 계산기 | Workmate",
    en: "Industrial Electric Calculator | Workmate",
    vi: "Máy tính điện công nghiệp | Workmate",
    zh: "工业电气计算器 | Workmate",
  };
  const descriptions: Record<Locale, string> = {
    ko: "KS C IEC 60364·한국전기설비규정(KEC)·내선규정 1410-1에 근거해 전선 굵기·차단기 용량·전압강하를 계산하는 산업용 전기 계산기 모음. 온도·회로 보정과 KS C 8324/8453 차단기 표준까지 반영해 실무에 바로 활용 가능합니다.",
    en: "KS C IEC 60364 wire size, breaker capacity, and voltage drop calculators for electrical professionals.",
    vi: "Máy tính dây điện, công suất aptomat (CB), sụt áp dựa trên tiêu chuẩn KS C IEC 60364. Dùng ngay cho công việc thi công điện thực tế.",
    zh: "依据KS C IEC 60364、韩国电气设备规定(KEC)与内线规定1410-1公式，计算电线线径、断路器容量与电压降的工业用电气计算器合集。同时反映温度与回路数修正及KS C 8324/8453断路器标准，可直接用于电气工程实务。",
  };
  return {
    title: titles[locale as Locale] ?? titles.ko,
    description: descriptions[locale as Locale] ?? descriptions.ko,
    alternates: {
      languages: buildLanguagesAlt("/electric-calc"),
    },
  };
}

interface CalcEntry {
  href: string | null;
  available: boolean;
  title: string;
  description: string;
  Icon: React.ComponentType<{ className?: string }>;
}

export default async function ElectricCalcPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const t = await getTranslations({
    locale: locale as Locale,
    namespace: "electricCalc",
  });
  const tLayout = await getTranslations({
    locale: locale as Locale,
    namespace: "layout",
  });
  const localeKey: "ko" | "en" | "zh" | "vi" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

  const calcs: ReadonlyArray<CalcEntry> = [
    {
      href: `/${locale}/electric-calc/wire-size`,
      available: true,
      title: t("wireSize.title"),
      description: t("wireSize.description"),
      Icon: Cable,
    },
    {
      href: `/${locale}/electric-calc/breaker`,
      available: true,
      title: t("breaker.title"),
      description: t("breaker.description"),
      Icon: ShieldCheck,
    },
    {
      href: `/${locale}/electric-calc/voltage-drop`,
      available: true,
      title: t("voltageDrop.title"),
      description: t("voltageDrop.description"),
      Icon: Activity,
    },
  ];

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/electric-calc" locale={localeKey} id="electric-hub" />

        <header className="mb-10">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            {t("title")}
          </h1>
          <p className="mt-3 max-w-2xl text-[color:var(--color-text-secondary)]">
            {t("subtitle")}
          </p>
        </header>

        <h2 className="mb-4 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          {t("hub.tools")}
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {calcs.map((c, i) => {
            const card = (
              <article
                className={`surface-card group relative flex h-full flex-col p-6 transition-all duration-200 ${
                  c.available
                    ? "hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)] hover:bg-[color:var(--color-bg-card-hover)]"
                    : "opacity-60"
                }`}
              >
                <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/10 ring-1 ring-indigo-500/30">
                  <c.Icon className="h-5 w-5 text-indigo-300" />
                </div>
                <h3 className="text-lg font-semibold">{c.title}</h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                  {c.description}
                </p>
                <div className="mt-5 flex items-center gap-1.5 text-sm font-semibold text-indigo-300 transition-colors group-hover:text-white">
                  <span>{tLayout("open")}</span>
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </div>
              </article>
            );

            if (c.available && c.href) {
              return (
                <Link key={i} href={c.href} className="block">
                  {card}
                </Link>
              );
            }
            return <div key={i}>{card}</div>;
          })}
        </div>
      </div>
    </main>
  );
}
