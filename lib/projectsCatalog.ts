/**
 * 메이커 포트폴리오 카탈로그 — 단일 진실원.
 *
 * /projects 쇼케이스 페이지, sitemap, 구조화 데이터에서 모두 참조.
 * 각 프로젝트의 호스팅 방식(`hostType`) 에 따라 라우팅이 결정된다:
 *
 *   - "internal-static"  → Workmate public/ 에 직접 배포된 정적 SPA (Flutter web)
 *                         예: /play/k-poker
 *   - "external"         → 외부 도메인 그대로 링크
 *
 * 탭 구분(`tab`) — 검색량·트렌드 기반:
 *   - "games"   — 캐주얼 게임 (K-Poker, Defense)
 *                 흡수: 무료게임, 웹게임, 화투게임, 타워디펜스
 *   - "stories" — 인터랙티브 스토리 (6 Hours)
 *                 흡수: 텍스트 어드벤처, 인터랙티브 픽션, 인디 게임
 *   - "tests"   — 심리·진단 테스트 (Office Hunter)
 *                 흡수: 심리테스트, MBTI, 직장 진단, 자가진단 (최대 검색량)
 *
 * SaaS(Hakrew 등)는 카탈로그에서 제외 — 바이브 코딩 변동성·SaaS 책임 분리.
 */

import type { Locale } from "@/i18n";

export type ProjectTab = "games" | "stories" | "tests" | "learn";
export type ProjectHostType = "internal-static" | "external";
export type ProjectStatus = "live" | "beta" | "wip" | "archived";

export interface ProjectEntry {
  /** URL slug — 영문 케밥 케이스 */
  id: string;
  /** 어느 탭에 표시할지 */
  tab: ProjectTab;
  /** 호스팅 방식 */
  hostType: ProjectHostType;
  /**
   * 서브패스 — host가 internal-* 일 때만 의미 있음.
   * "/play/k-poker" 처럼 leading slash 포함, trailing slash 없이.
   */
  subpath?: string;
  /** 외부 링크 URL — host가 external 일 때만. */
  externalUrl?: string;
  /** GitHub 리포 URL — 있으면 카드 모서리에 표시. */
  githubUrl?: string;
  /** 운영 상태 */
  status: ProjectStatus;
  /** 표시 순서 — 탭 내부에서 작을수록 위 */
  order: number;
  /** 카드 액센트 그라디언트 (Tailwind from-/to- 클래스 조합) */
  accent: string;
  /** 기술 스택 배지 (4개 이내 권장) */
  techStack: ReadonlyArray<string>;
  /** 다국어 제목·설명 */
  i18n: Record<Locale, { title: string; tagline: string; description: string }>;
}

/**
 * 외부 링크나 internal 서브패스 어느 쪽이든 클릭 시 실제 이동할 URL 을 반환.
 */
export function resolveProjectUrl(p: ProjectEntry): string {
  if (p.hostType === "external") {
    return p.externalUrl ?? "#";
  }
  return p.subpath ?? "#";
}

