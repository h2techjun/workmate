import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plane } from "lucide-react";
import { locales, type Locale } from "@/i18n";
import { buildLanguagesAlt } from "@/lib/seo/alternates";
import { SITE_URL } from "@/lib/siteConfig";
import { FaqJsonLd } from "@/components/seo/StructuredData";
import { Breadcrumbs } from "@/components/seo/Breadcrumbs";
import PostTags from "@/components/ui/PostTags";

interface PageProps {
  params: Promise<{ locale: string }>;
}

function localeKeyOf(locale: string): Locale {
  if (locale === "ko") return "ko";
  if (locale === "zh") return "zh";
  if (locale === "vi") return "vi";
  return "en";
}

type StatusType = "free" | "eta" | "visa";

const STATUS_LABEL: Record<StatusType, Record<Locale, string>> = {
  free: { ko: "무비자", en: "Visa-free", zh: "免签", vi: "Miễn visa" },
  eta: {
    ko: "전자허가 필요",
    en: "e-Authorization",
    zh: "需电子许可",
    vi: "Cần phép điện tử",
  },
  visa: { ko: "비자 필요", en: "Visa required", zh: "需签证", vi: "Cần visa" },
};

const STATUS_CLASS: Record<StatusType, string> = {
  free: "bg-emerald-500/12 text-emerald-300",
  eta: "bg-amber-500/12 text-amber-300",
  visa: "bg-rose-500/12 text-rose-300",
};

interface Destination {
  key: string;
  flag: string;
  name: Record<Locale, string>;
  status: StatusType;
  stay: Record<Locale, string>;
  paras: Record<Locale, ReadonlyArray<string>>;
}

