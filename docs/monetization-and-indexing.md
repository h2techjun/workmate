# 광고·색인 가속 가이드

> Workmate (workmate.tools) 가 AdSense 승인 받고 + 검색엔진에 빠르게 색인되기 위한 운영 가이드.
>
> **인프라는 다 깔려 있음** — 사용자는 아래 4단계만 따라하면 됨.

---

## ✅ 현재 인프라 (이미 완료)

| 항목 | 상태 | 위치 |
|---|---|---|
| 개인정보처리방침 | ✅ | `/ko/privacy` `/en/privacy` |
| 이용약관 | ✅ | `/ko/terms` `/en/terms` |
| About | ✅ | `/ko/about` `/en/about` |
| Contact (이메일 노출) | ✅ | `/ko/contact` `/en/contact` |
| Footer 4개 정책 링크 | ✅ | `components/layout/Footer.tsx` |
| AdSense Script (조건부 로드) | ✅ | `components/seo/AdSenseScript.tsx` |
| AdSlot 컴포넌트 (env 분기) | ✅ | `components/seo/AdSlot.tsx` |
| `/ads.txt` 동적 라우트 | ✅ | `app/ads.txt/route.ts` — env 자동 주입 |
| `/sitemap.xml` | ✅ | 도구 33개 × ko/en = 66개 URL |
| `/robots.txt` | ✅ | `app/robots.ts` |
| Google Search Console verification | ✅ | `google978ab54addb768c4` |
| Naver 서치어드바이저 verification | ✅ | `naver327b3085...` |
| IndexNow 키 라우트 | ✅ | `app/indexnow-key/route.ts` — env 자동 주입 |
| IndexNow 일괄 핑 스크립트 | ✅ | `tool/submit_indexnow.mjs` |

---

## 🚀 4단계 실행 (운영자가 직접 진행)

### Step 1. AdSense 신청

1. https://www.google.com/adsense/start 접속 → "시작하기"
2. 사이트 URL: `https://workmate.tools` 입력
3. 결제 정보·세금 정보 입력
4. AdSense 가 발급한 publisher ID (`ca-pub-XXXXXXXXXXXXXXXX`) 복사

### Step 2. Vercel 환경변수 설정

Vercel 대시보드 → Project Settings → Environment Variables 에 다음 추가:

```
NEXT_PUBLIC_ADSENSE_CLIENT  = ca-pub-XXXXXXXXXXXXXXXX
INDEXNOW_KEY                = (`openssl rand -hex 16` 결과 또는 임의 32자)
```

추가 후 재배포 (Vercel 대시보드 → Deployments → 최신 deployment → Redeploy).

**검증:**
```bash
curl https://workmate.tools/ads.txt
# 출력: google.com, pub-XXXXXXXXXXXXXXXX, DIRECT, f08c47fec0942fa0

curl https://workmate.tools/indexnow-key
# 출력: <32자 키>
```

### Step 3. AdSense 심사 통과 확인

- 심사 기간: **1~4주** (콘텐츠 풍부도·트래픽·정책 준수 검토)
- 진행 상황: AdSense 대시보드 → "사이트" 탭
- **승인되면**: `<head>` 의 AdSense Script 가 자동 로드 → 광고 노출 시작
- **거절되면**: 사유 확인 후 보강 → 재신청 (무한 가능)

#### Workmate 가 심사 통과에 강한 이유
- 33개 unique tool pages × 2 locales = 66 페이지 (Google 안전선 30+ 충족)
- 모든 도구가 법령·KS 표준 출처 명시 = 신뢰성 시그널 ↑↑
- privacy/terms/about/contact 4개 정책 페이지 완비
- 도메인 `.tools` = professional

#### 자주 거절 사유 & 대응
| 거절 사유 | 대응 |
|---|---|
| "Low value content" | 도구 설명·공식·예시 더 길게. /guide 페이지 강화 |
| "Navigation issues" | Footer 정책 링크는 OK, Header 도구 메뉴 점검 |
| "Site not ready" | 트래픽 너무 낮을 때 — Step 4 색인 가속 먼저 |

### Step 4. 검색엔진 색인 가속

#### Google (Search Console)
1. https://search.google.com/search-console → workmate.tools 속성 (이미 등록됨)
2. "Sitemaps" → `sitemap.xml` 제출
3. 신규 추가 URL → "URL 검사" → "색인 생성 요청" (페이지당 수동, 일일 한도 ~10건)
4. 인기 키워드 모니터링 → 부족한 도구 보강

#### Bing/Yandex (IndexNow — 자동)
```bash
# Vercel 환경변수에 INDEXNOW_KEY 설정 후 로컬에서 실행
export INDEXNOW_KEY="<발급한키>"   # PowerShell: $env:INDEXNOW_KEY="..."
node tool/submit_indexnow.mjs               # 사이트맵 전체 (66 URLs) 핑
node tool/submit_indexnow.mjs --new         # 최근 신규 도구 12개만 핑
node tool/submit_indexnow.mjs https://workmate.tools/ko/income-tax
```

**효과**: Bing 은 1~3일 내 색인. Yandex 도 동일. Google 은 IndexNow 미지원 (Step 4 GSC 사용).

#### 네이버 (서치어드바이저)
1. https://searchadvisor.naver.com → workmate.tools (이미 등록)
2. "요청 → 사이트맵 제출" 에 `https://workmate.tools/sitemap.xml`
3. "요청 → 웹페이지 수집" 에 신규 URL 개별 제출
4. "진단 → 사이트 최적화" 점수 모니터링

---

## 📊 운영 일상

### 신규 도구 배포 후 워크플로우
```bash
# 1. 도구 추가·테스트·빌드·푸시 (commit + git push)
# 2. Vercel 자동 배포 대기 (보통 1분)
# 3. 라이브 검증
curl -I https://workmate.tools/ko/<new-tool>   # HTTP 200 확인
# 4. 색인 가속
node tool/submit_indexnow.mjs --new            # Bing/Yandex
# 5. GSC 에서 신규 URL "색인 생성 요청" (수동)
```

### 월간 점검 (5분)
- [ ] AdSense 대시보드 → 정책 위반 0건 확인
- [ ] GSC → "색인" → 색인된 URL 수 vs sitemap URL 수 갭 점검
- [ ] AdSense 수익 추이 → 상승 도구·하락 도구 분석
- [ ] 네이버 서치어드바이저 → 색인 누락 페이지 확인

---

## 🔧 환경변수 레퍼런스

| 키 | 필수 | 설명 |
|---|---|---|
| `NEXT_PUBLIC_ADSENSE_CLIENT` | AdSense 승인 후 | `ca-pub-XXXXXXXXXXXXXXXX` |
| `NEXT_PUBLIC_ADSENSE_RESULT_SLOT` | 권장 | 도구 결과 하단 광고 슬롯 ID |
| `NEXT_PUBLIC_ADSENSE_PAGE_BOTTOM_SLOT` | 권장 | 페이지 하단 광고 슬롯 ID |
| `INDEXNOW_KEY` | 권장 | 32+자 영숫자 (Bing/Yandex 색인 가속용) |
| `NEXT_PUBLIC_GA_ID` | 선택 | `G-XXXXXXXXXX` (Google Analytics 4) |

미설정 시 해당 기능 자동 비활성 — 빌드/배포는 항상 성공.