export const PROJECTS_CATALOG: ReadonlyArray<ProjectEntry> = [
  // ─────────────────── 게임 ───────────────────
  {
    id: "k-poker",
    tab: "games",
    // 게임 페이지는 AdSense CPM 단가를 끌어내려 도구 페이지 수익에 마이너스.
    // 별도 서브도메인 분리 시점까지 외부 호스팅 유지.
    hostType: "external",
    externalUrl: "https://junhuimine.github.io/k-poker/",
    githubUrl: "https://github.com/h2techjun/k-poker",
    status: "live",
    order: 1,
    accent: "from-rose-500 to-orange-500",
    techStack: ["Flutter", "Riverpod", "Hive", "Roguelike"],
    i18n: {
      ko: {
        title: "K-Poker",
        tagline: "화투 로그라이크 — 매판 새 덱·새 보스",
        description:
          "고스톱·맞고 룰 기반의 카드 로그라이크. 시드 락·연승 시스템으로 점점 깊이를 더하는 한국형 카드 게임. 브라우저에서 바로 플레이.",
      },
      en: {
        title: "K-Poker",
        tagline: "Hwatu roguelike — new deck, new boss every run",
        description:
          "A roguelike built on Korean card game rules (Go-Stop, Matgo). Seed-locked seeds, escalating bosses, deep deck-building. Play in browser.",
      },
      vi: {
        title: "K-Poker",
        tagline: "Hwatu roguelike — new deck, new boss every run",
        description:
          "A roguelike built on Korean card game rules (Go-Stop, Matgo). Seed-locked seeds, escalating bosses, deep deck-building. Play in browser.",
      },
    },
  },
  {
    id: "defense",
    tab: "games",
    hostType: "external",
    externalUrl: "https://h2techjun.github.io/defense/",
    githubUrl: "https://github.com/h2techjun/defense",
    status: "beta",
    order: 2,
    accent: "from-amber-500 to-red-600",
    techStack: ["Flutter", "Flame", "Tower Defense", "RPG"],
    i18n: {
      ko: {
        title: "해원문 타워디펜스",
        tagline: "한국형 무협 세계관의 디펜스 RPG",
        description:
          "Flame 엔진 기반 타워디펜스. 무협 캐릭터 성장·장비 강화·스테이지 보스 — 모바일 가로 모드 최적화. 빌드 사이즈가 커서 별도 도메인에서 호스팅.",
      },
      en: {
        title: "Haewonmun Tower Defense",
        tagline: "Korean martial-arts universe defense RPG",
        description:
          "Flame-engine TD. Character growth, gear upgrades, stage bosses — landscape-optimized mobile play. Hosted on a separate domain (large build).",
      },
      vi: {
        title: "Haewonmun Tower Defense",
        tagline: "Korean martial-arts universe defense RPG",
        description:
          "Flame-engine TD. Character growth, gear upgrades, stage bosses — landscape-optimized mobile play. Hosted on a separate domain (large build).",
      },
    },
  },

  // ─────────────────── 체험형 ───────────────────
  {
    id: "office-hunter",
    tab: "tests",
    hostType: "external",
    externalUrl: "https://officehunter.vercel.app",
    status: "wip",
    order: 1,
    accent: "from-fuchsia-500 to-pink-500",
    techStack: ["Next.js", "Supabase", "Vertex AI"],
    i18n: {
      ko: {
        title: "Office Hunter",
        tagline: "직장 문화 진단 + 블라인드 커뮤니티",
        description:
          "재직자가 자기 회사 문화를 8개 축으로 셀프 진단하고, 익명 커뮤니티에서 회사 비교. Vertex AI 가 답변 신뢰도를 자동 평가해 노이즈를 줄인다.",
      },
      en: {
        title: "Office Hunter",
        tagline: "Workplace culture audit + anonymous community",
        description:
          "Self-audit your workplace on 8 axes, then compare anonymously. Vertex AI auto-scores answer credibility to filter low-quality posts.",
      },
      vi: {
        title: "Office Hunter",
        tagline: "Workplace culture audit + anonymous community",
        description:
          "Self-audit your workplace on 8 axes, then compare anonymously. Vertex AI auto-scores answer credibility to filter low-quality posts.",
      },
    },
  },
  {
    id: "6hours",
    tab: "stories",
    hostType: "external",
    externalUrl: "https://6hours.vercel.app",
    githubUrl: "https://github.com/h2techjun/03_6Hours",
    status: "live",
    order: 2,
    accent: "from-violet-500 to-indigo-600",
    techStack: ["Next.js", "Supabase", "Interactive Fiction"],
    i18n: {
      ko: {
        title: "6 Hours",
        tagline: "정치 스릴러 텍스트 어드벤처",
        description:
          "6시간 안에 결정해야 하는 정치 음모. 분기 트리 + 시간 압박 + 다중 엔딩. 각 선택은 영구 저장돼 다른 플레이어와 비교한다.",
      },
      en: {
        title: "6 Hours",
        tagline: "Political thriller text adventure",
        description:
          "A political conspiracy with a 6-hour decision deadline. Branching tree, time pressure, multi-endings, choices compared globally.",
      },
      vi: {
        title: "6 Hours",
        tagline: "Political thriller text adventure",
        description:
          "A political conspiracy with a 6-hour decision deadline. Branching tree, time pressure, multi-endings, choices compared globally.",
      },
    },
  },

  // ─────────────────── 학습 ───────────────────
  {
    id: "vibe-english",
    tab: "learn",
    hostType: "external",
    externalUrl: "https://h2techjun.github.io/vibe-english/",
    githubUrl: "https://github.com/h2techjun/vibe-english",
    status: "live",
    order: 1,
    accent: "from-blue-500 to-cyan-500",
    techStack: ["Next.js", "FSRS", "IndexedDB", "PWA"],
    i18n: {
      ko: {
        title: "Loopla English",
        tagline: "기억력 곡선 기반 생활 영어 SRS",
        description:
          "에빙하우스 망각곡선(FSRS)에 맞춰 잊을 만할 때 복습하는 생활 영어. A1~C2 3,400+ 카드, 발음기호+한국어 발음 병기, 플래시카드+빈칸 퀴즈. 가입 없이 완전 로컬로 동작.",
      },
      en: {
        title: "Loopla Korean",
        tagline: "Everyday Korean SRS timed to your memory curve",
        description:
          "Learn everyday Korean with spaced repetition (FSRS) timed to the forgetting curve. 3,400+ cards A1–C2, Hangul + romanization, flashcards + cloze quiz. Fully local, no signup.",
      },
      vi: {
        title: "Loopla Korean",
        tagline: "Everyday Korean SRS timed to your memory curve",
        description:
          "Learn everyday Korean with spaced repetition (FSRS) timed to the forgetting curve. 3,400+ cards A1–C2, Hangul + romanization, flashcards + cloze quiz. Fully local, no signup.",
      },
    },
  },

  // ※ Hakrew(서비스 탭)는 카탈로그에서 제외 — 활성 SaaS 의 책임 분리 + 바이브 코딩 변동성.
  //   필요 시 외부에서 직접 운영 (hakrew21.github.io/hakrew-web).
];

