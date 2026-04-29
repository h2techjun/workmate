/**
 * 메이커 포트폴리오 카탈로그 — 단일 진실원.
 *
 * /projects 쇼케이스 페이지, sitemap, 구조화 데이터에서 모두 참조.
 * 각 프로젝트의 호스팅 방식(`hostType`) 에 따라 라우팅이 결정된다:
 *
 *   - "internal-static"  → Workmate public/ 에 직접 배포된 정적 SPA (Flutter web)
 *                         예: /play/k-poker, /play/defense, /app/hakrew
 *   - "internal-rewrite" → 별도 Vercel 프로젝트로 배포된 Next.js 앱을 rewrite 로 프록시
 *                         예: /app/doc-translator → doc-translator.vercel.app
 *   - "external"         → 외부 도메인 그대로 링크 (백엔드/CLI 등)
 */

import type { Locale } from "@/i18n";

export type ProjectCategory = "game" | "app" | "lab" | "tool" | "platform";
export type ProjectHostType = "internal-static" | "internal-rewrite" | "external";
export type ProjectStatus = "live" | "beta" | "wip" | "archived";

export interface ProjectEntry {
  /** URL slug — 영문 케밥 케이스 */
  id: string;
  /** 표시 카테고리 (UI 배지) */
  category: ProjectCategory;
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
  /** 메인 hero 카드 강조 여부 */
  featured: boolean;
  /** 표시 순서 — 작을수록 위 */
  order: number;
  /** 카드 액센트 색상 (Tailwind class 또는 inline color) */
  accent: string;
  /** 기술 스택 배지 (4개 이내 권장) */
  techStack: ReadonlyArray<string>;
  /** 다국어 제목·설명 */
  i18n: Record<Locale, { title: string; tagline: string; description: string }>;
}

/**
 * 외부 링크나 internal 서브패스 어느 쪽이든 클릭 시 실제 이동할 URL 을 반환.
 * locale 은 internal 경로의 경우 prefix 가 붙지 않는다 (메인 도메인 기준).
 */
export function resolveProjectUrl(p: ProjectEntry): string {
  if (p.hostType === "external") {
    return p.externalUrl ?? "#";
  }
  return p.subpath ?? "#";
}

