import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, FileText, Wrench } from "lucide-react";
import { locales, type Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { sortedBlogPosts } from "@/lib/blogPosts";

interface PageProps {
  params: Promise<{ locale: string }>;
}

interface GuideEntry {
  slug: string;
  titleKo: string;
  titleEn: string;
  titleZh: string;
  titleVi: string;
  summaryKo: string;
  summaryEn: string;
  summaryZh: string;
  summaryVi: string;
}

const GUIDES: ReadonlyArray<GuideEntry> = [
  {
    slug: "foreign-work-visa-korea",
    titleKo: "국적별 한국 취업비자 — 어느 나라는 어떤 길?",
    titleEn: "Korea work visa by nationality — which country, which path",
    titleZh: "按国籍看韩国工作签证 — 哪国走哪条路",
    titleVi: "Visa lao động Hàn Quốc theo quốc tịch — nước nào, đường nào",
    summaryKo: "인도·중국·베트남·중앙아시아·영어권까지, 국적에 따라 열리는 취업·체류 비자를 국가별로 정리.",
    summaryEn: "From India and China to Central Asia and English-speaking countries — work and residence visas mapped by nationality.",
    summaryZh: "从印度·中国到中亚·英语圈,按国籍梳理向你开放的工作·居留签证。",
    summaryVi: "Từ Ấn Độ, Trung Quốc đến Trung Á và các nước nói tiếng Anh — visa lao động và cư trú theo quốc tịch.",
  },
  {
    slug: "eps-e9-work-visa",
    titleKo: "고용허가제 E-9 비자 완전 가이드 (2026)",
    titleEn: "Korea EPS (E-9) work visa — full guide (2026)",
    titleZh: "韩国雇佣许可制(E-9)工作签证完全指南(2026)",
    titleVi: "Visa lao động EPS (E-9) Hàn Quốc — hướng dẫn đầy đủ (2026)",
    summaryKo: "17개 송출국·EPS-TOPIK·2026 쿼터·체류기간·E-7-4 숙련기능 전환까지.",
    summaryEn: "17 sending countries, EPS-TOPIK, 2026 quota, stay length, and the E-7-4 skilled-worker path.",
    summaryZh: "17个派遣国·EPS-TOPIK·2026配额·居留期·E-7-4熟练技能转换。",
    summaryVi: "17 nước phái cử, EPS-TOPIK, hạn ngạch 2026, thời gian lưu trú và lộ trình lao động lành nghề E-7-4.",
  },
  {
    slug: "e7-professional-visa",
    titleKo: "E-7 전문직 비자 완전 가이드 (2026)",
    titleEn: "Korea E-7 professional work visa — full guide (2026)",
    titleZh: "韩国E-7专业工作签证完全指南(2026)",
    titleVi: "Visa lao động chuyên môn E-7 Hàn Quốc — hướng dẫn đầy đủ (2026)",
    summaryKo: "4개 서브카테고리·2026 임금기준·Top-Tier·F-2-7 거주비자 전환 경로.",
    summaryEn: "Four subcategories, 2026 salary floors, the Top-Tier track, and the F-2-7 residence path.",
    summaryZh: "4个子类别·2026薪资标准·Top-Tier·F-2-7居留签证转换路径。",
    summaryVi: "Bốn phân loại, mức lương sàn 2026, diện Top-Tier và lộ trình visa cư trú F-2-7.",
  },
  {
    slug: "korea-passport-visa-free",
    titleKo: "한국 여권 무비자 나라 — 미국·유럽·일본·중국·베트남·태국·인도",
    titleEn: "Korea passport visa-free countries — US, Europe, Japan, China, Vietnam, Thailand, India",
    titleZh: "韩国护照免签国家 — 美国·欧洲·日本·中国·越南·泰国·印度",
    titleVi: "Nước miễn visa cho hộ chiếu Hàn — Mỹ, Châu Âu, Nhật, Trung Quốc, Việt Nam, Thái Lan, Ấn Độ",
    summaryKo: "한국 여권으로 그냥 가는 나라와 ESTA·ETIAS·e-비자가 필요한 나라를 2026년 기준으로 정리.",
    summaryEn: "Where a Korean passport just goes, and where you need ESTA, ETIAS or an e-Visa — as of 2026.",
    summaryZh: "韩国护照可直接前往的国家,以及需ESTA·ETIAS·e-签证的国家,2026年基准梳理。",
    summaryVi: "Nước hộ chiếu Hàn cứ thế đi, và nước cần ESTA, ETIAS hay e-Visa — tính đến 2026.",
  },
  {
    slug: "wire-size",
    titleKo: "전선 굵기 — 표 보지 않고 정하는 법",
    titleEn: "Wire size — selecting without the table",
    titleZh: "电线线径 — 不查表也能定",
    titleVi: "Tiết diện dây dẫn — chọn mà không cần tra bảng",
    summaryKo: "KEC 232.5 표를 매번 들춰보는 대신, 전류·거리·전압강하만으로 단면적을 추산하는 절차.",
    summaryEn: "Estimate cross-section from current, distance, and voltage drop — without the KEC table.",
    summaryZh: "不必每次翻查KEC 232.5表，仅凭电流、距离、电压降即可推算导线截面积的方法。",
    summaryVi: "Ước tính tiết diện chỉ từ dòng điện, khoảng cách và sụt áp — không cần tra bảng KEC.",
  },
  {
    slug: "biz-number",
    titleKo: "사업자등록번호 체크섬 — 가짜 번호 거르는 알고리즘",
    titleEn: "Korean business registration number — what the checksum tells you",
    titleZh: "事业者登记号校验位 — 识别虚假号码的算法",
    titleVi: "Checksum mã số đăng ký kinh doanh — thuật toán lọc số giả",
    summaryKo: "1-3-7-1-3-7-1-3-5 가중치 검산법. 거래 전 가짜 사업자 한 번에 거르기.",
    summaryEn: "The 1-3-7 weighted checksum that catches fake Korean business numbers before a deal.",
    summaryZh: "1-3-7-1-3-7-1-3-5加权校验法。交易前一次性筛掉虚假事业者。",
    summaryVi: "Phương pháp kiểm tra trọng số 1-3-7-1-3-7-1-3-5. Lọc ngay số đăng ký kinh doanh giả trước khi giao dịch.",
  },
  {
    slug: "four-insurance",
    titleKo: "4대보험 — 2026 요율과 실수령액 계산",
    titleEn: "Korean 4-major insurance — 2026 rates and net pay",
    titleZh: "四大保险 — 2026年费率与实领金额计算",
    titleVi: "4 bảo hiểm bắt buộc — Tỷ lệ 2026 và lương thực nhận",
    summaryKo: "국민연금·건강·고용·산재 요율 정리 + 월급에서 빠지는 정확한 금액.",
    summaryEn: "Pension, health, employment, accident — current rates and exact deductions.",
    summaryZh: "国民年金·健康·雇佣·产灾保险费率整理 + 从月薪中精确扣除的金额。",
    summaryVi: "Tổng hợp tỷ lệ lương hưu, y tế, việc làm, tai nạn lao động + số tiền chính xác bị khấu trừ từ lương.",
  },
  {
    slug: "insulation",
    titleKo: "단열 R값·U값 — 에너지절약 별표1 통과 가이드",
    titleEn: "Insulation R-value · U-value — Korean building code path",
    titleZh: "隔热R值·U值 — 通过节能设计标准别表1指南",
    titleVi: "Trị số cách nhiệt R·U — hướng dẫn đạt chuẩn tiết kiệm năng lượng",
    summaryKo: "지역별 부위별 U값 한도 + 실제 자재로 통과시키는 두께 산정.",
    summaryEn: "Korean zonal U-value limits and the thickness needed with real materials.",
    summaryZh: "各地区各部位U值上限 + 用实际建材达标所需厚度的计算方法。",
    summaryVi: "Giới hạn trị số U theo từng vùng, từng bộ phận + tính độ dày cần thiết với vật liệu thực tế.",
  },
  {
    slug: "span",
    titleKo: "부재 경간 — 장선·서까래·헤더 최대 길이",
    titleEn: "Span tables — joist, rafter, header limits",
    titleZh: "构件跨距 — 桁条·椽子·横梁最大长度",
    titleVi: "Bảng nhịp kết cấu — giới hạn xà gồ, xà mái, dầm đỡ",
    summaryKo: "NDS 기준 실무용 경간 한계 + 처짐·휨 검증 순서.",
    summaryEn: "Practical NDS-based span limits and the deflection-then-bending check order.",
    summaryZh: "基于NDS标准的实务跨距上限 + 挠度与弯曲验证顺序。",
    summaryVi: "Giới hạn nhịp thực tế theo tiêu chuẩn NDS + thứ tự kiểm tra độ võng rồi đến uốn.",
  },
];

interface CategoryEntry {
  emoji: string;
  href: string;
  titleKo: string;
  titleEn: string;
  titleZh: string;
  titleVi: string;
  descriptionKo: string;
  descriptionEn: string;
  descriptionZh: string;
  descriptionVi: string;
}

const CATEGORIES: ReadonlyArray<CategoryEntry> = [
  {
    emoji: "💼",
    href: "/labor-calc",
    titleKo: "연봉 · 근로",
    titleEn: "Payroll · Labor",
    titleZh: "薪资 · 劳动",
    titleVi: "Lương · Lao động",
    descriptionKo: "연차·주휴수당·퇴직금·최저시급",
    descriptionEn: "Annual leave · weekly rest · severance · min wage",
    descriptionZh: "年假·周休津贴·离职金·最低时薪",
    descriptionVi: "Phép năm · nghỉ hàng tuần · trợ cấp thôi việc · lương tối thiểu",
  },
  {
    emoji: "💰",
    href: "/income-tax",
    titleKo: "재무 · 세금",
    titleEn: "Finance · Tax",
    titleZh: "财务 · 税务",
    titleVi: "Tài chính · Thuế",
    descriptionKo: "종합소득세·대출·복리·부가세·해외주식",
    descriptionEn: "Income tax · loan · compound · VAT · foreign stock",
    descriptionZh: "综合所得税·贷款·复利·增值税·海外股票",
    descriptionVi: "Thuế thu nhập · vay vốn · lãi kép · VAT · cổ phiếu nước ngoài",
  },
  {
    emoji: "🏘️",
    href: "/rent-cap",
    titleKo: "부동산 · 임대",
    titleEn: "Real Estate",
    titleZh: "房地产 · 租赁",
    titleVi: "Bất động sản",
    descriptionKo: "임대료 5% 인상한도 검증",
    descriptionEn: "Korean rent cap (5%) verification",
    descriptionZh: "租金5%上涨上限验证",
    descriptionVi: "Kiểm tra giới hạn tăng tiền thuê 5%",
  },
  {
    emoji: "⚡",
    href: "/electric-calc",
    titleKo: "전기 (KEC)",
    titleEn: "Electric (KEC)",
    titleZh: "电气 (KEC)",
    titleVi: "Điện (KEC)",
    descriptionKo: "전선 굵기·차단기·전압강하",
    descriptionEn: "Wire size · breaker · voltage drop",
    descriptionZh: "电线线径·断路器·电压降",
    descriptionVi: "Tiết diện dây · cầu dao · sụt áp",
  },
  {
    emoji: "🏠",
    href: "/timber-calc",
    titleKo: "목조 · 자재",
    titleEn: "Timber · Materials",
    titleZh: "木结构 · 建材",
    titleVi: "Nhà gỗ · Vật liệu",
    descriptionKo: "서까래·지붕·계단·단열·자재 수량",
    descriptionEn: "Rafter · roof · stairs · insulation · materials",
    descriptionZh: "椽子·屋顶·楼梯·隔热·建材数量",
    descriptionVi: "Xà mái · mái nhà · cầu thang · cách nhiệt · vật liệu",
  },
  {
    emoji: "🔄",
    href: "/area-convert",
    titleKo: "변환 · 일상",
    titleEn: "Convert · Daily",
    titleZh: "换算 · 日常",
    titleVi: "Quy đổi · Hàng ngày",
    descriptionKo: "평수↔㎡·퍼센트·JSON↔CSV",
    descriptionEn: "Pyeong↔m² · percent · JSON↔CSV",
    descriptionZh: "坪数↔㎡·百分比·JSON↔CSV",
    descriptionVi: "Pyeong↔m² · phần trăm · JSON↔CSV",
  },
];

function localeKeyOf(locale: string): Locale {
  if (locale === "ko") return "ko";
  if (locale === "zh") return "zh";
  if (locale === "vi") return "vi";
  return "en";
}

const COPY = {
  ko: {
    metaTitle: "도구 가이드 — 사용법·공식·법령 인용",
    metaDesc: "33개 도구의 깊이 있는 가이드 모음. 가이드·현장 노트·도구가 한 곳에 연결되어 있어요.",
    ogLocale: "ko_KR",
    eyebrow: "도구 가이드",
    h1: "한국 실무 도구의 깊이 있는 가이드",
    subtitle: "도구 사용법은 도구 페이지에. 깊이 있는 배경·실제 사례·법령 인용은 여기에. 가이드·블로그·도구가 서로 연결되어 있어요.",
    toolsHeading: "도구 — 6개 카테고리",
    guidesHeading: "가이드 — 도구 깊이 읽기",
    readGuide: "가이드 읽기",
    notesHeading: "현장 노트 — 실무자 관점",
    readMinutes: (n: number) => `약 ${n}분`,
    allNotes: "현장 노트 모두 보기",
  },
  en: {
    metaTitle: "Tool Guides — How-to, formulas, and law citations",
    metaDesc: "In-depth guides for 33 Korean tools. Guides, field notes, and tools cross-linked.",
    ogLocale: "en_US",
    eyebrow: "Tool Guides",
    h1: "In-depth guides to Korean practical tools",
    subtitle: "How-to lives on the tool page. Background, real-world cases, and law citations live here. Guides, blog, and tools cross-link freely.",
    toolsHeading: "Tools — 6 categories",
    guidesHeading: "Guides — read tools deeper",
    readGuide: "Read guide",
    notesHeading: "Field Notes — practitioner view",
    readMinutes: (n: number) => `~${n} min`,
    allNotes: "All field notes",
  },
  zh: {
    metaTitle: "工具指南 — 使用方法·公式·法令引用",
    metaDesc: "33款工具的深度指南合集。指南、现场笔记与工具在此互相链接。",
    ogLocale: "zh_CN",
    eyebrow: "工具指南",
    h1: "韩国实务工具深度指南",
    subtitle: "工具使用方法请见工具页面。这里提供深度背景、实际案例与法令引用。指南、博客与工具彼此互相链接。",
    toolsHeading: "工具 — 6个分类",
    guidesHeading: "指南 — 深入了解工具",
    readGuide: "阅读指南",
    notesHeading: "现场笔记 — 实务者视角",
    readMinutes: (n: number) => `约${n}分钟`,
    allNotes: "查看全部现场笔记",
  },
  vi: {
    metaTitle: "Hướng dẫn công cụ — Cách dùng, công thức, trích dẫn luật",
    metaDesc: "Bộ hướng dẫn chuyên sâu cho 33 công cụ Hàn Quốc. Hướng dẫn, ghi chú thực tế và công cụ được liên kết chéo.",
    ogLocale: "vi_VN",
    eyebrow: "Hướng dẫn công cụ",
    h1: "Hướng dẫn chuyên sâu về công cụ thực tế Hàn Quốc",
    subtitle: "Cách sử dụng công cụ có ở trang công cụ. Bối cảnh chuyên sâu, ví dụ thực tế và trích dẫn luật có ở đây. Hướng dẫn, blog và công cụ liên kết chéo tự do.",
    toolsHeading: "Công cụ — 6 danh mục",
    guidesHeading: "Hướng dẫn — tìm hiểu sâu hơn",
    readGuide: "Đọc hướng dẫn",
    notesHeading: "Ghi chú thực tế — góc nhìn người trong nghề",
    readMinutes: (n: number) => `~${n} phút`,
    allNotes: "Xem tất cả ghi chú thực tế",
  },
} as const;

function categoryTitle(cat: CategoryEntry, localeKey: Locale): string {
  if (localeKey === "ko") return cat.titleKo;
  if (localeKey === "zh") return cat.titleZh;
  if (localeKey === "vi") return cat.titleVi;
  return cat.titleEn;
}

function categoryDescription(cat: CategoryEntry, localeKey: Locale): string {
  if (localeKey === "ko") return cat.descriptionKo;
  if (localeKey === "zh") return cat.descriptionZh;
  if (localeKey === "vi") return cat.descriptionVi;
  return cat.descriptionEn;
}

function guideTitle(guide: GuideEntry, localeKey: Locale): string {
  if (localeKey === "ko") return guide.titleKo;
  if (localeKey === "zh") return guide.titleZh;
  if (localeKey === "vi") return guide.titleVi;
  return guide.titleEn;
}

function guideSummary(guide: GuideEntry, localeKey: Locale): string {
  if (localeKey === "ko") return guide.summaryKo;
  if (localeKey === "zh") return guide.summaryZh;
  if (localeKey === "vi") return guide.summaryVi;
  return guide.summaryEn;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const c = COPY[localeKeyOf(locale)];
  return {
    title: c.metaTitle,
    description: c.metaDesc,
    alternates: {
      canonical: `/${locale}/guide`,
      languages: buildLanguagesAlt("/guide"),
    },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDesc,
      type: "website",
      url: `${SITE_URL}/${locale}/guide`,
      locale: c.ogLocale,
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function GuideIndexPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const localeKey = localeKeyOf(locale);
  const c = COPY[localeKey];
  const blogPosts = sortedBlogPosts();
  // 현장 노트(blog) 는 ko/en 콘텐츠만 존재 — zh/vi 는 en 폴백 (blog 번역은 이번 범위 밖)
  const isKo = locale === "ko";

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 max-w-3xl">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-400">
            {c.eyebrow}
          </p>
          <h1 className="text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
            {c.h1}
          </h1>
          <p className="mt-3 text-base leading-relaxed text-[color:var(--color-text-secondary)]">
            {c.subtitle}
          </p>
        </header>

        <section className="mb-14">
          <div className="mb-5 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              {c.toolsHeading}
            </h2>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.href}
                href={`/${localeKey}${cat.href}`}
                className="surface-card group flex items-start gap-3 p-4 transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)]"
              >
                <span className="text-2xl">{cat.emoji}</span>
                <div className="min-w-0 flex-1">
                  <h3 className="font-semibold text-[color:var(--color-text-primary)]">
                    {categoryTitle(cat, localeKey)}
                  </h3>
                  <p className="mt-1 text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
                    {categoryDescription(cat, localeKey)}
                  </p>
                </div>
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-[color:var(--color-text-tertiary)] transition-transform group-hover:translate-x-0.5" />
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-14">
          <div className="mb-5 flex items-center gap-2">
            <BookOpen className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              {c.guidesHeading}
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2">
            {GUIDES.map((guide) => (
              <Link
                key={guide.slug}
                href={`/${localeKey}/guide/${guide.slug}`}
                className="surface-card group block p-5 transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)]"
              >
                <h3 className="font-semibold text-[color:var(--color-text-primary)]">
                  {guideTitle(guide, localeKey)}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                  {guideSummary(guide, localeKey)}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-indigo-300 transition-transform group-hover:translate-x-0.5">
                  {c.readGuide}
                  <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <div className="mb-5 flex items-center gap-2">
            <FileText className="h-4 w-4 text-[color:var(--color-text-tertiary)]" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              {c.notesHeading}
            </h2>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/${localeKey}/blog/${post.slug}`}
                className="surface-card group block p-5 transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)]"
              >
                <p className="mb-2 text-xs text-[color:var(--color-text-tertiary)]">
                  {post.publishedAt} · {c.readMinutes(post.readingMinutes)}
                </p>
                <h3 className="font-semibold text-[color:var(--color-text-primary)]">
                  {isKo ? post.titleKo : post.titleEn}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                  {isKo ? post.summaryKo : post.summaryEn}
                </p>
              </Link>
            ))}
          </div>
          <p className="mt-6 text-center">
            <Link
              href={`/${localeKey}/blog`}
              className="inline-flex items-center gap-1 text-sm font-medium text-indigo-300 transition-colors hover:text-indigo-200"
            >
              {c.allNotes}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </p>
        </section>
      </div>
    </main>
  );
}
