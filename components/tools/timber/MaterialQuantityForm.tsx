"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import { NumberField } from "@/components/ui/NumberField";
import { formatNumber } from "@/lib/utils/format";

const fmt = (n: number, d: number = 2): string => formatNumber(n, d);

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

type MaterialKey = (typeof MATERIAL_KEYS)[number];

interface MaterialQuantityFormProps {
  /**
   * 자재 종류를 미리 고정 — 지정 시 자재 선택 UI 숨김.
   * 자재별 dedicated 페이지(/timber-calc/drywall, /timber-calc/plywood 등) 에서 사용.
   */
  lockedMaterial?: MaterialKey;
}

export function MaterialQuantityForm({
  lockedMaterial,
}: MaterialQuantityFormProps = {}): React.ReactElement {
  const t = useTranslations("materialQuantityTool");
  const [result, setResult] = useState<MaterialQuantityResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<MaterialQuantityInputResolved>({
    resolver: zodResolver(materialQuantityInputSchema),
    defaultValues: {
      material: lockedMaterial ?? "osb11",
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
          {lockedMaterial ? (
            <input type="hidden" {...register("material")} value={lockedMaterial} />
          ) : (
            <Field label={t("fields.material")}>
              <select className="input-base" {...register("material")}>
                {MATERIAL_KEYS.map((m) => (
                  <option key={m} value={m}>
                    {t(`materials.${m}`)}
                  </option>
                ))}
              </select>
            </Field>
          )}
          <Field
            label={t("fields.areaM2")}
            hint={t("hints.area")}
            error={errMsg(errors.areaM2?.message)}
          >
            <Controller
              name="areaM2"
              control={control}
              render={({ field: f }) => (
                <NumberField
                  value={f.value}
                  onChange={f.onChange}
                  thousands={false}
                  decimals={1}
                  min={0}
                  suffix="㎡"
                  aria-label={t("fields.areaM2")}
                />
              )}
            />
          </Field>
          <Field
            label={t("fields.wasteFactorPercent")}
            hint={t("hints.waste")}
            error={errMsg(errors.wasteFactorPercent?.message)}
          >
            <Controller
              name="wasteFactorPercent"
              control={control}
              render={({ field: f }) => (
                <NumberField
                  value={f.value}
                  onChange={f.onChange}
                  thousands={false}
                  decimals={0}
                  min={0}
                  max={50}
                  suffix="%"
                  aria-label={t("fields.wasteFactorPercent")}
                />
              )}
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
              value={fmt(result.sheetsRequired)}
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
                  value={fmt(result.estimatedFasteners)}
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
