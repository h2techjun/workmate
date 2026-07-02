# AI Referral 측정 가이드 (Phase A-3)

> 목적: AX 전략(docs/strategy-global-ax.md P3)의 "AI 인용 → 실제 유입" 효과를 데이터로 검증.
> 측정 기반: 기존 GA4 (`G-SB1N3M6YM1`, components/seo/GoogleAnalytics.tsx — 추가 코드 불필요).

## AI 답변 엔진 referrer 도메인 (2026-07 기준)

| 엔진 | referrer 도메인 |
|---|---|
| ChatGPT | `chatgpt.com`, `chat.openai.com` |
| Perplexity | `perplexity.ai`, `www.perplexity.ai` |
| Claude | `claude.ai` |
| Gemini | `gemini.google.com` |
| Copilot | `copilot.microsoft.com`, `www.bing.com` (Copilot 모드 일부) |
| 기타 | `you.com`, `phind.com`, `kagi.com` |

⚠️ 대부분의 AI 인용 노출은 클릭 없이 소비되고(zero-click), 앱 내 브라우저는 referrer가
비어 direct로 잡히는 경우가 많다 → **여기 잡히는 수치는 하한선**으로 해석할 것.

## GA4에서 보는 법 (월 1회 루틴)

1. GA4 → 탐색(Explore) → 자유 형식 새로 만들기
2. 측정기준: **세션 소스/매체**(session source/medium) + 방문 페이지
3. 필터: 세션 소스가 다음 정규식과 일치
   ```
   chatgpt|openai|perplexity|claude|gemini|copilot|you\.com|phind|kagi
   ```
4. 측정항목: 세션수 · 총 사용자 · 참여 시간
5. 저장 이름: `AI Referrals` (한 번 만들면 재사용)

## 판단 기준 (strategy-global-ax.md KPI 연동)

- **90일 목표**: 측정 체계 가동 + 첫 AI 유입 확인 (0 → 1)
- AI 유입이 잡히기 시작하면: 어떤 페이지가 인용되는지 확인 → 그 페이지 유형(/data, 도구 ToolGuide, 블로그)을 증산
- 6개월+ 판단: AI referral이 유기검색 대비 5%를 넘으면 GEO 투자(llms.txt 확장, 데이터 페이지 증설) 상향

## 인프라 체크리스트 (완료 상태)

- [x] GA4 라이브 (referrer 자동 수집 — 별도 이벤트 불필요)
- [x] `/llms.txt` + `/llms-full.txt` (카탈로그·레지스트리 동적 생성)
- [x] `/data` 신선도 레지스트리 (AI가 인용하기 좋은 "값+근거+날짜" 형식)
- [ ] (마스터, 월 1회) 위 GA4 탐색 보고서 확인 → PROJECT_STATUS에 수치 기록
