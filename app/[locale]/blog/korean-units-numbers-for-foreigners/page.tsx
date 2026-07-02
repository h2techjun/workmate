/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { findPost } from "@/lib/blogPosts";
import PostTags from "@/components/ui/PostTags";

const SLUG = "korean-units-numbers-for-foreigners";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const isKo = locale === "ko";
  const post = findPost(SLUG)!;
  const title = isKo ? post.titleKo : post.titleEn;
  const description = isKo ? post.summaryKo : post.summaryEn;
  return {
    title: `${title} — Workmate`,
    description,
    keywords: isKo
      ? [
          "한국 단위 변환",
          "평 제곱미터",
          "만 나이 계산",
          "한국 옷 사이즈",
          "리 킬로미터",
          "외국인 한국생활",
        ]
      : [
          "korean units for foreigners",
          "what is a pyeong",
          "korean age calculator",
          "us to korea size",
          "korean shoe size",
          "living in korea guide",
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

const H2 =
  "pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl";
const LINK =
  "text-indigo-300 underline underline-offset-2 hover:text-indigo-200";
const CARD =
  "overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]";

export default async function BlogPostPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const isKo = locale === "ko";

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
          2026-06-30 · ~10 min read
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Korean Units & Numbers for Foreigners: Pyeong, Age, Sizes, Distance
          & More
        </h1>
      </header>

      <p className="leading-relaxed">
        Korea runs on a few number systems that quietly trip up every newcomer:
        apartment sizes in <em>pyeong</em>, your age that jumps by one or two
        overnight, clothing sizes that don't match anything back home, and
        distances in <em>ri</em>. None of it is hard once someone explains it —
        so here is the whole thing in one place, with a free calculator for each.
      </p>

      <div className={CARD}>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--color-border-subtle)] text-left text-[color:var(--color-text-tertiary)]">
              <th className="px-3 py-2 font-medium">What confuses you</th>
              <th className="px-3 py-2 font-medium">Quick answer</th>
            </tr>
          </thead>
          <tbody className="text-[color:var(--color-text-secondary)]">
            <tr className="border-b border-[color:var(--color-border-subtle)]/60">
              <td className="px-3 py-2">Apartment area (평, pyeong)</td>
              <td className="px-3 py-2">1 pyeong = 3.3058 m² → 84 m² ≈ 25 pyeong</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/60">
              <td className="px-3 py-2">Korean age</td>
              <td className="px-3 py-2">Since 2023, Korea uses international age officially</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/60">
              <td className="px-3 py-2">Clothing / shoes</td>
              <td className="px-3 py-2">Shoes in mm (US 9 ≈ 270 mm); tops in numeric (90–110)</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/60">
              <td className="px-3 py-2">Distance (리, ri)</td>
              <td className="px-3 py-2">1 ri ≈ 0.393 km (10 ri ≈ 3.93 km)</td>
            </tr>
            <tr>
              <td className="px-3 py-2">Temperature</td>
              <td className="px-3 py-2">Korea uses Celsius everywhere</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className={H2}>1. Pyeong (평) — how apartment sizes work</h2>
      <p className="leading-relaxed">
        Every Korean real-estate listing shows area in both m² and{" "}
        <strong>pyeong (평)</strong>, a traditional unit. The exact ratio is
        1 pyeong = 3.30579 m² (not the "3.3" you'll see quoted), so an 84 m²
        flat is about 25.4 pyeong. The bigger trap is that listings mix two
        different areas: <em>supply area</em> (what you pay for, including shared
        space) and <em>exclusive area</em> (what you actually live in). An
        "84 m²" apartment usually means 84 m² of <em>exclusive</em> area, with a
        larger supply area.
      </p>
      <p className="leading-relaxed">
        Convert any number with the{" "}
        <Link href={`/${locale}/area-convert`} className={LINK}>
          square-meters-to-pyeong converter
        </Link>
        , and decode the exclusive-vs-supply trap with the{" "}
        <Link href={`/${locale}/apartment-area`} className={LINK}>
          apartment area & price-per-pyeong tool
        </Link>
        . For the full story, see{" "}
        <Link
          href={`/${locale}/blog/korean-pyeong-explained-for-foreigners`}
          className={LINK}
        >
          "Korean Pyeong, Explained."
        </Link>
      </p>

      <h2 className={H2}>2. Korean age — the two systems (and the 2023 change)</h2>
      <p className="leading-relaxed">
        You may have heard that Koreans are "one or two years older." Until 2023,
        three age systems coexisted: <em>Korean age</em> (born at 1, +1 every New
        Year), <em>international age</em> (0 at birth), and <em>calendar-year age</em>{" "}
        (current year − birth year). Since June 2023, <strong>international age is
        the legal and administrative standard</strong> — but "Korean age" still
        shows up in casual conversation, so it helps to know both.
      </p>
      <p className="leading-relaxed">
        See all three at once with the{" "}
        <Link href={`/${locale}/korean-age`} className={LINK}>
          Korean age calculator
        </Link>
        . And if you have kids, Korean school grade is set by birth year, not
        age — check it with the{" "}
        <Link href={`/${locale}/school-grade`} className={LINK}>
          Korean school grade calculator
        </Link>
        .
      </p>

      <h2 className={H2}>3. Clothing & shoe sizes</h2>
      <p className="leading-relaxed">
        Korean shoes are labelled in <strong>millimeters</strong>: a US men's 9
        is about 270 mm, a US women's 7 about 240 mm. Tops and dresses often use
        a numeric system (85, 90, 95, 100…) that roughly maps to XS–XL, and
        women's sizes sometimes use 44/55/66/77. It's close to but not the same
        as US/EU sizing, so always convert before you order online.
      </p>
      <p className="leading-relaxed">
        Convert US/EU ↔ Korea with the{" "}
        <Link href={`/${locale}/size-convert`} className={LINK}>
          clothing & shoe size converter
        </Link>
        .
      </p>

      <h2 className={H2}>4. Distance — ri (리), miles, and km</h2>
      <p className="leading-relaxed">
        Korea uses kilometers for everything modern, but you'll still meet the
        traditional <em>ri (리)</em> in idioms, place names, and old texts — and
        if you're arriving from the US, you'll want to convert miles too.
        1 ri ≈ 0.393 km, so the famous "삼천리 (three-thousand ri)" describing the
        length of the Korean peninsula is about 1,200 km.
      </p>
      <p className="leading-relaxed">
        Convert ri / miles ↔ km with the{" "}
        <Link href={`/${locale}/distance-convert`} className={LINK}>
          distance converter
        </Link>
        , and °F ↔ °C with the{" "}
        <Link href={`/${locale}/temp-convert`} className={LINK}>
          temperature converter
        </Link>{" "}
        (Korea is Celsius-only, so 38 °C is a heat-wave day, not a fever).
      </p>

      <h2 className={H2}>5. The business registration number (사업자등록번호)</h2>
      <p className="leading-relaxed">
        Doing business, freelancing, or signing a lease? You'll see 10-digit
        business registration numbers everywhere. They carry a built-in checksum
        (the 1-3-7-1-3-7-1-3-5 weighted algorithm), so a single tool can tell you
        instantly whether a number is even structurally valid — a quick sanity
        check before you wire money.
      </p>
      <p className="leading-relaxed">
        Validate any number with the{" "}
        <Link href={`/${locale}/biznum-check`} className={LINK}>
          business registration number validator
        </Link>
        , and see how the checksum works in{" "}
        <Link
          href={`/${locale}/blog/korean-business-number-checksum`}
          className={LINK}
        >
          "What the Checksum Tells You."
        </Link>
      </p>

      <h2 className={H2}>6. A few more you'll hit</h2>
      <p className="leading-relaxed">
        <strong>Names:</strong> romanize your Korean name for a passport or
        card with the{" "}
        <Link href={`/${locale}/name-romanize`} className={LINK}>
          name romanizer
        </Link>
        . <strong>Money:</strong> Koreans count in 만 (10,000) and 억
        (100,000,000), so "3천만원" is 30 million won — our calculators show the
        만/억 reading next to big amounts. For the full arrival-to-departure
        picture, read the{" "}
        <Link
          href={`/${locale}/blog/living-in-korea-foreigner-guide`}
          className={LINK}
        >
          complete guide to living in Korea
        </Link>
        .
      </p>

      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        All tools are free, need no sign-up, and work on mobile. Bookmark the
        ones you'll reuse — the ㎡↔pyeong and age converters come up more often
        than you'd think.
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
          2026-06-30 · 약 10분
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          외국인을 위한 한국 단위·숫자 완전 가이드 — 평·만나이·사이즈·거리·온도
        </h1>
      </header>

      <p className="leading-relaxed">
        한국에 오면 조용히 발목을 잡는 숫자 체계가 몇 개 있습니다. 평으로 표시된
        아파트 면적, 하루아침에 한두 살 바뀌는 나이, 본국과 안 맞는 옷·신발
        사이즈, 그리고 "리(里)" 단위 거리까지. 한 번만 정리하면 어렵지 않으니,
        여기 한 곳에 모아 각 항목마다 무료 변환 도구를 연결했습니다.
      </p>

      <h2 className={H2}>1. 평(坪) — 아파트 면적 읽기</h2>
      <p className="leading-relaxed">
        한국 부동산 매물은 면적을 ㎡와 <strong>평</strong> 둘 다로 표기합니다.
        정확한 비율은 1평 = 3.30579㎡ (흔히 말하는 "3.3"이 아님)이라 84㎡는 약
        25.4평입니다. 더 큰 함정은 공급면적(내가 돈 내는, 공용 포함)과
        전용면적(실제 거주)이 섞여 있다는 점 — "84㎡"는 보통 전용 84㎡를 뜻합니다.
        {" "}
        <Link href={`/${locale}/area-convert`} className={LINK}>
          평↔㎡ 변환기
        </Link>
        로 숫자를 바꾸고,{" "}
        <Link href={`/${locale}/apartment-area`} className={LINK}>
          전용·공급면적/평당가 계산기
        </Link>
        로 함정을 풀어보세요.
      </p>

      <h2 className={H2}>2. 나이 — 세는나이·만나이와 2023년 변화</h2>
      <p className="leading-relaxed">
        2023년 6월부터 <strong>만 나이가 법적·행정 표준</strong>이 됐지만,
        일상 대화엔 여전히 세는나이가 남아 있어 둘 다 알아두면 편합니다.{" "}
        <Link href={`/${locale}/korean-age`} className={LINK}>
          만 나이 계산기
        </Link>
        로 세 방식을 한 번에 보고, 자녀가 있다면 출생연도로 정해지는{" "}
        <Link href={`/${locale}/school-grade`} className={LINK}>
          한국 학년
        </Link>
        도 확인하세요.
      </p>

      <h2 className={H2}>3. 옷·신발 사이즈 / 4. 거리·온도</h2>
      <p className="leading-relaxed">
        한국 신발은 mm 표기(US 9 ≈ 270mm)이고 옷은 85·90·95·100 숫자 체계라
        본국 사이즈와 다릅니다 —{" "}
        <Link href={`/${locale}/size-convert`} className={LINK}>
          사이즈 변환기
        </Link>
        로 확인하세요. 거리는 km가 표준이지만 "리(里)"가 관용어·지명에 남아
        있고(1리 ≈ 0.393km),{" "}
        <Link href={`/${locale}/distance-convert`} className={LINK}>
          거리 변환기
        </Link>
        와{" "}
        <Link href={`/${locale}/temp-convert`} className={LINK}>
          온도 변환기
        </Link>
        (한국은 섭씨만 사용)로 마일·화씨를 바꿀 수 있습니다.
      </p>

      <h2 className={H2}>5. 사업자등록번호 + 6. 그 밖에</h2>
      <p className="leading-relaxed">
        거래·프리랜스·임대 시 자주 보는 10자리 사업자등록번호는 1-3-7 가중치
        체크섬이 들어 있어,{" "}
        <Link href={`/${locale}/biznum-check`} className={LINK}>
          사업자등록번호 검증기
        </Link>
        로 송금 전 진위를 1초에 확인할 수 있습니다. 여권용 이름은{" "}
        <Link href={`/${locale}/name-romanize`} className={LINK}>
          이름 로마자 변환기
        </Link>
        로, 한국 생활 전체 여정은{" "}
        <Link
          href={`/${locale}/blog/living-in-korea-foreigner-guide`}
          className={LINK}
        >
          한국 사는 외국인 완전 가이드
        </Link>
        에서 이어보세요.
      </p>

      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        모든 도구는 무료·가입 불필요·모바일 지원입니다. 자주 쓸 것(평 변환·나이
        계산)은 즐겨찾기 해두세요.
      </p>

      <PostTags tags={findPost(SLUG)!.tags.ko} isKo={true} />
    </article>
  );
}
