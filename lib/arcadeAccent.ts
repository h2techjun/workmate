/**
 * 도구 카테고리 → 아케이드 accent 색 자동 매핑.
 *
 * 결과 카드(ResultShell/HeroResult/ShareResultCard)가 usePathname 으로 카테고리를
 * 판별해 그 색으로 물들게 한다 → 71개 계산기를 개별 수정하지 않고 색을 배정.
 * 설계 계약: CLAUDE.md "🕹️ 다크 아케이드 퍼즐 디자인 시스템".
 */

import { TOOL_GROUPS, type ToolGroupId } from "@/lib/toolsCatalog";

/** 절제된 캔디 팔레트 6색 (다크 배경 기준 비비드) */
export type ArcadeAccent =
  | "indigo"
  | "emerald"
  | "violet"
  | "amber"
  | "rose"
  | "cyan";

/** accent 색 이름 → hex (타일 글로우·상단 바·hero 글로우 공용) */
export const ACCENT_HEX: Record<ArcadeAccent, string> = {
  indigo: "#818cf8",
  emerald: "#34d399",
  violet: "#a78bfa",
  amber: "#fbbf24",
  rose: "#fb7185",
  cyan: "#22d3ee",
};

/** 카테고리별 테마색 — 인접 카테고리가 안 겹치도록 6색 배정 */
const GROUP_ACCENT: Record<ToolGroupId, ArcadeAccent> = {
  labor: "emerald",
  tax: "amber",
  realestate: "cyan",
  electric: "violet",
  timber: "amber",
  car: "indigo",
  korea: "rose",
  utility: "indigo",
  business: "violet",
  convert: "cyan",
};

const LOCALE_PREFIX = /^\/(?:ko|en|zh|vi)(?=\/|$)/;

/**
 * pathname(로케일 포함)에서 도구 카테고리를 찾아 accent 색을 반환.
 * 정확한 도구 href 우선 → 그룹 hub 하위 경로 → 미매칭 시 indigo.
 */
export function accentFromPath(pathname: string): ArcadeAccent {
  const path = pathname.replace(LOCALE_PREFIX, "") || "/";

  for (const group of TOOL_GROUPS) {
    if (group.tools.some((tool) => tool.href === path)) {
      return GROUP_ACCENT[group.id];
    }
  }
  for (const group of TOOL_GROUPS) {
    if (
      group.hubHref &&
      (path === group.hubHref || path.startsWith(`${group.hubHref}/`))
    ) {
      return GROUP_ACCENT[group.id];
    }
  }
  return "indigo";
}
