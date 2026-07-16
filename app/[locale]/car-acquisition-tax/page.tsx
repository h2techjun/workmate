import type { Metadata } from "next";
import { CarAcquisitionForm } from "@/components/tools/tax/CarAcquisitionForm";
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
    ? "자동차 취득세 계산기 — 승용·경차·친환경차 7%·4%"
    : isZh
      ? "韩国汽车购置税计算器 — 乘用车·小型车·新能源车 7%·4%"
      : isVi
        ? "Máy tính thuế trước bạ ô tô — xe con·xe hạng nhẹ·xe thân thiện môi trường 7%·4%"
        : "Korean Car Acquisition Tax Calculator";
  const description = isKo
    ? "자동차 취득가액을 입력하면 취득세를 즉시 계산합니다. 승용차 7%, 경차 4%, 승합·화물차 5% 세율에 전기차·하이브리드 등 친환경차 최대 140만원 감면까지 반영해 신차·중고차 등록 전에 예상 세금을 정확히 확인할 수 있습니다."
    : isZh
      ? "输入车辆购置金额，即可立即计算购置税。乘用车税率7%、小型车4%、客货车5%，电动车、混合动力等新能源车还可享最高140万韩元减免。无论新车还是二手车过户登记，都能提前准确确认应缴购置税金额，避免临时预算不足。"
      : isVi
        ? "Tính ngay thuế trước bạ (취득세) từ giá trị mua xe. Xe con 7%·xe hạng nhẹ 4%·xe khách/tải 5% + giảm tối đa 1,4 triệu won cho xe thân thiện môi trường. Kiểm tra thuế trước khi đăng ký xe mới hoặc xe cũ."
        : "Calculate Korean car acquisition tax: passenger 7%, light 4%, van/cargo 5%, with eco-car discount up to KRW 1.4M.";
  const keywords = isKo
    ? ["자동차 취득세", "자동차 취등록세", "취득세 계산기", "차량 취득세", "중고차 취득세", "전기차 취득세"]
    : isZh
      ? ["汽车购置税", "汽车购置登记税", "购置税计算器", "车辆购置税", "二手车购置税", "电动车购置税"]
      : isVi
        ? ["thuế trước bạ ô tô", "thuế trước bạ xe hàn quốc", "máy tính thuế trước bạ", "thuế trước bạ xe cũ", "thuế trước bạ xe điện"]
        : ["korean car acquisition tax", "korea vehicle registration tax", "car tax korea"];

  return {
    title, description, keywords,
    alternates: { canonical: `/${locale}/car-acquisition-tax`, languages: buildLanguagesAlt("/car-acquisition-tax") },
    openGraph: { title, description, type: "website", url: `${SITE_URL}/${locale}/car-acquisition-tax`, locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : "en_US" },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function CarAcquisitionTaxPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const localeKey: "ko" | "en" | "vi" | "zh" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/car-acquisition-tax" locale={localeKey} id="car-acquisition-tax" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo
              ? "자동차 취득세 계산기"
              : localeKey === "zh"
                ? "韩国汽车购置税计算器"
                : localeKey === "vi"
                  ? "Thuế trước bạ ô tô Hàn Quốc"
                  : "Korean Car Acquisition Tax"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "차량 취득가액으로 취득세를 즉시 산출. 승용 7%·경차 4%·친환경차 감면까지 반영해 등록 전 세금 확인."
              : localeKey === "zh"
                ? "根据车辆购置金额即时算出购置税，已反映乘用车7%·小型车4%·新能源车减免，登记前先确认税额。"
                : localeKey === "vi"
                  ? "Tính ngay thuế trước bạ từ giá mua xe — xe con 7%, xe hạng nhẹ 4%, đã áp dụng giảm trừ cho xe thân thiện môi trường."
                  : "Estimate Korean car acquisition tax from the purchase price — passenger 7%, light 4%, eco-car discount."}
          </p>
        </header>
        <CarAcquisitionForm locale={localeKey} />
        <ToolGuide toolKey="car-acquisition-tax" locale={localeKey} />
      </div>
    </main>
  );
}
