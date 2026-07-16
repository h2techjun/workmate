import type { Metadata } from "next";
import { WallpaperForm } from "@/components/tools/timber/WallpaperForm";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

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
    ? "도배 벽지 수량 계산기 — 필요 롤 수·도배풀"
    : isZh
      ? "壁纸用量计算器 — 所需卷数·壁纸胶"
      : isVi
        ? "Máy tính số lượng giấy dán tường — số cuộn·keo dán"
        : "Wallpaper Calculator — rolls & glue needed";
  const description = isKo
    ? "벽 면적만 넣으면 합지·실크·수입 벽지의 필요 롤 수와 도배풀 소요량을 즉시 산출합니다. 국산 광폭(106cm×15.6m)·수입(53cm×10m) 롤 규격과 무늬 맞춤(리피트) 여부에 따른 로스율(10~20%)을 반영하며, 방 둘레×천장 높이로도 면적을 계산할 수 있습니다. 회원가입 없이 무료로 이용할 수 있습니다."
    : isZh
      ? "只需输入墙面面积，即可立即算出合纸·丝绒·进口壁纸的所需卷数与壁纸胶用量。反映韩国国产宽幅(106cm×15.6m)·进口(53cm×10m)卷材规格及对花(花纹拼接)与否对应的损耗率(10~20%)，也可用房间周长×天花板高度计算面积。完全免费在线使用，无需注册。"
      : isVi
        ? "Chỉ cần nhập diện tích tường để tính ngay số cuộn giấy dán tường (hợp chỉ·lụa·nhập khẩu) và lượng keo dán cần dùng. Áp dụng quy cách cuộn khổ rộng nội địa Hàn Quốc (106cm×15.6m)·nhập khẩu (53cm×10m) và tỷ lệ hao hụt (10~20%) theo việc khớp hoa văn, cũng có thể tính diện tích theo chu vi phòng × chiều cao trần. Miễn phí không cần đăng ký."
        : "Enter wall area to instantly get the number of wallpaper rolls (paper, silk, or imported) and glue needed. Reflects Korean wide-format (106cm×15.6m) and imported (53cm×10m) roll sizes plus the loss rate (10–20%) for pattern-match installs, with an option to derive area from room perimeter × ceiling height — free, no signup.";
  const keywords = isKo
    ? ["도배 벽지 계산", "벽지 롤 수 계산기", "실크벽지 수량", "합지 벽지 계산", "도배풀 소요량", "벽지 몇 롤"]
    : isZh
      ? ["壁纸用量计算", "壁纸计算器", "丝绒壁纸数量", "壁纸卷数计算", "壁纸胶用量"]
      : isVi
        ? ["tính giấy dán tường", "máy tính giấy dán tường", "số cuộn giấy dán", "giấy lụa số lượng", "keo dán tường"]
        : ["wallpaper calculator", "how many wallpaper rolls", "wallpaper quantity calculator", "silk wallpaper rolls", "wallpaper glue calculator"];

  return {
    title,
    description,
    keywords,
    alternates: { canonical: `/${locale}/wallpaper-calc`, languages: buildLanguagesAlt("/wallpaper-calc") },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/wallpaper-calc`,
      locale: locale === "ko" ? "ko_KR" : locale === "zh" ? "zh_CN" : locale === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function WallpaperCalcPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const isVi = locale === "vi";
  const localeKey: "ko" | "en" | "zh" | "vi" = isKo ? "ko" : isZh ? "zh" : isVi ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/wallpaper-calc" locale={localeKey} id="wallpaper-calc" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "도배 벽지 수량 계산기" : isZh ? "壁纸用量计算器" : isVi ? "Máy tính số lượng giấy dán tường" : "Wallpaper Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "벽 면적만 넣으면 벽지 필요 롤 수와 도배풀 소요량을 즉시 산출. 국산 광폭·수입 규격 + 무늬 맞춤 로스율 반영."
              : isZh
                ? "只需输入墙面面积，即可立即算出壁纸所需卷数与壁纸胶用量。反映国产宽幅·进口规格 + 对花损耗率。"
                : isVi
                  ? "Chỉ cần nhập diện tích tường để có ngay số cuộn giấy dán và lượng keo dán cần dùng. Áp dụng quy cách nội địa·nhập khẩu + hao hụt khớp hoa văn."
                  : "Enter wall area to get wallpaper roll count and glue needed — Korean wide-format and imported sizes, plus pattern-match loss rate."}
          </p>
        </header>
        <WallpaperForm locale={localeKey} />
        <ToolGuide toolKey="wallpaper-calc" locale={localeKey} />
      </div>
    </main>
  );
}
