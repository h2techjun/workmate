import type { Metadata } from "next";
import { VisaDaysForm } from "@/components/tools/korean/VisaDaysForm";
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
    ? "한국 체류일수 계산기 — 90일 무비자·체류 만료일"
    : isZh
      ? "韩国滞留天数计算器 — 90天免签·滞留到期日"
      : isVi
        ? "Máy tính số ngày lưu trú tại Hàn Quốc — miễn visa 90 ngày, ngày hết hạn lưu trú"
        : "Korea Stay Days Calculator — visa expiry & 90-day tracker";
  const description = isKo
    ? "입국일과 허용 체류일수로 현재 체류 일수·만료일·남은 일수를 즉시 계산. 90일 무비자, 30/60/180일 비자 추적. 초과체류 경고 포함."
    : isZh
      ? "输入入境日期与允许滞留天数，立即算出当前已滞留天数、到期日与剩余天数。可追踪90天免签、30/60/180天签证，并附超期滞留警告。"
      : isVi
        ? "Tính ngay số ngày đã lưu trú, ngày hết hạn và số ngày còn lại từ ngày nhập cảnh và số ngày được phép lưu trú. Theo dõi miễn visa 90 ngày, visa 30/60/180 ngày. Bao gồm cảnh báo cư trú quá hạn."
        : "Track your stay in Korea: days stayed, expiry date, and days remaining from entry date and allowed days. 90-day visa-free, 30/60/180-day visas, overstay warning.";
  const keywords = isKo
    ? [
        "한국 체류일수",
        "90일 무비자",
        "체류 만료일 계산",
        "비자 만료일",
        "체류기간 계산기",
      ]
    : isZh
      ? [
          "韩国滞留天数",
          "90天免签",
          "滞留到期日计算",
          "签证到期日",
          "滞留期限计算器",
        ]
      : isVi
        ? [
            "số ngày lưu trú Hàn Quốc",
            "miễn visa 90 ngày",
            "tính ngày hết hạn lưu trú",
            "ngày hết hạn visa",
            "máy tính thời gian lưu trú",
          ]
        : [
          "korea stay days calculator",
          "korea 90 day visa free",
          "korea visa expiry calculator",
          "how many days can i stay in korea",
          "korea overstay calculator",
        ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/visa-days`,
      languages: buildLanguagesAlt("/visa-days"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/visa-days`,
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

export default async function VisaDaysPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const lang: "ko" | "en" | "zh" | "vi" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

  const now = new Date();
  const kst = new Date(now.getTime() + 9 * 3600 * 1000);
  const today = {
    year: kst.getUTCFullYear(),
    month: kst.getUTCMonth() + 1,
    day: kst.getUTCDate(),
  };

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/visa-days" locale={lang} id="visa-days" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {lang === "ko"
              ? "한국 체류일수 계산기"
              : lang === "zh"
                ? "韩国滞留天数计算器"
                : lang === "vi"
                  ? "Máy tính số ngày lưu trú tại Hàn Quốc"
                  : "Korea Stay Days Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {lang === "ko"
              ? "입국일과 허용 체류일수만 넣으면 현재 체류 일수·만료일·남은 일수를 즉시 확인. 초과체류 전에 미리 점검하세요."
              : lang === "zh"
                ? "只需输入入境日期与允许滞留天数，即可立即查看当前已滞留天数、到期日与剩余天数。请在超期滞留之前提前检查。"
                : lang === "vi"
                  ? "Chỉ cần nhập ngày nhập cảnh và số ngày được phép lưu trú để xem ngay số ngày đã ở, ngày hết hạn và số ngày còn lại — kiểm tra trước khi cư trú quá hạn."
                  : "Enter your entry date and allowed days to see days stayed, expiry date, and days remaining — check before you overstay."}
          </p>
        </header>
        <VisaDaysForm locale={lang} today={today} />
        <ToolGuide toolKey="visa-days" locale={lang} />
      </div>
    </main>
  );
}
