/* eslint-disable react/no-unescaped-entities */
import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { locales } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { findPost } from "@/lib/blogPosts";
import PostTags from "@/components/ui/PostTags";

const SLUG = "essential-apps-korea-foreigners";

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
          "한국 외국인 필수 앱",
          "외국인 카카오톡 가입",
          "한국 본인인증 외국인",
          "외국인 토스 가입",
          "외국인 배민 외국카드",
        ]
      : [
          "essential apps korea foreigners",
          "best apps for living in korea",
          "kakaotalk foreign number",
          "korea apps without ARC",
          "korean identity verification foreigner",
          "toss app foreigner",
          "baemin foreign card",
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
        {isKo ? <ContentKo locale={locale} /> : <ContentEn locale={locale} />}
      </div>
    </main>
  );
}

/** ARC 전에 바로 되는 앱 vs ARC/한국번호 필요한 앱 — 글의 핵심 표 */
function VerificationTable({ isKo }: { isKo: boolean }): React.ReactElement {
  const rows: Array<{ app: string; before: "yes" | "partial" | "no"; note: string; noteEn: string }> = [
    { app: "KakaoTalk", before: "yes", note: "외국 번호로 가입 OK (KakaoPay만 한국번호+ARC)", noteEn: "Sign up with a foreign number (only KakaoPay needs Korean number + ARC)" },
    { app: "Naver Map · Subway Korea", before: "yes", note: "가입 없이 사용", noteEn: "No sign-up needed" },
    { app: "Papago", before: "yes", note: "가입 없이 사용", noteEn: "No sign-up needed" },
    { app: "Toss", before: "partial", note: "여권으로 가입 가능, 송금 등 full 기능은 ARC+한국폰", noteEn: "Sign up with passport; full features need ARC + Korean phone" },
    { app: "Uber (UT)", before: "yes", note: "외국 카드 자동결제 OK", noteEn: "Foreign-card auto-pay works" },
    { app: "Shuttle (배달)", before: "yes", note: "번호·계좌 불필요, PayPal·외국카드", noteEn: "No number/account; PayPal & foreign cards" },
    { app: "Baemin (배민)", before: "no", note: "통상 한국 인증 필요 (2026.2~ 외국카드·영어 지원)", noteEn: "Usually needs Korean verification (foreign cards & English since Feb 2026)" },
    { app: "Toss뱅크 · KakaoPay · 당근페이", before: "no", note: "본인명의 한국폰 + ARC 필요", noteEn: "Need Korean phone in your name + ARC" },
    { app: "정부24 · 홈택스", before: "no", note: "한국폰 인증 또는 기관 방문", noteEn: "Korean-phone verification or in-person" },
  ];
  const badge = {
    yes: { ko: "✅ ARC 전 OK", en: "✅ before ARC", cls: "text-emerald-300" },
    partial: { ko: "⚠️ 일부", en: "⚠️ partial", cls: "text-amber-300" },
    no: { ko: "❌ ARC 필요", en: "❌ needs ARC", cls: "text-rose-300" },
  };
  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
      <table className="w-full text-sm">
        <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          <tr>
            <th className="px-4 py-2 text-left font-medium">{isKo ? "앱" : "App"}</th>
            <th className="px-4 py-2 text-left font-medium">{isKo ? "ARC 전 사용" : "Before ARC"}</th>
            <th className="px-4 py-2 text-left font-medium">{isKo ? "메모" : "Note"}</th>
          </tr>
        </thead>
        <tbody className="text-[color:var(--color-text-secondary)]">
          {rows.map((r) => (
            <tr key={r.app} className="border-t border-[color:var(--color-border-subtle)] align-top">
              <td className="px-4 py-2 font-medium text-[color:var(--color-text-primary)]">{r.app}</td>
              <td className={`px-4 py-2 whitespace-nowrap ${badge[r.before].cls}`}>
                {isKo ? badge[r.before].ko : badge[r.before].en}
              </td>
              <td className="px-4 py-2 text-xs leading-relaxed">{isKo ? r.note : r.noteEn}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RelatedTools({ locale, isKo }: { locale: string; isKo: boolean }): React.ReactElement {
  const tools = [
    { href: "/foreign-flat-tax", ko: "외국인 단일세율 vs 누진세", en: "Foreign Flat Tax" },
    { href: "/foreign-health-insurance", ko: "외국인 건강보험료", en: "Health Insurance (NHIS)" },
    { href: "/apartment-area", ko: "전용·공급면적 / 평당가", en: "Apartment Area & Price" },
    { href: "/f2-residence-visa", ko: "F-2-7 거주비자 자격", en: "F-2-7 Residence Visa" },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {tools.map((t) => (
        <Link
          key={t.href}
          href={`/${locale}${t.href}`}
          className="inline-flex items-center rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] px-3.5 py-1.5 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-indigo-300"
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
          Essential Apps for Living in Korea as a Foreigner
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          As of June 2026. App policies change — always confirm in-app before relying on them.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          On your first day in Korea you'll open Google Maps for directions — and find
          it barely works (Korea restricts exporting map data, so turn-by-turn is broken).
          That's your first clue: the challenge isn't the apps, it's getting <em>into</em> them.
          The real wall is Korea's identity-verification system. This guide shows which apps
          work right away, and which need your Alien Registration Card (ARC) first.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          The verification wall (read this first)
        </h2>
        <p>
          Most Korean services — banking, shopping, government, even some delivery —
          verify you against your mobile carrier's real-name records through the{" "}
          <strong>PASS app</strong> or 본인인증 (identity verification). The catch that traps
          newcomers:
        </p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            A <strong>prepaid SIM registered on your passport usually can't pass verification.</strong>{" "}
            You need a <strong>postpaid plan registered with your ARC.</strong> Until your ARC
            arrives (roughly a month), you're stuck in a "digital waiting room."
          </li>
          <li>
            Since <strong>January 2026 the ARC is the system of record</strong> — passport-only
            registration was dropped from several systems.
          </li>
          <li>
            Your name must match <strong>exactly</strong> across passport, carrier, and app —
            capitalization, spaces, hyphens, middle names. Mismatches are the #1 cause of failed
            verification. Use <strong>ALL CAPS, no spaces.</strong>
          </li>
        </ul>
        <p>So the practical question for every app is: <em>does it work before my ARC, or not?</em></p>
        <VerificationTable isKo={false} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Top 5 to install on day one
        </h2>
        <p>These work the moment you land, ARC or not:</p>
        <ol className="list-inside list-decimal space-y-1.5">
          <li><strong>KakaoTalk</strong> — sign up with your home-country number. 90% of communication in Korea.</li>
          <li><strong>Naver Map</strong> (+ <strong>Subway Korea</strong>) — Google Maps won't navigate; these are the English-friendly answer.</li>
          <li><strong>Papago</strong> — translate menus, signs, contracts. No sign-up.</li>
          <li><strong>Toss</strong> — the only finance app you can start with just a passport, in 10 languages.</li>
          <li><strong>Uber (UT)</strong> or <strong>Kakao T</strong> — for taxis; Uber is safer for foreign-card auto-pay, Kakao T is more universal.</li>
        </ol>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">Short-stay / no-ARC bonus: <strong>Shuttle</strong> — fully English food delivery with PayPal.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">By category</h2>
        <p>
          <strong>Messaging:</strong> KakaoTalk is non-negotiable. Basic chat works on a foreign number;
          only KakaoPay and domestic verification need a Korean number + ARC.
        </p>
        <p>
          <strong>Maps & transit:</strong> Naver Map has the best English and live bus/subway info
          ("which exit, which train car"). KakaoMap is great for finding restaurants. Subway Korea
          is a free, perfectly-translated subway-only app. Google Maps cannot do turn-by-turn here.
        </p>
        <p>
          <strong>Taxis:</strong> Kakao T dominates, but foreign-card auto-pay is inconsistent without
          a Korean number — if you don't have one, Uber (back via the SKT TMAP partnership) is the safer bet.
        </p>
        <p>
          <strong>Money:</strong> Toss is the most foreigner-friendly super-app (passport sign-up, 10 languages),
          though sending money needs your ARC and a Korean phone in your name. Toss Bank supports remote
          foreigner account opening.
        </p>
        <p>
          <strong>Sending money home:</strong> Wise (transparent mid-market rates) and SentBe (flat ₩2,500,
          strong for Southeast Asia). Note the <strong>annual ₩50,000,000 remittance limit</strong> for
          foreigners — above it you bring passport + ARC + proof of income to a designated bank.
        </p>
        <p>
          <strong>Delivery:</strong> The big news — as of <strong>February 2026 Baemin added English/Chinese/Japanese
          and foreign credit cards</strong>, and <strong>Apple Pay with overseas cards from June 2, 2026</strong>
          (a first for Korean delivery). The old "foreigners can't use Baemin" advice is outdated. With no ARC,
          <strong> Shuttle</strong> is the fully-English, PayPal option.
        </p>
        <p>
          <strong>Shopping:</strong> Coupang (English beta in settings; foreign cards now work, but without an ARC
          you face a ₩19,800 minimum and no Rocket Wow). 당근 (Karrot) for local second-hand — needs a Korean 010
          number to sign up.
        </p>
        <p>
          <strong>Admin:</strong> HiKorea (visa), Gov24, and Hometax (tax) are web-based with partial English —
          but complex forms revert to Korean and need phone verification or an in-person visit.
        </p>
      </section>

      <section className="space-y-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">Sign-up tips</h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>Register KakaoTalk on your <strong>home number first</strong>; add Korean verification later when you get a local number.</li>
          <li>Enter your name in <strong>ALL CAPS, watch spaces/hyphens</strong> — match your carrier registration exactly, or PASS will fail.</li>
          <li>A prepaid SIM ≠ identity verification. For real app access, get a <strong>postpaid plan with your ARC</strong> (foreigner-focused carrier shops have multilingual support).</li>
          <li>Install <strong>Toss with your passport before the ARC</strong>, then scan the ARC to unlock full features.</li>
          <li>Test foreign-card payments early with a small order or short ride — each app uses a different gateway.</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Where foreigners get stuck (and the fix)
        </h2>
        <ol className="list-inside list-decimal space-y-1.5">
          <li><strong>The verification wall</strong> — no ARC + postpaid phone means most apps won't register you.</li>
          <li><strong>Prepaid vs postpaid SIM</strong> — prepaid can't do PASS verification.</li>
          <li><strong>Name mismatch</strong> — one different space or middle name = endless verification failures.</li>
          <li><strong>Foreign cards are hit-or-miss</strong> — same app, conflicting reports; depends on ARC/Korean number.</li>
          <li><strong>Google Maps doesn't navigate</strong> — switch to Naver Map / Subway Korea.</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Once you're set up — sort out the money side
        </h2>
        <p>
          Apps get you through daily life; these free Workmate tools handle the numbers behind it —
          your tax, health insurance, rent, and visa:
        </p>
        <RelatedTools locale={locale} isKo={false} />
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
          한국 사는 외국인 필수 앱 — 본인인증 장벽부터 가입 팁까지
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          2026년 6월 기준. 앱 정책은 바뀌므로 가입 전 앱 내 최신 정책을 확인하세요.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          한국 첫날, 길 찾으려 구글 지도를 켜면 — 거의 안 됩니다(지도 데이터 반출 제한법으로
          턴바이턴 내비가 막힘). 이게 첫 신호입니다: 문제는 앱 자체가 아니라 <em>앱에 들어가는 것</em>이고,
          진짜 장벽은 한국식 본인인증 체계입니다. 이 글은 어떤 앱이 바로 되고, 어떤 앱이
          외국인등록증(ARC)부터 필요한지 정리합니다.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          본인인증 장벽 (먼저 읽으세요)
        </h2>
        <p>
          한국의 대부분 서비스 — 뱅킹·쇼핑·정부·일부 배달 — 는 통신사 실명 기록과 대조하는{" "}
          <strong>PASS 앱</strong> 또는 본인인증을 요구합니다. 신규 외국인이 가장 많이 막히는 함정:
        </p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <strong>여권으로 개통한 선불 USIM은 보통 본인인증이 안 됩니다.</strong>{" "}
            <strong>ARC로 등록한 후불 요금제</strong>라야 됩니다. ARC가 나오기 전(약 한 달)은
            "디지털 대기실"에 갇힙니다.
          </li>
          <li>
            <strong>2025년 1월부터 ARC가 기준(system of record)</strong> — 여권 단독 등록이 여러 시스템에서 폐지됐습니다.
          </li>
          <li>
            이름이 여권·통신사·앱에서 <strong>정확히 일치</strong>해야 합니다 — 대소문자·공백·하이픈·미들네임.
            불일치가 인증 실패 1위 원인. <strong>전부 대문자, 공백 없이</strong> 권장.
          </li>
        </ul>
        <p>그래서 모든 앱의 실질 질문은: <em>내 ARC 전에 되나, 안 되나?</em></p>
        <VerificationTable isKo={true} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          도착 첫날 깔아야 할 TOP 5
        </h2>
        <p>ARC 유무와 무관하게 바로 되는 순서:</p>
        <ol className="list-inside list-decimal space-y-1.5">
          <li><strong>카카오톡</strong> — 본국 번호로 가입. 한국 생활 소통의 90%.</li>
          <li><strong>네이버 지도</strong> (+ <strong>지하철 종결자/Subway Korea</strong>) — 구글 지도 내비 안 됨. 영어 친화 1순위.</li>
          <li><strong>파파고</strong> — 메뉴·표지판·계약서 번역. 가입 불필요.</li>
          <li><strong>토스</strong> — 여권만으로 시작 가능한 유일한 금융앱, 10개 언어.</li>
          <li><strong>Uber(UT)</strong> 또는 <strong>카카오 T</strong> — 택시. 외국 카드 자동결제는 Uber가 안전, 보편성은 카카오 T.</li>
        </ol>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">단기 방문·ARC 없는 경우 보너스: <strong>Shuttle</strong> — 완전 영어 배달 + PayPal.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">카테고리별</h2>
        <p><strong>메신저:</strong> 카카오톡은 필수. 기본 채팅은 외국 번호로 되고, 카카오페이·국내 본인인증만 한국 번호+ARC가 필요합니다.</p>
        <p><strong>지도·교통:</strong> 네이버 지도가 영어와 실시간 버스/지하철 정보(몇 번 출구·몇 번째 칸)가 가장 좋습니다. 카카오맵은 맛집 검색에 강하고, Subway Korea는 무료·완벽 번역의 지하철 전용 앱. 구글 지도는 한국에서 턴바이턴 내비가 안 됩니다.</p>
        <p><strong>택시:</strong> 카카오 T가 1위지만 한국 번호 없이는 외국 카드 자동결제가 들쭉날쭉 — 번호가 없으면 Uber(SKT TMAP 제휴로 재진입)가 안전합니다.</p>
        <p><strong>금융:</strong> 토스가 가장 외국인 친화적(여권 가입·10개 언어)이나, 송금 등은 ARC+본인명의 한국폰이 필요합니다. 토스뱅크는 비대면 외국인 계좌개설을 지원합니다.</p>
        <p><strong>본국 송금:</strong> Wise(투명한 중간환율)와 SentBe(정액 ₩2,500, 동남아 강점). 외국인 <strong>연 5천만원 송금 한도</strong>가 있고, 초과 시 여권+ARC+소득증명을 들고 지정은행에 갑니다.</p>
        <p><strong>배달:</strong> 큰 변화 — <strong>2026년 2월 배민이 영어·중국어·일본어 + 외국 신용카드</strong>를, <strong>6월 2일 해외카드 Apple Pay</strong>를(한국 배달앱 최초) 추가했습니다. "배민은 외국인이 못 쓴다"는 정보는 낡았습니다. ARC가 없으면 <strong>Shuttle</strong>(완전 영어·PayPal).</p>
        <p><strong>쇼핑:</strong> 쿠팡(설정에 영어 베타, 외국 카드 가능해졌으나 ARC 없으면 최소주문 ₩19,800·로켓와우 제외). 당근마켓은 동네 직거래용 — 가입에 한국 010 번호 필요.</p>
        <p><strong>행정:</strong> 하이코리아(비자)·정부24·홈택스(세금)는 웹 기반에 부분 영어 — 복잡한 양식은 한국어로 돌아가고 폰 인증·방문이 필요합니다.</p>
      </section>

      <section className="space-y-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">가입 꿀팁</h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>카카오톡은 <strong>본국 번호로 먼저 가입</strong>, 한국 번호 생기면 본인인증을 추가하세요.</li>
          <li>이름은 <strong>전부 대문자, 공백·하이픈 주의</strong> — 통신사 등록명과 100% 일치해야 PASS 통과.</li>
          <li>선불 USIM ≠ 본인인증. 진짜 앱을 쓰려면 <strong>ARC로 후불 요금제</strong>(외국인 전문 매장이 다국어 지원).</li>
          <li><strong>토스는 ARC 전 여권으로 미리 가입</strong> → ARC 나오면 스캔해 full 기능 전환.</li>
          <li>외국 카드 결제는 도착 초기에 소액 주문·짧은 라이드로 미리 테스트(앱마다 게이트웨이가 다름).</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          외국인이 자주 막히는 지점 (과 해법)
        </h2>
        <ol className="list-inside list-decimal space-y-1.5">
          <li><strong>본인인증 장벽</strong> — ARC + 후불폰이 없으면 대부분 앱 가입이 막힙니다.</li>
          <li><strong>선불 vs 후불 USIM</strong> — 선불은 PASS 인증이 안 됩니다.</li>
          <li><strong>이름 불일치</strong> — 공백 하나·미들네임 하나로 인증 무한 실패.</li>
          <li><strong>외국 카드 들쭉날쭉</strong> — 같은 앱도 정보가 충돌. ARC/한국번호 유무에 달림.</li>
          <li><strong>구글 지도 내비 안 됨</strong> — 네이버 지도/Subway Korea로 전환.</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          앱을 깔았다면 — 돈 문제도 정리하세요
        </h2>
        <p>
          앱이 일상을 해결한다면, 그 뒤의 숫자(세금·건강보험·집·비자)는 아래 무료 Workmate 도구가 처리합니다:
        </p>
        <RelatedTools locale={locale} isKo={true} />
      </section>
      <PostTags tags={findPost(SLUG)!.tags.ko} isKo={true} />
    </article>
  );
}
