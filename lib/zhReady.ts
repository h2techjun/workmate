/**
 * 중국어(zh) 완역 경로 레지스트리 — 단일 진실원. (lib/viReady.ts 와 동일 패턴)
 *
 * zh 는 부분 번역 로케일: 모든 페이지가 /zh 로 열리지만(미번역 = 영어 폴백),
 * **여기 등록된 경로만** 색인 대상이 된다:
 *   - sitemap.ts: zh URL 은 이 목록만 포함
 *   - lib/seo/alternates.ts: hreflang zh 는 이 목록만 방출
 *   - app/robots.ts: /zh/ 전체 Disallow + 이 목록만 Allow
 *
 * 새 도구의 zh 번역(페이지 분기 + 폼 + ToolGuide)이 끝나면 여기 한 줄 추가.
 * 반쪽 번역 페이지를 색인에 올리지 않기 위한 AdSense·중복콘텐츠 가드다.
 */

export const ZH_READY_PATHS: readonly string[] = [
  "", // 홈 (공통 UI + home/layout 네임스페이스 zh 완역)
  // 웨이브2 배치1 — 연봉·근로 (labor)
  "/net-salary",
  "/labor-calc/annual-leave",
  "/labor-calc/weekly-rest-pay",
  "/labor-calc/severance",
  "/labor-calc/min-wage-monthly",
  "/insurance-calc",
  "/guide/four-insurance",
  "/unemployment-benefit",
  // 재무·세금 (tax)
  "/income-tax",
  "/foreign-flat-tax",
  "/capital-gains-tax",
  "/loan-calc",
  "/compound-calc",
  "/vat-calc",
  "/freelancer-tax",
  "/foreign-stock-tax",
  "/gift-tax",
  "/prepayment-penalty",
  // 부동산·임대 (realestate)
  "/rent-cap",
  "/apartment-area",
  "/jeonse-wolse",
  "/deposit-risk",
  "/brokerage-fee",
  // 전기 (electric)
  "/electric-calc",
  "/electric-calc/wire-size",
  "/electric-calc/breaker",
  "/electric-calc/voltage-drop",
  "/guide/wire-size",
  // 자동차 (car)
  "/car-acquisition-tax",
  "/car-tax",
  // 공과금 (utility)
  "/electric-bill",
  "/btu-calc",
  // 사업자 (business)
  "/biznum-check",
  // 변환 (convert)
  "/area-convert",
  "/distance-convert",
  "/temp-convert",
  "/percent-calc",
  "/json-csv",
  // 웨이브2 배치2 — 한국생활·외국인 (korea)
  "/korean-age",
  "/cost-of-living",
  "/remittance",
  "/visa-days",
  "/foreign-health-insurance",
  "/pension-refund",
  "/f2-residence-visa",
  "/d8-startup-visa",
  "/name-romanize",
  "/size-convert",
  "/text-romanize",
  "/korean-number",
  "/hangul-decompose",
  "/school-grade",
  "/voltage-guide",
  "/gift-money",
  "/due-date",
  // 목조주택·자재 (timber)
  "/timber-calc",
  "/timber-calc/tile",
  "/timber-calc/studs",
  "/timber-calc/drywall",
  "/timber-calc/plywood",
  "/timber-calc/osb",
  "/timber-calc/siding",
  "/timber-calc/insulation-batt",
  "/timber-calc/span",
  "/timber-calc/insulation",
  "/timber-calc/material-quantity",
  "/timber-calc/stairs",
  "/timber-calc/rafter",
  "/timber-calc/roof-pitch",
  "/timber-calc/roof-area",
  "/timber-calc/concrete",
  "/paint-calc",
  "/gravel-calc",
  "/deck-calc",
  "/timber-calc/lumber",
  // blog/guide zh 4로케일 완성 (2026-07-10) — 허브 + blog 9 + guide 3 (wire-size·four-insurance 기등록)
  "/blog",
  "/blog/korean-units-numbers-for-foreigners",
  "/blog/renting-in-korea-jeonse-wolse-guide",
  "/blog/living-in-korea-foreigner-guide",
  "/blog/essential-apps-korea-foreigners",
  "/blog/loan-30-vs-15-years",
  "/blog/income-tax-progressive-trap",
  "/blog/korean-pyeong-explained-for-foreigners",
  "/blog/korean-business-number-checksum",
  "/blog/rent-cap-tenant-checklist",
  "/guide",
  "/guide/biz-number",
  "/guide/insulation",
  "/guide/span",
  // 한글 타자 게임 랜딩 (4로케일 완역)
  "/korean-typing",
  // 가로세로 낱말퀴즈 게임 랜딩 (4로케일 완역)
  "/korean-crossword",
];

const SET = new Set(ZH_READY_PATHS);

/** path 는 locale prefix 제외 (예: "/jeonse-wolse", 홈 = "") */
export function isZhReady(path: string): boolean {
  const normalized = path === "/" ? "" : path;
  return SET.has(normalized);
}
