import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft, ArrowRight, Globe } from "lucide-react";
import { locales, type Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { BreadcrumbJsonLd, FaqJsonLd } from "@/components/seo/StructuredData";

interface PageProps {
  params: Promise<{ locale: string }>;
}

function localeKeyOf(locale: string): Locale {
  if (locale === "ko") return "ko";
  if (locale === "zh") return "zh";
  if (locale === "vi") return "vi";
  return "en";
}

/* ────────────────────────────────────────────────────────────
 * 비자 유형 요약 (제도 → 대상)
 * ──────────────────────────────────────────────────────────── */
interface VisaType {
  code: string;
  name: Record<Locale, string>;
  who: Record<Locale, string>;
}

const VISA_TYPES: ReadonlyArray<VisaType> = [
  {
    code: "E-9 (EPS)",
    name: {
      ko: "고용허가제 · 비전문취업",
      en: "Employment Permit System",
      zh: "雇佣许可制 · 非专业就业",
      vi: "Chế độ cấp phép lao động",
    },
    who: {
      ko: "17개 송출국 출신 제조·농축산·어업·건설 근로자",
      en: "Manufacturing / farming / fishing / construction workers from the 17 sending countries",
      zh: "来自17个派遣国的制造·农畜·渔业·建筑工人",
      vi: "Lao động sản xuất / nông nghiệp / ngư nghiệp / xây dựng từ 17 nước phái cử",
    },
  },
  {
    code: "E-7",
    name: {
      ko: "특정활동 · 전문/숙련직",
      en: "Specific Activity · professionals",
      zh: "特定活动 · 专业/熟练职",
      vi: "Hoạt động đặc định · chuyên môn",
    },
    who: {
      ko: "IT·엔지니어·연구원 등 전문인력과 숙련기능인력",
      en: "IT, engineers, researchers and skilled tradespeople",
      zh: "IT·工程师·研究员等专业人才与熟练技能人才",
      vi: "IT, kỹ sư, nhà nghiên cứu và lao động lành nghề",
    },
  },
  {
    code: "E-8",
    name: {
      ko: "계절근로",
      en: "Seasonal work",
      zh: "季节工",
      vi: "Lao động thời vụ",
    },
    who: {
      ko: "농·어업 단기 인력 (최대 8개월)",
      en: "Short-term farm/fishing labor (up to 8 months)",
      zh: "农·渔业短期人力(最长8个月)",
      vi: "Lao động nông/ngư nghiệp ngắn hạn (tối đa 8 tháng)",
    },
  },
  {
    code: "F-4",
    name: {
      ko: "재외동포",
      en: "Overseas Korean",
      zh: "在外同胞",
      vi: "Kiều bào Hàn Quốc",
    },
    who: {
      ko: "조선족·고려인 등 한국계 혈통 (2026.2 H-2 통합)",
      en: "Ethnic Koreans — Joseonjok, Koryo-saram (H-2 merged into F-4 in Feb 2026)",
      zh: "朝鲜族·高丽人等韩国血统(2026.2 H-2并入)",
      vi: "Người gốc Hàn — Joseonjok, Koryo-saram (H-2 gộp vào F-4, 2/2026)",
    },
  },
  {
    code: "D-2 / D-4",
    name: {
      ko: "유학 / 어학연수",
      en: "Study / language training",
      zh: "留学 / 语言研修",
      vi: "Du học / học tiếng",
    },
    who: {
      ko: "대학 학위과정(D-2)·대학부설 어학원(D-4)",
      en: "Degree programs (D-2) and university language institutes (D-4)",
      zh: "大学学位课程(D-2)·大学附属语学院(D-4)",
      vi: "Chương trình cấp bằng (D-2) và viện ngôn ngữ đại học (D-4)",
    },
  },
  {
    code: "E-2",
    name: {
      ko: "회화지도",
      en: "Conversation instruction",
      zh: "会话指导",
      vi: "Giảng dạy hội thoại",
    },
    who: {
      ko: "영어권 국민 대상 어학 강사",
      en: "Language instructors, mainly from English-speaking countries",
      zh: "面向英语圈国民的语言讲师",
      vi: "Giáo viên ngôn ngữ, chủ yếu từ các nước nói tiếng Anh",
    },
  },
  {
    code: "Top-Tier",
    name: {
      ko: "첨단분야 우수인재",
      en: "Top-Tier (advanced fields)",
      zh: "尖端领域优秀人才",
      vi: "Nhân tài lĩnh vực công nghệ cao",
    },
    who: {
      ko: "반도체·바이오·2차전지 등 (영주 F-5 3년 단축)",
      en: "Semiconductor, bio, battery talent — F-5 permanent residence in 3 years",
      zh: "半导体·生物·二次电池等(永住F-5缩短至3年)",
      vi: "Nhân tài bán dẫn, sinh học, pin — thường trú F-5 sau 3 năm",
    },
  },
];

/* ────────────────────────────────────────────────────────────
 * 국가별 경로 (마스터 지침 핵심: 어느 나라인 → 어떤 비자)
 * ──────────────────────────────────────────────────────────── */
interface CountryRoute {
  key: string;
  flag: string;
  name: Record<Locale, string>;
  tags: ReadonlyArray<string>;
  paras: Record<Locale, ReadonlyArray<string>>;
}

const COUNTRIES: ReadonlyArray<CountryRoute> = [
  {
    key: "india",
    flag: "🇮🇳",
    name: { ko: "인도", en: "India", zh: "印度", vi: "Ấn Độ" },
    tags: ["E-7", "Top-Tier", "D-2", "CEPA"],
    paras: {
      ko: [
        "인도는 EPS(고용허가제) 송출국이 아닙니다. 즉 인도 국적자는 E-9 비자로 한국에서 일할 수 없습니다. 대신 전문직 경로가 중심입니다.",
        "주된 길은 E-7-1 전문인력 비자입니다. IT 개발자·엔지니어·연구원이 판교 테크노밸리나 강남 IT 기업에 채용되는 사례가 많습니다. 한-인도 CEPA(포괄적경제동반자협정)로 소프트웨어 등 163개 직종에서 취업이 가능합니다.",
        "반도체·바이오 등 첨단분야 인재는 Top-Tier 비자로 영주(F-5)를 3년 만에 노릴 수 있고, 유학(D-2) 후 국내 취업으로 전환하는 경로도 넓습니다.",
      ],
      en: [
        "India is not an EPS sending country, so Indian nationals cannot work in Korea on the E-9 labor visa. The skilled routes are the way in.",
        "The main path is the E-7-1 professional visa. IT developers, engineers and researchers are frequently hired into Pangyo Techno Valley or Gangnam tech firms. Under the Korea–India CEPA, Indians can work in 163 occupations including software roles.",
        "Talent in semiconductors or biotech can target the Top-Tier visa, which shortens permanent residence (F-5) to three years, and studying on a D-2 then converting to employment is a well-worn route.",
      ],
      zh: [
        "印度不是EPS(雇佣许可制)派遣国,因此印度国籍者无法以E-9签证在韩国工作,专业职路径才是入口。",
        "主要途径是E-7-1专业人才签证。IT开发者·工程师·研究员常被板桥科技谷或江南IT企业录用。依据韩印CEPA(全面经济伙伴协定),印度人可在软件等163个职种就业。",
        "半导体·生物等尖端领域人才可瞄准Top-Tier签证,将永住(F-5)缩短至3年;留学(D-2)后转为国内就业的路径也很宽。",
      ],
      vi: [
        "Ấn Độ không phải nước phái cử EPS, nên công dân Ấn Độ không thể làm việc tại Hàn Quốc bằng visa lao động E-9. Con đường dành cho lao động chuyên môn.",
        "Con đường chính là visa chuyên môn E-7-1. Lập trình viên IT, kỹ sư và nhà nghiên cứu thường được tuyển vào Pangyo Techno Valley hoặc các công ty công nghệ ở Gangnam. Theo CEPA Hàn–Ấn, người Ấn có thể làm việc trong 163 ngành nghề gồm cả phần mềm.",
        "Nhân tài bán dẫn hay công nghệ sinh học có thể nhắm tới visa Top-Tier, rút ngắn thường trú (F-5) còn ba năm; du học D-2 rồi chuyển sang việc làm cũng là lộ trình phổ biến.",
      ],
    },
  },
  {
    key: "china",
    flag: "🇨🇳",
    name: { ko: "중국", en: "China", zh: "中国", vi: "Trung Quốc" },
    tags: ["F-4", "D-2", "E-7", "E-9"],
    paras: {
      ko: [
        "중국은 국적자의 배경에 따라 길이 크게 갈립니다. 한국계(조선족)라면 재외동포 F-4가 핵심입니다. 2026년 2월 12일부터 방문취업(H-2)의 신규 발급이 중단되고 F-4로 통합되어, 연고가 없어도 학력·자격증·한국어 요건을 갖추면 F-4를 바로 신청할 수 있습니다.",
        "한국계가 아닌 중국인은 유학(D-2)이 가장 흔합니다. 재한 중국인 유학생 규모가 큽니다. 전문직이라면 E-7, 중국도 EPS 송출국이므로 제조·농업 현장은 E-9도 가능합니다.",
        "한국인 배우자가 있으면 결혼이민 F-6 경로도 있습니다.",
      ],
      en: [
        "The route depends heavily on background. Ethnic Koreans (Joseonjok) rely on the F-4 overseas-Korean visa. From 12 Feb 2026 the visitor-worker H-2 stopped being newly issued and was merged into F-4, so even those without local ties can apply for F-4 directly once they meet the education, certificate or Korean-language conditions.",
        "Non-ethnic-Korean Chinese most often come to study (D-2) — the Chinese student population in Korea is large. Professionals use E-7, and because China is an EPS sending country, factory and farm work on E-9 is also possible.",
        "Those married to a Korean citizen have the F-6 marriage-migration route.",
      ],
      zh: [
        "路径因个人背景差异很大。韩国血统者(朝鲜族)以在外同胞F-4为核心。自2026年2月12日起,访问就业(H-2)停止新发并并入F-4,即使无亲属关系,只要满足学历·资格证·韩语条件即可直接申请F-4。",
        "非韩国血统的中国人最常见的是留学(D-2),在韩中国留学生规模庞大。专业人才用E-7;中国也是EPS派遣国,制造·农业现场也可用E-9。",
        "有韩国配偶者还有结婚移民F-6路径。",
      ],
      vi: [
        "Lộ trình phụ thuộc nhiều vào hoàn cảnh. Người gốc Hàn (Joseonjok) dựa vào visa kiều bào F-4. Từ 12/2/2026, visa lao động thăm thân H-2 ngừng cấp mới và được gộp vào F-4, nên ngay cả người không có thân nhân cũng có thể xin thẳng F-4 nếu đáp ứng điều kiện học vấn, chứng chỉ hoặc tiếng Hàn.",
        "Người Trung Quốc không gốc Hàn thường sang du học (D-2) — lượng du học sinh Trung Quốc tại Hàn rất lớn. Lao động chuyên môn dùng E-7; và vì Trung Quốc là nước phái cử EPS, làm việc tại nhà máy, nông trại bằng E-9 cũng khả thi.",
        "Người có vợ/chồng là công dân Hàn có thêm lộ trình di trú hôn nhân F-6.",
      ],
    },
  },
  {
    key: "vietnam",
    flag: "🇻🇳",
    name: { ko: "베트남", en: "Vietnam", zh: "越南", vi: "Việt Nam" },
    tags: ["E-9", "E-8", "D-2/D-4", "E-7-4"],
    paras: {
      ko: [
        "베트남은 한국 노동·유학 양쪽에서 손꼽히는 나라입니다. EPS(E-9)의 대표 송출국으로 제조·농축산·어업 현장에 많이 진출합니다.",
        "농·어촌 단기 인력은 E-8 계절근로(최대 8개월)로도 옵니다. 유학 쪽에서도 베트남은 한국 유학생 상위권으로, 어학연수 D-4나 학위과정 D-2가 활발합니다.",
        "E-9로 입국해 4년 이상 합법 취업하면 숙련기능인력 E-7-4(점수제)로 전환해 장기 체류·가족 동반으로 이어갈 수 있습니다.",
      ],
      en: [
        "Vietnam is a top country for both labor and study links with Korea. As a leading EPS (E-9) sending country, many Vietnamese work in manufacturing, farming and fishing.",
        "Short-term rural labor also arrives on the E-8 seasonal visa (up to 8 months). On the study side, Vietnam is among the largest sources of international students, with active D-4 language training and D-2 degree tracks.",
        "After entering on E-9 and working legally for four-plus years, one can convert to the E-7-4 skilled-worker (points) visa, opening long-term stay and family accompaniment.",
      ],
      zh: [
        "越南在对韩劳务与留学两方面都名列前茅。作为EPS(E-9)主要派遣国,许多越南人进入制造·农畜·渔业现场。",
        "农渔村短期人力也通过E-8季节工(最长8个月)前来。留学方面,越南是在韩留学生的主要来源,语言研修D-4与学位课程D-2都很活跃。",
        "以E-9入境并合法工作满4年以上后,可转为熟练技能人才E-7-4(积分制),进而实现长期居留·家属陪同。",
      ],
      vi: [
        "Việt Nam thuộc nhóm dẫn đầu cả về lao động lẫn du học với Hàn Quốc. Là nước phái cử EPS (E-9) hàng đầu, nhiều người Việt làm trong sản xuất, nông nghiệp và ngư nghiệp.",
        "Lao động nông thôn ngắn hạn cũng sang bằng visa thời vụ E-8 (tối đa 8 tháng). Về du học, Việt Nam nằm trong nhóm nguồn du học sinh lớn nhất, với chương trình học tiếng D-4 và cấp bằng D-2 sôi động.",
        "Sau khi nhập cảnh bằng E-9 và làm việc hợp pháp hơn 4 năm, có thể chuyển sang visa lao động lành nghề E-7-4 (tính điểm), mở ra lưu trú dài hạn và bảo lãnh gia đình.",
      ],
    },
  },
  {
    key: "sea-eps",
    flag: "🌏",
    name: {
      ko: "동남아·남아시아 EPS 국가",
      en: "Southeast & South Asian EPS countries",
      zh: "东南亚·南亚EPS国家",
      vi: "Các nước EPS Đông Nam Á & Nam Á",
    },
    tags: ["E-9", "E-8"],
    paras: {
      ko: [
        "네팔·필리핀·인도네시아·캄보디아·태국·미얀마·스리랑카·방글라데시·파키스탄·라오스·동티모르는 모두 EPS 송출국입니다. 이들 국가 국민의 주된 길은 E-9 고용허가제로, 제조·농축산·어업·건설 현장에서 일합니다.",
        "선발은 EPS-TOPIK(한국어시험)과 선발포인트제로 이뤄집니다. 농·어업 단기 수요는 E-8 계절근로로도 채워집니다.",
        "체류는 최장 4년 10개월이며, 재고용·성실근로자 인정으로 최장 9년 8개월까지 이어질 수 있습니다.",
      ],
      en: [
        "Nepal, the Philippines, Indonesia, Cambodia, Thailand, Myanmar, Sri Lanka, Bangladesh, Pakistan, Laos and Timor-Leste are all EPS sending countries. For their nationals the main path is the E-9 permit, working in manufacturing, farming, fishing and construction.",
        "Selection runs through the EPS-TOPIK Korean test and a points-based roster. Short-term farm and fishing demand is also met by the E-8 seasonal visa.",
        "Stay is up to 4 years 10 months, extendable via re-employment or the sincere-worker track to a maximum of 9 years 8 months.",
      ],
      zh: [
        "尼泊尔·菲律宾·印度尼西亚·柬埔寨·泰国·缅甸·斯里兰卡·孟加拉国·巴基斯坦·老挝·东帝汶均为EPS派遣国。这些国民的主要途径是E-9雇佣许可制,在制造·农畜·渔业·建筑现场工作。",
        "选拔通过EPS-TOPIK(韩语考试)与选拔积分制进行。农渔业短期需求也由E-8季节工补充。",
        "居留最长4年10个月,通过再雇佣·诚实劳动者认定最长可延至9年8个月。",
      ],
      vi: [
        "Nepal, Philippines, Indonesia, Campuchia, Thái Lan, Myanmar, Sri Lanka, Bangladesh, Pakistan, Lào và Timor-Leste đều là nước phái cử EPS. Với công dân các nước này, con đường chính là giấy phép E-9, làm trong sản xuất, nông nghiệp, ngư nghiệp và xây dựng.",
        "Tuyển chọn qua kỳ thi tiếng Hàn EPS-TOPIK và danh sách tính điểm. Nhu cầu nông–ngư nghiệp ngắn hạn cũng được đáp ứng bằng visa thời vụ E-8.",
        "Thời gian lưu trú tối đa 4 năm 10 tháng, có thể gia hạn qua tái tuyển dụng hoặc diện lao động mẫu mực lên tối đa 9 năm 8 tháng.",
      ],
    },
  },
  {
    key: "central-asia",
    flag: "🌏",
    name: {
      ko: "중앙아시아 · 고려인",
      en: "Central Asia · Koryo-saram",
      zh: "中亚 · 高丽人",
      vi: "Trung Á · Koryo-saram",
    },
    tags: ["E-9", "F-4"],
    paras: {
      ko: [
        "우즈베키스탄·키르기스스탄·타지키스탄은 모두 EPS 송출국입니다. 특히 타지키스탄은 2025년 10월 17번째 송출국으로 지정돼 첫 근로자가 입국했습니다. 이들 국민의 기본 경로는 E-9 고용허가제입니다.",
        "한편 이 지역에는 고려인(강제이주 한인 후손)이 많습니다. 조부모·증조부모 세대의 한국 혈통을 증명하면 재외동포 F-4를 받을 수 있어, 단순 노무를 넘어 정주형 체류가 가능합니다.",
        "즉 같은 국적이라도 고려인 혈통 여부에 따라 E-9(노동)과 F-4(동포)로 길이 갈립니다.",
      ],
      en: [
        "Uzbekistan, Kyrgyzstan and Tajikistan are all EPS sending countries. Tajikistan was named the 17th sending country in October 2025, when its first workers arrived. The default route for their nationals is the E-9 permit.",
        "This region is also home to many Koryo-saram (descendants of forcibly relocated Koreans). Proving Korean ancestry through a grandparent or great-grandparent can secure the F-4 overseas-Korean visa, allowing settled residence beyond manual labor.",
        "So for the same nationality, the path splits between E-9 (labor) and F-4 (heritage) depending on Koryo-saram descent.",
      ],
      zh: [
        "乌兹别克斯坦·吉尔吉斯斯坦·塔吉克斯坦均为EPS派遣国。塔吉克斯坦于2025年10月被指定为第17个派遣国,首批工人已入境。这些国民的基本途径是E-9雇佣许可制。",
        "同时该地区有许多高丽人(被强制迁移韩人的后裔)。若能通过祖父母·曾祖父母一代证明韩国血统,即可获得在外同胞F-4,实现超越单纯劳务的定居型居留。",
        "因此即使同一国籍,也会因是否为高丽人血统而分为E-9(劳务)与F-4(同胞)两条路。",
      ],
      vi: [
        "Uzbekistan, Kyrgyzstan và Tajikistan đều là nước phái cử EPS. Riêng Tajikistan được chỉ định là nước phái cử thứ 17 vào tháng 10/2025, khi những lao động đầu tiên nhập cảnh. Con đường mặc định cho công dân các nước này là giấy phép E-9.",
        "Khu vực này cũng là quê hương của nhiều Koryo-saram (hậu duệ người Hàn bị cưỡng bức di dời). Chứng minh dòng máu Hàn qua đời ông bà hoặc cụ có thể giành được visa kiều bào F-4, cho phép cư trú định cư vượt ra ngoài lao động chân tay.",
        "Vậy nên cùng một quốc tịch, lộ trình vẫn tách thành E-9 (lao động) và F-4 (huyết thống) tùy theo gốc Koryo-saram.",
      ],
    },
  },
  {
    key: "mongolia",
    flag: "🇲🇳",
    name: { ko: "몽골", en: "Mongolia", zh: "蒙古", vi: "Mông Cổ" },
    tags: ["E-9", "D-2/D-4"],
    paras: {
      ko: [
        "몽골은 EPS 송출국으로, 제조·농업 현장은 E-9 고용허가제가 기본 경로입니다.",
        "동시에 몽골은 한국 유학·어학연수 수요가 큰 나라입니다. 어학원 D-4나 대학 학위과정 D-2로 들어와 졸업 후 전문직(E-7)으로 전환을 노리는 흐름도 뚜렷합니다.",
      ],
      en: [
        "Mongolia is an EPS sending country, so factory and farm work runs through the E-9 permit as the default route.",
        "At the same time Mongolia sends many students to Korea. Entering on a D-4 language course or a D-2 degree program and then converting to a professional E-7 after graduation is a clear pattern.",
      ],
      zh: [
        "蒙古是EPS派遣国,制造·农业现场以E-9雇佣许可制为基本途径。",
        "同时蒙古赴韩留学·语言研修需求很大。以语学院D-4或大学学位课程D-2入境,毕业后转为专业职(E-7)的走向也很明显。",
      ],
      vi: [
        "Mông Cổ là nước phái cử EPS, nên làm việc tại nhà máy, nông trại theo giấy phép E-9 là con đường mặc định.",
        "Đồng thời Mông Cổ gửi nhiều du học sinh sang Hàn. Nhập cảnh bằng khóa học tiếng D-4 hoặc chương trình cấp bằng D-2 rồi chuyển sang chuyên môn E-7 sau khi tốt nghiệp là xu hướng rõ nét.",
      ],
    },
  },
  {
    key: "english-west",
    flag: "🌐",
    name: {
      ko: "영어권·서구 국가",
      en: "English-speaking & Western countries",
      zh: "英语圈·西方国家",
      vi: "Các nước nói tiếng Anh & phương Tây",
    },
    tags: ["E-7", "E-2", "D-2"],
    paras: {
      ko: [
        "미국·영국·캐나다·호주·뉴질랜드 등 국민은 EPS 대상이 아니며, 전문직 E-7이 대표 경로입니다.",
        "영어권 국민에게 특징적인 것은 E-2 회화지도 비자로, 학원·학교에서 어학 강사로 일하는 길입니다.",
        "그밖에 유학(D-2)·교환학생, 원격근무 인재를 위한 워케이션(디지털노마드) 비자도 선택지입니다. 세부 자격은 국가·직종별로 다르므로 공식 확인이 필요합니다.",
      ],
      en: [
        "Nationals of the US, UK, Canada, Australia, New Zealand and similar countries are outside EPS; the professional E-7 is the headline route.",
        "Distinctive for English speakers is the E-2 conversation-instruction visa — working as a language teacher at academies or schools.",
        "Beyond that, study (D-2)/exchange and the workation (digital-nomad) visa for remote workers are options. Exact eligibility varies by country and role, so confirm with the official sources.",
      ],
      zh: [
        "美国·英国·加拿大·澳大利亚·新西兰等国民不属于EPS对象,专业职E-7是代表途径。",
        "对英语圈国民而言最具特色的是E-2会话指导签证,即在补习班·学校担任语言讲师。",
        "此外还有留学(D-2)·交换生,以及面向远程工作人才的工作度假(数字游民)签证等选项。具体资格因国家·职种而异,需以官方确认为准。",
      ],
      vi: [
        "Công dân Mỹ, Anh, Canada, Úc, New Zealand và các nước tương tự nằm ngoài EPS; chuyên môn E-7 là con đường chủ đạo.",
        "Đặc trưng với người nói tiếng Anh là visa giảng dạy hội thoại E-2 — làm giáo viên ngôn ngữ tại trung tâm hoặc trường học.",
        "Ngoài ra còn có du học (D-2)/trao đổi và visa workation (du mục kỹ thuật số) cho người làm việc từ xa. Điều kiện cụ thể khác nhau tùy nước và ngành nghề, nên hãy xác minh với nguồn chính thức.",
      ],
    },
  },
];

/* ────────────────────────────────────────────────────────────
 * FAQ
 * ──────────────────────────────────────────────────────────── */
interface Faq {
  q: Record<Locale, string>;
  a: Record<Locale, string>;
}

const FAQS: ReadonlyArray<Faq> = [
  {
    q: {
      ko: "인도·미국 국적자도 EPS(E-9)로 올 수 있나요?",
      en: "Can nationals of India or the US come on EPS (E-9)?",
      zh: "印度·美国国籍者也能通过EPS(E-9)前来吗?",
      vi: "Công dân Ấn Độ hay Mỹ có thể sang bằng EPS (E-9) không?",
    },
    a: {
      ko: "아니요. E-9는 MOU를 맺은 17개 송출국 국민만 대상입니다. 인도·미국 등은 송출국이 아니므로 전문직 E-7이나 유학 D-2 등 다른 경로를 씁니다.",
      en: "No. E-9 is only for nationals of the 17 MOU sending countries. India, the US and others are not sending countries, so they use routes such as the professional E-7 or study D-2.",
      zh: "不能。E-9仅面向签署MOU的17个派遣国国民。印度·美国等非派遣国,须使用专业职E-7或留学D-2等其他途径。",
      vi: "Không. E-9 chỉ dành cho công dân 17 nước phái cử đã ký MOU. Ấn Độ, Mỹ và các nước khác không phải nước phái cử, nên dùng lộ trình như chuyên môn E-7 hoặc du học D-2.",
    },
  },
  {
    q: {
      ko: "같은 나라 사람인데 왜 비자가 다른가요?",
      en: "Why do people from the same country get different visas?",
      zh: "同一国家的人为何签证不同?",
      vi: "Vì sao người cùng một nước lại có visa khác nhau?",
    },
    a: {
      ko: "혈통·학력·직종·목적에 따라 열리는 제도가 다르기 때문입니다. 예를 들어 중국·중앙아시아 국적이라도 한국계(조선족·고려인)면 재외동포 F-4, 그렇지 않으면 E-9(노동)·D-2(유학) 등으로 갈립니다.",
      en: "Because the eligible programs depend on ancestry, education, occupation and purpose. For example, among Chinese or Central Asian nationals, ethnic Koreans (Joseonjok, Koryo-saram) get the F-4 overseas-Korean visa, while others use E-9 (labor) or D-2 (study).",
      zh: "因为可申请的制度取决于血统·学历·职种·目的。例如同为中国·中亚国籍,韩国血统者(朝鲜族·高丽人)可获在外同胞F-4,其余则分为E-9(劳务)·D-2(留学)等。",
      vi: "Vì các chế độ đủ điều kiện phụ thuộc vào huyết thống, học vấn, ngành nghề và mục đích. Ví dụ trong công dân Trung Quốc hay Trung Á, người gốc Hàn (Joseonjok, Koryo-saram) nhận visa kiều bào F-4, còn lại dùng E-9 (lao động) hoặc D-2 (du học).",
    },
  },
  {
    q: {
      ko: "노동 비자로 와서 오래 정착할 수 있나요?",
      en: "Can a labor visa lead to long-term settlement?",
      zh: "以劳务签证前来能长期定居吗?",
      vi: "Visa lao động có thể dẫn đến định cư dài hạn không?",
    },
    a: {
      ko: "가능성이 있습니다. E-9로 4년 이상 합법 취업하면 숙련기능인력 E-7-4(점수제)로 전환할 수 있고, 이후 거주(F-2-7)·영주(F-5)로 이어지는 사다리가 있습니다. 단 요건은 매년 바뀌므로 하이코리아에서 확인하세요.",
      en: "It can. After four-plus years of legal work on E-9, you may convert to the E-7-4 skilled-worker (points) visa, with a ladder toward residence (F-2-7) and permanent residence (F-5). Requirements change yearly, so verify on HiKorea.",
      zh: "有可能。以E-9合法工作满4年以上,可转为熟练技能人才E-7-4(积分制),之后有通往居住(F-2-7)·永住(F-5)的阶梯。但要求每年变动,请在HiKorea确认。",
      vi: "Có thể. Sau hơn 4 năm làm việc hợp pháp bằng E-9, bạn có thể chuyển sang visa lao động lành nghề E-7-4 (tính điểm), với lộ trình tiến tới cư trú (F-2-7) và thường trú (F-5). Điều kiện thay đổi hàng năm, hãy xác minh trên HiKorea.",
    },
  },
];

const COPY = {
  ko: {
    metaTitle: "국적별 한국 취업비자 가이드 — 어느 나라는 어떤 비자? (2026)",
    metaDesc:
      "인도·중국·베트남·중앙아시아·영어권까지, 국적에 따라 열리는 한국 취업·체류 비자를 국가별로 정리했습니다. E-9·E-7·F-4·D-2·E-2·Top-Tier 한눈에.",
    ogLocale: "ko_KR",
    eyebrow: "한국 생활 · 비자",
    h1: "국적별 한국 취업비자 — 어느 나라는 어떤 길이 열려 있나",
    updated: "마지막 업데이트 2026-07-12. 법률 자문이 아니며, 신청 전 하이코리아 등 공식 정보를 확인하세요.",
    introHeading: "왜 국적이 비자를 좌우하나",
    intro: [
      "한국에서 일하고 싶어도 국적에 따라 열리는 문이 다릅니다. 고용허가제(E-9)는 협정을 맺은 17개 송출국 국민만 대상이고, 전문직 E-7은 학력·경력이 필요하며, 재외동포 F-4는 한국계 혈통이 있어야 합니다.",
      "그래서 '한국 취업비자'는 하나가 아니라, 당신의 국적·배경·목적에 따라 갈라지는 여러 경로의 묶음입니다. 아래에서 제도를 한눈에 본 뒤, 국가별로 어떤 길이 현실적인지 정리합니다.",
    ],
    visaTypesHeading: "비자 유형 한눈에",
    thCode: "코드",
    thName: "제도",
    thWho: "대상",
    countriesHeading: "국가별 경로",
    commonHeading: "어떤 길이든 공통으로 쓰는 도구",
    commonIntro:
      "비자 종류와 무관하게 한국 체류 중에 필요한 계산기입니다.",
    deepHeading: "제도별 심층 가이드",
    faqHeading: "자주 묻는 질문",
    closingHeading: "정리",
    closing:
      "핵심은 '내 국적엔 어떤 제도가 열려 있나'를 먼저 파악하는 것입니다. EPS(E-9) 대상국이면 노동 경로가, 전문·숙련직이면 E-7이, 한국계 혈통이면 F-4가 출발점입니다. 구체적 자격·서류·수치는 매년 바뀌므로 반드시 공식 출처(hikorea.go.kr, eps.go.kr)에서 최종 확인하세요.",
    breadcrumbHome: "홈",
    breadcrumbGuide: "가이드",
    breadcrumbThis: "국적별 취업비자",
    backToGuides: "가이드 모음",
  },
  en: {
    metaTitle: "Korea Work Visa by Nationality — Which Country, Which Visa (2026)",
    metaDesc:
      "From India, China and Vietnam to Central Asia and English-speaking countries — the Korean work and residence visas open to you, organized by nationality. E-9, E-7, F-4, D-2, E-2, Top-Tier at a glance.",
    ogLocale: "en_US",
    eyebrow: "Living in Korea · Visas",
    h1: "Korea Work Visa by Nationality — Which Country, Which Path",
    updated:
      "Last updated 2026-07-12. This is not legal advice — verify with official sources such as HiKorea before applying.",
    introHeading: "Why nationality drives the visa",
    intro: [
      "Even if you want to work in Korea, the door that opens depends on your nationality. The Employment Permit System (E-9) is only for the 17 MOU sending countries, the professional E-7 needs education and experience, and the F-4 overseas-Korean visa requires Korean ancestry.",
      "So a 'Korea work visa' is not one thing but a bundle of routes that split by your nationality, background and purpose. Below is the program overview, then a nationality-by-nationality look at what is realistic.",
    ],
    visaTypesHeading: "Visa types at a glance",
    thCode: "Code",
    thName: "Program",
    thWho: "Who it's for",
    countriesHeading: "Routes by nationality",
    commonHeading: "Tools everyone uses, whatever the visa",
    commonIntro:
      "Calculators you'll need while living in Korea, regardless of visa type.",
    deepHeading: "Deep-dive guides by program",
    faqHeading: "Frequently asked questions",
    closingHeading: "Bottom line",
    closing:
      "The key is to first know which program is open to your nationality. If your country is an EPS (E-9) partner, the labor route is your start; professionals and skilled workers start with E-7; those with Korean ancestry start with F-4. Exact eligibility, documents and figures change every year, so always confirm on the official sources (hikorea.go.kr, eps.go.kr).",
    breadcrumbHome: "Home",
    breadcrumbGuide: "Guides",
    breadcrumbThis: "Work visa by nationality",
    backToGuides: "All guides",
  },
  zh: {
    metaTitle: "按国籍看韩国工作签证 — 哪国走哪种签证(2026)",
    metaDesc:
      "从印度·中国·越南到中亚·英语圈,按国籍整理向你开放的韩国工作·居留签证。E-9·E-7·F-4·D-2·E-2·Top-Tier一目了然。",
    ogLocale: "zh_CN",
    eyebrow: "韩国生活 · 签证",
    h1: "按国籍看韩国工作签证 — 哪个国家,哪条路",
    updated:
      "最后更新 2026-07-12。本文非法律咨询,申请前请以HiKorea等官方信息为准。",
    introHeading: "为何国籍决定签证",
    intro: [
      "即使想在韩国工作,开启的门也因国籍而异。雇佣许可制(E-9)仅面向签约的17个派遣国国民,专业职E-7需要学历·经历,在外同胞F-4则须有韩国血统。",
      "因此'韩国工作签证'并非单一事物,而是随你的国籍·背景·目的而分叉的多条路径的集合。下面先一览各制度,再按国家整理哪条路更现实。",
    ],
    visaTypesHeading: "签证类型一览",
    thCode: "代码",
    thName: "制度",
    thWho: "适用对象",
    countriesHeading: "按国籍分的路径",
    commonHeading: "无论哪条路都通用的工具",
    commonIntro: "与签证种类无关,在韩居留期间会用到的计算器。",
    deepHeading: "按制度的深度指南",
    faqHeading: "常见问题",
    closingHeading: "小结",
    closing:
      "关键是先弄清'我的国籍有哪些制度开放'。若你的国家是EPS(E-9)伙伴国,劳务路径是起点;专业·熟练职以E-7起步;有韩国血统者以F-4起步。具体资格·材料·数值每年变动,请务必在官方来源(hikorea.go.kr、eps.go.kr)最终确认。",
    breadcrumbHome: "首页",
    breadcrumbGuide: "指南",
    breadcrumbThis: "按国籍看工作签证",
    backToGuides: "全部指南",
  },
  vi: {
    metaTitle: "Visa lao động Hàn Quốc theo quốc tịch — Nước nào, visa nào (2026)",
    metaDesc:
      "Từ Ấn Độ, Trung Quốc, Việt Nam đến Trung Á và các nước nói tiếng Anh — các loại visa lao động và cư trú Hàn Quốc mở ra cho bạn, sắp xếp theo quốc tịch. E-9, E-7, F-4, D-2, E-2, Top-Tier trong nháy mắt.",
    ogLocale: "vi_VN",
    eyebrow: "Sống ở Hàn Quốc · Visa",
    h1: "Visa lao động Hàn Quốc theo quốc tịch — Nước nào, con đường nào",
    updated:
      "Cập nhật lần cuối 2026-07-12. Đây không phải tư vấn pháp lý — hãy xác minh với nguồn chính thức như HiKorea trước khi nộp hồ sơ.",
    introHeading: "Vì sao quốc tịch quyết định visa",
    intro: [
      "Dù bạn muốn làm việc tại Hàn Quốc, cánh cửa mở ra tùy thuộc quốc tịch. Chế độ cấp phép lao động (E-9) chỉ dành cho 17 nước phái cử đã ký MOU, chuyên môn E-7 cần học vấn và kinh nghiệm, còn visa kiều bào F-4 đòi hỏi huyết thống Hàn.",
      "Vậy nên 'visa lao động Hàn Quốc' không phải một thứ, mà là một tập hợp các lộ trình rẽ nhánh theo quốc tịch, hoàn cảnh và mục đích của bạn. Dưới đây là tổng quan các chế độ, rồi xem theo từng quốc tịch đâu là con đường thực tế.",
    ],
    visaTypesHeading: "Các loại visa trong nháy mắt",
    thCode: "Mã",
    thName: "Chế độ",
    thWho: "Dành cho ai",
    countriesHeading: "Lộ trình theo quốc tịch",
    commonHeading: "Công cụ ai cũng dùng, bất kể visa nào",
    commonIntro:
      "Các máy tính bạn sẽ cần khi sống ở Hàn Quốc, bất kể loại visa.",
    deepHeading: "Hướng dẫn chuyên sâu theo chế độ",
    faqHeading: "Câu hỏi thường gặp",
    closingHeading: "Kết luận",
    closing:
      "Điều then chốt là trước hết biết chế độ nào mở ra cho quốc tịch của bạn. Nếu nước bạn là đối tác EPS (E-9), lộ trình lao động là khởi đầu; lao động chuyên môn và lành nghề bắt đầu bằng E-7; người có huyết thống Hàn bắt đầu bằng F-4. Điều kiện, giấy tờ và con số cụ thể thay đổi mỗi năm, nên luôn xác minh tại nguồn chính thức (hikorea.go.kr, eps.go.kr).",
    breadcrumbHome: "Trang chủ",
    breadcrumbGuide: "Hướng dẫn",
    breadcrumbThis: "Visa lao động theo quốc tịch",
    backToGuides: "Tất cả hướng dẫn",
  },
} as const;

const COMMON_TOOLS: ReadonlyArray<{ href: string; label: Record<Locale, string> }> = [
  {
    href: "/visa-days",
    label: {
      ko: "체류일수 계산기 (90일·183일)",
      en: "Days-in-Korea calculator (90/183 days)",
      zh: "居留天数计算器(90·183天)",
      vi: "Máy tính số ngày lưu trú (90/183 ngày)",
    },
  },
  {
    href: "/pension-refund",
    label: {
      ko: "국민연금 반환일시금 계산",
      en: "National Pension lump-sum refund",
      zh: "国民年金退还一次金计算",
      vi: "Tính hoàn trả một lần Lương hưu quốc gia",
    },
  },
  {
    href: "/foreign-health-insurance",
    label: {
      ko: "외국인 건강보험료 계산",
      en: "Foreigner health insurance premium",
      zh: "外国人健康保险费计算",
      vi: "Tính phí bảo hiểm y tế người nước ngoài",
    },
  },
  {
    href: "/f2-residence-visa",
    label: {
      ko: "F-2-7 거주비자 자격 체크",
      en: "F-2-7 residence visa eligibility",
      zh: "F-2-7居留签证资格核对",
      vi: "Kiểm tra điều kiện visa cư trú F-2-7",
    },
  },
];

const DEEP_GUIDES: ReadonlyArray<{ href: string; title: Record<Locale, string>; desc: Record<Locale, string> }> = [
  {
    href: "/guide/eps-e9-work-visa",
    title: {
      ko: "고용허가제 E-9 완전 가이드",
      en: "EPS (E-9) work visa — full guide",
      zh: "雇佣许可制E-9完全指南",
      vi: "Visa lao động EPS (E-9) — hướng dẫn đầy đủ",
    },
    desc: {
      ko: "17개 송출국·EPS-TOPIK·쿼터·체류기간·E-7-4 전환까지.",
      en: "17 sending countries, EPS-TOPIK, quota, stay length, E-7-4 conversion.",
      zh: "17个派遣国·EPS-TOPIK·配额·居留期·E-7-4转换。",
      vi: "17 nước phái cử, EPS-TOPIK, hạn ngạch, thời gian lưu trú, chuyển E-7-4.",
    },
  },
  {
    href: "/guide/e7-professional-visa",
    title: {
      ko: "E-7 전문직 비자 완전 가이드",
      en: "E-7 professional visa — full guide",
      zh: "E-7专业职签证完全指南",
      vi: "Visa chuyên môn E-7 — hướng dẫn đầy đủ",
    },
    desc: {
      ko: "4개 서브카테고리·2026 임금기준·Top-Tier·F-2-7 전환.",
      en: "Four subcategories, 2026 salary floors, Top-Tier, F-2-7 path.",
      zh: "4个子类别·2026薪资标准·Top-Tier·F-2-7转换。",
      vi: "Bốn phân loại, mức lương sàn 2026, Top-Tier, lộ trình F-2-7.",
    },
  },
];

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const c = COPY[localeKeyOf(locale)];
  return {
    title: c.metaTitle,
    description: c.metaDesc,
    alternates: {
      canonical: `/${locale}/guide/foreign-work-visa-korea`,
      languages: buildLanguagesAlt("/guide/foreign-work-visa-korea"),
    },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDesc,
      type: "article",
      url: `${SITE_URL}/${locale}/guide/foreign-work-visa-korea`,
      locale: c.ogLocale,
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function ForeignWorkVisaKoreaPage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const localeKey = localeKeyOf(locale);
  const c = COPY[localeKey];

  const breadcrumbItems = [
    { name: c.breadcrumbHome, url: `${SITE_URL}/${locale}` },
    { name: c.breadcrumbGuide, url: `${SITE_URL}/${locale}/guide` },
    {
      name: c.breadcrumbThis,
      url: `${SITE_URL}/${locale}/guide/foreign-work-visa-korea`,
    },
  ];

  const faqItems = FAQS.map((f) => ({
    question: f.q[localeKey],
    answer: f.a[localeKey],
  }));

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <BreadcrumbJsonLd items={breadcrumbItems} id="foreign-work-visa-korea" />
      <FaqJsonLd items={faqItems} id="foreign-work-visa-korea" />
      <div className="mx-auto max-w-3xl">
        <nav className="mb-5 flex items-center gap-2 text-sm text-[color:var(--color-text-tertiary)]">
          <Link
            href={`/${locale}/guide`}
            className="inline-flex items-center gap-1 transition-colors hover:text-[color:var(--color-text-primary)]"
          >
            <ChevronLeft className="h-4 w-4" />
            {c.backToGuides}
          </Link>
        </nav>

        <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
          <header>
            <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              {c.eyebrow}
            </p>
            <h1 className="mt-2 flex items-start gap-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
              <Globe className="mt-1 h-7 w-7 shrink-0 text-indigo-400" />
              <span>{c.h1}</span>
            </h1>
            <p className="mt-4 text-sm text-[color:var(--color-text-tertiary)]">
              {c.updated}
            </p>
          </header>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
              {c.introHeading}
            </h2>
            {c.intro.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
              {c.visaTypesHeading}
            </h2>
            <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">
                      {c.thCode}
                    </th>
                    <th className="px-4 py-2 text-left font-medium">
                      {c.thName}
                    </th>
                    <th className="px-4 py-2 text-left font-medium">
                      {c.thWho}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[color:var(--color-text-secondary)]">
                  {VISA_TYPES.map((v) => (
                    <tr
                      key={v.code}
                      className="border-t border-[color:var(--color-border-subtle)] align-top"
                    >
                      <td className="whitespace-nowrap px-4 py-2.5 font-semibold text-[color:var(--color-text-primary)]">
                        {v.code}
                      </td>
                      <td className="px-4 py-2.5">{v.name[localeKey]}</td>
                      <td className="px-4 py-2.5">{v.who[localeKey]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
              {c.countriesHeading}
            </h2>
            <div className="space-y-4">
              {COUNTRIES.map((country) => (
                <div
                  key={country.key}
                  className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-5"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="text-2xl" aria-hidden>
                      {country.flag}
                    </span>
                    <h3 className="text-lg font-bold text-[color:var(--color-text-primary)]">
                      {country.name[localeKey]}
                    </h3>
                    <span className="flex flex-wrap gap-1">
                      {country.tags.map((t) => (
                        <span
                          key={t}
                          className="rounded-md bg-indigo-500/10 px-1.5 py-0.5 text-[11px] font-semibold text-indigo-300"
                        >
                          {t}
                        </span>
                      ))}
                    </span>
                  </div>
                  <div className="space-y-2.5 text-sm">
                    {country.paras[localeKey].map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
              {c.deepHeading}
            </h2>
            <div className="grid gap-3 sm:grid-cols-2">
              {DEEP_GUIDES.map((g) => (
                <Link
                  key={g.href}
                  href={`/${locale}${g.href}`}
                  className="group block rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 transition-all hover:-translate-y-0.5 hover:border-[color:var(--color-border-strong)]"
                >
                  <h3 className="font-semibold text-[color:var(--color-text-primary)]">
                    {g.title[localeKey]}
                  </h3>
                  <p className="mt-1.5 text-sm text-[color:var(--color-text-secondary)]">
                    {g.desc[localeKey]}
                  </p>
                  <span className="mt-2.5 inline-flex items-center gap-1 text-xs font-medium text-indigo-300 transition-transform group-hover:translate-x-0.5">
                    <ArrowRight className="h-3.5 w-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
              {c.commonHeading}
            </h2>
            <p className="text-sm">{c.commonIntro}</p>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {COMMON_TOOLS.map((t) => (
                <Link
                  key={t.href}
                  href={`/${locale}${t.href}`}
                  className="group flex items-center justify-between gap-2 rounded-lg border border-[color:var(--color-border-subtle)] px-4 py-3 text-sm transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text-primary)]"
                >
                  <span>{t.label[localeKey]}</span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-[color:var(--color-text-tertiary)] transition-transform group-hover:translate-x-0.5" />
                </Link>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
              {c.faqHeading}
            </h2>
            <div className="space-y-4">
              {FAQS.map((f, i) => (
                <div key={i} className="space-y-1.5">
                  <h3 className="font-semibold text-[color:var(--color-text-primary)]">
                    {f.q[localeKey]}
                  </h3>
                  <p className="text-sm">{f.a[localeKey]}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
              {c.closingHeading}
            </h2>
            <p>{c.closing}</p>
          </section>
        </article>
      </div>
    </main>
  );
}
