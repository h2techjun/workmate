# Workmate 프로젝트 상태판

> **단일 진실원** — 매 세션 시작 시 이 파일을 먼저 읽으세요.
> 마지막 갱신: 2026-05-23 (블로그 3편 + AdSense 1차 거절 보강 완료)

---

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
| 메이커 hub | ✅ /projects (k-poker · defense · 6hours · office-hunter) |

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

## 📅 변경 이력 (최근 5개)

| 일자 | 작업 | 커밋 |
|---|---|---|
| 2026-05-23 | 블로그 3편 + /blog 인덱스 신규 | `223ba6f` |
| 2026-05-23 | 인기 5개 도구 ToolGuide (thin-content 보강) | `f9b8e78` |
| 2026-05-23 | hreflang x-default 누락 보강 (23 페이지) | `e1adc9e` |
| 2026-05-23 | middleware /ads.txt /indexnow-key 예외 | `da4fce8` |
| 2026-05-23 | AdSense + IndexNow 인프라 (env 조건부) | `a7f794b` |
