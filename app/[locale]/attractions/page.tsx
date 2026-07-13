import type { Metadata } from "next";
import { locales, type Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL, SITE_BRAND } from "@/lib/siteConfig";
import { sortedAttractions } from "@/lib/attractionsCatalog";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import { TodayAttraction } from "@/components/attractions/TodayAttraction";
import { AttractionCard } from "@/components/attractions/AttractionCard";

interface PageProps {
  params: Promise<{ locale: string }>;
}

function localeKeyOf(locale: string): Locale {
  if (locale === "ko") return "ko";
  if (locale === "zh") return "zh";
  if (locale === "vi") return "vi";
  return "en";
}

type Copy = {
  metaTitle: string;
  metaDesc: string;
  keywords: string[];
  eyebrow: string;
  h1: string;
  intro: string;
  todayHeading: string;
  todaySub: string;
  allHeading: string;
  about: string[];
};

const COPY: Record<Locale, Copy> = {
  ko: {
    metaTitle: "한국 명소 — 하루 한 곳, 사진과 함께 즐기는 여행지",
    metaDesc:
      "궁궐·해변·시장·랜드마크까지, 한국의 가볼 만한 명소를 사진과 친근한 소개글로 매일 한 곳씩. 방문 팁·지도·댓글까지 한 페이지에.",
    keywords: ["한국 명소", "가볼만한곳", "한국 여행", "서울 명소", "부산 명소"],
    eyebrow: "한국 명소 · 하루 한 곳",
    h1: "오늘은 어디 가볼까?",
    intro:
      "한국의 가볼 만한 명소를 사진과 함께 소개합니다. 매일 '오늘의 명소'가 바뀌고, 각 장소마다 방문 팁·지도·다른 여행자의 댓글을 볼 수 있어요.",
    todayHeading: "오늘의 명소",
    todaySub: "매일 한 곳씩, 오늘 추천하는 여행지",
    allHeading: "전체 명소",
    about: [
      "이 페이지는 한국을 여행하거나 살면서 가볼 만한 곳을 한 곳씩 정리한 명소 모음입니다. 관광지 설명은 공식 자료를 바탕으로 직접 다시 썼고, 사진은 상업 이용이 가능한 공개 저작물(위키미디어·한국관광공사 등)만 출처를 밝혀 사용합니다.",
      "각 명소 페이지에서는 가는 법, 입장 팁, 근처에 함께 둘러볼 곳 같은 실용 정보를 함께 담았어요. 다녀오셨다면 댓글로 후기를 남겨 다른 여행자에게 도움을 줄 수 있습니다.",
    ],
  },
  en: {
    metaTitle: "Korea Attractions — One Place a Day, With Photos",
    metaDesc:
      "Palaces, beaches, markets, landmarks — a hand-written guide to Korea's best places, one a day, with photos, visitor tips, maps, and comments.",
    keywords: [
      "korea attractions",
      "places to visit in korea",
      "korea travel",
      "seoul attractions",
      "busan attractions",
    ],
    eyebrow: "Korea Attractions · One a Day",
    h1: "Where to today?",
    intro:
      "A hand-written guide to Korea's best places, with photos. A new 'today's pick' every day, each with visitor tips, a map, and comments from other travelers.",
    todayHeading: "Today's Pick",
    todaySub: "One place a day — today's recommendation",
    allHeading: "All Attractions",
    about: [
      "This is a growing guide to places worth visiting while you travel or live in Korea. Descriptions are re-written by hand from official sources, and every photo is a commercially usable public work (Wikimedia, Korea Tourism Organization, etc.) with its source credited.",
      "Each page includes practical info — how to get there, entry tips, what to see nearby. Been there? Leave a comment to help other travelers.",
    ],
  },
  zh: {
    metaTitle: "韩国景点 — 每天一处，图文并茂的旅行地",
    metaDesc:
      "宫殿、海滩、市场、地标——精选韩国值得一去的景点，每天一处，配有照片、参观贴士、地图和评论。",
    keywords: ["韩国景点", "韩国值得去的地方", "韩国旅游", "首尔景点", "釜山景点"],
    eyebrow: "韩国景点 · 每天一处",
    h1: "今天去哪儿？",
    intro:
      "图文并茂地为你介绍韩国值得一去的景点。每天更新「今日推荐」，每处都有参观贴士、地图和其他旅行者的评论。",
    todayHeading: "今日推荐",
    todaySub: "每天一处，今天推荐的旅行地",
    allHeading: "全部景点",
    about: [
      "本页面持续整理你在韩国旅行或生活时值得一去的地方。景点介绍均依据官方资料重新撰写，照片仅使用可商用的公开作品（维基共享、韩国旅游发展局等）并注明出处。",
      "每个景点页面都附有交通方式、入场贴士、周边可一并游览之处等实用信息。去过的话，欢迎留言分享，帮助其他旅行者。",
    ],
  },
  vi: {
    metaTitle: "Điểm đến Hàn Quốc — Mỗi ngày một nơi, kèm ảnh",
    metaDesc:
      "Cung điện, bãi biển, chợ, địa danh — cẩm nang những nơi đáng đến ở Hàn Quốc, mỗi ngày một nơi, kèm ảnh, mẹo tham quan, bản đồ và bình luận.",
    keywords: [
      "điểm đến Hàn Quốc",
      "nơi nên đi ở Hàn Quốc",
      "du lịch Hàn Quốc",
      "điểm đến Seoul",
      "điểm đến Busan",
    ],
    eyebrow: "Điểm đến Hàn Quốc · Mỗi ngày một nơi",
    h1: "Hôm nay đi đâu?",
    intro:
      "Cẩm nang có ảnh về những nơi đáng đến ở Hàn Quốc. Mỗi ngày một 'gợi ý hôm nay', kèm mẹo tham quan, bản đồ và bình luận từ những du khách khác.",
    todayHeading: "Gợi ý hôm nay",
    todaySub: "Mỗi ngày một nơi — gợi ý cho hôm nay",
    allHeading: "Tất cả điểm đến",
    about: [
      "Đây là cẩm nang ngày càng đầy đủ về những nơi đáng đến khi bạn du lịch hay sống ở Hàn Quốc. Phần mô tả được viết lại bằng tay từ nguồn chính thức, và mọi hình ảnh đều là tác phẩm công cộng được phép dùng thương mại (Wikimedia, Tổng cục Du lịch Hàn Quốc, v.v.) có ghi nguồn.",
      "Mỗi trang có thông tin thực dụng — cách đến, mẹo vào cửa, chỗ nên ghé gần đó. Đã đến rồi? Hãy để lại bình luận giúp các du khách khác.",
    ],
  },
};

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const c = COPY[localeKeyOf(locale)];
  return {
    title: c.metaTitle,
    description: c.metaDesc,
    keywords: c.keywords,
    alternates: {
      canonical: `/${locale}/attractions`,
      languages: buildLanguagesAlt("/attractions"),
    },
    openGraph: {
      title: `${c.metaTitle} — ${SITE_BRAND}`,
      description: c.metaDesc,
      url: `${SITE_URL}/${locale}/attractions`,
      type: "website",
    },
  };
}

