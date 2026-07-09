import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { DepositRiskForm } from "@/components/tools/realestate/DepositRiskForm";
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
    ? "깡통전세 위험도 계산기 — 부채비율·전세가율로 보증금 안전 진단"
    : isZh
      ? "空壳全租风险计算器 — 用负债比率·全租价比诊断保证金安全性"
      : isVi
        ? "Máy tính rủi ro Jeonse rỗng — chẩn đoán an toàn tiền đặt cọc qua tỷ lệ nợ·tỷ lệ jeonse"
        : "Underwater Jeonse Risk Calculator — Is Your Korea Deposit Safe?";
  const description = isKo
    ? "매매 시세·선순위 채권·내 보증금을 넣으면 전세가율과 부채비율((선순위+보증금)÷시세)로 깡통전세 위험을 진단하고, 경매 시 예상 회수액·손실까지 시뮬레이션합니다. 통상 안전선(70~80%) 기준 안내 + 전세사기 방지 링크."
    : isZh
      ? "输入市场价格·优先债权·我的保证金，即可通过全租价比与负债比率((优先债权+保证金)÷市场价格)诊断空壳全租风险，并模拟拍卖时的预计回收金额与损失。附常见安全线（70~80%）说明 + 全租诈骗防范链接。"
      : isVi
        ? "Nhập giá thị trường, nợ ưu tiên và tiền đặt cọc của bạn để chẩn đoán rủi ro jeonse rỗng qua tỷ lệ jeonse và tỷ lệ nợ ((nợ ưu tiên + tiền đặt cọc) ÷ giá thị trường), đồng thời mô phỏng số tiền thu hồi và thiệt hại dự kiến khi đấu giá. Hướng dẫn theo ngưỡng an toàn thông thường (70–80%) + liên kết phòng chống lừa đảo jeonse."
        : "Enter market price, senior debt, and your deposit to gauge underwater-jeonse risk from the jeonse ratio and debt ratio ((senior + deposit) ÷ price), plus an auction-recovery loss simulation. Rule-of-thumb safe lines (70–80%) explained.";
  const keywords = isKo
    ? [
        "깡통전세 계산기",
        "전세가율 계산",
        "부채비율 전세",
        "보증금 안전 진단",
        "전세 위험도",
        "경매 보증금 회수",
      ]
    : isZh
      ? [
          "空壳全租计算器",
          "全租价比计算",
          "全租负债比率",
          "保证金安全诊断",
          "全租风险度",
          "拍卖保证金回收",
        ]
      : isVi
        ? [
            "máy tính jeonse rỗng",
            "tỷ lệ jeonse Hàn Quốc",
            "tỷ lệ nợ jeonse",
            "chẩn đoán an toàn tiền đặt cọc",
            "rủi ro jeonse",
            "thu hồi tiền đặt cọc đấu giá",
          ]
        : [
            "underwater jeonse",
            "jeonse risk calculator",
            "korea deposit safety",
            "jeonse to value ratio",
            "korea rental deposit risk",
            "jeonse debt ratio",
          ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/deposit-risk`,
      languages: buildLanguagesAlt("/deposit-risk"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/deposit-risk`,
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

export default async function DepositRiskPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const lang: "ko" | "en" | "vi" | "zh" =
    locale === "ko"
      ? "ko"
      : locale === "zh"
        ? "zh"
        : locale === "vi"
          ? "vi"
          : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
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
                ? "全部工具"
                : lang === "vi"
                  ? "Tất cả công cụ"
                  : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {lang === "ko"
              ? "깡통전세 위험도 계산기"
              : lang === "zh"
                ? "空壳全租风险计算器"
                : lang === "vi"
                  ? "Máy tính rủi ro Jeonse rỗng"
                  : "Underwater Jeonse Risk Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {lang === "ko"
              ? "보증금이 집값 대비 안전한지 숫자로 확인하세요. 선순위 채권까지 반영한 부채비율과, 최악의 경우(경매) 예상 회수액·손실을 함께 보여줍니다. 임계값은 업계 통용 경험칙이며, 계약 전 반드시 등기부등본과 전문가 확인이 필요합니다."
              : lang === "zh"
                ? "用数字确认保证金相对于房价是否安全。同时反映优先债权的负债比率，以及最坏情况（拍卖）下的预计回收金额与损失。判定阈值为业内通用经验值，签约前请务必核实房产登记簿并咨询专业人士。"
                : lang === "vi"
                  ? "Kiểm tra bằng số liệu xem tiền đặt cọc của bạn có an toàn so với giá trị căn nhà hay không. Công cụ tính tỷ lệ nợ (bao gồm cả nợ thế chấp ưu tiên) và mô phỏng số tiền thu hồi, thiệt hại dự kiến trong trường hợp xấu nhất (đấu giá). Các ngưỡng là kinh nghiệm thông thường của ngành; luôn phải xác minh bản sao đăng ký BĐS và tham khảo chuyên gia trước khi ký hợp đồng."
                  : "Check whether your deposit is safe against the property's value — in numbers. It computes the debt ratio (including senior mortgages) and simulates worst-case recovery and loss at auction. Thresholds are industry rules of thumb; always verify the property register and consult a professional before signing."}
          </p>
        </header>
        <DepositRiskForm locale={lang} />
        <ToolGuide toolKey="deposit-risk" locale={lang} />
      </div>
    </main>
  );
}
