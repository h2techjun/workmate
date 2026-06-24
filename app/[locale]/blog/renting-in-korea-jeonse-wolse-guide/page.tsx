/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ArrowRight } from "lucide-react";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { findPost } from "@/lib/blogPosts";
import PostTags from "@/components/ui/PostTags";

const SLUG = "renting-in-korea-jeonse-wolse-guide";

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
    keywords: isKo
      ? [
          "외국인 전세 월세",
          "전월세전환율",
          "전세사기 방지",
          "외국인 보증금 지키기",
          "체류지 변경신고",
          "임대료 5% 인상",
        ]
      : [
          "renting in korea foreigner",
          "jeonse vs wolse",
          "korea deposit protection",
          "jeonse fraud foreigner",
          "korea change of residence report",
          "korea 5% rent cap",
        ],
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
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
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
        {isKo ? <ContentKo locale={locale} /> : <ContentEn locale={locale} />}
      </div>
    </main>
  );
}

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

function ContentEn({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          Real Estate
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Renting in Korea as a Foreigner: Jeonse, Wolse, Deposits & Your Rights
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          As of June 2026. Reference only — confirm with the property register, a
          licensed agent, and a lawyer before signing.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          Renting in Korea looks simple until you meet the deposit. A single Korean
          lease can put more than half your savings into a landlord's hands for two
          years — and a wave of fraud in 2022–2023 showed exactly how that can go
          wrong. This guide walks the two rental models, how they convert, the
          rights you have as a tenant, and the one step foreigners skip that quietly
          erases their protection.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Jeonse vs wolse — the two models
        </h2>
        <p>
          <strong>Jeonse</strong> is a large lump-sum deposit — often 50–80% of the
          property's value — with <em>no</em> monthly rent. You get the full deposit
          back at the end. <strong>Wolse</strong> is a smaller deposit plus monthly
          rent, the model most foreigners start with. The two convert into each
          other through a <strong>conversion rate</strong>, legally capped at 4.5%
          (the Bank of Korea base rate of 2.5% plus 2%).
        </p>
        <p>
          That cap matters: when a landlord wants to turn part of a jeonse deposit
          into monthly rent during a lease or at renewal, they cannot use a rate
          above 4.5%. (It does <em>not</em> apply to a brand-new wolse contract.)
        </p>
        <ToolCallout
          locale={locale}
          href="/jeonse-wolse"
          title="Jeonse ↔ Wolse Converter"
          desc="Convert both ways and check whether a proposed rate is within the legal cap."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          The deposit trap — and how to not lose everything
        </h2>
        <p>
          In 2022–2023, thousands of tenants — foreigners included — lost their
          entire deposit to <strong>jeonse fraud</strong>. The common pattern is the
          "underwater" lease (깡통전세): the deposit plus the landlord's mortgage
          exceeds what the property is actually worth, so when the landlord defaults
          there is nothing left to repay you. Before you sign:
        </p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            Pull a fresh property register (등기부등본) yourself and check the
            owner's name and any senior mortgages (근저당).
          </li>
          <li>
            Compare the deposit to the market price. If the deposit exceeds roughly
            70–80% of the property value, treat it as a red flag.
          </li>
          <li>
            Beware trust-registered (신탁) properties — only the trustee, not the
            old owner, can legally lease them.
          </li>
          <li>
            Consider deposit-return insurance (HUG / SGI) as a backstop.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          The one step foreigners skip
        </h2>
        <p>
          A Korean tenant gets two legal protections — <strong>opposing power</strong>{" "}
          (대항력) and <strong>priority repayment</strong> (우선변제권) — by filing a
          move-in report (전입신고) and getting a fixed-date stamp (확정일자). These
          are what let you keep your deposit ahead of later creditors.
        </p>
        <p>
          Here is the trap: as a foreigner, a casual "residence registration" is{" "}
          <strong>not enough</strong>. You must file a{" "}
          <strong>change-of-residence report</strong> (체류지 변경신고) under the
          Immigration Act to get the same effect a Korean gets from a move-in report.
          Many foreigners believe they are protected when they are not. File it
          within 14 days of moving, and get the fixed date the same day. One more
          detail: opposing power starts at midnight the day <em>after</em> you
          register and occupy — scammers exploit that one-day gap by mortgaging the
          property on the same day.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Your rights at renewal
        </h2>
        <p>
          Once you are in, the law is on your side. You have a one-time{" "}
          <strong>Contract Renewal Request Right</strong> (계약갱신청구권) to extend
          for another two years, which the landlord can refuse only on limited
          grounds (such as the owner or their family moving in). And at renewal, any
          increase to the deposit or rent is capped at <strong>5%</strong>.
        </p>
        <ToolCallout
          locale={locale}
          href="/rent-cap"
          title="5% Rent Cap Checker"
          desc="Enter your current and proposed terms to see if a renewal increase is legal."
        />
        <p>
          One more number trap: floor area. Listings usually quote the larger{" "}
          <strong>supply area</strong> (공급면적), not the{" "}
          <strong>exclusive area</strong> (전용면적) you actually live in, which
          makes the price-per-pyeong look better than it is.
        </p>
        <ToolCallout
          locale={locale}
          href="/apartment-area"
          title="Apartment Area & Price"
          desc="Convert exclusive vs supply area and compute the real price per pyeong."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          If the deposit isn't returned
        </h2>
        <p>
          If your lease ends and the landlord stalls, do <strong>not</strong> move
          out and transfer your registration first — that can forfeit your
          protection. Instead, file a <strong>lease registration order</strong>{" "}
          (임차권등기명령) at the district court to keep your opposing power and
          priority even after you leave. A certified-content letter (내용증명) is the
          usual first formal step, and the Housing Lease Dispute Mediation Committee
          offers a low-cost path before going to court.
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          Quick reference
        </h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>Conversion-rate cap: 4.5% (base rate 2.5% + 2%), jeonse→monthly only.</li>
          <li>Renewal: one-time 2-year extension, increase capped at 5%.</li>
          <li>Foreigners: file the change-of-residence report, not just a residence registration.</li>
          <li>Reference only — verify with the register, HUG, a licensed agent, and a lawyer.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Related guides
        </h2>
        <p>
          For the whole picture of settling in — visa, pension, health insurance,
          and tax — see the{" "}
          <Link
            href={`/${locale}/blog/living-in-korea-foreigner-guide`}
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            complete guide to living in Korea as a foreigner
          </Link>
          .
        </p>
      </section>
      <PostTags tags={findPost("renting-in-korea-jeonse-wolse-guide")!.tags.en} isKo={false} />
    </article>
  );
}

