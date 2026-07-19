/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { findPost } from "@/lib/blogPosts";
import PostTags from "@/components/ui/PostTags";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

const SLUG = "living-in-korea-foreigner-guide";

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
    locale === "ko"
      ? [
          "한국 외국인 가이드",
          "외국인 한국 정착",
          "외국인 국민연금 반환",
          "외국인 건강보험",
          "외국인 전월세",
          "F-2-7 비자",
          "외국인 연말정산",
        ]
      : locale === "zh"
        ? [
            "在韩外国人生活指南",
            "外国人韩国定居",
            "外国人国民年金返还",
            "外国人健康保险",
            "全租房月租",
            "F-2-7居留签证",
          ]
        : locale === "vi"
          ? [
              "sống ở Hàn Quốc cho người nước ngoài",
              "định cư tại Hàn Quốc",
              "hoàn trả lương hưu quốc dân",
              "bảo hiểm y tế người nước ngoài",
              "Jeonse Wolse Hàn Quốc",
              "visa F-2-7",
            ]
          : [
              "living in korea foreigner guide",
              "moving to korea checklist",
              "korea pension refund foreigner",
              "korea health insurance foreigner",
              "korea jeonse wolse foreigner",
              "korea f-2-7 visa",
              "korea year-end tax foreigner",
            ];
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
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          path={`/blog/${SLUG}`}
          locale={localeKey}
          id={`blog-${SLUG}`}
        />
        {locale === "ko" ? (
          <ContentKo locale={locale} />
        ) : locale === "zh" ? (
          <ContentZh locale={locale} />
        ) : locale === "vi" ? (
          <ContentVi locale={locale} />
        ) : (
          <ContentEn locale={locale} />
        )}
      </div>
    </main>
  );
}

