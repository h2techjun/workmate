/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { findPost } from "@/lib/blogPosts";
import PostTags from "@/components/ui/PostTags";

const SLUG = "korean-pyeong-explained-for-foreigners";

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
          "평수 환산",
          "84제곱미터 평수",
          "전용면적 공급면적",
          "부동산 평수",
          "1평 몇 제곱미터",
        ]
      : [
          "korean pyeong",
          "84 square meters to pyeong",
          "pyeong to m2",
          "korean real estate size",
          "exclusive area Korea",
          "supply area Korea",
          "84sqm apartment Korea",
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

        {isKo ? <KoContent locale={locale} /> : <EnContent locale={locale} />}
      </div>
    </main>
  );
}

function EnContent({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-6 text-[color:var(--color-text-secondary)]">
      <header className="mb-2">
        <p className="mb-3 text-sm text-[color:var(--color-text-tertiary)]">
          2026-05-30 · ~7 min read
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Korean Pyeong, Explained — Why 84㎡ is Called 25-Pyeong
        </h1>
      </header>

      <p className="leading-relaxed">
        You're browsing apartments in Seoul. The listing says "84㎡ / 25
        pyeong." Your phone calculator says 84 ÷ 3.3 = 25.45. Close enough,
        you think. Then you walk into the unit and it feels smaller than 25
        pyeong sounded. That's because Korean real estate listings use two
        different area concepts at the same time — and the
        ㎡ ↔ pyeong conversion is the easy part.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        The exact conversion (forget 3.3)
      </h2>
      <p className="leading-relaxed">
        The textbook conversion most foreigners learn is "1 pyeong ≈ 3.3 ㎡."
        That's wrong by half a percent. The exact ratio comes from traditional
        Korean units:
      </p>
      <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 font-mono text-sm leading-relaxed">
        1 pyeong = 6 ja × 6 ja = 36 ja²
        <br />
        1 ja = 10/33 m ≈ 0.30303 m
        <br />
        1 pyeong = 3,600 / 1,089 ㎡ ≈ <strong>3.30579 ㎡</strong>
      </div>
      <p className="leading-relaxed">
        At a 25-pyeong apartment, the difference between 3.3 and 3.30579 is
        about 0.14 ㎡ — not big enough to matter. But for a 30-pyeong
        commercial space, it's 0.17 ㎡, which is real money in seoul. Our{" "}
        <Link
          href={`/${locale}/area-convert`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          pyeong ↔ m² converter
        </Link>{" "}
        uses the exact ratio.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Why 84㎡ ≠ exactly 25 pyeong
      </h2>
      <p className="leading-relaxed">
        Punching 84 into the converter gives 25.41 pyeong. Listings round to
        25 — close enough. But why is 84㎡ such a common number in Korean
        listings? Because Korean apartments come in standardized sizes set by
        building regulations and historical convention:
      </p>
      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--color-border-subtle)] text-[color:var(--color-text-tertiary)]">
              <th className="px-4 py-2 text-left font-medium">Size (㎡)</th>
              <th className="px-4 py-2 text-right font-medium">Exact pyeong</th>
              <th className="px-4 py-2 text-left font-medium">Marketed as</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">59</td>
              <td className="px-4 py-2 text-right">17.85</td>
              <td className="px-4 py-2">18-pyeong / 20-pyeong type</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">74</td>
              <td className="px-4 py-2 text-right">22.39</td>
              <td className="px-4 py-2">22-pyeong type</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">84</td>
              <td className="px-4 py-2 text-right">25.41</td>
              <td className="px-4 py-2">25-pyeong type (most common 3-bed)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">114</td>
              <td className="px-4 py-2 text-right">34.49</td>
              <td className="px-4 py-2">34-pyeong type</td>
            </tr>
            <tr>
              <td className="px-4 py-2">143</td>
              <td className="px-4 py-2 text-right">43.26</td>
              <td className="px-4 py-2">43-pyeong type</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        The standardization comes from regulatory limits — 84㎡ is the largest
        unit eligible for certain government subsidies and tax breaks,
        which is why it dominates new construction.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        The real trap: exclusive vs supply vs contract area
      </h2>
      <p className="leading-relaxed">
        Here's where foreigners get burned. Korean listings show "84㎡" — but
        which 84㎡? Korean real estate uses three different area concepts:
      </p>
      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--color-border-subtle)] text-[color:var(--color-text-tertiary)]">
              <th className="px-4 py-2 text-left font-medium">Type</th>
              <th className="px-4 py-2 text-left font-medium">Korean</th>
              <th className="px-4 py-2 text-left font-medium">What's included</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2 font-medium">Exclusive</td>
              <td className="px-4 py-2">전용면적</td>
              <td className="px-4 py-2">
                Rooms, living, kitchen, bath — what's behind your door
              </td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2 font-medium">Supply</td>
              <td className="px-4 py-2">공급면적</td>
              <td className="px-4 py-2">
                Exclusive + shared residential (hallways, stairs, lobby)
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">Contract</td>
              <td className="px-4 py-2">계약면적</td>
              <td className="px-4 py-2">
                Supply + parking, management room, basement
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="leading-relaxed">
        For a typical "84㎡ / 25 pyeong" apartment:
      </p>
      <ul className="ml-1 list-disc space-y-1.5 pl-5 leading-relaxed text-sm">
        <li>
          <strong>Exclusive area = 84㎡</strong> (the number on the door registry)
        </li>
        <li>
          <strong>Supply area ≈ 109㎡</strong> = 33 pyeong (the number agents
          often quote)
        </li>
        <li>
          <strong>Contract area ≈ 145㎡</strong> = 43 pyeong (what you pay
          property tax on)
        </li>
      </ul>
      <p className="leading-relaxed">
        So "25-pyeong" and "33-pyeong" can refer to the same apartment —
        depending on whether the seller is counting exclusive or supply area.
        Always ask: <em>전용 25평 vs 공급 33평</em>.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        How to read a Korean property listing
      </h2>
      <ol className="ml-1 list-decimal space-y-2 pl-5 leading-relaxed">
        <li>
          Find the official ㎡ on the property registration certificate
          (등기부등본). This is always exclusive area — it's the only legally
          binding number.
        </li>
        <li>
          Use the{" "}
          <Link
            href={`/${locale}/area-convert`}
            className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
          >
            pyeong converter
          </Link>{" "}
          to get the exact pyeong. (Listings round, the registry doesn't.)
        </li>
        <li>
          Ask the agent: <em>"전용면적인가요, 공급면적인가요?"</em> (Is this
          exclusive or supply area?) Their answer tells you which size to
          trust.
        </li>
        <li>
          Check the "전용률" (efficiency ratio) — exclusive ÷ supply. New
          apartments hit 70-75%. Anything under 65% means a lot of wasted
          shared space.
        </li>
      </ol>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        The ja² wildcard (and why it sometimes shows up)
      </h2>
      <p className="leading-relaxed">
        Old Korean drawings, traditional houses, and Japanese-style
        architecture sometimes use <strong>ja² (尺²)</strong> instead of ㎡.
        Conversion:
      </p>
      <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 font-mono text-sm leading-relaxed">
        1 pyeong = 36 ja²
        <br />
        1 ja² ≈ 0.0918 ㎡
        <br />
        100 ja² ≈ 9.18 ㎡ ≈ 2.78 pyeong
      </div>
      <p className="leading-relaxed">
        You probably won't see it in modern listings, but renovating a
        hanok (traditional house) or working from old construction drawings
        — ja² is what you'll meet.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Quick reference card
      </h2>
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
        <ul className="space-y-2 text-sm">
          <li>
            <strong>1 pyeong = 3.30579 ㎡</strong> (not 3.3 — close enough for
            small spaces, off for big ones)
          </li>
          <li>
            <strong>84㎡ apartment</strong> = 25.41 pyeong (exclusive) or
            ~33 pyeong (supply)
          </li>
          <li>
            <strong>Always ask:</strong> 전용 (exclusive) or 공급 (supply)
          </li>
          <li>
            <strong>Only ㎡ is legally binding</strong>; pyeong is for
            convenience
          </li>
          <li>
            <strong>전용률 70%+</strong> is decent; below 65% is wasteful
          </li>
        </ul>
      </div>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Wrap-up
      </h2>
      <p className="leading-relaxed">
        Korean real estate sizes seem opaque because two systems run in
        parallel — but once you know that ㎡ is always exclusive and pyeong
        is either exclusive or supply, the listings stop lying to you. For
        instant conversion, use the{" "}
        <Link
          href={`/${locale}/area-convert`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          pyeong ↔ m² converter
        </Link>
        . For Korean rental contracts and the 5% renewal cap, see the{" "}
        <Link
          href={`/${locale}/rent-cap`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          rent cap calculator
        </Link>
        .
      </p>
      <p className="text-sm text-[color:var(--color-text-tertiary)]">
        Conversions are based on Korean traditional units (1 ja = 10/33 m).
        Pyeong is unofficial in Korean law since 1961; only ㎡ has legal
        force.
      </p>
      <PostTags tags={findPost(SLUG)!.tags.en} isKo={false} />
    </article>
  );
}

function KoContent({ locale }: { locale: string }): React.ReactElement {
  return (
    <article className="space-y-6 text-[color:var(--color-text-secondary)]">
      <header className="mb-2">
        <p className="mb-3 text-sm text-[color:var(--color-text-tertiary)]">
          2026-05-30 · 약 7분
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          외국인을 위한 평수 가이드 — 84㎡가 왜 25평일까
        </h1>
      </header>

      <p className="leading-relaxed">
        서울 아파트 매물을 보고 있는데 "84㎡ / 25평" 이라고 적혀 있습니다.
        계산기에 84 ÷ 3.3 을 두드리니 25.45. 비슷한가 보네 생각하고 방문해
        보면 25평이라고 들었던 것보다 작게 느껴집니다. 한국 부동산이
        면적을 두 가지로 표기하는 데서 오는 혼란이고, ㎡ ↔ 평 환산은
        그 중에서 가장 단순한 부분이에요.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        정확한 환산값 (3.3은 잊으세요)
      </h2>
      <p className="leading-relaxed">
        많이 알려진 "1평 ≈ 3.3㎡" 는 약 0.5% 오차가 있습니다. 전통 단위
        기반의 정확한 환산:
      </p>
      <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 font-mono text-sm leading-relaxed">
        1평 = 6자 × 6자 = 36자²
        <br />
        1자 = 10/33 m ≈ 0.30303 m
        <br />
        1평 = 3,600 / 1,089 ㎡ ≈ <strong>3.30579㎡</strong>
      </div>
      <p className="leading-relaxed">
        25평짜리에서는 0.14㎡ 차이라 무시할 수 있지만, 30평 상가에서는
        0.17㎡ 차이가 서울 시세로 실제 돈이 됩니다.{" "}
        <Link
          href={`/${locale}/area-convert`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          평수 변환기
        </Link>{" "}
        는 정확한 값을 씁니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        84㎡가 정확히 25평이 아닌 이유
      </h2>
      <p className="leading-relaxed">
        84를 환산하면 25.41평. 매물에선 25로 반올림. 그런데 왜 한국 매물에
        '84' 가 그렇게 많이 보이냐 — 건축 규제와 관행으로 표준 사이즈가
        정해져 있기 때문입니다.
      </p>
      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--color-border-subtle)] text-[color:var(--color-text-tertiary)]">
              <th className="px-4 py-2 text-left font-medium">㎡</th>
              <th className="px-4 py-2 text-right font-medium">정확한 평</th>
              <th className="px-4 py-2 text-left font-medium">매물 표기</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">59</td>
              <td className="px-4 py-2 text-right">17.85</td>
              <td className="px-4 py-2">18평형 / 20평형</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">74</td>
              <td className="px-4 py-2 text-right">22.39</td>
              <td className="px-4 py-2">22평형</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">84</td>
              <td className="px-4 py-2 text-right">25.41</td>
              <td className="px-4 py-2">25평형 (방3 표준)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">114</td>
              <td className="px-4 py-2 text-right">34.49</td>
              <td className="px-4 py-2">34평형</td>
            </tr>
            <tr>
              <td className="px-4 py-2">143</td>
              <td className="px-4 py-2 text-right">43.26</td>
              <td className="px-4 py-2">43평형</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        84㎡ 가 신축에 압도적인 이유는 청약·세제 혜택의 마지노선이기 때문.
        그 위는 중대형으로 분류되어 혜택이 줄어듭니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        진짜 함정 — 전용·공급·계약 면적
      </h2>
      <p className="leading-relaxed">
        외국인뿐 아니라 한국인도 헷갈리는 부분. 매물의 "84㎡" 는 셋 중 어느
        것일까요.
      </p>
      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--color-border-subtle)] text-[color:var(--color-text-tertiary)]">
              <th className="px-4 py-2 text-left font-medium">구분</th>
              <th className="px-4 py-2 text-left font-medium">포함 범위</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2 font-medium">전용면적</td>
              <td className="px-4 py-2">방·거실·주방·욕실 (문 안쪽)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2 font-medium">공급면적</td>
              <td className="px-4 py-2">전용 + 주거공용 (복도·계단·로비)</td>
            </tr>
            <tr>
              <td className="px-4 py-2 font-medium">계약면적</td>
              <td className="px-4 py-2">공급 + 주차장·관리실·지하</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className="leading-relaxed">
        "84㎡ / 25평형" 아파트는 보통:
      </p>
      <ul className="ml-1 list-disc space-y-1.5 pl-5 leading-relaxed text-sm">
        <li>전용면적 = 84㎡ (등기부등본 기준)</li>
        <li>공급면적 ≈ 109㎡ = 33평 (중개사들이 자주 말하는 값)</li>
        <li>계약면적 ≈ 145㎡ = 43평 (재산세 과세 기준)</li>
      </ul>
      <p className="leading-relaxed">
        그래서 같은 집을 "25평형" 또는 "33평형" 둘 다로 부를 수 있어요. 매매·
        임대 시 항상 <em>전용 25평인가요, 공급 33평인가요?</em> 확인하세요.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        매물 보는 절차
      </h2>
      <ol className="ml-1 list-decimal space-y-2 pl-5 leading-relaxed">
        <li>
          등기부등본의 ㎡ 확인 — 이것만이 법적 효력을 가지는 숫자 (항상
          전용면적)
        </li>
        <li>
          <Link
            href={`/${locale}/area-convert`}
            className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
          >
            평수 변환기
          </Link>{" "}
          로 정확한 평 환산
        </li>
        <li>중개사에게 "전용·공급 중 어느 기준인가요" 확인</li>
        <li>전용률 (= 전용 ÷ 공급) 확인 — 신축 70~75%, 65% 이하면 비효율적</li>
      </ol>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        빠른 참조 카드
      </h2>
      <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
        <ul className="space-y-2 text-sm">
          <li>
            <strong>1평 = 3.30579㎡</strong> (3.3은 어림값, 큰 평수에서 오차 누적)
          </li>
          <li>
            <strong>84㎡</strong> = 25.41평 (전용) 또는 33평 (공급)
          </li>
          <li>
            <strong>항상 확인:</strong> 전용 vs 공급
          </li>
          <li>
            <strong>등기 ㎡</strong> 만 법적 효력. 평은 편의용
          </li>
          <li>
            <strong>전용률 70%+</strong> 양호, 65% 이하 비효율
          </li>
        </ul>
      </div>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        마무리
      </h2>
      <p className="leading-relaxed">
        한국 부동산 면적이 복잡해 보이지만 두 시스템(㎡·평) + 세 면적(전용·
        공급·계약) 만 정리하면 거의 모든 매물이 해독됩니다. 즉시 환산은{" "}
        <Link
          href={`/${locale}/area-convert`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          평수 변환기
        </Link>
        에서. 한국 임대차 갱신 5% 룰은{" "}
        <Link
          href={`/${locale}/rent-cap`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          임대료 5% 검증
        </Link>
        에서 같이 확인하세요.
      </p>
      <p className="text-sm text-[color:var(--color-text-tertiary)]">
        환산값은 전통 단위 (1자 = 10/33 m) 기준입니다. 평은 1961년 이후
        법적 단위가 아니며, ㎡ 만 법적 효력을 가집니다.
      </p>
      <PostTags tags={findPost(SLUG)!.tags.ko} isKo={true} />
    </article>
  );
}
