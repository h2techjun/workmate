# Workmate 프로젝트 상태판

> **단일 진실원** — 매 세션 시작 시 이 파일을 먼저 읽으세요.
> 마지막 갱신: 2026-06-16 (영문 외국인 니치 7종 라이브 — 신규 jeonse-wolse·d8-startup-visa·pension-refund + 필수앱 블로그 + 블로그 카테고리)

## 🧭 전략 전환 (2026-06-15) — 영문 외국인 니치 + 도구 차별화

**배경**: 3개월 GSC 클릭 3회, AdSense "가치 없는 콘텐츠" 2회 거절. 시장 리서치 결론 —
"한국인용 계산기"는 레드오션, **GSC 유일 검증 트래픽은 영문 외국인 영역**(/en/area-convert·/en/biznum-check 노출 1·2위). 외국인은 "글"이 아니라 "즉시 답 주는 도구"를 찾을 때 도달.

**방침**: ① 한국인 대상 도구 양산 중단 ② 영문 외국인 니치 + "도구로 차별화"(글 양산 아님)
③ AdSense는 후순위, 검증된 수요 먼저 ④ 세율·요율 등 변동값은 `lib/constants/`에 출처+연도 격리.

**TOP3 우선순위**: 1️⃣ 외국인 세금(완료) 2️⃣ 건강보험(완료) 3️⃣ 평수·면적 심화(완료).
→ **영문 외국인 니치 7종 라이브** (foreign-flat-tax · foreign-health-insurance · apartment-area · f2-residence-visa 체크리스트 · **jeonse-wolse 전세↔월세+전세사기 방지** · **d8-startup-visa 창업·투자비자 체크리스트** · **pension-refund 국민연금 반환일시금**).
→ **콘텐츠**: 필수앱 블로그(essential-apps-korea-foreigners) + 블로그 카테고리 섹션 도입.
→ **차별화 강화**: 한국생활 상황별 체크리스트를 10개 도구 가이드에 통합(전세사기뿐 아니라 출국정산·비자신청·건보가입·임대차권리·경조사·임신출산 등). 인터넷 리서치 기반 + 외국인 함정·공식 출처·(verify) 표시.
→ **완료**: 국민연금 요율 2026 9.5% 인상 반영 — rates2026.ts(9.5%/637만) + netSalary 하드코딩 제거 + 테스트/가이드 갱신.
다음 규율: 도구 양산은 멈추고 **GSC 색인 + 영문 커뮤니티(reddit r/Living_in_Korea 등) 노출로 실제 트래픽 신호 검증**. AdSense 재신청은 트래픽이 붙은 뒤.

---

## 📊 도구 인벤토리: 57개 (11개 카테고리) — 2026-06-06 갱신

로드맵(docs/roadmap.md) Tier 1~3 + Tier A/B 전부 구현 완료.
보류: 음력↔양력 + 한국 공휴일 (둘 다 음력 명절 양력 변환 = KASI 데이터 검증 필요, 동일 원칙).
- **재무·세금**: income-tax · capital-gains-tax · loan-calc · compound-calc · vat-calc · freelancer-tax · foreign-stock-tax
- **근로**: net-salary · annual-leave · weekly-rest-pay · severance · min-wage-monthly · insurance-calc
- **부동산**: rent-cap
- **자동차** 🚗: car-acquisition-tax · car-tax
- **한국 생활·외국인** 🇰🇷: korean-age · visa-days · name-romanize · size-convert · gift-money · due-date · **text-romanize** · **korean-number** · **hangul-decompose** · **school-grade** · **voltage-guide**
- **공과금** 💡: electric-bill · btu-calc
- **전기**: wire-size · breaker · voltage-drop
- **목조·자재**: 18개 (tile·studs·drywall·plywood·osb·siding·insulation-batt·span·insulation·material-quantity·stairs·rafter·roof-pitch·roof-area·concrete·paint-calc·gravel-calc·deck-calc·lumber)
- **사업자**: biznum-check
- **변환**: area-convert·percent-calc·json-csv · **distance-convert** · **temp-convert**

