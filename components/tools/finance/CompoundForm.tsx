"use client";

import { useState } from "react";
import { useForm, Controller, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculateCompound,
  compoundInputSchema,
  type CompoundInputResolved,
  type CompoundResult,
} from "@/lib/calculations/finance/compound";
import { formatKrw, formatKoreanMoney, formatNumber } from "@/lib/utils/format";
import {
  ActionRow,
  CalcLayout,
  EmptyResult,
  ErrorBox,
  Field,
  FieldGroup,
  FormShell,
  HeroResult,
  ResultShell,
  SourceBox,
  Stat,
} from "@/components/ui/calc-form";

interface CompoundFormProps {
  locale: "ko" | "en";
}

const TEXT = {
  ko: {
    sectionPrincipal: "원금",
    sectionRate: "이율·횟수",
    sectionContrib: "추가 적립 (선택)",
    fieldPrincipal: "초기 원금 (원)",
    fieldPrincipalHint: "예금/투자/저축 시작 금액",
    fieldRate: "회당 이율 (%)",
    fieldRateHint: "한 번 복리될 때 이율. 월복리 연 5%면 약 0.42 (= 5 ÷ 12)",
    fieldPeriods: "복리 횟수 (회)",
    fieldPeriodsHint: "복리가 적용되는 총 횟수. 월복리 10년이면 120회",
    fieldContrib: "정기 적립액 (원/회)",
    fieldContribHint: "매 회 추가로 적립하는 금액 (없으면 비워두세요)",
    calculate: "계산하기",
    reset: "초기화",
    resultHeading: "복리 계산 결과",
    resultEmpty: "원금·회당 이율·복리 횟수를 입력하고 계산하세요.",
    error: "계산 중 오류가 발생했습니다.",
    finalAmount: "만기 금액",
    finalAmountUnit: "원",
    principal: "원금",
    totalContrib: "누적 적립",
    totalInterest: "누적 이자",
    totalReturn: "총 수익률",
    sourceTitle: "공식 · 가정",
    sourceLines: [
      "FV = P(1 + i)^n + PMT × ((1+i)^n − 1) / i",
      "i = 회당 이율, n = 복리 횟수, PMT = 매 회 적립액",
      "예: 월복리 연 5%·10년 = 회당 0.4167%(= 5 ÷ 12) × 120회",
      "적립은 매 회 말에 발생한다고 가정.",
      "이자소득세(15.4%)·인플레이션은 미반영. 세전 명목 금액.",
    ],
  },
  en: {
    sectionPrincipal: "Principal",
    sectionRate: "Rate · Periods",
    sectionContrib: "Periodic Contribution (optional)",
    fieldPrincipal: "Initial principal (₩)",
    fieldPrincipalHint: "Starting deposit/investment amount",
    fieldRate: "Rate per period (%)",
    fieldRateHint: "Interest applied each time it compounds. Annual 5% monthly ≈ 0.42 (= 5 ÷ 12)",
    fieldPeriods: "Number of periods",
    fieldPeriodsHint: "Total times interest compounds. 10 years monthly = 120",
    fieldContrib: "Contribution per period (₩)",
    fieldContribHint: "Added each period (leave blank for none)",
    calculate: "Calculate",
    reset: "Reset",
    resultHeading: "Compound Result",
    resultEmpty: "Enter principal, rate per period, and number of periods.",
    error: "Calculation failed.",
    finalAmount: "Future value",
    finalAmountUnit: "₩",
    principal: "Principal",
    totalContrib: "Total contribution",
    totalInterest: "Total interest",
    totalReturn: "Total return",
    sourceTitle: "Formulas · assumptions",
    sourceLines: [
      "FV = P(1 + i)^n + PMT × ((1+i)^n − 1) / i",
      "i = rate per period, n = number of periods, PMT = contribution per period",
      "e.g. annual 5% monthly for 10y = 0.4167% (= 5 ÷ 12) × 120 periods",
      "Contributions assumed at the end of each period.",
      "Pre-tax nominal. Income tax (15.4%) and inflation excluded.",
    ],
  },
} as const;

/** 금액 입력 — 천단위 콤마 표시 + (한국어) 한글 금액 보조 표기. */
function MoneyField({
  control,
  name,
  label,
  hint,
  locale,
  step,
}: {
  control: Control<CompoundInputResolved>;
  name: "principal" | "periodicContribution";
  label: string;
  hint: string;
  locale: "ko" | "en";
  step: number;
}): React.ReactElement {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const num = Number(field.value) || 0;
        return (
          <Field label={label} hint={hint}>
            <input
              type="text"
              inputMode="numeric"
              className="input-base"
              value={num > 0 ? num.toLocaleString("ko-KR") : ""}
              placeholder="0"
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                field.onChange(raw === "" ? 0 : Number(raw));
              }}
              onBlur={field.onBlur}
              data-step={step}
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

export function CompoundForm({ locale }: CompoundFormProps): React.ReactElement {
  const T = TEXT[locale];
  const [result, setResult] = useState<CompoundResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CompoundInputResolved>({
    resolver: zodResolver(compoundInputSchema),
    defaultValues: {
      principal: 1_000_000,
      ratePerPeriodPercent: 5,
      periods: 10,
      periodicContribution: 0,
    },
  });

  const onSubmit = (values: CompoundInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateCompound(values));
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

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={T.sectionPrincipal}>
          <MoneyField
            control={control}
            name="principal"
            label={T.fieldPrincipal}
            hint={T.fieldPrincipalHint}
            locale={locale}
            step={100_000}
          />
        </FieldGroup>

        <FieldGroup title={T.sectionRate}>
          <Field label={T.fieldRate} hint={T.fieldRateHint}>
            <input
              type="number"
              step="0.1"
              inputMode="decimal"
              className="input-base"
              {...register("ratePerPeriodPercent", { valueAsNumber: true })}
            />
          </Field>
          <Field label={T.fieldPeriods} hint={T.fieldPeriodsHint}>
            <input
              type="number"
              step="1"
              min="1"
              inputMode="numeric"
              className="input-base"
              {...register("periods", { valueAsNumber: true })}
            />
          </Field>
        </FieldGroup>

        <FieldGroup title={T.sectionContrib}>
          <MoneyField
            control={control}
            name="periodicContribution"
            label={T.fieldContrib}
            hint={T.fieldContribHint}
            locale={locale}
            step={10_000}
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
            <div>
              <HeroResult
                label={T.finalAmount}
                value={formatKrw(result.finalAmount)}
                unit={T.finalAmountUnit}
              />
              {locale === "ko" && (
                <p className="mt-2 text-sm font-medium text-[color:var(--color-text-secondary)]">
                  = {formatKoreanMoney(result.finalAmount)}
                </p>
              )}
            </div>
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={T.principal}
                value={`${formatKrw(result.principal)} ${T.finalAmountUnit}`}
              />
              <Stat
                label={T.totalContrib}
                value={`${formatKrw(result.totalContribution)} ${T.finalAmountUnit}`}
              />
              <Stat
                label={T.totalInterest}
                value={`${formatKrw(result.totalInterest)} ${T.finalAmountUnit}`}
              />
              <Stat
                label={T.totalReturn}
                value={`${formatNumber(result.totalReturnPercent, 2)}%`}
                tone="success"
              />
            </dl>

            <SourceBox lines={[T.sourceTitle, ...T.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