const DESTINATIONS: ReadonlyArray<Destination> = [
  {
    key: "usa",
    flag: "🇺🇸",
    name: { ko: "미국", en: "United States", zh: "美国", vi: "Hoa Kỳ" },
    status: "eta",
    stay: {
      ko: "무비자 최대 90일 (ESTA)",
      en: "Visa-free up to 90 days (ESTA)",
      zh: "免签最长90天(ESTA)",
      vi: "Miễn visa tối đa 90 ngày (ESTA)",
    },
    paras: {
      ko: [
        "한국은 미국의 비자면제프로그램(VWP) 가입국이라, 관광·단기출장·환승은 비자 없이 갈 수 있습니다. 다만 출발 전 전자여행허가 ESTA를 미리 받아야 합니다.",
        "ESTA는 전자여권 소지자만 대상이며, 한 번 승인되면 2년간(여권 만료가 먼저면 그때까지) 여러 번 쓸 수 있고 1회 최대 90일 체류입니다. ESTA 승인이 입국을 100% 보장하지는 않습니다.",
        "반드시 미 정부 공식 사이트(esta.cbp.dhs.gov)에서 신청하세요. 검색 상단의 대행업체는 수수료를 더 받습니다.",
      ],
      en: [
        "Korea is a Visa Waiver Program (VWP) country, so tourism, short business trips and transit need no visa — but you must obtain the ESTA travel authorization before departure.",
        "ESTA is for e-passport holders. Once approved it is valid for two years (or until the passport expires) with multiple entries, each stay up to 90 days. ESTA approval does not guarantee entry.",
        "Apply only on the official US site (esta.cbp.dhs.gov). Agencies at the top of search results charge extra fees.",
      ],
      zh: [
        "韩国是美国免签证计划(VWP)成员国,旅游·短期商务·过境无需签证,但出发前必须先取得电子旅行许可ESTA。",
        "ESTA仅面向电子护照持有者。批准后有效期两年(护照更早到期则以护照为准),可多次入境,每次最长停留90天。ESTA获批并不100%保证入境。",
        "务必在美国政府官方网站(esta.cbp.dhs.gov)申请。搜索结果顶部的代办机构会额外收费。",
      ],
      vi: [
        "Hàn Quốc thuộc Chương trình Miễn thị thực (VWP) của Mỹ, nên du lịch, công tác ngắn và quá cảnh không cần visa — nhưng phải xin phép du lịch điện tử ESTA trước khi khởi hành.",
        "ESTA dành cho người có hộ chiếu điện tử. Sau khi được duyệt, có hiệu lực hai năm (hoặc đến khi hộ chiếu hết hạn), nhập cảnh nhiều lần, mỗi lần tối đa 90 ngày. Được duyệt ESTA không đảm bảo 100% được nhập cảnh.",
        "Chỉ nộp trên trang chính thức của Mỹ (esta.cbp.dhs.gov). Các đại lý ở đầu kết quả tìm kiếm thu thêm phí.",
      ],
    },
  },
  {
    key: "europe",
    flag: "🇪🇺",
    name: {
      ko: "유럽 (셰겐)",
      en: "Europe (Schengen)",
      zh: "欧洲(申根)",
      vi: "Châu Âu (Schengen)",
    },
    status: "free",
    stay: {
      ko: "무비자 180일 중 90일",
      en: "Visa-free 90 days in any 180",
      zh: "免签 180天内90天",
      vi: "Miễn visa 90/180 ngày",
    },
    paras: {
      ko: [
        "프랑스·독일·이탈리아·스페인 등 셰겐 지역은 한국 여권으로 180일 중 90일까지 무비자 관광이 가능합니다. 셰겐은 국경 통제를 없앤 유럽 30개국 권역이라, 여러 나라를 합산해 90일로 계산합니다.",
        "새 전자여행허가 ETIAS가 도입 예정이지만, 2026년 7월 기준 아직 시행되지 않았고 여러 차례 연기됐습니다. 시행되면 사전에 온라인으로 약 €20를 내고 허가를 받아야 합니다(미성년·70세 이상 면제).",
        "여행 시점에 ETIAS가 필요한지 EU 공식 채널에서 확인하세요. 시행 전까지는 신청할 필요가 없습니다.",
      ],
      en: [
        "The Schengen area (France, Germany, Italy, Spain and more) allows Korean passport holders 90 days of visa-free tourism in any 180. Schengen is a 30-country zone with no internal borders, so days across countries are counted together toward the 90.",
        "The new ETIAS travel authorization is coming, but as of July 2026 it has not launched and has been repeatedly delayed. Once live, you will pay about €20 online in advance (free for minors and those 70+).",
        "Check EU official channels for whether ETIAS is required at your travel date. Until it launches, there is nothing to apply for.",
      ],
      zh: [
        "法国·德国·意大利·西班牙等申根区,韩国护照可在180天内免签旅游90天。申根是取消内部边境的30国区域,多国停留天数合并计入这90天。",
        "新的电子旅行许可ETIAS即将推出,但截至2026年7月尚未启动,并多次延期。一旦上线,需提前在线支付约20欧元获取许可(未成年人及70岁以上免费)。",
        "请在欧盟官方渠道确认出行当时是否需要ETIAS。在其启动前,无需申请。",
      ],
      vi: [
        "Khu vực Schengen (Pháp, Đức, Ý, Tây Ban Nha và hơn thế) cho phép người mang hộ chiếu Hàn du lịch miễn visa 90 ngày trong bất kỳ 180 ngày nào. Schengen là vùng 30 nước không có biên giới nội bộ, nên số ngày ở các nước được cộng gộp vào 90 ngày.",
        "Phép du lịch điện tử ETIAS mới sắp có, nhưng tính đến tháng 7/2026 vẫn chưa vận hành và đã bị hoãn nhiều lần. Khi có hiệu lực, bạn sẽ trả khoảng €20 trực tuyến trước (miễn phí cho trẻ vị thành niên và người từ 70 tuổi).",
        "Hãy kiểm tra kênh chính thức của EU xem ETIAS có bắt buộc vào thời điểm bạn đi hay không. Cho đến khi ra mắt, không có gì để nộp.",
      ],
    },
  },
  {
    key: "japan",
    flag: "🇯🇵",
    name: { ko: "일본", en: "Japan", zh: "日本", vi: "Nhật Bản" },
    status: "free",
    stay: {
      ko: "무비자 최대 90일",
      en: "Visa-free up to 90 days",
      zh: "免签最长90天",
      vi: "Miễn visa tối đa 90 ngày",
    },
    paras: {
      ko: [
        "일본은 한국 여권 소지자에게 관광·상용·회의·친지 방문 목적의 단기 체류를 최대 90일까지 무비자로 허용합니다.",
        "무비자로는 취업이나 보수를 받는 활동을 할 수 없습니다. 실제 허용 체류일은 입국 심사관이 결정합니다. 한국은 90일 초과 연장 협정 대상이 아니므로, 90일 넘게 머물려면 사전에 해당 비자를 받아야 합니다.",
      ],
      en: [
        "Japan grants Korean passport holders visa-free short stays of up to 90 days for tourism, business meetings, conferences and visiting relatives.",
        "You cannot work or earn income on the visa-free entry, and the actual permitted stay is set by the immigration officer. Korea is not covered by the 90-day extension arrangement, so a longer stay needs the appropriate visa arranged in advance.",
      ],
      zh: [
        "日本给予韩国护照持有者以旅游·商务会议·会议·探亲为目的、最长90天的短期免签停留。",
        "免签入境不得工作或从事获取报酬的活动,实际允许停留天数由入境审查官决定。韩国不在90天延长协定对象之列,若需停留超过90天,须提前取得相应签证。",
      ],
      vi: [
        "Nhật Bản cho phép người mang hộ chiếu Hàn lưu trú ngắn hạn miễn visa tối đa 90 ngày với mục đích du lịch, họp kinh doanh, hội nghị và thăm thân.",
        "Không được làm việc hay hoạt động có thu nhập khi nhập cảnh miễn visa, và số ngày được phép thực tế do nhân viên xuất nhập cảnh quyết định. Hàn Quốc không thuộc diện gia hạn 90 ngày, nên muốn ở lâu hơn phải xin visa phù hợp trước.",
      ],
    },
  },
  {
    key: "china",
    flag: "🇨🇳",
    name: { ko: "중국", en: "China", zh: "中国", vi: "Trung Quốc" },
    status: "free",
    stay: {
      ko: "무비자 최대 30일 (한시)",
      en: "Visa-free up to 30 days (temporary)",
      zh: "免签最长30天(临时)",
      vi: "Miễn visa tối đa 30 ngày (tạm thời)",
    },
    paras: {
      ko: [
        "중국은 한시적 정책으로 한국 일반여권 소지자에게 최대 30일 무비자 입국을 허용합니다(2024년 11월 시작, 현재 2026년 12월 31일까지 연장). 관광·출장·친지 방문·교류·경유가 대상입니다.",
        "취업·장기 유학·취재는 이 무비자 대상이 아니며, 별도 비자를 받아야 합니다. 체류 30일은 입국 다음 날 0시부터 계산합니다.",
        "한시 정책이라 종료·변경될 수 있으니 출발 전 주한 중국대사관에서 재확인하세요. 홍콩(90일)·마카오(30일)는 별도 규정입니다.",
      ],
      en: [
        "Under a temporary policy, China allows ordinary Korean passport holders visa-free entry for up to 30 days (started November 2024, currently extended to 31 December 2026). It covers tourism, business, visiting relatives, exchanges and transit.",
        "Employment, long-term study and journalism are not covered and need a separate visa. The 30 days count from midnight on the day after entry.",
        "Because it is temporary, it can end or change — reconfirm with the Chinese embassy in Korea before departure. Hong Kong (90 days) and Macau (30 days) have their own rules.",
      ],
      zh: [
        "根据临时政策,中国给予韩国普通护照持有者最长30天免签入境(2024年11月启动,现延长至2026年12月31日)。适用于旅游·商务·探亲·交流·过境。",
        "就业·长期留学·采访不在免签范围内,须另办签证。30天停留自入境次日零时起算。",
        "由于是临时政策,可能终止或变更,出发前请向中国驻韩使馆再确认。香港(90天)·澳门(30天)另有规定。",
      ],
      vi: [
        "Theo chính sách tạm thời, Trung Quốc cho phép người mang hộ chiếu phổ thông Hàn Quốc nhập cảnh miễn visa tối đa 30 ngày (bắt đầu tháng 11/2024, hiện gia hạn đến 31/12/2026). Áp dụng cho du lịch, công tác, thăm thân, giao lưu và quá cảnh.",
        "Làm việc, du học dài hạn và tác nghiệp báo chí không thuộc diện này và cần visa riêng. 30 ngày tính từ 0 giờ ngày sau khi nhập cảnh.",
        "Vì là chính sách tạm thời, nó có thể kết thúc hoặc thay đổi — hãy xác nhận lại với đại sứ quán Trung Quốc tại Hàn trước khi đi. Hồng Kông (90 ngày) và Ma Cao (30 ngày) có quy định riêng.",
      ],
    },
  },
  {
    key: "vietnam",
    flag: "🇻🇳",
    name: { ko: "베트남", en: "Vietnam", zh: "越南", vi: "Việt Nam" },
    status: "free",
    stay: {
      ko: "무비자 최대 45일",
      en: "Visa-free up to 45 days",
      zh: "免签最长45天",
      vi: "Miễn visa tối đa 45 ngày",
    },
    paras: {
      ko: [
        "베트남은 한국 여권 소지자에게 목적과 무관하게 최대 45일 무비자 입국을 허용합니다(2023년 시행, 현행 정책은 2028년 3월 14일까지).",
        "무비자 입국은 현지에서 연장이 안 됩니다. 45일을 넘겨 머물 계획이면 출발 전에 전자비자(e-Visa)를 받아야 하며, e-Visa로는 최대 90일까지 체류할 수 있습니다.",
        "여권 유효기간은 입국일 기준 6개월 이상 남아 있어야 합니다.",
      ],
      en: [
        "Vietnam grants Korean passport holders visa-free entry for up to 45 days regardless of purpose (in force since 2023; the current policy runs to 14 March 2028).",
        "Visa-free entry cannot be extended locally. To stay beyond 45 days, get an e-Visa before departure, which allows up to 90 days.",
        "Your passport must be valid for at least six months from the date of entry.",
      ],
      zh: [
        "越南给予韩国护照持有者不论目的、最长45天的免签入境(自2023年施行,现行政策至2028年3月14日)。",
        "免签入境无法在当地延长。若计划停留超过45天,须在出发前办理电子签证(e-Visa),电子签最长可停留90天。",
        "护照自入境日起须有至少6个月有效期。",
      ],
      vi: [
        "Việt Nam cho phép người mang hộ chiếu Hàn nhập cảnh miễn visa tối đa 45 ngày bất kể mục đích (áp dụng từ 2023; chính sách hiện tại kéo dài đến 14/3/2028).",
        "Nhập cảnh miễn visa không thể gia hạn tại chỗ. Muốn ở quá 45 ngày, hãy xin e-Visa trước khi đi, cho phép lưu trú tối đa 90 ngày.",
        "Hộ chiếu phải còn hạn ít nhất sáu tháng kể từ ngày nhập cảnh.",
      ],
    },
  },
  {
    key: "thailand",
    flag: "🇹🇭",
    name: { ko: "태국", en: "Thailand", zh: "泰国", vi: "Thái Lan" },
    status: "free",
    stay: {
      ko: "무비자 최대 90일",
      en: "Visa-free up to 90 days",
      zh: "免签最长90天",
      vi: "Miễn visa tối đa 90 ngày",
    },
    paras: {
      ko: [
        "태국은 한국과 1981년 비자면제협정을 맺어, 한국 여권 소지자는 관광·방문 목적으로 최대 90일까지 무비자 체류가 가능합니다. 최근 '무비자 60일 축소' 뉴스는 다른 국가 대상이며 한국인에게는 영향이 없습니다.",
        "단, 태국은 입국 전 디지털 입국신고서(TDAC) 작성을 의무화하고 있으니 출발 전 온라인으로 미리 제출하세요. 취업 목적은 무비자 대상이 아닙니다.",
      ],
      en: [
        "Thailand has a 1981 visa-exemption agreement with Korea, so Korean passport holders can stay visa-free for up to 90 days for tourism or visits. Recent 'visa-free cut to 60 days' news applies to other countries, not Koreans.",
        "However, Thailand now requires the digital arrival card (TDAC) before entry, so submit it online before departure. Work purposes are not covered by visa-free entry.",
      ],
      zh: [
        "泰国与韩国于1981年签订免签协定,韩国护照持有者以旅游·访问为目的可免签停留最长90天。近期'免签缩短至60天'的新闻针对其他国家,对韩国人没有影响。",
        "但泰国现要求入境前填写数字入境卡(TDAC),请出发前在线提交。就业目的不在免签范围内。",
      ],
      vi: [
        "Thái Lan có hiệp định miễn thị thực năm 1981 với Hàn Quốc, nên người mang hộ chiếu Hàn có thể ở miễn visa tối đa 90 ngày với mục đích du lịch hoặc thăm viếng. Tin 'giảm miễn visa xuống 60 ngày' gần đây áp dụng cho nước khác, không ảnh hưởng người Hàn.",
        "Tuy nhiên, Thái Lan nay yêu cầu khai thẻ nhập cảnh điện tử (TDAC) trước khi nhập cảnh, hãy nộp trực tuyến trước khi đi. Mục đích làm việc không thuộc diện miễn visa.",
      ],
    },
  },
  {
    key: "india",
    flag: "🇮🇳",
    name: { ko: "인도", en: "India", zh: "印度", vi: "Ấn Độ" },
    status: "visa",
    stay: {
      ko: "e-비자 필수 (무비자 아님)",
      en: "e-Visa required (not visa-free)",
      zh: "需e-签证(非免签)",
      vi: "Bắt buộc e-Visa (không miễn visa)",
    },
    paras: {
      ko: [
        "인도는 무비자 대상이 아닙니다. 한국 여권 소지자도 반드시 전자비자(e-Visa)를 미리 받아야 합니다.",
        "관광 e-비자는 목적에 따라 30일·1년·5년 등으로 나뉘고, 사업 e-비자는 최대 180일입니다. 보통 2~3일 내 발급되지만, 반려·지연을 대비해 최소 1~2주 전 신청을 권합니다.",
        "출국 시 승인서(ETA)를 지참하고, 180일 이상 체류하면 도착 후 14일 내 FRRO(외국인등록사무소) 등록이 필요합니다. 공식 인도 정부 e-비자 사이트에서 신청하세요.",
      ],
      en: [
        "India is not visa-free. Korean passport holders must obtain an e-Visa in advance.",
        "The tourist e-Visa comes in 30-day, 1-year and 5-year options depending on purpose, and the business e-Visa allows up to 180 days. It is usually issued within 2–3 days, but apply at least 1–2 weeks ahead to allow for rejections or delays.",
        "Carry the approval (ETA) when you travel, and if you stay over 180 days, register with the FRRO (Foreigners Regional Registration Office) within 14 days of arrival. Apply on the official Indian government e-Visa site.",
      ],
      zh: [
        "印度不属于免签。韩国护照持有者也必须提前办理电子签证(e-Visa)。",
        "旅游e-签证按目的分为30天·1年·5年等,商务e-签证最长180天。通常2~3天内签发,但为防反签或延误,建议至少提前1~2周申请。",
        "出行时须携带批准函(ETA);停留超过180天,须在抵达后14天内到FRRO(外国人地区登记处)登记。请在印度政府官方e-签证网站申请。",
      ],
      vi: [
        "Ấn Độ không miễn visa. Người mang hộ chiếu Hàn cũng phải xin e-Visa trước.",
        "e-Visa du lịch có các loại 30 ngày, 1 năm và 5 năm tùy mục đích, còn e-Visa công tác cho tối đa 180 ngày. Thường cấp trong 2–3 ngày, nhưng hãy nộp trước ít nhất 1–2 tuần để phòng bị từ chối hoặc chậm trễ.",
        "Mang theo phê duyệt (ETA) khi đi, và nếu ở quá 180 ngày, phải đăng ký với FRRO (Văn phòng đăng ký người nước ngoài khu vực) trong vòng 14 ngày sau khi đến. Hãy nộp trên trang e-Visa chính thức của chính phủ Ấn Độ.",
      ],
    },
  },
];

