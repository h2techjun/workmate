import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { F2EligibilityForm } from "@/components/tools/visa/F2EligibilityForm";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const title = isKo
    ? "F-2-7 거주비자 자격 체크리스트 — 점수제·신청요건 가이드"
    : "Korea F-2-7 Residence Visa — Eligibility Checklist & Points Guide";
  const description = isKo
    ? "F-2-7 점수제 거주비자 신청 5유형·필수요건(3년 체류 또는 연소득 4천만)·품행 요건을 체크. 80점 점수제와 영주(F-5) 경로 안내. 공식 확인 hikorea."
    : "Check your F-2-7 residence visa eligibility — 5 applicant categories, core requirements (3-yr stay or ₩40M income), conduct. Guide to the 80-point test and F-5 path. Verify at hikorea.";
  const keywords = isKo
    ? [
        "F-2-7 비자",
        "거주비자 점수제",
        "외국인 거주비자",
        "F-2 비자 자격",
        "점수제 거주",
        "영주권 F-5 경로",
      ]
    : [
        "korea F-2 visa",
        "F-2-7 visa eligibility",
        "korea residence visa points",
        "F-2 visa requirements korea",
        "korea points based visa",
        "F-2-7 to F-5 permanent residence",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/f2-residence-visa`,
      languages: buildLanguagesAlt("/f2-residence-visa"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/f2-residence-visa`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function F2ResidenceVisaPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const localeKey = isKo ? "ko" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "툴 모음" : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo
              ? "F-2-7 거주비자 자격 체크리스트"
              : "Korea F-2-7 Residence Visa Eligibility"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "영주권(F-5) 전 단계인 점수제 거주비자(F-2-7). 신청 유형과 필수 요건을 체크하고, 80점 점수제와 다음 단계를 안내합니다. 세부 배점은 비공식이라 점수는 단정하지 않습니다 — 정확한 확인은 hikorea."
              : "F-2-7 is the points-based residence visa, a step before permanent residence (F-5). Check your applicant category and core requirements, and see how the 80-point test works. Sub-scores are unofficial, so we don't assert a number — verify at hikorea."}
          </p>
        </header>
        <F2EligibilityForm locale={localeKey} />
        <ToolGuide toolKey="f2-residence-visa" locale={localeKey} />
      </div>
    </main>
  );
}
