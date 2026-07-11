# Workmate 프로젝트 가이드 (Claude Code 전용)

> 이 문서는 Claude Code가 프로젝트 전체 컨텍스트를 빠르게 파악하기 위한 핵심 문서입니다.
> 모든 작업 시작 전에 반드시 이 문서를 먼저 읽으세요.

## 📌 매 세션 시작 시 필수 — 단일 진실원 3개

1. **[`PROJECT_STATUS.md`](./PROJECT_STATUS.md)** — 현재 단계 · 도구 인벤토리 · AdSense 진행 · 마스터/Claude 액션
2. **[`TASKS.md`](./TASKS.md)** — 진행 중·다음 주·대기·완료 작업 체크리스트
3. **본 CLAUDE.md** — 기술 스택 · 코딩 규칙 · 도메인 컨텍스트

코드 작성·기능 추가·이슈 진단 등 모든 작업은 위 3개 파일을 먼저 읽고 시작.
세션 종료 시 **PROJECT_STATUS.md 변경 이력 + TASKS.md 체크 갱신** 필수.

## 🎯 프로젝트 정체성

**Workmate** (workmate.tools) 는 두 가지 역할을 동시에 수행:

1. **한국 실무 도구 허브** — 무료 계산기 33개 (도구 본업) + 블로그 long-form 3편
2. **메이커 포트폴리오 허브** — 운영자가 만든 다른 프로젝트 5개를 `/games`·`/tests` 페이지에서 카드로 노출 (구 `/projects`는 `/games`로 308 리다이렉트 — next.config.ts)

- **타겟**: 한국 실무자 (1순위) + 한국 표준이 필요한 외국인 (2순위)
- **수익 모델**: SEO 트래픽 → 광고(애드센스) + 추후 프리미엄 기능
- **차별화**: 현장 실무 경험 기반의 정확한 계산 + KS 표준 출처 명시

### 🌐 메이커 허브 — 다른 프로젝트의 카탈로그 단일 진실원

`lib/projectsCatalog.ts` 가 모든 프로젝트의 노출 상태를 결정. `/games`·`/tests` 허브 페이지·sitemap 모두 이 파일을 참조.

| 프로젝트 폴더 | 탭 | 호스팅 |
|---|---|---|
| `D:/02_PROJECT/01_Hakrew/` | 서비스 | hakrew21.github.io/hakrew-web/ |
| `D:/02_PROJECT/03_6Hours/` | 체험 | github.com/h2techjun/6hours |
| `D:/02_PROJECT/04_office-hunter/` | 체험 | github.com/h2techjun/office-hunter |
| `D:/02_PROJECT/08_k-poker/` | 게임 | junhuimine.github.io/k-poker/ |
| `D:/02_PROJECT/defense/` | 게임 | h2techjun.github.io/defense/ |
| `D:/02_PROJECT/11_english/` | 학습 | **정적 임베드** workmate.tools/loopla (자사 도메인) |

> ⚠️ **11_english(Loopla)만 external 이 아닌 정적 임베드** — `public/loopla/` 에 빌드 산출물을
> 커밋해 workmate.tools 에서 직접 서빙(트래픽·SEO·수익화 통합). 재빌드=`tool/build-loopla.ps1`.
> 아키텍처·함정: [`docs/loopla-integration.md`](./docs/loopla-integration.md). 소스는 11_english repo 단일 진실원.

**제외된 프로젝트** (사용자 결정): doc-translator, 09_jeonju-sangkwon, 02_Trade, 06_strix.

새 프로젝트 추가/제외 변경은 `lib/projectsCatalog.ts` 만 수정 → 나머지(/games·/tests 페이지·sitemap·구조화 데이터) 자동 반영.

## 🏗️ 기술 스택 (절대 변경 금지)

