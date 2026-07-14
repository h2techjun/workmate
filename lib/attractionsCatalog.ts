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
      "조선 왕조의 으뜸 궁궐. 광화문·근정전·경회루가 북악산을 배경으로 펼쳐지고, 한복을 입으면 입장료가 무료다.",
    summaryEn:
      "Korea's grandest Joseon-era palace. Gwanghwamun gate, Geunjeongjeon throne hall, and Gyeonghoeru pavilion sit under Bugaksan — and Hanbok gets you in free.",
    summaryZh:
      "朝鲜王朝的正宫。光化门、勤政殿、庆会楼在北岳山映衬下铺展开来，穿韩服可免费入场。",
    summaryVi:
      "Cung điện lớn nhất thời Joseon. Cổng Gwanghwamun, điện Geunjeongjeon và lầu Gyeonghoeru dưới chân núi Bugaksan — mặc Hanbok được vào miễn phí.",
    overviewKo: [
      "경복궁은 1395년 태조 이성계가 조선을 세우며 지은 법궁(法宮), 즉 나라를 대표하는 으뜸 궁궐입니다. 이름은 '큰 복을 누리라'는 뜻이에요. 임진왜란 때 불탔다가 흥선대원군이 1867년에 다시 세웠고, 일제강점기에 상당 부분이 헐렸던 것을 지금까지도 계속 복원하고 있습니다.",
      "정문인 광화문을 지나면 넓은 마당 끝에 근정전이 나옵니다. 왕의 즉위식과 국가 행사가 열리던 곳으로, 앞마당에 품계석(벼슬 등급을 새긴 돌)이 두 줄로 서 있어요. 뒤편의 경회루는 연못 위에 세운 2층 누각인데, 외국 사신을 맞이하고 잔치를 벌이던 자리라 사진 찍기에 가장 인기 있는 지점입니다.",
      "하루 두 번(오전·오후) 광화문 앞에서 수문장 교대의식이 열립니다. 조선시대 궁궐 경비 교대를 재현한 것으로, 색색의 전통 복식과 북소리가 볼 만해요. 시간표는 계절마다 조금씩 바뀌니 방문 전에 확인하는 게 좋습니다.",
      "가장 실속 있는 팁은 한복입니다. 한복을 입고 가면 입장료가 면제돼요. 지하철 3호선 경복궁역 5번 출구에서 바로 연결되고, 바로 옆에 국립고궁박물관과 국립민속박물관이 있어 함께 둘러보기 좋습니다.",
    ],
    overviewEn: [
      "Gyeongbokgung was built in 1395 when Yi Seong-gye founded the Joseon dynasty, and it served as the primary royal palace — the seat of the state. The name means 'palace greatly blessed by Heaven.' It burned down during the 1592 Japanese invasions, was rebuilt in 1867 by the regent Heungseon Daewongun, and much of it was demolished under Japanese colonial rule — restoration continues to this day.",
      "Past the main gate, Gwanghwamun, a broad courtyard leads to Geunjeongjeon, the throne hall where kings were crowned and state ceremonies held. Two rows of rank stones mark where officials once stood by seniority. Behind it, Gyeonghoeru is a two-story pavilion built over a pond, where royal banquets welcomed foreign envoys — it's the single most photographed spot in the palace.",
      "Twice a day the Royal Guard Changing Ceremony takes place at Gwanghwamun, re-enacting the changing of palace sentries with colorful period costumes and drums. Times shift slightly by season, so check before you go.",
      "The best money-saving tip: wear Hanbok. Traditional dress gets you in free. The palace connects directly to Exit 5 of Gyeongbokgung Station (Line 3), and the National Palace Museum and National Folk Museum sit right beside it for an easy combined visit.",
    ],
    overviewZh: [
      "景福宫建于1395年，李成桂建立朝鲜王朝时所修，是代表国家的正宫（法宫）。宫名寓意「享受洪福」。壬辰倭乱时被焚毁，1867年由兴宣大院君重建，日据时期大部分被拆除，至今仍在持续修复。",
      "穿过正门光化门，宽阔的庭院尽头便是勤政殿——举行国王即位礼和国家大典之处，殿前立有两排品阶石（刻着官阶的石柱）。其后的庆会楼是建于池塘之上的两层楼阁，曾用于接待外国使节和宴饮，是宫内最受欢迎的拍照点。",
      "每天两次（上午、下午）在光化门前举行守门将换岗仪式，再现朝鲜时代宫殿警卫换岗，五彩传统服饰与鼓声十分好看。时间表随季节略有变动，出发前请先确认。",
      "最实惠的贴士是韩服。穿韩服前往可免门票。景福宫与地铁3号线景福宫站5号出口直接相连，旁边就是国立古宫博物馆和国立民俗博物馆，适合一并游览。",
    ],
    overviewVi: [
      "Gyeongbokgung được xây năm 1395 khi Yi Seong-gye lập ra triều đại Joseon, là cung điện chính đại diện cho quốc gia. Tên cung mang nghĩa 'hưởng phúc lớn'. Cung bị thiêu rụi trong cuộc xâm lược của Nhật năm 1592, được nhiếp chính Heungseon Daewongun xây lại năm 1867, và bị phá bỏ phần lớn dưới thời thuộc địa Nhật — việc phục dựng vẫn tiếp tục đến nay.",
      "Qua cổng chính Gwanghwamun, sân rộng dẫn tới điện Geunjeongjeon, nơi vua đăng cơ và cử hành đại lễ. Hai hàng bia phẩm cấp đánh dấu chỗ đứng của các quan theo thứ bậc. Phía sau, lầu Gyeonghoeru hai tầng dựng trên hồ nước, từng đón tiếp sứ thần nước ngoài và mở tiệc — đây là điểm chụp ảnh được yêu thích nhất.",
      "Mỗi ngày hai lần, lễ đổi gác Cấm vệ quân diễn ra trước cổng Gwanghwamun, tái hiện việc đổi ca lính gác cung với trang phục cổ rực rỡ và tiếng trống. Giờ giấc thay đổi theo mùa, nên hãy kiểm tra trước khi đi.",
      "Mẹo tiết kiệm nhất: mặc Hanbok. Trang phục truyền thống được vào miễn phí. Cung nối thẳng với lối ra số 5 ga Gyeongbokgung (tuyến 3), và Bảo tàng Cung điện Quốc gia cùng Bảo tàng Dân gian Quốc gia nằm ngay bên cạnh để tham quan luôn.",
    ],
    tips: {
      ko: [
        "한복 착용 시 입장료 무료 — 근처에 한복 대여점이 많아요.",
        "수문장 교대의식은 보통 오전 10시·오후 2시(화요일 휴궁일 확인).",
        "지하철 3호선 경복궁역 5번 출구 바로 연결.",
        "국립고궁박물관·국립민속박물관과 묶어 반나절 코스로.",
      ],
      en: [
        "Free entry in Hanbok — plenty of rental shops nearby.",
        "Guard-changing ceremony usually 10:00 and 14:00 (palace closed Tuesdays).",
        "Directly linked to Exit 5, Gyeongbokgung Station (Line 3).",
        "Pair with the National Palace & Folk Museums for a half-day.",
      ],
      zh: [
        "穿韩服免门票——附近有很多韩服租赁店。",
        "守门将换岗仪式通常为上午10点、下午2点（周二闭馆需确认）。",
        "与地铁3号线景福宫站5号出口直接相连。",
        "可与国立古宫博物馆、民俗博物馆组成半日游。",
      ],
      vi: [
        "Mặc Hanbok được vào miễn phí — quanh đó có nhiều tiệm cho thuê.",
        "Lễ đổi gác thường lúc 10:00 và 14:00 (đóng cửa thứ Ba).",
        "Nối thẳng lối ra số 5 ga Gyeongbokgung (tuyến 3).",
        "Kết hợp Bảo tàng Cung điện & Dân gian cho nửa ngày.",
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
      "부산을 대표하는 1.5km 백사장. 여름 해수욕은 물론 사계절 야경·카페·회센터가 이어지고, 동백섬 산책로가 바로 옆이다.",
    summaryEn:
      "Busan's iconic 1.5km stretch of sand. Summer swimming, year-round night views, cafes and raw-fish markets — with the Dongbaekseom trail right next door.",
    summaryZh:
      "釜山标志性的1.5公里白沙滩。夏季游泳自不必说，四季夜景、咖啡馆、生鱼片中心一应俱全，旁边就是冬柏岛步道。",
    summaryVi:
      "Bãi cát dài 1,5km biểu tượng của Busan. Tắm biển mùa hè, ngắm cảnh đêm quanh năm, quán cà phê và chợ hải sản — ngay cạnh là đường mòn đảo Dongbaekseom.",
    overviewKo: [
      "해운대 해수욕장은 부산 동쪽 해안의 1.5km 백사장으로, 한국에서 여름철 방문객이 가장 많은 해변입니다. 이름은 통일신라의 학자 최치원이 이곳 동백섬 절벽에 '해운대(海雲臺)'라는 글자를 새겼다는 데서 유래했어요.",
      "여름 성수기에는 형형색색 파라솔이 백사장을 가득 채우지만, 사실 해운대는 사계절 명소입니다. 밤이 되면 마린시티와 광안대교의 불빛이 바다에 비쳐 야경 산책이 좋고, 백사장을 따라 카페와 횟집, 포장마차가 늘어서 있어요.",
      "해변 서쪽 끝의 동백섬은 지금은 육지와 이어진 작은 언덕으로, 해안 데크 산책로가 잘 놓여 있습니다. 누리마루 APEC 하우스와 등대를 지나며 광안대교를 정면으로 바라볼 수 있어요. 동쪽으로는 미포에서 출발하는 해변열차와 스카이캡슐이 옛 철길을 따라 청사포까지 이어집니다.",
      "부산 지하철 2호선 해운대역에서 걸어서 5분이면 백사장에 닿습니다. 매년 여름에는 부산바다축제, 겨울에는 북극곰 수영대회 같은 행사가 열려요.",
    ],
    overviewEn: [
      "Haeundae is a 1.5km beach on Busan's eastern coast and the most visited summer beach in Korea. The name comes from Choi Chi-won, a scholar of the Unified Silla era, who is said to have carved the characters 'Haeundae' into the cliffs of nearby Dongbaekseom.",
      "In peak summer the sand fills with rows of colorful parasols, but Haeundae is really a year-round destination. At night the lights of Marine City and Gwangan Bridge reflect off the water for a lovely seaside walk, and cafes, raw-fish restaurants, and street-food tents line the shore.",
      "At the western end, Dongbaekseom — now a small hill joined to the mainland — has a well-built coastal boardwalk. Passing Nurimaru APEC House and a lighthouse, you get a head-on view of Gwangan Bridge. To the east, the Haeundae Blueline Park beach train and Sky Capsule run along old rail tracks from Mipo to Cheongsapo.",
      "It's a 5-minute walk from Haeundae Station (Busan Metro Line 2) to the sand. The Busan Sea Festival is held here each summer, and the Polar Bear Swim in winter.",
    ],
    overviewZh: [
      "海云台海水浴场是釜山东海岸长1.5公里的白沙滩，是韩国夏季游客最多的海滩。名称源自统一新罗学者崔致远，据说他曾在附近冬柏岛的崖壁上刻下「海云台」三字。",
      "盛夏时节，沙滩上五彩阳伞排成一片，但海云台其实是四季皆宜的景点。入夜后，Marine City与广安大桥的灯光倒映海面，适合海边夜游，沿岸咖啡馆、生鱼片店和路边摊林立。",
      "沙滩西端的冬柏岛如今是与陆地相连的小丘，海岸木栈道十分完善。途经Nurimaru APEC世妍馆和灯塔，可正面眺望广安大桥。向东则有海云台Blueline Park海边小火车和天空胶囊列车，沿旧铁路从尾浦通往青沙浦。",
      "从釜山地铁2号线海云台站步行5分钟即达沙滩。每年夏天在此举办釜山海洋节，冬天则有北极熊冬泳大赛。",
    ],
    overviewVi: [
      "Haeundae là bãi biển dài 1,5km ở bờ đông Busan và là bãi biển đông khách nhất Hàn Quốc vào mùa hè. Tên gọi bắt nguồn từ Choi Chi-won, học giả thời Silla Thống nhất, người được cho là đã khắc chữ 'Haeundae' lên vách đá đảo Dongbaekseom gần đó.",
      "Cao điểm hè, bãi cát phủ kín ô dù đủ màu, nhưng Haeundae thực ra là điểm đến quanh năm. Về đêm, ánh đèn Marine City và cầu Gwangan phản chiếu trên mặt nước tạo nên lối dạo biển tuyệt đẹp, hai bên bờ là quán cà phê, quán hải sản sống và hàng ăn vặt.",
      "Ở đầu phía tây, đảo Dongbaekseom — nay là ngọn đồi nhỏ nối với đất liền — có đường ván ven biển được xây dựng tốt. Qua Nhà APEC Nurimaru và ngọn hải đăng, bạn nhìn thẳng ra cầu Gwangan. Về phía đông, tàu biển Blueline Park và Sky Capsule chạy dọc đường ray cũ từ Mipo tới Cheongsapo.",
      "Đi bộ 5 phút từ ga Haeundae (tuyến 2 tàu điện Busan) là tới bãi cát. Lễ hội Biển Busan tổ chức tại đây mỗi hè, và cuộc thi bơi Gấu Bắc Cực vào mùa đông.",
    ],
    tips: {
      ko: [
        "지하철 2호선 해운대역 도보 5분.",
        "동백섬 해안 데크에서 광안대교 정면 뷰.",
        "미포~청사포 해변열차·스카이캡슐로 해안 드라이브 대신.",
        "여름 성수기엔 파라솔·튜브 대여가 편리.",
      ],
      en: [
        "5-min walk from Haeundae Station (Line 2).",
        "Dongbaekseom boardwalk gives a front view of Gwangan Bridge.",
        "Take the Mipo–Cheongsapo beach train / Sky Capsule for the coast.",
        "In peak summer, parasol and tube rentals are handy.",
      ],
      zh: [
        "地铁2号线海云台站步行5分钟。",
        "冬柏岛海岸木栈道可正面观赏广安大桥。",
        "可乘尾浦—青沙浦海边小火车/天空胶囊沿海观光。",
        "盛夏时租阳伞、游泳圈很方便。",
      ],
      vi: [
        "Đi bộ 5 phút từ ga Haeundae (tuyến 2).",
        "Đường ván đảo Dongbaekseom nhìn thẳng cầu Gwangan.",
        "Đi tàu biển Mipo–Cheongsapo / Sky Capsule ngắm bờ biển.",
        "Cao điểm hè nên thuê ô dù và phao bơi.",
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
      "경복궁과 창덕궁 사이 언덕에 자리한 조선시대 한옥 마을. 골목마다 기와지붕이 겹쳐지는 '북촌8경'이 유명하지만, 실제 주민이 사는 곳이라 조용히 둘러봐야 해요.",
    summaryEn:
      "A Joseon-era hanok neighborhood on the hill between Gyeongbokgung and Changdeokgung. Famous for its tiled-roof alleys ('Bukchon's 8 views') — but people live here, so explore quietly.",
    summaryZh:
      "坐落于景福宫与昌德宫之间山坡上的朝鲜时代韩屋村。以层叠瓦顶的「北村八景」闻名，但这里有居民实际居住，请安静游览。",
    summaryVi:
      "Khu hanok thời Joseon trên đồi giữa Gyeongbokgung và Changdeokgung. Nổi tiếng với những con hẻm mái ngói ('8 cảnh Bukchon') — nhưng có người dân sinh sống, hãy tham quan nhẹ nhàng.",
    overviewKo: [
      "북촌한옥마을은 경복궁과 창덕궁, 종묘 사이의 언덕에 형성된 전통 주거지로, 조선시대에는 왕족과 고위 관료가 살던 동네였습니다. 지금도 600채가 넘는 한옥이 밀집해 있어 서울 도심에서 옛 골목 풍경을 그대로 만날 수 있어요.",
      "가장 유명한 곳은 가회동 11번지 일대의 경사진 골목입니다. 언덕을 오르며 뒤돌아보면 한옥 기와지붕 너머로 남산타워가 겹쳐 보이는 풍경이 펼쳐져, 사진 명소로 손꼽힙니다. 이런 대표 전망 여덟 곳을 '북촌8경'이라 부릅니다.",
      "다만 이곳은 관광지이기 이전에 실제 사람들이 사는 삶의 터전입니다. 이른 아침이나 늦은 밤 큰 소리는 삼가고, 대문 안을 들여다보거나 무단으로 들어가지 않는 것이 예의예요. 근처 삼청동 카페거리와 인사동까지 걸어서 이어 둘러보기 좋습니다.",
    ],
    overviewEn: [
      "Bukchon Hanok Village is a traditional residential quarter on the hill between Gyeongbokgung, Changdeokgung, and Jongmyo — home to royalty and high officials in the Joseon era. Over 600 hanok still stand densely here, preserving old-alley scenery in central Seoul.",
      "Its most famous spot is the sloped alley around Gahoe-dong 11. Climbing the hill and looking back, you'll see tiled hanok roofs layered against Namsan Tower — one of the city's iconic photo scenes. Eight such vantage points are known as 'Bukchon's 8 views.'",
      "But this is a living neighborhood before it is an attraction. Keep noise down in the early morning and late evening, and don't peek into or enter homes uninvited. It pairs nicely on foot with the Samcheong-dong cafe street and Insa-dong nearby.",
    ],
    overviewZh: [
      "北村韩屋村是位于景福宫、昌德宫与宗庙之间山坡上的传统住宅区，朝鲜时代曾是王族与高官的居所。如今仍密集保存着600多栋韩屋，在首尔市中心留住了old巷弄风景。",
      "最著名的是嘉会洞11番地一带的坡道小巷。登上山坡回望，韩屋瓦顶层层叠叠映衬着南山塔，是首尔的标志性拍照场景。这样的八处代表景致被称为「北村八景」。",
      "但这里首先是居民生活的家园，其次才是景点。清晨与深夜请勿喧哗，切勿窥视或擅入民宅。可步行串联附近的三清洞咖啡街与仁寺洞一并游览。",
    ],
    overviewVi: [
      "Làng Hanok Bukchon là khu dân cư truyền thống trên đồi giữa Gyeongbokgung, Changdeokgung và Jongmyo — nơi ở của hoàng tộc và quan lại cao cấp thời Joseon. Hơn 600 ngôi hanok vẫn san sát ở đây, giữ lại cảnh hẻm xưa giữa trung tâm Seoul.",
      "Nổi tiếng nhất là con hẻm dốc quanh Gahoe-dong 11. Leo lên đồi rồi ngoảnh lại, bạn sẽ thấy những mái ngói hanok xếp lớp trên nền tháp Namsan — một trong những khung hình biểu tượng của thành phố. Tám điểm ngắm như vậy được gọi là '8 cảnh Bukchon'.",
      "Nhưng trước khi là điểm tham quan, đây là nơi sinh sống thực sự. Hãy giữ yên lặng vào sáng sớm và tối muộn, đừng nhìn vào hay tự ý bước vào nhà dân. Có thể đi bộ nối liền phố cà phê Samcheong-dong và Insa-dong gần đó.",
    ],
    tips: {
      ko: [
        "지하철 3호선 안국역 2번 출구에서 도보로 진입.",
        "실거주지 — 정숙, 사유지 무단출입 금지.",
        "가회동 언덕에서 한옥+남산타워 뷰가 대표 포토존.",
        "삼청동·인사동과 도보로 연계.",
      ],
      en: [
        "Enter on foot from Exit 2, Anguk Station (Line 3).",
        "A residential area — stay quiet, don't enter private property.",
        "The Gahoe-dong slope frames hanok + Namsan Tower.",
        "Walkable with Samcheong-dong and Insa-dong.",
      ],
      zh: [
        "地铁3号线安国站2号出口步行进入。",
        "居民区——请安静，勿擅入私宅。",
        "嘉会洞坡道是韩屋+南山塔的经典机位。",
        "可步行串联三清洞、仁寺洞。",
      ],
      vi: [
        "Vào bằng đường bộ từ lối ra 2, ga Anguk (tuyến 3).",
        "Khu dân cư — giữ yên lặng, không vào nhà riêng.",
        "Dốc Gahoe-dong là góc chụp hanok + tháp Namsan.",
        "Đi bộ nối với Samcheong-dong và Insa-dong.",
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
      "약 5천 년 전 바다 속 화산 폭발로 솟은 제주 동쪽의 거대한 분화구. 유네스코 세계자연유산이며, 정상까지 20분이면 올라 사발 모양 분화구와 일출을 볼 수 있어요.",
    summaryEn:
      "A giant tuff crater on Jeju's east coast, born of an undersea eruption ~5,000 years ago. A UNESCO World Heritage site — 20 minutes up to see the bowl-shaped crater and sunrise.",
    summaryZh:
      "约5000年前海底火山喷发形成的济州东部巨型火山口。联合国教科文组织世界自然遗产，登顶仅20分钟，可观碗状火山口与日出。",
    summaryVi:
      "Miệng núi lửa khổng lồ ở bờ đông Jeju, hình thành từ vụ phun trào dưới biển ~5.000 năm trước. Di sản Thiên nhiên Thế giới UNESCO — leo 20 phút để ngắm miệng núi hình bát và bình minh.",
    overviewKo: [
      "성산일출봉은 제주도 동쪽 끝에 솟은 높이 182m의 화산체로, 약 5천 년 전 얕은 바다에서 마그마가 분출하며 만들어졌습니다. 꼭대기에는 지름 600m에 이르는 거대한 사발 모양 분화구가 있고, 99개의 뾰족한 바위 봉우리가 왕관처럼 분화구를 둘러싸고 있어요. 2007년 유네스코 세계자연유산으로 등재됐습니다.",
      "이름 그대로 '해가 뜨는 봉우리'로, 분화구 능선 너머로 떠오르는 일출이 장관입니다. 정상까지는 계단을 따라 20~30분이면 오를 수 있어 남녀노소 도전할 만하고, 오르는 길 내내 성산포 바다와 우도가 시원하게 펼쳐집니다.",
      "봉우리 아래 광치기해변에서는 썰물 때 드러나는 초록빛 이끼 바위와 성산일출봉을 함께 담을 수 있어 사진가들에게 인기입니다. 근처 우도로 가는 배편도 있어 함께 묶어 여행하기 좋아요.",
    ],
    overviewEn: [
      "Seongsan Ilchulbong is a 182m volcanic cone at Jeju's eastern tip, formed when magma erupted in shallow sea about 5,000 years ago. Its summit holds a vast bowl-shaped crater some 600m across, ringed by 99 jagged rock peaks like a crown. It was inscribed as a UNESCO World Heritage site in 2007.",
      "True to its name — 'Sunrise Peak' — the sun rising over the crater ridge is a spectacle. The stair path to the top takes just 20–30 minutes, doable for most ages, with sweeping views of Seongsan harbor and Udo island the whole way up.",
      "At Gwangchigi Beach below, low tide reveals green mossy rocks you can frame with the peak — a photographer favorite. Ferries to nearby Udo island make it easy to combine into one trip.",
    ],
    overviewZh: [
      "城山日出峰是位于济州岛最东端、高182米的火山体，约5000年前岩浆在浅海喷发而成。峰顶有直径约600米的巨型碗状火山口，99座尖峭岩峰如王冠般环绕。2007年被列入联合国教科文组织世界自然遗产。",
      "正如其名「日出峰」，太阳从火山口山脊升起的景象十分壮观。沿阶梯登顶仅需20—30分钟，老少皆宜，一路可饱览城山浦海面与牛岛风光。",
      "峰下的光致其海边退潮时露出绿色苔石，可与日出峰同框，深受摄影爱好者喜爱。附近有开往牛岛的渡轮，适合一并游览。",
    ],
    overviewVi: [
      "Seongsan Ilchulbong là nón núi lửa cao 182m ở mũi đông Jeju, hình thành khi magma phun trào ở vùng biển nông khoảng 5.000 năm trước. Đỉnh là miệng núi hình bát rộng chừng 600m, viền quanh bởi 99 chóp đá lởm chởm như vương miện. Được UNESCO công nhận Di sản Thế giới năm 2007.",
      "Đúng như tên gọi 'Đỉnh Bình Minh', cảnh mặt trời mọc trên vành miệng núi thật ngoạn mục. Đường bậc thang lên đỉnh chỉ mất 20–30 phút, hợp với mọi lứa tuổi, suốt đường ngắm cảng Seongsan và đảo Udo.",
      "Bãi biển Gwangchigi dưới chân núi, khi thủy triều xuống lộ ra những tảng đá phủ rêu xanh có thể lấy khung cùng đỉnh núi — được nhiếp ảnh gia yêu thích. Có phà sang đảo Udo gần đó để kết hợp chuyến đi.",
    ],
    tips: {
      ko: [
        "정상까지 계단 20~30분 — 편한 신발 권장.",
        "일출이 백미지만 낮에도 분화구·바다 전망 훌륭.",
        "아래 광치기해변(썰물)에서 이끼바위+봉우리 사진.",
        "우도행 배편과 묶어 동부 코스로.",
      ],
      en: [
        "20–30 min of stairs to the top — wear comfy shoes.",
        "Sunrise is best, but daytime crater and sea views are great too.",
        "Photograph mossy rocks + peak at Gwangchigi Beach (low tide).",
        "Combine with a ferry to Udo island for an east-coast day.",
      ],
      zh: [
        "登顶阶梯约20—30分钟，建议穿舒适鞋。",
        "日出最佳，白天火山口与海景也极好。",
        "峰下光致其海边（退潮）可拍苔石+日出峰。",
        "可与牛岛渡轮组成东部一日游。",
      ],
      vi: [
        "Leo bậc thang 20–30 phút lên đỉnh — nên đi giày thoải mái.",
        "Bình minh đẹp nhất, nhưng ban ngày ngắm miệng núi và biển cũng tuyệt.",
        "Chụp đá rêu + đỉnh núi ở bãi Gwangchigi (lúc triều xuống).",
        "Kết hợp phà sang đảo Udo cho ngày ở bờ đông.",
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
      "700여 채의 한옥이 모인 전주의 대표 관광지. 조선 왕조의 뿌리인 경기전, 아름다운 전동성당, 한복 대여와 비빔밥·길거리 먹거리까지 하루가 알차요.",
    summaryEn:
      "Jeonju's signature district of some 700 hanok. Gyeonggijeon shrine (roots of the Joseon dynasty), the lovely Jeondong Cathedral, hanbok rentals, and bibimbap and street food fill a full day.",
    summaryZh:
      "汇聚约700栋韩屋的全州招牌景区。朝鲜王朝之根的庆基殿、优美的殿洞圣堂、韩服租赁与拌饭·街头美食，一天充实满满。",
    summaryVi:
      "Khu tiêu biểu của Jeonju với khoảng 700 ngôi hanok. Đền Gyeonggijeon (cội nguồn triều Joseon), Nhà thờ Jeondong xinh đẹp, cho thuê hanbok cùng bibimbap và món ăn đường phố lấp đầy cả ngày.",
    overviewKo: [
      "전주한옥마을은 도심 한복판에 700채가 넘는 한옥이 모여 있는 곳으로, 일제강점기에 전주 사람들이 자존심으로 한옥촌을 이루며 형성됐습니다. 골목마다 한옥 카페·공방·게스트하우스가 들어서 전통과 현대가 자연스럽게 섞여 있어요.",
      "마을의 중심에는 경기전이 있습니다. 조선을 세운 태조 이성계의 초상화(어진)를 모신 곳으로, 전주가 전주 이씨의 본향이라 특별한 의미가 있어요. 바로 앞에는 로마네스크·비잔틴 양식이 어우러진 아름다운 전동성당이 마주 보고 서 있어 함께 둘러보기 좋습니다.",
      "전주는 '음식의 도시'답게 먹거리가 풍성합니다. 전주비빔밥과 콩나물국밥은 물론, 한옥마을 골목의 문어꼬치·수제 초코파이 같은 길거리 간식도 인기예요. 한복을 대여해 입고 골목과 오목대를 거닐면 사진도, 분위기도 배가됩니다.",
    ],
    overviewEn: [
      "Jeonju Hanok Village gathers over 700 hanok in the middle of the city, formed when locals built a hanok quarter as a matter of pride during the Japanese colonial period. Its alleys now blend tradition and today, lined with hanok cafes, craft workshops, and guesthouses.",
      "At its heart is Gyeonggijeon, the shrine housing the portrait of Taejo Yi Seong-gye, founder of Joseon — especially meaningful as Jeonju is the ancestral home of the Jeonju Yi clan. Facing it stands the beautiful Jeondong Cathedral, blending Romanesque and Byzantine styles, perfect to see together.",
      "As a 'city of food,' Jeonju delivers: the famous Jeonju bibimbap and bean-sprout soup, plus street snacks like octopus skewers and handmade choco pies in the village alleys. Rent a hanbok to stroll the lanes and Omokdae for photos — and the mood.",
    ],
    overviewZh: [
      "全州韩屋村在市中心汇聚了700多栋韩屋，日据时期当地人以此为傲建起韩屋聚落而形成。如今巷弄间韩屋咖啡馆、工坊、民宿林立，传统与现代自然交融。",
      "村落中心是庆基殿，供奉着开创朝鲜的太祖李成桂画像（御真）；全州为全州李氏的本乡，意义非凡。正对面矗立着融合罗马式与拜占庭风格的优美殿洞圣堂，宜一并参观。",
      "全州不愧为「美食之城」，全州拌饭、豆芽汤饭自不必说，韩屋村巷内的章鱼串、手工巧克力派等街头小吃也很受欢迎。租一套韩服漫步巷弄与梧木台，拍照与氛围俱佳。",
    ],
    overviewVi: [
      "Làng Hanok Jeonju quy tụ hơn 700 ngôi hanok giữa trung tâm thành phố, hình thành khi người dân dựng nên khu hanok như một niềm tự hào thời thuộc địa Nhật. Các con hẻm nay hòa quyện truyền thống và hiện đại, san sát quán cà phê hanok, xưởng thủ công và nhà nghỉ.",
      "Trung tâm là đền Gyeonggijeon, nơi lưu giữ chân dung Taejo Yi Seong-gye, người sáng lập Joseon — càng ý nghĩa vì Jeonju là quê tổ của dòng họ Yi Jeonju. Đối diện là Nhà thờ Jeondong xinh đẹp pha trộn kiến trúc Romanesque và Byzantine, nên xem cùng lúc.",
      "Là 'thành phố ẩm thực', Jeonju có bibimbap Jeonju và canh giá đỗ trứ danh, cùng món đường phố như xiên bạch tuộc và bánh choco pie thủ công trong hẻm làng. Thuê một bộ hanbok dạo hẻm và Omokdae để có ảnh đẹp — và không khí.",
    ],
    tips: {
      ko: [
        "경기전+전동성당은 마주 보고 있어 함께.",
        "한복 대여 시 경기전 입장 할인 혜택이 있는 경우도.",
        "전주비빔밥·콩나물국밥·길거리 간식은 필수.",
        "KTX 전주역/전주고속버스터미널에서 시내버스로.",
      ],
      en: [
        "Gyeonggijeon and Jeondong Cathedral face each other — see both.",
        "Hanbok rental sometimes gives a Gyeonggijeon entry discount.",
        "Don't miss Jeonju bibimbap, bean-sprout soup, and street snacks.",
        "From Jeonju KTX/bus terminal, take a city bus in.",
      ],
      zh: [
        "庆基殿与殿洞圣堂正对，宜一并参观。",
        "租韩服有时可享庆基殿入场优惠。",
        "全州拌饭、豆芽汤饭与街头小吃不容错过。",
        "从全州KTX站/高速巴士站换乘市内巴士。",
      ],
      vi: [
        "Gyeonggijeon và Nhà thờ Jeondong đối diện nhau — xem cả hai.",
        "Thuê hanbok đôi khi được giảm vé vào Gyeonggijeon.",
        "Đừng bỏ lỡ bibimbap Jeonju, canh giá đỗ và món đường phố.",
        "Từ ga KTX/bến xe Jeonju, đi xe buýt nội thành.",
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
      "산비탈을 따라 파스텔빛 집들이 계단처럼 쌓인 부산의 마을. '한국의 마추픽추'로 불리며, 골목마다 벽화와 예술 작품, 어린왕자 조형물이 숨어 있어요.",
    summaryEn:
      "A Busan hillside where pastel houses stack like steps. Nicknamed 'Korea's Machu Picchu,' its alleys hide murals, art installations, and a Little Prince statue.",
    summaryZh:
      "沿山坡如阶梯般层叠的釜山彩色房屋村落。有「韩国马丘比丘」之称，巷弄间藏着壁画、艺术作品与小王子雕塑。",
    summaryVi:
      "Sườn đồi Busan nơi những ngôi nhà pastel xếp chồng như bậc thang. Được gọi là 'Machu Picchu của Hàn Quốc', các con hẻm giấu tranh tường, tác phẩm nghệ thuật và tượng Hoàng tử Bé.",
    overviewKo: [
      "감천문화마을은 부산 사하구의 가파른 산비탈에 형성된 마을로, 6·25 전쟁 피란민과 태극도 신자들이 모여 살며 만들어졌습니다. 산자락을 따라 집들이 계단식으로 촘촘히 들어서 있고, 뒷집의 시야를 가리지 않도록 지붕 높이를 맞춘 독특한 구조가 특징이에요.",
      "2009년부터 예술가와 주민이 함께 벽화를 그리고 빈집을 갤러리·공방으로 바꾸는 마을 재생 프로젝트가 진행되면서, 지금은 부산을 대표하는 문화 관광지가 됐습니다. 알록달록한 파스텔 집들이 언덕을 뒤덮은 풍경 덕에 '한국의 마추픽추', '부산의 산토리니'라는 별명이 붙었어요.",
      "골목을 걸으며 벽화와 조형물을 찾는 재미가 큽니다. 마을을 내려다보는 '어린왕자와 사막여우' 조형물 앞은 가장 인기 있는 포토존이라 줄을 서기도 해요. 다만 여전히 주민이 사는 마을이니 골목에서는 조용히, 사유지는 존중해 주세요.",
    ],
    overviewEn: [
      "Gamcheon Culture Village rose on a steep hillside in Busan's Saha-gu, built up by Korean War refugees and members of the Taegukdo faith. Houses cluster in tight terraces down the slope, their roof heights aligned so no home blocks the view behind it — a distinctive layout.",
      "Since 2009, an urban-regeneration project has seen artists and residents paint murals and turn empty houses into galleries and studios, making it one of Busan's signature cultural attractions. The blanket of colorful pastel homes earned it nicknames like 'Korea's Machu Picchu' and 'Busan's Santorini.'",
      "Half the fun is hunting for murals and sculptures through the lanes. The 'Little Prince and the Fox' statue overlooking the village is the most popular photo spot, sometimes with a queue. It's still a lived-in community, so keep quiet in the alleys and respect private property.",
    ],
    overviewZh: [
      "甘川文化村坐落于釜山沙下区陡峭的山坡上，由朝鲜战争难民与太极道信徒聚居而成。房屋沿坡地紧密层叠，屋顶高度相互错落，使后排住户视线不被遮挡，结构独特。",
      "自2009年起，艺术家与居民携手绘制壁画、将空屋改造为画廊与工坊的社区再生项目使其成为釜山代表性文化景点。五彩缤纷的粉彩房屋铺满山丘，因而得名「韩国马丘比丘」「釜山圣托里尼」。",
      "沿巷寻找壁画与雕塑乐趣十足。俯瞰村落的「小王子与沙漠狐狸」雕塑前是最热门的拍照点，有时需排队。这里仍有居民居住，请在巷弄间保持安静、尊重私宅。",
    ],
    overviewVi: [
      "Làng Văn hóa Gamcheon mọc lên trên sườn dốc ở Saha-gu, Busan, do người tị nạn Chiến tranh Triều Tiên và tín đồ Taegukdo dựng nên. Nhà cửa xếp chồng thành bậc dày đặc xuống dốc, chiều cao mái được canh sao cho nhà sau không bị che khuất — một bố cục độc đáo.",
      "Từ năm 2009, dự án tái sinh đô thị với nghệ sĩ và cư dân cùng vẽ tranh tường, biến nhà trống thành phòng tranh và xưởng, đã đưa nơi đây thành điểm văn hóa tiêu biểu của Busan. Những ngôi nhà pastel rực rỡ phủ kín đồi khiến nó có biệt danh 'Machu Picchu của Hàn Quốc', 'Santorini của Busan'.",
      "Nửa niềm vui là đi tìm tranh tường và tượng qua các con hẻm. Bức tượng 'Hoàng tử Bé và con cáo' nhìn xuống làng là điểm chụp ảnh nổi tiếng nhất, đôi khi phải xếp hàng. Đây vẫn là cộng đồng có người sống, nên giữ yên lặng trong hẻm và tôn trọng nhà riêng.",
    ],
    tips: {
      ko: [
        "지하철 1호선 토성역 → 마을버스(사하구 2·2-2)로 언덕 위까지.",
        "가파른 계단·골목 많음 — 편한 신발 필수.",
        "'어린왕자' 포토존은 대기 줄 있을 수 있음.",
        "주민 거주지 — 정숙, 사유지 존중.",
      ],
      en: [
        "Toseong Station (Line 1) → village bus (Saha 2 / 2-2) up the hill.",
        "Lots of steep steps and alleys — wear comfy shoes.",
        "The 'Little Prince' photo spot may have a queue.",
        "A lived-in neighborhood — stay quiet, respect private homes.",
      ],
      zh: [
        "地铁1号线土城站→社区巴士（沙下2/2-2）上山。",
        "陡坡阶梯与巷弄多，务必穿舒适鞋。",
        "「小王子」拍照点可能需排队。",
        "居民区——请安静、尊重私宅。",
      ],
      vi: [
        "Ga Toseong (tuyến 1) → xe buýt làng (Saha 2 / 2-2) lên đồi.",
        "Nhiều bậc dốc và hẻm — nên đi giày thoải mái.",
        "Điểm chụp 'Hoàng tử Bé' có thể phải xếp hàng.",
        "Khu dân cư — giữ yên lặng, tôn trọng nhà riêng.",
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
