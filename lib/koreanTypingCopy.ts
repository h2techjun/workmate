/**
 * 한글 타자(K-Type) SEO 랜딩 카피 — 단일 진실원 (4로케일 완역).
 *
 * /korean-typing 랜딩이 색인 본체이므로 본문은 도구 페이지 수준의 고유 가치를
 * 담는다(두벌식 원리·연습법·FAQ). 게임 SPA(/ktype)는 iframe 임베드로만 노출.
 * AdSense 가치 게이트 충족용 — "준비 중" 류 표현 금지, 각 로케일 실질 번역.
 */

import type { Locale } from "@/i18n";

export interface TypingSection {
  h2: string;
  body: string;
}

export interface TypingFaq {
  q: string;
  a: string;
}

export interface TypingCopy {
  metaTitle: string;
  metaDesc: string;
  keywords: string[];
  eyebrow: string;
  h1: string;
  intro: string;
  /** 게임 임베드 위 라벨/힌트 */
  playLabel: string;
  playHint: string;
  /** 본문 가이드 섹션 */
  sections: TypingSection[];
  faqHeading: string;
  faq: TypingFaq[];
  /** 게임 더 보기 유도 */
  gamesHeading: string;
  gamesBody: string;
  gamesCta: string;
  /** 신뢰 시그널 */
  reviewedLabel: string;
}

