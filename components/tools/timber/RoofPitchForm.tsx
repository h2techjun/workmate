"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  calculateRoofPitch,
  roofPitchInputSchema,
  type RoofPitchInputResolved,
  type RoofPitchResult,
} from "@/lib/calculations/timber/roofPitch";
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

const fmt = (n: number, d: number = 2): string =>
  Number.isInteger(n) ? n.toString() : n.toFixed(d);

export function RoofPitchForm(): React.ReactElement {
  const t = useTranslations("roofPitchTool");
  const [result, setResult] = useState<RoofPitchResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<RoofPitchInputResolved>({
    resolver: zodResolver(roofPitchInputSchema),
    defaultValues: { mode: "angle", angle: 30 },
  });

  const mode = watch("mode");

  const onSubmit = (values: RoofPitchInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateRoofPitch(values));
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

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={t("fields.mode")}>
          <Field label={t("fields.mode")}>
            <select className="input-base" {...register("mode")}>
              <option value="angle">{t("modes.angle")}</option>
              <option value="slope">{t("modes.slope")}</option>
              <option value="ratio">{t("modes.ratio")}</option>
            </select>
          </Field>
          {mode === "angle" && (
            <Field label={t("fields.angle")}>
              <input
                type="number"
                step="0.1"
                inputMode="decimal"
                className="input-base"
                {...register("angle", { valueAsNumber: true })}
              />
            </Field>
          )}
          {mode === "slope" && (
            <Field label={t("fields.slope")}>
              <input
                type="number"
                step="0.1"
                inputMode="decimal"
                className="input-base"
                {...register("slope", { valueAsNumber: true })}
              />
            </Field>
          )}
          {mode === "ratio" && (
            <Field label={t("fields.rise")}>
              <input
                type="number"
                step="0.1"
                inputMode="decimal"
                className="input-base"
                {...register("rise", { valueAsNumber: true })}
              />
            </Field>
          )}
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
              label={t("result.angle")}
              value={fmt(result.angleDegrees, 2)}
              unit="°"
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t("result.slope")}
                value={`${fmt(result.slopePercent, 2)}%`}
              />
              <Stat
                label={t("result.pitch")}
                value={`${fmt(result.pitchRise12, 2)}/12`}
              />
              <Stat
                label={t("result.secCorrection")}
                value={fmt(result.secCorrection, 4)}
              />
              <Stat
                label={t("result.category")}
                value={t(`categories.${result.category}`)}
                full
              />
            </dl>
            <SourceBox lines={[t("result.source.line1")]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
