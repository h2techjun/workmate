import type { Metadata } from "next";
import { ToolGuide } from "@/components/tools/ToolGuide";
import { MaterialQuantityForm } from "@/components/tools/timber/MaterialQuantityForm";
import { locales, type Locale } from "@/i18n";
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
    ? "단열재 두루마리 매수 — 벽·천장 면적 → 인슐레이션 배트"
    : isZh
      ? "隔热材卷材张数 — 墙面·天花板面积 → 隔热卷材"
      : isVi
        ? "Máy tính số tấm cách nhiệt — diện tích tường/trần → tấm cách nhiệt (batt)"
        : "Insulation Batt Calculator — wall and ceiling rolls";
  const description = isKo
    ? "벽·천장 면적을 입력하면 R-19 글라스울 단열재 두루마리 매수를 즉시 계산합니다. 손실률 10% 기본 적용, 그라스울·미네랄울 소재 모두 호환되며 에너지절약설계기준 R값 참고로 겨울철 난방비 절감 시공 물량까지 무료로 바로 확인합니다."
    : isZh
      ? "输入墙面·天花板面积，即可立即算出R-19玻璃棉隔热卷材张数。默认损耗率10%，兼容玻璃棉·矿棉材质，可参考韩国节能设计标准附表1的R值，用于冬季采暖费节省施工的物料估算，完全免费，无需注册即可使用。"
      : isVi
        ? "Nhập diện tích tường/trần là tính ngay số tấm cách nhiệt sợi thủy tinh R-19. Hệ số hao hụt mặc định 10%. Tương thích sợi thủy tinh·bông khoáng."
        : "Calculate R-19 fiberglass batt rolls from wall/ceiling area. Default 10% waste. Glasswool/mineral wool compatible.";
  const keywords = isKo
    ? [
        "단열재 계산",
        "단열재 매수",
        "그라스울 계산",
        "미네랄울",
        "R19",
        "R값 단열",
        "인슐레이션",
        "에너지 절약",
        "단열재 시공",
      ]
    : isZh
      ? [
          "隔热材计算",
          "隔热材张数",
          "玻璃棉计算",
          "矿棉",
          "R19",
          "R值隔热",
          "隔热材计算器",
          "节能",
          "隔热材施工",
        ]
      : isVi
        ? [
            "tính vật liệu cách nhiệt",
            "số tấm cách nhiệt",
            "tính sợi thủy tinh",
            "bông khoáng",
            "R19",
            "cách nhiệt giá trị R",
            "tấm cách nhiệt",
            "tiết kiệm năng lượng",
          ]
        : ["insulation calculator", "fiberglass batts", "R-19 insulation", "wall insulation", "ceiling insulation"];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/timber-calc/insulation-batt`,
      languages: buildLanguagesAlt("/timber-calc/insulation-batt"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/timber-calc/insulation-batt`,
      locale: locale === "ko" ? "ko_KR" : isZh ? "zh_CN" : isVi ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function InsulationBattPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const isVi = locale === "vi";
  const localeKey: Locale = isKo ? "ko" : isZh ? "zh" : isVi ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs
          path="/timber-calc/insulation-batt"
          locale={localeKey}
          id="timber-insulation-batt"
        />
        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {isKo ? "단열재 두루마리 매수 계산기" : isZh ? "隔热材卷材张数计算器" : isVi ? "Máy tính số tấm cách nhiệt" : "Insulation Batt Calculator"}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "벽·천장 면적을 입력하면 R-19 글라스울 두루마리 매수를 즉시. 단열 등급은 별표1 (에너지절약설계기준) 참고."
              : isZh
                ? "输入墙面·天花板面积，即可立即算出R-19玻璃棉卷材张数。隔热等级请参考附表1(节能设计标准)。"
                : isVi
                  ? "Nhập diện tích tường/trần — nhận ngay số tấm cách nhiệt sợi thủy tinh R-19. Tham khảo Phụ lục 1 Quy chuẩn năng lượng Hàn Quốc cho giá trị R."
                  : "Enter wall/ceiling area — get R-19 fiberglass batt roll count. Reference Korean Energy Code Annex 1 for R-value."}
          </p>
        </header>
        <MaterialQuantityForm lockedMaterial="battInsulationR19" />
        <ToolGuide toolKey="timber-insulation-batt" locale={localeKey} />
      </div>
    </main>
  );
}