```
- Framework: Next.js 15 (App Router)
- Language: TypeScript (strict mode, any 금지)
- Styling: Tailwind CSS v4 + shadcn/ui
- i18n: next-intl (URL 경로 4로케일: /ko, /en, /zh, /vi)
- Form: React Hook Form + Zod
- State: useState 우선, 복잡하면 Zustand
- Deployment: Vercel
- Repository: GitHub
- OS: Windows 11 (PowerShell 사용, Bash 금지)
```

## 📁 폴더 구조 및 역할

```
worktool/
├── app/[locale]/                  # i18n 라우팅 루트
│   ├── layout.tsx                 # 공통 레이아웃 (Header/Footer)
│   ├── page.tsx                   # 랜딩 페이지 (도구 목록)
│   └── electric-calc/             # 도구 1: 산업용 전기 계산기
│       ├── layout.tsx             # 전기 계산기 허브 레이아웃
│       ├── page.tsx               # 전기 계산기 메인 (서브 도구 목록)
│       ├── wire-size/page.tsx     # 전선 굵기 계산
│       ├── breaker/page.tsx       # 차단기 용량 계산
│       └── voltage-drop/page.tsx  # 전압강하 계산
│
├── components/
│   ├── ui/                        # shadcn/ui 컴포넌트 (수정 최소화)
│   ├── layout/                    # Header, Footer, LanguageSwitcher 등
│   └── tools/
│       └── electric-calc/         # 전기 계산기 UI 컴포넌트
│
├── lib/
│   ├── calculations/electric/     # 계산 로직 (순수 함수, UI와 분리)
│   │   ├── wireSize.ts
│   │   ├── breaker.ts
│   │   └── voltageDrop.ts
│   ├── constants/electric/        # KS 표준 상수
│   │   └── ksStandard.ts
│   └── utils/                     # 공통 유틸
│
├── messages/                      # 번역 파일 (4로케일)
│   ├── ko.json
│   ├── en.json
│   ├── zh.json                    # 중국어 간체 (i18n.ts 가 en base deep merge)
│   └── vi.json                    # 베트남어 (en base deep merge)
│
├── docs/                          # 도구별 설계 문서
│   └── electric-calc.md
│
└── i18n.ts                        # next-intl 설정
```

## 🔧 도구 추가 시 표준 워크플로우

새 도구를 추가할 때는 **반드시 이 순서**로 진행:

1. **`docs/[tool-name].md` 작성** - 계산 공식, KS 표준 출처, 입출력 명세
2. **`lib/constants/`에 상수 추가** - 표준 테이블, 계수 등
3. **`lib/calculations/`에 순수 함수 작성** - UI 없는 계산 로직만
4. **테스트 작성** - 계산 함수 단위 테스트 (KS 표준 예제 기반)
5. **`components/tools/`에 UI 컴포넌트 작성** - 계산 함수 import만
6. **`app/[locale]/.../page.tsx` 작성** - SEO metadata + 컴포넌트 배치
7. **`messages/ko.json`, `messages/en.json`에 번역 추가**
8. **루트 page.tsx 도구 목록에 추가**
9. **sitemap 자동 업데이트 확인**

## ⚠️ 절대 규칙 (DOCTRINE)

### 코드 스타일
- TypeScript `any` 타입 **절대 금지**. `unknown` + 타입 가드 사용
- 함수 200줄 초과 시 분리
- 3단계 이상 중첩 금지. Early return 사용
- `// ...rest` 같은 생략 금지. 모든 코드 완전히 작성
- 모든 외부 텍스트는 `messages/*.json`에 정의 (하드코딩 금지)

### 비즈니스 로직
- 계산 함수는 **반드시 순수 함수**로 작성 (부수효과 X)
- UI 컴포넌트에서 직접 계산 금지. `lib/calculations/`에서 import
- 모든 계산은 KS 표준 출처 명시
- 입력값 검증은 Zod 스키마로 통일

### SEO
- 모든 도구 페이지는 `generateMetadata` 필수
- title, description, openGraph, alternates(hreflang) 모두 작성
- URL은 케밥 케이스 (`/electric-calc/wire-size`)
- h1은 페이지당 1개, 키워드 포함

