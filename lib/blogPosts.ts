/**
 * 블로그 글 메타데이터 — /blog 인덱스 및 sitemap 단일 진실원.
 *
 * 본문은 각 글의 page.tsx 에 직접 작성 (MDX 도입 없이 JSX 로 자연스럽게).
 * 인덱스에서 메타만 사용. 새 글 추가 시 이 배열에 한 줄 추가하면 sitemap·
 * 인덱스 모두 자동 반영.
 */

/** 블로그 카테고리 — 외국인 니치(living·visa·business) + 한국 실무(tax·realestate·loan·labor·construction) */
export type BlogCategory =
  | "living"
  | "visa"
  | "business"
  | "tax"
  | "realestate"
  | "loan"
  | "labor"
  | "construction";

export interface BlogPost {
  slug: string;
  /** 발행일 (YYYY-MM-DD) — sitemap lastmod, 인덱스 정렬에 사용 */
  publishedAt: string;
  titleKo: string;
  titleEn: string;
  /** 인덱스 카드에 보일 1~2 문장 요약 */
  summaryKo: string;
  summaryEn: string;
  /** 카테고리 (한 글에 하나) */
  category: BlogCategory;
  /** 예상 읽기 시간 (분) */
  readingMinutes: number;
}

/** 카테고리 표시 라벨 (ko/en) — /blog 인덱스 섹션 헤더·카드 칩 */
export const CATEGORY_LABELS: Record<BlogCategory, { ko: string; en: string }> = {
  living: { ko: "한국 생활 · 외국인", en: "Living in Korea" },
  visa: { ko: "비자 · 체류", en: "Visa & Stay" },
  business: { ko: "창업 · 사업", en: "Business & Startup" },
  tax: { ko: "세금 · 재무", en: "Tax & Finance" },
  realestate: { ko: "부동산 · 임대", en: "Real Estate" },
  loan: { ko: "대출", en: "Loans" },
  labor: { ko: "근로 · 급여", en: "Work & Payroll" },
  construction: { ko: "건축 · 자재", en: "Construction" },
};

/** 섹션 노출 순서 — 외국인 니치 우선 */
export const CATEGORY_ORDER: ReadonlyArray<BlogCategory> = [
  "living",
  "visa",
  "business",
  "tax",
  "realestate",
  "loan",
  "labor",
  "construction",
];

export const BLOG_POSTS: ReadonlyArray<BlogPost> = [
  {
    slug: "essential-apps-korea-foreigners",
    publishedAt: "2026-06-16",
    titleKo: "한국 사는 외국인 필수 앱 — 본인인증 장벽부터 가입 팁까지",
    titleEn: "Essential Apps for Living in Korea as a Foreigner (2026)",
    summaryKo:
      "카카오톡·네이버지도·토스·배민… 어떤 앱이 외국 번호·외국 카드·외국인등록증 없이 되는지, 한국식 본인인증(PASS) 장벽을 넘는 법까지 카테고리별로 정리했습니다.",
    summaryEn:
      "Which Korean apps work without a Korean number, a foreign card, or an ARC — and how to clear the PASS identity-verification wall. Category by category, with sign-up tips.",
    category: "living",
    readingMinutes: 11,
  },
  {
    slug: "loan-30-vs-15-years",
    publishedAt: "2026-05-23",
    titleKo: "주담대 30년 vs 15년, 정말 30년이 손해일까",
    titleEn: "Korean Mortgage: 30-year vs 15-year — Is the longer term really a loss?",
    summaryKo:
      "총 이자만 보면 15년이 한참 적습니다. 그런데 30년을 선택하는 사람이 훨씬 많죠. 현금흐름·인플레이션·재투자 기회까지 같이 보면 정답이 달라집니다.",
    summaryEn:
      "Total interest is much lower for 15-year. Yet most people choose 30-year. Once you factor cash flow, inflation, and reinvestment, the math changes.",
    category: "loan",
    readingMinutes: 8,
  },
  {
    slug: "income-tax-progressive-trap",
    publishedAt: "2026-05-23",
    titleKo: "종합소득세 누진세에서 가장 자주 헷갈리는 5가지",
    titleEn: "5 most common confusions in Korean progressive income tax",
    summaryKo:
      "구간을 한 번 넘으면 더 많이 번 게 손해가 된다, 누진공제는 환급이다 — 이런 오해 5개를 실제 사례로 풀어봅니다.",
    summaryEn:
      "“Crossing a bracket means you earned less in the end” and other myths — debunked with actual numbers.",
    category: "tax",
    readingMinutes: 7,
  },
  {
    slug: "korean-pyeong-explained-for-foreigners",
    publishedAt: "2026-05-30",
    titleKo: "외국인을 위한 평수 가이드 — 84㎡가 왜 25평일까",
    titleEn: "Korean Pyeong, Explained — Why 84㎡ is Called 25-Pyeong",
    summaryKo:
      "한국 부동산 매물 표기의 평수가 어떻게 ㎡와 매핑되는지, 전용·공급·계약 면적의 차이까지.",
    summaryEn:
      "Why Korean real estate uses pyeong alongside m², how 84㎡ maps to 25-pyeong, and what exclusive vs supply vs contract area really mean.",
    category: "realestate",
    readingMinutes: 7,
  },
  {
    slug: "korean-business-number-checksum",
    publishedAt: "2026-05-30",
    titleKo: "사업자등록번호 체크섬 — 거래 전 1초 검증법",
    titleEn: "Korean Business Registration Number — What the Checksum Tells You",
    summaryKo: "10자리 사업자번호의 1-3-7 가중치 검산법. 가짜 번호·오타를 거래 전에 잡는 방법.",
    summaryEn:
      "The 1-3-7 weighted checksum that catches fake or mistyped Korean business numbers before you sign or wire money.",
    category: "tax",
    readingMinutes: 6,
  },
  {
    slug: "rent-cap-tenant-checklist",
    publishedAt: "2026-05-23",
    titleKo: "임대료 5% 인상 통보를 받았을 때 즉시 해야 할 7가지",
    titleEn: "Got a Korean rent increase over 5%? 7 things to do immediately",
    summaryKo:
      "임대인이 갱신 시점에 6% 인상을 통보했다면. 임차인이 손해 보지 않기 위해 순서대로 해야 할 7가지를 정리했습니다.",
    summaryEn:
      "If your Korean landlord proposes a 6% renewal increase, here are the 7 steps a tenant should take, in order.",
    category: "realestate",
    readingMinutes: 6,
  },
];

export function findPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((p) => p.slug === slug);
}

/**
 * 인덱스 정렬 — 최신 글이 위에 오도록.
 */
export function sortedBlogPosts(): ReadonlyArray<BlogPost> {
  return [...BLOG_POSTS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

/**
 * 카테고리별 그룹 — CATEGORY_ORDER 순, 각 그룹 내 최신순.
 * 글이 있는 카테고리만 반환 (빈 섹션 방지).
 */
export function postsByCategory(): Array<{
  category: BlogCategory;
  posts: BlogPost[];
}> {
  return CATEGORY_ORDER.map((category) => ({
    category,
    posts: BLOG_POSTS.filter((p) => p.category === category).sort((a, b) =>
      b.publishedAt.localeCompare(a.publishedAt),
    ),
  })).filter((group) => group.posts.length > 0);
}
