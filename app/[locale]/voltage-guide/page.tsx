import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { VoltageForm } from "@/components/tools/korean/VoltageForm";
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
    ? "한국 전압·플러그 가이드 — 변압기·돼지코 필요?"
    : isZh
      ? "韩国电压·插头指南 — 需要变压器·转换插头吗？"
      : isVi
        ? "Hướng dẫn điện áp·phích cắm Hàn Quốc — có cần biến áp·đầu chuyển không?"
        : "Korea Voltage & Plug Guide — do you need a converter?";
  const description = isKo
    ? "한국 220V·60Hz·C/F 플러그. 기기 전압과 출신국 플러그로 변압기·어댑터(돼지코) 필요 여부를 즉시 판정. 여행·이주 전 필수 점검."
    : isZh
      ? "韩国使用220V·60Hz电压，插头类型为C/F。根据设备电压与你所在国家的插头类型，即时判定是否需要变压器·转换插头(돼지코)。旅行·移居韩国前必查项目。"
      : isVi
        ? "Hàn Quốc dùng điện áp 220V·60Hz, phích cắm loại C/F. Nhập điện áp thiết bị và phích cắm nước bạn để xác định ngay có cần biến áp·đầu chuyển phích cắm (phích cắm tròn) hay không. Kiểm tra bắt buộc trước khi du lịch·định cư."
        : "Korea uses 220V/60Hz, plug type C/F. Check whether your device needs a transformer or plug adapter from its voltage and your plug type.";
  const keywords = isKo
    ? ["한국 전압", "한국 플러그", "돼지코", "변압기 필요", "220V 110V"]
    : isZh
      ? ["韩国电压", "韩国插头", "转换插头", "需要变压器吗", "220V 110V"]
      : isVi
        ? [
            "điện áp Hàn Quốc",
            "phích cắm Hàn Quốc",
            "đầu chuyển phích cắm",
            "cần biến áp không",
            "220V 110V",
          ]
        : [
            "korea voltage converter",
            "korea plug type",
            "do i need adapter korea",
            "korea 220v",
          ];
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/voltage-guide`,
      languages: buildLanguagesAlt("/voltage-guide"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/voltage-guide`,
      locale: locale === "ko" ? "ko_KR" : locale === "zh" ? "zh_CN" : locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function VoltageGuidePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const lang: "ko" | "en" | "vi" | "zh" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {lang === "ko" ? "툴 모음" : lang === "zh" ? "全部工具" : lang === "vi" ? "Tất cả công cụ" : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {lang === "ko"
              ? "한국 전압·플러그 가이드"
              : lang === "zh"
                ? "韩国电压·插头指南"
                : lang === "vi"
                  ? "Hướng dẫn điện áp·phích cắm Hàn Quốc"
                  : "Korea Voltage & Plug Guide"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {lang === "ko"
              ? "기기 전압과 플러그만 고르면 한국(220V·C/F)에서 변압기·돼지코가 필요한지 즉시 알려줍니다."
              : lang === "zh"
                ? "只需选择设备电压与插头类型，就能立即知道在韩国(220V·C/F)是否需要变压器或转换插头。"
                : lang === "vi"
                  ? "Chỉ cần chọn điện áp thiết bị và phích cắm, công cụ sẽ cho biết ngay bạn có cần biến áp·đầu chuyển phích cắm khi ở Hàn Quốc (220V·C/F) hay không."
                  : "Pick your device voltage and plug to instantly see if you need a transformer or adapter in Korea (220V, C/F)."}
          </p>
        </header>
        <VoltageForm locale={lang} />
        <ToolGuide toolKey="voltage-guide" locale={lang} />
      </div>
    </main>
  );
}
