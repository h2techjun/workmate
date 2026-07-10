/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { findPost } from "@/lib/blogPosts";
import PostTags from "@/components/ui/PostTags";

const SLUG = "income-tax-progressive-trap";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const post = findPost(SLUG)!;

  let title = post.titleEn;
  let description = post.summaryEn;
  let ogLocale = "en_US";
  let keywords: string[] | undefined;

  if (locale === "ko") {
    title = post.titleKo;
    description = post.summaryKo;
    ogLocale = "ko_KR";
  } else if (locale === "zh") {
    title = post.titleZh;
    description = post.summaryZh;
    ogLocale = "zh_CN";
    keywords = [
      "综合所得税",
      "累进税制",
      "超额累进",
      "累进扣除额",
      "课税标准",
      "有效税率",
    ];
  } else if (locale === "vi") {
    title = post.titleVi;
    description = post.summaryVi;
    ogLocale = "vi_VN";
    keywords = [
      "thuế thu nhập tổng hợp",
      "thuế lũy tiến",
      "khấu trừ lũy tiến",
      "cơ sở tính thuế",
      "thuế suất biên",
      "thuế suất thực tế",
    ];
  }

  return {
    title: `${title} — Workmate`,
    description,
    ...(keywords ? { keywords } : {}),
    alternates: {
      canonical: `/${locale}/blog/${SLUG}`,
      languages: buildLanguagesAlt(`/blog/${SLUG}`),
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/${locale}/blog/${SLUG}`,
      locale: ogLocale,
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

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {locale === "ko"
              ? "현장 노트"
              : locale === "zh"
                ? "实地笔记"
                : locale === "vi"
                  ? "Ghi chép thực tế"
                  : "Field Notes"}
          </Link>
        </nav>

        {locale === "ko" ? (
          <KoContent locale={locale} />
        ) : locale === "zh" ? (
          <ZhContent locale={locale} />
        ) : locale === "vi" ? (
          <ViContent locale={locale} />
        ) : (
          <EnContent locale={locale} />
        )}
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
      <PostTags tags={findPost(SLUG)!.tags.ko} isKo={true} />
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
      <PostTags tags={findPost(SLUG)!.tags.en} isKo={false} />
    </article>
  );
}

function ZhContent({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-6 text-[color:var(--color-text-secondary)]">
      <header className="mb-2">
        <p className="mb-3 text-sm text-[color:var(--color-text-tertiary)]">
          2026-05-23 · 约 7 分钟
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          综合所得税累进税制最容易搞混的 5 件事
        </h1>
      </header>

      <p className="leading-relaxed">
        每年一到 5 月，同样的问题就反复出现。"听说跨过税率区间反而吃亏，是真的吗？"
        "累进扣除额是一种退税吗？" "自由职业者哪怕只多拿一点收入，不就要多交税了吗？"
        然而这些问题的答案几乎都是 "不是"。下面一个一个来拆解。实际的数字，可以在{" "}
        <Link
          href={`/${locale}/income-tax`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          综合所得税计算器
        </Link>
        里直接确认。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        1. "跨过区间就吃亏" —— 这是彻头彻尾的误解
      </h2>
      <p className="leading-relaxed">
        这是最常见的误解。从 5,000万韩元区间（15%）迈入 5,001万韩元（24% 区间），只是多赚了 1万韩元，并不会突然对整整 1万韩元全额按 24% 征税。韩国的综合所得税是 <strong>超额累进税</strong>，只有超过各区间门槛的那一部分，才适用更高的税率。
      </p>
      <p className="leading-relaxed">
        具体来说：
      </p>
      <ul className="ml-1 list-disc space-y-1.5 pl-5 leading-relaxed text-sm">
        <li>0 ~ 1,400万韩元：6%</li>
        <li>1,400万 ~ 5,000万韩元：15%</li>
        <li>5,000万 ~ 8,800万韩元：24%</li>
        <li>再往上分 8个档次，最高到 45%</li>
      </ul>
      <p className="leading-relaxed">
        5,001万韩元的应纳税额为 (1,400万 × 6%) + (3,600万 × 15%) + (1万 × 24%) =
        84万 + 540万 + 0.24万 = <strong>624.24万韩元</strong>。多赚 1万韩元，额外要交的税只有 2,400韩元。所谓 "跨过区间就吃亏" 的说法并不属实。
      </p>
      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        不过，四大保险和健康保险在进入某些区间时，负担可能会超出比例地增加，那才是真正 "区间陷阱" 的根源。综合所得税本身并不存在这样的陷阱。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        2. 累进扣除额不是退税，只是一种简化的算法
      </h2>
      <p className="leading-relaxed">
        因为 "累进扣除" 这个词，很多人会以为 "扣除之后税就变少了"，但它其实只是一个让计算变简单的技巧而已。
      </p>
      <p className="leading-relaxed">
        再看一遍上面 5,001万韩元的例子。按区间逐段相乘再相加当然准确，但每次都这么算太麻烦。于是就改成：先用总额乘以 24%，再减去一个固定金额。5,001万 × 24% =
        1,200.24万，再减去累进扣除额 576万，就得到 624.24万。结果完全一样。
      </p>
      <p className="leading-relaxed">
        也就是说，累进扣除额 576万韩元，只是把 "对 5,000万韩元以下区间适用较低税率所产生的效果" 简化成一个数字而已。它并不是另外退给你的钱，只是一个计算税额的工具。如果税务局的工作人员说 "给您减去累进扣除额 576万"，那本来就是这么算的，并不是额外的优惠。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        3. 为什么有效税率总是低于边际税率
      </h2>
      <p className="leading-relaxed">
        课税标准为 1亿韩元时，边际税率是 35%，但实际交的税并不是 1亿的 35%。应纳税额为 (1亿 × 35%) − 1,544万 = 1,956万韩元，占 1亿的 19.56%。这就是有效税率。
      </p>
      <p className="leading-relaxed">
        边际税率是 "适用于下一个 1万韩元的税率"，有效税率是 "对全部收入平均适用的税率"。两者并不相等，而且有效税率总是更低。在节税规划里，区分这两个概念很重要 —— 追加收入的税负要看边际税率，整体税负则要看有效税率。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        4. 年薪、收入和课税标准是不同的概念
      </h2>
      <p className="leading-relaxed">
        年薪 5,000万韩元的上班族，如果把 5,000万直接填进综合所得税计算器，得到的结果是错的。韩国税法里的 "课税标准"，是按下面这样逐项扣减之后剩下的数值。
      </p>
      <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-sm leading-relaxed">
        年薪（税前总工资） − 劳动所得扣除 − 人员扣除 − 养老保险费扣除 −
        特别扣除（住房、捐款等） = 课税标准
      </div>
      <p className="leading-relaxed">
        年薪 5,000万韩元的一般课税标准大约在 3,000万韩元左右，适用的是 15% 区间的税率。所以年薪 5,000万的人，并不属于 24% 区间，而是 15% 区间。综合所得税计算器里有 "课税标准" 这一栏，把年末结算收据上的那个数值照搬进去就行。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        5. 分离课税 vs 综合课税 —— 分离并不总是更划算
      </h2>
      <p className="leading-relaxed">
        金融所得（利息、股息）每年在 2,000万韩元以下的部分，自动按 14% 分离课税（含地方税为 15.4%）。超过 2,000万韩元起就成为综合课税对象，需合并计算并适用累进税率。不过，被纳入综合课税并不一定就吃亏。
      </p>
      <p className="leading-relaxed">
        如果课税标准在 1,400万韩元以下（例如退休后其他收入不多的情况），综合课税适用 6%，反而可能比分离课税的 14% 更划算。反过来，如果上班族光靠年薪就已经在 24% 区间以上，那维持分离课税会更好。
      </p>
      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        实际上还有一种叫 "比较课税" 的制度：在申报综合课税时，会与假定按分离课税算出的税额做比较，取较少的一方适用，所以大多数情况下并不会吃亏。只是申报这一步还是得做。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        结语
      </h2>
      <p className="leading-relaxed">
        综合所得税是一个 "看起来复杂、但规则很精确" 的领域。误解通常都源于对累进税运作原理的不理解。先准确掌握自己的课税标准，再把它填进{" "}
        <Link
          href={`/${locale}/income-tax`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          综合所得税计算器
        </Link>
        ，边际税率、有效税率和应纳税额就能一次看清。在 5 月申报之前先算一遍，就能提前估算出预计税额和退税额。
      </p>
      <p className="text-sm text-[color:var(--color-text-tertiary)]">
        本文仅用于说明一般原理，子女税额扣除、捐款扣除、医疗费扣除等具体项目需另行适用。准确的申报，请通过 Hometax（홈택스）的 "申报帮助服务" 或咨询税务师办理。
      </p>
      <PostTags tags={findPost(SLUG)!.tags.zh} isKo={false} />
    </article>
  );
}

function ViContent({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-6 text-[color:var(--color-text-secondary)]">
      <header className="mb-2">
        <p className="mb-3 text-sm text-[color:var(--color-text-tertiary)]">
          2026-05-23 · khoảng 7 phút
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          5 hiểu lầm phổ biến nhất về thuế thu nhập lũy tiến ở Hàn Quốc
        </h1>
      </header>

      <p className="leading-relaxed">
        Cứ đến tháng 5 hằng năm, những câu hỏi giống nhau lại lặp lại. "Nghe nói
        vượt qua một bậc thuế là bị thiệt, có thật không?" "Khoản khấu trừ lũy
        tiến có phải là tiền hoàn thuế không?" "Người làm tự do (freelancer) chỉ
        cần kiếm thêm một chút thôi thì có phải đóng thuế nhiều hơn không?" Thế
        nhưng câu trả lời cho hầu hết những câu hỏi này đều là 'không'. Hãy cùng
        gỡ rối từng cái một. Các con số thực tế, bạn có thể tự kiểm tra ngay
        trong{" "}
        <Link
          href={`/${locale}/income-tax`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          công cụ tính thuế thu nhập tổng hợp
        </Link>
        .
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        1. "Vượt bậc thuế là bị thiệt" — đây là hiểu lầm hoàn toàn
      </h2>
      <p className="leading-relaxed">
        Đây là hiểu lầm phổ biến nhất. Việc từ mức 50 triệu won (bậc 15%) bước
        sang 50,01 triệu won (bậc 24%), tức chỉ kiếm thêm 10.000 won, hoàn toàn
        không khiến cả 10.000 won đó bị đánh thuế 24%. Thuế thu nhập tổng hợp của
        Hàn Quốc là <strong>thuế lũy tiến từng phần</strong>: chỉ riêng phần vượt
        qua ngưỡng của mỗi bậc mới bị áp mức thuế suất cao hơn.
      </p>
      <p className="leading-relaxed">
        Cụ thể:
      </p>
      <ul className="ml-1 list-disc space-y-1.5 pl-5 leading-relaxed text-sm">
        <li>0 ~ 14 triệu won: 6%</li>
        <li>14 triệu ~ 50 triệu won: 15%</li>
        <li>50 triệu ~ 88 triệu won: 24%</li>
        <li>cao hơn nữa thì chia thành 8 bậc, lên tới 45%</li>
      </ul>
      <p className="leading-relaxed">
        Số thuế tính ra cho 50,01 triệu won = (14 triệu × 6%) + (36 triệu × 15%)
        + (10.000 × 24%) = 840.000 + 5,4 triệu + 2.400 = <strong>6.242.400
        won</strong>. Kiếm thêm 10.000 won thì chỉ phải đóng thêm 2.400 won tiền
        thuế. Câu nói 'vượt bậc thuế là bị thiệt' không đúng với sự thật.
      </p>
      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        Tuy nhiên, bốn loại bảo hiểm bắt buộc và bảo hiểm y tế có thể khiến gánh
        nặng tăng nhiều hơn mức tương ứng khi bước vào một số bậc nhất định, và
        đó mới thật sự là nguyên nhân của cái gọi là 'bẫy bậc thuế'. Bản thân
        thuế thu nhập tổng hợp thì không hề có cái bẫy nào như vậy.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        2. Khấu trừ lũy tiến không phải tiền hoàn thuế, chỉ là một cách tính đơn
        giản hóa
      </h2>
      <p className="leading-relaxed">
        Vì cụm từ 'khấu trừ lũy tiến' (누진공제), nhiều người có ấn tượng rằng
        'được khấu trừ nên thuế giảm đi', nhưng thực ra nó chỉ là một mẹo giúp
        việc tính toán trở nên đơn giản hơn.
      </p>
      <p className="leading-relaxed">
        Hãy xem lại ví dụ 50,01 triệu won ở trên. Nhân theo từng bậc rồi cộng lại
        thì chính xác, nhưng tính kiểu đó mỗi lần khá phiền. Vì vậy người ta đổi
        sang cách: nhân toàn bộ với 24% rồi trừ đi một số tiền cố định. 50,01
        triệu × 24% = 12,0024 triệu, trừ đi khoản khấu trừ lũy tiến 5,76 triệu
        thì còn 6,2424 triệu. Kết quả y hệt.
      </p>
      <p className="leading-relaxed">
        Nói cách khác, khoản khấu trừ lũy tiến 5,76 triệu won chỉ là con số 'đơn
        giản hóa hiệu quả của việc áp thuế suất thấp cho các bậc từ 50 triệu won
        trở xuống'. Nó không phải là tiền được hoàn lại riêng, mà chỉ là một công
        cụ để tính số thuế. Nếu nhân viên cơ quan thuế nói 'tôi sẽ trừ cho
        anh/chị 5,76 triệu won khấu trừ lũy tiến', thì đó vốn dĩ là cách tính như
        vậy, chứ không phải một ưu đãi thêm.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        3. Vì sao thuế suất thực tế luôn thấp hơn thuế suất biên
      </h2>
      <p className="leading-relaxed">
        Với cơ sở tính thuế 100 triệu won, thuế suất biên là 35%, nhưng số thuế
        thực đóng không phải là 35% của 100 triệu. Số thuế tính ra = (100 triệu ×
        35%) − 15,44 triệu = 19,56 triệu won, tức 19,56% của 100 triệu. Đó chính
        là thuế suất thực tế.
      </p>
      <p className="leading-relaxed">
        Thuế suất biên là 'thuế suất áp cho 10.000 won tiếp theo', còn thuế suất
        thực tế là 'thuế suất áp bình quân trên toàn bộ thu nhập'. Hai con số này
        không bằng nhau, và thuế suất thực tế luôn thấp hơn. Trong việc lập kế
        hoạch tiết kiệm thuế, phân biệt hai khái niệm này rất quan trọng — gánh
        nặng thuế của phần thu nhập tăng thêm phải nhìn theo thuế suất biên, còn
        gánh nặng tổng thể thì nhìn theo thuế suất thực tế.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        4. Lương năm và thu nhập khác với cơ sở tính thuế
      </h2>
      <p className="leading-relaxed">
        Một nhân viên có lương năm 50 triệu won mà điền thẳng 50 triệu vào công
        cụ tính thuế thu nhập tổng hợp thì sẽ ra kết quả sai. "Cơ sở tính thuế"
        (과세표준) trong luật thuế Hàn Quốc là giá trị còn lại sau khi trừ đi các
        khoản như sau.
      </p>
      <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-sm leading-relaxed">
        Lương năm (tổng lương) − khấu trừ thu nhập từ tiền lương − khấu trừ nhân
        thân − khấu trừ phí bảo hiểm hưu trí − khấu trừ đặc biệt (nhà ở, tiền
        quyên góp, v.v.) = cơ sở tính thuế
      </div>
      <p className="leading-relaxed">
        Cơ sở tính thuế thông thường của mức lương năm 50 triệu won vào khoảng 30
        triệu won, và mức này áp thuế suất bậc 15%. Vì vậy người có lương năm 50
        triệu won không thuộc bậc 24% mà là bậc 15%. Công cụ tính thuế thu nhập
        tổng hợp có ô "cơ sở tính thuế", bạn chỉ cần lấy đúng con số đó trên biên
        lai quyết toán thuế cuối năm điền vào là được.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        5. Đánh thuế riêng vs đánh thuế tổng hợp — riêng không phải lúc nào cũng
        lợi hơn
      </h2>
      <p className="leading-relaxed">
        Thu nhập tài chính (lãi, cổ tức) từ 20 triệu won/năm trở xuống được tự
        động đánh thuế riêng ở mức 14% (gồm cả thuế địa phương là 15,4%). Từ mức
        trên 20 triệu won thì thuộc diện đánh thuế tổng hợp, phải cộng gộp và áp
        thuế lũy tiến. Nhưng bị đánh thuế tổng hợp không nhất thiết là bị thiệt.
      </p>
      <p className="leading-relaxed">
        Nếu cơ sở tính thuế từ 14 triệu won trở xuống (ví dụ sau khi nghỉ hưu và
        có ít nguồn thu nhập khác), thì khi đánh thuế tổng hợp sẽ áp mức 6%, có
        thể lợi hơn so với mức 14% của đánh thuế riêng. Ngược lại, nếu một nhân
        viên đã ở bậc 24% trở lên chỉ nhờ lương năm, thì giữ nguyên đánh thuế
        riêng sẽ tốt hơn.
      </p>
      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        Trên thực tế còn có chế độ gọi là 'đánh thuế so sánh': khi khai báo thuế
        tổng hợp, cơ quan thuế sẽ so với số thuế tính theo giả định đánh thuế
        riêng và áp dụng bên nào ít hơn, nên đa số trường hợp sẽ không bị thiệt.
        Chỉ có điều bạn vẫn phải khai báo.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Kết lại
      </h2>
      <p className="leading-relaxed">
        Thuế thu nhập tổng hợp là lĩnh vực 'trông thì phức tạp nhưng quy tắc lại
        rất chính xác'. Hiểu lầm thường bắt đầu từ nguyên lý vận hành của thuế
        lũy tiến. Sau khi nắm chính xác cơ sở tính thuế của mình, hãy nhập nó
        vào{" "}
        <Link
          href={`/${locale}/income-tax`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          công cụ tính thuế thu nhập tổng hợp
        </Link>
        , bạn sẽ thấy ngay thuế suất biên, thuế suất thực tế và số thuế tính ra
        cùng một lúc. Chạy thử một lần trước kỳ khai báo tháng 5, bạn có thể ước
        lượng trước số thuế dự kiến và số tiền được hoàn.
      </p>
      <p className="text-sm text-[color:var(--color-text-tertiary)]">
        Bài viết này chỉ nhằm giải thích nguyên lý chung; các mục chi tiết như
        khấu trừ thuế cho con cái, khấu trừ tiền quyên góp, khấu trừ chi phí y
        tế, v.v. cần được áp dụng riêng. Để khai báo chính xác, hãy thực hiện qua
        'dịch vụ hỗ trợ khai báo' của Hometax (홈택스) hoặc tư vấn với chuyên
        viên thuế (세무사).
      </p>
      <PostTags tags={findPost(SLUG)!.tags.vi} isKo={false} />
    </article>
  );
}
