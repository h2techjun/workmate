"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  calculateUnemploymentBenefit,
  unemploymentBenefitInputSchema,
  DAILY_BENEFIT_CAP,
  DAILY_BENEFIT_FLOOR,
} from "@/lib/calculations/labor/unemploymentBenefit";
import { NumberField } from "@/components/ui/NumberField";
import { ShareButton } from "@/components/ui/ShareButton";
import { formatKoreanMoney } from "@/lib/utils/format";

interface UnemploymentBenefitFormProps {
  locale: "ko" | "en" | "vi";
}

const won = (n: number): string => Math.round(n).toLocaleString("ko-KR");

const T = {
  ko: {
    inputModeLabel: "평균임금 입력 방식",
    modeDaily: "1일 평균임금 직접 입력",
    modeMonthly: "월평균임금으로 계산",
    dailyWageLabel: "1일 평균임금 (원)",
    dailyWageHint:
      "이직 전 3개월 임금총액 ÷ 그 기간 총 일수",
    monthlyWageLabel: "월평균임금 (원)",
    monthlyWageHint: "1일 평균임금 = 월평균임금 ÷ 30",
    insuranceYearsLabel: "고용보험 가입기간 (년)",
    insuranceYearsHint: "예: 2년 6개월은 2.5로 입력",
    ageAbove50Label: "만 50세 이상 또는 장애인",
    result: "예상 수령액",
    totalBenefit: "총 예상 수령액",
    dailyBenefit: "1일 구직급여",
    benefitDays: "소정급여일수",
    cap: "상한 적용됨",
    floor: "하한 적용됨",
    unit: "원",
    days: "일",
    capNote: `상한 적용 (1일 ${won(DAILY_BENEFIT_CAP)}원 한도)`,
    floorNote: `하한 적용 (1일 ${won(DAILY_BENEFIT_FLOOR)}원 보장)`,
    note: "고용보험법 제46·50조 기준 추정값. 실제 수급자격·금액·소정급여일수는 거주지 고용센터가 최종 결정. 이직사유·구직활동 등 수급요건 별도 충족 필요. 2025 최저임금·상한액 기준이며 연도별 변동 가능.",
    shareText: (total: number, days: number) =>
      `실업급여 예상 수령액: ${won(total)}원 (${days}일)`,
  },
  en: {
    inputModeLabel: "Average wage input method",
    modeDaily: "Daily average wage",
    modeMonthly: "Monthly average salary",
    dailyWageLabel: "Daily average wage (KRW)",
    dailyWageHint: "Total wages (last 3 months) ÷ total calendar days in that period",
    monthlyWageLabel: "Monthly average salary (KRW)",
    monthlyWageHint: "Daily avg = monthly salary ÷ 30",
    insuranceYearsLabel: "Employment insurance period (years)",
    insuranceYearsHint: "E.g. 2 years 6 months → 2.5",
    ageAbove50Label: "Age 50+ or person with disability",
    result: "Estimated benefit",
    totalBenefit: "Total estimated benefit",
    dailyBenefit: "Daily benefit",
    benefitDays: "Benefit days",
    cap: "Cap applied",
    floor: "Floor applied",
    unit: "KRW",
    days: "days",
    capNote: `Cap applied (max ${won(DAILY_BENEFIT_CAP)} KRW/day)`,
    floorNote: `Floor applied (min ${won(DAILY_BENEFIT_FLOOR)} KRW/day guaranteed)`,
    note: "Estimate based on Employment Insurance Act Art. 46·50. Actual eligibility, amount, and benefit days are determined by the local employment center. Separation reason, job-seeking activity requirements apply separately. Based on 2025 minimum wage and daily cap — subject to annual revision.",
    shareText: (total: number, days: number) =>
      `Estimated unemployment benefit: ${won(total)} KRW (${days} days)`,
  },
  vi: {
    inputModeLabel: "Cách nhập mức lương bình quân",
    modeDaily: "Nhập trực tiếp lương bình quân theo ngày",
    modeMonthly: "Tính từ lương bình quân theo tháng",
    dailyWageLabel: "Lương bình quân theo ngày (KRW)",
    dailyWageHint: "Tổng lương 3 tháng trước khi nghỉ việc ÷ tổng số ngày trong giai đoạn đó",
    monthlyWageLabel: "Lương bình quân theo tháng (KRW)",
    monthlyWageHint: "Lương bình quân ngày = lương bình quân tháng ÷ 30",
    insuranceYearsLabel: "Thời gian tham gia bảo hiểm việc làm (năm)",
    insuranceYearsHint: "Ví dụ: 2 năm 6 tháng thì nhập 2.5",
    ageAbove50Label: "Từ 50 tuổi trở lên hoặc người khuyết tật",
    result: "Số tiền dự kiến nhận",
    totalBenefit: "Tổng số tiền dự kiến nhận",
    dailyBenefit: "Trợ cấp thất nghiệp theo ngày",
    benefitDays: "Số ngày hưởng trợ cấp",
    cap: "Áp dụng mức trần",
    floor: "Áp dụng mức sàn",
    unit: "KRW",
    days: "ngày",
    capNote: `Áp dụng mức trần (tối đa ${won(DAILY_BENEFIT_CAP)} KRW/ngày)`,
    floorNote: `Áp dụng mức sàn (tối thiểu ${won(DAILY_BENEFIT_FLOOR)} KRW/ngày được đảm bảo)`,
    note: "Đây là giá trị ước tính theo Điều 46, 50 Luật Bảo hiểm việc làm. Điều kiện hưởng, số tiền và số ngày hưởng thực tế do Trung tâm việc làm (Goyong Center) tại nơi cư trú quyết định cuối cùng. Cần đáp ứng riêng các điều kiện như lý do nghỉ việc, hoạt động tìm việc. Áp dụng mức lương tối thiểu và mức trần năm 2025, có thể thay đổi theo từng năm.",
    shareText: (total: number, days: number) =>
      `Trợ cấp thất nghiệp dự kiến: ${won(total)} KRW (${days} ngày)`,
  },
} as const;

