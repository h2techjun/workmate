# Workmate

> 한국 실무자가 매일 쓰는 도구·계산기 + 메이커 프로젝트 허브

[workmate.tools](https://workmate.tools)

## 무엇을 하는 사이트인가요?

크게 세 부분입니다.

**1. 도구·계산기 (16개 + 47개 SEO 페이지)**
- **전기**: 전선 굵기 (KEC 232.5) · 차단기 용량 · 전압강하
- **목조 시공**: 부재 경간 · 단열 R/U값 · 자재 수량 · 계단 · 서까래 · 지붕 경사·면적 · 콘크리트 부피 · 목재 환산
- **재무**: 4대보험 (2026 요율) · 해외주식 양도세 (22%)
- **유틸**: JSON ↔ CSV 변환 (한글 BOM)
- **사업자**: 사업자등록번호 체크섬 검증

모든 결과는 **계산 과정을 단계별로** 보여주고, 출처(KS·KEC·내선규정·건축법)를 함께 표기합니다.

**2. 가이드 블로그 (5편 + 추가 예정)**
KEC 232.5 현장 가이드, 단열 통과 조합, 4대보험 분해, 부재 경간 함정, 사업자등록번호 검증 — 매일 1편씩 늘려갑니다.

**3. 메이커 프로젝트 허브 (예정)**
운영자의 다른 프로젝트(K-Poker · Defense · Hakrew · doc-translator 등)를 한 곳에 모아 트래픽을 분배하고 메이커 노트를 공유합니다.

## 운영 철학

- **계산은 브라우저에서만** — 서버 전송 없음. 오프라인 동작.
- **결과는 항상 참고용** — 시공·신고 전 전문가 검토 필수.
- **AI 콘텐츠 회피** — 가이드는 1인칭 + 구체 사례 + 솔직한 한계 인정으로 작성.

## 기술 스택

- Next.js 15 (App Router) · TypeScript · Tailwind v4
- next-intl (한·영 i18n)
- React Hook Form + Zod
- Vitest (160 단위 테스트)
- Vercel 배포

## 로컬 개발

```bash
npm install
npm run dev      # http://localhost:3000
npm run test     # 단위 테스트
npm run build    # 프로덕션 빌드 (94+ 정적 페이지)
```

## 환경변수

```bash
# 공개(브라우저 노출) — NEXT_PUBLIC_ 접두사
NEXT_PUBLIC_SITE_URL=https://workmate.tools

# 서버 전용 시크릿 — 접두사 없이. API route/스크립트에서만 읽음
DATABASE_URL=postgres://...        # Neon Postgres (명소 댓글/반응). Vercel Neon Integration 시 자동 주입
TOURAPI_SERVICE_KEY=...            # 한국관광공사 TourAPI (명소 데이터 파이프라인, 공공데이터포털 발급)
IP_HASH_SALT=...                   # (선택) 댓글 IP 해시 솔트. 미설정 시 기본값 사용
```

> 명소 댓글 DB 초기화: `DATABASE_URL` 설정 후 `node scripts/db/migrate.mjs` (idempotent).

## 디렉토리

```
workmate/
├── app/[locale]/         # i18n 라우팅 + 도구 페이지
├── components/
│   ├── tools/            # 도구별 폼 (전기·목조·재무·유틸·사업자)
│   ├── ui/calc-form.tsx  # 공통 폼 primitives
│   └── seo/              # JSON-LD 구조화 데이터
├── lib/
│   ├── calculations/     # 순수 함수 (테스트 포함)
│   ├── constants/        # KS 표준 상수
│   ├── hooks/            # URL 동기화 등
│   └── siteConfig.ts     # 도메인·브랜드 단일 진실원
├── messages/             # ko.json / en.json
└── docs/                 # 도구 설계 문서
```

## 라이선스

MIT
