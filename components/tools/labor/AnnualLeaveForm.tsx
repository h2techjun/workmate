"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  calculateAnnualLeave,
  type AnnualLeaveInput,
  type AnnualLeaveResult,
  type AnnualLeaveStep,
  type AnnualLeaveWarning,
} from "@/lib/calculations/labor/annualLeave";
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
  StepsBox,
  WarningsBox,
} from "@/components/ui/calc-form";

interface FormValues {
  hireDate: string;
  referenceDate: string;
  attendanceOver80: boolean;
  wageMode: "monthly" | "daily";
  monthlySalary: number;
  dailyOrdinaryWage: number;
  unusedDays: number;
}

const formatKrw = (n: number): string =>
  new Intl.NumberFormat("ko-KR").format(Math.round(n));

const todayIso = (): string => new Date().toISOString().slice(0, 10);

export function AnnualLeaveForm(): React.ReactElement {
  const t = useTranslations("annualLeaveTool");
  const [result, setResult] = useState<AnnualLeaveResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      hireDate: "",
      referenceDate: todayIso(),
      attendanceOver80: true,
      wageMode: "monthly",
      monthlySalary: 3_000_000,
      dailyOrdinaryWage: 0,
      unusedDays: 0,
    },
  });

  const wageMode = watch("wageMode");

  const onSubmit = (values: FormValues): void => {
    setCalcError(null);
    const input: AnnualLeaveInput = {
      hireDate: values.hireDate,
      referenceDate: values.referenceDate || undefined,
      attendanceOver80: values.attendanceOver80,
      wageMode: values.wageMode,
      unusedDays: Number(values.unusedDays) || 0,
      monthlySalary:
        values.wageMode === "monthly"
          ? Number(values.monthlySalary) || undefined
          : undefined,
      dailyOrdinaryWage:
        values.wageMode === "daily"
          ? Number(values.dailyOrdinaryWage) || undefined
          : undefined,
    };
    try {
      const r = calculateAnnualLeave(input);
      setResult(r);
      if (!r.ok) {
        setCalcError(t("errors.invalid"));
      }
    } catch {
      setResult(null);
      setCalcError(t("errors.unknown"));
    }
  };

  const onReset = (): void => {
    reset();
    setResult(null);
    setCalcError(null);
  };

  const renderWarning = (w: AnnualLeaveWarning): string => {
    switch (w.code) {
      case "future-hire-date":
        return t("warnings.futureHireDate");
      case "low-attendance":
        return t("warnings.lowAttendance");
      case "missing-wage":
        return t("warnings.missingWage");
      case "negative-unused":
        return t("warnings.negativeUnused");
    }
  };

  const renderStep = (s: AnnualLeaveStep): string => {
    const v = s.values ?? {};
    switch (s.kind) {
      case "header":
        return t("steps.tenure", {
          years: String(v.years ?? 0),
          totalMonths: String(v.totalMonths ?? 0),
        });
      case "monthly-accrual":
        return t("steps.monthlyAccrual", {
          totalMonths: String(v.totalMonths ?? 0),
          daysAccrued: String(v.daysAccrued ?? 0),
          cap: String(v.cap ?? 11),
        });
      case "annual-base":
        return t("steps.annualBase", {
          years: String(v.years ?? 1),
          base: String(v.base ?? 15),
        });
      case "annual-increment":
        return t("steps.annualIncrement", {
          years: String(v.years ?? 0),
          interval: String(v.interval ?? 2),
          increments: String(v.increments ?? 0),
          total: String(v.total ?? 0),
        });
      case "cap-applied":
        return t("steps.capApplied", { cap: String(v.cap ?? 25) });
      case "wage-derive":
        return t("steps.wageDerive", {
          monthly: formatKrw(Number(v.monthly ?? 0)),
          daily: formatKrw(Number(v.daily ?? 0)),
        });
      case "compensation":
        return t("steps.compensation", {
          unused: String(v.unused ?? 0),
          daily: formatKrw(Number(v.daily ?? 0)),
          total: formatKrw(Number(v.total ?? 0)),
        });
      case "rule":
        return t(s.labelKey as never);
    }
  };

  const errMsg = (m?: string): string | undefined =>
    m ? t(m as never) : undefined;

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={t("sections.tenure")}>
          <Field
            label={t("fields.hireDate")}
            hint={t("hints.hireDate")}
            error={errMsg(errors.hireDate?.message)}
          >
            <input
              type="date"
              className="input-base"
              {...register("hireDate", {
                required: "validation.hireDateRequired",
              })}
            />
          </Field>
          <Field
            label={t("fields.referenceDate")}
            hint={t("hints.referenceDate")}
          >
            <input
              type="date"
              className="input-base"
              {...register("referenceDate")}
            />
          </Field>
          <Field label={t("fields.attendanceOver80")}>
            <label className="flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)]"
                {...register("attendanceOver80")}
              />
              <span>{t("hints.attendanceOver80")}</span>
            </label>
          </Field>
        </FieldGroup>

        <FieldGroup title={t("sections.compensation")}>
          <Field label={t("fields.wageMode")} hint={t("hints.wageMode")}>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] px-3 py-2 text-sm">
                <input
                  type="radio"
                  value="monthly"
                  {...register("wageMode")}
                />
                <span>{t("wageMode.monthly")}</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] px-3 py-2 text-sm">
                <input type="radio" value="daily" {...register("wageMode")} />
                <span>{t("wageMode.daily")}</span>
              </label>
            </div>
          </Field>

          {wageMode === "monthly" ? (
            <Field
              label={t("fields.monthlySalary")}
              hint={t("hints.monthlySalary")}
            >
              <input
                type="number"
                step="10000"
                inputMode="numeric"
                className="input-base"
                {...register("monthlySalary", { valueAsNumber: true })}
              />
            </Field>
          ) : (
            <Field
              label={t("fields.dailyOrdinaryWage")}
              hint={t("hints.dailyOrdinaryWage")}
            >
              <input
                type="number"
                step="1000"
                inputMode="numeric"
                className="input-base"
                {...register("dailyOrdinaryWage", { valueAsNumber: true })}
              />
            </Field>
          )}

          <Field
            label={t("fields.unusedDays")}
            hint={t("hints.unusedDays")}
          >
            <input
              type="number"
              step="1"
              min={0}
              inputMode="numeric"
              className="input-base"
              {...register("unusedDays", { valueAsNumber: true })}
            />
          </Field>
        </FieldGroup>

        <ActionRow
          primary={
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {t("actions.calculate")}
            </button>
          }
          secondary={
            <button type="button" onClick={onReset} className="btn-ghost">
              {t("actions.reset")}
            </button>
          }
        />
      </FormShell>

      <ResultShell heading={t("result.heading")} showActions={result?.ok}>
        {calcError ? <ErrorBox message={calcError} /> : null}

        {!result || !result.ok ? (
          <EmptyResult message={t("result.empty")} />
        ) : (
          <div className="space-y-5">
            <HeroResult
              label={t("result.daysLabel")}
              value={String(result.daysAccrued)}
              unit={t("result.daysSuffix")}
            />

            <p className="text-xs text-[color:var(--color-text-tertiary)]">
              {t("result.daysHint", {
                years: String(result.yearsWorked),
                months: String(result.monthsWorked),
              })}
            </p>

            <div className="grid gap-3 sm:grid-cols-2">
              <Stat
                label={t("result.nextLabel")}
                value={`${result.daysAtNextAnniversary}${t("result.daysSuffix")}`}
              />
              <Stat
                label={t("result.compensationLabel")}
                value={
                  result.compensation > 0
                    ? `${formatKrw(result.compensation)}${t("result.wonSuffix")}`
                    : t("result.compensationEmpty")
                }
                tone={result.compensation > 0 ? "success" : "default"}
              />
            </div>

            <StepsBox
              title={t("steps.heading")}
              items={result.steps.map(renderStep)}
            />

            {result.warnings.length > 0 ? (
              <WarningsBox
                title={t("warnings.heading")}
                items={result.warnings.map(renderWarning)}
              />
            ) : null}

            <SourceBox lines={[t("source")]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
