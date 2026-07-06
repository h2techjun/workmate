# Loopla 학습앱 통합 (정적 임베드)

> 2026-07-06. vibe-english(Loopla) SRS 학습앱을 workmate.tools 도메인에 통합.
> 목적: 트래픽·SEO·도메인 권위·AdSense 수익화를 자사 도메인에 통합(github.io 분산 해소).

## 왜 소스 병합이 아니라 정적 임베드인가

두 앱의 코어 메이저 버전이 충돌한다 — 소스 병합은 위험:

| 라이브러리 | vibe-english | worktool |
|---|---|---|
| next | 16.2.x | 15.1.x |
| next-intl | 4.x | 3.x |
| lucide-react | 1.x | 0.469 |
| dexie·ts-fsrs·serwist | 사용 | 없음 |

worktool 을 Next 16 + next-intl 4 로 올리면 71개 도구 + 3로케일 전체가 회귀 대상 →
**AdSense 심사 중 코어 업그레이드는 금지**. vibe 는 `output: export`(정적 빌드)라 정적
임베드로 버전 충돌 없이 자사 도메인 서빙이 가능하다.

## 아키텍처

```
11_english/ (별도 repo, 빌드 소스)      →  npm run build (basePath=/loopla)
  src/features/cards/data/*.ts  (3,400+ 카드)
  output: export → out/

worktool/public/loopla/          ←  영어 빌드(Loopla English)  = /loopla/
worktool/public/loopla/korean/   ←  한국어 빌드(Loopla Korean) = /loopla/korean/
```

- **URL 매핑** (타겟 정합):
  - `/loopla/` → `/loopla/ko/` : Loopla English(영어 학습, 한국인 대상, ko UI)
  - `/loopla/korean/` → `/loopla/korean/en/` : Loopla Korean(한국어 학습, 외국인 대상, en UI)
- **진입점**: `/learn` 페이지 카드 → 로케일별 앱 (`projectsCatalog.ts` subpathByLocale).
  ko 방문자=영어학습, en·vi 방문자=한국어학습.

## 통합 시 넘은 함정 3가지 (next.config.ts)

1. **디렉토리 인덱스 미서빙** — Next.js 는 `public/loopla/index.html` 을 `/loopla/`
   같은 디렉토리 URL 로 자동 서빙하지 않는다(k-poker 가 external URL 로 우회한 이유).
   → `afterFiles` rewrite 로 `/loopla/:path+` → `/loopla/:path+/index.html` 매핑.
   실제 파일(_next 자산)은 afterFiles 라 항상 우선.
2. **trailingSlash 불일치** — vibe 는 `trailingSlash:true`(디렉토리/index.html), worktool
   은 false. `/loopla/` → `/loopla` 308 정규화가 인덱스 매핑을 깨뜨림.
   → `skipTrailingSlashRedirect: true` 로 자동 정규화 차단.
3. **basePath 무시 루트 리다이렉트** — vibe 루트 page 는 `redirect('/${defaultLocale}')`
   인데 static export 라 basePath 가 안 붙어 worktool 홈(/en)으로 튕긴다.
   → next.config redirects 로 `/loopla` → `/loopla/ko/`, `/loopla/korean` →
   `/loopla/korean/en/` 로 직접 보내 그 버그를 우회.

## 재빌드 (카드·앱 갱신 시)

vibe-english 에서 콘텐츠 수정 후:

```powershell
pwsh tool/build-loopla.ps1   # 영어+한국어 빌드 → public/loopla 갱신
# 그다음 worktool 커밋·배포 (CLAUDE.md 배포 3단계)
```

## SEO·색인

- `/learn` 허브(3로케일)가 sitemap 대표 색인. `/loopla/*` 앱은 sitemap 미포함이나
  SSG HTML(title/h1/설명 有)이라 크롤 시 thin 아님.
- robots 는 `/loopla` 차단 안 함(크롤 허용). AdSense 광고는 정적 앱 내부에 미삽입
  (추후 필요 시 vibe 측에서 삽입).

## 원본 유지

11_english 는 **별도 repo 로 계속 유지**(GitHub Pages 배포 `h2techjun.github.io/vibe-english/`
도 병존 가능). worktool 은 정적 산출물(public/loopla)만 커밋 — 소스는 11_english 가 단일 진실원.
