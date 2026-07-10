/**
 * K-생태계 크로스링크 — 계산기(툴) → 한국어 학습(Loopla /learn) + 생활 가이드·글(blog/guide).
 *
 * 툴↔툴 관련은 messages toolGuides.<key>.related(ToolGuide 렌더)가 이미 담당한다.
 * 여기는 그 갭 — "한국 실무 툴 → 한국어 학습 → 생활상식"을 잇는 K-생태계 연결만 담는다.
 *
 * 키 = ToolGuide toolKey(messages toolGuides 키). 값:
 *   - learn: Loopla 한국어 학습(/learn) 유도. 한글·한국생활 툴처럼 학습 연결이 자연스러운 것만 true.
 *   - reads: 관련 심화 글/가이드(blog·guide). **실제 관련성만**(억지 링크 금지).
 *     blog/guide 는 ko/en/zh/vi 4로케일 콘텐츠 → 라벨도 4로케일, 컴포넌트가 방문자 로케일로 노출.
 */
export interface CrossReads {
  href: string;
  ko: string;
  en: string;
  zh: string;
  vi: string;
}
export interface CrossLinkEntry {
  learn?: boolean;
  reads?: CrossReads[];
}

/** 블로그 9편 — 짧은 크로스링크 라벨(원 제목은 길어서 요약 라벨 사용) */
const BLOG = {
  units: {
    href: "/blog/korean-units-numbers-for-foreigners",
    ko: "한국 단위·숫자 완전 가이드",
    en: "Korean Units & Numbers Guide",
    zh: "韩国单位·数字完全指南",
    vi: "Cẩm nang đơn vị·số Hàn Quốc",
  },
  jeonse: {
    href: "/blog/renting-in-korea-jeonse-wolse-guide",
    ko: "전세·월세 임대 완전 가이드",
    en: "Jeonse & Wolse Renting Guide",
    zh: "全租·月租租房完全指南",
    vi: "Cẩm nang thuê nhà Jeonse & Wolse",
  },
  living: {
    href: "/blog/living-in-korea-foreigner-guide",
    ko: "외국인 한국 생활 완전 가이드",
    en: "Living in Korea: Full Guide",
    zh: "外国人韩国生活完全指南",
    vi: "Cẩm nang sống ở Hàn cho người nước ngoài",
  },
  apps: {
    href: "/blog/essential-apps-korea-foreigners",
    ko: "외국인 필수 앱 가이드",
    en: "Essential Apps in Korea",
    zh: "外国人必备App指南",
    vi: "Ứng dụng thiết yếu ở Hàn Quốc",
  },
  loan: {
    href: "/blog/loan-30-vs-15-years",
    ko: "주담대 30년 vs 15년",
    en: "Mortgage: 30y vs 15y",
    zh: "房贷30年 vs 15年",
    vi: "Vay mua nhà: 30 năm vs 15 năm",
  },
  incomeTax: {
    href: "/blog/income-tax-progressive-trap",
    ko: "종합소득세 누진세 오해 5가지",
    en: "Income Tax Bracket Myths",
    zh: "综合所得税累进税5大误解",
    vi: "5 hiểu lầm về thuế lũy tiến",
  },
  pyeong: {
    href: "/blog/korean-pyeong-explained-for-foreigners",
    ko: "평수 완전 이해 (84㎡=25평)",
    en: "Korean Pyeong Explained",
    zh: "坪数完全理解(84㎡=25坪)",
    vi: "Hiểu về pyeong (84㎡=25 pyeong)",
  },
  biznum: {
    href: "/blog/korean-business-number-checksum",
    ko: "사업자번호 체크섬 검증법",
    en: "Business Number Checksum",
    zh: "营业执照号校验法",
    vi: "Cách kiểm tra mã số doanh nghiệp",
  },
  rentCap: {
    href: "/blog/rent-cap-tenant-checklist",
    ko: "임대료 5% 인상 대응 7가지",
    en: "Rent-Cap Tenant Checklist",
    zh: "房租5%上限应对7要点",
    vi: "7 điều khi bị tăng giá thuê 5%",
  },
} as const;

