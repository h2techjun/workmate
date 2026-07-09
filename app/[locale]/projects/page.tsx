import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { locales, type Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL, SITE_BRAND } from "@/lib/siteConfig";
import { ProjectsTabs } from "@/components/projects/ProjectsTabs";

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

  const title = isKo
    ? `무료 게임·인터랙티브 스토리·심리테스트 모음 — ${SITE_BRAND}`
    : isZh
      ? `免费游戏·互动故事·心理测试合集 — ${SITE_BRAND}`
      : isVi
        ? `Bộ sưu tập Game · Truyện tương tác · Trắc nghiệm tính cách miễn phí — ${SITE_BRAND}`
        : `Free Games · Interactive Stories · Personality Tests — ${SITE_BRAND}`;
  const description = isKo
    ? "브라우저에서 바로 즐기는 무료 게임(화투 로그라이크 K-Poker, 한국형 타워디펜스), 6시간 정치 텍스트 어드벤처, 직장 문화 심리테스트. 회원가입·결제 없이 즉시 플레이."
    : isZh
      ? "浏览器直接畅玩的免费游戏(花斗Rogue-like K-Poker、韩式塔防)、6小时政治文字冒险、职场文化心理测试。无需注册，即刻开始。"
      : isVi
        ? "Game miễn phí chơi ngay trên trình duyệt (hwatu roguelike K-Poker, tháp phòng thủ kiểu Hàn), phiêu lưu chữ chính trị 6 giờ, trắc nghiệm tính cách văn hóa công sở. Chơi ngay — không cần đăng ký."
        : "Free browser games (hwatu roguelike, Korean tower defense), 6-hour political text adventure, workplace culture personality test. Play instantly — no signup.";
  const keywords = isKo
    ? [
        "무료 게임",
        "웹게임",
        "한국 인디 게임",
        "화투 게임",
        "화투 로그라이크",
        "타워디펜스",
        "텍스트 어드벤처",
        "인터랙티브 픽션",
        "정치 스릴러",
        "심리테스트",
        "MBTI",
        "직장 문화 진단",
        "자가진단",
        "AI 심리분석",
      ]
    : isZh
      ? [
          "免费游戏",
          "网页游戏",
          "韩国独立游戏",
          "花斗游戏",
          "花斗Rogue-like",
          "塔防游戏",
          "文字冒险",
          "互动小说",
          "政治惊悚",
          "心理测试",
          "MBTI",
          "职场文化诊断",
          "自我诊断",
          "AI心理分析",
        ]
      : isVi
        ? [
            "game miễn phí",
            "game trình duyệt",
            "game indie Hàn Quốc",
            "game hwatu",
            "hwatu roguelike",
            "tháp phòng thủ",
            "phiêu lưu chữ",
            "tiểu thuyết tương tác",
            "trắc nghiệm tính cách",
            "MBTI",
            "chẩn đoán văn hóa công ty",
            "tự đánh giá",
            "phân tích tính cách AI",
          ]
        : [
            "free browser games",
            "Korean indie games",
            "hwatu game",
            "tower defense",
            "text adventure",
            "interactive fiction",
            "personality test",
            "MBTI",
            "workplace culture test",
            "self assessment",
            "AI personality analysis",
          ];

  return {
    title,
    description,
    keywords,
    alternates: {
      canonical: `/${locale}/projects`,
      languages: buildLanguagesAlt("/projects"),
    },
    openGraph: {
      title,
      description,
      url: `${SITE_URL}/${locale}/projects`,
      type: "website",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function ProjectsPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const localeKey = (
    locale === "ko" || locale === "zh" || locale === "vi" ? locale : "en"
  ) as Locale;
  const t = await getTranslations({ locale: localeKey, namespace: "projects" });

  const cardLabels = {
    open: t("cardOpen"),
    external: t("cardExternal"),
    comingSoon: t("cardComingSoon"),
  };

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
      <header className="mb-10 max-w-3xl animate-fade-up">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
          {t("eyebrow")}
        </p>
        <h1 className="text-4xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
          {t("heading")}
        </h1>
        <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
          {t("intro")}
        </p>
      </header>

      <ProjectsTabs localeKey={localeKey} labels={cardLabels} />
      </div>
    </main>
  );
}
