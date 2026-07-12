import type { Metadata } from "next";
import { DistanceConverter } from "@/components/tools/unit/DistanceConverter";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";

interface PageProps { params: Promise<{ locale: string }>; }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const isVi = locale === "vi";
  const isZh = locale === "zh";
  const title = isKo
    ? "거리 단위 변환 — 리·자 ↔ km·마일"
    : isZh
      ? "距离单位换算 — 里·尺 ↔ km·英里"
      : isVi
        ? "Chuyển đổi đơn vị khoảng cách — ri·ja ↔ km·dặm"
        : "Korean Distance Converter — ri/ja ↔ km/mile";
  const description = isKo
    ? "한국 전통 거리 단위(리·자·보)를 km·미터·마일로 즉시 변환. 1리 ≈ 392.7m, 십리 ≈ 3.93km. 사극·고문헌·국토 표현 이해에."
    : isZh
      ? "韩国传统距离单位(里·尺·步)即时换算为km·米·英里。1里 ≈ 392.7m，十里 ≈ 3.93km。有助于理解古装剧·古文献·国土距离表达。"
      : isVi
        ? "Chuyển đổi đơn vị khoảng cách truyền thống Hàn Quốc (ri, ja, bo) sang km, mét và dặm tức thì. 1 ri ≈ 392,7 m, mười ri ≈ 3,93 km. Hữu ích khi đọc phim cổ trang, cổ văn hay các cách diễn đạt khoảng cách của Hàn Quốc."
        : "Convert Korean traditional distance units (ri, ja, bo) to km, meters, and miles. 1 ri ≈ 392.7 m, 10 ri ≈ 3.93 km.";
  const keywords = isKo
    ? ["거리 단위 변환", "리 km 변환", "자 미터", "십리 거리", "한국 전통 거리"]
    : isZh
      ? ["距离单位换算", "里 千米 换算", "尺 米", "十里 距离", "韩国传统距离"]
      : isVi
        ? ["chuyển đổi đơn vị khoảng cách", "chuyển đổi ri sang km", "ja sang mét", "khoảng cách mười ri", "đơn vị khoảng cách truyền thống Hàn Quốc"]
        : ["korean ri to km", "korean distance unit", "ri ja converter"];
  return { title, description, keywords, alternates: { canonical: `/${locale}/distance-convert`, languages: buildLanguagesAlt("/distance-convert") }, openGraph: { title, description, type: "website", url: `${SITE_URL}/${locale}/distance-convert`, locale: locale === "ko" ? "ko_KR" : locale === "zh" ? "zh_CN" : locale === "vi" ? "vi_VN" : "en_US" } };
}
export function generateStaticParams(): Array<{ locale: string }> { return locales.map((locale) => ({ locale })); }

export default async function DistanceConvertPage({ params }: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const isVi = locale === "vi";
  const isZh = locale === "zh";
  const localeKey: "ko" | "en" | "vi" = isKo ? "ko" : isVi ? "vi" : "en";
  const lang: "ko" | "en" | "vi" | "zh" = isZh ? "zh" : localeKey;
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/distance-convert" locale={lang} id="distance-convert" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{isKo ? "거리 단위 변환 (리·자)" : isZh ? "距离单位换算 (里·尺)" : isVi ? "Chuyển đổi khoảng cách (ri·ja)" : "Korean Distance Converter"}</h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">{isKo ? "한국 전통 거리 단위(리·자·보)를 km·미터·마일로 즉시 변환. 십리가 몇 km인지 한 번에." : isZh ? "韩国传统距离单位(里·尺·步)即时换算为km·米·英里。一次看懂十里等于多少km。" : isVi ? "Chuyển đổi đơn vị khoảng cách truyền thống Hàn Quốc (ri, ja, bo) sang km, mét và dặm tức thì. Xem ngay mười ri là bao nhiêu km." : "Convert Korean traditional distance units to km, meters, and miles in one place."}</p>
        </header>
        <DistanceConverter locale={lang} />
        <ToolGuide toolKey="distance-convert" locale={lang} />
      </div>
    </main>
  );
}
