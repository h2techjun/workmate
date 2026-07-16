import type { Metadata } from "next";
import { LoanForm } from "@/components/tools/finance/LoanForm";
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
  const isVi = locale === "vi";
  const isZh = locale === "zh";
  const title = isKo
    ? "대출 이자 계산기 — 원리금균등·원금균등·만기일시 + 상환표"
    : isVi
      ? "Máy tính lãi vay Hàn Quốc — trả góp đều gốc+lãi · trả đều gốc · trả cuối kỳ + bảng trả nợ"
      : isZh
        ? "韩国贷款利息计算器 — 等额本息·等额本金·到期还本付息 + 还款表"
        : "Loan Calculator — equal payment/principal/balloon + schedule";
  const description = isKo
    ? "주택담보대출·신용대출·전세자금대출의 원리금균등·원금균등·만기일시 3가지 상환 방식을 한 화면에서 비교합니다. 원리금균등은 매월 같은 금액, 원금균등은 초반 많고 후반 적으며, 만기일시는 이자만 내다 만기에 원금을 갚습니다. 회차별 상환표도 제공합니다."
    : isVi
      ? "Tính gộp 3 phương thức trả nợ cho vay thế chấp nhà, vay tín chấp, vay đặt cọc jeonse. Trả góp đều gốc+lãi: số tiền cố định hàng tháng; trả đều gốc: cao đầu kỳ ↓ thấp cuối kỳ; trả cuối kỳ: chỉ trả lãi hàng tháng + bảng trả nợ theo từng kỳ."
      : isZh
        ? "输入贷款金额、期限与利率，即可整合计算住房抵押贷款、信用贷款、传贳保证金贷款的三种还款方式。等额本息每月还款额固定，等额本金前期多后期少，到期还本付息期间只还利息，并提供各期本金、利息与余额的详细还款明细表。"
        : "Korean loan calculator with 3 repayment types: equal payment, equal principal, balloon. Monthly schedule included.";
  const keywords = isKo
    ? [
        "대출 이자 계산",
        "대출 계산기",
        "주택담보대출 계산",
        "원리금균등 계산",
        "원금균등 계산",
        "만기일시 대출",
        "신용대출 이자",
        "전세자금대출",
        "대출 상환 계획",
        "월 이자 계산",
        "월 상환액",
        "이자 총액",
      ]
    : isVi
      ? [
          "tính lãi vay",
          "máy tính vay Hàn Quốc",
          "tính vay thế chấp nhà",
          "tính trả góp đều gốc lãi",
          "tính trả đều gốc",
          "vay trả cuối kỳ",
          "lãi vay tín chấp",
          "vay đặt cọc jeonse",
          "kế hoạch trả nợ vay",
          "tính lãi hàng tháng",
          "số tiền trả hàng tháng",
          "tổng lãi vay",
        ]
      : isZh
        ? [
            "贷款利息计算",
            "韩国贷款计算器",
            "住房抵押贷款计算",
            "等额本息计算",
            "等额本金计算",
            "到期还本付息贷款",
            "信用贷款利息",
            "传贳保证金贷款",
            "贷款还款计划",
            "月利息计算",
            "月还款额",
            "利息总额",
          ]
        : [
        "loan calculator",
        "Korean mortgage calculator",
        "equal payment loan",
        "equal principal loan",
        "balloon loan",
        "monthly payment",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/loan-calc`,
      languages: buildLanguagesAlt("/loan-calc"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/loan-calc`,
      locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : locale === "zh" ? "zh_CN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function LoanCalcPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const lang: "ko" | "en" | "vi" | "zh" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/loan-calc" locale={lang} id="loan-calc" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo
              ? "대출 이자 계산기"
              : lang === "zh"
                ? "贷款利息计算器"
                : lang === "vi"
                  ? "Máy tính lãi vay"
                  : "Loan Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "주담대·신용대출·전세자금 — 원리금균등/원금균등/만기일시 3가지 상환 방식 한 번에 비교. 회차별 원금·이자·잔금 상환표까지."
              : lang === "zh"
                ? "住房抵押贷款·信用贷款·传贳保证金贷款 — 等额本息/等额本金/到期还本付息 3种还款方式一站比较，附各期本金·利息·余额还款表。"
                : lang === "vi"
                  ? "Vay thế chấp nhà · vay tín chấp · vay đặt cọc jeonse — so sánh cùng lúc 3 phương thức trả nợ: trả góp đều gốc+lãi / trả đều gốc / trả cuối kỳ. Kèm bảng trả nợ chi tiết gốc, lãi, số dư theo từng kỳ."
                  : "Compare 3 Korean loan repayment types in one place. Monthly schedule with principal, interest, and balance breakdown."}
          </p>
        </header>
        <LoanForm locale={lang} />
        <ToolGuide toolKey="loan-calc" locale={lang} />
      </div>
    </main>
  );
}
