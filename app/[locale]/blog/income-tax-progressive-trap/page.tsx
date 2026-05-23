/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { findPost } from "@/lib/blogPosts";

const SLUG = "income-tax-progressive-trap";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale !== "en";
  const post = findPost(SLUG)!;
  const title = isKo ? post.titleKo : post.titleEn;
  const description = isKo ? post.summaryKo : post.summaryEn;
  return {
    title: `${title} — Workmate`,
    description,
    alternates: {
      canonical: `/${locale}/blog/${SLUG}`,
      languages: buildLanguagesAlt(`/blog/${SLUG}`),
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/${locale}/blog/${SLUG}`,
      locale: locale === "ko" ? "ko_KR" : "en_US",
      publishedTime: post.publishedAt,
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function BlogPostPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale !== "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {isKo ? "현장 노트" : "Field Notes"}
          </Link>
        </nav>

        {isKo ? <KoContent locale={locale} /> : <EnContent locale={locale} />}
      </div>
    </main>
  );
}

function KoContent({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-6 text-[color:var(--color-text-secondary)]">
      <header className="mb-2">
        <p className="mb-3 text-sm text-[color:var(--color-text-tertiary)]">
          2026-05-23 · 약 7분
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          종합소득세 누진세에서 가장 자주 헷갈리는 5가지
        </h1>
      </header>

      <p className="leading-relaxed">
        매년 5월이면 같은 질문이 반복됩니다. &ldquo;구간 넘어가면 손해라는데
        진짜예요?&rdquo; &ldquo;누진공제는 환급인가요?&rdquo;
        &ldquo;프리랜서 수입 한 푼만 더 받았다가 세금 더 내는 거 아니에요?&rdquo;
        그런데 이 질문들의 답은 거의 모두 &lsquo;아니오&rsquo; 입니다.
        하나씩 풀어봅니다. 실제 숫자는{" "}
        <Link
          href={`/${locale}/income-tax`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          종합소득세 계산기
        </Link>
        에서 직접 확인할 수 있습니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        1. &ldquo;구간 넘어가면 손해다&rdquo; — 이건 완전한 오해입니다
      </h2>
      <p className="leading-relaxed">
        가장 흔한 오해입니다. 5,000만원 구간(15%)에서 5,001만원(24% 구간)으로
        딱 1만원 더 벌었다고, 갑자기 1만원 전체에 24% 가 매겨지는 게 아닙니다.
        한국 종합소득세는 <strong>초과누진세</strong>입니다. 각 구간을 넘어가는
        부분만 더 높은 세율이 적용됩니다.
      </p>
      <p className="leading-relaxed">
        구체적으로:
      </p>
      <ul className="ml-1 list-disc space-y-1.5 pl-5 leading-relaxed text-sm">
        <li>0 ~ 1,400만원: 6%</li>
        <li>1,400만 ~ 5,000만원: 15%</li>
        <li>5,000만 ~ 8,800만원: 24%</li>
        <li>이상은 8단계로 45% 까지</li>
      </ul>
      <p className="leading-relaxed">
        5,001만원의 산출세액은 (1,400만 × 6%) + (3,600만 × 15%) + (1만 × 24%) =
        84만 + 540만 + 0.24만 = <strong>624.24만원</strong>. 1만원 더 번
        결과 추가로 내는 세금은 2,400원입니다. &lsquo;구간 넘으면 손해&rsquo;
        라는 말은 사실이 아닙니다.
      </p>
      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        다만 4대보험·건강보험은 일부 구간 진입 시 비례 이상으로 부담이 늘
        수 있어, 그쪽이 진짜 &lsquo;구간 함정&rsquo; 의 원인이 됩니다. 종합
        소득세 자체가 함정인 경우는 없습니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        2. 누진공제는 환급이 아니라 단순 계산법입니다
      </h2>
      <p className="leading-relaxed">
        &lsquo;누진공제&rsquo; 라는 단어 때문에 &lsquo;공제받아 세금이 줄어든다&rsquo;
        는 인상을 받지만, 실제로는 계산 단순화 트릭일 뿐입니다.
      </p>
      <p className="leading-relaxed">
        위 5,001만원 사례를 다시 봅니다. 구간별로 곱해서 더하면 정확하지만
        매번 계산이 번거롭죠. 그래서 전체에 24%를 곱한 다음 일정 금액을 빼는
        식으로 바꿉니다. 5,001만 × 24% = 1,200.24만. 여기서 누진공제 576만을
        빼면 624.24만. 결과 똑같습니다.
      </p>
      <p className="leading-relaxed">
        즉 누진공제 576만원은 &lsquo;5,000만원 이하 구간의 낮은 세율을 적용한
        효과를 단순화&rsquo; 한 숫자입니다. 별도로 환급되는 게 아니라 그냥
        세액 계산 도구입니다. 세무서 직원이 &ldquo;누진공제 576만원 빼드리겠습니다&rdquo;
        라고 하면, 그건 원래 그렇게 계산하는 거고, 추가 혜택이 아닙니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        3. 실효세율이 한계세율보다 항상 낮은 이유
      </h2>
      <p className="leading-relaxed">
        과세표준 1억원의 한계세율은 35%지만, 실제로 내는 세금은 1억의 35%가
        아닙니다. 산출세액은 (1억 × 35%) − 1,544만 = 1,956만원. 1억 대비
        19.56%. 이게 실효세율입니다.
      </p>
      <p className="leading-relaxed">
        한계세율은 &lsquo;다음 1만원에 적용되는 세율&rsquo;, 실효세율은
        &lsquo;전체 소득에 평균적으로 적용된 세율&rsquo; 입니다. 둘이 같지 않고
        실효세율이 항상 낮습니다. 절세 계획에서는 두 개념을 구분하는 게
        중요합니다 — 추가 소득의 세 부담은 한계세율로, 전체 부담은 실효세율
        로 봐야 합니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        4. 연봉·소득과 과세표준은 다른 개념입니다
      </h2>
      <p className="leading-relaxed">
        연봉 5,000만원 직장인이 종합소득세 계산기에 5,000만원을 그대로 넣으면
        틀린 결과가 나옵니다. 한국 세법의 &lsquo;과세표준&rsquo; 은 다음과
        같이 차감 후 남는 값입니다.
      </p>
      <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-sm leading-relaxed">
        연봉(총급여) − 근로소득공제 − 인적공제 − 연금보험료공제 −
        특별공제(주택·기부금 등) = 과세표준
      </div>
      <p className="leading-relaxed">
        연봉 5,000만의 일반적인 과세표준은 약 3,000만원 수준. 여기에 15% 구간
        세율이 적용됩니다. 그래서 연봉 5,000만이라고 24% 구간이 아니라 15%
        구간 사람인 거죠. 종합소득세 계산기는 &lsquo;과세표준&rsquo; 칸이
        있으니, 연말정산 영수증의 그 값을 그대로 가져오시면 됩니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        5. 분리과세 vs 종합과세 — 항상 분리가 유리한 건 아닙니다
      </h2>
      <p className="leading-relaxed">
        금융소득(이자·배당) 연 2,000만원 이하는 자동 분리과세 14%(지방세 포함
        15.4%) 입니다. 2,000만원 초과부터 종합과세 대상이라 합산해 누진세
        적용. 그런데 종합과세 됐다고 무조건 손해가 아닙니다.
      </p>
      <p className="leading-relaxed">
        과세표준 1,400만원 이하 (예: 은퇴 후 다른 소득이 적은 경우) 라면
        종합과세 시 6% 가 적용되어 분리과세 14% 보다 유리할 수 있습니다.
        반대로 직장인이 연봉으로 이미 24% 구간 이상이면 분리과세 유지가
        더 낫죠.
      </p>
      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        실제로는 &lsquo;비교과세&rsquo; 라는 제도가 있어 종합과세 신고 시
        분리과세 가정으로 계산한 세액과 비교해 더 적은 쪽을 적용하므로
        대부분 손해는 안 봅니다. 단 신고는 해야 합니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        마무리
      </h2>
      <p className="leading-relaxed">
        종합소득세는 &lsquo;복잡해 보이지만 규칙은 정확&rsquo; 한 영역입니다.
        오해는 보통 누진세의 작동 원리에서 시작됩니다. 본인의 과세표준을
        정확히 파악한 다음{" "}
        <Link
          href={`/${locale}/income-tax`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          종합소득세 계산기
        </Link>
        에 넣어 보면 한계세율·실효세율·산출세액이 한 번에 보입니다. 5월 신고
        전에 한 번 돌려보시면 예상 세액·환급액을 미리 가늠할 수 있습니다.
      </p>
      <p className="text-sm text-[color:var(--color-text-tertiary)]">
        본 글은 일반 원리 설명용이며, 자녀세액공제·기부금공제·의료비공제
        등 세부 항목은 별도 적용해야 합니다. 정확한 신고는 홈택스
        &lsquo;신고도움 서비스&rsquo; 또는 세무사 상담으로 진행하세요.
      </p>
    </article>
  );
}

function EnContent({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-6 text-[color:var(--color-text-secondary)]">
      <header className="mb-2">
        <p className="mb-3 text-sm text-[color:var(--color-text-tertiary)]">
          2026-05-23 · ~7 min read
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          5 most common confusions in Korean progressive income tax
        </h1>
      </header>

      <p className="leading-relaxed">
        Every May the same questions repeat. &ldquo;Is it true I lose money
        if I cross a tax bracket?&rdquo; &ldquo;Is the progressive deduction
        a refund?&rdquo; &ldquo;If a freelancer earns just KRW 10,000 more,
        does the tax actually grow?&rdquo; Almost all of these are based on
        misunderstanding. Run real numbers in the{" "}
        <Link
          href={`/${locale}/income-tax`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          Korean income tax calculator
        </Link>{" "}
        as you read.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        1. &ldquo;Crossing a bracket loses money&rdquo; — completely wrong
      </h2>
      <p className="leading-relaxed">
        The most common myth. Going from KRW 50M (15% bracket) to KRW 50.01M
        (24% bracket) does <em>not</em> apply 24% to the entire amount. Korea
        uses <strong>excess-progressive taxation</strong>: only the amount
        above each threshold is taxed at the higher rate.
      </p>
      <p className="leading-relaxed">
        Brackets:
      </p>
      <ul className="ml-1 list-disc space-y-1.5 pl-5 leading-relaxed text-sm">
        <li>0 ~ KRW 14M : 6%</li>
        <li>KRW 14M ~ 50M : 15%</li>
        <li>KRW 50M ~ 88M : 24%</li>
        <li>... up to 45% in 8 brackets</li>
      </ul>
      <p className="leading-relaxed">
        Calculated tax on KRW 50.01M = (14M × 6%) + (36M × 15%) + (0.01M ×
        24%) = KRW 8.4K + 5.4M + 24 = <strong>KRW 6.2424M</strong>. Earning
        KRW 10,000 more costs an extra KRW 2,400 in tax. Crossing a bracket
        does not cause a loss.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        2. The &ldquo;progressive deduction&rdquo; is not a refund
      </h2>
      <p className="leading-relaxed">
        The Korean term &ldquo;누진공제&rdquo; (progressive deduction) sounds
        like a benefit you receive. It is not — it's just a shortcut.
      </p>
      <p className="leading-relaxed">
        Computing the bracket-by-bracket sum is tedious. Instead, multiply
        the total base by the top marginal rate and subtract a fixed amount.
        For KRW 50.01M: 50.01M × 24% = 12.0024M, minus the 5.76M deduction =
        6.2424M. Same answer, simpler math.
      </p>
      <p className="leading-relaxed">
        The deduction simply pre-computes the savings from the lower
        brackets. It is not a separate benefit to claim.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        3. Why your effective rate is always lower than your marginal rate
      </h2>
      <p className="leading-relaxed">
        At a taxable base of KRW 100M, your marginal rate is 35%, but you
        don't pay 35% of 100M. Calculated tax = (100M × 35%) − 15.44M =
        19.56M. That's 19.56% of 100M — your effective rate.
      </p>
      <p className="leading-relaxed">
        Marginal rate = &ldquo;rate on the next KRW 10,000.&rdquo; Effective
        rate = &ldquo;average rate over all income.&rdquo; The effective
        rate is always lower. For planning, use the marginal rate to evaluate
        additional income; use the effective rate for total burden.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        4. Annual income ≠ taxable base
      </h2>
      <p className="leading-relaxed">
        An employee with KRW 50M annual income shouldn't punch 50M into the
        calculator. Korean tax law's &ldquo;taxable base&rdquo; subtracts:
      </p>
      <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-sm leading-relaxed">
        Annual income − wage income deduction − personal deductions − pension
        contributions − special deductions (housing, donations, etc.) =
        taxable base
      </div>
      <p className="leading-relaxed">
        For KRW 50M annual income, the typical taxable base is around KRW
        30M — which sits in the 15% bracket. So &ldquo;KRW 50M income =
        24%&rdquo; is the wrong mental model. Use the value labeled
        &ldquo;taxable base&rdquo; (과세표준) on your year-end settlement
        document.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        5. Separate vs comprehensive taxation — separate isn't always better
      </h2>
      <p className="leading-relaxed">
        Korean financial income (interest, dividends) under KRW 20M per year
        is taxed separately at 14% (15.4% with local tax). Above KRW 20M
        triggers comprehensive taxation. But comprehensive isn't always
        worse.
      </p>
      <p className="leading-relaxed">
        With a taxable base under KRW 14M (e.g., low income in retirement),
        comprehensive taxation at 6% beats separate at 14%. Conversely, a
        salaried employee already in the 24% bracket benefits from staying
        on separate taxation.
      </p>
      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        Korean law has a &lsquo;comparison taxation&rsquo; rule that applies
        whichever method yields the lower tax, so the worst case is
        equivalent. But you must still file.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Wrap-up
      </h2>
      <p className="leading-relaxed">
        Korean income tax looks complicated but follows precise rules. Most
        myths trace back to misunderstanding how progressive taxation works.
        Find your taxable base, plug it into the{" "}
        <Link
          href={`/${locale}/income-tax`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          income tax calculator
        </Link>{" "}
        to see marginal rate, effective rate, and total tax at a glance
        before May filing.
      </p>
      <p className="text-sm text-[color:var(--color-text-tertiary)]">
        General principles only. Child credit, donation credit, medical
        expenses, etc. must be applied separately. For accurate filing, use
        Hometax's filing assistant or a tax accountant.
      </p>
    </article>
  );
}