검증: i18n 2466=2466 · 407 테스트 · sitemap 신규 7경로(×2 로케일) · ToolGuide 33개

### 🆕 2026-06-06 WaveA+WaveB (외국인 필수 + 한국어 학습/생활)
- **WaveA** (`8c94cba`): distance-convert(거리 자·리·보↔m/mile) · temp-convert(°C↔°F↔K) · text-romanize(한글 문장 로마자) · voltage-guide(220V·돼지코 판정)
- **WaveB** (`7cf860f`): hangul-decompose(초성·중성·종성 분해) · korean-number(한자어·고유어 수사) · school-grade(출생연도→학년)
- 각 도구 = calc+test(WaveA 25 + WaveB 25) · form · page · catalog · sitemap · ToolGuide ko/en
- **보류**: korea-holidays — 설날·추석·부처님오신날 양력 변환 정확도 미검증 → korean-number로 대체

## 🎯 현재 단계: Phase 3 — 트래픽 + 수익화

| Phase | 상태 | 비고 |
|---|---|---|
| Phase 1: 산업용 전기 계산기 MVP | ✅ 완료 | wire-size · breaker · voltage-drop |
| Phase 2: 도구 23개 확장 | ✅ 완료 | 33개 도구 (목표 초과 달성) |
| **Phase 3: 트래픽 + 수익화 (현재)** | 🔄 진행 중 | AdSense 1차 거절 → 재신청 대기 |
| Phase 4: 트래픽 1k DAU 도달 | ⏳ 미시작 | AdSense 통과 후 |

---

## 📊 도구 인벤토리 (33개)

| 카테고리 | 도구 수 | 도구 |
|---|---|---|
| **재무·세금 (tax)** | 5 | income-tax · loan-calc · compound-calc · vat-calc · foreign-stock-tax |
| **근로 (labor)** | 5 | annual-leave · weekly-rest-pay · severance · min-wage-monthly · insurance-calc |
| **부동산 (realestate)** | 1 | rent-cap |
| **전기 (electric)** | 3 | wire-size · breaker · voltage-drop |
| **목조·자재 (timber)** | 16 | span · insulation · stairs · rafter · roof-pitch · roof-area · concrete · lumber · drywall · plywood · osb · siding · insulation-batt · studs · tile · material-quantity |
| **사업자 (business)** | 1 | biznum-check |
| **변환 (convert)** | 3 | area-convert · percent-calc · json-csv |

**가이드 콘텐츠 (ToolGuide 통합)**: 5개 도구 — income-tax · loan-calc · rent-cap · area-convert · percent-calc

**블로그 글 (long-form)**: 3편 — loan-30-vs-15-years · income-tax-progressive-trap · rent-cap-tenant-checklist

---

## 💰 AdSense 진행 상황

| 항목 | 상태 | 일자 |
|---|---|---|
| 사이트 등록 | ✅ | 2026-05-13 |
| Publisher ID 발급 | ✅ `pub-8134930906845147` | 2026-05-13 |
| ads.txt 검증 | ✅ 승인됨 | 2026-05-13 |
| **1차 심사 결과** | ❌ 거절 ("가치가 별로 없는 콘텐츠") | 2026-05-23 |
| 보강 작업 | ✅ 완료 (블로그 3편 + ToolGuide 5개 + hreflang fix) | 2026-05-23 |
| **2차 재신청** | ⏳ **4~7일 후 (5/27~5/30 권장)** | — |

### 거절 사유 분석 + 대응
- **사유**: "가치가 별로 없는 콘텐츠"
- **원인**: 도구 페이지 본문 300자 평균 (form + 결과만)
- **대응 완료**:
  - 인기 5개 도구에 풍부한 가이드 추가 (300자 → 4,000자+)
  - long-form 블로그 3편 (각 ~3,500자, 1인칭 톤, 실제 사례)
  - FAQ + HowTo JSON-LD (rich result)
  - hreflang x-default 누락 보강 (도구 23개)