interface Faq {
  q: Record<Locale, string>;
  a: Record<Locale, string>;
}

const FAQS: ReadonlyArray<Faq> = [
  {
    q: {
      ko: "무비자면 아무 목적으로나 갈 수 있나요?",
      en: "Does visa-free mean I can go for any purpose?",
      zh: "免签就能以任何目的前往吗?",
      vi: "Miễn visa nghĩa là đi với mục đích nào cũng được?",
    },
    a: {
      ko: "아니요. 무비자는 관광·단기출장·친지 방문 등 단기 목적에 한합니다. 취업·유학·장기 체류·보수를 받는 활동은 무비자로 할 수 없고, 목적에 맞는 비자를 따로 받아야 합니다.",
      en: "No. Visa-free covers short-term purposes such as tourism, brief business trips and visiting relatives. Employment, study, long-term stays and paid activity are not allowed visa-free — you need the appropriate visa.",
      zh: "不能。免签仅限旅游·短期商务·探亲等短期目的。就业·留学·长期停留·获取报酬的活动不能免签进行,须另办相应签证。",
      vi: "Không. Miễn visa chỉ dành cho mục đích ngắn hạn như du lịch, công tác ngắn và thăm thân. Làm việc, du học, lưu trú dài hạn và hoạt động có thù lao không được phép miễn visa — bạn cần visa phù hợp.",
    },
  },
  {
    q: {
      ko: "여권 유효기간은 얼마나 남아 있어야 하나요?",
      en: "How much passport validity do I need?",
      zh: "护照需要多久的有效期?",
      vi: "Hộ chiếu cần còn hạn bao lâu?",
    },
    a: {
      ko: "많은 나라가 입국일 기준 최소 6개월 유효기간을 요구합니다. 왕복 또는 제3국행 항공권을 요구하기도 합니다. 출발 전 여권 잔여기간과 각국 요건을 확인하세요.",
      en: "Many countries require at least six months of validity from the entry date, and some ask for a return or onward ticket. Check your remaining validity and each country's rules before departure.",
      zh: "许多国家要求自入境日起至少6个月有效期,部分还要求往返或前往第三国的机票。出发前请确认护照剩余有效期及各国要求。",
      vi: "Nhiều nước yêu cầu hộ chiếu còn hạn ít nhất sáu tháng kể từ ngày nhập cảnh, và một số đòi vé khứ hồi hoặc đi tiếp. Hãy kiểm tra thời hạn còn lại và quy định của từng nước trước khi đi.",
    },
  },
  {
    q: {
      ko: "ESTA·ETIAS·TDAC는 비자인가요?",
      en: "Are ESTA, ETIAS and TDAC visas?",
      zh: "ESTA·ETIAS·TDAC是签证吗?",
      vi: "ESTA, ETIAS và TDAC có phải visa không?",
    },
    a: {
      ko: "비자가 아니라 사전 전자허가·신고입니다. 무비자로 가더라도 미국은 ESTA, (시행 시) 유럽은 ETIAS, 태국은 TDAC처럼 출발 전 온라인 절차가 필요할 수 있습니다. 비자보다 간단하지만 빠뜨리면 탑승·입국이 거부될 수 있습니다.",
      en: "They are not visas but pre-travel electronic authorizations or declarations. Even visa-free, you may need an online step before departure — ESTA for the US, ETIAS for Europe (once live), TDAC for Thailand. Simpler than a visa, but skipping it can mean denied boarding or entry.",
      zh: "它们不是签证,而是出行前的电子许可或申报。即使免签,出发前也可能需要在线手续——美国ESTA、欧洲ETIAS(启用后)、泰国TDAC。比签证简单,但遗漏可能导致拒绝登机或入境。",
      vi: "Chúng không phải visa mà là phép điện tử hoặc khai báo trước chuyến đi. Dù miễn visa, bạn có thể cần một bước trực tuyến trước khi đi — ESTA cho Mỹ, ETIAS cho châu Âu (khi vận hành), TDAC cho Thái Lan. Đơn giản hơn visa, nhưng bỏ sót có thể bị từ chối lên máy bay hoặc nhập cảnh.",
    },
  },
];