### 🚦 AdSense 가치 게이트 (하드 룰 — "가치 없는 콘텐츠" 재거절 방지)
> 상세·정책 출처: [`docs/adsense-compliance.md`](./docs/adsense-compliance.md).
> AdSense는 사이트를 **통째로** 평가한다. thin 페이지 1개 = 사이트 전체의 부채.

- **인덱스되는 도구 페이지 = `ToolGuide`(또는 동등한 고유 본문 ≥600~800자) 필수.**
  form+결과만 있는 계산기는 "가치 없는 콘텐츠" → 사이트 전체를 끌어내린다.
- **ToolGuide 못 채우면 출시 금지, 또는 `robots: { index: false }` noindex.**
- **페이지 양산 금지** — 템플릿에 숫자만 바꾼 유사 페이지 다수 = scaled content 위반.
  자동화·템플릿은 OK, 단 각 페이지에 그 도구만의 고유 설명·예시·맥락이 있어야.
- **허브(`/tools`·`/games`·`/tests`)는 카드 나열만 X** — 자체 설명 본문 포함(doorway 회피).
- **신규 도구 = ToolGuide 동반 출시 기본.** `node scripts/audit.mjs` [H.AdSense]가
  ToolGuide 없는 도구 페이지를 자동 경고 → 뜨면 보강 후 출시.