/** 본문 중간에 끼우는 도구 안내 카드 */
function ToolCallout({
  locale,
  href,
  title,
  desc,
}: {
  locale: string;
  href: string;
  title: string;
  desc: string;
}): React.ReactElement {
  return (
    <Link
      href={`/${locale}${href}`}
      className="group flex items-center gap-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4 transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/10"
    >
      <div className="min-w-0 flex-1">
        <p className="font-semibold text-[color:var(--color-text-primary)]">
          {title}
        </p>
        <p className="mt-0.5 text-sm text-[color:var(--color-text-tertiary)]">
          {desc}
        </p>
      </div>
      <ArrowRight className="h-4 w-4 shrink-0 text-indigo-400 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}

const TOOLS: ReadonlyArray<{
  href: string;
  ko: string;
  en: string;
}> = [
  { href: "/visa-days", ko: "체류일수 (90일 비자)", en: "Stay Days Tracker" },
  { href: "/jeonse-wolse", ko: "전세↔월세 + 전세사기 방지", en: "Jeonse ↔ Wolse + Scam Checklist" },
  { href: "/rent-cap", ko: "임대료 5% 인상한도", en: "Rent Cap (5%)" },
  { href: "/apartment-area", ko: "전용·공급면적 / 평당가", en: "Apartment Area & Price" },
  { href: "/foreign-health-insurance", ko: "외국인 건강보험료", en: "Health Insurance (NHIS)" },
  { href: "/foreign-flat-tax", ko: "외국인 단일세율 vs 누진세", en: "Foreign Flat Tax" },
  { href: "/net-salary", ko: "월급 실수령액", en: "Salary Take-Home" },
  { href: "/f2-residence-visa", ko: "F-2-7 거주비자 자격", en: "F-2-7 Residence Visa" },
  { href: "/d8-startup-visa", ko: "D-8 창업·투자비자", en: "D-8 Startup Visa" },
  { href: "/pension-refund", ko: "국민연금 반환일시금", en: "Pension Lump-Sum Refund" },
];

function AllTools({
  locale,
  isKo,
}: {
  locale: string;
  isKo: boolean;
}): React.ReactElement {
  return (
    <div className="flex flex-wrap gap-2">
      {TOOLS.map((t) => (
        <Link
          key={t.href}
          href={`/${locale}${t.href}`}
          className="inline-flex min-h-11 items-center rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] px-4 py-2.5 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-indigo-300"
        >
          {isKo ? t.ko : t.en}
        </Link>
      ))}
    </div>
  );
}

function ContentEn({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          Living in Korea
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Living in Korea as a Foreigner: The Complete Money, Visa & Admin Guide
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          As of June 2026. Visa, tax, and pension rules change — figures here are
          reference-only; confirm with the relevant agency before you act.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          Living in Korea runs on a predictable arc: you <strong>arrive</strong>{" "}
          and fight the verification wall, you <strong>settle</strong> into a
          home and the health system, you <strong>work and pay tax</strong>, some
          of you <strong>stay</strong> on a residence or startup visa, and
          eventually most <strong>leave</strong> — and want their pension back.
          This guide walks that whole journey and points you to a free calculator
          at each step. Bookmark it; you'll come back to different sections at
          different times.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          1. Your first 90 days
        </h2>
        <p>
          Two deadlines define your start. If you'll stay over 90 days, register
          for an <strong>Alien Registration Card (ARC) within 90 days</strong> of
          arrival. After you move in, file a <strong>change-of-residence report
          within 14 days</strong> at immigration or your district office. Late
          reporting carries fines, and — more painfully — your ARC gates almost
          everything else: a real phone plan, a bank account, and Korea's identity
          verification.
        </p>
        <p>
          That verification wall is the real first hurdle (a prepaid SIM usually
          can't pass it; you need a postpaid plan registered to your ARC). We
          wrote a separate guide on{" "}
          <Link
            href={`/${locale}/blog/essential-apps-korea-foreigners`}
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            which apps work before your ARC
          </Link>
          . Meanwhile, the single number to never lose track of is how many days
          you've been here.
        </p>
        <ToolCallout
          locale={locale}
          href="/visa-days"
          title="Stay Days Tracker"
          desc="Count your 90-day / visa days and see your exact expiry — overstaying even by one day has consequences."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          2. Finding a home (and protecting your deposit)
        </h2>
        <p>
          Korea has two rental models. <strong>Jeonse</strong> is a large
          lump-sum deposit with no monthly rent; <strong>wolse</strong> is a
          smaller deposit plus monthly rent. They convert into each other through
          a conversion rate capped at 4.5%. The deposit is the scary part: a wave
          of <strong>jeonse fraud in 2022–2023</strong> cost thousands of
          tenants — foreigners included — their entire deposit.
        </p>
        <p>
          The foreigner-specific trap that catches people: a Korean tenant gets
          legal protection (opposing power + priority repayment) from a move-in
          report, but as a foreigner you must file a{" "}
          <strong>change-of-residence report</strong> under the Immigration Act to
          get the same effect — a casual "residence registration" is not enough.
          Pair it with a fixed-date stamp the same day.
        </p>
        <ToolCallout
          locale={locale}
          href="/jeonse-wolse"
          title="Jeonse ↔ Wolse Converter + Scam Checklist"
          desc="Convert both ways and run the step-by-step deposit-scam prevention checklist before you sign."
        />
        <p>
          At renewal, your rent or deposit can rise by at most <strong>5%</strong>,
          and you have a one-time right to extend for two years. And don't get
          fooled by floor area: listings usually quote the larger 공급면적 (supply
          area), not the 전용면적 (the space you actually live in).
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <ToolCallout
            locale={locale}
            href="/rent-cap"
            title="Rent Cap (5%)"
            desc="Check whether a renewal increase is within the legal limit."
          />
          <ToolCallout
            locale={locale}
            href="/apartment-area"
            title="Apartment Area & Price"
            desc="Exclusive vs supply area, and the real price per pyeong."
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          3. Health insurance (it's mandatory)
        </h2>
        <p>
          Any foreigner who stays <strong>6 months or longer</strong> is
          automatically enrolled in National Health Insurance (NHIS) as a local
          subscriber — this has been mandatory since July 2019. If you work for an
          insured company you're an employee subscriber instead, splitting the
          premium 50/50 with your employer. <strong>D-2/D-4 students</strong> get
          a reduced local premium (commonly cited as 50% — confirm the current
          rate). The critical catch: unpaid premiums suspend all benefits{" "}
          <em>and</em> can block your visa extension, so set up auto-debit.
        </p>
        <ToolCallout
          locale={locale}
          href="/foreign-health-insurance"
          title="Health Insurance (NHIS) Calculator"
          desc="Estimate your monthly premium as an employee or local subscriber, with the enrollment & usage checklist."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          4. Getting paid — and taxed
        </h2>
        <p>
          Your gross salary isn't what lands in your account: the four insurances
          (pension, health, long-term care, employment) plus income tax come out
          first. In 2026 the National Pension rate rose to <strong>9.5%</strong>{" "}
          (4.75% from you, 4.75% from your employer).
        </p>
        <ToolCallout
          locale={locale}
          href="/net-salary"
          title="Salary Take-Home"
          desc="See your real monthly net pay after the 2026 four-insurance and income-tax deductions."
        />
        <p>
          The big foreigner-only decision is your income tax method. Each year you
          may choose between Korea's <strong>progressive rates</strong> or a flat{" "}
          <strong>19%</strong> on gross wage income — but the flat rate forfeits{" "}
          <em>every</em> deduction and credit. High earners with few deductions
          usually win with the flat rate; lower earners with many deductions
          usually win with progressive. Year-end settlement (연말정산) happens in
          February, and teachers/professors from some countries may be tax-exempt
          under a treaty.
        </p>
        <ToolCallout
          locale={locale}
          href="/foreign-flat-tax"
          title="Foreign Flat Tax (19%) vs Progressive"
          desc="Compare the two methods side by side, with the year-end settlement checklist."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          5. Staying longer — residence & business
        </h2>
        <p>
          If Korea becomes home, two paths open up. The{" "}
          <strong>F-2-7 points-based residence visa</strong> is a common step
          toward permanent residence (F-5): you need to fit one of five
          categories and reach 80 points. If you'd rather build something, the{" "}
          <strong>D-8 visa</strong> covers founders and investors — D-8-1/3 for a
          ₩100M+ investment, D-8-4 for a technology startup via the OASIS program.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <ToolCallout
            locale={locale}
            href="/f2-residence-visa"
            title="F-2-7 Residence Visa"
            desc="Check the categories and core requirements + document checklist."
          />
          <ToolCallout
            locale={locale}
            href="/d8-startup-visa"
            title="D-8 Startup & Investment Visa"
            desc="D-8-1/3/4 requirements + incorporation checklist."
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          6. Leaving Korea — claim your money back
        </h2>
        <p>
          When you leave for good, you may be able to reclaim everything you paid
          into the National Pension as a <strong>lump-sum refund</strong> — and
          for workplace subscribers that includes your employer's half, the full
          ~9%, not just the 4.75% you saw deducted. Whether you can claim depends
          on your nationality and visa: E-9/H-2 holders qualify regardless of
          country, and citizens of reciprocity or social-security-agreement
          countries (US, Canada, the Philippines, India, and others) can too.
        </p>
        <p>
          The order matters: <strong>don't surrender your ARC</strong> until your
          severance is paid and your pension claim is filed — you need it for
          both. Apply from a month before departure, or at the Incheon Airport NPS
          desk on the day you fly.
        </p>
        <ToolCallout
          locale={locale}
          href="/pension-refund"
          title="National Pension Lump-Sum Refund"
          desc="Estimate your refund + the full before-you-leave exit & settlement checklist."
        />
      </section>

      <section className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          A word on accuracy
        </h2>
        <p className="text-sm">
          Visas, tax, pension, and tenancy are areas where a wrong number costs
          you. Every figure here is drawn from official sources — NPS, NTS, NHIS,
          HiKorea, MOLIT, and the statutes — and is reference-only. Where sources
          disagree or a figure is unpublished, the tools say so rather than
          guessing, and items that vary by nationality or visa are marked
          "(verify)". Always confirm with the agency or a professional before an
          actual filing or contract.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          All the tools in one place
        </h2>
        <AllTools locale={locale} isKo={false} />
      </section>
      <PostTags tags={findPost(SLUG)!.tags.en} isKo={false} />
    </article>
  );
}

function ContentKo({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          한국 생활 · 외국인
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          한국 사는 외국인 완전 가이드 — 도착부터 출국까지 돈·비자·행정
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          2026년 6월 기준. 비자·세금·연금 규정은 바뀝니다 — 수치는 참고용이며,
          실제 진행 전 해당 기관에서 확인하세요.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          한국 생활은 일정한 흐름을 탑니다: <strong>도착</strong>해서 본인인증
          장벽과 싸우고, 집과 건강보험으로 <strong>정착</strong>하고,{" "}
          <strong>일하고 세금</strong>을 내고, 일부는 거주·창업 비자로{" "}
          <strong>체류</strong>하고, 결국 대부분 <strong>출국</strong>하면서 낸
          연금을 돌려받고 싶어 합니다. 이 글은 그 전 여정을 단계별로 따라가며 각
          단계마다 무료 계산기를 안내합니다. 북마크해 두고, 시기마다 필요한
          섹션으로 돌아오세요.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          1. 첫 90일
        </h2>
        <p>
          두 가지 기한이 시작을 정의합니다. 90일 넘게 체류한다면 입국{" "}
          <strong>90일 이내에 외국인등록(ARC)</strong>을 하세요. 이사한 뒤에는{" "}
          <strong>14일 이내에 체류지 변경신고</strong>를 출입국이나 구청에
          하세요. 신고가 늦으면 과태료가 있고, 더 아픈 건 ARC가 거의 모든 것의
          관문이라는 점입니다 — 제대로 된 휴대폰 요금제, 은행 계좌, 한국식
          본인인증까지.
        </p>
        <p>
          그 본인인증 장벽이 진짜 첫 고비입니다(선불 USIM은 보통 인증이 안 되고,
          ARC로 등록한 후불 요금제라야 됩니다). 어떤 앱이 ARC 전에 되는지는{" "}
          <Link
            href={`/${locale}/blog/essential-apps-korea-foreigners`}
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            별도 가이드
          </Link>
          로 정리했습니다. 그동안 절대 놓치면 안 되는 단 하나의 숫자는 — 며칠
          있었는지입니다.
        </p>
        <ToolCallout
          locale={locale}
          href="/visa-days"
          title="체류일수 (90일 비자) 트래커"
          desc="무비자·비자 체류일수와 정확한 만료일 확인 — 하루만 넘겨도 오버스테이입니다."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          2. 집 구하기 (그리고 보증금 지키기)
        </h2>
        <p>
          한국에는 두 임대 방식이 있습니다. <strong>전세</strong>는 큰 보증금에
          월세가 없고, <strong>월세</strong>는 작은 보증금 + 매달 임대료입니다.
          둘은 법정 상한 4.5%의 전환율로 서로 환산됩니다. 무서운 건 보증금입니다:{" "}
          <strong>2022~2023년 전세사기</strong>로 외국인을 포함해 수만 명이
          보증금을 통째로 잃었습니다.
        </p>
        <p>
          외국인이 가장 많이 걸리는 함정: 한국인은 전입신고로 대항력·우선변제권을
          얻지만, 외국인은 출입국관리법상 <strong>체류지 변경신고</strong>를 해야
          같은 효력을 받습니다 — 단순 '거소지 등록'으로는 부족합니다. 같은 날
          확정일자를 함께 받으세요.
        </p>
        <ToolCallout
          locale={locale}
          href="/jeonse-wolse"
          title="전세↔월세 환산기 + 전세사기 방지"
          desc="양방향 환산 + 계약 전 단계별 사기 방지 체크리스트."
        />
        <p>
          갱신 때 보증금·월세 인상은 최대 <strong>5%</strong>이고, 1회에 한해
          2년 연장을 요구할 권리가 있습니다. 그리고 면적에 속지 마세요: 매물은
          보통 실제 거주 공간인 전용면적이 아니라 더 큰 공급면적으로 표기됩니다.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <ToolCallout
            locale={locale}
            href="/rent-cap"
            title="임대료 5% 인상한도"
            desc="갱신 인상이 법정 한도 이내인지 검증."
          />
          <ToolCallout
            locale={locale}
            href="/apartment-area"
            title="전용·공급면적 / 평당가"
            desc="전용 vs 공급 면적과 진짜 평당가."
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          3. 건강보험 (의무입니다)
        </h2>
        <p>
          6개월 이상 체류하는 외국인은 지역가입자로 국민건강보험(NHIS)에 자동
          가입됩니다 — 2019년 7월부터 의무입니다. 직장에 다니면 직장가입자가 되어
          회사와 보험료를 절반씩 부담합니다. <strong>D-2/D-4 유학생</strong>은
          지역보험료 감면을 받습니다(흔히 50%로 인용 — 현행 비율 확인). 핵심
          함정: 보험료를 미납하면 모든 급여가 정지되고 <em>비자 연장</em>도
          막히니, 자동이체를 걸어두세요.
        </p>
        <ToolCallout
          locale={locale}
          href="/foreign-health-insurance"
          title="외국인 건강보험료 계산기"
          desc="직장·지역가입자별 월 보험료 추정 + 가입·이용 체크리스트."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          4. 월급 받기 — 그리고 세금
        </h2>
        <p>
          세전 급여가 그대로 통장에 들어오지 않습니다: 4대보험(연금·건강·장기요양·
          고용)과 소득세가 먼저 빠집니다. 2026년 국민연금 요율이{" "}
          <strong>9.5%</strong>(본인 4.75% + 회사 4.75%)로 올랐습니다.
        </p>
        <ToolCallout
          locale={locale}
          href="/net-salary"
          title="월급 실수령액"
          desc="2026 4대보험·소득세 공제 후 실제 월 실수령액."
        />
        <p>
          외국인만의 큰 결정은 소득세 방식입니다. 매년{" "}
          <strong>누진세</strong>와 총 근로소득에 대한 <strong>19% 단일세율</strong>{" "}
          중 선택할 수 있는데, 단일세율을 택하면 <em>모든</em> 공제·세액공제가
          사라집니다. 고소득·공제 적음 → 단일세율 유리, 저소득·공제 많음 →
          누진세 유리가 통념입니다. 연말정산은 2월에 하고, 일부 국가 출신 교사·
          교수는 조세조약으로 면세될 수 있습니다.
        </p>
        <ToolCallout
          locale={locale}
          href="/foreign-flat-tax"
          title="외국인 단일세율(19%) vs 누진세"
          desc="두 방식 비교 + 연말정산 체크리스트."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          5. 더 오래 체류 — 거주·사업
        </h2>
        <p>
          한국이 삶의 터전이 되면 두 길이 열립니다.{" "}
          <strong>F-2-7 거주(점수제) 비자</strong>는 영주(F-5)로 가는 흔한
          단계로, 5개 유형 중 하나에 해당하고 80점을 채워야 합니다. 무언가를
          만들고 싶다면 <strong>D-8 비자</strong>가 창업자·투자자를 위한
          길입니다 — D-8-1/3은 1억원+ 투자, D-8-4는 OASIS를 통한 기술창업.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <ToolCallout
            locale={locale}
            href="/f2-residence-visa"
            title="F-2-7 거주비자 자격"
            desc="유형·핵심 요건 + 신청 서류 체크리스트."
          />
          <ToolCallout
            locale={locale}
            href="/d8-startup-visa"
            title="D-8 창업·투자비자"
            desc="D-8-1/3/4 요건 + 법인 설립 체크리스트."
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          6. 한국 떠나기 — 낸 돈 돌려받기
        </h2>
        <p>
          영구 출국할 때 국민연금에 낸 돈을 <strong>반환일시금</strong>으로
          돌려받을 수 있습니다 — 직장가입자라면 회사 부담분까지 포함한 전체 약
          9%(본인이 본 4.75%만이 아니라)를 받습니다. 수령 가능 여부는 국적·비자에
          달려 있습니다: E-9/H-2는 국적과 무관하게 가능하고, 상호주의·사회보장
          협정국(미국·캐나다·필리핀·인도 등) 국민도 받습니다.
        </p>
        <p>
          순서가 중요합니다: 퇴직금이 지급되고 연금 신청이 끝나기 전엔{" "}
          <strong>ARC를 반납하지 마세요</strong> — 둘 다 ARC가 필요합니다. 출국
          1개월 전부터, 또는 출국 당일 인천공항 NPS 데스크에서 신청하세요.
        </p>
        <ToolCallout
          locale={locale}
          href="/pension-refund"
          title="국민연금 반환일시금"
          desc="반환액 추정 + 출국 전 정산 체크리스트 전체."
        />
      </section>

      <section className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          정확성에 대하여
        </h2>
        <p className="text-sm">
          비자·세금·연금·임대차는 숫자를 잘못 알면 손해가 큰 영역입니다. 여기
          모든 수치는 공식 출처 — NPS·NTS·NHIS·하이코리아·국토부와 법령 — 에서
          가져왔고 참고용입니다. 출처마다 다르거나 비공개인 값은 추측하지 않고
          그렇게 밝히며, 국적·비자별로 달라지는 항목은 "(verify)"로 표시합니다.
          실제 신고·계약 전에는 반드시 해당 기관이나 전문가의 확인을 거치세요.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          모든 도구 한곳에
        </h2>
        <AllTools locale={locale} isKo={true} />
      </section>
      <PostTags tags={findPost(SLUG)!.tags.ko} isKo={true} />
    </article>
  );
}

function ContentZh({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          韩国生活 · 外国人
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          在韩外国人完全生活指南 — 从入境到离境的金钱·签证·行政
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          截至2026年6月。签证·税务·年金规定会变动——此处数字仅供参考，实际办理前请向相关机构确认。
        </p>
      </header>

      <section className="space-y-4">
        <p>
          在韩国生活遵循一条可预见的轨迹：你<strong>入境</strong>后与实名认证的高墙搏斗，在住房与医疗系统中<strong>安顿</strong>下来，<strong>工作并纳税</strong>，其中一部分人靠居留或创业签证<strong>长期停留</strong>，而最终大多数人会<strong>离境</strong>——并想把交过的年金拿回来。本文走完这整段旅程，并在每一步为你指引一个免费计算器。把它收藏起来吧，不同时期你会回到不同的章节。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          1. 最初的90天
        </h2>
        <p>
          有两个期限决定了你的起点。如果打算停留超过90天，请在入境后<strong>90天内办理外国人登录证(ARC)</strong>。搬家后，请到出入境或区厅<strong>在14天内办理居留地变更申报</strong>。申报逾期会有罚款，而更棘手的是：ARC几乎是其他一切的关口——像样的手机套餐、银行账户，乃至韩国式实名认证。
        </p>
        <p>
          那道实名认证的高墙才是真正的第一道坎(预付费USIM通常无法通过认证，必须使用以ARC登记的后付费套餐)。哪些应用在拿到ARC之前能用，我们整理成了一篇
          <Link
            href={`/${locale}/blog/essential-apps-korea-foreigners`}
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            单独的指南
          </Link>
          。而在此期间，你唯一绝不能弄丢的数字就是——你已经待了多少天。
        </p>
        <ToolCallout
          locale={locale}
          href="/visa-days"
          title="停留天数(90天签证)追踪器"
          desc="查询免签·签证停留天数和精确到期日——哪怕只超一天也算逾期滞留。"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          2. 找房子(以及守住押金)
        </h2>
        <p>
          韩国有两种租赁模式。<strong>全租房(Jeonse)</strong>是一大笔押金、没有月租；<strong>月租(Wolse)</strong>是较小的押金加每月租金。两者按法定上限4.5%的转换率相互换算。可怕的是押金：<strong>2022~2023年的全租房诈骗</strong>让包括外国人在内的数万名租客血本无归、押金全失。
        </p>
        <p>
          外国人最常踩的陷阱：韩国人凭迁入申报就能获得对抗力与优先受偿权，而外国人必须依《出入境管理法》办理<strong>居留地变更申报</strong>才能取得同等效力——单纯的"居所登记"是不够的。请在同一天一并领取确定日期(확정일자)。
        </p>
        <ToolCallout
          locale={locale}
          href="/jeonse-wolse"
          title="全租房↔月租换算器 + 全租房诈骗防范"
          desc="双向换算 + 签约前分步诈骗防范核查清单。"
        />
        <p>
          续约时押金或月租最多上涨<strong>5%</strong>，而且你有一次要求延长两年的权利。还有，别被面积骗了：房源通常标注的是更大的供给面积(공급면적)，而不是你实际居住的专用面积(전용면적)。
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <ToolCallout
            locale={locale}
            href="/rent-cap"
            title="租金5%涨幅上限"
            desc="验证续约涨幅是否在法定上限之内。"
          />
          <ToolCallout
            locale={locale}
            href="/apartment-area"
            title="专用·供给面积 / 每坪单价"
            desc="专用面积与供给面积之别，以及真实的每坪单价。"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          3. 健康保险(强制加入)
        </h2>
        <p>
          停留满6个月以上的外国人会作为地区加入者自动加入国民健康保险(NHIS)——自2019年7月起属于强制。若在有参保的公司就职，则改为职场加入者，与雇主各承担一半保费。<strong>D-2/D-4留学生</strong>可享地区保费减免(常被引用为50%——请确认现行比率)。关键陷阱：一旦拖欠保费，所有给付都会停止，<em>签证延期</em>也会受阻，所以请设置自动扣款。
        </p>
        <ToolCallout
          locale={locale}
          href="/foreign-health-insurance"
          title="外国人健康保险费计算器"
          desc="按职场·地区加入者分别估算月保费 + 加入·使用核查清单。"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          4. 拿薪水——以及纳税
        </h2>
        <p>
          税前工资不会原封不动地进到你的账户：四大保险(年金·健康·长期护理·雇佣)与所得税会先被扣掉。2026年国民年金费率上调至<strong>9.5%</strong>(本人4.75% + 公司4.75%)。
        </p>
        <ToolCallout
          locale={locale}
          href="/net-salary"
          title="工资实发金额"
          desc="扣除2026年四大保险与所得税后的实际月到手金额。"
        />
        <p>
          外国人特有的重大决定是所得税计税方式。每年你可以在韩国的<strong>累进税率</strong>和对全部劳动所得征收的<strong>19%单一税率</strong>之间选择——但选择单一税率，就会放弃<em>所有</em>扣除与税额抵免。高收入·扣除项少→单一税率划算，低收入·扣除项多→累进税率划算，这是通行看法。年末结算(연말정산)在2月进行，部分国家出身的教师·教授可依租税协定免税。
        </p>
        <ToolCallout
          locale={locale}
          href="/foreign-flat-tax"
          title="外国人单一税率(19%) vs 累进税率"
          desc="两种方式对比 + 年末结算核查清单。"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          5. 停留更久——居留与创业
        </h2>
        <p>
          当韩国成为你安身立命之地，两条路会打开。<strong>F-2-7居留(积分制)签证</strong>是通往永住(F-5)的常见一步：你需符合五种类型之一并攒够80分。若你更想创造点什么，<strong>D-8签证</strong>是为创业者·投资者准备的路——D-8-1/3对应1亿韩元以上投资，D-8-4是通过OASIS项目的技术创业。
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <ToolCallout
            locale={locale}
            href="/f2-residence-visa"
            title="F-2-7居留签证资格"
            desc="类型·核心要件 + 申请材料核查清单。"
          />
          <ToolCallout
            locale={locale}
            href="/d8-startup-visa"
            title="D-8创业·投资签证"
            desc="D-8-1/3/4要件 + 法人设立核查清单。"
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          6. 离开韩国——把交过的钱拿回来
        </h2>
        <p>
          永久离境时，你或许能以<strong>返还一次金</strong>的形式取回交进国民年金的钱——如果是职场加入者，拿回的是包含公司负担部分在内的整整约9%(而不只是你看到被扣的那4.75%)。能否领取取决于你的国籍与签证：E-9/H-2持有者无论国籍都可以，互惠主义·社会保障协定国(美国·加拿大·菲律宾·印度等)的国民也能领。
        </p>
        <p>
          顺序很重要：在离职金发放、年金申请办完之前，<strong>不要交回你的ARC</strong>——这两件事都需要它。可从离境前一个月起申请，或在离境当天于仁川机场NPS柜台办理。
        </p>
        <ToolCallout
          locale={locale}
          href="/pension-refund"
          title="国民年金返还一次金"
          desc="估算返还额 + 离境前结算核查清单全套。"
        />
      </section>

      <section className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          关于准确性
        </h2>
        <p className="text-sm">
          签证·税务·年金·租赁都是数字弄错就会损失惨重的领域。这里所有数字都取自官方来源——NPS·NTS·NHIS·Hi Korea·国土部及相关法令——仅供参考。凡来源之间有出入或数值未公开的，工具会如实说明而非臆测；因国籍·签证而异的项目则标注为"(verify)"。在实际申报·签约前，请务必经相关机构或专业人士确认。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          所有工具汇聚一处
        </h2>
        <AllTools locale={locale} isKo={false} />
      </section>
      <PostTags tags={findPost(SLUG)!.tags.zh} isKo={false} />
    </article>
  );
}

function ContentVi({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          Cuộc sống tại Hàn Quốc · Người nước ngoài
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Sống ở Hàn Quốc với tư cách người nước ngoài — Hướng dẫn đầy đủ về
          tiền bạc, visa & thủ tục hành chính
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          Cập nhật đến tháng 6 năm 2026. Quy định về visa, thuế và lương hưu có
          thể thay đổi — các con số ở đây chỉ mang tính tham khảo; hãy xác nhận
          với cơ quan liên quan trước khi thực hiện.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          Cuộc sống ở Hàn Quốc diễn ra theo một trình tự dễ đoán: bạn{" "}
          <strong>nhập cảnh</strong> và vật lộn với bức tường xác thực danh tính,
          bạn <strong>ổn định</strong> với chỗ ở và hệ thống y tế, bạn{" "}
          <strong>làm việc và nộp thuế</strong>, một số người{" "}
          <strong>ở lại</strong> bằng visa cư trú hoặc khởi nghiệp, và cuối cùng
          phần lớn <strong>rời đi</strong> — và muốn lấy lại khoản lương hưu đã
          đóng. Bài viết này đi qua toàn bộ hành trình đó và ở mỗi bước sẽ chỉ cho
          bạn một công cụ tính toán miễn phí. Hãy đánh dấu trang này; bạn sẽ quay
          lại những phần khác nhau vào những thời điểm khác nhau.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          1. 90 ngày đầu tiên
        </h2>
        <p>
          Hai mốc thời hạn định hình khởi đầu của bạn. Nếu ở lại quá 90 ngày, hãy{" "}
          <strong>
            đăng ký Thẻ đăng ký người nước ngoài (ARC) trong vòng 90 ngày
          </strong>{" "}
          kể từ khi nhập cảnh. Sau khi dọn vào ở, hãy{" "}
          <strong>khai báo thay đổi nơi cư trú trong vòng 14 ngày</strong> tại cơ
          quan xuất nhập cảnh hoặc văn phòng quận. Khai báo trễ sẽ bị phạt, và —
          đau hơn nữa — ARC là cửa ngõ của gần như mọi thứ khác: một gói cước điện
          thoại đàng hoàng, một tài khoản ngân hàng, và xác thực danh tính kiểu
          Hàn Quốc.
        </p>
        <p>
          Bức tường xác thực danh tính đó mới là ải đầu tiên thực sự (SIM trả
          trước thường không qua được xác thực; bạn cần gói trả sau đăng ký bằng
          chính ARC của mình). Ứng dụng nào dùng được trước khi có ARC thì chúng
          tôi đã tổng hợp trong một{" "}
          <Link
            href={`/${locale}/blog/essential-apps-korea-foreigners`}
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            hướng dẫn riêng
          </Link>
          . Trong khi đó, con số duy nhất bạn tuyệt đối không được để lạc mất là —
          bạn đã ở đây bao nhiêu ngày.
        </p>
        <ToolCallout
          locale={locale}
          href="/visa-days"
          title="Trình theo dõi số ngày lưu trú (visa 90 ngày)"
          desc="Đếm số ngày lưu trú 90 ngày / theo visa và xem chính xác ngày hết hạn — quá hạn dù chỉ một ngày cũng có hậu quả."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          2. Tìm nhà (và bảo vệ tiền đặt cọc của bạn)
        </h2>
        <p>
          Hàn Quốc có hai mô hình thuê nhà. <strong>Jeonse</strong> là một khoản
          đặt cọc lớn trọn gói, không có tiền thuê hàng tháng;{" "}
          <strong>Wolse</strong> là khoản đặt cọc nhỏ hơn cộng tiền thuê hàng
          tháng. Hai loại quy đổi qua lại theo tỷ lệ chuyển đổi có trần luật định
          4,5%. Điều đáng sợ chính là tiền đặt cọc:{" "}
          <strong>làn sóng lừa đảo Jeonse năm 2022~2023</strong> đã khiến hàng vạn
          người thuê nhà — kể cả người nước ngoài — mất trắng toàn bộ tiền cọc.
        </p>
        <p>
          Cạm bẫy đặc thù với người nước ngoài mà nhiều người mắc phải: người Hàn
          được bảo vệ pháp lý (hiệu lực đối kháng + quyền ưu tiên nhận lại tiền)
          nhờ khai báo chuyển vào ở, nhưng là người nước ngoài, bạn phải nộp{" "}
          <strong>khai báo thay đổi nơi cư trú</strong> theo Luật Quản lý Xuất
          nhập cảnh mới có hiệu lực tương đương — chỉ "đăng ký nơi cư trú" thông
          thường là chưa đủ. Hãy làm kèm dấu xác nhận ngày (ngày xác định /
          확정일자) ngay trong cùng ngày.
        </p>
        <ToolCallout
          locale={locale}
          href="/jeonse-wolse"
          title="Công cụ quy đổi Jeonse ↔ Wolse + Danh sách phòng chống lừa đảo"
          desc="Quy đổi cả hai chiều + chạy danh sách kiểm tra phòng chống lừa đảo tiền cọc từng bước trước khi ký."
        />
        <p>
          Khi gia hạn, tiền đặt cọc hoặc tiền thuê của bạn chỉ được tăng tối đa{" "}
          <strong>5%</strong>, và bạn có quyền gia hạn thêm hai năm một lần. Và
          đừng để bị đánh lừa bởi diện tích: tin đăng thường ghi diện tích cung
          cấp (공급면적) lớn hơn, chứ không phải diện tích chuyên dụng (전용면적) —
          phần bạn thực sự sinh sống.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <ToolCallout
            locale={locale}
            href="/rent-cap"
            title="Giới hạn tăng giá thuê (5%)"
            desc="Kiểm tra xem mức tăng khi gia hạn có nằm trong giới hạn luật định không."
          />
          <ToolCallout
            locale={locale}
            href="/apartment-area"
            title="Diện tích & giá căn hộ"
            desc="Diện tích chuyên dụng và cung cấp, cùng giá thực trên mỗi pyeong."
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          3. Bảo hiểm y tế (bắt buộc)
        </h2>
        <p>
          Bất kỳ người nước ngoài nào lưu trú từ 6 tháng trở lên đều tự động được
          ghi danh vào Bảo hiểm Y tế Quốc dân (NHIS) với tư cách người tham gia
          theo khu vực — điều này bắt buộc kể từ tháng 7 năm 2019. Nếu làm việc cho
          một công ty có bảo hiểm, bạn trở thành người tham gia theo nơi làm việc
          và chia đôi phí bảo hiểm 50/50 với chủ lao động.{" "}
          <strong>Du học sinh D-2/D-4</strong> được giảm phí bảo hiểm khu vực
          (thường được dẫn là 50% — hãy xác nhận mức hiện hành). Cạm bẫy then chốt:
          nếu chậm đóng phí, mọi quyền lợi sẽ bị đình chỉ và{" "}
          <em>việc gia hạn visa</em> cũng bị chặn, vậy nên hãy cài đặt tự động
          trích nợ.
        </p>
        <ToolCallout
          locale={locale}
          href="/foreign-health-insurance"
          title="Máy tính phí bảo hiểm y tế người nước ngoài"
          desc="Ước tính phí bảo hiểm hàng tháng với tư cách người tham gia theo nơi làm việc hoặc khu vực, kèm danh sách kiểm tra ghi danh & sử dụng."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          4. Nhận lương — và bị đánh thuế
        </h2>
        <p>
          Lương gộp không phải là số tiền vào tài khoản của bạn: bốn loại bảo hiểm
          (lương hưu, y tế, chăm sóc dài hạn, việc làm) cùng thuế thu nhập bị trừ
          trước. Năm 2026, tỷ lệ Lương hưu Quốc dân đã tăng lên{" "}
          <strong>9,5%</strong> (4,75% từ bạn, 4,75% từ chủ lao động).
        </p>
        <ToolCallout
          locale={locale}
          href="/net-salary"
          title="Lương thực nhận"
          desc="Xem lương thực nhận hàng tháng thực tế sau khi trừ bốn loại bảo hiểm và thuế thu nhập năm 2026."
        />
        <p>
          Quyết định lớn chỉ dành cho người nước ngoài là phương pháp tính thuế
          thu nhập. Mỗi năm bạn có thể chọn giữa{" "}
          <strong>thuế suất lũy tiến</strong> của Hàn Quốc và mức{" "}
          <strong>19% cố định</strong> trên tổng thu nhập tiền lương — nhưng thuế
          suất cố định thì từ bỏ <em>mọi</em> khoản khấu trừ và giảm trừ. Người
          thu nhập cao với ít khoản khấu trừ thường có lợi với thuế suất cố định;
          người thu nhập thấp với nhiều khoản khấu trừ thường có lợi với thuế lũy
          tiến. Quyết toán cuối năm (연말정산) diễn ra vào tháng 2, và giáo
          viên/giáo sư từ một số quốc gia có thể được miễn thuế theo hiệp định.
        </p>
        <ToolCallout
          locale={locale}
          href="/foreign-flat-tax"
          title="Thuế suất cố định người nước ngoài (19%) vs Lũy tiến"
          desc="So sánh hai phương pháp cạnh nhau, kèm danh sách kiểm tra quyết toán cuối năm."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          5. Ở lại lâu hơn — cư trú & kinh doanh
        </h2>
        <p>
          Nếu Hàn Quốc trở thành nhà, hai con đường mở ra.{" "}
          <strong>Visa cư trú theo điểm F-2-7</strong> là một bước phổ biến tiến
          tới thường trú (F-5): bạn cần thuộc một trong năm loại và đạt 80 điểm.
          Nếu bạn muốn xây dựng điều gì đó, <strong>visa D-8</strong> dành cho nhà
          sáng lập và nhà đầu tư — D-8-1/3 cho khoản đầu tư từ 100 triệu won trở
          lên, D-8-4 cho khởi nghiệp công nghệ qua chương trình OASIS.
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <ToolCallout
            locale={locale}
            href="/f2-residence-visa"
            title="Visa cư trú F-2-7"
            desc="Kiểm tra các loại và yêu cầu cốt lõi + danh sách hồ sơ."
          />
          <ToolCallout
            locale={locale}
            href="/d8-startup-visa"
            title="Visa khởi nghiệp & đầu tư D-8"
            desc="Yêu cầu D-8-1/3/4 + danh sách kiểm tra thành lập pháp nhân."
          />
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          6. Rời Hàn Quốc — lấy lại tiền của bạn
        </h2>
        <p>
          Khi rời đi vĩnh viễn, bạn có thể lấy lại toàn bộ số tiền đã đóng vào
          Lương hưu Quốc dân dưới dạng <strong>khoản hoàn trả một lần</strong> — và
          với người tham gia theo nơi làm việc, khoản đó bao gồm cả phần một nửa
          của chủ lao động, trọn khoảng 9%, không chỉ 4,75% bạn thấy bị trừ. Việc
          bạn có được yêu cầu hay không tùy thuộc vào quốc tịch và visa: người giữ
          E-9/H-2 đủ điều kiện bất kể quốc gia nào, và công dân các nước có đi có
          lại hoặc có hiệp định an sinh xã hội (Mỹ, Canada, Philippines, Ấn Độ và
          các nước khác) cũng vậy.
        </p>
        <p>
          Thứ tự rất quan trọng: <strong>đừng trả lại ARC</strong> cho đến khi
          tiền trợ cấp thôi việc được chi trả và hồ sơ yêu cầu lương hưu đã nộp —
          bạn cần nó cho cả hai. Hãy nộp đơn từ một tháng trước khi khởi hành, hoặc
          tại quầy NPS ở sân bay Incheon vào đúng ngày bạn bay.
        </p>
        <ToolCallout
          locale={locale}
          href="/pension-refund"
          title="Khoản hoàn trả một lần Lương hưu Quốc dân"
          desc="Ước tính khoản hoàn trả + toàn bộ danh sách kiểm tra thanh toán & xuất cảnh trước khi rời đi."
        />
      </section>

      <section className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          Về tính chính xác
        </h2>
        <p className="text-sm">
          Visa, thuế, lương hưu và thuê nhà là những lĩnh vực mà một con số sai sẽ
          khiến bạn thiệt hại. Mọi con số ở đây đều lấy từ nguồn chính thức — NPS,
          NTS, NHIS, HiKorea, MOLIT và các văn bản luật — và chỉ mang tính tham
          khảo. Ở những chỗ các nguồn không thống nhất hoặc một con số chưa được
          công bố, các công cụ sẽ nói rõ như vậy thay vì đoán, và những mục thay
          đổi theo quốc tịch hoặc visa được đánh dấu "(verify)". Luôn xác nhận với
          cơ quan hoặc chuyên gia trước khi thực sự khai báo hay ký hợp đồng.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Tất cả công cụ ở một nơi
        </h2>
        <AllTools locale={locale} isKo={false} />
      </section>
      <PostTags tags={findPost(SLUG)!.tags.vi} isKo={false} />
    </article>
  );
}