export const KOREAN_TYPING_COPY: Record<Locale, TypingCopy> = {
  ko: {
    metaTitle: "한글 타자 연습 — 두벌식 타수·정확도 실시간 측정",
    metaDesc:
      "브라우저에서 바로 하는 무료 한글 타자 연습. 초성·중성·종성이 한 글자로 합쳐지는 과정을 실시간으로 보며 두벌식 자판을 익히고, 분당 타수·정확도·콤보를 측정. 자모→단어→문장 단계별 학습, 가입·설치 없이.",
    keywords: [
      "한글 타자",
      "한글 타자 연습",
      "타자 연습",
      "두벌식",
      "타자 게임",
      "타수 측정",
      "온라인 타자 연습",
      "무료 타자 연습",
      "타자 속도 테스트",
    ],
    eyebrow: "한글 타자 · 두벌식 연습",
    h1: "한글 타자 연습",
    intro:
      "초성·중성·종성이 한 음절로 합쳐지는 과정을 눈으로 보며 두벌식 한글 타자를 익힙니다. 분당 타수·정확도·연속 콤보를 실시간으로 측정하고, 자모부터 문장까지 단계별로 실력을 올려보세요.",
    playLabel: "지금 바로 연습하기",
    playHint: "키보드로 화면의 글자를 따라 치면 타수·정확도가 자동 기록됩니다.",
    sections: [
      {
        h2: "두벌식 한글 타자란?",
        body: "한글 타자는 자음(초성·종성)과 모음(중성)이 하나의 음절로 합쳐지는 한국어의 특성을 손끝으로 익히는 연습입니다. 국내 표준 자판인 두벌식은 왼손이 자음, 오른손이 모음을 담당합니다. 예를 들어 '한글'을 치면 ㅎ+ㅏ+ㄴ, ㄱ+ㅡ+ㄹ 처럼 자모가 실시간으로 조합되죠. 이 조합 원리를 눈으로 확인하며 연습하면 자판 위치를 외우는 속도가 훨씬 빨라집니다.",
      },
      {
        h2: "무엇을, 어떻게 연습하나요",
        body: "연습은 자모 → 단어 → 문장 3단계로 난이도가 올라갑니다. 화면에는 방금 누른 자모가 하나의 글자로 합쳐지는 과정이 실시간으로 표시되고, 분당 타수(타)·정확도(%)·연속 정타 콤보가 함께 기록됩니다. 초성에서 자주 틀리는지, 받침(종성)에서 리듬이 끊기는지 즉시 확인할 수 있어 약점을 집중적으로 교정할 수 있습니다.",
      },
      {
        h2: "타자 실력을 빠르게 올리는 법",
        body: "① 자판을 보지 말고 홈 포지션(왼손 ㅁㄴㅇㄹ, 오른손 ㅗㅓㅏㅣ)에 손가락을 얹습니다. ② 속도보다 정확도가 먼저입니다 — 정확도 95%를 넘긴 뒤 속도를 올리세요. ③ 한 번에 1시간보다 하루 10분씩 꾸준히가 더 효과적입니다. ④ 받침이 있는 글자에서 손이 자주 멈추므로, 문장 단계에서 받침이 많은 단어를 집중 연습하면 실전 타수가 크게 오릅니다.",
      },
    ],
    faqHeading: "자주 묻는 질문",
    faq: [
      {
        q: "두벌식과 세벌식, 뭘 배워야 하나요?",
        a: "대부분의 컴퓨터·스마트폰 기본 자판이 두벌식이라 두벌식부터 익히는 것을 권합니다. 세벌식은 손 피로가 적다는 장점이 있지만 별도 설정이 필요해, 처음 배우는 분께는 두벌식이 실용적입니다.",
      },
      {
        q: "평균 타수는 어느 정도인가요?",
        a: "성인 기준 분당 200~300타면 일상적인 문서 작업에 무리가 없고, 400타 이상이면 상급입니다. 처음에는 100타 안팎에서 시작해 정확도를 유지하며 꾸준히 올리는 것이 목표입니다.",
      },
      {
        q: "한국어를 배우는 외국인도 할 수 있나요?",
        a: "네. 자모가 글자로 합쳐지는 과정을 시각적으로 보여주기 때문에, 한글을 갓 배운 학습자가 자판과 글자 구조를 동시에 익히기 좋습니다. 자모 단계부터 천천히 시작하세요.",
      },
      {
        q: "모바일에서도 되나요?",
        a: "브라우저에서 동작하지만, 타자 연습은 물리 키보드가 있는 PC·노트북 환경을 권장합니다. 모바일에서는 자모 조합 과정 확인용으로 활용하세요.",
      },
      {
        q: "무료인가요? 가입이 필요한가요?",
        a: "완전 무료이며 회원가입·설치가 필요 없습니다. 브라우저에서 바로 실행되고, 기록은 이 페이지에서 즉시 확인됩니다.",
      },
    ],
    gamesHeading: "타자 연습을 마쳤다면, 이번엔 게임으로",
    gamesBody:
      "화투 로그라이크·무협 타워디펜스 등 직접 만든 한국형 게임을 브라우저에서 바로 즐겨보세요. 회원가입도 설치도 필요 없습니다.",
    gamesCta: "무료 게임 전체 보기",
    reviewedLabel: "최종 검토",
  },
  en: {
    metaTitle: "Korean Typing Practice — Dubeolsik trainer with live WPM",
    metaDesc:
      "Free Korean typing practice in your browser. Watch initial, medial, and final consonants assemble into a syllable in real time, learn the standard dubeolsik keyboard, and track speed, accuracy, and combo. Jamo → words → sentences, no signup.",
    keywords: [
      "korean typing practice",
      "learn korean typing",
      "dubeolsik",
      "hangul typing",
      "korean keyboard",
      "type in korean",
      "korean typing test",
      "free korean typing",
    ],
    eyebrow: "Korean Typing · Dubeolsik",
    h1: "Korean Typing Practice",
    intro:
      "Learn to type Korean on the standard dubeolsik keyboard while watching initial, medial, and final consonants assemble into a single syllable. Track your speed, accuracy, and combo in real time, and level up from single jamo to full sentences.",
    playLabel: "Start practicing now",
    playHint: "Type the on-screen characters on your keyboard — speed and accuracy are recorded automatically.",
    sections: [
      {
        h2: "What is dubeolsik Korean typing?",
        body: "Korean typing is about internalizing how consonants (initial and final) and vowels (medial) combine into one syllable block. On the dubeolsik layout — Korea's standard keyboard — your left hand handles consonants and your right hand handles vowels. Type '한글' and you'll see ㅎ+ㅏ+ㄴ and ㄱ+ㅡ+ㄹ assemble in real time. Seeing this assembly makes memorizing key positions far faster.",
      },
      {
        h2: "What you practice, and how",
        body: "Difficulty rises through three stages: jamo → words → sentences. The screen shows each jamo you press merging into a finished character in real time, while characters-per-minute, accuracy, and your consecutive-hit combo are tracked. You can instantly see whether you miss on initial consonants or stumble on final consonants (batchim), so you can target your weak spots.",
      },
      {
        h2: "How to improve quickly",
        body: "① Keep your fingers on the home row (left ㅁㄴㅇㄹ, right ㅗㅓㅏㅣ) without looking at the keys. ② Accuracy before speed — push past 95% accuracy before chasing raw speed. ③ Ten focused minutes a day beats one long session. ④ Hands tend to pause on syllables with a final consonant, so drill batchim-heavy words in the sentence stage to lift your real-world speed.",
      },
    ],
    faqHeading: "Frequently asked questions",
    faq: [
      {
        q: "Dubeolsik or sebeolsik — which should I learn?",
        a: "Dubeolsik is the default on almost every computer and phone, so start there. Sebeolsik reduces hand strain but needs extra setup, making dubeolsik the practical choice for beginners.",
      },
      {
        q: "What is an average typing speed?",
        a: "For adults, 200–300 characters per minute handles everyday writing comfortably, and 400+ is advanced. Beginners often start near 100 CPM — the goal is steady growth while keeping accuracy high.",
      },
      {
        q: "Can Korean learners use this?",
        a: "Yes. Because it visualizes how jamo assemble into characters, it's ideal for learners who just picked up Hangul to practice the keyboard and syllable structure together. Start slow at the jamo stage.",
      },
      {
        q: "Does it work on mobile?",
        a: "It runs in the browser, but typing practice is best on a PC or laptop with a physical keyboard. On mobile, use it to observe how jamo combine.",
      },
      {
        q: "Is it free? Do I need an account?",
        a: "Completely free, with no signup or install. It runs right in your browser and your stats appear instantly on this page.",
      },
    ],
    gamesHeading: "Done typing? Try the games",
    gamesBody:
      "Play in-house Korean games — a hwatu card roguelike, a martial-arts tower defense — right in your browser. No signup, no install.",
    gamesCta: "See all free games",
    reviewedLabel: "Last reviewed",
  },
  zh: {
    metaTitle: "韩语打字练习 — 标准键盘实时打字速度·准确率",
    metaDesc:
      "在浏览器中直接进行的免费韩语打字练习。实时观看初声·中声·终声如何合成一个音节，掌握标准两拍式(두벌식)键盘，并测量每分钟打字数、准确率与连击。从字母到句子分阶段练习，无需注册与安装。",
    keywords: [
      "韩语打字",
      "韩语打字练习",
      "韩文打字",
      "两拍式键盘",
      "打字练习",
      "打字速度测试",
      "在线打字",
      "免费韩语打字",
    ],
    eyebrow: "韩语打字 · 标准键盘",
    h1: "韩语打字练习",
    intro:
      "一边观看初声·中声·终声合成为一个音节的过程，一边练习标准两拍式(두벌식)韩语打字。实时测量每分钟打字数、准确率与连续连击，从单个字母到完整句子逐级提升。",
    playLabel: "立即开始练习",
    playHint: "用键盘跟着屏幕上的字打，打字速度与准确率会自动记录。",
    sections: [
      {
        h2: "什么是两拍式韩语打字？",
        body: "韩语打字的核心，是用手指掌握辅音(初声·终声)与元音(中声)如何合成一个音节的规律。韩国的标准键盘「两拍式(두벌식)」由左手负责辅音、右手负责元音。例如输入「한글」，你会看到 ㅎ+ㅏ+ㄴ、ㄱ+ㅡ+ㄹ 实时组合。看着这个组合过程练习，记住按键位置会快得多。",
      },
      {
        h2: "练什么，怎么练",
        body: "难度分为字母 → 单词 → 句子三个阶段逐步提升。屏幕会实时显示你按下的字母合成为完整字的过程，同时记录每分钟打字数、准确率与连续正确连击。你可以立刻看出是初声容易出错，还是终声(收音)处节奏容易中断，从而集中纠正弱点。",
      },
      {
        h2: "如何快速提升",
        body: "① 不看键盘，把手指放在基准键位(左手 ㅁㄴㅇㄹ、右手 ㅗㅓㅏㅣ)。② 先准确后速度——准确率超过95%再追求速度。③ 每天10分钟坚持胜过一次练一小时。④ 带收音的字最容易卡手，在句子阶段多练收音较多的词，实战速度会明显提升。",
      },
    ],
    faqHeading: "常见问题",
    faq: [
      {
        q: "两拍式还是三拍式，该学哪个？",
        a: "几乎所有电脑和手机的默认输入都是两拍式，所以从两拍式开始。三拍式手部疲劳更小，但需要额外设置，对初学者来说两拍式更实用。",
      },
      {
        q: "平均打字速度是多少？",
        a: "成人每分钟200~300字即可轻松应对日常文书，400字以上为高级。初学者常从每分钟100字左右起步，目标是在保持高准确率的同时稳步提升。",
      },
      {
        q: "学韩语的外国人也能用吗？",
        a: "可以。因为它会可视化字母如何合成为字，非常适合刚学会韩文的学习者同时练习键盘与音节结构。请从字母阶段慢慢开始。",
      },
      {
        q: "手机上能用吗？",
        a: "可在浏览器中运行，但打字练习建议在有物理键盘的电脑上进行。在手机上，可用于观察字母的组合过程。",
      },
      {
        q: "免费吗？需要注册吗？",
        a: "完全免费，无需注册或安装。在浏览器中即刻运行，成绩会立即显示在本页面。",
      },
    ],
    gamesHeading: "练完打字，换个方式玩游戏",
    gamesBody:
      "花斗Rogue-like、武侠塔防等亲手打造的韩式游戏，在浏览器中直接畅玩。无需注册，无需安装。",
    gamesCta: "查看全部免费游戏",
    reviewedLabel: "最后审阅",
  },
  vi: {
    metaTitle: "Luyện gõ tiếng Hàn — bàn phím dubeolsik, đo tốc độ thời gian thực",
    metaDesc:
      "Luyện gõ tiếng Hàn miễn phí ngay trên trình duyệt. Xem phụ âm đầu·nguyên âm·phụ âm cuối ghép thành một âm tiết theo thời gian thực, học bàn phím chuẩn dubeolsik và đo tốc độ, độ chính xác, combo. Từ chữ cái → từ → câu, không cần đăng ký.",
    keywords: [
      "luyện gõ tiếng Hàn",
      "gõ tiếng Hàn",
      "bàn phím tiếng Hàn",
      "dubeolsik",
      "luyện gõ phím",
      "kiểm tra tốc độ gõ",
      "gõ chữ Hàn online",
      "luyện gõ miễn phí",
    ],
    eyebrow: "Gõ tiếng Hàn · Dubeolsik",
    h1: "Luyện gõ tiếng Hàn",
    intro:
      "Học gõ tiếng Hàn trên bàn phím chuẩn dubeolsik trong khi quan sát phụ âm đầu·nguyên âm·phụ âm cuối ghép thành một âm tiết. Đo tốc độ, độ chính xác và combo theo thời gian thực, nâng trình từ chữ cái đơn lẻ đến câu hoàn chỉnh.",
    playLabel: "Bắt đầu luyện ngay",
    playHint: "Gõ các ký tự trên màn hình bằng bàn phím — tốc độ và độ chính xác được ghi lại tự động.",
    sections: [
      {
        h2: "Gõ tiếng Hàn dubeolsik là gì?",
        body: "Gõ tiếng Hàn là việc dùng đầu ngón tay nắm vững cách phụ âm (đầu và cuối) và nguyên âm (giữa) ghép thành một khối âm tiết. Trên bố cục dubeolsik — bàn phím chuẩn của Hàn Quốc — tay trái phụ trách phụ âm, tay phải phụ trách nguyên âm. Gõ '한글' bạn sẽ thấy ㅎ+ㅏ+ㄴ và ㄱ+ㅡ+ㄹ ghép lại theo thời gian thực. Nhìn quá trình ghép này giúp ghi nhớ vị trí phím nhanh hơn nhiều.",
      },
      {
        h2: "Luyện gì và luyện thế nào",
        body: "Độ khó tăng dần qua ba giai đoạn: chữ cái → từ → câu. Màn hình hiển thị theo thời gian thực từng chữ cái bạn bấm hợp thành một chữ hoàn chỉnh, đồng thời ghi lại số ký tự mỗi phút, độ chính xác và combo gõ đúng liên tiếp. Bạn thấy ngay mình hay sai ở phụ âm đầu hay khựng lại ở phụ âm cuối (batchim) để tập trung sửa điểm yếu.",
      },
      {
        h2: "Cách tiến bộ nhanh",
        body: "① Đặt tay ở hàng phím cơ sở (trái ㅁㄴㅇㄹ, phải ㅗㅓㅏㅣ) mà không nhìn phím. ② Chính xác trước tốc độ — vượt 95% độ chính xác rồi mới tăng tốc. ③ Mười phút mỗi ngày hiệu quả hơn một buổi dài. ④ Tay thường khựng ở âm tiết có phụ âm cuối, nên luyện nhiều từ có batchim ở giai đoạn câu để tăng tốc độ thực tế.",
      },
    ],
    faqHeading: "Câu hỏi thường gặp",
    faq: [
      {
        q: "Dubeolsik hay sebeolsik, nên học loại nào?",
        a: "Dubeolsik là mặc định trên hầu hết máy tính và điện thoại, nên hãy bắt đầu từ đó. Sebeolsik đỡ mỏi tay hơn nhưng cần cài đặt thêm, nên dubeolsik thực tế hơn cho người mới.",
      },
      {
        q: "Tốc độ gõ trung bình là bao nhiêu?",
        a: "Với người lớn, 200–300 ký tự mỗi phút là đủ cho công việc hằng ngày, và 400+ là trình cao. Người mới thường bắt đầu quanh 100 — mục tiêu là tiến đều trong khi giữ độ chính xác cao.",
      },
      {
        q: "Người nước ngoài học tiếng Hàn dùng được không?",
        a: "Được. Vì nó trực quan hóa cách chữ cái ghép thành chữ, rất hợp cho người vừa học Hangul luyện đồng thời bàn phím và cấu trúc âm tiết. Hãy bắt đầu chậm từ giai đoạn chữ cái.",
      },
      {
        q: "Có dùng được trên di động không?",
        a: "Chạy được trên trình duyệt, nhưng luyện gõ tốt nhất là trên PC hoặc laptop có bàn phím vật lý. Trên di động, hãy dùng để quan sát cách chữ cái ghép lại.",
      },
      {
        q: "Có miễn phí không? Có cần tài khoản không?",
        a: "Hoàn toàn miễn phí, không cần đăng ký hay cài đặt. Chạy ngay trên trình duyệt và kết quả hiện ngay trên trang này.",
      },
    ],
    gamesHeading: "Gõ xong rồi, thử game nhé",
    gamesBody:
      "Chơi các game Hàn Quốc tự phát triển — hwatu roguelike, tháp phòng thủ võ hiệp — ngay trên trình duyệt. Không đăng ký, không cài đặt.",
    gamesCta: "Xem tất cả game miễn phí",
    reviewedLabel: "Đánh giá lần cuối",
  },
};
