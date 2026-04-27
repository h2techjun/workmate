"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  BreakerCalculationError,
  breakerInputSchema,
  calculateBreaker,
  type BreakerInputResolved,
  type BreakerResult,
  type BreakerStep,
  type BreakerWarning,
} from "@/lib/calculations/electric/breaker";
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

const fmt = (n: number, d: number = 2): string =>
  Number.isInteger(n) && Math.abs(n) < 1e6 ? n.toString() : n.toFixed(d);

export function BreakerForm(): React.ReactElement {
  const t = useTranslations("breakerTool");
  const [result, setResult] = useState<BreakerResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BreakerInputResolved>({
    resolver: zodResolver(breakerInputSchema),
    defaultValues: {
      loadCurrent: 80,
      loadType: "general",
      useElb: false,
    },
  });

  const renderStep = (s: BreakerStep): string => {
    switch (s.key) {
      case "minRating":
        return t("steps.minRating", {
          loadCurrent: s.loadCurrent,
          safetyFactor: fmt(s.safetyFactor, 2),
          result: fmt(s.result, 1),
        });
      case "selectRating":
        return t("steps.selectRating", {
          minRating: fmt(s.minRating, 1),
          breakerType: s.breakerType,
          result: s.result,
        });
      case "safetyMargin":
        return t("steps.safetyMargin", {
          rating: s.rating,
          loadCurrent: s.loadCurrent,
          result: fmt(s.result, 1),
        });
    }
  };

  const renderWarning = (w: BreakerWarning): string => {
    switch (w.key) {
      case "inverterWithElb":
        return t("warnings.inverterWithElb");
      case "marginLow":
        return t("warnings.marginLow", { threshold: w.threshold });
      case "highCurrentMcb":
        return t("warnings.highCurrentMcb");
    }
  };

  const onSubmit = (values: BreakerInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateBreaker(values));
    } catch (err) {
      setResult(null);
      if (err instanceof BreakerCalculationError) {
        setCalcError(t(`errors.${err.i18nKey}`));
        return;
      }
      setCalcError(t("errors.unknown"));
    }
  };
  const onReset = (): void => {
    reset();
    setResult(null);
    setCalcError(null);
  };
  const errMsg = (m?: string) => (m ? t(m as never) : undefined);

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={t("sections.load")}>
          <Field
            label={t("fields.loadCurrent")}
            error={errMsg(errors.loadCurrent?.message)}
          >
            <input
              type="number"
              step="0.1"
              inputMode="decimal"
              className="input-base"
              {...register("loadCurrent", { valueAsNumber: true })}
            />
          </Field>
          <Field label={t("fields.loadType")} hint={t("hints.loadType")}>
            <select className="input-base" {...register("loadType")}>
              <option value="general">{t("loadType.general")}</option>
              <option value="motorDirect">{t("loadType.motorDirect")}</option>
              <option value="motorYDelta">{t("loadType.motorYDelta")}</option>
              <option value="inverter">{t("loadType.inverter")}</option>
              <option value="welder">{t("loadType.welder")}</option>
            </select>
          </Field>
          <Field
            label={t("fields.customSafetyFactor")}
            hint={t("hints.customSafetyFactor")}
            error={errMsg(errors.customSafetyFactor?.message)}
          >
            <input
              type="number"
              step="0.05"
              inputMode="decimal"
              className="input-base"
              placeholder={t("hints.customSafetyFactorPlaceholder")}
              {...register("customSafetyFactor", {
                setValueAs: (v) =>
                  v === "" || v == null ? undefined : Number(v),
              })}
            />
          </Field>
          <Field label={t("fields.useElb")}>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[color:var(--color-text-secondary)]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-indigo-500"
                {...register("useElb")}
              />
              <span>{t("hints.useElb")}</span>
            </label>
          </Field>
        </FieldGroup>

        <ActionRow
          primary={
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1"
            >
              {t("actions.calculate")}
            </button>
          }
          secondary={
            <button
              type="button"
              onClick={onReset}
              className="btn-ghost sm:w-auto"
            >
              {t("actions.reset")}
            </button>
          }
        />
      </FormShell>

      <ResultShell heading={t("result.heading")}>
        {calcError && <ErrorBox message={calcError} />}
        {!calcError && !result && <EmptyResult message={t("result.empty")} />}
        {result && (
          <div className="animate-fade-up space-y-5">
            <HeroResult
              label={t("result.recommendedRating")}
              value={`${result.recommendedRating}A ${result.breakerType}`}
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t("result.appliedSafetyFactor")}
                value={`× ${fmt(result.appliedSafetyFactor, 2)}`}
              />
              <Stat
                label={t("result.calculatedMinRating")}
                value={`${fmt(result.calculatedMinRating, 1)} A`}
              />
              <Stat
                label={t("result.safetyMargin")}
                value={`${fmt(result.safetyMarginPercent, 1)}%`}
                tone={
                  result.safetyMarginPercent < 10
                    ? "warning"
                    : result.safetyMarginPercent > 20
                      ? "success"
                      : "default"
                }
                full
              />
            </dl>
            {result.warnings.length > 0 && (
              <WarningsBox
                title={t("result.warnings")}
                items={result.warnings.map(renderWarning)}
              />
            )}
            <StepsBox
              title={t("result.steps")}
              items={result.calculationSteps.map(renderStep)}
            />
            <SourceBox
              lines={[t("result.source.line1"), t("result.source.line2")]}
            />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
