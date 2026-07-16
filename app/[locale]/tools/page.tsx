import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { locales, type Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL, SITE_BRAND } from "@/lib/siteConfig";
import { TOOL_GROUPS, TOOL_GROUP_ORDER } from "@/lib/toolsCatalog";
import { ToolSearch } from "@/components/layout/ToolSearch";
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
    ? `한국 실무자를 위한 무료 계산기 모음 — ${SITE_BRAND}`
    : isZh
      ? `韩国职场人士免费计算器合集 — ${SITE_BRAND}`
      : isVi
        ? `Bộ công cụ tính toán miễn phí cho người làm việc tại Hàn Quốc — ${SITE_BRAND}`
        : `Free Calculators for Korean Professionals — ${SITE_BRAND}`;
  const description = isKo
    ? "연봉 실수령액·연차·주휴수당·퇴직금부터 부가세·해외주식 양도세, 전기 KEC·목조 NDS 구조 계산, 사업자번호 검증·JSON CSV 변환까지. 한국 표준을 기반으로 만든 무료 계산기 20여 가지를 카테고리별로 정리해 회원가입 없이 바로 씁니다."
    : isZh
      ? "从年薪实领金额、年假、周休津贴、离职金,到增值税、海外股票转让税、电气KEC与木结构NDS结构计算、事业者登记号验证、JSON CSV转换。基于韩国标准打造的20余款免费计算器按分类整理,无需注册即可直接使用。"
      : isVi
        ? "Lương thực nhận, phép năm, phụ cấp nghỉ hàng tuần, trợ cấp thôi việc, thuế VAT, thuế chuyển nhượng cổ phiếu nước ngoài, điện KEC, nhà gỗ NDS, xác thực mã số kinh doanh, quy đổi JSON/CSV. Hơn 20 công cụ miễn phí theo tiêu chuẩn Hàn Quốc, phân theo danh mục."
        : "Korean payroll, tax, electric KEC, timber NDS, business number validation, and JSON/CSV converter. 20+ free calculators grouped by category.";
  const keywords = isKo
    ? [
        "연봉 실수령액",
        "연차 계산기",
        "주휴수당",
        "퇴직금 계산",
        "4대보험 계산",
        "부가세 계산기",
        "해외주식 양도세",
        "전선 굵기 계산",
        "차단기 용량",
        "단열 R값",
        "목조 주택",
        "사업자번호 검증",
        "JSON CSV 변환",
      ]
    : isZh
      ? [
          "韩国年薪实领金额",
          "韩国年假计算",
          "增值税计算器",
          "韩国电气标准KEC",
          "韩国木结构NDS",
          "事业者登记号验证",
        ]
      : isVi
        ? [
            "lương thực nhận Hàn Quốc",
            "phép năm Hàn Quốc",
            "máy tính thuế VAT",
            "tiêu chuẩn điện KEC Hàn Quốc",
            "nhà gỗ NDS Hàn Quốc",
            "xác thực mã số kinh doanh",
          ]
        : [
            "Korean payroll calculator",
            "annual leave Korea",
            "VAT calculator",
            "Korean electric code KEC",
            "timber NDS Korea",
            "business number validation",
          ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/tools`,
      languages: buildLanguagesAlt("/tools"),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/tools`,
      type: "website",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function ToolsHubPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const isVi = locale === "vi";
  const localeKey: Locale = isKo ? "ko" : isZh ? "zh" : isVi ? "vi" : "en";

  const groups = TOOL_GROUP_ORDER.map(
    (id) => TOOL_GROUPS.find((g) => g.id === id),
  ).filter((g): g is NonNullable<typeof g> => Boolean(g));

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
      <Breadcrumbs path="/tools" locale={localeKey} id="tools-hub" />
      <header className="mb-10 max-w-3xl animate-fade-up">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
          {isKo
            ? "무료 계산기 모음"
            : isZh
              ? "免费计算器合集"
              : isVi
                ? "Bộ công cụ tính toán miễn phí"
                : "Free Calculator Library"}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
          {isKo
            ? "한국 실무자를 위한 계산기"
            : isZh
              ? "韩国职场人士专用计算器"
              : isVi
                ? "Công cụ tính toán cho người làm việc tại Hàn Quốc"
                : "Calculators for Korean Professionals"}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
          {isKo
            ? "연봉 실수령액부터 전기 KEC, 목조 NDS, 부가세까지 — 한국 표준에 정확히 맞춘 20여 가지 계산기. 회원가입·결제·앱 설치 없이 즉시 사용."
            : isZh
              ? "从年薪实领金额到电气KEC、木结构NDS、增值税 — 精准贴合韩国标准的20余款计算器。无需注册、付费或安装应用，即刻使用。"
              : isVi
                ? "Từ lương thực nhận đến tiêu chuẩn điện KEC, nhà gỗ NDS, thuế VAT — hơn 20 công cụ tính toán bám sát tiêu chuẩn Hàn Quốc. Dùng ngay, không cần đăng ký, thanh toán hay cài đặt ứng dụng."
                : "From payroll take-home to Korean electric code, timber NDS, and VAT — 20+ calculators aligned to Korean standards. No signup, no payment, no app install."}
        </p>
      </header>

      <div className="mb-10">
        <ToolSearch locale={localeKey} />
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {groups.map((group) => {
          const copy = group.i18n[localeKey];
          const target = `/${locale}${group.hubHref ?? group.tools[0]?.href ?? ""}`;
          return (
            <article
              key={group.id}
              className="group relative overflow-hidden rounded-2xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-6 transition-all hover:border-[color:var(--color-border-strong)] hover:shadow-lg md:p-7"
            >
              <div
                className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${group.accent} opacity-70`}
              />

              <div className="mb-4 flex items-start gap-3">
                <span className="text-3xl" aria-hidden="true">
                  {group.emoji}
                </span>
                <div className="flex-1">
                  <h2 className="text-xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-2xl">
                    {copy.title}
                  </h2>
                  <p className="mt-1 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                    {copy.tagline}
                  </p>
                </div>
              </div>

              <ul className="mt-5 space-y-1.5">
                {group.tools.map((tool) => (
                  <li key={tool.href}>
                    <Link
                      href={`/${locale}${tool.href}`}
                      className="flex items-center justify-between gap-3 rounded-md px-2 py-1.5 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-bg-elevated)] hover:text-[color:var(--color-text-primary)]"
                    >
                      <span className="truncate">
                        {localeKey === "ko"
                          ? tool.labelKo
                          : localeKey === "zh"
                            ? tool.labelZh
                            : localeKey === "vi"
                              ? tool.labelVi
                              : tool.labelEn}
                      </span>
                      <ArrowUpRight size={14} className="flex-shrink-0 opacity-60" />
                    </Link>
                  </li>
                ))}
              </ul>

              <Link
                href={target}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-[color:var(--color-text-primary)] transition-colors hover:text-indigo-400"
              >
                <span>
                  {isKo
                    ? "카테고리 열기"
                    : isZh
                      ? "打开分类"
                      : isVi
                        ? "Mở danh mục"
                        : "Open category"}
                </span>
                <ArrowUpRight
                  size={14}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </Link>
            </article>
          );
        })}
      </div>

      <section className="mx-auto mt-14 max-w-3xl space-y-8 border-t border-[color:var(--color-border-subtle)] pt-10">
        <div>
          <h2 className="mb-3 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
            {isKo
              ? "이 모음에 대하여"
              : isZh
                ? "关于这套工具"
                : isVi
                  ? "Về bộ công cụ này"
                  : "About this collection"}
          </h2>
          <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo
              ? "Workmate의 계산기는 한국 표준(KS·KEC·NDS)과 현행 법령·요율에 정확히 맞춰져 있습니다. 단순히 답만 보여주지 않고 공식·근거·출처를 함께 제시해, 견적서·결재 자료에 그대로 첨부하거나 직접 검증할 수 있습니다. 모든 입력값은 브라우저에서만 처리되어 서버로 전송되지 않습니다."
              : isZh
                ? "Workmate的计算器精准贴合韩国标准(KS·KEC·NDS)与现行法令、费率。不只是给出答案，还同时展示计算公式、法律依据与出处，方便您直接附加到报价单、审批材料，或自行核实。所有输入数据仅在浏览器本地处理，绝不会传送至服务器。"
                : isVi
                  ? "Các công cụ tính toán của Workmate bám sát tiêu chuẩn Hàn Quốc (KS, KEC, NDS) cùng luật và biểu thuế hiện hành. Mỗi công cụ hiển thị công thức, căn cứ pháp lý và nguồn tham chiếu — không chỉ đưa ra kết quả — để bạn có thể đính kèm vào báo giá, hồ sơ phê duyệt hoặc tự kiểm chứng. Mọi dữ liệu nhập vào chỉ được xử lý trên trình duyệt, không gửi lên máy chủ."
                  : "Every Workmate calculator is aligned to Korean standards (KS, KEC, NDS) and current laws and rates. Each one shows the formula, basis, and sources — not just an answer — so you can attach it to a quote or filing, or verify it yourself. All inputs are processed in your browser and never sent to a server."}
          </p>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
            {isKo
              ? "어떤 카테고리가 있나요"
              : isZh
                ? "包含哪些分类"
                : isVi
                  ? "Có những danh mục nào"
                  : "What's inside"}
          </h2>
          <ul className="grid gap-2.5 text-sm text-[color:var(--color-text-secondary)] sm:grid-cols-2 md:text-base">
            {(isKo
              ? [
                  "연봉·근로 — 실수령액·연차·주휴수당·퇴직금·최저임금",
                  "세금·재무 — 종합소득세·부가세·복리·대출·프리랜서 3.3%",
                  "부동산 — 전월세 환산·임대료 5% 상한·전용/공급 면적",
                  "전기 — 전선 굵기·차단기·전압강하 (KEC 기준)",
                  "목조·자재 — 경간·콘크리트·합판·OSB·계단·물량",
                  "한국 생활·외국인 — 비자·국민연금 반환·건강보험·한국식 나이",
                ]
              : isZh
                ? [
                    "薪资·劳动 — 实领金额·年假·周休津贴·离职金·最低时薪",
                    "税务·财务 — 综合所得税·增值税·复利·贷款·自由职业者3.3%",
                    "房地产 — 全租·月租换算·租金5%上限·专有/供给面积",
                    "电气 — 电线线径·断路器·电压降 (KEC标准)",
                    "木结构·建材 — 跨距·混凝土·合板·OSB·楼梯·数量",
                    "韩国生活·外国人 — 签证·国民年金退还·健康保险·韩式年龄",
                  ]
                : isVi
                  ? [
                      "Lương · Lao động — lương thực nhận, phép năm, phụ cấp nghỉ hàng tuần, trợ cấp thôi việc, lương tối thiểu",
                      "Thuế · Tài chính — thuế thu nhập tổng hợp, thuế VAT, lãi suất kép, vay vốn, freelancer 3.3%",
                      "Bất động sản — quy đổi jeonse/wolse, giới hạn tăng tiền thuê 5%, diện tích sử dụng/cung cấp",
                      "Điện — tiết diện dây dẫn, cầu dao, sụt áp (theo tiêu chuẩn KEC)",
                      "Gỗ · Vật liệu — nhịp kết cấu, bê tông, ván ép, OSB, cầu thang, số lượng vật liệu",
                      "Sống ở Hàn · Người nước ngoài — visa, hoàn trả lương hưu quốc dân, bảo hiểm y tế, tuổi Hàn Quốc",
                    ]
                  : [
                      "Payroll & labor — take-home pay, annual leave, severance, min wage",
                      "Tax & finance — income tax, VAT, compound interest, loans",
                      "Real estate — jeonse/wolse, 5% rent cap, exclusive/supply area",
                      "Electric — wire size, breaker, voltage drop (Korean KEC)",
                      "Timber & materials — span, concrete, plywood, stairs, quantity",
                      "Korea living & foreigners — visas, pension refund, health insurance",
                    ]
            ).map((item, i) => (
              <li key={i} className="flex gap-2.5">
                <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h2 className="mb-3 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
            {isKo
              ? "한국에 사는 외국인이라면"
              : isZh
                ? "在韩国生活的外国人"
                : isVi
                  ? "Nếu bạn là người nước ngoài sống tại Hàn Quốc"
                  : "Living in Korea as a foreigner?"}
          </h2>
          <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {isKo ? (
              <>
                비자(F-2-7·D-8)·국민연금 반환일시금·건강보험료·전월세·연말정산
                도구를 영어로 제공합니다. 한국 정착의 전 과정을 정리한{" "}
                <Link
                  href={`/${locale}/blog/living-in-korea-foreigner-guide`}
                  className="text-indigo-300 underline-offset-2 hover:underline"
                >
                  완전 가이드
                </Link>
                도 함께 보세요.
              </>
            ) : isZh ? (
              <>
                签证(F-2-7·D-8)、国民年金退还金、健康保险费、全租月租换算、年末结算等工具目前以英文提供。关于韩国定居全过程的
                <Link
                  href={`/${locale}/blog/living-in-korea-foreigner-guide`}
                  className="text-indigo-300 underline-offset-2 hover:underline"
                >
                  完整指南
                </Link>
                也请一并查看。
              </>
            ) : isVi ? (
              <>
                Các công cụ visa (F-2-7, D-8), hoàn trả lương hưu quốc dân, bảo
                hiểm y tế, jeonse/wolse và quyết toán thuế cuối năm hiện có
                bằng tiếng Anh. Xem thêm{" "}
                <Link
                  href={`/${locale}/blog/living-in-korea-foreigner-guide`}
                  className="text-indigo-300 underline-offset-2 hover:underline"
                >
                  hướng dẫn đầy đủ về cuộc sống tại Hàn Quốc
                </Link>{" "}
                cho toàn bộ hành trình.
              </>
            ) : (
              <>
                Visa (F-2-7, D-8), National Pension refund, health insurance,
                jeonse/wolse, and year-end tax tools are available in English.
                See the{" "}
                <Link
                  href={`/${locale}/blog/living-in-korea-foreigner-guide`}
                  className="text-indigo-300 underline-offset-2 hover:underline"
                >
                  complete guide to living in Korea
                </Link>{" "}
                for the whole journey.
              </>
            )}
          </p>
        </div>
      </section>
      </div>
    </main>
  );
}
