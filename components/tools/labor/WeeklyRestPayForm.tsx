"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslations } from "next-intl";
import { NumberField } from "@/components/ui/NumberField";
import {
  calculateWeeklyRestPay,
  type WeeklyRestPayInput,
  type WeeklyRestPayResult,
} from "@/lib/calculations/labor/weeklyRestPay";
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
  wageMode: "hourly" | "monthly";
  hourlyWage: number;
  monthlySalary: number;
  weeklyHours: number;
}

const formatKrw = (n: number): string =>
  new Intl.NumberFormat("ko-KR").format(Math.round(n));

export function WeeklyRestPayForm(): React.ReactElement {
  const t = useTranslations("weeklyRestPayTool");
  const [result, setResult] = useState<WeeklyRestPayResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm<FormValues>({
    defaultValues: {
      wageMode: "hourly",
      hourlyWage: 10_320,
      monthlySalary: 2_156_880,
      weeklyHours: 40,
    },
  });

  const wageMode = watch("wageMode");

  const onSubmit = (values: FormValues): void => {
    setCalcError(null);
    const input: WeeklyRestPayInput = {
      hourlyWage:
        values.wageMode === "hourly"
          ? values.hourlyWage || undefined
          : undefined,
      monthlySalary:
        values.wageMode === "monthly"
          ? values.monthlySalary || undefined
          : undefined,
      weeklyHours: values.weeklyHours || undefined,
    };
    try {
      const r = calculateWeeklyRestPay(input);
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
      case "steps.deriveHourly":
        return t("steps.deriveHourly", {
          monthlySalary: fmt("monthlySalary"),
          hourlyWage: fmt("hourlyWage"),
        });
      case "steps.notQualified":
        return t("steps.notQualified", {
          weeklyHours: String(v.weeklyHours ?? 0),
        });
      case "steps.fullTime":
        return t("steps.fullTime", {
          weeklyHours: String(v.weeklyHours ?? 0),
          restHours: String(v.restHours ?? 0),
        });
      case "steps.partTime":
        return t("steps.partTime", {
          weeklyHours: String(v.weeklyHours ?? 0),
          restHours: String(v.restHours ?? 0),
        });
      case "steps.weeklyAmount":
        return t("steps.weeklyAmount", {
          restHours: String(v.restHours ?? 0),
          hourlyWage: fmt("hourlyWage"),
          weeklyAmount: fmt("weeklyAmount"),
        });
      case "steps.monthlyAmount":
        return t("steps.monthlyAmount", {
          weeklyAmount: fmt("weeklyAmount"),
          monthlyAmount: fmt("monthlyAmount"),
        });
      case "steps.annualAmount":
        return t("steps.annualAmount", {
          monthlyAmount: fmt("monthlyAmount"),
          annualAmount: fmt("annualAmount"),
        });
      default:
        return "";
    }
  };

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={t("sections.wage")}>
          <Field label={t("fields.wageMode")} hint={t("hints.wageMode")}>
            <div className="grid grid-cols-2 gap-2">
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] px-3 py-2 text-sm">
                <input type="radio" value="hourly" {...register("wageMode")} />
                <span>{t("wageMode.hourly")}</span>
              </label>
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] px-3 py-2 text-sm">
                <input type="radio" value="monthly" {...register("wageMode")} />
                <span>{t("wageMode.monthly")}</span>
              </label>
            </div>
          </Field>
          {wageMode === "hourly" ? (
            <Controller
              control={control}
              name="hourlyWage"
              render={({ field }) => (
                <Field label={t("fields.hourlyWage")} hint={t("hints.hourlyWage")}>
                  <NumberField
                    value={field.value}
                    onChange={field.onChange}
                    thousands
                    decimals={0}
                    min={0}
                    suffix="원"
                    aria-label={t("fields.hourlyWage")}
                  />
                </Field>
              )}
            />
          ) : (
            <Controller
              control={control}
              name="monthlySalary"
              render={({ field }) => (
                <Field
                  label={t("fields.monthlySalary")}
                  hint={t("hints.monthlySalary")}
                >
                  <NumberField
                    value={field.value}
                    onChange={field.onChange}
                    thousands
                    decimals={0}
                    min={0}
                    suffix="원"
                    aria-label={t("fields.monthlySalary")}
                  />
                </Field>
              )}
            />
          )}
        </FieldGroup>

        <FieldGroup title={t("sections.hours")}>
          <Controller
            control={control}
            name="weeklyHours"
            render={({ field }) => (
              <Field label={t("fields.weeklyHours")} hint={t("hints.weeklyHours")}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  min={1}
                  max={80}
                  aria-label={t("fields.weeklyHours")}
                />
              </Field>
            )}
          />
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

      <ResultShell heading={t("result.heading")}>
        {calcError ? <ErrorBox message={calcError} /> : null}

        {!result || !result.ok ? (
          <EmptyResult message={t("result.empty")} />
        ) : !result.qualified ? (
          <div className="space-y-4">
            <WarningsBox
              title={t("result.notQualifiedTitle")}
              items={[t("result.notQualifiedBody", { hours: result.weeklyHours })]}
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
              label={t("result.weeklyLabel")}
              value={formatKrw(result.weeklyAmount)}
              unit={t("result.wonSuffix")}
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <Stat
                label={t("result.monthlyLabel")}
                value={`${formatKrw(result.monthlyAmount)}${t("result.wonSuffix")}`}
                tone="success"
              />
              <Stat
                label={t("result.annualLabel")}
                value={`${formatKrw(result.annualAmount)}${t("result.wonSuffix")}`}
              />
              <Stat
                label={t("result.restHoursLabel")}
                value={`${result.restHours.toFixed(1)}${t("result.hoursSuffix")}`}
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
