import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { calculateInsurance } from "@/lib/calculations/insurance/fourMajorInsurance";
import { CalculatorJsonLd } from "@/components/seo/StructuredData";
import { SITE_URL } from "@/lib/siteConfig";

interface PageProps {
  params: Promise<{ locale: string; amount: string }>;
}

/**
 * 사전에 빌드 타임에 생성할 월급 (만원). 전 범위가 아니라
 * 검색 빈도 높은 구간만 추려서 60여 개 페이지 생성.
 */
const STATIC_SALARY_PAGES_MAN = [
  150, 180, 200, 210, 220, 230, 240, 250, 260, 270, 280, 290, 300, 310, 320, 330,
  340, 350, 360, 370, 380, 390, 400, 410, 420, 430, 440, 450, 460, 470, 480, 490,
  500, 520, 550, 580, 600, 650, 700, 750, 800, 850, 900, 1000, 1200, 1500, 2000,
];

const formatKrw = (n: number): string =>
  new Intl.NumberFormat("ko-KR").format(Math.round(n));

const formatMan = (man: number): string => {
  if (man >= 10000) return `${(man / 10000).toFixed(0)}억원`;
  return `${formatKrw(man)}만원`;
};

interface NeighborInfo {
  amountMan: number;
  url: string;
  label: string;
}

function getNeighbors(
  amountMan: number,
  locale: string,
): { prev?: NeighborInfo; next?: NeighborInfo } {
  const sorted = [...STATIC_SALARY_PAGES_MAN].sort((a, b) => a - b);
  const idx = sorted.indexOf(amountMan);
  if (idx === -1) return {};
  const prev = idx > 0 ? sorted[idx - 1] : undefined;
  const next = idx < sorted.length - 1 ? sorted[idx + 1] : undefined;
  return {
    prev: prev !== undefined
      ? {
          amountMan: prev,
          url: `/${locale}/salary/${prev}`,
          label: formatMan(prev),
        }
      : undefined,
    next: next !== undefined
      ? {
          amountMan: next,
          url: `/${locale}/salary/${next}`,
          label: formatMan(next),
        }
      : undefined,
  };
}

