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
  | "realestate"
  | "car"
  | "korea"
  | "utility"
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
      { labelKo: "연봉 실수령액", labelEn: "Salary Take-Home", href: "/net-salary", keywordsKo: "연봉 실수령액 월급 세후 4대보험 공제 계산기" },
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
        title: "재무 · 세금",
        tagline: "복리 계산기·부가세·해외주식 양도세 — 재무 시뮬레이션 + 한국 세무",
      },
      en: {
        title: "Finance · Tax",
        tagline: "Compound interest, VAT, foreign stock capital gains",
      },
    },
    tools: [
      { labelKo: "종합소득세 계산", labelEn: "Income Tax", href: "/income-tax", keywordsKo: "종합소득세 누진세 8구간 세율표 누진공제 프리랜서" },
      { labelKo: "외국인 단일세율 vs 누진세", labelEn: "Foreign Flat Tax (19%)", href: "/foreign-flat-tax", keywordsKo: "외국인 단일세율 19% 소득세 누진세 비교 외국인 연말정산 flat tax foreigner" },
      { labelKo: "부동산 양도소득세", labelEn: "Capital Gains Tax", href: "/capital-gains-tax", keywordsKo: "양도소득세 부동산 양도세 장기보유특별공제 1세대1주택" },
      { labelKo: "대출 이자 계산", labelEn: "Loan Calculator", href: "/loan-calc", keywordsKo: "대출 이자 원리금균등 원금균등 만기일시 주담대" },
      { labelKo: "복리 계산기", labelEn: "Compound Interest", href: "/compound-calc", keywordsKo: "복리 예금 적금 CAGR 실효이율 EAR" },
      { labelKo: "부가세 계산기", labelEn: "VAT", href: "/vat-calc", keywordsKo: "부가세 공급가액 일반과세 간이과세" },
      { labelKo: "프리랜서 3.3%", labelEn: "Freelancer 3.3%", href: "/freelancer-tax", keywordsKo: "프리랜서 3.3 원천징수 사업소득 세금" },
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
      { labelKo: "타일 매수", labelEn: "Tile", href: "/timber-calc/tile", keywordsKo: "타일 매수 300x300 600x600 줄눈 본드" },
      { labelKo: "스터드(각목) 본수", labelEn: "Studs", href: "/timber-calc/studs", keywordsKo: "스터드 각목 본수 2x4 SPF 16인치 골조" },
      { labelKo: "석고보드 매수", labelEn: "Drywall", href: "/timber-calc/drywall", keywordsKo: "석고보드 매수 드라이월 12.5mm" },
      { labelKo: "합판 매수", labelEn: "Plywood", href: "/timber-calc/plywood", keywordsKo: "합판 매수 4x8 18mm" },
      { labelKo: "OSB 매수", labelEn: "OSB", href: "/timber-calc/osb", keywordsKo: "OSB 외벽 지붕 사싱" },
      { labelKo: "사이딩 매수", labelEn: "Siding", href: "/timber-calc/siding", keywordsKo: "사이딩 시멘트 외벽" },
      { labelKo: "단열재 두루마리", labelEn: "Insulation Batts", href: "/timber-calc/insulation-batt", keywordsKo: "단열재 그라스울 R19" },
      { labelKo: "부재 경간", labelEn: "Span", href: "/timber-calc/span", keywordsKo: "장선 서까래 헤더 경간 휨 처짐" },
      { labelKo: "단열 R/U값", labelEn: "Insulation R/U", href: "/timber-calc/insulation", keywordsKo: "단열 열관류율 에너지절약 별표1" },
      { labelKo: "자재 수량 (종합)", labelEn: "Material Quantity", href: "/timber-calc/material-quantity", keywordsKo: "OSB 합판 석고 자재 수량" },
      { labelKo: "계단", labelEn: "Stairs", href: "/timber-calc/stairs", keywordsKo: "계단 단높이 단너비 Blondel" },
      { labelKo: "서까래 길이", labelEn: "Rafter", href: "/timber-calc/rafter", keywordsKo: "서까래 처마 길이 절단" },
      { labelKo: "지붕 경사", labelEn: "Roof Pitch", href: "/timber-calc/roof-pitch", keywordsKo: "지붕 경사 구배 변환" },
      { labelKo: "지붕 면적", labelEn: "Roof Area", href: "/timber-calc/roof-area", keywordsKo: "지붕 면적 처마 면적" },
      { labelKo: "콘크리트 부피", labelEn: "Concrete", href: "/timber-calc/concrete", keywordsKo: "콘크리트 줄기초 매트기초 레미콘 철근" },
      { labelKo: "페인트 양", labelEn: "Paint", href: "/paint-calc", keywordsKo: "페인트 양 소요량 도장 면적 벽 페인트" },
      { labelKo: "자갈·골재", labelEn: "Gravel", href: "/gravel-calc", keywordsKo: "자갈 골재 부피 무게 모래 쇄석 수량" },
      { labelKo: "데크·울타리", labelEn: "Deck & Fence", href: "/deck-calc", keywordsKo: "데크 보드 울타리 장선 기둥 자재 수량" },
      { labelKo: "목재 환산", labelEn: "Lumber Conversion", href: "/timber-calc/lumber", keywordsKo: "목재 才 재 board feet BF" },
    ],
  },
  {
    id: "realestate",
    accent: "from-violet-500 to-fuchsia-500",
    emoji: "🏘️",
    i18n: {
      ko: {
        title: "부동산 · 임대",
        tagline: "임대료 5% 인상한도·환산보증금 — 주택임대차보호법 기반",
      },
      en: {
        title: "Real Estate · Rental",
        tagline: "Korean rent cap (5% renewal limit) verification",
      },
    },
    tools: [
      {
        labelKo: "임대료 5% 인상한도",
        labelEn: "Rent Cap (5%)",
        href: "/rent-cap",
        keywordsKo: "임대료 5% 전월세 인상한도 보증금 갱신요구권 주임법",
      },
    ],
  },
  {
    id: "korea",
    accent: "from-blue-500 to-cyan-500",
    emoji: "🇰🇷",
    i18n: {
      ko: {
        title: "한국 생활 · 외국인",
        tagline: "한국식 나이·이름 로마자·사이즈 변환 — 외국인·실생활 필수",
      },
      en: {
        title: "Korea Living · Foreigners",
        tagline: "Korean age, name romanizer, size converter — everyday essentials",
      },
    },
    tools: [
      { labelKo: "한국식 나이 계산", labelEn: "Korean Age", href: "/korean-age", keywordsKo: "한국 나이 만나이 세는나이 연나이" },
      { labelKo: "체류일수 (90일 비자)", labelEn: "Stay Days Tracker", href: "/visa-days", keywordsKo: "한국 체류일수 90일 무비자 만료일 비자" },
      { labelKo: "외국인 건강보험료", labelEn: "Health Insurance (NHIS)", href: "/foreign-health-insurance", keywordsKo: "외국인 건강보험료 유학생 지역가입자 NHIS 의료보험 foreigner health insurance" },
      { labelKo: "한글 이름 로마자", labelEn: "Name Romanizer", href: "/name-romanize", keywordsKo: "한글 이름 로마자 여권 영문 이름 변환" },
      { labelKo: "옷·신발 사이즈 변환", labelEn: "Size Converter", href: "/size-convert", keywordsKo: "한국 사이즈 신발 옷 US EU 변환" },
      { labelKo: "한글 문장 로마자", labelEn: "Korean Romanizer", href: "/text-romanize", keywordsKo: "한글 로마자 변환 문장 간판 메뉴 음역 한국어 영문" },
      { labelKo: "한글 숫자 읽기", labelEn: "Korean Numbers", href: "/korean-number", keywordsKo: "한글 숫자 한자어 고유어 수사 하나 둘 일 이 읽기" },
      { labelKo: "한글 음절 분해", labelEn: "Hangul Decomposer", href: "/hangul-decompose", keywordsKo: "한글 음절 분해 초성 중성 종성 받침 자모" },
      { labelKo: "한국 학년 계산", labelEn: "School Grade", href: "/school-grade", keywordsKo: "한국 학년 계산 출생연도 초등학교 입학 나이 몇 학년" },
      { labelKo: "한국 전압·플러그", labelEn: "Voltage & Plug", href: "/voltage-guide", keywordsKo: "한국 전압 220V 플러그 돼지코 변압기 여행 어댑터" },
      { labelKo: "축의금·부의금", labelEn: "Gift Money", href: "/gift-money", keywordsKo: "축의금 부의금 결혼식 경조사비 금액" },
      { labelKo: "출산예정일", labelEn: "Due Date", href: "/due-date", keywordsKo: "출산예정일 임신 주수 분만예정일 계산기" },
    ],
  },
  {
    id: "car",
    accent: "from-slate-500 to-zinc-600",
    emoji: "🚗",
    i18n: {
      ko: {
        title: "자동차 · 세금",
        tagline: "취득세·자동차세 — 차량 구매·보유 비용",
      },
      en: {
        title: "Car · Tax",
        tagline: "Acquisition & annual car tax — ownership costs",
      },
    },
    tools: [
      { labelKo: "자동차 취득세", labelEn: "Acquisition Tax", href: "/car-acquisition-tax", keywordsKo: "자동차 취득세 취등록세 차량 구매 세금" },
      { labelKo: "자동차세 (연간)", labelEn: "Annual Car Tax", href: "/car-tax", keywordsKo: "자동차세 배기량 차령 연간 자동차세" },
    ],
  },
  {
    id: "utility",
    accent: "from-amber-500 to-yellow-500",
    emoji: "💡",
    i18n: {
      ko: {
        title: "공과금 · 생활요금",
        tagline: "전기요금 누진제 — 한전 주택용 기준",
      },
      en: {
        title: "Utility Bills",
        tagline: "Korean electricity bill (KEPCO progressive tariff)",
      },
    },
    tools: [
      { labelKo: "전기요금 계산", labelEn: "Electricity Bill", href: "/electric-bill", keywordsKo: "전기요금 전기세 누진제 한전 여름 전기요금" },
      { labelKo: "에어컨 용량 (BTU)", labelEn: "BTU / AC Sizing", href: "/btu-calc", keywordsKo: "에어컨 용량 BTU 평형 냉방 계산기" },
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
        title: "변환 · 일상 계산",
        tagline: "평수 ↔ ㎡ · 퍼센트 · JSON↔CSV — 매일 쓰는 단순 도구",
      },
      en: {
        title: "Convert · Daily",
        tagline: "Pyeong ↔ m² · percent · JSON ↔ CSV — everyday quick tools",
      },
    },
    tools: [
      { labelKo: "평수 ↔ ㎡ ↔ 자²", labelEn: "Pyeong ↔ m²", href: "/area-convert", keywordsKo: "평수 계산 평 제곱미터 환산 부동산 면적" },
      { labelKo: "거리·길이 변환", labelEn: "Distance Converter", href: "/distance-convert", keywordsKo: "거리 길이 변환 미터 마일 자 리 보 km" },
      { labelKo: "온도 변환 (°C↔°F)", labelEn: "Temperature", href: "/temp-convert", keywordsKo: "온도 변환 섭씨 화씨 켈빈 °C °F" },
      { labelKo: "퍼센트 계산", labelEn: "Percent", href: "/percent-calc", keywordsKo: "퍼센트 할인 인상 변화율 마진" },
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
  "realestate",
  "car",
  "korea",
  "utility",
  "electric",
  "timber",
  "business",
  "convert",
];
