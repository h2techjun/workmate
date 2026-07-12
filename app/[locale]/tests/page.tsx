import type { Metadata } from "next";
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

const COPY = {
  ko: {
    metaTitle: `심리테스트 · 직장 진단 — ${SITE_BRAND}`,
    metaDesc:
      "AI 가 분석하는 무료 심리테스트. 직장 문화 8개 축 셀프 진단, 익명 커뮤니티 비교, Vertex AI 답변 신뢰도 평가. MBTI 류와 다른 깊이 있는 진단.",
    keywords: [
      "심리테스트",
      "MBTI",
      "MBTI 무료",
      "직장 문화 진단",
      "직장 진단",
      "회사 진단",
      "자가진단",
      "AI 심리분석",
      "성격 테스트",
      "익명 커뮤니티",
    ],
    eyebrow: "심리테스트 · 자가진단",
    h1: "직장 문화·자기 진단",
    subtitle:
      "MBTI 류의 단순 테스트와 다른 깊이. AI 가 답변 신뢰도까지 자동 평가하고, 익명 커뮤니티에서 회사·동료들과 비교한다.",
    section2Heading: "이 심리테스트는 무엇이 다른가요",
    section2Para:
      "MBTI 류의 단순 분류를 넘어, 직장 문화 진단과 자기 이해에 초점을 둔 자가진단 도구입니다. AI가 응답의 일관성·신뢰도를 평가하고, 결과를 익명으로 비교할 수 있습니다. 같은 제작자가 만든 프로젝트로, 외부 광고용 임베드가 아닙니다.",
    list: [
      "직장 문화 진단 — 우리 회사·팀의 분위기를 항목별로 점검하고 익명 비교.",
      "AI 신뢰도 평가 — 대충 찍은 응답을 걸러 결과의 신뢰도를 높임.",
      "무료·무가입. 결과는 개인 참고용이며 진단·의학적 판단이 아닙니다.",
    ],
  },
  en: {
    metaTitle: `Personality & Workplace Tests — ${SITE_BRAND}`,
    metaDesc:
      "Free AI-powered personality tests. 8-axis workplace culture self-assessment, anonymous community comparison, Vertex AI credibility scoring.",
    keywords: [
      "personality test",
      "MBTI",
      "workplace culture test",
      "self assessment",
      "AI personality analysis",
      "anonymous community",
    ],
    eyebrow: "Tests · Self-Discovery",
    h1: "Workplace & Self-Assessment",
    subtitle:
      "Deeper than MBTI-style quizzes. AI scores answer credibility and lets you compare with peers anonymously.",
    section2Heading: "What makes these tests different",
    section2Para:
      "Beyond MBTI-style labels, these self-assessment tools focus on workplace culture and self-understanding. An AI layer scores the consistency and credibility of your answers, and results can be compared anonymously. They are projects by the same maker — not third-party ad embeds.",
    list: [
      "Workplace culture check — assess your company or team by category and compare anonymously.",
      "AI credibility scoring — filters careless answers to make the result more reliable.",
      "Free, no signup. Results are for personal reflection, not a clinical diagnosis.",
    ],
  },
  zh: {
    metaTitle: `心理测试 · 职场诊断 — ${SITE_BRAND}`,
    metaDesc:
      "AI分析的免费心理测试。职场文化8轴自我诊断、匿名社区比较、Vertex AI回答可信度评分。有别于MBTI类测试的深度诊断。",
    keywords: [
      "心理测试",
      "MBTI",
      "MBTI免费",
      "职场文化诊断",
      "职场诊断",
      "公司诊断",
      "自我诊断",
      "AI心理分析",
      "性格测试",
      "匿名社区",
    ],
    eyebrow: "心理测试 · 自我诊断",
    h1: "职场文化与自我诊断",
    subtitle:
      "有别于MBTI类简单测试的深度体验。AI自动评估回答可信度，还能在匿名社区与公司同事互相比较。",
    section2Heading: "这些心理测试有什么不同",
    section2Para:
      "超越MBTI式的简单分类，专注于职场文化诊断与自我理解的自测工具。AI会评估回答的一致性与可信度，结果还可匿名比较。这些均为同一位创作者的作品，并非第三方广告嵌入。",
    list: [
      "职场文化诊断 — 按项目检测公司·团队氛围，并可匿名比较。",
      "AI可信度评分 — 过滤敷衍作答，提升结果可信度。",
      "免费、无需注册。结果仅供个人参考，并非诊断或医学判断。",
    ],
  },
  vi: {
    metaTitle: `Trắc nghiệm tính cách · Chẩn đoán nơi làm việc — ${SITE_BRAND}`,
    metaDesc:
      "Trắc nghiệm tính cách miễn phí do AI phân tích. Tự chẩn đoán văn hóa nơi làm việc theo 8 trục, so sánh cộng đồng ẩn danh, Vertex AI chấm điểm độ tin cậy câu trả lời. Chẩn đoán sâu sắc khác với các bài test kiểu MBTI.",
    keywords: [
      "trắc nghiệm tính cách",
      "MBTI",
      "MBTI miễn phí",
      "chẩn đoán văn hóa công ty",
      "chẩn đoán nơi làm việc",
      "tự đánh giá",
      "phân tích tính cách AI",
      "test tính cách",
      "cộng đồng ẩn danh",
    ],
    eyebrow: "Trắc nghiệm · Khám phá bản thân",
    h1: "Văn hóa công sở & Tự đánh giá",
    subtitle:
      "Sâu sắc hơn các bài test kiểu MBTI đơn giản. AI tự động chấm điểm độ tin cậy câu trả lời, và cho phép bạn so sánh ẩn danh với đồng nghiệp.",
    section2Heading: "Điều gì làm cho các bài test này khác biệt",
    section2Para:
      "Vượt ra ngoài các nhãn kiểu MBTI, những công cụ tự đánh giá này tập trung vào văn hóa nơi làm việc và hiểu biết bản thân. Một lớp AI chấm điểm tính nhất quán và độ tin cậy của câu trả lời, và kết quả có thể so sánh ẩn danh. Đây là các dự án của cùng một người sáng tạo — không phải nhúng quảng cáo bên thứ ba.",
    list: [
      "Chẩn đoán văn hóa công sở — đánh giá không khí công ty/nhóm theo từng hạng mục và so sánh ẩn danh.",
      "AI chấm điểm độ tin cậy — lọc ra các câu trả lời qua loa để tăng độ tin cậy của kết quả.",
      "Miễn phí, không cần đăng ký. Kết quả chỉ mang tính tham khảo cá nhân, không phải chẩn đoán y khoa.",
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
      canonical: `/${locale}/tests`,
      languages: buildLanguagesAlt("/tests"),
    },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDesc,
      url: `${SITE_URL}/${locale}/tests`,
      type: "website",
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function TestsHubPage({
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
      <Breadcrumbs path="/tests" locale={localeKey} id="tests-hub" />
      <header className="mb-10 max-w-3xl animate-fade-up">
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-fuchsia-400">
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
        visibleTabs={["tests"]}
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
              <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
      </div>
    </main>
  );
}
