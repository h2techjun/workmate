"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  calculateConcrete,
  concreteInputSchema,
  type ConcreteInputResolved,
  type ConcreteResult,
  type ConcreteStep,
} from "@/lib/calculations/timber/concrete";
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
  Number.isInteger(n) && Math.abs(n) < 1e6 ? n.toString() : n.toFixed(d);

export function ConcreteForm(): React.ReactElement {
  const t = useTranslations("concreteTool");
  const [result, setResult] = useState<ConcreteResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ConcreteInputResolved>({
    resolver: zodResolver(concreteInputSchema),
    defaultValues: {
      type: "stripFooting",
      widthM: 0.4,
      depthOrThicknessM: 0.6,
      lengthM: 40,
      rebarDensityKgPerM3: 90,
      wasteFactorPercent: 5,
    },
  });

  const type = watch("type");

  const renderStep = (s: ConcreteStep): string => {
    switch (s.key) {
      case "rawVolume":
        return t("steps.rawVolume", {
          width: fmt(s.width, 2),
          depth: fmt(s.depth, 2),
          length: fmt(s.length, 2),
          result: fmt(s.result, 3),
        });
      case "wasteAdjusted":
        return t("steps.wasteAdjusted", {
          raw: fmt(s.raw, 3),
          waste: s.waste,
          result: fmt(s.result, 3),
        });
      case "rebar":
        return t("steps.rebar", {
          volume: fmt(s.volume, 3),
          density: s.density,
          result: fmt(s.result, 1),
        });
      case "remicon":
        return t("steps.remicon", {
          volume: fmt(s.volume, 3),
          result: fmt(s.result, 2),
        });
    }
  };

  const onSubmit = (values: ConcreteInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateConcrete(values));
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
        <FieldGroup title={t("sections.foundation")}>
          <Field label={t("fields.type")}>
            <select className="input-base" {...register("type")}>
              <option value="stripFooting">{t("type.stripFooting")}</option>
              <option value="matSlab">{t("type.matSlab")}</option>
            </select>
          </Field>
          <Field
            label={t("fields.widthM")}
            error={errMsg(errors.widthM?.message)}
          >
            <input
              type="number"
              step="0.05"
              inputMode="decimal"
              className="input-base"
              {...register("widthM", { valueAsNumber: true })}
            />
          </Field>
          <Field
            label={
              type === "matSlab"
                ? t("fields.thickness")
                : t("fields.depth")
            }
            error={errMsg(errors.depthOrThicknessM?.message)}
          >
            <input
              type="number"
              step="0.05"
              inputMode="decimal"
              className="input-base"
              {...register("depthOrThicknessM", { valueAsNumber: true })}
            />
          </Field>
          <Field
            label={t("fields.lengthM")}
            error={errMsg(errors.lengthM?.message)}
          >
            <input
              type="number"
              step="0.5"
              inputMode="decimal"
              className="input-base"
              {...register("lengthM", { valueAsNumber: true })}
            />
          </Field>
        </FieldGroup>

        <FieldGroup title={t("sections.options")}>
          <Field
            label={t("fields.rebarDensity")}
            hint={t("hints.rebar")}
            error={errMsg(errors.rebarDensityKgPerM3?.message)}
          >
            <input
              type="number"
              step="5"
              inputMode="numeric"
              className="input-base"
              {...register("rebarDensityKgPerM3", { valueAsNumber: true })}
            />
          </Field>
          <Field
            label={t("fields.wasteFactorPercent")}
            error={errMsg(errors.wasteFactorPercent?.message)}
          >
            <input
              type="number"
              step="1"
              inputMode="numeric"
              className="input-base"
              {...register("wasteFactorPercent", { valueAsNumber: true })}
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
              label={t("result.adjustedVolume")}
              value={fmt(result.adjustedVolumeM3, 3)}
              unit="m³"
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t("result.rawVolume")}
                value={`${fmt(result.rawVolumeM3, 3)} m³`}
              />
              <Stat
                label={t("result.rebar")}
                value={`${fmt(result.rebarKg, 1)} kg`}
              />
              <Stat
                label={t("result.remicon")}
                value={`${fmt(result.remicon6m3Trucks, 2)} ${t("unit.trucks")}`}
                full
              />
            </dl>
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