const COPY = {
  ko: {
    metaTitle: "한국 여권 무비자 나라 총정리 — 미국·유럽·일본·중국·베트남·태국·인도 (2026)",
    metaDesc:
      "한국 여권으로 무비자 가능한 나라와 비자·전자허가가 필요한 나라를 한눈에. 미국 ESTA, 유럽 ETIAS, 일본·중국·베트남·태국 무비자 기간, 인도 e-비자까지 2026년 기준 정리.",
    ogLocale: "ko_KR",
    eyebrow: "해외여행 · 비자",
    h1: "한국 여권 무비자 나라 — 어디는 그냥 가고, 어디는 준비가 필요할까",
    updated:
      "2026년 7월 기준. 비자 정책은 수시로 바뀌므로 출발 전 각국 대사관·외교부 해외안전여행에서 최신 정보를 확인하세요.",
    introHeading: "한국 여권, 어디까지 그냥 갈 수 있나",
    intro: [
      "한국 여권은 세계 최상위권의 '힘센 여권'으로, 190여 개 국가·지역을 무비자 또는 도착비자로 방문할 수 있습니다. 그래서 대부분의 인기 여행지는 비자 없이 갈 수 있죠.",
      "다만 '무비자'는 관광·단기 방문에 한정되고, 나라마다 체류 기간이 다릅니다. 또 미국 ESTA, (예정된) 유럽 ETIAS, 태국 TDAC처럼 '비자는 아니지만 출발 전 온라인 절차'가 필요한 곳도 있습니다. 아래에서 대표 여행지를 하나씩 정리합니다.",
    ],
    tableHeading: "한눈에 보기",
    thCountry: "국가",
    thStatus: "구분",
    thStay: "체류",
    destHeading: "국가별 상세",
    tipsHeading: "출발 전 공통 체크",
    tips: [
      "여권 유효기간: 입국일 기준 6개월 이상 남았는지 확인.",
      "전자허가·신고: 미국 ESTA, (시행 시) 유럽 ETIAS, 태국 TDAC 등 사전 온라인 절차 챙기기.",
      "공식 사이트만 이용: ESTA·e-비자는 정부 공식 사이트에서. 검색 상단 대행업체는 수수료가 붙습니다.",
      "체류일 계산: 셰겐 90/180일, 무비자 30·45·90일 등 초과하지 않도록 미리 계산.",
    ],
    relatedHeading: "관련 도구·가이드",
    faqHeading: "자주 묻는 질문",
    closingHeading: "정리",
    closing:
      "한국 여권이면 미국(ESTA)·유럽(무비자, ETIAS 예정)·일본·중국(한시 30일)·베트남(45일)·태국(90일)까지 대부분 비교적 간단히 갈 수 있고, 인도만 e-비자가 필수입니다. 무비자라도 체류 기간과 전자허가 여부는 나라마다 다르고 수시로 바뀌니, 출발 전 반드시 공식 채널에서 확인하세요.",
    breadcrumbHome: "홈",
    breadcrumbGuide: "가이드",
    breadcrumbThis: "한국 여권 무비자 나라",
    backToGuides: "가이드 모음",
  },
  en: {
    metaTitle:
      "Korea Passport Visa-Free Countries — US, Europe, Japan, China, Vietnam, Thailand, India (2026)",
    metaDesc:
      "Which countries a Korean passport enters visa-free, and which need a visa or e-authorization. US ESTA, Europe ETIAS, visa-free stays for Japan, China, Vietnam, Thailand, and India's e-Visa — as of 2026.",
    ogLocale: "en_US",
    eyebrow: "Travel · Visas",
    h1: "Korea Passport Visa-Free Countries — Where You Just Go, Where You Prepare",
    updated:
      "As of July 2026. Visa policies change often — confirm with each country's embassy or your foreign ministry before departure.",
    introHeading: "How far a Korean passport takes you",
    intro: [
      "The Korean passport is one of the world's strongest, entering some 190 countries and territories visa-free or with visa-on-arrival. So most popular destinations need no visa.",
      "But 'visa-free' means tourism and short visits only, and each country sets its own length. Some also need a pre-travel online step that is not a visa — US ESTA, the coming Europe ETIAS, Thailand's TDAC. Below, the main destinations one by one.",
    ],
    tableHeading: "At a glance",
    thCountry: "Country",
    thStatus: "Status",
    thStay: "Stay",
    destHeading: "Country details",
    tipsHeading: "Before you go — common checks",
    tips: [
      "Passport validity: confirm at least six months from your entry date.",
      "e-Authorizations: line up ESTA (US), ETIAS (Europe, once live), TDAC (Thailand) and similar online steps.",
      "Official sites only: apply for ESTA and e-Visas on government sites. Agencies at the top of search add fees.",
      "Count your days: don't exceed Schengen 90/180, or the 30/45/90-day visa-free limits — calculate ahead.",
    ],
    relatedHeading: "Related tools & guides",
    faqHeading: "Frequently asked questions",
    closingHeading: "Bottom line",
    closing:
      "With a Korean passport, the US (ESTA), Europe (visa-free, ETIAS pending), Japan, China (temporary 30 days), Vietnam (45 days) and Thailand (90 days) are mostly straightforward; only India requires an e-Visa. Even visa-free, stay lengths and e-authorization rules differ by country and change often, so always confirm on official channels before departure.",
    breadcrumbHome: "Home",
    breadcrumbGuide: "Guides",
    breadcrumbThis: "Korea passport visa-free countries",
    backToGuides: "All guides",
  },
  zh: {
    metaTitle:
      "韩国护照免签国家总整理 — 美国·欧洲·日本·中国·越南·泰国·印度(2026)",
    metaDesc:
      "韩国护照免签国家,以及需签证或电子许可的国家一目了然。美国ESTA、欧洲ETIAS、日本·中国·越南·泰国免签期限、印度e-签证,均为2026年基准。",
    ogLocale: "zh_CN",
    eyebrow: "海外旅行 · 签证",
    h1: "韩国护照免签国家 — 哪里直接去,哪里要准备",
    updated:
      "2026年7月基准。签证政策时常变动,出发前请向各国使馆·外交部海外安全旅行确认最新信息。",
    introHeading: "韩国护照能走多远",
    intro: [
      "韩国护照是全球最强护照之一,可免签或落地签进入约190个国家和地区。因此大多数热门旅行地都无需签证。",
      "但'免签'仅限旅游·短期访问,各国停留期限不同。此外还有并非签证、但出发前需在线办理的手续——美国ESTA、即将推出的欧洲ETIAS、泰国TDAC。下面逐一梳理主要目的地。",
    ],
    tableHeading: "一目了然",
    thCountry: "国家",
    thStatus: "类别",
    thStay: "停留",
    destHeading: "各国详情",
    tipsHeading: "出发前通用检查",
    tips: [
      "护照有效期:确认自入境日起至少6个月。",
      "电子许可:准备好美国ESTA、欧洲ETIAS(启用后)、泰国TDAC等在线手续。",
      "仅用官方网站:ESTA与e-签证请在政府官网申请。搜索顶部的代办会加收费用。",
      "计算停留天数:勿超过申根90/180或30/45/90天免签上限,提前算好。",
    ],
    relatedHeading: "相关工具与指南",
    faqHeading: "常见问题",
    closingHeading: "小结",
    closing:
      "持韩国护照,美国(ESTA)·欧洲(免签,ETIAS待定)·日本·中国(临时30天)·越南(45天)·泰国(90天)大多较简单,只有印度需要e-签证。即使免签,停留期限与电子许可要求也因国而异且时常变动,出发前请务必在官方渠道确认。",
    breadcrumbHome: "首页",
    breadcrumbGuide: "指南",
    breadcrumbThis: "韩国护照免签国家",
    backToGuides: "全部指南",
  },
  vi: {
    metaTitle:
      "Các nước miễn visa cho hộ chiếu Hàn Quốc — Mỹ, Châu Âu, Nhật, Trung Quốc, Việt Nam, Thái Lan, Ấn Độ (2026)",
    metaDesc:
      "Những nước hộ chiếu Hàn Quốc vào miễn visa, và những nước cần visa hoặc phép điện tử, trong nháy mắt. ESTA của Mỹ, ETIAS châu Âu, thời gian miễn visa cho Nhật, Trung Quốc, Việt Nam, Thái Lan và e-Visa Ấn Độ — tính đến 2026.",
    ogLocale: "vi_VN",
    eyebrow: "Du lịch nước ngoài · Visa",
    h1: "Các nước miễn visa cho hộ chiếu Hàn Quốc — Đâu cứ đi, đâu cần chuẩn bị",
    updated:
      "Tính đến tháng 7/2026. Chính sách visa thay đổi thường xuyên — hãy xác nhận với đại sứ quán từng nước hoặc bộ ngoại giao trước khi đi.",
    introHeading: "Hộ chiếu Hàn đưa bạn đi được xa đến đâu",
    intro: [
      "Hộ chiếu Hàn Quốc thuộc nhóm mạnh nhất thế giới, vào khoảng 190 quốc gia và vùng lãnh thổ miễn visa hoặc visa tại cửa khẩu. Nên hầu hết điểm đến phổ biến đều không cần visa.",
      "Nhưng 'miễn visa' chỉ dành cho du lịch và thăm ngắn ngày, và mỗi nước đặt thời hạn riêng. Một số nơi còn cần bước trực tuyến trước chuyến đi mà không phải visa — ESTA của Mỹ, ETIAS châu Âu sắp tới, TDAC của Thái Lan. Dưới đây là các điểm đến chính, từng nước một.",
    ],
    tableHeading: "Nhìn nhanh",
    thCountry: "Nước",
    thStatus: "Phân loại",
    thStay: "Lưu trú",
    destHeading: "Chi tiết từng nước",
    tipsHeading: "Trước khi đi — kiểm tra chung",
    tips: [
      "Hạn hộ chiếu: xác nhận còn ít nhất sáu tháng kể từ ngày nhập cảnh.",
      "Phép điện tử: chuẩn bị ESTA (Mỹ), ETIAS (châu Âu, khi có), TDAC (Thái Lan) và các bước trực tuyến tương tự.",
      "Chỉ dùng trang chính thức: nộp ESTA và e-Visa trên trang của chính phủ. Đại lý ở đầu tìm kiếm thu thêm phí.",
      "Đếm số ngày: đừng vượt Schengen 90/180 hay giới hạn miễn visa 30/45/90 ngày — hãy tính trước.",
    ],
    relatedHeading: "Công cụ & hướng dẫn liên quan",
    faqHeading: "Câu hỏi thường gặp",
    closingHeading: "Kết luận",
    closing:
      "Với hộ chiếu Hàn, Mỹ (ESTA), châu Âu (miễn visa, ETIAS chờ áp dụng), Nhật, Trung Quốc (tạm thời 30 ngày), Việt Nam (45 ngày) và Thái Lan (90 ngày) hầu hết khá đơn giản; chỉ Ấn Độ cần e-Visa. Ngay cả khi miễn visa, thời gian lưu trú và quy định phép điện tử khác nhau tùy nước và thay đổi thường xuyên, nên luôn xác nhận trên kênh chính thức trước khi đi.",
    breadcrumbHome: "Trang chủ",
    breadcrumbGuide: "Hướng dẫn",
    breadcrumbThis: "Nước miễn visa cho hộ chiếu Hàn",
    backToGuides: "Tất cả hướng dẫn",
  },
} as const;