---

## 🔍 색인 진행 상황 (GSC)

| 카테고리 | 수 | 의미 |
|---|---|---|
| **색인됨** | (확인 필요) | Google 검색 노출 가능 |
| **발견됨 - 색인 미생성** | 52 (2026-05-23 기준) | 크롤링 대기 — 정상 |
| 크롤링됨 - 색인 미생성 | 1 | 1건 (페이지 확인 필요) |
| 중복 페이지 (canonical 없음) | 1 | hreflang fix 로 해결 예상 |

**Sitemap URL**: 90개 (도구 82 + blog 8)

---

## 🛠️ 인프라 상태

| 항목 | 상태 |
|---|---|
| 도메인 | ✅ workmate.tools (Vercel) |
| 배포 | ✅ GitHub auto-deploy + alias 수동 (Vercel CLI) |
| 다국어 | ✅ ko/en (next-intl, URL prefix) |
| SEO 메타 | ✅ title · description · OG · hreflang(x-default 포함) |
| 정책 페이지 | ✅ privacy · terms · about · contact |
| Footer 링크 | ✅ tools · games · tests · blog · about · privacy · terms · contact |
| AdSense Script | ✅ env 조건부 (NEXT_PUBLIC_ADSENSE_CLIENT) |
| ads.txt | ✅ /ads.txt 동적 라우트 |
| IndexNow | ✅ /indexnow-key + tool/submit_indexnow.mjs |
| Google Verification | ✅ google978ab54addb768c4 |
| Naver Verification | ✅ naver327b3085... |
| 메이커 hub | ✅ /games (구 /projects는 308 리다이렉트, k-poker · defense · 6hours · office-hunter) |

---

## ✅ 마스터가 해야 할 액션 (체크리스트)

### 즉시 (오늘~내일)
- [ ] GSC URL 검사로 blog 6개 색인 요청 (한도 ~10건)
  ```
  https://workmate.tools/ko/blog
  https://workmate.tools/ko/blog/loan-30-vs-15-years
  https://workmate.tools/ko/blog/income-tax-progressive-trap
  https://workmate.tools/ko/blog/rent-cap-tenant-checklist
  https://workmate.tools/en/blog
  https://workmate.tools/en/blog/loan-30-vs-15-years
  ```

### D+3~D+5 (재신청 직전 점검)
- [ ] GSC "발견됨 52" 가 감소했는지 확인 (= Google 크롤러가 새 콘텐츠 본 증거)
- [ ] `site:workmate.tools` 구글 검색 시 도구·블로그 일부 노출 확인
- [ ] 본인이 매일 1~2회 도구 사용 (user signal 강화)

### D+7 (재신청)
- [ ] AdSense → 사이트 → workmate.tools → "검토 요청" 클릭
- [ ] 검토 진행 상태 1주에 1회 점검

### 추가 검토 (재신청 후 1~4주 대기 중)
- [ ] 다른 도구 카테고리에서 검색량 큰 키워드 1~2개 글 더 작성
- [ ] 네이버 카페·티스토리에 도구 소개 글 1편 (외부 백링크)

---

## 🤖 Claude 가 해야 할 액션 (다음 세션에서)

### 우선순위 1 — 트래픽 강화
- [ ] 양도소득세 (부동산) 계산기 신규 (검색량 폭발)
- [ ] 퇴직금 중간정산 vs 일시지급 비교 (검색량 큼)
- [ ] 블로그 글 1편 추가 — 후보:
  - "전세 vs 월세, 실제 손익 계산해보면" (rent-cap + area-convert 연계)
  - "프리랜서 첫 5월 신고 — 사업자 등록 안 한 채로 가도 되나" (income-tax 연계)
  - "주임법 외 알아두면 좋은 임차인 권리 5가지"

