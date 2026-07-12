/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { findPost } from "@/lib/blogPosts";
import PostTags from "@/components/ui/PostTags";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

const SLUG = "loan-30-vs-15-years";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const post = findPost(SLUG)!;
  const title =
    locale === "ko"
      ? post.titleKo
      : locale === "zh"
        ? post.titleZh
        : locale === "vi"
          ? post.titleVi
          : post.titleEn;
  const description =
    locale === "ko"
      ? post.summaryKo
      : locale === "zh"
        ? post.summaryZh
        : locale === "vi"
          ? post.summaryVi
          : post.summaryEn;
  const keywords =
    locale === "zh"
      ? [
          "韩国房贷",
          "房贷30年还是15年",
          "贷款期限选择",
          "提前还款",
          "房贷利息计算",
          "现金流与通胀",
        ]
      : locale === "vi"
        ? [
            "vay thế chấp Hàn Quốc",
            "kỳ hạn vay 30 năm hay 15 năm",
            "chọn kỳ hạn vay",
            "trả nợ trước hạn",
            "tính lãi vay",
            "dòng tiền và lạm phát",
          ]
        : undefined;
  const ogLocale =
    locale === "ko"
      ? "ko_KR"
      : locale === "zh"
        ? "zh_CN"
        : locale === "vi"
          ? "vi_VN"
          : "en_US";
  return {
    title: `${title} — Workmate`,
    description,
    keywords,
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
  const localeKey: "ko" | "en" | "zh" | "vi" =
    locale === "ko" ? "ko" : locale === "zh" ? "zh" : locale === "vi" ? "vi" : "en";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          path={`/blog/${SLUG}`}
          locale={localeKey}
          id={`blog-${SLUG}`}
        />

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
          2026-05-23 · 약 8분
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          주담대 30년 vs 15년, 정말 30년이 손해일까
        </h1>
      </header>

      <p className="leading-relaxed">
        결론부터 말하면, 둘 다 맞을 수도 있고 둘 다 틀릴 수도 있습니다. 인터넷
        대출 후기에 가장 많이 나오는 말이 &ldquo;30년 끌면 이자가 1억 더 나간다,
        무조건 짧게 가라&rdquo; 인데, 막상 은행 상담실에 가면 십중팔구
        30년으로 끊고 나옵니다. 둘 다 사실에 기반한 얘기인데 결론이 다릅니다.
        이 글은 그 차이를 풀어봅니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        먼저 숫자부터
      </h2>
      <p className="leading-relaxed">
        4억원, 연 4.5%, 원리금균등 가정으로 비교해 봅니다. 직접{" "}
        <Link
          href={`/${locale}/loan-calc`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          대출 이자 계산기
        </Link>
        에 넣어보면 같은 숫자가 나옵니다.
      </p>

      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--color-border-subtle)] text-[color:var(--color-text-tertiary)]">
              <th className="px-4 py-2.5 text-left font-medium">항목</th>
              <th className="px-4 py-2.5 text-right font-medium">15년</th>
              <th className="px-4 py-2.5 text-right font-medium">30년</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">월 상환액</td>
              <td className="px-4 py-2 text-right">3,060,166원</td>
              <td className="px-4 py-2 text-right">2,026,920원</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">총 상환액</td>
              <td className="px-4 py-2 text-right">5억 5,082만원</td>
              <td className="px-4 py-2 text-right">7억 2,969만원</td>
            </tr>
            <tr>
              <td className="px-4 py-2">총 이자</td>
              <td className="px-4 py-2 text-right text-amber-300">
                1억 5,082만원
              </td>
              <td className="px-4 py-2 text-right text-amber-300">
                3억 2,969만원
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="leading-relaxed">
        15년을 선택하면 30년보다 약 <strong>1억 7,900만원의 이자를 덜
        낸다</strong>는 게 사실입니다. 같은 4억 빌리고 이자 차이만 1.8억.
        강력하죠. 그런데 왜 사람들이 30년을 고를까요.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        15년이 가지고 있는 진짜 비용
      </h2>
      <p className="leading-relaxed">
        15년의 월 상환액은 약 306만원입니다. 30년의 203만원보다 매월 103만원
        더 나갑니다. 1년이면 1,236만원. 5년이면 6,180만원입니다. 이 돈은
        그냥 사라지는 게 아니라 &lsquo;다른 곳에 쓸 수 없게 묶이는&rsquo;
        돈입니다.
      </p>
      <p className="leading-relaxed">
        만약 그 매월 103만원을 5%짜리 적금 또는 ETF에 꾸준히 넣으면 30년 후에
        얼마가 될까요. 단순 계산으로 매월 103만원 × 30년 × 5% 복리 ≈{" "}
        <strong>약 8억원</strong>. 절약된 이자 1.8억과 비교가 안 됩니다.
        15년의 진짜 비용은 &ldquo;그 돈을 다른 곳에 못 쓴 기회비용&rdquo;
        입니다.
      </p>
      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        물론 매월 103만원을 정확히 5%로 30년 굴리는 사람은 드뭅니다. 그게 안
        된다면 15년이 유리합니다. 결국 &ldquo;나는 그 차액을 더 좋은 곳에
        넣을 수 있는가&rdquo; 가 핵심 질문이 됩니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        인플레이션이 30년을 도와준다
      </h2>
      <p className="leading-relaxed">
        15년차에 갚는 306만원은 지금의 306만원과 같은 가치가 아닙니다.
        한국 평균 물가상승률 2%로 단순 가정하면, 15년 후의 306만원은 지금
        가치로 약 227만원입니다. 30년 후의 203만원은 지금 가치로 약 112만원.
        시간이 지날수록 같은 액수가 가벼워집니다.
      </p>
      <p className="leading-relaxed">
        이게 30년 대출이 가지는 숨은 장점입니다. 인플레이션이 빚을 갉아먹어
        주는 효과. 거꾸로 말하면, 인플레이션 시기에는 장기 고정금리 대출이
        실질적으로 유리합니다. 2022~2023년 미국 모기지 금리가 7%까지 올랐을
        때, &lsquo;그래도 30년 고정으로 끊어두는 게 낫다&rsquo; 는 조언이
        많았던 이유도 이겁니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        그럼 어떤 사람에게 어느 게 맞는가
      </h2>
      <p className="leading-relaxed">
        간단한 기준 셋:
      </p>
      <ol className="ml-1 list-decimal space-y-2 pl-5 leading-relaxed">
        <li>
          <strong>현금흐름이 빡빡하다 / 다른 투자처가 있다</strong> →
          30년. 매월 여유분으로 인덱스 펀드·연금저축·전세 보증금 굴리기 등
          다른 자산을 만들 수 있다면 30년이 효율적입니다.
        </li>
        <li>
          <strong>저축·투자를 잘 안 한다 / 빚을 빨리 털고 싶다</strong> →
          15년. 솔직히 매월 차액을 안 굴릴 사람이라면, 15년으로 강제
          저축하는 게 결과적으로 자산이 더 큽니다.
        </li>
        <li>
          <strong>금리가 낮을 때(3%대 이하)</strong> → 30년이 더 유리.
          이자율 자체가 낮으면 절약되는 이자가 적고, 차액 재투자 수익률이
          이자율보다 높을 확률이 큽니다.
        </li>
      </ol>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        실전 팁 — 중간 절충안
      </h2>
      <p className="leading-relaxed">
        진짜 많이 쓰는 전략은 <strong>30년으로 받고 5~7년차에 부분
        조기상환</strong>하는 방식입니다. 30년의 가벼운 월 부담으로 시작해서
        보너스·성과급·이직 시 차익 등이 생기면 일부 갚는 식. 초기 5년 이내는
        중도상환수수료가 0.5~1.5% 부과되지만, 그 이후엔 거의 없습니다.
      </p>
      <p className="leading-relaxed">
        예를 들어 10년차에 1억을 조기상환하면, 그 시점부터 30년 만기까지
        남은 20년의 1억에 해당하는 이자가 사라집니다. 약 5,000~7,000만원
        절감 효과. 15년으로 처음부터 끊는 것보다 유연합니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        마무리
      </h2>
      <p className="leading-relaxed">
        &ldquo;30년이 손해다&rdquo; 도 &ldquo;15년이 손해다&rdquo; 도 한쪽
        측면만 본 얘기입니다. 결정 전에 본인 현금흐름, 저축 성향, 금리
        수준을 함께 점검해 보세요. 그리고{" "}
        <Link
          href={`/${locale}/loan-calc`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          대출 계산기
        </Link>
        에서 두 시나리오의 회차별 상환표를 직접 비교해 보면 감이 잡힙니다.
        같이 보면 좋은 도구로{" "}
        <Link
          href={`/${locale}/compound-calc`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          복리 계산기
        </Link>
        도 권합니다 — 월 차액을 적금·ETF 에 넣었을 때의 미래가치를 구해
        15년 vs 30년의 총자산을 비교할 수 있습니다.
      </p>
      <p className="text-sm text-[color:var(--color-text-tertiary)]">
        본 글은 일반론이며 개인의 상환 능력·세제 혜택·DSR 한도는 별도로
        검토해야 합니다. 금융기관 상담을 함께 진행하시는 게 안전합니다.
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
          2026-05-23 · ~8 min read
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Korean Mortgage: 30-year vs 15-year — Is the longer term really a loss?
        </h1>
      </header>

      <p className="leading-relaxed">
        Short answer: both can be right, both can be wrong. Online posts shout
        &ldquo;30-year costs you KRW 100M more in interest, go shorter!&rdquo;
        Meanwhile, nine out of ten bank consultations end with a 30-year
        mortgage. Both are based on real numbers but arrive at different
        conclusions. Here's why.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Start with the numbers
      </h2>
      <p className="leading-relaxed">
        KRW 400M, 4.5% annual, equal payment. Punch the same numbers into the{" "}
        <Link
          href={`/${locale}/loan-calc`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          loan calculator
        </Link>{" "}
        and you'll see:
      </p>

      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--color-border-subtle)] text-[color:var(--color-text-tertiary)]">
              <th className="px-4 py-2.5 text-left font-medium">Item</th>
              <th className="px-4 py-2.5 text-right font-medium">15-year</th>
              <th className="px-4 py-2.5 text-right font-medium">30-year</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">Monthly</td>
              <td className="px-4 py-2 text-right">KRW 3,060,166</td>
              <td className="px-4 py-2 text-right">KRW 2,026,920</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">Total paid</td>
              <td className="px-4 py-2 text-right">KRW 550.8M</td>
              <td className="px-4 py-2 text-right">KRW 729.7M</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Total interest</td>
              <td className="px-4 py-2 text-right text-amber-300">
                KRW 150.8M
              </td>
              <td className="px-4 py-2 text-right text-amber-300">
                KRW 329.7M
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="leading-relaxed">
        Choosing 15 years saves about{" "}
        <strong>KRW 179M in total interest</strong>. Powerful. So why does
        anyone choose 30?
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        The real cost of 15 years
      </h2>
      <p className="leading-relaxed">
        The 15-year monthly is KRW 3.06M. That's KRW 1.03M more every month
        than the 30-year option. KRW 12.36M per year, KRW 61.8M over five
        years. Money you can't spend or invest anywhere else.
      </p>
      <p className="leading-relaxed">
        If you instead put that KRW 1.03M/month into a 5% savings account or
        ETF for 30 years, the future value is roughly{" "}
        <strong>KRW 800M</strong>. That dwarfs the KRW 179M of interest
        savings. The hidden cost of 15-year is the opportunity cost on that
        money you can't deploy elsewhere.
      </p>
      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        Of course, very few people invest exactly KRW 1.03M/month at 5% for
        30 years. If you can't or won't, the 15-year wins. The real question
        is &ldquo;Can I deploy the difference better?&rdquo;
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Inflation helps the 30-year
      </h2>
      <p className="leading-relaxed">
        The KRW 3.06M you pay in year 15 is not worth what KRW 3.06M is
        worth today. At Korea's average 2% inflation, that 15-year payment
        is worth roughly KRW 2.27M in today's money. The KRW 2.03M payment in
        year 30 is worth about KRW 1.12M. The same nominal payment gets
        lighter as time passes.
      </p>
      <p className="leading-relaxed">
        That's the silent advantage of a long-term mortgage: inflation eats
        the debt. This is also why &ldquo;30-year fixed is still better&rdquo;
        was common advice when US mortgage rates spiked to 7% in 2022-2023.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Which is right for whom
      </h2>
      <ol className="ml-1 list-decimal space-y-2 pl-5 leading-relaxed">
        <li>
          <strong>Tight cash flow / strong investment options</strong> →
          30-year. If you can deploy the monthly difference into index funds,
          pension savings, or another asset class, the longer term wins.
        </li>
        <li>
          <strong>Poor savings discipline / want to be debt-free</strong> →
          15-year. Honestly, if you wouldn't invest the difference anyway,
          15-year forces savings via principal payments — and you end up
          wealthier.
        </li>
        <li>
          <strong>Low rates (under ~3%)</strong> → 30-year. Lower rates
          mean less absolute interest saved, and the difference invested has
          a higher chance of beating the loan rate.
        </li>
      </ol>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        The middle path most people actually use
      </h2>
      <p className="leading-relaxed">
        A common Korean strategy: <strong>take 30 years, then partially
        prepay starting in year 5-7</strong>. Light monthly burden up front,
        but channel bonuses, raises, or windfall into the principal.
        Prepayment fees are 0.5-1.5% within the first 3-5 years, then
        disappear.
      </p>
      <p className="leading-relaxed">
        Prepaying KRW 100M in year 10, for example, eliminates ~20 years of
        interest on that KRW 100M — typically KRW 50-70M of savings while
        keeping the optional flexibility of the 30-year schedule for cash
        flow shocks.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Wrap-up
      </h2>
      <p className="leading-relaxed">
        Neither &ldquo;30-year loses&rdquo; nor &ldquo;15-year loses&rdquo; is
        the full picture. Look at your cash flow, savings discipline, and
        the rate environment together. Run both scenarios in the{" "}
        <Link
          href={`/${locale}/loan-calc`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          loan calculator
        </Link>{" "}
        and project the monthly difference with the{" "}
        <Link
          href={`/${locale}/compound-calc`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          compound interest calculator
        </Link>{" "}
        to compare total wealth.
      </p>
      <p className="text-sm text-[color:var(--color-text-tertiary)]">
        This article is generic. Your personal capacity, tax credits, and
        DSR limits require separate review with your bank.
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
          2026-05-23 · 约8分钟
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          房贷30年 vs 15年，选30年真的吃亏吗
        </h1>
      </header>

      <p className="leading-relaxed">
        先说结论：两种说法都可能对，也都可能错。网上的贷款经验帖里最常见的一句话是&ldquo;拖到30年利息要多付1亿韩元，一定要选短期&rdquo;，可真到了银行咨询室，十有八九还是签了30年出来。两种说法都基于事实，结论却相反。这篇文章就来拆解其中的差异。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        先从数字看起
      </h2>
      <p className="leading-relaxed">
        以4亿韩元、年利率4.5%、等额本息为前提来比较。你自己在
        <Link
          href={`/${locale}/loan-calc`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          贷款利息计算器
        </Link>
        里输入相同的数字，也会得到一样的结果。
      </p>

      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--color-border-subtle)] text-[color:var(--color-text-tertiary)]">
              <th className="px-4 py-2.5 text-left font-medium">项目</th>
              <th className="px-4 py-2.5 text-right font-medium">15年</th>
              <th className="px-4 py-2.5 text-right font-medium">30年</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">月供</td>
              <td className="px-4 py-2 text-right">3,060,166韩元</td>
              <td className="px-4 py-2 text-right">2,026,920韩元</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">总还款额</td>
              <td className="px-4 py-2 text-right">5亿5,082万韩元</td>
              <td className="px-4 py-2 text-right">7亿2,969万韩元</td>
            </tr>
            <tr>
              <td className="px-4 py-2">总利息</td>
              <td className="px-4 py-2 text-right text-amber-300">
                1亿5,082万韩元
              </td>
              <td className="px-4 py-2 text-right text-amber-300">
                3亿2,969万韩元
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="leading-relaxed">
        选15年确实比30年
        <strong>少付大约1亿7,900万韩元的利息</strong>
        。同样借4亿，光利息就差1.8亿。很有说服力。可为什么还是有人选30年呢。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        15年真正的代价
      </h2>
      <p className="leading-relaxed">
        15年的月供约为306万韩元，比30年的203万韩元每月多支出103万韩元。一年就是1,236万韩元，五年就是6,180万韩元。这笔钱并不是凭空消失，而是&lsquo;被锁住、无法用在别处&rsquo;的钱。
      </p>
      <p className="leading-relaxed">
        如果把每月这103万韩元持续投入年化5%的定期存款或ETF，30年后会变成多少呢。简单估算，每月103万韩元 × 30年 × 5%复利 ≈{" "}
        <strong>约8亿韩元</strong>
        。这和省下的1.8亿利息根本不在一个量级。15年真正的代价，是&ldquo;这笔钱无法用在别处的机会成本&rdquo;。
      </p>
      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        当然，能把每月103万韩元精准地按5%滚上30年的人并不多。如果做不到，那15年更划算。归根结底，&ldquo;我能不能把这笔差额投到更好的地方&rdquo;才是关键问题。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        通货膨胀在帮30年
      </h2>
      <p className="leading-relaxed">
        第15年偿还的306万韩元，和现在的306万韩元并不等值。以韩国平均物价上涨率2%简单假设，15年后的306万韩元换算成现在的价值约为227万韩元。30年后的203万韩元，折成现值约112万韩元。随着时间推移，同样的金额会越来越轻。
      </p>
      <p className="leading-relaxed">
        这正是30年贷款隐藏的优点：通货膨胀会替你侵蚀债务。反过来说，在通胀时期，长期固定利率贷款实际上更有利。2022~2023年美国房贷利率一度涨到7%时，之所以有很多&ldquo;即便如此，还是锁定30年固定利率更好&rdquo;的建议，原因也在于此。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        那么，谁适合哪一种
      </h2>
      <p className="leading-relaxed">三条简单的判断标准：</p>
      <ol className="ml-1 list-decimal space-y-2 pl-5 leading-relaxed">
        <li>
          <strong>现金流紧张 / 有其他投资渠道</strong> →
          30年。如果能用每月省下的余钱去配置指数基金、养老储蓄、全租房（Jeonse）押金周转等其他资产，那30年更高效。
        </li>
        <li>
          <strong>不太储蓄或投资 / 想尽快还清债务</strong> →
          15年。说实话，如果是那种不会去打理每月差额的人，用15年强制储蓄，最终反而资产更多。
        </li>
        <li>
          <strong>利率较低时（3%上下及以下）</strong> →
          30年更有利。利率本身低，省下的利息就少，而差额再投资的收益率超过贷款利率的概率更大。
        </li>
      </ol>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        实战贴士——折中方案
      </h2>
      <p className="leading-relaxed">
        真正被大量采用的策略是
        <strong>先按30年借，到第5~7年再部分提前还款</strong>
        。先用30年较轻的月负担起步，等有了奖金、绩效奖金、跳槽时的差价收入等，再拿去还掉一部分。前5年以内会收取0.5~1.5%的提前还款手续费，但之后几乎为零。
      </p>
      <p className="leading-relaxed">
        比如在第10年提前偿还1亿韩元，那么从这一刻起到30年到期为止、剩余20年里这1亿对应的利息就消失了，节省效果约为5,000~7,000万韩元。这比一开始就签15年要灵活得多。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        结语
      </h2>
      <p className="leading-relaxed">
        &ldquo;30年吃亏&rdquo;和&ldquo;15年吃亏&rdquo;都只看到了一个侧面。做决定前，请把自己的现金流、储蓄习惯和利率水平放在一起衡量。然后在
        <Link
          href={`/${locale}/loan-calc`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          贷款计算器
        </Link>
        里把两种方案逐期的还款表直接对比一下，感觉就出来了。配合使用的话，也推荐
        <Link
          href={`/${locale}/compound-calc`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          复利计算器
        </Link>
        ——算出把每月差额投入定期存款或ETF后的未来价值，就能比较15年 vs 30年的总资产。
      </p>
      <p className="text-sm text-[color:var(--color-text-tertiary)]">
        本文仅为一般性介绍，个人的还款能力、税收优惠、DSR（总偿债比率）额度需另行评估。同时咨询金融机构会更稳妥。
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
          2026-05-23 · ~8 phút đọc
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Vay thế chấp Hàn Quốc: 30 năm hay 15 năm — Chọn kỳ hạn dài hơn có thực
          sự thiệt hơn?
        </h1>
      </header>

      <p className="leading-relaxed">
        Nói kết luận trước: cả hai đều có thể đúng, và cả hai cũng có thể sai.
        Câu nói xuất hiện nhiều nhất trong các bài chia sẻ kinh nghiệm vay trên
        mạng là &ldquo;kéo dài 30 năm thì phải trả thêm 100 triệu won tiền lãi,
        cứ chọn kỳ hạn ngắn đi&rdquo;, thế nhưng khi thực sự ngồi vào phòng tư
        vấn của ngân hàng thì mười người hết chín lại ký hợp đồng 30 năm rồi bước
        ra. Cả hai đều dựa trên sự thật, nhưng kết luận lại khác nhau. Bài viết
        này sẽ mổ xẻ sự khác biệt đó.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Bắt đầu từ các con số
      </h2>
      <p className="leading-relaxed">
        So sánh với giả định 400 triệu won, lãi suất 4,5%/năm, trả góp đều cả
        gốc lẫn lãi. Bạn tự nhập cùng những con số này vào{" "}
        <Link
          href={`/${locale}/loan-calc`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          máy tính lãi vay
        </Link>{" "}
        cũng sẽ ra kết quả y hệt.
      </p>

      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--color-border-subtle)] text-[color:var(--color-text-tertiary)]">
              <th className="px-4 py-2.5 text-left font-medium">Hạng mục</th>
              <th className="px-4 py-2.5 text-right font-medium">15 năm</th>
              <th className="px-4 py-2.5 text-right font-medium">30 năm</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">Trả hàng tháng</td>
              <td className="px-4 py-2 text-right">3.060.166 KRW</td>
              <td className="px-4 py-2 text-right">2.026.920 KRW</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">Tổng phải trả</td>
              <td className="px-4 py-2 text-right">550,8 triệu KRW</td>
              <td className="px-4 py-2 text-right">729,7 triệu KRW</td>
            </tr>
            <tr>
              <td className="px-4 py-2">Tổng lãi</td>
              <td className="px-4 py-2 text-right text-amber-300">
                150,8 triệu KRW
              </td>
              <td className="px-4 py-2 text-right text-amber-300">
                329,7 triệu KRW
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <p className="leading-relaxed">
        Chọn 15 năm thì{" "}
        <strong>trả ít hơn khoảng 179 triệu won tiền lãi</strong> so với 30 năm
        — điều đó là sự thật. Cùng vay 400 triệu, chỉ riêng chênh lệch lãi đã gần
        180 triệu. Rất thuyết phục. Vậy tại sao vẫn có người chọn 30 năm?
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Cái giá thật sự của kỳ hạn 15 năm
      </h2>
      <p className="leading-relaxed">
        Khoản trả hàng tháng của kỳ hạn 15 năm khoảng 3,06 triệu won. Mỗi tháng
        phải trả nhiều hơn 1,03 triệu won so với mức 2,03 triệu won của kỳ hạn 30
        năm. Một năm là 12,36 triệu won, năm năm là 61,8 triệu won. Số tiền này
        không phải tự nhiên biến mất, mà là khoản tiền &lsquo;bị trói lại, không
        thể dùng vào việc khác&rsquo;.
      </p>
      <p className="leading-relaxed">
        Nếu thay vào đó bạn đều đặn bỏ 1,03 triệu won mỗi tháng vào sổ tiết kiệm
        hoặc ETF lãi 5%, thì sau 30 năm sẽ thành bao nhiêu? Tính đơn giản, 1,03
        triệu won mỗi tháng × 30 năm × lãi kép 5% ≈{" "}
        <strong>khoảng 800 triệu won</strong>. Con số đó bỏ xa 179 triệu won tiền
        lãi tiết kiệm được. Cái giá thật sự của kỳ hạn 15 năm chính là
        &ldquo;chi phí cơ hội của khoản tiền không thể dùng vào việc
        khác&rdquo;.
      </p>
      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        Tất nhiên, rất ít người xoay được đúng 1,03 triệu won mỗi tháng ở mức 5%
        suốt 30 năm. Nếu không làm được điều đó thì kỳ hạn 15 năm có lợi hơn. Rốt
        cuộc, &ldquo;liệu tôi có thể đưa khoản chênh lệch đó vào chỗ tốt hơn
        không&rdquo; mới là câu hỏi cốt lõi.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Lạm phát đứng về phía kỳ hạn 30 năm
      </h2>
      <p className="leading-relaxed">
        3,06 triệu won bạn trả vào năm thứ 15 không còn cùng giá trị với 3,06
        triệu won của hiện tại. Nếu giả định đơn giản theo mức lạm phát trung bình
        2% của Hàn Quốc, thì 3,06 triệu won sau 15 năm quy về giá trị hiện tại
        chỉ còn khoảng 2,27 triệu won. Còn 2,03 triệu won sau 30 năm, quy về hiện
        tại chỉ khoảng 1,12 triệu won. Càng về sau, cùng một số tiền càng trở nên
        nhẹ đi.
      </p>
      <p className="leading-relaxed">
        Đây chính là ưu điểm ẩn của khoản vay 30 năm: lạm phát bào mòn khoản nợ
        giúp bạn. Nói ngược lại, trong thời kỳ lạm phát, khoản vay lãi suất cố
        định dài hạn thực chất lại có lợi. Đó cũng là lý do vì sao khi lãi suất
        vay mua nhà ở Mỹ vọt lên tới 7% trong giai đoạn 2022~2023, đã có rất
        nhiều lời khuyên rằng &ldquo;dù vậy vẫn nên chốt lãi suất cố định 30 năm
        thì hơn&rdquo;.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Vậy ai hợp với phương án nào
      </h2>
      <p className="leading-relaxed">Ba tiêu chí đơn giản:</p>
      <ol className="ml-1 list-decimal space-y-2 pl-5 leading-relaxed">
        <li>
          <strong>Dòng tiền eo hẹp / có kênh đầu tư khác</strong> → 30 năm. Nếu
          mỗi tháng bạn có thể dùng phần dư ra để tạo tài sản khác như quỹ chỉ số
          (index fund), tiết kiệm hưu trí, xoay vòng tiền đặt cọc thuê nhà kiểu
          Jeonse..., thì 30 năm sẽ hiệu quả hơn.
        </li>
        <li>
          <strong>Ít khi tiết kiệm hay đầu tư / muốn trả hết nợ sớm</strong> → 15
          năm. Thành thật mà nói, với người sẽ không đem khoản chênh lệch mỗi
          tháng đi sinh lời, thì việc dùng kỳ hạn 15 năm để tiết kiệm bắt buộc
          lại giúp tài sản cuối cùng lớn hơn.
        </li>
        <li>
          <strong>Khi lãi suất thấp (khoảng 3% trở xuống)</strong> → 30 năm có
          lợi hơn. Bản thân lãi suất đã thấp thì phần lãi tiết kiệm được ít, và
          khả năng lợi suất tái đầu tư khoản chênh lệch cao hơn lãi suất vay là
          rất lớn.
        </li>
      </ol>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Mẹo thực chiến — phương án dung hòa
      </h2>
      <p className="leading-relaxed">
        Chiến lược thực sự được dùng nhiều là{" "}
        <strong>
          vay theo kỳ hạn 30 năm, rồi trả trước một phần vào khoảng năm thứ 5~7
        </strong>
        . Bắt đầu với gánh nặng hàng tháng nhẹ nhàng của kỳ hạn 30 năm, rồi khi
        có tiền thưởng, thưởng thành tích, khoản chênh khi nhảy việc..., thì đem
        trả bớt một phần. Trong vòng 5 năm đầu sẽ bị tính phí trả nợ trước hạn
        0,5~1,5%, nhưng sau đó thì gần như không còn.
      </p>
      <p className="leading-relaxed">
        Ví dụ, nếu trả trước 100 triệu won vào năm thứ 10, thì kể từ thời điểm đó
        cho tới khi đáo hạn 30 năm, phần lãi tương ứng với 100 triệu won trong 20
        năm còn lại sẽ biến mất — hiệu quả tiết kiệm khoảng 50~70 triệu won. Linh
        hoạt hơn nhiều so với việc chốt 15 năm ngay từ đầu.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Kết lại
      </h2>
      <p className="leading-relaxed">
        Cả &ldquo;30 năm là thiệt&rdquo; lẫn &ldquo;15 năm là thiệt&rdquo; đều
        chỉ nhìn từ một phía. Trước khi quyết định, hãy cùng lúc kiểm tra dòng
        tiền, thói quen tiết kiệm và mặt bằng lãi suất của chính bạn. Rồi vào{" "}
        <Link
          href={`/${locale}/loan-calc`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          máy tính khoản vay
        </Link>{" "}
        so sánh trực tiếp bảng trả nợ theo từng kỳ của hai kịch bản, bạn sẽ nắm
        được cảm giác. Một công cụ nên xem cùng là{" "}
        <Link
          href={`/${locale}/compound-calc`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          máy tính lãi kép
        </Link>{" "}
        — tính ra giá trị tương lai khi bỏ khoản chênh lệch hàng tháng vào sổ
        tiết kiệm hay ETF, để so sánh tổng tài sản giữa 15 năm và 30 năm.
      </p>
      <p className="text-sm text-[color:var(--color-text-tertiary)]">
        Bài viết này chỉ mang tính khái quát; khả năng trả nợ cá nhân, ưu đãi
        thuế và hạn mức DSR cần được xem xét riêng. Nên tiến hành tư vấn cùng tổ
        chức tài chính để an toàn hơn.
      </p>
      <PostTags tags={findPost(SLUG)!.tags.vi} isKo={false} />
    </article>
  );
}
