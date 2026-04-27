/**
 * 모든 도구의 메타데이터 중앙 레지스트리.
 * 홈 검색·sitemap·navigation 등에서 단일 진실원으로 사용.
 */

export type ToolCategory =
  | "electric"
  | "timber"
  | "finance"
  | "util"
  | "business";

export type ToolStatus = "available" | "comingSoon";

export interface ToolMeta {
  /** URL slug (locale 제외, 선행 / 포함) */
  path: string;
  category: ToolCategory;
  status: ToolStatus;
  /** i18n 키 (homeSearch.tools.{key}.title|description|keywords) */
  i18nKey: string;
}

export const TOOLS: ReadonlyArray<ToolMeta> = [
  // Electric
  {
    path: "/electric-calc/wire-size",
    category: "electric",
    status: "available",
    i18nKey: "wireSize",
  },
  {
    path: "/electric-calc/breaker",
    category: "electric",
    status: "available",
    i18nKey: "breaker",
  },
  {
    path: "/electric-calc/voltage-drop",
    category: "electric",
    status: "available",
    i18nKey: "voltageDrop",
  },
  // Timber
  {
    path: "/timber-calc/span",
    category: "timber",
    status: "available",
    i18nKey: "span",
  },
  {
    path: "/timber-calc/insulation",
    category: "timber",
    status: "available",
    i18nKey: "insulation",
  },
  {
    path: "/timber-calc/material-quantity",
    category: "timber",
    status: "available",
    i18nKey: "materialQuantity",
  },
  {
    path: "/timber-calc/stairs",
    category: "timber",
    status: "available",
    i18nKey: "stairs",
  },
  {
    path: "/timber-calc/rafter",
    category: "timber",
    status: "available",
    i18nKey: "rafter",
  },
  {
    path: "/timber-calc/roof-pitch",
    category: "timber",
    status: "available",
    i18nKey: "roofPitch",
  },
  {
    path: "/timber-calc/roof-area",
    category: "timber",
    status: "available",
    i18nKey: "roofArea",
  },
  {
    path: "/timber-calc/concrete",
    category: "timber",
    status: "available",
    i18nKey: "concrete",
  },
  {
    path: "/timber-calc/lumber",
    category: "timber",
    status: "available",
    i18nKey: "lumber",
  },
  // Finance
  {
    path: "/insurance-calc",
    category: "finance",
    status: "available",
    i18nKey: "insurance",
  },
  {
    path: "/foreign-stock-tax",
    category: "finance",
    status: "available",
    i18nKey: "foreignStockTax",
  },
  // Util
  {
    path: "/json-csv",
    category: "util",
    status: "available",
    i18nKey: "jsonCsv",
  },
  // Business
  {
    path: "/biznum-check",
    category: "business",
    status: "available",
    i18nKey: "bizNumber",
  },
];
