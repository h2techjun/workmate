# Workmate 작업 목록

> 진행 중인 모든 작업의 체크리스트. 단순한 완료/미완료 추적용.
> 더 큰 컨텍스트가 필요하면 [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) 참조.

## 🔴 진행 중 (in progress)

- [ ] **AdSense 2차 재신청** (담당: 마스터) — 콘텐츠 보강 충분, 재신청 가능
  - 1차 거절("가치 없는 콘텐츠") 대비 강화: 외국인 도구 7종·상황별 체크리스트 10·필러 블로그·About E-A-T.
  - 위치: AdSense 대시보드 → 사이트 → workmate.tools → "검토 요청"

- [ ] **트래픽 신호 검증** (담당: 마스터) — ⭐ 최우선
  - GSC URL 검사로 신규 외국인 도구·필러 블로그 색인 요청 (매일 5~10건)
  - 영문 커뮤니티(reddit r/Living_in_Korea 등)에 필러 글 1회 노출 → 실제 유입 신호 확인
  - 우선 URL: /en/blog/living-in-korea-foreigner-guide → 외국인 도구 9종

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
