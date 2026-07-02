import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { JeonseWolseForm } from "@/components/tools/realestate/JeonseWolseForm";
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
    ? "전세 ↔ 월세 환산기 + 전세사기 방지 체크리스트 (외국인 가이드)"
    : isVi
      ? "Chuyển đổi Jeonse ↔ Wolse + Danh sách phòng chống lừa đảo tiền đặt cọc (hướng dẫn cho người nước ngoài)"
      : "Korea Jeonse ↔ Wolse Converter + Deposit Scam Checklist";
  const description = isKo
    ? "전월세전환율(법정 상한 4.5%)로 전세↔월세를 양방향 환산. 2022~2023 전세사기 사태와 외국인이 보증금을 지키는 단계별 방지 체크리스트(등기부·확정일자·전입신고·보증보험)까지."
    : isVi
      ? "Chuyển đổi hai chiều giữa jeonse (tiền đặt cọc) và wolse (tiền thuê hàng tháng) theo tỷ lệ chuyển đổi của Hàn Quốc (mức trần pháp lý 4,5%). Kèm bối cảnh làn sóng lừa đảo tiền đặt cọc 2022–2023 và danh sách từng bước để bảo vệ tiền đặt cọc của bạn với tư cách người nước ngoài."
      : "Convert jeonse ↔ monthly rent with Korea's conversion rate (legal cap 4.5%). Plus the 2022–2023 deposit-scam context and a step-by-step checklist to protect your deposit as a foreigner.";
  const keywords = isKo
    ? [
        "전세 월세 환산",
        "전월세전환율",
        "전세사기 방지",
        "보증금 지키기",
        "전세 보증보험",
        "외국인 전세 계약",
      ]
    : isVi
      ? [
          "chuyển đổi jeonse wolse",
          "máy tính jeonse Hàn Quốc",
          "lừa đảo tiền đặt cọc Hàn Quốc",
          "phòng chống lừa đảo jeonse",
          "bảo hiểm tiền đặt cọc jeonse",
          "hợp đồng jeonse người nước ngoài",
        ]
      : [
          "jeonse wolse converter",
          "korea jeonse calculator",
          "korea deposit scam",
          "jeonse fraud prevention",
          "korea rent deposit foreigner",
          "jeonse insurance HUG",
        ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/jeonse-wolse`,
      languages: buildLanguagesAlt("/jeonse-wolse"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/jeonse-wolse`,
      locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function JeonseWolsePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const lang: "ko" | "en" | "vi" = locale === "ko" ? "ko" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {lang === "ko" ? "툴 모음" : lang === "vi" ? "Tất cả công cụ" : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {lang === "ko"
              ? "전세 ↔ 월세 환산기 + 전세사기 방지"
              : lang === "vi"
                ? "Chuyển đổi Jeonse ↔ Wolse + Phòng chống lừa đảo"
                : "Korea Jeonse ↔ Wolse Converter + Scam Protection"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {lang === "ko"
              ? "전세 보증금과 월세는 전월세전환율(법정 상한 4.5%)로 환산됩니다. 양방향으로 계산하고, 한국 전세사기 사태와 보증금을 지키는 방지 체크리스트(아래 가이드)도 확인하세요."
              : lang === "vi"
                ? "Tiền đặt cọc jeonse và tiền thuê hàng tháng được chuyển đổi qua tỷ lệ chuyển đổi của Hàn Quốc (mức trần pháp lý 4,5%). Tính cả hai chiều, và xem bối cảnh lừa đảo tiền đặt cọc tại Hàn Quốc cùng danh sách phòng chống (hướng dẫn bên dưới) để bảo vệ tiền của bạn."
                : "Jeonse deposits and monthly rent convert via Korea's conversion rate (legal cap 4.5%). Convert both ways, and read the deposit-scam context and the checklist below to protect your money."}
          </p>
        </header>
        <JeonseWolseForm locale={lang} />
        <ToolGuide toolKey="jeonse-wolse" locale={lang} />
      </div>
    </main>
  );
}
