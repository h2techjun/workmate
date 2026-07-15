# Workmate 작업 목록

> 진행 중인 모든 작업의 체크리스트. 단순한 완료/미완료 추적용.
> 더 큰 컨텍스트가 필요하면 [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) 참조.

## 🔴 진행 중 (in progress)

### 🗺️ 한국 명소 소개 + 익명 댓글/반응 (2026-07-13 착수, `86c3e38`)
- [x] **Phase 1 MVP + DB 연결 완료** (`86c3e38`): `/attractions` 허브·상세(사진·고유본문·팁·지도·breadcrumb·TouristAttraction JSON-LD·반응·댓글). **DB=Neon Postgres**(마스터 workmate 프로젝트 생성→migrate→e2e: 댓글 POST/GET·honeypot·rate limit 429·반응 토글·한글 렌더 전부 검증). API route·next/image 최초. 500 사고=`.next` 손상(클린 재빌드).
- [x] **Phase 2 명소 확장 완료** (`216d0b8`): `scripts/fetch-tourapi.mjs` 반자동 수집(PhotoGallery 사진+EngService2 좌표) → 명소 5곳 추가(남산타워·북촌·성산일출봉·전주한옥·감천문화마을, **총 7곳**). 각 4로케일 고유 본문 창작 + 공공누리 1유형 사진(출처표시). viReady/zhReady 색인. 계획: `~/.claude/plans/zippy-frolicking-beacon.md`.
- [x] **프로덕션 배포 완료 (2026-07-13)**: Vercel `DATABASE_URL` 등록(파이프 개행 오염→node spawn input 재등록) → `vercel --prod`+alias. 라이브 검증: 명소 7곳 4로케일 200·**프로덕션 댓글/반응 DB 연결(GET 200)**·ads.txt apex/www 200·IndexNow 413 URL. **명소 기능 라이브!**
- [x] **글 젊은 톤 재작성 + 예약발행 (2026-07-13, `80b20b1`)**: 7곳 본문을 여행친구 톤+실전 꿀팁으로 재작성(웹 리서치 사실 취합·100% 자체창작, 병렬 에이전트 3기 / 남산 오픈런·전주 초코파이·감천 어린왕자 등). overview 3→4문단·tips 구체화. **예약발행**: `isPublished`/`publishedAttractions`+허브·상세 ISR(revalidate 86400)·dynamicParams·notFound 가드·sitemap/오늘의명소 published 필터 → 미래 `publishedAt` 명소는 공개일에 자동 등장(매일 1곳). 배포·라이브 마커 확인.
- [x] **SEO/전환 최적화 1·2·4 (2026-07-13, `d5cf676`)**: ①명소 FAQ(FaqJsonLd rich result — 7곳×4로케일 3Q&A, 라이브 FAQPage 방출 확인)→검색결과 CTR ②크로스링크 양방향(명소→여행도구 4종 + visa-days·cost-of-living·remittance·korean-age→명소 허브)→내부링크·전환 ④audit tsconfig 오탐 수정(`@/*`의 /* 블록주석 오인)·attractions thin 예외. **명소 발행 2일 주기** 규칙(카탈로그 주석, publishedAt=마지막+2일). 배포·라이브 QA(JSON-LD 5종·아코디언·링크). ③메타=명소 summary 재작성으로 이미 CTR친화, 도구 메타는 GSC 페이지데이터 대기.
- [ ] **Phase 2 이어가기 (선택, 담당: Claude)**: 명소 20~30곳까지 확장(fetch-tourapi 재사용, publishedAt 2일 간격), `draft`/`quality-gate` 스크립트, 국문 TourAPI 추가 신청.
- [ ] **마스터 액션**: GSC에서 /attractions 색인 요청 + Search Console 명소 FAQ/breadcrumb rich result 모니터링. (선택) 노출 상위 도구 GSC 페이지데이터 주면 메타 최적화.

- [ ] **AdSense 2차 재신청** (담당: 마스터) — 콘텐츠 보강 충분, 재신청 가능
  - 1차 거절("가치 없는 콘텐츠") 대비 강화: 외국인 도구 7종·상황별 체크리스트 10·필러 블로그·About E-A-T.
  - 위치: AdSense 대시보드 → 사이트 → workmate.tools → "검토 요청"

- [ ] **트래픽 신호 검증** (담당: 마스터) — ⭐ 최우선
  - GSC URL 검사로 신규 외국인 도구·필러 블로그 색인 요청 (매일 5~10건)
  - 커뮤니티 게시: **[`docs/distribution-kit.md`](./docs/distribution-kit.md) 복붙 초안 준비 완료** (레딧 en 3종·페북 vi 2종·네이버 ko·HN)
  - 우선 URL: /en/blog/living-in-korea-foreigner-guide → 외국인 도구 9종

## 🌏 외국인 유입 3-Phase 로드맵 (2026-07-12 — 새 집중 세션에서 Phase별 진행)

> 마스터 지시: 인도·중국·베트남 등 한국 관심 외국인 유입 강화. 각 Phase가 세션급 대작업 → 새 채팅에서 "Phase N 시작"으로 집중 진행.

### Phase 1 — 베트남(vi) 완역 (즉효)
- [x] **완료 (2026-07-12)**: 25경로 vi 완역 색인 — electric-calc 허브+하위 3 · timber-calc 허브+하위 16 · paint/gravel/deck-calc 3 · size-convert 1. vi 색인 67 → 92.
  - vi.json: 네임스페이스 14종(electric 4·timber 10, ~800키) + toolGuides 4종 신규(electric 3·size-convert) + **영어 placeholder 가이드 4종 실번역**(timber-lumber·paint·gravel·deck — "사전번역 병합" 기록과 달리 영어 원문이었음, vi==en 전수검사로 발견).
  - 배선: 패턴A 14페이지(ToolGuide vi collapse 제거·buildLanguagesAlt·OG vi_VN) + 패턴B 10페이지 인라인 isVi 분기 + locale-prop 폼 5종(Studs·Tile·Paint·Gravel·Deck) vi TEXT + timber 허브 인라인 titles Record vi 실번역.
  - 검증: 585 테스트·tsc 0·audit·build 611/611·브라우저 QA(콘솔 0·studs 계산 e2e·ko/en 회귀·모바일 375)·hreflang 4로케일+x-default·robots Allow 25.

### Phase 2 — 국가별 비자/제도 콘텐츠 (마스터 지침 핵심) ✅ 완료 (2026-07-12)
- [x] **국가별 허브 `/guide/foreign-work-visa-korea`** (외국인→한국, 마스터 지침 "어느 나라인→어떤 비자" 정면 반영): 비자유형 요약표(E-9/E-7/E-8/F-4/D-2·D-4/E-2/Top-Tier) + 7개 국가군 상세(인도=E-7/Top-Tier·EPS비대상 / 중국=조선족 F-4 2026.2 H-2통합 / 베트남=EPS+E-8+유학 / 동남아·남아시아 EPS 11국 / 중앙아+고려인 F-4 / 몽골 / 영어권=E-7·E-2). 데이터주도 4로케일 + Breadcrumb·FAQPage JSON-LD.
- [x] **제도 심층 `/guide/eps-e9-work-visa`**: EPS 개요·송출국 17개국(2025.10 타지키스탄 17번째)·인도 비대상 콜아웃·EPS-TOPIK 선발·4년10개월→9년8개월·2026 쿼터 8만·E-7-4 전환. 병렬 에이전트 작성→사실검수(수치·번역 placeholder 0).
- [x] **제도 심층 `/guide/e7-professional-visa`**: 4개 서브카테고리·2026 임금기준(E-7-1 3,112만/E-7-2·3 2,589만, 2.1발효)·GNI·20%룰·Top-Tier(F-5 3년)·F-2-7 전환. 병렬 에이전트→검수(3,112/2,589/33,000 4로케일 정확).
- 배선: guide 허브 GUIDES(3+1 앞줄)·sitemap·viReady/zhReady 4로케일 색인 게이트·재사용 `FaqJsonLd` 컴포넌트 신설.
- 검증: 585 테스트·tsc0·lint·audit·build·프로덕션 build+start 브라우저 QA(13경로 4로케일 HTTP 200+마커·콘솔0·zh/vi collapse 없음·sitemap 4로케일 20 loc·robots allow).

### Phase 2.5 — 한국인 해외비자 (마스터 추가 지시 2026-07-12) ✅ 완료
- [x] **`/guide/korea-passport-visa-free`** (한국인→해외, 반대 방향): 한국 여권 무비자국 개요 + 미국(ESTA)·유럽(셰겐 90/180, ETIAS 2026 미시행 정황)·일본(90)·중국(한시 30, 2026.12.31)·베트남(45, 2028까지)·태국(90 비자면제협정+TDAC)·인도(e-비자 필수). 상태배지(무비자/전자허가/비자필요) + 요약표 + 공통체크 + Breadcrumb·FAQPage JSON-LD. 데이터주도 4로케일. 웹검증 후 작성(변동성 큰 항목 기준일·공식확인 명시). visa-days 도구 상호링크.

### Phase 3 — K-생태계 흐름 정합 ✅ 완료 (2026-07-12, `0bd7911`)
- [x] **크로스링크 로케일 학습축 버그 수정**: `CrossLinks.tsx` LEARN_COPY ko="한국어 학습"→**영어 학습**(Loopla English) 교정, en/zh/vi=한국어 학습 유지. `learn/page.tsx` GAMES_COPY 4로케일 학습축 정합(ko=영어 공부 쉬는 시간 게임 / en·zh·vi=배운 한국어 게임으로 연습). 외국인 로케일은 게임 노출 순서도 한국어 연습 게임(kword 십자말·ktype 타자) 우선 재정렬 + 아이콘(Puzzle/Keyboard) 추가. crossLinks.ts·ToolGuide.tsx 주석도 축 반영.
- 동선: 외국인(en/zh/vi)=한국어학습→한국어게임(kword/ktype), 한국인(ko)=영어학습→게임. 유입→체류→재방문 루프.
- 검증: tsc0·lint0·585 테스트·build 성공·프로덕션 build+start 4로케일 라이브 QA(/learn·/korean-age ×4 = 200, ko=영어학습CTA·en/zh/vi=각 언어 한국어학습CTA, 게임 동선 4로케일 정합, 한국어학습CTA-BUG 마커 0).

### Phase 4 — SEO breadcrumb 전 페이지 일관화 ✅ 완료 (2026-07-12)
- [x] **~93페이지 배선 완료** (5페이지 → 전체): 계산기 64·그룹허브 3(labor/electric/timber)·게임랜딩 2·허브 4(tools/games/tests/learn)·블로그 10·가이드 9. `BreadcrumbList` JSON-LD + 시각 nav 동시 방출.
- **인프라**: `lib/seo/breadcrumbs.ts`(경로→계층 자동 생성, toolsCatalog/blogPosts 단일 진실원 참조로 드리프트 0) + `components/seo/Breadcrumbs.tsx`(시각 nav aria + JSON-LD, 자동/currentName/trail 3형태). 각 페이지는 `<Breadcrumbs path=... />` 한 줄.
- **배선**: 병렬 에이전트 5기(tax·labor·korea·timber·content) + 게임랜딩·대표 직접. 기존 back nav·`BreadcrumbJsonLd` 중복 제거·미사용 import 정리.
- **JSON-LD 방식**: 기존 사이트 전체 패턴(afterInteractive) 유지 — 일관성 + Google JS 렌더 인식. 인라인 전환은 사이트 전 JSON-LD 통일 시 별도(범위 밖).
- 검증: tsc0·585 테스트·클린 build 성공·라이브 브라우저 QA(net-salary 3단계·guide currentName·게임랜딩 trail 각 nav+JSON-LD itemListElement 정확·콘솔0).
- 근거: [Google breadcrumb 문서](https://developers.google.com/search/docs/appearance/structured-data/breadcrumb). 배포 후 Search Console 리치결과 보고서 모니터링 권장(마스터).

## 🟡 다음 주 (planned, D+1~7)

- [ ] **GSC 색인 요청** (담당: 마스터) — 외국인 니치 우선:
  - /en·/ko 의 pension-refund · d8-startup-visa · jeonse-wolse · f2-residence-visa ·
    foreign-flat-tax · foreign-health-insurance · apartment-area · visa-days
  - + 필러 블로그 living-in-korea-foreigner-guide
- [ ] **외부 백링크 1개** (담당: 마스터) — GitHub README 또는 네이버/티스토리/레딧
- [ ] **콘텐츠 2~3편 추가** (담당: Claude, 필요 시) — 검증된 키워드 기반 long-form
  - [x] ~~"Renting in Korea 심화"~~ → renting-in-korea-jeonse-wolse-guide 완료 (2026-06-19)
  - [x] ~~"외국인 단위·숫자 허브"~~ → korean-units-numbers-for-foreigners 완료 (2026-07-02, 영어 우선)
  - [ ] 후보: "First month in Korea 도착 가이드"

### ✅ 신규 도구 6종 완료 (2026-05-30, 전부 단계적으로)
korean-age(영어권 블루오션) · electric-bill(한국 고검색) · name-romanize(외국인) ·
size-convert(외국인) · capital-gains-tax(한국 고검색) · paint-calc(범용 영어)
→ 총 도구 40개. 신규 그룹: korea(🇰🇷) · utility(💡)

### ✅ ToolGuide 통합 완료 (노출 TOP10 중 8개 + 신규 6개)
income-tax · loan-calc · rent-cap · area-convert · percent-calc ·
biznum-check · electric-breaker · roof-area · wire-size · insulation ·
korean-age · electric-bill · name-romanize · size-convert · capital-gains-tax · paint-calc

## 🟢 대기 (backlog)

- [x] ~~/guide 인덱스 페이지~~ — 이미 존재 (전기·목조 long-form 5편 + 카테고리)
- [x] ~~About E-A-T 보강~~ — 완료 (외국인 독자 + 출처·검증 방법론 + 갱신일, 2026-06-17)
- [ ] /guide 허브에 외국인 니치 가이드 항목 추가 검토 (현재 실무자 중심)
- [x] ~~도구 즐겨찾기·사이트 검색 강화~~ — 완료 (검색 64개 단일진실원 재배선 + localStorage 즐겨찾기, 2026-06-19)

### ✅ 영문 외국인 니치 + 콘텐츠 (2026-06-16~17)
외국인 도구 7종 라이브(foreign-flat-tax·foreign-health-insurance·apartment-area·
f2-residence-visa·jeonse-wolse·d8-startup-visa·pension-refund) · 상황별 체크리스트
10개 도구 통합 · 국민연금 9.5% 갱신 · 복리 계산기 기본/적립식 2탭 개편 ·
About E-A-T · 필러 블로그(living-in-korea-foreigner-guide, 도구 9종 허브)

## ⚪ 미래 (someday, Phase 4)

- [ ] 다크/라이트 토글
- [ ] 도구 5개 추가 (총 38개 목표)

## ✅ 최근 완료 (history)

- [x] 2026-07-06: **Loopla 학습앱 workmate.tools/loopla 정적 임베드 통합** — vibe-english(11_english, Next16/next-intl4) SRS 학습앱을 소스 병합(코어 메이저 충돌·AdSense 심사 리스크) 대신 정적 임베드로 자사 도메인 서빙 → 트래픽·SEO·도메인권위·수익화 통합(github.io 분산 해소). `public/loopla/`(영어)+`/korean/`(한국어) basePath=/loopla 8.8MB. next.config 함정 3해결: ①afterFiles rewrite(디렉토리 인덱스 미서빙) ②skipTrailingSlashRedirect(trailingSlash 불일치) ③루트 locale redirect(vibe basePath 무시 버그). projectsCatalog vibe external→internal-static + `subpathByLocale`(ko=영어학습·en·vi=한국어학습, 타겟 정합) + resolveProjectUrl(p,locale). `tool/build-loopla.ps1` 재현 + `docs/loopla-integration.md`. tsc0·build 455/455·audit·dev+라이브 앱 실동작 QA(콘솔0·딥링크·IndexedDB)·배포 alias 3단계·IndexNow (`f5d155b`)
- [x] 2026-07-06: **ads.txt www 200 회귀 수정** — www→apex 308이 ads.txt까지 리다이렉트 → AdSense "찾을 수 없음" 간헐. 루트 텍스트(ads.txt·indexnow-key·llms.txt·llms-full.txt) lookahead 예외로 apex/www 양쪽 200 (`d9408fd`)
- [x] 2026-07-04: **라이트 모드 + 결과 시각화 차트 + RSS + pyeong 상호링크** — ThemeToggle(FOUC 가드)·[data-theme] 토큰·charts.tsx 순수SVG 3종(net-salary·income-tax·loan·compound)·formatAxisMoney·/rss.xml·랜딩 언어수 3·AdSense raw script·docs/distribution-kit.md·pyeong↔units 카니발라이제이션 상호링크 (`9670921`·`5edb027`)
- [x] 2026-07-03: **vi 웨이브4 — /data 신선도 레지스트리 3-locale (GEO 신뢰 페이지)** — dataRegistry 12항목 vi 필드(숫자·법조문 보존) + /data 페이지 3-locale(카테고리·배지·표헤더·방법론). VI_READY 49→50. 목적=AI 답변엔진이 베트남어 한국요율 질의에 인용(strategy P3). 578·tsc0·build 454/454·/vi/data QA(콘솔0)·배포·IndexNow (`ded8bb0`). **vi 지역화 전략적 완료**: 외국인 관련 전 도구(돈·비자·생활·단위·세금·보험) + 신뢰페이지 vi. **의도적 미번역**: electric 3(KEC 전선/차단기)·timber 19(NDS 목조) = 한국 건설/전기 전문가 도구, 베트남 노동자 검색수요 사실상 0(가이드는 사전번역 보존, 필요시 배선만). 다음 레버=번역이 아니라 유통(FB 베트남 커뮤니티·GSC vi 색인).
- [x] 2026-07-03: **vi 웨이브3 — 세금11·변환10·비자5 완역 색인(vi 색인 23→49경로)** — 병렬 에이전트 3기 산출물 병합·파리티검증·선별. 세금 11(income-tax·capital-gains-tax·loan-calc·compound-calc·vat-calc·freelancer-tax·foreign-stock-tax·gift-tax·prepayment-penalty·car-acquisition-tax·car-tax) + 변환/한국생활 10(area-convert·percent-calc·distance-convert·temp-convert·json-csv·school-grade·due-date·korean-number·hangul-decompose·text-romanize) + 비자/이름 5(f2·d8·name-romanize·gift-money·voltage-guide). page 3-locale+form(TEXT/messages)+ToolGuide en파리티. vi.json toolGuides 42→68종. VatForm relatedLinks·foreign-stock alternates 정정. income-tax 세율표 표기 기존버그(3로케일) 별도칩 분리. 578·tsc0·build 454/454·audit·QA(콘솔0)·배포·IndexNow 26 (`3e0b827`). **남은 vi**: electric 3 · timber 19 page/form 배선 · /data · 허브.
- [x] 2026-07-03: **vi 웨이브2 — labor·부동산·유틸 10종 완역 색인 + timber 19가이드 사전번역** — 병렬 에이전트 5기(세션한도 일부 중단) 산출물을 병합·파리티검증·선별. 완역 색인 +10(vi 13→23): unemployment-benefit·rent-cap·apartment-area·brokerage-fee·electric-bill·btu-calc·insurance-calc·biznum-check·annual-leave·weekly-rest-pay (page 3-locale + form vi + ToolGuide en파리티OK). size-convert page/form vi(색인 보류). timber 19 ToolGuide 사전번역 병합(휴면=page/form 미배선, 다음 웨이브). vi.json toolGuides 23→42종. 578 테스트·tsc0·build 454/454·audit·/vi/rent-cap QA(콘솔0·숫자/법조문 보존)·배포·IndexNow 10 URL (`b67dd29`). **다음 웨이브**: tax 11·korea/convert 15·electric 3 + timber page/form 배선.
- [x] 2026-07-03: **베트남어(vi) 로케일 전면 도입 + 입력창 한글 누출 수정** — 3번째 언어(체류외국인 2위 33.7만·유학생 1위 근거). 아키텍처: en 딥머지 폴백(미번역 /vi=완전한 영어) + `lib/viReady.ts` 완역 게이트(13경로만 sitemap/hreflang/robots Allow — 반쪽 번역 색인 차단). vi.json 1,582줄 + 12개 도구 페이지·폼 완역(3-locale) + toolsCatalog·OG·layout vi. 에이전트 3기 병렬. **버그**: NumberField suffix "원" 46곳/26파일이 en에도 노출(NumberField 마이그레이션 때 도입) → locale 분기(ko=원, en/vi=₩)·MinWage 옵션·RentCap 결과 패널 수정. 578 테스트·tsc 0·build 454/454(+152p)·브라우저 QA(vi 완역/폴백·en/ko 입력창·콘솔 0)·배포·IndexNow 13 URL (`1ac3988`)
- [x] 2026-07-03: **AX Phase A — /data 신선도 레지스트리 + llms.txt + stale 3건 수정** — 글로벌·AX 전략(`docs/strategy-global-ax.md`, `6cfca63`) 수립 후 Phase A 실행. 레지스트리 구축이 즉시 성과: **stale 3건 실발견·수정** (최저임금 2026 = 10,320원 고시 제2025-47호 / 국민연금 상·하한 659만·41만 2026.7~ / 실업급여 상·하한 68,100·66,048원 7년 만의 인상) → 상수·테스트·폼·ToolGuide ko/en 전체 정합. 신규: lib/dataRegistry(12항목, 계산기와 같은 상수 import=드리프트 0) · /data ko/en · /llms.txt·/llms-full.txt(동적 생성, GEO) · audit [J.데이터신선도] 180일 경고 · AI referral 가이드(GA4). pct 표시버그(10%→1%) 브라우저 QA에서 발견·수정. 578 테스트·build 306/306·라이브 200·IndexNow (`ce5538a`)
- [x] 2026-07-02: **외국인 고통점 도구 3종 신규 (깡통전세·생활비·해외송금)** — GSC 영어 우위 + 최대 고통 검색의도(주거사기·생활비·송금) 공략, 영어 우선. 정확성 원칙(범위·기준일·법아님 라벨 + 강한 면책 + 공식출처·직접확인, 과장 금지). deposit-risk(부채비율/경매 손실 시뮬, jeonse-wolse 정성 체크리스트와 중복 회피=정량 계산기) · cost-of-living(지역×가구 편집가능 기본값=본인 예산, USD 배제) · remittance(환율마진+수수료 실질비용, 특정업체·실시간환율 배제). 각 calc+test+form+page+ToolGuide(ko/en)+catalog+sitemap. 577 테스트·build 302/302·audit·브라우저 QA(콘솔0·인터랙션·계산 일치)·배포 alias 3단계·IndexNow 6 URL (`ec22626`). 도구 71개.
- [x] 2026-07-02: **영어 니치 강화 — pillar 글 + 도구 4종 SEO 재배선** — GSC 국가별 데이터(미국 순위 9.2 vs 한국 14.1 = 영어 우위) 근거로 영어 우선. 신규 pillar 블로그 korean-units-numbers-for-foreigners(평·나이·사이즈·거리·온도·사업자번호 집약, 외국인 도구 9종 허브 링크) + area-convert(순수 평 변환 소유)·apartment-area(전용/공급·평당가로 재차별화=평 키워드 자가잠식 해소)·school-grade·biznum-check 메타 강화. 558 테스트·build(296/296)·audit(i18n parity·thin0·coming-soon0)·ko/en 브라우저 QA(콘솔0)·배포 alias 3단계·IndexNow 10 URL (`d83dcae`)
- [x] 2026-06-29: **수익 전략 로드맵 + 휴면 제휴 인프라** — GSC 실적 진단(클릭39/28일·순위12.4) → 정직한 3-Track 모델(AdSense 바닥·금융 제휴/CPA 주력·트래픽 병목) `docs/monetization-strategy.md`. `lib/offers.ts`+`OfferSlot`(휴면=비노출, rel=sponsored 공시, AdSense 심사 무해) ResultShell 통합. 558 테스트·build·라이브(비노출 확인)·배포 (`66b8767`)
- [x] 2026-06-25: **Google 공식 AdSense Site Approvals 6편 시스템 반영** — 공식 영상 자막 직접 분석 후 거절사유 #3/#6 갭 수정(labor 설명 미구현 '예정' 문구 제거 + 죽은 '준비 중/coming soon' UI 전면 제거) + docs 정본 체크리스트·CLAUDE 도그마·audit [I.공식정책] 자동검출. 558 테스트·build·라이브 검증·배포 (`7a7b5ba`)
- [x] 2026-06-24: **신규 계산기 4종** — 실업급여(구직급여, 고용보험법)·부동산 중개수수료(복비, 공인중개사법)·중도상환수수료(슬라이딩, 여신약관)·증여세(상증세법). 병렬 빌드 → catalog/messages 병합. 도구 64→68개. 68개 신규 테스트·build(294/294)·audit(thin0)·브라우저 검증·배포·IndexNow (`5a8cb0b`)
- [x] 2026-06-24: **전환·체류 강화** — ResultShell `relatedLinks`(결과 직후 관련 도구·블로그 추천 칩) 공용 신설 + 상위 8개 도구 큐레이션 배선(ko/en) + 즉시 결과(Loan·IncomeTax·Compound·Jeonse·Vat·Insurance 마운트 시 계산, 빈 화면 제거). build·490 테스트·브라우저 검증·배포 (`112cb5b`)
- [x] 2026-06-24: **사용자 중심 UX 전면 개편** — 4관점 병렬 UX 감사 → 공용 컴포넌트(calc-form·ToolGuide·globals·헤더) 일괄 개선으로 64도구 가독성·접근성·정보구조 향상(WCAG 대비·결과 위계·출처/단계·FAQ 아이콘·드로어 a11y·터치타깃·/tools 검색·electric-calc 허브 버그). 블로그 8편 태그 5개씩 + PostTags. build·490 테스트·브라우저 검증 통과·배포 (`8055cbd`)
- [x] 2026-06-24: **숫자 입력 전면 개편 + 공유** — 공용 `NumberField`(콤마·캐럿 보존·빈값 허용·단위 suffix·모바일 키패드)로 "앞자리 삭제 시 자릿수 소실" 버그 근본 해결, 46개 폼 마이그레이션(병렬 에이전트). 결과 공유 버튼(Web Share+클립보드 폴백, 34 ResultShell+net-salary) + 핵심 9개 도구 per-tool OG 카드. 490 테스트·build·minerva-web-qa PASS·배포 (`8e90155`)
- [x] 2026-06-19: **재신청 전 통합** — 랜딩 검색을 toolsCatalog(64개 단일진실원)로 재배선('연봉·퇴직금' 검색 0건 버그 해소, 죽은 tools-registry 제거) + 도구 즐겨찾기(localStorage·검색 위젯 별표) + 허브 doorway 본문(/tools·/games·/tests ko/en) + 외국인 임대 블로그(renting-in-korea-jeonse-wolse-guide). minerva-web-qa 전수검사 PASS · 배포 alias 3단계 · IndexNow (`d51c675`)
- [x] 2026-06-12: 랜딩 페이지 키네틱 재디자인 — 롤링 헤드라인·플로팅 계산 카드·도구 57개 마퀴·인기 TOP6·카테고리 그리드(toolsCatalog 단일 진실원)·스탯 카운트업·블로그/메이커 크로스 프로모. minerva-web-qa 전수검사 통과.
- [x] 2026-06-06: WaveB — hangul-decompose · korean-number · school-grade (`7cf860f`)
- [x] 2026-06-06: WaveA — distance-convert · temp-convert · text-romanize · voltage-guide (`8c94cba`)
  - 보류: korea-holidays (음력 명절 양력 변환 정확도 미검증 → korean-number로 대체)
  - 마스터 액션: 신규 7개 도구 ×2 로케일 GSC 색인 요청 + sitemap 재제출
- [x] 2026-05-23: 블로그 3편 + /blog 인덱스 (`223ba6f`)
- [x] 2026-05-23: 인기 5개 도구 ToolGuide (`f9b8e78`)
- [x] 2026-05-23: hreflang x-default 보강 23 페이지 (`e1adc9e`)
- [x] 2026-05-23: middleware /ads.txt /indexnow-key 예외 (`da4fce8`)
- [x] 2026-05-23: AdSense + IndexNow 인프라 (`a7f794b`)
- [x] 2026-05-13: 종합소득세 + 임대료 5% (`b014f28`)
- [x] 2026-05-13: 평수 + 퍼센트 + 대출 (`0c58ba7`)
- [x] 2026-05-13: 복리 계산기 (`bde9b62`)
- [x] 2026-05-13: PDF/인쇄 버튼 제거 (`e16951d`)
- [x] 2026-05-13: 자재 dedicated 페이지 5개 (`d0cef91`)
