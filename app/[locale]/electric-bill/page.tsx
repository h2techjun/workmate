import type { Metadata } from "next";
import { ElectricBillForm } from "@/components/tools/utility/ElectricBillForm";
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
    ? "전기요금 계산기 — 주택용 누진제 + 여름철 + 부가세"
    : isZh
      ? "韩国电费计算器 — 住宅用累进电价 + 夏季优惠 + 增值税"
      : isVi
        ? "Máy tính tiền điện Hàn Quốc — biểu giá lũy tiến"
        : "Korean Electricity Bill Calculator — progressive tariff";
  const description = isKo
    ? "월 사용량(kWh)으로 전기요금을 즉시 계산합니다. 주택용 저압·고압 누진제 3단계, 여름철 완화 구간, 기후환경요금, 연료비조정액, 부가세, 전력산업기반기금까지 한전 2024년 요금 기준으로 정확히 반영합니다."
    : isZh
      ? "根据月用电量(kWh)即时计算电费金额。涵盖住宅用低压·高压累进电价3档、夏季缓和区间、气候环境费、燃料费调整额、增值税与电力产业基础基金，均以韩国电力公社(KEPCO)2024年标准精确核算，结果即时可见。"
      : isVi
        ? "Nhập lượng điện tiêu thụ hàng tháng (kWh) để tính ngay tiền điện. Biểu giá điện lũy tiến 3 bậc (áp thấp/áp cao) + giảm nhẹ mùa hè + phí khí hậu-môi trường + điều chỉnh nhiên liệu + VAT + quỹ điện lực, theo biểu giá KEPCO 2024."
        : "Calculate your Korean residential electricity bill from monthly kWh. KEPCO progressive tariff (3 tiers), summer relaxation, climate/fuel charges, VAT.";
  const keywords = isKo
    ? [
        "전기요금 계산기",
        "전기세 계산",
        "누진세 전기요금",
        "주택용 전기요금",
        "여름 전기요금",
        "한전 요금",
        "전기요금 누진제",
        "kWh 요금",
      ]
    : isZh
      ? [
          "电费计算器",
          "电费计算",
          "累进电价",
          "住宅用电费",
          "夏季电费",
          "韩电电费",
          "电费累进制",
          "kWh电费",
        ]
      : isVi
        ? [
            "máy tính tiền điện Hàn Quốc",
            "biểu giá điện lũy tiến",
            "tiền điện KEPCO",
            "tính tiền điện mùa hè",
            "giá điện theo kWh Hàn Quốc",
            "hóa đơn tiền điện Hàn Quốc",
          ]
        : [
            "korean electricity bill calculator",
            "KEPCO bill",
            "korea electricity tariff",
            "progressive electricity rate korea",
          ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/electric-bill`,
      languages: buildLanguagesAlt("/electric-bill"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/electric-bill`,
      locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function ElectricBillPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const localeKey: "ko" | "en" | "vi" | "zh" = isKo
    ? "ko"
    : locale === "zh"
      ? "zh"
      : locale === "vi"
        ? "vi"
        : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/electric-bill" locale={localeKey} id="electric-bill" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo
              ? "전기요금 계산기"
              : localeKey === "zh"
                ? "韩国电费计算器"
                : localeKey === "vi"
                  ? "Máy tính tiền điện Hàn Quốc"
                  : "Korean Electricity Bill Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "월 사용량만 넣으면 누진제 3단계 + 여름철 완화 + 부가세·기금까지 청구금액을 즉시 산출. 한전 주택용 2024 기준."
              : localeKey === "zh"
                ? "只需输入月用电量，即可立即算出含累进电价3档 + 夏季缓和 + 增值税·电力基金的账单金额。以韩国电力公社住宅用2024年标准为准。"
                : localeKey === "vi"
                  ? "Chỉ cần nhập lượng điện tiêu thụ hàng tháng, công cụ sẽ tính ngay tổng tiền điện: biểu giá lũy tiến 3 bậc + giảm nhẹ mùa hè + VAT và quỹ điện lực. Theo biểu giá điện sinh hoạt KEPCO 2024."
                  : "Enter monthly kWh to get the full bill: 3-tier progressive tariff, summer relaxation, VAT and power fund. KEPCO residential 2024 rates."}
          </p>
        </header>
        <ElectricBillForm locale={localeKey} />
        <ToolGuide toolKey="electric-bill" locale={localeKey} />
      </div>
    </main>
  );
}
