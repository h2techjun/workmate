/**
 * 한국 명소 카탈로그 — 단일 진실원.
 *
 * `/attractions` 허브·상세 페이지, sitemap, 구조화 데이터, "오늘의 명소" 로테이션이
 * 모두 이 배열을 참조한다. 원형은 `lib/blogPosts.ts`.
 *
 * ⚠️ AdSense near-duplicate 방지 (salary/[amount] 사고 학습):
 *   본문(`overview*`)·팁(`tips`)은 **장소별 고유 자유문**이어야 한다.
 *   카테고리 템플릿 함수로 문장을 생성하지 말 것 — 각 명소만의 구체 사실·맥락을 담는다.
 *
 * 🖼️ 저작권: 모든 이미지는 상업이용 가능 라이선스만(위키미디어 CC/PD·한국관광공사
 *   공공누리 1유형·Unsplash/Pexels). `license`/`credit`/`creditUrl` 을 반드시 채우고
 *   `PhotoAttribution` 컴포넌트가 이미지 하단에 출처를 표기한다.
 *
 * 📅 발행 규칙 (마스터 정책 2026-07-15): **신규 명소의 `publishedAt` 은 기존 마지막
 *   발행일 + 2일**로 부여한다. 예약발행(publishedAt<=오늘 KST 만 공개, attractionsFeature)
 *   과 결합돼 콘텐츠가 "2일에 한 곳씩" 순차 공개된다 → 한 번에 소진하지 않고 오래 끌기.
 *   fetch-tourapi 로 여러 곳을 수집해도 병합 시 publishedAt 만 2일 간격 미래로 주면 됨.
 */

export type AttractionRegion =
  | "seoul"
  | "busan"
  | "jeju"
  | "gyeonggi"
  | "gangwon"
  | "jeolla"
  | "gyeongsang"
  | "chungcheong";

export type AttractionCategory =
  | "palace" // 궁궐·유적
  | "nature" // 자연·산·바다
  | "landmark" // 랜드마크·전망
  | "culture" // 문화·마을·거리
  | "market"; // 시장·먹거리

export interface AttractionImage {
  /** 원격 이미지 URL (상업이용 가능 소스만) */
  url: string;
  /** 대체 텍스트 (접근성·SEO) */
  alt: string;
  /** 라이선스 문구 (예: "공공누리 제1유형", "CC BY-SA 4.0", "Unsplash License") */
  license: string;
  /** 저작자·제공처 (예: "한국관광공사", "Wikimedia Commons / 홍길동") */
  credit: string;
  /** 원본·라이선스 확인 링크 */
  creditUrl: string;
}

export interface AttractionEntry {
  /** URL slug — 영문 케밥 케이스 */
  slug: string;
  /** 발행일 YYYY-MM-DD — 정렬·sitemap lastmod */
  publishedAt: string;
  region: AttractionRegion;
  category: AttractionCategory;

  /** 명소 이름 (4로케일) */
  nameKo: string;
  nameEn: string;
  nameZh: string;
  nameVi: string;

  /** 카드·메타용 한두 문장 요약 (4로케일) */
  summaryKo: string;
  summaryEn: string;
  summaryZh: string;
  summaryVi: string;

  /**
   * 상세 본문 — 장소별 고유 장문(near-dup 방지의 핵심).
   * 각 로케일 독립 창작. 문단 배열로 저장(렌더 시 <p> 매핑).
   */
  overviewKo: readonly string[];
  overviewEn: readonly string[];
  overviewZh: readonly string[];
  overviewVi: readonly string[];

  /** 방문 실용 팁 (4로케일, 각 3개 이상 권장) */
  tips: {
    ko: readonly string[];
    en: readonly string[];
    zh: readonly string[];
    vi: readonly string[];
  };

  /** 대표 이미지 (출처표시 필수) */
  image: AttractionImage;

  /** 좌표 — 지도 딥링크 */
  lat: number;
  lng: number;
  /** 주소 (ko/en) — 표시·지도 */
  addressKo: string;
  addressEn: string;

  /** 검색·칩 태그 (4로케일) */
  tags: {
    ko: readonly string[];
    en: readonly string[];
    zh: readonly string[];
    vi: readonly string[];
  };

  /** 자주 묻는 질문 — FAQ rich result(FaqJsonLd) + 화면 렌더. 로케일별 3개 권장 */
  faq?: {
    ko: ReadonlyArray<{ q: string; a: string }>;
    en: ReadonlyArray<{ q: string; a: string }>;
    zh: ReadonlyArray<{ q: string; a: string }>;
    vi: ReadonlyArray<{ q: string; a: string }>;
  };
}

export const REGION_LABELS: Record<
  AttractionRegion,
  { ko: string; en: string; zh: string; vi: string }
> = {
  seoul: { ko: "서울", en: "Seoul", zh: "首尔", vi: "Seoul" },
  busan: { ko: "부산", en: "Busan", zh: "釜山", vi: "Busan" },
  jeju: { ko: "제주", en: "Jeju", zh: "济州", vi: "Jeju" },
  gyeonggi: { ko: "경기", en: "Gyeonggi", zh: "京畿", vi: "Gyeonggi" },
  gangwon: { ko: "강원", en: "Gangwon", zh: "江原", vi: "Gangwon" },
  jeolla: { ko: "전라", en: "Jeolla", zh: "全罗", vi: "Jeolla" },
  gyeongsang: { ko: "경상", en: "Gyeongsang", zh: "庆尚", vi: "Gyeongsang" },
  chungcheong: { ko: "충청", en: "Chungcheong", zh: "忠清", vi: "Chungcheong" },
};

export const CATEGORY_LABELS: Record<
  AttractionCategory,
  { ko: string; en: string; zh: string; vi: string }
> = {
  palace: { ko: "궁궐·유적", en: "Palace & Heritage", zh: "宫殿·古迹", vi: "Cung điện & Di sản" },
  nature: { ko: "자연·풍경", en: "Nature & Scenery", zh: "自然·风景", vi: "Thiên nhiên & Cảnh quan" },
  landmark: { ko: "랜드마크·전망", en: "Landmark & View", zh: "地标·观景", vi: "Địa danh & Ngắm cảnh" },
  culture: { ko: "문화·거리", en: "Culture & Streets", zh: "文化·街区", vi: "Văn hóa & Phố phường" },
  market: { ko: "시장·먹거리", en: "Market & Food", zh: "市场·美食", vi: "Chợ & Ẩm thực" },
};

/**
 * 명소 데이터.
 * MVP: 위키미디어 공용(CC/PD) 이미지 + 자체 창작 본문. TourAPI 자동 확장은 Phase 2.
 */
