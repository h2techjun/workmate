import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL, SITE_BRAND } from "@/lib/siteConfig";
import { ProjectsTabs } from "@/components/projects/ProjectsTabs";

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
      "기억력 곡선(FSRS)에 맞춘 생활 영어 간격 반복 학습. A1~C2 3,400+ 카드, 발음기호+한국어 발음, 플래시카드+빈칸 퀴즈. 가입 없이 브라우저에서 바로.",
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
      "Loopla 韩语 — 基于 FSRS 记忆曲线的间隔重复学习日常韩语。A1~C2 共 3,400+ 张卡片，韩文+罗马音，闪卡+填空测验。无需注册，浏览器直接使用。",
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
      </div>
    </main>
  );
}
