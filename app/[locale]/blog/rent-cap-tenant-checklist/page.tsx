/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { findPost } from "@/lib/blogPosts";
import PostTags from "@/components/ui/PostTags";

const SLUG = "rent-cap-tenant-checklist";

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
    keywords: isZh
      ? [
          "韩国涨租超过5%",
          "租金上限5%",
          "合同续签请求权",
          "内容证明邮件",
          "住宅租赁保护法",
          "租赁纠纷调解委员会",
        ]
      : isVi
        ? [
            "tăng tiền thuê vượt 5% Hàn Quốc",
            "trần tăng tiền thuê 5%",
            "quyền yêu cầu gia hạn hợp đồng",
            "thư bảo đảm nội dung",
            "Luật Bảo vệ Thuê nhà ở Hàn Quốc",
            "Ủy ban Hòa giải Tranh chấp Thuê nhà",
          ]
        : undefined,
    alternates: {
      canonical: `/${locale}/blog/${SLUG}`,
      languages: buildLanguagesAlt(`/blog/${SLUG}`),
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `${SITE_URL}/${locale}/blog/${SLUG}`,
      locale: isKo
        ? "ko_KR"
        : isZh
          ? "zh_CN"
          : isVi
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
      <PostTags tags={findPost(SLUG)!.tags.ko} isKo={true} />
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
      <PostTags tags={findPost(SLUG)!.tags.en} isKo={false} />
    </article>
  );
}

