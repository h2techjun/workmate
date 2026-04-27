# WorkTool

> 한국 실무자를 위한 무료 온라인 도구 모음

## 🎯 소개

WorkTool은 한국의 전기공사기사, 제조업 종사자, 사업자, 개발자 등이 매일 사용하는 계산과 변환 작업을 무료로 제공하는 도구 모음 사이트입니다.

모든 도구는:
- ✅ **무료** - 가입 없이 즉시 사용
- ✅ **정확** - KS 표준 기반 + 출처 명시
- ✅ **빠름** - 클라이언트 사이드 계산
- ✅ **한/영 지원** - 한국 표준을 영어로도 제공

## 🛠️ 도구 목록

### 산업용 전기 계산기 (Phase 1)
- 전선 굵기 계산 (KS C IEC 60364 기준)
- 차단기 용량 계산
- 전압강하 계산

### 예정 (Phase 2)
- 사업자등록번호 진위 확인
- 한글 → 영문 주소 변환
- MSDS(물질안전보건자료) 검색
- 4대보험 계산기
- 해외주식 양도소득세 계산
- JSON ↔ CSV 변환 (한국어 인코딩 지원)

## 🏗️ 기술 스택

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 + shadcn/ui
- **i18n**: next-intl
- **Deployment**: Vercel

## 🚀 로컬 개발 (Windows PowerShell)

```powershell
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 브라우저에서 열기
# http://localhost:3000
```

## 📁 프로젝트 구조

```
worktool/
├── app/[locale]/          # i18n 라우팅
├── components/            # UI 컴포넌트
├── lib/
│   ├── calculations/      # 계산 로직 (순수 함수)
│   └── constants/         # KS 표준 상수
├── messages/              # 번역 파일 (ko, en)
└── docs/                  # 도구별 설계 문서
```

자세한 개발 가이드는 [CLAUDE.md](./CLAUDE.md) 참고

## 📜 라이선스

MIT

## 🤝 기여

이슈 및 PR 환영합니다.