function ContentKo({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          부동산 · 임대
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          외국인을 위한 한국 임대 가이드 — 전세·월세·보증금 지키기
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          2026년 6월 기준. 참고용입니다 — 계약 전 등기부·공인중개사·법률 전문가로
          꼭 확인하세요.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          한국에서 집 빌리기는 보증금을 만나기 전까지는 단순해 보입니다. 계약 한 건에
          전 재산의 절반 이상을 2년간 임대인에게 맡기게 되고, 2022~2023년 전세사기
          사태는 그게 어떻게 잘못될 수 있는지 똑똑히 보여줬습니다. 이 글은 두 임대
          방식, 환산 방법, 세입자 권리, 그리고 외국인이 빠뜨려 보호를 조용히 잃는 한
          단계를 짚습니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          전세 vs 월세 — 두 가지 방식
        </h2>
        <p>
          <strong>전세</strong>는 집값의 50~80%에 이르는 큰 보증금에 월세가{" "}
          <em>없는</em> 방식으로, 만기에 보증금을 전액 돌려받습니다.{" "}
          <strong>월세</strong>는 작은 보증금 + 매달 임대료로, 외국인이 보통 처음
          시작하는 방식입니다. 둘은 <strong>전월세전환율</strong>로 서로 환산되며,
          법정 상한은 4.5%(한국은행 기준금리 2.5% + 2%)입니다.
        </p>
        <p>
          이 상한이 중요합니다: 임대인이 계약 중·갱신 시 전세 보증금 일부를 월세로
          돌릴 때 4.5%를 넘는 율을 쓸 수 없습니다. (처음부터 월세인 신규 계약엔
          적용되지 않습니다.)
        </p>
        <ToolCallout
          locale={locale}
          href="/jeonse-wolse"
          title="전세 ↔ 월세 환산기"
          desc="양방향 환산 + 제시된 전환율이 법정 상한 이내인지 확인."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          보증금 함정 — 전부 잃지 않는 법
        </h2>
        <p>
          2022~2023년 외국인을 포함한 수만 명이 전세사기로 보증금을 통째로 잃었습니다.
          전형적 패턴은 '깡통전세' — 보증금 + 임대인의 근저당이 집의 실제 가치를 넘어,
          임대인이 잘못되면 돌려받을 게 남지 않는 구조입니다. 계약 전:
        </p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>등기부등본을 직접 떼어 소유자명과 선순위 근저당을 확인하세요.</li>
          <li>
            보증금과 시세를 비교해, 보증금이 집값의 약 70~80%를 넘으면 위험 신호로
            보세요.
          </li>
          <li>
            신탁등기 매물 주의 — 기존 소유자가 아니라 신탁사만 임대 권한이 있습니다.
          </li>
          <li>전세보증금 반환보증(HUG / SGI)을 안전장치로 검토하세요.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          외국인이 빠뜨리는 한 단계
        </h2>
        <p>
          한국인 세입자는 전입신고 + 확정일자로 두 가지 보호 —{" "}
          <strong>대항력</strong>과 <strong>우선변제권</strong> — 를 얻습니다. 이게
          나중에 생긴 채권자보다 앞서 보증금을 지키는 핵심입니다.
        </p>
        <p>
          함정은 이것입니다: 외국인은 단순 '거소지 등록'으로는{" "}
          <strong>부족</strong>합니다. 출입국관리법상{" "}
          <strong>체류지 변경신고</strong>를 해야 한국인의 전입신고와 같은 효력을
          받습니다. 많은 외국인이 보호받는 줄 알지만 아닙니다. 이사 후 14일 이내에
          신고하고, 같은 날 확정일자를 받으세요. 한 가지 더 — 대항력은 등록·점유
          '다음날' 0시부터 발생하며, 사기범은 같은 날 근저당을 설정해 이 하루 공백을
          노립니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          갱신 시 권리
        </h2>
        <p>
          일단 들어가면 법이 세입자 편입니다. 1회 행사 가능한{" "}
          <strong>계약갱신청구권</strong>으로 2년 더 연장할 수 있고, 임대인은
          제한된 사유(본인·직계가족 실거주 등)로만 거절할 수 있습니다. 그리고 갱신 시
          보증금·월세 인상은 <strong>5%</strong>로 제한됩니다.
        </p>
        <ToolCallout
          locale={locale}
          href="/rent-cap"
          title="임대료 5% 인상한도 검증"
          desc="현재·제시 조건을 넣어 갱신 인상이 합법 범위인지 확인."
        />
        <p>
          숫자 함정 하나 더 — 면적입니다. 매물은 보통 실제 거주 공간인 전용면적이
          아니라 더 큰 <strong>공급면적</strong>으로 표기해 평당가가 실제보다 좋아
          보이게 합니다.
        </p>
        <ToolCallout
          locale={locale}
          href="/apartment-area"
          title="전용·공급면적 / 평당가"
          desc="전용 vs 공급 면적 환산과 진짜 평당가 계산."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          보증금을 못 받으면
        </h2>
        <p>
          계약이 끝났는데 임대인이 미루면, 먼저 이사하고 주소를 옮기지{" "}
          <strong>마세요</strong> — 보호를 잃을 수 있습니다. 대신 법원에{" "}
          <strong>임차권등기명령</strong>을 신청하면 떠난 뒤에도 대항력·우선변제권이
          유지됩니다. 보통 내용증명이 첫 공식 절차이고, 소송 전에는 주택임대차분쟁
          조정위원회가 저비용 경로가 됩니다.
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          한눈에 정리
        </h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>전환율 상한: 4.5%(기준금리 2.5% + 2%), 전세→월세에만 적용.</li>
          <li>갱신: 1회 2년 연장, 인상 5% 상한.</li>
          <li>외국인: 거소지 등록이 아니라 체류지 변경신고를 하세요.</li>
          <li>참고용 — 등기부·HUG·공인중개사·법률 전문가로 확인.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          관련 가이드
        </h2>
        <p>
          비자·연금·건강보험·세금까지 정착의 전체 그림은{" "}
          <Link
            href={`/${locale}/blog/living-in-korea-foreigner-guide`}
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            외국인 한국생활 완전 가이드
          </Link>
          에서 보세요.
        </p>
      </section>
      <PostTags tags={findPost("renting-in-korea-jeonse-wolse-guide")!.tags.ko} isKo={true} />
    </article>
  );
}
