import type { Metadata } from "next";
import { PensionRefundForm } from "@/components/tools/insurance/PensionRefundForm";
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
    ? "국민연금 반환일시금 계산기 (출국 외국인 환급)"
    : isZh
      ? "国民年金退还一次性补偿金计算器（出境外国人退款）"
      : isVi
        ? "Máy tính hoàn trả lương hưu một lần Quốc dân Hàn Quốc (dành cho người nước ngoài xuất cảnh)"
        : "Korea National Pension Lump-Sum Refund Calculator (for Leaving Foreigners)";
  const description = isKo
    ? "한국에서 일한 외국인이 출국 시 돌려받는 국민연금 반환일시금을 추정. 기준소득월액·납부 개월로 원금(사용자 부담분 포함)+이자를 계산하고, 국적·E-9/H-2 비자별 수령 가능 여부와 세금까지 안내."
    : isZh
      ? "估算在韩工作的外国人出境时可领回的国民年金退还一次性补偿金。根据基准收入月额与缴纳月数计算本金（含雇主承担部分）+利息，并说明按国籍·E-9/H-2签证划分的领取资格与相关税务。"
      : isVi
        ? "Ước tính khoản hoàn trả lương hưu một lần (National Pension) mà người nước ngoài có thể nhận lại khi xuất cảnh khỏi Hàn Quốc vĩnh viễn. Tính gốc (bao gồm phần công ty đóng) + lãi dựa trên mức thu nhập chuẩn tháng và số tháng đã đóng, đồng thời hướng dẫn điều kiện nhận theo quốc tịch / visa E-9·H-2 và thuế."
        : "Estimate the National Pension lump-sum refund foreigners can reclaim when leaving Korea. Calculates principal (employer's share included) + interest from your income base and months, and explains eligibility by nationality / E-9·H-2 visa, plus tax.";
  const keywords = isKo
    ? [
        "국민연금 반환일시금",
        "외국인 국민연금 환급",
        "출국 국민연금",
        "국민연금 돌려받기",
        "E-9 국민연금",
        "반환일시금 계산",
      ]
    : isZh
      ? [
          "国民年金退还一次性补偿金",
          "外国人国民年金退款",
          "出境国民年金",
          "国民年金退还",
          "E-9国民年金",
          "一次性补偿金计算",
        ]
      : isVi
        ? [
            "hoàn trả lương hưu Hàn Quốc",
            "hoàn trả lương hưu một lần",
            "lương hưu quốc dân người nước ngoài",
            "rút lương hưu khi về nước",
            "lương hưu E-9 Hàn Quốc",
            "tính hoàn trả lương hưu",
          ]
        : [
            "korea pension refund",
            "national pension lump sum refund",
            "foreigner pension refund korea",
            "leaving korea pension",
            "reclaim korean pension",
            "korea pension E-9 refund",
          ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/pension-refund`,
      languages: buildLanguagesAlt("/pension-refund"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/pension-refund`,
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

export default async function PensionRefundPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const lang: "ko" | "en" | "zh" | "vi" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/pension-refund" locale={lang} id="pension-refund" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {lang === "ko"
              ? "국민연금 반환일시금 계산기"
              : lang === "zh"
                ? "国民年金退还一次性补偿金计算器"
                : lang === "vi"
                  ? "Máy tính hoàn trả lương hưu Quốc dân một lần"
                  : "Korea National Pension Lump-Sum Refund"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {lang === "ko"
              ? "한국에서 일한 외국인이 영구 출국할 때 낸 국민연금을 돌려받는 '반환일시금'의 예상액을 계산합니다. 직장인은 회사 부담분까지 포함됩니다 — 단, 수령 가능 여부는 국적·비자에 따라 다르니 아래 가이드를 꼭 확인하세요."
              : lang === "zh"
                ? "计算在韩工作的外国人永久出境时可领回已缴国民年金的'退还一次性补偿金'预估金额。职场加入者连雇主承担部分也一并包含在内——但能否领取因国籍与签证而异，请务必查看下方指南确认。"
                : lang === "vi"
                  ? "Tính khoản tiền dự kiến của 'khoản hoàn trả một lần' — lương hưu Quốc dân mà người nước ngoài đã đóng tại Hàn Quốc được nhận lại khi xuất cảnh vĩnh viễn. Với người lao động công ty, khoản công ty đóng cũng được bao gồm — tuy nhiên điều kiện nhận phụ thuộc vào quốc tịch và visa, hãy chắc chắn xem hướng dẫn bên dưới."
                  : "Estimate the National Pension 'lump-sum refund' that foreigners can reclaim when they permanently leave Korea — for workplace subscribers, the employer's share is included too. Whether you can claim it depends on your nationality and visa, so read the guide below."}
          </p>
        </header>
        <PensionRefundForm locale={lang} />
        <ToolGuide toolKey="pension-refund" locale={lang} />
      </div>
    </main>
  );
}