const RELATED: ReadonlyArray<{ href: string; label: Record<Locale, string> }> = [
  {
    href: "/visa-days",
    label: {
      ko: "체류일수 계산기 (셰겐 90/180일)",
      en: "Days calculator (Schengen 90/180)",
      zh: "停留天数计算器(申根90/180)",
      vi: "Máy tính số ngày (Schengen 90/180)",
    },
  },
  {
    href: "/guide/foreign-work-visa-korea",
    label: {
      ko: "반대로, 외국인이 한국 올 때 — 국적별 취업비자",
      en: "The reverse — foreigners' work visas to Korea by nationality",
      zh: "反过来,外国人来韩 — 按国籍看工作签证",
      vi: "Ngược lại — visa lao động của người nước ngoài vào Hàn theo quốc tịch",
    },
  },
];

const TAGS: Record<"ko" | "en" | "zh" | "vi", string[]> = {
  ko: ["무비자 국가", "여권 파워", "미국 ESTA", "유럽 ETIAS", "인도 e비자", "해외여행 준비"],
  en: [
    "visa-free countries",
    "passport power",
    "US ESTA",
    "Europe ETIAS",
    "India e-Visa",
    "travel prep",
  ],
  zh: ["免签国家", "护照实力", "美国ESTA", "欧洲ETIAS", "印度e签证", "出行准备"],
  vi: [
    "nước miễn visa",
    "sức mạnh hộ chiếu",
    "ESTA Mỹ",
    "ETIAS châu Âu",
    "e-Visa Ấn Độ",
    "chuẩn bị du lịch",
  ],
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const c = COPY[localeKeyOf(locale)];
  return {
    title: c.metaTitle,
    description: c.metaDesc,
    alternates: {
      canonical: `/${locale}/guide/korea-passport-visa-free`,
      languages: buildLanguagesAlt("/guide/korea-passport-visa-free"),
    },
    openGraph: {
      title: c.metaTitle,
      description: c.metaDesc,
      type: "article",
      url: `${SITE_URL}/${locale}/guide/korea-passport-visa-free`,
      locale: c.ogLocale,
    },
  };
}

