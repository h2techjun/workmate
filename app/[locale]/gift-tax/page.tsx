import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { GiftTaxForm } from "@/components/tools/tax/GiftTaxForm";
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
    ? "증여세 계산기 — 관계별 공제 + 누진세율 즉시 계산"
    : isVi
      ? "Máy tính thuế tặng cho Hàn Quốc — Khấu trừ theo quan hệ + thuế suất lũy tiến"
      : "Korean Gift Tax Calculator — Deduction & Progressive Rate";
  const description = isKo
    ? "증여재산가액과 증여자 관계(배우자·자녀·기타)를 입력하면 증여재산공제·과세표준·산출세액·신고세액공제(3%)·납부세액을 즉시 계산. 상속세 및 증여세법 제53·56조 기준."
    : isVi
      ? "Nhập giá trị tài sản tặng cho và mối quan hệ với người tặng (vợ/chồng, con cái, khác) để tính ngay khấu trừ tài sản tặng cho, cơ sở tính thuế, thuế phải nộp, ưu đãi khai thuế tự nguyện (3%) và số thuế nộp cuối cùng. Dựa trên Điều 53, 56 Luật Thuế Thừa kế và Thuế Tặng cho."
      : "Calculate Korean gift tax instantly by entering gift amount and donor relationship. Covers spousal deduction (KRW 600M), lineal descendant deduction, progressive rates, and 3% self-report credit.";
  const keywords = isKo
    ? [
        "증여세 계산기",
        "증여세 계산",
        "증여재산공제",
        "배우자 증여세",
        "자녀 증여세",
        "증여세율",
        "신고세액공제",
        "증여세 납부세액",
      ]
    : isVi
      ? [
          "máy tính thuế tặng cho Hàn Quốc",
          "thuế tặng cho Hàn Quốc",
          "khấu trừ thuế tặng cho",
          "thuế tặng cho vợ chồng",
          "thuế tặng cho con cái",
          "thuế suất tặng cho",
          "ưu đãi khai thuế tự nguyện",
          "thuế tặng cho phải nộp",
        ]
      : [
          "korean gift tax calculator",
          "korea gift tax",
          "gift tax deduction korea",
          "korean inheritance gift tax",
          "spousal gift tax korea",
        ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/gift-tax`,
      languages: buildLanguagesAlt("/gift-tax"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/gift-tax`,
      locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function GiftTaxPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const lang: "ko" | "en" | "vi" | "zh" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        {/* 브레드크럼 */}
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

        {/* 헤더 */}
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {lang === "ko"
              ? "증여세 계산기"
              : lang === "zh"
                ? "赠与税计算器"
                : lang === "vi"
                  ? "Máy tính thuế tặng cho Hàn Quốc"
                  : "Korean Gift Tax Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {lang === "ko"
              ? "증여재산가액과 증여자 관계(배우자·성년 자녀·미성년 자녀·직계존속·기타)를 선택하면 증여재산공제·과세표준·산출세액·납부세액을 즉시 계산합니다. 상속세 및 증여세법 제53·56조 기준."
              : lang === "zh"
                ? "输入赠与财产价值并选择与赠与人的关系(配偶·成年子女·未成年子女·直系尊亲属·其他)，即可即时计算赠与财产扣除额、计税基数、应纳税额与实纳税额。依据《继承税及赠与税法》第53、56条。"
                : lang === "vi"
                  ? "Chọn giá trị tài sản tặng cho và mối quan hệ với người tặng (vợ/chồng · con thành niên · con chưa thành niên · trực hệ tôn thuộc · khác) để tính ngay khấu trừ tài sản tặng cho, cơ sở tính thuế, thuế phải nộp và thuế thực nộp. Dựa trên Điều 53, 56 Luật Thuế Thừa kế và Thuế Tặng cho (상속세 및 증여세법)."
                  : "Enter the gift amount and your relationship to the donor to instantly calculate Korean gift tax — including deduction by relationship, progressive rate, and 3% self-report credit."}
          </p>
        </header>

        {/* 계산기 */}
        <GiftTaxForm locale={lang} />

        {/* 가이드 (AdSense 가치 본문) */}
        <ToolGuide toolKey="gift-tax" locale={lang} />
      </div>
    </main>
  );
}
