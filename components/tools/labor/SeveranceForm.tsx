"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  calculateSeverance,
  type SeveranceInput,
  type SeveranceResult,
} from "@/lib/calculations/labor/severance";
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
  resignDate: string;
  recentThreeMonthsSalary: number;
  annualBonus: number;
  annualLeavePay: number;
  monthlyOrdinaryWage: number;
}

const formatKrw = (n: number): string =>
  new Intl.NumberFormat("ko-KR").format(Math.round(n));

const todayIso = (): string => new Date().toISOString().slice(0, 10);

export function SeveranceForm(): React.ReactElement {
  const t = useTranslations("severanceTool");
  const [result, setResult] = useState<SeveranceResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      hireDate: "",
      resignDate: todayIso(),
      recentThreeMonthsSalary: 9_000_000,
      annualBonus: 0,
      annualLeavePay: 0,
      monthlyOrdinaryWage: 0,
    },
  });

  const onSubmit = (values: FormValues): void => {
    setCalcError(null);
    const input: SeveranceInput = {
      hireDate: values.hireDate,
      resignDate: values.resignDate,
      recentThreeMonthsSalary: Number(values.recentThreeMonthsSalary) || 0,
      annualBonus: Number(values.annualBonus) || 0,
      annualLeavePay: Number(values.annualLeavePay) || 0,
      monthlyOrdinaryWage: Number(values.monthlyOrdinaryWage) || undefined,
    };
    try {
      const r = calculateSeverance(input);
      setResult(r);
      if (!r.ok) setCalcError(t("errors.invalid"));
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

  const renderStep = (s: { key: string; values?: Record<string, string | number> }): string => {
    const v = s.values ?? {};
    const fmt = (k: string): string => formatKrw(Number(v[k] ?? 0));
    switch (s.key) {
      case "steps.tenure":
        return t("steps.tenure", {
          years: String(v.years ?? 0),
          months: String(v.months ?? 0),
          days: String(v.days ?? 0),
          totalDays: String(v.totalDays ?? 0),
        });
      case "steps.notQualified":
        return t("steps.notQualified", {
          totalDays: String(v.totalDays ?? 0),
        });
      case "steps.averageWage":
        return t("steps.averageWage", {
          threeMonthSalary: fmt("threeMonthSalary"),
          bonusPortion: fmt("bonusPortion"),
          leavePayPortion: fmt("leavePayPortion"),
          total: fmt("total"),
          averageDailyWage: fmt("averageDailyWage"),
        });
      case "steps.ordinaryWage":
        return t("steps.ordinaryWage", {
          monthlyOrdinary: fmt("monthlyOrdinary"),
          ordinaryDailyWage: fmt("ordinaryDailyWage"),
        });
      case "steps.ordinaryApplied":
        return t("steps.ordinaryApplied", {
          averageDailyWage: fmt("averageDailyWage"),
          ordinaryDailyWage: fmt("ordinaryDailyWage"),
        });
      case "steps.severance":
        return t("steps.severance", {
          appliedDailyWage: fmt("appliedDailyWage"),
          serviceDays: String(v.serviceDays ?? 0),
          severance: fmt("severance"),
        });
      default:
        return "";
    }
  };

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={t("sections.tenure")}>
          <Field label={t("fields.hireDate")} hint={t("hints.hireDate")}>
            <input
              type="date"
              className="input-base"
              {...register("hireDate")}
            />
          </Field>
          <Field label={t("fields.resignDate")} hint={t("hints.resignDate")}>
            <input
              type="date"
              className="input-base"
              {...register("resignDate")}
            />
          </Field>
        </FieldGroup>

        <FieldGroup title={t("sections.wage")}>
          <Field
            label={t("fields.recentThreeMonthsSalary")}
            hint={t("hints.recentThreeMonthsSalary")}
          >
            <input
              type="number"
              step="100000"
              inputMode="numeric"
              min={0}
              className="input-base"
              {...register("recentThreeMonthsSalary", { valueAsNumber: true })}
            />
          </Field>
          <Field label={t("fields.annualBonus")} hint={t("hints.annualBonus")}>
            <input
              type="number"
              step="100000"
              inputMode="numeric"
              min={0}
              className="input-base"
              {...register("annualBonus", { valueAsNumber: true })}
            />
          </Field>
          <Field
            label={t("fields.annualLeavePay")}
            hint={t("hints.annualLeavePay")}
          >
            <input
              type="number"
              step="10000"
              inputMode="numeric"
              min={0}
              className="input-base"
              {...register("annualLeavePay", { valueAsNumber: true })}
            />
          </Field>
          <Field
            label={t("fields.monthlyOrdinaryWage")}
            hint={t("hints.monthlyOrdinaryWage")}
          >
            <input
              type="number"
              step="10000"
              inputMode="numeric"
              min={0}
              className="input-base"
              {...register("monthlyOrdinaryWage", { valueAsNumber: true })}
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
        ) : !result.qualified ? (
          <div className="space-y-4">
            <WarningsBox
              title={t("result.notQualifiedTitle")}
              items={[
                t("result.notQualifiedBody", { days: result.serviceDays }),
              ]}
            />
            <StepsBox
              title={t("steps.heading")}
              items={result.steps.map(renderStep)}
            />
            <SourceBox lines={[t("source")]} />
          </div>
        ) : (
          <div className="space-y-5">
            <HeroResult
              label={t("result.severanceLabel")}
              value={formatKrw(result.severance)}
              unit={t("result.wonSuffix")}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Stat
                label={t("result.tenureLabel")}
                value={t("result.tenureValue", {
                  years: result.serviceBreakdown.years,
                  months: result.serviceBreakdown.months,
                })}
                tone="success"
              />
              <Stat
                label={t("result.totalDaysLabel")}
                value={`${result.serviceDays}일`}
              />
              <Stat
                label={t("result.appliedDailyLabel")}
                value={`${formatKrw(result.appliedDailyWage)}${t("result.wonSuffix")}`}
              />
              <Stat
                label={t("result.averageDailyLabel")}
                value={`${formatKrw(result.averageDailyWage)}${t("result.wonSuffix")}`}
              />
            </div>

            <StepsBox
              title={t("steps.heading")}
              items={result.steps.map(renderStep)}
            />

            <SourceBox lines={[t("source")]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
