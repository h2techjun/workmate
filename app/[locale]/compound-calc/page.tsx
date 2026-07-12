import type { Metadata } from "next";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { CompoundForm } from "@/components/tools/finance/CompoundForm";
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
    ? "복리 계산기 — 기본·적립식 + 회차별·연차별 상세표"
    : isVi
      ? "Máy tính lãi kép — một lần & tích lũy, kèm bảng chi tiết theo kỳ"
      : "Compound Interest Calculator — lump-sum & recurring, with schedule";
  const description = isKo
    ? "기본(목돈 복리)과 적립식(매월 적립)을 한 화면에서. 회차별·연차별 상세표로 매 기간 수익·총액·수익률까지. 연복리/월복리·년/개월·년/월 이율 선택. 예금·적금·장기 투자 비교용."
    : isVi
      ? "Lãi kép một lần (số tiền gốc) và tích lũy (gửi hàng tháng) trong cùng một màn hình. Bảng chi tiết theo kỳ và theo năm hiển thị lợi nhuận, tổng số dư, tỷ suất sinh lời ở mỗi giai đoạn. Chọn lãi kép theo năm/tháng, đơn vị năm/tháng. Dùng để so sánh tiền gửi, tiết kiệm tích lũy và đầu tư dài hạn."
      : "Lump-sum and recurring compound interest in one place, with a period-by-period and year-by-year schedule. Annual/monthly compounding, year/month units. For deposits, savings, and long-term investing.";
  const keywords = isKo
    ? [
        "복리 계산기",
        "복리 계산",
        "복리 공식",
        "예금 이자 계산",
        "적금 계산기",
        "투자 수익률",
        "CAGR 계산",
        "EAR 실효이율",
        "월복리",
        "연복리",
        "정기 적립 계산",
        "재무 계산기",
      ]
    : isVi
      ? [
          "máy tính lãi kép",
          "tính lãi kép",
          "công thức lãi kép",
          "tính lãi tiền gửi",
          "máy tính tiết kiệm tích lũy",
          "tỷ suất sinh lời đầu tư",
          "tính CAGR",
          "lãi suất hiệu dụng EAR",
          "lãi kép theo tháng",
          "lãi kép theo năm",
          "tính tiết kiệm định kỳ",
          "máy tính tài chính",
        ]
      : [
        "compound interest calculator",
        "compound calculator",
        "future value FV",
        "rate per period",
        "periodic contribution",
        "savings calculator",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/compound-calc`,
      languages: buildLanguagesAlt("/compound-calc"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/compound-calc`,
      locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function CompoundCalcPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const lang: "ko" | "en" | "vi" | "zh" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/compound-calc" locale={lang} id="compound-calc" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {lang === "ko"
              ? "복리 계산기"
              : lang === "zh"
                ? "复利计算器"
                : lang === "vi"
                  ? "Máy tính lãi kép"
                  : "Compound Interest Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {lang === "ko"
              ? "기본(목돈 복리)과 적립식(매월 적립) 두 가지 모드. 회차별·연차별 상세표로 매 기간 수익·총액·수익률을 한눈에. 예금·적금·장기 투자 비교에."
              : lang === "zh"
                ? "基本(整存复利)与定投(每月存入)两种模式。按期·按年详细表格一览每期收益、总额、收益率。适用于存款、定期存款、长期投资比较。"
                : lang === "vi"
                  ? "Hai chế độ — một lần (lãi kép trên số tiền gốc) và tích lũy (gửi hàng tháng). Bảng chi tiết theo kỳ và theo năm hiển thị lợi nhuận, tổng số dư và tỷ suất sinh lời ở mỗi bước. Dùng để so sánh tiền gửi, tiết kiệm tích lũy và đầu tư dài hạn."
                  : "Two modes — lump-sum and recurring (monthly deposits). A period-by-period and year-by-year schedule shows the profit, balance, and return at every step."}
          </p>
        </header>
        <CompoundForm locale={lang} />
        <ToolGuide toolKey="compound-calc" locale={lang} />
      </div>
    </main>
  );
}
