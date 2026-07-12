import type { Metadata } from "next";
import { CarAnnualTaxForm } from "@/components/tools/tax/CarAnnualTaxForm";
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
    ? "자동차세 계산기 — 배기량·차령별 연간 자동차세"
    : isZh
      ? "韩国汽车税计算器 — 按排量·车龄计算年度汽车税"
      : isVi
        ? "Máy tính thuế ô tô — thuế ô tô hàng năm theo dung tích xi-lanh·tuổi xe"
        : "Korean Annual Car Tax Calculator";
  const description = isKo
    ? "배기량과 차령으로 연간 자동차세를 즉시 계산. cc당 단가 + 지방교육세 30% + 차령 경감(최대 50%) + 전기차 정액. 6·12월 반기 납부액도 표시."
    : isZh
      ? "根据排量与车龄即时计算年度汽车税。按cc单价 + 地方教育税30% + 车龄减免(最高50%) + 电动车定额。同时显示6月·12月的半年缴纳额。"
      : isVi
        ? "Tính ngay thuế ô tô hàng năm theo dung tích xi-lanh và tuổi xe. Đơn giá theo cc + thuế giáo dục địa phương 30% + giảm trừ theo tuổi xe (tối đa 50%) + mức cố định cho xe điện. Hiển thị cả số tiền nộp theo nửa năm (tháng 6·12)."
        : "Calculate Korean annual car tax from engine displacement and vehicle age, with 30% education tax and age reduction up to 50%.";
  const keywords = isKo
    ? ["자동차세", "자동차세 계산기", "배기량 자동차세", "차령 경감", "전기차 자동차세", "연간 자동차세"]
    : isZh
      ? ["汽车税", "汽车税计算器", "排量汽车税", "车龄减免", "电动车汽车税", "年度汽车税"]
      : isVi
        ? ["thuế ô tô", "máy tính thuế ô tô", "thuế ô tô theo dung tích xi-lanh", "giảm trừ theo tuổi xe", "thuế xe điện", "thuế ô tô hàng năm"]
        : ["korean car tax", "korea annual vehicle tax", "car tax by displacement korea"];

  return {
    title, description, keywords,
    alternates: { canonical: `/${locale}/car-tax`, languages: buildLanguagesAlt("/car-tax") },
    openGraph: { title, description, type: "website", url: `${SITE_URL}/${locale}/car-tax`, locale: locale === "ko" ? "ko_KR" : locale === "vi" ? "vi_VN" : "en_US" },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function CarTaxPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const localeKey: "ko" | "en" | "vi" | "zh" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/car-tax" locale={localeKey} id="car-tax" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo
              ? "자동차세 계산기"
              : localeKey === "zh"
                ? "韩国汽车税计算器"
                : localeKey === "vi"
                  ? "Thuế ô tô hàng năm Hàn Quốc"
                  : "Korean Annual Car Tax"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "배기량·차령으로 연간 자동차세를 즉시 산출. 지방교육세·차령 경감·전기차 정액까지 반영."
              : localeKey === "zh"
                ? "根据排量·车龄即时算出年度汽车税，已反映地方教育税·车龄减免·电动车定额。"
                : localeKey === "vi"
                  ? "Tính ngay thuế ô tô hàng năm theo dung tích xi-lanh và tuổi xe, đã bao gồm thuế giáo dục địa phương, giảm trừ theo tuổi xe và mức cố định cho xe điện."
                  : "Estimate Korean annual car tax from displacement and age, including education tax and age reduction."}
          </p>
        </header>
        <CarAnnualTaxForm locale={localeKey} />
        <ToolGuide toolKey="car-tax" locale={localeKey} />
      </div>
    </main>
  );
}
