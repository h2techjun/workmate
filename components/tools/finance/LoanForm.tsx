"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculateLoan,
  loanInputSchema,
  type LoanInputResolved,
  type LoanResult,
  type LoanType,
} from "@/lib/calculations/finance/loan";
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

interface LoanFormProps {
  locale: "ko" | "en";
}

const won = (n: number): string => Math.round(n).toLocaleString("ko-KR");

const T = {
  ko: {
    sectionPrincipal: "원금·기간",
    sectionType: "상환 방식",
    fieldPrincipal: "대출 원금 (원)",
    fieldYears: "대출 기간 (년)",
    fieldRate: "연이율 (%)",
    fieldType: "상환 방식 선택",
    types: {
      equalPayment: "원리금균등 — 매월 같은 금액",
      equalPrincipal: "원금균등 — 초반 ↑ 후반 ↓",
      balloon: "만기일시 — 매월 이자만, 만기에 원금",
    } satisfies Record<LoanType, string>,
    calculate: "계산하기",
    reset: "초기화",
    resultHeading: "상환 계획",
    resultEmpty: "원금·이율·기간을 입력하세요.",
    error: "계산 오류",
    monthlyLabel: "월 상환액 (첫 회차)",
    monthlyUnit: "원",
    firstPayment: "첫 회차",
    lastPayment: "마지막 회차",
    totalPrincipal: "총 원금",
    totalInterest: "총 이자",
    totalPayment: "총 상환액",
    scheduleHeader: "회차별 상환표",
    scheduleSampleNote: "60회 이상은 6개월 단위 표시",
    colMonth: "회차",
    colPayment: "상환액",
    colPrincipal: "원금",
    colInterest: "이자",
    colBalance: "잔금",
    sourceTitle: "공식 · 가정",
    sourceLines: [
      "원리금균등: M = P × r(1+r)^n / ((1+r)^n − 1). 매월 같은 금액.",
      "원금균등: 매월 원금 = P/n, 이자 = 잔금 × r. 총 이자는 균등보다 약 4~5% 적음.",
      "만기일시: 매월 이자만 P × r, 만기에 원금 일시상환. 한국 신용대출·전세자금대출 보편.",
      "월이율 r = 연이율 / 12. 한국 대출 표준 (단리 환산).",
      "중도상환 수수료·인지세·DSR 한도 등 부대 비용 미반영.",
    ],
  },
  en: {
    sectionPrincipal: "Principal · Period",
    sectionType: "Repayment type",
    fieldPrincipal: "Loan principal (₩)",
    fieldYears: "Loan period (years)",
    fieldRate: "Annual rate (%)",
    fieldType: "Select repayment type",
    types: {
      equalPayment: "Equal payment — same monthly amount",
      equalPrincipal: "Equal principal — high → low monthly",
      balloon: "Balloon — interest only, principal at maturity",
    } satisfies Record<LoanType, string>,
    calculate: "Calculate",
    reset: "Reset",
    resultHeading: "Repayment Plan",
    resultEmpty: "Enter principal, rate, and period.",
    error: "Calculation failed",
    monthlyLabel: "Monthly payment (1st)",
    monthlyUnit: "₩",
    firstPayment: "1st payment",
    lastPayment: "Last payment",
    totalPrincipal: "Total principal",
    totalInterest: "Total interest",
    totalPayment: "Total payment",
    scheduleHeader: "Schedule",
    scheduleSampleNote: "Long terms sampled every 6 months",
    colMonth: "Month",
    colPayment: "Payment",
    colPrincipal: "Principal",
    colInterest: "Interest",
    colBalance: "Balance",
    sourceTitle: "Formulas · assumptions",
    sourceLines: [
      "Equal payment: M = P × r(1+r)^n / ((1+r)^n − 1).",
      "Equal principal: monthly principal = P/n, interest = balance × r. ~4-5% less total interest.",
      "Balloon: monthly = P × r (interest only), balance + last month interest at maturity.",
      "Monthly rate r = annual / 12 (Korean standard simple-rate division).",
      "Prepayment fees, stamp duty, DSR limits not included.",
    ],
  },
} as const;