export function generateStaticParams(): Array<{ locale: string }> {
  return locales.map((locale) => ({ locale }));
}

export default async function KoreaPassportVisaFreePage({
  params,
}: PageProps): Promise<React.ReactElement> {
  const { locale } = await params;
  const localeKey = localeKeyOf(locale);
  const c = COPY[localeKey];

  const faqItems = FAQS.map((f) => ({
    question: f.q[localeKey],
    answer: f.a[localeKey],
  }));

  return (
    <main className="px-4 pb-16 pt-6 md:px-6 md:pt-12">
      <FaqJsonLd items={faqItems} id="korea-passport-visa-free" />
      <div className="mx-auto max-w-3xl">
        <Breadcrumbs
          path="/guide/korea-passport-visa-free"
          locale={localeKey}
          id="guide-korea-passport-visa-free"
          currentName={c.h1}
        />

        <article className="space-y-8 leading-relaxed text-[color:var(--color-text-secondary)]">
          <header>
            <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
              {c.eyebrow}
            </p>
            <h1 className="mt-2 flex items-start gap-2 text-3xl font-bold tracking-tight text-[color:var(--color-text-primary)] md:text-4xl">
              <Plane className="mt-1 h-7 w-7 shrink-0 text-indigo-400" />
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
              {c.tableHeading}
            </h2>
            <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
              <table className="w-full text-sm">
                <thead className="text-xs uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                  <tr>
                    <th className="px-4 py-2 text-left font-medium">
                      {c.thCountry}
                    </th>
                    <th className="px-4 py-2 text-left font-medium">
                      {c.thStatus}
                    </th>
                    <th className="px-4 py-2 text-left font-medium">
                      {c.thStay}
                    </th>
                  </tr>
                </thead>
                <tbody className="text-[color:var(--color-text-secondary)]">
                  {DESTINATIONS.map((d) => (
                    <tr
                      key={d.key}
                      className="border-t border-[color:var(--color-border-subtle)] align-top"
                    >
                      <td className="whitespace-nowrap px-4 py-2.5 font-medium text-[color:var(--color-text-primary)]">
                        <span className="mr-1.5" aria-hidden>
                          {d.flag}
                        </span>
                        {d.name[localeKey]}
                      </td>
                      <td className="px-4 py-2.5">
                        <span
                          className={`inline-block whitespace-nowrap rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${STATUS_CLASS[d.status]}`}
                        >
                          {STATUS_LABEL[d.status][localeKey]}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">{d.stay[localeKey]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-5">
            <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
              {c.destHeading}
            </h2>
            <div className="space-y-4">
              {DESTINATIONS.map((d) => (
                <div
                  key={d.key}
                  className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-5"
                >
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="text-2xl" aria-hidden>
                      {d.flag}
                    </span>
                    <h3 className="text-lg font-bold text-[color:var(--color-text-primary)]">
                      {d.name[localeKey]}
                    </h3>
                    <span
                      className={`rounded-md px-1.5 py-0.5 text-[11px] font-semibold ${STATUS_CLASS[d.status]}`}
                    >
                      {STATUS_LABEL[d.status][localeKey]}
                    </span>
                    <span className="text-xs text-[color:var(--color-text-tertiary)]">
                      {d.stay[localeKey]}
                    </span>
                  </div>
                  <div className="space-y-2.5 text-sm">
                    {d.paras[localeKey].map((p, i) => (
                      <p key={i}>{p}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
              {c.tipsHeading}
            </h2>
            <ul className="list-inside list-disc space-y-1.5 text-sm">
              {c.tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-[color:var(--color-text-primary)]">
              {c.relatedHeading}
            </h2>
            <div className="grid gap-2.5 sm:grid-cols-2">
              {RELATED.map((r) => (
                <Link
                  key={r.href}
                  href={`/${locale}${r.href}`}
                  className="group flex items-center justify-between gap-2 rounded-lg border border-[color:var(--color-border-subtle)] px-4 py-3 text-sm transition-colors hover:border-[color:var(--color-border-strong)] hover:text-[color:var(--color-text-primary)]"
                >
                  <span>{r.label[localeKey]}</span>
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

        <PostTags tags={TAGS[localeKey]} locale={localeKey} />
      </div>
    </main>
  );
}
