import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { UnemploymentBenefitForm } from "@/components/tools/labor/UnemploymentBenefitForm";
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
  const isZh = locale === "zh";
  const isVi = locale === "vi";

  const title = isKo
    ? "실업급여 계산기 — 구직급여 예상 수령액·소정급여일수"
    : isZh
      ? "韩国失业津贴计算器 — 求职津贴预计领取金额·规定给付天数"
      : isVi
        ? "Máy tính trợ cấp thất nghiệp Hàn Quốc — Số tiền dự kiến·số ngày hưởng"
        : "Korean Unemployment Benefit Calculator — Estimated Payout & Benefit Days";
  const description = isKo
    ? "평균임금·나이·고용보험 가입기간을 입력하면 1일 구직급여와 총 예상 수령액을 즉시 계산. 2019년 개정 소정급여일수표·상한 66,000원·2025 최저임금 하한 적용."
    : isZh
      ? "输入平均工资、年龄、雇佣保险加入期间，即可立即算出每日求职津贴与总预计领取金额。适用2019年修订版规定给付天数表、上限66,000韩元、2025年最低工资下限。"
      : isVi
        ? "Nhập mức lương bình quân, tuổi và thời gian tham gia bảo hiểm việc làm để tính ngay trợ cấp thất nghiệp theo ngày và tổng số tiền dự kiến nhận. Áp dụng bảng số ngày hưởng sửa đổi 2019, mức trần 66.000 KRW và mức sàn lương tối thiểu 2025."
        : "Enter average wage, age, and insurance period to instantly calculate daily unemployment benefit and total payout. Applies 2019 revised benefit-days table, 66,000 KRW daily cap, and 2025 minimum wage floor.";
  const keywords = isKo
    ? [
        "실업급여 계산기",
        "구직급여 계산기",
        "실업급여 얼마",
        "소정급여일수",
        "고용보험 수령액",
        "실업급여 상한",
        "실업급여 하한",
        "구직급여 일수",
      ]
    : isZh
      ? [
          "韩国失业津贴计算器",
          "韩国失业津贴多少钱",
          "韩国雇佣保险",
          "规定给付天数",
          "求职津贴计算",
          "韩国失业补助金",
        ]
      : isVi
        ? [
            "máy tính trợ cấp thất nghiệp Hàn Quốc",
            "trợ cấp thất nghiệp Hàn Quốc là bao nhiêu",
            "bảo hiểm việc làm Hàn Quốc",
            "số ngày hưởng trợ cấp thất nghiệp",
            "구직급여 tiếng Việt",
            "cách tính trợ cấp thất nghiệp Hàn Quốc",
          ]
        : [
            "Korean unemployment benefit calculator",
            "Korea severance unemployment",
            "구직급여 English",
            "employment insurance Korea payout",
          ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/unemployment-benefit`,
      languages: buildLanguagesAlt("/unemployment-benefit"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/unemployment-benefit`,
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

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function UnemploymentBenefitPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const localeKey = isKo
    ? "ko"
    : locale === "zh"
      ? "zh"
      : locale === "vi"
        ? "vi"
        : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {localeKey === "ko"
              ? "툴 모음"
              : localeKey === "zh"
                ? "所有工具"
                : localeKey === "vi"
                  ? "Tất cả công cụ"
                  : "All tools"}
          </Link>
        </nav>

        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {localeKey === "ko"
              ? "실업급여(구직급여) 계산기"
              : localeKey === "zh"
                ? "韩国失业津贴（求职津贴）计算器"
                : localeKey === "vi"
                  ? "Máy tính trợ cấp thất nghiệp (구직급여)"
                  : "Korean Unemployment Benefit Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {localeKey === "ko"
              ? "평균임금·고용보험 가입기간·나이를 입력하면 1일 구직급여와 총 예상 수령액을 즉시 산출. 2019.10.1 개정 소정급여일수표 및 2025 기준 상한·하한 반영."
              : localeKey === "zh"
                ? "输入平均工资、雇佣保险加入期间、年龄，即可立即算出每日求职津贴与总预计领取金额。反映2019年10月1日修订版规定给付天数表及2025年标准上下限。"
                : localeKey === "vi"
                  ? "Nhập mức lương bình quân, thời gian tham gia bảo hiểm việc làm và tuổi để tính ngay trợ cấp theo ngày và tổng số tiền dự kiến nhận. Áp dụng bảng số ngày hưởng sửa đổi từ 1/10/2019 và mức trần·sàn theo chuẩn 2025."
                  : "Enter your average wage, employment insurance period, and age to instantly calculate daily benefit and total estimated payout — using the 2019 revised benefit-days table and 2025 cap/floor."}
          </p>
        </header>

        <UnemploymentBenefitForm locale={localeKey} />
        <ToolGuide
          toolKey="unemployment-benefit"
          locale={localeKey}
        />
      </div>
    </main>
  );
}
