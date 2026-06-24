"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  WireSizeCalculationError,
  calculateWireSize,
  wireSizeInputSchema,
  type CalculationStep,
  type Warning as CalcWarning,
  type WireSizeInputResolved,
  type WireSizeResult,
} from "@/lib/calculations/electric/wireSize";
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
import { NumberField } from "@/components/ui/NumberField";
import { useUrlSyncedForm } from "@/lib/hooks/useUrlSyncedForm";

type FormValues = WireSizeInputResolved;

const PHASE_OPTIONS: ReadonlyArray<FormValues["phaseType"]> = [
  "single-2wire",
  "single-3wire",
  "three-3wire",
  "three-4wire",
];

import { formatNumber } from "@/lib/utils/format";

const fmt = (n: number, digits: number = 2): string => formatNumber(n, digits);

export function WireSizeForm(): React.ReactElement {
  const t = useTranslations("wireSizeTool");
  const [result, setResult] = useState<WireSizeResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const formApi = useForm<FormValues>({
    resolver: zodResolver(wireSizeInputSchema),
    defaultValues: {
      voltage: 380,
      current: 100,
      distance: 50,
      phaseType: "three-3wire",
      material: "copper",
      allowedDropPercent: 2,
      insulation: "PVC",
      ambientTemperature: 30,
      numberOfCircuits: 1,
    },
  });
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = formApi;
  useUrlSyncedForm({ storageKey: "wireSize", form: formApi });

  const onSubmit = (values: FormValues): void => {
    setCalcError(null);
    try {
      setResult(calculateWireSize(values));
    } catch (err) {
      setResult(null);
      if (err instanceof WireSizeCalculationError) {
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

  const renderStep = (step: CalculationStep): string => {
    switch (step.key) {
      case "allowedDrop":
        return t("steps.allowedDrop", {
          voltage: step.voltage,
          percent: step.percent,
          drop: fmt(step.drop, 2),
        });
      case "minSection":
        return t("steps.minSection", {
          coefficient: fmt(step.coefficient, 1),
          distance: step.distance,
          current: step.current,
          drop: fmt(step.drop, 2),
          result: fmt(step.result, 2),
        });
      case "derating":
        return t("steps.derating", {
          insulation: step.insulation,
          ambient: step.ambient,
          ct: fmt(step.ct, 2),
          circuits: step.circuits,
          cg: fmt(step.cg, 2),
          total: fmt(step.total, 3),
        });
      case "requiredAmpacity":
        return t("steps.requiredAmpacity", {
          current: step.current,
          total: fmt(step.total, 3),
          result: fmt(step.result, 2),
        });
      case "selected":
        return t("steps.selected", {
          minSection: fmt(step.minSection, 2),
          requiredAmpacity: fmt(step.requiredAmpacity, 1),
          chosen: step.chosen,
          material: t(`material.${step.material}`),
          insulation: step.insulation,
          baseAmpacity: fmt(step.baseAmpacity, 1),
        });
      case "effectiveAmpacity":
        return t("steps.effectiveAmpacity", {
          baseAmpacity: fmt(step.baseAmpacity, 1),
          total: fmt(step.total, 3),
          effective: fmt(step.effective, 1),
          current: step.current,
          margin: fmt(step.margin, 1),
        });
      case "verify":
        return t("steps.verify", {
          coefficient: fmt(step.coefficient, 1),
          distance: step.distance,
          current: step.current,
          chosen: step.chosen,
          drop: fmt(step.drop, 2),
          percent: fmt(step.percent, 2),
        });
    }
  };

  const renderWarning = (w: CalcWarning): string => {
    switch (w.key) {
      case "aluminumMinSize":
        return t("warnings.aluminumMinSize", { min: w.min });
      case "safetyMarginLow":
        return t("warnings.safetyMarginLow", { threshold: w.threshold });
      case "parallelRecommended":
        return t("warnings.parallelRecommended", { chosen: w.chosen });
    }
  };

  const errorMessage = (msg?: string): string | undefined =>
    msg ? t(msg as never) : undefined;

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={t("sections.load")}>
          <Field
            label={t("fields.voltage")}
            error={errorMessage(errors.voltage?.message)}
          >
            <Controller
              control={control}
              name="voltage"
              render={({ field }) => (
                <NumberField
                  value={field.value ?? 0}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={1}
                  suffix="V"
                  aria-label={t("fields.voltage")}
                />
              )}
            />
          </Field>
          <Field
            label={t("fields.current")}
            error={errorMessage(errors.current?.message)}
          >
            <Controller
              control={control}
              name="current"
              render={({ field }) => (
                <NumberField
                  value={field.value ?? 0}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={1}
                  suffix="A"
                  aria-label={t("fields.current")}
                />
              )}
            />
          </Field>
          <Field
            label={t("fields.distance")}
            error={errorMessage(errors.distance?.message)}
          >
            <Controller
              control={control}
              name="distance"
              render={({ field }) => (
                <NumberField
                  value={field.value ?? 0}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={1}
                  suffix="m"
                  aria-label={t("fields.distance")}
                />
              )}
            />
          </Field>
          <Field label={t("fields.phaseType")}>
            <select className="input-base" {...register("phaseType")}>
              {PHASE_OPTIONS.map((p) => (
                <option key={p} value={p}>
                  {t(`phase.${p}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label={t("fields.allowedDropPercent")}
            error={errorMessage(errors.allowedDropPercent?.message)}
          >
            <Controller
              control={control}
              name="allowedDropPercent"
              render={({ field }) => (
                <NumberField
                  value={field.value ?? 0}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={1}
                  suffix="%"
                  aria-label={t("fields.allowedDropPercent")}
                />
              )}
            />
          </Field>
        </FieldGroup>

        <FieldGroup title={t("sections.cable")}>
          <Field label={t("fields.material")}>
            <select className="input-base" {...register("material")}>
              <option value="copper">{t("material.copper")}</option>
              <option value="aluminum">{t("material.aluminum")}</option>
            </select>
          </Field>
          <Field label={t("fields.insulation")} hint={t("hints.insulation")}>
            <select className="input-base" {...register("insulation")}>
              <option value="PVC">{t("insulation.PVC")}</option>
              <option value="XLPE">{t("insulation.XLPE")}</option>
            </select>
          </Field>
        </FieldGroup>

        <FieldGroup title={t("sections.environment")}>
          <Field
            label={t("fields.ambientTemperature")}
            hint={t("hints.ambientTemperature")}
            error={errorMessage(errors.ambientTemperature?.message)}
          >
            <Controller
              control={control}
              name="ambientTemperature"
              render={({ field }) => (
                <NumberField
                  value={field.value ?? 0}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  suffix="°C"
                  aria-label={t("fields.ambientTemperature")}
                />
              )}
            />
          </Field>
          <Field
            label={t("fields.numberOfCircuits")}
            hint={t("hints.numberOfCircuits")}
            error={errorMessage(errors.numberOfCircuits?.message)}
          >
            <Controller
              control={control}
              name="numberOfCircuits"
              render={({ field }) => (
                <NumberField
                  value={field.value ?? 0}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  aria-label={t("fields.numberOfCircuits")}
                />
              )}
            />
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
              label={t("result.recommended")}
              value={result.recommendedCrossSection.toString()}
              unit="mm²"
            />

            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t("result.baseAmpacity")}
                value={`${fmt(result.baseAmpacity, 1)} A`}
              />
              <Stat
                label={t("result.effectiveAmpacity")}
                value={`${fmt(result.effectiveAmpacity, 1)} A`}
              />
              <Stat
                label={t("result.deratingFactors")}
                value={`Ct ${fmt(result.temperatureFactor, 2)} × Cg ${fmt(result.groupingFactor, 2)}`}
              />
              <Stat
                label={t("result.actualDrop")}
                value={`${fmt(result.actualVoltageDrop, 2)} V (${fmt(result.actualDropPercent, 2)}%)`}
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
