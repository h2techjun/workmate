"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  calculateRafter,
  rafterInputSchema,
  type RafterInputResolved,
  type RafterResult,
  type RafterStep,
} from "@/lib/calculations/timber/rafter";
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

const fmt = (n: number, d: number = 2): string =>
  Number.isInteger(n) ? n.toString() : n.toFixed(d);

export function RafterForm(): React.ReactElement {
  const t = useTranslations("rafterTool");
  const [result, setResult] = useState<RafterResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RafterInputResolved>({
    resolver: zodResolver(rafterInputSchema),
    defaultValues: { run: 4000, rise: 1000, eaveOverhang: 600 },
  });

  const renderStep = (s: RafterStep): string => {
    switch (s.key) {
      case "baseLength":
        return t("steps.baseLength", {
          run: s.run,
          rise: s.rise,
          result: fmt(s.result, 1),
        });
      case "angle":
        return t("steps.angle", {
          rise: s.rise,
          run: s.run,
          result: fmt(s.result, 2),
        });
      case "slope":
        return t("steps.slope", {
          rise: s.rise,
          run: s.run,
          result: fmt(s.result, 2),
        });
      case "secCorrection":
        return t("steps.secCorrection", {
          angle: fmt(s.angle, 2),
          result: fmt(s.result, 4),
        });
      case "eaveDiagonal":
        return t("steps.eaveDiagonal", {
          eave: s.eave,
          angle: fmt(s.angle, 2),
          result: fmt(s.result, 1),
        });
      case "totalLength":
        return t("steps.totalLength", {
          base: fmt(s.base, 1),
          eaveDiagonal: fmt(s.eaveDiagonal, 1),
          result: fmt(s.result, 1),
        });
    }
  };

  const onSubmit = (values: RafterInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateRafter(values));
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
            label={t("fields.run")}
            hint={t("hints.run")}
            error={errMsg(errors.run?.message)}
          >
            <input
              type="number"
              step="any"
              inputMode="decimal"
              className="input-base"
              {...register("run", { valueAsNumber: true })}
            />
          </Field>
          <Field
            label={t("fields.rise")}
            hint={t("hints.rise")}
            error={errMsg(errors.rise?.message)}
          >
            <input
              type="number"
              step="any"
              inputMode="decimal"
              className="input-base"
              {...register("rise", { valueAsNumber: true })}
            />
          </Field>
        </FieldGroup>

        <FieldGroup title={t("sections.eave")}>
          <Field
            label={t("fields.eaveOverhang")}
            hint={t("hints.eaveOverhang")}
            error={errMsg(errors.eaveOverhang?.message)}
          >
            <input
              type="number"
              step="any"
              inputMode="decimal"
              className="input-base"
              {...register("eaveOverhang", { valueAsNumber: true })}
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
              label={t("result.totalLength")}
              value={fmt(result.totalLength, 1)}
              unit="mm"
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t("result.baseLength")}
                value={`${fmt(result.baseLength, 1)} mm`}
              />
              <Stat
                label={t("result.eaveDiagonal")}
                value={`${fmt(result.eaveDiagonal, 1)} mm`}
              />
              <Stat
                label={t("result.angle")}
                value={`${fmt(result.angleDegrees, 2)}°`}
              />
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
            </dl>
            <StepsBox
              title={t("result.steps")}
              items={result.calculationSteps.map(renderStep)}
            />
            <SourceBox lines={[t("result.source.line1")]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
