import type { Metadata } from "next";
import { RemittanceForm } from "@/components/tools/korea/RemittanceForm";
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
    ? "해외송금 비용 계산기 — 환율 마진 + 수수료 실질 비용률 (규정 안내)"
    : isZh
      ? "海外汇款成本计算器 — 汇率差价+手续费实际成本率（附法规说明）"
      : isVi
        ? "Máy tính chi phí chuyển tiền ra nước ngoài — chênh lệch tỷ giá + phí, tỷ lệ chi phí thực tế (hướng dẫn quy định)"
        : "Send Money From Korea — Remittance Cost Calculator (FX Margin + Fee)";
  const description = isKo
    ? "해외송금의 진짜 비용은 수수료 + 숨은 환율 마진입니다. 송금액과 마진·수수료를 넣으면 총비용과 실질 비용률, 실수령 상당액을 계산합니다. 연간 한도·신고 의무·증빙 등 외국환거래 규정 안내 포함."
    : isZh
      ? "海外汇款的真实成本 = 手续费 + 隐藏的汇率差价。输入汇款金额及差价率、手续费，即可算出总成本、实际成本率与实际到账价值，并附韩国外汇交易相关规定说明（年度限额、申报义务、证明文件等）。"
      : isVi
        ? "Chi phí thực sự khi chuyển tiền ra nước ngoài từ Hàn Quốc là phí giao dịch CỘNG với chênh lệch tỷ giá ẩn. Nhập số tiền, mức chênh lệch và phí để xem tổng chi phí, tỷ lệ chi phí thực tế và số tiền thực nhận. Bao gồm quy định chuyển tiền của Hàn Quốc — hạn mức hàng năm, nghĩa vụ khai báo và chứng từ."
        : "The real cost of sending money from Korea is the fee PLUS the hidden FX margin. Enter your amount, margin, and fee to see total cost, effective rate, and what's delivered. Includes Korea's remittance rules — annual limits, reporting, and proof.";
  const keywords = isKo
    ? [
        "해외송금 수수료",
        "해외송금 비용",
        "환율 마진 스프레드",
        "외국인 송금 한도",
        "한국 해외송금 규정",
        "송금 실질 비용",
      ]
    : isZh
      ? [
          "海外汇款手续费",
          "海外汇款成本",
          "汇率差价点差",
          "外国人汇款限额",
          "韩国海外汇款规定",
          "汇款实际成本",
        ]
      : isVi
        ? [
            "phí chuyển tiền ra nước ngoài",
            "chi phí chuyển tiền ra nước ngoài",
            "chênh lệch tỷ giá",
            "hạn mức chuyển tiền người nước ngoài",
            "quy định chuyển tiền ra nước ngoài Hàn Quốc",
            "chi phí chuyển tiền thực tế",
          ]
        : [
          "send money from korea",
          "korea remittance cost",
          "remittance fee calculator",
          "korea money transfer limit",
          "fx margin remittance",
          "transfer money out of korea",
        ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/remittance`,
      languages: buildLanguagesAlt("/remittance"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/remittance`,
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

export default async function RemittancePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const lang: "ko" | "en" | "zh" | "vi" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/remittance" locale={lang} id="remittance" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {lang === "ko"
              ? "해외송금 비용 계산기"
              : lang === "zh"
                ? "海外汇款成本计算器"
                : lang === "vi"
                  ? "Chi phí chuyển tiền ra nước ngoài"
                  : "Send Money From Korea"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {lang === "ko"
              ? "송금 수수료만 보면 진짜 비용을 놓칩니다. 대부분의 비용은 고시환율과 실제 적용환율의 차이(환율 마진)에 숨어 있습니다. 방식을 고르고 실제 마진·수수료를 넣어 실질 비용률을 비교하세요. 특정 업체를 권유하지 않으며, 규정은 아래 가이드와 공식 안내로 확인합니다."
              : lang === "zh"
                ? "只看手续费会漏掉真正的成本。大部分成本都藏在中间汇率与实际适用汇率之间的差价（汇率差价）里。请选择汇款方式，输入实际差价率与手续费，比较实际成本率。本工具不推荐任何特定业者，相关规定请参考下方指南与官方说明确认。"
                : lang === "vi"
                  ? "Chỉ nhìn vào phí chuyển tiền sẽ bỏ sót chi phí thực sự — phần lớn chi phí nằm trong chênh lệch giữa tỷ giá thị trường và tỷ giá bạn thực sự nhận được (chênh lệch tỷ giá). Chọn phương thức, nhập mức chênh lệch và phí thực tế để so sánh tỷ lệ chi phí hiệu quả. Công cụ này không giới thiệu bất kỳ nhà cung cấp nào; hãy kiểm tra quy định trong hướng dẫn và nguồn chính thức bên dưới."
                  : "Looking only at the transfer fee hides the real cost — most of it sits in the gap between the mid-market rate and the rate you actually get (the FX margin). Pick a method, enter the real margin and fee, and compare the effective cost rate. This doesn't recommend any provider; check the rules in the guide and official sources below."}
          </p>
        </header>
        <RemittanceForm locale={lang} />
        <ToolGuide toolKey="remittance" locale={lang} />
      </div>
    </main>
  );
}
