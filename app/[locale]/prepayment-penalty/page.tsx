import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { PrepaymentPenaltyForm } from "@/components/tools/finance/PrepaymentPenaltyForm";
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
    ? "중도상환수수료 계산기 — 슬라이딩 방식·면제 기준 자동 계산"
    : isVi
      ? "Máy tính phí trả nợ trước hạn — tự động tính theo phương thức lũy tiến & tiêu chuẩn miễn phí"
      : "Loan Prepayment Penalty Calculator — sliding scale & exemption";
  const description = isKo
    ? "대출 중도상환수수료를 은행 여신거래약관 슬라이딩 방식으로 계산. 경과 개월·수수료율·면제기준기간 입력 → 수수료액·잔존일수·면제 여부 즉시 확인."
    : isVi
      ? "Tính phí trả nợ trước hạn của khoản vay ngân hàng Hàn Quốc theo công thức lũy tiến trong điều khoản giao dịch tín dụng ngân hàng. Nhập số tháng đã trôi qua, tỷ lệ phí và kỳ hạn miễn phí — xem ngay số tiền phí, số ngày còn lại và tình trạng miễn phí."
      : "Calculate Korean bank loan prepayment penalties using the sliding-scale formula. Enter elapsed months, penalty rate, and exemption period — get penalty amount and remaining days instantly.";
  const keywords = isKo
    ? [
        "중도상환수수료 계산기",
        "중도상환수수료",
        "대출 갈아타기 수수료",
        "중도상환 면제",
        "대출 조기상환",
        "슬라이딩 수수료",
        "중도상환 3년 면제",
        "은행 여신거래약관",
        "주택담보대출 중도상환",
        "신용대출 중도상환수수료",
      ]
    : isVi
      ? [
          "máy tính phí trả nợ trước hạn",
          "phí trả nợ trước hạn",
          "phí chuyển đổi khoản vay",
          "miễn phí trả nợ trước hạn",
          "trả nợ vay trước hạn",
          "phí lũy tiến",
          "miễn phí sau 3 năm",
          "điều khoản giao dịch tín dụng ngân hàng",
          "trả nợ trước hạn vay thế chấp nhà",
          "phí trả nợ trước hạn vay tín chấp",
        ]
      : [
        "prepayment penalty calculator",
        "Korean loan prepayment fee",
        "loan early repayment penalty",
        "mortgage prepayment fee Korea",
        "loan switching fee",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/prepayment-penalty`,
      languages: buildLanguagesAlt("/prepayment-penalty"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/prepayment-penalty`,
      locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function PrepaymentPenaltyPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const localeKey: "ko" | "en" | "vi" =
    locale === "ko" ? "ko" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {localeKey === "ko" ? "툴 모음" : localeKey === "vi" ? "Tất cả công cụ" : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo
              ? "중도상환수수료 계산기"
              : localeKey === "vi"
                ? "Máy tính phí trả nợ trước hạn"
                : "Prepayment Penalty Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "대출 갈아타기·조기 상환 시 발생하는 중도상환수수료를 은행 여신거래약관 슬라이딩 방식으로 계산. 경과 개월과 수수료율만 입력하면 수수료액·잔존일수·면제 여부를 즉시 확인."
              : localeKey === "vi"
                ? "Tính phí trả nợ trước hạn phát sinh khi chuyển đổi khoản vay hoặc trả nợ sớm, theo công thức lũy tiến trong điều khoản giao dịch tín dụng ngân hàng. Chỉ cần nhập số tháng đã trôi qua và tỷ lệ phí, bạn sẽ thấy ngay số tiền phí, số ngày còn lại và tình trạng miễn phí."
                : "Calculate the prepayment penalty for Korean bank loans using the sliding-scale formula from standard lending terms. Enter elapsed months and penalty rate to instantly check penalty amount, remaining days, and exemption status."}
          </p>
        </header>
        <PrepaymentPenaltyForm locale={localeKey} />
        <ToolGuide toolKey="prepayment-penalty" locale={localeKey} />
      </div>
    </main>
  );
}
