# AdSense 준수 가이드 (Workmate)

> **목적**: "가치가 별로 없는 콘텐츠" 거절을 끝내고, 앞으로 페이지를 만들 때
> 처음부터 정책에 맞게 만들기 위한 단일 진실원.
> 출처: Google AdSense 게시자 정책 + Google Search 스팸 정책(2024 개정) 요약.
> 최종 갱신: 2026-06-17.

---

## 0. 진단 — 우리는 왜 거절됐나

거절 사유 = **"가치가 별로 없는 콘텐츠"** (low-value / scaled content).
이건 *특정 페이지* 가 아니라 **사이트 전체 품질 신호**다. Google은 사이트를
통째로 본다.

우리 외국인 도구(세금·연금·비자·전월세)는 ToolGuide + 체크리스트로 본문이
풍부하다 — 문제 없음. **진짜 문제는 본문이 form+결과뿐인 ~25개 thin 도구
페이지**(주로 `timber-calc/*` 15개 + `labor-calc/*` 5개 + vat-calc·json-csv·
foreign-stock-tax·voltage-drop·insurance-calc·compound-calc 등)다.

→ 비슷한 구조의 얇은 페이지가 수십 개 = Google 눈에 **"scaled content"
(대량 생성 저가치)**. 좋은 페이지가 있어도 thin 페이지가 평균을 끌어내려
사이트 전체가 거절된다.

**원칙: thin 페이지 1개는 사이트 전체의 부채다. 가치를 더하거나, 색인에서
빼거나(noindex), 합쳐야 한다.**

---

## 1. 정책 핵심 (5개 + UX)

### ① 가치 없는 콘텐츠 (Low-value content)
- 게시자 콘텐츠가 없거나, **부가 가치 없이 form·데이터·결과만** 있는 화면엔
  광고 불가.
- 광고가 본문보다 많은 화면 불가 (ad:content 비율).
- 미완성·알림·내비게이션 전용 화면 불가.

### ② 스케일드 콘텐츠 남용 (Scaled content abuse — 2024 신설, 우리 핵심 리스크)
- **사용자 가치 없이 대량 생성한 페이지** = 위반. AI 대량 생성, 템플릿에
  숫자만 바꾼 양산 페이지, 약간만 변형(동의어·번역)한 복제.
- **자동화/템플릿 자체는 합법** — *사용자에게 실질 가치를 더하면* OK.
  → 우리 도구가 템플릿인 건 문제 아님. **각 페이지가 고유한 설명·맥락을
    담았는지**가 갈림길.

### ③ 도어웨이 페이지 (Doorway)
- 독립적 가치 없이 다른 페이지로 보내기만 하는 중간 페이지 금지.
- URL만 살짝 바꾼 유사 페이지 다수 금지.
- 허브(`/tools`·`/games`·`/tests`)는 **카드 나열만 하지 말고** 자체 설명·
  맥락을 담아야 doorway 회피.

### ④ thin affiliate / 복제
- 원문(상인 설명·타 사이트)을 고유 가치 없이 복사 = 위반.
- 우리 체크리스트·가이드는 공식 출처를 **재구성한 고유 글** → OK. 단 스크랩처럼
  읽히면 안 됨.

### ⑤ 최소 콘텐츠 요건
- 명시적 단어 수 기준은 없음. 그러나 실무 합격선 = **페이지당 고유 본문
  충분량**(가이드 권장 800~1,500자/단어). 우리 ToolGuide(overview·use-cases·
  how-to·formula·examples·FAQ·cautions)는 이 기준을 넘는다.
- **필수 신뢰 페이지**: About · Privacy · Terms · Contact → 우리 4개 모두 보유 ✓.

### UX (Site behavior)
- 모바일 반응형, 빠른 로딩, 명확한 내비게이션. 텍스트 가독성.
- 색인됨: 신청 전 GSC에 페이지가 색인돼야 평가 가능.

---

## 2. 페이지 Definition of Done — "AdSense-safe" 체크리스트

**인덱스되는 도구/콘텐츠 페이지는 아래를 모두 통과해야 ship.**

- [ ] **고유 본문 ≥ 600~800자** — 계산기면 `ToolGuide`(overview·useCases·howTo·
      formula·examples·faq·cautions) 또는 동등한 설명 콘텐츠 포함.
- [ ] **`generateMetadata`** — title·description·OG·hreflang 완비, 페이지마다 고유.
- [ ] **고유성** — 다른 도구와 본문을 복붙하지 않음. 그 도구만의 설명·예시·주의.
- [ ] **ad:content 비율** — 본문이 광고보다 많음 (결과 하단 1 + 페이지 하단 1 수준 유지).
- [ ] **ko/en 둘 다** 실제 번역 본문 (빈 키·원시 키 0).
- [ ] **모바일 375 + 데스크탑 1280** 렌더 정상, 콘솔 0.
- [ ] **출처/면책** — 세금·법률·의료성 정보는 공식 출처 + 참고용 명시.
- [ ] 위를 못 채우면 → **`robots: { index: false }`** 로 noindex (AdSense 시야에서 제외).

> 한 줄 규칙: **"ToolGuide 없으면 출시 금지(또는 noindex)."**

---

## 3. 즉시 조치 플랜 (거절 해소용)

thin 페이지 ~25개를 둘 중 하나로 처리한다.

**경로 A — 가치 추가 (SEO 유지, 느림)**: 각 thin 페이지에 ToolGuide 본문 추가.
- 우선순위: GSC 노출 있는 것(roof-area 등) → 검색량 큰 것 → 나머지.

**경로 B — noindex (빠름, AdSense 우선)**: thin 페이지를 일단 색인에서 빼
사이트 평균 품질을 올리고 재신청. 이후 가치 추가하며 하나씩 재색인.
```ts
// 각 thin 페이지 generateMetadata 에
return { /* ... */, robots: { index: false, follow: true } };
```

**권장 = 하이브리드**: 지금은 thin 페이지 일괄 noindex(경로 B)로 **빠르게
재신청 통과** → 통과 후 ToolGuide 채우며 재색인(경로 A). 외국인 니치 + 가이드
있는 페이지만 색인된 상태로 신청하면 "고가치 사이트"로 보인다.

> ⚠️ 신청 전 **GSC에서 noindex 반영 확인** + 색인된 페이지가 전부
> ToolGuide 보유 페이지인지 점검.

---

## 4. 자동 게이트

`node scripts/audit.mjs` 의 **[H.AdSense]** 섹션이 ToolGuide 없는 도구 페이지를
자동으로 나열한다. 새 도구를 만들 때 이 목록에 뜨면 = thin = 출시 전 보강 필요.

```bash
node scripts/audit.mjs        # [H.AdSense] thin 페이지 경고 확인
```

---

## 5. 출처
- Google AdSense 게시자 정책 — 가치 없는 콘텐츠 (support.google.com/adsense/answer/10502938)
- Google Search 스팸 정책 — Scaled content abuse / Doorway / Thin affiliation
  (developers.google.com/search/docs/essentials/spam-policies)
- AdSense 자격 요건 — 필수 페이지·고유 콘텐츠·UX
