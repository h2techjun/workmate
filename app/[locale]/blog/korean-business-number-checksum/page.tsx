/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { findPost } from "@/lib/blogPosts";
import PostTags from "@/components/ui/PostTags";

const SLUG = "korean-business-number-checksum";

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
          "사업자등록번호 체크섬",
          "사업자번호 검증",
          "1-3-7 가중치",
          "국세청 알고리즘",
          "가짜 사업자번호",
        ]
      : [
          "korean business registration number",
          "checksum algorithm",
          "business number validation Korea",
          "1-3-7 weights",
          "Korean NTS algorithm",
          "fake business number",
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
          2026-05-30 · ~6 min read
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          Korean Business Registration Number — What the Checksum Tells You
        </h1>
      </header>

      <p className="leading-relaxed">
        You're about to wire KRW 30 million to a Korean vendor. The invoice has
        a 10-digit business registration number (사업자등록번호). Is it real,
        or could it be a typo — or worse, a fabricated number from a fraud
        attempt? You can answer that in under one second, without calling
        anyone, by checking the embedded checksum. Here's how it works.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        The format you'll see
      </h2>
      <p className="leading-relaxed">
        Korean business registration numbers are 10 digits, typically formatted
        with two hyphens:
      </p>
      <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 font-mono text-sm leading-relaxed">
        XXX - XX - XXXXX
        <br />
        <span className="text-xs text-[color:var(--color-text-tertiary)]">
          Three digits — two digits — five digits
        </span>
      </div>
      <p className="leading-relaxed">
        The middle two digits encode business type (more on this below). The
        last digit (10th) is a check digit computed from the previous nine. If
        someone fabricates a number, getting that check digit right by chance
        is a 1-in-10 gamble.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        The checksum algorithm
      </h2>
      <p className="leading-relaxed">
        The Korean National Tax Service (NTS) defines the algorithm as
        follows. Let the ten digits be d1, d2, ..., d10.
      </p>
      <ol className="ml-1 list-decimal space-y-2 pl-5 leading-relaxed">
        <li>
          Multiply the first nine digits by the weight vector{" "}
          <strong>[1, 3, 7, 1, 3, 7, 1, 3, 5]</strong> and sum the results.
        </li>
        <li>
          Add the tens-digit of (d9 × 5). This is a special correction step
          that some implementations forget.
        </li>
        <li>
          Compute the check digit as <strong>(10 − sum % 10) % 10</strong>.
        </li>
        <li>If the check digit equals d10, the number passes.</li>
      </ol>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Worked example: 123-45-67890
      </h2>
      <p className="leading-relaxed">
        A common test string is 123-45-67890. Let's walk through it.
      </p>
      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 font-mono text-xs leading-relaxed">
        d1..d9   : 1  2  3  4  5  6  7  8  9
        <br />
        weights  : 1  3  7  1  3  7  1  3  5
        <br />
        products : 1  6 21  4 15 42  7 24 45  → sum = 165
        <br />
        d9 × 5 = 45  → tens digit = 4  → sum = 169
        <br />
        check digit = (10 − 169 % 10) % 10 = (10 − 9) % 10 = 1
        <br />
        d10 = 0  ≠  1  →  FORMAT ERROR
      </div>
      <p className="leading-relaxed">
        So 123-45-67890 is not a valid format. The check digit should be 1,
        but the number ends in 0. This is exactly the kind of input typo that
        the checksum catches.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Why these weights work
      </h2>
      <p className="leading-relaxed">
        The 1-3-5-7 weight pattern is a variant of ISO 7064 and was adopted by
        the Korean NTS in 1976. The combination has a useful property:
      </p>
      <ul className="ml-1 list-disc space-y-1.5 pl-5 leading-relaxed text-sm">
        <li>
          Every single-digit typo is caught — changing any one digit changes
          the checksum
        </li>
        <li>
          Adjacent-digit transpositions (swapping d2 and d3, for example) are
          almost always caught, because consecutive weights are different
        </li>
        <li>
          A random 10-digit string passes only about 10% of the time, so
          fabricated numbers fail roughly 90% of the time
        </li>
      </ul>
      <p className="leading-relaxed text-sm text-[color:var(--color-text-tertiary)]">
        Combined with the format constraint and the typing of middle digits,
        the practical false-positive rate for random fabrication is much
        lower than 10%.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Reading the middle two digits
      </h2>
      <p className="leading-relaxed">
        Digits 4 and 5 encode the business type. This isn't used in the
        checksum, but it tells you about the counterparty at a glance:
      </p>
      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--color-border-subtle)] text-[color:var(--color-text-tertiary)]">
              <th className="px-4 py-2 text-left font-medium">Middle digits</th>
              <th className="px-4 py-2 text-left font-medium">Business type</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">01 ~ 79</td>
              <td className="px-4 py-2">Individual sole proprietor</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">80</td>
              <td className="px-4 py-2">MLM individual</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">81, 86, 87, 88</td>
              <td className="px-4 py-2">For-profit corporation</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">82</td>
              <td className="px-4 py-2">Non-profit corporation</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">83</td>
              <td className="px-4 py-2">Government / public organization</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">84</td>
              <td className="px-4 py-2">Foreign corporation</td>
            </tr>
            <tr>
              <td className="px-4 py-2">89</td>
              <td className="px-4 py-2">For-profit corp HQ</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        What the checksum cannot tell you
      </h2>
      <p className="leading-relaxed">
        A passing checksum verifies <strong>format only</strong>. It cannot
        tell you:
      </p>
      <ul className="ml-1 list-disc space-y-1.5 pl-5 leading-relaxed text-sm">
        <li>Whether the business is actively registered</li>
        <li>Whether the business has been suspended or closed</li>
        <li>Whether the business is in tax arrears</li>
        <li>Whether the address or representative is current</li>
      </ul>
      <p className="leading-relaxed">
        For real-time registration status, the Korean National Tax Service
        runs a free public lookup at{" "}
        <a
          href="https://teht.hometax.go.kr/websquare/websquare.html?w2xPath=/ui/ab/a/a/UTEABAAA13.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          Hometax Business Status Inquiry
        </a>{" "}
        (no certificate required). Use the checksum as a first-pass filter
        and Hometax for the definitive status.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Practical workflow before a wire transfer
      </h2>
      <ol className="ml-1 list-decimal space-y-2 pl-5 leading-relaxed">
        <li>
          Run the number through the{" "}
          <Link
            href={`/${locale}/biznum-check`}
            className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
          >
            checksum validator
          </Link>{" "}
          — instant pass/fail.
        </li>
        <li>
          Check the middle two digits — does the business type match what the
          vendor told you? (A "consulting LLC" claiming an XXX-01-XXXXX
          individual number is a red flag.)
        </li>
        <li>
          Run a Hometax status check — is the business actually registered and
          active?
        </li>
        <li>
          Cross-reference the company name on the tax invoice with the Hometax
          registration certificate.
        </li>
      </ol>
      <p className="leading-relaxed">
        Steps 1 and 2 take less than ten seconds. Step 3 takes about a
        minute. Together they catch nearly every typo, fabrication, and
        misrepresentation before money moves.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        Wrap-up
      </h2>
      <p className="leading-relaxed">
        Korean business numbers carry their own verification built in — you
        just need to know the algorithm. For a one-second check, use the{" "}
        <Link
          href={`/${locale}/biznum-check`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          business number validator
        </Link>
        . For deeper context on Korean tax and accounting, see the{" "}
        <Link
          href={`/${locale}/income-tax`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          income tax calculator
        </Link>{" "}
        and{" "}
        <Link
          href={`/${locale}/vat-calc`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          VAT calculator
        </Link>
        .
      </p>
      <p className="text-sm text-[color:var(--color-text-tertiary)]">
        Algorithm is current as of the National Tax Service published spec.
        For active-business verification, always cross-check with Hometax.
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
          2026-05-30 · 약 6분
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          사업자등록번호 체크섬 — 거래 전 1초 검증법
        </h1>
      </header>

      <p className="leading-relaxed">
        3,000만원을 송금하기 직전입니다. 거래명세서에 10자리 사업자등록번호가
        적혀 있는데, 진짜일까요. 오타거나, 혹은 사기 시도로 만들어낸 가짜
        번호는 아닐까요. 다행히 10자리 안에 자체 검증 장치가 들어 있어서,
        전화 한 통 없이 1초 만에 확인할 수 있습니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        먼저 형식부터
      </h2>
      <p className="leading-relaxed">
        한국 사업자등록번호는 10자리, 일반적으로 두 개의 하이픈으로 구분됩니다.
      </p>
      <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 font-mono text-sm leading-relaxed">
        XXX - XX - XXXXX
        <br />
        <span className="text-xs text-[color:var(--color-text-tertiary)]">
          세 자리 — 두 자리 — 다섯 자리
        </span>
      </div>
      <p className="leading-relaxed">
        중간 두 자리는 사업자 종류 코드입니다. 마지막(10번째) 자리는 앞 9자리
        로부터 계산된 검증 자리입니다. 누가 임의로 번호를 지어내면, 마지막
        자리를 우연히 맞출 확률이 10분의 1.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        체크섬 알고리즘
      </h2>
      <p className="leading-relaxed">
        국세청이 공개한 알고리즘은 다음과 같습니다. 10자리를 d1, d2, ..., d10
        이라 두고:
      </p>
      <ol className="ml-1 list-decimal space-y-2 pl-5 leading-relaxed">
        <li>
          앞 9자리에 가중치 <strong>[1, 3, 7, 1, 3, 7, 1, 3, 5]</strong> 를
          곱해 합산
        </li>
        <li>
          (d9 × 5) 의 10의 자리 숫자를 더함 — 일부 구현이 빼먹는 보정 단계
        </li>
        <li>
          체크 디지트 = <strong>(10 − sum % 10) % 10</strong>
        </li>
        <li>체크 디지트 == d10 이면 통과</li>
      </ol>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        실제 계산: 123-45-67890
      </h2>
      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 font-mono text-xs leading-relaxed">
        d1..d9   : 1  2  3  4  5  6  7  8  9
        <br />
        weights  : 1  3  7  1  3  7  1  3  5
        <br />
        products : 1  6 21  4 15 42  7 24 45  → sum = 165
        <br />
        d9 × 5 = 45  → 10의 자리 = 4  → sum = 169
        <br />
        체크 디지트 = (10 − 169 % 10) % 10 = (10 − 9) % 10 = 1
        <br />
        d10 = 0  ≠  1  →  형식 오류
      </div>
      <p className="leading-relaxed">
        123-45-67890 은 통과 못 합니다. 마지막이 1이어야 하는데 0. 오타·임의
        조작이 정확히 이렇게 잡힙니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        가중치가 이렇게 정해진 이유
      </h2>
      <p className="leading-relaxed">
        1-3-5-7 패턴은 ISO 7064 변형으로 국세청이 1976년 채택했습니다. 효과:
      </p>
      <ul className="ml-1 list-disc space-y-1.5 pl-5 leading-relaxed text-sm">
        <li>한 자리 오타는 거의 100% 걸림</li>
        <li>인접한 두 자리 바꿔치기(예: d2↔d3) 도 거의 다 잡힘</li>
        <li>아무 10자리나 만들면 통과율 약 10% — 가짜는 90% 걸림</li>
      </ul>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        중간 두 자리 읽는 법
      </h2>
      <p className="leading-relaxed">
        4·5번째 자리는 사업자 종류 코드입니다. 체크섬에는 안 쓰이지만 거래
        상대방 형태를 한눈에 보여줍니다.
      </p>
      <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[color:var(--color-border-subtle)] text-[color:var(--color-text-tertiary)]">
              <th className="px-4 py-2 text-left font-medium">중간 두 자리</th>
              <th className="px-4 py-2 text-left font-medium">사업자 종류</th>
            </tr>
          </thead>
          <tbody className="tabular-nums">
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">01 ~ 79</td>
              <td className="px-4 py-2">개인사업자</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">80</td>
              <td className="px-4 py-2">다단계 판매 개인</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">81, 86, 87, 88</td>
              <td className="px-4 py-2">영리법인</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">82</td>
              <td className="px-4 py-2">비영리법인</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">83</td>
              <td className="px-4 py-2">국가·지방자치단체</td>
            </tr>
            <tr className="border-b border-[color:var(--color-border-subtle)]/50">
              <td className="px-4 py-2">84</td>
              <td className="px-4 py-2">외국법인</td>
            </tr>
            <tr>
              <td className="px-4 py-2">89</td>
              <td className="px-4 py-2">영리법인 본점</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        체크섬이 알려주지 않는 것
      </h2>
      <p className="leading-relaxed">
        통과 = 형식 유효일 뿐, 다음은 알 수 없습니다.
      </p>
      <ul className="ml-1 list-disc space-y-1.5 pl-5 leading-relaxed text-sm">
        <li>실제 등록된 사업자인지</li>
        <li>휴업·폐업 상태인지</li>
        <li>세금 체납 여부</li>
        <li>주소·대표자 변경 여부</li>
      </ul>
      <p className="leading-relaxed">
        실시간 등록 상태는 국세청 홈택스{" "}
        <a
          href="https://teht.hometax.go.kr/websquare/websquare.html?w2xPath=/ui/ab/a/a/UTEABAAA13.xml"
          target="_blank"
          rel="noopener noreferrer"
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          사업자등록상태 조회
        </a>{" "}
        에서 확인합니다 (공인인증서 불필요). 체크섬은 1차 필터, 홈택스가
        최종 판정.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        송금 전 실전 절차
      </h2>
      <ol className="ml-1 list-decimal space-y-2 pl-5 leading-relaxed">
        <li>
          <Link
            href={`/${locale}/biznum-check`}
            className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
          >
            사업자번호 검증기
          </Link>{" "}
          에 번호 입력 — 즉시 통과/실패
        </li>
        <li>
          중간 두 자리 확인 — 거래처가 알려준 사업자 형태와 일치하는가
          (예: '컨설팅 법인' 이라고 했는데 01번대면 의심)
        </li>
        <li>홈택스에서 등록 상태 조회 — 실제 활성 사업자인가</li>
        <li>거래명세서 회사명을 홈택스 등록 사항과 대조</li>
      </ol>
      <p className="leading-relaxed">
        1·2번은 10초도 안 걸립니다. 3번도 1분 내. 합해서 1분 30초면 오타·
        가짜·허위 표시 거의 전부 송금 전에 잡습니다.
      </p>

      <h2 className="pt-2 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
        마무리
      </h2>
      <p className="leading-relaxed">
        사업자등록번호는 자체 검증 장치가 들어 있어 알고리즘만 알면 1초
        검증이 가능합니다. 빠른 검증은{" "}
        <Link
          href={`/${locale}/biznum-check`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          사업자번호 검증기
        </Link>
        에서. 함께 보면 좋은 도구는{" "}
        <Link
          href={`/${locale}/income-tax`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          종합소득세 계산기
        </Link>{" "}
        와{" "}
        <Link
          href={`/${locale}/vat-calc`}
          className="text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
        >
          부가세 계산기
        </Link>
        입니다.
      </p>
      <p className="text-sm text-[color:var(--color-text-tertiary)]">
        알고리즘은 국세청 공개 사양 기준. 실제 영업 상태는 항상 홈택스로
        교차 확인하세요.
      </p>
      <PostTags tags={findPost(SLUG)!.tags.ko} isKo={true} />
    </article>
  );
}
