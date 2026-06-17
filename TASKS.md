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
  (후보: "Renting in Korea 심화", "First month in Korea 도착 가이드")

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
- [ ] AdSense 통과 후: 도구 즐겨찾기·사이트 검색 강화

### ✅ 영문 외국인 니치 + 콘텐츠 (2026-06-16~17)
외국인 도구 7종 라이브(foreign-flat-tax·foreign-health-insurance·apartment-area·
f2-residence-visa·jeonse-wolse·d8-startup-visa·pension-refund) · 상황별 체크리스트
10개 도구 통합 · 국민연금 9.5% 갱신 · 복리 계산기 기본/적립식 2탭 개편 ·
About E-A-T · 필러 블로그(living-in-korea-foreigner-guide, 도구 9종 허브)

## ⚪ 미래 (someday, Phase 4)

- [ ] 사이트 검색 기능 강화
- [ ] 도구 즐겨찾기 (localStorage)
- [ ] 다크/라이트 토글
- [ ] 도구 5개 추가 (총 38개 목표)

## ✅ 최근 완료 (history)

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
