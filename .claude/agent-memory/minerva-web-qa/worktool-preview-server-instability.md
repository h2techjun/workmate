---
name: worktool-preview-server-instability
description: production start 서버가 QA 세션 도중 예고 없이 죽는 사례 — 재현 전 curl 헬스체크 먼저
metadata:
  type: project
---

worktool `npm run start`(production) 서버가 QA 세션 진행 중 아무 로그 없이 갑자기 죽어
`net::ERR_CONNECTION_REFUSED`/포트 3000 LISTENING 소켓 소실 상태가 된 사례 확인(2026-07-11).
이 타이밍에 브라우저 상호작용 테스트(언어 스위처 클릭 등)를 하면 클라이언트 라우터 네비게이션이
조용히 실패해 "버튼이 안 먹는다"는 거짓 버그로 오인하기 쉬움 — 실제로는 서버 재시작(`npm run start`
백그라운드 재기동) 후 동일 테스트가 정상 통과함을 확인.

**Why:** [`worktool-preview-build-start`] 메모리가 이미 "dev 서버는 청크 손상"을 경고하지만,
production start 서버도 장시간 세션에서 이유 불명으로 죽을 수 있다는 사실은 신규 발견.
원인 미상(리소스 정리 스크립트, OOM, 수동 kill 등 미확인) — 재발 시 서버 로그(`/tmp/server.log`
또는 최초 실행 터미널) 확인 필요.

**How to apply:** 브라우저 인터랙션 테스트에서 "네비게이션이 안 먹힘"류 이상 징후 발견 시,
바로 코드 버그로 단정하지 말고 먼저 `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/ko`
로 서버 생존을 재확인한다. 죽어있으면 `npm run start`로 재기동 후 동일 테스트 재실행 —
재현 안 되면 서버 불안정이 원인, 코드 수정 불필요.