export const ATTRACTIONS: ReadonlyArray<AttractionEntry> = [
  {
    slug: "gyeongbokgung",
    publishedAt: "2026-07-13",
    region: "seoul",
    category: "palace",
    nameKo: "경복궁",
    nameEn: "Gyeongbokgung Palace",
    nameZh: "景福宫",
    nameVi: "Cung Gyeongbokgung",
    summaryKo:
      "서울 궁궐 중 급은 여기가 최고예요. 광화문 넘어서자마자 근정전 스케일에 압도되고, 연못 위 경회루는 반영샷 원탑 포토존이에요. 한복만 입으면 입장료 3천 원이 통째로 공짜에, 수문장 교대의식도 볼거리. 운 좋으면 봄가을 야간개장까지 잡을 수 있어요.",
    summaryEn:
      "Seoul's #1 palace, no contest. Walk through Gwanghwamun and Geunjeongjeon hits you with pure scale — and if you're in hanbok, the ₩3,000 entry fee just disappears. Catch it during the spring/fall night opening and it's next-level.",
    summaryZh:
      "首尔宫殿天花板就是它。走过光化门，勤政殿的气场直接把你镇住，池塘上的庆会楼倒影更是首尔头号出片机位。穿一套完整韩服，3000韩元门票直接免单，还能顺路看上午下午两场守门将换岗仪式。运气好赶上春秋季夜间开放，体验直接拉满。",
    summaryVi:
      "Cung điện đỉnh nhất Seoul chính là đây. Qua khỏi cổng Gwanghwamun là điện Geunjeongjeon choáng ngợp luôn — mặc Hanbok thì vé 3.000 won cũng miễn luôn! May mắn thì còn bắt được đợt mở cửa đêm mùa xuân/thu.",
    overviewKo: [
      "경복궁은 1395년 태조 이성계가 조선을 세우면서 지은 법궁, 그러니까 '조선의 얼굴'이에요. 이름 뜻은 '큰 복을 누리라'인데 정작 역사는 순탄치 않았어요 — 임진왜란 때 홀랑 타버렸다가 1867년 흥선대원군이 다시 세웠고, 일제강점기에 또 절반 넘게 헐렸다가 지금까지도 계속 복원 중입니다. 그래서 갈 때마다 조금씩 새 건물이 늘어나 있는 게 은근 포인트예요.",
      "광화문 지나 흥례문까지 넘으면 넓은 마당 끝에 근정전이 딱 나타나는데, 이 스케일에 처음 오는 사람들은 다 압도돼요. 왕의 즉위식·국가행사가 열리던 곳이라 앞마당 품계석 두 줄만 봐도 위엄이 느껴지고요. 근정전 뒤쪽 경회루는 연못 위에 뜬 2층 누각인데 여기가 사실상 경복궁 인생샷 원탑 — 잔잔한 물에 반사된 모습이 그림 그 자체예요. 광화문 앞 수문장 교대의식은 오전 10시·오후 2시 두 번, 약 20분간 진행되는데 비가 많이 오거나 너무 덥거나 추우면 취소될 수 있으니 참고하세요.",
      "여기서 진짜 꿀팁 — 한복만 입으면 성인 입장료 3,000원이 완전 무료예요. 광화문 서쪽 골목에 한복 대여점이 쫙 깔려 있어서 4시간 대여에 15,000~40,000원 정도면 됩니다. ⚠️ 청바지에 저고리만 걸치는 식의 반쪽 한복은 무료 인정 안 되니 위아래 세트로 제대로 갖춰 입어야 해요. 그리고 봄·가을엔 연 2회 야간개장이 열리는데 표 구하기가 그야말로 전쟁이에요(내국인 사전예매 필수, 외국인은 현장 300장 한정) — 근데 한복 입고 가면 정원이 다 찼어도 그냥 들여보내 주니, 야간개장 노린다면 무조건 한복이 답입니다.",
      "사람 없는 사진 찍고 싶으면 평일 개장 직후인 오전 9~9:30분을 노리세요, 단체 관광객 몰려오기 전이라 거의 전세 낸 느낌이에요. 화요일은 통째로 휴궁이니 날짜 잡을 때 꼭 체크하고, 실내에선 모자를 벗어야 하는 규정도 있어요. 지하철 3호선 경복궁역 5번 출구가 서쪽 입구로 바로 연결되고, 바로 옆 국립고궁박물관은 무료라 여유 있으면 같이 둘러보기 좋아요. 천천히 다 보려면 2~3시간은 잡아야 하고, 공식 앱에 무료 한국어·영어 오디오가이드도 있으니 챙겨가세요.",
    ],
    overviewEn: [
      "Gyeongbokgung is the palace Yi Seong-gye built in 1395 when he founded Joseon — basically the literal face of the dynasty. The name means 'greatly blessed by heaven,' but its history was anything but smooth: it burned to the ground during the 1592 Japanese invasions, got rebuilt in 1867 by regent Heungseon Daewongun, then lost more than half its buildings again under Japanese colonial rule. Restoration is still ongoing, so there's genuinely something new to see almost every time you visit.",
      "Walk past Gwanghwamun and through Heungnyemun and Geunjeongjeon just appears at the end of a huge courtyard — first-timers are floored by the scale every single time. This is where kings were crowned and state ceremonies held, and the two rows of rank stones out front still radiate that old-school gravitas. Behind it, Gyeonghoeru is a two-story pavilion floating over a pond — genuinely the single best photo spot in the whole palace, with the still water doubling the view like a mirror. The Royal Guard Changing Ceremony happens twice a day (10 AM and 2 PM) in front of Gwanghwamun, runs about 20 minutes, and gets cancelled in heavy rain or extreme heat/cold.",
      "Here's the real hack: wear hanbok and the ₩3,000 adult admission just vanishes. Rental shops line the streets west of Gwanghwamun — four hours usually runs ₩15,000–40,000. ⚠️ Half-hanbok looks (jeans plus just the top) don't count for free entry — you need a proper top-and-bottom set. Twice a year, spring and fall, the palace opens at night — tickets are brutally competitive (locals need advance booking, foreigners get 300 same-day tickets), but showing up in hanbok gets you in even after the nightly cap is hit. If you want that night visit, hanbok is basically your golden ticket.",
      "Want the empty-courtyard shot? Show up right at opening on a weekday, 9:00–9:30 AM, before the tour groups roll in and you'll practically have the place to yourself. It's closed entirely on Tuesdays, so double-check the calendar, and hats have to come off indoors. Exit 5 of Gyeongbokgung Station (Line 3) drops you straight at the west gate, and the National Palace Museum right next door is free if you've got extra time. Budget two to three hours for an unhurried visit, and grab the free Korean/English audio guide from the official app before you go.",
    ],
    overviewZh: [
      "景福宫是1395年李成桂建立朝鲜王朝时所建的正宫，说白了就是朝鲜的门面。宫名寓意「尽享洪福」，可惜命运多舛——壬辰倭乱时被烧成灰烬，1867年兴宣大院君重建，日据时期又被拆掉一大半，至今仍在持续修复中，所以每次去都可能多几栋新修好的建筑，挺有意思的。",
      "穿过光化门、跨过兴礼门，宽阔庭院尽头突然出现的勤政殿，第一次去的人无一不被那气势镇住。这里是国王即位、举行国家大典的地方，殿前两排品阶石一站，威严感立马拉满。后方的庆会楼是浮在池塘上的两层楼阁，堪称景福宫里最出片的机位——平静水面把楼阁倒影拍得像镜子一样。光化门前的守门将换岗仪式每天两场（上午10点、下午2点），持续约20分钟，雨大或天气过冷过热会取消，去之前记得看看。",
      "真正的省钱绝招在这——只要穿韩服，成人票3000韩元直接免单。光化门西侧一整条街都是韩服租赁店，租4小时大概15,000~40,000韩元。⚠️ 牛仔裤配韩服上衣这种「半吊子」穿法不算数，必须上下成套才能免票。另外每年春秋两季会有夜间开放，抢票堪比打仗（韩国人要提前网购，外国游客每天限量300张现场票）——但只要穿韩服去，就算名额满了也照样能进，想赶夜场的话韩服基本是万能通行证。",
      "想拍空景？平日开门当口（早上9:00~9:30）去，旅行团还没杀到，基本能包场。每周二全天闭馆，安排行程前一定要确认，室内参观还要记得摘帽子。地铁3号线景福宫站5号出口直接通向西侧入口，旁边的国立古宫博物馆免费，时间充裕可以一起逛。慢慢逛完大概要2~3小时，出发前记得在官方App里下载免费的韩英语音导览。",
    ],
    overviewVi: [
      "Gyeongbokgung là cung điện Yi Seong-gye xây năm 1395 khi lập ra triều Joseon — nói thẳng ra là bộ mặt của cả triều đại. Tên cung nghĩa là 'hưởng phúc lớn', nhưng số phận thì lận đận: bị thiêu rụi trong cuộc xâm lược của Nhật năm 1592, được nhiếp chính Heungseon Daewongun xây lại năm 1867, rồi lại mất hơn nửa số công trình dưới thời thuộc địa Nhật. Việc phục dựng vẫn đang tiếp diễn, nên mỗi lần ghé thăm có khi lại thấy thêm công trình mới được dựng lại.",
      "Qua cổng Gwanghwamun, băng qua cổng Heungnyemun là điện Geunjeongjeon hiện ra ngay cuối sân rộng — ai lần đầu đến cũng choáng ngợp trước quy mô của nó. Đây là nơi vua đăng cơ, tổ chức đại lễ quốc gia, hai hàng bia phẩm cấp trước sân vẫn toát lên vẻ uy nghiêm xưa. Phía sau, lầu Gyeonghoeru hai tầng nổi trên mặt hồ — điểm chụp ảnh đẹp nhất cung điện, mặt nước phẳng lặng phản chiếu lầu như gương. Lễ đổi gác Cấm vệ quân diễn ra hai lần mỗi ngày (10 giờ sáng và 2 giờ chiều) trước cổng Gwanghwamun, kéo dài khoảng 20 phút, và có thể bị hủy nếu mưa to hoặc thời tiết quá nóng/lạnh.",
      "Mẹo tiết kiệm thực sự nằm ở đây — chỉ cần mặc Hanbok, vé vào cửa 3.000 won cho người lớn sẽ được miễn hoàn toàn. Các tiệm cho thuê nằm dọc phố phía tây Gwanghwamun, thuê 4 tiếng khoảng 15.000–40.000 won. ⚠️ Mặc kiểu 'nửa mùa' như quần jeans với áo Hanbok thì không được tính miễn phí, phải mặc trọn bộ trên dưới đàng hoàng. Ngoài ra mỗi năm có 2 đợt mở cửa đêm vào xuân và thu, vé cực kỳ khó săn (người Hàn phải đặt trước online, khách nước ngoài chỉ có 300 vé tại chỗ mỗi ngày) — nhưng nếu mặc Hanbok thì dù đã đủ số lượng vẫn được vào, nên muốn xem cung điện về đêm thì Hanbok gần như là vé thông hành.",
      "Muốn chụp ảnh vắng người thì canh giờ mở cửa ngày thường, khoảng 9:00–9:30 sáng, trước khi đoàn khách du lịch kéo đến — gần như được riêng cả khuôn viên. Cung đóng cửa hoàn toàn vào thứ Ba nên nhớ kiểm tra lịch trước, và khi vào trong nhà phải bỏ mũ ra. Lối ra số 5 ga Gyeongbokgung (tuyến 3) dẫn thẳng vào cổng phía tây, còn Bảo tàng Cung điện Quốc gia ngay bên cạnh miễn phí vào cửa nếu còn thời gian. Nên dành 2–3 tiếng để tham quan thong thả, và đừng quên tải audio guide tiếng Hàn/Anh miễn phí trên app chính thức trước khi đi.",
    ],
    tips: {
      ko: [
        "한복 입으면 성인 입장료 3,000원 완전 무료 — 광화문 서쪽 골목에 대여점 몰려있어요.",
        "사람 없는 사진 노리면 평일 오전 9~9:30 오픈런이 정답.",
        "화요일은 통째로 휴궁일이니 날짜 잡기 전 꼭 확인.",
        "봄·가을 야간개장은 표 전쟁 — 한복 입고 가면 정원 초과여도 입장 가능.",
      ],
      en: [
        "Hanbok = free entry (₩3,000 adult fee waived) — rental shops cluster west of Gwanghwamun.",
        "Chasing empty-courtyard shots? Show up right at 9:00–9:30 AM on a weekday.",
        "Closed all day Tuesday — check the calendar before you plan the trip.",
        "Spring/fall night openings are brutally competitive — hanbok gets you in even past the nightly cap.",
      ],
      zh: [
        "穿韩服=免票（成人3000韩元直接省）——光化门西侧一整条街都是租赁店。",
        "想拍空景就平日早上9:00~9:30准时到。",
        "每周二全天闭馆，安排行程前务必确认。",
        "春秋夜间开放抢票堪比打仗——穿韩服即使满员也能进。",
      ],
      vi: [
        "Mặc Hanbok = miễn phí vé (người lớn 3.000 won) — tiệm thuê tập trung phía tây Gwanghwamun.",
        "Muốn ảnh vắng người thì canh đúng 9:00–9:30 sáng ngày thường.",
        "Đóng cửa cả ngày thứ Ba — kiểm tra lịch trước khi lên kế hoạch.",
        "Mở cửa đêm xuân/thu vé cực khó săn — mặc Hanbok vẫn vào được dù đã đủ số lượng.",
      ],
    },
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c0/Front_view_of_the_Eastern_side_of_the_Imperial_Throne_Hall_Geunjeongjeon_at_Gyeongbokgung_Palace_in_Seoul.jpg/1280px-Front_view_of_the_Eastern_side_of_the_Imperial_Throne_Hall_Geunjeongjeon_at_Gyeongbokgung_Palace_in_Seoul.jpg",
      alt: "경복궁 근정전 — Geunjeongjeon throne hall at Gyeongbokgung Palace",
      license: "CC BY-SA 4.0",
      credit: "Wikimedia Commons / Basile Morin",
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Front_view_of_the_Eastern_side_of_the_Imperial_Throne_Hall_Geunjeongjeon_at_Gyeongbokgung_Palace_in_Seoul.jpg",
    },
    lat: 37.5796,
    lng: 126.977,
    addressKo: "서울특별시 종로구 사직로 161",
    addressEn: "161 Sajik-ro, Jongno-gu, Seoul",
    tags: {
      ko: ["경복궁", "서울 궁궐", "한복", "수문장 교대", "광화문"],
      en: ["Gyeongbokgung", "Seoul palace", "Hanbok", "guard ceremony", "Gwanghwamun"],
      zh: ["景福宫", "首尔宫殿", "韩服", "换岗仪式", "光化门"],
      vi: ["Gyeongbokgung", "cung điện Seoul", "Hanbok", "lễ đổi gác", "Gwanghwamun"],
    },
    faq: {
      ko: [
        {
          q: "경복궁 입장료와 휴궁일은?",
          a: "성인 입장료는 3,000원이지만 한복(위아래 세트)을 입으면 무료입니다. 매주 화요일은 전체 휴궁이니 방문일을 잡을 때 꼭 확인하세요.",
        },
        {
          q: "경복궁 가는 법은?",
          a: "지하철 3호선 경복궁역 5번 출구가 서쪽 입구로 바로 연결됩니다. 바로 옆 국립고궁박물관은 무료라 함께 둘러보기 좋아요.",
        },
        {
          q: "경복궁 사람 없는 사진 찍으려면 언제 가야 하나요?",
          a: "평일 개장 직후인 오전 9~9:30분이 가장 한산합니다. 단체 관광객이 몰리기 전이라 거의 전세 낸 듯한 느낌으로 사진을 찍을 수 있어요. 봄·가을 야간개장을 노린다면 한복을 입고 가면 정원이 찼어도 입장할 수 있습니다.",
        },
      ],
      en: [
        {
          q: "What's the admission fee and closing day for Gyeongbokgung?",
          a: "Adult admission is ₩3,000, but it's free if you wear a full hanbok (top and bottom set). The palace is closed all day every Tuesday, so check the calendar before you plan your visit.",
        },
        {
          q: "How do you get to Gyeongbokgung?",
          a: "Exit 5 of Gyeongbokgung Station (Subway Line 3) connects directly to the west entrance. The National Palace Museum right next door is free, so it's worth pairing the two.",
        },
        {
          q: "When's the best time to visit for an empty-courtyard photo?",
          a: "Show up right at opening on a weekday, 9:00–9:30 AM, before the tour groups arrive — you'll practically have the place to yourself. If you're aiming for the spring/fall night opening, wearing hanbok gets you in even after the nightly ticket cap is reached.",
        },
      ],
      zh: [
        {
          q: "景福宫门票多少钱？哪天闭馆？",
          a: "成人门票3000韩元，但只要穿一套完整的韩服（上衣+下装）就能免费入场。每周二全天闭馆，安排行程前一定要确认。",
        },
        {
          q: "景福宫怎么去？",
          a: "地铁3号线景福宫站5号出口直接通向西侧入口。旁边的国立古宫博物馆免费，可以一起逛。",
        },
        {
          q: "什么时候去能拍到没有人的照片？",
          a: "平日刚开门的早上9:00~9:30去最好，旅行团还没到，基本能包场。如果想赶春秋季夜间开放，穿韩服的话即使名额已满也能入场。",
        },
      ],
      vi: [
        {
          q: "Vé vào cổng Gyeongbokgung bao nhiêu và cung đóng cửa ngày nào?",
          a: "Vé người lớn là 3.000 won, nhưng mặc trọn bộ Hanbok (áo và quần/váy) thì được miễn phí. Cung đóng cửa cả ngày thứ Ba hàng tuần, nên nhớ kiểm tra lịch trước khi lên kế hoạch.",
        },
        {
          q: "Đi đến Gyeongbokgung bằng cách nào?",
          a: "Lối ra số 5 ga Gyeongbokgung (tuyến 3) dẫn thẳng vào cổng phía tây. Bảo tàng Cung điện Quốc gia ngay bên cạnh miễn phí vào cửa, nên ghé thăm luôn cũng hợp lý.",
        },
        {
          q: "Nên đi lúc nào để chụp được ảnh vắng người?",
          a: "Hãy đến ngay lúc mở cửa vào ngày thường, khoảng 9:00–9:30 sáng, trước khi đoàn khách du lịch kéo đến — gần như được riêng cả khuôn viên. Nếu muốn xem đợt mở cửa đêm mùa xuân/thu, mặc Hanbok sẽ được vào dù đã đủ số lượng vé.",
        },
      ],
    },
  },
  {
    slug: "haeundae-beach",
    publishedAt: "2026-07-12",
    region: "busan",
    category: "nature",
    nameKo: "해운대 해수욕장",
    nameEn: "Haeundae Beach",
    nameZh: "海云台海水浴场",
    nameVi: "Bãi biển Haeundae",
    summaryKo:
      "부산 왔으면 여기부터 찍고 시작해야죠. 1.5km 백사장 서쪽엔 동백섬 산책로, 동쪽엔 미포~청사포 스카이캡슐이 있고 밤엔 광안대교·마린시티 불빛이 물 위에 비쳐요. 여름 물놀이부터 겨울 북극곰 수영대회까지, 사계절 안 심심한 부산 원탑 해변입니다.",
    summaryEn:
      "If you're in Busan, this is where you start. A 1.5km stretch of sand with Gwangan Bridge glowing at night, summer swimming, even a Polar Bear Swim in winter — Busan's #1 beach never gets boring.",
    summaryZh:
      "来釜山第一站就是这。1.5公里白沙滩西边有冬柏岛步道和Nurimaru APEC世妍馆，东边是尾浦到青沙浦的天空胶囊列车与海边小火车，入夜后广安大桥与Marine City灯光倒映海面。夏天游泳、冬天看北极熊冬泳赛——釜山头号海滩四季都不无聊。",
    summaryVi:
      "Đến Busan là phải ghé đây đầu tiên. Bãi cát dài 1,5km cùng ánh đèn cầu Gwangan lung linh về đêm, mùa hè tắm biển, mùa đông có cả thi bơi Gấu Bắc Cực — bãi biển số 1 Busan chưa bao giờ nhàm chán.",
    overviewKo: [
      "해운대는 부산 동쪽에 뻗은 1.5km 백사장으로, 한국 여름 해변 중 방문객 수 1위를 놓친 적이 없어요. 이름 유래도 스웩 넘치는데, 통일신라 학자 최치원이 근처 동백섬 절벽에 '해운대(海雲臺)'라는 글자를 직접 새겼다는 데서 왔대요. 정식 물놀이 시즌은 6월 말~8월 말뿐이지만, 사실 해운대는 사계절 다 갈만한 해변이에요.",
      "낮에 도착했다면 해변 서쪽 동백섬부터 걸어보세요. 지금은 육지랑 이어진 작은 섬인데 해안 데크가 잘 깔려 있고 누리마루 APEC 하우스·등대까지 무료로 산책할 수 있어요. 여기서 광안대교가 정면으로 보이는 포토존이 나와요. 동쪽으로는 미포에서 청사포까지 옛 철길을 따라 스카이캡슐(2.3km, 약 20분, 시속 4km 느긋 주행)과 해변열차가 다니는데, 이거 인기가 워낙 많아서 현장에서 바로 타려면 못 탈 수도 있어요 — 미리 온라인 예약 필수. 좀 더 걸으면 청사포 다릿돌 전망대라는 출렁다리 스카이워크도 나오는데 바다 위를 걷는 느낌이 은근 짜릿해요.",
      "진짜 매력은 해 지고 난 다음이에요. 밤이 되면 맞은편 마린시티랑 광안대교 조명이 바다에 그대로 비쳐서 산책만 해도 인생샷 각이 나와요. 배고프면 해운대시장 골목에서 어묵·호떡 같은 길거리 간식으로 워밍업하고, 해리단길(해운대역과 시장 사이 골목)로 넘어가면 야경 보면서 한잔하기 좋은 바·카페가 줄줄이예요. 해변 바로 앞 횟집·포장마차에서 회 한 접시 시키는 것도 국룰 코스.",
      "가는 법은 부산 지하철 2호선 해운대역 3·5번 출구가 백사장이랑 가장 가깝고, 시장·해리단길 갈 거면 4번 출구가 편해요. ⚠️ 해변 산책로엔 쓰레기통이 거의 없으니 먹고 난 쓰레기는 직접 챙겨서 해운대해수욕장 광장이나 화장실 앞에 버리세요. 신분증만 있으면 1~2시간 자전거 무료 대여도 되고, 구글맵은 한국에서 잘 안 되니 카카오맵·네이버맵 미리 깔아두는 걸 추천해요. 사람 덜 붐비는 시기를 원하면 7~10월이 나은데, 6~7월은 장마철이라 우산은 챙기는 게 좋아요.",
    ],
    overviewEn: [
      "Haeundae is a 1.5km stretch of sand on Busan's east coast, and it's been Korea's most-visited summer beach for as long as anyone can remember. Even the name has swagger — legend says Choi Chi-won, a Unified Silla-era scholar, personally carved the characters 'Haeundae' into the cliffs of nearby Dongbaekseom. Official swimming season only runs late June through late August, but honestly, Haeundae is worth a trip year-round.",
      "If you're arriving in daylight, start by walking west to Dongbaekseom. It's a small island now joined to the mainland, with a solid coastal boardwalk that takes you past Nurimaru APEC House and a lighthouse — all free — and delivers a front-on view of Gwangan Bridge. Head east instead and you'll find the Sky Capsule (2.3km, roughly 20 minutes, a leisurely 4km/h) and Beach Train running along old rail tracks from Mipo to Cheongsapo. It's popular enough that walk-up tickets can sell out, so book online ahead of time. Keep walking and you'll hit the Cheongsapo Daritdol Skywalk, a suspension bridge over the water that's a legit rush to cross.",
      "The real magic happens after dark. At night, the lights of Marine City and Gwangan Bridge reflect off the water so vividly that just strolling the beach feels like a photoshoot. Get hungry and head into Haeundae Market for street food like eomuk and hotteok, then swing by Haeridan-gil (the alley between the station and the market) for bars and cafes with front-row night views. Grabbing a plate of raw fish at one of the beachfront restaurants or tent bars is basically mandatory.",
      "To get there, Haeundae Station (Busan Metro Line 2) Exits 3 and 5 drop you closest to the sand, while Exit 4 is better if you're headed to the market or Haeridan-gil. ⚠️ There are barely any trash cans along the beach path, so hold onto your rubbish until you reach the plaza or restroom bins. Free bike rentals (1–2 hours, just show ID) are available too, and since Google Maps doesn't really work in Korea, download KakaoMap or Naver Map before you land. For fewer crowds, aim for July through October — though June and July bring monsoon rain, so pack an umbrella.",
    ],
    overviewZh: [
      "海云台是釜山东海岸绵延1.5公里的白沙滩，多年来一直稳坐韩国夏季游客最多海滩的头把交椅。连名字来历都很有排面——传说统一新罗学者崔致远曾亲手在附近冬柏岛的悬崖上刻下「海云台」三个字。正式游泳季只有6月底到8月底，但老实说，海云台四季都值得来一趟。",
      "白天到的话，先往西走去冬柏岛逛逛。这座小岛现在已经和陆地连在一起，海岸木栈道修得很好，一路经过Nurimaru APEC世妍馆和灯塔，全程免费，还能正面拍到广安大桥。往东走则能看到天空胶囊列车（全程2.3公里、约20分钟、时速4公里慢悠悠地开）和海边小火车，沿着尾浦到青沙浦的旧铁路行驶——太受欢迎了，现场买票经常直接卖光，建议提前网上订票。再往前走会遇到青沙浦跨海人行桥，走在悬空栈道上晃悠悠的，挺刺激。",
      "真正的魅力在天黑之后。入夜后对岸Marine City和广安大桥的灯光倒映在海面上，光是散步都能拍出大片感。饿了就钻进海云台市场吃鱼糕、糖饼这些街头小吃垫垫肚子，再去海云台站和市场之间的海里丹街，那一整条都是能边看夜景边小酌的酒吧咖啡馆。到海滩正前方的生鱼片店或路边摊点一份生鱼片，基本是标配行程。",
      "交通方面，釜山地铁2号线海云台站3、5号出口离沙滩最近，要去市场或海里丹街的话4号出口更方便。⚠️ 海滩步道上垃圾桶很少，吃完的垃圾记得自己带走，到广场或洗手间旁再扔。出示身份证还能免费租1~2小时自行车，另外Google地图在韩国基本用不了，出发前先下好Kakao地图或Naver地图。想避开人潮就选7~10月去，不过6~7月是梅雨季，记得带把伞。",
    ],
    overviewVi: [
      "Haeundae là bãi cát dài 1,5km ở bờ đông Busan, nhiều năm liền giữ vị trí bãi biển mùa hè đông khách nhất Hàn Quốc. Ngay cả tên gọi cũng có chất riêng — tương truyền học giả Choi Chi-won thời Silla Thống nhất từng tự tay khắc chữ 'Haeundae' lên vách đá đảo Dongbaekseom gần đó. Mùa tắm biển chính thức chỉ từ cuối tháng 6 đến cuối tháng 8, nhưng thật ra Haeundae đáng ghé quanh năm.",
      "Nếu đến vào ban ngày, hãy đi bộ về phía tây tới đảo Dongbaekseom trước. Giờ đây hòn đảo nhỏ này đã nối liền với đất liền, có đường ván ven biển được xây rất chỉn chu, đi ngang Nhà APEC Nurimaru và ngọn hải đăng — hoàn toàn miễn phí — và cho bạn góc nhìn thẳng vào cầu Gwangan. Đi về phía đông thì có Sky Capsule (dài 2,3km, khoảng 20 phút, tốc độ chậm rãi 4km/h) và tàu biển chạy dọc đường ray cũ từ Mipo đến Cheongsapo. Chỗ này hot đến mức vé mua tại chỗ hay hết, nên đặt online trước là chắc ăn nhất. Đi thêm chút nữa sẽ gặp cầu ngắm cảnh Cheongsapo Daritdol, một cây cầu treo bắc qua biển đi qua khá phê.",
      "Sức hút thật sự nằm ở lúc trời tối. Về đêm, ánh đèn từ Marine City và cầu Gwangan phản chiếu xuống mặt biển đẹp đến mức chỉ cần dạo bộ thôi cũng ra dáng bộ ảnh sống ảo. Đói bụng thì ghé chợ Haeundae ăn vặt như eomuk (chả cá) hay hotteok (bánh kếp ngọt), rồi qua Haeridan-gil (con hẻm giữa ga và chợ) — cả dãy toàn quán bar, quán cà phê ngắm cảnh đêm cực đẹp. Gọi một đĩa hải sản sống ở nhà hàng hay lều hải sản ngay trước biển cũng gần như là điều bắt buộc.",
      "Về di chuyển, lối ra số 3 và 5 ga Haeundae (tuyến 2 tàu điện Busan) gần bãi cát nhất, còn muốn đến chợ hay Haeridan-gil thì ra lối số 4 tiện hơn. ⚠️ Đường dạo ven biển gần như không có thùng rác, nên giữ rác lại và vứt ở quảng trường hoặc gần nhà vệ sinh. Chỉ cần xuất trình giấy tờ tùy thân là thuê xe đạp miễn phí 1–2 tiếng, và vì Google Maps không hoạt động tốt ở Hàn nên tải sẵn KakaoMap hoặc Naver Map trước khi đến. Muốn tránh đông thì chọn tháng 7–10, nhưng tháng 6–7 là mùa mưa nên nhớ mang ô.",
    ],
    tips: {
      ko: [
        "지하철 2호선 해운대역 3·5번 출구가 백사장 최단 코스, 시장·해리단길은 4번 출구.",
        "스카이캡슐·해변열차는 인기 폭발이라 온라인 사전예매 필수.",
        "해변 산책로엔 쓰레기통 거의 없음 — 먹고 남은 건 직접 챙겨서 광장·화장실 앞에 버릴 것.",
        "신분증만 있으면 자전거 1~2시간 무료 대여, 구글맵 대신 카카오맵·네이버맵 필수.",
      ],
      en: [
        "Haeundae Station (Line 2) Exits 3/5 for the sand, Exit 4 for the market and Haeridan-gil.",
        "Sky Capsule and the Beach Train sell out fast — book online in advance.",
        "Almost no trash cans on the beach path — carry your rubbish to the plaza or restroom bins.",
        "Free bike rental (1–2 hrs, just show ID); use KakaoMap or Naver Map, not Google Maps.",
      ],
      zh: [
        "地铁2号线海云台站3、5号出口离沙滩最近，去市场、海里丹街走4号出口。",
        "天空胶囊、海边小火车很抢手，务必提前网上订票。",
        "海滩步道垃圾桶很少——吃完的垃圾请自行带到广场或洗手间旁再扔。",
        "出示身份证可免费租自行车1~2小时，导航请用Kakao地图或Naver地图，Google地图不好用。",
      ],
      vi: [
        "Ga Haeundae (tuyến 2) lối ra 3/5 gần bãi cát nhất, lối ra 4 để tới chợ và Haeridan-gil.",
        "Sky Capsule và tàu biển rất hot, hết vé nhanh — nhớ đặt online trước.",
        "Đường ven biển gần như không có thùng rác — giữ rác lại rồi vứt ở quảng trường hoặc gần nhà vệ sinh.",
        "Thuê xe đạp miễn phí 1–2 tiếng chỉ cần giấy tờ tùy thân; dùng KakaoMap/Naver Map thay vì Google Maps.",
      ],
    },
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/2/27/Haeundae_Beach_NightView.jpg",
      alt: "해운대 해수욕장 야경 — Haeundae Beach at night, Busan",
      license: "CC BY 4.0",
      credit: "Wikimedia Commons / Haeundae District Municipality",
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Haeundae_Beach_NightView.jpg",
    },
    lat: 35.1587,
    lng: 129.1604,
    addressKo: "부산광역시 해운대구 우동",
    addressEn: "U-dong, Haeundae-gu, Busan",
    tags: {
      ko: ["해운대", "부산 해변", "동백섬", "광안대교", "부산 여행"],
      en: ["Haeundae", "Busan beach", "Dongbaekseom", "Gwangan Bridge", "Busan travel"],
      zh: ["海云台", "釜山海滩", "冬柏岛", "广安大桥", "釜山旅游"],
      vi: ["Haeundae", "biển Busan", "Dongbaekseom", "cầu Gwangan", "du lịch Busan"],
    },
    faq: {
      ko: [
        {
          q: "해운대 해수욕장 입장료와 개장 시기는?",
          a: "백사장 자체는 무료로 개방되며 입장료가 없습니다. 공식 물놀이(해수욕) 시즌은 매년 6월 말부터 8월 말까지지만, 해변 산책과 야경은 사계절 언제 가도 좋습니다.",
        },
        {
          q: "해운대 가는 법은?",
          a: "부산 지하철 2호선 해운대역 3·5번 출구가 백사장과 가장 가깝고, 해운대시장·해리단길로 갈 땐 4번 출구가 편리합니다.",
        },
        {
          q: "해운대 스카이캡슐은 예약해야 하나요?",
          a: "네, 스카이캡슐과 해변열차는 인기가 많아 현장 구매만으로는 못 탈 수 있어 온라인 사전예매가 필수입니다. 사람이 덜 붐비는 시기를 원한다면 7~10월이 좋고, 야경은 해 진 뒤 마린시티·광안대교 조명이 물에 비칠 때가 가장 아름답습니다.",
        },
      ],
      en: [
        {
          q: "Is there an admission fee for Haeundae Beach, and when's the swimming season?",
          a: "The beach itself is free to enter — no admission fee. The official swimming season runs late June through late August, but the beach and its night views are worth visiting year-round.",
        },
        {
          q: "How do you get to Haeundae Beach?",
          a: "Haeundae Station (Busan Metro Line 2) Exits 3 and 5 drop you closest to the sand, while Exit 4 is better if you're headed to Haeundae Market or Haeridan-gil.",
        },
        {
          q: "Do I need to book the Sky Capsule in advance?",
          a: "Yes — the Sky Capsule and Beach Train are popular enough to sell out same-day, so book online ahead of time. For fewer crowds aim for July through October, and the beach is at its best after dark when the lights of Marine City and Gwangan Bridge reflect off the water.",
        },
      ],
      zh: [
        {
          q: "海云台海水浴场要门票吗？游泳季是什么时候？",
          a: "沙滩本身免费开放，不收门票。正式游泳季是每年6月底到8月底，不过海滩散步和夜景四季都值得来看。",
        },
        {
          q: "海云台怎么去？",
          a: "釜山地铁2号线海云台站3、5号出口离沙滩最近，去海云台市场或海里丹街的话4号出口更方便。",
        },
        {
          q: "天空胶囊需要提前订票吗？",
          a: "需要，天空胶囊和海边小火车很受欢迎，现场买票经常卖光，建议提前网上订票。想避开人潮就选7~10月去，夜晚Marine City和广安大桥的灯光倒映在海面时最美。",
        },
      ],
      vi: [
        {
          q: "Bãi biển Haeundae có mất phí vào cửa không? Mùa tắm biển là khi nào?",
          a: "Bãi biển mở cửa miễn phí, không thu vé vào cửa. Mùa tắm biển chính thức là từ cuối tháng 6 đến cuối tháng 8, nhưng dạo biển và ngắm cảnh đêm thì đáng ghé quanh năm.",
        },
        {
          q: "Đi đến bãi biển Haeundae bằng cách nào?",
          a: "Lối ra số 3 và 5 ga Haeundae (tuyến 2 tàu điện Busan) gần bãi cát nhất, còn muốn đến chợ Haeundae hay Haeridan-gil thì ra lối số 4 tiện hơn.",
        },
        {
          q: "Có cần đặt vé Sky Capsule trước không?",
          a: "Có, Sky Capsule và tàu biển rất hot nên vé mua tại chỗ hay hết, tốt nhất nên đặt online trước. Muốn tránh đông thì chọn tháng 7–10, và cảnh đẹp nhất là về đêm khi ánh đèn Marine City và cầu Gwangan phản chiếu xuống mặt biển.",
        },
      ],
    },
  },
  {
    slug: "n-seoul-tower",
    publishedAt: "2026-07-11",
    region: "seoul",
    category: "landmark",
    nameKo: "남산서울타워 (N서울타워)",
    nameEn: "N Seoul Tower",
    nameZh: "南山首尔塔 (N首尔塔)",
    nameVi: "Tháp N Seoul",
    summaryKo:
      "서울 왔으면 여기 인증샷은 국룰이죠. 236.7m 남산 정상에 서면 도시가 발 아래로 펼쳐지고, 해 지면 서울 전체가 보석함처럼 반짝여요. 케이블카·남산오르미로 오르는 길이 나뉘고, 전망대 아래 사랑의 자물쇠 존은 무료로 즐길 수 있어요.",
    summaryEn:
      "If you're in Seoul, this shot is basically mandatory. From the top of Namsan the whole city spreads out below you, and after dark Seoul glitters like a jewelry box. Cable car, love locks, and a killer night view — all in one.",
    summaryZh:
      "来首尔不来这打卡说不过去。高236.7米的南山之巅，整座城市360度在脚下完整铺展开来，入夜后首尔像打开的珠宝盒般闪耀迷人。缆车、南山Ormi斜行电梯、循环巴士各有玩法，塔下的爱情锁区免费开放，绝美夜景、浪漫合影一次全包。",
    summaryVi:
      "Đến Seoul mà chưa check-in ở đây thì hơi phí. Từ đỉnh Namsan, cả thành phố trải ra dưới chân bạn, và khi trời tối Seoul lấp lánh như một hộp trang sức. Cáp treo, khóa tình yêu và cảnh đêm cực đỉnh — tất cả trong một.",
    overviewKo: [
      "남산서울타워(N서울타워)는 서울 한복판 남산 꼭대기에 선 236.7m 높이의 타워예요. 1969년 방송탑으로 태어나 1980년부터 일반에 열렸고, 지금은 연간 1,200만 명이 찾는 서울의 얼굴이죠. 서울 웬만한 데서 고개만 들면 보이는데, 막상 그 위에 올라가면 한강부터 북한산까지 도시가 360도로 발 아래 펼쳐져요.",
      "올라가는 방법은 크게 세 가지예요. 제일 인기는 명동역 3번 출구에서 10분 걸어가 타는 남산 케이블카(왕복 약 15,000원)인데, 주말·공휴일엔 대기만 60~90분 걸리기도 하니 각오하세요. 걷긴 싫고 줄도 싫다면 회현역 쪽 '남산오르미'(경사형 엘리베이터·무료)로 케이블카 승강장까지 편하게 갈 수 있어요. 알뜰파에겐 남산 순환버스(01A·01B, 1,400원)가 최고인데, ⚠️ 현금은 안 받으니 T-money 교통카드를 꼭 챙기세요(편의점에서 구매 가능).",
      "꼭대기에서 헷갈리는 포인트 하나 — 케이블카 값과 전망대 입장료는 별개예요. 360도 유리 전망대는 별도 입장료(성인 약 29,000원)지만, 타워 아래 광장·팔각정·'사랑의 자물쇠' 존은 전부 무료라 여기만 즐겨도 뷰가 훌륭해요. 자물쇠는 위에서도 팔지만 편의점에서 미리 사가면 훨씬 저렴하고, 정해진 하트존에만 걸어야 해요. 이 밖에 드라마 '내 이름은 김삼순'의 삼순이 계단, 통유리 너머로 도시가 보이는 '스카이 화장실', 레이저 40대로 서울을 그리는 미디어아트 'Inside Seoul', 오후 3시 전통 공연까지 볼거리가 쏠쏠합니다.",
      "이곳의 진짜 하이라이트는 야경이에요. 꿀팁은 '일몰 정각'이 아니라 해 지기 60~90분 전에 올라가는 것 — 정각에 딱 맞춰 가면 케이블카 줄과 전망대 줄이 동시에 최악이 되거든요. 미리 올라가면 노을부터 야경까지 한 번에 챙길 수 있어요(겨울 5:30~6시, 여름 7~7:30 도착이 딱). 사진은 반사 심한 실내 유리창보다 야외 테라스가 오히려 맛집이고, 정상은 바람이 세니 얇은 겉옷 하나는 필수. 봄 벚꽃·가을 단풍 시즌엔 남산 자체가 그림이 됩니다.",
    ],
    overviewEn: [
      "N Seoul Tower (Namsan Tower) is a 236.7m tower crowning Namsan in the heart of Seoul. Born as a broadcast tower in 1969 and opened to the public in 1980, it's now the city's face, pulling in some 12 million visitors a year. You can spot it from almost anywhere in Seoul — and once you're up top, the city fans out 360° below you, from the Han River all the way to Bukhansan.",
      "Three main ways up. The most popular is the Namsan cable car (about ₩15,000 round-trip), a 10-minute walk from Myeongdong Station Exit 3 — but brace for 60–90 minute waits on weekends and holidays. Hate stairs and lines? Take the free 'Namsan Ormi' incline elevator up to the cable car station. Budget travelers swear by the Namsan circulation bus (01A/01B, ₩1,400) — but ⚠️ it takes no cash, so grab a T-money transit card first (any convenience store sells them).",
      "One thing that trips people up: the cable car fare and the observatory ticket are separate. The 360° glass observatory has its own admission (about ₩29,000 for adults), but the plaza, pavilion, and 'Locks of Love' fences at the base are all free — and the view from there is already stunning. Buy your padlock at a convenience store beforehand to save money, and clip it only in the designated Heart Zone. Also up top: the 'Sam-soon Stairs' from a hit K-drama, a 'Sky Restroom' with floor-to-ceiling city views, an 'Inside Seoul' media-art show painted by 40 laser projectors, and traditional performances at 3 PM.",
      "The real star here is the night view. Pro tip: don't aim for the exact sunset moment — arrive 60–90 minutes before, because hitting it dead-on means the worst cable car AND observatory lines at once. Come early and you'll catch daylight, dusk, and city lights in one go (around 5:30–6 PM in winter, 7–7:30 PM in summer). Skip the reflective indoor glass for photos — the outdoor terrace is the real spot — and bring a light layer, since the summit is windy. In cherry-blossom spring and fiery-red autumn, Namsan itself becomes the picture.",
    ],
    overviewZh: [
      "南山首尔塔（N首尔塔）是矗立于首尔市中心南山之巅、高236.7米的高塔。1969年作为广播塔诞生，1980年向公众开放，如今是首尔的门面，每年吸引约1,200万游客。在首尔几乎随处抬头可见，而当你真正登顶，整座城市便360度铺展于脚下——从汉江一直望到北汉山。",
      "登顶主要有三种方式。最热门的是南山缆车（往返约15,000韩元），从明洞站3号出口步行10分钟即到——但周末与节假日排队可能长达60~90分钟，请做好心理准备。不想爬也不想排队？可乘免费的「南山Ormi」斜行电梯直达缆车站。精打细算的旅客最爱南山循环巴士（01A/01B，1,400韩元）——但⚠️不收现金，请先备好T-money交通卡（便利店有售）。",
      "有个容易搞混的点：缆车费和观景台门票是分开的。360度玻璃观景台需另购门票（成人约29,000韩元），但塔下广场、八角亭与「爱情锁」区域全部免费，仅在此游览视野也已绝佳。锁可在便利店提前购买更划算，且只能挂在指定的爱心区。此外塔顶还有人气韩剧《我叫金三顺》的三顺阶梯、可透过整面玻璃俯瞰城市的「天空厕所」、由40台激光投影描绘首尔的媒体艺术「Inside Seoul」，以及下午3点的传统表演。",
      "这里真正的主角是夜景。小贴士：别卡着日落正点去——请提前60~90分钟登顶，因为正点抵达会同时撞上缆车与观景台最长的队伍。提前上去便可一次收获晚霞、暮色与万家灯火（冬季约17:30~18:00、夏季约19:00~19:30抵达最佳）。拍照别选反光严重的室内玻璃，室外露台才是真正的机位；山顶风大，记得带件薄外套。春季樱花、秋季红叶时节，南山本身就是一幅画。",
    ],
    overviewVi: [
      "Tháp N Seoul (Tháp Namsan) cao 236,7m sừng sững trên đỉnh Namsan giữa lòng Seoul. Ra đời làm tháp phát sóng năm 1969 và mở cửa cho công chúng từ 1980, nay là gương mặt của thành phố với khoảng 12 triệu lượt khách mỗi năm. Từ hầu hết mọi nơi ở Seoul ngẩng đầu lên là thấy — và khi thực sự lên đến đỉnh, cả thành phố trải ra 360° dưới chân bạn, từ sông Hàn cho tới tận núi Bukhansan.",
      "Có ba cách chính để lên. Phổ biến nhất là cáp treo Namsan (khoảng 15.000 won khứ hồi), đi bộ 10 phút từ lối ra 3 ga Myeongdong — nhưng hãy chuẩn bị tinh thần xếp hàng 60~90 phút vào cuối tuần và ngày lễ. Ngại leo và ngại hàng dài? Đi thang máy nghiêng 'Namsan Ormi' (miễn phí) lên tận trạm cáp treo. Dân đi tiết kiệm thì mê xe buýt vòng Namsan (01A/01B, 1.400 won) — nhưng ⚠️ không nhận tiền mặt, hãy sắm thẻ giao thông T-money trước (cửa hàng tiện lợi nào cũng bán).",
      "Một điểm hay gây nhầm: vé cáp treo và vé đài quan sát là riêng biệt. Đài quan sát kính 360° có vé riêng (người lớn khoảng 29.000 won), nhưng quảng trường, lầu bát giác và hàng rào 'Khóa tình yêu' dưới chân tháp đều miễn phí — và tầm nhìn từ đó đã tuyệt đẹp. Mua khóa ở cửa hàng tiện lợi trước cho rẻ, và chỉ treo ở Khu Trái Tim quy định. Trên đỉnh còn có 'Cầu thang Sam-soon' từ bộ phim Hàn ăn khách, 'Nhà vệ sinh Bầu trời' nhìn thành phố qua kính suốt, màn nghệ thuật media 'Inside Seoul' vẽ bằng 40 máy chiếu laser, và biểu diễn truyền thống lúc 3 giờ chiều.",
      "Ngôi sao thực sự ở đây là cảnh đêm. Mẹo hay: đừng canh đúng khoảnh khắc hoàng hôn — hãy lên trước 60~90 phút, vì đến đúng lúc đó là dính hàng dài nhất ở cả cáp treo LẪN đài quan sát. Lên sớm bạn sẽ bắt trọn ánh chiều, hoàng hôn và đèn thành phố trong một lần (mùa đông khoảng 17:30~18:00, mùa hè 19:00~19:30 là chuẩn). Chụp ảnh thì bỏ qua kính trong nhà hay bị lóa — sân thượng ngoài trời mới là góc đẹp — và mang theo áo khoác mỏng vì đỉnh núi gió mạnh. Mùa xuân hoa anh đào, mùa thu lá đỏ, bản thân Namsan đã là một bức tranh.",
    ],
    tips: {
      ko: [
        "야경 보려면 일몰 60~90분 전 도착 — 정각에 딱 맞춰 가면 케이블카·전망대 줄 지옥.",
        "전망대(약 29,000원)와 케이블카(왕복 약 15,000원)는 별도 요금. 무료 광장·자물쇠존 뷰만으로도 충분.",
        "순환버스(01A·01B, 1,400원)는 현금 불가 — T-money 교통카드 필수.",
        "사진은 반사 심한 실내 유리보다 야외 테라스가 맛집. 정상은 바람 세니 겉옷 챙기기.",
      ],
      en: [
        "For night views, arrive 60–90 min before sunset — hitting it dead-on means the worst cable car + observatory lines.",
        "Observatory (~₩29,000) and cable car (~₩15,000 round-trip) are separate fees. The free plaza + Locks of Love view is plenty.",
        "The circulation bus (01A/01B, ₩1,400) takes no cash — you need a T-money card.",
        "For photos, skip the reflective indoor glass — the outdoor terrace wins. It's windy up top, so bring a layer.",
      ],
      zh: [
        "看夜景请在日落前60~90分钟抵达——卡着正点去会撞上缆车+观景台最长的队。",
        "观景台（约29,000韩元）与缆车（往返约15,000韩元）分开收费。免费广场+爱情锁的视野已足够。",
        "循环巴士（01A/01B，1,400韩元）不收现金——需备T-money交通卡。",
        "拍照别用反光的室内玻璃，室外露台更佳。山顶风大，记得带外套。",
      ],
      vi: [
        "Ngắm cảnh đêm thì đến trước hoàng hôn 60~90 phút — canh đúng lúc là dính hàng dài nhất ở cáp treo + đài quan sát.",
        "Đài quan sát (~29.000 won) và cáp treo (~15.000 won khứ hồi) tính phí riêng. Chỉ ngắm quảng trường + Khóa tình yêu miễn phí cũng đã đủ đẹp.",
        "Xe buýt vòng (01A/01B, 1.400 won) không nhận tiền mặt — cần thẻ T-money.",
        "Chụp ảnh thì bỏ kính trong nhà hay lóa — sân thượng ngoài trời đẹp hơn. Đỉnh núi gió mạnh, nhớ mang áo khoác.",
      ],
    },
    image: {
      url: "https://tong.visitkorea.or.kr/cms/resource_photo/02/4062102_image2_1.jpg",
      alt: "남산서울타워와 서울 야경 — N Seoul Tower and Seoul night view",
      license: "공공누리 제1유형",
      credit: "한국관광공사 / 정규진",
      creditUrl: "https://phoko.visitkorea.or.kr",
    },
    lat: 37.5510545,
    lng: 126.9878821,
    addressKo: "서울특별시 용산구 남산공원길 105",
    addressEn: "105 Namsangongwon-gil, Yongsan-gu, Seoul",
    tags: {
      ko: ["남산서울타워", "N서울타워", "서울 야경", "남산 케이블카", "사랑의 자물쇠"],
      en: ["N Seoul Tower", "Namsan", "Seoul night view", "cable car", "love padlock"],
      zh: ["南山首尔塔", "N首尔塔", "首尔夜景", "南山缆车", "爱情锁"],
      vi: ["Tháp N Seoul", "Namsan", "cảnh đêm Seoul", "cáp treo", "khóa tình yêu"],
    },
    faq: {
      ko: [
        {
          q: "남산서울타워 입장료는 얼마인가요?",
          a: "케이블카 왕복 약 15,000원과 전망대 입장료 약 29,000원(성인)은 별도로 결제해야 합니다. 타워 아래 광장·팔각정·사랑의 자물쇠 존은 모두 무료로 즐길 수 있어요.",
        },
        {
          q: "남산서울타워 가는 법은?",
          a: "명동역 3번 출구에서 10분 걸어가면 남산 케이블카 승강장이 나옵니다. 순환버스(01A·01B, 1,400원)도 있지만 현금은 받지 않으니 T-money 교통카드를 미리 준비하세요.",
        },
        {
          q: "남산서울타워 야경은 언제 보러 가야 하나요?",
          a: "일몰 정각이 아니라 60~90분 전에 올라가는 게 꿀팁입니다. 정각에 맞춰 가면 케이블카와 전망대 줄이 동시에 최악이 되거든요. 미리 올라가면 노을부터 야경까지 한 번에 볼 수 있고, 정상은 바람이 세니 얇은 겉옷을 챙기는 게 좋아요.",
        },
      ],
      en: [
        {
          q: "How much does N Seoul Tower cost to visit?",
          a: "The cable car round-trip runs about ₩15,000 and the 360° observatory is a separate ticket at about ₩29,000 for adults. The plaza, pavilion, and Locks of Love zone at the base are all free to enjoy.",
        },
        {
          q: "How do you get to N Seoul Tower?",
          a: "It's a 10-minute walk from Myeongdong Station Exit 3 to the Namsan cable car station. The circulation bus (01A/01B, ₩1,400) is another option, but it takes no cash — bring a T-money transit card.",
        },
        {
          q: "When's the best time to catch the night view?",
          a: "Arrive 60–90 minutes before sunset rather than right at golden hour — hitting it dead-on means the worst lines at both the cable car and the observatory. Getting there early lets you catch daylight, dusk, and city lights in one visit, and it's windy at the summit, so bring a light layer.",
        },
      ],
      zh: [
        {
          q: "南山首尔塔门票多少钱？",
          a: "缆车往返约15,000韩元，360度观景台门票另算，成人约29,000韩元。塔下广场、八角亭和爱情锁区域全部免费。",
        },
        {
          q: "南山首尔塔怎么去？",
          a: "从明洞站3号出口步行10分钟即可到达南山缆车站。也可以乘循环巴士（01A/01B，1,400韩元），但不收现金，记得带T-money交通卡。",
        },
        {
          q: "什么时候去看夜景最好？",
          a: "别卡着日落正点去，提前60~90分钟登顶最好——正点抵达会同时撞上缆车和观景台最长的队伍。提前上去能一次收获晚霞和万家灯火，山顶风大记得带件外套。",
        },
      ],
      vi: [
        {
          q: "Lên Tháp N Seoul tốn bao nhiêu tiền?",
          a: "Cáp treo khứ hồi khoảng 15.000 won, còn vé đài quan sát 360° tính riêng, khoảng 29.000 won cho người lớn. Quảng trường, lầu bát giác và khu Khóa tình yêu dưới chân tháp đều miễn phí.",
        },
        {
          q: "Đi đến Tháp N Seoul bằng cách nào?",
          a: "Đi bộ 10 phút từ lối ra 3 ga Myeongdong là tới trạm cáp treo Namsan. Cũng có thể đi xe buýt vòng (01A/01B, 1.400 won), nhưng không nhận tiền mặt nên nhớ mang theo thẻ T-money.",
        },
        {
          q: "Nên lên ngắm cảnh đêm vào lúc nào?",
          a: "Đừng canh đúng khoảnh khắc hoàng hôn — hãy lên trước 60–90 phút, vì đến đúng lúc đó là dính hàng dài nhất ở cả cáp treo lẫn đài quan sát. Lên sớm bạn sẽ bắt trọn ánh chiều, hoàng hôn và đèn thành phố, và nhớ mang áo khoác mỏng vì đỉnh núi gió mạnh.",
        },
      ],
    },
  },
  {
    slug: "bukchon-hanok-village",
    publishedAt: "2026-07-10",
    region: "seoul",
    category: "culture",
    nameKo: "북촌한옥마을",
    nameEn: "Bukchon Hanok Village",
    nameZh: "北村韩屋村",
    nameVi: "Làng Hanok Bukchon",
    summaryKo:
      "경복궁·창덕궁 사이 언덕에 진짜 사람이 사는 한옥 동네예요. 골목 계단을 오르다 뒤돌아보면 기와지붕 너머로 남산타워가 짠 — 이게 바로 국룰 인증샷이죠. 대신 여긴 누군가의 앞마당이라는 것만 잊지 마세요.",
    summaryEn:
      "A hillside hanok neighborhood between Gyeongbokgung and Changdeokgung where people actually live. Climb the alley stairs, glance back, and tiled roofs frame N Seoul Tower like magic — the classic must-shoot. Just remember it's someone's front yard, not a film set.",
    summaryZh:
      "位于景福宫与昌德宫之间的山坡上，是一个至今仍有600多户居民真实生活的韩屋村。沿着窄窄的巷弄石阶往上爬，途中喘口气回头一看，层层叠叠的瓦顶后方悄悄探出一座南山塔——这就是必拍的经典一张。但别忘了，这里是别人的家，游览时请放轻脚步、压低音量。",
    summaryVi:
      "Khu hanok trên đồi giữa Gyeongbokgung và Changdeokgung, nơi người dân vẫn sinh sống thật sự. Leo hết dốc hẻm rồi ngoảnh lại, mái ngói xếp lớp bỗng lộ ra tháp Namsan phía sau — góc ảnh 'phải chụp' kinh điển. Nhưng đừng quên đây là sân nhà của ai đó, không phải phim trường.",
    overviewKo: [
      "북촌은 경복궁, 창덕궁, 종묘 사이 언덕에 조선시대 왕족과 고관들이 살던 동네예요. 지금도 600채 넘는 한옥이 다닥다닥 붙어있어서, 골목 하나만 들어서도 타임슬립한 기분이 들어요. 관광지로 뜬 건 사실 10여 년밖에 안 됐다는 것도 은근 반전 포인트.",
      "포토존은 단연 가회동 11번지 언덕길. 계단 오르다 숨 한번 몰아쉬고 뒤돌아보면, 기와지붕이 파도처럼 겹치는 뒤로 남산타워가 살짝 얹혀요. 이 대표 뷰포인트 8곳을 묶어서 '북촌8경'이라 부르는데, 굳이 다 돌 필요 없이 3~7경만 이어도 알찬 코스가 나와요. ⚠️ 대신 사람 몰리는 낮 12시~2시는 피하고, 오전 9~11시나 해질 무렵 노리는 게 현지인 꿀팁.",
      "여기서 제일 중요한 건 '누군가의 집'이라는 사실이에요. 대문 안쪽 기웃거리기, 초인종 장난, 큰 소리로 떠들기 — 다 주민 민원 1순위예요. 실제로 오후 5시 이후엔 촬영 자제를 요청하는 구역(레드존)까지 생겼을 정도. 쓰레기통도 거의 없으니 먹던 음료·간식은 그냥 챙겨 나오세요.",
      "다리 아프면 삼청동 카페골목으로 내려가서 한숨 돌리세요. 한옥 개조 카페들이 줄줄이 있어서 앉아 쉬기 딱이고, 그대로 걸어서 인사동까지 이어집니다. 한복 입고 왔다면 참고 — 돌길에 언덕이라 긴 치마는 고생길, 짧은 한복 + 삼청동 평지 코스로 짜는 게 편해요.",
    ],
    overviewEn: [
      "Bukchon sits on the hill between Gyeongbokgung, Changdeokgung, and Jongmyo — once home to Joseon royalty and top officials. Over 600 hanok still stand shoulder to shoulder here, so turning down one alley feels like stepping into a time warp. Plot twist: it's only been a tourist draw for about a decade.",
      "The photo spot is the sloped alley around Gahoe-dong 11. Climb a bit, catch your breath, look back — tiled roofs ripple away with N Seoul Tower perched on top. Eight such viewpoints make up 'Bukchon's 8 Views,' but you don't need all of them; views 3 through 7 alone make a solid loop. ⚠️ Skip the noon-to-2pm crush — locals swear by 9-11am or just before sunset instead.",
      "The one thing to remember: this is somebody's home. Peeking through gates, ringing doorbells for fun, talking loudly — all top complaints from residents. It's serious enough that a 'red zone' around Bukchon-ro 11-gil now asks visitors to stop shooting after 5pm. There are barely any public trash cans either, so pack out your drink cups and snack wrappers.",
      "Tired legs? Head down to the Samcheong-dong cafe street for a break — it's lined with hanok-turned-cafes, then flows straight into Insa-dong on foot. Wearing hanbok? The stone slopes are brutal on long skirts, so go short and stick to the flatter Samcheong-dong stretch for the easy photos.",
    ],
    overviewZh: [
      "北村坐落在景福宫、昌德宫与宗庙之间的山坡上，曾是朝鲜王族与高官的居所。如今仍有600多栋韩屋鳞次栉比，随便拐进一条小巷都像穿越回古代。有意思的是，这里成为观光地其实才不过十来年。",
      "拍照圣地当属嘉会洞11号地一带的坡道。爬几步喘口气回头一看，层层叠叠的瓦顶后面正好托着一座南山塔。这样的代表性观景点一共八处，合称「北村八景」，其实不用全走完，3至7景连起来就是一条很赞的路线。⚠️ 中午12点到2点是团客高峰，本地人更推荐上午9到11点或傍晚时分。",
      "最重要的一点：这里是别人的家。窥探大门内部、恶作剧按门铃、大声喧哗，都是居民投诉的头号原因。情况严重到嘉会洞11巷一带已经划出「红区」，要求下午5点后停止拍摄。这一带几乎没有垃圾桶，喝剩的饮料、零食包装记得自己带走。",
      "走累了就下到三清洞咖啡街歇歇脚，一路韩屋改造的咖啡馆接连不断，再顺势走到仁寺洞。如果穿韩服来——石板坡路对长裙很不友好，建议穿短款，把行程重心放在地势平坦的三清洞。",
    ],
    overviewVi: [
      "Bukchon nằm trên đồi giữa Gyeongbokgung, Changdeokgung và Jongmyo — từng là nơi ở của hoàng tộc và quan lại cấp cao thời Joseon. Hơn 600 ngôi hanok vẫn san sát nhau ở đây, chỉ cần rẽ vào một con hẻm là cảm giác như xuyên không về quá khứ. Thú vị là nơi này mới trở thành điểm du lịch chưa đầy chục năm.",
      "Góc chụp ảnh đỉnh nhất là con dốc quanh Gahoe-dong số 11. Leo vài bước, thở dốc, ngoảnh lại — mái ngói xếp lớp cuộn sóng phía sau, đúng lúc tháp Namsan ló ra ở trên. Tám điểm ngắm như vậy gộp thành '8 cảnh Bukchon', nhưng chẳng cần đi hết, chỉ cần nối cảnh 3 đến 7 là đã trọn vẹn. ⚠️ Tránh khung giờ 12h-14h đông nghẹt đoàn khách, dân địa phương mách nên đi 9-11h sáng hoặc lúc chiều tà.",
      "Điều quan trọng nhất cần nhớ: đây là nhà của ai đó. Nhìn trộm qua cổng, bấm chuông đùa, nói chuyện ồn ào — đều là những lý do khiến cư dân phàn nàn nhiều nhất. Nghiêm trọng đến mức khu vực quanh Bukchon-ro 11-gil giờ có 'vùng đỏ' yêu cầu ngừng chụp ảnh sau 17h. Ở đây cũng gần như không có thùng rác, nên đồ uống hay vỏ bánh ăn dở nhớ mang theo mình.",
      "Mỏi chân thì xuống phố cà phê Samcheong-dong nghỉ chân — la liệt quán cà phê cải tạo từ hanok, rồi cứ thế đi bộ tiếp sang Insa-dong. Nếu mặc hanbok — đường dốc lát đá không hợp với váy dài, nên chọn hanbok ngắn và dồn lịch trình vào đoạn Samcheong-dong bằng phẳng.",
    ],
    tips: {
      ko: [
        "지하철 3호선 안국역 2번 출구에서 도보 진입 — 오르막이라 편한 신발 필수.",
        "포토존 붐빔 피하려면 오전 9~11시나 해질녘 — 낮 12시~2시는 단체관광 피크타임.",
        "가회동 11번지 일대는 오후 5시 이후 촬영 자제 요청 구역(레드존) — 표지판 확인.",
        "쓰레기통이 없는 주택가 — 쓰레기 되가져가기, 대문 안쪽 기웃거리기 금지.",
      ],
      en: [
        "Walk up from Anguk Station Exit 2 (Line 3) — it's an uphill climb, so wear real shoes.",
        "Dodge the crowds by going 9–11am or near sunset; noon–2pm is peak tour-group hour.",
        "The Gahoe-dong 11 area is a 'red zone' asking visitors to stop shooting after 5pm — check the signs.",
        "There are barely any trash cans in this residential area — pack out your trash, and don't peek through open gates.",
      ],
      zh: [
        "地铁3号线安国站2号出口步行进入——上坡路，请穿舒适的鞋。",
        "避开人潮选上午9-11点或傍晚——中午12点到2点是旅行团高峰时段。",
        "嘉会洞11号地一带是「红区」，下午5点后请勿拍摄——留意告示牌。",
        "住宅区几乎没有垃圾桶——请自行带走垃圾，也不要窥探敞开的大门。",
      ],
      vi: [
        "Đi bộ lên từ lối ra 2, ga Anguk (tuyến 3) — đường dốc nên hãy đi giày thoải mái.",
        "Tránh đông người bằng cách đi 9-11h sáng hoặc lúc chiều tà — 12h-14h là giờ cao điểm đoàn khách.",
        "Khu vực Gahoe-dong số 11 là 'vùng đỏ' yêu cầu ngừng chụp ảnh sau 17h — chú ý biển báo.",
        "Khu dân cư gần như không có thùng rác — hãy mang rác theo mình, và đừng nhìn trộm qua cổng mở.",
      ],
    },
    image: {
      url: "https://tong.visitkorea.or.kr/cms2/website/17/3537917.jpg",
      alt: "북촌한옥마을 골목 — Bukchon Hanok Village alley, Seoul",
      license: "공공누리 제1유형",
      credit: "한국관광공사 / 서문교",
      creditUrl: "https://phoko.visitkorea.or.kr",
    },
    lat: 37.5791613,
    lng: 126.9864255,
    addressKo: "서울특별시 종로구 계동길 37",
    addressEn: "37 Gyedong-gil, Jongno-gu, Seoul",
    tags: {
      ko: ["북촌한옥마을", "한옥", "가회동", "북촌8경", "서울 전통마을"],
      en: ["Bukchon", "hanok", "Gahoe-dong", "traditional village", "Seoul"],
      zh: ["北村韩屋村", "韩屋", "嘉会洞", "北村八景", "首尔传统村"],
      vi: ["Bukchon", "hanok", "Gahoe-dong", "làng truyền thống", "Seoul"],
    },
    faq: {
      ko: [
        {
          q: "북촌한옥마을 입장료와 운영시간은 어떻게 되나요?",
          a: "북촌은 실제 주민이 사는 동네라 별도 입장료나 정해진 운영시간이 없어요. 다만 가회동 11번지 일대는 오후 5시 이후 촬영 자제를 요청하는 레드존이니 이 시간대는 피하는 게 좋아요.",
        },
        {
          q: "북촌한옥마을은 어떻게 가나요?",
          a: "지하철 3호선 안국역 2번 출구에서 도보로 들어가면 돼요. 언덕길이 계속 이어지니 편한 신발을 신고 가는 걸 추천해요.",
        },
        {
          q: "언제 가야 사람이 덜 붐비고 사진이 잘 나오나요?",
          a: "오전 9~11시나 해질 무렵이 가장 한산해요. 낮 12시~2시는 단체관광 피크타임이라 붐비니 피하세요. 가회동 11번지 언덕길에서 뒤돌아보면 기와지붕 너머로 남산타워가 보이는 게 대표 포토존이에요.",
        },
      ],
      en: [
        {
          q: "What are the entrance fee and hours for Bukchon Hanok Village?",
          a: "Bukchon is a real residential neighborhood, so there's no entrance fee or fixed hours. That said, the Gahoe-dong 11 area is a 'red zone' asking visitors to stop photographing after 5pm, so it's best to avoid that window.",
        },
        {
          q: "How do I get to Bukchon Hanok Village?",
          a: "Walk up from Anguk Station Exit 2 (Line 3). It's a steady uphill climb, so wear comfortable shoes.",
        },
        {
          q: "When's the best time to visit for fewer crowds and good photos?",
          a: "Aim for 9-11am or just before sunset — noon to 2pm is peak tour-group hour. The classic photo spot is the sloped alley around Gahoe-dong 11, where tiled roofs frame N Seoul Tower when you look back.",
        },
      ],
      zh: [
        {
          q: "北村韩屋村的门票和开放时间是怎样的？",
          a: "北村是真实的居民生活区，没有门票也没有固定开放时间。不过嘉会洞11号地一带是「红区」，下午5点后请勿拍摄，最好避开这个时段前往。",
        },
        {
          q: "北村韩屋村怎么去？",
          a: "从地铁3号线安国站2号出口步行进入即可，一路都是上坡路，建议穿舒适的鞋子。",
        },
        {
          q: "什么时候去人少、好拍照？",
          a: "上午9点到11点或傍晚时分人最少，中午12点到2点是旅行团高峰要避开。代表性拍照点是嘉会洞11号地一带的坡道，回头一看瓦顶层叠间正好衬出南山塔。",
        },
      ],
      vi: [
        {
          q: "Làng Hanok Bukchon có mất phí vào cửa và giờ mở cửa thế nào?",
          a: "Bukchon là khu dân cư thật sự có người sinh sống nên không thu phí vào cửa hay có giờ mở cửa cố định. Tuy nhiên khu vực Gahoe-dong số 11 là 'vùng đỏ' yêu cầu ngừng chụp ảnh sau 17h, nên tránh khung giờ đó.",
        },
        {
          q: "Đi đến Làng Hanok Bukchon bằng cách nào?",
          a: "Đi bộ lên từ lối ra số 2, ga Anguk (tuyến 3). Đường dốc lên liên tục nên hãy đi giày thoải mái.",
        },
        {
          q: "Nên đi lúc nào để đỡ đông người và chụp ảnh đẹp?",
          a: "Tốt nhất là 9-11h sáng hoặc gần lúc chiều tà — khung 12h-14h là giờ cao điểm đoàn khách nên tránh. Góc chụp kinh điển là con dốc quanh Gahoe-dong số 11, ngoảnh lại sẽ thấy mái ngói xếp lớp lộ ra tháp Namsan phía sau.",
        },
      ],
    },
  },
  {
    slug: "seongsan-ilchulbong",
    publishedAt: "2026-07-09",
    region: "jeju",
    category: "nature",
    nameKo: "성산일출봉",
    nameEn: "Seongsan Ilchulbong (Sunrise Peak)",
    nameZh: "城山日出峰",
    nameVi: "Đỉnh Seongsan Ilchulbong",
    summaryKo:
      "5천 년 전 바닷속에서 '펑' 터진 화산이 만든 왕관 모양 분화구, 2007년 유네스코 세계자연유산이에요. 계단 20분이면 정상 찍고 우도까지 눈에 담기는 제주 동쪽 최고 스팟인데, 일출 보러 가려면 새벽 기상은 국룰이에요.",
    summaryEn:
      "A crown-shaped crater born from an undersea eruption 5,000 years ago. Just 20 minutes of stairs gets you to the top with Udo island laid out below — Jeju's east-coast showstopper, though catching sunrise means setting an alarm you'll regret.",
    summaryZh:
      "5000年前海底火山一声「轰」隆炸出的王冠形火山口，99座尖峭岩峰环绕如冠，2007年还入选联合国教科文组织世界自然遗产。爬20分钟阶梯登顶，牛岛就在眼前铺开——济州东部最强打卡地，只是想看日出，凌晨爬起来是躲不掉的仪式。",
    summaryVi:
      "Miệng núi lửa hình vương miện ra đời từ một vụ nổ dưới đáy biển cách đây 5.000 năm. Chỉ 20 phút leo bậc thang là lên đến đỉnh, đảo Udo trải dài trước mắt — điểm đến đỉnh nhất bờ đông Jeju, chỉ có điều muốn ngắm bình minh thì phải chấp nhận dậy sớm.",
    overviewKo: [
      "성산일출봉은 5천 년 전 얕은 바다에서 마그마가 물을 만나 한번에 터지면서 생긴 높이 182m짜리 화산체예요. 정상엔 지름 600m짜리 사발 모양 분화구가 있고, 99개 뾰족바위가 왕관처럼 둘러싸고 있어요. 2007년 유네스코 세계자연유산 등재까지 됐으니 '그냥 언덕'이 아니라는 것만 알고 가세요.",
      "일출 보러 갈 거면 타이밍이 생명이에요. 매표는 오전 7시부터인데, 그 전엔 무료로 입장 가능(정상 요금은 성인 5,000원)이라 새벽 일출러들은 이 타이밍을 놓치지 않아요. 계단은 300~500개 정도, 편도 20~30분이면 충분하지만 정상은 바람이 예사롭지 않으니 얇은 바람막이 하나 꼭 챙기세요. ⚠️ 어스름한 새벽엔 들개가 종종 출몰한다는 얘기도 있으니 무리 지어 오르는 걸 추천해요.",
      "분화구도 분화구지만, 진짜 인생샷은 바로 아래 광치기해변에서 나와요. 용암이 바닷물 만나 굳으면서 생긴 넓적한 검은 바위밭이 펼쳐지는데, 썰물 때 초록 이끼가 드러나면 그 위로 일출봉 실루엣이 통째로 담겨요. 올레1코스에 걸쳐 있어서 슬슬 걸으며 사진 찍기도 좋아요.",
      "체력 남았으면 성산항에서 배로 15분 거리인 우도까지 이어보세요. 왕복 배삯은 대략 1만 원 안팎, 섬에서는 전기자전거나 일주버스로 돌면 됩니다. 막배가 오후 6시쯤 끊기니 시간 계산은 필수 — 일출봉 → 광치기해변 → 우도로 이어지는 동부 코스면 하루가 알차게 채워져요.",
    ],
    overviewEn: [
      "Seongsan Ilchulbong is a 182m volcanic cone that erupted when magma hit shallow seawater about 5,000 years ago. The summit holds a 600m-wide bowl-shaped crater ringed by 99 jagged rock peaks like a crown. It made UNESCO's World Heritage list in 2007, so this is no ordinary hill.",
      "If you're chasing sunrise, timing is everything. Ticketing opens at 7am, but you can walk in free before that (full price is 5,000 won for adults) — early birds never miss this window. Expect 300–500 steps and 20–30 minutes one way, but the summit wind is no joke, so bring a light windbreaker. ⚠️ Stray dogs have been spotted in the pre-dawn dark, so climbing with a group is smart.",
      "The crater's great, but the real money shot is down at Gwangchigi Beach. Lava met seawater here and hardened into flat black rock fields — at low tide, green moss surfaces and frames the whole peak in silhouette. It sits right on Olle Trail Course 1, so it's an easy stroll-and-shoot.",
      "Got energy left? Ride the 15-minute ferry from Seongsan Port to Udo island. Round-trip fare runs roughly 10,000 won, and you can loop the island by e-bike or shuttle bus. The last boat leaves around 6pm, so plan your clock — Ilchulbong, then Gwangchigi, then Udo makes a full, satisfying east-coast day.",
    ],
    overviewZh: [
      "城山日出峰是约5000年前岩浆遇上浅海海水瞬间喷发形成的182米火山体。峰顶是直径600米的碗状火山口，99座尖峭岩峰如王冠般环绕四周。2007年被列入联合国教科文组织世界自然遗产，可不是普通的小山丘。",
      "想看日出，时间就是一切。售票从早上7点开始，之前免费入场（正常票价成人5,000韩元），早起党绝不会错过这个窗口。台阶约300到500级，单程20到30分钟就够，但峰顶的风相当猛，记得带件薄防风外套。⚠️ 天还没亮时偶尔会有流浪狗出没，建议结伴登顶。",
      "比起火山口，真正的出片地其实在山脚下的光致其海边。熔岩遇上海水凝固成大片平坦的黑色岩石，退潮时露出绿色苔藓，正好把整座日出峰的剪影框进画面。这里也是济州偶来1号步道的一段，边走边拍毫不费力。",
      "体力允许的话，从城山港坐15分钟渡轮去牛岛继续玩。往返船票大约1万韩元左右，岛上租电动自行车或搭环岛巴士都很方便。末班船大约傍晚6点收班，时间要算好——日出峰、光致其海边、牛岛连成一条东部路线，正好填满充实的一天。",
    ],
    overviewVi: [
      "Seongsan Ilchulbong là nón núi lửa cao 182m, hình thành khi magma gặp nước biển nông và phun trào cách đây khoảng 5.000 năm. Đỉnh là miệng núi hình bát rộng 600m, viền quanh bởi 99 chóp đá lởm chởm như vương miện. Được UNESCO công nhận Di sản Thế giới năm 2007, đây chẳng phải một quả đồi bình thường.",
      "Nếu muốn săn bình minh, thời gian là tất cả. Quầy vé mở từ 7h sáng, nhưng trước đó bạn có thể vào miễn phí (giá vé đầy đủ là 5.000 won cho người lớn) — dân săn bình minh không bao giờ bỏ lỡ khung giờ này. Khoảng 300-500 bậc thang, 20-30 phút một chiều, nhưng gió trên đỉnh khá mạnh nên nhớ mang áo gió mỏng. ⚠️ Lúc trời còn tờ mờ, thỉnh thoảng có chó hoang xuất hiện, nên leo theo nhóm sẽ an toàn hơn.",
      "Miệng núi lửa đã đẹp, nhưng góc ảnh 'đỉnh của đỉnh' lại nằm ở bãi biển Gwangchigi ngay dưới chân núi. Dung nham gặp nước biển đông cứng thành những phiến đá đen phẳng lì, khi triều xuống rêu xanh lộ ra và in trọn bóng ngọn núi phía sau. Bãi biển này nằm ngay trên cung đường Olle số 1 nên vừa đi bộ vừa chụp ảnh rất thoải mái.",
      "Còn sức thì đi tiếp phà 15 phút từ cảng Seongsan sang đảo Udo. Vé khứ hồi khoảng 10.000 won, trên đảo có thể thuê xe đạp điện hoặc đi xe buýt vòng quanh đảo. Chuyến phà cuối khoảng 18h nên nhớ canh giờ — nối Ilchulbong, Gwangchigi rồi Udo là trọn một ngày bờ đông đầy đặn.",
    ],
    tips: {
      ko: [
        "오전 7시 전엔 무료입장 — 일출 보러 갈 거면 이 타이밍 놓치지 마세요(정상 요금은 성인 5,000원).",
        "계단 300~500개, 편도 20~30분 — 비 온 뒤엔 미끄러우니 운동화 필수, 정상 바람 세니 바람막이도.",
        "광치기해변 썰물 때 이끼바위 위로 일출봉 실루엣 사진이 진짜 인생샷.",
        "성산항에서 우도行 배는 15분, 막배 오후 6시경 — 시간 놓치지 않게 미리 확인.",
      ],
      en: [
        "Free entry before 7am — don't miss it if you're chasing sunrise (full price is 5,000 won for adults).",
        "300–500 steps, 20–30 min one way — wear sneakers (steps get slippery after rain) and pack a windbreaker for the summit.",
        "The real money shot: Ilchulbong's silhouette over mossy rocks at Gwangchigi Beach during low tide.",
        "Ferries to Udo from Seongsan Port take 15 min; the last one leaves around 6pm — check the schedule ahead.",
      ],
      zh: [
        "早上7点前免费入场——想看日出千万别错过这个时段（正常票价成人5,000韩元）。",
        "台阶约300-500级，单程20-30分钟——雨后台阶湿滑请穿运动鞋，峰顶风大记得带防风外套。",
        "光致其海边退潮时，苔藓岩石配日出峰剪影才是真正的出片好照。",
        "城山港到牛岛渡轮15分钟，末班船约傍晚6点——务必提前确认时间。",
      ],
      vi: [
        "Vào cửa miễn phí trước 7h sáng — đừng bỏ lỡ nếu bạn săn bình minh (giá vé đầy đủ 5.000 won/người lớn).",
        "Khoảng 300-500 bậc thang, 20-30 phút một chiều — đi giày thể thao vì bậc trơn sau mưa, mang thêm áo gió cho đỉnh núi.",
        "Góc ảnh đỉnh nhất: bóng Ilchulbong in trên đá rêu ở bãi Gwangchigi lúc triều xuống.",
        "Phà từ cảng Seongsan sang Udo mất 15 phút, chuyến cuối khoảng 18h — kiểm tra lịch trước khi đi.",
      ],
    },
    image: {
      url: "https://tong.visitkorea.or.kr/cms2/website/88/3415088.jpg",
      alt: "성산일출봉 — Seongsan Ilchulbong tuff cone, Jeju",
      license: "공공누리 제1유형",
      credit: "한국관광공사 / 정희준",
      creditUrl: "https://phoko.visitkorea.or.kr",
    },
    lat: 33.4580802,
    lng: 126.9415004,
    addressKo: "제주특별자치도 서귀포시 성산읍 일출로 284-12",
    addressEn: "284-12 Ilchul-ro, Seongsan-eup, Seogwipo-si, Jeju-do",
    tags: {
      ko: ["성산일출봉", "제주 여행", "유네스코 세계자연유산", "일출", "분화구"],
      en: ["Seongsan Ilchulbong", "Jeju", "UNESCO", "sunrise", "crater"],
      zh: ["城山日出峰", "济州旅游", "世界自然遗产", "日出", "火山口"],
      vi: ["Seongsan Ilchulbong", "Jeju", "UNESCO", "bình minh", "miệng núi lửa"],
    },
    faq: {
      ko: [
        {
          q: "성산일출봉 입장료와 운영시간이 어떻게 되나요?",
          a: "매표는 오전 7시부터 시작되고 정상 요금은 성인 5,000원이에요. 7시 전에는 무료로 입장할 수 있어서 일출 보러 가는 사람들은 이 타이밍을 노려요.",
        },
        {
          q: "성산일출봉은 어떻게 가나요?",
          a: "주소는 서귀포시 성산읍 일출로 284-12로 제주 동쪽 끝에 있어요. 바로 옆에 성산항이 있어서 우도行 배편(15분)과 묶어 하루 코스로 짜기 좋아요.",
        },
        {
          q: "방문하기 가장 좋은 타이밍이나 놓치면 아쉬운 팁이 있을까요?",
          a: "일출 보러 갈 거면 매표 시작 전인 새벽이 핵심이에요. 계단은 300~500개, 편도 20~30분이면 정상에 닿고, 정상 근처는 바람이 세니 바람막이를 챙기세요. 하산 후엔 광치기해변에서 썰물 때 이끼바위 위로 담기는 일출봉 실루엣도 놓치지 마세요.",
        },
      ],
      en: [
        {
          q: "What are the entrance fee and hours for Seongsan Ilchulbong?",
          a: "Ticketing starts at 7am and full price is 5,000 won for adults. Entry is free before 7am, which is exactly the window sunrise-chasers aim for.",
        },
        {
          q: "How do I get to Seongsan Ilchulbong?",
          a: "It's located at 284-12 Ilchul-ro, Seongsan-eup, Seogwipo-si — on Jeju's east coast. Seongsan Port sits right next to it, so it pairs easily with the 15-minute ferry to Udo island for a full day trip.",
        },
        {
          q: "When's the best time to visit, or any must-know tips?",
          a: "If you're chasing sunrise, get there before the 7am ticket window opens. It's 300-500 steps and 20-30 minutes one way to the summit, and the wind up top is strong, so bring a windbreaker. After descending, don't skip Gwangchigi Beach — at low tide, the peak's silhouette reflects over mossy black rocks.",
        },
      ],
      zh: [
        {
          q: "城山日出峰的门票和开放时间是怎样的？",
          a: "售票从早上7点开始，正常票价成人5,000韩元。7点之前可以免费入场，看日出的人都会专门赶这个时段。",
        },
        {
          q: "城山日出峰怎么去？",
          a: "地址是西归浦市城山邑日出路284-12，位于济州岛最东边。旁边就是城山港，可以和15分钟的牛岛渡轮串成一天的行程。",
        },
        {
          q: "什么时候去最好，有什么不能错过的小贴士？",
          a: "想看日出的话，一定要赶在早上7点售票前到。台阶约300到500级，单程20到30分钟就能登顶，山顶风很大记得带防风外套。下山后别错过光致其海边——退潮时苔藓岩石上映出的日出峰剪影非常出片。",
        },
      ],
      vi: [
        {
          q: "Đỉnh Seongsan Ilchulbong có mất phí và giờ mở cửa thế nào?",
          a: "Quầy vé mở từ 7h sáng, giá vé đầy đủ là 5.000 won cho người lớn. Trước 7h có thể vào miễn phí, đây chính là khung giờ dân săn bình minh luôn nhắm tới.",
        },
        {
          q: "Đi đến Seongsan Ilchulbong bằng cách nào?",
          a: "Địa chỉ là 284-12 Ilchul-ro, Seongsan-eup, Seogwipo-si, nằm ở cực đông đảo Jeju. Ngay sát đó là cảng Seongsan, nên có thể kết hợp với chuyến phà 15 phút sang đảo Udo thành một hành trình trọn ngày.",
        },
        {
          q: "Thời điểm nào đẹp nhất để ghé thăm, hay có mẹo nào không nên bỏ lỡ?",
          a: "Nếu muốn săn bình minh, hãy đến trước khi quầy vé mở lúc 7h sáng. Khoảng 300-500 bậc thang, 20-30 phút một chiều là lên tới đỉnh, gió trên đỉnh khá mạnh nên mang theo áo gió. Sau khi xuống núi, đừng bỏ lỡ bãi biển Gwangchigi — lúc triều xuống, bóng ngọn núi in trên đá rêu tạo nên khung hình rất đẹp.",
        },
      ],
    },
  },
  {
    slug: "jeonju-hanok-village",
    publishedAt: "2026-07-08",
    region: "jeolla",
    category: "culture",
    nameKo: "전주한옥마을",
    nameEn: "Jeonju Hanok Village",
    nameZh: "全州韩屋村",
    nameVi: "Làng Hanok Jeonju",
    summaryKo:
      "전주 오면 한복 안 입고 못 배겨요. 800채 가까운 기와지붕이 다닥다닥 이어진 골목에 경기전·전동성당이 마주보고, 한복 입으면 경기전 입장료도 무료예요. 한 발짝만 나가면 전주비빔밥에 남부시장 야시장, 오목대 전망까지 — 하루가 순삭입니다.",
    summaryEn:
      "Come to Jeonju and you will end up in hanbok, guaranteed. Nearly 800 tile-roofed hanok pack the alleys, Gyeonggijeon and Jeondong Cathedral face off across the street, and one block over waits Jeonju bibimbap plus the Nambu Market night market — the day disappears fast.",
    summaryZh:
      "来全州，不租件韩服都说不过去。近800栋瓦顶韩屋挤满巷弄，庆基殿与殿洞圣堂隔街相望，穿一套完整韩服逛庆基殿还能省下门票钱，殿洞圣堂的红砖罗马式穹顶也很出片。再走一步就是全州拌饭、南部市场夜市与梧木台观景台——一天眨眼就没了。",
    summaryVi:
      "Đến Jeonju mà không mặc hanbok thì coi như chưa đến. Gần 800 ngôi hanok mái ngói san sát trong hẻm, đền Gyeonggijeon và Nhà thờ Jeondong đối diện nhau qua con phố, đi thêm một đoạn là có bibimbap Jeonju và chợ đêm Nambu — một ngày trôi vèo qua.",
    overviewKo: [
      "전주한옥마을은 도심 한복판에 어림잡아 800채에 가까운 한옥이 다닥다닥 붙어 있는 동네예요. 일제강점기에 전주 사람들이 일본식 시가지 확장에 맞서 자존심으로 한옥촌을 지켜낸 게 시작이었다는데, 지금은 그 골목마다 한옥 카페·공방·게스트하우스가 들어차 있어요. 그렇다고 세트장은 절대 아니고, 마당에 빨래가 널려 있고 평상에서 장기 두는 어르신도 마주치는 '진짜 사는 동네'라는 게 이곳의 매력이에요.",
      "동선의 기준점은 경기전이에요. 조선을 세운 태조 이성계의 초상화(어진)를 모신 곳으로, 입장료는 성인 3,000원인데 ⚠️ 한복을 입고 가면 무료예요 — 대여비가 사실상 이 한 장으로 회수되는 셈. 안쪽 대나무숲길은 단체 관광객이 몰릴 때 숨어드는 조용한 포토존이니 놓치지 마세요. 경기전 바로 앞에는 로마네스크 양식의 붉은 벽돌 전동성당이 무료로 마주 보고 서 있어서, 두 곳을 여유 있게 돌아도 1시간 반이면 충분해요. 노을이 성당 돔에 붉게 걸릴 때가 사진 타이밍 1순위.",
      "한복 대여는 오후보다 평일 오전 11시 전이 정답이에요 — 옷 고를 폭도 넓고 탈의실 줄도 없거든요. 대여료는 2시간 기준 10,000~20,000원대이고, 1시간 30분·2시간 30분·4시간 중 골라 빌릴 수 있어요. 한복을 입은 채로 태조로 골목을 걸어 오목대 전망대까지 올라가면 한옥 지붕이 파도처럼 펼쳐지는 뷰가 기다리는데, 계단이 꽤 있으니 편한 신발은 필수예요.",
      "배는 전주비빔밥으로 채워야죠. 1952년부터 3대째 이어온 노포 한국집을 비롯한 3대 맛집이 유명하고, 가격대는 1인 12,000~18,000원 정도로 반찬만 10가지가 넘게 딸려 나와요. 아침엔 해장 겸 콩나물국밥(7,000~9,000원)도 좋아요. 저녁엔 남부시장 야시장(금·토요일 한정)으로 넘어가 문어꼬치·바게트버거·모주를 즐기고, PNB베이커리의 수제 초코파이는 1951년부터 이어온 명물인데 일찍 품절되니 서두르세요.",
    ],
    overviewEn: [
      "Jeonju Hanok Village packs roughly 800 hanok shoulder to shoulder right in the middle of the city. The story goes that during the Japanese colonial period, locals built up this hanok quarter out of sheer pride, refusing to let the Japanese-style district swallow their neighborhood — and today those same alleys are lined with hanok cafes, craft studios, and guesthouses. This is no theme-park set, either: laundry still hangs in the courtyards and you'll pass grandpas playing baduk on a wooden bench, because real people actually live here.",
      "Your anchor point is Gyeonggijeon, the shrine holding the royal portrait of Taejo Yi Seong-gye, founder of Joseon. Admission is ₩3,000 for adults — but ⚠️ it's free if you're wearing hanbok, which basically pays your rental fee back in one visit. Duck into the bamboo grove behind the main hall for a quiet photo spot when the courtyard fills with tour groups. Right across the street, the free-entry Jeondong Cathedral — a red-brick Romanesque building — faces Gyeonggijeon head-on, and seeing both unhurried takes about 90 minutes. Time it for sunset if you can: the light turning the cathedral's dome red is the photo moment everyone's chasing.",
      "For hanbok, go before 11am on a weekday, not the afternoon — you'll get first pick of outfits and skip the fitting-room line. Rental runs roughly ₩10,000–20,000 for a 2-hour block, with 90-minute, 2.5-hour, and 4-hour options also on the menu. Walk the Taejo-ro alleys in your hanbok and climb up to Omokdae pavilion, where the hanok roofs roll out below you like waves — just bring comfortable shoes, since there are a fair number of steps.",
      "Fuel up with Jeonju bibimbap. The old-school Hankookjip, running for three generations since 1952, is one of the city's three legendary spots, and a proper bowl (₩12,000–18,000) comes loaded with more than ten side dishes. Mornings call for kongnamul gukbap, the local bean-sprout hangover soup (₩7,000–9,000). In the evening, head to Nambu Market's night market — Fridays and Saturdays only — for octopus skewers, baguette burgers, and moju, the warm, barely-alcoholic rice punch. PNB Bakery's handmade choco pie has been a local icon since 1951, but it sells out early, so don't dawdle.",
    ],
    overviewZh: [
      "全州韩屋村在市中心密密麻麻挤着约800栋韩屋。据说日据时期，当地人为了不让韩屋街区被日式市区吞并，硬是靠一股志气把这片韩屋聚落保了下来——如今同样的巷弄里开满了韩屋咖啡馆、工坊和民宿。而且这里绝不是主题公园布景：院子里照样晾着衣服，长凳上还能碰见下象棋的老爷爷，因为真的有人住在这里。",
      "游览的基准点是庆基殿——供奉朝鲜开国君主太祖李成桂御真的地方。成人门票3,000韩元，但⚠️穿韩服进去免费，等于租衣钱一趟就赚回来了。主殿后面藏着一片竹林小径，是游客团挤满院子时可以躲进去拍照的安静角落。正对面免费开放的殿洞圣堂是一座罗马式红砖建筑，与庆基殿隔街相望，两处不赶时间地逛完大约90分钟。可能的话挑日落时分去，夕阳把圣堂穹顶染成红色的那一刻，正是大家在等的拍照时机。",
      "租韩服建议挑平日上午11点前，而不是下午——衣服选择多，试衣间也不用排队。租金2小时档大约10,000~20,000韩元，另外还有90分钟、2.5小时、4小时可选。穿着韩服走过太祖路的巷子，爬上梧木台展望台，韩屋屋顶像波浪一样在脚下铺开——不过台阶不少，记得穿双舒服的鞋。",
      "填饱肚子当然要靠全州拌饭。从1952年开到现在、传到第三代的韩国集是当地三大名店之一，一份正宗拌饭（12,000~18,000韩元）配菜就有十几样。早上适合来碗豆芽汤饭解酒（7,000~9,000韩元）。晚上去南部市场夜市——只在周五、周六——吃章鱼串、法棍汉堡，配一杯温热微醺的模酒。PNB面包坊的手工巧克力派从1951年卖到现在，是当地招牌，卖完就没有了，动作要快。",
    ],
    overviewVi: [
      "Làng Hanok Jeonju nhồi nhét gần 800 ngôi hanok san sát ngay giữa trung tâm thành phố. Chuyện kể rằng thời thuộc địa Nhật, người dân địa phương đã dựng nên khu hanok này bằng lòng tự tôn, không để khu phố kiểu Nhật nuốt chửng xóm mình — và giờ đây chính những con hẻm ấy san sát quán cà phê hanok, xưởng thủ công và nhà nghỉ. Đây tuyệt đối không phải phim trường: sân nhà vẫn phơi đồ, và bạn có thể bắt gặp mấy cụ ông chơi cờ trên ghế gỗ, vì đây thực sự là nơi có người sinh sống.",
      "Điểm mốc để đi là đền Gyeonggijeon — nơi lưu giữ chân dung hoàng gia của Taejo Yi Seong-gye, người sáng lập Joseon. Vé vào cửa 3.000 won cho người lớn, nhưng ⚠️ miễn phí nếu bạn mặc hanbok — coi như tiền thuê hanbok được hoàn lại ngay trong chuyến này. Lách vào rừng tre phía sau chính điện để có góc chụp yên tĩnh khi sân trước đông nghịt đoàn khách. Ngay đối diện, Nhà thờ Jeondong miễn phí vào cửa — công trình gạch đỏ kiểu Romanesque — đứng đối mặt với Gyeonggijeon, và dạo cả hai không vội mất khoảng 90 phút. Nếu có thể, canh lúc hoàng hôn: ánh sáng nhuộm đỏ mái vòm nhà thờ chính là khoảnh khắc ai cũng chờ để chụp.",
      "Với hanbok, hãy đi trước 11 giờ sáng vào ngày thường thay vì buổi chiều — bạn sẽ được chọn đồ thoải mái và không phải xếp hàng phòng thay đồ. Giá thuê khoảng 10.000–20.000 won cho gói 2 tiếng, ngoài ra còn có lựa chọn 90 phút, 2,5 tiếng và 4 tiếng. Mặc hanbok dạo qua các hẻm Taejo-ro rồi leo lên đài ngắm cảnh Omokdae, nơi mái ngói hanok trải ra như từng đợt sóng dưới chân bạn — chỉ là khá nhiều bậc thang, nên mang giày thoải mái.",
      "Đến giờ ăn thì phải là bibimbap Jeonju. Quán lâu đời Hankookjip, mở từ năm 1952 và nay đã sang đời thứ ba, là một trong ba quán huyền thoại của thành phố, một tô bibimbap chuẩn vị (12.000–18.000 won) đi kèm hơn mười món ăn kèm. Buổi sáng nên thử canh giá đỗ kongnamul gukbap — món giải rượu đặc trưng của Jeonju (7.000–9.000 won). Buổi tối ghé chợ đêm Nambu Market — chỉ mở thứ Sáu và thứ Bảy — để ăn xiên bạch tuộc, bánh mì kẹp baguette và uống moju, thức uống gạo ấm nhẹ độ cồn. Bánh choco pie thủ công của PNB Bakery đã là biểu tượng địa phương từ năm 1951, nhưng bán hết sớm nên đừng chần chừ.",
    ],
    tips: {
      ko: [
        "한복 입으면 경기전 무료입장 — 대여비, 사실상 이 한 번에 회수돼요.",
        "한복 대여는 평일 오전 11시 전이 베스트. 옷 고를 선택지 넓고 탈의실 줄도 없어요.",
        "경기전 뒤 대나무숲은 단체 관광객 피해가는 숨은 포토존.",
        "남부시장 야시장은 금·토요일 저녁 한정 — PNB 초코파이는 일찍 품절되니 서두르기.",
      ],
      en: [
        "Wear hanbok and Gyeonggijeon admission is free — it basically pays your rental fee back.",
        "Rent hanbok before 11am on a weekday for the best outfit picks and no fitting-room line.",
        "The bamboo grove behind Gyeonggijeon's main hall is a quiet photo spot away from the tour groups.",
        "Nambu Market's night market runs Fri/Sat evenings only — PNB's choco pie sells out early, so hurry.",
      ],
      zh: [
        "穿韩服进庆基殿免费——租衣钱基本一趟就赚回来。",
        "租韩服挑平日上午11点前最好，衣服选择多、也不用排试衣间。",
        "庆基殿主殿后的竹林小径是躲开旅行团的安静拍照点。",
        "南部市场夜市只在周五、周六晚上开——PNB巧克力派卖完就没，动作要快。",
      ],
      vi: [
        "Mặc hanbok thì vào Gyeonggijeon miễn phí — coi như tiền thuê được hoàn lại luôn.",
        "Thuê hanbok trước 11 giờ sáng ngày thường để chọn đồ thoải mái, khỏi xếp hàng phòng thay đồ.",
        "Rừng tre sau chính điện Gyeonggijeon là góc chụp yên tĩnh, tránh xa đoàn khách đông.",
        "Chợ đêm Nambu Market chỉ mở tối thứ Sáu, thứ Bảy — bánh choco pie PNB bán hết sớm nên đừng chần chừ.",
      ],
    },
    image: {
      url: "https://tong.visitkorea.or.kr/cms2/website/46/3590946.JPG",
      alt: "전주한옥마을 기와지붕 거리 — Jeonju Hanok Village",
      license: "공공누리 제1유형",
      credit: "한국관광공사 / 김찬영",
      creditUrl: "https://phoko.visitkorea.or.kr",
    },
    lat: 35.8119333,
    lng: 127.1535567,
    addressKo: "전북특별자치도 전주시 완산구 향교길 일대",
    addressEn: "Hyanggyo-gil, Wansan-gu, Jeonju-si, Jeollabuk-do",
    tags: {
      ko: ["전주한옥마을", "경기전", "전동성당", "전주비빔밥", "한복"],
      en: ["Jeonju Hanok Village", "Gyeonggijeon", "Jeondong Cathedral", "bibimbap", "hanbok"],
      zh: ["全州韩屋村", "庆基殿", "殿洞圣堂", "全州拌饭", "韩服"],
      vi: ["Làng Hanok Jeonju", "Gyeonggijeon", "Nhà thờ Jeondong", "bibimbap", "hanbok"],
    },
    faq: {
      ko: [
        {
          q: "경기전 입장료와 한옥마을 운영시간이 궁금해요.",
          a: "경기전 입장료는 성인 3,000원인데, 한복을 입고 가면 무료예요. 바로 앞 전동성당은 원래 무료로 열려 있고, 한옥마을 골목 자체는 상시 자유롭게 걸어 다닐 수 있어요.",
        },
        {
          q: "전주한옥마을은 어떻게 돌아보는 게 좋나요?",
          a: "완산구 향교길 일대에 볼거리가 모여 있어서 도보로 충분히 둘러볼 수 있어요. 동선은 경기전을 기준점으로 잡고, 맞은편 전동성당까지 함께 돌면 1시간 반 정도면 여유 있게 구경할 수 있어요.",
        },
        {
          q: "한복은 언제 빌리는 게 제일 좋아요?",
          a: "평일 오전 11시 전에 대여하면 옷 고를 폭도 넓고 탈의실 줄도 없어요. 노을 질 때 전동성당 돔이 붉게 물드는 순간이 사진 찍기 제일 좋은 타이밍이에요.",
        },
      ],
      en: [
        {
          q: "How much does Gyeonggijeon cost, and what are the village hours?",
          a: "Gyeonggijeon admission is ₩3,000 for adults, but it's free if you're wearing hanbok. Jeondong Cathedral right across the street is free to enter, and the hanok village's alleys themselves are always open to walk through.",
        },
        {
          q: "What's the best way to get around Jeonju Hanok Village?",
          a: "Everything worth seeing clusters around Hyanggyo-gil in Wansan-gu, so it's easy to cover on foot. Use Gyeonggijeon as your anchor point — pairing it with Jeondong Cathedral across the street takes about 90 unhurried minutes.",
        },
        {
          q: "When's the best time to rent hanbok?",
          a: "Rent before 11am on a weekday for the widest outfit choices and no fitting-room line. For photos, aim for sunset, when the light turns Jeondong Cathedral's dome red.",
        },
      ],
      zh: [
        {
          q: "庆基殿门票多少钱？韩屋村的开放时间呢？",
          a: "庆基殿成人门票3,000韩元，但穿韩服进去免费。正对面的殿洞圣堂本身就免费开放，韩屋村的巷弄则全天都能自由走动。",
        },
        {
          q: "全州韩屋村怎么逛比较好？",
          a: "看点大多集中在完山区乡校街一带，步行就能逛完。可以把庆基殿当作起点，再走到对面的殿洞圣堂，不赶时间的话大约90分钟就能逛完两处。",
        },
        {
          q: "韩服什么时候租最好？",
          a: "平日上午11点前去租，衣服选择多、也不用排试衣间。拍照的话建议挑日落时分，那时殿洞圣堂的穹顶会被染成红色，是最佳时机。",
        },
      ],
      vi: [
        {
          q: "Vé vào Gyeonggijeon bao nhiêu, và làng mở cửa giờ nào?",
          a: "Vé vào Gyeonggijeon là 3.000 won cho người lớn, nhưng miễn phí nếu bạn mặc hanbok. Nhà thờ Jeondong ngay đối diện thì vào cửa miễn phí, còn các con hẻm trong làng hanok thì lúc nào cũng mở để dạo bộ.",
        },
        {
          q: "Nên đi lại trong Làng Hanok Jeonju thế nào?",
          a: "Các điểm tham quan tập trung quanh khu Hyanggyo-gil, Wansan-gu nên đi bộ là đủ. Lấy Gyeonggijeon làm điểm mốc, rồi ghé Nhà thờ Jeondong đối diện — dạo cả hai không vội mất khoảng 90 phút.",
        },
        {
          q: "Thuê hanbok vào lúc nào là tốt nhất?",
          a: "Thuê trước 11 giờ sáng ngày thường để có nhiều lựa chọn trang phục và không phải xếp hàng phòng thay đồ. Muốn chụp ảnh đẹp thì canh lúc hoàng hôn, khi mái vòm Nhà thờ Jeondong nhuộm sắc đỏ.",
        },
      ],
    },
  },
  {
    slug: "gamcheon-culture-village",
    publishedAt: "2026-07-07",
    region: "busan",
    category: "culture",
    nameKo: "감천문화마을",
    nameEn: "Gamcheon Culture Village",
    nameZh: "甘川文化村",
    nameVi: "Làng Văn hóa Gamcheon",
    summaryKo:
      "부산 산비탈에 파스텔빛 집들이 계단처럼 쌓인 동네, '한국의 마추픽추'라 불리는 데는 이유가 있어요. 6·25 피란민이 일군 마을이 예술 재생 프로젝트로 알록달록 물들었죠. 골목마다 벽화·조형물이 숨어 있고, 어린왕자 포토존은 줄 설 각오 필수예요.",
    summaryEn:
      "Pastel houses stack up a Busan hillside like a staircase, and 'Korea's Machu Picchu' isn't just a cute nickname — it's earned. Murals and sculptures hide around every corner, and the famous Little Prince photo spot comes with a queue you should plan for.",
    summaryZh:
      "釜山山坡上，粉彩房屋像阶梯一样层层叠起，「韩国马丘比丘」这称号可不是白叫的。这里曾是朝鲜战争难民与太极道信徒的聚居地，靠艺术再生计划染上了满山缤纷色彩。巷弄间藏着壁画与雕塑，那个著名的小王子拍照点，请做好排队的心理准备。",
    summaryVi:
      "Những ngôi nhà pastel xếp chồng như bậc thang trên sườn đồi Busan, và biệt danh 'Machu Picchu của Hàn Quốc' không phải chỉ để cho vui. Tranh tường và tượng nghệ thuật ẩn khắp các góc hẻm, còn điểm chụp Hoàng tử Bé nổi tiếng thì hãy chuẩn bị tinh thần xếp hàng.",
    overviewKo: [
      "감천문화마을은 부산 사하구 산비탈에 다닥다닥 붙은 마을로, 6·25 전쟁 때 피란민과 태극도 신자들이 모여 살며 형성됐어요. 언덕을 따라 집이 계단식으로 빼곡히 들어섰는데, 앞집이 뒷집 시야를 가리지 않게 지붕 높이를 맞춰 지은 독특한 구조가 특징이에요. 2009년부터 예술가와 주민이 손잡고 벽화를 그리고 빈집을 갤러리·공방으로 바꾸는 마을 재생 프로젝트를 벌인 끝에, 지금은 알록달록한 파스텔 집들이 언덕을 뒤덮어 '한국의 마추픽추', '부산의 산토리니'라는 별명까지 얻었죠.",
      "골목 곳곳에 숨은 벽화와 조형물을 찾는 재미가 쏠쏠한데, 그중 최고 인기는 마을을 내려다보는 '어린왕자와 사막여우' 조형물이에요. 워낙 유명해서 주말·휴가철엔 대기 줄만 1시간이 기본이니, 사람 적은 사진이 목표라면 마을 위쪽 체육시설 근처에 있는 한산한 어린왕자 포토존을 노려보세요. 바로 맞은편엔 계단마다 책등 그림이 그려진 '천덕수 책계단'이 있고, 여기서 조금 더 올라가면 148개 계단이 이어지는 일명 '별 보러 가는 계단' — 너무 가팔라서 오를 땐 별이 보인다는 그 계단인데, 내려올 때 도는 코스로 짜면 훨씬 수월해요.",
      "가는 길은 지하철 1호선 토성역 6번 출구에서 마을버스(사하1-1·서구2·서구2-2)로 갈아타는 게 정석이에요. 다만 요즘은 관광객이 몰리면서 배차 간격은 그대로인데 만원 버스가 돼 정작 출퇴근하는 주민이 못 타는 일이 잦다는 게 현지 이슈이기도 해요 — 그러니 걸어 올라갈 체력이 있다면 아침 일찍은 도보도 나쁘지 않은 선택. 마을 정보센터에서 2,000원짜리 지도를 사면 40분·1시간·2시간 코스 중 골라 스탬프 투어를 돌 수 있어요.",
      "감천문화마을은 여전히 사람이 사는 동네라 개방 시간이 정해져 있어요(동절기 9시~17시, 하절기 9시~18시). 골목이 곧 누군가의 대문 앞이라는 걸 기억하고 정숙 매너를 지켜주세요. 사진이 목적이라면 이른 아침이나 늦은 오후가 빛도 좋고 사람도 적어 일석이조인데, 마을을 한눈에 담고 싶다면 하늘마루 전망대에 올라 파스텔 집들 너머로 반짝이는 바다까지 함께 담아보세요.",
    ],
    overviewEn: [
      "Gamcheon Culture Village clings to a steep hillside in Busan's Saha-gu, built up by Korean War refugees and members of the Taegukdo faith who settled there together. Houses stack in tight terraces up the slope, laid out so no home's roofline blocks the view of the house behind it — a genuinely distinctive bit of urban design. Starting in 2009, artists and residents teamed up on a regeneration project, painting murals and turning empty houses into galleries and studios, and the result is a hillside so blanketed in candy-colored pastel homes that it earned nicknames like 'Korea's Machu Picchu' and 'Busan's Santorini.'",
      "Half the fun is hunting down murals and sculptures tucked into the alleys, and the undisputed star is the 'Little Prince and the Fox' statue gazing out over the village. It's so popular that weekend and holiday queues routinely run an hour — if a crowd-free shot matters more to you, head to the quieter Little Prince spot near the sports facility in the upper village instead. Right across from the main statue is the 'Book Staircase,' its steps painted to look like book spines, and if you keep climbing from there you'll hit the 148-step staircase locals nickname the 'Stairs to See Stars' — so steep it earns the name. It's a lot easier to walk down this stretch than up it, so plan your loop accordingly.",
      "The standard way in is Toseong Station (Line 1), Exit 6, then a transfer to a village bus (Saha 1-1, Seogu 2, or Seogu 2-2). One local wrinkle worth knowing: the bus schedule hasn't caught up with the tourist crowds, so buses regularly fill up and actual residents commuting to work sometimes can't board — if you've got the legs for it, an early-morning walk up isn't a bad alternative. At the village information center, ₩2,000 buys a map for a stamp-trail walk with your choice of a 40-minute, 1-hour, or 2-hour route.",
      "This is still a lived-in neighborhood, so it keeps set visiting hours — 9am to 5pm in winter, 9am to 6pm the rest of the year. Remember that every alley is also someone's front doorstep, and keep the noise down. For photos, early morning or late afternoon gives you softer light and thinner crowds — a win-win. And if you want the whole village in one frame, climb up to the Haneul Maru observation deck, where the pastel rooftops roll out toward a sliver of sea in the distance.",
    ],
    overviewZh: [
      "甘川文化村紧贴着釜山沙下区的陡峭山坡而建，是朝鲜战争难民与太极道信徒当年一同定居形成的聚落。房屋沿坡地层层叠叠地挤在一起，屋顶高度经过精心设计，让前排住户不会挡住后排的视野——这种城市设计相当独特。自2009年起，艺术家与居民携手推动再生计划，绘制壁画、把空屋改造成画廊和工坊，最终让这片山坡被五彩缤纷的粉彩房屋铺满，因此赢得「韩国马丘比丘」「釜山圣托里尼」的美誉。",
      "巷弄间藏着的壁画与雕塑一路寻宝般有趣，其中人气最高的当属俯瞰全村的「小王子与沙漠狐狸」雕塑。它太受欢迎，周末假期排队拍照动辄一小时起跳——如果比起排队你更在意画面干净，可以改去村子上方体育设施附近人少一些的小王子拍照点。正对着主雕塑的是台阶画满书脊图案的「书阶梯」，从这里再往上爬，就是当地人称作「看星星的阶梯」的148级台阶——陡到走上去真的会头晕眼花看见星星，走这一段建议安排下坡而非上坡，会轻松许多。",
      "标准路线是地铁1号线土城站6号出口，转乘社区巴士（沙下1-1、西区2、西区2-2）上山。有个在地小知识值得留意：巴士班次没跟上游客增长的速度，车厢常常爆满，导致真正要通勤的居民反而挤不上车——如果体力允许，清晨徒步上山也是不错的替代方案。在村内的游客中心花2,000韩元买张地图，就能按40分钟、1小时或2小时的路线来一趟集章探访。",
      "这里仍然是有人居住的社区，因此设有固定的开放时间（冬季9:00~17:00，其余季节9:00~18:00）。别忘了每条巷子同时也是别人家的家门口，请放低音量。想拍照的话，清晨或傍晚光线更柔和、人也更少，一举两得；若想把全村尽收眼底，不妨爬上「天空之路」（하늘마루）观景台，粉彩屋顶之外还能望见远处闪着微光的海。",
    ],
    overviewVi: [
      "Làng Văn hóa Gamcheon bám vào sườn dốc đứng ở Saha-gu, Busan, do người tị nạn Chiến tranh Triều Tiên và tín đồ đạo Taegukdo cùng nhau định cư dựng nên. Nhà cửa xếp tầng dày đặc lên dốc, được bố trí sao cho mái nhà nào cũng không che tầm nhìn của nhà phía sau — một lối thiết kế đô thị thực sự độc đáo. Từ năm 2009, nghệ sĩ và cư dân bắt tay vào dự án tái sinh, vẽ tranh tường và biến những căn nhà bỏ trống thành phòng tranh, xưởng thủ công, và kết quả là cả sườn đồi phủ kín những ngôi nhà pastel sặc sỡ đến mức được gọi là 'Machu Picchu của Hàn Quốc', 'Santorini của Busan'.",
      "Nửa niềm vui là lùng tìm tranh tường và tượng nghệ thuật giấu trong hẻm, và ngôi sao không thể tranh cãi là tượng 'Hoàng tử Bé và con Cáo' nhìn ra cả ngôi làng. Nó nổi tiếng đến mức cuối tuần hay mùa lễ, xếp hàng cả tiếng là chuyện thường — nếu bạn muốn ảnh không dính người lạ, hãy tới điểm chụp Hoàng tử Bé vắng hơn gần khu thể thao ở phần trên làng. Ngay đối diện tượng chính là 'Cầu thang Sách' với từng bậc được vẽ như gáy sách, và nếu leo tiếp từ đó bạn sẽ gặp cầu thang 148 bậc mà dân địa phương gọi là 'Bậc thang thấy sao' — dốc đến mức đúng như tên gọi. Đoạn này đi xuống dễ hơn nhiều so với đi lên, nên hãy sắp lịch trình theo vòng tròn cho hợp lý.",
      "Cách vào chuẩn nhất là ga Toseong (tuyến 1), lối ra số 6, rồi đổi sang xe buýt làng (Saha 1-1, Seogu 2, hoặc Seogu 2-2). Có một điều đáng biết ở đây: lịch xe buýt chưa theo kịp lượng khách du lịch, nên xe thường xuyên chật cứng, khiến cư dân thực sự đi làm đôi khi không lên nổi xe — nếu còn sức, đi bộ lên vào sáng sớm cũng là lựa chọn không tồi. Tại trung tâm thông tin của làng, 2.000 won mua được một tấm bản đồ cho hành trình đóng dấu, với ba lựa chọn tuyến 40 phút, 1 tiếng hoặc 2 tiếng.",
      "Đây vẫn là khu dân cư có người sinh sống nên có giờ mở cửa cố định — 9 giờ sáng đến 5 giờ chiều vào mùa đông, 9 giờ sáng đến 6 giờ chiều các mùa còn lại. Hãy nhớ mỗi con hẻm cũng chính là cửa nhà của ai đó, và giữ âm lượng nhỏ. Muốn chụp ảnh thì sáng sớm hay chiều muộn cho ánh sáng dịu hơn và ít người hơn — lợi cả đôi đường. Còn nếu muốn thu trọn cả làng vào một khung hình, hãy leo lên đài quan sát Haneul Maru, nơi những mái nhà pastel trải ra hướng về phía biển lấp lánh xa xa.",
    ],
    tips: {
      ko: [
        "'어린왕자' 포토존 줄이 길면 마을 위쪽 체육시설 근처 한산한 포토존으로.",
        "토성역 6번 출구 → 마을버스(사하1-1·서구2·서구2-2). 요즘은 만원버스 흔하니 아침 일찍 도보도 고려.",
        "148계단은 '별 보러 가는 계단' — 오를 땐 다리 후들, 내려오는 코스로 짜면 수월.",
        "개방시간은 동절기 9~17시·하절기 9~18시. 실제 주거지이니 소음·쓰레기 매너 필수.",
      ],
      en: [
        "If the Little Prince photo line is long, try the quieter spot near the sports facility in the upper village.",
        "Toseong Station Exit 6 → village bus (Saha 1-1 / Seogu 2 / Seogu 2-2). Buses fill up fast these days, so an early walk up is worth considering.",
        "The 148-step staircase is nicknamed 'Stairs to See Stars' — plan to walk it downhill, not up.",
        "Open 9am–5pm in winter, 9am–6pm the rest of the year. It's a real neighborhood, so keep noise and trash to a minimum.",
      ],
      zh: [
        "小王子拍照点排队太长的话，可以改去村子上方体育设施附近人少的拍照点。",
        "土城站6号出口→社区巴士（沙下1-1/西区2/西区2-2）。近来巴士常爆满，清晨徒步上山也是选项。",
        "148级台阶人称「看星星的阶梯」——建议安排下坡而非上坡，会轻松许多。",
        "开放时间冬季9~17点、其余季节9~18点。这里是真实住宅区，请保持安静、勿乱丢垃圾。",
      ],
      vi: [
        "Nếu điểm chụp Hoàng tử Bé xếp hàng dài, hãy thử điểm vắng hơn gần khu thể thao phía trên làng.",
        "Ga Toseong lối ra 6 → xe buýt làng (Saha 1-1 / Seogu 2 / Seogu 2-2). Xe hay chật gần đây, nên cân nhắc đi bộ lên vào sáng sớm.",
        "Cầu thang 148 bậc được gọi là 'Bậc thang thấy sao' — nên đi xuống thay vì leo lên.",
        "Mở cửa 9h–17h mùa đông, 9h–18h các mùa khác. Đây là khu dân cư thật, hãy giữ yên lặng và không xả rác.",
      ],
    },
    image: {
      url: "https://tong.visitkorea.or.kr/cms2/website/67/3414967.jpg",
      alt: "감천문화마을 파스텔 집들 — Gamcheon Culture Village, Busan",
      license: "공공누리 제1유형",
      credit: "한국관광공사 / 이상민",
      creditUrl: "https://phoko.visitkorea.or.kr",
    },
    lat: 35.0974607,
    lng: 129.010597,
    addressKo: "부산광역시 사하구 감내2로 203",
    addressEn: "203 Gamnae 2-ro, Saha-gu, Busan",
    tags: {
      ko: ["감천문화마을", "부산 여행", "벽화마을", "한국의 마추픽추", "어린왕자"],
      en: ["Gamcheon", "Busan", "mural village", "Korea's Machu Picchu", "Little Prince"],
      zh: ["甘川文化村", "釜山旅游", "壁画村", "韩国马丘比丘", "小王子"],
      vi: ["Gamcheon", "Busan", "làng tranh tường", "Machu Picchu Hàn Quốc", "Hoàng tử Bé"],
    },
    faq: {
      ko: [
        {
          q: "감천문화마을 입장료랑 개방 시간이 어떻게 되나요?",
          a: "마을 자체는 입장료 없이 자유롭게 둘러볼 수 있어요. 다만 실제 주민이 사는 동네라 개방 시간이 정해져 있는데, 동절기는 9시~17시, 하절기는 9시~18시예요. 정보센터에서 2,000원짜리 지도를 사면 스탬프 투어도 돌 수 있어요.",
        },
        {
          q: "감천문화마을은 어떻게 가나요?",
          a: "지하철 1호선 토성역 6번 출구에서 마을버스(사하1-1·서구2·서구2-2)로 갈아타는 게 정석이에요. 요즘 관광객이 몰려 만원버스가 흔하니, 체력이 되면 아침 일찍 도보로 올라가는 것도 방법이에요.",
        },
        {
          q: "어린왕자 포토존 줄이 너무 길면 어떻게 해요?",
          a: "주말·휴가철엔 대기 줄이 1시간 넘게 이어지는 게 기본이에요. 사람 적은 사진을 원한다면 마을 위쪽 체육시설 근처의 한산한 어린왕자 포토존을 노려보세요.",
        },
      ],
      en: [
        {
          q: "Is there an admission fee, and what are Gamcheon's opening hours?",
          a: "There's no separate admission fee — the village is open to walk through freely. Since real residents still live there, it does keep set hours: 9am–5pm in winter and 9am–6pm the rest of the year. The information center sells a ₩2,000 map for a stamp-trail walk.",
        },
        {
          q: "How do you get to Gamcheon Culture Village?",
          a: "The standard route is Toseong Station (Line 1), Exit 6, then a transfer to a village bus (Saha 1-1, Seogu 2, or Seogu 2-2). Buses fill up fast these days with tourists, so an early-morning walk up is worth considering if you're up for it.",
        },
        {
          q: "What if the line for the Little Prince photo spot is too long?",
          a: "Weekend and holiday queues routinely run over an hour. If you'd rather skip the crowd, head to the quieter Little Prince spot near the sports facility in the upper village.",
        },
      ],
      zh: [
        {
          q: "甘川文化村门票多少钱？开放时间是几点？",
          a: "村子本身不收门票，可以自由参观。不过这里仍是真实住宅区，所以有固定开放时间：冬季9点到17点，其余季节9点到18点。游客中心有2,000韩元的地图，可以顺便走一趟集章路线。",
        },
        {
          q: "甘川文化村怎么去？",
          a: "标准路线是地铁1号线土城站6号出口，转乘社区巴士（沙下1-1、西区2、西区2-2）上山。最近游客多，巴士常常爆满，体力允许的话清晨徒步上山也是个办法。",
        },
        {
          q: "小王子拍照点排队太长怎么办？",
          a: "周末或假期排队常常超过一小时。如果想要人少一点的照片，可以去村子上方体育设施附近那个比较冷清的小王子拍照点。",
        },
      ],
      vi: [
        {
          q: "Vé vào Làng Gamcheon bao nhiêu, giờ mở cửa thế nào?",
          a: "Làng không thu vé vào cửa, bạn có thể tự do dạo quanh. Nhưng vì vẫn có cư dân thực sự sinh sống ở đây nên có giờ mở cửa cố định: 9h–17h vào mùa đông, 9h–18h các mùa còn lại. Trung tâm thông tin bán bản đồ giá 2.000 won cho hành trình đóng dấu.",
        },
        {
          q: "Đi đến Làng Văn hóa Gamcheon bằng cách nào?",
          a: "Cách chuẩn nhất là ga Toseong (tuyến 1), lối ra số 6, rồi đổi sang xe buýt làng (Saha 1-1, Seogu 2, hoặc Seogu 2-2). Dạo này khách du lịch đông nên xe hay chật cứng, nếu còn sức thì đi bộ lên vào sáng sớm cũng là cách hay.",
        },
        {
          q: "Nếu xếp hàng ở điểm chụp Hoàng tử Bé quá dài thì sao?",
          a: "Cuối tuần hay mùa lễ, xếp hàng thường kéo dài hơn một tiếng. Nếu muốn ảnh vắng người hơn, hãy tới điểm chụp Hoàng tử Bé ít đông hơn gần khu thể thao ở phần trên làng.",
        },
      ],
    },
  },
  {
    slug: "changdeokgung",
    publishedAt: "2026-07-23",
    region: "seoul",
    category: "palace",
    nameKo: "창덕궁",
    nameEn: "Changdeokgung Palace",
    nameZh: "昌德宫",
    nameVi: "Cung Changdeokgung",
    summaryKo:
      "경복궁보다 왕들이 더 오래 산 궁궐, 이유는 후원(비원)에 있어요. 산자락 지형 그대로 살린 정원이 유네스코 등재 이유고, 낙선재는 1989년까지 실제 왕실이 살았던 공간. 후원은 사전예약 필수, 한복 입으면 궁 입장은 무료예요.",
    summaryEn:
      "The palace Joseon's kings actually preferred to live in. A hillside garden left untouched by human hands earned it UNESCO status, and Nakseonjae was a real royal home until 1989. Hanbok gets you in free — but the Secret Garden costs extra either way.",
    summaryZh:
      "比起景福宫，历代国王实际住得更久的宫殿就是这里，秘密就在后苑。顺应山势不强行铲平的园林，正是入选世界遗产的关键，乐善斋更是末代皇室一直住到1989年的地方。穿韩服可免票入宫，但后苑门票另计。",
    summaryVi:
      "Cung điện mà các vua Joseon thực sự thích ở hơn cả Gyeongbokgung, bí quyết nằm ở khu vườn sau. Cảnh quan thuận theo địa hình đồi núi là lý do được UNESCO công nhận, còn Nakseonjae là nơi hoàng tộc cuối cùng sống thật đến tận 1989. Mặc Hanbok được miễn vé vào cung, nhưng Vườn Bí Mật vẫn tính phí riêng.",
    overviewKo: [
      "창덕궁은 1405년 태종이 세운 궁궐로, 이름은 '덕을 밝게 비추어 번창한다'는 뜻이에요. 경복궁이 조선의 공식 법궁이었지만, 정작 왕들이 가장 오래 머문 곳은 이곳 창덕궁이었어요. 임진왜란 때 서울의 모든 궁궐이 불탔는데, 전쟁 후 나라 살림이 어려워 법궁인 경복궁은 한동안 재건되지 못했고, 대신 창덕궁이 먼저 다시 지어지면서 300년 가까이 조선의 실질적인 정궁 역할을 했어요. 이런 독특한 역사성과 산자락 지형을 거스르지 않고 자연스럽게 앉힌 건축 배치가 인정받아 1997년 유네스코 세계문화유산에 등재됐습니다.",
      "정문 돈화문부터가 남다른데, 현재 남아있는 서울 궁궐 정문 중 가장 오래된 목조 건축물이에요. 문을 지나 두 번째 문 진선문을 넘으면 금천교가 나오는데, 1411년에 놓인 이 다리는 서울 4대궁 다리 중 가장 오래됐고, 다리 밑을 지키는 상상의 동물 조각(해치·현무 등)이 촘촘히 새겨져 있어요. 왕의 즉위식과 국가 행사가 열리던 정전 인정전은 경복궁 근정전보다 아담하지만, 품계석과 잘 다듬어진 마당이 주는 위엄은 결코 뒤지지 않아요. 인정전 지붕 위로 대한제국 시절 자리한 오얏꽃(이화) 문양도 눈여겨볼 포인트입니다.",
      "창덕궁 최대 매력은 뒤편의 후원, 흔히 '비원(秘苑)'이라 불리는 공간이에요. 다른 궁궐 정원과 달리 산과 계곡의 원래 지형을 인공적으로 깎아내지 않고 그대로 살려서 연못·정자를 배치했는데, 이게 바로 유네스코가 '자연과 완벽히 조화된 극동 궁궐 정원의 걸작'이라 평가한 핵심 이유예요. 부용지 연못가의 주합루, 애련지의 애련정 같은 정자들이 계절마다 다른 표정을 보여주고, 300년 넘은 나무만 70그루가 넘습니다. 다만 후원은 자유관람이 안 되고 문화재해설사와 함께하는 정해진 회차(약 90분)로만 들어갈 수 있어서, 관람 희망일 6일 전 오전 10시부터 온라인 사전예약이 사실상 필수예요.",
      "후원 옆쪽엔 낙선재 영역도 있는데, 여기가 은근 특별한 곳이에요. 조선이 망하고 대한제국이 무너진 뒤에도 영친왕 부부, 덕혜옹주 같은 마지막 황실 가족들이 실제로 살았던 공간으로, 1989년까지 사람이 거주했어요. 화려한 단청을 일부러 입히지 않은 소박한 건축이라 다른 전각들과는 분위기가 확 다르고, 그만큼 '살아있던 궁궐'의 마지막 흔적을 가장 가까이서 느낄 수 있는 곳입니다.",
      "실전 정보 — 성인 입장료는 3,000원인데 경복궁처럼 한복(저고리+치마 또는 바지 세트)을 갖춰 입으면 무료예요. 단, 후원 관람료(약 5,000원)는 한복을 입어도 별도로 내야 하니 헷갈리지 마세요. 후원은 시간당 100명 한정(온라인 50명 + 현장 50명)이라 성수기 주말엔 현장표가 금방 마감되니 온라인 예매를 추천합니다. 매주 월요일은 휴궁이에요.",
      "가는 법은 지하철 3호선 안국역 3번 출구에서 도보 5분, 바로 옆 종묘·운현궁과 묶어서 하루 코스로 돌기도 좋아요. 경복궁보다 관광객이 상대적으로 적어서 한적하게 궁궐 산책을 즐기고 싶다면 창덕궁 쪽을 더 추천하는 사람도 많고요. 가을 단풍철엔 후원 전체가 그림처럼 물들어서 이 시기 예약 경쟁이 가장 치열하니, 단풍 시즌 방문을 노린다면 최소 몇 주 전부터 예약 사이트를 체크하세요.",
    ],
    overviewEn: [
      "Changdeokgung was built in 1405 by King Taejong, and its name roughly means 'palace that radiates virtue and prosperity.' Gyeongbokgung was Joseon's official main palace on paper, but the kings who actually lived there the longest called Changdeokgung home. When the 1592 Japanese invasions burned every palace in Seoul to the ground, the war-drained treasury couldn't afford to rebuild the official Gyeongbokgung right away — so Changdeokgung was restored first instead, and ended up functioning as Joseon's de facto main palace for nearly 300 years. That unusual history, plus a layout that works with the natural hillside terrain rather than flattening it, earned Changdeokgung a spot on the UNESCO World Heritage List in 1997.",
      "Even the main gate stands out — Donhwamun is the oldest surviving wooden palace gate in Seoul. Pass through the second gate, Jinseonmun, and you'll cross Geumcheongyo, a stone bridge built in 1411 that's the oldest of its kind among Seoul's four palaces, carved densely with mythical guardian creatures underneath. Injeongjeon, the throne hall where kings were crowned and state ceremonies held, is more compact than Gyeongbokgung's Geunjeongjeon, but the rank stones and manicured courtyard give it plenty of gravitas on their own. Look up at the roofline for the plum blossom (i-hwa) emblem added during the Korean Empire era — an easy detail to miss.",
      "Changdeokgung's real showstopper is the rear garden out back, popularly known as the Secret Garden (Biwon). Unlike palace gardens elsewhere, the ponds and pavilions here were built around the existing hills and valleys instead of flattening the land — and that's exactly why UNESCO called it a masterpiece of Far Eastern garden design 'harmonized with the natural setting.' Pavilions like Juhamnu by Buyongji pond and Aeryeonjeong by Aeryeonji change character with every season, and more than 70 trees on the grounds are over 300 years old. One catch: you can't wander the Secret Garden freely — entry is only via scheduled, guided tours (roughly 90 minutes) with a cultural heritage docent, so booking online starting 10 AM, six days before your visit date, is basically mandatory.",
      "Next to the garden is the Nakseonjae area, which carries a quietly heavy history. This is where the last members of Korea's royal family — including Crown Prince Uimin and his wife, and Princess Deokhye — actually lived after the fall of Joseon and the Korean Empire, right up until 1989. It's deliberately built without the vivid dancheong paintwork seen elsewhere in the palace, giving it a plainer, more lived-in feel — and it's the closest you can get to touching the palace's last days as an actual home rather than a monument.",
      "Practical info: adult admission is ₩3,000, waived if you're wearing full hanbok (top and bottom set), same as Gyeongbokgung. But note the Secret Garden fee (around ₩5,000) is separate and applies even if you're in hanbok — easy to get mixed up. Secret Garden capacity is capped at 100 people per hour (50 online, 50 on-site), so same-day tickets vanish fast on peak weekends — book online if you can. The palace is closed every Monday.",
      "Get there via Anguk Station (Line 3) Exit 3, a five-minute walk — easy to combine with nearby Jongmyo Shrine or Unhyeongung for a full day out. Changdeokgung tends to draw fewer crowds than Gyeongbokgung, so plenty of people actually prefer it for a calmer palace stroll. Come autumn, the entire Secret Garden turns into a wall of red and gold, which also means booking competition peaks hardest that season — if you're chasing fall colors, start checking the reservation site weeks ahead.",
    ],
    overviewZh: [
      "昌德宫由太宗于1405年下令兴建，宫名寓意「彰显德行、走向兴盛」。虽然景福宫才是朝鲜官方正宫，但历代国王实际居住时间最长的其实是昌德宫。壬辰倭乱把首尔所有宫殿烧成灰烬后，国库因战争空虚，正宫景福宫迟迟无法重建，反倒是昌德宫先被修复，结果昌德宫足足当了近300年朝鲜事实上的正宫。这段独特的历史，加上顺应山势地形、不强行铲平自然地貌的建筑布局，让昌德宫在1997年被列入联合国教科文组织世界文化遗产。",
      "光是正门敦化门就很有来头——它是首尔现存宫殿正门中年代最久的木造建筑。穿过第二道门进善门，就会看到锦川桥，这座建于1411年的石桥是首尔四大宫殿桥梁中最古老的一座，桥下密密麻麻雕刻着守护神兽。国王即位、举行国家大典的正殿仁政殿，规模比景福宫勤政殿小一些，但殿前品阶石和修剪整齐的庭院一样气场十足。抬头留意仁政殿屋檐上的李花纹章，那是大韩帝国时期添上去的小细节。",
      "昌德宫真正的杀手锏是后方的后苑，也就是俗称的「秘苑」。和其他宫殿花园不同，这里的池塘亭台是顺着原有山谷地形安置的，没有人工铲平——这正是联合国教科文组织盛赞它是「与自然完美融合的远东宫苑设计杰作」的关键原因。芙蓉池畔的宙合楼、爱莲池畔的爱莲亭，四季各有风情，园内树龄超过300年的古树就有70多棵。不过后苑不能自由参观，只能跟着文化解说员分批入场（约90分钟一场），想去的话务必在参观日前6天上午10点开放线上预约时抢票，基本算刚需。",
      "花园旁边还有乐善斋区域，这里的分量其实不轻。朝鲜灭亡、大韩帝国倒台之后，末代皇室成员——英亲王夫妇、德惠翁主等人——真真切切地在这里生活到1989年才彻底结束。这里刻意没有涂上鲜艳的丹青彩绘，风格朴素得和其他殿阁完全不同，也正因如此，这里是离「曾经真实住人的宫殿」最后余温最近的地方。",
      "实用信息——成人票3000韩元，和景福宫一样，穿完整韩服（上衣+下装成套）可免票。但要注意后苑门票（约5000韩元）是单独收费，就算穿韩服也要另外买，别搞混了。后苑每小时限流100人（线上50人+现场50人），旺季周末现场票很快售罄，建议提前网上订票。每周一全天休宫。",
      "交通方面，地铁3号线安国站3号出口步行5分钟即到，附近还有宗庙、云岘宫，可以串成一日行程。比起景福宫，昌德宫游客相对少一些，不少人反而更喜欢来这里悠闲逛宫。秋天枫叶季，整座后苑美得像一幅画，也是全年预约竞争最激烈的时候——想赶枫叶季来，建议提前几周就开始盯预约网站。",
    ],
    overviewVi: [
      "Changdeokgung được vua Taejong cho xây dựng năm 1405, tên cung mang nghĩa 'tỏa sáng đức hạnh, hưng thịnh dài lâu'. Dù Gyeongbokgung mới là chính cung chính thức của Joseon, nhưng cung điện mà các vị vua thực sự ở lâu nhất lại chính là Changdeokgung. Khi cuộc xâm lược của Nhật năm 1592 thiêu rụi toàn bộ cung điện ở Seoul, ngân khố cạn kiệt vì chiến tranh khiến Gyeongbokgung không thể phục dựng ngay, nên Changdeokgung được sửa lại trước — và từ đó gần như đóng vai trò chính cung thực tế của Joseon suốt gần 300 năm. Lịch sử đặc biệt này, cộng với cách bố trí kiến trúc thuận theo địa hình đồi núi tự nhiên thay vì san phẳng, đã giúp Changdeokgung được UNESCO công nhận Di sản Thế giới năm 1997.",
      "Ngay cổng chính Donhwamun cũng đã có gì đó khác biệt — đây là cổng cung điện bằng gỗ cổ nhất còn tồn tại ở Seoul. Qua cổng thứ hai Jinseonmun là đến cầu đá Geumcheongyo, xây năm 1411, cây cầu đá cổ nhất trong bốn cung điện lớn của Seoul, với những bức chạm khắc linh thú trấn giữ dày đặc bên dưới. Điện Injeongjeon, nơi vua đăng cơ và tổ chức đại lễ quốc gia, nhỏ gọn hơn điện Geunjeongjeon của Gyeongbokgung, nhưng hàng bia phẩm cấp và sân điện được chăm chút kỹ lưỡng vẫn toát lên vẻ uy nghi không kém. Ngước nhìn lên mái điện sẽ thấy họa tiết hoa mận (i-hwa) từ thời Đế quốc Đại Hàn — một chi tiết nhỏ dễ bị bỏ qua.",
      "Điểm hút hồn thực sự của Changdeokgung nằm ở khu vườn sau, thường được gọi là Vườn Bí Mật (Biwon). Khác với các khu vườn cung điện khác, ao hồ và đình tạ ở đây được xây dựng thuận theo địa hình đồi núi có sẵn thay vì san phẳng — đây chính là lý do UNESCO ca ngợi nơi này là kiệt tác thiết kế vườn cung điện Viễn Đông 'hòa hợp hoàn hảo với thiên nhiên'. Các đình như Juhamnu bên hồ Buyongji, Aeryeonjeong bên hồ Aeryeonji mang vẻ đẹp khác nhau theo từng mùa, và có hơn 70 cây cổ thụ trên 300 năm tuổi trong khuôn viên. Có một điều cần lưu ý: không thể tự do dạo chơi trong Vườn Bí Mật — chỉ được vào theo đoàn có hướng dẫn viên di sản văn hóa dẫn đoàn (khoảng 90 phút mỗi lượt), nên gần như bắt buộc phải đặt vé online lúc 10 giờ sáng, 6 ngày trước ngày muốn tham quan.",
      "Bên cạnh khu vườn là khu Nakseonjae, nơi mang một tầng lịch sử khá nặng nề. Đây là nơi những thành viên cuối cùng của hoàng tộc — Thái tử Uimin cùng vợ, Công chúa Deokhye — thực sự sinh sống sau khi Joseon và Đế quốc Đại Hàn sụp đổ, cho đến tận năm 1989. Nơi này cố tình không sơn dancheong sặc sỡ như các điện khác, mang vẻ giản dị, gần gũi hơn — và là nơi gần nhất để cảm nhận những ngày cuối cùng của cung điện như một mái nhà thực sự, chứ không chỉ là một di tích.",
      "Thông tin thực tế: vé người lớn 3.000 won, được miễn nếu mặc trọn bộ Hanbok (áo và quần/váy), giống như ở Gyeongbokgung. Nhưng lưu ý vé Vườn Bí Mật (khoảng 5.000 won) là riêng biệt và vẫn phải trả dù đang mặc Hanbok — dễ nhầm lẫn. Vườn Bí Mật giới hạn 100 người mỗi giờ (50 vé online, 50 vé tại chỗ), nên vé tại chỗ hết rất nhanh vào cuối tuần cao điểm — nên đặt online nếu có thể. Cung đóng cửa vào thứ Hai hàng tuần.",
      "Đi đến đây qua lối ra số 3 ga Anguk (tuyến 3), đi bộ 5 phút — dễ dàng kết hợp với đền Jongmyo hay Unhyeongung gần đó cho một ngày trọn vẹn. Changdeokgung thường ít đông khách hơn Gyeongbokgung, nên nhiều người thực ra thích đến đây hơn để dạo cung điện thong thả. Vào mùa thu, cả Vườn Bí Mật nhuộm đỏ vàng đẹp như tranh vẽ, cũng là lúc cuộc đua đặt vé căng thẳng nhất trong năm — nếu muốn ngắm lá thu, hãy bắt đầu theo dõi trang đặt vé từ vài tuần trước.",
    ],
    tips: {
      ko: [
        "성인 입장료 3,000원, 한복(상하의 세트) 입으면 무료 — 단 후원 관람료는 한복 입어도 별도.",
        "후원은 자유관람 불가, 문화재해설사 동행 회차제(약 90분) — 관람일 6일 전 오전 10시 온라인 예약 필수급.",
        "매주 월요일 휴궁, 방문일 잡기 전 꼭 확인.",
        "지하철 3호선 안국역 3번 출구 도보 5분, 종묘·운현궁과 묶어 하루 코스로 좋음.",
        "가을 단풍철엔 후원 예약 경쟁 최고조 — 최소 몇 주 전부터 예약 사이트 체크.",
      ],
      en: [
        "Adult admission ₩3,000, free if you're in full hanbok — but the Secret Garden fee applies separately even then.",
        "Secret Garden is guided-tour only (about 90 min) — book online at 10 AM, six days before your visit.",
        "Closed every Monday — check before you plan the trip.",
        "Anguk Station (Line 3) Exit 3, a 5-minute walk — easy to pair with Jongmyo Shrine or Unhyeongung.",
        "Fall foliage season means the toughest reservation competition of the year — start checking weeks ahead.",
      ],
      zh: [
        "成人票3000韩元，穿完整韩服可免票——但后苑门票即使穿韩服也要另付。",
        "后苑只能跟解说员分批参观（约90分钟）——参观日前6天上午10点开放线上预约，务必提前抢。",
        "每周一全天休宫，安排行程前务必确认。",
        "地铁3号线安国站3号出口步行5分钟，可与宗庙、云岘宫串成一日游。",
        "秋季枫叶季预约竞争全年最激烈，建议提前几周开始盯预约网站。",
      ],
      vi: [
        "Vé người lớn 3.000 won, mặc trọn bộ Hanbok được miễn — nhưng vé Vườn Bí Mật vẫn tính riêng dù có mặc Hanbok.",
        "Vườn Bí Mật chỉ tham quan theo đoàn có hướng dẫn viên (khoảng 90 phút) — đặt vé online lúc 10 giờ sáng, 6 ngày trước ngày muốn đến.",
        "Đóng cửa vào thứ Hai hàng tuần — kiểm tra lịch trước khi lên kế hoạch.",
        "Lối ra số 3 ga Anguk (tuyến 3), đi bộ 5 phút — dễ kết hợp với đền Jongmyo hoặc Unhyeongung.",
        "Mùa lá thu là lúc cạnh tranh đặt vé căng thẳng nhất năm — nên theo dõi trang đặt vé từ vài tuần trước.",
      ],
    },
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/59/Injeongjeon_Hall_01.jpg/1280px-Injeongjeon_Hall_01.jpg",
      alt: "창덕궁 인정전 — Injeongjeon throne hall at Changdeokgung Palace, Seoul",
      license: "CC0",
      credit: "Wikimedia Commons / Bernard Gagnon",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Injeongjeon_Hall_01.jpg",
    },
    lat: 37.579444,
    lng: 126.992778,
    addressKo: "서울특별시 종로구 율곡로 99",
    addressEn: "99 Yulgok-ro, Jongno-gu, Seoul",
    tags: {
      ko: ["창덕궁", "후원", "비원", "서울 궁궐", "낙선재"],
      en: ["Changdeokgung", "Secret Garden", "Biwon", "Seoul palace", "Nakseonjae"],
      zh: ["昌德宫", "后苑", "秘苑", "首尔宫殿", "乐善斋"],
      vi: ["Changdeokgung", "Vườn Bí Mật", "Biwon", "cung điện Seoul", "Nakseonjae"],
    },
    faq: {
      ko: [
        {
          q: "창덕궁 입장료와 한복 무료입장 기준은?",
          a: "성인 입장료는 3,000원이며, 저고리와 치마(또는 바지)를 갖춘 한복을 입으면 무료입니다. 다만 후원(비원) 관람료 약 5,000원은 한복을 입어도 별도로 내야 합니다.",
        },
        {
          q: "창덕궁 후원은 어떻게 관람하나요?",
          a: "후원은 자유관람이 불가능하고 문화재해설사와 함께하는 정해진 회차(약 90분)로만 입장할 수 있습니다. 관람 희망일 6일 전 오전 10시부터 온라인 사전예약이 가능하며, 시간당 100명(온라인 50명·현장 50명)으로 제한됩니다.",
        },
        {
          q: "창덕궁 가는 법과 휴궁일은?",
          a: "지하철 3호선 안국역 3번 출구에서 도보 5분 거리입니다. 매주 월요일은 전체 휴궁이니 방문일을 잡을 때 꼭 확인하세요.",
        },
      ],
      en: [
        {
          q: "What's the admission fee for Changdeokgung, and what counts for free hanbok entry?",
          a: "Adult admission is ₩3,000, waived if you're wearing a full hanbok (top and bottom/skirt set). Note the Secret Garden fee (about ₩5,000) is separate and still applies even in hanbok.",
        },
        {
          q: "How do you visit the Secret Garden (Huwon)?",
          a: "You can't wander it freely — entry is only via scheduled, guided tours (about 90 minutes) with a cultural heritage docent. Online booking opens at 10 AM, six days before your visit date, and each hourly session is capped at 100 people (50 online, 50 on-site).",
        },
        {
          q: "How do you get to Changdeokgung, and when is it closed?",
          a: "Anguk Station (Subway Line 3) Exit 3 is a 5-minute walk away. The palace is closed all day every Monday, so check the calendar before you plan your visit.",
        },
      ],
      zh: [
        {
          q: "昌德宫门票多少钱？穿韩服免票的标准是什么？",
          a: "成人票3000韩元，穿着上衣+下装（裙子或裤子）成套的完整韩服可免票入场。但后苑门票（约5000韩元）即使穿韩服也需另外购买。",
        },
        {
          q: "昌德宫后苑怎么参观？",
          a: "后苑不能自由参观，只能跟随文化解说员分批入场（约90分钟一场）。参观日前6天上午10点开放线上预约，每小时限流100人（线上50人+现场50人）。",
        },
        {
          q: "昌德宫怎么去？哪天休宫？",
          a: "地铁3号线安国站3号出口步行5分钟即到。每周一全天休宫，安排行程前请务必确认。",
        },
      ],
      vi: [
        {
          q: "Vé vào cổng Changdeokgung bao nhiêu, và mặc Hanbok thế nào thì được miễn phí?",
          a: "Vé người lớn là 3.000 won, được miễn nếu mặc trọn bộ Hanbok (áo và quần/váy). Lưu ý vé Vườn Bí Mật (khoảng 5.000 won) là riêng biệt và vẫn phải trả dù đang mặc Hanbok.",
        },
        {
          q: "Tham quan Vườn Bí Mật (Huwon) như thế nào?",
          a: "Không thể tự do dạo chơi — chỉ được vào theo đoàn có hướng dẫn viên di sản văn hóa (khoảng 90 phút mỗi lượt). Đặt vé online mở lúc 10 giờ sáng, 6 ngày trước ngày tham quan, mỗi lượt giới hạn 100 người (50 vé online, 50 vé tại chỗ).",
        },
        {
          q: "Đi đến Changdeokgung bằng cách nào, và cung đóng cửa ngày nào?",
          a: "Lối ra số 3 ga Anguk (tuyến 3) cách đó 5 phút đi bộ. Cung đóng cửa cả ngày thứ Hai hàng tuần, nên kiểm tra lịch trước khi lên kế hoạch.",
        },
      ],
    },
  },
  {
    slug: "bulguksa",
    publishedAt: "2026-07-27",
    region: "gyeongsang",
    category: "palace",
    nameKo: "불국사",
    nameEn: "Bulguksa Temple",
    nameZh: "佛国寺",
    nameVi: "Chùa Bulguksa",
    summaryKo:
      "경주 토함산 자락의 신라 불교 예술 끝판왕. 다보탑·석가탑 국보 두 점이 나란히 서 있고, 절 전체에 국보만 6점. 4km 거리 석굴암과 묶어서 1995년 유네스코 세계유산으로 함께 등재됐어요.",
    summaryEn:
      "Silla Buddhist art at its absolute peak, tucked into the slopes of Mount Tohamsan in Gyeongju. Twin National Treasure pagodas Dabotap and Seokgatap headline six National Treasures on site, and it's paired with Seokguram Grotto 4km away as a joint 1995 UNESCO listing.",
    summaryZh:
      "庆州吐含山下的新罗佛教艺术巅峰之作。国宝级双塔多宝塔、释迦塔并肩而立，全寺共集中6件国宝，1995年与4公里外的石窟庵一同列入联合国教科文组织世界遗产。",
    summaryVi:
      "Đỉnh cao nghệ thuật Phật giáo Silla nằm trên sườn núi Tohamsan, Gyeongju. Cặp tháp Bảo vật Quốc gia Dabotap và Seokgatap sừng sững, cả chùa có tới 6 Bảo vật Quốc gia, được UNESCO công nhận cùng hang đá Seokguram cách 4km vào năm 1995.",
    overviewKo: [
      "불국사는 경주 토함산 자락에 자리한 절로, '부처님의 나라'라는 뜻의 이름 그대로 신라 불교 예술의 정수를 보여주는 곳이에요. 절 기록에 따르면 528년 법흥왕 때 작은 절로 시작했고, 지금 규모의 본격적인 불국사는 751년 재상 김대성이 전생의 부모를 기리며 짓기 시작해 774년 신라 왕실이 완성했다고 전해져요. 임진왜란 때 목조 건물이 전부 불탔지만 다행히 석조물은 그대로 남았고, 1969~1973년 대대적인 복원을 거쳐 지금의 모습을 갖췄습니다. 1995년에는 4km 떨어진 석굴암과 함께 유네스코 세계문화유산에 나란히 등재됐어요.",
      "불국사 하면 가장 먼저 떠오르는 게 대웅전 앞마당의 두 석탑, 다보탑과 석가탑이에요. 두 탑은 나란히 서 있지만 성격이 완전히 달라서 비교하는 재미가 있어요 — 석가탑(8.2m)은 군더더기 없는 단정한 선이 매력인 전형적인 통일신라 석탑이고, 다보탑(10.4m)은 화려한 계단·난간 조각이 층층이 얹힌 파격적인 구조라 '어떻게 돌을 이렇게 깎았지' 싶을 정도예요. 다보탑은 익숙할 수도 있는데, 한국 10원짜리 동전 뒷면에 새겨진 그 탑이 바로 이거예요. 두 탑 모두 국보로 지정돼 있고, 불국사 전체에는 국보만 6점이 몰려 있는 밀도 높은 문화재 보고입니다.",
      "절 입구의 청운교·백운교(위로 오르는 다리 겸 계단)도 놓치면 아쉬운 볼거리예요. 34개 계단이 깨달음에 이르는 34단계를 상징한다는 이야기가 전해지고, 반원형 무지개 모양 아치는 한국에 남아있는 이런 형태 중 가장 오래된 걸로 꼽혀요. 지금은 문화재 보호를 위해 실제로 걸어서 오를 수는 없지만, 계단 아래에서 올려다보는 각도가 사진 포인트로 꽤 유명합니다. 극락전 쪽의 연화교·칠보교도 비슷한 구조인데 연꽃무늬 조각이 남아있어요.",
      "불국사는 단순한 절이 아니라 '부처가 사는 이상세계를 지상에 구현한 공간'이라는 콘셉트로 설계됐어요. 석가모니불의 세계는 대웅전을 중심으로, 아미타불의 극락세계는 극락전을 중심으로 나뉘어 배치돼 있는 식이에요. 대웅전 뒤편 무설전(無說殿)은 '말이 없는 집'이라는 이름처럼, 부처의 가르침은 말로 다 담을 수 없다는 의미를 담고 있고요. 가장 높은 곳의 관음전까지 올라가면 경내 전체가 한눈에 내려다보이니 시간 여유가 있다면 꼭 올라가 보세요.",
      "불국사에서 4km 떨어진 석굴암도 반드시 함께 묶어서 보길 추천해요. 화강암을 정교하게 쌓아 만든 인공 석굴 안에 본존불이 모셔져 있는데, 석굴암 입장은 2023년부터 무료로 바뀌었어요(주차료는 별도). 두 곳을 잇는 12번 버스가 불국사 주차장 건너편에서 매시 40분경 출발하는데(운행 시간은 현장 표지판으로 꼭 재확인하세요), 걸어서 가려면 산길로 약 1시간~1시간 반 걸리는 3km 코스라 체력에 자신 있는 분만 추천합니다.",
      "가는 법은 경주 시내에서 10·11번 버스를 타면 불국사 주차장 앞까지 바로 연결돼요. 봄에는 절 주변 벚꽃, 초여름엔 대웅전 앞 연등이 절경을 더해주고, 관람은 이른 아침이나 늦은 오후에 가야 단체 관광객을 피할 수 있어요. 경주역·신경주역에서도 버스로 이동 가능하니 첨성대·동궁과 월지 같은 경주 시내 다른 유적과 하루 코스로 묶기 좋습니다.",
    ],
    overviewEn: [
      "Bulguksa sits on the slopes of Mount Tohamsan in Gyeongju, and the name — 'Temple of the Buddha Land' — says it all: this place is basically the highlight reel of Silla Buddhist art. Temple records say a small shrine first went up here in 528 under King Beopheung, but the version you see today started in 751, when chief minister Kim Dae-seong began construction to honor his parents from a past life; the Silla royal court finished the job in 774. The wooden buildings all burned down during the 1592 Japanese invasions, but the stone structures survived intact, and a major restoration between 1969 and 1973 (ordered by President Park Chung-hee) brought the temple back to its current form. In 1995, Bulguksa was added to the UNESCO World Heritage List together with Seokguram Grotto, 4km up the mountain.",
      "The first thing everyone remembers about Bulguksa is the pair of stone pagodas standing in front of Daeungjeon hall — Dabotap and Seokgatap. They're planted right next to each other but couldn't be more different, which is half the fun of comparing them: Seokgatap (8.2m) is the clean, no-frills classic Unified Silla pagoda, while Dabotap (10.4m) is an over-the-top structure of stacked stairs and carved railings that makes you wonder how anyone chiseled stone that precisely. You've probably already seen Dabotap without realizing it — it's the pagoda engraved on the back of the Korean 10-won coin. Both are designated National Treasures, and the temple as a whole packs in six National Treasures total — an absurdly high concentration for one site.",
      "Don't skip the Cheongungyo and Baegungyo bridges at the entrance either — a combined staircase-and-bridge structure. Legend has it the 34 steps represent the 34 stages toward enlightenment, and the semicircular rainbow arch underneath is considered the oldest of its kind still standing in Korea. You can't actually walk up it anymore (it's roped off for preservation), but the view looking up from the bottom is a famous photo spot. Over on the Geungnakjeon side, the similarly-built Yeonhwagyo and Chilbogyo bridges still show traces of carved lotus flower patterns.",
      "Bulguksa isn't just a temple — it was designed as an earthly stand-in for the Buddhist paradise itself. Shakyamuni Buddha's world centers on Daeungjeon hall, while Amitabha Buddha's Pure Land is centered on Geungnakjeon, and the whole layout splits accordingly. Behind Daeungjeon sits Museoljeon, the 'Hall of No Words' — a name that captures the idea that the Buddha's teachings can't be fully expressed in language. Climb all the way up to Gwaneumjeon at the highest point of the complex and you get a full view over the entire temple grounds — worth the extra legwork if you've got the time.",
      "Pair the visit with Seokguram Grotto, just 4km away. It's a hand-built granite cave shrine housing the seated main Buddha statue, and admission has been free since 2023 (parking still costs extra). Bus 12 connects the two sites, leaving from across Bulguksa's parking lot roughly around :40 past each hour — double-check the posted schedule on-site since times shift. Walking is an option too, but it's a roughly 3km, 1–1.5 hour mountain trail, so only attempt it if you're up for a proper hike.",
      "To get there, city buses 10 and 11 from downtown Gyeongju run straight to the Bulguksa parking lot. Spring brings cherry blossoms around the temple, while early summer adds rows of lotus lanterns in front of Daeungjeon — either makes for a stunning backdrop. Go early morning or late afternoon to dodge the tour bus crowds, and since Gyeongju Station and Singyeongju Station both connect by bus, it's easy to pair Bulguksa with Cheomseongdae Observatory or Donggung Palace and Wolji Pond for a full day of Gyeongju sightseeing.",
    ],
    overviewZh: [
      "佛国寺坐落在庆州吐含山山腰，「佛国寺」这个名字——「佛的国度之寺」——就已经说明了一切：这里堪称新罗佛教艺术的精华集大成之地。寺内记载显示，528年法兴王时期这里先建了一座小寺庙，如今看到的规模则始于751年，宰相金大城为祭奠前世父母而动工兴建，774年由新罗王室最终完工。壬辰倭乱时木造建筑全部被烧毁，所幸石造结构完好保存了下来，1969至1973年经过一次大规模修复（由朴正熙总统下令），才有了今天的样貌。1995年，佛国寺与4公里外的石窟庵一同被列入联合国教科文组织世界文化遗产名录。",
      "提到佛国寺，大家第一时间想到的就是大雄殿前的两座石塔——多宝塔和释迦塔。两塔并肩而立，风格却截然不同，对比起来特别有意思：释迦塔（高8.2米）线条简洁利落，是典型的统一新罗风格石塔；多宝塔（高10.4米）则阶梯栏杆层层叠叠、雕工华丽到令人惊叹「石头怎么能刻成这样」。多宝塔说不定你早就见过——它就是韩国10元硬币背面印的那座塔。两座塔均被列为国宝，整个佛国寺境内共集中了6件国宝，文物密度高得惊人。",
      "寺庙入口处的青云桥、白云桥（兼具桥梁与阶梯功能）也不容错过。传说34级台阶象征通往顿悟的34个阶段，桥下半圆形彩虹状石拱更是韩国现存同类结构中年代最久远的。如今出于文物保护已不能实际踏阶而上，但从台阶下方仰望的角度是著名的拍照机位。极乐殿一侧的莲花桥、七宝桥结构类似，桥面上仍留有莲花纹雕刻的痕迹。",
      "佛国寺并非单纯的寺庙，它的设计理念是把佛国净土「搬到」人间。释迦牟尼佛的世界以大雄殿为中心，阿弥陀佛的极乐世界则以极乐殿为中心分区布局。大雄殿后方的无说殿，顾名思义「无言之殿」，寓意佛的教诲无法用言语完全道尽。若时间充裕，不妨爬到境内地势最高的观音殿，从那里可以将整个寺院尽收眼底。",
      "强烈建议把4公里外的石窟庵一并纳入行程。石窟庵是用花岗岩精心堆砌而成的人工石窟，内供本尊佛像，2023年起门票已改为免费（停车费仍需另付）。往返两地的12路公交车从佛国寺停车场对面发车，大约每小时40分左右一班（具体以现场站牌为准），步行则需走约3公里山路，耗时1~1.5小时，建议体力充足者再挑战。",
      "交通方面，从庆州市区乘10、11路公交车可直达佛国寺停车场。春天寺庙周边樱花盛开，初夏大雄殿前挂满莲花灯，各有各的绝美。建议清晨或傍晚前往，能避开旅行团人潮。庆州站、新庆州站也有公交连接，很适合和瞻星台、东宫与月池等庆州市区其他古迹串成一日游。",
    ],
    overviewVi: [
      "Bulguksa tọa lạc trên sườn núi Tohamsan ở Gyeongju, và cái tên 'Ngôi chùa của Cõi Phật' đã nói lên tất cả: đây gần như là tinh hoa nghệ thuật Phật giáo thời Silla. Ghi chép của chùa cho biết một ngôi chùa nhỏ đã được dựng lên từ năm 528 dưới thời vua Beopheung, nhưng phiên bản mà bạn thấy ngày nay bắt đầu từ năm 751, khi tể tướng Kim Dae-seong khởi công xây dựng để tưởng nhớ cha mẹ kiếp trước của mình; triều đình Silla hoàn thành công trình vào năm 774. Các công trình gỗ đều bị thiêu rụi trong cuộc xâm lược của Nhật năm 1592, nhưng may mắn các kết cấu đá vẫn còn nguyên vẹn, và một đợt trùng tu lớn từ 1969 đến 1973 (theo lệnh Tổng thống Park Chung-hee) đã đưa ngôi chùa về hình dáng như hiện tại. Năm 1995, Bulguksa được UNESCO công nhận Di sản Thế giới cùng với hang đá Seokguram cách đó 4km.",
      "Điều đầu tiên ai cũng nhớ về Bulguksa là cặp tháp đá đứng trước điện Daeungjeon — Dabotap và Seokgatap. Hai tháp đứng sát nhau nhưng phong cách hoàn toàn khác biệt, khiến việc so sánh chúng trở nên thú vị: Seokgatap (cao 8,2m) mang đường nét đơn giản, thanh thoát, đúng chuẩn tháp đá Silla Thống nhất cổ điển; còn Dabotap (cao 10,4m) là một kết cấu cầu kỳ với bậc thang, lan can chạm khắc xếp tầng khiến người ta phải tự hỏi làm sao có thể đẽo đá tinh xảo đến vậy. Có thể bạn đã từng thấy Dabotap mà không để ý — đó chính là hình tháp được khắc trên mặt sau đồng xu 10 won của Hàn Quốc. Cả hai đều được công nhận Bảo vật Quốc gia, và toàn bộ khuôn viên chùa tập trung tới 6 Bảo vật Quốc gia — mật độ di sản dày đặc đến khó tin.",
      "Đừng bỏ qua cầu Cheongungyo và Baegungyo ở lối vào — một kết cấu vừa là cầu thang vừa là cầu. Tương truyền 34 bậc thang tượng trưng cho 34 giai đoạn để đạt giác ngộ, và vòm cầu vồng bán nguyệt bên dưới được xem là kiểu kiến trúc cổ nhất còn tồn tại ở Hàn Quốc. Giờ đây không thể bước lên thực sự (đã được rào lại để bảo tồn), nhưng góc nhìn từ dưới lên là điểm chụp ảnh nổi tiếng. Ở phía điện Geungnakjeon, cặp cầu Yeonhwagyo và Chilbogyo có kết cấu tương tự, vẫn còn dấu vết hoa văn hoa sen được chạm khắc.",
      "Bulguksa không chỉ đơn thuần là một ngôi chùa — nó được thiết kế như một hình ảnh thu nhỏ của cõi Phật ngay trên mặt đất. Thế giới của Phật Thích Ca lấy điện Daeungjeon làm trung tâm, còn cõi Tịnh Độ của Phật A Di Đà lấy điện Geungnakjeon làm trung tâm, và toàn bộ bố cục được chia theo đó. Phía sau Daeungjeon là điện Museoljeon, 'Điện Không Lời' — cái tên phản ánh ý niệm rằng giáo lý của Đức Phật không thể diễn đạt trọn vẹn bằng ngôn từ. Nếu còn thời gian, hãy leo lên tận điện Gwaneumjeon ở điểm cao nhất khuôn viên, từ đó có thể nhìn bao quát toàn bộ khu chùa.",
      "Nên kết hợp ghé thăm hang đá Seokguram cách đó chỉ 4km. Đây là một hang đá granite được xây dựng thủ công tinh xảo, bên trong thờ tượng Phật chính, và vé vào cửa đã miễn phí từ năm 2023 (phí gửi xe vẫn tính riêng). Xe buýt số 12 nối hai điểm này, xuất phát từ phía đối diện bãi đỗ xe Bulguksa khoảng phút 40 mỗi giờ (nên kiểm tra lại giờ chạy thực tế tại bảng thông báo). Đi bộ cũng là một lựa chọn, nhưng là đường núi dài khoảng 3km, mất 1–1,5 tiếng, nên chỉ thử nếu bạn sẵn sàng cho một chuyến leo núi thực sự.",
      "Về di chuyển, xe buýt thành phố số 10 và 11 từ trung tâm Gyeongju chạy thẳng đến bãi đỗ xe Bulguksa. Mùa xuân có hoa anh đào quanh chùa, đầu mùa hè có hàng đèn lồng hoa sen trước điện Daeungjeon, mùa nào cũng đẹp theo cách riêng. Nên đi vào sáng sớm hoặc chiều muộn để tránh đoàn khách du lịch, và vì ga Gyeongju lẫn ga Singyeongju đều có xe buýt kết nối, rất dễ kết hợp Bulguksa với đài quan sát Cheomseongdae hay Cung điện Donggung và hồ Wolji cho một ngày khám phá trọn vẹn Gyeongju.",
    ],
    tips: {
      ko: [
        "불국사 입장료는 시기별로 변동 있으니 방문 전 공식 확인 권장, 석굴암은 2023년부터 무료(주차료 별도).",
        "불국사~석굴암 12번 버스는 매시 40분경 출발 — 정확한 시간은 현장 정류장 표지판 재확인 필수.",
        "걸어서 가려면 산길 약 3km, 1~1.5시간 — 체력에 자신 있을 때만.",
        "경주 시내에서 10·11번 버스 타면 불국사 주차장 앞 바로 연결.",
        "단체 관광객 피하려면 이른 아침이나 늦은 오후 방문 추천.",
      ],
      en: [
        "Admission fees shift seasonally, so double-check before you go — Seokguram Grotto itself has been free since 2023 (parking still costs extra).",
        "The Bulguksa–Seokguram bus (Route 12) leaves roughly around :40 past the hour — verify the exact time at the on-site stop, it shifts.",
        "Walking is about 3km of mountain trail, 1–1.5 hours — only if you're up for a real hike.",
        "City buses 10 and 11 from downtown Gyeongju run straight to the Bulguksa parking lot.",
        "Go early morning or late afternoon to dodge the tour bus crowds.",
      ],
      zh: [
        "门票价格随季节浮动，出发前建议官方渠道再确认；石窟庵本身2023年起已免门票（停车费另算）。",
        "佛国寺往石窟庵的12路公交大约每小时40分发车——具体时间以现场站牌为准，会有变动。",
        "步行约3公里山路，需1~1.5小时，建议体力充沛时再挑战。",
        "庆州市区乘10、11路公交可直达佛国寺停车场。",
        "清晨或傍晚前往可避开旅行团人潮。",
      ],
      vi: [
        "Giá vé có thể thay đổi theo mùa, nên kiểm tra trước khi đi — riêng hang đá Seokguram đã miễn phí vé từ 2023 (phí gửi xe vẫn tính riêng).",
        "Xe buýt tuyến 12 nối Bulguksa–Seokguram chạy khoảng phút 40 mỗi giờ — nên kiểm tra lại giờ chính xác tại bảng thông báo tại chỗ.",
        "Đi bộ là đường núi khoảng 3km, mất 1–1,5 tiếng — chỉ nên thử khi đủ thể lực.",
        "Xe buýt số 10 và 11 từ trung tâm Gyeongju chạy thẳng đến bãi đỗ xe Bulguksa.",
        "Nên đi sáng sớm hoặc chiều muộn để tránh đoàn khách du lịch.",
      ],
    },
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/d/dd/Dabotap_Pagoda_01.jpg/1280px-Dabotap_Pagoda_01.jpg",
      alt: "불국사 다보탑 — Dabotap Pagoda at Bulguksa Temple, Gyeongju",
      license: "CC0",
      credit: "Wikimedia Commons / Bernard Gagnon",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Dabotap_Pagoda_01.jpg",
    },
    lat: 35.79,
    lng: 129.332222,
    addressKo: "경상북도 경주시 불국로 385",
    addressEn: "385 Bulguk-ro, Gyeongju, Gyeongsangbuk-do",
    tags: {
      ko: ["불국사", "경주", "다보탑", "석가탑", "석굴암"],
      en: ["Bulguksa", "Gyeongju", "Dabotap", "Seokgatap", "Seokguram Grotto"],
      zh: ["佛国寺", "庆州", "多宝塔", "释迦塔", "石窟庵"],
      vi: ["Bulguksa", "Gyeongju", "Dabotap", "Seokgatap", "hang đá Seokguram"],
    },
    faq: {
      ko: [
        {
          q: "불국사 입장료와 석굴암 입장료는?",
          a: "불국사 입장료는 시기에 따라 달라질 수 있어 방문 전 공식 확인이 필요하며, 석굴암은 2023년 5월부터 무료 입장으로 전환됐습니다(주차료는 별도).",
        },
        {
          q: "불국사에서 석굴암까지 가는 법은?",
          a: "불국사 주차장 건너편에서 12번 버스가 매시 40분경 출발하며 정확한 시간은 현장 표지판으로 재확인하세요. 걸어서는 산길 약 3km, 1~1.5시간이 걸립니다.",
        },
        {
          q: "불국사 가는 법은?",
          a: "경주 시내에서 10·11번 버스를 타면 불국사 주차장 앞까지 바로 연결됩니다. 경주역·신경주역에서도 버스로 이동 가능합니다.",
        },
      ],
      en: [
        {
          q: "What's the admission fee for Bulguksa and Seokguram Grotto?",
          a: "Bulguksa's fee shifts seasonally, so check the official site before you go. Seokguram Grotto itself has been free to enter since May 2023 (parking still costs extra).",
        },
        {
          q: "How do you get from Bulguksa to Seokguram Grotto?",
          a: "Bus Route 12 leaves from across the Bulguksa parking lot roughly around :40 past the hour — verify the exact time at the on-site stop. On foot, it's about a 3km mountain trail taking 1–1.5 hours.",
        },
        {
          q: "How do you get to Bulguksa?",
          a: "City buses 10 and 11 from downtown Gyeongju run straight to the Bulguksa parking lot. Gyeongju Station and Singyeongju Station both connect by bus as well.",
        },
      ],
      zh: [
        {
          q: "佛国寺和石窟庵门票多少钱？",
          a: "佛国寺门票会随季节调整，出发前建议查询官方渠道确认；石窟庵本身自2023年5月起已改为免费入场（停车费另计）。",
        },
        {
          q: "从佛国寺到石窟庵怎么去？",
          a: "佛国寺停车场对面乘12路公交车，大约每小时40分发车，具体时间请以现场站牌为准。步行约3公里山路，需1~1.5小时。",
        },
        {
          q: "佛国寺怎么去？",
          a: "从庆州市区乘10、11路公交车可直达佛国寺停车场。庆州站、新庆州站也有公交车可以换乘前往。",
        },
      ],
      vi: [
        {
          q: "Vé vào cổng Bulguksa và hang đá Seokguram bao nhiêu?",
          a: "Giá vé Bulguksa thay đổi theo mùa nên hãy kiểm tra trang chính thức trước khi đi. Riêng hang đá Seokguram đã miễn phí vé vào cửa từ tháng 5/2023 (phí gửi xe vẫn tính riêng).",
        },
        {
          q: "Đi từ Bulguksa đến hang đá Seokguram bằng cách nào?",
          a: "Xe buýt tuyến 12 xuất phát từ phía đối diện bãi đỗ xe Bulguksa, khoảng phút 40 mỗi giờ — nên kiểm tra giờ chính xác tại bảng thông báo tại chỗ. Đi bộ thì mất khoảng 3km đường núi, 1–1,5 tiếng.",
        },
        {
          q: "Đi đến Bulguksa bằng cách nào?",
          a: "Xe buýt số 10 và 11 từ trung tâm Gyeongju chạy thẳng đến bãi đỗ xe Bulguksa. Ga Gyeongju và ga Singyeongju cũng có xe buýt kết nối.",
        },
      ],
    },
  },
  {
    slug: "myeongdong",
    publishedAt: "2026-07-25",
    region: "seoul",
    category: "market",
    nameKo: "명동",
    nameEn: "Myeongdong",
    nameZh: "明洞",
    nameVi: "Myeongdong",
    summaryKo:
      "서울 쇼핑 1번지는 두말없이 명동이에요. 로드샵 K뷰티부터 회오리감자·호떡 같은 길거리 간식, 100년 넘은 명동성당까지 한 골목에 다 몰려있어서 반나절이면 서울 축소판을 다 보는 느낌이에요. 명동역 6번 출구만 나오면 바로 시작이라 접근성도 갑.",
    summaryEn:
      "Seoul's #1 shopping street, no debate. K-beauty shops, tornado potatoes and hotteok, and a 120+ year-old cathedral all packed into a few blocks — half a day here feels like Seoul in miniature. Exit Myeongdong Station and you're already in it.",
    summaryZh:
      "首尔购物一号地非明洞莫属。从K美妆路边店到旋风土豆、糖饼这些街头小吃，再到120多年历史的明洞主教座堂，全挤在几条巷子里，逛半天就像把首尔浓缩了一遍。地铁明洞站一出站就是购物街，交通超方便。",
    summaryVi:
      "Phố mua sắm số 1 Seoul chính là Myeongdong, khỏi bàn cãi. Từ các cửa hàng K-beauty, khoai tây lốc xoáy, bánh hotteok cho đến nhà thờ hơn 120 năm tuổi, tất cả gói gọn trong vài con hẻm — dạo nửa ngày là thấy cả Seoul thu nhỏ. Ra khỏi ga Myeongdong là vào thẳng khu phố luôn.",
    overviewKo: [
      "명동은 조선시대엔 '명례방'이라 불리던 곳인데, 이름 자체가 '밝은 동네'라는 뜻이에요. 일제강점기엔 일본인 상업지구 '메이지초'로 개발되며 지금의 격자형 골목 구조가 자리 잡았고, 광복 이후엔 다방·화랑·소극장이 밀집한 '한국의 예술인 거리'로 불렸어요. 1970~80년대엔 가수들이 활동한 음악다방부터 화가들의 개인전이 열리던 화랑까지, 서울 문화의 중심이었던 셈이죠. 지금은 그 흔적은 많이 사라졌지만, 대신 K뷰티·K패션의 최전선으로 자리를 옮겨 한국관광공사 조사에서 외국인 관광객이 꼽는 서울 방문지 1위 자리를 여러 해째 지키고 있어요.",
      "명동은 지하철 4호선 명동역 6·7·8번 출구부터 2호선 을지로입구역 5·6번 출구 사이, 대략 1km 남짓한 구역이에요. 메인 도로인 명동길과 명동8나길을 축으로 좁은 골목들이 바둑판처럼 얽혀 있어서 길 잃기 딱 좋은데, 오히려 그게 명동의 매력이기도 해요. 눈스퀘어·명동밀레오레 같은 쇼핑몰과 롯데백화점 본점, 신세계백화점 본점이 도보 5분 거리에 다 모여 있어서 하루 코스로 짜기 편합니다.",
      "명동 하면 역시 길거리 음식이죠. 회오리감자(스파이럴 감자칩), 계란빵, 갓 구운 호떡, 닭꼬치, 만두가 스테디셀러고 요즘은 탕후루·마라 간식류도 골목마다 등장했어요. 노점은 보통 오후 4~5시부터 본격적으로 열려서 밤 10시 넘어서까지 이어지니, 낮보다는 해 질 무렵부터가 진짜 명동 타임이에요. ⚠️ 노점 가격표를 미리 확인하는 습관을 들이세요 — 정찰제가 대부분이지만 일부는 사진 촬영 후 가격을 부르는 경우도 있어서 시식·구매 전 가격 확인이 안전합니다.",
      "명동 남쪽 언덕엔 1898년 완공된 명동성당이 있어요. 한국 최초의 서양식 고딕 성당으로, 붉은 벽돌과 뾰족한 첨탑이 주변 쇼핑가와 대비되면서 오히려 더 눈에 띄어요. 단순한 종교 건축물이 아니라 1987년 6월 민주항쟁 당시 시위대가 이곳에서 농성하며 한국 민주화의 상징적 장소로 자리매김했죠. 입장은 무료고 미사 시간이 아니면 내부 관람도 가능하니, 쇼핑하다 잠깐 들러 조용한 시간을 가져보는 것도 추천해요.",
      "명동 주변엔 롯데면세점 본점, 신세계면세점 명동점이 걸어서 갈 수 있는 거리라 큰 쇼핑을 계획한다면 동선 짜기 좋아요. 저녁엔 비언어극 '난타' 전용극장인 명동난타극장에서 공연을 볼 수 있는데, 대사가 없어 외국인 관광객도 부담 없이 즐기는 서울 대표 공연 중 하나예요. 환전소도 골목마다 있어서 급하게 현금이 필요할 때 유용합니다.",
      "카드 결제는 대부분 잘 되지만 일부 노점은 현금만 받으니 소액권을 챙기는 게 편해요. 로드샵 화장품은 정찰제가 기본이라 흥정은 안 통하고, 대신 매장 직원에게 물어보면 종종 즉석 할인 쿠폰을 주기도 해요. 주말 오후엔 인파가 최고조라 느긋하게 보고 싶으면 평일 오전이 낫고, 명동교자 같은 칼국수·만두 노포는 점심시간 웨이팅이 상당하니 시간 여유를 두는 게 좋습니다. 명동역 지하상가와 바로 연결돼 있어 비 오는 날에도 이동이 편해요.",
    ],
    overviewEn: [
      "Myeongdong was called 'Myeongnye-bang' in the Joseon era — the name literally means 'bright neighborhood.' Under Japanese colonial rule it was developed as a Japanese commercial district called 'Meiji-cho,' which is where today's grid of narrow alleys comes from. After liberation it became known as Korea's 'artists' street,' packed with music cafes, galleries, and small theaters — singers and painters built careers here through the 1970s and '80s. Most of that scene has faded now, but Myeongdong simply shifted lanes into K-beauty and K-fashion, and it's topped Korea Tourism Organization surveys as foreign visitors' #1 Seoul destination for years running.",
      "Myeongdong runs roughly 1km between Exits 6-8 of Myeongdong Station (Line 4) and Exits 5-6 of Euljiro 1(il)-ga Station (Line 2). The main streets, Myeongdong-gil and Myeongdong 8na-gil, branch into a maze of narrow alleys that's genuinely easy to get lost in — which is honestly part of the charm. Shopping malls like Nune Square and Migliore, plus the flagship Lotte and Shinsegae department stores, are all within a five-minute walk, so it's easy to build a full-day plan around it.",
      "Street food is the headline act. Tornado potatoes (spiral-cut fried potato on a skewer), egg bread, fresh hotteok, chicken skewers, and mandu are the classics, and lately tanghulu (candied fruit) and mala snacks have started popping up on every corner. Stalls really kick into gear around 4-5 PM and run past 10 PM, so evening is prime Myeongdong time, not midday. ⚠️ Get in the habit of checking the price sign before you order — most stalls are fixed-price, but a few have been known to quote higher after seeing a visitor's camera out, so confirm the price before you buy.",
      "On the hill at Myeongdong's south end stands Myeongdong Cathedral, completed in 1898. It's Korea's first Western-style Gothic cathedral, and its red brick and spire stand out even more for contrasting with the shopping district around it. It's more than a religious building, too — protesters occupied it during the June 1987 Democracy Movement, cementing its place as a landmark of Korea's democratization. Admission is free, and you can step inside outside of Mass hours for a quiet break from the shopping crowds.",
      "The flagship Lotte Duty Free and Shinsegae Duty Free stores are both a short walk away, which makes route-planning easy if you're doing serious duty-free shopping. In the evening, the dedicated Nanta Theatre stages the non-verbal comedy show 'Nanta' — no dialogue means it's an easy watch for international visitors, and it's one of Seoul's signature shows. Currency exchange booths are scattered through the alleys too, handy if you suddenly need cash.",
      "Card payment works almost everywhere, but a few street stalls are cash-only, so keep some small bills handy. Cosmetics shops run fixed pricing — haggling won't work — but asking staff directly sometimes gets you an on-the-spot discount coupon. Crowds peak on weekend afternoons, so weekday mornings are better if you want a relaxed pace, and old-school noodle-and-dumpling spots like Myeongdong Kyoja can have serious lunchtime lines, so build in extra time. It connects directly to the Myeongdong Station underground mall, which is handy for rainy days.",
    ],
    overviewZh: [
      "明洞在朝鲜王朝时期名叫「明礼坊」，名字本身就是「明亮的街区」之意。日据时期这里被开发成日本人商业区「明治町」，如今棋盘式的窄巷格局正是那时定下的。光复后这里成了汇聚音乐茶室、画廊、小剧场的「韩国艺术家街」，1970~80年代不少歌手、画家都在此活跃过，堪称首尔文化中心。如今那段痕迹大多已消失，取而代之的是K美妆、K时尚的最前线——在韩国观光公社的调查中，明洞连续多年蝉联外国游客首尔到访地第一名。",
      "明洞大致是地铁4号线明洞站6~8号出口到2号线乙支路入口站5~6号出口之间约1公里的区域。主干道明洞街和明洞8娜街之间，窄巷像棋盘一样交错，很容易迷路——但这恰恰也是明洞的魅力所在。眼睛广场（Nune Square）、明洞美利来这类购物中心，以及乐天百货本店、新世界百货本店都在步行5分钟范围内，很方便安排一整天的行程。",
      "说到明洞，街头小吃当然是主角。旋风土豆（螺旋薯片串）、鸡蛋面包、现烤糖饼、鸡肉串、饺子是常年热卖款，最近糖葫芦、麻辣类小吃也在各个巷口冒头。摊位一般下午4~5点才正式开张，一直营业到晚上10点后，所以比起白天，傍晚才是真正的明洞时间。⚠️ 建议养成先看价格牌的习惯——大部分摊位是明码标价，但也有个别摊位在游客拍完照后临时抬价，购买前确认价格更保险。",
      "明洞南侧的小山丘上矗立着1898年竣工的明洞主教座堂，是韩国第一座西式哥特式教堂，红砖外墙与尖塔在周围购物街的映衬下格外显眼。它不只是宗教建筑——1987年六月民主抗争期间，示威者曾在此静坐抗议，使其成为韩国民主化历史的象征性场所。入场免费，非弥撒时段也能进入内部参观，逛累了进去安静一会儿也不错。",
      "乐天免税店本店、新世界免税店明洞店都在步行范围内，如果打算大采购，动线安排会很方便。晚上还能去专属剧场明洞乱打剧场观看非语言喜剧「乱打」，没有台词，外国游客看起来毫无压力，是首尔代表性演出之一。巷子里换汇店也不少，急需现金时很方便。",
      "刷卡在大部分地方都没问题，但部分路边摊只收现金，建议随身带点零钱。化妆品店基本是明码标价，砍价行不通，不过主动问店员，有时能拿到现场折扣券。周末下午人潮最多，想悠闲逛的话平日上午更合适；明洞饺子这类老字号刀削面、饺子店午餐时段排队相当久，最好留出充足时间。这里和明洞站地下商店街直接相连，下雨天移动也很方便。",
    ],
    overviewVi: [
      "Myeongdong thời Joseon được gọi là 'Myeongnye-bang' — cái tên có nghĩa là 'khu phố sáng sủa'. Dưới thời thuộc địa Nhật, nơi này được phát triển thành khu thương mại của người Nhật mang tên 'Meiji-cho', và chính từ đó hình thành mạng lưới hẻm nhỏ ô bàn cờ như ngày nay. Sau giải phóng, nơi đây trở thành 'phố nghệ sĩ' của Hàn Quốc với đầy quán cà phê nhạc, phòng tranh, nhà hát nhỏ — ca sĩ, họa sĩ thập niên 1970-80 đều gây dựng sự nghiệp tại đây. Ngày nay dấu vết đó phần lớn đã phai nhạt, thay vào đó Myeongdong chuyển mình thành tuyến đầu của K-beauty và K-fashion, nhiều năm liền đứng đầu khảo sát của Tổng cục Du lịch Hàn Quốc về điểm đến được du khách nước ngoài chọn nhiều nhất ở Seoul.",
      "Myeongdong trải dài khoảng 1km, từ lối ra 6-8 ga Myeongdong (tuyến 4) đến lối ra 5-6 ga Euljiro 1(il)-ga (tuyến 2). Hai trục chính là Myeongdong-gil và Myeongdong 8na-gil, xung quanh là mê cung hẻm nhỏ chồng chéo rất dễ lạc đường — nhưng đó cũng chính là nét hấp dẫn riêng. Các trung tâm mua sắm như Nune Square, Migliore cùng cửa hàng chính của Lotte và Shinsegae Department Store đều nằm trong bán kính 5 phút đi bộ, nên dễ dàng lên kế hoạch cho cả ngày.",
      "Nhắc đến Myeongdong là phải nhắc đồ ăn đường phố. Khoai tây lốc xoáy, bánh trứng, hotteok mới nướng, xiên gà, mandu là những món kinh điển, gần đây tanghulu (trái cây bọc đường) và món cay mala cũng xuất hiện ở khắp các góc phố. Các quầy hàng thường mở chính thức từ 4-5 giờ chiều và bán tới hơn 10 giờ tối, nên buổi tối mới thật sự là giờ vàng của Myeongdong chứ không phải ban ngày. ⚠️ Hãy tập thói quen xem giá niêm yết trước khi mua — hầu hết quầy hàng bán giá cố định, nhưng một số nơi từng bị phản ánh hét giá cao hơn sau khi thấy khách chụp ảnh, nên xác nhận giá trước khi mua là an toàn nhất.",
      "Trên ngọn đồi phía nam Myeongdong là Nhà thờ chính tòa Myeongdong, hoàn thành năm 1898. Đây là nhà thờ Gothic kiểu phương Tây đầu tiên của Hàn Quốc, tường gạch đỏ và tháp nhọn nổi bật hẳn lên giữa khu phố mua sắm xung quanh. Đây không chỉ là công trình tôn giáo — trong phong trào Dân chủ hóa tháng 6 năm 1987, người biểu tình từng cố thủ tại đây, khiến nơi này trở thành biểu tượng của lịch sử dân chủ hóa Hàn Quốc. Vào cửa miễn phí, ngoài giờ lễ vẫn có thể vào tham quan bên trong, ghé qua nghỉ ngơi yên tĩnh giữa lúc mua sắm cũng rất đáng.",
      "Cửa hàng chính của Lotte Duty Free và Shinsegae Duty Free Myeongdong đều trong tầm đi bộ, nên nếu định mua sắm miễn thuế lớn thì sắp xếp lộ trình khá dễ. Buổi tối có thể xem vở kịch không lời 'Nanta' tại nhà hát riêng Nanta Myeongdong — không có thoại nên khách nước ngoài xem rất thoải mái, là một trong những show diễn tiêu biểu của Seoul. Các quầy đổi tiền cũng rải khắp các hẻm, tiện khi cần tiền mặt gấp.",
      "Thanh toán thẻ hầu như dùng được ở mọi nơi, nhưng một số quầy hàng rong chỉ nhận tiền mặt nên nên mang theo ít tiền lẻ. Các cửa hàng mỹ phẩm bán giá niêm yết, mặc cả không có tác dụng, nhưng hỏi trực tiếp nhân viên đôi khi được tặng phiếu giảm giá tại chỗ. Đông nhất là chiều cuối tuần, nên muốn dạo thong thả thì đi sáng ngày thường sẽ tốt hơn; các quán mì, mandu lâu đời như Myeongdong Kyoja giờ trưa xếp hàng khá lâu, nên chừa thêm thời gian. Khu này nối thẳng vào trung tâm mua sắm ngầm ga Myeongdong nên ngày mưa di chuyển cũng tiện.",
    ],
    tips: {
      ko: [
        "노점 길거리 음식은 오후 4~5시부터 본격 오픈 — 낮보다 해 질 무렵이 진짜 명동 타임.",
        "명동성당은 무료입장, 미사 시간만 피하면 내부도 관람 가능.",
        "화장품 로드샵은 정찰제라 흥정 대신 직원에게 할인 쿠폰을 물어보세요.",
        "주말 오후는 인파 최고조 — 느긋하게 보려면 평일 오전 추천.",
        "일부 노점은 카드 결제가 안 되니 소액 현금을 챙겨두면 편해요.",
      ],
      en: [
        "Street stalls really get going around 4-5 PM — evening, not midday, is prime Myeongdong time.",
        "Myeongdong Cathedral is free to enter; step inside outside of Mass hours.",
        "Cosmetics shops run fixed prices — ask staff directly for a discount coupon instead of haggling.",
        "Weekend afternoons are peak crowds — weekday mornings are far more relaxed.",
        "Some street stalls are cash-only, so carry a few small bills just in case.",
      ],
      zh: [
        "路边摊大多下午4~5点才正式开张——傍晚才是真正的明洞时间，不是白天。",
        "明洞主教座堂免费入场，避开弥撒时段也能进内部参观。",
        "化妆品店是明码标价，砍价没用，不如直接问店员要折扣券。",
        "周末下午人最多——想悠闲逛街选平日上午更好。",
        "部分路边摊不能刷卡，建议随身带点零钱现金。",
      ],
      vi: [
        "Quầy hàng rong thường mở chính thức từ 4-5 giờ chiều — buổi tối mới là giờ vàng của Myeongdong.",
        "Nhà thờ Myeongdong vào cửa miễn phí, tránh giờ lễ vẫn có thể vào tham quan bên trong.",
        "Cửa hàng mỹ phẩm bán giá cố định — thay vì mặc cả, hãy hỏi nhân viên xin phiếu giảm giá.",
        "Chiều cuối tuần đông nhất — muốn dạo thong thả thì chọn sáng ngày thường.",
        "Một số quầy hàng rong không nhận thẻ, nên mang theo ít tiền mặt lẻ.",
      ],
    },
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/88/Myeongdong_night_market_seoul_1.jpg/1280px-Myeongdong_night_market_seoul_1.jpg",
      alt: "명동 밤거리 노점 야시장 — Myeongdong night street food stalls, Seoul",
      license: "CC BY-SA 4.0",
      credit: "Wikimedia Commons / Sgroey",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Myeongdong_night_market_seoul_1.jpg",
    },
    lat: 37.5633,
    lng: 126.9873,
    addressKo: "서울특별시 중구 명동길 74",
    addressEn: "74 Myeongdong-gil, Jung-gu, Seoul",
    tags: {
      ko: ["명동", "명동 쇼핑", "K뷰티", "길거리 음식", "명동성당"],
      en: ["Myeongdong", "Myeongdong shopping", "K-beauty", "street food", "Myeongdong Cathedral"],
      zh: ["明洞", "明洞购物", "K美妆", "路边小吃", "明洞主教座堂"],
      vi: ["Myeongdong", "mua sắm Myeongdong", "K-beauty", "ẩm thực đường phố", "Nhà thờ Myeongdong"],
    },
    faq: {
      ko: [
        {
          q: "명동 가는 법은?",
          a: "지하철 4호선 명동역 6·7·8번 출구 또는 2호선 을지로입구역 5·6번 출구로 나오면 바로 쇼핑거리가 시작됩니다.",
        },
        {
          q: "명동 길거리 음식은 언제부터 파나요?",
          a: "노점은 보통 오후 4~5시부터 본격적으로 열려 밤 10시 넘어서까지 이어집니다. 낮보다는 해 질 무렵부터가 진짜 명동 타임이에요.",
        },
        {
          q: "명동성당은 입장료가 있나요?",
          a: "무료입니다. 미사 시간이 아니면 내부도 자유롭게 관람할 수 있고, 1987년 6월 민주항쟁의 상징적 장소이기도 합니다.",
        },
      ],
      en: [
        {
          q: "How do you get to Myeongdong?",
          a: "Take Exits 6, 7, or 8 of Myeongdong Station (Subway Line 4), or Exits 5-6 of Euljiro 1(il)-ga Station (Line 2) — both drop you right into the shopping street.",
        },
        {
          q: "When does Myeongdong street food start?",
          a: "Stalls really kick into gear around 4-5 PM and run past 10 PM. Evening, not midday, is prime Myeongdong time.",
        },
        {
          q: "Is there an admission fee for Myeongdong Cathedral?",
          a: "No, it's free. You can step inside outside of Mass hours, and it's also a landmark of Korea's June 1987 Democracy Movement.",
        },
      ],
      zh: [
        {
          q: "明洞怎么去？",
          a: "从地铁4号线明洞站6、7、8号出口，或2号线乙支路入口站5、6号出口出站即是购物街入口。",
        },
        {
          q: "明洞街头小吃几点开始卖？",
          a: "摊位一般下午4~5点才正式开张，一直营业到晚上10点后。比起白天，傍晚才是真正的明洞时间。",
        },
        {
          q: "明洞主教座堂要门票吗？",
          a: "免费入场。非弥撒时段可自由参观内部，这里也是1987年六月民主抗争的象征性场所。",
        },
      ],
      vi: [
        {
          q: "Đi đến Myeongdong bằng cách nào?",
          a: "Ra lối 6, 7 hoặc 8 ga Myeongdong (tuyến 4), hoặc lối ra 5-6 ga Euljiro 1(il)-ga (tuyến 2) là vào ngay phố mua sắm.",
        },
        {
          q: "Đồ ăn đường phố Myeongdong bán từ mấy giờ?",
          a: "Quầy hàng thường mở chính thức từ 4-5 giờ chiều và bán tới hơn 10 giờ tối. Buổi tối, không phải ban ngày, mới là giờ vàng của Myeongdong.",
        },
        {
          q: "Nhà thờ Myeongdong có mất phí vào cửa không?",
          a: "Miễn phí. Ngoài giờ lễ vẫn có thể vào tham quan bên trong, và đây cũng là địa điểm biểu tượng của phong trào Dân chủ hóa tháng 6 năm 1987.",
        },
      ],
    },
  },
  {
    slug: "gwangjang-market",
    publishedAt: "2026-07-29",
    region: "seoul",
    category: "market",
    nameKo: "광장시장",
    nameEn: "Gwangjang Market",
    nameZh: "广藏市场",
    nameVi: "Chợ Gwangjang",
    summaryKo:
      "종로5가 골목에 자리한 광장시장은 1905년 문을 연 한국 최초의 상설시장, 그러니까 100년 훌쩍 넘은 원조 전통시장이에요. 노릇하게 부친 빈대떡, 한입 사이즈 마약김밥, 서슴없이 파는 육회까지 한 그릇씩 돌면 이미 배가 빵빵. 앤서니 부르댕도 다녀간 서울 미식 성지답게 외국인 관광객 줄이 늘 길어요.",
    summaryEn:
      "Tucked into the alleys near Jongno 5-ga, Gwangjang Market opened in 1905 as Korea's first permanent market — over 120 years and still going strong. One round of crispy bindaetteok, bite-size mayak gimbap, and raw beef yukhoe and you're already stuffed. Anthony Bourdain ate here too, and the line of foreign visitors shows it.",
    summaryZh:
      "藏身于钟路5街巷子里的广藏市场，1905年开业，是韩国第一座常设市场，至今已有120多年历史，是名副其实的元老级传统市场。煎得焦香的绿豆煎饼、一口一个的麻药紫菜包饭，再来一份生拌牛肉，随便吃一圈就已经吃撑。安东尼·波登也曾到访这里，外国游客排队的长度就是最好的证明。",
    summaryVi:
      "Nằm trong các con hẻm gần ga Jongno 5-ga, chợ Gwangjang mở cửa từ năm 1905, là chợ thường trực đầu tiên của Hàn Quốc — hơn 120 năm tuổi mà vẫn sầm uất. Một vòng bindaetteok giòn tan, vài cuộn mayak gimbap nhỏ xinh, thêm đĩa thịt bò sống yukhoe là đã no căng bụng. Anthony Bourdain cũng từng ghé đây, và hàng dài du khách nước ngoài xếp hàng là minh chứng rõ nhất.",
    overviewKo: [
      "광장시장은 1905년 문을 연 한국 최초의 상설시장이에요. 그전까지 한국의 장은 5일장처럼 며칠에 한 번 열리는 임시 장터가 전부였는데, 광장시장이 매일 문을 여는 최초의 사설 상설시장으로 등장하며 유통 문화 자체를 바꿔놨죠. 이름의 유래도 재미있는데, 원래는 청계천의 광교(廣橋)·장교(長橋) 두 다리 이름을 따 '광장(廣長)'이라 지으려 했지만 실제 부지가 배오개(지금의 종로 4~5가)로 옮겨가면서 한자가 '널리 모아 간직한다'는 뜻의 광장(廣藏)으로 바뀌었어요. 한때는 동대문시장이라 불리기도 했지만, 주변 시장들과 구분하려고 1960년대부터 '광장시장'이라는 이름이 굳어졌습니다.",
      "지금은 4만2천㎡ 부지에 상점 5천여 개, 종사자 2만 명이 일하는 서울 최대급 전통시장이에요. 하루 방문객만 6만5천 명 안팎, 주말엔 이보다 더 몰려요. 크게 두 구역으로 나뉘는데, 원단·한복·혼수용품을 파는 포목 구역이 시장의 뿌리이자 여전히 핵심 상권이고, 그 옆 먹자골목이 요즘 외국인 관광객이 몰리는 구역이에요. 1층 실내 통로가 미로처럼 이어져 있어서 지도 앱보다는 그냥 냄새 따라 걷는 게 빠를 때도 많아요.",
      "먹자골목 스테디셀러는 단연 빈대떡(녹두전)이에요. 불려 간 녹두를 즉석에서 갈아 두툼하게 부치는데, 큰 철판 위에서 노릇하게 지글대는 모습 자체가 구경거리죠. 그리고 꼭 먹어봐야 할 게 마약김밥 — 손가락만 한 크기로 만 김밥을 겨자 간장에 찍어 먹는데, 너무 맛있어서 '마약'이란 이름이 붙었다는 얘기가 있어요. 최근엔 어린이·청소년에게 부적절한 이미지를 줄 수 있다는 지적에 '꼬마김밥'이라는 이름으로도 병행 표기되고 있으니 메뉴판에 둘 다 있어도 놀라지 마세요.",
      "고기 좋아한다면 육회 골목도 필수 코스예요. 신선한 생고기를 그 자리에서 채 썰어 참기름·배·달걀노른자와 버무려 내는데, 여러 집이 다닥다닥 붙어 있어서 골목 전체가 육회 전문 구역처럼 느껴져요. 순대·족발 같은 다른 야식 메뉴도 풍부하고, 상인들끼리 좌판이 붙어 있어서 이 집 저 집 옮겨가며 조금씩 맛보는 '시장 투어'가 광장시장의 진짜 재미입니다.",
      "2014년 앤서니 부르댕이 CNN '팔츠 언노운' 촬영차 방문한 뒤로 서울을 대표하는 미식 명소로 국제적 인지도가 확 올라갔어요. 하지만 원래 정체성은 포목 시장이라는 걸 잊으면 안 돼요 — 맞춤 한복부터 이불감, 수의까지 파는 원단 가게들이 시장 뒤편에 여전히 촘촘히 남아 있어서, 먹거리 골목만 보고 나오면 광장시장의 절반만 본 셈이에요.",
      "가는 법은 지하철 1호선 종로5가역 8번 출구가 가장 가깝고, 2·5호선 을지로4가역에서도 도보 이동이 가능해요. 먹자골목은 보통 오전 9시부터 밤 9~10시까지 영업하지만 ⚠️ 포목 구역은 일요일에 대부분 문을 닫으니 원단·한복 쇼핑이 목적이면 평일이나 토요일에 가야 해요. 현금을 선호하는 좌판이 아직 많은 편이라 소액 현금을 넉넉히 챙기고, 주말 점심·저녁 시간대는 통로가 사람으로 꽉 차니 여유 있게 다녀야 합니다.",
    ],
    overviewEn: [
      "Gwangjang Market opened in 1905 as Korea's first permanent market. Before that, Korean markets were mostly periodic — five-day markets that popped up only once every few days — so Gwangjang, opening every single day, changed the whole culture of retail. The name has a fun backstory too: it was originally meant to be named after two Cheonggyecheon bridges, Gwanggyo and Janggyo, written as 'Gwangjang (廣長)' — but when the site moved to Baeogae (today's Jongno 4-5-ga), the hanja shifted to 'Gwangjang (廣藏)', meaning 'widely gathered and stored.' It was once called Dongdaemun Market too, but by the 1960s the name 'Gwangjang Market' had stuck, to distinguish it from neighboring markets.",
      "Today it's one of Seoul's largest traditional markets, spanning 42,000 square meters with roughly 5,000 shops and 20,000 workers. Around 65,000 people visit on a typical day, and even more on weekends. It splits roughly into two zones: the fabric section — selling textiles, hanbok, and wedding trousseau goods — is the market's original core and still its backbone, while the food alley next door is where foreign tourists cluster these days. The indoor ground-floor passages form a genuine maze, and sometimes following the smell of food gets you there faster than a map app.",
      "The undisputed star of the food alley is bindaetteok, a thick mung bean pancake fried fresh on a huge griddle — the sizzling, golden-brown spectacle alone is worth watching. And you have to try mayak gimbap, tiny finger-sized rolls dipped in mustard soy sauce — 'mayak' literally means 'drug,' supposedly because they're addictively good. Lately, out of concern the name sends the wrong message to kids, it's also being labeled 'kkoma gimbap' ('little gimbap') on some menus, so don't be surprised to see both names side by side.",
      "If you're into meat, the yukhoe alley is a must. Fresh raw beef is julienned on the spot and tossed with sesame oil, pear, and egg yolk, and enough stalls sit shoulder-to-shoulder that the whole lane practically becomes a yukhoe district. Sundae (blood sausage) and jokbal (pig's trotters) round out the late-night menu, and hopping stall to stall for small bites — the real market-tour experience — is honestly the best part of Gwangjang.",
      "Anthony Bourdain's 2014 visit for CNN's Parts Unknown put Gwangjang firmly on the international foodie map. But don't forget its original identity — it's still, at heart, a textile market. Fabric shops selling custom hanbok, bedding material, and even burial shrouds are still tightly packed into the back of the market, so if you only hit the food alley, you've really only seen half of Gwangjang.",
      "Exit 8 of Jongno 5-ga Station (Line 1) is the closest stop, and Euljiro 4-ga Station (Lines 2 and 5) is also within walking distance. The food alley generally runs 9 AM to 9-10 PM, but ⚠️ most of the fabric section is closed on Sundays, so plan for a weekday or Saturday if fabric or hanbok shopping is the goal. Plenty of stalls still prefer cash, so carry extra small bills, and the aisles get packed solid during weekend lunch and dinner hours, so give yourself extra time.",
    ],
    overviewZh: [
      "广藏市场1905年开业，是韩国第一座常设市场。在此之前，韩国的集市大多是「五日场」这类每隔几天才开一次的临时市集，广藏市场每天营业，直接改写了整个流通文化。名字的由来也很有意思：原本打算取清溪川上广桥、长桥两座桥名合称「广长（廣長）」，但由于场址后来迁到了培오개（今钟路4~5街），汉字也改成了寓意「广泛聚藏」的「广藏（廣藏）」。这里一度也被称为东大门市场，直到1960年代才为了和周边市场区分而固定叫「广藏市场」。",
      "如今这里占地4.2万平方米，拥有约5000家店铺、2万名从业人员，是首尔规模数一数二的传统市场。日均访客约6.5万人，周末更是人山人海。市场大致分两个区域：卖布料、韩服、嫁妆用品的布庄区是市场的根基，至今仍是核心商圈；旁边的美食巷则是近年外国游客扎堆的地方。一楼室内通道错综复杂如迷宫，有时候跟着香味走反而比看地图App更快找到路。",
      "美食巷的绝对主角是绿豆煎饼——现磨的绿豆糊在大铁板上煎得又厚又焦香，光看那滋滋作响的样子就很有看头。还有一定要尝的麻药紫菜包饭——手指粗细的小卷蘸芥末酱油吃，据说因为太好吃而被冠上「麻药」之名。近来考虑到这个称呼可能给青少年带来不良观感，部分菜单上也并列标注「小不点紫菜包饭」这个名字，看到两种叫法别惊讶。",
      "喜欢吃肉的话，生拌牛肉巷绝对不能错过。新鲜生牛肉现场切丝，拌上香油、梨丝和蛋黄，好几家店紧挨在一起，整条巷子几乎就是生拌牛肉专区。血肠、猪脚等夜宵菜色也很丰富，商户摊位彼此紧挨，一家家串着尝一点，这种「市场巡游」式的吃法才是广藏市场真正的乐趣所在。",
      "2014年安东尼·波登为CNN《未知之旅》来此取景后，广藏市场作为首尔美食地标的国际知名度大涨。但别忘了它本来的身份是布料市场——从定制韩服面料到被褥用料、甚至寿衣，各类布庄至今仍密密麻麻地藏在市场后侧，只逛美食巷等于只看了广藏市场的一半。",
      "交通方面，地铁1号线钟路5街站8号出口最近，2、5号线乙支路4街站也在步行范围内。美食巷一般早上9点营业到晚上9~10点，但⚠️布庄区周日大多歇业，想买布料或韩服要挑平日或周六去。不少摊位仍偏好收现金，建议多备些零钱，周末午餐、晚餐时段通道会挤得水泄不通，最好留足时间慢慢逛。",
    ],
    overviewVi: [
      "Chợ Gwangjang mở cửa năm 1905, là chợ thường trực đầu tiên của Hàn Quốc. Trước đó, các chợ ở Hàn Quốc chủ yếu là chợ phiên — họp vài ngày một lần kiểu 'chợ 5 ngày' — nên việc Gwangjang mở cửa mỗi ngày đã thay đổi hẳn văn hóa buôn bán. Tên gọi cũng có câu chuyện thú vị: ban đầu định đặt theo tên hai cây cầu Gwanggyo và Janggyo trên suối Cheonggyecheon, viết là 'Gwangjang (廣長)', nhưng khi địa điểm dời sang Baeogae (nay là Jongno 4-5-ga), phần chữ Hán đổi thành 'Gwangjang (廣藏)' nghĩa là 'gom góp và cất giữ rộng rãi'. Có thời chợ còn được gọi là chợ Dongdaemun, nhưng từ thập niên 1960 cái tên 'chợ Gwangjang' đã trở thành tên chính thức để phân biệt với các chợ lân cận.",
      "Ngày nay đây là một trong những chợ truyền thống lớn nhất Seoul, rộng 42.000m² với khoảng 5.000 gian hàng và 20.000 người lao động. Mỗi ngày có khoảng 65.000 lượt khách ghé thăm, cuối tuần còn đông hơn. Chợ chia làm hai khu chính: khu vải vóc — bán vải, Hanbok, đồ sính lễ — là gốc rễ và vẫn là trục kinh doanh chính của chợ, còn khu ẩm thực bên cạnh mới là nơi du khách nước ngoài đổ về gần đây. Các lối đi trong nhà tầng một chằng chịt như mê cung, đôi khi cứ đi theo mùi thơm còn nhanh tìm được chỗ hơn là dùng bản đồ.",
      "Ngôi sao không thể tranh cãi của khu ẩm thực là bindaetteok — bánh xèo đậu xanh chiên dày trên chảo lớn, cảnh chiên xèo xèo vàng ruộm đã đủ cuốn hút. Và món nhất định phải thử là mayak gimbap — cuộn gimbap nhỏ cỡ ngón tay chấm nước tương mù tạt, tên gọi 'mayak' nghĩa đen là 'ma túy' vì tương truyền ngon đến mức gây nghiện. Gần đây, do lo ngại cái tên tạo ấn tượng không hay với trẻ em, một số thực đơn còn ghi kèm tên 'kkoma gimbap' (gimbap tí hon), nên đừng ngạc nhiên nếu thấy cả hai tên cùng xuất hiện.",
      "Nếu thích thịt, hẻm yukhoe (thịt bò sống trộn) là điểm không thể bỏ qua. Thịt bò tươi được thái sợi ngay tại chỗ, trộn cùng dầu mè, lê và lòng đỏ trứng, nhiều quán san sát nhau khiến cả con hẻm gần như thành khu chuyên yukhoe. Sundae (dồi huyết) và jokbal (chân giò heo) cũng là những món ăn đêm phong phú khác, và việc la cà từng quán nếm mỗi nơi một chút — kiểu 'tour chợ' đúng nghĩa — mới chính là cái thú vị nhất của Gwangjang.",
      "Chuyến ghé thăm năm 2014 của Anthony Bourdain cho chương trình Parts Unknown của CNN đã đưa Gwangjang lên bản đồ ẩm thực quốc tế. Nhưng đừng quên bản chất ban đầu của chợ vẫn là chợ vải — các cửa hàng bán vải may Hanbok theo yêu cầu, vải chăn ga, thậm chí cả vải liệm vẫn san sát ở phía sau chợ, nên nếu chỉ ghé khu ẩm thực thì coi như mới thấy được một nửa Gwangjang.",
      "Về di chuyển, lối ra số 8 ga Jongno 5-ga (tuyến 1) là gần nhất, ga Euljiro 4-ga (tuyến 2 và 5) cũng trong tầm đi bộ. Khu ẩm thực thường mở cửa từ 9 giờ sáng đến 9-10 giờ tối, nhưng ⚠️ khu vải phần lớn đóng cửa vào Chủ nhật, nên nếu muốn mua vải hay Hanbok thì đi vào ngày thường hoặc thứ Bảy. Nhiều quầy hàng vẫn ưu tiên tiền mặt nên hãy mang theo nhiều tiền lẻ, và giờ trưa, tối cuối tuần lối đi rất đông đúc nên hãy dành thêm thời gian.",
    ],
    tips: {
      ko: [
        "포목 구역은 일요일 대부분 휴무 — 한복·원단 쇼핑은 평일이나 토요일에.",
        "마약김밥은 최근 '꼬마김밥'으로도 표기 — 메뉴판에 두 이름이 같이 있어도 정상이에요.",
        "현금 선호 좌판이 많으니 소액권을 넉넉히 챙기세요.",
        "지하철 1호선 종로5가역 8번 출구가 최단 코스, 2·5호선 을지로4가역도 도보권.",
      ],
      en: [
        "The fabric section is mostly closed on Sundays — go weekday or Saturday for hanbok/textile shopping.",
        "Mayak gimbap is increasingly labeled 'kkoma gimbap' too — seeing both names on a menu is normal.",
        "Many stalls still prefer cash, so carry plenty of small bills.",
        "Exit 8 of Jongno 5-ga Station (Line 1) is the shortest route; Euljiro 4-ga Station (Lines 2/5) also works.",
      ],
      zh: [
        "布庄区周日大多歇业——买韩服、布料请选平日或周六。",
        "麻药紫菜包饭现在也常标为「小不点紫菜包饭」——菜单上两个名字并列很正常。",
        "不少摊位偏好收现金，建议多备零钱。",
        "地铁1号线钟路5街站8号出口最近，2、5号线乙支路4街站也在步行范围。",
      ],
      vi: [
        "Khu vải phần lớn đóng cửa Chủ nhật — muốn mua Hanbok/vải thì đi ngày thường hoặc thứ Bảy.",
        "Mayak gimbap giờ cũng hay được ghi là 'kkoma gimbap' — thấy cả hai tên trên thực đơn là chuyện bình thường.",
        "Nhiều quầy hàng vẫn ưu tiên tiền mặt, nên mang theo nhiều tiền lẻ.",
        "Lối ra số 8 ga Jongno 5-ga (tuyến 1) là gần nhất, ga Euljiro 4-ga (tuyến 2/5) cũng trong tầm đi bộ.",
      ],
    },
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/Gwangjang_Market%2C_Seoul_01.jpg/1280px-Gwangjang_Market%2C_Seoul_01.jpg",
      alt: "광장시장 전통시장 골목 — Gwangjang Market alley, Seoul",
      license: "CC0",
      credit: "Wikimedia Commons / Bgag",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Gwangjang_Market,_Seoul_01.jpg",
    },
    lat: 37.5701,
    lng: 126.9996,
    addressKo: "서울특별시 종로구 창경궁로 88",
    addressEn: "88 Changgyeonggung-ro, Jongno-gu, Seoul",
    tags: {
      ko: ["광장시장", "빈대떡", "마약김밥", "육회", "종로 전통시장"],
      en: ["Gwangjang Market", "bindaetteok", "mayak gimbap", "yukhoe", "Jongno traditional market"],
      zh: ["广藏市场", "绿豆煎饼", "麻药紫菜包饭", "生拌牛肉", "钟路传统市场"],
      vi: ["chợ Gwangjang", "bindaetteok", "mayak gimbap", "yukhoe", "chợ truyền thống Jongno"],
    },
    faq: {
      ko: [
        {
          q: "광장시장은 언제 문을 열었나요?",
          a: "1905년 문을 연 한국 최초의 상설시장으로, 100년 넘는 역사를 자랑합니다. 원래는 원단·한복을 파는 포목시장으로 시작해 지금은 먹자골목으로 더 유명해졌어요.",
        },
        {
          q: "광장시장 가는 법은?",
          a: "지하철 1호선 종로5가역 8번 출구가 가장 가깝고, 2·5호선 을지로4가역에서도 도보로 이동할 수 있습니다.",
        },
        {
          q: "광장시장에서 꼭 먹어야 할 음식은?",
          a: "빈대떡(녹두전), 마약김밥, 육회가 3대장이에요. 마약김밥은 최근 '꼬마김밥'으로도 표기되니 메뉴판에 두 이름이 함께 있어도 놀라지 마세요.",
        },
      ],
      en: [
        {
          q: "When did Gwangjang Market open?",
          a: "It opened in 1905 as Korea's first permanent market and has over 120 years of history. It started as a textile and hanbok market and is now equally famous for its food alley.",
        },
        {
          q: "How do you get to Gwangjang Market?",
          a: "Exit 8 of Jongno 5-ga Station (Subway Line 1) is closest, and Euljiro 4-ga Station (Lines 2 and 5) is also within walking distance.",
        },
        {
          q: "What should you eat at Gwangjang Market?",
          a: "Bindaetteok (mung bean pancake), mayak gimbap, and yukhoe (raw beef) are the big three. Mayak gimbap is increasingly labeled 'kkoma gimbap' too, so don't be surprised to see both names on a menu.",
        },
      ],
      zh: [
        {
          q: "广藏市场是什么时候开业的？",
          a: "1905年开业，是韩国第一座常设市场，至今已有120多年历史。最初是卖布料、韩服的布庄市场，如今美食巷同样出名。",
        },
        {
          q: "广藏市场怎么去？",
          a: "地铁1号线钟路5街站8号出口最近，2、5号线乙支路4街站也在步行范围内。",
        },
        {
          q: "广藏市场必吃什么？",
          a: "绿豆煎饼、麻药紫菜包饭、生拌牛肉是三大招牌。麻药紫菜包饭现在也常标注为「小不点紫菜包饭」，菜单上两个名字并列别惊讶。",
        },
      ],
      vi: [
        {
          q: "Chợ Gwangjang mở cửa từ khi nào?",
          a: "Chợ mở cửa năm 1905, là chợ thường trực đầu tiên của Hàn Quốc, với hơn 120 năm lịch sử. Ban đầu là chợ vải, Hanbok, nay nổi tiếng không kém với khu ẩm thực.",
        },
        {
          q: "Đi đến chợ Gwangjang bằng cách nào?",
          a: "Lối ra số 8 ga Jongno 5-ga (tuyến 1) là gần nhất, ga Euljiro 4-ga (tuyến 2 và 5) cũng trong tầm đi bộ.",
        },
        {
          q: "Ở chợ Gwangjang nên ăn gì?",
          a: "Bindaetteok (bánh xèo đậu xanh), mayak gimbap và yukhoe (thịt bò sống) là ba món chủ lực. Mayak gimbap giờ cũng hay được ghi là 'kkoma gimbap', nên thấy cả hai tên trên thực đơn đừng ngạc nhiên.",
        },
      ],
    },
  },
  {
    slug: "bukhansan",
    publishedAt: "2026-07-31",
    region: "seoul",
    category: "nature",
    nameKo: "북한산",
    nameEn: "Bukhansan",
    nameZh: "北汉山",
    nameVi: "Núi Bukhansan",
    summaryKo:
      "서울 한복판에 우뚝 선 836.5m 국립공원, 지하철 타고 30분이면 백운대 등산로 초입이에요. 기네스 세계기록에 오른 '면적 대비 최다 방문 국립공원'답게 주말엔 사람이 몰리지만, 인수봉 클라이밍부터 11.6km 북한산성 성곽길까지 도심 속 산이 줄 수 있는 재미는 다 있어요.",
    summaryEn:
      "An 836.5m national park in the middle of Seoul — hop on the subway and you're at the trailhead in 30 minutes. It's a Guinness World Record holder for most visitors per unit area, with everything from Insubong rock climbing to the 11.6km Bukhansanseong fortress wall packed into one city mountain.",
    summaryZh:
      "耸立在首尔市中心的836.5米国立公园，坐地铁30分钟就能到登山口。这里是吉尼斯世界纪录认证的「单位面积访客最多国立公园」，从仁寿峰攀岩到11.6公里的北汉山城城墙，一座城市山峰能给的乐趣这里全都有。",
    summaryVi:
      "Công viên quốc gia cao 836,5m ngay giữa lòng Seoul — chỉ cần 30 phút tàu điện là tới chân núi. Đây là chủ nhân Kỷ lục Guinness 'công viên quốc gia đông khách nhất trên mỗi đơn vị diện tích', từ leo vách đá Insubong đến bức tường thành Bukhansanseong dài 11,6km, ngọn núi giữa thành phố này có đủ mọi thú vui.",
    overviewKo: [
      "북한산은 서울 강북구·도봉구·은평구·성북구·종로구와 경기도 고양시·양주시·의정부시에 걸쳐 있는 836.5m 산이에요. 원래 이름은 봉우리 세 개가 뿔처럼 솟았다고 해서 '삼각산(三角山)'이었는데, 1983년 4월 2일 우리나라 15번째 국립공원으로 지정되면서 지금 이름으로 자리 잡았어요. 서울시와 경기도에 걸친 면적이 79.92㎢밖에 안 되는데 연간 방문객은 약 500만 명 — 기네스 세계기록에 '단위 면적당 가장 많은 방문객이 찾는 국립공원'으로 등재될 정도로 압도적인 인기예요. 지하철로 30분이면 정상 코스 들머리까지 닿는 '도심 속 산'이라는 점이 이 기록의 비결이죠.",
      "정상엔 세 봉우리가 나란히 솟아 있어요. 최고봉인 백운대(836.5m), 클라이머들의 성지인 인수봉(810.5m), 그리고 만경대(799.5m) — 이 세 봉우리가 뿔처럼 보인다고 해서 옛날엔 삼각산이라 불렀던 거예요. 인수봉은 화강암 절벽이 깎아지른 듯 서 있어서 국내외 클라이머들이 로프 하나 메고 도전하는 곳으로 유명하고, 백운대는 등산객이라면 누구나 한 번은 밟아보고 싶어 하는 서울 등산의 정점이에요.",
      "백운대 오르는 코스 중 초보자에게 제일 무난한 건 우이동 코스예요. 우이신설선 북한산우이역에서 걸어 들어가 도선사를 지나 하루재, 백운산장을 거쳐 백운대 암문까지 오르면 정상까지 300m 남짓 — 총 거리 3.8km, 2~3시간이면 왕복 가능해요. ⚠️ 도선사를 지나면서부터는 경사가 확 가팔라지고 마지막 구간은 쇠줄(로프)을 붙잡고 올라야 하는 암벽 구간이라 장갑 하나 챙기면 훨씬 수월해요. 백운탐방지원센터(운영 09:00~17:00)에서 등산화·스틱·아이젠·무릎보호대까지 무료로 빌려주니 장비 없이 즉흥적으로 가도 괜찮아요.",
      "북한산성도 꼭 챙겨봐야 할 포인트예요. 1711년(숙종 37년) 완공된 이 산성은 봉우리와 능선을 따라 약 11.6km나 이어지는 조선시대 방어시설로, 유사시 왕이 피신할 임시 궁궐(행궁)까지 갖춘 진짜 요새였어요. 대남문·대성문·대동문 같은 성문들이 곳곳에 남아 있고, 1968년 국가 사적으로 지정됐어요. 성곽 능선을 따라 걷는 코스는 백운대 직등 코스보다 완만해서 역사 산책하듯 즐기기 좋습니다.",
      "가는 법은 목적지에 따라 갈려요. 우이동·백운대 코스는 우이신설선 북한산우이역에서 도보, 북한산성 코스는 지하철 3호선 구파발역에서 북한산성입구행 버스를 타면 돼요. 주말·공휴일엔 특히 백운대 정상이 인산인해라 사람 없는 사진을 원한다면 평일 새벽 출발이 답이고, 봄 진달래·가을 단풍철엔 등산로 자체가 몸살을 앓을 정도로 붐비니 각오하세요. 도선사·화계사 같은 천년 고찰도 코스 중간에 있어서 등산과 사찰 탐방을 같이 즐길 수 있는 것도 매력이에요.",
    ],
    overviewEn: [
      "Bukhansan is an 836.5m mountain straddling five Seoul districts (Gangbuk, Dobong, Eunpyeong, Seongbuk, Jongno) and three Gyeonggi cities (Goyang, Yangju, Uijeongbu). It used to go by 'Samgaksan' — 'three-horned mountain' — for its trio of jagged peaks, until it became Korea's 15th national park on April 2, 1983, and the name Bukhansan stuck. The park covers just 79.92 km² across Seoul and Gyeonggi, yet pulls in roughly 5 million visitors a year — enough to land it in the Guinness World Records as the most-visited national park per unit area on the planet. The secret? A subway ride puts you at a trailhead in about 30 minutes, making this a genuine mountain in the middle of a megacity.",
      "Three peaks crown the summit. Baegundae (836.5m) is the highest, Insubong (810.5m) is a rock-climbing mecca, and Mangyeongdae (799.5m) rounds out the trio — together they're the 'three horns' that gave the mountain its old name. Insubong's sheer granite face draws climbers from Korea and abroad who rope up and go vertical, while Baegundae is the bucket-list summit every Seoul hiker eventually checks off.",
      "For beginners, the easiest way up Baegundae is the Ui-dong route. Walk in from Bukhansan Ui Station (Ui LRT line), pass Doseonsa Temple, cross Harujae ridge and Baegunsanjang shelter, and you'll reach Baegundae Amdun (the fortress gate) with just 300m left to the top — 3.8km total, doable round-trip in 2–3 hours. ⚠️ Past Doseonsa the slope kicks up hard, and the final stretch is a rock scramble where you'll be gripping steel ropes — bring gloves if you can. The Baegun Visitor Support Center (open 9am–5pm) even rents out hiking boots, poles, crampons, and knee pads for free, so you can show up gear-free and still make it work.",
      "Don't skip Bukhansanseong Fortress. Completed in 1711 under King Sukjong, this Joseon-era defense structure runs about 11.6km along the ridgelines, complete with a temporary royal palace for the king to flee to in a crisis — a real fortress, not just a wall. Gates like Daenammun, Daeseongmun, and Daedongmun still stand, and the whole site was designated a national historic site in 1968. The ridge-following fortress trail is gentler than the direct Baegundae push, so it's a great option if you want a history walk over a summit grind.",
      "How you get there depends on where you're headed. For the Ui-dong/Baegundae route, walk in from Bukhansan Ui Station; for the fortress route, take Subway Line 3 to Gupabal Station and catch a bus bound for Bukhansanseong Entrance. Weekends and holidays get packed solid at the Baegundae summit, so aim for a weekday dawn start if you want empty-trail photos, and brace for serious crowds during spring azalea season and fall foliage. Century-old temples like Doseonsa and Hwagyesa sit right along the routes too, so you can pair hiking with temple-hopping in a single trip.",
    ],
    overviewZh: [
      "北汉山是一座海拔836.5米的山峰，横跨首尔的江北区、道峰区、恩平区、城北区、钟路区，以及京畿道高阳市、杨州市、议政府市。它原名「三角山」，因三座山峰如犄角般耸立而得名，直到1983年4月2日被指定为韩国第15座国立公园后，「北汉山」这个名字才固定下来。公园横跨首尔与京畿道，面积仅79.92平方公里，年访客量却高达约500万人次——因此被吉尼斯世界纪录认证为「单位面积访客量最多的国立公园」。秘诀就在于坐地铁大约30分钟就能到登山口，这是一座名副其实「藏在大都市里的山」。",
      "山顶并立三座山峰。最高峰白云台（836.5米）、攀岩者的圣地仁寿峰（810.5米），再加上万景台（799.5米）——三峰如角，正是「三角山」这个旧名的由来。仁寿峰花岗岩峭壁近乎垂直，是国内外攀岩爱好者系上绳索挑战的知名地点，而白云台则是几乎每个首尔登山客都想踩点一次的终极目标。",
      "初学者登白云台最轻松的路线是牛耳洞路线。从牛耳新设线北汉山牛耳站步行进入，经过道诜寺、Harujae山脊、白云山庄，到达白云台暗门后离山顶只剩约300米——全程3.8公里，2~3小时即可往返。⚠️ 过了道诜寺坡度骤然变陡，最后一段要拉着钢索攀岩，建议带副手套会轻松不少。白云探访支援中心（营业时间9:00~17:00）还免费出借登山鞋、登山杖、冰爪、护膝，所以就算没装备说走就走也没问题。",
      "北汉山城也绝对值得一逛。这座建于1711年（朝鲜肃宗三十七年）的朝鲜时代防御工事，沿山脊蜿蜒约11.6公里，甚至还配有供国王危急时避难的行宫——是货真价实的要塞而非单纯城墙。大南门、大成门、大东门等城门至今犹存，1968年被指定为国家史迹。沿城墙山脊走的路线比直攻白云台平缓许多，很适合把它当成一场历史漫步。",
      "交通方式因目的地而异。走牛耳洞·白云台路线，从北汉山牛耳站步行进入；走北汉山城路线，则搭地铁3号线到旧把拨站，转乘开往北汉山城入口的巴士。周末节假日白云台顶几乎人挤人，想拍空景就选平日凌晨出发；春天杜鹃花季、秋天红叶季登山道更是热闹到爆，请做好心理准备。道诜寺、华溪寺这类千年古刹就在沿途，登山顺路逛古寺也是这里的一大魅力。",
    ],
    overviewVi: [
      "Bukhansan là ngọn núi cao 836,5m trải dài qua 5 quận của Seoul (Gangbuk, Dobong, Eunpyeong, Seongbuk, Jongno) và 3 thành phố của tỉnh Gyeonggi (Goyang, Yangju, Uijeongbu). Trước đây núi có tên 'Samgaksan' — nghĩa là 'núi ba sừng' — vì ba đỉnh núi nhọn hoắt như sừng, cho đến khi trở thành công viên quốc gia thứ 15 của Hàn Quốc vào ngày 2/4/1983 thì cái tên Bukhansan mới chính thức gắn liền. Công viên chỉ rộng 79,92 km² trải qua Seoul và Gyeonggi, nhưng đón khoảng 5 triệu lượt khách mỗi năm — đủ để được Kỷ lục Guinness Thế giới công nhận là 'công viên quốc gia có lượng khách ghé thăm trên mỗi đơn vị diện tích nhiều nhất'. Bí quyết nằm ở chỗ chỉ cần đi tàu điện ngầm khoảng 30 phút là tới chân núi — một ngọn núi thực thụ nằm ngay giữa lòng siêu đô thị.",
      "Trên đỉnh có ba ngọn núi sừng sững cạnh nhau. Cao nhất là Baegundae (836,5m), thánh địa leo núi đá Insubong (810,5m), và Mangyeongdae (799,5m) khép lại bộ ba — chính ba 'chiếc sừng' này đã đặt tên cho ngọn núi thời xưa. Vách đá granite dựng đứng của Insubong là nơi dân leo núi trong và ngoài nước buộc dây thừng chinh phục, còn Baegundae là đỉnh núi mà hầu như người leo núi nào ở Seoul cũng muốn chinh phục một lần.",
      "Với người mới bắt đầu, cung đường dễ nhất để lên Baegundae là cung Ui-dong. Đi bộ từ ga Bukhansan Ui (tuyến LRT Ui), qua chùa Doseonsa, băng qua đỉnh Harujae, trạm nghỉ Baegunsanjang, đến cổng đá Baegundae Amdun là chỉ còn khoảng 300m lên đỉnh — tổng quãng đường 3,8km, đi khứ hồi trong 2–3 tiếng là vừa. ⚠️ Qua khỏi chùa Doseonsa độ dốc tăng vọt, đoạn cuối phải bám dây cáp thép leo qua đá, nên mang theo găng tay sẽ dễ chịu hơn nhiều. Trung tâm hỗ trợ tham quan Baegun (mở cửa 9h–17h) còn cho thuê miễn phí giày leo núi, gậy, đế chống trượt và bảo vệ đầu gối, nên dù không có đồ nghề vẫn có thể đi ngẫu hứng.",
      "Đừng bỏ qua Pháo đài Bukhansanseong. Hoàn thành năm 1711 dưới thời vua Sukjong, công trình phòng thủ thời Joseon này chạy dọc theo các đỉnh núi dài khoảng 11,6km, thậm chí còn có cả cung tạm để vua lánh nạn khi có biến — một pháo đài đúng nghĩa chứ không chỉ là bức tường. Các cổng như Daenammun, Daeseongmun, Daedongmun vẫn còn tồn tại, và toàn bộ khu vực được công nhận Di tích Lịch sử Quốc gia năm 1968. Cung đường đi theo pháo đài men theo sườn núi thoải hơn nhiều so với cung leo thẳng lên Baegundae, rất hợp nếu bạn muốn một chuyến đi dạo lịch sử hơn là một cuộc chinh phục đỉnh núi.",
      "Cách di chuyển tùy thuộc điểm đến. Với cung Ui-dong/Baegundae, đi bộ từ ga Bukhansan Ui; với cung pháo đài, đi tàu điện tuyến 3 đến ga Gupabal rồi bắt xe buýt hướng cổng vào Bukhansanseong. Cuối tuần và ngày lễ đỉnh Baegundae đông nghẹt người, nên muốn chụp ảnh vắng người thì xuất phát lúc rạng sáng ngày thường, và hãy chuẩn bị tinh thần đông đúc vào mùa hoa đỗ quyên mùa xuân hay mùa lá đỏ mùa thu. Những ngôi chùa cổ hàng nghìn năm như Doseonsa, Hwagyesa nằm ngay trên các cung đường, nên vừa leo núi vừa ghé thăm chùa cũng là một điểm cộng lớn.",
    ],
    tips: {
      ko: [
        "초보자는 우이동 코스(북한산우이역 → 도선사 → 백운대, 3.8km·2~3시간)가 제일 무난해요.",
        "백운탐방지원센터에서 등산화·스틱·아이젠까지 무료 대여(09:00~17:00) — 장비 없이도 오케이.",
        "도선사 지나면 급경사 로프 구간 시작 — 장갑 하나면 훨씬 수월해요.",
        "주말·공휴일 백운대는 인산인해 — 사람 없는 사진 원하면 평일 새벽 출발.",
        "북한산성 코스 갈 땐 3호선 구파발역에서 북한산성입구행 버스 이용.",
      ],
      en: [
        "Beginners should take the Ui-dong route (Bukhansan Ui Station → Doseonsa → Baegundae, 3.8km, 2–3 hrs).",
        "The Baegun Visitor Support Center rents boots, poles, and crampons free (9am–5pm) — no gear, no problem.",
        "Past Doseonsa the trail turns into a steep rope-scramble — bring gloves if you've got them.",
        "Baegundae summit is packed on weekends and holidays — go at weekday dawn for empty-trail shots.",
        "Heading for the fortress route? Take Line 3 to Gupabal Station and catch a bus to Bukhansanseong Entrance.",
      ],
      zh: [
        "新手推荐牛耳洞路线（北汉山牛耳站→道诜寺→白云台，3.8公里，2~3小时）。",
        "白云探访支援中心免费出借登山鞋、登山杖、冰爪（9:00~17:00）——没装备也能说走就走。",
        "过了道诜寺就是陡坡拉绳路段——带副手套会轻松不少。",
        "周末节假日白云台人挤人——想拍空景就选平日凌晨出发。",
        "走北汉山城路线可搭地铁3号线到旧把拨站，转乘开往北汉山城入口的巴士。",
      ],
      vi: [
        "Người mới nên đi cung Ui-dong (ga Bukhansan Ui → chùa Doseonsa → Baegundae, 3,8km, 2–3 tiếng).",
        "Trung tâm hỗ trợ Baegun cho thuê miễn phí giày, gậy, đế chống trượt (9h–17h) — không có đồ vẫn đi được.",
        "Qua chùa Doseonsa là đoạn dốc phải bám dây cáp — mang găng tay sẽ dễ hơn nhiều.",
        "Đỉnh Baegundae đông nghẹt cuối tuần và ngày lễ — muốn ảnh vắng người thì xuất phát rạng sáng ngày thường.",
        "Đi cung pháo đài thì bắt tàu tuyến 3 đến ga Gupabal rồi đổi xe buýt hướng cổng Bukhansanseong.",
      ],
    },
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Baegundae_Terrace_of_Bukhansan_in_Spring_in_Korea.jpg/1280px-Baegundae_Terrace_of_Bukhansan_in_Spring_in_Korea.jpg",
      alt: "북한산 백운대 — Baegundae peak of Bukhansan National Park in spring",
      license: "CC0 1.0",
      credit: "Wikimedia Commons / Jo Hanshin",
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Baegundae_Terrace_of_Bukhansan_in_Spring_in_Korea.jpg",
    },
    lat: 37.6633,
    lng: 127.0124,
    addressKo: "서울특별시 강북구 우이동",
    addressEn: "Ui-dong, Gangbuk-gu, Seoul",
    tags: {
      ko: ["북한산", "백운대", "북한산성", "서울 등산", "인수봉"],
      en: ["Bukhansan", "Baegundae", "Bukhansanseong", "Seoul hiking", "Insubong"],
      zh: ["北汉山", "白云台", "北汉山城", "首尔登山", "仁寿峰"],
      vi: ["Bukhansan", "Baegundae", "Bukhansanseong", "leo núi Seoul", "Insubong"],
    },
    faq: {
      ko: [
        {
          q: "북한산 백운대 등산 코스와 소요시간은 어떻게 되나요?",
          a: "초보자에게 가장 무난한 코스는 우이동 코스예요. 북한산우이역에서 출발해 도선사~하루재~백운산장을 지나 백운대 암문까지 오르면 정상까지 300m 정도 남는데, 총 거리 3.8km로 왕복 2~3시간이면 충분합니다.",
        },
        {
          q: "등산 장비가 없어도 갈 수 있나요?",
          a: "네, 백운탐방지원센터(09:00~17:00)에서 등산화·스틱·아이젠·무릎보호대를 무료로 빌려줍니다. 다만 도선사를 지나면서부터는 로프를 잡고 오르는 급경사 구간이 시작되니 장갑 정도는 챙기는 게 좋아요.",
        },
        {
          q: "북한산성은 어떻게 가나요?",
          a: "지하철 3호선 구파발역에서 북한산성입구행 버스를 타면 됩니다. 1711년 완공된 성곽이 약 11.6km 이어지며 1968년 국가 사적으로 지정됐어요. 백운대 직등 코스보다 완만해서 역사 산책하듯 즐기기 좋습니다.",
        },
      ],
      en: [
        {
          q: "What's the Baegundae hiking route and how long does it take?",
          a: "The easiest route for beginners is the Ui-dong course. Starting from Bukhansan Ui Station, you pass Doseonsa Temple, Harujae ridge, and Baegunsanjang shelter before reaching Baegundae Amdun gate, just 300m from the summit — 3.8km total, doable round-trip in 2–3 hours.",
        },
        {
          q: "Can I hike without my own gear?",
          a: "Yes — the Baegun Visitor Support Center (open 9am–5pm) rents hiking boots, poles, crampons, and knee pads for free. Just note that past Doseonsa the trail gets steep and rope-assisted, so gloves are a good idea.",
        },
        {
          q: "How do I get to Bukhansanseong Fortress?",
          a: "Take Subway Line 3 to Gupabal Station and catch a bus bound for Bukhansanseong Entrance. Completed in 1711, the fortress wall runs about 11.6km and was designated a national historic site in 1968. It's a gentler walk than the direct Baegundae push, great for a history-focused visit.",
        },
      ],
      zh: [
        {
          q: "北汉山白云台登山路线和所需时间是？",
          a: "新手最推荐牛耳洞路线。从北汉山牛耳站出发，经过道诜寺、Harujae山脊、白云山庄，到达白云台暗门后离山顶约300米——全程3.8公里，往返2~3小时足够。",
        },
        {
          q: "没有登山装备也能去吗？",
          a: "可以，白云探访支援中心（9:00~17:00）免费出借登山鞋、登山杖、冰爪、护膝。不过过了道诜寺开始是需要拉绳攀爬的陡坡路段，建议带副手套。",
        },
        {
          q: "北汉山城怎么去？",
          a: "搭地铁3号线到旧把拨站，转乘开往北汉山城入口的巴士即可。这座1711年完工的城墙约长11.6公里，1968年被指定为国家史迹，比直攻白云台的路线平缓，很适合当作历史漫步路线。",
        },
      ],
      vi: [
        {
          q: "Cung đường leo Baegundae và thời gian di chuyển thế nào?",
          a: "Cung dễ nhất cho người mới là cung Ui-dong. Xuất phát từ ga Bukhansan Ui, qua chùa Doseonsa, đỉnh Harujae, trạm nghỉ Baegunsanjang rồi đến cổng đá Baegundae Amdun chỉ còn cách đỉnh khoảng 300m — tổng 3,8km, đi khứ hồi trong 2–3 tiếng là đủ.",
        },
        {
          q: "Không có đồ leo núi thì có đi được không?",
          a: "Được, Trung tâm hỗ trợ tham quan Baegun (mở cửa 9h–17h) cho thuê miễn phí giày leo núi, gậy, đế chống trượt và bảo vệ đầu gối. Chỉ cần lưu ý qua khỏi chùa Doseonsa là đoạn dốc phải bám dây cáp, nên mang theo găng tay.",
        },
        {
          q: "Đi đến Pháo đài Bukhansanseong bằng cách nào?",
          a: "Đi tàu điện tuyến 3 đến ga Gupabal rồi bắt xe buýt hướng cổng vào Bukhansanseong. Bức tường thành hoàn thành năm 1711 dài khoảng 11,6km và được công nhận Di tích Lịch sử Quốc gia năm 1968. Đây là cung đường thoải hơn nhiều so với leo thẳng lên Baegundae, rất hợp để đi dạo tìm hiểu lịch sử.",
        },
      ],
    },
  },
  {
    slug: "lotte-world-tower",
    publishedAt: "2026-08-02",
    region: "seoul",
    category: "landmark",
    nameKo: "롯데월드타워",
    nameEn: "Lotte World Tower",
    nameZh: "乐天世界大厦",
    nameVi: "Tháp Lotte World",
    summaryKo:
      "555m, 대한민국에서 제일 높은 건물이 여기예요. 117~123층 서울스카이 전망대에 서면 서울이 발밑에 통째로 깔리고, 118층 유리바닥은 기네스 인증까지 받은 스릴 포인트. 잠실 한복판이라 롯데월드몰·아쿠아리움까지 한 번에 도장 깨기 가능해요.",
    summaryEn:
      "At 555m, this is Korea's tallest building, full stop. Ride up to the Seoul Sky observatory (117F-123F) and the whole city spreads out below you — the 118F glass floor is Guinness-certified for a reason. Bonus: Lotte World Mall and the aquarium are right downstairs in Jamsil.",
    summaryZh:
      "555米高，韩国第一高楼就是它。117到123层的首尔天空观景台一站上去，整座首尔就铺在脚下，118层的透明玻璃地板还拿到了吉尼斯认证，刺激感拉满。就在蚕室正中心，乐天世界购物中心和水族馆顺路全部打卡。",
    summaryVi:
      "Cao 555m, đây là tòa nhà cao nhất Hàn Quốc, khỏi bàn cãi. Lên đài quan sát Seoul Sky (tầng 117-123) là cả thành phố trải ra dưới chân, sàn kính tầng 118 còn được Guinness công nhận. Ngay giữa Jamsil nên tiện ghé luôn Lotte World Mall và thủy cung.",
    overviewKo: [
      "롯데월드타워는 서울 송파구 잠실에 선 지상 123층, 높이 555m 초고층 빌딩이에요. 2016년 골조가 완공되고 2017년 4월 정식 개장했는데, 오픈 당시부터 지금까지 대한민국에서 가장 높은 건물 타이틀을 굳건히 지키고 있어요. 설계는 미국 건축사무소 KPF(콘 페더슨 폭스)가 맡았고, 붓·도자기처럼 위로 갈수록 살짝 좁아지는 실루엣은 한국 전통 도자기와 서예 붓 곡선에서 영감을 받았다고 해요. 잠실 어디서든 고개만 들면 보이는 통에 사실상 서울 동남권의 새 랜드마크로 자리 잡았죠.",
      "전망대는 '서울스카이'라는 이름으로 117층부터 123층까지 이어져요. 지하 2층·지하 1층에서 전망대까지는 오티스가 만든 더블데크 엘리베이터 '스카이셔틀'을 타는데, 분속 600m(초속 10m)로 딱 1분 만에 117층까지 쏘아 올려줘요. 이 1분이 은근 볼거리인 게, 문이 닫히면 사방 벽이 올레드 화면으로 바뀌면서 경복궁·국회의사당·잠실야구장 같은 서울 명소를 스쳐 지나가는 가상 여행 영상이 나와요 — 귀 먹먹해질 틈도 없이 도착하는 셈이죠.",
      "118층의 하이라이트는 스카이데크라는 통유리 바닥이에요. 45mm 두께 강화 접합유리로 만들어져서 ㎡당 1톤까지 견디고, 동시에 222명이 올라가도 끄떡없대요. 이게 '세계에서 가장 높은 유리바닥 전망대'로 기네스 세계기록에 등재됐을 정도니, 발밑으로 478m 아래가 훤히 보이는 그 아찔함은 직접 서봐야 알 수 있어요. 남산·한강 방향과 올림픽공원 방향 두 군데에 유리바닥이 있으니 두 쪽 다 밟아보는 걸 추천. 120층엔 야외로 나가는 스카이테라스가 있고, 최상층인 123층엔 서울에서 제일 높은 라운지 바 '123라운지'가 있어서 야경 보며 한잔하기도 좋아요.",
      "⚠️ 입장료는 은근 헷갈리는 부분인데, 2026년 4월 기준 서울스카이 전망대 입장료는 성인 약 33,000원이에요. 대기 없이 바로 올라가고 싶으면 전 연령 동일 요금 약 50,000원짜리 패스트패스가 있는데, 이건 온라인 예매가 안 되고 방문 당일 현장 매표소에서만 살 수 있어요. 일반 티켓은 공식 홈페이지나 인터파크 같은 예매처에서 미리 사면 현장 줄을 덜 수 있고요. 노을부터 야경까지 다 보고 싶으면 일몰 1시간 전쯤 도착하는 게 가장 만족도 높은 타이밍입니다.",
      "타워 하나로 끝나는 게 아니라 아래층 전체가 놀거리예요. 저층부엔 롯데월드몰(쇼핑·시네마)과 세계 최대급 실내 아쿠아리움인 롯데월드 아쿠아리움이 있고, 타워 상층부엔 6성급 호텔 시그니엘 서울과 롯데콘서트홀도 들어서 있어요. 가는 법은 지하철 2·8호선 잠실역 1·2번 출구 또는 9호선·2호선 종합운동장역이 가까운데, 롯데월드몰과 지하로 바로 연결돼 있어서 비 오는 날도 걱정 없어요.",
    ],
    overviewEn: [
      "Lotte World Tower is a 123-story, 555m skyscraper standing in Jamsil, Songpa-gu, Seoul. The structure topped out in 2016 and fully opened in April 2017, and it's held onto the title of Korea's tallest building ever since. The design came from the American firm KPF (Kohn Pedersen Fox), and the silhouette — tapering gently as it rises, like a brush stroke — was inspired by traditional Korean ceramics and calligraphy. You can spot it from almost anywhere in Jamsil, and it's essentially become the new landmark for southeastern Seoul.",
      "The observatory, branded 'Seoul Sky,' spans floors 117 to 123. From B2/B1 you ride Otis's double-deck 'Sky Shuttle' elevator, which covers 600m per minute (10m/s) and gets you to the 117th floor in roughly a minute flat. That minute is a mini-attraction on its own — once the doors close, the walls turn into OLED screens playing a virtual tour past Seoul landmarks like Gyeongbokgung, the National Assembly, and Jamsil Stadium, so you barely notice the ride.",
      "The 118th floor's headline act is the Sky Deck, a glass floor made of 45mm laminated tempered glass rated to hold a ton per square meter — up to 222 people at once. It's Guinness-certified as the world's highest glass-floor observatory, and standing on it with 478m of open air below is a rush you really need to feel in person. There are glass panels facing both the Namsan/Han River side and the Olympic Park side, so it's worth stepping on both. Floor 120 has the open-air Sky Terrace, and the top floor, 123, holds '123 Lounge,' Seoul's highest bar — great for a drink with the night skyline.",
      "⚠️ Admission pricing trips people up: as of April 2026, adult entry to the Seoul Sky observatory runs about ₩33,000. If you'd rather skip the line entirely, there's a flat-rate ₩50,000 Fast Pass for any age — but it can't be booked online, only bought same-day at the on-site ticket counter. Regular tickets bought in advance through the official site or platforms like Interpark cut down your wait at the gate. If you want both dusk and night lights in one visit, arriving about an hour before sunset is the sweet spot.",
      "The tower is just the centerpiece — the whole complex is a destination. The lower floors hold Lotte World Mall (shopping, cinema) and Lotte World Aquarium, one of the world's largest indoor aquariums, while the upper floors house the 6-star Signiel Seoul hotel and Lotte Concert Hall. To get there, take Subway Lines 2/8 to Jamsil Station Exits 1/2, or Lines 2/9 to Sports Complex Station — both connect underground straight into Lotte World Mall, so rain isn't a problem.",
    ],
    overviewZh: [
      "乐天世界大厦是坐落于首尔松坡区蚕室、地上123层、高555米的摩天大楼。主体结构2016年封顶，2017年4月正式开幕，自开业以来一直稳坐韩国第一高楼的宝座。设计出自美国建筑事务所KPF（Kohn Pedersen Fox）之手，塔身向上逐渐收窄的曲线，据说灵感来自韩国传统陶瓷与书法毛笔的线条。在蚕室一带几乎抬头就能看到它，如今已成为首尔东南部的新地标。",
      "观景台名为「首尔天空」，横跨117层到123层。从地下2层、地下1层出发，乘坐奥的斯打造的双层轿厢电梯「Sky Shuttle」，以分速600米（秒速10米）的速度，约1分钟就能直达117层。这1分钟本身就是个小节目——电梯门一关，四周墙壁瞬间变成OLED屏幕，播放掠过景福宫、国会议事堂、蚕室棒球场等首尔地标的虚拟旅程，几乎感觉不到耳压变化就已经到站。",
      "118层的重头戏是名为Sky Deck的透明玻璃地板，由45毫米厚的强化夹层玻璃制成，每平方米可承重1吨，同时222人站上去也没问题。它被吉尼斯世界纪录认证为「全球最高的玻璃地板观景台」，站在上面俯瞰478米下方的那种眩晕感，只有亲身体验才懂。玻璃地板分为朝南山・汉江方向和朝奥林匹克公园方向两处，建议两边都踩一踩。120层是可以走到室外的Sky Terrace，最高的123层则是首尔海拔最高的酒吧「123 Lounge」，边看夜景边喝一杯很不错。",
      "⚠️ 门票价格容易搞混：截至2026年4月，首尔天空观景台成人票约33,000韩元。想免排队直接上楼，可以选不分年龄统一价约50,000韩元的Fast Pass，不过这个不能网上预订，只能当天到现场售票处购买。普通票提前在官网或Interpark等平台买好，能省掉不少现场排队时间。想把晚霞和夜景一次看全，日落前大约1小时抵达是体验最好的时间点。",
      "大厦本身只是核心，整个建筑群才是完整的游玩目的地。低层有乐天世界购物中心（购物、影院）和世界数一数二的室内水族馆——乐天世界水族馆，高层则入驻六星级酒店乐天世界大厦Signiel首尔和乐天音乐厅。交通方面，地铁2、8号线蚕室站1、2号出口，或2、9号线综合运动场站都很近，且都能直接地下通往乐天世界购物中心，下雨天也不用担心。",
    ],
    overviewVi: [
      "Tháp Lotte World là tòa nhà chọc trời cao 555m, 123 tầng, tọa lạc tại Jamsil, quận Songpa, Seoul. Phần kết cấu hoàn thành năm 2016 và chính thức khai trương vào tháng 4/2017, giữ vững danh hiệu tòa nhà cao nhất Hàn Quốc từ đó đến nay. Thiết kế do công ty kiến trúc Mỹ KPF (Kohn Pedersen Fox) thực hiện, đường nét thon dần lên trên như nét bút được lấy cảm hứng từ đồ gốm truyền thống và thư pháp Hàn Quốc. Đứng ở đâu trong khu Jamsil ngẩng đầu lên cũng thấy, và giờ đây nó gần như trở thành biểu tượng mới của khu vực đông nam Seoul.",
      "Đài quan sát mang tên 'Seoul Sky' trải dài từ tầng 117 đến 123. Từ tầng hầm B2/B1, bạn đi thang máy hai tầng 'Sky Shuttle' do Otis chế tạo, với tốc độ 600m/phút (10m/giây), đưa bạn lên tầng 117 chỉ trong khoảng 1 phút. Một phút đó tự nó đã là một trải nghiệm nhỏ — cửa vừa đóng lại, các bức tường biến thành màn hình OLED chiếu hành trình ảo lướt qua các địa danh Seoul như Gyeongbokgung, Tòa nhà Quốc hội, sân vận động Jamsil, gần như chưa kịp cảm nhận độ cao đã tới nơi.",
      "Điểm nhấn của tầng 118 là Sky Deck, sàn kính làm từ kính cường lực dán nhiều lớp dày 45mm, chịu được tải trọng 1 tấn/m², cùng lúc chứa được tới 222 người. Nó được Guinness công nhận là 'đài quan sát sàn kính cao nhất thế giới', và đứng trên đó nhìn xuống khoảng không 478m bên dưới là cảm giác chỉ có tự trải nghiệm mới hiểu được. Có hai mảng sàn kính, một hướng về phía Namsan/sông Hàn và một hướng về Công viên Olympic, nên đứng thử cả hai bên. Tầng 120 có Sky Terrace ngoài trời, còn tầng cao nhất 123 là quầy bar cao nhất Seoul '123 Lounge' — rất hợp để nhâm nhi đồ uống ngắm cảnh đêm.",
      "⚠️ Giá vé là điểm hay gây nhầm lẫn: tính đến tháng 4/2026, vé người lớn vào đài quan sát Seoul Sky khoảng 33.000 won. Muốn lên thẳng không xếp hàng thì có vé Fast Pass đồng giá mọi lứa tuổi khoảng 50.000 won, nhưng vé này không đặt online được, chỉ mua tại quầy vé tại chỗ đúng ngày đến. Vé thường nên mua trước qua trang chính thức hoặc các nền tảng như Interpark để đỡ xếp hàng tại cổng. Muốn xem trọn cả hoàng hôn lẫn cảnh đêm thì đến trước khi mặt trời lặn khoảng 1 tiếng là hợp lý nhất.",
      "Tòa tháp chỉ là điểm nhấn — cả khu phức hợp mới là điểm đến trọn vẹn. Các tầng thấp có Lotte World Mall (mua sắm, rạp chiếu phim) và Thủy cung Lotte World, một trong những thủy cung trong nhà lớn nhất thế giới, còn các tầng cao là khách sạn 6 sao Signiel Seoul và Nhà hát Hòa nhạc Lotte. Để đến đây, đi tuyến tàu điện 2/8 tới ga Jamsil lối ra 1/2, hoặc tuyến 2/9 tới ga Sports Complex — cả hai đều nối thẳng ngầm vào Lotte World Mall nên trời mưa cũng không lo.",
    ],
    tips: {
      ko: [
        "입장료는 성인 약 33,000원(2026년 4월 기준) — 온라인 사전예매하면 현장 줄을 줄일 수 있어요.",
        "줄 서기 싫으면 패스트패스(약 50,000원, 전 연령 동일가) — 단 현장 당일 구매만 가능.",
        "118층 유리바닥 스카이데크는 남산·한강 방향과 올림픽공원 방향 두 곳 다 밟아보세요.",
        "노을+야경 다 보려면 일몰 1시간 전 도착이 베스트 타이밍.",
      ],
      en: [
        "Adult admission is about ₩33,000 (as of April 2026) — book online ahead to skip part of the line.",
        "Hate lines? Get the Fast Pass (~₩50,000 flat) — but it's same-day, on-site purchase only.",
        "The 118F glass Sky Deck has two panels — Namsan/Han River side and Olympic Park side — walk both.",
        "Arrive about an hour before sunset to catch both dusk and the night skyline.",
      ],
      zh: [
        "成人票约33,000韩元（截至2026年4月）——提前网上订票能省掉部分现场排队时间。",
        "不想排队就买Fast Pass（约50,000韩元，不分年龄统一价）——但只能当天现场购买。",
        "118层玻璃地板Sky Deck有南山·汉江方向和奥林匹克公园方向两处，建议都踩一踩。",
        "想同时看到晚霞和夜景，日落前1小时抵达最佳。",
      ],
      vi: [
        "Vé người lớn khoảng 33.000 won (tính đến 4/2026) — đặt online trước để đỡ xếp hàng tại cổng.",
        "Ngại xếp hàng thì mua Fast Pass (khoảng 50.000 won, đồng giá mọi lứa tuổi) — nhưng chỉ mua tại chỗ đúng ngày.",
        "Sàn kính Sky Deck tầng 118 có hai mảng — hướng Namsan/sông Hàn và hướng Công viên Olympic — nên đứng thử cả hai.",
        "Đến trước khi mặt trời lặn khoảng 1 tiếng để xem trọn cả hoàng hôn và cảnh đêm.",
      ],
    },
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Lotte_World_Tower_near_Cheongdam_Bridge.jpg/1280px-Lotte_World_Tower_near_Cheongdam_Bridge.jpg",
      alt: "롯데월드타워 전경 — Lotte World Tower skyline view near Cheongdam Bridge, Seoul",
      license: "CC BY 3.0",
      credit: "Wikimedia Commons / Ox1997cow",
      creditUrl:
        "https://commons.wikimedia.org/wiki/File:Lotte_World_Tower_near_Cheongdam_Bridge.jpg",
    },
    lat: 37.5125,
    lng: 127.1025,
    addressKo: "서울특별시 송파구 올림픽로 300",
    addressEn: "300 Olympic-ro, Songpa-gu, Seoul",
    tags: {
      ko: ["롯데월드타워", "서울스카이", "잠실", "전망대", "송파"],
      en: ["Lotte World Tower", "Seoul Sky", "Jamsil", "observation deck", "Songpa"],
      zh: ["乐天世界大厦", "首尔天空", "蚕室", "观景台", "松坡"],
      vi: ["Tháp Lotte World", "Seoul Sky", "Jamsil", "đài quan sát", "Songpa"],
    },
    faq: {
      ko: [
        {
          q: "롯데월드타워 서울스카이 입장료는 얼마인가요?",
          a: "2026년 4월 기준 서울스카이 전망대 성인 입장료는 약 33,000원입니다. 줄 서지 않고 바로 올라가고 싶다면 전 연령 동일가 약 50,000원의 패스트패스도 있는데, 이건 온라인 예매가 안 되고 방문 당일 현장에서만 구매할 수 있어요.",
        },
        {
          q: "롯데월드타워 가는 법은?",
          a: "지하철 2·8호선 잠실역 1·2번 출구 또는 2·9호선 종합운동장역이 가깝고, 두 역 모두 지하로 롯데월드몰과 바로 연결돼 있어 비가 와도 걱정 없어요.",
        },
        {
          q: "118층 유리바닥은 정말 안전한가요?",
          a: "네, 118층 스카이데크는 45mm 두께 강화 접합유리로 만들어져 ㎡당 1톤 하중을 견디고 동시에 222명이 올라가도 안전하도록 설계됐어요. 세계에서 가장 높은 유리바닥 전망대로 기네스 세계기록에도 등재됐습니다.",
        },
      ],
      en: [
        {
          q: "How much does it cost to visit Seoul Sky at Lotte World Tower?",
          a: "As of April 2026, adult admission to the Seoul Sky observatory runs about ₩33,000. If you want to skip the line entirely, there's a flat-rate Fast Pass at about ₩50,000 for any age, but it can only be bought same-day at the on-site counter, not booked online.",
        },
        {
          q: "How do you get to Lotte World Tower?",
          a: "Subway Lines 2/8 to Jamsil Station Exits 1/2, or Lines 2/9 to Sports Complex Station, both work — either station connects straight underground into Lotte World Mall, so rain isn't an issue.",
        },
        {
          q: "Is the 118th-floor glass floor actually safe?",
          a: "Yes — the Sky Deck on floor 118 is built from 45mm laminated tempered glass rated for a ton per square meter, safely holding up to 222 people at once. It's even Guinness-certified as the world's highest glass-floor observatory.",
        },
      ],
      zh: [
        {
          q: "乐天世界大厦首尔天空的门票多少钱？",
          a: "截至2026年4月，首尔天空观景台成人票约33,000韩元。想免排队直接上楼，可以选不分年龄统一价约50,000韩元的Fast Pass，不过这个不能网上预订，只能当天到现场购买。",
        },
        {
          q: "乐天世界大厦怎么去？",
          a: "地铁2、8号线蚕室站1、2号出口，或2、9号线综合运动场站都很近，两个站都能直接地下通往乐天世界购物中心，下雨天也不用担心。",
        },
        {
          q: "118层的玻璃地板真的安全吗？",
          a: "安全，118层的Sky Deck由45毫米厚的强化夹层玻璃制成，每平方米可承重1吨，同时222人站上去也没问题。它还被吉尼斯世界纪录认证为全球最高的玻璃地板观景台。",
        },
      ],
      vi: [
        {
          q: "Lên Seoul Sky ở Tháp Lotte World tốn bao nhiêu tiền?",
          a: "Tính đến tháng 4/2026, vé người lớn vào đài quan sát Seoul Sky khoảng 33.000 won. Muốn lên thẳng không xếp hàng thì có vé Fast Pass đồng giá mọi lứa tuổi khoảng 50.000 won, nhưng vé này chỉ mua tại quầy đúng ngày đến, không đặt online được.",
        },
        {
          q: "Đi đến Tháp Lotte World bằng cách nào?",
          a: "Đi tuyến tàu điện 2/8 tới ga Jamsil lối ra 1/2, hoặc tuyến 2/9 tới ga Sports Complex đều gần, cả hai ga đều nối thẳng ngầm vào Lotte World Mall nên trời mưa cũng không lo.",
        },
        {
          q: "Sàn kính tầng 118 có thực sự an toàn không?",
          a: "Có, Sky Deck ở tầng 118 làm từ kính cường lực dán nhiều lớp dày 45mm, chịu tải 1 tấn/m², an toàn cho tối đa 222 người cùng lúc. Nó còn được Guinness công nhận là đài quan sát sàn kính cao nhất thế giới.",
        },
      ],
    },
  },
  {
    slug: "hahoe-village",
    publishedAt: "2026-08-04",
    region: "gyeongsang",
    category: "culture",
    nameKo: "안동 하회마을",
    nameEn: "Andong Hahoe Village",
    nameZh: "安东河回村",
    nameVi: "Làng Hahoe, Andong",
    summaryKo:
      "낙동강이 마을을 S자로 휘감아 도는 '물돌이동' 지형에 조선시대 그대로 앉은 씨족마을이에요. 2010년 유네스코 세계유산에 오른 진짜 배경이고, 기와집과 초가집이 나란히 서 있는 골목을 걷다 보면 시간 여행하는 기분. 주말엔 하회탈춤도 무료로 볼 수 있어요.",
    summaryEn:
      "A clan village where the Nakdong River loops around in a perfect S-curve, still sitting exactly as it did in the Joseon era. It's a genuine UNESCO World Heritage site (since 2010), and walking past tile-roofed and thatched houses side by side feels like real time travel. Catch the free Hahoe mask dance on weekends if the timing works out.",
    summaryZh:
      "洛东江在村子四周绕出一个完美的S形，这座氏族村落至今仍保留着朝鲜时代原貌。2010年正式列入联合国教科文组织世界遗产，走在瓦房与草屋并排而立的巷弄里，仿佛穿越回了古代。周末还能免费看一场河回假面舞。",
    summaryVi:
      "Ngôi làng dòng tộc nơi sông Nakdong uốn quanh thành hình chữ S hoàn hảo, vẫn giữ nguyên dáng vẻ từ thời Joseon. Đây là Di sản Thế giới UNESCO thực thụ (từ năm 2010), đi dọc những con hẻm có nhà ngói và nhà tranh nằm cạnh nhau như được xuyên không về quá khứ. Cuối tuần còn xem miễn phí múa mặt nạ Hahoe.",
    overviewKo: [
      "하회마을은 경북 안동시 풍천면, 낙동강이 마을을 'S'자로 휘감아 도는 자리에 들어선 씨족마을이에요. 이름 자체가 '물이 돌아 흐른다'는 뜻의 하회(河回)에서 왔고요. 고려 중기엔 김해 허씨·광주 안씨가 먼저 자리 잡았다가, 14세기 후반 풍산 류씨가 들어오면서 지금의 모습으로 자리 잡았어요. 이 집안에서 태어난 류운룡·류성룡 형제 대에 마을이 크게 번성했는데, 특히 류성룡은 임진왜란 때 영의정을 지내며 전쟁 회고록 '징비록'을 남긴 인물이에요.",
      "2010년 7월 31일, 브라질 브라질리아에서 열린 제34차 유네스코 세계유산위원회에서 하회마을은 경주 양동마을과 함께 '한국의 역사마을'이라는 이름으로 세계유산에 등재됐어요. 우리나라 통산 10번째 세계유산이었죠. 유네스코가 높이 산 건 조선시대 유교적 양반문화가 주택·서원·정자 배치에 그대로 남아있고, 그게 오랜 세월 훼손 없이 보존됐다는 점이었어요.",
      "마을을 걸어보면 제일 눈에 띄는 게 기와집과 초가집이 나란히 서 있는 풍경이에요. 양반이 살던 큰 기와집(양진당·충효당이 대표적)과 그 살림을 돕던 하인·소작농이 살던 초가집이 원래 배치 그대로 남아있어서, 조선시대 신분 구조가 마을 전체에 새겨져 있는 셈이죠. 마을 한가운데엔 수백 년 된 느티나무 '삼신당 신목'이 서 있는데, 지금도 마을 사람들이 소원을 빌러 찾아오는 신성한 나무예요.",
      "하회마을 하면 빼놓을 수 없는 게 하회탈이에요. 오리나무로 깎아 만든 이 탈은 국보로 지정될 만큼 예술적 가치를 인정받았고, 양반·중·백정 같은 신분을 풍자하는 '하회별신굿탈놀이'에 쓰였어요. 지금도 3월~12월엔 매주 화~일요일 오후 2시~3시(1~2월은 토·일요일만), 마을 입구 관리사무소 맞은편 전수회관에서 이 공연을 무료로 볼 수 있는데, 6개 마당 공연 뒤엔 관람객이 함께 어울리는 뒤풀이까지 이어져요.",
      "⚠️ 입장료는 성인 5,000원·청소년 2,500원·어린이 1,500원이고, 6세 이하·65세 이상은 무료예요. 관람시간은 4~9월 9시~18시, 10~3월 9시~17시로 휴장일 없이 운영됩니다. 주차장·셔틀버스는 모두 무료고요. 체력이 남으면 마을 건너편 절벽 부용대까지 나룻배로 건너가 보세요 — 강 건너에서 마을 전경을 한눈에 담을 수 있는 최고의 뷰포인트예요. 근처 병산서원도 유네스코 서원 유산이라 시간 여유가 있다면 함께 둘러볼 만해요.",
    ],
    overviewEn: [
      "Hahoe Village sits in Pungcheon-myeon, Andong, at a spot where the Nakdong River loops around the settlement in a perfect S-curve — hence the name Hahoe (河回), literally 'the water turns and flows.' The Gimhae Heo and Gwangju An clans settled here first in the mid-Goryeo period, and the village took its current shape once the Pungsan Ryu clan moved in during the late 14th century. It really flourished under brothers Ryu Un-ryong and Ryu Seong-ryong, born into that clan — Ryu Seong-ryong in particular served as Chief State Councillor during the Imjin War and later wrote the Jingbirok, his war memoir.",
      "On July 31, 2010, at the 34th session of the UNESCO World Heritage Committee in Brasilia, Hahoe Village was inscribed as a World Heritage Site together with Yangdong Village in Gyeongju, under the collective title 'Historic Villages of Korea' — Korea's tenth World Heritage listing. UNESCO singled out how the layout of homes, Confucian academies, and pavilions still preserves the class structure and yangban culture of Joseon-era Korea, intact and undisturbed for centuries.",
      "Walking through the village, the first thing you notice is tile-roofed and thatched houses standing right next to each other. The large tile-roofed homes where yangban nobility lived (Yangjindang and Chunghyodang are the standouts) sit in their original position alongside the thatched cottages of the servants and tenant farmers who worked for them — so the class structure of Joseon society is basically written into the village layout. At the heart of the village stands a centuries-old zelkova tree, the 'Samsindang guardian tree,' where locals still come to make wishes.",
      "No visit to Hahoe is complete without the Hahoe masks. Carved from alder wood, they're recognized as national treasures for their artistry, and they're worn in the Hahoe Byeolsingut Talnori mask dance, which satirizes social classes like the yangban nobility, monks, and butchers. You can still catch this performance for free, March through December, Tuesday to Sunday from 2 to 3pm (Saturdays and Sundays only in January and February), at the mask dance hall across from the management office near the village entrance — six acts followed by an audience-joined finale.",
      "⚠️ Admission is ₩5,000 for adults, ₩2,500 for teens, and ₩1,500 for children, with free entry for kids 6 and under and seniors 65 and up. Visiting hours run 9am-6pm April through September and 9am-5pm October through March, with no closed days. Parking and the shuttle bus are both free. If you've got energy left, take the traditional wooden ferry across to Buyongdae, the cliff facing the village — it's the best viewpoint for a full panorama of Hahoe from across the river. Nearby Byeongsan Seowon is also a UNESCO-listed Confucian academy, worth pairing with your visit if you have time.",
    ],
    overviewZh: [
      "河回村位于庆尚北道安东市丰川面，坐落在洛东江以完美S形环绕而过的地方——村名「河回」本身就是「江水绕流而过」的意思。高丽中期，金海许氏与广州安氏最先在此定居，到14世纪后半叶丰山柳氏迁入后，才形成了如今的村落格局。村子真正兴盛起来是在柳云龙、柳成龙兄弟一代，两人皆出自丰山柳氏——其中柳成龙在壬辰倭乱期间官至领议政（首相），后来写下了记录那场战争的回忆录《惩毖录》。",
      "2010年7月31日，在巴西利亚举行的第34届联合国教科文组织世界遗产委员会会议上，河回村与庆州良洞村一起以「韩国历史村落」之名列入世界遗产名录，是韩国第10处世界遗产。教科文组织特别赞赏的一点是，这里的住宅、书院、亭台布局完整保留了朝鲜时代的儒家两班文化与身份等级结构，且历经数百年而未遭破坏。",
      "走进村子，最先映入眼帘的就是瓦房和草屋并排而立的景象。两班贵族居住的大型瓦房（以养真堂、忠孝堂最具代表性）与为其劳作的仆人、佃农所住的草屋，至今仍保持着原有的布局，等于把朝鲜时代的身份结构直接刻进了整个村庄。村子正中央矗立着一棵数百年树龄的老槐树「三神堂神木」，至今仍是村民前来祈愿的圣树。",
      "提到河回村就绕不开河回假面。这些用桤木雕刻而成的面具因其艺术价值被指定为国宝，用于讽刺两班贵族、僧侣、屠夫等身份阶层的「河回别神巫假面舞」表演中。如今每年3月到12月的周二至周日下午2点到3点（1、2月只在周六周日），在村口管理事务所对面的传承会馆仍可免费观看这场表演——六幕演出结束后，还有观众一起加入的谢幕环节。",
      "⚠️ 门票成人5,000韩元、青少年2,500韩元、儿童1,500韩元，6岁以下及65岁以上免费。开放时间为4至9月9:00~18:00，10至3月9:00~17:00，全年无休。停车场和摆渡车全部免费。体力允许的话，不妨乘传统木船渡江去对岸的悬崖夫容台——那是隔江眺望河回村全景的最佳观景点。附近的病山书院同样是联合国教科文组织认定的书院遗产，时间充裕的话很值得一并游览。",
    ],
    overviewVi: [
      "Làng Hahoe nằm ở Pungcheon-myeon, Andong, tại nơi sông Nakdong uốn quanh khu định cư thành một chữ S hoàn hảo — đó cũng là lý do tên làng Hahoe (河回) nghĩa đen là 'nước quay vòng chảy qua'. Dòng họ Gimhae Heo và Gwangju An là những người đầu tiên định cư ở đây vào giữa thời Goryeo, rồi đến cuối thế kỷ 14, dòng họ Pungsan Ryu chuyển đến và làng mang hình hài như ngày nay. Làng thực sự phát triển rực rỡ dưới thời hai anh em Ryu Un-ryong và Ryu Seong-ryong, sinh ra trong dòng họ này — đặc biệt Ryu Seong-ryong từng giữ chức Tể tướng (Yeonguijeong) trong cuộc chiến Imjin, sau đó viết hồi ký chiến tranh Jingbirok.",
      "Ngày 31/7/2010, tại phiên họp thứ 34 của Ủy ban Di sản Thế giới UNESCO ở Brasilia, làng Hahoe được công nhận Di sản Thế giới cùng với làng Yangdong ở Gyeongju, dưới tên gọi chung 'Các làng lịch sử của Hàn Quốc' — di sản thế giới thứ 10 của Hàn Quốc. Điều UNESCO đánh giá cao là cách bố trí nhà ở, thư viện Nho giáo và các đình các vẫn giữ nguyên cấu trúc giai cấp và văn hóa quý tộc yangban thời Joseon, được bảo tồn nguyên vẹn qua nhiều thế kỷ.",
      "Đi dạo trong làng, điều đầu tiên đập vào mắt là những ngôi nhà mái ngói và mái tranh đứng cạnh nhau. Những ngôi nhà ngói lớn nơi tầng lớp quý tộc yangban từng sống (tiêu biểu là Yangjindang và Chunghyodang) vẫn nằm đúng vị trí ban đầu, cạnh những ngôi nhà tranh của người hầu, tá điền từng làm việc cho họ — nên cấu trúc giai cấp thời Joseon gần như được khắc thẳng vào bố cục cả ngôi làng. Giữa làng có một cây du cổ thụ hàng trăm năm tuổi, 'cây thần Samsindang', nơi người dân vẫn đến cầu nguyện cho đến ngày nay.",
      "Nhắc đến Hahoe không thể bỏ qua mặt nạ Hahoe. Được chạm khắc từ gỗ cây trăn (alder), những chiếc mặt nạ này được công nhận là bảo vật quốc gia nhờ giá trị nghệ thuật, và được dùng trong múa mặt nạ Hahoe Byeolsingut Talnori — điệu múa châm biếm các tầng lớp như quý tộc yangban, nhà sư, người mổ thịt. Bạn vẫn có thể xem miễn phí buổi biểu diễn này từ tháng 3 đến tháng 12, thứ Ba đến Chủ nhật, 14h-15h (tháng 1-2 chỉ có thứ Bảy, Chủ nhật), tại hội quán truyền nghề đối diện văn phòng quản lý gần cổng làng — sáu màn biểu diễn rồi kết thúc bằng phần giao lưu cùng khán giả.",
      "⚠️ Vé vào cửa 5.000 won cho người lớn, 2.500 won cho thanh thiếu niên, 1.500 won cho trẻ em, miễn phí cho trẻ từ 6 tuổi trở xuống và người từ 65 tuổi trở lên. Giờ tham quan là 9h-18h từ tháng 4 đến tháng 9, và 9h-17h từ tháng 10 đến tháng 3, mở cửa quanh năm không nghỉ. Bãi đỗ xe và xe buýt đưa đón đều miễn phí. Nếu còn sức, hãy đi thuyền gỗ truyền thống qua vách đá Buyongdae đối diện làng — đó là điểm ngắm toàn cảnh Hahoe đẹp nhất từ bên kia sông. Byeongsan Seowon gần đó cũng là di sản thư viện Nho giáo được UNESCO công nhận, đáng ghé thăm nếu còn thời gian.",
    ],
    tips: {
      ko: [
        "입장료 성인 5,000원·청소년 2,500원·어린이 1,500원, 6세 이하·65세 이상은 무료.",
        "하회탈춤(하회별신굿탈놀이)은 3~12월 화~일 14~15시 무료 관람(1~2월은 토·일만).",
        "관람시간 4~9월 9~18시, 10~3월 9~17시 — 휴장일 없음, 주차·셔틀버스 무료.",
        "부용대까지 나룻배로 건너가면 강 건너에서 마을 전경을 한눈에 담을 수 있어요.",
      ],
      en: [
        "Admission: ₩5,000 adults, ₩2,500 teens, ₩1,500 children; free for age 6 and under, 65 and up.",
        "The Hahoe mask dance (Byeolsingut Talnori) runs free March-December, Tue-Sun 2-3pm (Sat/Sun only Jan-Feb).",
        "Open 9am-6pm April-September, 9am-5pm October-March — no closed days; parking and shuttle are free.",
        "Take the ferry across to Buyongdae cliff for the best panoramic view of the whole village.",
      ],
      zh: [
        "门票成人5,000韩元、青少年2,500韩元、儿童1,500韩元，6岁以下及65岁以上免费。",
        "河回假面舞（别神巫假面舞）3~12月周二至周日下午2~3点免费上演（1、2月仅周六周日）。",
        "开放时间4~9月9:00~18:00，10~3月9:00~17:00——全年无休，停车场和摆渡车免费。",
        "乘船渡江到夫容台，可以从对岸一览整个村子的全景。",
      ],
      vi: [
        "Vé vào cửa 5.000 won người lớn, 2.500 won thanh thiếu niên, 1.500 won trẻ em; miễn phí từ 6 tuổi trở xuống và 65 tuổi trở lên.",
        "Múa mặt nạ Hahoe (Byeolsingut Talnori) miễn phí từ tháng 3-12, thứ Ba-Chủ nhật 14h-15h (tháng 1-2 chỉ thứ Bảy, Chủ nhật).",
        "Mở cửa 9h-18h tháng 4-9, 9h-17h tháng 10-3 — không nghỉ ngày nào; bãi đỗ xe và xe buýt miễn phí.",
        "Đi thuyền qua vách đá Buyongdae để ngắm toàn cảnh làng đẹp nhất từ bên kia sông.",
      ],
    },
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/21/Hahoe_Folk_Village_01.jpg/1280px-Hahoe_Folk_Village_01.jpg",
      alt: "하회마을 전경 — Hahoe Folk Village, Andong",
      license: "CC0 1.0 (Public Domain)",
      credit: "Wikimedia Commons / Bernard Gagnon",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Hahoe_Folk_Village_01.jpg",
    },
    lat: 36.5391,
    lng: 128.5164,
    addressKo: "경상북도 안동시 풍천면 하회남촌길 63",
    addressEn: "63 Hahoenamchon-gil, Pungcheon-myeon, Andong-si, Gyeongsangbuk-do",
    tags: {
      ko: ["하회마을", "안동", "유네스코", "하회탈", "탈춤"],
      en: ["Hahoe Village", "Andong", "UNESCO", "Hahoe mask", "mask dance"],
      zh: ["河回村", "安东", "联合国教科文组织", "河回面具", "假面舞"],
      vi: ["Làng Hahoe", "Andong", "UNESCO", "mặt nạ Hahoe", "múa mặt nạ"],
    },
    faq: {
      ko: [
        {
          q: "하회마을 입장료와 관람시간은 어떻게 되나요?",
          a: "성인 5,000원, 청소년 2,500원, 어린이 1,500원이며 6세 이하와 65세 이상은 무료입니다. 관람시간은 4~9월 9시~18시, 10~3월 9시~17시로 휴장일 없이 운영돼요.",
        },
        {
          q: "하회탈춤은 언제 볼 수 있나요?",
          a: "하회별신굿탈놀이는 3~12월 매주 화~일요일 오후 2시~3시(1~2월은 토·일요일만)에 마을 입구 전수회관에서 무료로 공연됩니다. 6개 마당 공연 후엔 관람객과 함께하는 뒤풀이도 이어져요.",
        },
        {
          q: "하회마을은 어떻게 가나요?",
          a: "안동 시내에서 시내버스나 차량으로 이동할 수 있고, 마을 입구 매표소에서 주차장·셔틀버스가 모두 무료로 운영돼요. 체력이 되면 나룻배를 타고 강 건너 부용대까지 가보면 마을 전경을 한눈에 담을 수 있습니다.",
        },
      ],
      en: [
        {
          q: "What's the admission fee and visiting hours for Hahoe Village?",
          a: "Admission is ₩5,000 for adults, ₩2,500 for teens, and ₩1,500 for children, with free entry for those 6 and under or 65 and up. Visiting hours run 9am-6pm from April to September and 9am-5pm from October to March, with no closed days.",
        },
        {
          q: "When can I watch the Hahoe mask dance?",
          a: "The Hahoe Byeolsingut Talnori mask dance runs free at the mask dance hall near the village entrance, Tuesday through Sunday from 2 to 3pm, March through December (Saturdays and Sundays only in January and February). Six acts are followed by an audience-joined finale.",
        },
        {
          q: "How do you get to Hahoe Village?",
          a: "You can reach it by local bus or car from downtown Andong, and parking plus the shuttle bus at the entrance ticket office are both free. If you've got the energy, take the traditional ferry across to Buyongdae cliff for a full panoramic view of the village.",
        },
      ],
      zh: [
        {
          q: "河回村的门票和开放时间是怎样的？",
          a: "成人票5,000韩元、青少年2,500韩元、儿童1,500韩元，6岁以下及65岁以上免费。开放时间为4~9月9:00~18:00，10~3月9:00~17:00，全年无休。",
        },
        {
          q: "什么时候能看到河回假面舞？",
          a: "河回别神巫假面舞在3~12月每周二至周日下午2点到3点（1、2月仅周六周日），于村口传承会馆免费上演。六幕演出结束后还有观众一起参与的谢幕环节。",
        },
        {
          q: "河回村怎么去？",
          a: "从安东市区可以乘市内巴士或开车前往，村口售票处的停车场和摆渡车都是免费的。体力允许的话，可以乘船渡江到对岸的夫容台，一览整个村子的全景。",
        },
      ],
      vi: [
        {
          q: "Vé vào cửa và giờ tham quan làng Hahoe thế nào?",
          a: "Vé 5.000 won cho người lớn, 2.500 won cho thanh thiếu niên, 1.500 won cho trẻ em, miễn phí cho người từ 6 tuổi trở xuống hoặc 65 tuổi trở lên. Giờ tham quan là 9h-18h từ tháng 4 đến tháng 9, và 9h-17h từ tháng 10 đến tháng 3, không nghỉ ngày nào.",
        },
        {
          q: "Khi nào có thể xem múa mặt nạ Hahoe?",
          a: "Múa mặt nạ Hahoe Byeolsingut Talnori biểu diễn miễn phí tại hội quán gần cổng làng, từ thứ Ba đến Chủ nhật, 14h-15h, từ tháng 3 đến tháng 12 (tháng 1-2 chỉ thứ Bảy, Chủ nhật). Sáu màn biểu diễn kết thúc bằng phần giao lưu cùng khán giả.",
        },
        {
          q: "Đi đến làng Hahoe bằng cách nào?",
          a: "Bạn có thể đi xe buýt nội thành hoặc ô tô từ trung tâm Andong, bãi đỗ xe và xe buýt đưa đón tại cổng vào đều miễn phí. Nếu còn sức, hãy đi thuyền gỗ truyền thống qua vách đá Buyongdae để ngắm toàn cảnh làng.",
        },
      ],
    },
  },
  {
    slug: "hyeopjae-beach",
    publishedAt: "2026-08-06",
    region: "jeju",
    category: "nature",
    nameKo: "협재해변",
    nameEn: "Hyeopjae Beach",
    nameZh: "协才海水浴场",
    nameVi: "Bãi biển Hyeopjae",
    summaryKo:
      "제주 서쪽 한림읍, 에메랄드빛 바다 위로 화산섬 비양도가 떠 있는 협재해수욕장이에요. 수심 얕고 경사 완만해 아이 동반 가족 여행에 딱이고, 걸어서 5분이면 한림공원까지 이어져요.",
    summaryEn:
      "Emerald water, gentle slopes, and the volcanic island of Biyangdo floating just offshore — Hyeopjae Beach on Jeju's west coast is built for family swims and sunset photos, with Hallim Park a 5-minute walk away.",
    summaryZh:
      "济州岛西部翰林邑的协才海水浴场，翡翠色海面上漂浮着火山岛飞扬岛。水浅坡缓非常适合亲子戏水，步行5分钟就能到韩林公园。",
    summaryVi:
      "Nước biển xanh ngọc lục bảo, dốc thoải, và đảo núi lửa Biyangdo trôi nổi ngoài khơi — bãi biển Hyeopjae ở bờ tây Jeju sinh ra để dành cho gia đình tắm biển và chụp ảnh hoàng hôn, cách Công viên Hallim chỉ 5 phút đi bộ.",
    overviewKo: [
      "협재해수욕장은 제주 서쪽 한림읍에 있는 백사장으로, 제주 사람들도 '서부 해변 원탑'으로 꼽는 곳이에요. 조개껍질 가루가 잔뜩 섞인 하얀 모래와 에메랄드빛 코발트 바다, 그 위로 떠 있는 화산섬 비양도가 한 프레임에 딱 들어오는 풍경이 이 해변의 시그니처예요. 수심이 얕고 경사가 완만해서 아이 동반 가족 여행객들이 몰리는 이유이기도 하고요.",
      "해변 정면에 보이는 비양도는 협재의 상징 그 자체예요. 조선시대 지리서 《신증동국여지승람》에는 고려 목종 때(1002년 혹은 1007년) 바다 한가운데서 갑자기 산이 솟아올라 생긴 섬이라는 극적인 기록이 남아 있는데, 실제 지질 조사로는 약 2만 7천 년 전 빙하기 화산활동으로 만들어진 걸로 밝혀졌어요. 어느 쪽이든 신비로운 섬인 건 확실하고, 한림항에서 배로 15분이면 닿을 수 있어요 — 등대와 등산로, 화산 지형이 있어서 협재까지 왔다면 한 번쯤 건너가 볼 만합니다.",
      "협재의 매력은 낮과 밤이 달라요. 낮엔 스노클링하기 좋을 만큼 물이 맑고 얕아서 아이들 물놀이 천국이고, 해 질 무렵엔 비양도 실루엣 뒤로 지는 노을이 유명해서 일몰 사진 명소로 불려요. 해변 자체가 제주올레 14코스에 걸쳐 있어서 산책 삼아 걷다 보면 자연스럽게 노을까지 챙기는 코스가 나옵니다.",
      "편의시설도 꽤 잘 갖춰져 있어요. 탈의실·샤워실·식수대·화장실이 다 있고, 여름 성수기엔 밤 7시부터 10시까지 야간개장까지 하니 낮 더위를 피해 저녁에 놀러 가는 것도 방법이에요. 해변 뒤편은 울창한 송림이라 야영이나 산림욕 하기도 좋고, 근처 바다에서 전복·소라가 많이 잡혀서 싱싱한 해산물 맛집도 여럿이에요. 남서쪽으로는 금능해수욕장과 이어져 있어서 주민들은 두 해변을 통틀어 협재해수욕장이라 부르기도 해요.",
      "가는 법은 렌터카가 제일 편하고, 대중교통이면 제주공항이나 제주시외버스터미널에서 서부 방면 노선버스(202번 등)를 타고 한림·협재리 방면으로 이동하면 됩니다. 주차장은 백사장 남쪽의 2주차장이 제일 넓고 장애인 주차 공간도 있어요. 걸어서 5분 거리에 한림공원이 있어서 야자수·동굴·수선화 정원을 함께 둘러보기 좋고, 협재굴·명월대 같은 소소한 명소도 근처에 있어요. 개장 기간은 6월 말~9월 초지만, 여름 성수기엔 사람과 차가 많이 몰리니 아침 일찍 가는 게 여유롭게 즐기는 팁이에요.",
    ],
    overviewEn: [
      "Hyeopjae Beach sits on Jeju's west coast in Hallim-eup, and locals themselves call it the island's best west-side beach. Its signature look: white sand thick with crushed shell, cobalt-emerald water, and the volcanic island of Biyangdo floating right in the frame. The water is shallow with a gentle slope, which is exactly why families with kids flock here.",
      "Biyangdo, the island facing the beach, is basically Hyeopjae's mascot. A Joseon-era geography text, the Sinjeung Dongguk Yeoji Seungnam, records a dramatic legend: during the reign of Goryeo's King Mokjong (either 1002 or 1007), a mountain suddenly rose out of the sea to form the island. Modern geological surveys tell a different story — the island actually formed from volcanic activity roughly 27,000 years ago, during an ice age. Either way, it's a genuinely mysterious little island, and a 15-minute ferry from Hallim Port gets you there — worth the crossing once for the lighthouse, hiking trail, and volcanic terrain.",
      "Hyeopjae has two completely different personalities by time of day. In daylight, the water's clear and shallow enough for snorkeling, making it a kids' paradise; toward evening, it's famous for sunsets that silhouette Biyangdo — a genuine photo destination. The beach itself sits on Jeju Olle Trail Course 14, so a casual stroll naturally lines up with sunset timing.",
      "The amenities are solid too — changing rooms, showers, drinking water stations, and restrooms are all on site, and during peak summer the beach even opens at night from 7 to 10pm, so you can dodge the daytime heat and swim after dark. Behind the beach is a dense pine forest good for camping or a bit of forest bathing, and the nearby waters are rich in abalone and conch, so fresh seafood restaurants are easy to find. To the southwest it connects to Geumneung Beach, and locals sometimes lump the two together under the Hyeopjae name.",
      "A rental car is the easiest way to get here; by public transit, catch a west-bound route bus (like the 202) from Jeju Airport or the Jeju Intercity Bus Terminal toward Hallim/Hyeopjae-ri. Parking Lot 2, south of the sand, is the biggest and has designated disabled parking. Hallim Park is a 5-minute walk away with palm trees, caves, and a daffodil garden if you want to extend the trip, and smaller sights like Hyeopjaegul Cave and Myeongwoldae are nearby too. The official swimming season runs late June through early September, but summer peak season brings heavy crowds and traffic — an early morning visit is your best bet for breathing room.",
    ],
    overviewZh: [
      "协才海水浴场位于济州岛西部翰林邑，本地人自己都称它为岛上西侧最强海滩。招牌画面是：混着碎贝壳粉的白沙滩、钴蓝到翠绿的海水，加上正前方漂浮的火山岛飞扬岛，三者同框构成一幅经典风景。水浅坡缓，正是携带小孩的家庭游客扎堆于此的原因。",
      "正对海滩的飞扬岛几乎就是协才的象征。朝鲜时代地理志《新增东国舆地胜览》记载了一段戏剧性传说：高丽穆宗在位期间（1002年或1007年），一座山突然从海中升起形成了这座岛。但现代地质调查显示，这座岛实际是约2.7万年前冰河时期火山活动的产物。不管哪种说法，这都是一座真正神秘的小岛，从翰林港坐船15分钟就能到——那里有灯塔、登山道和火山地貌，来协才一趟不妨渡海一次。",
      "协才白天和夜晚是两种完全不同的气质。白天海水清澈又浅，适合浮潜，是孩子们的天堂；傍晚则以飞扬岛剪影映衬的落日闻名，是名副其实的日落打卡地。海滩本身正好在济州偶来14号步道上，随意散步走着走着就能顺路等到日落。",
      "配套设施也很齐全——更衣室、淋浴间、饮水台、洗手间一应俱全，夏季旺季晚上7点到10点还会开放夜场，白天太热的话晚上下水也是个办法。海滩后方是茂密的松树林，很适合露营或森林浴，附近海域盛产鲍鱼和海螺，新鲜海鲜餐厅也不少。西南方向和金陵海水浴场相连，当地人有时会把两片海滩统称为协才海水浴场。",
      "自驾最方便，坐公交的话可以从济州机场或济州市外巴士客运站搭乘开往西部方向的路线巴士（如202路）前往翰林、协才里方向。停车场以沙滩南侧的第2停车场最大，还设有残疾人专用车位。步行5分钟就是韩林公园，可以顺路逛棕榈树、洞穴和水仙花园，协才窟、明月台这类小众景点也在附近。开放期是6月底到9月初，不过夏季旺季人车都很拥挤，一大早去才能玩得从容。",
    ],
    overviewVi: [
      "Bãi biển Hyeopjae nằm ở bờ tây đảo Jeju, thuộc Hallim-eup, và chính người dân địa phương cũng gọi đây là bãi biển đẹp nhất phía tây đảo. Hình ảnh đặc trưng của nơi này là: cát trắng lẫn nhiều vụn vỏ sò, làn nước xanh coban pha ngọc lục bảo, và hòn đảo núi lửa Biyangdo trôi nổi ngay trước mắt. Nước nông và dốc thoải chính là lý do các gia đình có trẻ nhỏ đổ về đây.",
      "Đảo Biyangdo nằm đối diện bãi biển gần như là biểu tượng của Hyeopjae. Sách địa lý thời Joseon Sinjeung Dongguk Yeoji Seungnam ghi lại một truyền thuyết đầy kịch tính: dưới thời vua Mokjong triều Goryeo (năm 1002 hoặc 1007), một ngọn núi đột nhiên trồi lên từ biển tạo thành hòn đảo này. Nhưng khảo sát địa chất hiện đại lại cho thấy hòn đảo thực chất hình thành từ hoạt động núi lửa cách đây khoảng 27.000 năm, trong thời kỳ băng hà. Dù theo cách nào thì đây vẫn là một hòn đảo bí ẩn thực sự, và chỉ cần đi phà 15 phút từ cảng Hallim là tới nơi — có hải đăng, đường mòn leo núi và địa hình núi lửa, đáng để ghé qua một lần khi đã đến Hyeopjae.",
      "Hyeopjae mang hai vẻ hoàn toàn khác nhau giữa ngày và đêm. Ban ngày nước trong và nông, đủ để lặn ngắm san hô, là thiên đường cho trẻ nhỏ; về chiều tối thì nổi tiếng với cảnh hoàng hôn in bóng đảo Biyangdo — một điểm chụp ảnh hoàng hôn đích thực. Bãi biển nằm ngay trên cung đường Olle số 14 của Jeju, nên chỉ cần dạo bộ thong thả là tự nhiên canh được giờ hoàng hôn.",
      "Tiện ích ở đây cũng khá đầy đủ — phòng thay đồ, vòi sen, trạm nước uống, nhà vệ sinh đều có sẵn, và vào mùa hè cao điểm bãi biển còn mở cửa đêm từ 19h đến 22h, nên có thể tránh nắng ban ngày và xuống tắm vào buổi tối. Phía sau bãi biển là rừng thông rậm rạp, thích hợp cắm trại hay tắm rừng, còn vùng biển gần đó nhiều bào ngư và ốc nên các quán hải sản tươi cũng dễ tìm. Về phía tây nam, bãi biển nối liền với bãi Geumneung, nên người dân đôi khi gọi chung cả hai là Hyeopjae.",
      "Thuê xe tự lái là cách tiện nhất, còn nếu đi phương tiện công cộng thì bắt xe buýt tuyến phía tây (như tuyến 202) từ sân bay Jeju hoặc Bến xe liên tỉnh Jeju hướng về Hallim/Hyeopjae-ri. Bãi đỗ xe số 2 ở phía nam bãi cát là lớn nhất và có chỗ đậu dành cho người khuyết tật. Đi bộ 5 phút là tới Công viên Hallim với cây cọ, hang động và vườn hoa thủy tiên nếu muốn kéo dài chuyến đi, còn những điểm nhỏ hơn như hang Hyeopjaegul, đài Myeongwoldae cũng ở gần đó. Mùa tắm biển chính thức từ cuối tháng 6 đến đầu tháng 9, nhưng cao điểm mùa hè rất đông người và xe, nên đi từ sáng sớm sẽ thoải mái hơn.",
    ],
    tips: {
      ko: [
        "수심 얕고 경사 완만해서 아이 동반 가족 여행객에게 특히 좋아요.",
        "일몰 명소로 유명 — 비양도 실루엣 뒤로 지는 해를 노려보세요.",
        "여름 성수기엔 밤 7~10시 야간개장도 하니 낮 더위 피해 저녁 물놀이도 방법.",
        "비양도 가려면 한림항에서 배로 15분, 협재 백사장에서 직접 갈 수는 없어요.",
        "2주차장(백사장 남쪽)이 가장 넓고 장애인 주차 구역도 있어요.",
      ],
      en: [
        "Shallow water and a gentle slope make this a top pick for families with young kids.",
        "Famous sunset spot — watch the sun drop behind Biyangdo's silhouette.",
        "Summer peak season adds a night opening (7–10pm), a good way to dodge the daytime heat.",
        "To reach Biyangdo, take the 15-minute ferry from Hallim Port — you can't walk there from the sand.",
        "Parking Lot 2 (south of the beach) is the largest, with designated disabled parking.",
      ],
      zh: [
        "水浅坡缓，特别适合带小孩的家庭出游。",
        "著名日落景点——记得等飞扬岛剪影后方的落日。",
        "夏季旺季晚上7点到10点有夜场开放，可以避开白天酷热改在傍晚戏水。",
        "去飞扬岛要从翰林港坐船15分钟，协才沙滩没法直接走过去。",
        "第2停车场（沙滩南侧）最大，还设有残疾人专用车位。",
      ],
      vi: [
        "Nước nông, dốc thoải, cực kỳ phù hợp cho gia đình có trẻ nhỏ.",
        "Điểm ngắm hoàng hôn nổi tiếng — đón mặt trời lặn sau bóng đảo Biyangdo.",
        "Mùa hè cao điểm có mở cửa đêm (19h–22h), cách hay để tránh nắng ban ngày và tắm biển buổi tối.",
        "Muốn ra đảo Biyangdo phải đi phà 15 phút từ cảng Hallim, không thể đi bộ từ bãi cát.",
        "Bãi đỗ xe số 2 (phía nam bãi biển) lớn nhất và có khu vực dành cho người khuyết tật.",
      ],
    },
    image: {
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/Hyeopjae_Beach_Scenery.jpg/1280px-Hyeopjae_Beach_Scenery.jpg",
      alt: "협재해수욕장과 비양도 — Hyeopjae Beach with Biyangdo island, Jeju",
      license: "CC BY-SA 4.0",
      credit: "Wikimedia Commons / Lcarrion88",
      creditUrl: "https://commons.wikimedia.org/wiki/File:Hyeopjae_Beach_Scenery.jpg",
    },
    lat: 33.393845,
    lng: 126.239716,
    addressKo: "제주특별자치도 제주시 한림읍 한림로 329-10",
    addressEn: "329-10 Hallim-ro, Hallim-eup, Jeju-si, Jeju-do",
    tags: {
      ko: ["협재해수욕장", "제주 해변", "비양도", "한림공원", "제주 여행"],
      en: ["Hyeopjae Beach", "Jeju beach", "Biyangdo", "Hallim Park", "Jeju travel"],
      zh: ["协才海水浴场", "济州海滩", "飞扬岛", "韩林公园", "济州旅游"],
      vi: ["bãi biển Hyeopjae", "biển Jeju", "đảo Biyangdo", "Công viên Hallim", "du lịch Jeju"],
    },
    faq: {
      ko: [
        {
          q: "협재해수욕장 개장 시기와 입장료는?",
          a: "공식 개장 기간은 6월 말부터 9월 초까지이며 입장료는 없습니다. 여름 성수기엔 밤 7시부터 10시까지 야간개장도 운영해요.",
        },
        {
          q: "비양도는 어떻게 가나요?",
          a: "협재 백사장에서 직접 걸어갈 수는 없고, 근처 한림항에서 배를 타면 약 15분 만에 닿습니다. 등대와 등산로, 화산 지형이 있어 협재까지 온 김에 건너가 볼 만해요.",
        },
        {
          q: "협재해수욕장은 아이와 함께 가기 좋은가요?",
          a: "네, 다른 제주 해변보다 수심이 얕고 경사가 완만해 가족 단위 여행객에게 특히 인기예요. 탈의실·샤워실·식수대·화장실 같은 편의시설도 잘 갖춰져 있고, 걸어서 5분 거리에 한림공원도 있습니다.",
        },
      ],
      en: [
        {
          q: "When's the swimming season at Hyeopjae Beach, and is there an entrance fee?",
          a: "The official season runs from late June through early September, and there's no entrance fee. During peak summer, the beach also opens at night from 7 to 10pm.",
        },
        {
          q: "How do you get to Biyangdo island?",
          a: "You can't walk there from Hyeopjae's sand — take the roughly 15-minute ferry from nearby Hallim Port instead. With a lighthouse, hiking trail, and volcanic terrain, it's worth the crossing while you're in the area.",
        },
        {
          q: "Is Hyeopjae Beach good for a family trip with kids?",
          a: "Yes — the water here is shallower and the slope gentler than most Jeju beaches, making it a favorite with families. Amenities like changing rooms, showers, drinking water, and restrooms are all on site, and Hallim Park is just a 5-minute walk away.",
        },
      ],
      zh: [
        {
          q: "协才海水浴场的开放期和门票是？",
          a: "官方开放期是6月底到9月初，不收门票。夏季旺季晚上7点到10点还有夜场开放。",
        },
        {
          q: "怎么去飞扬岛？",
          a: "从协才沙滩没法直接走过去，需要从附近的翰林港坐船，大约15分钟就能到。岛上有灯塔、登山道和火山地貌，来协才顺路渡海一次很值得。",
        },
        {
          q: "协才海水浴场适合带孩子去吗？",
          a: "适合，这里比济州其他海滩水更浅、坡度更缓，特别受家庭游客欢迎。更衣室、淋浴间、饮水台、洗手间等设施也很齐全，步行5分钟就到韩林公园。",
        },
      ],
      vi: [
        {
          q: "Mùa tắm biển ở Hyeopjae là khi nào, có mất phí vào cửa không?",
          a: "Mùa chính thức từ cuối tháng 6 đến đầu tháng 9, và không mất phí vào cửa. Vào cao điểm mùa hè, bãi biển còn mở cửa đêm từ 19h đến 22h.",
        },
        {
          q: "Đi đến đảo Biyangdo bằng cách nào?",
          a: "Không thể đi bộ từ bãi cát Hyeopjae, bạn cần đi phà khoảng 15 phút từ cảng Hallim gần đó. Đảo có hải đăng, đường mòn leo núi và địa hình núi lửa, rất đáng ghé qua khi đã tới Hyeopjae.",
        },
        {
          q: "Bãi biển Hyeopjae có phù hợp đi cùng trẻ nhỏ không?",
          a: "Có, nước ở đây nông hơn và dốc thoải hơn nhiều bãi biển khác ở Jeju, nên rất được các gia đình yêu thích. Tiện ích như phòng thay đồ, vòi sen, trạm nước uống, nhà vệ sinh đều đầy đủ, và Công viên Hallim chỉ cách 5 phút đi bộ.",
        },
      ],
    },
  },
];

