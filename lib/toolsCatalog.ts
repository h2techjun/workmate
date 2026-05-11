/**
 * 도구 카테고리 카탈로그 — /tools hub 페이지 단일 진실원.
 *
 * 큰 카테고리(`groupId`) 단위로 묶고, 각 그룹은 자체 hub 페이지(예: /electric-calc) 또는
 * 도구 직접 링크를 가진다. 헤더 메뉴 → /tools → 그룹 카드 → 그룹 hub or 도구 페이지.
 */

import type { Locale } from "@/i18n";

export type ToolGroupId =
  | "electric"
  | "timber"
  | "labor"
  | "tax"
  | "business"
  | "convert";

export interface ToolEntry {
  /** 표시 라벨 (i18n key 기반) */
  labelKo: string;
  labelEn: string;
  /** 단일 도구 페이지 링크 (locale prefix 제외) */
  href: string;
  /** 한 줄 검색 키워드 (검색량 큰 순) */
  keywordsKo: string;
}

export interface ToolGroup {
  id: ToolGroupId;
  /** 그룹 hub 페이지 (있으면 클릭 시 이동, 없으면 도구 첫 항목으로) */
  hubHref?: string;
  /** Tailwind 그라디언트 (카드 액센트) */
  accent: string;
  /** 카드 좌측 이모지 */
  emoji: string;
  /** 다국어 그룹 라벨·태그라인 */
  i18n: Record<Locale, { title: string; tagline: string }>;
  /** 포함 도구 목록 */
  tools: ReadonlyArray<ToolEntry>;
}

