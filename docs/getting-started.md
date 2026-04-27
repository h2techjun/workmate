# 🚀 시작 가이드 (Windows PowerShell)

> 이 문서는 마스터가 GitHub에 올리고 Vercel에 배포하는 전체 과정을 안내합니다.

---

## 1단계: 의존성 설치 및 로컬 실행

```powershell
# 프로젝트 폴더로 이동
cd C:\path\to\worktool

# 의존성 설치
npm install

# 개발 서버 실행
npm run dev
```

브라우저에서 `http://localhost:3000` 접속 → 자동으로 `/ko`로 리다이렉트되는지 확인.

### 확인 체크리스트
- [ ] `http://localhost:3000` → `/ko`로 자동 이동
- [ ] 랜딩 페이지에 도구 목록 3개 표시
- [ ] "산업용 전기 계산기" 클릭 → 허브 페이지 이동
- [ ] 영어 전환: `http://localhost:3000/en` 접속 → 영문 표시
- [ ] 콘솔 에러 없음

문제 발생 시 → `npm run check`로 타입/린트 에러 확인

---

## 2단계: GitHub 레포지토리 생성

### A. GitHub 웹사이트에서

1. https://github.com/new 접속
2. Repository name: `worktool`
3. Description: `한국 실무자를 위한 무료 온라인 도구 모음`
4. **Public** 선택 (포트폴리오 효과)
5. README, .gitignore, license 추가 안 함 (이미 있음)
6. **Create repository** 클릭

### B. 로컬에서 푸시

```powershell
# 프로젝트 폴더에서
git init
git add .
git commit -m "[init] 프로젝트 초기 설정 - Next.js 15 + i18n + 전기 계산기 스캐폴딩"

# GitHub에서 복사한 명령어 (예시 - 본인 URL로 교체)
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/worktool.git
git push -u origin main
```

---

## 3단계: Vercel 배포 (도메인 구매 전 임시 배포)

도메인 사기 전에 먼저 **Vercel 무료 도메인**으로 작동 확인.

### A. Vercel 회원가입/로그인

1. https://vercel.com 접속
2. **Continue with GitHub** 클릭 (GitHub 계정으로 로그인)

### B. 프로젝트 임포트

1. **Add New > Project** 클릭
2. `worktool` 레포지토리 선택 → **Import**
3. Framework Preset: **Next.js** (자동 감지)
4. 환경 변수 설정 불필요 (이번 단계에서는)
5. **Deploy** 클릭

배포 완료 후 `https://worktool-xxxx.vercel.app` 같은 임시 URL 발급됨.

### C. 임시 URL 확인

- [ ] 한국어 페이지 정상 표시
- [ ] 영어 전환 정상 작동
- [ ] 모바일에서도 확인

---

## 4단계: 도메인 구매 (Vercel에서)

작동 확인 완료 후 도메인 구매.

### A. Vercel에서 도메인 검색

1. Vercel Dashboard → 프로젝트 → **Settings** → **Domains**
2. 검색창에 `worktool` 입력
3. 추천 도메인 확인:
   - `worktool.kr` (한국 .kr - 별도 등록 기관 필요)
   - `worktool.com` (Vercel에서 직접 구매 가능)
   - `worktool.app` (개발자 친화적)
   - `worktool.io` (테크 느낌)

### B. 추천: `worktool.com` (Vercel 직접 구매)

- 가격: 약 $15~20/년
- 결제 시 자동 연결 + SSL 자동 발급
- DNS 설정 자동

### C. `.kr` 도메인을 원한다면

`.kr`은 Vercel에서 직접 못 사요. 별도로:
1. **가비아** (https://www.gabia.com) 또는 **후이즈** (https://www.whois.co.kr)에서 `worktool.kr` 구매 (약 22,000원/년)
2. Vercel Dashboard → Settings → Domains → **Add** → `worktool.kr` 입력
3. Vercel이 안내하는 DNS 설정값(A 레코드 또는 CNAME)을 가비아 DNS 설정에 추가
4. 30분~24시간 후 자동 연결

---

## 5단계: Claude Code로 작업 시작

이제 본격적인 개발은 Claude Code에서 진행합니다.

### A. 프로젝트 폴더에서 Claude Code 실행

```powershell
cd C:\path\to\worktool

# Claude Code 실행 (이미 설치되어 있다고 가정)
claude
```

### B. 첫 작업 지시 예시

```
CLAUDE.md와 docs/electric-calc.md를 먼저 읽어줘.

그 다음 Phase 1 작업을 시작해줘:
1. lib/calculations/electric/wireSize.ts 구현
2. 단위 테스트 작성 (docs의 테스트 케이스 기반)
3. components/tools/electric-calc/WireSizeCalculator.tsx UI 구현
4. app/[locale]/electric-calc/wire-size/page.tsx에 통합

작업 전에 영향 범위를 grep으로 먼저 확인하고,
완료 후 npm run check로 검증해줘.
```

---

## 6단계: SEO 초기 설정 (배포 후)

### A. Google Search Console 등록

1. https://search.google.com/search-console 접속
2. 속성 추가 → **URL 접두어** → `https://worktool.com` (또는 본인 도메인)
3. 소유권 확인:
   - Vercel 사용 시: HTML 태그 방식이 가장 쉬움
   - `<meta name="google-site-verification" content="..." />` 코드 받기
   - `app/[locale]/layout.tsx`의 metadata에 추가
4. 다시 배포 후 인증

### B. sitemap.xml 자동 생성

CLAUDE.md에 명시된 대로 `app/sitemap.ts` 추가하면 자동 생성됨.
(이건 Claude Code가 Phase 1 후 작업)

---

## 📋 요약 체크리스트

- [ ] `npm install` 성공
- [ ] `npm run dev` 로컬 실행 확인
- [ ] GitHub 레포 생성 + 푸시
- [ ] Vercel 임시 배포 성공
- [ ] 임시 URL에서 작동 확인
- [ ] (선택) 도메인 구매 + 연결
- [ ] Claude Code로 Phase 1 작업 시작

---

## 🆘 문제 발생 시

### `npm install` 실패
- Node.js 버전 확인: `node --version` (20 이상 필요)
- 캐시 삭제: `npm cache clean --force` 후 재시도

### 빌드 에러
- `npm run check` 실행해서 어떤 에러인지 확인
- TypeScript 에러는 `any` 사용했는지 먼저 의심

### Vercel 배포 실패
- Build Logs 확인
- 보통 환경 변수 누락 또는 빌드 에러

### i18n 작동 안 함
- `middleware.ts`가 루트에 있는지 확인
- `i18n.ts`가 루트에 있는지 확인
- `next.config.ts`에서 `withNextIntl` 적용했는지 확인