export function generateStaticParams(): Array<{ amount: string }> {
  return STATIC_SALARY_PAGES_MAN.map((man) => ({ amount: man.toString() }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale, amount } = await params;
  const amountMan = Number(amount);
  if (!Number.isFinite(amountMan) || amountMan < 100) return {};
  const monthlyKrw = amountMan * 10000;
  if (locale === "en") {
    return {
      title: `Monthly KRW ${formatKrw(monthlyKrw)} take-home (Korean 2026 payroll insurance)`,
      description: `If your gross monthly salary is KRW ${formatKrw(monthlyKrw)}, here's the breakdown of Korean 4-major insurance deductions and your take-home pay (2026 rates).`,
      alternates: {
        canonical: `${SITE_URL}/en/salary/${amount}`,
        languages: {
          ko: `/ko/salary/${amount}`,
          en: `/en/salary/${amount}`,
        },
      },
    };
  }
  return {
    title: `월급 ${formatMan(amountMan)} 실수령액 (4대보험 2026 적용)`,
    description: `세전 월급 ${formatMan(amountMan)} 받으면 4대보험 차감 후 실수령액은 얼마? 국민연금·건강보험·고용보험을 항목별로 분해해 드립니다. 2026년 요율 기준.`,
    alternates: {
      canonical: `${SITE_URL}/ko/salary/${amount}`,
      languages: {
        ko: `/ko/salary/${amount}`,
        en: `/en/salary/${amount}`,
      },
    },
  };
}

/** 변수 기반 commentary — 동일 템플릿 반복 회피용 */
function getSalaryCommentary(amountMan: number): string {
  if (amountMan <= 200) {
    return `${formatMan(amountMan)}은 2026년 최저임금(시급 9,860원, 월 209만원)에 가까운 구간입니다. 이 정도 급여대에서는 4대보험 부담이 체감상 크게 느껴지는데, 차감율은 약 9.4%로 다른 구간과 동일합니다. 절대 금액이 작다 보니 비율이 같아도 부담이 큰 거죠.`;
  }
  if (amountMan <= 300) {
    return `${formatMan(amountMan)}은 한국 30대 직장인의 평균 임금에 근접한 구간입니다. 4대보험 차감율은 약 9.4%로 표준적이며, 연말정산에서 큰 환급이나 추가 납부가 발생하지 않는 안정적인 구간입니다.`;
  }
  if (amountMan <= 500) {
    return `${formatMan(amountMan)} 구간은 국민연금 기준소득월액 상한(617만원)에 아직 도달하지 않아 모든 보험이 비례 적용됩니다. 차감율 약 9.4%가 그대로 유지됩니다.`;
  }
  if (amountMan <= 700) {
    return `${formatMan(amountMan)}은 국민연금 상한(617만원)에 근접하거나 약간 넘어서는 구간입니다. 상한 이상의 급여에 대해서는 국민연금이 더 이상 부과되지 않아, 차감율이 9.4%에서 약 8.6%로 점진적으로 떨어집니다.`;
  }
  if (amountMan <= 1000) {
    return `${formatMan(amountMan)} 정도가 되면 국민연금 상한 효과로 차감율이 7~8% 수준으로 떨어집니다. 다만 건강보험은 상한이 없어서 비례 부담이 계속 커지는 구간입니다.`;
  }
  return `${formatMan(amountMan)} 이상의 고소득자는 국민연금 차감액이 277,650원에서 고정됩니다(상한). 건강보험은 비례 적용되므로 차감 절대액은 계속 늘지만, 비율로는 7% 아래로 떨어집니다.`;
}

export default async function SalaryPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale, amount } = await params;
  const amountMan = Number(amount);

  if (!Number.isFinite(amountMan) || amountMan < 100 || amountMan > 5000) {
    notFound();
  }
  const monthlyKrw = amountMan * 10000;

  const result = calculateInsurance({ monthlySalary: monthlyKrw });
  const { prev, next } = getNeighbors(amountMan, locale);

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <CalculatorJsonLd
        name={
          locale === "ko"
            ? `월급 ${formatMan(amountMan)} 실수령액 (4대보험 2026)`
            : `Monthly KRW ${formatKrw(monthlyKrw)} take-home`
        }
        description={
          locale === "ko"
            ? `세전 월급 ${formatMan(amountMan)} 기준 4대보험 차감 후 실수령액 분석.`
            : `Korean payroll insurance breakdown for monthly KRW ${formatKrw(monthlyKrw)}.`
        }
        url={`${SITE_URL}/${locale}/salary/${amount}`}
      />
      <div className="mx-auto max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/insurance-calc`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {locale === "ko" ? "4대보험 계산기" : "4-Major Insurance Calculator"}
          </Link>
        </nav>

        <header className="mb-6">
          <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
            {locale === "ko" ? "급여별 시뮬레이션" : "Salary Simulation"}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
            {locale === "ko"
              ? `월급 ${formatMan(amountMan)} 실수령액`
              : `Monthly KRW ${formatKrw(monthlyKrw)} take-home`}
          </h1>
          <p className="mt-2 text-sm text-[color:var(--color-text-tertiary)]">
            {locale === "ko"
              ? "2026년 4대보험 요율 적용 · 세전 기준"
              : "2026 Korean payroll insurance · before income tax"}
          </p>
        </header>

        {/* Hero */}
        <section className="mb-6 rounded-xl bg-gradient-to-br from-indigo-500/15 via-indigo-500/5 to-transparent p-6 ring-1 ring-indigo-500/20">
          <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
            {locale === "ko" ? "근로자 실수령액" : "Take-home"}
          </p>
          <p className="mt-2 flex items-baseline gap-2">
            <span className="text-4xl font-bold tracking-tight text-white tabular-nums md:text-5xl">
              {formatKrw(result.netSalary)}
            </span>
            <span className="text-xl font-semibold text-[color:var(--color-text-secondary)]">
              {locale === "ko" ? "원" : "KRW"}
            </span>
          </p>
          <p className="mt-2 text-sm text-[color:var(--color-text-secondary)]">
            {locale === "ko"
              ? `세전 ${formatKrw(monthlyKrw)}원에서 4대보험 ${formatKrw(result.totalEmployee)}원 차감.`
              : `Pre-tax KRW ${formatKrw(monthlyKrw)} − insurance KRW ${formatKrw(result.totalEmployee)} = take-home.`}
          </p>
        </section>

        {/* Breakdown table */}
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-[color:var(--color-text-primary)]">
            {locale === "ko" ? "보험별 분해" : "By insurance"}
          </h2>
          <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
            <table className="w-full text-sm">
              <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                <tr>
                  <th className="px-4 py-2 text-left font-medium">
                    {locale === "ko" ? "보험" : "Insurance"}
                  </th>
                  <th className="px-4 py-2 text-right font-medium">
                    {locale === "ko" ? "근로자" : "Employee"}
                  </th>
                  <th className="px-4 py-2 text-right font-medium">
                    {locale === "ko" ? "사용자" : "Employer"}
                  </th>
                </tr>
              </thead>
              <tbody className="text-[color:var(--color-text-secondary)] tabular-nums">
                {result.lines.map((l) => (
                  <tr key={l.key} className="border-t border-[color:var(--color-border-subtle)]">
                    <td className="px-4 py-2 text-left">
                      {l.key === "nationalPension" && (locale === "ko" ? "국민연금" : "National Pension")}
                      {l.key === "healthInsurance" && (locale === "ko" ? "건강보험" : "Health")}
                      {l.key === "longTermCare" && (locale === "ko" ? "장기요양" : "Long-term Care")}
                      {l.key === "employmentUnemployment" && (locale === "ko" ? "고용보험 (실업급여)" : "Employment (UI)")}
                      {l.key === "employmentExtra" && (locale === "ko" ? "고용보험 (안정·능력개발)" : "Employment (Stability)")}
                      {l.key === "industrialAccident" && (locale === "ko" ? "산재보험" : "Industrial Accident")}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {l.employee > 0 ? formatKrw(l.employee) : "—"}
                    </td>
                    <td className="px-4 py-2 text-right">
                      {l.employer > 0 ? formatKrw(l.employer) : "—"}
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-[color:var(--color-border-default)] bg-[color:var(--color-bg-card-hover)] font-semibold text-[color:var(--color-text-primary)]">
                  <td className="px-4 py-2">
                    {locale === "ko" ? "합계" : "Total"}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatKrw(result.totalEmployee)}
                  </td>
                  <td className="px-4 py-2 text-right">
                    {formatKrw(result.totalEmployer)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Variable commentary */}
        <section className="mb-8 space-y-3 leading-relaxed text-[color:var(--color-text-secondary)]">
          <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
            {locale === "ko" ? "이 구간의 특징" : "What stands out at this salary"}
          </h2>
          <p>
            {locale === "ko"
              ? getSalaryCommentary(amountMan)
              : `For a monthly salary of KRW ${formatKrw(monthlyKrw)}, the 4-major insurance deduction is approximately ${((result.totalEmployee / monthlyKrw) * 100).toFixed(2)}% of gross. Employer additionally contributes ${((result.totalEmployer / monthlyKrw) * 100).toFixed(2)}%.`}
          </p>
        </section>

        {/* Employer cost */}
        <section className="mb-8">
          <h2 className="mb-3 text-xl font-semibold text-[color:var(--color-text-primary)]">
            {locale === "ko" ? "사용자 입장" : "Employer perspective"}
          </h2>
          <p className="leading-relaxed text-[color:var(--color-text-secondary)]">
            {locale === "ko" ? (
              <>
                {formatMan(amountMan)} 직원을 채용한다면 회사가 실제로
                매월 부담하는 총 인건비는{" "}
                <strong className="text-white">
                  {formatKrw(result.totalCost)}원
                </strong>
                . 즉 사용자 입장에서는 표면 월급보다{" "}
                {formatKrw(result.totalEmployer)}원이 추가로 나가는
                구조입니다.
              </>
            ) : (
              <>
                Employer&apos;s actual monthly cost for an employee on
                KRW {formatKrw(monthlyKrw)} salary is{" "}
                <strong className="text-white">
                  KRW {formatKrw(result.totalCost)}
                </strong>
                {" "}— that&apos;s KRW {formatKrw(result.totalEmployer)}{" "}
                on top of the headline pay.
              </>
            )}
          </p>
        </section>

        {/* Neighbors navigation */}
        {(prev || next) && (
          <nav className="mb-8 grid grid-cols-2 gap-3">
            {prev ? (
              <Link
                href={prev.url}
                className="surface-card group flex flex-col gap-1 p-4 transition-colors hover:bg-[color:var(--color-bg-card-hover)]"
              >
                <span className="text-xs text-[color:var(--color-text-tertiary)]">
                  ← {locale === "ko" ? "낮은 월급" : "Lower salary"}
                </span>
                <span className="font-semibold text-[color:var(--color-text-primary)]">
                  {prev.label}
                </span>
              </Link>
            ) : (
              <div />
            )}
            {next ? (
              <Link
                href={next.url}
                className="surface-card group flex flex-col items-end gap-1 p-4 transition-colors hover:bg-[color:var(--color-bg-card-hover)]"
              >
                <span className="text-xs text-[color:var(--color-text-tertiary)]">
                  {locale === "ko" ? "높은 월급" : "Higher salary"} →
                </span>
                <span className="font-semibold text-[color:var(--color-text-primary)]">
                  {next.label}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        )}

        <section className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
          <p>
            {locale === "ko" ? (
              <>
                다른 월급으로 시뮬레이션하려면{" "}
                <Link
                  href={`/${locale}/insurance-calc`}
                  className="text-indigo-300 underline-offset-2 hover:underline"
                >
                  4대보험 계산기
                </Link>
                를 열어 직접 입력하세요. 산재보험 요율은 업종에 따라
                다르므로 자세한 분석은 계산기에서 가능합니다.
              </>
            ) : (
              <>
                For other salaries, use the{" "}
                <Link
                  href={`/${locale}/insurance-calc`}
                  className="text-indigo-300 underline-offset-2 hover:underline"
                >
                  insurance calculator
                </Link>{" "}
                directly. Industrial-accident rate varies by industry —
                adjust it there.
              </>
            )}
          </p>
          <Link
            href={`/${locale}/guide/four-insurance`}
            className="mt-3 inline-flex items-center gap-1.5 text-indigo-300 hover:underline"
          >
            {locale === "ko" ? "4대보험 완전 분해 가이드" : "Full guide"}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </section>
      </div>
    </main>
  );
}
