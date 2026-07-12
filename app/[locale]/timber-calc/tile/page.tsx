import type { Metadata } from "next";
import { ToolGuide } from "@/components/tools/ToolGuide";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { TileForm } from "@/components/tools/timber/TileForm";
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
    ? "타일 매수 계산기 — 면적 + 타일 크기 → 매수 + 줄눈재 + 본드"
    : isZh
      ? "瓷砖张数计算器 — 面积 + 瓷砖尺寸 → 张数 + 填缝剂 + 瓷砖胶"
      : isVi
        ? "Máy tính số viên gạch — diện tích + kích thước gạch → số viên + vữa chít mạch + keo dán"
        : "Tile Calculator — area × tile size → count + grout + adhesive";
  const description = isKo
    ? "면적과 타일 크기(300/600/800mm 등 표준 프리셋)를 선택하면 타일 매수, 접착제(본드) kg, 줄눈 충전재 kg까지 즉시. 손실률 자동 반영."
    : isZh
      ? "选择面积与瓷砖尺寸(300/600/800mm等标准预设)，即可立即算出瓷砖张数、瓷砖胶(kg)、填缝剂(kg)。自动反映损耗率。"
      : isVi
        ? "Chọn diện tích và kích thước gạch (mẫu tiêu chuẩn 300/600/800mm) là tính ngay số viên gạch, keo dán (kg), và vữa chít mạch (kg). Tự động áp dụng hệ số hao hụt."
        : "Pick tile size (300/600/800mm presets) and area — get tile count, adhesive kg, and grout kg instantly. Auto waste factor.";
  const keywords = isKo
    ? [
        "타일 계산",
        "타일 계산기",
        "타일 매수",
        "tile calculator",
        "300x300 타일",
        "600x600 타일",
        "800x800 타일",
        "타일 본드",
        "줄눈 충전재",
        "욕실 타일",
        "주방 타일",
        "바닥 타일",
        "벽 타일",
      ]
    : isZh
      ? [
          "瓷砖计算",
          "瓷砖计算器",
          "瓷砖张数",
          "瓷砖胶",
          "填缝剂计算",
          "浴室瓷砖",
          "厨房瓷砖",
          "地面瓷砖",
          "墙面瓷砖",
          "300x300瓷砖",
          "600x600瓷砖",
          "800x800瓷砖",
        ]
      : isVi
        ? [
            "tính gạch ốp lát",
            "máy tính gạch",
            "số viên gạch",
            "gạch 300x300",
            "gạch 600x600",
            "gạch 800x800",
            "keo dán gạch",
            "vữa chít mạch",
            "gạch phòng tắm",
            "gạch nhà bếp",
          ]
        : [
            "tile calculator",
            "tile count",
            "300x300 tile",
            "600x600 tile",
            "porcelain tile",
            "ceramic tile",
            "tile adhesive",
            "grout calculator",
          ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/timber-calc/tile`,
      languages: buildLanguagesAlt("/timber-calc/tile"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/timber-calc/tile`,
      locale: locale === "ko" ? "ko_KR" : isZh ? "zh_CN" : isVi ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function TilePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const isVi = locale === "vi";
  const localeKey: "ko" | "en" | "zh" | "vi" = isKo ? "ko" : isZh ? "zh" : isVi ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/timber-calc`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "목조 계산기" : isZh ? "木结构住宅计算器" : isVi ? "Máy tính kết cấu gỗ" : "Timber Calculators"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "타일 매수 계산기" : isZh ? "瓷砖张数计算器" : isVi ? "Máy tính số viên gạch" : "Tile Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "욕실·주방·바닥·벽 면적에 타일 크기를 입력하면 매수·본드·줄눈재까지 즉시. 표준 크기 6종 (100~800mm) 프리셋 + 줄눈 너비 조정."
              : isZh
                ? "只需输入浴室·厨房·地面·墙面的面积与瓷砖尺寸，即可立即得出张数·瓷砖胶·填缝剂用量。提供6种标准尺寸(100~800mm)预设 + 缝宽调整。"
                : isVi
                  ? "Nhập diện tích phòng tắm/bếp/sàn/tường và kích thước gạch — nhận ngay số viên, keo dán, và vữa chít mạch. 6 mẫu kích thước tiêu chuẩn (100~800mm) + điều chỉnh độ rộng mạch vữa."
                  : "Bathroom, kitchen, floor, wall — enter area and tile size, get count, adhesive, and grout. 6 size presets (100~800mm) + grout width adjustment."}
          </p>
        </header>
        <TileForm locale={localeKey} />
        <ToolGuide toolKey="timber-tile" locale={localeKey} />
      </div>
    </main>
  );
}
