/**
 * 한국 변동 수치 신선도 레지스트리 — /data 페이지·llms.txt·audit의 단일 진실원.
 *
 * 원칙:
 *  1. 계산기가 실제로 쓰는 상수를 **import**해서 표시한다 (드리프트 0).
 *     이 파일에 숫자를 복사하지 말 것 — 항상 lib/constants·calculations에서 가져온다.
 *  2. 모든 항목에 근거(법령·고시·결정기구)와 적용기간, lastVerified(최종 검증일)를 단다.
 *  3. lastVerified가 오래되면 scripts/audit.mjs [J.데이터신선도]가 경고한다.
 *  4. 경험칙(convention)은 법정 수치와 명확히 구분해 표기한다.
 *
 * 실증: 2026-07-03 이 레지스트리를 처음 구축하는 과정에서 stale 3건을 실제로
 *       발견·수정했다 (최저임금 2026 = 10,320 / 국민연금 상·하한 659만·41만 /
 *       실업급여 상·하한 68,100·66,048). 이 페이지의 존재 이유다.
 */

import {
  BOK_BASE_RATE,
  LEGAL_CONVERSION_RATE,
} from "@/lib/constants/realestate/jeonseRate";
import {
  MIN_WAGE_2025,
  MIN_WAGE_2026,
  STANDARD_MONTHLY_WORK_HOURS,
  VAT_RATE,
} from "@/lib/constants/labor/laborStandard";
import {
  EMPLOYMENT_INSURANCE,
  HEALTH_INSURANCE,
  INDUSTRIAL_ACCIDENT,
  LONG_TERM_CARE,
  NATIONAL_PENSION,
} from "@/lib/constants/insurance/rates2026";
import {
  DAILY_BENEFIT_CAP,
  DAILY_BENEFIT_FLOOR,
} from "@/lib/calculations/labor/unemploymentBenefit";
import {
  RATIO_CAUTION_MAX,
  RATIO_DANGER_MAX,
  RATIO_SAFE_MAX,
} from "@/lib/constants/realestate/depositRisk";

export type RegistryCategory =
  | "realestate"
  | "labor"
  | "insurance"
  | "tax"
  | "convention";

export type RegistryKind = "statutory" | "official" | "convention";

export interface DataRegistryEntry {
  key: string;
  category: RegistryCategory;
  /** statutory=법령 고정, official=기관 고시·결정(주기 변동), convention=경험칙 */
  kind: RegistryKind;
  nameKo: string;
  nameEn: string;
  nameVi: string;
  /** 표시 값 (실제 상수에서 파생) */
  valueKo: string;
  valueEn: string;
  valueVi: string;
  /** 근거 법령·고시·결정 */
  basisKo: string;
  basisEn: string;
  basisVi: string;
  /** 적용 기간 또는 시행일 */
  effectiveKo: string;
  effectiveEn: string;
  effectiveVi: string;
  /** 최종 검증일 YYYY-MM-DD — audit [J]가 만료 검사 */
  lastVerified: string;
  /** 이 수치를 쓰는 도구 경로 (locale prefix 제외) */
  tools: readonly string[];
}

const pct = (r: number, digits = 2): string => {
  const s = (r * 100).toFixed(digits);
  // trailing zero 제거는 소수부가 있을 때만 (정수 "10"이 "1"로 깎이는 버그 방지)
  const trimmed = s.includes(".") ? s.replace(/0+$/, "").replace(/\.$/, "") : s;
  return `${trimmed}%`;
};
const krw = (n: number): string => new Intl.NumberFormat("ko-KR").format(n);

