"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculateCompound,
  compoundInputSchema,
  type CompoundInputResolved,
  type CompoundResult,
} from "@/lib/calculations/finance/compound";
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

const won = (n: number): string =>
  Math.round(n).toLocaleString("ko-KR");
const pct = (n: number, d = 2): string => n.toFixed(d);

const TEXT = {
  ko: {
    sectionPrincipal: "원금·기간",
    sectionRate: "이율·복리",
    sectionContrib: "추가 적립 (선택)",
    fieldPrincipal: "초기 원금 (원)",
    fieldPrincipalHint: "예금/투자/저축 시작 금액",
    fieldYears: "기간 (년)",
    fieldYearsHint: "소수점 가능 (1.5 = 1년 6개월)",
    fieldRate: "연이율 (%)",
    fieldRateHint: "명목 금리. 0 입력 시 단순 적립",
    fieldFrequency: "복리 빈도",
    fieldContrib: "정기 적립액 (원/기간)",
    fieldContribHint: "복리 빈도와 동일 주기로 적립 (월복리면 매월)",
    calculate: "계산하기",
    reset: "초기화",
    resultHeading: "복리 계산 결과",
    resultEmpty: "원금·이율·기간을 입력하고 계산하세요.",
    error: "계산 중 오류가 발생했습니다.",
    finalAmount: "만기 금액",
    finalAmountUnit: "원",
    principal: "원금",
    totalContrib: "누적 적립",
    totalInterest: "누적 이자",
    ear: "실효 연이율 (EAR)",
    cagr: "총 CAGR",
    yearlyTable: "연도별 잔액",
    yearLabel: "년차",
    balanceCol: "잔액",
    contribCol: "누적 적립",
    interestCol: "누적 이자",
    freqYear: "연 1회",
    freqQuarter: "분기 (4회)",
    freqMonth: "월 (12회)",
    freqDay: "일 (365회)",
    sourceTitle: "공식 · 가정",
    sourceLines: [
      "FV = P(1 + r/n)^(nt) + PMT × ((1+r/n)^(nt) − 1) / (r/n)",
      "EAR = (1 + r/n)^n − 1 — 실효 연이율, 명목 → 복리 빈도 반영",
      "CAGR = (만기금액 / 총투입)^(1/t) − 1 — 적립도 포함된 기하 평균 수익률",
      "적립은 매 복리 기간 말에 발생한다고 가정 (월복리면 매월 말).",
      "이자소득세(15.4%)·인플레이션·환율 변동은 미반영. 세전 명목 금액.",
    ],
  },
  en: {
    sectionPrincipal: "Principal · Period",
    sectionRate: "Rate · Compounding",
    sectionContrib: "Periodic Contribution (optional)",
    fieldPrincipal: "Initial principal (₩)",
    fieldPrincipalHint: "Starting deposit/investment amount",
    fieldYears: "Period (years)",
    fieldYearsHint: "Decimals allowed (1.5 = 1 year 6 months)",
    fieldRate: "Annual rate (%)",
    fieldRateHint: "Nominal rate. 0 = no interest",
    fieldFrequency: "Compound frequency",
    fieldContrib: "Periodic contribution (₩/period)",
    fieldContribHint: "Same period as compound frequency (monthly = each month)",
    calculate: "Calculate",
    reset: "Reset",
    resultHeading: "Compound Result",
    resultEmpty: "Enter principal, rate, and period.",
    error: "Calculation failed.",
    finalAmount: "Future value",
    finalAmountUnit: "₩",
    principal: "Principal",
    totalContrib: "Total contribution",
    totalInterest: "Total interest",
    ear: "Effective Annual Rate",
    cagr: "Total CAGR",
    yearlyTable: "Yearly balance",
    yearLabel: "Year",
    balanceCol: "Balance",
    contribCol: "Contrib total",
    interestCol: "Interest total",
    freqYear: "Annual (×1)",
    freqQuarter: "Quarterly (×4)",
    freqMonth: "Monthly (×12)",
    freqDay: "Daily (×365)",
    sourceTitle: "Formulas · assumptions",
    sourceLines: [
      "FV = P(1 + r/n)^(nt) + PMT × ((1+r/n)^(nt) − 1) / (r/n)",
      "EAR = (1 + r/n)^n − 1 — effective annual rate from nominal",
      "CAGR = (FV / total invested)^(1/t) − 1 — geometric mean incl. contributions",
      "Contribution timing: end of each compound period (e.g., end of each month for monthly).",
      "Pre-tax nominal. Income tax (15.4%), inflation, FX excluded.",
    ],
  },
} as const;

