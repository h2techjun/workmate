/**
 * 베트남어(vi) 완역 경로 레지스트리 — 단일 진실원.
 *
 * vi 는 부분 번역 로케일: 모든 페이지가 /vi 로 열리지만(미번역 = 영어 폴백),
 * **여기 등록된 경로만** 색인 대상이 된다:
 *   - sitemap.ts: vi URL 은 이 목록만 포함
 *   - lib/seo/alternates.ts: hreflang vi 는 이 목록만 방출
 *   - app/robots.ts: /vi/ 전체 Disallow + 이 목록만 Allow
 *
 * 새 도구의 vi 번역(페이지 분기 + 폼 + ToolGuide)이 끝나면 여기 한 줄 추가.
 * 반쪽 번역 페이지를 색인에 올리지 않기 위한 AdSense·중복콘텐츠 가드다.
 */

export const VI_READY_PATHS: readonly string[] = [
  "", // 홈 (공통 UI + 랜딩 네임스페이스 번역)
  "/net-salary",
  "/labor-calc/min-wage-monthly",
  "/labor-calc/severance",
  "/jeonse-wolse",
  "/deposit-risk",
  "/cost-of-living",
  "/remittance",
  "/korean-age",
  "/visa-days",
  "/foreign-health-insurance",
  "/pension-refund",
  "/foreign-flat-tax",
  // 웨이브2 — labor·부동산·유틸·사업자 10종 완역 (page+form+ToolGuide vi)
  "/unemployment-benefit",
  "/rent-cap",
  "/apartment-area",
  "/brokerage-fee",
  "/electric-bill",
  "/btu-calc",
  "/insurance-calc",
  "/guide/four-insurance",
  "/biznum-check",
  "/labor-calc/annual-leave",
  "/labor-calc/weekly-rest-pay",
  // 웨이브3 — 세금 11종 완역 (page+form+ToolGuide vi)
  "/income-tax",
  "/capital-gains-tax",
  "/loan-calc",
  "/compound-calc",
  "/vat-calc",
  "/freelancer-tax",
  "/foreign-stock-tax",
  "/gift-tax",
  "/prepayment-penalty",
  "/car-acquisition-tax",
  "/car-tax",
  // 웨이브3 — 변환·한국생활 10종 완역 (page+form+ToolGuide vi)
  "/area-convert",
  "/percent-calc",
  "/distance-convert",
  "/temp-convert",
  "/json-csv",
  "/school-grade",
  "/due-date",
  "/korean-number",
  "/hangul-decompose",
  "/text-romanize",
  // 웨이브3 — 비자·이름·생활 5종 (page/form 기완료 + ToolGuide vi)
  "/f2-residence-visa",
  "/d8-startup-visa",
  "/name-romanize",
  "/gift-money",
  "/voltage-guide",
  // 웨이브4 — GEO/신뢰 데이터 레지스트리 (registry 12항목 vi + 페이지 3-locale)
  "/data",
  // 웨이브5 — 전기 현장 가이드 (page 4-locale 완역)
  "/guide/wire-size",
  // blog/guide vi 4로케일 완성 (2026-07-10) — 허브 + blog 9 + guide 3 (four-insurance 기등록)
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
  // Phase 2 — 외국인 취업비자 국가별 허브 + 제도 심층 2종 (4로케일 완역)
  "/guide/foreign-work-visa-korea",
  "/guide/eps-e9-work-visa",
  "/guide/e7-professional-visa",
  // 한국인 해외여행 — 한국 여권 무비자/비자 국가별 (4로케일 완역)
  "/guide/korea-passport-visa-free",
  // 한글 타자 게임 랜딩 (4로케일 완역)
  "/korean-typing",
  // 가로세로 낱말퀴즈 게임 랜딩 (4로케일 완역)
  "/korean-crossword",
  // Phase 1 — 전기·목조·자재 25종 완역 (2026-07-12, 베트남 건설/제조 노동자 타깃)
  "/electric-calc",
  "/electric-calc/wire-size",
  "/electric-calc/breaker",
  "/electric-calc/voltage-drop",
  "/timber-calc",
  "/timber-calc/concrete",
  "/timber-calc/drywall",
  "/timber-calc/insulation",
  "/timber-calc/insulation-batt",
  "/timber-calc/lumber",
  "/timber-calc/material-quantity",
  "/timber-calc/osb",
  "/timber-calc/plywood",
  "/timber-calc/rafter",
  "/timber-calc/roof-area",
  "/timber-calc/roof-pitch",
  "/timber-calc/siding",
  "/timber-calc/span",
  "/timber-calc/stairs",
  "/timber-calc/studs",
  "/timber-calc/tile",
  "/paint-calc",
  "/gravel-calc",
  "/brick-calc",
  "/rebar-calc",
  "/wallpaper-calc",
  "/plaster-calc",
  "/deck-calc",
  "/size-convert",
  // 한국 명소 (attractions) — 4로케일 완역 (2026-07-13~)
  "/attractions",
  "/attractions/gyeongbokgung",
  "/attractions/haeundae-beach",
  "/attractions/n-seoul-tower",
  "/attractions/bukchon-hanok-village",
  "/attractions/seongsan-ilchulbong",
  "/attractions/jeonju-hanok-village",
  "/attractions/gamcheon-culture-village",
  "/attractions/changdeokgung",
  "/attractions/bulguksa",
  "/attractions/myeongdong",
  "/attractions/gwangjang-market",
  "/attractions/bukhansan",
  "/attractions/lotte-world-tower",
  "/attractions/hahoe-village",
  "/attractions/hyeopjae-beach",
  // 허브·진입점 — 4로케일 완역 완료(page 인라인 COPY/UI + messages), 색인 등록
  "/labor-calc",
  "/tools",
  "/games",
  "/tests",
  "/learn",
];

const SET = new Set(VI_READY_PATHS);

/** path 는 locale prefix 제외 (예: "/jeonse-wolse", 홈 = "") */
export function isViReady(path: string): boolean {
  const normalized = path === "/" ? "" : path;
  return SET.has(normalized);
}
