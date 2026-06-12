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

| 프로젝트 폴더 | 탭 | 외부 URL |
|---|---|---|
| `D:/02_PROJECT/01_Hakrew/` | 서비스 | hakrew21.github.io/hakrew-web/ |
| `D:/02_PROJECT/03_6Hours/` | 체험 | github.com/h2techjun/6hours |
| `D:/02_PROJECT/04_office-hunter/` | 체험 | github.com/h2techjun/office-hunter |
| `D:/02_PROJECT/08_k-poker/` | 게임 | junhuimine.github.io/k-poker/ |
| `D:/02_PROJECT/defense/` | 게임 | h2techjun.github.io/defense/ |

**제외된 프로젝트** (사용자 결정): doc-translator, 09_jeonju-sangkwon, 02_Trade, 06_strix.

새 프로젝트 추가/제외 변경은 `lib/projectsCatalog.ts` 만 수정 → 나머지(/games·/tests 페이지·sitemap·구조화 데이터) 자동 반영.

## 🏗️ 기술 스택 (절대 변경 금지)

```
- Framework: Next.js 15 (App Router)
- Language: TypeScript (strict mode, any 금지)
- Styling: Tailwind CSS v4 + shadcn/ui
- i18n: next-intl (URL 경로 방식: /ko, /en)
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
├── messages/                      # 번역 파일
│   ├── ko.json
│   └── en.json
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

### i18n
- 한국어가 기본 언어 (`/ko/...`)
- 영문은 한국 KS 표준을 영어로 설명하는 버전
- 글로벌 표준(IEC/NEC)이 아닌 **한국 KS 표준만 다룸**
- 도구 이름/UI 텍스트는 `messages/*.json`에서 관리

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
- **PDF/이미지 다운로드**: 결재용 자료로 활용 가능
- **광고 위치**: 결과 하단 (사용자 경험 우선)

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
- main 브랜치 = 자동 배포
- 작업은 feature 브랜치에서 → PR로 머지

## 💬 Claude Code 커뮤니케이션 규칙

- 모든 응답은 **한국어**
- 코드 변수/함수명은 영어
- 완료 시에만 보고. 중간 보고 금지 — 단 **웹 작업은 위 '완료 게이트'(브라우저 전수검사) 통과 후에만 '완료'**
- 2회 연속 실패 시: 멈추고 → 새 가설 2개 → 검증 → 재시도
- 요청 범위 밖 리팩터링 금지
