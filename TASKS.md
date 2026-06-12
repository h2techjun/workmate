# Workmate 작업 목록

> 진행 중인 모든 작업의 체크리스트. 단순한 완료/미완료 추적용.
> 더 큰 컨텍스트가 필요하면 [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) 참조.

## 🔴 진행 중 (in progress)

- [ ] **AdSense 2차 재신청** (담당: 마스터, 시점: 2026-05-27~30)
  - 1차 거절 보강 작업은 완료. 4~7일 대기 후 재신청.
  - 위치: AdSense 대시보드 → 사이트 → workmate.tools → "검토 요청"

- [ ] **GSC 색인 가속** (담당: 마스터, 매일 5~10건)
  - 우선순위: blog 6개 URL → 신규 도구 4개 URL
  - 위치: Google Search Console → URL 검사 → 색인 생성 요청

## 🟡 다음 주 (planned, D+1~7)

- [ ] **GSC 색인 요청** (담당: 마스터) — 신규 6개 도구 우선:
  - /ko·/en/korean-age, /electric-bill, /name-romanize, /size-convert,
    /capital-gains-tax, /paint-calc
- [ ] **외부 백링크 1개** (담당: 마스터) — GitHub README 4개 또는 네이버/티스토리
- [ ] **음력↔양력 변환기** (담당: Claude) — KASI 데이터 테이블 확보 필요 (보류)

### ✅ 신규 도구 6종 완료 (2026-05-30, 전부 단계적으로)
korean-age(영어권 블루오션) · electric-bill(한국 고검색) · name-romanize(외국인) ·
size-convert(외국인) · capital-gains-tax(한국 고검색) · paint-calc(범용 영어)
→ 총 도구 40개. 신규 그룹: korea(🇰🇷) · utility(💡)

### ✅ ToolGuide 통합 완료 (노출 TOP10 중 8개 + 신규 6개)
income-tax · loan-calc · rent-cap · area-convert · percent-calc ·
biznum-check · electric-breaker · roof-area · wire-size · insulation ·
korean-age · electric-bill · name-romanize · size-convert · capital-gains-tax · paint-calc

## 🟢 대기 (backlog, AdSense 2차 거절 시 발동)

- [ ] /guide 인덱스 페이지 (현재 404)
- [ ] About 페이지에 자격증·경력 명시 (E-A-T 보강)
- [ ] 도구 페이지 7~10개 추가 ToolGuide 통합 (현재 5개)

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