export function LoanForm({ locale }: LoanFormProps): React.ReactElement {
  const t = T[locale];
  const [result, setResult] = useState<LoanResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<LoanInputResolved>({
    resolver: zodResolver(loanInputSchema),
    defaultValues: {
      principal: 100_000_000,
      annualRatePercent: 5,
      years: 10,
      loanType: "equalPayment",
    },
  });

  const onSubmit = (values: LoanInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateLoan(values));
    } catch {
      setResult(null);
      setCalcError(t.error);
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
        <FieldGroup title={t.sectionPrincipal}>
          <Field label={t.fieldPrincipal}>
            <input
              type="number"
              step="1000000"
              inputMode="numeric"
              className="input-base"
              {...register("principal", { valueAsNumber: true })}
            />
          </Field>
          <Field label={t.fieldYears}>
            <input
              type="number"
              step="1"
              inputMode="numeric"
              className="input-base"
              {...register("years", { valueAsNumber: true })}
            />
          </Field>
          <Field label={t.fieldRate}>
            <input
              type="number"
              step="0.1"
              inputMode="decimal"
              className="input-base"
              {...register("annualRatePercent", { valueAsNumber: true })}
            />
          </Field>
        </FieldGroup>

        <FieldGroup title={t.sectionType}>
          <Field label={t.fieldType}>
            <select className="input-base" {...register("loanType")}>
              <option value="equalPayment">{t.types.equalPayment}</option>
              <option value="equalPrincipal">{t.types.equalPrincipal}</option>
              <option value="balloon">{t.types.balloon}</option>
            </select>
          </Field>
        </FieldGroup>

        <ActionRow
          primary={
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {t.calculate}
            </button>
          }
          secondary={
            <button type="button" onClick={onReset} className="btn-ghost sm:w-auto">
              {t.reset}
            </button>
          }
        />
      </FormShell>

      <ResultShell heading={t.resultHeading}>
        {calcError && <ErrorBox message={calcError} />}
        {!calcError && !result && <EmptyResult message={t.resultEmpty} />}
        {result && (
          <div className="animate-fade-up space-y-5">
            <HeroResult
              label={t.monthlyLabel}
              value={won(result.firstPayment)}
              unit={t.monthlyUnit}
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat label={t.firstPayment} value={`${won(result.firstPayment)} ${t.monthlyUnit}`} />
              <Stat label={t.lastPayment} value={`${won(result.lastPayment)} ${t.monthlyUnit}`} />
              <Stat label={t.totalPrincipal} value={`${won(result.totalPrincipal)} ${t.monthlyUnit}`} />
              <Stat label={t.totalInterest} value={`${won(result.totalInterest)} ${t.monthlyUnit}`} />
              <Stat label={t.totalPayment} value={`${won(result.totalPayment)} ${t.monthlyUnit}`} />
            </dl>

            <div>
              <div className="mb-2.5 flex items-baseline justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                  {t.scheduleHeader}
                </h3>
                {!result.fullSchedule && (
                  <span className="text-[10px] text-[color:var(--color-text-muted)]">
                    {t.scheduleSampleNote}
                  </span>
                )}
              </div>
              <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[color:var(--color-border-subtle)] text-[color:var(--color-text-tertiary)]">
                      <th className="px-3 py-2 text-left font-medium">{t.colMonth}</th>
                      <th className="px-3 py-2 text-right font-medium">{t.colPayment}</th>
                      <th className="px-3 py-2 text-right font-medium">{t.colPrincipal}</th>
                      <th className="px-3 py-2 text-right font-medium">{t.colInterest}</th>
                      <th className="px-3 py-2 text-right font-medium">{t.colBalance}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((row) => (
                      <tr
                        key={row.month}
                        className="border-b border-[color:var(--color-border-subtle)]/50 last:border-0 tabular-nums text-[color:var(--color-text-secondary)]"
                      >
                        <td className="px-3 py-1.5">{row.month}</td>
                        <td className="px-3 py-1.5 text-right text-[color:var(--color-text-primary)]">
                          {won(row.payment)}
                        </td>
                        <td className="px-3 py-1.5 text-right">{won(row.principal)}</td>
                        <td className="px-3 py-1.5 text-right">{won(row.interest)}</td>
                        <td className="px-3 py-1.5 text-right">{won(row.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <SourceBox lines={[t.sourceTitle, ...t.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
