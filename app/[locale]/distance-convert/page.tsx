import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { DistanceConverter } from "@/components/tools/unit/DistanceConverter";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";

interface PageProps { params: Promise<{ locale: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const title = isKo ? "거리 단위 변환 — 리·자 ↔ km·마일" : "Korean Distance Converter — ri/ja ↔ km/mile";
  const description = isKo
    ? "한국 전통 거리 단위(리·자·보)를 km·미터·마일로 즉시 변환. 1리 ≈ 392.7m, 십리 ≈ 3.93km. 사극·고문헌·국토 표현 이해에."
    : "Convert Korean traditional distance units (ri, ja, bo) to km, meters, and miles. 1 ri ≈ 392.7 m, 10 ri ≈ 3.93 km.";
  const keywords = isKo
    ? ["거리 단위 변환", "리 km 변환", "자 미터", "십리 거리", "한국 전통 거리"]
    : ["korean ri to km", "korean distance unit", "ri ja converter"];
  return { title, description, keywords, alternates: { canonical: `/${locale}/distance-convert`, languages: buildLanguagesAlt("/distance-convert") }, openGraph: { title, description, type: "website", url: `${SITE_URL}/${locale}/distance-convert`, locale: locale === "ko" ? "ko_KR" : "en_US" } };
}
export function generateStaticParams(): Array<{ locale: string }> { return locales.map((locale) => ({ locale })); }

export default async function DistanceConvertPage({ params }: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const localeKey = isKo ? "ko" : "en";
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link href={`/${locale}/tools`} className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"><ChevronLeft className="h-4 w-4" />{isKo ? "툴 모음" : "All tools"}</Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{isKo ? "거리 단위 변환 (리·자)" : "Korean Distance Converter"}</h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">{isKo ? "한국 전통 거리 단위(리·자·보)를 km·미터·마일로 즉시 변환. 십리가 몇 km인지 한 번에." : "Convert Korean traditional distance units to km, meters, and miles in one place."}</p>
        </header>
        <DistanceConverter locale={localeKey} />
        <ToolGuide toolKey="distance-convert" locale={localeKey} />
      </div>
    </main>
  );
}