#### Google 공식 "Site Approvals" 6편 거절사유 (2026-06-25 자막 분석 반영)
> 정본 체크리스트: [`docs/adsense-compliance.md`](./docs/adsense-compliance.md) ⭐ 섹션.
- **"준비 중 / coming soon / 공사 중 / `available: false`" UI 절대 금지** (거절사유 #3·#6 = 미완성/무콘텐츠 신호).
  미구현 기능은 UI에서 **완전 제거** — 빈 약속 카드 X. `audit.mjs` [I.공식정책]이 자동 검출.
- **광고 코드(`AdSenseScript`) 항상 유지** — `<head>`에 ca-pub 코드 없으면 거절(#6). 제거 금지.
- **중복·유사 본문 금지** (#4) — 긴 단락 반복·동일 글 복수 버전·각 페이지 고유 가치.
- **내비 링크는 실제 콘텐츠로** (영상 5) — 죽은/기만 링크 금지(electric-calc 버그 재발 방지).
- **가짜 트래픽 금지** (#2) — 봇·자동클릭·인센티브 유입 = 즉시 거절. 배포 유입은 진짜 사용자만.
- **품질 > 양** (영상 4) — 적은 고품질 페이지가 많은 저품질보다 낫다.
- **자동생성 near-duplicate 색인 금지 (사례, 2026-07-09)**: `salary/[amount]` 47개는 `getSalaryCommentary` 6구간 텍스트만 반복(8개씩 near-dup) → AdSense "가치 없는 콘텐츠"(사이트 전체 판정) → `robots:{index:false,follow:true}` noindex 처리(계산기 insurance-calc 가 색인 본체, salary 는 링크만 전달). `generateStaticParams` 대량 페이지는 각 페이지 고유 가치 없으면 noindex.

### i18n (4로케일 ko/en/zh/vi — 2026-07-09 확장)
- 한국어가 기본 언어 (`/ko/...`). **로케일 4개: ko(기본)·en·zh(중국어 간체)·vi(베트남어)**
- en/zh/vi 는 한국 KS/실무 기준을 각 언어로 설명. 글로벌 표준(IEC/NEC) 아닌 **한국 기준만**.
- **zh/vi 는 부분번역 로케일** — `i18n.ts` 가 en base deep merge(미번역 키=en 자동 폴백). 색인은 `lib/zhReady.ts`·`lib/viReady.ts` 의 완역 경로만(sitemap/hreflang/robots 3곳 게이트). **반쪽 번역 페이지 색인 금지**(=/en 중복콘텐츠, AdSense 부채).
- 도구/UI 텍스트는 `messages/{ko,en,zh,vi}.json`. **4개 키 대칭 필수**(하나라도 키 누락 시 런타임 폴백/NPE).
- **★신규 페이지는 4로케일 정합 필수** — `isKo ? ko : en` 2분기 금지. `localeKey`(`locale === "zh" ? "zh" : ...`) 또는 `COPY[locale]` 로 zh/vi 케이스 포함. **계산기 하단 ToolGuide/ResultShell/OfferSlot/CrossLinks 에 locale 전달 시 collapse(`=== "zh" ? "en"`, `localeKey` 가 zh→en) 금지** — 좁히면 zh 가이드가 en 으로 표시된다(tsc 통과해도 런타임 결함 → 라이브 검증 필수). 공유 컴포넌트 prop 은 `"ko"|"en"|"zh"|"vi"` 로 확장돼 있음.

### 🔗 K-생태계 크로스링크 + 피드백 (2026-07-09)
- Workmate = **"한국 생활 원스톱 K-생태계"**(한국 실무 툴 → 생활상식 blog/guide → 한국어 학습 Loopla → 게임). 계산기는 툴↔툴(`messages toolGuides.related` = ToolGuide 렌더) 외에 **학습/생활글 크로스링크**로 4콘텐츠를 잇는다.
- `lib/crossLinks.ts`(툴키→{learn, reads}) + `components/tools/CrossLinks.tsx`(learn 카드 4로케일 + reads blog/guide ko/en) → `ToolGuide.tsx` 한 곳에 통합(71 계산기 자동 반영). **신규 계산기 = crossLinks 관련성 검토**(실제 관련만, 억지 링크 금지). learn=true 는 한글·한국생활 툴(한국어 학습 유도).
- `app/[locale]/learn/page.tsx` = Loopla 진입점, `COPY[locale]` 4로케일(zh/vi=중국어/베트남어로 한국어 학습).
- **문의·피드백** = `components/feedback/FeedbackForm.tsx`(유형+내용+선택이메일, 4로케일, Web3Forms 서버리스 전송 + `NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY` 미설정 시 mailto 폴백, honeypot) → `/contact`. 공개 게시판(투표형)은 필요 시 Supabase 확장.

### Git 커밋 메시지
- 한국어로 작성
- 형식: `[도구명] 작업 내용 요약`
- 예: `[electric-calc] 전선 굵기 계산기 MVP 구현`

## 🚀 PowerShell 개발 명령어

```powershell
# 패키지 설치
npm install

# 개발 서버
npm run dev

# 빌드
npm run build

# 린트
npm run lint

# 타입 체크
npm run type-check

# 모든 검증 한번에 (type-check + lint + vitest)
npm run check

# 시스템 정합성 audit (CLAUDE.md / env / 시크릿 / 카탈로그 / SEO)
node scripts/audit.mjs
```

## 🔍 자동 검증 도구 (`scripts/`)
| 도구 | 역할 |
|---|---|
| `scripts/audit.mjs` | CLAUDE.md/env/시크릿 누출/projectsCatalog/i18n/SEO 정합성 |
| `npm run check` | type-check + lint + vitest 통합 |

## 📚 사고 학습 (재발 방지)
- **메이커 허브 카탈로그**: `lib/projectsCatalog.ts` 가 단일 진실원. 외부 URL 변경 시 즉시 동기화 (안 하면 카드 링크 깨짐)
- **계산 함수 순수성**: `lib/calculations/` 안에 `process.env` 또는 `fetch` 호출 시 SSR 깨짐. 순수 함수 강제
- **i18n 키 누락**: `ko.json` / `en.json` 키 개수 다르면 빌드 통과해도 런타임 NPE
- **SEO metadata 누락**: `generateMetadata` 없으면 검색엔진 노출 0
- **정적 SPA 임베드 3함정** (public/loopla·향후 게임 자사 서빙): ①Next.js 는 `public/x/index.html` 을 `/x/` 디렉토리 URL 로 자동 서빙 안 함 → `afterFiles` rewrite 로 `/x/:path+`→`/x/:path+/index.html` ②트래일링슬래시 불일치 → `skipTrailingSlashRedirect:true` ③서브앱 루트 `redirect()` 가 basePath 무시 → next.config redirect 로 locale 진입점 직행. 상세 [`docs/loopla-integration.md`](./docs/loopla-integration.md)

## 📋 작업 시작 전 체크리스트

Claude Code는 작업 시작 전 반드시 확인:

- [ ] 이 CLAUDE.md를 읽었는가?
- [ ] `docs/[tool-name].md`에 설계 문서가 있는가?
- [ ] 영향 범위를 grep으로 확인했는가?
- [ ] 기존 코드 스타일을 파악했는가?
- [ ] PowerShell 명령어를 사용하는가? (Bash 금지)

## 📌 도구 로드맵 (요약)

| Phase | 상태 | 비고 |
|---|---|---|
| Phase 1: 산업용 전기 계산기 MVP | ✅ 완료 | wire-size · breaker · voltage-drop |
| Phase 2: 도구 23개 확장 | ✅ 완료 | 33개 도구 (목표 초과) + 블로그 3편 |
| **Phase 3: 트래픽 + 수익화 (현재)** | 🔄 진행 중 | AdSense 1차 거절 → 보강 → 2차 재신청 대기 |
| Phase 4: 1k DAU 도달 | ⏳ 미시작 | AdSense 통과 후 |

**상세 진행 상황·다음 액션은 [`PROJECT_STATUS.md`](./PROJECT_STATUS.md) · [`TASKS.md`](./TASKS.md) 참조.**

## 🎨 디자인 원칙

- **모바일 우선**: 현장에서 폰으로 쓰는 경우 많음
- **계산 과정 표시**: SEO + 교육 효과
- **출처 명시**: KS C IEC 60364, KS C 8431 등 명시
- **결과 공유 카드**: Wordle식 이모지 타일 + 수치 원탭 공유 (카톡·커뮤니티 유입 루프). ※PDF/인쇄 export 는 사용자 결정으로 미지원 — 되살리지 말 것
- **광고 위치**: 결과 하단 (사용자 경험 우선)

### 🕹️ 다크 아케이드 퍼즐 디자인 시스템 (2026-07-11 — 전 페이지 톤 기준)
> 글로벌 CLAUDE.md "🎨 디자인 언어" 의 Workmate 구현체. **신규·수정 페이지는 이 톤이 기본.**
> 다크 배경(실무 신뢰) + 캐주얼 퍼즐게임 요소(놀이·공유). 실무 정확성/AdSense 가치는 그대로 유지.

- **토큰·유틸 단일 진실원 = [`app/globals.css`](./app/globals.css)**. 게임 톤은 유틸로만 확장(페이지에 인라인 재현 금지):
  - `arcade-card` — 통통 라운드(20px+) + 하드 섀도우 + 두꺼운 테두리. 결과·핵심 카드용.
  - `arcade-tile` — 수치 한 자리를 담는 퍼즐 블록 타일. 결과 숫자 리빌에 사용.
  - `game-badge` — 성취 배지 칩(실수령률·등급 등). tone(success/warning/accent) 변형.
  - 리빌 애니메이션 `animate-tile-pop`(순차 등장)·`animate-pop-in`(카드 튀어오름) — **반드시 `prefers-reduced-motion` 에서 무효화**.
- **결과 컴포넌트 = [`components/ui/calc-form.tsx`](./components/ui/calc-form.tsx) 공통(`HeroResult`/`Stat`/`ResultShell`)**. 여기 톤을 바꾸면 다수 계산기 자동 반영 → 개별 폼에서 결과 카드 재발명 금지.
- **공유 = `components/ui/ShareResultCard.tsx` + `lib/share/emojiBar.ts`**. 결과 = Wordle식 이모지 바 + 수치 + URL 텍스트. 기존 `ShareButton`(Web Share+클립보드)·[`lib/og/toolCard.tsx`](./lib/og/toolCard.tsx)(OG 이미지) 재사용.
- **4로케일 대칭** — 게임 톤 신규 문구도 ko/en/zh/vi 4키 대칭(기존 i18n 규칙 그대로).
- **AdSense 무저촉** — 게임 톤은 **시각 레이어일 뿐**. ToolGuide 본문·출처·가치 게이트 유지, 리빌 애니메이션이 콘텐츠를 가리거나 CLS 유발 금지.

## ⛔ 완료 게이트 — 브라우저 전수검사 (예외 없음)

> **빌드 통과 / 타입체크 / 단위테스트 / 200 / i18n 정합 = '완료' 아님.**

페이지·컴포넌트·레이아웃·스타일·신규 도구를 만들거나 고친 세션은 **'완료' 보고 직전**
마지막 단계로 **반드시** `minerva-web-qa` 브라우저 전수검사를 **자동 실행**한다
(사용자가 따로 요청하기 전에). 검사 필수 항목:

- 헤더/본문/푸터 구조 일관성 · 레이아웃 합리성
- 반응형 (모바일 375 + 데스크탑 1280)
- i18n (ko/en) 렌더 · 원시 키/빈 섹션 노출 0
- 콘솔/네트워크 에러 0 · hydration 경고 0
- 인터랙션 (폼·버튼·내비·언어전환)

발견 이슈는 수정 → 재검증 → 그 다음에야 '완료' 선언·배포.
(백엔드/계산 로직만 수정한 경우는 빌드+vitest 로 대체 가능.)
※ 2026-06-07 위반: WaveA/B 후 브라우저 QA 누락하고 '완료' 보고 → `/en/school-grade` UI 결함 잔존.

## 🔐 보안/배포

- 시크릿/API 키 하드코딩 금지 → `.env.local` + Vercel 환경 변수
- 마스터 승인 없이 프로덕션 배포 금지

### ⚠️ 배포 절차 — git push ≠ 프로덕션 반영 (2026-06-15 사고학습)
`git push origin main` 은 **GitHub 저장일 뿐, workmate.tools 에 자동 반영되지 않는다.**
Vercel 이 빌드는 하지만 커스텀 도메인 alias 가 옛 배포에 고정돼 있어, 별도 단계 없이는
변경이 라이브되지 않는다 (이 사실을 몰라 "배포 완료" 오보가 한 세션 내내 반복됨).

**프로덕션 반영 정확한 3단계** (인증: `npx vercel whoami` = h2techjun):
```bash
npx vercel --prod --yes                                                    # ① 프로덕션 빌드·배포
npx vercel alias set <deployment-url> workmate.tools                       # ② apex 도메인 연결
npx vercel alias set <deployment-url> www.workmate.tools                   # ③ www 도메인 연결
```
검증: `https://workmate.tools/<신규경로>` 가 200 인지 확인 (404 면 alias 누락).
**+ ads.txt 회귀 체크**: `curl -sI https://www.workmate.tools/ads.txt` 가 **200** 이어야 함
(308 이면 next.config www→apex lookahead 예외 회귀 = AdSense "찾을 수 없음" 간헐 재발. apex만 보지 말 것 — 크롤러는 www도 본다. 사고학습 2026-07-06).
배포 후 IndexNow 색인: `$env:INDEXNOW_KEY=(irm https://workmate.tools/indexnow-key); node tool/submit_indexnow.mjs --new`

## 💬 Claude Code 커뮤니케이션 규칙

- 모든 응답은 **한국어**
- 코드 변수/함수명은 영어
- 완료 시에만 보고. 중간 보고 금지 — 단 **웹 작업은 위 '완료 게이트'(브라우저 전수검사) 통과 후에만 '완료'**
- 2회 연속 실패 시: 멈추고 → 새 가설 2개 → 검증 → 재시도
- 요청 범위 밖 리팩터링 금지
