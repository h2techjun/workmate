import type { Metadata } from "next";
import { ToolGuide } from "@/components/tools/ToolGuide";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { StudsForm } from "@/components/tools/timber/StudsForm";
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
    ? "스터드(각목) 본수 계산기 — 벽 길이 × 층고 × 간격"
    : isZh
      ? "墙骨柱(方木)根数计算器 — 墙长 × 层高 × 间距"
      : isVi
        ? "Máy tính số thanh đứng (khung gỗ) — chiều dài tường × chiều cao trần × khoảng cách"
        : "Stud Framing Calculator — wall length × ceiling × spacing";
  const description = isKo
    ? "벽 길이·층고·스터드 간격(16\"/24\")·개구부 개수만 입력하면 2×4 SPF 각목 본수, 1본 길이, 탑·솔 플레이트 길이, 헤더 본수, 못 개수까지 즉시 계산합니다. 손실률 자동 반영으로 목조주택 골조 자재 물량을 무료로 확인합니다."
    : isZh
      ? "只需输入墙长·层高·墙骨柱间距(16\"/24\")·洞口数量，即可立即算出2×4 SPF方木根数、单根长度、顶·底梁板长度、过梁根数、钉子数量。自动反映损耗率，适用于木结构住宅骨架施工的备料估算，完全免费。"
      : isVi
        ? "Chỉ cần nhập chiều dài tường, chiều cao trần, khoảng cách thanh đứng (16\"/24\") và số lượng lỗ mở là tính ngay số thanh đứng 2×4 SPF, chiều dài một thanh, chiều dài tấm đế trên/dưới, số đà đỡ, và số lượng đinh. Tự động áp dụng hệ số hao hụt."
        : "Calculate 2×4 SPF stud count, stud length, top/sole plate length, header count, and nails from wall length, ceiling height, and spacing. Auto waste factor.";
  const keywords = isKo
    ? [
        "스터드 계산",
        "각목 본수",
        "2x4 SPF",
        "목조 골조",
        "벽 자재 계산",
        "스터드 간격",
        "16인치 스터드",
        "층고",
        "헤더 보강재",
        "탑 플레이트",
        "솔 플레이트",
        "목조주택 시공",
      ]
    : isZh
      ? [
          "墙骨柱计算",
          "方木根数",
          "2x4 SPF",
          "木结构骨架",
          "墙体材料计算",
          "墙骨柱间距",
          "16英寸墙骨柱",
          "层高",
          "过梁加固材",
          "顶梁板",
          "底梁板",
          "木结构住宅施工",
        ]
      : isVi
        ? [
            "tính thanh đứng",
            "số thanh gỗ khung",
            "2x4 SPF",
            "khung gỗ",
            "tính vật liệu tường",
            "khoảng cách thanh đứng",
            "thanh đứng 16 inch",
            "chiều cao trần",
            "đà đỡ",
            "tấm đế trên",
            "tấm đế dưới",
            "thi công nhà gỗ",
          ]
        : [
            "stud calculator",
            "wall framing",
            "2x4 SPF studs",
            "stud spacing",
            "header beam",
            "top plate",
            "sole plate",
            "timber framing",
          ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/timber-calc/studs`,
      languages: buildLanguagesAlt("/timber-calc/studs"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/timber-calc/studs`,
      locale: locale === "ko" ? "ko_KR" : isZh ? "zh_CN" : isVi ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function StudsPage({
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
            {isKo ? "스터드(각목) 본수 계산기" : isZh ? "墙骨柱(方木)根数计算器" : isVi ? "Máy tính số thanh đứng (khung gỗ)" : "Stud Framing Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "벽 길이와 층고만 알면 스터드 본수, 1본 길이, 상하 플레이트, 헤더, 못 개수까지. 16\"/24\" 간격 + 개구부 보강재 (jack/king/header) 자동 반영."
              : isZh
                ? "只需知道墙长与层高，即可算出墙骨柱根数、单根长度、上下梁板、过梁、钉子数量。自动反映16\"/24\"间距 + 洞口加固材(副柱/通长柱/过梁)。"
                : isVi
                  ? "Chỉ cần biết chiều dài tường và chiều cao trần — tính ngay số thanh đứng, chiều dài một thanh, tấm đế trên/dưới, đà đỡ, và số lượng đinh. Tự động áp dụng khoảng cách 16\"/24\" + vật liệu gia cố lỗ mở (jack/king/header)."
                  : "Enter wall length and ceiling height — get stud count, length, plates, headers, and nails. Supports 16\"/24\" spacing + opening reinforcement (jack/king/header) auto-calculated."}
          </p>
        </header>
        <StudsForm locale={localeKey} />
        <ToolGuide toolKey="timber-studs" locale={localeKey} />
      </div>
    </main>
  );
}
