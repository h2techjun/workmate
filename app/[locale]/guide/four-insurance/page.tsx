import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  if (locale === "en") {
    return {
      title: "Korean 4-major insurance demystified (2026 rates) | Workmate",
      description:
        "Why your take-home is 9.4%, not the headline 7.09% number. Korean payroll insurance breakdown for 2026.",
    };
  }
  return {
    title: "월급 300만원이면 실수령 얼마? 4대보험 완전 분해 (2026)",
    description:
      "표면 요율과 실제 차감액이 다른 이유. 국민연금부터 산재까지 한 줄 한 줄 따져봤습니다. 2026년 적용 요율.",
  };
}

export default async function FourInsuranceGuidePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/insurance-calc`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {locale === "ko" ? "4대보험 계산기로" : "To the calculator"}
          </Link>
        </nav>
        {locale === "ko" ? <ContentKo /> : <ContentEn />}
      </div>
    </main>
  );
}

function ContentKo(): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          재무 · 급여
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          월급 300만원이면 실수령 얼마? 4대보험 완전 분해
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          2026년 적용 요율. 마지막 업데이트 2026-04-27.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          뉴스나 회사 소개 자료에서 &ldquo;건강보험 7.09%&rdquo; 같은
          숫자를 보고 4대보험을 7%로 생각하는 분들이 많은데, 실제 차감
          비율은 그보다 훨씬 높습니다. 월급 300만원의 경우 근로자가
          실제로 차감 받는 금액은 282,120원, 비율로는 9.4%입니다.
        </p>
        <p>
          왜 이렇게 차이가 나는지 한 줄씩 따져봅니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          1. 국민연금 — 4.5%
        </h2>
        <p>
          국민연금 총 요율은 9%인데, 이걸 근로자와 사용자가 절반씩
          나눠 부담합니다. 근로자 부담분이 4.5%죠. 월 300만원이면
          135,000원. 여기까지는 직관적입니다.
        </p>
        <p>
          한 가지 알아둘 점. 월급이 617만원을 넘으면 그 이상은 부과
          대상이 안 됩니다. <strong>기준소득월액 상한</strong>이라고
          하는데 매년 바뀝니다. 2026년은 617만원이 상한, 39만원이
          하한입니다. 즉 월급 1,000만원 받는 사람도 국민연금은 617만원
          기준으로 277,650원만 떼입니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          2. 건강보험 — 3.545%
        </h2>
        <p>
          건강보험 총 요율 7.09%를 절반씩. 근로자 부담 3.545%. 월
          300만원이면 106,350원입니다.
        </p>
        <p>
          국민연금과 달리 <strong>상한이 없습니다</strong>. 월급이
          높을수록 비례해서 더 떼입니다. 그래서 고소득자일수록 국민연금
          비중이 줄고 건강보험 비중이 커집니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          3. 장기요양보험 — 건강보험료의 12.95%
        </h2>
        <p>
          이게 헷갈리는 부분입니다. 월급 기준이 아니라{" "}
          <strong>건강보험료의 12.95%</strong>가 장기요양 보험료입니다.
          이를 근로자·사용자가 절반씩.
        </p>
        <p>
          월 300만원의 경우 건강보험 총액이 212,700원(106,350 × 2),
          여기에 12.95% 곱하면 27,544원. 근로자 부담은 절반인 13,770원
          (10원 단위 절사). 작은 금액이지만 30년 누적되면 무시 못
          합니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          4. 고용보험 — 0.9% + 0.25%
        </h2>
        <p>
          고용보험은 두 부분으로 나뉩니다.
        </p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <strong>실업급여</strong>: 0.9% 근로자 + 0.9% 사용자 = 1.8%.
            실직 시 받는 그 실업급여 재원입니다.
          </li>
          <li>
            <strong>고용안정·직업능력개발</strong>: 사용자만 0.25%
            (150인 미만 사업장 기준). 근로자 부담 없음. 직업훈련비
            지원 등에 쓰입니다.
          </li>
        </ul>
        <p>월 300만원 근로자 부담은 27,000원입니다.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          5. 산재보험 — 사용자만 부담 (평균 0.86%)
        </h2>
        <p>
          산재보험은 <strong>근로자 부담이 없습니다</strong>. 사용자가
          100% 부담. 그래서 근로자 명세표에는 안 나옵니다.
        </p>
        <p>
          요율은 업종별로 다릅니다. 사무직 같은 저위험은 0.6% 정도,
          건설업·제조업은 1~3%까지 가고, 광업이나 어업 같은 고위험
          업종은 30%까지도 갑니다. 평균 0.86%로 잡습니다. 본 사이트
          계산기는 사용자가 업종 요율을 직접 입력할 수 있습니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          정리: 월급별 실수령액
        </h2>
        <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              <tr>
                <th className="px-4 py-2 text-left font-medium">월급</th>
                <th className="px-4 py-2 text-right font-medium">근로자 차감</th>
                <th className="px-4 py-2 text-right font-medium">실수령</th>
                <th className="px-4 py-2 text-right font-medium">차감율</th>
              </tr>
            </thead>
            <tbody className="text-[color:var(--color-text-secondary)] tabular-nums">
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">200만원</td>
                <td className="px-4 py-2 text-right">188,080</td>
                <td className="px-4 py-2 text-right">1,811,920</td>
                <td className="px-4 py-2 text-right">9.40%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">300만원</td>
                <td className="px-4 py-2 text-right">282,120</td>
                <td className="px-4 py-2 text-right">2,717,880</td>
                <td className="px-4 py-2 text-right">9.40%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">400만원</td>
                <td className="px-4 py-2 text-right">376,170</td>
                <td className="px-4 py-2 text-right">3,623,830</td>
                <td className="px-4 py-2 text-right">9.40%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">500만원</td>
                <td className="px-4 py-2 text-right">470,210</td>
                <td className="px-4 py-2 text-right">4,529,790</td>
                <td className="px-4 py-2 text-right">9.40%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">700만원</td>
                <td className="px-4 py-2 text-right">605,910</td>
                <td className="px-4 py-2 text-right">6,394,090</td>
                <td className="px-4 py-2 text-right">8.66%</td>
              </tr>
              <tr className="border-t border-[color:var(--color-border-subtle)]">
                <td className="px-4 py-2">1,000만원</td>
                <td className="px-4 py-2 text-right">747,560</td>
                <td className="px-4 py-2 text-right">9,252,440</td>
                <td className="px-4 py-2 text-right">7.48%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-sm">
          소득세·지방세 차감 전 기준입니다. 실제 통장에 들어오는
          금액은 여기서 소득세·지방세를 더 떼야 합니다. 700만원 이상
          차감율이 떨어지는 이유는 국민연금 상한(617만원) 적용 때문.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          사용자 입장 — 진짜 인건비는 따로 있습니다
        </h2>
        <p>
          월급 300만원 직원을 채용한다면 회사가 실제로 부담하는 비용은
          315,420원이 추가됩니다. 즉 <strong>총 인건비 3,315,420원</strong>이
          나가는 셈이죠.
        </p>
        <p>
          작은 회사라면 한 명 채용에 매월 31만원이 추가로 나가는
          느낌일 텐데, 1년이면 약 380만원, 5년이면 1,900만원입니다.
          채용 의사결정 시 표면 월급만 보면 안 되는 이유입니다.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          마무리
        </h2>
        <p>
          요약. 4대보험 근로자 부담은 월급의 약 9.4%(고소득자는 7~8%로
          내려감). 사용자 부담은 약 10.5%(산재 평균 적용 시). 합치면
          월급의 약 20%가 사회보험 명목으로 나갑니다. 본 사이트의{" "}
          <Link
            href="/ko/insurance-calc"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            4대보험 계산기
          </Link>
          는 월급만 입력하면 위 수치를 자동으로 산출합니다. 채용 시,
          이직 시, 연봉 협상 전에 한 번씩 돌려보면 도움이 됩니다.
        </p>
      </section>
    </article>
  );
}

function ContentEn(): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          Finance · Payroll
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Korean 4-major insurance demystified (2026)
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          Last updated 2026-04-27.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          People often see the headline rate (e.g., &ldquo;health 7.09%&rdquo;)
          and assume Korean payroll insurance is around 7%. The actual
          deduction is closer to 9.4% of monthly salary. Here&apos;s
          why, line by line.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          National Pension — 4.5%
        </h2>
        <p>
          Total rate 9%, split equally. Employee pays 4.5%. KRW 135,000
          on a 3M salary. Note the cap: salary above KRW 6.17M is not
          subject. Even a 10M earner pays only 277,650 KRW for pension.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Health Insurance — 3.545%
        </h2>
        <p>
          Total 7.09%, split equally. <strong>No cap.</strong> Higher
          earners pay proportionally more.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Long-term Care — 12.95% of health insurance
        </h2>
        <p>
          Calculated against the health premium, not salary. Tiny per
          month but compounds.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Employment Insurance — 0.9% + 0.25%
        </h2>
        <p>
          0.9% from employee + 0.9% from employer for unemployment
          benefits. Employer additionally pays 0.25% for vocational
          training (companies under 150).
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Industrial Accident — employer only
        </h2>
        <p>
          0% from employee. Employer pays 0.6%–30% depending on
          industry. Average 0.86%. Doesn&apos;t appear on the employee
          payslip.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Bottom line
        </h2>
        <p>
          Employee deduction ≈ 9.4% of salary (drops to ~7% above the
          pension cap). Employer burden ≈ 10.5%. Combined ≈ 20% of
          monthly salary going to social insurance. Try the{" "}
          <Link
            href="/en/insurance-calc"
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            calculator
          </Link>{" "}
          before negotiating a salary or making a hire.
        </p>
      </section>
    </article>
  );
}