/** 심화 가이드 5편 */
const GUIDE = {
  fourIns: {
    href: "/guide/four-insurance",
    ko: "4대보험 완전 분해 가이드",
    en: "4 Major Insurances Guide",
    zh: "四大保险完全解析指南",
    vi: "Hướng dẫn 4 bảo hiểm bắt buộc",
  },
  bizNum: {
    href: "/guide/biz-number",
    ko: "사업자등록번호 가이드",
    en: "Business Number Guide",
    zh: "营业执照号指南",
    vi: "Hướng dẫn mã số doanh nghiệp",
  },
  wireSize: {
    href: "/guide/wire-size",
    ko: "전선 굵기 선정 가이드",
    en: "Wire Size Selection Guide",
    zh: "电线线径选择指南",
    vi: "Hướng dẫn chọn tiết diện dây",
  },
  span: {
    href: "/guide/span",
    ko: "부재 경간 설계 가이드",
    en: "Structural Span Guide",
    zh: "构件跨度设计指南",
    vi: "Hướng dẫn thiết kế nhịp dầm",
  },
  insulation: {
    href: "/guide/insulation",
    ko: "단열 설계 가이드",
    en: "Insulation Design Guide",
    zh: "隔热设计指南",
    vi: "Hướng dẫn thiết kế cách nhiệt",
  },
} as const;

export const CROSS_LINKS: Record<string, CrossLinkEntry> = {
  // ── 노무·급여: 4대보험 가이드 ──
  "net-salary": { reads: [GUIDE.fourIns] },
  "insurance-calc": { reads: [GUIDE.fourIns] },
  // ── 세금·재무 ──
  "income-tax": { reads: [BLOG.incomeTax] },
  "freelancer-tax": { reads: [BLOG.incomeTax] },
  "foreign-flat-tax": { reads: [BLOG.living, BLOG.incomeTax] },
  "loan-calc": { reads: [BLOG.loan] },
  "prepayment-penalty": { reads: [BLOG.loan] },
  "biznum-check": { reads: [BLOG.biznum, GUIDE.bizNum] },
  // ── 부동산 ──
  "jeonse-wolse": { reads: [BLOG.jeonse, BLOG.rentCap] },
  "rent-cap": { reads: [BLOG.rentCap, BLOG.jeonse] },
  "deposit-risk": { reads: [BLOG.jeonse] },
  "brokerage-fee": { reads: [BLOG.jeonse] },
  "apartment-area": { reads: [BLOG.pyeong] },
  // ── 변환·한국생활 (학습 연결) ──
  "area-convert": { reads: [BLOG.pyeong, BLOG.units] },
  "distance-convert": { reads: [BLOG.units] },
  "temp-convert": { reads: [BLOG.units] },
  "korean-age": { learn: true, reads: [BLOG.units] },
  "korean-number": { learn: true, reads: [BLOG.units] },
  "hangul-decompose": { learn: true, reads: [BLOG.units] },
  "name-romanize": { learn: true, reads: [BLOG.units] },
  "text-romanize": { learn: true },
  "size-convert": { learn: true, reads: [BLOG.units] },
  "school-grade": { learn: true, reads: [BLOG.units] },
  "voltage-guide": { learn: true, reads: [BLOG.living] },
  // ── 외국인 비자·생활 ──
  "visa-days": { learn: true, reads: [BLOG.living] },
  "f2-residence-visa": { reads: [BLOG.living] },
  "d8-startup-visa": { reads: [BLOG.living] },
  "foreign-health-insurance": { reads: [BLOG.living] },
  "pension-refund": { reads: [BLOG.living] },
  "cost-of-living": { reads: [BLOG.living, BLOG.apps] },
  "remittance": { reads: [BLOG.living] },
  // ── 전기·건축: 심화 가이드 ──
  "electric-wire-size": { reads: [GUIDE.wireSize] },
  "electric-breaker": { reads: [GUIDE.wireSize] },
  "btu-calc": { reads: [GUIDE.insulation] },
  "timber-insulation": { reads: [GUIDE.insulation] },
  "timber-insulation-batt": { reads: [GUIDE.insulation] },
  "timber-span": { reads: [GUIDE.span] },
  "timber-rafter": { reads: [GUIDE.span] },
};
