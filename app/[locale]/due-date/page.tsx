import type { Metadata } from "next";
import { DueDateForm } from "@/components/tools/korean/DueDateForm";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
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
  const isZh = locale === "zh";
  const isVi = locale === "vi";
  const title = isKo
    ? "출산예정일 계산기 — 임신 주수·삼분기·D-day"
    : isZh
      ? "预产期计算器 — 孕周·孕期阶段·D-day"
      : isVi
        ? "Máy tính ngày dự sinh — tuần thai, tam cá nguyệt, D-day"
        : "Due Date Calculator — pregnancy weeks & trimester";
  const description = isKo
    ? "마지막 생리일(LMP)로 출산예정일을 즉시 계산. 네겔레 법칙(+280일) + 현재 임신 주수·삼분기·진행률·출산까지 남은 일수. 생리주기 보정 지원."
    : isZh
      ? "根据末次月经日期(LMP)即时计算预产期。采用内格勒法则(+280天)，同时显示当前孕周·孕期阶段·进度·距预产期剩余天数。支持月经周期修正。"
      : isVi
        ? "Tính ngày dự sinh ngay từ ngày đầu kỳ kinh cuối (LMP). Áp dụng quy tắc Naegele (+280 ngày) cùng tuần thai hiện tại, tam cá nguyệt, tiến độ thai kỳ và số ngày còn lại đến khi sinh. Hỗ trợ hiệu chỉnh theo chu kỳ kinh nguyệt."
        : "Calculate your due date from the last menstrual period (Naegele's rule, +280 days) with current pregnancy weeks, trimester, and days to go.";
  const keywords = isKo
    ? ["출산예정일", "출산예정일 계산기", "임신 주수 계산", "임신 계산기", "분만예정일", "네겔레"]
    : isZh
      ? ["预产期", "预产期计算器", "孕周计算", "怀孕计算器", "分娩预定日", "内格勒法则"]
      : isVi
        ? ["ngày dự sinh", "máy tính ngày dự sinh", "tính tuần thai", "máy tính mang thai", "ngày sinh dự kiến", "quy tắc naegele"]
        : ["due date calculator", "pregnancy week calculator", "estimated due date", "naegele rule"];

  return {
    title, description, keywords,
    alternates: { canonical: `/${locale}/due-date`, languages: buildLanguagesAlt("/due-date") },
    openGraph: { title, description, type: "website", url: `${SITE_URL}/${locale}/due-date`, locale: locale === "ko" ? "ko_KR" : locale === "zh" ? "zh_CN" : locale === "vi" ? "vi_VN" : "en_US" },
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
  const localeKey: "ko" | "en" | "vi" | "zh" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

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
        <Breadcrumbs path="/due-date" locale={localeKey} id="due-date" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo
              ? "출산예정일 계산기"
              : localeKey === "zh"
                ? "预产期计算器"
                : localeKey === "vi"
                  ? "Máy tính ngày dự sinh"
                  : "Due Date Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "마지막 생리일만 넣으면 출산예정일·현재 임신 주수·삼분기·D-day를 즉시 확인. 생리주기 보정 지원."
              : localeKey === "zh"
                ? "只需输入末次月经日期，即可立即查看预产期·当前孕周·孕期阶段·D-day。支持月经周期修正。"
                : localeKey === "vi"
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
