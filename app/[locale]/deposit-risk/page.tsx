import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { DepositRiskForm } from "@/components/tools/realestate/DepositRiskForm";
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
  const isKo = locale !== "en";
  const title = isKo
    ? "깡통전세 위험도 계산기 — 부채비율·전세가율로 보증금 안전 진단"
    : "Underwater Jeonse Risk Calculator — Is Your Korea Deposit Safe?";
  const description = isKo
    ? "매매 시세·선순위 채권·내 보증금을 넣으면 전세가율과 부채비율((선순위+보증금)÷시세)로 깡통전세 위험을 진단하고, 경매 시 예상 회수액·손실까지 시뮬레이션합니다. 통상 안전선(70~80%) 기준 안내 + 전세사기 방지 링크."
    : "Enter market price, senior debt, and your deposit to gauge underwater-jeonse risk from the jeonse ratio and debt ratio ((senior + deposit) ÷ price), plus an auction-recovery loss simulation. Rule-of-thumb safe lines (70–80%) explained.";
  const keywords = isKo
    ? [
        "깡통전세 계산기",
        "전세가율 계산",
        "부채비율 전세",
        "보증금 안전 진단",
        "전세 위험도",
        "경매 보증금 회수",
      ]
    : [
        "underwater jeonse",
        "jeonse risk calculator",
        "korea deposit safety",
        "jeonse to value ratio",
        "korea rental deposit risk",
        "jeonse debt ratio",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/deposit-risk`,
      languages: buildLanguagesAlt("/deposit-risk"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/deposit-risk`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function DepositRiskPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale !== "en";
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
              ? "깡통전세 위험도 계산기"
              : "Underwater Jeonse Risk Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "보증금이 집값 대비 안전한지 숫자로 확인하세요. 선순위 채권까지 반영한 부채비율과, 최악의 경우(경매) 예상 회수액·손실을 함께 보여줍니다. 임계값은 업계 통용 경험칙이며, 계약 전 반드시 등기부등본과 전문가 확인이 필요합니다."
              : "Check whether your deposit is safe against the property's value — in numbers. It computes the debt ratio (including senior mortgages) and simulates worst-case recovery and loss at auction. Thresholds are industry rules of thumb; always verify the property register and consult a professional before signing."}
          </p>
        </header>
        <DepositRiskForm locale={localeKey} />
        <ToolGuide toolKey="deposit-risk" locale={localeKey} />
      </div>
    </main>
  );
}