export const PROJECTS_CATALOG: ReadonlyArray<ProjectEntry> = [
  {
    id: "workmate",
    category: "tool",
    hostType: "internal-static",
    subpath: "/",
    githubUrl: "https://github.com/h2techjun/workmate",
    status: "live",
    featured: true,
    order: 1,
    accent: "from-indigo-500 to-purple-600",
    techStack: ["Next.js 15", "TypeScript", "Tailwind v4", "Vercel"],
    i18n: {
      ko: {
        title: "Workmate",
        tagline: "현재 사이트 — 한국 실무자 무료 도구 허브",
        description:
          "전기 KEC, 4대보험 2026, 사업자번호 검증, 목조 NDS, 연봉 실수령액 등 한국 표준 기반 47개 계산기를 광고 없이 빠르게 제공한다.",
      },
      en: {
        title: "Workmate",
        tagline: "This site — free tool hub for Korean professionals",
        description:
          "47 calculators based on Korean standards (KEC, KS, NDS, building code). No-ad, mobile-first, with KS source attribution on every page.",
      },
    },
  },
  {
    id: "k-poker",
    category: "game",
    hostType: "internal-static",
    subpath: "/play/k-poker",
    githubUrl: "https://github.com/h2techjun/k-poker",
    status: "live",
    featured: true,
    order: 2,
    accent: "from-rose-500 to-orange-500",
    techStack: ["Flutter", "Riverpod", "Hive", "Roguelike"],
    i18n: {
      ko: {
        title: "K-Poker",
        tagline: "화투 로그라이크 — 매판 새 덱·새 보스",
        description:
          "고스톱·맞고 룰 기반의 카드 로그라이크. 시드 락·연승 시스템으로 점점 깊이를 더하는 한국형 카드 게임.",
      },
      en: {
        title: "K-Poker",
        tagline: "Hwatu roguelike — new deck, new boss every run",
        description:
          "A roguelike built on Korean card game rules (Go-Stop, Matgo). Seed-locked seeds, escalating bosses, deep deck-building.",
      },
    },
  },
  {
    id: "defense",
    category: "game",
    hostType: "internal-static",
    subpath: "/play/defense",
    githubUrl: "https://github.com/h2techjun/defense",
    status: "beta",
    featured: true,
    order: 3,
    accent: "from-amber-500 to-red-600",
    techStack: ["Flutter", "Flame", "Tower Defense", "RPG"],
    i18n: {
      ko: {
        title: "해원문 타워디펜스",
        tagline: "한국형 무협 세계관의 디펜스 RPG",
        description:
          "Flame 엔진 기반 타워디펜스. 무협 캐릭터 성장·장비 강화·스테이지 보스 — 모바일 가로 모드 최적화.",
      },
      en: {
        title: "Haewonmun Tower Defense",
        tagline: "Korean martial-arts universe defense RPG",
        description:
          "Flame-engine TD. Character growth, gear upgrades, stage bosses — landscape-optimized mobile play.",
      },
    },
  },
  {
    id: "hakrew",
    category: "platform",
    hostType: "internal-static",
    subpath: "/app/hakrew",
    externalUrl: "https://hakrew21.github.io/hakrew-web/",
    githubUrl: "https://github.com/h2techjun/hakrew",
    status: "live",
    featured: true,
    order: 4,
    accent: "from-sky-500 to-cyan-400",
    techStack: ["Flutter", "Supabase", "Gemini AI", "Hive"],
    i18n: {
      ko: {
        title: "하크루 (Hakrew)",
        tagline: "1인 학원장을 위한 SaaS — 출결·결제·상담·AI 케어",
        description:
          "RBAC 4역할(원장/매니저/직원/강사) + 학생·강사 출결, 결제 수금, 상담 일지, 4대보험 자동 계산, Gemini AI 결재 코멘트까지 통합. Hive offline-first + Supabase 동기화.",
      },
      en: {
        title: "Hakrew",
        tagline: "Korean academy SaaS — attendance, billing, AI care notes",
        description:
          "All-in-one platform for solo academy owners. RBAC × students × teachers × payments × Gemini-powered counselor notes.",
      },
    },
  },
  {
    id: "doc-translator",
    category: "app",
    hostType: "external",
    externalUrl: "https://github.com/h2techjun/doc-translator",
    githubUrl: "https://github.com/h2techjun/doc-translator",
    status: "beta",
    featured: false,
    order: 5,
    accent: "from-emerald-500 to-teal-500",
    techStack: ["Next.js", "Supabase", "Gemini", "PDF"],
    i18n: {
      ko: {
        title: "Doc Translator",
        tagline: "AI 문서 번역 SaaS — 전문 용어 사전 기반",
        description:
          "DOCX·PDF 업로드 → 도메인별 사전(법률/의료/기술) 적용 후 Gemini 번역 → 원본 레이아웃 보존 export. 결제·티어·관리자 분리.",
      },
      en: {
        title: "Doc Translator",
        tagline: "AI document translation SaaS with domain glossaries",
        description:
          "Upload DOCX/PDF → apply domain glossaries (legal/medical/tech) → Gemini translates → export with original layout preserved.",
      },
    },
  },
  {
    id: "office-hunter",
    category: "app",
    hostType: "external",
    externalUrl: "https://github.com/h2techjun/office-hunter",
    githubUrl: "https://github.com/h2techjun/office-hunter",
    status: "wip",
    featured: false,
    order: 6,
    accent: "from-fuchsia-500 to-pink-500",
    techStack: ["Next.js", "Supabase", "Vertex AI"],
    i18n: {
      ko: {
        title: "Office Hunter",
        tagline: "직장 문화 진단 + 블라인드 커뮤니티",
        description:
          "재직자가 자기 회사 문화를 진단(8개 축) → 익명 커뮤니티에서 회사 비교. Vertex AI 가 답변 신뢰도 자동 평가.",
      },
      en: {
        title: "Office Hunter",
        tagline: "Workplace culture audit + anonymous community",
        description:
          "8-axis self-audit of your workplace, then compare anonymously. Vertex AI auto-scores answer credibility.",
      },
    },
  },
  {
    id: "jeonju-sangkwon",
    category: "app",
    hostType: "external",
    externalUrl: "https://github.com/h2techjun/jeonju-sangkwon",
    githubUrl: "https://github.com/h2techjun/jeonju-sangkwon",
    status: "beta",
    featured: false,
    order: 7,
    accent: "from-lime-500 to-green-500",
    techStack: ["Next.js", "Supabase", "Kakao Maps"],
    i18n: {
      ko: {
        title: "전주 상권분석",
        tagline: "전주시 자영업자용 상권 데이터 대시보드",
        description:
          "행정동·업종별 매출·인구·경쟁 점포 데이터 시각화. 카카오맵 위에 히트맵·경쟁 점포 핀 + 매출 추이 차트.",
      },
      en: {
        title: "Jeonju Market Analysis",
        tagline: "Local commerce dashboard for Jeonju (Korea)",
        description:
          "Visualize sales, demographics, competitor density by district. Kakao Maps heatmap + revenue trend charts.",
      },
    },
  },
  {
    id: "6hours",
    category: "lab",
    hostType: "external",
    externalUrl: "https://github.com/h2techjun/6hours",
    githubUrl: "https://github.com/h2techjun/6hours",
    status: "wip",
    featured: false,
    order: 8,
    accent: "from-violet-500 to-indigo-600",
    techStack: ["Next.js", "Supabase", "Interactive Fiction"],
    i18n: {
      ko: {
        title: "6 Hours",
        tagline: "정치 스릴러 텍스트 어드벤처",
        description:
          "6시간 안에 결정해야 하는 정치 음모. 분기 트리 + 시간 압박 + 다중 엔딩. 각 선택은 영구 저장돼 다른 플레이어와 비교.",
      },
      en: {
        title: "6 Hours",
        tagline: "Political thriller text adventure",
        description:
          "A political conspiracy with a 6-hour decision deadline. Branching tree, time pressure, multi-endings, choice comparison.",
      },
    },
  },
  {
    id: "trade",
    category: "platform",
    hostType: "external",
    externalUrl: "https://github.com/h2techjun/trade",
    githubUrl: "https://github.com/h2techjun/trade",
    status: "wip",
    featured: false,
    order: 9,
    accent: "from-yellow-400 to-orange-500",
    techStack: ["FastAPI", "Next.js", "PostgreSQL", "AI"],
    i18n: {
      ko: {
        title: "AI Trade",
        tagline: "AI 보조 주식 트레이딩 시스템",
        description:
          "FastAPI 백엔드 + Next.js 대시보드. 실시간 시세·뉴스 NLP·전략 백테스트·자동 알림. 백엔드 라이브 데모는 비공개.",
      },
      en: {
        title: "AI Trade",
        tagline: "AI-assisted stock trading platform",
        description:
          "FastAPI backend + Next.js dashboard. Live quotes, news NLP, strategy backtesting, auto-alerts. Backend live demo private.",
      },
    },
  },
  {
    id: "strix",
    category: "lab",
    hostType: "external",
    externalUrl: "https://github.com/h2techjun/strix",
    githubUrl: "https://github.com/h2techjun/strix",
    status: "wip",
    featured: false,
    order: 10,
    accent: "from-slate-400 to-zinc-500",
    techStack: ["LangGraph", "Gemini", "CLI"],
    i18n: {
      ko: {
        title: "Strix",
        tagline: "자율 AI 오케스트레이터 — LangGraph 기반",
        description:
          "사용자가 한 줄 목표를 주면 계획·실행·검증·자가수정까지 자율 진행하는 LangGraph 에이전트. 도구 호출·기억·재시도 빌트인.",
      },
      en: {
        title: "Strix",
        tagline: "Autonomous AI orchestrator on LangGraph",
        description:
          "Give it a one-line goal — it plans, executes, verifies, self-corrects. Built-in tool calls, memory, retries.",
      },
    },
  },
];

/**
 * 카테고리별 표시 라벨 (UI 배지용).
 */
export const CATEGORY_LABEL: Record<ProjectCategory, Record<Locale, string>> = {
  game: { ko: "게임", en: "Game" },
  app: { ko: "앱", en: "App" },
  lab: { ko: "실험", en: "Lab" },
  tool: { ko: "도구", en: "Tool" },
  platform: { ko: "플랫폼", en: "Platform" },
};

export const STATUS_LABEL: Record<ProjectStatus, Record<Locale, string>> = {
  live: { ko: "운영중", en: "Live" },
  beta: { ko: "베타", en: "Beta" },
  wip: { ko: "개발중", en: "WIP" },
  archived: { ko: "아카이브", en: "Archived" },
};