/** slug → 명소 조회 */
export function findAttraction(slug: string): AttractionEntry | undefined {
  return ATTRACTIONS.find((a) => a.slug === slug);
}

/** 발행일 내림차순 정렬 (최신 먼저) */
export function sortedAttractions(): AttractionEntry[] {
  return [...ATTRACTIONS].sort((a, b) =>
    b.publishedAt.localeCompare(a.publishedAt),
  );
}

/** 지역별 그룹 (허브 목록 렌더용) */
export function attractionsByRegion(): Map<AttractionRegion, AttractionEntry[]> {
  const map = new Map<AttractionRegion, AttractionEntry[]>();
  for (const a of sortedAttractions()) {
    const list = map.get(a.region) ?? [];
    list.push(a);
    map.set(a.region, list);
  }
  return map;
}

/** 전체 slug (generateStaticParams·sitemap용) */
export const ATTRACTION_SLUGS: ReadonlyArray<string> = ATTRACTIONS.map(
  (a) => a.slug,
);

/** 명소의 로케일별 텍스트를 한 번에 선택 (상세·카드·OG 공용) */
export function localizedAttraction(
  a: AttractionEntry,
  locale: "ko" | "en" | "zh" | "vi",
): {
  name: string;
  summary: string;
  overview: readonly string[];
  tips: readonly string[];
  tags: readonly string[];
  faq: ReadonlyArray<{ q: string; a: string }>;
  regionLabel: string;
  categoryLabel: string;
} {
  const pick = (ko: string, en: string, zh: string, vi: string): string =>
    locale === "ko" ? ko : locale === "zh" ? zh : locale === "vi" ? vi : en;
  return {
    name: pick(a.nameKo, a.nameEn, a.nameZh, a.nameVi),
    summary: pick(a.summaryKo, a.summaryEn, a.summaryZh, a.summaryVi),
    overview:
      locale === "ko"
        ? a.overviewKo
        : locale === "zh"
          ? a.overviewZh
          : locale === "vi"
            ? a.overviewVi
            : a.overviewEn,
    tips: a.tips[locale] ?? a.tips.en,
    tags: a.tags[locale] ?? a.tags.en,
    faq: a.faq?.[locale] ?? a.faq?.en ?? [],
    regionLabel: REGION_LABELS[a.region][locale],
    categoryLabel: CATEGORY_LABELS[a.category][locale],
  };
}
