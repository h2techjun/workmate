import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { NetSalaryForm } from "@/components/tools/labor/NetSalaryForm";
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
    ? "연봉 실수령액 계산기 — 4대보험·소득세 공제 후 월급"
    : isZh
      ? "韩国年薪实领工资计算器 — 扣除四大保险·所得税后的月薪"
      : isVi
        ? "Máy tính lương thực nhận Hàn Quốc — sau khi trừ 4 loại bảo hiểm xã hội·thuế thu nhập"
        : "Korean Salary Take-Home Calculator — net pay after tax";
  const description = isKo
    ? "연봉을 넣으면 4대보험·소득세·지방세를 공제한 월 실수령액을 즉시 계산. 부양가족·자녀·비과세 반영. 2026 요율 기준 세전→세후 한눈에."
    : isZh
      ? "输入年薪即可立即算出扣除四大保险、所得税、地方所得税后的月实领工资。反映受抚养人数、子女、免税额。按2026年费率一目了然税前→税后。"
      : isVi
        ? "Nhập mức lương năm để tính ngay lương thực nhận hàng tháng sau khi trừ 4 loại bảo hiểm xã hội, thuế thu nhập và thuế địa phương. Có tính đến người phụ thuộc, con cái và khoản miễn thuế. Theo tỷ lệ 2026."
        : "Enter your annual salary to get monthly take-home pay after the 4 insurances, income tax, and local tax. Reflects dependents and non-taxable amounts. 2026 rates.";
  const keywords = isKo
    ? [
        "연봉 실수령액",
        "연봉 계산기",
        "실수령액 계산기",
        "월급 실수령액",
        "세후 월급",
        "4대보험 공제",
        "연봉 실수령",
        "2026 연봉",
      ]
    : isZh
      ? [
          "韩国年薪实领工资计算器",
          "韩国实领工资",
          "韩国税后工资计算",
          "韩国四大保险",
          "韩国税后月薪",
        ]
      : isVi
        ? [
            "máy tính lương thực nhận Hàn Quốc",
            "lương thực nhận Hàn Quốc",
            "tính lương sau thuế Hàn Quốc",
            "4 loại bảo hiểm xã hội Hàn Quốc",
            "lương net Hàn Quốc",
          ]
        : [
            "korean salary calculator",
            "korea take home pay",
            "net salary korea",
            "korean income after tax",
          ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/net-salary`,
      languages: buildLanguagesAlt("/net-salary"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/net-salary`,
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

export default async function NetSalaryPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const lang: "ko" | "en" | "zh" | "vi" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {lang === "ko"
              ? "툴 모음"
              : lang === "zh"
                ? "所有工具"
                : lang === "vi"
                  ? "Tất cả công cụ"
                  : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {lang === "ko"
              ? "연봉 실수령액 계산기"
              : lang === "zh"
                ? "韩国年薪实领工资计算器"
                : lang === "vi"
                  ? "Máy tính lương thực nhận Hàn Quốc"
                  : "Korean Salary Take-Home Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {lang === "ko"
              ? "연봉만 넣으면 4대보험·소득세·지방세를 뺀 월 실수령액을 즉시 산출. 부양가족·자녀·비과세까지 반영해 세전→세후 한눈에."
              : lang === "zh"
                ? "只需输入年薪，即可立即算出扣除四大保险、所得税、地方所得税后的月实领工资。还反映受抚养人数、子女、免税额，税前→税后一目了然。"
                : lang === "vi"
                  ? "Chỉ cần nhập lương năm, hệ thống sẽ tính ngay lương thực nhận hàng tháng sau khi trừ 4 loại bảo hiểm xã hội, thuế thu nhập và thuế địa phương — có tính cả người phụ thuộc, con cái và khoản miễn thuế."
                  : "Enter your annual salary for instant monthly take-home pay after the 4 insurances and taxes — with dependents, children, and non-taxable amounts."}
          </p>
        </header>
        <NetSalaryForm locale={lang} />
        <ToolGuide toolKey="net-salary" locale={lang} />
      </div>
    </main>
  );
}
