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
 * 탭 구분(`tab`):
 *   - "games"       — 게임 (K-Poker, Defense)
 *   - "experiences" — 체험형 인터랙티브 (Office Hunter, 6 Hours)
 *   - "services"    — 본격 SaaS / 플랫폼 (Hakrew)
 */

import type { Locale } from "@/i18n";

export type ProjectTab = "games" | "experiences" | "services";
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
    externalUrl: "https://h2techjun.github.io/k-poker/",
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
    },
  },

  // ─────────────────── 체험형 ───────────────────
  {
    id: "office-hunter",
    tab: "experiences",
    hostType: "external",
    externalUrl: "https://github.com/h2techjun/office-hunter",
    githubUrl: "https://github.com/h2techjun/office-hunter",
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
    },
  },
  {
    id: "6hours",
    tab: "experiences",
    hostType: "external",
    externalUrl: "https://github.com/h2techjun/6hours",
    githubUrl: "https://github.com/h2techjun/6hours",
    status: "wip",
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
    },
  },

  // ─────────────────── 서비스 ───────────────────
  {
    id: "hakrew",
    tab: "services",
    // 활성 사용자가 있는 SaaS — Supabase auth redirect URL 호환성 때문에 base-href 변경 위험.
    // 추후 별도 서브도메인(hakrew.workmate.tools) 으로 분리 권장.
    hostType: "external",
    externalUrl: "https://hakrew21.github.io/hakrew-web/",
    githubUrl: "https://github.com/h2techjun/hakrew",
    status: "live",
    order: 1,
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
          "All-in-one for solo academy owners. RBAC × students × teachers × payments × Gemini-powered counselor notes. Offline-first Hive + Supabase sync.",
      },
    },
  },
];

/**
 * 탭 표시 라벨 (UI).
 */
export const TAB_LABEL: Record<ProjectTab, Record<Locale, string>> = {
  games: { ko: "게임", en: "Games" },
  experiences: { ko: "체험", en: "Experiences" },
  services: { ko: "서비스", en: "Services" },
};

/**
 * 탭 짧은 설명 (탭 클릭 시 sub-heading).
 */
export const TAB_TAGLINE: Record<ProjectTab, Record<Locale, string>> = {
  games: {
    ko: "브라우저에서 바로 즐기는 모바일 게임",
    en: "Mobile games playable directly in your browser",
  },
  experiences: {
    ko: "사용자 참여형 인터랙티브 콘텐츠",
    en: "Interactive content built for participation",
  },
  services: {
    ko: "현장 실무를 풀어내는 본격 SaaS",
    en: "Production SaaS solving real operational pain",
  },
};

/**
 * 탭 표시 순서.
 */
export const TAB_ORDER: ReadonlyArray<ProjectTab> = [
  "games",
  "experiences",
  "services",
];

export const STATUS_LABEL: Record<ProjectStatus, Record<Locale, string>> = {
  live: { ko: "운영중", en: "Live" },
  beta: { ko: "베타", en: "Beta" },
  wip: { ko: "개발중", en: "WIP" },
  archived: { ko: "아카이브", en: "Archived" },
};
