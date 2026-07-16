import type { Metadata } from "next";
import { TempConverter } from "@/components/tools/unit/TempConverter";
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
    ? "온도 변환 — 섭씨 °C ↔ 화씨 °F ↔ 켈빈"
    : isZh
      ? "温度换算 — 摄氏°C ↔ 华氏°F ↔ 开尔文"
      : isVi
        ? "Chuyển đổi nhiệt độ — độ C ↔ độ F ↔ Kelvin"
        : "Temperature Converter — °C ↔ °F ↔ K";
  const description = isKo
    ? "섭씨(°C)·화씨(°F)·켈빈(K) 온도를 입력 즉시 서로 변환합니다. 공식은 °F = °C × 9/5 + 32이며, 체온·어는점·끓는점 프리셋과 체감 온도 안내를 제공합니다. 한국은 섭씨, 미국은 화씨를 쓰므로 여행·유학 시 유용합니다."
    : isZh
      ? "摄氏度（°C）、华氏度（°F）、开尔文（K）温度输入后即时互相换算，换算公式为 °F = °C × 9/5 + 32。页面提供体温、水的冰点与沸点等常用预设数值，并附带体感温度说明。韩国日常使用摄氏度，美国则使用华氏度，出国旅行、留学或与海外沟通时非常实用。"
      : isVi
        ? "Chuyển đổi nhiệt độ độ C, độ F và Kelvin tức thì. °F = °C × 9/5 + 32. Có mẫu thân nhiệt·điểm sôi kèm hướng dẫn cảm nhận. Hàn Quốc dùng độ C, Mỹ dùng độ F."
        : "Convert Celsius, Fahrenheit, and Kelvin instantly. F equals C times 9/5 plus 32, with body/boiling presets and a feel guide.";
  const keywords = isKo
    ? ["온도 변환", "섭씨 화씨 변환", "화씨 섭씨", "온도 계산기", "섭씨 화씨"]
    : isZh
      ? ["温度换算", "摄氏 华氏 换算", "华氏 摄氏", "温度计算器", "摄氏 华氏"]
      : isVi
        ? ["chuyển đổi nhiệt độ", "chuyển đổi độ C độ F", "độ F độ C", "máy tính nhiệt độ", "độ C độ F"]
        : [
          "temperature converter",
          "celsius to fahrenheit",
          "c to f",
          "fahrenheit to celsius",
        ];
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/temp-convert`,
      languages: buildLanguagesAlt("/temp-convert"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/temp-convert`,
      locale: locale === "ko" ? "ko_KR" : locale === "zh" ? "zh_CN" : locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function TempConvertPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const isVi = locale === "vi";
  const isZh = locale === "zh";
  const localeKey: "ko" | "en" | "vi" = isKo ? "ko" : isVi ? "vi" : "en";
  const lang: "ko" | "en" | "vi" | "zh" = isZh ? "zh" : localeKey;
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/temp-convert" locale={lang} id="temp-convert" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo
              ? "온도 변환 (°C ↔ °F ↔ K)"
              : isZh
                ? "温度换算 (°C ↔ °F ↔ K)"
                : isVi
                  ? "Chuyển đổi nhiệt độ (°C ↔ °F ↔ K)"
                  : "Temperature Converter"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "섭씨·화씨·켈빈을 즉시 변환. 체온·끓는점 프리셋과 체감 안내까지."
              : isZh
                ? "即时换算摄氏度·华氏度·开尔文，还提供体温·沸点预设和体感提示。"
                : isVi
                  ? "Chuyển đổi độ C, độ F và Kelvin tức thì, kèm mẫu thân nhiệt·điểm sôi và hướng dẫn cảm nhận."
                  : "Convert Celsius, Fahrenheit, and Kelvin instantly with presets and a feel guide."}
          </p>
        </header>
        <TempConverter locale={lang} />
        <ToolGuide toolKey="temp-convert" locale={lang} />
      </div>
    </main>
  );
}
