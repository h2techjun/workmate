# Workmate 로드맵 — 마스터 액션 + 향후 도구 (검색 조사 기반)

> 최종 갱신: 2026-05-30. 검색 수요 조사를 근거로 우선순위 산정.
> 단일 진실원: [`PROJECT_STATUS.md`](../PROJECT_STATUS.md) · [`TASKS.md`](../TASKS.md)

---

## 🎯 PART 1 — 마스터가 진행할 일 (통합 체크리스트)

### 🔴 즉시 (이번 주)

#### A. GSC 색인 요청 — 신규 6개 도구 (최우선)
Google Search Console → "URL 검사" → 주소 붙여넣기 → "색인 생성 요청".
하루 한도 ~10건. 영문 우선(영어권 노출 35%).

```
1순위 (오늘):
https://workmate.tools/en/korean-age
https://workmate.tools/ko/korean-age
https://workmate.tools/ko/electric-bill
https://workmate.tools/en/capital-gains-tax
https://workmate.tools/ko/capital-gains-tax
https://workmate.tools/en/name-romanize
https://workmate.tools/en/size-convert
https://workmate.tools/ko/name-romanize
https://workmate.tools/ko/size-convert
https://workmate.tools/en/paint-calc

2순위 (내일):
https://workmate.tools/en/electric-bill
https://workmate.tools/ko/paint-calc
https://workmate.tools/ko/guide
https://workmate.tools/en/guide
+ 지난 강화 페이지 (roof-area, wire-size, insulation, breaker, biznum-check)
```

#### B. Sitemap 재제출 (1분, 효과 큼)
GSC → 좌측 "Sitemaps" → `sitemap.xml` 재제출.
→ Google이 **108개 URL 전부**를 재크롤 큐에 넣음. 개별 요청보다 광범위.

### 🟡 이번 주~다음 주

#### C. 외부 백링크 (게재순위 상승 최단 경로)
현재 백링크 0건. 1~3개만 받아도 SEO 우선순위 ↑↑.
- GitHub 4개 프로젝트(k-poker·defense·6hours·office-hunter) README 상단에:
  ```markdown
  > Maker · [Workmate — 한국 실무 도구 40개](https://workmate.tools)
  ```
- 네이버 블로그·티스토리 1편: "한국 실무자가 매일 쓰는 무료 계산기 40개"

#### D. AdSense 2차 재신청 (6/13 권장)
보강 완료(블로그 5편 + ToolGuide 16개 + 도구 40개). 콘텐츠 충분.
AdSense 대시보드 → 사이트 → workmate.tools → "검토 요청".

### 🟢 상시 (모니터링)
- GA4 → 페이지 보고서: 어느 도구가 트래픽 받는지 주 1회 확인
- GA4 본인 IP 제외 설정(아직 안 했으면): 관리 → 데이터 스트림 → 내부 트래픽 정의
- GSC 실적: 게재순위 16위 → 10위 진입 추세 점검

---

## 🔬 PART 2 — 향후 추가 도구 (검색 조사 기반 우선순위)

### 조사 핵심 발견
1. **연봉 실수령액 계산기** = 한국 계산기 검색 1위 카테고리 (잡코리아·사람인 독점). 우리는 insurance-calc 있으나 "연봉 실수령액" 헤드라인 프레이밍 없음 → 최대 기회.
2. **음력↔양력 변환** = `usingsky/KoreanLunarCalendar` 라이브러리(1000~2050 정확, JS 포팅 가능) 존재 → 이제 정확히 구현 가능. 한국인+외국인 양쪽 수요.
3. **비자 체류일수 계산기** = 외국인 블루오션 (90일·D비자 추적).
4. **자동차 취득세·등록세** = 한국 고검색 (car.calculate.kr 등).
5. **축의금/부의금·출산예정일** = 한국 고유 고검색 라이프 계산기 (Calcpedia 핵심).

### 🥇 Tier 1 — 최고 ROI (다음 세션 우선)

| 도구 | 검색 근거 | 타겟 | 난이도 |
|---|---|---|---|
| **연봉 실수령액 계산기** | 한국 계산기 검색 1위. 잡코리아/사람인 독점 영역 | 한국인 전 직장인 | 중 (소득세+4대보험 통합) |
| **음력 ↔ 양력 변환** | 외국인 명절·생일 + 한국인 음력 생일. 라이브러리 확보 | 한국인+외국인 | 중 (라이브러리 통합) |
| **비자 체류일수 계산기** | 외국인 블루오션. 90일 무비자·D비자 추적 | 외국인 | 하 (날짜 차) |

### 🥈 Tier 2 — 한국 고검색

| 도구 | 검색 근거 | 타겟 |
|---|---|---|
| **자동차 취득세·등록세** | car.calculate.kr 등 전용 사이트 존재 = 수요 큼 | 한국인 차량 구매자 |
| **프리랜서 3.3% 계산기** | 통합 세금계산기 사이트 필수 항목 | 프리랜서·N잡러 |
| **축의금/부의금 계산기** | Calcpedia 핵심. 한국 고유 관습 | 한국인 경조사 |
| **출산예정일 계산기** | Calcpedia 핵심. 高검색 라이프 도구 | 임신부 |
| **자동차세 계산기** | 카눈 등 전용 사이트. 매년 6·12월 검색 폭증 | 한국인 차주 |

### 🥉 Tier 3 — 범용 영어 (전 세계)

| 도구 | 검색 근거 | 타겟 |
|---|---|---|
| **자갈/골재 계산기** | "gravel calculator" 전 세계 고검색 | 조경·건축 |
| **데크/울타리 계산기** | "deck board calculator" | DIY |
| **콘크리트 계산기 영문 강화** | 기존 도구, 영문 키워드 보강 | 글로벌 |
| **BTU/냉난방 용량** | "btu calculator" 고검색 | HVAC |

### 보류 / 검토 필요
- **환율 계산기** — API 의존(마스터 방침상 제외). 정적 환율표는 가능하나 가치 낮음.
- **주식 양도세 고도화** — 이미 foreign-stock-tax 있음.

---

## 📊 현재 상태 스냅샷 (2026-05-30)

| 지표 | 값 |
|---|---|
| 총 도구 | **40개** (9개 카테고리) |
| 블로그 long-form | 5편 |
| ToolGuide 통합 | 16개 도구 |
| Sitemap URL | 108개 |
| 단위 테스트 | 307/307 |
| i18n 키 | 2,211 = 2,211 (ko=en) |
| AdSense | 1차 거절 → 보강 완료 → 2차 대기 |
| GSC 노출 | 483 (3개월), 게재순위 16위 |
| 외부 트래픽 | 한국 55% : 외국 35% (US 26%) |

---

## 🗺️ 권장 진행 순서 (다음 세션들)

1. **연봉 실수령액 계산기** — 한국 최대 검색, 기존 insurance-calc 통합·승격
2. **음력↔양력 변환** — 라이브러리 통합, 정확도 확보
3. **비자 체류일수** — 외국인 블루오션, 빠른 구현
4. **자동차 취득세 + 프리랜서 3.3%** — 한국 고검색 묶음
5. **축의금 + 출산예정일** — 한국 라이프 도구 묶음
6. **범용 영어 건축 (자갈·데크)** — 전 세계 트래픽

각 도구는 동일 패턴: calc+test → form → page → catalog/sitemap → ToolGuide ko/en → 빌드·배포·IndexNow.
