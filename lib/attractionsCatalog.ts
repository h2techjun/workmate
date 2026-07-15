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
      "서울 궁궐 중 급은 여기가 최고예요. 광화문 넘어서자마자 근정전 스케일에 압도되고, 한복만 입으면 입장료 3천 원이 통째로 공짜! 운 좋으면 봄가을 야간개장까지 잡을 수 있어요.",
    summaryEn:
      "Seoul's #1 palace, no contest. Walk through Gwanghwamun and Geunjeongjeon hits you with pure scale — and if you're in hanbok, the ₩3,000 entry fee just disappears. Catch it during the spring/fall night opening and it's next-level.",
    summaryZh:
      "首尔宫殿天花板就是它。走过光化门，勤政殿的气场直接把你镇住——穿韩服的话，3000韩元门票直接免单！运气好还能赶上春秋季夜间开放。",
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
      "부산 왔으면 여기부터 찍고 시작해야죠. 1.5km 백사장에 광안대교 야경까지, 여름엔 물놀이 겨울엔 북극곰 수영대회 — 사계절 안 심심한 부산 원탑 해변이에요.",
    summaryEn:
      "If you're in Busan, this is where you start. A 1.5km stretch of sand with Gwangan Bridge glowing at night, summer swimming, even a Polar Bear Swim in winter — Busan's #1 beach never gets boring.",
    summaryZh:
      "来釜山第一站就是这。1.5公里白沙滩配上广安大桥夜景，夏天游泳、冬天还能看北极熊冬泳赛——釜山头号海滩四季都不无聊。",
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
      "서울 왔으면 여기 인증샷은 국룰이죠. 남산 꼭대기에서 도시가 발 아래로 쫙 펼쳐지고, 해 지면 서울 전체가 보석함처럼 반짝여요. 케이블카·사랑의 자물쇠·인생 야경까지 한 방에.",
    summaryEn:
      "If you're in Seoul, this shot is basically mandatory. From the top of Namsan the whole city spreads out below you, and after dark Seoul glitters like a jewelry box. Cable car, love locks, and a killer night view — all in one.",
    summaryZh:
      "来首尔不来这打卡说不过去。站在南山之巅，整座城市在脚下铺展开来，入夜后首尔像打开的珠宝盒般闪耀。缆车、爱情锁、绝美夜景，一次全包。",
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
      "位于景福宫与昌德宫之间山坡上、真的有人居住的韩屋村。沿巷弄石阶爬上去回头一看，瓦顶层层叠叠间南山塔悄然入镜——这就是必拍的经典一张。但别忘了，这里是别人家的院子。",
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
      "5천 년 전 바닷속에서 '펑' 터진 화산이 만든 왕관 모양 분화구. 계단 20분이면 정상 찍고 우도까지 시원하게 눈에 담기는 제주 동쪽 최고 스팟인데, 일출 보러 가려면 새벽 기상은 국룰이에요.",
    summaryEn:
      "A crown-shaped crater born from an undersea eruption 5,000 years ago. Just 20 minutes of stairs gets you to the top with Udo island laid out below — Jeju's east-coast showstopper, though catching sunrise means setting an alarm you'll regret.",
    summaryZh:
      "5000年前海底火山一声「轰」隆炸出的王冠形火山口。爬20分钟阶梯登顶，牛岛就在眼前铺开——济州东部最强打卡地，只是想看日出，凌晨爬起来是躲不掉的仪式。",
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
      "전주 오면 한복 안 입고 못 배겨요. 800채 가까운 기와지붕이 다닥다닥 이어진 골목에 경기전·전동성당이 마주보고, 한 발짝만 나가면 전주비빔밥에 남부시장 야시장까지 — 하루가 순삭입니다.",
    summaryEn:
      "Come to Jeonju and you will end up in hanbok, guaranteed. Nearly 800 tile-roofed hanok pack the alleys, Gyeonggijeon and Jeondong Cathedral face off across the street, and one block over waits Jeonju bibimbap plus the Nambu Market night market — the day disappears fast.",
    summaryZh:
      "来全州，不租件韩服都说不过去。近800栋瓦顶韩屋挤满巷弄，庆基殿与殿洞圣堂隔街相望，再走一步就是全州拌饭和南部市场夜市——一天眨眼就没了。",
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
      "부산 산비탈에 파스텔빛 집들이 계단처럼 쌓인 동네, '한국의 마추픽추'라 불리는 데는 다 이유가 있어요. 골목마다 벽화·조형물이 숨어 있고, 그 유명한 어린왕자 포토존은 줄 설 각오 필수예요.",
    summaryEn:
      "Pastel houses stack up a Busan hillside like a staircase, and 'Korea's Machu Picchu' isn't just a cute nickname — it's earned. Murals and sculptures hide around every corner, and the famous Little Prince photo spot comes with a queue you should plan for.",
    summaryZh:
      "釜山山坡上，粉彩房屋像阶梯一样层层叠起，「韩国马丘比丘」这称号可不是白叫的。巷弄间藏着壁画与雕塑，那个著名的小王子拍照点，请做好排队的心理准备。",
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
    regionLabel: REGION_LABELS[a.region][locale],
    categoryLabel: CATEGORY_LABELS[a.category][locale],
  };
}