### 우선순위 2 — AdSense 2차 거절 시 추가 보강
만약 2차 거절 시:
- [ ] /guide 인덱스 페이지 신규 (현재 404)
- [ ] About 페이지에 운영자 인증 시그널 보강 (자격증·경력 명시)
- [ ] 도구 페이지 7~10개 더 ToolGuide 통합 (현재 5개 → 12~15개)

### 우선순위 3 — 사이트 매력도
- [ ] 검색 기능 강화 (현재 ToolSearch 단순)
- [ ] 도구 즐겨찾기 (localStorage 기반)
- [ ] 다크/라이트 토글

---

## 🚨 진행 중 / 미해결 이슈

1. **GSC 색인 누락 ~52건** — 시간이 해결 (1~4주). 가속 위해 IndexNow + GSC 수동 요청 진행 중.
2. **AdSense 1차 거절** — 보강 완료, 재신청 대기.
3. **나머지 18개 도구 가이드 미작성** — 의도적 (AI doorway pages 회피). 트래픽 보고 인기 도구만 선별 보강.
4. **`scripts/audit.mjs` 는 6Hours 잔재** — workmate에는 supabase migrations / game-engine 없음. 워크메이트 전용 audit 재작성 또는 제거 필요 (Phase 4 backlog).

---

## 📚 참고 문서

- [`CLAUDE.md`](./CLAUDE.md) — Claude Code 컨텍스트 (코딩 규칙·기술 스택)
- [`docs/monetization-and-indexing.md`](./docs/monetization-and-indexing.md) — AdSense · 색인 가속 운영 가이드
- [`lib/projectsCatalog.ts`](./lib/projectsCatalog.ts) — 메이커 hub 단일 진실원
- [`lib/toolsCatalog.ts`](./lib/toolsCatalog.ts) — 도구 카탈로그 단일 진실원
- [`lib/blogPosts.ts`](./lib/blogPosts.ts) — 블로그 글 메타 단일 진실원

---

## 📊 GSC 실데이터 (3개월 기준, 2026-05-30 캡쳐)

| 지표 | 값 |
|---|---|
| 총 노출 | **483회** (6주만에 5→45/일로 9배) |
| 총 클릭 | **3회** (5/29 부터 시작) |
| 평균 게재순위 | 16위 (2페이지 — 1페이지 진입 필요) |
| 한국 vs 외국 노출 | 264 : 152 (외국 35% — 영문 SEO 블루오션) |
| 데스크톱 비중 | 72% (B2B/실무자 패턴) |

### 페이지별 노출 TOP 10
| URL | 노출 | ToolGuide | 강화 시점 |
|---|---|---|---|
| /en/area-convert | 97 🥇 | ✅ | 2026-05-23 |
| /en/biznum-check | 84 🥈 | ✅ | 2026-05-30 |
| /electric-calc/breaker | 43 | ✅ | 2026-05-30 |
| /percent-calc | 36 | ✅ | 2026-05-23 |
| /timber-calc/roof-area | 17 | ❌ | 다음 |
| /ko/area-convert | 16 | ✅ | 2026-05-23 |
| /loan-calc | 14 | ✅ | 2026-05-23 |
| /biznum-check | 3 (클릭 1) | ✅ | 2026-05-30 |
| /en/timber-calc | 9 (클릭 1) | — | — |
| /en/timber-calc/span | 5 (클릭 1) | — | — |

## 📅 변경 이력 (최근 7개)