export default async function AttractionsHubPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const lk = localeKeyOf(locale);
  const c = COPY[lk];
  const all = sortedAttractions();

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-10">
      <div className="mx-auto max-w-6xl">
        <Breadcrumbs
          locale={lk}
          id="attractions-hub"
          trail={[
            { name: lk === "ko" ? "홈" : "Home", url: `${SITE_URL}/${locale}` },
            {
              name: lk === "ko" ? "명소" : lk === "zh" ? "景点" : lk === "vi" ? "Điểm đến" : "Attractions",
              url: `${SITE_URL}/${locale}/attractions`,
            },
          ]}
        />

        <header className="mb-10 max-w-3xl animate-fade-up">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-rose-400">
            {c.eyebrow}
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-5xl">
            {c.h1}
          </h1>
          <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-text-secondary)]">
            {c.intro}
          </p>
        </header>

        {/* 오늘의 명소 */}
        <section className="mb-14">
          <h2 className="text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
            {c.todayHeading}
          </h2>
          <p className="mb-4 mt-1 text-sm text-[color:var(--color-text-tertiary)]">
            {c.todaySub}
          </p>
          <div className="max-w-md">
            <TodayAttraction locale={lk} />
          </div>
        </section>

        {/* 전체 명소 */}
        <section>
          <h2 className="mb-4 text-xl font-bold text-[color:var(--color-text-primary)] md:text-2xl">
            {c.allHeading}
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {all.map((a) => (
              <AttractionCard key={a.slug} attraction={a} locale={lk} />
            ))}
          </div>
        </section>

        {/* 자체 설명 본문 (doorway 회피) */}
        <section className="mt-14 max-w-3xl space-y-4 border-t border-[color:var(--color-border-subtle)] pt-8 text-sm leading-relaxed text-[color:var(--color-text-tertiary)] md:text-[15px]">
          {c.about.map((para, i) => (
            <p key={i}>{para}</p>
          ))}
        </section>
      </div>
    </main>
  );
}
