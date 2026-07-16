import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import {
  ArrowRight,
  Gamepad2,
  Keyboard,
  Puzzle,
  Spade,
  Swords,
} from "lucide-react";
import { locales, type Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL, SITE_BRAND } from "@/lib/siteConfig";
import { ProjectsTabs } from "@/components/projects/ProjectsTabs";
import {
  PROJECTS_CATALOG,
  resolveProjectUrl,
  type ProjectEntry,
} from "@/lib/projectsCatalog";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";

interface PageProps {
  params: Promise<{ locale: string }>;
}

/**
 * Loopla 학습 진입점 카피 — K-생태계 "한국어 학습" 노드.
 * ko 방문자 = 영어 학습(Loopla English) / en·zh·vi 방문자 = 각 모국어로 한국어 학습(Loopla).
 * Loopla 앱(11_english) 의 로케일별 랜딩 카피와 프레이밍을 맞춘다.
 */
const COPY = {
  ko: {
    metaTitle: "영어 학습 · Loopla English SRS",
    metaDesc:
      "망각곡선을 계산하는 FSRS 알고리즘에 맞춰 생활 영어를 간격 반복으로 학습합니다. A1~C2 수준 3,400개 이상 카드에 발음기호와 한국어 발음을 함께 표기하고, 플래시카드·빈칸 퀴즈로 복습합니다. 가입 없이 브라우저에서 바로 시작하세요.",
    keywords: [
      "영어 학습",
      "생활 영어",
      "영어 회화",
      "영어 단어 암기",
      "간격 반복 학습",
      "SRS",
      "플래시카드",
      "영어 발음",
      "무료 영어 공부",
    ],
    eyebrow: "영어 학습 · 간격 반복",
    h1: "기억에 남는 영어 학습",
    p: "잊을 만할 때 다시 만나는 생활 영어. 망각곡선(FSRS)이 복습 타이밍을 자동 계산하고, 발음기호와 한국어 발음까지 함께 익힌다.",
  },
  en: {
    metaTitle: "Learn Korean · Loopla Korean SRS",
    metaDesc:
      "Loopla Korean — learn everyday Korean with spaced repetition on the FSRS memory curve. 3,400+ cards A1–C2, Hangul + romanization, flashcards + cloze quiz. No signup, runs in your browser.",
    keywords: [
      "learn korean",
      "korean for beginners",
      "korean vocabulary",
      "everyday korean",
      "spaced repetition korean",
      "hangul",
      "korean flashcards",
      "study korean free",
      "korean SRS",
    ],
    eyebrow: "Learn Korean · Spaced Repetition",
    h1: "Korean That Sticks",
    p: "Everyday Korean that comes back right before you forget. Loopla Korean's FSRS engine schedules your reviews automatically, with Hangul and romanization hints.",
  },
  zh: {
    metaTitle: "学习韩语 · Loopla 韩语 SRS",
    metaDesc:
      "Loopla 韩语基于 FSRS 记忆曲线,用间隔重复的方式学习日常韩语,帮助你在快遗忘时刚好复习。A1~C2 共 3,400 多张卡片,标注韩文与罗马音,搭配闪卡与填空测验巩固记忆。无需注册,打开浏览器即可开始学习。",
    keywords: [
      "学韩语",
      "韩语入门",
      "韩语单词",
      "日常韩语",
      "间隔重复",
      "韩文",
      "韩语闪卡",
      "免费学韩语",
      "韩语 SRS",
    ],
    eyebrow: "学习韩语 · 间隔重复",
    h1: "牢牢记住的韩语",
    p: "在你快要遗忘时再次出现的日常韩语。Loopla 韩语的 FSRS 引擎自动安排复习时机，并附上韩文与罗马音提示。",
  },
  vi: {
    metaTitle: "Học tiếng Hàn · Loopla Korean SRS",
    metaDesc:
      "Loopla Korean — học tiếng Hàn hằng ngày bằng lặp lại ngắt quãng theo đường cong trí nhớ FSRS. 3.400+ thẻ A1–C2, chữ Hàn + phiên âm, thẻ ghi nhớ + điền chỗ trống. Không cần đăng ký, chạy ngay trên trình duyệt.",
    keywords: [
      "học tiếng Hàn",
      "tiếng Hàn cho người mới",
      "từ vựng tiếng Hàn",
      "tiếng Hàn hằng ngày",
      "lặp lại ngắt quãng",
      "Hangul",
      "thẻ tiếng Hàn",
      "học tiếng Hàn miễn phí",
      "tiếng Hàn SRS",
    ],
    eyebrow: "Học tiếng Hàn · Lặp lại ngắt quãng",
    h1: "Tiếng Hàn nhớ lâu",
    p: "Tiếng Hàn hằng ngày quay lại ngay trước khi bạn quên. Bộ máy FSRS của Loopla Korean tự lên lịch ôn tập, kèm gợi ý chữ Hàn và phiên âm.",
  },
} as const;

/**
 * learn 하단 "게임으로 익히기" 유도 — K-생태계 마지막 고리. 학습축과 동선을 맞춘다:
 *  - ko 방문자 = 영어 학습 → 공부 쉬는 시간 무료 게임(화투·무협·타자·낱말퀴즈).
 *  - en·zh·vi 방문자 = 한국어 학습 → 한국어 연습 게임(kword 십자말·ktype 타자 우선).
 * 게임 카피는 lib/projectsCatalog.ts(단일 진실원)의 i18n 필드를 그대로 재사용하고,
 * 여기서는 섹션 헤딩/CTA 문구와 노출 순서만 관리한다.
 */
