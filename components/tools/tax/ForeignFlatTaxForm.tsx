"use client";

import { useState } from "react";
import { useForm, Controller, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculateForeignFlatTax,
  foreignFlatTaxInputSchema,
  type ForeignFlatTaxInputResolved,
  type ForeignFlatTaxResult,
} from "@/lib/calculations/tax/foreignFlatTax";
import { formatKrw, formatKoreanMoney, formatNumber } from "@/lib/utils/format";
import { NumberField } from "@/components/ui/NumberField";
import {
  ActionRow,
  CalcLayout,
  EmptyResult,
  ErrorBox,
  Field,
  FieldGroup,
  FormShell,
  ResultShell,
  SourceBox,
} from "@/components/ui/calc-form";
import { cn } from "@/lib/utils/cn";

interface ForeignFlatTaxFormProps {
  locale: "ko" | "en" | "vi";
}

const TEXT = {
  ko: {
    sectionIncome: "소득·공제",
    fieldGross: "연 총급여 (원)",
    fieldGrossHint: "세전 연봉 (상여 포함, 비과세 제외 전 총액)",
    fieldDependents: "부양가족 수 (본인 제외)",
    fieldDependentsHint: "배우자·자녀 등 기본공제 대상 (인적공제 1인당 150만원)",
    calculate: "비교 계산",
    reset: "초기화",
    resultHeading: "단일세율 vs 누진세 비교",
    resultEmpty: "연봉을 입력하면 어느 쪽이 유리한지 비교합니다.",
    error: "계산 중 오류가 발생했습니다.",
    winnerFlat: "단일세율(19%)이 유리",
    winnerProg: "일반 누진세가 유리",
    savingsLabel: "연간 절세액",
    flatTitle: "단일세율 (Flat 20.9%)",
    progTitle: "일반 누진세 (6~45%)",
    totalTax: "총 세액",
    effectiveRate: "실효세율",
    incomeTax: "소득세",
    localTax: "지방소득세",
    taxableIncome: "과세표준",
    earnedDeduction: "근로소득공제",
    wageCredit: "근로소득세액공제",
    won: "원",
    sourceTitle: "기준 · 가정 (2026 귀속)",
    sourceLines: [
      "단일세율 = 총급여 × 19% + 지방세 1.9% = 20.9% (조특법 §18조의2). 모든 공제 배제.",
      "누진세 = (총급여 − 근로소득공제 − 인적공제) → 8구간 세율 − 근로소득세액공제 + 지방세 10%.",
      "단일세율 신규 진입은 2026-12-31까지 국내 최초 근로 시작분만 가능 (최초일부터 20년 유지).",
      "4대보험·특별세액공제(의료비·교육비 등)·신용카드공제 미반영 → 공제 많을수록 누진세가 더 유리.",
      "거주자 기준 참고용 추정. 실제 신고는 홈택스/세무 전문가 확인 필요.",
    ],
  },
  en: {
    sectionIncome: "Income · Deductions",
    fieldGross: "Annual gross salary (₩)",
    fieldGrossHint: "Pre-tax annual salary (including bonuses)",
    fieldDependents: "Dependents (excluding yourself)",
    fieldDependentsHint: "Spouse, children, etc. (₩1.5M personal deduction each)",
    calculate: "Compare",
    reset: "Reset",
    resultHeading: "Flat Tax vs Progressive Tax",
    resultEmpty: "Enter your salary to see which option saves more.",
    error: "Calculation failed.",
    winnerFlat: "Flat tax (19%) is better",
    winnerProg: "Progressive tax is better",
    savingsLabel: "Annual savings",
    flatTitle: "Flat tax (20.9%)",
    progTitle: "Progressive (6–45%)",
    totalTax: "Total tax",
    effectiveRate: "Effective rate",
    incomeTax: "Income tax",
    localTax: "Local income tax",
    taxableIncome: "Taxable base",
    earnedDeduction: "Earned-income deduction",
    wageCredit: "Wage-earner credit",
    won: "₩",
    sourceTitle: "Basis · assumptions (2026)",
    sourceLines: [
      "Flat = gross × 19% + 1.9% local = 20.9% (Special Tax Act §18-2). All deductions waived.",
      "Progressive = (gross − earned-income deduction − personal deduction) → 8 brackets − wage-earner credit + 10% local.",
      "New entry to flat tax requires first employment in Korea by 2026-12-31 (valid 20 years from first day).",
      "Excludes 4 social insurances, special credits (medical, education), card deductions → more deductions favor progressive.",
      "Resident basis, reference estimate only. Verify with Hometax or a tax professional.",
    ],
  },
  vi: {
    sectionIncome: "Thu nhập · Khấu trừ",
    fieldGross: "Tổng lương năm (원)",
    fieldGrossHint: "Lương năm trước thuế (bao gồm thưởng, tổng số trước khi trừ khoản miễn thuế)",
    fieldDependents: "Số người phụ thuộc (không tính bản thân)",
    fieldDependentsHint: "Vợ/chồng, con cái, v.v. thuộc diện khấu trừ cơ bản (khấu trừ cá nhân 1.5 triệu 원/người)",
    calculate: "So sánh",
    reset: "Đặt lại",
    resultHeading: "So sánh thuế suất đơn nhất và thuế lũy tiến",
    resultEmpty: "Nhập lương năm để so sánh bên nào có lợi hơn.",
    error: "Đã xảy ra lỗi khi tính toán.",
    winnerFlat: "Thuế suất đơn nhất (19%) có lợi hơn",
    winnerProg: "Thuế lũy tiến thông thường có lợi hơn",
    savingsLabel: "Khoản tiết kiệm thuế hàng năm",
    flatTitle: "Thuế suất đơn nhất (Flat 20.9%)",
    progTitle: "Thuế lũy tiến thông thường (6~45%)",
    totalTax: "Tổng thuế",
    effectiveRate: "Thuế suất thực tế",
    incomeTax: "Thuế thu nhập",
    localTax: "Thuế thu nhập địa phương",
    taxableIncome: "Thu nhập chịu thuế",
    earnedDeduction: "Khấu trừ thu nhập từ lao động",
    wageCredit: "Khấu trừ thuế thu nhập từ lao động",
    won: "원",
    sourceTitle: "Căn cứ · giả định (áp dụng năm thuế 2026)",
    sourceLines: [
      "Thuế đơn nhất = tổng lương × 19% + thuế địa phương 1.9% = 20.9% (Điều 18-2 Luật Ưu đãi thuế đặc biệt). Không áp dụng bất kỳ khoản khấu trừ nào.",
      "Thuế lũy tiến = (tổng lương − khấu trừ thu nhập từ lao động − khấu trừ cá nhân) → 8 bậc thuế suất − khấu trừ thuế thu nhập từ lao động + thuế địa phương 10%.",
      "Người mới bắt đầu áp dụng thuế đơn nhất phải có ngày làm việc đầu tiên tại Hàn Quốc trước 31/12/2026 (áp dụng trong 20 năm kể từ ngày đầu tiên).",
      "Chưa phản ánh 4 loại bảo hiểm xã hội, khấu trừ đặc biệt (y tế, giáo dục), khấu trừ thẻ tín dụng → càng nhiều khoản khấu trừ thì thuế lũy tiến càng có lợi.",
      "Chỉ là ước tính tham khảo trên cơ sở cư trú. Vui lòng xác nhận khai báo thực tế tại Hometax hoặc chuyên gia thuế.",
    ],
  },
} as const;

