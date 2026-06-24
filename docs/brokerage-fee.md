# 부동산 중개수수료(복비) 계산기 — 설계 문서

## 개요

공인중개사법 시행규칙 별표1 (2021.10.19 개정) 기준 법정 상한요율로 매매·전세·월세 중개수수료를 산출하는 도구.

- slug: `brokerage-fee`
- 그룹: `realestate`
- 라우트: `/brokerage-fee`

---

## 법적 근거

- **법령**: 공인중개사법 시행규칙 [별표1] (국토교통부 고시, 2021.10.19 시행)
- **지자체 조례**: 각 시·도 조례로 9억 이상 구간을 세분할 수 있음 (이 계산기는 법정 기준만 다룸)
- **부가가치세**: 중개사무소 일반과세자(연 매출 8천만원 이상)는 중개보수에 VAT 10% 별도 청구 가능

---

## 입력 명세

| 필드 | 타입 | 범위 | 설명 |
|---|---|---|---|
| `transactionType` | enum | `sale` / `jeonse` / `monthly` | 거래유형 |
| `price` | number | 0 ~ 10조 | 매매가 또는 전세 보증금 (원) |
| `monthlyDeposit` | number | 0 ~ 10조 | 월세 보증금 (월세 거래 시) |
| `monthlyRent` | number | 0 ~ 100억 | 월세 (원/월, 월세 거래 시) |
| `includeVat` | boolean | — | 부가가치세 10% 포함 여부 |

---

## 출력 명세

| 필드 | 타입 | 설명 |
|---|---|---|
| `transactionAmount` | number | 최종 거래금액 (월세 환산 후) |
| `monthlyMultiplier` | 70 \| 100 \| null | 월세 환산 승수 |
| `maxRate` | number | 상한요율 (소수점) |
| `rateCap` | number \| null | 한도액 (원, null = 한도 없음) |
| `feeBeforeVat` | number | 중개보수 (VAT 전) |
| `vatAmount` | number | 부가가치세 (includeVat=false 시 0) |
| `totalFee` | number | 최종 중개보수 |
| `cappedByLimit` | boolean | 한도액 적용 여부 |
| `transactionType` | TransactionType | 적용 거래유형 |

---

## 계산 공식

### 1. 거래금액 결정

- **매매·전세**: `transactionAmount = price`
- **월세**:
  ```
  환산액₁ = 보증금 + 월세 × 100
  환산액 = (환산액₁ ≥ 5천만) ? 환산액₁ : 보증금 + 월세 × 70
  ```

### 2. 매매·교환 상한요율

| 거래금액 | 상한요율 | 한도액 |
|---|---|---|
| 5천만원 미만 | 0.6% | 25만원 |
| 5천만~2억 미만 | 0.5% | 80만원 |
| 2억~9억 미만 | 0.4% | 없음 |
| 9억~12억 미만 | 0.5% | 없음 |
| 12억~15억 미만 | 0.6% | 없음 |
| 15억 이상 | 0.7% | 없음 |

### 3. 임대차(전세·월세) 상한요율

| 거래금액 | 상한요율 | 한도액 |
|---|---|---|
| 5천만원 미만 | 0.5% | 20만원 |
| 5천만~1억 미만 | 0.4% | 30만원 |
| 1억~6억 미만 | 0.3% | 없음 |
| 6억~12억 미만 | 0.4% | 없음 |
| 12억~15억 미만 | 0.5% | 없음 |
| 15억 이상 | 0.6% | 없음 |

### 4. 중개보수 계산

```
rawFee = transactionAmount × maxRate
feeBeforeVat = (rateCap ≠ null) ? min(rawFee, rateCap) : rawFee
vatAmount = (includeVat) ? round(feeBeforeVat × 0.1) : 0
totalFee = round(feeBeforeVat) + vatAmount
```

---

## 파일 목록

| 파일 | 역할 |
|---|---|
| `lib/calculations/realestate/brokerageFee.ts` | 순수 계산 함수 + Zod 스키마 + 요율 상수 |
| `lib/calculations/realestate/brokerageFee.test.ts` | 단위 테스트 (21케이스) |
| `components/tools/realestate/BrokerageFeeForm.tsx` | UI 폼 컴포넌트 |
| `app/[locale]/brokerage-fee/page.tsx` | 라우트 페이지 + generateMetadata |
| `docs/brokerage-fee.md` | 이 문서 |
| `tmp/newtool-brokerage-fee.json` | catalog·ToolGuide 통합용 임시 출력 |

---

## 주의 사항

1. 이 계산기의 결과는 **법정 상한**이며 실제 중개보수는 당사자 협의로 더 낮출 수 있음
2. 지자체 조례로 9억 이상 구간이 세분화될 수 있으므로 계약 시 해당 지역 조례 확인 필요
3. 부가가치세는 중개사무소의 과세 여부에 따라 달라짐 (일반과세자 여부 확인)
4. 월세 환산 거래금액 산출 시 승수(×70 or ×100)는 법정 기준이며 2021년 개정으로 정립됨
