---
name: worktool-shared-browser-env
description: playwright MCP browser tab이 다른 프로세스와 공유되어 예측 불가 네비게이션 발생 — 격리 전략 필수
metadata:
  type: project
---

worktool QA 세션(2026-07-11) 중 playwright MCP 브라우저의 tab 0가 내가 호출하지 않은 URL로
계속 이동하는 현상 발견(다른 백그라운드 프로세스/이전 세션이 같은 브라우저 프로파일을 공유 중으로 추정).
`browser_navigate`/`browser_click` 같은 "현재 탭" 기반 도구는 이 상황에서 신뢰 불가 —
탭 목록이 계속 바뀌고 새로 만든 탭도 다른 액터에 의해 닫히거나 재사용됨.

**Why:** 순차 도구 호출 사이 텀에 다른 액터가 개입해 탭을 재사용/네비게이션 —
`browser_click`으로 받은 ref가 다음 호출 시점엔 이미 다른 페이지에 속하게 되어
"클릭했는데 URL 안 바뀜" 같은 거짓 버그 리포트로 이어질 위험 큼(실제 겪음 — 언어 스위처
오탐, 원인은 아래 [[worktool-preview-server-instability]] 서버 재시작 타이밍이었음).

**How to apply:** 다단계 상호작용 검증(언어 전환, 폼 제출, 아코디언 등)은
`mcp__playwright__browser_run_code`로 **단일 호출 안에서** `page.context().newPage()`로
전용 페이지를 만들어 처리한다. 이렇게 하면 호출 사이 텀이 없어 다른 액터 개입을 원천 차단.
`browser_navigate`/`browser_click`/`browser_snapshot`을 여러 번 나눠 호출하는 방식은
이 프로젝트 환경에서 탭 상태가 안 이어질 수 있으므로 지양.

**추가 (2026-07-11 2차 세션)**: 페이지 수×로케일 수가 큰(예: 22페이지×4로케일=88조합) 정적 검증은
애초에 브라우저를 거치지 말고 **curl 기반**으로 처리하면 경합 자체가 발생하지 않는다 —
HTTP 200 스윕, `<title>`/`<h1>` grep, `MISSING_MESSAGE`/`IntlError`/`NaN`/`undefined` 텍스트 grep,
`robots.txt`(zh/vi 부분번역 게이트) 확인까지 전부 curl+grep으로 수 초 내 완료 가능하고 결과가 안정적.
playwright는 **실제 폼 제출·클릭 등 진짜 인터랙션이 필요한 경우로만 좁혀서** 사용 —
`button[type="submit"]` 셀렉터로 계산기 유형 무관 공통 처리 가능(초기화/공유 버튼과 구분됨).