export function CompoundForm({ locale }: CompoundFormProps): React.ReactElement {
  const T = TEXT[locale];
  const [result, setResult] = useState<CompoundResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CompoundInputResolved>({
    resolver: zodResolver(compoundInputSchema),
    defaultValues: {
      principal: 10_000_000,
      annualRatePercent: 5,
      years: 10,
      compoundFrequency: 12,
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
          <Field label={T.fieldPrincipal} hint={T.fieldPrincipalHint}>
            <input
              type="number"
              step="100000"
              inputMode="numeric"
              className="input-base"
              {...register("principal", { valueAsNumber: true })}
            />
          </Field>
          <Field label={T.fieldYears} hint={T.fieldYearsHint}>
            <input
              type="number"
              step="0.5"
              inputMode="decimal"
              className="input-base"
              {...register("years", { valueAsNumber: true })}
            />
          </Field>
        </FieldGroup>

        <FieldGroup title={T.sectionRate}>
          <Field label={T.fieldRate} hint={T.fieldRateHint}>
            <input
              type="number"
              step="0.1"
              inputMode="decimal"
              className="input-base"
              {...register("annualRatePercent", { valueAsNumber: true })}
            />
          </Field>
          <Field label={T.fieldFrequency}>
            <select
              className="input-base"
              {...register("compoundFrequency", { valueAsNumber: true })}
            >
              <option value={1}>{T.freqYear}</option>
              <option value={4}>{T.freqQuarter}</option>
              <option value={12}>{T.freqMonth}</option>
              <option value={365}>{T.freqDay}</option>
            </select>
          </Field>
        </FieldGroup>

        <FieldGroup title={T.sectionContrib}>
          <Field label={T.fieldContrib} hint={T.fieldContribHint}>
            <input
              type="number"
              step="10000"
              inputMode="numeric"
              className="input-base"
              {...register("periodicContribution", { valueAsNumber: true })}
            />
          </Field>
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
            <HeroResult
              label={T.finalAmount}
              value={won(result.finalAmount)}
              unit={T.finalAmountUnit}
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat label={T.principal} value={`${won(result.principal)} ${T.finalAmountUnit}`} />
              <Stat label={T.totalContrib} value={`${won(result.totalContribution)} ${T.finalAmountUnit}`} />
              <Stat label={T.totalInterest} value={`${won(result.totalInterest)} ${T.finalAmountUnit}`} />
              <Stat label={T.ear} value={`${pct(result.effectiveAnnualRatePercent)}%`} />
              <Stat label={T.cagr} value={`${pct(result.cagrPercent)}%`} />
            </dl>

            <div>
              <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                {T.yearlyTable}
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[color:var(--color-border-subtle)] text-[color:var(--color-text-tertiary)]">
                      <th className="px-3 py-2 text-left font-medium">{T.yearLabel}</th>
                      <th className="px-3 py-2 text-right font-medium">{T.balanceCol}</th>
                      <th className="px-3 py-2 text-right font-medium">{T.contribCol}</th>
                      <th className="px-3 py-2 text-right font-medium">{T.interestCol}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.yearly.map((row) => (
                      <tr
                        key={row.year}
                        className="border-b border-[color:var(--color-border-subtle)]/50 last:border-0 tabular-nums text-[color:var(--color-text-secondary)]"
                      >
                        <td className="px-3 py-1.5">{row.year}</td>
                        <td className="px-3 py-1.5 text-right text-[color:var(--color-text-primary)]">
                          {won(row.balance)}
                        </td>
                        <td className="px-3 py-1.5 text-right">{won(row.totalContrib)}</td>
                        <td className="px-3 py-1.5 text-right">{won(row.totalInterest)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <SourceBox lines={[T.sourceTitle, ...T.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
