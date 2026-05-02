"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import {
  calculateMinWageMonthly,
  type MinWageInput,
  type MinWageResult,
} from "@/lib/calculations/labor/minWageMonthly";
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
} from "@/components/ui/calc-form";

interface FormValues {
  hourlyWage: number;
  weeklyHours: number;
  includeWeeklyRest: boolean;
  year: "2025" | "2026";
}

const formatKrw = (n: number): string =>
  new Intl.NumberFormat("ko-KR").format(Math.round(n));

export function MinWageMonthlyForm(): React.ReactElement {
  const t = useTranslations("minWageTool");
  const [result, setResult] = useState<MinWageResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      hourlyWage: 10_030,
      weeklyHours: 40,
      includeWeeklyRest: true,
      year: "2025",
    },
  });

  const onSubmit = (values: FormValues): void => {
    setCalcError(null);
    const input: MinWageInput = {
      hourlyWage: Number(values.hourlyWage) || undefined,
      weeklyHours: Number(values.weeklyHours) || undefined,
      includeWeeklyRest: values.includeWeeklyRest,
      year: values.year,
    };
    try {
      setResult(calculateMinWageMonthly(input));
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
      case "steps.input":
        return t("steps.input", {
          hourlyWage: fmt("hourlyWage"),
          weeklyHours: String(v.weeklyHours ?? 0),
          year: String(v.year ?? ""),
        });
      case "steps.monthlyHoursWithRest":
        return t("steps.monthlyHoursWithRest", {
          weeklyHours: String(v.weeklyHours ?? 0),
          monthlyHours: String(v.monthlyHours ?? 0),
        });
      case "steps.monthlyHoursNoRest":
        return t("steps.monthlyHoursNoRest", {
          weeklyHours: String(v.weeklyHours ?? 0),
          monthlyHours: String(v.monthlyHours ?? 0),
        });
      case "steps.monthlySalary":
        return t("steps.monthlySalary", {
          hourlyWage: fmt("hourlyWage"),
          monthlyHours: String(v.monthlyHours ?? 0),
          monthlySalary: fmt("monthlySalary"),
        });
      case "steps.annualSalary":
        return t("steps.annualSalary", {
          monthlySalary: fmt("monthlySalary"),
          annualSalary: fmt("annualSalary"),
        });
      default:
        return "";
    }
  };

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={t("sections.wage")}>
          <Field label={t("fields.year")} hint={t("hints.year")}>
            <select className="input-base" {...register("year")}>
              <option value="2025">2025 (10,030원)</option>
              <option value="2026">2026 ({t("hints.tbd")})</option>
            </select>
          </Field>
          <Field label={t("fields.hourlyWage")} hint={t("hints.hourlyWage")}>
            <input
              type="number"
              step="10"
              inputMode="numeric"
              min={0}
              className="input-base"
              {...register("hourlyWage", { valueAsNumber: true })}
            />
          </Field>
        </FieldGroup>

        <FieldGroup title={t("sections.hours")}>
          <Field label={t("fields.weeklyHours")} hint={t("hints.weeklyHours")}>
            <input
              type="number"
              step="1"
              inputMode="numeric"
              min={1}
              max={52}
              className="input-base"
              {...register("weeklyHours", { valueAsNumber: true })}
            />
          </Field>
          <Field label={t("fields.includeWeeklyRest")}>
            <label className="flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded"
                {...register("includeWeeklyRest")}
              />
              <span>{t("hints.includeWeeklyRest")}</span>
            </label>
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

      <ResultShell heading={t("result.heading")} showActions={!!result}>
        {calcError ? <ErrorBox message={calcError} /> : null}

        {!result ? (
          <EmptyResult message={t("result.empty")} />
        ) : (
          <div className="space-y-5">
            <HeroResult
              label={t("result.monthlyLabel")}
              value={formatKrw(result.monthlySalary)}
              unit={t("result.wonSuffix")}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Stat
                label={t("result.annualLabel")}
                value={`${formatKrw(result.annualSalary)}${t("result.wonSuffix")}`}
                tone="success"
              />
              <Stat
                label={t("result.monthlyHoursLabel")}
                value={`${result.monthlyHours}${t("result.hoursSuffix")}`}
              />
              <Stat
                label={t("result.weeklyRestLabel")}
                value={
                  result.weeklyRestPay > 0
                    ? `${formatKrw(result.weeklyRestPay)}${t("result.wonSuffix")}`
                    : "—"
                }
              />
              <Stat
                label={t("result.hourlyLabel")}
                value={`${formatKrw(result.hourlyWage)}${t("result.wonSuffix")}`}
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
