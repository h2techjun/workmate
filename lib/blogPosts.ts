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
  titleZh: string;
  titleVi: string;
  /** 인덱스 카드에 보일 1~2 문장 요약 */
  summaryKo: string;
  summaryEn: string;
  summaryZh: string;
  summaryVi: string;
  /** 카테고리 (한 글에 하나) */
  category: BlogCategory;
  /** 예상 읽기 시간 (분) */
  readingMinutes: number;
  /** 글 하단에 표시되는 태그 (각 5개) */
  tags: {
    ko: string[];
    en: string[];
    zh: string[];
    vi: string[];
  };
}

/** 카테고리 표시 라벨 (ko/en/zh/vi) — /blog 인덱스 섹션 헤더·카드 칩 */
export const CATEGORY_LABELS: Record<BlogCategory, { ko: string; en: string; zh: string; vi: string }> = {
  living: { ko: "한국 생활 · 외국인", en: "Living in Korea", zh: "韩国生活·外国人", vi: "Cuộc sống tại Hàn Quốc" },
  visa: { ko: "비자 · 체류", en: "Visa & Stay", zh: "签证·居留", vi: "Visa & Lưu trú" },
  business: { ko: "창업 · 사업", en: "Business & Startup", zh: "创业·经营", vi: "Kinh doanh & Khởi nghiệp" },
  tax: { ko: "세금 · 재무", en: "Tax & Finance", zh: "税务·财务", vi: "Thuế & Tài chính" },
  realestate: { ko: "부동산 · 임대", en: "Real Estate", zh: "房地产·租赁", vi: "Bất động sản" },
  loan: { ko: "대출", en: "Loans", zh: "贷款", vi: "Vay vốn" },
  labor: { ko: "근로 · 급여", en: "Work & Payroll", zh: "工作·薪资", vi: "Việc làm & Lương" },
  construction: { ko: "건축 · 자재", en: "Construction", zh: "建筑·建材", vi: "Xây dựng" },
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
    slug: "korean-units-numbers-for-foreigners",
    publishedAt: "2026-06-30",
    titleKo: "외국인을 위한 한국 단위·숫자 완전 가이드 — 평·만나이·사이즈·거리·온도",
    titleEn:
      "Korean Units & Numbers for Foreigners: Pyeong, Age, Sizes, Distance & More",
    titleZh: "外国人韩国单位数字完全指南——坪数·周岁·尺码·距离·温度",
    titleVi:
      "Hướng dẫn đầy đủ về đơn vị và số của Hàn Quốc cho người nước ngoài: Pyeong, tuổi thật, kích cỡ, khoảng cách",
    summaryKo:
      "한국에서 마주치는 헷갈리는 단위와 숫자를 한 곳에 정리했습니다 — 평(면적), 만 나이·학년, 옷·신발 사이즈(US↔한국), 거리(리·마일↔km), 온도(℉↔℃), 사업자등록번호까지. 각 항목마다 즉시 변환 도구 연결.",
    summaryEn:
      "Every confusing Korean unit and number in one place — pyeong (area), Korean age & school grade, clothing/shoe sizes (US ↔ Korea), distance (ri/miles ↔ km), temperature (°F ↔ °C), and the business registration number. Each with a free instant-conversion tool.",
    summaryZh:
      "在韩国生活会遇到的各种令人困惑的单位和数字，这里一次讲清楚——坪(面积单位)、周岁与学年对照、服装鞋码(美码↔韩码)、距离(里·英里↔公里)、温度(华氏↔摄氏)，还有营业执照号。每一项都配有免费的即时换算工具。",
    summaryVi:
      "Tổng hợp mọi đơn vị và con số dễ gây nhầm lẫn khi sống ở Hàn Quốc — pyeong (diện tích), tuổi thật theo luật Hàn Quốc & khối lớp, kích cỡ quần áo/giày (Mỹ ↔ Hàn), khoảng cách (dặm ↔ km), nhiệt độ (°F ↔ °C), và mã số doanh nghiệp. Mỗi mục đều có công cụ quy đổi tức thì miễn phí.",
    category: "living",
    readingMinutes: 10,
    tags: {
      ko: ["평 변환", "만 나이", "한국 사이즈", "거리 변환", "외국인 한국생활"],
      en: ["pyeong", "korean age", "korea sizes", "unit conversion", "living in korea"],
      zh: ["坪换算", "周岁计算", "韩国尺码", "单位换算", "韩国生活"],
      vi: ["quy đổi pyeong", "tuổi thật Hàn Quốc", "size Hàn Quốc", "quy đổi đơn vị", "sống ở Hàn Quốc"],
    },
  },
  {
    slug: "renting-in-korea-jeonse-wolse-guide",
    publishedAt: "2026-06-18",
    titleKo: "외국인을 위한 한국 임대 가이드 — 전세·월세·보증금 지키기",
    titleEn: "Renting in Korea as a Foreigner: Jeonse, Wolse, Deposits & Your Rights",
    titleZh: "外国人韩国租房指南——全租房(Jeonse)·月租(Wolse)与押金保护",
    titleVi:
      "Hướng dẫn thuê nhà ở Hàn Quốc cho người nước ngoài: Jeonse, Wolse và cách bảo vệ tiền cọc",
    summaryKo:
      "전세와 월세의 차이, 전월세전환율, 2022~2023 전세사기에서 보증금을 지키는 법, 그리고 외국인이 꼭 알아야 할 '체류지 변경신고' 함정까지. 계약 전 단계별 체크리스트와 함께.",
    summaryEn:
      "Jeonse vs wolse, the conversion rate, how to protect your deposit after the 2022–2023 fraud wave, and the change-of-residence-report trap every foreign tenant must know — with a step-by-step pre-signing checklist.",
    summaryZh:
      "全租房(Jeonse)和月租(Wolse)的区别、转换利率怎么算、如何在2022-2023年全租房诈骗高发之后保护押金，以及外国人必须知道的居留地变更申报陷阱——附签约前分步核查清单。",
    summaryVi:
      "Sự khác biệt giữa Jeonse (đặt cọc trọn gói) và Wolse (tiền thuê hàng tháng), tỷ lệ quy đổi tiền thuê, cách bảo vệ tiền cọc sau làn sóng lừa đảo Jeonse 2022-2023, và cạm bẫy khai báo thay đổi nơi cư trú mà mọi người nước ngoài thuê nhà cần biết — kèm danh sách kiểm tra từng bước trước khi ký hợp đồng.",
    category: "realestate",
    readingMinutes: 12,
    tags: {
      ko: ["전세", "월세", "보증금", "전세사기", "외국인 임대"],
      en: ["Jeonse", "Wolse", "Deposit", "Rental Fraud", "Foreign Tenant"],
      zh: ["全租房", "月租", "押金", "全租房诈骗", "外国人租房"],
      vi: ["Jeonse", "Wolse", "tiền cọc", "lừa đảo Jeonse", "người nước ngoài thuê nhà"],
    },
  },
  {
    slug: "living-in-korea-foreigner-guide",
    publishedAt: "2026-06-17",
    titleKo: "한국 사는 외국인 완전 가이드 — 도착부터 출국까지 돈·비자·행정",
    titleEn: "Living in Korea as a Foreigner: The Complete Money, Visa & Admin Guide (2026)",
    titleZh: "在韩外国人完全生活指南——从入境到离境的金钱·签证·行政手续(2026)",
    titleVi:
      "Hướng dẫn toàn diện cho người nước ngoài sống tại Hàn Quốc: Tiền bạc, Visa & Thủ tục hành chính (2026)",
    summaryKo:
      "도착(ARC·뱅킹)→정착(전월세·건강보험)→근로/세금(연말정산·단일세율)→장기체류(F-2-7·D-8)→출국(국민연금 반환). 한국 생활 전 여정을 단계별로, 무료 계산기·체크리스트와 함께 정리했습니다.",
    summaryEn:
      "Arrival (ARC, banking) → settling (rent, health insurance) → work & tax (year-end, flat tax) → staying (F-2-7, D-8) → leaving (pension refund). The whole journey of living in Korea, step by step, with free calculators and checklists.",
    summaryZh:
      "入境(外国人登录证ARC·银行开户)→定居(租房·健康保险)→工作与税务(年末结算·单一税率)→长期居留(F-2-7·D-8)→离境(国民年金返还)。按阶段梳理在韩生活全流程，附免费计算器和核查清单。",
    summaryVi:
      "Nhập cảnh (ARC, mở tài khoản ngân hàng) → ổn định (thuê nhà, bảo hiểm y tế) → làm việc & thuế (quyết toán cuối năm, thuế suất cố định) → lưu trú dài hạn (F-2-7, D-8) → xuất cảnh (hoàn trả lương hưu quốc dân). Toàn bộ hành trình sống tại Hàn Quốc theo từng giai đoạn, kèm công cụ tính toán và danh sách kiểm tra miễn phí.",
    category: "living",
    readingMinutes: 14,
    tags: {
      ko: ["외국인등록증", "한국 생활", "건강보험", "비자", "국민연금 반환"],
      en: ["ARC", "Living in Korea", "Health Insurance", "Visa", "Pension Refund"],
      zh: ["外国人登录证", "韩国生活", "健康保险", "签证", "国民年金返还"],
      vi: ["thẻ ARC", "sống ở Hàn Quốc", "bảo hiểm y tế", "visa Hàn Quốc", "hoàn trả lương hưu"],
    },
  },
  {
    slug: "essential-apps-korea-foreigners",
    publishedAt: "2026-06-16",
    titleKo: "한국 사는 외국인 필수 앱 — 본인인증 장벽부터 가입 팁까지",
    titleEn: "Essential Apps for Living in Korea as a Foreigner (2026)",
    titleZh: "在韩外国人必备App——从实名认证门槛到注册技巧(2026)",
    titleVi:
      "Ứng dụng thiết yếu cho người nước ngoài sống tại Hàn Quốc: Từ rào cản xác thực danh tính đến mẹo đăng ký (2026)",
    summaryKo:
      "카카오톡·네이버지도·토스·배민… 어떤 앱이 외국 번호·외국 카드·외국인등록증 없이 되는지, 한국식 본인인증(PASS) 장벽을 넘는 법까지 카테고리별로 정리했습니다.",
    summaryEn:
      "Which Korean apps work without a Korean number, a foreign card, or an ARC — and how to clear the PASS identity-verification wall. Category by category, with sign-up tips.",
    summaryZh:
      "KakaoTalk、Naver地图、Toss、Baemin……哪些App不需要韩国手机号、外国卡或外国人登录证也能用，以及如何跨过韩国式实名认证(PASS)这道门槛——按类别整理，附注册技巧。",
    summaryVi:
      "KakaoTalk, Naver Map, Toss, Baemin... ứng dụng nào dùng được mà không cần số điện thoại Hàn, thẻ nước ngoài hay thẻ ARC, và cách vượt qua rào cản xác thực danh tính kiểu Hàn Quốc (PASS). Tổng hợp theo từng nhóm, kèm mẹo đăng ký.",
    category: "living",
    readingMinutes: 11,
    tags: {
      ko: ["카카오톡", "토스", "본인인증", "외국인 앱", "PASS 인증"],
      en: ["KakaoTalk", "Toss", "Identity Verification", "Korea Apps", "PASS Auth"],
      zh: ["KakaoTalk", "Toss", "实名认证", "韩国生活App", "PASS认证"],
      vi: ["KakaoTalk", "Toss", "xác thực danh tính", "ứng dụng Hàn Quốc", "xác thực PASS"],
    },
  },
  {
    slug: "loan-30-vs-15-years",
    publishedAt: "2026-05-23",
    titleKo: "주담대 30년 vs 15년, 정말 30년이 손해일까",
    titleEn: "Korean Mortgage: 30-year vs 15-year — Is the longer term really a loss?",
    titleZh: "房贷30年 vs 15年，选30年真的吃亏吗",
    titleVi:
      "Vay thế chấp Hàn Quốc: 30 năm hay 15 năm — Chọn kỳ hạn dài hơn có thực sự thiệt hơn?",
    summaryKo:
      "총 이자만 보면 15년이 한참 적습니다. 그런데 30년을 선택하는 사람이 훨씬 많죠. 현금흐름·인플레이션·재투자 기회까지 같이 보면 정답이 달라집니다.",
    summaryEn:
      "Total interest is much lower for 15-year. Yet most people choose 30-year. Once you factor cash flow, inflation, and reinvestment, the math changes.",
    summaryZh:
      "只看总利息，15年期明显更少。但选择30年期的人反而更多。把现金流、通货膨胀、再投资机会都算进去，答案就不一样了。",
    summaryVi:
      "Nếu chỉ nhìn tổng lãi suất, kỳ hạn 15 năm rẻ hơn rất nhiều. Nhưng phần lớn người vay lại chọn 30 năm. Khi tính thêm dòng tiền, lạm phát và cơ hội tái đầu tư, đáp án sẽ khác đi.",
    category: "loan",
    readingMinutes: 8,
    tags: {
      ko: ["주담대", "대출 기간", "총이자", "조기상환", "현금흐름"],
      en: ["Mortgage", "Loan Term", "Total Interest", "Prepayment", "Cash Flow"],
      zh: ["房贷", "贷款期限", "总利息", "提前还款", "现金流"],
      vi: ["vay thế chấp", "kỳ hạn vay", "tổng lãi suất", "trả nợ trước hạn", "dòng tiền"],
    },
  },
  {
    slug: "income-tax-progressive-trap",
    publishedAt: "2026-05-23",
    titleKo: "종합소득세 누진세에서 가장 자주 헷갈리는 5가지",
    titleEn: "5 most common confusions in Korean progressive income tax",
    titleZh: "综合所得税累进税制最容易搞混的5件事",
    titleVi: "5 hiểu lầm phổ biến nhất về thuế thu nhập lũy tiến ở Hàn Quốc",
    summaryKo:
      "구간을 한 번 넘으면 더 많이 번 게 손해가 된다, 누진공제는 환급이다 — 이런 오해 5개를 실제 사례로 풀어봅니다.",
    summaryEn:
      "“Crossing a bracket means you earned less in the end” and other myths — debunked with actual numbers.",
    summaryZh:
      "跨过税率区间就等于多赚反而更吃亏、累进扣除额就是退税——这5个常见误解，用实际数字拆解验证。",
    summaryVi:
      "Hiểu lầm rằng vượt qua một bậc thuế sẽ khiến thu nhập thực nhận giảm đi, hay khoản khấu trừ lũy tiến chính là tiền hoàn thuế — 5 ngộ nhận phổ biến được giải thích bằng số liệu thực tế.",
    category: "tax",
    readingMinutes: 7,
    tags: {
      ko: ["종합소득세", "누진세", "세율 구간", "과세표준", "연말정산"],
      en: ["Income Tax", "Progressive Tax", "Tax Bracket", "Taxable Base", "Year-End Settlement"],
      zh: ["综合所得税", "累进税制", "税率区间", "课税标准", "年末结算"],
      vi: ["thuế thu nhập", "thuế lũy tiến", "bậc thuế", "cơ sở tính thuế", "quyết toán cuối năm"],
    },
  },
  {
    slug: "korean-pyeong-explained-for-foreigners",
    publishedAt: "2026-05-30",
    titleKo: "외국인을 위한 평수 가이드 — 84㎡가 왜 25평일까",
    titleEn: "Korean Pyeong, Explained — Why 84㎡ is Called 25-Pyeong",
    titleZh: "写给外国人的坪数指南——84㎡为什么叫25坪",
    titleVi: "Giải thích đơn vị Pyeong của Hàn Quốc — Vì sao 84㎡ được gọi là 25 pyeong",
    summaryKo:
      "한국 부동산 매물 표기의 평수가 어떻게 ㎡와 매핑되는지, 전용·공급·계약 면적의 차이까지.",
    summaryEn:
      "Why Korean real estate uses pyeong alongside m², how 84㎡ maps to 25-pyeong, and what exclusive vs supply vs contract area really mean.",
    summaryZh:
      "韩国房产标示的坪数是如何对应㎡的，以及专用面积、供给面积、合同面积之间的区别。",
    summaryVi:
      "Cách diện tích pyeong trong bất động sản Hàn Quốc quy đổi sang m², và sự khác biệt giữa diện tích sử dụng riêng, diện tích cung cấp và diện tích hợp đồng.",
    category: "realestate",
    readingMinutes: 7,
    tags: {
      ko: ["평수", "전용면적", "공급면적", "아파트 크기", "84m2"],
      en: ["Pyeong", "Exclusive Area", "Supply Area", "Apartment Size", "84m2"],
      zh: ["坪数", "专用面积", "供给面积", "公寓面积", "84m2"],
      vi: ["pyeong", "diện tích sử dụng riêng", "diện tích cung cấp", "diện tích căn hộ", "84m2"],
    },
  },
  {
    slug: "korean-business-number-checksum",
    publishedAt: "2026-05-30",
    titleKo: "사업자등록번호 체크섬 — 거래 전 1초 검증법",
    titleEn: "Korean Business Registration Number — What the Checksum Tells You",
    titleZh: "营业执照号校验码——交易前1秒验证法",
    titleVi:
      "Số kiểm tra mã số doanh nghiệp Hàn Quốc — Cách xác minh trong 1 giây trước giao dịch",
    summaryKo: "10자리 사업자번호의 1-3-7 가중치 검산법. 가짜 번호·오타를 거래 전에 잡는 방법.",
    summaryEn:
      "The 1-3-7 weighted checksum that catches fake or mistyped Korean business numbers before you sign or wire money.",
    summaryZh:
      "10位营业执照号的1-3-7加权校验法。在签约或转账前，识破假号码和打错的数字。",
    summaryVi:
      "Phương pháp kiểm tra tổng trọng số 1-3-7 của mã số doanh nghiệp Hàn Quốc gồm 10 chữ số — phát hiện số giả hoặc gõ sai trước khi ký hợp đồng hay chuyển tiền.",
    category: "tax",
    readingMinutes: 6,
    tags: {
      ko: ["사업자등록번호", "체크섬", "번호 검증", "홈택스", "거래 사기 방지"],
      en: ["Business Number", "Checksum", "Number Validation", "Hometax", "Fraud Prevention"],
      zh: ["营业执照号", "校验码", "号码验证", "国税厅Hometax", "交易防骗"],
      vi: ["mã số doanh nghiệp", "số kiểm tra", "xác minh số", "Hometax", "phòng chống lừa đảo"],
    },
  },
  {
    slug: "rent-cap-tenant-checklist",
    publishedAt: "2026-05-23",
    titleKo: "임대료 5% 인상 통보를 받았을 때 즉시 해야 할 7가지",
    titleEn: "Got a Korean rent increase over 5%? 7 things to do immediately",
    titleZh: "收到超过5%涨租通知时，必须马上做的7件事",
    titleVi: "Nhận thông báo tăng tiền thuê nhà vượt 5% ở Hàn Quốc? 7 việc cần làm ngay",
    summaryKo:
      "임대인이 갱신 시점에 6% 인상을 통보했다면. 임차인이 손해 보지 않기 위해 순서대로 해야 할 7가지를 정리했습니다.",
    summaryEn:
      "If your Korean landlord proposes a 6% renewal increase, here are the 7 steps a tenant should take, in order.",
    summaryZh:
      "如果房东在续约时通知涨租6%，作为承租人为了不吃亏，应该按顺序做的7件事。",
    summaryVi:
      "Nếu chủ nhà thông báo tăng tiền thuê 6% khi gia hạn hợp đồng, đây là 7 bước người thuê nhà cần thực hiện theo thứ tự để không chịu thiệt.",
    category: "realestate",
    readingMinutes: 6,
    tags: {
      ko: ["임대료 5%", "계약갱신청구권", "내용증명", "임대차 분쟁", "전월세 인상"],
      en: ["Rent Cap 5%", "Renewal Right", "Certified Mail", "Lease Dispute", "Rent Increase"],
      zh: ["租金上限5%", "合同续约请求权", "内容证明邮件", "租赁纠纷", "涨租"],
      vi: ["tăng tiền thuê 5%", "quyền yêu cầu gia hạn hợp đồng", "thư bảo đảm nội dung", "tranh chấp thuê nhà", "tăng tiền thuê"],
    },
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