| 일자 | 작업 | 커밋 |
|---|---|---|
| 2026-06-17 | **thin 도구 24개 ToolGuide 전면 보강**(거절 사유 '가치 없는 콘텐츠' 해소) — timber 14·labor 4·finance 5·전압강하 1, 계산 근거 ko/en. audit thin 0·정합 ko=en=4221 | `fb6efef` |
| 2026-06-17 | **AdSense 정책 시스템** — docs/adsense-compliance.md(5대 정책+전체 정책맵) + CLAUDE.md 가치 게이트 도그마 + audit.mjs thin 자동검출 | `fd581d1` |
| 2026-06-17 | **외국인 한국생활 필러 블로그**(living-in-korea-foreigner-guide, 도구 9종 허브·여정형) + **About E-A-T 보강**(외국인 독자·검증 방법론·갱신일) + TASKS 현행화 | `de02689` |
| 2026-06-17 | **복리 계산기 Fical 스타일 개편** — 기본/적립식 2탭 + 회차별·연차별 상세표(한국 적금 연복리 모델) | `4f045d8` |
| 2026-06-16 | **한국생활 상황별 체크리스트 10개 도구 통합**(ToolGuide checklist 섹션 신설) + **국민연금 요율 2026 9.5% 갱신**(rates2026·netSalary 하드코딩 제거·테스트) | `732ae3e` |
| 2026-06-16 | **국민연금 반환일시금 계산기 신설** — 영문 니치 7번째 (출국 외국인 환급 추정 + 수령 3경로·국적별 단정 회피) | `19242b2` |
| 2026-06-16 | **D-8 창업·투자 비자 자격 체크리스트 신설** — 영문 니치 6번째 (D-8-1/3/4 유형별 조건부 + OASIS 점수 단정 회피) | `3d16fcc` |
| 2026-06-16 | **전세↔월세 환산기 + 전세사기 방지 체크리스트 신설** — 영문 니치 5번째 (전월세전환율 4.5% + 외국인 거소지 등록 함정) | `6839e3f` |
| 2026-06-16 | 한국 필수앱 블로그 + 블로그 카테고리 섹션(BlogCategory enum) 도입 | `a402839` |
| 2026-06-15 | **F-2-7 거주비자 자격 체크리스트 신설** — 영문 니치 4번째 (점수 단정 회피·체크리스트) + 배포 alias 3단계 정립 | `a941ddb` |
| 2026-06-15 | **전용·공급면적/평당가 계산기 신설** — 영문 니치 3번째 도구 (전용/공급 함정 + 평당가) | `7475cd6` |
| 2026-06-15 | **외국인 건강보험료(NHIS) 계산기 신설** — 영문 니치 2번째 도구 (직장/지역가입자, 유학생 50%) | `ceebfc4` |
| 2026-06-15 | **외국인 단일세율(19%) vs 누진세 비교 계산기 신설** — 영문 니치 1번째 도구 | `93353b3` |
| 2026-06-15 | 복리 계산기 회당이율+횟수 재설계 + 금액 콤마/한글 | `7bdc082` |
| 2026-06-15 | 측정·수량 도구 천단위 구분 + 공통 포맷 유틸 / 푸터 정리(학습 링크·면책 일반화·메이커 중복 제거) | `efb1a09`~`252f0b7` |
| 2026-06-12 | 랜딩 페이지 키네틱 재디자인 (롤링 헤드라인·마퀴·카테고리 그리드·카운트업) + 메이커 링크 /games 통일 | (이전) |
| 2026-06-06 | WaveB: hangul-decompose + korean-number + school-grade (공휴일 보류) | `7cf860f` |
| 2026-06-06 | WaveA: distance-convert + temp-convert + text-romanize + voltage-guide | `8c94cba` |
| 2026-05-30 | breaker ToolGuide + 영문 글 "Korean Pyeong Explained" | (이전) |
| 2026-05-30 | biznum-check ToolGuide + 영문 글 "Business Number Checksum" + /guide 인덱스 | `41248f8` |
| 2026-05-23 | 레이아웃 일관성 (PageShell + Header active + Footer 그룹) | `4d53f88` |
| 2026-05-23 | PROJECT_STATUS + TASKS 단일 진실원 체계 | `127283a` |
| 2026-05-23 | 블로그 3편 + /blog 인덱스 신규 | `223ba6f` |
| 2026-05-23 | 인기 5개 도구 ToolGuide (thin-content 보강) | `f9b8e78` |
| 2026-05-23 | hreflang x-default 누락 보강 (23 페이지) | `e1adc9e` |
