import type { Metadata } from "next";
import { F2EligibilityForm } from "@/components/tools/visa/F2EligibilityForm";
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
    ? "F-2-7 거주비자 자격 체크리스트 — 점수제·신청요건 가이드"
    : isZh
      ? "韩国F-2-7居留签证资格清单 — 积分制·申请条件指南"
      : isVi
        ? "Danh sách kiểm tra điều kiện visa cư trú F-2-7 — Hướng dẫn chế độ tính điểm & yêu cầu xin visa"
        : "Korea F-2-7 Residence Visa — Eligibility Checklist & Points Guide";
  const description = isKo
    ? "F-2-7 점수제 거주비자의 5개 신청 유형과 필수요건(3년 체류 또는 연소득 4천만 원)·품행 요건을 항목별로 확인합니다. 80점 점수제 계산과 영주권(F-5)으로 이어지는 경로까지 안내하며, 최종 확인은 hikorea 공식 정보로 하세요."
    : isZh
      ? "核对F-2-7积分制居留签证的5种申请类型、核心要求(连续居留3年或年收入4000万韩元以上)与品行要求，逐项检查是否符合条件。同时指南80分积分制评分方式及通往永久居留(F-5)的后续路径，最终确认请以hikorea官方信息为准。"
      : isVi
        ? "Kiểm tra 5 nhóm đối tượng xin visa cư trú theo chế độ tính điểm F-2-7, yêu cầu cốt lõi (cư trú liên tục 3 năm hoặc thu nhập hàng năm từ 40 triệu won), và yêu cầu về hạnh kiểm. Hướng dẫn chế độ tính điểm 80/170 và lộ trình sang thường trú (F-5). Hãy xác minh chính thức tại hikorea."
        : "Check your F-2-7 residence visa eligibility — 5 applicant categories, core requirements (3-yr stay or ₩40M income), conduct. Guide to the 80-point test and F-5 path. Verify at hikorea.";
  const keywords = isKo
    ? [
        "F-2-7 비자",
        "거주비자 점수제",
        "외국인 거주비자",
        "F-2 비자 자격",
        "점수제 거주",
        "영주권 F-5 경로",
      ]
    : isZh
      ? [
          "F-2-7签证",
          "居留签证积分制",
          "外国人居留签证",
          "F-2签证资格",
          "积分制居留",
          "永久居留F-5路径",
        ]
      : isVi
        ? [
            "visa F-2-7",
            "chế độ tính điểm visa cư trú",
            "visa cư trú cho người nước ngoài",
            "điều kiện visa F-2",
            "cư trú theo điểm",
            "lộ trình thường trú F-5",
          ]
        : [
            "korea F-2 visa",
            "F-2-7 visa eligibility",
            "korea residence visa points",
            "F-2 visa requirements korea",
            "korea points based visa",
            "F-2-7 to F-5 permanent residence",
          ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/f2-residence-visa`,
      languages: buildLanguagesAlt("/f2-residence-visa"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/f2-residence-visa`,
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

export default async function F2ResidenceVisaPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const lang: "ko" | "en" | "vi" | "zh" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/f2-residence-visa" locale={lang} id="f2-residence-visa" />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {lang === "ko"
              ? "F-2-7 거주비자 자격 체크리스트"
              : lang === "zh"
                ? "F-2-7居留签证资格清单"
                : lang === "vi"
                  ? "Danh sách kiểm tra điều kiện visa cư trú F-2-7"
                  : "Korea F-2-7 Residence Visa Eligibility"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {lang === "ko"
              ? "영주권(F-5) 전 단계인 점수제 거주비자(F-2-7). 신청 유형과 필수 요건을 체크하고, 80점 점수제와 다음 단계를 안내합니다. 세부 배점은 비공식이라 점수는 단정하지 않습니다 — 정확한 확인은 hikorea."
              : lang === "zh"
                ? "F-2-7是通往永久居留(F-5)前一阶段的积分制居留签证。请核对申请类型与核心要求，并了解80分积分制及后续步骤。细项分值未公开，本工具不臆断具体分数 — 请以hikorea官方信息为准确认。"
                : lang === "vi"
                  ? "F-2-7 là visa cư trú theo chế độ tính điểm, bước trước khi xin thường trú (F-5). Hãy kiểm tra nhóm đối tượng và các yêu cầu cốt lõi của bạn, đồng thời tìm hiểu cách hoạt động của chế độ tính điểm 80/170. Điểm chi tiết theo từng mục không được công bố chính thức nên công cụ này không khẳng định một con số cụ thể — hãy xác minh chính xác tại hikorea."
                  : "F-2-7 is the points-based residence visa, a step before permanent residence (F-5). Check your applicant category and core requirements, and see how the 80-point test works. Sub-scores are unofficial, so we don't assert a number — verify at hikorea."}
          </p>
        </header>
        <F2EligibilityForm locale={lang} />
        <ToolGuide toolKey="f2-residence-visa" locale={lang} />
      </div>
    </main>
  );
}
