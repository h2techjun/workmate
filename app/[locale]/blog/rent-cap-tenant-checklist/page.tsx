/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { findPost } from "@/lib/blogPosts";

const SLUG = "rent-cap-tenant-checklist";

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
          2026-05-23 · 약 6분
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          임대료 5% 인상 통보를 받았을 때 즉시 해야 할 7가지
        </h1>
      </header>

      <p className="leading-relaxed">
        문자 한 통이 옵니다. &ldquo;갱신 시점에 보증금 6% 인상 부탁드립니다.&rdquo;
        주임법 5% 룰을 들어본 임차인이라면 머릿속에 의문이 생기죠.
        &lsquo;6%면 한도 초과 아닌가? 거부하면 쫓겨나나? 그냥 수용해야 하나?&rsquo;
        정답은 단호하게 &lsquo;수용하지 마시고 절차대로 진행하세요&rsquo; 입니다.
        순서를 정리합니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        1. 환산보증금 기준으로 정확히 계산부터
      </h2>
      <p className="leading-relaxed">
        보증금만 인상이거나 월세만 인상이면 단순합니다. 그런데 반전세 같이
        보증금 + 월세 혼합 계약이면 &lsquo;환산보증금&rsquo; 기준으로
        계산해야 합니다. 공식은:
      </p>
      <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-sm leading-relaxed">
        환산보증금 = 보증금 + (월세 × 12 / 전월세 전환율)
      </div>
      <p className="leading-relaxed">
        전월세 전환율은 한국은행 기준금리 + 2%. 2026-05 기준 5.0% 입니다.
        본인 계약의 5% 한도와 임대인 제시안을 비교해 보려면{" "}
        <Link
          href={`/${locale}/rent-cap`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          임대료 5% 인상한도 검증
        </Link>
        에 두 케이스를 넣어보세요. 한도 초과 여부와 초과 금액이 바로 나옵니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        2. 갱신요구권을 행사할 권리가 있는지 확인
      </h2>
      <p className="leading-relaxed">
        5% 룰은 임차인이 <strong>갱신요구권을 행사한 경우</strong>에만 적용됩니다.
        조건은:
      </p>
      <ul className="ml-1 list-disc space-y-1.5 pl-5 leading-relaxed text-sm">
        <li>임대차 종료 <strong>6개월~1개월 전</strong>에 갱신 요구</li>
        <li>이전에 한 번도 갱신요구권을 행사하지 않은 상태 (1회만 가능)</li>
        <li>임대인이 정당한 갱신 거절 사유를 행사하지 않은 상태</li>
      </ul>
      <p className="leading-relaxed">
        세 조건이 모두 충족되면 임차인은 5% 한도 내 갱신을 요구할 수 있고,
        임대인은 정당한 사유 없이 거절할 수 없습니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        3. 서면(내용증명)으로 갱신요구권 행사 의사를 통보
      </h2>
      <p className="leading-relaxed">
        문자나 카톡으로만 주고받으면 나중에 입증이 어렵습니다. 내용증명
        우편으로 다음을 명시해 보내세요.
      </p>
      <ul className="ml-1 list-disc space-y-1.5 pl-5 leading-relaxed text-sm">
        <li>본인은 주임법에 따라 갱신요구권을 행사합니다</li>
        <li>임대인 제시 조건은 5% 한도(주임법 시행령 §8)를 초과합니다</li>
        <li>5% 한도 내 금액(구체적 액수 명시) 으로 수용 가능합니다</li>
        <li>임대인의 답변을 14일 이내 요청합니다</li>
      </ul>
      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        내용증명은 우체국에서 3,000원 전후로 보낼 수 있고, 본인·임대인·우체국
        3부가 보관되어 법적 증거력이 강합니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        4. 임대인이 거부하면 분쟁조정위원회로
      </h2>
      <p className="leading-relaxed">
        임대인이 &ldquo;내용증명 받았지만 6% 안 받으면 갱신 안 한다&rdquo; 식으로
        나오면, 즉시 <strong>주택임대차분쟁조정위원회</strong> 또는{" "}
        <strong>임대차분쟁조정위원회</strong> 에 조정 신청을 합니다. 조정 비용은
        무료이거나 1만원 수준. 보통 60일 이내에 조정 결과가 나옵니다.
      </p>
      <p className="leading-relaxed">
        조정에서는 위원회가 양측 의견을 듣고 5% 한도 적용 여부를 판단합니다.
        대부분 임차인 손을 들어줍니다 — 법령이 명확하기 때문입니다. 조정안을
        임대인이 거부하면 임차인은 본 소송(임대차 보호 청구) 으로 갈 수 있고,
        법원도 동일한 결론을 냅니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        5. 임대인의 &lsquo;직접 거주&rsquo; 카드 — 진짜인지 확인
      </h2>
      <p className="leading-relaxed">
        임대인이 갱신을 거부할 수 있는 정당한 사유 중 가장 흔한 것이
        &lsquo;임대인 본인 또는 직계존비속이 거주&rsquo; 입니다. 이 카드가
        나오면 임차인은 갱신요구권을 행사할 수 없습니다.
      </p>
      <p className="leading-relaxed">
        다만 임대인이 거짓으로 거주 사유를 들고 임차인을 내보낸 다음, 2년
        이내에 다른 임차인을 받으면 임차인은 손해배상을 청구할 수 있습니다.
        손해액은 보통 1년치 임대료 또는 새 임차인 임대료의 일정 비율로
        산정됩니다. 의심되면 등기부등본·전입세대열람·우편물 수신지 등을
        몇 개월 후 확인해 두는 게 안전합니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        6. 보증금만 또는 월세만 인상 협상도 가능
      </h2>
      <p className="leading-relaxed">
        5% 한도는 &lsquo;환산보증금 기준 5%&rsquo; 이므로, 보증금 한쪽만
        올리거나 월세 한쪽만 올리는 협상도 가능합니다.{" "}
        <Link
          href={`/${locale}/rent-cap`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          임대료 5% 검증 도구
        </Link>{" "}
        결과를 보면 &lsquo;월세 유지 시 최대 보증금&rsquo;,
        &lsquo;보증금 유지 시 최대 월세&rsquo; 추천값이 나옵니다. 임대인이
        보증금을 선호하는지 월세를 선호하는지에 따라 협상 카드로 쓸 수
        있습니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        7. 갱신 후 2년이 끝나면 어떻게 되나
      </h2>
      <p className="leading-relaxed">
        갱신요구권은 <strong>최초 계약 후 1회</strong>만 행사 가능합니다.
        즉 최초 2년 + 갱신 2년 = 총 4년이 법정 보장 기간. 4년 후엔 새 계약을
        체결해야 하고, 그때는 5% 룰이 적용되지 않습니다 (신규 계약 = 시장
        가격).
      </p>
      <p className="leading-relaxed">
        그래서 갱신 2년 동안은 다음 거주지·다음 계약 조건을 미리 준비해 두는
        게 좋습니다. 묵시적 갱신(임대인·임차인 모두 별다른 의사표시 없이
        자동 연장) 은 갱신요구권 행사로 보지 않아, 묵시적 갱신 이후에도
        갱신요구권을 따로 행사할 수 있는 경우가 있습니다 — 판례가 일부
        나뉘므로 분쟁조정위원회 상담을 추천합니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        마무리
      </h2>
      <p className="leading-relaxed">
        5% 인상한도는 임차인을 위해 만들어진 법입니다. 통보받았다고 무조건
        수용하지 마시고, 내 권리를 먼저 확인하세요. 계산이 필요하면{" "}
        <Link
          href={`/${locale}/rent-cap`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          임대료 5% 인상한도 검증
        </Link>
        에 5초면 답이 나옵니다. 임대료 차액은 평수 환산으로 비교하면 가치가
        더 명확하니{" "}
        <Link
          href={`/${locale}/area-convert`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          평수 ↔ ㎡ 변환
        </Link>
        도 함께 참고하세요.
      </p>
      <p className="text-sm text-[color:var(--color-text-tertiary)]">
        본 글은 일반론입니다. 개별 사안의 정확한 판단은 법무사·변호사
        또는 분쟁조정위원회 상담을 권합니다. 지자체 조례가 더 낮은
        상한을 정한 경우 그 조례가 우선합니다.
      </p>
    </article>
  );
}

function EnContent({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-6 text-[color:var(--color-text-secondary)]">
      <header className="mb-2">
        <p className="mb-3 text-sm text-[color:var(--color-text-tertiary)]">
          2026-05-23 · ~6 min read
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Got a Korean rent increase over 5%? 7 things to do immediately
        </h1>
      </header>

      <p className="leading-relaxed">
        A text arrives: &ldquo;Please accept a 6% deposit increase at
        renewal.&rdquo; If you know about Korea's 5% rule, your head fills
        with questions. &ldquo;That's over the cap, right? Will I get kicked
        out if I refuse? Should I just accept?&rdquo; The answer is firm:{" "}
        <em>do not accept blindly; follow the proper process</em>. Here's
        the sequence.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        1. Compute the equivalent deposit first
      </h2>
      <p className="leading-relaxed">
        For pure jeonse (deposit only) or pure monthly rent, comparison is
        direct. For mixed leases, you must convert to the equivalent
        deposit:
      </p>
      <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-sm leading-relaxed">
        Equivalent deposit = deposit + (monthly rent × 12 / conversion rate)
      </div>
      <p className="leading-relaxed">
        The conversion rate is BoK base rate + 2% — currently around 5.0%.
        Punch both your current and proposed amounts into the{" "}
        <Link
          href={`/${locale}/rent-cap`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          rent cap calculator
        </Link>{" "}
        and you'll see the increase rate, pass/fail status, and the excess
        amount immediately.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        2. Confirm you have the right to exercise the renewal
      </h2>
      <p className="leading-relaxed">
        The 5% rule applies only when you exercise the renewal right.
        Conditions:
      </p>
      <ul className="ml-1 list-disc space-y-1.5 pl-5 leading-relaxed text-sm">
        <li>Notice given <strong>6 to 1 month</strong> before lease end</li>
        <li>Never exercised the renewal right before (one-time only)</li>
        <li>Landlord has no legitimate refusal reason in force</li>
      </ul>
      <p className="leading-relaxed">
        If all three hold, the tenant can demand renewal within the 5% cap.
        The landlord cannot refuse without legitimate cause.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        3. Notify by certified mail (내용증명)
      </h2>
      <p className="leading-relaxed">
        Text messages alone are weak evidence later. Use Korean certified
        mail (내용증명우편) stating:
      </p>
      <ul className="ml-1 list-disc space-y-1.5 pl-5 leading-relaxed text-sm">
        <li>You exercise the renewal right per the Housing Lease Act</li>
        <li>The landlord's proposal exceeds the 5% cap (Article 8)</li>
        <li>You will accept the amount within the cap (state the exact figure)</li>
        <li>Request a response within 14 days</li>
      </ul>
      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        Certified mail costs about KRW 3,000 at any post office. Three
        copies are kept (you, landlord, post office) — strong legal
        evidence.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        4. If refused, take it to the dispute committee
      </h2>
      <p className="leading-relaxed">
        If the landlord says &ldquo;6% or no renewal,&rdquo; immediately
        petition the housing dispute mediation committee. The application
        fee is free or about KRW 10,000. Typical resolution within 60 days.
      </p>
      <p className="leading-relaxed">
        The committee hears both sides and rules on the 5% cap. Tenants
        usually win — the law is clear. If the landlord refuses the
        mediation, you can sue, and courts reach the same conclusion.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        5. The &ldquo;personal occupancy&rdquo; card — verify it's real
      </h2>
      <p className="leading-relaxed">
        The most common legitimate refusal is the landlord or their direct
        family moving in. If this is played, the tenant cannot exercise
        the renewal right.
      </p>
      <p className="leading-relaxed">
        However, if the landlord falsely claims occupancy and leases to
        someone else within 2 years, the tenant can claim damages —
        typically a year's rent or a percentage of the new tenant's rent.
        If suspicious, check the property registration and resident records
        a few months later.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        6. Negotiate via deposit-only or rent-only increases
      </h2>
      <p className="leading-relaxed">
        Because the cap is on equivalent deposit, you can negotiate raising
        only deposit or only rent. The{" "}
        <Link
          href={`/${locale}/rent-cap`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          rent cap calculator
        </Link>{" "}
        shows the maximum deposit when rent is unchanged, and vice versa.
        Use whichever the landlord prefers as a negotiation card.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        7. What happens after the 2-year renewal
      </h2>
      <p className="leading-relaxed">
        The renewal right is exercisable <strong>once per initial
        contract</strong>. So 2 years initial + 2 years renewal = 4 years
        guaranteed by law. After year 4, you sign a new contract at market
        rate — the 5% rule does not apply to new contracts.
      </p>
      <p className="leading-relaxed">
        Prepare your next residence or next contract during the 2-year
        renewal. Implied renewals (auto-renewal when neither side acts) may
        still leave the renewal right available — case law is split. Check
        with the dispute committee before relying on this.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Wrap-up
      </h2>
      <p className="leading-relaxed">
        The 5% cap exists to protect tenants. Don't accept a notice
        blindly — verify your rights first. The{" "}
        <Link
          href={`/${locale}/rent-cap`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          rent cap calculator
        </Link>{" "}
        gives you the answer in seconds. Comparing rents by area? Use the{" "}
        <Link
          href={`/${locale}/area-convert`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          pyeong ↔ m² converter
        </Link>{" "}
        too.
      </p>
      <p className="text-sm text-[color:var(--color-text-tertiary)]">
        General guidance only. Specific cases should be reviewed by a
        Korean lawyer or dispute mediation committee. Local ordinances may
        set a stricter cap than 5%.
      </p>
    </article>
  );
}
