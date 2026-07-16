/**
 * 가로세로 낱말퀴즈(kword) SEO 랜딩 카피 — 단일 진실원 (4로케일 완역).
 *
 * /korean-crossword 랜딩이 색인 본체이므로 본문은 도구 페이지 수준의 고유 가치를
 * 담는다(십자말풀이 원리·한국어 학습 효과·FAQ). 게임 SPA(/kword)는 iframe 임베드로만.
 * 구조는 lib/koreanTypingCopy.ts 의 TypingCopy 를 그대로 재사용(범용 랜딩 카피 스키마).
 * AdSense 가치 게이트 충족용 — "준비 중" 류 표현 금지, 각 로케일 실질 번역.
 */

import type { Locale } from "@/i18n";
import type { TypingCopy } from "@/lib/koreanTypingCopy";

export const KOREAN_CROSSWORD_COPY: Record<Locale, TypingCopy> = {
  ko: {
    metaTitle: "가로세로 낱말퀴즈 — 한국어 십자말풀이 무료 게임",
    metaDesc:
      "무료 온라인 가로세로 낱말퀴즈(십자말풀이). 가로세로 열쇠를 읽고 교차하는 빈칸을 채우며 한국어 어휘를 늘린다. CEFR A1~C2 700+ 단어, 스테이지·데일리·무한 모드, 완성하면 발음·예문 학습. 가입·설치 없이 브라우저에서 바로.",
    keywords: [
      "십자말풀이",
      "가로세로 낱말퀴즈",
      "낱말퀴즈",
      "크로스워드",
      "한국어 십자말풀이",
      "무료 십자말풀이",
      "온라인 낱말퀴즈",
      "낱말 퍼즐",
      "단어 퍼즐",
    ],
    eyebrow: "가로세로 낱말퀴즈 · 십자말풀이",
    h1: "가로세로 낱말퀴즈",
    intro:
      "가로세로 열쇠를 읽고 교차하는 빈칸을 채우는 한국어 십자말풀이. 어휘와 문맥을 동시에 익히고, 스테이지·데일리·무한 모드로 매일 새로운 낱말퀴즈에 도전해보세요.",
    playLabel: "지금 바로 풀기",
    playHint: "가로세로 열쇠를 읽고 빈칸을 채우면 자동으로 채점돼요.",
    sections: [
      {
        h2: "가로세로 낱말퀴즈(십자말풀이)란?",
        body: "가로세로 낱말퀴즈는 격자에 단어를 가로·세로로 엇갈리게 배치하고, 각 열쇠(힌트)에 맞는 단어로 빈칸을 채우는 퍼즐입니다. 십자말풀이·크로스워드라고도 부르죠. 교차하는 칸은 가로 단어와 세로 단어가 같은 글자를 공유하기 때문에, 한 단어를 맞히면 이웃 단어의 힌트가 되어 술술 풀립니다. 언어 퍼즐인 만큼 어휘력과 문맥 이해가 자연스럽게 함께 자랍니다.",
      },
      {
        h2: "무엇을, 어떻게 푸나요",
        body: "난이도는 CEFR A1~C2 6단계로 나뉘고, 총 700개 이상의 한국어 단어가 담겨 있습니다. 초급은 음절 조각을 골라 채우고, 중급 이상은 자모 키보드로 직접 입력합니다. 스테이지 모드로 단계별 학습, 데일리 모드로 매일 한 판, 무한 모드로 실력 점검이 가능하며, 퍼즐을 완성하면 그 단어의 발음과 예문까지 익힐 수 있습니다.",
      },
      {
        h2: "낱말퀴즈로 한국어 어휘를 늘리는 법",
        body: "① 아는 단어부터 채워 교차 글자를 확보하면 모르는 단어의 힌트가 됩니다. ② 막히면 세로·가로를 번갈아 보며 공유 글자를 추리하세요. ③ 완성 후 뜨는 발음·예문을 소리 내어 읽으면 기억에 오래 남습니다. ④ 데일리 모드를 매일 하나씩 꾸준히 풀면, 한 달이면 자주 쓰는 생활 어휘가 눈에 띄게 늘어납니다.",
      },
    ],
    faqHeading: "자주 묻는 질문",
    faq: [
      {
        q: "한국어 초보도 할 수 있나요?",
        a: "네. 초급(A1~A2)은 음절 조각을 고르는 방식이라 자판을 몰라도 풀 수 있고, 힌트도 쉬운 단어 위주입니다. 실력이 늘면 자모 키보드 입력 단계로 자연스럽게 넘어갑니다.",
      },
      {
        q: "외국인의 한국어 학습에도 도움이 되나요?",
        a: "특히 도움이 됩니다. 힌트를 읽고 단어를 떠올리는 과정에서 어휘·철자·문맥을 한 번에 익히고, 완성 후 발음·예문으로 마무리해 실제 사용까지 연결됩니다.",
      },
      {
        q: "무료인가요? 가입이 필요한가요?",
        a: "완전 무료이며 회원가입·설치가 필요 없습니다. 진행 기록은 브라우저에 로컬로 저장돼 다음에 이어서 풀 수 있습니다.",
      },
      {
        q: "매일 새로운 문제가 나오나요?",
        a: "데일리 모드가 하루 한 판 새 퍼즐을 제공하고, 무한 모드는 계속 새 문제를 생성합니다. 스테이지 모드로는 단계별로 차근차근 진행할 수 있습니다.",
      },
      {
        q: "모바일에서도 되나요?",
        a: "브라우저에서 동작하며 모바일에서도 음절 선택 방식으로 편하게 풀 수 있습니다. 자모 키보드 입력이 많은 상위 단계는 PC가 조금 더 편합니다.",
      },
    ],
    gamesHeading: "낱말퀴즈를 풀었다면, 이번엔 다른 게임으로",
    gamesBody:
      "타자 연습 게임, 화투 로그라이크, 무협 타워디펜스 등 직접 만든 게임을 브라우저에서 바로 즐겨보세요. 회원가입도 설치도 필요 없습니다.",
    gamesCta: "무료 게임 전체 보기",
    reviewedLabel: "최종 검토",
  },
  en: {
    metaTitle: "Korean Crossword — Free online word puzzle game",
    metaDesc:
      "Free online Korean crossword. Read the across/down clues and fill the intersecting blanks to grow your Korean vocabulary. 700+ words across CEFR A1–C2, stage/daily/infinite modes, pronunciation and example learning on completion. No signup, runs in your browser.",
    keywords: [
      "korean crossword",
      "crossword puzzle",
      "korean word puzzle",
      "learn korean words",
      "korean vocabulary game",
      "free crossword",
      "online crossword",
      "word game",
    ],
    eyebrow: "Korean Crossword · Word Puzzle",
    h1: "Korean Crossword",
    intro:
      "A Korean crossword where you read across/down clues and fill the intersecting blanks. Build vocabulary and context together, and take on a fresh puzzle every day with stage, daily, and infinite modes.",
    playLabel: "Play now",
    playHint: "Read the across/down clues and fill the blanks — it scores automatically.",
    sections: [
      {
        h2: "What is a Korean crossword?",
        body: "A crossword places words across and down on a grid so they intersect, and you fill each blank with the word matching its clue. Intersecting cells share a letter between the across and down words, so solving one word gives hints for its neighbors. As a language puzzle, it grows your vocabulary and sense of context at the same time.",
      },
      {
        h2: "What you solve, and how",
        body: "Difficulty spans six CEFR levels (A1–C2) with 700+ Korean words. Beginners pick syllable tiles to fill blanks; higher levels type with a Hangul jamo keyboard. Play stage mode for step-by-step learning, daily mode for one puzzle a day, or infinite mode to test yourself — and each completed word comes with pronunciation and an example sentence.",
      },
      {
        h2: "How to grow Korean vocabulary with crosswords",
        body: "① Fill the words you know first to lock in intersecting letters, which hint at the ones you don't. ② When stuck, alternate between across and down clues to deduce the shared letter. ③ Read the pronunciation and example aloud after solving — it sticks far longer. ④ Solve one daily puzzle consistently, and in a month your everyday Korean vocabulary grows noticeably.",
      },
    ],
    faqHeading: "Frequently asked questions",
    faq: [
      {
        q: "Can Korean beginners play?",
        a: "Yes. Beginner levels (A1–A2) let you pick syllable tiles, so you can solve without knowing the keyboard, and clues use easy words. As you improve, you naturally move to jamo-keyboard input.",
      },
      {
        q: "Does it help learners of Korean?",
        a: "Especially so. Recalling words from clues trains vocabulary, spelling, and context at once, and the pronunciation and example on completion connect it to real use.",
      },
      {
        q: "Is it free? Do I need an account?",
        a: "Completely free, no signup or install. Your progress is saved locally in your browser so you can pick up where you left off.",
      },
      {
        q: "Are there new puzzles every day?",
        a: "Daily mode gives one fresh puzzle a day, and infinite mode keeps generating new ones. Stage mode lets you progress level by level.",
      },
      {
        q: "Does it work on mobile?",
        a: "It runs in the browser and plays comfortably on mobile with syllable-pick input. Higher levels with lots of jamo typing are a bit easier on a PC.",
      },
    ],
    gamesHeading: "Solved the crossword? Try the other games",
    gamesBody:
      "Play in-house games — a typing practice game, a hwatu card roguelike, a martial-arts tower defense — right in your browser. No signup, no install.",
    gamesCta: "See all free games",
    reviewedLabel: "Last reviewed",
  },
  zh: {
    metaTitle: "韩语填字游戏 — 免费在线纵横字谜(낱말퀴즈)",
    metaDesc:
      "免费在线韩语填字游戏(纵横字谜)。阅读横向与纵向提示，填入交叉的空格，边玩边扩充韩语词汇量。覆盖CEFR A1~C2共700多个单词，提供关卡、每日与无限三种模式，完成后可学习发音与例句。无需注册与安装，浏览器直接玩。",
    keywords: [
      "韩语填字",
      "纵横字谜",
      "填字游戏",
      "韩语单词游戏",
      "学韩语单词",
      "免费填字",
      "在线填字",
      "单词游戏",
    ],
    eyebrow: "韩语填字 · 纵横字谜",
    h1: "韩语填字游戏",
    intro:
      "看横向/纵向提示、填入交叉空格的韩语填字游戏。同时锻炼词汇与语境，用关卡·每日·无限模式每天挑战新的字谜。",
    playLabel: "立即开玩",
    playHint: "看横向/纵向提示填入空格，会自动判分。",
    sections: [
      {
        h2: "什么是韩语填字游戏(纵横字谜)？",
        body: "填字游戏把单词在格子里横竖交叉排列，你需要用符合提示的单词填满每个空格，也叫十字谜、纵横字谜。交叉的格子在横向词与纵向词之间共享一个字，所以解出一个词就能为相邻词提供线索。作为语言谜题，它能同时提升你的词汇量与语境理解。",
      },
      {
        h2: "解什么，怎么解",
        body: "难度分为CEFR A1~C2六个等级，收录700+韩语单词。初级点选音节块填空，高级用韩文字母键盘输入。关卡模式循序渐进，每日模式每天一局，无限模式检验实力——每完成一个词还会附上发音与例句。",
      },
      {
        h2: "用填字游戏扩充韩语词汇的方法",
        body: "① 先填你会的词，锁定交叉字，为不会的词提供线索。② 卡住时在横向和纵向提示间来回推敲共享字。③ 解完后把发音与例句读出声，记得更牢。④ 坚持每天一局每日模式，一个月后常用生活词汇会明显增加。",
      },
    ],
    faqHeading: "常见问题",
    faq: [
      {
        q: "韩语初学者也能玩吗？",
        a: "可以。初级(A1~A2)采用点选音节块的方式，不会键盘也能解，提示也以简单词为主。水平提升后会自然过渡到字母键盘输入。",
      },
      {
        q: "对外国人学韩语有帮助吗？",
        a: "尤其有帮助。看提示回忆单词的过程能同时练词汇、拼写与语境，完成后的发音与例句又连接到实际使用。",
      },
      {
        q: "免费吗？需要注册吗？",
        a: "完全免费，无需注册或安装。进度会保存在浏览器本地，下次可继续解。",
      },
      {
        q: "每天都有新题吗？",
        a: "每日模式每天提供一局新字谜，无限模式持续生成新题。关卡模式则可逐级推进。",
      },
      {
        q: "手机上能玩吗？",
        a: "可在浏览器中运行，手机上用点选音节的方式也能顺畅解。字母输入较多的高级关卡在电脑上更方便。",
      },
    ],
    gamesHeading: "解完字谜，换个游戏玩玩",
    gamesBody:
      "打字练习游戏、花斗Rogue-like、武侠塔防等亲手打造的游戏，在浏览器中直接畅玩。无需注册，无需安装。",
    gamesCta: "查看全部免费游戏",
    reviewedLabel: "最后审阅",
  },
  vi: {
    metaTitle: "Ô chữ tiếng Hàn — game giải ô chữ miễn phí online",
    metaDesc:
      "Game ô chữ tiếng Hàn miễn phí online. Đọc gợi ý ngang/dọc, điền vào các ô giao nhau để mở rộng vốn từ tiếng Hàn. 700+ từ CEFR A1–C2, chế độ màn chơi/hằng ngày/vô hạn, học phát âm và ví dụ khi hoàn thành. Không cần đăng ký, chơi ngay trên trình duyệt.",
    keywords: [
      "ô chữ tiếng Hàn",
      "giải ô chữ",
      "trò chơi ô chữ",
      "học từ vựng tiếng Hàn",
      "game từ vựng tiếng Hàn",
      "ô chữ miễn phí",
      "ô chữ online",
      "trò chơi chữ",
    ],
    eyebrow: "Ô chữ tiếng Hàn · Giải ô chữ",
    h1: "Ô chữ tiếng Hàn",
    intro:
      "Trò chơi ô chữ tiếng Hàn: đọc gợi ý ngang/dọc và điền vào các ô giao nhau. Vừa luyện từ vựng vừa luyện ngữ cảnh, thử thách ô chữ mới mỗi ngày với chế độ màn chơi, hằng ngày và vô hạn.",
    playLabel: "Chơi ngay",
    playHint: "Đọc gợi ý ngang/dọc và điền vào ô — hệ thống tự chấm điểm.",
    sections: [
      {
        h2: "Ô chữ tiếng Hàn là gì?",
        body: "Ô chữ xếp các từ theo hàng ngang và dọc trên lưới sao cho chúng giao nhau, và bạn điền mỗi ô trống bằng từ khớp với gợi ý của nó. Ô giao nhau chia sẻ một chữ giữa từ ngang và từ dọc, nên giải được một từ sẽ gợi ý cho các từ lân cận. Là câu đố ngôn ngữ, nó giúp bạn phát triển vốn từ và khả năng nắm ngữ cảnh cùng lúc.",
      },
      {
        h2: "Giải gì và giải thế nào",
        body: "Độ khó trải sáu cấp CEFR (A1–C2) với hơn 700 từ tiếng Hàn. Người mới chọn mảnh âm tiết để điền; cấp cao gõ bằng bàn phím jamo tiếng Hàn. Chơi chế độ màn chơi để học từng bước, chế độ hằng ngày mỗi ngày một ô chữ, hoặc chế độ vô hạn để tự kiểm tra — mỗi từ hoàn thành đều kèm phát âm và câu ví dụ.",
      },
      {
        h2: "Cách mở rộng từ vựng tiếng Hàn bằng ô chữ",
        body: "① Điền trước những từ bạn biết để khóa các chữ giao nhau, chúng gợi ý cho từ bạn chưa biết. ② Khi bí, luân phiên giữa gợi ý ngang và dọc để suy ra chữ chung. ③ Đọc to phát âm và ví dụ sau khi giải — nhớ lâu hơn nhiều. ④ Giải đều một ô chữ hằng ngày, sau một tháng vốn từ tiếng Hàn hằng ngày của bạn tăng rõ rệt.",
      },
    ],
    faqHeading: "Câu hỏi thường gặp",
    faq: [
      {
        q: "Người mới học tiếng Hàn chơi được không?",
        a: "Được. Các cấp mới (A1–A2) cho chọn mảnh âm tiết nên giải được dù chưa biết bàn phím, gợi ý cũng dùng từ dễ. Khi tiến bộ, bạn tự nhiên chuyển sang nhập bằng bàn phím jamo.",
      },
      {
        q: "Có giúp người học tiếng Hàn không?",
        a: "Đặc biệt hữu ích. Việc nhớ từ từ gợi ý luyện từ vựng, chính tả và ngữ cảnh cùng lúc, còn phát âm và ví dụ khi hoàn thành kết nối tới việc dùng thực tế.",
      },
      {
        q: "Có miễn phí không? Có cần tài khoản không?",
        a: "Hoàn toàn miễn phí, không cần đăng ký hay cài đặt. Tiến trình được lưu cục bộ trên trình duyệt để bạn chơi tiếp sau.",
      },
      {
        q: "Có ô chữ mới mỗi ngày không?",
        a: "Chế độ hằng ngày cho một ô chữ mới mỗi ngày, và chế độ vô hạn liên tục tạo ô chữ mới. Chế độ màn chơi cho phép tiến từng cấp.",
      },
      {
        q: "Có chơi trên di động được không?",
        a: "Chạy được trên trình duyệt và chơi thoải mái trên di động với cách chọn âm tiết. Các cấp cao gõ nhiều jamo thì trên PC dễ hơn một chút.",
      },
    ],
    gamesHeading: "Giải xong ô chữ, thử game khác nhé",
    gamesBody:
      "Chơi các game tự phát triển — game luyện gõ phím, hwatu roguelike, tháp phòng thủ võ hiệp — ngay trên trình duyệt. Không đăng ký, không cài đặt.",
    gamesCta: "Xem tất cả game miễn phí",
    reviewedLabel: "Đánh giá lần cuối",
  },
};