const GAMES_COPY = {
  ko: {
    heading: "영어 공부 쉬는 시간엔 게임 한 판",
    body: "화투 로그라이크, 무협 디펜스, 한글 타자·낱말퀴즈 — 브라우저에서 바로 즐기는 무료 게임. 회원가입도 설치도 필요 없습니다.",
    cta: "무료 게임 전체 보기",
  },
  en: {
    heading: "Practice the Korean you just learned — in a game",
    body: "A Korean crossword, Hangul typing practice, Hwatu cards, a martial-arts defense — Korean language and culture, playable instantly in your browser. No signup, no install.",
    cta: "See all free games",
  },
  zh: {
    heading: "学完韩语，用游戏练一练",
    body: "韩语填字、韩文打字练习、花斗纸牌、武侠塔防——韩国语言与文化融入的游戏，浏览器里直接畅玩。无需注册，无需安装。",
    cta: "查看全部免费游戏",
  },
  vi: {
    heading: "Luyện lại tiếng Hàn vừa học qua game",
    body: "Ô chữ tiếng Hàn, luyện gõ Hangul, bài hoa Hwatu, thủ thành võ hiệp — ngôn ngữ và văn hóa Hàn Quốc trong những tựa game chơi ngay trên trình duyệt. Không cần đăng ký, không cần cài đặt.",
    cta: "Xem tất cả game miễn phí",
  },
} as const;

const GAME_ICON: Record<string, typeof Gamepad2> = {
  "k-poker": Spade,
  defense: Swords,
  ktype: Keyboard,
  kword: Puzzle,
};

/** 한국어 연습 게임 — 외국인 로케일(en/zh/vi)에서 학습 동선상 맨 앞에 노출 */
const KOREAN_PRACTICE_GAME_IDS = new Set(["kword", "ktype"]);

function GamePreviewCard({
  project,
  localeKey,
}: {
  project: ProjectEntry;
  localeKey: Locale;
}): React.ReactElement {
  const copy = project.i18n[localeKey];
  const url = resolveProjectUrl(project, localeKey);
  const Icon = GAME_ICON[project.id] ?? Gamepad2;

  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex items-start gap-3 rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-card)] p-4 transition-colors hover:border-rose-400/50"
    >
      <span
        className={`grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-to-br ${project.accent} text-white`}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span className="min-w-0">
        <span className="block text-sm font-semibold text-[color:var(--color-text-primary)]">
          {copy.title}
        </span>
        <span className="mt-0.5 block text-xs leading-relaxed text-[color:var(--color-text-tertiary)]">
          {copy.tagline}
        </span>
      </span>
    </a>
  );
}

function localeKeyOf(locale: string): "ko" | "en" | "zh" | "vi" {
  if (locale === "ko") return "ko";
  if (locale === "zh") return "zh";
  if (locale === "vi") return "vi";
  return "en";
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const c = COPY[localeKeyOf(locale)];
  return {
    title: `${c.metaTitle} — ${SITE_BRAND}`,
    description: c.metaDesc,
    keywords: [...c.keywords],
    alternates: {
      canonical: `/${locale}/learn`,
      languages: buildLanguagesAlt("/learn"),
    },
    openGraph: {
      title: `${c.metaTitle} — ${SITE_BRAND}`,
      description: c.metaDesc,
      url: `${SITE_URL}/${locale}/learn`,
      type: "website",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function LearnHubPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const localeKey = localeKeyOf(locale);
  const c = COPY[localeKey];
  const gamesCopy = GAMES_COPY[localeKey];
  const byOrder = PROJECTS_CATALOG.filter((p) => p.tab === "games").sort(
    (a, b) => a.order - b.order,
  );
  // 외국인(한국어 학습) 로케일은 한국어 연습 게임(십자말·타자)부터 노출
  const gameProjects =
    localeKey === "ko"
      ? byOrder
      : [
          ...byOrder.filter((p) => KOREAN_PRACTICE_GAME_IDS.has(p.id)),
          ...byOrder.filter((p) => !KOREAN_PRACTICE_GAME_IDS.has(p.id)),
        ];
  const t = await getTranslations({
    locale: localeKey as Locale,
    namespace: "projects",
  });

  const labels = {
    open: t("cardOpen"),
    external: t("cardExternal"),
    comingSoon: t("cardComingSoon"),
  };

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs path="/learn" locale={localeKey} id="learn-hub" />
        <header className="mb-10 max-w-3xl animate-fade-up">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-cyan-400">
            {c.eyebrow}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
            {c.h1}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
            {c.p}
          </p>
        </header>

        <ProjectsTabs
          localeKey={localeKey as Locale}
          labels={labels}
          visibleTabs={["learn"]}
        />

        <section className="mt-14 max-w-3xl border-t border-[color:var(--color-border-subtle)] pt-10">
          <h2 className="text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
            {gamesCopy.heading}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[color:var(--color-text-secondary)] md:text-base">
            {gamesCopy.body}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            {gameProjects.map((project) => (
              <GamePreviewCard
                key={project.id}
                project={project}
                localeKey={localeKey as Locale}
              />
            ))}
          </div>

          <Link
            href={`/${locale}/games`}
            className="group mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-rose-400 transition-colors hover:text-rose-300"
          >
            {gamesCopy.cta}
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>
      </div>
    </main>
  );
}