export function UnemploymentBenefitForm({
  locale,
}: UnemploymentBenefitFormProps): React.ReactElement {
  const t = T[locale];
  const tShare = useTranslations("share");

  const [inputMode, setInputMode] = useState<"daily" | "monthly">("daily");
  const [dailyWage, setDailyWage] = useState(100_000);
  const [monthlyWage, setMonthlyWage] = useState(3_000_000);
  const [insuranceYears, setInsuranceYears] = useState(3);
  const [ageAbove50, setAgeAbove50] = useState(false);

  const r = calculateUnemploymentBenefit(
    unemploymentBenefitInputSchema.parse({
      inputMode,
      dailyAverageWage: dailyWage,
      monthlyAverageSalary: monthlyWage,
      insuranceYears,
      ageAbove50,
    }),
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 입력 패널 */}
      <section className="surface-card space-y-5 p-5 md:p-7">
        {/* 입력 방식 탭 */}
        <div>
          <p className="mb-2 text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.inputModeLabel}
          </p>
          <div className="flex rounded-lg border border-[color:var(--color-border-subtle)] overflow-hidden">
            {(["daily", "monthly"] as const).map((mode) => (
              <button
                key={mode}
                type="button"
                onClick={() => setInputMode(mode)}
                className={`flex-1 py-2 text-sm font-medium transition-colors ${
                  inputMode === mode
                    ? "bg-indigo-500/20 text-indigo-300"
                    : "text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-secondary)]"
                }`}
              >
                {mode === "daily" ? t.modeDaily : t.modeMonthly}
              </button>
            ))}
          </div>
        </div>

        {/* 평균임금 입력 */}
        {inputMode === "daily" ? (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
              {t.dailyWageLabel}
            </label>
            <NumberField
              value={dailyWage}
              onChange={setDailyWage}
              suffix={t.unit}
              aria-label={t.dailyWageLabel}
            />
            <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
              {t.dailyWageHint}
            </p>
            {locale === "ko" && dailyWage > 0 && (
              <p className="mt-0.5 text-xs text-[color:var(--color-text-muted)]">
                {formatKoreanMoney(dailyWage)}
              </p>
            )}
          </div>
        ) : (
          <div>
            <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
              {t.monthlyWageLabel}
            </label>
            <NumberField
              value={monthlyWage}
              onChange={setMonthlyWage}
              suffix={t.unit}
              aria-label={t.monthlyWageLabel}
            />
            <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
              {t.monthlyWageHint}
            </p>
            {locale === "ko" && monthlyWage > 0 && (
              <p className="mt-0.5 text-xs text-[color:var(--color-text-muted)]">
                {formatKoreanMoney(monthlyWage)}
              </p>
            )}
          </div>
        )}

        {/* 고용보험 가입기간 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.insuranceYearsLabel}
          </label>
          <NumberField
            value={insuranceYears}
            onChange={setInsuranceYears}
            decimals={1}
            min={0}
            max={40}
            aria-label={t.insuranceYearsLabel}
          />
          <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
            {t.insuranceYearsHint}
          </p>
        </div>

        {/* 나이/장애인 여부 */}
        <label className="flex cursor-pointer items-center gap-3">
          <input
            type="checkbox"
            checked={ageAbove50}
            onChange={(e) => setAgeAbove50(e.target.checked)}
            className="h-4 w-4 rounded border-[color:var(--color-border-subtle)] accent-indigo-500"
            aria-label={t.ageAbove50Label}
          />
          <span className="text-sm text-[color:var(--color-text-secondary)]">
            {t.ageAbove50Label}
          </span>
        </label>
      </section>

      {/* 결과 패널 */}
      <section className="surface-card space-y-4 p-5 md:p-7">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
            {t.result}
          </h2>
          <ShareButton
            text={t.shareText(r.totalBenefit, r.benefitDays)}
            label={tShare("button")}
            copiedLabel={tShare("copied")}
          />
        </div>

        {/* 총 수령액 히어로 */}
        <div className="rounded-xl bg-gradient-to-br from-indigo-500/15 to-violet-500/10 p-4 ring-1 ring-indigo-500/20">
          <dt className="text-xs font-medium text-[color:var(--color-text-tertiary)]">
            {t.totalBenefit}
          </dt>
          <dd className="mt-1 text-4xl font-bold tabular-nums text-[#eef0f5]">
            {won(r.totalBenefit)}
            <span className="ml-1 text-base font-medium text-[color:var(--color-text-secondary)]">
              {t.unit}
            </span>
          </dd>
          <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
            {t.benefitDays} {r.benefitDays}{t.days} · {t.dailyBenefit} {won(r.dailyWageClamped)}{t.unit}
          </p>
        </div>

        {/* 세부 항목 */}
        <dl className="space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-[color:var(--color-text-secondary)]">{t.dailyBenefit}</dt>
            <dd className="tabular-nums font-medium text-[color:var(--color-text-primary)]">
              {won(r.dailyWageClamped)} {t.unit}
            </dd>
          </div>

          {/* 상한·하한 배지 */}
          {r.isCapApplied && (
            <div className="rounded-lg bg-amber-500/10 px-3 py-1.5 text-xs text-amber-300 ring-1 ring-amber-500/20">
              {t.capNote}
            </div>
          )}
          {r.isFloorApplied && (
            <div className="rounded-lg bg-sky-500/10 px-3 py-1.5 text-xs text-sky-300 ring-1 ring-sky-500/20">
              {t.floorNote}
            </div>
          )}

          <div className="flex justify-between border-t border-[color:var(--color-border-subtle)] pt-2">
            <dt className="text-[color:var(--color-text-secondary)]">{t.benefitDays}</dt>
            <dd className="tabular-nums font-medium text-[color:var(--color-text-primary)]">
              {r.benefitDays} {t.days}
            </dd>
          </div>

          <div className="flex justify-between">
            <dt className="text-[color:var(--color-text-secondary)]">{t.totalBenefit}</dt>
            <dd className="tabular-nums font-bold text-[color:var(--color-text-primary)]">
              {won(r.totalBenefit)} {t.unit}
            </dd>
          </div>
        </dl>

        <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
          {t.note}
        </p>
      </section>
    </div>
  );
}