export const TOOL_GROUPS: ReadonlyArray<ToolGroup> = [
  {
    id: "labor",
    hubHref: "/labor-calc",
    accent: "from-emerald-500 to-teal-500",
    emoji: "💼",
    i18n: {
      ko: {
        title: "연봉 · 근로",
        tagline: "연봉 실수령액·연차·주휴수당·퇴직금 — 근로기준법 기반",
      },
      en: {
        title: "Payroll · Labor",
        tagline: "Salary take-home, annual leave, weekly rest pay, severance",
      },
    },
    tools: [
      { labelKo: "연차 계산기", labelEn: "Annual Leave", href: "/labor-calc/annual-leave", keywordsKo: "연차 발생 일수 미사용 수당" },
      { labelKo: "주휴수당 계산기", labelEn: "Weekly Rest Pay", href: "/labor-calc/weekly-rest-pay", keywordsKo: "주휴수당 단시간 근로자" },
      { labelKo: "퇴직금 계산기", labelEn: "Severance", href: "/labor-calc/severance", keywordsKo: "퇴직금 평균임금 통상임금" },
      { labelKo: "최저시급 → 월급", labelEn: "Min Wage → Monthly", href: "/labor-calc/min-wage-monthly", keywordsKo: "최저시급 월급 환산 209시간" },
      { labelKo: "4대보험 + 실수령액", labelEn: "4 Insurances + Net Pay", href: "/insurance-calc", keywordsKo: "4대보험 국민연금 건강보험 실수령액" },
    ],
  },
  {
    id: "tax",
    accent: "from-yellow-400 to-orange-500",
    emoji: "💰",
    i18n: {
      ko: {
        title: "세금",
        tagline: "부가세·해외주식 양도세 — 일반/간이과세 자동 분기",
      },
      en: {
        title: "Tax",
        tagline: "VAT, foreign stock capital gains, simplified taxation auto-routing",
      },
    },
    tools: [
      { labelKo: "부가세 계산기", labelEn: "VAT", href: "/vat-calc", keywordsKo: "부가세 공급가액 일반과세 간이과세" },
      { labelKo: "해외주식 양도세", labelEn: "Foreign Stock Tax", href: "/foreign-stock-tax", keywordsKo: "해외주식 양도세 22% 250만원 공제" },
    ],
  },
  {
    id: "electric",
    hubHref: "/electric-calc",
    accent: "from-indigo-500 to-purple-600",
    emoji: "⚡",
    i18n: {
      ko: {
        title: "전기 (KEC)",
        tagline: "전선 굵기·차단기·전압강하 — KEC/KS C IEC 60364 기반",
      },
      en: {
        title: "Electric (KEC)",
        tagline: "Wire size, breaker, voltage drop — Korean Electric Code standard",
      },
    },
    tools: [
      { labelKo: "전선 굵기 계산", labelEn: "Wire Size", href: "/electric-calc/wire-size", keywordsKo: "전선 굵기 단면적 KEC 232.5" },
      { labelKo: "차단기 용량", labelEn: "Breaker Capacity", href: "/electric-calc/breaker", keywordsKo: "차단기 MCB MCCB ELB 용량 선정" },
      { labelKo: "전압강하", labelEn: "Voltage Drop", href: "/electric-calc/voltage-drop", keywordsKo: "전압강하 내선규정 장거리 배선" },
    ],
  },
  {
    id: "timber",
    hubHref: "/timber-calc",
    accent: "from-amber-600 to-orange-700",
    emoji: "🏠",
    i18n: {
      ko: {
        title: "목조 주택 · 자재",
        tagline: "서까래·지붕·계단·단열·콘크리트·자재 수량 — NDS·건축법 기반",
      },
      en: {
        title: "Timber · Materials",
        tagline: "Rafter, roof, stairs, insulation, concrete, materials — NDS-based",
      },
    },
    tools: [
      { labelKo: "부재 경간", labelEn: "Span", href: "/timber-calc/span", keywordsKo: "장선 서까래 헤더 경간 휨 처짐" },
      { labelKo: "단열 R/U값", labelEn: "Insulation R/U", href: "/timber-calc/insulation", keywordsKo: "단열 열관류율 에너지절약 별표1" },
      { labelKo: "자재 수량 (종합)", labelEn: "Material Quantity", href: "/timber-calc/material-quantity", keywordsKo: "OSB 합판 석고 자재 수량" },
      { labelKo: "계단", labelEn: "Stairs", href: "/timber-calc/stairs", keywordsKo: "계단 단높이 단너비 Blondel" },
      { labelKo: "서까래 길이", labelEn: "Rafter", href: "/timber-calc/rafter", keywordsKo: "서까래 처마 길이 절단" },
      { labelKo: "지붕 경사", labelEn: "Roof Pitch", href: "/timber-calc/roof-pitch", keywordsKo: "지붕 경사 구배 변환" },
      { labelKo: "지붕 면적", labelEn: "Roof Area", href: "/timber-calc/roof-area", keywordsKo: "지붕 면적 처마 면적" },
      { labelKo: "콘크리트 부피", labelEn: "Concrete", href: "/timber-calc/concrete", keywordsKo: "콘크리트 줄기초 매트기초 레미콘 철근" },
      { labelKo: "목재 환산", labelEn: "Lumber Conversion", href: "/timber-calc/lumber", keywordsKo: "목재 才 재 board feet BF" },
    ],
  },
  {
    id: "business",
    accent: "from-sky-500 to-cyan-500",
    emoji: "🏢",
    i18n: {
      ko: {
        title: "사업자",
        tagline: "사업자등록번호 검증 — 오프라인 체크섬",
      },
      en: {
        title: "Business",
        tagline: "Business number validation — offline checksum",
      },
    },
    tools: [
      { labelKo: "사업자등록번호 검증", labelEn: "Business Number Validation", href: "/biznum-check", keywordsKo: "사업자번호 체크섬 검증" },
    ],
  },
  {
    id: "convert",
    accent: "from-rose-500 to-pink-500",
    emoji: "🔄",
    i18n: {
      ko: {
        title: "변환",
        tagline: "JSON ↔ CSV — 한글 인코딩(UTF-8 BOM) + Excel 호환",
      },
      en: {
        title: "Convert",
        tagline: "JSON ↔ CSV with Korean encoding (UTF-8 BOM) + Excel compatible",
      },
    },
    tools: [
      { labelKo: "JSON ↔ CSV", labelEn: "JSON ↔ CSV", href: "/json-csv", keywordsKo: "JSON CSV 변환 한글 BOM Excel" },
    ],
  },
];

/**
 * 카테고리 그룹 표시 순서 (검색량·실무 수요 순).
 */
export const TOOL_GROUP_ORDER: ReadonlyArray<ToolGroupId> = [
  "labor",
  "tax",
  "electric",
  "timber",
  "business",
  "convert",
];
