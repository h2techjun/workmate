"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculateJeonseWolse,
  jeonseWolseInputSchema,
  type JeonseWolseInputResolved,
  type JeonseWolseResult,
} from "@/lib/calculations/realestate/jeonseWolse";
import { formatKrw, formatKoreanMoney } from "@/lib/utils/format";
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
import { NumberField } from "@/components/ui/NumberField";

interface JeonseWolseFormProps {
  locale: "ko" | "en";
}

const TEXT = {
  ko: {
    sectionMode: "변환 방향",
    fieldMode: "무엇을 환산하나요?",
    modeToMonthly: "전세 → 월세 (보증금 일부를 월세로)",
    modeToDeposit: "월세 → 전세 (환산 전세금)",
    fieldJeonse: "전세보증금 (원)",
    fieldKeep: "월세 전환 후 남길 보증금 (원)",
    fieldKeepHint: "0이면 전세금 전액을 월세로 환산",
    fieldMonthlyDeposit: "월세 보증금 (원)",
    fieldMonthlyRent: "월세 (원)",
    fieldRate: "전월세전환율 (%)",
    fieldRateHint: "법정 상한 4.5% (기준금리 2.5% + 2%). 실제는 협의 — 직접 수정 가능.",
    calculate: "환산하기",
    reset: "초기화",
    resultHeading: "전월세 환산 결과",
    resultEmpty: "방향과 금액을 입력하고 환산하세요.",
    error: "계산 중 오류가 발생했습니다.",
    monthlyResult: "환산 월세",
    jeonseResult: "환산 전세금",
    won: "원",
    convertedDeposit: "월세로 전환된 보증금",
    appliedRate: "적용 전환율",
    legalCap: "법정 상한",
    exceedWarn: "⚠️ 적용 전환율이 법정 상한(4.5%)을 초과합니다. 계약기간 중·갱신 시 전세→월세 전환에는 상한이 적용됩니다.",
    newContractWarn: "참고: 전환율 상한은 '계약 중·갱신 시 전세→월세 전환'에만 적용되고, 처음부터 월세로 내놓는 신규 계약에는 적용되지 않습니다.",
    sourceTitle: "공식 · 기준 (2026)",
    sourceLines: [
      "전세→월세: 월세 = (전세금 − 남길 보증금) × 전환율 ÷ 12",
      "월세→전세: 전세금 = 월세보증금 + (월세 × 12) ÷ 전환율",
      "법정 상한 = min(10%, 기준금리+2%) = 4.5% (주임법 §7조의2, 기준금리 2.5%)",
      "상한은 계약 중·갱신 전환에만 적용. 신규 계약·월세→전세는 강제 아님(참고용).",
      "참고용 추정. 실제 계약은 등기부·공인중개사·전문가 확인 필요.",
    ],
  },
  en: {
    sectionMode: "Direction",
    fieldMode: "What are you converting?",
    modeToMonthly: "Jeonse → monthly (convert part of the deposit to rent)",
    modeToDeposit: "Monthly → jeonse (deposit-equivalent)",
    fieldJeonse: "Jeonse deposit (₩)",
    fieldKeep: "Deposit to keep after conversion (₩)",
    fieldKeepHint: "0 = convert the entire jeonse deposit to rent",
    fieldMonthlyDeposit: "Monthly-rent deposit (₩)",
    fieldMonthlyRent: "Monthly rent (₩)",
    fieldRate: "Conversion rate (%)",
    fieldRateHint: "Legal cap 4.5% (base rate 2.5% + 2%). Actual is negotiable — edit freely.",
    calculate: "Convert",
    reset: "Reset",
    resultHeading: "Jeonse–Wolse result",
    resultEmpty: "Pick a direction, enter amounts, then convert.",
    error: "Calculation failed.",
    monthlyResult: "Monthly rent",
    jeonseResult: "Jeonse equivalent",
    won: "₩",
    convertedDeposit: "Deposit converted to rent",
    appliedRate: "Applied rate",
    legalCap: "Legal cap",
    exceedWarn: "⚠️ Your rate exceeds the 4.5% legal cap. The cap applies to jeonse→monthly conversions during the lease or at renewal.",
    newContractWarn: "Note: the rate cap applies only to converting jeonse to monthly during a lease or at renewal — not to a brand-new monthly-rent contract.",
    sourceTitle: "Formula · basis (2026)",
    sourceLines: [
      "Jeonse→monthly: rent = (jeonse − kept deposit) × rate ÷ 12",
      "Monthly→jeonse: jeonse = monthly deposit + (rent × 12) ÷ rate",
      "Legal cap = min(10%, base rate + 2%) = 4.5% (Housing Lease Act §7-2, base rate 2.5%)",
      "Cap applies only to conversions during/at-renewal of a lease; new contracts and monthly→jeonse are reference only.",
      "Reference estimate. Verify with the property register, a licensed agent, and a professional.",
    ],
  },
} as const;

