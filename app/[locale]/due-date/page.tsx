import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { DueDateForm } from "@/components/tools/korean/DueDateForm";
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
  const isVi = locale === "vi";
  const title = isKo
    ? "출산예정일 계산기 — 임신 주수·삼분기·D-day"
    : isVi
      ? "Máy tính ngày dự sinh — tuần thai, tam cá nguyệt, D-day"
      : "Due Date Calculator — pregnancy weeks & trimester";
  const description = isKo
    ? "마지막 생리일(LMP)로 출산예정일을 즉시 계산. 네겔레 법칙(+280일) + 현재 임신 주수·삼분기·진행률·출산까지 남은 일수. 생리주기 보정 지원."
    : isVi
      ? "Tính ngày dự sinh ngay từ ngày đầu kỳ kinh cuối (LMP). Áp dụng quy tắc Naegele (+280 ngày) cùng tuần thai hiện tại, tam cá nguyệt, tiến độ thai kỳ và số ngày còn lại đến khi sinh. Hỗ trợ hiệu chỉnh theo chu kỳ kinh nguyệt."
      : "Calculate your due date from the last menstrual period (Naegele's rule, +280 days) with current pregnancy weeks, trimester, and days to go.";
  const keywords = isKo
    ? ["출산예정일", "출산예정일 계산기", "임신 주수 계산", "임신 계산기", "분만예정일", "네겔레"]
    : isVi
      ? ["ngày dự sinh", "máy tính ngày dự sinh", "tính tuần thai", "máy tính mang thai", "ngày sinh dự kiến", "quy tắc naegele"]
      : ["due date calculator", "pregnancy week calculator", "estimated due date", "naegele rule"];

  return {
    title, description, keywords,
    alternates: { canonical: `/${locale}/due-date`, languages: buildLanguagesAlt("/due-date") },
    openGraph: { title, description, type: "website", url: `${SITE_URL}/${locale}/due-date`, locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : "en_US" },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function DueDatePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const isVi = locale === "vi";
  const localeKey: "ko" | "en" | "vi" = isKo ? "ko" : isVi ? "vi" : "en";

  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 3600 * 1000);
  const today = {
    year: kst.getUTCFullYear(),
    month: kst.getUTCMonth() + 1,
    day: kst.getUTCDate(),
  };

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link href={`/${locale}/tools`} className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]">
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "툴 모음" : isVi ? "Tất cả công cụ" : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "출산예정일 계산기" : isVi ? "Máy tính ngày dự sinh" : "Due Date Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "마지막 생리일만 넣으면 출산예정일·현재 임신 주수·삼분기·D-day를 즉시 확인. 생리주기 보정 지원."
              : isVi
                ? "Chỉ cần nhập ngày đầu kỳ kinh cuối để xem ngay ngày dự sinh, tuần thai hiện tại, tam cá nguyệt và số ngày D-day. Hỗ trợ hiệu chỉnh theo chu kỳ kinh nguyệt."
                : "Enter your last period to instantly see the due date, current pregnancy weeks, trimester, and days to go."}
          </p>
        </header>
        <DueDateForm locale={localeKey} today={today} />
        <ToolGuide toolKey="due-date" locale={localeKey} />
      </div>
    </main>
  );
}