/** 금액 입력 — 천단위 콤마 + (한국어) 한글 금액 보조 표기. */
function MoneyField({
  control,
  name,
  label,
  hint,
  locale,
}: {
  control: Control<ForeignFlatTaxInputResolved>;
  name: "grossSalary";
  label: string;
  hint: string;
  locale: "ko" | "en" | "vi";
}): React.ReactElement {
  const suffix = locale === "ko" ? "원" : "₩";
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const num = Number(field.value) || 0;
        return (
          <Field label={label} hint={hint}>
            <NumberField
              value={num}
              onChange={(v) => field.onChange(v)}
              suffix={suffix}
              aria-label={label}
            />
            {locale === "ko" && num > 0 && (
              <p className="mt-1.5 text-xs font-medium text-[color:var(--color-accent)]">
                = {formatKoreanMoney(num)}
              </p>
            )}
          </Field>
        );
      }}
    />
  );
}

/** 단일/누진 비교 카드 */
function CompareCard({
  title,
  total,
  effectiveRate,
  rows,
  highlighted,
  unit,
}: {
  title: string;
  total: number;
  effectiveRate: number;
  rows: Array<{ label: string; value: string }>;
  highlighted: boolean;
  unit: string;
}): React.ReactElement {
  return (
    <div
      className={cn(
        "rounded-xl border p-4 transition-colors",
        highlighted
          ? "border-emerald-500/40 bg-emerald-500/5"
          : "border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]",
      )}
    >
      <h3 className="text-sm font-semibold text-[color:var(--color-text-secondary)]">
        {title}
      </h3>
      <p
        className={cn(
          "mt-1 text-2xl font-bold tabular-nums",
          highlighted ? "text-emerald-300" : "text-[color:var(--color-text-primary)]",
        )}
      >
        {formatKrw(total)} {unit}
      </p>
      <p className="mt-0.5 text-xs text-[color:var(--color-text-tertiary)]">
        {formatNumber(effectiveRate * 100, 1)}%
      </p>
      <dl className="mt-3 space-y-1 border-t border-[color:var(--color-border-subtle)] pt-2.5 text-xs">
        {rows.map((row) => (
          <div key={row.label} className="flex justify-between gap-2">
            <dt className="text-[color:var(--color-text-tertiary)]">{row.label}</dt>
            <dd className="tabular-nums text-[color:var(--color-text-secondary)]">
              {row.value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function ForeignFlatTaxForm({
  locale,
}: ForeignFlatTaxFormProps): React.ReactElement {
  const T = TEXT[locale];
  const [result, setResult] = useState<ForeignFlatTaxResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ForeignFlatTaxInputResolved>({
    resolver: zodResolver(foreignFlatTaxInputSchema),
    defaultValues: { grossSalary: 60_000_000, dependents: 0 },
  });

  const onSubmit = (values: ForeignFlatTaxInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateForeignFlatTax(values));
    } catch {
      setResult(null);
      setCalcError(T.error);
    }
  };
  const onReset = (): void => {
    reset();
    setResult(null);
    setCalcError(null);
  };

  const flatWins = result?.recommended === "flat";

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={T.sectionIncome}>
          <MoneyField
            control={control}
            name="grossSalary"
            label={T.fieldGross}
            hint={T.fieldGrossHint}
            locale={locale}
          />
          <Controller
            control={control}
            name="dependents"
            render={({ field }) => (
              <Field label={T.fieldDependents} hint={T.fieldDependentsHint}>
                <NumberField
                  value={Number(field.value) || 0}
                  onChange={(v) => field.onChange(v)}
                  thousands={false}
                  min={0}
                  max={20}
                  aria-label={T.fieldDependents}
                />
              </Field>
            )}
          />
        </FieldGroup>

        <ActionRow
          primary={
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {T.calculate}
            </button>
          }
          secondary={
            <button type="button" onClick={onReset} className="btn-ghost sm:w-auto">
              {T.reset}
            </button>
          }
        />
      </FormShell>

      <ResultShell heading={T.resultHeading}>
        {calcError && <ErrorBox message={calcError} />}
        {!calcError && !result && <EmptyResult message={T.resultEmpty} />}
        {result && (
          <div className="animate-fade-up space-y-5">
            <div className="rounded-xl bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent p-5 ring-1 ring-emerald-500/20">
              <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                {flatWins ? T.winnerFlat : T.winnerProg}
              </p>
              <p className="mt-1 flex items-baseline gap-1.5">
                <span className="text-3xl font-bold tracking-tight text-emerald-300 tabular-nums md:text-4xl">
                  {formatKrw(result.savings)}
                </span>
                <span className="text-lg font-semibold text-[color:var(--color-text-secondary)]">
                  {T.won}
                </span>
              </p>
              <p className="mt-0.5 text-xs text-[color:var(--color-text-tertiary)]">
                {T.savingsLabel}
                {locale === "ko" && result.savings > 0
                  ? ` · ${formatKoreanMoney(result.savings)}`
                  : ""}
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <CompareCard
                title={T.flatTitle}
                total={result.flat.total}
                effectiveRate={result.flat.effectiveRate}
                highlighted={flatWins}
                unit={T.won}
                rows={[
                  { label: T.incomeTax, value: `${formatKrw(result.flat.incomeTax)} ${T.won}` },
                  { label: T.localTax, value: `${formatKrw(result.flat.localTax)} ${T.won}` },
                ]}
              />
              <CompareCard
                title={T.progTitle}
                total={result.progressive.total}
                effectiveRate={result.progressive.effectiveRate}
                highlighted={!flatWins}
                unit={T.won}
                rows={[
                  { label: T.taxableIncome, value: `${formatKrw(result.progressive.taxableIncome)} ${T.won}` },
                  { label: T.earnedDeduction, value: `${formatKrw(result.progressive.earnedIncomeDeduction)} ${T.won}` },
                  { label: T.wageCredit, value: `${formatKrw(result.progressive.wageEarnerCredit)} ${T.won}` },
                ]}
              />
            </div>

            <SourceBox lines={[T.sourceTitle, ...T.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
