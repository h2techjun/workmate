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
  const isKo = locale === "ko";
  const isZh = locale === "zh";
  const isVi = locale === "vi";
  const post = findPost(SLUG)!;
  const title = isKo
    ? post.titleKo
    : isZh
      ? post.titleZh
      : isVi
        ? post.titleVi
        : post.titleEn;
  const description = isKo
    ? post.summaryKo
    : isZh
      ? post.summaryZh
      : isVi
        ? post.summaryVi
        : post.summaryEn;
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
      : isZh
        ? [
            "外国人韩国租房",
            "全租房月租区别",
            "全租房诈骗防范",
            "外国人押金保护",
            "居留地变更申报",
            "韩国租金5%上限",
          ]
        : isVi
          ? [
              "thuê nhà Hàn Quốc người nước ngoài",
              "Jeonse và Wolse",
              "phòng tránh lừa đảo Jeonse",
              "bảo vệ tiền cọc Hàn Quốc",
              "khai báo thay đổi nơi cư trú",
              "trần tăng tiền thuê 5% Hàn Quốc",
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
      locale:
        locale === "ko"
          ? "ko_KR"
          : locale === "zh"
            ? "zh_CN"
            : locale === "vi"
              ? "vi_VN"
              : "en_US",
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
  const navLabel =
    locale === "ko"
      ? "현장 노트"
      : locale === "zh"
        ? "实地笔记"
        : locale === "vi"
          ? "Ghi chép thực tế"
          : "Field Notes";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {navLabel}
          </Link>
        </nav>
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

function ContentZh({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          房产 · 租赁
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          外国人韩国租房指南 — 全租房(Jeonse)·月租(Wolse)与押金保护
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          截至2026年6月。仅供参考 — 签约前请务必通过不动产登记簿誊本、持牌中介和法律专家确认。
        </p>
      </header>

      <section className="space-y-4">
        <p>
          在韩国租房，在你真正面对押金之前，一切看起来都很简单。仅仅一份租约，就可能把你一半以上的积蓄交到房东手中长达两年——而2022~2023年的一波全租房(Jeonse)诈骗，清清楚楚地展示了这会如何出问题。本文将梳理两种租赁方式、它们如何相互换算、你作为租客拥有的权利，以及外国人常常漏掉、从而悄悄失去保护的那关键一步。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          全租房 vs 月租 — 两种方式
        </h2>
        <p>
          <strong>全租房(Jeonse)</strong>是一笔高达房价50~80%的大额押金，且<em>没有</em>月租金——到期时押金全额退还。<strong>月租(Wolse)</strong>则是较少的押金加上每月租金，是大多数外国人最先接触的方式。两者通过<strong>全租月租转换率</strong>相互换算，法定上限为4.5%(韩国银行基准利率2.5% + 2%)。
        </p>
        <p>
          这个上限很重要：当房东想在租期内或续约时把一部分全租房押金转为月租金时，不得使用高于4.5%的转换率。(它<em>并不</em>适用于一开始就签成月租的新合同。)
        </p>
        <ToolCallout
          locale={locale}
          href="/jeonse-wolse"
          title="全租房 ↔ 月租 换算器"
          desc="双向换算，并检查所提出的转换率是否在法定上限之内。"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          押金陷阱 — 如何避免血本无归
        </h2>
        <p>
          2022~2023年，包括外国人在内的数万名租客因<strong>全租房诈骗</strong>而损失了全部押金。最常见的套路是「空壳全租房」(깡통전세)：押金加上房东的抵押贷款，超过了房产的实际价值，因此一旦房东违约，就没有任何余款可以退还给你。签约前请做到：
        </p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>亲自调取一份最新的不动产登记簿誊本(등기부등본)，核对业主姓名以及任何优先抵押权(근저당)。</li>
          <li>
            把押金与市场行情价对比。如果押金超过房产价值的约70~80%，就应视为危险信号。
          </li>
          <li>
            警惕信托登记(신탁)的房产——只有受托的信托公司、而非原业主，才拥有合法的出租权。
          </li>
          <li>考虑把全租押金返还保证(HUG / SGI)作为一道安全网。</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          外国人容易漏掉的一步
        </h2>
        <p>
          韩国本地租客通过办理迁入申报(전입신고)并加盖确定日期(확정일자)章，即可获得两项法律保护——<strong>对抗力(대항력)</strong>和<strong>优先受偿权(우선변제권)</strong>。正是这两项，让你的押金能够优先于日后出现的债权人得到保障。
        </p>
        <p>
          陷阱在于：对外国人而言，随手办一个「居所地登记」(거소지 등록)是<strong>不够</strong>的。你必须依据《出入境管理法》办理<strong>居留地变更申报(체류지 변경신고)</strong>，才能获得与韩国人迁入申报相同的效力。许多外国人以为自己受到了保护，其实并没有。请在搬家后14天内完成申报，并在同一天取得确定日期。还有一个细节：对抗力从你完成登记并入住的<em>次日</em>零时起才生效——骗子正是利用这一天的空隙，在同一天对房产设定抵押。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          续约时你的权利
        </h2>
        <p>
          一旦入住，法律就站在你这边。你拥有一次性的<strong>合同续签请求权(계약갱신청구권)</strong>，可以再续约两年，房东只能以有限的理由(例如业主本人或其直系家属要入住)拒绝。而在续约时，押金或租金的涨幅被限制在<strong>5%</strong>以内。
        </p>
        <ToolCallout
          locale={locale}
          href="/rent-cap"
          title="租金5%涨幅上限检查"
          desc="输入你当前和拟定的条件，查看续约涨幅是否合法。"
        />
        <p>
          还有一个数字陷阱——面积。房源通常标注的是更大的<strong>供给面积(공급면적)</strong>，而不是你实际居住的<strong>专用面积(전용면적)</strong>，这会让每坪单价看起来比实际更划算。
        </p>
        <ToolCallout
          locale={locale}
          href="/apartment-area"
          title="专用·供给面积 / 每坪单价"
          desc="换算专用面积与供给面积，并算出真实的每坪单价。"
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          如果押金没被退还
        </h2>
        <p>
          如果租约到期而房东一再拖延，<strong>不要</strong>先搬走并迁走你的登记地址——那可能让你丧失保护。相反，应向地方法院申请<strong>租赁权登记命令(임차권등기명령)</strong>，这样即使你搬离，也能保住对抗力和优先受偿权。通常，内容证明(내용증명)信函是第一步正式程序；在正式诉讼之前，住宅租赁纠纷调解委员会提供了一条低成本的途径。
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          一图速览
        </h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>转换率上限：4.5%(基准利率2.5% + 2%)，仅适用于全租转月租。</li>
          <li>续约：可一次性延长2年，涨幅上限5%。</li>
          <li>外国人：要办理居留地变更申报，而不仅仅是居所地登记。</li>
          <li>仅供参考——请通过登记簿、HUG、持牌中介和律师核实。</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          相关指南
        </h2>
        <p>
          想了解定居的完整全景——签证、养老金、健康保险和税务——请参阅
          <Link
            href={`/${locale}/blog/living-in-korea-foreigner-guide`}
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            在韩外国人完全生活指南
          </Link>
          。
        </p>
      </section>
      <PostTags tags={findPost("renting-in-korea-jeonse-wolse-guide")!.tags.zh} isKo={false} />
    </article>
  );
}

function ContentVi({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
      <header>
        <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          Bất động sản · Thuê nhà
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Hướng dẫn thuê nhà ở Hàn Quốc cho người nước ngoài — Jeonse, Wolse và bảo vệ tiền cọc
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          Cập nhật tháng 6 năm 2026. Chỉ mang tính tham khảo — hãy xác nhận với sổ đăng ký bất động sản, môi giới có giấy phép và luật sư trước khi ký.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          Thuê nhà ở Hàn Quốc trông có vẻ đơn giản cho đến khi bạn chạm mặt khoản tiền cọc. Chỉ một hợp đồng thuê nhà Hàn Quốc cũng có thể đặt hơn một nửa số tiền tiết kiệm của bạn vào tay chủ nhà trong suốt hai năm — và làn sóng lừa đảo năm 2022-2023 đã cho thấy rõ điều đó có thể đổ vỡ như thế nào. Bài viết này sẽ đi qua hai mô hình thuê nhà, cách chúng quy đổi cho nhau, các quyền bạn có với tư cách người thuê, và bước duy nhất mà người nước ngoài hay bỏ sót khiến sự bảo vệ của họ âm thầm biến mất.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Jeonse và Wolse — hai mô hình
        </h2>
        <p>
          <strong>Jeonse</strong> là một khoản tiền đặt cọc trọn gói lớn — thường bằng 50-80% giá trị căn nhà — và <em>không</em> có tiền thuê hàng tháng; bạn được hoàn lại toàn bộ tiền cọc khi kết thúc. <strong>Wolse</strong> là khoản cọc nhỏ hơn cộng với tiền thuê hàng tháng, mô hình mà hầu hết người nước ngoài bắt đầu. Hai mô hình quy đổi qua lại thông qua một <strong>tỷ lệ quy đổi</strong>, bị giới hạn hợp pháp ở mức 4.5% (lãi suất cơ bản 2.5% của Ngân hàng Hàn Quốc cộng thêm 2%).
        </p>
        <p>
          Mức trần đó rất quan trọng: khi chủ nhà muốn chuyển một phần tiền cọc Jeonse thành tiền thuê hàng tháng trong thời hạn hợp đồng hoặc khi gia hạn, họ không được dùng tỷ lệ cao hơn 4.5%. (Nó <em>không</em> áp dụng cho một hợp đồng Wolse hoàn toàn mới.)
        </p>
        <ToolCallout
          locale={locale}
          href="/jeonse-wolse"
          title="Công cụ quy đổi Jeonse ↔ Wolse"
          desc="Quy đổi cả hai chiều và kiểm tra xem tỷ lệ đề xuất có nằm trong mức trần hợp pháp hay không."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Cạm bẫy tiền cọc — và cách không mất trắng
        </h2>
        <p>
          Trong năm 2022-2023, hàng nghìn người thuê nhà — bao gồm cả người nước ngoài — đã mất toàn bộ tiền cọc vì <strong>lừa đảo Jeonse</strong>. Kiểu phổ biến là hợp đồng thuê âm vốn (깡통전세): tiền cọc cộng với khoản thế chấp của chủ nhà vượt quá giá trị thực của căn nhà, nên khi chủ nhà vỡ nợ thì không còn gì để hoàn lại cho bạn. Trước khi ký:
        </p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            Tự mình xin một bản sao sổ đăng ký bất động sản (등기부등본) mới nhất và kiểm tra tên chủ sở hữu cùng mọi khoản thế chấp ưu tiên (근저당).
          </li>
          <li>
            So sánh tiền cọc với giá thị trường. Nếu tiền cọc vượt quá khoảng 70-80% giá trị căn nhà, hãy coi đó là dấu hiệu cảnh báo.
          </li>
          <li>
            Cẩn thận với bất động sản đã đăng ký ủy thác (신탁) — chỉ bên nhận ủy thác, chứ không phải chủ cũ, mới có quyền cho thuê hợp pháp.
          </li>
          <li>
            Cân nhắc bảo hiểm hoàn trả tiền cọc (HUG / SGI) như một lớp bảo vệ dự phòng.
          </li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Bước mà người nước ngoài hay bỏ sót
        </h2>
        <p>
          Người thuê nhà Hàn Quốc nhận được hai sự bảo vệ pháp lý — <strong>hiệu lực đối kháng</strong> (대항력) và <strong>quyền ưu tiên thanh toán</strong> (우선변제권) — bằng cách nộp khai báo chuyển đến (전입신고) và lấy dấu ngày xác định (확정일자). Chính chúng giúp bạn giữ được tiền cọc trước các chủ nợ xuất hiện sau này.
        </p>
        <p>
          Đây là cạm bẫy: với tư cách người nước ngoài, một lần đăng ký cư trú thông thường là <strong>chưa đủ</strong>. Bạn phải nộp <strong>khai báo thay đổi nơi cư trú</strong> (체류지 변경신고) theo Luật Quản lý Xuất nhập cảnh để có được hiệu lực giống như người Hàn Quốc có được từ khai báo chuyển đến. Nhiều người nước ngoài tin rằng mình được bảo vệ trong khi thực ra không. Hãy nộp trong vòng 14 ngày kể từ khi chuyển đến, và lấy ngày xác định ngay trong ngày. Một chi tiết nữa: hiệu lực đối kháng bắt đầu từ 0 giờ của ngày <em>hôm sau</em> khi bạn đăng ký và cư trú — những kẻ lừa đảo lợi dụng đúng khoảng trống một ngày đó bằng cách thế chấp căn nhà ngay trong cùng ngày.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Quyền của bạn khi gia hạn
        </h2>
        <p>
          Một khi đã vào ở, luật pháp đứng về phía bạn. Bạn có <strong>quyền yêu cầu gia hạn hợp đồng</strong> (계약갱신청구권) một lần để kéo dài thêm hai năm, và chủ nhà chỉ có thể từ chối trên những căn cứ hạn chế (chẳng hạn chủ nhà hoặc gia đình họ dọn vào ở). Và khi gia hạn, mọi mức tăng tiền cọc hoặc tiền thuê đều bị giới hạn ở <strong>5%</strong>.
        </p>
        <ToolCallout
          locale={locale}
          href="/rent-cap"
          title="Công cụ kiểm tra trần tăng 5%"
          desc="Nhập điều kiện hiện tại và đề xuất để xem mức tăng khi gia hạn có hợp pháp không."
        />
        <p>
          Thêm một cạm bẫy con số nữa: diện tích sàn. Tin đăng thường ghi <strong>diện tích cung cấp</strong> (공급면적) lớn hơn, chứ không phải <strong>diện tích sử dụng riêng</strong> (전용면적) mà bạn thực sự ở, khiến giá mỗi pyeong trông đẹp hơn thực tế.
        </p>
        <ToolCallout
          locale={locale}
          href="/apartment-area"
          title="Diện tích căn hộ & giá"
          desc="Quy đổi diện tích sử dụng riêng và diện tích cung cấp, và tính giá thực mỗi pyeong."
        />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Nếu tiền cọc không được hoàn trả
        </h2>
        <p>
          Nếu hợp đồng kết thúc mà chủ nhà chần chừ, <strong>đừng</strong> chuyển đi và chuyển đăng ký cư trú của bạn trước — điều đó có thể làm mất sự bảo vệ. Thay vào đó, hãy nộp <strong>lệnh đăng ký quyền thuê</strong> (임차권등기명령) tại tòa án quận để giữ hiệu lực đối kháng và quyền ưu tiên ngay cả sau khi bạn rời đi. Thư xác nhận nội dung (내용증명) thường là bước chính thức đầu tiên, và Ủy ban Hòa giải Tranh chấp Thuê nhà ở cung cấp một con đường chi phí thấp trước khi ra tòa.
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-5">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">
          Tham khảo nhanh
        </h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>Trần tỷ lệ quy đổi: 4.5% (lãi suất cơ bản 2.5% + 2%), chỉ áp dụng cho Jeonse chuyển sang tiền thuê hàng tháng.</li>
          <li>Gia hạn: gia hạn 2 năm một lần, mức tăng giới hạn ở 5%.</li>
          <li>Người nước ngoài: hãy nộp khai báo thay đổi nơi cư trú, không chỉ là đăng ký cư trú thông thường.</li>
          <li>Chỉ mang tính tham khảo — hãy xác minh với sổ đăng ký, HUG, môi giới có giấy phép và luật sư.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Hướng dẫn liên quan
        </h2>
        <p>
          Để có bức tranh toàn cảnh về việc an cư — visa, lương hưu, bảo hiểm y tế và thuế — hãy xem{" "}
          <Link
            href={`/${locale}/blog/living-in-korea-foreigner-guide`}
            className="text-indigo-300 underline-offset-2 hover:underline"
          >
            hướng dẫn toàn diện về cuộc sống ở Hàn Quốc cho người nước ngoài
          </Link>
          .
        </p>
      </section>
      <PostTags tags={findPost("renting-in-korea-jeonse-wolse-guide")!.tags.vi} isKo={false} />
    </article>
  );
}