export function JeonseWolseForm({
  locale,
}: JeonseWolseFormProps): React.ReactElement {
  const T = TEXT[locale];
  const [result, setResult] = useState<JeonseWolseResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<JeonseWolseInputResolved>({
    resolver: zodResolver(jeonseWolseInputSchema),
    defaultValues: {
      mode: "toMonthly",
      jeonseDeposit: 300_000_000,
      keepDeposit: 100_000_000,
      monthlyDeposit: 10_000_000,
      monthlyRent: 500_000,
      conversionRatePercent: 4.5,
    },
  });

  const mode = watch("mode");

  const onSubmit = (values: JeonseWolseInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateJeonseWolse(values));
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
        <FieldGroup title={T.sectionMode}>
          <Controller
            control={control}
            name="mode"
            render={({ field }) => (
              <Field label={T.fieldMode}>
                <select
                  className="input-base"
                  value={field.value}
                  onChange={field.onChange}
                >
                  <option value="toMonthly">{T.modeToMonthly}</option>
                  <option value="toDeposit">{T.modeToDeposit}</option>
                </select>
              </Field>
            )}
          />

          {mode === "toMonthly" ? (
            <>
              <Controller
                control={control}
                name="jeonseDeposit"
                render={({ field }) => (
                  <Field label={T.fieldJeonse}>
                    <NumberField
                      value={field.value}
                      onChange={field.onChange}
                      thousands
                      decimals={0}
                      suffix="원"
                      aria-label={T.fieldJeonse}
                    />
                    {locale === "ko" && field.value > 0 && (
                      <p className="mt-1.5 text-xs font-medium text-[color:var(--color-accent)]">
                        = {formatKoreanMoney(field.value)}
                      </p>
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="keepDeposit"
                render={({ field }) => (
                  <Field label={T.fieldKeep} hint={T.fieldKeepHint}>
                    <NumberField
                      value={field.value}
                      onChange={field.onChange}
                      thousands
                      decimals={0}
                      suffix="원"
                      aria-label={T.fieldKeep}
                    />
                    {locale === "ko" && field.value > 0 && (
                      <p className="mt-1.5 text-xs font-medium text-[color:var(--color-accent)]">
                        = {formatKoreanMoney(field.value)}
                      </p>
                    )}
                  </Field>
                )}
              />
            </>
          ) : (
            <>
              <Controller
                control={control}
                name="monthlyDeposit"
                render={({ field }) => (
                  <Field label={T.fieldMonthlyDeposit}>
                    <NumberField
                      value={field.value}
                      onChange={field.onChange}
                      thousands
                      decimals={0}
                      suffix="원"
                      aria-label={T.fieldMonthlyDeposit}
                    />
                    {locale === "ko" && field.value > 0 && (
                      <p className="mt-1.5 text-xs font-medium text-[color:var(--color-accent)]">
                        = {formatKoreanMoney(field.value)}
                      </p>
                    )}
                  </Field>
                )}
              />
              <Controller
                control={control}
                name="monthlyRent"
                render={({ field }) => (
                  <Field label={T.fieldMonthlyRent}>
                    <NumberField
                      value={field.value}
                      onChange={field.onChange}
                      thousands
                      decimals={0}
                      suffix="원"
                      aria-label={T.fieldMonthlyRent}
                    />
                    {locale === "ko" && field.value > 0 && (
                      <p className="mt-1.5 text-xs font-medium text-[color:var(--color-accent)]">
                        = {formatKoreanMoney(field.value)}
                      </p>
                    )}
                  </Field>
                )}
              />
            </>
          )}

          <Controller
            control={control}
            name="conversionRatePercent"
            render={({ field }) => (
              <Field label={T.fieldRate} hint={T.fieldRateHint}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={2}
                  min={0.1}
                  suffix="%"
                  aria-label={T.fieldRate}
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
            <div>
              <HeroResult
                label={result.mode === "toMonthly" ? T.monthlyResult : T.jeonseResult}
                value={formatKrw(
                  result.mode === "toMonthly" ? result.monthlyRent : result.jeonseEquivalent,
                )}
                unit={T.won}
              />
              {locale === "ko" && (
                <p className="mt-2 text-sm font-medium text-[color:var(--color-text-secondary)]">
                  ={" "}
                  {formatKoreanMoney(
                    result.mode === "toMonthly" ? result.monthlyRent : result.jeonseEquivalent,
                  )}
                  {result.mode === "toMonthly" ? "/월" : ""}
                </p>
              )}
            </div>

            <dl className="grid grid-cols-2 gap-3">
              {result.mode === "toMonthly" && (
                <Stat
                  label={T.convertedDeposit}
                  value={`${formatKrw(result.convertedDeposit)} ${T.won}`}
                />
              )}
              <Stat label={T.appliedRate} value={`${result.appliedRatePercent}%`} />
              <Stat
                label={T.legalCap}
                value={`${result.legalCapPercent}%`}
                tone={result.exceedsLegalCap ? "warning" : "default"}
              />
            </dl>

            {result.exceedsLegalCap && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                {T.exceedWarn}
              </div>
            )}

            <p className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-xs leading-relaxed text-[color:var(--color-text-tertiary)]">
              {T.newContractWarn}
            </p>

            <SourceBox lines={[T.sourceTitle, ...T.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
