# Workmate 유통 킷 (Distribution Kit)

> 작성: 2026-07-04. 목적: 마스터가 **복사-붙여넣기만으로** 즉시 게시할 수 있는 채널별 초안.
>
> **왜 Claude가 직접 게시하지 않는가**: 커뮤니티 게시는 실계정(레딧·페이스북·네이버)이
> 필요하고, 외부 공개 게시는 마스터 승인 사안. 대신 기계 채널(IndexNow·RSS·llms.txt·
> sitemap)은 Claude가 자동화했고, 사람 채널은 이 킷으로 시간을 최소화한다.

## 0. 이미 자동화된 유통 (Claude 담당, 완료)

| 채널 | 상태 |
|---|---|
| IndexNow (Bing·Naver 즉시 색인) | 배포 파이프라인에 포함 — 매 배포 후 신규 URL 핑 |
| Google/Naver sitemap | `/sitemap.xml` 자동 (도구 추가 시 자동 반영) |
| AI 답변엔진 (GEO) | `/llms.txt` · `/llms-full.txt` · `/data` 신선도 레지스트리 |
| RSS | `/rss.xml` — 블로그 글 추가 시 자동 갱신 |

## 1. 게시 원칙 (모든 채널 공통)

1. **가치 먼저, 링크는 부록** — 질문에 실제로 답한 뒤 "계산기로 확인해보세요" 한 줄.
2. **각 커뮤니티의 자기홍보 규정을 게시 전에 확인** (레딧은 서브레딧 사이드바,
   페이스북 그룹은 고정 공지). 다수 커뮤니티가 10:1 규칙(홍보 1 : 일반 참여 9)을 쓴다.
3. **같은 글 복붙 금지** — 채널마다 아래 초안을 그대로 쓰되, 반응 오면 댓글로 대응.
4. **광고비·인센티브 유입 금지** — AdSense 심사 중 가짜 트래픽은 즉시 거절 사유.

## 2. 영어 — Reddit

대상 서브레딧(게시 전 각 규칙 확인): r/Living_in_Korea, r/movingtokorea, r/teachinginkorea.
r/korea는 자기홍보에 엄격 — 질문 답변 댓글에서만 링크.

### 초안 A — 전세 보증금 위험 (가장 강한 앵글)

> **Title:** I built a free jeonse deposit risk checker after reading about the deposit fraud wave
>
> Korea's jeonse system asks you to hand a landlord 50–80% of a home's value as a lump-sum
> deposit. After the 2022–2023 fraud wave (billions of KRW lost, foreigners hit hardest
> because the warning signs are all in Korean), I put together a free checker:
>
> - Enter deposit + market price + senior debt → it flags the risk level the way Korean
>   experts do (전세가율 = deposit-to-price ratio, senior liens, insurance eligibility)
> - Explains each red flag in plain English, with the legal basis cited
> - No sign-up, runs in the browser: workmate.tools/en/deposit-risk
>
> Not legal advice — it's the checklist a careful Korean tenant would run before signing.
> Happy to answer questions about how the ratios work.

### 초안 B — 생활비 (r/movingtokorea 용)

> **Title:** Made a Seoul/Korea cost-of-living estimator with ranges instead of single numbers
>
> Most "cost of living in Korea" articles give one number that's wrong for everyone.
> This estimator asks your city, housing type, and lifestyle, then gives a **range**
> (frugal ↔ comfortable) per category — housing, food, transit, phone, insurance.
> Each line says what assumption it's based on, so you can adjust.
>
> workmate.tools/en/cost-of-living — free, no sign-up. Feedback welcome,
> especially from people outside Seoul.

### 초안 C — 단위 가이드 (콘텐츠형, 링크 부담 최소)

> **Title:** Cheat sheet: every Korean unit that confuses foreigners (pyeong, 만 나이, sizes)
>
> - **Pyeong (평)** = 3.3058 m². A "25평" apartment ≈ 82.6 m² ≈ 890 sq ft.
> - **Korean age** was abolished in June 2023 — but 연 나이 still applies to conscription
>   and school years, so you effectively juggle two systems.
> - **Shoe sizes** are in millimeters (US M9 = 270mm).
> - **Apartment ads** quote 공급면적 (includes shared space), not your actual floor area.
>
> Full guide with instant converters: workmate.tools/en/blog/korean-units-numbers-for-foreigners

## 3. 베트남어 — Facebook 그룹

베트남 근로자·유학생 그룹은 페이스북이 압도적. "Người Việt tại Hàn Quốc",
"Du học sinh Hàn Quốc" 등으로 검색해 규모 큰 그룹 2~3곳 가입 후 규정 확인.

### 초안 A — 실수령 월급 (E-9·유학생 공통 관심)

> Mọi người ơi, mình chia sẻ công cụ miễn phí tính **lương thực nhận** ở Hàn Quốc
> (đã trừ 4 loại bảo hiểm + thuế) — có tiếng Việt:
>
> 👉 workmate.tools/vi/net-salary
>
> - Nhập lương năm → ra lương thực nhận hàng tháng
> - Tính theo tỷ lệ bảo hiểm 2026 mới nhất (lương hưu 4,5%, y tế 3,595%...)
> - Không cần đăng ký, dùng ngay trên điện thoại
>
> Ngoài ra còn có máy tính trợ cấp thôi việc (퇴직금), lương tối thiểu, hoàn tiền
> lương hưu khi về nước: workmate.tools/vi/tools

### 초안 B — 전세 위험 (유학생·가족 동반)

> Ai đang tìm nhà kiểu jeonse (전세) ở Hàn nên kiểm tra rủi ro tiền đặt cọc trước khi ký:
>
> 👉 workmate.tools/vi/deposit-risk (có tiếng Việt)
>
> Nhập tiền cọc + giá nhà → công cụ cảnh báo mức rủi ro giống cách chuyên gia Hàn kiểm tra
> (tỷ lệ cọc/giá, thế chấp trước, điều kiện bảo hiểm cọc). Miễn phí, không cần đăng ký.

## 4. 한국어 — 네이버 카페·커뮤니티

직접 홍보글은 대부분 금지 → **질문 답변에서 자연스럽게** 이 링크가 정답일 때만.
효과적인 순서: ① 지식iN 세금·노무 질문 답변 ② 자영업·프리랜서 카페의 부가세/종소세 시즌 질문.

### 초안 (질문 답변용 꼬리)

> 계산 과정을 직접 확인하고 싶으시면 무료 계산기가 있습니다:
> workmate.tools/ko/income-tax (2026 세율표·누진공제 출처 명시, 가입 없음)

## 5. 개발자 채널 (트래픽보다 백링크 가치)

- **Hacker News (Show HN)**: "Show HN: Source-cited calculators for Korean standards
  (tax, jeonse, KEC wiring)" — /data 신선도 레지스트리와 llms.txt 얘기가 HN 취향.
  게시 시간은 평일 미국 동부 오전이 유리.
- **GitHub README** (h2techjun 프로필): workmate.tools 링크 한 줄.

## 6. 마스터 전용 (Claude가 할 수 없는 것)

| 작업 | 위치 | 비고 |
|---|---|---|
| Google Search Console 색인 요청 | search.google.com/search-console | URL 검사 → 색인 생성 요청 (신규 페이지) |
| Naver Search Advisor 수집 요청 | searchadvisor.naver.com | 웹마스터 도구 → 수집 요청 |
| AdSense 재신청 | adsense.google.com | 보강 완료 후 마스터 판단 |
| 위 커뮤니티 게시 | 각 채널 | 이 킷 복붙 |
