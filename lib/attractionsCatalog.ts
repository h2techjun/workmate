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
