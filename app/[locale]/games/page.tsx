import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL, SITE_BRAND } from "@/lib/siteConfig";
import { ProjectsTabs } from "@/components/projects/ProjectsTabs";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

interface PageProps {
  params: Promise<{ locale: string }>;
}

function localeKeyOf(locale: string): Locale {
  if (locale === "ko") return "ko";
  if (locale === "zh") return "zh";
  if (locale === "vi") return "vi";
  return "en";
}

/** 한글 타자 랜딩 유도 문구 (내부링크 — 게임 허브 → /korean-typing) */
const TYPING_CTA: Record<Locale, string> = {
  ko: "한글 타자 연습 해보기",
  en: "Try Korean typing practice",
  zh: "试试韩语打字练习",
  vi: "Thử luyện gõ tiếng Hàn",
};

/** 가로세로 낱말퀴즈 랜딩 유도 문구 (내부링크 — 게임 허브 → /korean-crossword) */
const CROSSWORD_CTA: Record<Locale, string> = {
  ko: "가로세로 낱말퀴즈 풀기",
  en: "Play Korean crossword",
  zh: "玩韩语填字游戏",
  vi: "Chơi ô chữ tiếng Hàn",
};

const COPY = {
  ko: {
    metaTitle: `무료 웹게임 모음 — ${SITE_BRAND}`,
    metaDesc:
      "회원가입·결제·설치 없이 브라우저에서 바로 즐기는 무료 게임 모음입니다. 한국형 화투 로그라이크 K-Poker, 무협 타워디펜스 해원문, 6시간 분량 정치 스릴러 텍스트 어드벤처까지, 직접 만든 작품만 한곳에 모았습니다.",
    keywords: [
      "무료 게임",
      "웹게임",
      "한국 인디 게임",
      "화투 게임",
      "화투 로그라이크",
      "K-Poker",
      "타워디펜스",
      "텍스트 어드벤처",
      "인터랙티브 픽션",
      "정치 스릴러",
      "한글 타자",
      "타자 연습",
      "타자 게임",
      "십자말풀이",
      "낱말퀴즈",
      "가로세로 낱말퀴즈",
    ],
    eyebrow: "무료 게임",
    h1: "브라우저에서 바로 플레이",
    subtitle:
      "회원가입·결제·설치 없이 클릭 한 번. 한국형 화투 로그라이크, 무협 타워디펜스, 6시간 정치 텍스트 어드벤처까지.",
    section2Heading: "직접 만든 게임과 이야기",
    section2Para:
      "여기 있는 게임과 인터랙티브 스토리는 모두 Workmate를 만든 사람이 직접 개발해 운영하는 프로젝트입니다. 외부 광고용 임베드가 아니라, 같은 제작자가 만든 작품들을 한곳에 모았습니다.",
    list: [
      "게임 — 한국형 화투 로그라이크(K-Poker), 무협 타워디펜스. 브라우저에서 설치 없이 바로 플레이.",
      "인터랙티브 스토리 — 6시간 정치 스릴러 텍스트 어드벤처 등 선택지로 전개되는 서사형 작품.",
      "전부 무료·무가입. 모바일에서도 동작하며, 결제나 앱 설치가 필요 없습니다.",
    ],
  },
  en: {
    metaTitle: `Free Browser Games — ${SITE_BRAND}`,
    metaDesc:
      "Free browser games — no signup, no install. Korean hwatu roguelike, martial-arts tower defense, 6-hour political text adventure.",
    keywords: [
      "free browser games",
      "Korean indie games",
      "hwatu roguelike",
      "tower defense",
      "text adventure",
      "interactive fiction",
      "korean typing practice",
      "hangul typing",
      "korean crossword",
      "korean word puzzle",
    ],
    eyebrow: "Free Games",
    h1: "Play Instantly in Browser",
    subtitle:
      "One click and you're in — no signup, no install. Korean hwatu roguelike, martial-arts tower defense, and a 6-hour political text adventure.",
    section2Heading: "Built in-house, not embedded",
    section2Para:
      "Every game and interactive story here is built and operated by the same person who makes Workmate. These are not third-party ad embeds — they are the maker's own projects gathered in one place.",
    list: [
      "Games — a Korean hwatu (flower-card) roguelike (K-Poker) and a martial-arts tower defense, playable instantly in the browser.",
      "Interactive stories — a 6-hour political-thriller text adventure and other choice-driven narrative pieces.",
      "All free, no signup. They run on mobile, with no payment or app install.",
    ],
  },
  zh: {
    metaTitle: `免费网页游戏合集 — ${SITE_BRAND}`,
    metaDesc:
      "无需注册、付费或安装,打开浏览器即可畅玩的免费游戏合集。韩式花斗Rogue-like「K-Poker」、武侠塔防「海源门」,以及时长6小时的政治惊悚文字冒险,全部是同一位开发者亲自制作并运营的原创作品，移动端同样流畅运行。",
    keywords: [
      "免费游戏",
      "网页游戏",
      "韩国独立游戏",
      "花斗游戏",
      "花斗Rogue-like",
      "K-Poker",
      "塔防游戏",
      "文字冒险",
      "互动小说",
      "政治惊悚",
      "韩语打字",
      "打字练习",
      "韩语填字",
      "纵横字谜",
    ],
    eyebrow: "免费游戏",
    h1: "浏览器直接畅玩",
    subtitle:
      "点击一下即可开始，无需注册、无需安装。韩式花斗Rogue-like、武侠塔防，还有6小时政治文字冒险。",
    section2Heading: "亲手打造的游戏与故事",
    section2Para:
      "这里的游戏与互动故事，全部由Workmate的开发者亲自制作并运营。并非第三方广告嵌入，而是同一位创作者作品的集中展示。",
    list: [
      "游戏 — 韩式花斗(花牌)Rogue-like「K-Poker」、武侠塔防，浏览器无需安装即可畅玩。",
      "互动故事 — 6小时政治惊悚文字冒险等由选项推动剧情的叙事作品。",
      "全部免费、无需注册。支持手机端运行，无需付费或安装应用。",
    ],
  },
  vi: {
    metaTitle: `Bộ sưu tập game trình duyệt miễn phí — ${SITE_BRAND}`,
    metaDesc:
      "Game miễn phí chơi ngay trên trình duyệt — không cần đăng ký, không cần cài đặt. Hwatu roguelike kiểu Hàn K-Poker, tháp phòng thủ võ hiệp, phiêu lưu chữ chính trị 6 giờ.",
    keywords: [
      "game miễn phí",
      "game trình duyệt",
      "game indie Hàn Quốc",
      "game hwatu",
      "hwatu roguelike",
      "tháp phòng thủ",
      "phiêu lưu chữ",
      "tiểu thuyết tương tác",
      "gõ tiếng Hàn",
      "luyện gõ tiếng Hàn",
      "ô chữ tiếng Hàn",
      "giải ô chữ",
    ],
    eyebrow: "Game miễn phí",
    h1: "Chơi ngay trên trình duyệt",
    subtitle:
      "Chỉ cần một cú nhấp — không đăng ký, không cài đặt. Hwatu roguelike kiểu Hàn, tháp phòng thủ võ hiệp, và phiêu lưu chữ chính trị 6 giờ.",
    section2Heading: "Game và câu chuyện tự phát triển",
    section2Para:
      "Mọi game và câu chuyện tương tác ở đây đều do chính người tạo ra Workmate phát triển và vận hành. Đây không phải là nhúng quảng cáo bên thứ ba — mà là các dự án của cùng một người sáng tạo được tập hợp tại một nơi.",
    list: [
      "Game — Hwatu (bài hoa) roguelike kiểu Hàn (K-Poker) và tháp phòng thủ võ hiệp, chơi ngay trên trình duyệt không cần cài đặt.",
      "Câu chuyện tương tác — phiêu lưu chữ chính trị-giật gân 6 giờ và các tác phẩm tường thuật dẫn dắt bằng lựa chọn khác.",
      "Hoàn toàn miễn phí, không cần đăng ký. Chạy được trên di động, không cần thanh toán hay cài đặt ứng dụng.",
    ],
  },
} as const;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const c = COPY[localeKeyOf(locale)];

  return {
    title: c.metaTitle,
    description: c.metaDesc,
    keywords: [...c.keywords],
    alternates: {
      canonical: `/${locale}/games`,
      languages: buildLanguagesAlt("/games"),
    },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDesc,
      url: `${SITE_URL}/${locale}/games`,
      type: "website",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function GamesHubPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const localeKey = localeKeyOf(locale);
  const c = COPY[localeKey];
  const t = await getTranslations({ locale: localeKey, namespace: "projects" });

  const labels = {
    open: t("cardOpen"),
    external: t("cardExternal"),
    comingSoon: t("cardComingSoon"),
  };

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
      <Breadcrumbs path="/games" locale={localeKey} id="games-hub" />
      <header className="mb-10 max-w-3xl animate-fade-up">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-rose-400">
          {c.eyebrow}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
          {c.h1}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
          {c.subtitle}
        </p>
      </header>

      <ProjectsTabs
        localeKey={localeKey}
        labels={labels}
        visibleTabs={["games", "stories"]}
      />

      <section className="mt-14 max-w-3xl space-y-6 border-t border-[color:var(--color-border-subtle)] pt-10">
        <h2 className="text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
          {c.section2Heading}
        </h2>
        <p className="text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
          {c.section2Para}
        </p>
        <ul className="space-y-2.5 text-sm text-[color:var(--color-text-secondary)] md:text-base">
          {c.list.map((item, i) => (
            <li key={i} className="flex gap-2.5">
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
        <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2">
          <Link
            href={`/${locale}/korean-typing`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-400 transition-colors hover:text-violet-300"
          >
            {TYPING_CTA[localeKey]}
            <span aria-hidden="true">→</span>
          </Link>
          <Link
            href={`/${locale}/korean-crossword`}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-400 transition-colors hover:text-cyan-300"
          >
            {CROSSWORD_CTA[localeKey]}
            <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
      </div>
    </main>
  );
}
