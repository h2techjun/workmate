"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  calculateMaterialQuantity,
  materialQuantityInputSchema,
  type MaterialQuantityInputResolved,
  type MaterialQuantityResult,
  type MaterialStep,
} from "@/lib/calculations/timber/materialQuantity";
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

const MATERIAL_KEYS = [
  "osb11",
  "osb18",
  "plywood12",
  "plywood18",
  "gypsum9",
  "gypsum12",
  "cementBoard",
  "fiberCementSiding",
  "vinylSiding",
  "asphaltShingle",
  "battInsulationR19",
] as const;

export function MaterialQuantityForm(): React.ReactElement {
  const t = useTranslations("materialQuantityTool");
  const [result, setResult] = useState<MaterialQuantityResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<MaterialQuantityInputResolved>({
    resolver: zodResolver(materialQuantityInputSchema),
    defaultValues: {
      material: "osb11",
      areaM2: 100,
      wasteFactorPercent: 10,
      estimateFasteners: true,
    },
  });

  const renderStep = (s: MaterialStep): string => {
    switch (s.key) {
      case "wasteAdjusted":
        return t("steps.wasteAdjusted", {
          area: fmt(s.area, 1),
          waste: s.waste,
          result: fmt(s.result, 1),
        });
      case "sheetCount":
        return t("steps.sheetCount", {
          adjustedArea: fmt(s.adjustedArea, 1),
          sheetArea: fmt(s.sheetArea, 4),
          result: s.result,
        });
      case "totalWeight":
        return t("steps.totalWeight", {
          sheets: s.sheets,
          perSheet: s.perSheet,
          result: fmt(s.result, 1),
        });
      case "fasteners":
        return t("steps.fasteners", {
          sheets: s.sheets,
          perSheet: s.perSheet,
          result: s.result,
        });
    }
  };

  const onSubmit = (values: MaterialQuantityInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateMaterialQuantity(values));
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
        <FieldGroup title={t("sections.material")}>
          <Field label={t("fields.material")}>
            <select className="input-base" {...register("material")}>
              {MATERIAL_KEYS.map((m) => (
                <option key={m} value={m}>
                  {t(`materials.${m}`)}
                </option>
              ))}
            </select>
          </Field>
          <Field
            label={t("fields.areaM2")}
            hint={t("hints.area")}
            error={errMsg(errors.areaM2?.message)}
          >
            <input
              type="number"
              step="0.1"
              inputMode="decimal"
              className="input-base"
              {...register("areaM2", { valueAsNumber: true })}
            />
          </Field>
          <Field
            label={t("fields.wasteFactorPercent")}
            hint={t("hints.waste")}
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
          <Field label={t("fields.estimateFasteners")}>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-[color:var(--color-text-secondary)]">
              <input
                type="checkbox"
                className="h-4 w-4 rounded border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-indigo-500"
                {...register("estimateFasteners")}
              />
              <span>{t("hints.estimateFasteners")}</span>
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
              label={t("result.sheetsRequired")}
              value={result.sheetsRequired.toString()}
              unit={t(`unit.${result.unit}`)}
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t("result.adjustedArea")}
                value={`${fmt(result.adjustedAreaM2, 1)} m²`}
              />
              <Stat
                label={t("result.sheetArea")}
                value={`${fmt(result.sheetAreaM2, 4)} m²`}
              />
              <Stat
                label={t("result.totalWeight")}
                value={`${fmt(result.totalWeightKg, 1)} kg`}
              />
              {result.estimatedFasteners !== undefined && (
                <Stat
                  label={
                    result.fastenerType === "screw"
                      ? t("result.screws")
                      : t("result.nails")
                  }
                  value={result.estimatedFasteners.toString()}
                />
              )}
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
