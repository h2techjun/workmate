import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import {
  DATA_REGISTRY,
  FRESHNESS_LIMIT_DAYS,
  type DataRegistryEntry,
  type RegistryCategory,
} from "@/lib/dataRegistry";

type Lang = "ko" | "en" | "vi";

interface PageProps {
  params: Promise<{ locale: string }>;
}

const toLang = (locale: string): Lang =>
  locale === "ko" ? "ko" : locale === "vi" ? "vi" : "en";

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const lang = toLang(locale);
  const title = {
    ko: "한국 기준 수치 레지스트리 — 최저임금·4대보험·기준금리·세율 (검증일 명시)",
    en: "Korean Rates & Thresholds Registry — Minimum Wage, Insurance, Base Rate (with verification dates)",
    vi: "Bảng tra cứu số liệu chuẩn Hàn Quốc — lương tối thiểu, 4 loại bảo hiểm, lãi suất (kèm ngày xác minh)",
  }[lang];
  const description = {
    ko: "Workmate의 모든 계산기가 실제로 사용하는 변동 수치를 한 페이지에 공개합니다. 최저임금·국민연금 상한·건강보험 요율·기준금리·실업급여 상하한 등 각 항목의 근거 법령·고시, 적용 기간, 최종 검증일까지. 계산기와 같은 상수를 직접 참조하므로 표시값이 어긋날 수 없습니다.",
    en: "Every variable figure Workmate's calculators actually use, on one page: minimum wage, pension income cap, health-insurance rates, BOK base rate, unemployment-benefit caps — each with its legal basis, effective period, and last-verified date. The page reads the same constants as the calculators, so it can never drift.",
    vi: "Mọi con số biến động mà các công cụ Workmate thực sự sử dụng, trên một trang: lương tối thiểu, trần thu nhập NPS, tỷ lệ BHYT, lãi suất cơ bản BOK, trần trợ cấp thất nghiệp — mỗi mục kèm căn cứ pháp lý, thời gian áp dụng và ngày xác minh gần nhất. Trang đọc cùng hằng số với các công cụ nên giá trị không thể sai lệch.",
  }[lang];
  const keywords = {
    ko: [
      "2026 최저임금",
      "국민연금 기준소득월액 상한",
      "2026 건강보험 요율",
      "한국은행 기준금리",
      "실업급여 상한액 하한액",
      "전월세전환율",
    ],
    en: [
      "korea minimum wage 2026",
      "korea national pension cap",
      "korea health insurance rate 2026",
      "bok base rate",
      "korea unemployment benefit cap",
      "korean tax rates registry",
    ],
    vi: [
      "lương tối thiểu Hàn Quốc 2026",
      "trần thu nhập NPS Hàn Quốc",
      "tỷ lệ BHYT Hàn Quốc 2026",
      "lãi suất cơ bản Hàn Quốc",
      "trợ cấp thất nghiệp Hàn Quốc",
      "bảng thuế suất Hàn Quốc",
    ],
  }[lang];
  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/data`,
      languages: buildLanguagesAlt("/data"),
    },
    openGraph: {
      title,
      description,
      type: "website",
      url: `${SITE_URL}/${locale}/data`,
      locale: lang === "ko" ? "ko_KR" : lang === "vi" ? "vi_VN" : "en_US",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

const CATEGORY_ORDER: readonly RegistryCategory[] = [
  "labor",
  "insurance",
  "tax",
  "realestate",
  "convention",
];

const CATEGORY_LABEL: Record<RegistryCategory, Record<Lang, string>> = {
  labor: { ko: "근로", en: "Labor", vi: "Lao động" },
  insurance: {
    ko: "4대보험",
    en: "Social insurance",
    vi: "Bảo hiểm xã hội",
  },
  tax: { ko: "세금", en: "Tax", vi: "Thuế" },
  realestate: {
    ko: "부동산 · 금리",
    en: "Real estate · rates",
    vi: "Bất động sản · lãi suất",
  },
  convention: {
    ko: "경험칙 (법정 아님)",
    en: "Rules of thumb (not statutory)",
    vi: "Kinh nghiệm (không phải luật)",
  },
};

const KIND_BADGE: Record<
  DataRegistryEntry["kind"],
  { label: Record<Lang, string>; cls: string }
> = {
  statutory: {
    label: { ko: "법령", en: "Statute", vi: "Luật định" },
    cls: "border-emerald-500/40 text-emerald-300",
  },
  official: {
    label: {
      ko: "고시·결정",
      en: "Official notice",
      vi: "Thông báo chính thức",
    },
    cls: "border-sky-500/40 text-sky-300",
  },
  convention: {
    label: { ko: "경험칙", en: "Rule of thumb", vi: "Kinh nghiệm" },
    cls: "border-amber-500/40 text-amber-300",
  },
};

const UI = {
  ko: {
    allTools: "툴 모음",
    h1: "한국 기준 수치 레지스트리",
    intro:
      "이 페이지는 Workmate 계산기들이 실제로 사용하는 변동 수치를 그대로 공개합니다. 표시값은 계산기와 같은 상수 파일을 직접 읽으므로 서로 어긋날 수 없고, 각 항목에는 근거 법령·고시와 적용 기간, 최종 검증일이 붙어 있습니다. 최저임금·요율처럼 해마다 바뀌는 값을 다루는 사이트의 최소한의 책임이라고 생각합니다.",
    colItem: "항목",
    colValue: "현재 값",
    colBasis: "근거 · 적용",
    colVerified: "검증일",
    methodH2: "검증 방법과 한계",
    m1: `• 각 수치는 코드의 단일 상수 파일에만 존재하며, 이 페이지와 계산기가 같은 상수를 import합니다. 검증일이 ${FRESHNESS_LIMIT_DAYS}일을 넘기면 내부 자동 점검이 경고를 냅니다.`,
    m2: "• '고시·결정' 항목은 발표 주기(최저임금 매년 8월, 국민연금 상하한 매년 7월, 기준금리 연 8회 등)가 있어 그 직후 갱신합니다. 실증 사례: 2026-07-03 이 레지스트리를 구축하며 최저임금·연금 상하한·실업급여 상하한 3건의 낡은 값을 발견해 즉시 수정했습니다.",
    m3: "• '경험칙' 배지는 법정 기준이 아닌 업계 통용 수치입니다. 계약·신고 등 실제 의사결정 전에는 반드시 관계 기관(법제처 국가법령정보센터, 고용노동부, NPS, NHIS, 한국은행, HUG)에서 원문을 확인하세요.",
    m4: "• 이 페이지는 정보 제공용이며 법률·세무 자문이 아닙니다.",
  },
  en: {
    allTools: "All tools",
    h1: "Korean Rates & Thresholds Registry",
    intro:
      "This page publishes the variable figures Workmate's calculators actually use. The displayed values read the very same constant files as the calculators — so they cannot drift — and every entry carries its legal basis, effective period, and the date we last verified it. For a site built on numbers that change every year, we consider this the minimum standard of accountability.",
    colItem: "Item",
    colValue: "Current value",
    colBasis: "Basis · effective",
    colVerified: "Verified",
    methodH2: "How we verify — and the limits",
    m1: `• Each figure lives in exactly one constants file; this page and the calculators import the same constant. Our internal audit warns when a verification date exceeds ${FRESHNESS_LIMIT_DAYS} days.`,
    m2: "• 'Official notice' items follow announcement cycles (minimum wage every August, pension base every July, base rate 8 meetings/year) and are updated right after. Proof it works: while building this registry on 2026-07-03 we caught and fixed three stale values (minimum wage, pension base, unemployment caps).",
    m3: "• The 'rule of thumb' badge marks non-statutory, industry-convention figures. Before real decisions (contracts, filings), always confirm the primary source — the National Law Information Center, MOEL, NPS, NHIS, Bank of Korea, or HUG.",
    m4: "• This page is informational and not legal or tax advice.",
  },
  vi: {
    allTools: "Tất cả công cụ",
    h1: "Bảng tra cứu số liệu chuẩn Hàn Quốc",
    intro:
      "Trang này công bố các con số biến động mà công cụ Workmate thực sự sử dụng. Giá trị hiển thị đọc trực tiếp cùng tệp hằng số với các công cụ tính — nên không thể sai lệch — và mỗi mục đều kèm căn cứ pháp lý, thời gian áp dụng, và ngày chúng tôi xác minh gần nhất. Với một trang xây trên những con số thay đổi hằng năm, chúng tôi xem đây là mức trách nhiệm tối thiểu.",
    colItem: "Mục",
    colValue: "Giá trị hiện tại",
    colBasis: "Căn cứ · áp dụng",
    colVerified: "Ngày xác minh",
    methodH2: "Cách chúng tôi xác minh — và giới hạn",
    m1: `• Mỗi con số chỉ tồn tại trong đúng một tệp hằng số; trang này và các công cụ import cùng một hằng số. Kiểm tra nội bộ sẽ cảnh báo khi ngày xác minh vượt quá ${FRESHNESS_LIMIT_DAYS} ngày.`,
    m2: "• Các mục 'thông báo chính thức' theo chu kỳ công bố (lương tối thiểu mỗi tháng 8, mức chuẩn NPS mỗi tháng 7, lãi suất cơ bản 8 kỳ/năm) và được cập nhật ngay sau đó. Bằng chứng: khi xây bảng này ngày 2026-07-03, chúng tôi đã phát hiện và sửa 3 giá trị cũ (lương tối thiểu, mức chuẩn NPS, trần trợ cấp thất nghiệp).",
    m3: "• Nhãn 'kinh nghiệm' đánh dấu số liệu theo thông lệ ngành, không phải luật định. Trước quyết định thực tế (hợp đồng, khai báo), hãy luôn xác nhận nguồn gốc — Trung tâm Thông tin Pháp luật Quốc gia, MOEL, NPS, NHIS, Ngân hàng Trung ương Hàn Quốc, hoặc HUG.",
    m4: "• Trang này chỉ mang tính thông tin, không phải tư vấn pháp lý hay thuế.",
  },
} as const;

export default async function DataRegistryPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const lang = toLang(locale);
  const t = UI[lang];

  const nameOf = (e: DataRegistryEntry): string =>
    lang === "ko" ? e.nameKo : lang === "vi" ? e.nameVi : e.nameEn;
  const valueOf = (e: DataRegistryEntry): string =>
    lang === "ko" ? e.valueKo : lang === "vi" ? e.valueVi : e.valueEn;
  const basisOf = (e: DataRegistryEntry): string =>
    lang === "ko" ? e.basisKo : lang === "vi" ? e.basisVi : e.basisEn;
  const effectiveOf = (e: DataRegistryEntry): string =>
    lang === "ko" ? e.effectiveKo : lang === "vi" ? e.effectiveVi : e.effectiveEn;

  const grouped = CATEGORY_ORDER.map((cat) => ({
    cat,
    entries: DATA_REGISTRY.filter((e) => e.category === cat),
  })).filter((g) => g.entries.length > 0);

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-5xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/tools`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {t.allTools}
          </Link>
        </nav>

        <header className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            {t.h1}
          </h1>
          <p className="mt-2.5 max-w-3xl text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {t.intro}
          </p>
        </header>

        <div className="space-y-10">
          {grouped.map(({ cat, entries }) => (
            <section key={cat}>
              <h2 className="mb-4 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
                {CATEGORY_LABEL[cat][lang]}
              </h2>
              <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
                <table className="w-full min-w-[640px] text-sm">
                  <thead>
                    <tr className="border-b border-[color:var(--color-border-subtle)] text-left text-[color:var(--color-text-tertiary)]">
                      <th className="px-3 py-2.5 font-medium">{t.colItem}</th>
                      <th className="px-3 py-2.5 font-medium">{t.colValue}</th>
                      <th className="px-3 py-2.5 font-medium">{t.colBasis}</th>
                      <th className="px-3 py-2.5 font-medium whitespace-nowrap">
                        {t.colVerified}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[color:var(--color-text-secondary)]">
                    {entries.map((e) => (
                      <tr
                        key={e.key}
                        className="border-b border-[color:var(--color-border-subtle)]/60 align-top last:border-b-0"
                      >
                        <td className="px-3 py-3">
                          <div className="font-medium text-[color:var(--color-text-primary)]">
                            {nameOf(e)}
                          </div>
                          <span
                            className={`mt-1.5 inline-block rounded-full border px-2 py-0.5 text-[11px] ${KIND_BADGE[e.kind].cls}`}
                          >
                            {KIND_BADGE[e.kind].label[lang]}
                          </span>
                          <div className="mt-2 flex flex-wrap gap-1.5">
                            {e.tools.map((tool) => (
                              <Link
                                key={tool}
                                href={`/${locale}${tool}`}
                                className="text-xs text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
                              >
                                {tool}
                              </Link>
                            ))}
                          </div>
                        </td>
                        <td className="px-3 py-3 tabular-nums">{valueOf(e)}</td>
                        <td className="px-3 py-3 text-xs leading-relaxed">
                          <div>{basisOf(e)}</div>
                          <div className="mt-1 text-[color:var(--color-text-tertiary)]">
                            {effectiveOf(e)}
                          </div>
                        </td>
                        <td className="px-3 py-3 whitespace-nowrap text-xs tabular-nums">
                          {e.lastVerified}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          ))}
        </div>

        <section className="mt-12 space-y-4 rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-5 md:p-6">
          <h2 className="text-lg font-bold text-[color:var(--color-text-primary)] md:text-xl">
            {t.methodH2}
          </h2>
          <ul className="space-y-2 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
            <li>{t.m1}</li>
            <li>{t.m2}</li>
            <li>{t.m3}</li>
            <li>{t.m4}</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
