import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { RentCapForm } from "@/components/tools/realestate/RentCapForm";
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
    ? "임대료 5% 인상한도 검증 — 전월세 갱신 보증금/월세 환산"
    : isZh
      ? "韩国租金5%涨幅上限验证 — 全租/月租续约保证金换算"
      : isVi
        ? "Kiểm tra trần tăng tiền thuê 5% Hàn Quốc — quy đổi tiền đặt cọc/tiền thuê khi gia hạn"
        : "Korean Rent Cap Calculator — 5% renewal limit verification";
  const description = isKo
    ? "주택임대차보호법 시행령 8조 5% 인상 한도 즉시 검증. 보증금↔월세 환산보증금 + 갱신요구권 행사 시 한도 초과 여부 + 보증금만/월세만 인상 추천."
    : isZh
      ? "立即验证《住宅租赁保护法》施行令第8条规定的5%涨幅上限。保证金↔月租换算保证金 + 行使续约请求权时是否超过上限 + 仅上调保证金或仅上调月租的推荐额度。"
      : isVi
        ? "Kiểm tra ngay trần tăng 5% theo Điều 8 Nghị định thi hành Luật Bảo vệ Thuê nhà. Quy đổi tiền đặt cọc ↔ tiền thuê hàng tháng + xác định có vượt trần khi thực hiện quyền yêu cầu gia hạn hợp đồng hay không + gợi ý mức tăng chỉ tiền đặt cọc hoặc chỉ tiền thuê."
        : "Verify Korean Housing Lease Act 5% renewal cap. Deposit-to-monthly conversion + breakdown of how much rent or deposit can increase.";
  const keywords = isKo
    ? [
        "임대료 5%",
        "전월세 인상한도",
        "보증금 인상한도",
        "갱신요구권 5%",
        "주임법 5%",
        "임대료 인상 계산",
        "월세 5% 인상",
        "환산보증금",
        "전월세 전환율",
        "주택임대차보호법 5%",
      ]
    : isZh
      ? [
          "韩国租金5%涨幅上限",
          "全租月租涨幅上限",
          "保证金涨幅上限",
          "续约请求权5%",
          "住宅租赁保护法5%",
          "租金上涨计算",
          "月租5%上涨",
          "换算保证金",
          "全租转月租折算率",
        ]
      : isVi
        ? [
            "trần tăng tiền thuê 5% Hàn Quốc",
            "giới hạn tăng tiền đặt cọc",
            "quyền yêu cầu gia hạn hợp đồng 5%",
            "Luật Bảo vệ Thuê nhà 5%",
            "tính tiền thuê tăng Hàn Quốc",
            "quy đổi tiền đặt cọc tiền thuê",
            "tỷ lệ chuyển đổi jeonse wolse",
          ]
        : [
            "Korean rent cap",
            "Housing Lease Act 5%",
            "Korean deposit increase limit",
            "monthly rent increase",
            "Korean rental renewal",
          ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/rent-cap`,
      languages: buildLanguagesAlt("/rent-cap"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/rent-cap`,
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

export default async function RentCapPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const localeKey = isKo
    ? "ko"
    : locale === "zh"
      ? "zh"
      : locale === "vi"
        ? "vi"
        : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {localeKey === "ko"
              ? "툴 모음"
              : localeKey === "zh"
                ? "全部工具"
                : localeKey === "vi"
                  ? "Tất cả công cụ"
                  : "All tools"}
          </Link>
        </nav>
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {localeKey === "ko"
              ? "임대료 5% 인상한도 검증"
              : localeKey === "zh"
                ? "租金5%涨幅上限验证"
                : localeKey === "vi"
                  ? "Kiểm tra trần tăng tiền thuê 5%"
                  : "Korean Rent Cap Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {localeKey === "ko"
              ? "주임법 시행령 8조 갱신요구권 5% 인상 한도를 즉시 검증. 보증금·월세 환산 + 한도 내 인상 추천까지."
              : localeKey === "zh"
                ? "立即验证《住宅租赁保护法》施行令第8条续约请求权5%涨幅上限。保证金·月租换算，并给出上限内的调整建议。"
                : localeKey === "vi"
                  ? "Kiểm tra ngay trần tăng 5% khi thực hiện quyền yêu cầu gia hạn hợp đồng theo Điều 8 Nghị định thi hành Luật Bảo vệ Thuê nhà. Quy đổi tiền đặt cọc·tiền thuê + gợi ý mức tăng trong giới hạn cho phép."
                  : "Verify Korean Housing Lease Act 5% rent cap on renewal. Deposit-monthly conversion + within-cap recommendation."}
          </p>
        </header>
        <RentCapForm locale={localeKey} />
        <ToolGuide toolKey="rent-cap" locale={localeKey} />
      </div>
    </main>
  );
}