/**
 * 탭 표시 라벨 (UI).
 */
export const TAB_LABEL: Record<ProjectTab, Record<Locale, string>> = {
  games: { ko: "게임", en: "Games", vi: "Games" },
  stories: { ko: "스토리", en: "Stories", vi: "Stories" },
  tests: { ko: "심리테스트", en: "Tests", vi: "Tests" },
  learn: { ko: "학습", en: "Learn", vi: "Learn" },
};

/**
 * 탭 짧은 설명 (탭 클릭 시 sub-heading) — SEO 키워드 포함.
 */
export const TAB_TAGLINE: Record<ProjectTab, Record<Locale, string>> = {
  games: {
    ko: "브라우저에서 바로 플레이하는 무료 캐주얼 게임",
    en: "Free casual games playable directly in your browser",
    vi: "Free casual games playable directly in your browser",
  },
  stories: {
    ko: "선택이 결과를 바꾸는 인터랙티브 스토리·텍스트 어드벤처",
    en: "Interactive stories where every choice changes the ending",
    vi: "Interactive stories where every choice changes the ending",
  },
  tests: {
    ko: "직장 문화·자기 진단 — 익명 심리테스트 + AI 분석",
    en: "Workplace culture and self-discovery tests with AI scoring",
    vi: "Workplace culture and self-discovery tests with AI scoring",
  },
  learn: {
    ko: "기억력 곡선에 맞춘 간격 반복 학습 — 매일 꾸준히",
    en: "Spaced-repetition everyday Korean timed to your memory curve",
    vi: "Spaced-repetition everyday Korean timed to your memory curve",
  },
};

/**
 * 탭 표시 순서 — 검색량 큰 순 (tests 가 가장 높은 트래픽 예상이지만,
 * 기존 사용자 인지 흐름 유지를 위해 games → stories → tests 순서).
 */
export const TAB_ORDER: ReadonlyArray<ProjectTab> = [
  "games",
  "stories",
  "tests",
  "learn",
];

export const STATUS_LABEL: Record<ProjectStatus, Record<Locale, string>> = {
  live: { ko: "운영중", en: "Live", vi: "Live" },
  beta: { ko: "베타", en: "Beta", vi: "Beta" },
  wip: { ko: "개발중", en: "WIP", vi: "WIP" },
  archived: { ko: "아카이브", en: "Archived", vi: "Archived" },
};