function ZhContent({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-6 text-[color:var(--color-text-secondary)]">
      <header className="mb-2">
        <p className="mb-3 text-sm text-[color:var(--color-text-tertiary)]">
          2026-05-23 · 约 6 分钟
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          收到超过5%涨租通知时，必须马上做的7件事
        </h1>
      </header>

      <p className="leading-relaxed">
        一条短信突然发来：&ldquo;续约时希望能把保证金上调6%。&rdquo;如果你是听说过韩国《住宅租赁保护法》5%规则的租客，脑子里立刻会冒出一堆疑问——&lsquo;6%不是已经超过上限了吗？拒绝的话会不会被赶走？还是干脆接受算了？&rsquo;答案很明确：&lsquo;不要直接接受，按法定程序一步步来&rsquo;。下面把顺序整理给你。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        1. 先按换算保证金准确计算
      </h2>
      <p className="leading-relaxed">
        如果只是保证金上涨，或者只是月租(Wolse)上涨，计算很简单。但如果像半全租(半Jeonse)那样，是保证金加月租的混合合同，就必须按&lsquo;换算保证金&rsquo;计算。公式如下：
      </p>
      <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-sm leading-relaxed">
        换算保证金 = 保证金 + (月租 × 12 / 全租转月租折算率)
      </div>
      <p className="leading-relaxed">
        全租转月租折算率 = 韩国银行基准利率 + 2%，截至2026-05约为5.0%。想比较自己合同的5%上限和房东提出的方案，把两组数字都输入
        <Link
          href={`/${locale}/rent-cap`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          租金5%涨幅上限验证
        </Link>
        ，超没超上限、超出多少金额马上就能看到。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        2. 先确认自己是否有资格行使续签请求权
      </h2>
      <p className="leading-relaxed">
        5%规则只适用于租客<strong>已行使续签请求权</strong>的情况。条件是：
      </p>
      <ul className="ml-1 list-disc space-y-1.5 pl-5 leading-relaxed text-sm">
        <li>在租期届满<strong>前6个月至前1个月</strong>之间提出续约要求</li>
        <li>此前从未行使过续签请求权(仅可行使一次)</li>
        <li>房东未主张任何正当的拒绝续约理由</li>
      </ul>
      <p className="leading-relaxed">
        三个条件同时满足时，租客可以要求在5%上限内续约，房东不能在没有正当理由的情况下拒绝。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        3. 用书面(内容证明)通知对方行使续签请求权
      </h2>
      <p className="leading-relaxed">
        只靠短信或聊天软件沟通，日后很难举证。请通过内容证明(存证信函)邮寄，写明以下内容：
      </p>
      <ul className="ml-1 list-disc space-y-1.5 pl-5 leading-relaxed text-sm">
        <li>本人依据《住宅租赁保护法》行使续签请求权</li>
        <li>房东提出的条件超过了5%上限(《住宅租赁保护法》施行令第8条)</li>
        <li>本人可以接受5%上限以内的金额(注明具体数额)</li>
        <li>要求房东在14天内答复</li>
      </ul>
      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        内容证明可以在邮局以约3,000韩元寄出，本人、房东、邮局各留存一份，法律证据效力很强。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        4. 如果房东拒绝，就向纠纷调解委员会申请调解
      </h2>
      <p className="leading-relaxed">
        如果房东摆出&ldquo;内容证明我收到了，但不接受6%就不续约&rdquo;的态度，请立即向<strong>住宅租赁纠纷调解委员会</strong>或<strong>租赁纠纷调解委员会</strong>申请调解。申请费通常免费，或在1万韩元左右，一般60天以内就能拿到调解结果。
      </p>
      <p className="leading-relaxed">
        调解过程中，委员会会听取双方意见，并判断是否适用5%上限。大多数情况下租客会胜出——因为法律规定很明确。如果房东拒绝调解方案，租客可以正式提起诉讼(依据《住宅租赁保护法》主张自身权益)，法院通常也会得出相同结论。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        5. 房东的&lsquo;本人自住&rsquo;理由 — 先确认是不是真的
      </h2>
      <p className="leading-relaxed">
        房东可以合法拒绝续约的理由中，最常见的就是&lsquo;房东本人或其直系亲属要入住&rsquo;。一旦房东搬出这张牌，租客就无法行使续签请求权。
      </p>
      <p className="leading-relaxed">
        但如果房东谎称要自住把租客赶走，却在2年内又把房子租给了别人，租客可以要求损害赔偿。赔偿金额通常按一年租金，或按新租客租金的一定比例计算。如果觉得可疑，建议在几个月后查询不动产登记簿誊本、迁入住户信息、邮件收件地址等加以确认，比较保险。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        6. 也可以只协商保证金或只协商月租的涨幅
      </h2>
      <p className="leading-relaxed">
        因为5%上限是按&lsquo;换算保证金口径的5%&rsquo;计算的，所以也可以只上调保证金，或者只上调月租来谈判。
        <Link
          href={`/${locale}/rent-cap`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          租金5%验证工具
        </Link>
        的结果会显示&lsquo;维持月租不变时的最高保证金&rsquo;、&lsquo;维持保证金不变时的最高月租&rsquo;等推荐值。可以根据房东更看重保证金还是月租，把它当作谈判筹码来用。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        7. 续约2年到期之后会怎样
      </h2>
      <p className="leading-relaxed">
        续签请求权<strong>在最初合同签订后只能行使一次</strong>。也就是说，最初2年加续约2年，总共4年是法定保障期限。4年之后必须签订新合同，届时5%规则将不再适用(新合同按市场价格签订)。
      </p>
      <p className="leading-relaxed">
        所以建议在续约的这2年里，提前准备好下一个住处和下一份合同的条件。默示续约(房东和租客都没有明确表示、合同自动延长的情况)不算作已行使续签请求权，因此在默示续约之后，某些情况下仍可单独行使续签请求权——由于相关判例存在分歧，建议向纠纷调解委员会咨询确认。
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        结语
      </h2>
      <p className="leading-relaxed">
        房租5%上限是为保护租客而设立的法律规定。收到通知也不要无条件接受，先确认自己的权利。需要计算的话，用
        <Link
          href={`/${locale}/rent-cap`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          租金5%涨幅上限验证
        </Link>
        ，5秒就能得到答案。比较租金差额时，换算成坪数会更直观，建议一并参考
        <Link
          href={`/${locale}/area-convert`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          坪数 ↔ ㎡ 换算
        </Link>
        。
      </p>
      <p className="text-sm text-[color:var(--color-text-tertiary)]">
        本文仅为一般性说明。具体案件的准确判断，建议咨询法务士、律师或纠纷调解委员会。如果地方自治条例规定了更低的上限，以该条例为准。
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
          2026-05-23 · ~6 phút đọc
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Nhận thông báo tăng tiền thuê nhà vượt 5% ở Hàn Quốc? 7 việc cần làm
          ngay
        </h1>
      </header>

      <p className="leading-relaxed">
        Một tin nhắn bất chợt gửi đến: &ldquo;Mong anh/chị đồng ý tăng tiền
        đặt cọc 6% khi gia hạn hợp đồng.&rdquo; Nếu bạn là người thuê nhà đã
        từng nghe về quy tắc trần tăng 5% theo Luật Bảo vệ Thuê nhà, trong đầu
        chắc chắn sẽ nảy ra một loạt câu hỏi. &lsquo;6% chẳng phải đã vượt
        trần rồi sao? Nếu từ chối thì có bị đuổi đi không? Hay cứ chấp nhận
        cho xong?&rsquo; Câu trả lời rất rõ ràng: &lsquo;đừng vội chấp nhận,
        hãy làm theo đúng quy trình&rsquo;. Dưới đây là thứ tự các bước cần
        làm.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        1. Trước tiên hãy tính chính xác theo tiền đặt cọc quy đổi
      </h2>
      <p className="leading-relaxed">
        Nếu chỉ tăng tiền đặt cọc, hoặc chỉ tăng tiền thuê hàng tháng (Wolse),
        thì việc tính khá đơn giản. Nhưng nếu là hợp đồng kết hợp cả tiền đặt
        cọc và tiền thuê hàng tháng như kiểu bán-Jeonse (반전세), bạn phải
        tính theo &lsquo;tiền đặt cọc quy đổi&rsquo;. Công thức như sau:
      </p>
      <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-sm leading-relaxed">
        Tiền đặt cọc quy đổi = tiền đặt cọc + (tiền thuê hàng tháng × 12 / tỷ
        lệ chuyển đổi jeonse-wolse)
      </div>
      <p className="leading-relaxed">
        Tỷ lệ chuyển đổi jeonse-wolse = lãi suất cơ bản của Ngân hàng Trung
        ương Hàn Quốc + 2%, tính đến 05/2026 khoảng 5,0%. Để so sánh trần 5%
        của hợp đồng bạn với đề xuất của chủ nhà, hãy nhập cả hai trường hợp
        vào{" "}
        <Link
          href={`/${locale}/rent-cap`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          công cụ kiểm tra trần tăng tiền thuê 5%
        </Link>{" "}
        — kết quả sẽ hiện ngay: mức tăng đề xuất, có vượt trần hay không, và
        vượt bao nhiêu.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        2. Xác nhận bạn có quyền thực hiện quyền yêu cầu gia hạn hợp đồng hay
        không
      </h2>
      <p className="leading-relaxed">
        Quy tắc 5% chỉ áp dụng khi người thuê{" "}
        <strong>đã thực hiện quyền yêu cầu gia hạn hợp đồng</strong>. Điều
        kiện gồm:
      </p>
      <ul className="ml-1 list-disc space-y-1.5 pl-5 leading-relaxed text-sm">
        <li>
          Đưa ra yêu cầu gia hạn trong khoảng{" "}
          <strong>từ 6 tháng đến 1 tháng trước</strong> khi hợp đồng kết thúc
        </li>
        <li>
          Trước đó chưa từng thực hiện quyền yêu cầu gia hạn hợp đồng (chỉ
          được thực hiện một lần)
        </li>
        <li>Chủ nhà không có lý do từ chối gia hạn hợp pháp nào đang áp dụng</li>
      </ul>
      <p className="leading-relaxed">
        Nếu cả ba điều kiện trên đều thỏa mãn, người thuê có thể yêu cầu gia
        hạn trong giới hạn tăng 5%, và chủ nhà không thể từ chối nếu không có
        lý do chính đáng.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        3. Thông báo bằng văn bản (thư xác nhận nội dung) về việc thực hiện
        quyền yêu cầu gia hạn
      </h2>
      <p className="leading-relaxed">
        Chỉ trao đổi qua tin nhắn hay ứng dụng chat thì sau này rất khó chứng
        minh. Hãy gửi thư xác nhận nội dung (내용증명) ghi rõ các nội dung
        sau:
      </p>
      <ul className="ml-1 list-disc space-y-1.5 pl-5 leading-relaxed text-sm">
        <li>Tôi thực hiện quyền yêu cầu gia hạn hợp đồng theo Luật Bảo vệ Thuê nhà</li>
        <li>
          Điều kiện chủ nhà đề xuất vượt quá trần 5% (Điều 8 Nghị định thi
          hành Luật Bảo vệ Thuê nhà)
        </li>
        <li>Tôi có thể chấp nhận mức tăng trong giới hạn 5% (ghi rõ số tiền cụ thể)</li>
        <li>Yêu cầu chủ nhà phản hồi trong vòng 14 ngày</li>
      </ul>
      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        Thư xác nhận nội dung có thể gửi tại bưu điện với chi phí khoảng
        3.000 won, được lưu thành 3 bản (bạn, chủ nhà, bưu điện) nên có giá
        trị chứng cứ pháp lý rất mạnh.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        4. Nếu chủ nhà từ chối, hãy nộp đơn lên ủy ban hòa giải tranh chấp
      </h2>
      <p className="leading-relaxed">
        Nếu chủ nhà tỏ thái độ kiểu &ldquo;tôi nhận được thư xác nhận nội
        dung rồi, nhưng không được 6% thì không gia hạn&rdquo;, hãy lập tức
        nộp đơn xin hòa giải lên{" "}
        <strong>Ủy ban Hòa giải Tranh chấp Thuê nhà ở</strong> hoặc{" "}
        <strong>Ủy ban Hòa giải Tranh chấp Thuê nhà</strong>. Phí hòa giải
        thường miễn phí hoặc khoảng 10.000 won, và thường có kết quả trong
        vòng 60 ngày.
      </p>
      <p className="leading-relaxed">
        Trong quá trình hòa giải, ủy ban sẽ lắng nghe ý kiến của cả hai bên và
        phán quyết xem trần 5% có được áp dụng hay không. Phần lớn trường hợp
        người thuê sẽ thắng, vì quy định pháp luật rất rõ ràng. Nếu chủ nhà từ
        chối phương án hòa giải, người thuê có thể khởi kiện chính thức (dựa
        trên Luật Bảo vệ Thuê nhà để yêu cầu bảo vệ quyền lợi), và tòa án
        thường cũng đưa ra kết luận tương tự.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        5. Lý do &lsquo;chủ nhà vào ở trực tiếp&rsquo; — hãy xác minh xem có
        thật hay không
      </h2>
      <p className="leading-relaxed">
        Trong số các lý do hợp pháp mà chủ nhà có thể dùng để từ chối gia hạn,
        phổ biến nhất là &lsquo;chủ nhà hoặc người thân trực hệ của chủ nhà sẽ
        vào ở&rsquo;. Nếu chủ nhà đưa ra lý do này, người thuê sẽ không thể
        thực hiện quyền yêu cầu gia hạn hợp đồng.
      </p>
      <p className="leading-relaxed">
        Tuy nhiên, nếu chủ nhà nói dối về lý do vào ở để đuổi người thuê đi,
        rồi trong vòng 2 năm lại cho người thuê khác vào ở, người thuê ban đầu
        có thể yêu cầu bồi thường thiệt hại. Mức bồi thường thường được tính
        bằng tiền thuê một năm, hoặc theo một tỷ lệ nhất định so với tiền thuê
        của người thuê mới. Nếu nghi ngờ, nên kiểm tra lại sau vài tháng bằng
        cách xem sổ đăng ký bất động sản, tra cứu hộ khẩu chuyển đến, và địa
        chỉ nhận thư, để đảm bảo an toàn.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        6. Cũng có thể thương lượng chỉ tăng tiền đặt cọc hoặc chỉ tăng tiền
        thuê hàng tháng
      </h2>
      <p className="leading-relaxed">
        Vì trần 5% được tính theo &lsquo;tiền đặt cọc quy đổi&rsquo;, nên bạn
        cũng có thể thương lượng chỉ tăng riêng tiền đặt cọc, hoặc chỉ tăng
        riêng tiền thuê hàng tháng. Hãy xem kết quả của{" "}
        <Link
          href={`/${locale}/rent-cap`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          công cụ kiểm tra trần tăng 5%
        </Link>{" "}
        để thấy các mức đề xuất như &lsquo;tiền đặt cọc tối đa nếu giữ nguyên
        tiền thuê&rsquo;, &lsquo;tiền thuê tối đa nếu giữ nguyên tiền đặt
        cọc&rsquo;. Tùy theo việc chủ nhà thích tăng tiền đặt cọc hay tiền
        thuê hàng tháng hơn, bạn có thể dùng con số này làm quân bài thương
        lượng.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        7. Sau khi hết 2 năm gia hạn thì sao
      </h2>
      <p className="leading-relaxed">
        Quyền yêu cầu gia hạn hợp đồng{" "}
        <strong>chỉ được thực hiện một lần sau hợp đồng đầu tiên</strong>. Tức
        là 2 năm ban đầu cộng 2 năm gia hạn, tổng cộng 4 năm là thời hạn được
        pháp luật bảo đảm. Sau 4 năm, bạn phải ký hợp đồng mới, và lúc đó quy
        tắc 5% sẽ không còn áp dụng nữa (hợp đồng mới tính theo giá thị
        trường).
      </p>
      <p className="leading-relaxed">
        Vì vậy, trong 2 năm gia hạn, bạn nên chuẩn bị trước nơi ở tiếp theo và
        điều kiện hợp đồng tiếp theo. Gia hạn mặc nhiên (cả chủ nhà và người
        thuê đều không có ý kiến gì và hợp đồng tự động kéo dài) không được
        coi là đã thực hiện quyền yêu cầu gia hạn hợp đồng, nên trong một số
        trường hợp, người thuê vẫn có thể thực hiện quyền này riêng sau khi đã
        gia hạn mặc nhiên — vì án lệ vẫn còn chưa thống nhất, nên tốt nhất hãy
        tham khảo ý kiến của ủy ban hòa giải tranh chấp.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Kết luận
      </h2>
      <p className="leading-relaxed">
        Trần tăng giá thuê 5% là quy định pháp luật được đặt ra để bảo vệ
        người thuê nhà. Đừng chấp nhận ngay chỉ vì nhận được thông báo — hãy
        xác nhận quyền lợi của mình trước. Nếu cần tính toán, hãy dùng{" "}
        <Link
          href={`/${locale}/rent-cap`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          công cụ kiểm tra trần tăng tiền thuê 5%
        </Link>{" "}
        — câu trả lời sẽ có trong 5 giây. Khi so sánh chênh lệch tiền thuê,
        quy đổi sang diện tích pyeong sẽ giúp bạn thấy rõ giá trị hơn, hãy
        tham khảo thêm{" "}
        <Link
          href={`/${locale}/area-convert`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          công cụ quy đổi pyeong ↔ m²
        </Link>
        .
      </p>
      <p className="text-sm text-[color:var(--color-text-tertiary)]">
        Bài viết này chỉ mang tính tổng quát. Để có phán đoán chính xác cho
        từng trường hợp cụ thể, nên tham khảo ý kiến luật sư, chuyên gia pháp
        lý hoặc ủy ban hòa giải tranh chấp. Nếu quy định của địa phương đặt ra
        mức trần thấp hơn, quy định đó sẽ được ưu tiên áp dụng.
      </p>
      <PostTags tags={findPost(SLUG)!.tags.vi} isKo={false} />
    </article>
  );
}
