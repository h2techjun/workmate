"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BRACKETS_2026,
  calculateIncomeTax,
  incomeTaxInputSchema,
  type IncomeTaxInputResolved,
  type IncomeTaxResult,
} from "@/lib/calculations/tax/incomeTax";
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

interface IncomeTaxFormProps {
  locale: "ko" | "en";
}

const won = (n: number): string => Math.round(n).toLocaleString("ko-KR");

const T = {
  ko: {
    sectionIncome: "과세표준",
    sectionOptions: "옵션",
    fieldTaxable: "종합소득 과세표준 (원)",
    fieldTaxableHint: "종합소득금액 − 종합소득공제 = 과세표준",
    fieldWageCredit: "근로소득세액공제 적용 (근로자)",
    calculate: "계산하기",
    reset: "초기화",
    resultHeading: "세금 산출",
    resultEmpty: "과세표준을 입력하세요.",
    error: "계산 오류",
    heroLabel: "총 세부담 (소득세 + 지방세)",
    heroUnit: "원",
    marginalRate: "한계세율",
    calculatedTax: "소득세 (산출)",
    wageCredit: "근로소득세액공제",
    finalTax: "결정세액",
    localTax: "지방소득세 (10%)",
    effectiveRate: "실효세율",
    bracketsHeading: "2026 종합소득세 구간",
    colBracket: "과세표준",
    colRate: "세율",
    colDeduction: "누진공제",
    sourceTitle: "법령 · 가정",
    sourceLines: [
      "소득세법 §55: 8구간 누진세율 (6%·15%·24%·35%·38%·40%·42%·45%, 2023 개정).",
      "산출세액 = 과세표준 × 한계세율 − 누진공제.",
      "지방소득세 = 결정세액 × 10% (별도 신고지만 자동 산출).",
      "근로소득세액공제 (§59): 산출 130만 이하 55%, 초과 30% + 총급여 한도.",
      "자녀·연금저축·의료비 등 세액공제는 별도 차감 (이 계산기는 미포함).",
    ],
  },
  en: {
    sectionIncome: "Taxable Income",
    sectionOptions: "Options",
    fieldTaxable: "Taxable income (₩)",
    fieldTaxableHint: "Gross income − deductions = taxable base",
    fieldWageCredit: "Apply wage earner credit (employee)",
    calculate: "Calculate",
    reset: "Reset",
    resultHeading: "Tax Breakdown",
    resultEmpty: "Enter taxable income.",
    error: "Calculation failed",
    heroLabel: "Total tax (income + local)",
    heroUnit: "₩",
    marginalRate: "Marginal rate",
    calculatedTax: "Income tax",
    wageCredit: "Wage earner credit",
    finalTax: "Final tax",
    localTax: "Local income tax (10%)",
    effectiveRate: "Effective rate",
    bracketsHeading: "2026 Korean Tax Brackets",
    colBracket: "Taxable income",
    colRate: "Rate",
    colDeduction: "Progressive deduction",
    sourceTitle: "Law · assumptions",
    sourceLines: [
      "Korean Income Tax Act §55: 8 progressive brackets (6%/15%/24%/35%/38%/40%/42%/45%).",
      "Tax = base × marginal rate − progressive deduction.",
      "Local income tax = final tax × 10%.",
      "Wage earner credit (§59): 55% of tax up to ₩1.3M, then 30%, capped by gross income.",
      "Child / pension / medical credits are not included here.",
    ],
  },
} as const;

function formatBracket(upper: number | null, prev: number, isKo: boolean): string {
  if (upper === null) {
    return isKo
      ? `${(prev / 100_000_000).toFixed(0)}억 초과`
      : `Over ₩${(prev / 100_000_000).toFixed(0)}00M`;
  }
  if (isKo) {
    return prev === 0
      ? `${(upper / 10_000).toLocaleString("ko-KR")}만 이하`
      : `${(prev / 10_000).toLocaleString("ko-KR")}만 ~ ${(upper / 10_000).toLocaleString("ko-KR")}만`;
  }
  return prev === 0
    ? `≤ ₩${(upper / 10_000).toLocaleString()}0`
    : `₩${(prev / 10_000).toLocaleString()}0 ~ ₩${(upper / 10_000).toLocaleString()}0`;
}

export function IncomeTaxForm({ locale }: IncomeTaxFormProps): React.ReactElement {
  const t = T[locale];
  const [result, setResult] = useState<IncomeTaxResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IncomeTaxInputResolved>({
    resolver: zodResolver(incomeTaxInputSchema),
    defaultValues: {
      taxableIncome: 50_000_000,
      applyWageEarnerCredit: false,
    },
  });

  const onSubmit = (values: IncomeTaxInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateIncomeTax(values));
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
        <FieldGroup title={t.sectionIncome}>
          <Field label={t.fieldTaxable} hint={t.fieldTaxableHint}>
            <input
              type="number"
              step="100000"
              inputMode="numeric"
              className="input-base"
              {...register("taxableIncome", { valueAsNumber: true })}
            />
          </Field>
        </FieldGroup>

        <FieldGroup title={t.sectionOptions}>
          <label className="flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)]">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[color:var(--color-border-subtle)] bg-transparent"
              {...register("applyWageEarnerCredit")}
            />
            <span>{t.fieldWageCredit}</span>
          </label>
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
              label={t.heroLabel}
              value={won(result.totalTax)}
              unit={t.heroUnit}
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t.marginalRate}
                value={`${(result.marginalRate * 100).toFixed(0)}%`}
              />
              <Stat
                label={t.effectiveRate}
                value={`${(result.effectiveRate * 100).toFixed(2)}%`}
              />
              <Stat label={t.calculatedTax} value={`${won(result.calculatedTax)} 원`} />
              {result.wageEarnerCredit > 0 && (
                <Stat
                  label={t.wageCredit}
                  value={`−${won(result.wageEarnerCredit)} 원`}
                  tone="success"
                />
              )}
              <Stat
                label={t.finalTax}
                value={`${won(result.finalTax)} 원`}
                full={result.wageEarnerCredit === 0}
              />
              <Stat label={t.localTax} value={`${won(result.localIncomeTax)} 원`} />
            </dl>

            <div>
              <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                {t.bracketsHeading}
              </h3>
              <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[color:var(--color-border-subtle)] text-[color:var(--color-text-tertiary)]">
                      <th className="px-3 py-2 text-left font-medium">{t.colBracket}</th>
                      <th className="px-3 py-2 text-right font-medium">{t.colRate}</th>
                      <th className="px-3 py-2 text-right font-medium">
                        {t.colDeduction}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {BRACKETS_2026.map((b, i) => {
                      const prev = i === 0 ? 0 : (BRACKETS_2026[i - 1]?.upper ?? 0);
                      const isActive = b.rate === result.marginalRate;
                      return (
                        <tr
                          key={i}
                          className={`border-b border-[color:var(--color-border-subtle)]/50 last:border-0 tabular-nums ${
                            isActive
                              ? "bg-indigo-500/10 text-white"
                              : "text-[color:var(--color-text-secondary)]"
                          }`}
                        >
                          <td className="px-3 py-1.5">
                            {formatBracket(b.upper, prev, locale === "ko")}
                          </td>
                          <td className="px-3 py-1.5 text-right">
                            {(b.rate * 100).toFixed(0)}%
                          </td>
                          <td className="px-3 py-1.5 text-right">
                            {b.deduction === 0 ? "—" : `${won(b.deduction)} 원`}
                          </td>
                        </tr>
                      );
                    })}
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
