import type { Metadata } from "next";
import { FreelancerTaxForm } from "@/components/tools/tax/FreelancerTaxForm";
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
    ? "프리랜서 3.3% 계산기 — 세전·세후 원천징수"
    : isVi
      ? "Máy tính thuế 3,3% cho freelancer tại Hàn Quốc — khấu trừ trước và sau thuế"
      : isZh
        ? "自由职业者3.3%计算器 — 税前·税后代扣代缴"
        : "Korean Freelancer 3.3% Tax Calculator";
  const description = isKo
    ? "프리랜서 사업소득에서 원천징수되는 3.3%(소득세 3% + 지방소득세 0.3%)를 즉시 계산합니다. 세전 금액을 세후로, 실수령액을 세전으로 역산하는 양방향 계산과 연 환산 금액을 제공하며 5월 종합소득세 신고 정산 방법도 안내합니다."
    : isVi
      ? "Tính ngay khoản khấu trừ tại nguồn 3,3% (thuế thu nhập 3% + thuế địa phương 0,3%) trên thu nhập kinh doanh của freelancer. Từ trước thuế sang sau thuế, tính ngược từ thực nhận sang trước thuế, và quy đổi theo năm. Kèm hướng dẫn quyết toán thuế thu nhập tổng hợp vào tháng 5."
      : isZh
        ? "自由职业者的营业所得会被代扣代缴3.3%(所得税3% + 地方所得税0.3%)，本工具可即时计算该税额。支持税前推算税后、实领金额反算税前两种方向，并提供按年换算金额，同时说明5月综合所得税申报时如何进行最终结算。"
        : "Calculate Korean freelancer 3.3% withholding (3% income + 0.3% local). Gross to net and net to gross, with annual figures and filing notes.";
  const keywords = isKo
    ? [
        "프리랜서 3.3",
        "3.3% 계산기",
        "프리랜서 세금",
        "원천징수 계산",
        "사업소득 3.3%",
        "프리랜서 실수령",
      ]
    : isVi
      ? [
          "thuế freelancer 3.3",
          "máy tính thuế 3,3%",
          "thuế freelancer Hàn Quốc",
          "tính khấu trừ tại nguồn",
          "thu nhập kinh doanh 3,3%",
          "thực nhận của freelancer",
        ]
      : isZh
        ? [
            "自由职业者3.3%",
            "3.3%计算器",
            "自由职业者税金",
            "代扣代缴计算",
            "营业所得3.3%",
            "自由职业者实领",
          ]
        : [
        "korean freelancer tax",
        "korea 3.3 percent tax",
        "freelance withholding korea",
      ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/freelancer-tax`,
      languages: buildLanguagesAlt("/freelancer-tax"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/freelancer-tax`,
      locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : locale === "zh" ? "zh_CN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function FreelancerTaxPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const lang: "ko" | "en" | "vi" | "zh" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/freelancer-tax" locale={lang} id="freelancer-tax" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {lang === "ko"
              ? "프리랜서 3.3% 계산기"
              : lang === "zh"
                ? "自由职业者3.3%计算器"
                : lang === "vi"
                  ? "Máy tính thuế 3,3% cho freelancer"
                  : "Korean Freelancer 3.3% Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {lang === "ko"
              ? "프리랜서 사업소득 3.3% 원천징수를 즉시 계산. 세전→세후, 실수령→세전 역산까지 양방향."
              : lang === "zh"
                ? "即时计算自由职业者营业所得3.3%预扣税。支持税前→税后、实收→税前双向反算。"
                : lang === "vi"
                  ? "Tính ngay khoản khấu trừ tại nguồn 3,3% trên thu nhập kinh doanh của freelancer — hai chiều, từ trước thuế sang sau thuế và ngược lại."
                  : "Instantly calculate the 3.3% withholding on Korean freelance income — both gross-to-net and net-to-gross."}
          </p>
        </header>
        <FreelancerTaxForm locale={lang} />
        <ToolGuide toolKey="freelancer-tax" locale={lang} />
      </div>
    </main>
  );
}
