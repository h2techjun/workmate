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

/** locale 값으로 4개 언어 중 하나 선택 (ko/zh/vi 외 locale 은 en fallback) */
function pickLang(
  locale: string,
  ko: string,
  en: string,
  zh: string,
  vi: string,
): string {
  if (locale === "ko") return ko;
  if (locale === "zh") return zh;
  if (locale === "vi") return vi;
  return en;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const post = findPost(SLUG)!;
  const title = pickLang(
    locale,
    post.titleKo,
    post.titleEn,
    post.titleZh,
    post.titleVi,
  );
  const description = pickLang(
    locale,
    post.summaryKo,
    post.summaryEn,
    post.summaryZh,
    post.summaryVi,
  );
  const keywords =
    locale === "ko"
      ? [
          "한국 외국인 필수 앱",
          "외국인 카카오톡 가입",
          "한국 본인인증 외국인",
          "외국인 토스 가입",
          "외국인 배민 외국카드",
        ]
      : locale === "zh"
        ? [
            "在韩外国人必备App",
            "外国人KakaoTalk注册",
            "韩国实名认证外国人",
            "外国人Toss护照注册",
            "外国人Baemin外国卡",
            "PASS认证外国人",
          ]
        : locale === "vi"
          ? [
              "ứng dụng thiết yếu Hàn Quốc người nước ngoài",
              "đăng ký KakaoTalk số nước ngoài",
              "xác thực danh tính người nước ngoài Hàn Quốc",
              "đăng ký Toss bằng hộ chiếu",
              "Baemin thẻ nước ngoài",
              "xác thực PASS Hàn Quốc",
            ]
          : [
              "essential apps korea foreigners",
              "best apps for living in korea",
              "kakaotalk foreign number",
              "korea apps without ARC",
              "korean identity verification foreigner",
              "toss app foreigner",
              "baemin foreign card",
            ];
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

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/blog`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {pickLang(
              locale,
              "현장 노트",
              "Field Notes",
              "实地笔记",
              "Ghi chép thực tế",
            )}
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

/** ARC 전에 바로 되는 앱 vs ARC/한국번호 필요한 앱 — 글의 핵심 표 */
function VerificationTable({ locale }: { locale: string }): React.ReactElement {
  const rows: Array<{
    app: string;
    before: "yes" | "partial" | "no";
    noteKo: string;
    noteEn: string;
    noteZh: string;
    noteVi: string;
  }> = [
    {
      app: "KakaoTalk",
      before: "yes",
      noteKo: "외국 번호로 가입 OK (KakaoPay만 한국번호+ARC)",
      noteEn: "Sign up with a foreign number (only KakaoPay needs Korean number + ARC)",
      noteZh: "可用外国号码注册(仅KakaoPay需韩国号码+ARC)",
      noteVi: "Đăng ký bằng số nước ngoài OK (chỉ KakaoPay cần số Hàn + ARC)",
    },
    {
      app: "Naver Map · Subway Korea",
      before: "yes",
      noteKo: "가입 없이 사용",
      noteEn: "No sign-up needed",
      noteZh: "无需注册即可使用",
      noteVi: "Dùng không cần đăng ký",
    },
    {
      app: "Papago",
      before: "yes",
      noteKo: "가입 없이 사용",
      noteEn: "No sign-up needed",
      noteZh: "无需注册即可使用",
      noteVi: "Dùng không cần đăng ký",
    },
    {
      app: "Toss",
      before: "partial",
      noteKo: "여권으로 가입 가능, 송금 등 full 기능은 ARC+한국폰",
      noteEn: "Sign up with passport; full features need ARC + Korean phone",
      noteZh: "可用护照注册,转账等完整功能需ARC+韩国手机",
      noteVi: "Đăng ký được bằng hộ chiếu; đầy đủ tính năng như chuyển tiền cần ARC + điện thoại Hàn",
    },
    {
      app: "Uber (UT)",
      before: "yes",
      noteKo: "외국 카드 자동결제 OK",
      noteEn: "Foreign-card auto-pay works",
      noteZh: "外国卡自动扣款可用",
      noteVi: "Tự động thanh toán bằng thẻ nước ngoài OK",
    },
    {
      app: "Shuttle (배달)",
      before: "yes",
      noteKo: "번호·계좌 불필요, PayPal·외국카드",
      noteEn: "No number/account; PayPal & foreign cards",
      noteZh: "无需号码·账户,支持PayPal·外国卡",
      noteVi: "Không cần số/tài khoản; dùng PayPal · thẻ nước ngoài",
    },
    {
      app: "Baemin (배민)",
      before: "no",
      noteKo: "통상 한국 인증 필요 (2026.2~ 외국카드·영어 지원)",
      noteEn: "Usually needs Korean verification (foreign cards & English since Feb 2026)",
      noteZh: "通常需韩国认证(2026年2月起支持外国卡·英文)",
      noteVi: "Thường cần xác thực Hàn Quốc (hỗ trợ thẻ nước ngoài · tiếng Anh từ tháng 2/2026)",
    },
    {
      app: "Toss뱅크 · KakaoPay · 당근페이",
      before: "no",
      noteKo: "본인명의 한국폰 + ARC 필요",
      noteEn: "Need Korean phone in your name + ARC",
      noteZh: "需本人名下韩国手机 + ARC",
      noteVi: "Cần điện thoại Hàn đứng tên bạn + ARC",
    },
    {
      app: "정부24 · 홈택스",
      before: "no",
      noteKo: "한국폰 인증 또는 기관 방문",
      noteEn: "Korean-phone verification or in-person",
      noteZh: "需韩国手机认证或亲自到机构办理",
      noteVi: "Xác thực bằng điện thoại Hàn hoặc đến tận nơi",
    },
  ];
  const badge = {
    yes: { ko: "✅ ARC 전 OK", en: "✅ before ARC", zh: "✅ ARC 前可用", vi: "✅ dùng trước ARC", cls: "text-emerald-300" },
    partial: { ko: "⚠️ 일부", en: "⚠️ partial", zh: "⚠️ 部分", vi: "⚠️ một phần", cls: "text-amber-300" },
    no: { ko: "❌ ARC 필요", en: "❌ needs ARC", zh: "❌ 需要ARC", vi: "❌ cần ARC", cls: "text-rose-300" },
  };
  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
      <table className="w-full text-sm">
        <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
          <tr>
            <th className="px-4 py-2 text-left font-medium">{pickLang(locale, "앱", "App", "应用", "Ứng dụng")}</th>
            <th className="px-4 py-2 text-left font-medium">{pickLang(locale, "ARC 전 사용", "Before ARC", "ARC 前使用", "Dùng trước ARC")}</th>
            <th className="px-4 py-2 text-left font-medium">{pickLang(locale, "메모", "Note", "备注", "Ghi chú")}</th>
          </tr>
        </thead>
        <tbody className="text-[color:var(--color-text-secondary)]">
          {rows.map((r) => (
            <tr key={r.app} className="border-t border-[color:var(--color-border-subtle)] align-top">
              <td className="px-4 py-2 font-medium text-[color:var(--color-text-primary)]">{r.app}</td>
              <td className={`px-4 py-2 whitespace-nowrap ${badge[r.before].cls}`}>
                {pickLang(locale, badge[r.before].ko, badge[r.before].en, badge[r.before].zh, badge[r.before].vi)}
              </td>
              <td className="px-4 py-2 text-xs leading-relaxed">{pickLang(locale, r.noteKo, r.noteEn, r.noteZh, r.noteVi)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RelatedTools({ locale }: { locale: string }): React.ReactElement {
  const tools = [
    { href: "/foreign-flat-tax", ko: "외국인 단일세율 vs 누진세", en: "Foreign Flat Tax", zh: "外国人单一税率 vs 累进税", vi: "Thuế suất cố định vs lũy tiến cho người nước ngoài" },
    { href: "/foreign-health-insurance", ko: "외국인 건강보험료", en: "Health Insurance (NHIS)", zh: "外国人健康保险费", vi: "Phí bảo hiểm y tế cho người nước ngoài" },
    { href: "/apartment-area", ko: "전용·공급면적 / 평당가", en: "Apartment Area & Price", zh: "专用·供给面积 / 每坪价", vi: "Diện tích sử dụng riêng · cung cấp / giá mỗi pyeong" },
    { href: "/f2-residence-visa", ko: "F-2-7 거주비자 자격", en: "F-2-7 Residence Visa", zh: "F-2-7 居住签证资格", vi: "Điều kiện visa cư trú F-2-7" },
  ];
  return (
    <div className="flex flex-wrap gap-2">
      {tools.map((t) => (
        <Link
          key={t.href}
          href={`/${locale}${t.href}`}
          className="inline-flex items-center rounded-full border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] px-3.5 py-1.5 text-sm text-[color:var(--color-text-secondary)] transition-colors hover:border-indigo-500/40 hover:bg-indigo-500/5 hover:text-indigo-300"
        >
          {pickLang(locale, t.ko, t.en, t.zh, t.vi)}
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
        <VerificationTable locale={locale} />
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
        <RelatedTools locale={locale} />
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
        <VerificationTable locale={locale} />
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
        <RelatedTools locale={locale} />
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
          韩国生活·外国人
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
          在韩国生活的外国人必备App——从实名认证门槛到注册技巧
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          截至2026年6月。App政策会变动，注册前请在App内确认最新政策。
        </p>
      </header>

      <section className="space-y-4">
        <p>
          抵韩第一天，你打开Google地图想找路——却发现几乎用不了(韩国限制地图数据外传，逐步导航被封锁)。这就是第一个信号：问题不在App本身，而在于<em>如何进入这些App</em>，真正的门槛是韩国式实名认证体系。本文梳理哪些App能立刻使用，哪些必须先有外国人登录证(ARC)。
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          实名认证门槛(请先阅读)
        </h2>
        <p>
          韩国大多数服务——银行、购物、政府、部分外卖——都要求通过<strong>PASS App</strong>或实名认证来核对运营商的实名记录。新来的外国人最常被卡住的陷阱：
        </p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <strong>用护照开通的预付费USIM通常无法通过实名认证。</strong>必须是<strong>用ARC登记的后付费套餐</strong>才行。在ARC下发之前(约一个月)，你会被困在"数字候机室"里。
          </li>
          <li>
            <strong>自2025年1月起，ARC成为认证基准(system of record)</strong>——仅凭护照的登记方式已在多个系统中被取消。
          </li>
          <li>
            姓名在护照、运营商、App上必须<strong>完全一致</strong>——包括大小写、空格、连字符、中间名。不一致是认证失败的头号原因。建议<strong>全部大写、不留空格</strong>。
          </li>
        </ul>
        <p>所以每个App的实际问题都是：<em>在我拿到ARC之前，它能不能用？</em></p>
        <VerificationTable locale={locale} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          抵达第一天就该装的TOP 5
        </h2>
        <p>无论有没有ARC都能立刻使用，按顺序：</p>
        <ol className="list-inside list-decimal space-y-1.5">
          <li><strong>KakaoTalk</strong>——用本国号码注册。韩国生活90%的沟通都靠它。</li>
          <li><strong>Naver地图</strong>(+ <strong>Subway Korea 地铁神器</strong>)——Google地图无法导航。对英语最友好的首选。</li>
          <li><strong>Papago</strong>——翻译菜单、标识、合同。无需注册。</li>
          <li><strong>Toss</strong>——唯一能仅凭护照就开始使用的金融App，支持10种语言。</li>
          <li><strong>Uber(UT)</strong>或<strong>Kakao T</strong>——打车。外国卡自动扣款用Uber更稳，普及度则是Kakao T更高。</li>
        </ol>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">短期访问、没有ARC时的加分项：<strong>Shuttle</strong>——全英文外卖 + PayPal。</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">分类别看</h2>
        <p><strong>即时通讯：</strong> KakaoTalk是必装。基本聊天用外国号码就行，只有KakaoPay和国内实名认证才需要韩国号码+ARC。</p>
        <p><strong>地图、交通：</strong> Naver地图的英文和实时公交/地铁信息(几号出口、第几节车厢)最好。KakaoMap擅长找餐厅，Subway Korea则是免费、翻译完善的地铁专用App。Google地图在韩国无法逐步导航。</p>
        <p><strong>打车：</strong> Kakao T排第一，但没有韩国号码时外国卡自动扣款时好时坏——没有号码的话，Uber(通过SKT TMAP合作重返韩国)更稳妥。</p>
        <p><strong>金融：</strong> Toss对外国人最友好(护照注册、10种语言)，但转账等功能需要ARC+本人名下的韩国手机。Toss Bank支持非面对面的外国人开户。</p>
        <p><strong>汇款回国：</strong> Wise(透明的中间汇率)和SentBe(固定₩2,500，东南亚方向有优势)。外国人有<strong>每年5000万韩元的汇款限额</strong>，超过则需带上护照+ARC+收入证明前往指定银行。</p>
        <p><strong>外卖：</strong> 重大变化——<strong>2026年2月Baemin新增了英语、中文、日语 + 外国信用卡</strong>，并于<strong>6月2日支持海外卡Apple Pay</strong>(韩国外卖App首例)。"外国人用不了Baemin"这种说法已经过时。没有ARC的话就用<strong>Shuttle</strong>(全英文、PayPal)。</p>
        <p><strong>购物：</strong> Coupang(设置里有英文测试版，外国卡现在可用，但没有ARC则最低下单额₩19,800、且不能用Rocket Wow火箭会员)。Karrot(당근마켓)用于同城二手直接交易——注册需要韩国010号码。</p>
        <p><strong>行政：</strong> HiKorea(签证)、Gov24、Hometax(税务)是网页版，部分支持英文——复杂表单会切回韩语，需要手机认证或亲自到场。</p>
      </section>

      <section className="space-y-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">注册小贴士</h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>KakaoTalk<strong>先用本国号码注册</strong>，等有了韩国号码再补上实名认证。</li>
          <li>姓名要<strong>全部大写，注意空格、连字符</strong>——必须和运营商登记名100%一致，PASS才能通过。</li>
          <li>预付费USIM ≠ 实名认证。要真正用上各种App，就得<strong>用ARC办后付费套餐</strong>(外国人专门门店提供多语言服务)。</li>
          <li><strong>Toss在拿到ARC前先用护照注册</strong> → ARC下发后扫描它即可解锁全部功能。</li>
          <li>外国卡支付要在刚到韩国时用小额订单、短途打车提前测试(每个App的支付网关都不同)。</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          外国人最常卡住的地方(及解决办法)
        </h2>
        <ol className="list-inside list-decimal space-y-1.5">
          <li><strong>实名认证门槛</strong>——没有ARC + 后付费手机，大多数App都无法注册。</li>
          <li><strong>预付费 vs 后付费USIM</strong>——预付费无法通过PASS认证。</li>
          <li><strong>姓名不一致</strong>——一个空格、一个中间名就会导致认证反复失败。</li>
          <li><strong>外国卡时灵时不灵</strong>——同一个App的说法都相互矛盾，取决于有没有ARC/韩国号码。</li>
          <li><strong>Google地图无法导航</strong>——改用Naver地图/Subway Korea。</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          装好App之后——把钱的事也理清楚
        </h2>
        <p>
          如果说App解决的是日常生活，那么背后的数字(税务、健康保险、住房、签证)就交给下面这些免费的Workmate工具：
        </p>
        <RelatedTools locale={locale} />
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
          Ứng dụng thiết yếu cho người nước ngoài sống tại Hàn Quốc — từ rào cản xác thực danh tính đến mẹo đăng ký
        </h1>
        <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
          Tính đến tháng 6 năm 2026. Chính sách ứng dụng có thể thay đổi, hãy kiểm tra chính sách mới nhất ngay trong ứng dụng trước khi đăng ký.
        </p>
      </header>

      <section className="space-y-4">
        <p>
          Ngày đầu tiên ở Hàn Quốc, bạn mở Google Maps để tìm đường — và thấy nó gần như không dùng được (Hàn Quốc hạn chế xuất dữ liệu bản đồ nên chỉ đường từng chặng bị chặn). Đó là dấu hiệu đầu tiên: vấn đề không nằm ở bản thân ứng dụng, mà ở <em>việc vào được ứng dụng</em>, và rào cản thực sự là hệ thống xác thực danh tính kiểu Hàn Quốc. Bài viết này tổng hợp ứng dụng nào dùng được ngay, và ứng dụng nào bắt buộc phải có thẻ đăng ký người nước ngoài (ARC) trước.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Rào cản xác thực danh tính (hãy đọc phần này trước)
        </h2>
        <p>
          Phần lớn dịch vụ ở Hàn Quốc — ngân hàng, mua sắm, hành chính, thậm chí một số dịch vụ giao đồ ăn — đều yêu cầu <strong>ứng dụng PASS</strong> hoặc xác thực danh tính để đối chiếu với hồ sơ tên thật tại nhà mạng. Cạm bẫy mà người nước ngoài mới đến hay mắc nhất:
        </p>
        <ul className="list-inside list-disc space-y-1.5">
          <li>
            <strong>USIM trả trước đăng ký bằng hộ chiếu thường không qua được xác thực danh tính.</strong> Bạn cần <strong>gói cước trả sau đăng ký bằng ARC</strong> mới được. Cho đến khi ARC được cấp (khoảng một tháng), bạn bị mắc kẹt trong "phòng chờ kỹ thuật số".
          </li>
          <li>
            <strong>Từ tháng 1 năm 2025, ARC trở thành căn cứ chuẩn (system of record)</strong> — việc chỉ đăng ký bằng hộ chiếu đã bị bỏ ở nhiều hệ thống.
          </li>
          <li>
            Tên của bạn phải <strong>trùng khớp chính xác</strong> trên hộ chiếu, nhà mạng và ứng dụng — chữ hoa/thường, dấu cách, dấu gạch nối, tên đệm. Sai lệch là nguyên nhân số 1 khiến xác thực thất bại. Nên dùng <strong>toàn bộ chữ IN HOA, không có dấu cách</strong>.
          </li>
        </ul>
        <p>Vì vậy câu hỏi thực tế cho mọi ứng dụng là: <em>nó có dùng được trước khi tôi có ARC không?</em></p>
        <VerificationTable locale={locale} />
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          TOP 5 nên cài ngay ngày đầu tiên
        </h2>
        <p>Dùng được ngay bất kể có ARC hay không, theo thứ tự:</p>
        <ol className="list-inside list-decimal space-y-1.5">
          <li><strong>KakaoTalk</strong> — đăng ký bằng số điện thoại nước bạn. 90% giao tiếp trong đời sống ở Hàn Quốc.</li>
          <li><strong>Naver Map</strong> (+ <strong>Subway Korea</strong>) — Google Maps không chỉ đường được. Lựa chọn thân thiện với tiếng Anh số một.</li>
          <li><strong>Papago</strong> — dịch thực đơn, biển báo, hợp đồng. Không cần đăng ký.</li>
          <li><strong>Toss</strong> — ứng dụng tài chính duy nhất có thể bắt đầu chỉ với hộ chiếu, hỗ trợ 10 ngôn ngữ.</li>
          <li><strong>Uber (UT)</strong> hoặc <strong>Kakao T</strong> — gọi taxi. Tự động thanh toán bằng thẻ nước ngoài thì Uber an toàn hơn, còn độ phổ biến thì Kakao T hơn.</li>
        </ol>
        <p className="text-sm text-[color:var(--color-text-tertiary)]">Điểm cộng cho chuyến đi ngắn ngày, chưa có ARC: <strong>Shuttle</strong> — giao đồ ăn hoàn toàn bằng tiếng Anh + PayPal.</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">Theo từng nhóm</h2>
        <p><strong>Nhắn tin:</strong> KakaoTalk là bắt buộc. Trò chuyện cơ bản dùng được với số nước ngoài; chỉ KakaoPay và xác thực danh tính trong nước mới cần số Hàn Quốc + ARC.</p>
        <p><strong>Bản đồ & giao thông:</strong> Naver Map có tiếng Anh và thông tin xe buýt/tàu điện ngầm theo thời gian thực (cửa ra số mấy, toa tàu thứ mấy) tốt nhất. KakaoMap mạnh về tìm quán ăn, còn Subway Korea là ứng dụng chuyên tàu điện ngầm miễn phí và dịch hoàn hảo. Google Maps không chỉ đường từng chặng được ở Hàn Quốc.</p>
        <p><strong>Taxi:</strong> Kakao T đứng số một, nhưng nếu không có số Hàn Quốc thì tự động thanh toán bằng thẻ nước ngoài lúc được lúc không — không có số thì Uber (quay lại nhờ hợp tác với SKT TMAP) là lựa chọn an toàn hơn.</p>
        <p><strong>Tài chính:</strong> Toss thân thiện với người nước ngoài nhất (đăng ký bằng hộ chiếu, 10 ngôn ngữ), nhưng chuyển tiền thì cần ARC + số điện thoại Hàn Quốc đứng tên bạn. Toss Bank hỗ trợ mở tài khoản cho người nước ngoài từ xa.</p>
        <p><strong>Gửi tiền về nước:</strong> Wise (tỷ giá trung bình minh bạch) và SentBe (phí cố định ₩2,500, mạnh ở khu vực Đông Nam Á). Người nước ngoài có <strong>hạn mức chuyển tiền 50 triệu won mỗi năm</strong>, vượt hạn mức thì mang hộ chiếu + ARC + chứng minh thu nhập đến ngân hàng chỉ định.</p>
        <p><strong>Giao đồ ăn:</strong> Thay đổi lớn — <strong>tháng 2 năm 2026, Baemin đã thêm tiếng Anh, tiếng Trung, tiếng Nhật + thẻ tín dụng nước ngoài</strong>, và <strong>Apple Pay với thẻ nước ngoài từ ngày 2 tháng 6</strong> (lần đầu tiên với ứng dụng giao đồ ăn Hàn Quốc). Câu nói "người nước ngoài không dùng được Baemin" đã lỗi thời. Nếu chưa có ARC thì dùng <strong>Shuttle</strong> (hoàn toàn tiếng Anh, PayPal).</p>
        <p><strong>Mua sắm:</strong> Coupang (có bản beta tiếng Anh trong phần cài đặt; thẻ nước ngoài giờ đã dùng được, nhưng không có ARC thì đơn tối thiểu ₩19,800 và không có Rocket Wow). Karrot (당근마켓) để mua bán đồ cũ trong khu vực — cần số 010 của Hàn Quốc để đăng ký.</p>
        <p><strong>Hành chính:</strong> HiKorea (visa), Gov24 và Hometax (thuế) là các dịch vụ trên nền web có một phần tiếng Anh — nhưng các biểu mẫu phức tạp sẽ quay về tiếng Hàn và cần xác thực bằng điện thoại hoặc đến tận nơi.</p>
      </section>

      <section className="space-y-3 rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-5">
        <h2 className="text-xl font-semibold text-[color:var(--color-text-primary)]">Mẹo đăng ký</h2>
        <ul className="list-inside list-disc space-y-1.5 text-sm">
          <li>Đăng ký KakaoTalk <strong>bằng số điện thoại nước bạn trước</strong>, khi có số Hàn Quốc thì bổ sung xác thực danh tính sau.</li>
          <li>Nhập tên <strong>toàn bộ chữ IN HOA, để ý dấu cách/gạch nối</strong> — phải khớp 100% với tên đăng ký ở nhà mạng thì PASS mới qua.</li>
          <li>USIM trả trước ≠ xác thực danh tính. Muốn thực sự dùng được ứng dụng, hãy <strong>đăng ký gói cước trả sau bằng ARC</strong> (các cửa hàng chuyên phục vụ người nước ngoài có hỗ trợ đa ngôn ngữ).</li>
          <li><strong>Cài Toss bằng hộ chiếu trước khi có ARC</strong> → khi ARC được cấp thì quét nó để mở khóa toàn bộ tính năng.</li>
          <li>Hãy thử thanh toán bằng thẻ nước ngoài sớm bằng một đơn hàng nhỏ hoặc chuyến xe ngắn (mỗi ứng dụng dùng một cổng thanh toán khác nhau).</li>
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Những chỗ người nước ngoài hay mắc kẹt (và cách xử lý)
        </h2>
        <ol className="list-inside list-decimal space-y-1.5">
          <li><strong>Rào cản xác thực danh tính</strong> — không có ARC + điện thoại trả sau thì hầu hết ứng dụng không cho đăng ký.</li>
          <li><strong>USIM trả trước vs trả sau</strong> — trả trước không qua được xác thực PASS.</li>
          <li><strong>Tên không khớp</strong> — chỉ một dấu cách hay một tên đệm cũng khiến xác thực thất bại liên tục.</li>
          <li><strong>Thẻ nước ngoài lúc được lúc không</strong> — cùng một ứng dụng mà thông tin lại mâu thuẫn; tùy vào việc có ARC/số Hàn Quốc hay không.</li>
          <li><strong>Google Maps không chỉ đường được</strong> — chuyển sang Naver Map/Subway Korea.</li>
        </ol>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
          Khi đã cài xong ứng dụng — hãy giải quyết luôn chuyện tiền bạc
        </h2>
        <p>
          Ứng dụng lo cho cuộc sống hằng ngày, còn những con số phía sau (thuế, bảo hiểm y tế, nhà ở, visa) thì các công cụ Workmate miễn phí dưới đây sẽ xử lý:
        </p>
        <RelatedTools locale={locale} />
      </section>
      <PostTags tags={findPost(SLUG)!.tags.vi} isKo={false} />
    </article>
  );
}
