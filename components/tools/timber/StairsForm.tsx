"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  calculateStairs,
  stairsInputSchema,
  type StairsInputResolved,
  type StairsResult,
  type StairsStep,
  type StairWarning,
} from "@/lib/calculations/timber/stairs";
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

const fmt = (n: number, d: number = 1): string =>
  Number.isInteger(n) ? n.toString() : n.toFixed(d);

export function StairsForm(): React.ReactElement {
  const t = useTranslations("stairsTool");
  const [result, setResult] = useState<StairsResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StairsInputResolved>({
    resolver: zodResolver(stairsInputSchema),
    defaultValues: {
      totalRise: 2700,
      preferredRiser: 180,
      useType: "residential",
    },
  });

  const renderStep = (s: StairsStep): string => {
    switch (s.key) {
      case "numSteps":
        return t("steps.numSteps", {
          totalRise: s.totalRise,
          preferred: s.preferred,
          result: s.result,
        });
      case "actualRiser":
        return t("steps.actualRiser", {
          totalRise: s.totalRise,
          steps: s.steps,
          result: fmt(s.result),
        });
      case "treadFromRun":
        return t("steps.treadFromRun", {
          totalRun: s.totalRun,
          stepsMinus1: s.stepsMinus1,
          result: fmt(s.result),
        });
      case "treadFromBlondel":
        return t("steps.treadFromBlondel", {
          target: s.target,
          riser: fmt(s.riser),
          result: fmt(s.result),
        });
      case "stairLength":
        return t("steps.stairLength", {
          totalRise: s.totalRise,
          runDist: fmt(s.runDist),
          result: fmt(s.result),
        });
      case "angle":
        return t("steps.angle", {
          riser: fmt(s.riser),
          tread: fmt(s.tread),
          result: fmt(s.result, 2),
        });
      case "blondel":
        return t("steps.blondel", {
          riser: fmt(s.riser),
          tread: fmt(s.tread),
          result: fmt(s.result),
          min: s.min,
          max: s.max,
        });
    }
  };

  const renderWarning = (w: StairWarning): string => {
    switch (w.key) {
      case "riserTooHigh":
        return t("warnings.riserTooHigh", {
          actual: fmt(w.actual),
          max: w.max,
        });
      case "treadTooSmall":
        return t("warnings.treadTooSmall", {
          actual: fmt(w.actual),
          min: w.min,
        });
      case "blondelOutOfRange":
        return t("warnings.blondelOutOfRange", {
          value: fmt(w.value),
          min: w.min,
          max: w.max,
        });
      case "preferredRiserExceedsLimit":
        return t("warnings.preferredRiserExceedsLimit", {
          preferred: w.preferred,
          max: w.max,
        });
    }
  };

  const onSubmit = (values: StairsInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateStairs(values));
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
  const errMsg = (m?: string) => (m ? t(m as never) : undefined);

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={t("sections.geometry")}>
          <Field
            label={t("fields.totalRise")}
            error={errMsg(errors.totalRise?.message)}
          >
            <input
              type="number"
              step="any"
              inputMode="decimal"
              className="input-base"
              {...register("totalRise", { valueAsNumber: true })}
            />
          </Field>
          <Field
            label={t("fields.totalRun")}
            hint={t("hints.totalRun")}
            error={errMsg(errors.totalRun?.message)}
          >
            <input
              type="number"
              step="any"
              inputMode="decimal"
              className="input-base"
              {...register("totalRun", {
                setValueAs: (v) => (v === "" || v == null ? undefined : Number(v)),
              })}
            />
          </Field>
          <Field
            label={t("fields.preferredRiser")}
            hint={t("hints.preferredRiser")}
            error={errMsg(errors.preferredRiser?.message)}
          >
            <input
              type="number"
              step="any"
              inputMode="decimal"
              className="input-base"
              {...register("preferredRiser", { valueAsNumber: true })}
            />
          </Field>
        </FieldGroup>

        <FieldGroup title={t("sections.options")}>
          <Field label={t("fields.useType")}>
            <select className="input-base" {...register("useType")}>
              <option value="residential">{t("useType.residential")}</option>
              <option value="public">{t("useType.public")}</option>
            </select>
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
              label={t("result.numSteps")}
              value={result.numSteps.toString()}
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t("result.actualRiser")}
                value={`${fmt(result.actualRiser)} mm`}
                tone={result.riserOk ? "success" : "warning"}
              />
              <Stat
                label={t("result.tread")}
                value={`${fmt(result.tread)} mm`}
                tone={result.treadOk ? "success" : "warning"}
              />
              <Stat
                label={t("result.angle")}
                value={`${fmt(result.angleDegrees, 2)}°`}
              />
              <Stat
                label={t("result.stairLength")}
                value={`${fmt(result.stairLength)} mm`}
              />
              <Stat
                label={t("result.blondel")}
                value={`${fmt(result.blondelValue)} mm`}
                tone={result.blondelOk ? "success" : "warning"}
                full
              />
            </dl>
            {result.warnings.length > 0 && (
              <WarningsBox
                title={t("result.warningsTitle")}
                items={result.warnings.map(renderWarning)}
              />
            )}
            <StepsBox
              title={t("result.stepsTitle")}
              items={result.calculationSteps.map(renderStep)}
            />
            <SourceBox
              lines={[
                t("result.source.line1"),
                t("result.source.line2"),
                t("result.source.line3"),
              ]}
            />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