export const DATA_REGISTRY: readonly DataRegistryEntry[] = [
  // ── 부동산 · 금리 ─────────────────────────────────────────────────────────
  {
    key: "bok-base-rate",
    category: "realestate",
    kind: "official",
    nameKo: "한국은행 기준금리",
    nameEn: "BOK base rate",
    nameVi: "Lãi suất cơ bản (BOK)",
    valueKo: `연 ${pct(BOK_BASE_RATE)}`,
    valueEn: `${pct(BOK_BASE_RATE)} p.a.`,
    valueVi: `${pct(BOK_BASE_RATE)}/năm`,
    basisKo: "한국은행 금융통화위원회 (2026-05-28 8연속 동결, 차기 2026-07-16)",
    basisEn: "Bank of Korea MPC (held 8th time on 2026-05-28; next 2026-07-16)",
    basisVi: "Ủy ban Chính sách tiền tệ Ngân hàng TW Hàn Quốc (giữ nguyên lần 8 ngày 2026-05-28; kỳ tới 2026-07-16)",
    effectiveKo: "2025-05-29 인하 후 유지",
    effectiveEn: "Since cut of 2025-05-29",
    effectiveVi: "Duy trì từ lần giảm 2025-05-29",
    lastVerified: "2026-07-03",
    tools: ["/jeonse-wolse"],
  },
  {
    key: "jeonse-conversion-cap",
    category: "realestate",
    kind: "statutory",
    nameKo: "전월세전환율 법정 상한",
    nameEn: "Jeonse→wolse conversion cap",
    nameVi: "Trần tỷ lệ chuyển đổi jeonse→wolse",
    valueKo: `연 ${pct(LEGAL_CONVERSION_RATE)} (= 기준금리 + 2%p)`,
    valueEn: `${pct(LEGAL_CONVERSION_RATE)} p.a. (= base rate + 2%p)`,
    valueVi: `${pct(LEGAL_CONVERSION_RATE)}/năm (= lãi suất cơ bản + 2%p)`,
    basisKo: "주택임대차보호법 §7조의2, 시행령 §9",
    basisEn: "Housing Lease Protection Act §7-2, Decree §9",
    basisVi: "Luật Bảo vệ Thuê nhà §7-2, Nghị định §9",
    effectiveKo: "기준금리 연동 (계약 중·갱신 전환에만 적용)",
    effectiveEn: "Tracks base rate (in-lease/renewal conversions only)",
    effectiveVi: "Theo lãi suất cơ bản (chỉ áp dụng khi chuyển đổi trong hợp đồng/gia hạn)",
    lastVerified: "2026-07-03",
    tools: ["/jeonse-wolse", "/rent-cap"],
  },
  {
    key: "rent-increase-cap",
    category: "realestate",
    kind: "statutory",
    nameKo: "임대료 증액 상한 (계약갱신)",
    nameEn: "Rent increase cap (renewal)",
    nameVi: "Trần tăng tiền thuê (gia hạn)",
    valueKo: "5%",
    valueEn: "5%",
    valueVi: "5%",
    basisKo: "주택임대차보호법 §7 (갱신요구권 행사 시)",
    basisEn: "Housing Lease Protection Act §7 (renewal right)",
    basisVi: "Luật Bảo vệ Thuê nhà §7 (khi thực hiện quyền gia hạn)",
    effectiveKo: "2020-07-31~ (임대차 3법)",
    effectiveEn: "Since 2020-07-31",
    effectiveVi: "Từ 2020-07-31 (bộ 3 luật thuê nhà)",
    lastVerified: "2026-07-03",
    tools: ["/rent-cap"],
  },
  // ── 근로 ─────────────────────────────────────────────────────────────────
  {
    key: "min-wage",
    category: "labor",
    kind: "official",
    nameKo: "최저임금 (시급)",
    nameEn: "Minimum wage (hourly)",
    nameVi: "Lương tối thiểu (theo giờ)",
    valueKo: `${krw(MIN_WAGE_2026)}원 (2026) · ${krw(MIN_WAGE_2025)}원 (2025) — 월 ${krw(MIN_WAGE_2026 * STANDARD_MONTHLY_WORK_HOURS)}원(209h)`,
    valueEn: `₩${krw(MIN_WAGE_2026)} (2026) · ₩${krw(MIN_WAGE_2025)} (2025) — ₩${krw(MIN_WAGE_2026 * STANDARD_MONTHLY_WORK_HOURS)}/mo (209h)`,
    valueVi: `₩${krw(MIN_WAGE_2026)} (2026) · ₩${krw(MIN_WAGE_2025)} (2025) — ₩${krw(MIN_WAGE_2026 * STANDARD_MONTHLY_WORK_HOURS)}/tháng (209h)`,
    basisKo: "고용노동부 고시 제2025-47호 (2025-08-05, +2.9%)",
    basisEn: "MOEL Notice No. 2025-47 (2025-08-05, +2.9%)",
    basisVi: "Thông báo Bộ Lao động (MOEL) số 2025-47 (2025-08-05, +2,9%)",
    effectiveKo: "2026-01-01 ~ 2026-12-31",
    effectiveEn: "2026-01-01 – 2026-12-31",
    effectiveVi: "2026-01-01 – 2026-12-31",
    lastVerified: "2026-07-03",
    tools: ["/labor-calc/min-wage-monthly", "/labor-calc/weekly-rest-pay", "/unemployment-benefit"],
  },
  {
    key: "unemployment-benefit-caps",
    category: "labor",
    kind: "official",
    nameKo: "실업급여(구직급여) 1일 상·하한",
    nameEn: "Unemployment benefit daily cap/floor",
    nameVi: "Trần/sàn trợ cấp thất nghiệp mỗi ngày",
    valueKo: `상한 ${krw(DAILY_BENEFIT_CAP)}원 · 하한 ${krw(DAILY_BENEFIT_FLOOR)}원 (최저시급×80%×8h)`,
    valueEn: `Cap ₩${krw(DAILY_BENEFIT_CAP)} · floor ₩${krw(DAILY_BENEFIT_FLOOR)} (min wage×80%×8h)`,
    valueVi: `Trần ₩${krw(DAILY_BENEFIT_CAP)} · sàn ₩${krw(DAILY_BENEFIT_FLOOR)} (lương tối thiểu×80%×8h)`,
    basisKo: "고용보험법 §45·§46 + 고용노동부 고시 (7년 만의 상한 인상)",
    basisEn: "Employment Insurance Act §45–46 + MOEL notice (first cap raise in 7 yrs)",
    basisVi: "Luật BH Việc làm §45–46 + thông báo MOEL (tăng trần lần đầu sau 7 năm)",
    effectiveKo: "2026-01-01 이후 이직자 (2025 이직: 66,000/64,192원)",
    effectiveEn: "Separations on/after 2026-01-01 (2025: 66,000/64,192)",
    effectiveVi: "Nghỉ việc từ 2026-01-01 (2025: 66.000/64.192)",
    lastVerified: "2026-07-03",
    tools: ["/unemployment-benefit"],
  },
  // ── 4대보험 ──────────────────────────────────────────────────────────────
  {
    key: "national-pension",
    category: "insurance",
    kind: "official",
    nameKo: "국민연금 보험료율·기준소득월액",
    nameEn: "National Pension rate & income base",
    nameVi: "Tỷ lệ & mức thu nhập chuẩn Lương hưu Quốc dân (NPS)",
    valueKo: `${pct(NATIONAL_PENSION.totalRate, 1)} (근로자 ${pct(NATIONAL_PENSION.employeeRate)}) · 상한 ${krw(NATIONAL_PENSION.maxBase)}원 / 하한 ${krw(NATIONAL_PENSION.minBase)}원`,
    valueEn: `${pct(NATIONAL_PENSION.totalRate, 1)} (employee ${pct(NATIONAL_PENSION.employeeRate)}) · base cap ₩${krw(NATIONAL_PENSION.maxBase)} / floor ₩${krw(NATIONAL_PENSION.minBase)}`,
    valueVi: `${pct(NATIONAL_PENSION.totalRate, 1)} (người LĐ ${pct(NATIONAL_PENSION.employeeRate)}) · trần ₩${krw(NATIONAL_PENSION.maxBase)} / sàn ₩${krw(NATIONAL_PENSION.minBase)}`,
    basisKo: "국민연금법 2025.3 개정(9→9.5%, 2033년 13%까지 매년 +0.5%p) · 상하한 = 2026 제1차 국민연금심의위(2026-01-09)",
    basisEn: "National Pension Act 2025.3 reform (9→9.5%, +0.5pp/yr to 13% by 2033); base = NPS Council 2026-01-09",
    basisVi: "Cải cách Luật NPS 2025.3 (9→9,5%, +0,5pp/năm đến 13% vào 2033); mức chuẩn = Hội đồng NPS 2026-01-09",
    effectiveKo: "요율 2026-01~ · 상하한 2026-07 ~ 2027-06",
    effectiveEn: "Rate from 2026-01; base Jul 2026 – Jun 2027",
    effectiveVi: "Tỷ lệ từ 2026-01; mức chuẩn 07/2026 – 06/2027",
    lastVerified: "2026-07-03",
    tools: ["/net-salary", "/insurance-calc", "/pension-refund"],
  },
  {
    key: "health-insurance",
    category: "insurance",
    kind: "official",
    nameKo: "건강보험 + 장기요양 요율",
    nameEn: "Health + long-term care rates",
    nameVi: "Tỷ lệ BHYT + chăm sóc dài hạn",
    valueKo: `건보 ${pct(HEALTH_INSURANCE.totalRate)} (근로자 ${pct(HEALTH_INSURANCE.employeeRate, 3)}) · 장기요양 = 건보료 × ${pct(LONG_TERM_CARE.rateOnHealth)}`,
    valueEn: `Health ${pct(HEALTH_INSURANCE.totalRate)} (employee ${pct(HEALTH_INSURANCE.employeeRate, 3)}); LTC = health × ${pct(LONG_TERM_CARE.rateOnHealth)}`,
    valueVi: `BHYT ${pct(HEALTH_INSURANCE.totalRate)} (người LĐ ${pct(HEALTH_INSURANCE.employeeRate, 3)}); chăm sóc dài hạn = BHYT × ${pct(LONG_TERM_CARE.rateOnHealth)}`,
    basisKo: "보건복지부 건강보험정책심의위 2025-08-28 결정 (7.09→7.19%, 장기요양 12.95→13.14%)",
    basisEn: "MOHW Health Insurance Policy Committee, 2025-08-28 (7.09→7.19%; LTC 12.95→13.14%)",
    basisVi: "Ủy ban Chính sách BHYT Bộ Y tế (MOHW), 2025-08-28 (7,09→7,19%; chăm sóc dài hạn 12,95→13,14%)",
    effectiveKo: "2026-01-01~",
    effectiveEn: "From 2026-01-01",
    effectiveVi: "Từ 2026-01-01",
    lastVerified: "2026-07-03",
    tools: ["/net-salary", "/insurance-calc", "/foreign-health-insurance"],
  },
  {
    key: "employment-insurance",
    category: "insurance",
    kind: "official",
    nameKo: "고용보험 · 산재보험 요율",
    nameEn: "Employment & workers' comp rates",
    nameVi: "Tỷ lệ BH việc làm & BH tai nạn lao động",
    valueKo: `고용(실업급여) 근로자 ${pct(EMPLOYMENT_INSURANCE.unemploymentEmployeeRate)} + 사용자 ${pct(EMPLOYMENT_INSURANCE.unemploymentEmployerRate)} · 산재 평균 ${pct(INDUSTRIAL_ACCIDENT.averageEmployerRate)} (업종별, 사용자 전액)`,
    valueEn: `Employment: ${pct(EMPLOYMENT_INSURANCE.unemploymentEmployeeRate)} each side; workers' comp avg ${pct(INDUSTRIAL_ACCIDENT.averageEmployerRate)} (by industry, employer-paid)`,
    valueVi: `BH việc làm: ${pct(EMPLOYMENT_INSURANCE.unemploymentEmployeeRate)} mỗi bên; BH tai nạn LĐ TB ${pct(INDUSTRIAL_ACCIDENT.averageEmployerRate)} (theo ngành, chủ trả toàn bộ)`,
    basisKo: "고용보험법 · 근로복지공단 업종별 고시",
    basisEn: "Employment Insurance Act; COMWEL industry notice",
    basisVi: "Luật BH Việc làm; thông báo theo ngành của COMWEL",
    effectiveKo: "2026 적용",
    effectiveEn: "Applied for 2026",
    effectiveVi: "Áp dụng cho 2026",
    lastVerified: "2026-07-03",
    tools: ["/insurance-calc", "/net-salary", "/unemployment-benefit"],
  },
  // ── 세금 ─────────────────────────────────────────────────────────────────
  {
    key: "vat",
    category: "tax",
    kind: "statutory",
    nameKo: "부가가치세율",
    nameEn: "VAT rate",
    nameVi: "Thuế suất VAT",
    valueKo: pct(VAT_RATE, 0),
    valueEn: pct(VAT_RATE, 0),
    valueVi: pct(VAT_RATE, 0),
    basisKo: "부가가치세법 §30",
    basisEn: "VAT Act §30",
    basisVi: "Luật Thuế VAT §30",
    effectiveKo: "1977~ 단일세율 유지",
    effectiveEn: "Single rate since 1977",
    effectiveVi: "Thuế suất duy nhất từ 1977",
    lastVerified: "2026-07-03",
    tools: ["/vat-calc"],
  },
  {
    key: "foreign-flat-tax",
    category: "tax",
    kind: "statutory",
    nameKo: "외국인 근로자 단일세율",
    nameEn: "Foreign worker flat tax",
    nameVi: "Thuế suất cố định cho người LĐ nước ngoài",
    valueKo: "19% (+지방소득세 10% = 실효 20.9%) · 국내 근무 시작 후 20년",
    valueEn: "19% (+10% local surtax = 20.9% effective) · up to 20 years",
    valueVi: "19% (+thuế địa phương 10% = 20,9% thực tế) · tối đa 20 năm",
    basisKo: "조세특례제한법 §18-2",
    basisEn: "Restriction of Special Taxation Act §18-2",
    basisVi: "Luật Hạn chế Ưu đãi Thuế đặc biệt §18-2",
    effectiveKo: "2026 귀속 기준",
    effectiveEn: "For tax year 2026",
    effectiveVi: "Cho năm tính thuế 2026",
    lastVerified: "2026-07-03",
    tools: ["/foreign-flat-tax"],
  },
  {
    key: "income-tax-brackets",
    category: "tax",
    kind: "statutory",
    nameKo: "종합소득세 세율 구간",
    nameEn: "Income tax brackets",
    nameVi: "Bậc thuế thu nhập",
    valueKo: "6~45% 8구간 (1,400만 이하 6% … 10억 초과 45%) + 지방소득세 10%",
    valueEn: "8 brackets, 6–45% (≤₩14M: 6% … >₩1B: 45%) + 10% local surtax",
    valueVi: "8 bậc, 6–45% (≤₩14tr: 6% … >₩1tỷ: 45%) + thuế địa phương 10%",
    basisKo: "소득세법 §55",
    basisEn: "Income Tax Act §55",
    basisVi: "Luật Thuế Thu nhập §55",
    effectiveKo: "2023 개정 구간 유지 (2026 귀속)",
    effectiveEn: "2023-revised brackets (TY 2026)",
    effectiveVi: "Bậc sửa đổi 2023 (năm tính thuế 2026)",
    lastVerified: "2026-07-03",
    tools: ["/income-tax", "/net-salary", "/freelancer-tax"],
  },
  // ── 경험칙 (법정 아님 — 명확히 구분) ─────────────────────────────────────
  {
    key: "deposit-risk-bands",
    category: "convention",
    kind: "convention",
    nameKo: "깡통전세 위험 구간 (경험칙)",
    nameEn: "Underwater-jeonse risk bands (rule of thumb)",
    nameVi: "Ngưỡng rủi ro jeonse rỗng (kinh nghiệm)",
    valueKo: `부채비율 ≤${pct(RATIO_SAFE_MAX, 0)} 안전 · ~${pct(RATIO_CAUTION_MAX, 0)} 주의 · ~${pct(RATIO_DANGER_MAX, 0)} 위험 · 초과 매우위험`,
    valueEn: `Debt ratio ≤${pct(RATIO_SAFE_MAX, 0)} safe · ~${pct(RATIO_CAUTION_MAX, 0)} caution · ~${pct(RATIO_DANGER_MAX, 0)} risky · above = critical`,
    valueVi: `Tỷ lệ nợ ≤${pct(RATIO_SAFE_MAX, 0)} an toàn · ~${pct(RATIO_CAUTION_MAX, 0)} thận trọng · ~${pct(RATIO_DANGER_MAX, 0)} rủi ro · trên = rất rủi ro`,
    basisKo: "HUG 심사 관행·업계 통용 경험칙 — 법정 기준 아님",
    basisEn: "HUG practice & industry rule of thumb — NOT statutory",
    basisVi: "Thông lệ thẩm định HUG & kinh nghiệm ngành — KHÔNG phải luật định",
    effectiveKo: "참고용",
    effectiveEn: "Reference only",
    effectiveVi: "Chỉ tham khảo",
    lastVerified: "2026-07-03",
    tools: ["/deposit-risk", "/jeonse-wolse"],
  },
] as const;

/** audit·페이지에서 쓰는 만료 판정 (기본 180일) */
export const FRESHNESS_LIMIT_DAYS = 180;
