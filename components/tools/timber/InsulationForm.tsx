"use client";

import { useState } from "react";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { Plus, Trash2 } from "lucide-react";
import {
  calculateInsulation,
  insulationInputSchema,
  type InsulationInputResolved,
  type InsulationResult,
  type InsulationStep,
} from "@/lib/calculations/timber/insulation";
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

const fmt = (n: number, d: number = 3): string =>
  Number.isInteger(n) && Math.abs(n) < 1e6 ? n.toString() : n.toFixed(d);

const MATERIAL_KEYS = [
  "glasswool24",
  "glasswool48",
  "mineralwool",
  "eps1",
  "eps2",
  "xps",
  "pirFoam",
  "puFoam",
  "cellulose",
  "phenolic",
  "osb11",
  "osb18",
  "plywood12",
  "gypsum9",
  "gypsum12",
  "fiberCement",
  "brick",
  "concrete",
  "airSpace",
] as const;

export function InsulationForm(): React.ReactElement {
  const t = useTranslations("insulationTool");
  const [result, setResult] = useState<InsulationResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { isSubmitting },
  } = useForm<InsulationInputResolved>({
    resolver: zodResolver(insulationInputSchema),
    defaultValues: {
      region: "central2",
      element: "exteriorWallDirect",
      layers: [
        { material: "gypsum9", thicknessMM: 9.5 },
        { material: "glasswool24", thicknessMM: 140 },
        { material: "osb11", thicknessMM: 11 },
        { material: "fiberCement", thicknessMM: 8 },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({ control, name: "layers" });

  const renderStep = (s: InsulationStep): string => {
    switch (s.key) {
      case "layerSum":
        return t("steps.layerSum", {
          count: s.layerCount,
          sum: fmt(s.sum, 3),
        });
      case "surfaceR":
        return t("steps.surfaceR", {
          interior: fmt(s.interior, 2),
          exterior: fmt(s.exterior, 2),
          total: fmt(s.total, 2),
        });
      case "totalR":
        return t("steps.totalR", {
          layers: fmt(s.layers, 3),
          surface: fmt(s.surface, 2),
          result: fmt(s.result, 3),
        });
      case "uValue":
        return t("steps.uValue", {
          totalR: fmt(s.totalR, 3),
          result: fmt(s.result, 3),
        });
      case "compare":
        return t("steps.compare", {
          uValue: fmt(s.uValue, 3),
          limit: fmt(s.limit, 3),
          status: s.pass ? t("status.pass") : t("status.fail"),
        });
    }
  };

  const onSubmit = (values: InsulationInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateInsulation(values));
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
        <FieldGroup title={t("sections.environment")}>
          <Field label={t("fields.region")}>
            <select className="input-base" {...register("region")}>
              <option value="central1">{t("region.central1")}</option>
              <option value="central2">{t("region.central2")}</option>
              <option value="south">{t("region.south")}</option>
              <option value="jeju">{t("region.jeju")}</option>
            </select>
          </Field>
          <Field label={t("fields.element")}>
            <select className="input-base" {...register("element")}>
              <option value="exteriorWallDirect">
                {t("element.exteriorWallDirect")}
              </option>
              <option value="exteriorWallIndirect">
                {t("element.exteriorWallIndirect")}
              </option>
              <option value="roof">{t("element.roof")}</option>
              <option value="floorDirect">{t("element.floorDirect")}</option>
              <option value="floorIndirect">{t("element.floorIndirect")}</option>
            </select>
          </Field>
        </FieldGroup>

        <FieldGroup title={t("sections.layers")}>
          <div className="space-y-2.5">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="flex items-center gap-2 rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-2"
              >
                <span className="px-2 text-xs font-mono text-[color:var(--color-text-tertiary)]">
                  {index + 1}
                </span>
                <Controller
                  name={`layers.${index}.material`}
                  control={control}
                  render={({ field: f }) => (
                    <select className="input-base flex-1" {...f}>
                      {MATERIAL_KEYS.map((m) => (
                        <option key={m} value={m}>
                          {t(`materials.${m}`)}
                        </option>
                      ))}
                    </select>
                  )}
                />
                <input
                  type="number"
                  step="0.5"
                  inputMode="decimal"
                  className="input-base w-24"
                  placeholder="mm"
                  {...register(`layers.${index}.thicknessMM`, {
                    valueAsNumber: true,
                  })}
                />
                <button
                  type="button"
                  onClick={() => remove(index)}
                  aria-label="remove layer"
                  className="rounded-lg p-2 text-[color:var(--color-text-tertiary)] transition-colors hover:bg-red-500/10 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                append({ material: "glasswool24", thicknessMM: 100 })
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-[color:var(--color-border-default)] bg-transparent px-3 py-2 text-sm font-medium text-[color:var(--color-text-secondary)] transition-colors hover:bg-[color:var(--color-bg-card-hover)] hover:text-[color:var(--color-text-primary)]"
            >
              <Plus className="h-4 w-4" />
              {t("actions.addLayer")}
            </button>
          </div>
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
              label={t("result.uValue")}
              value={fmt(result.uValue, 3)}
              unit="W/m²·K"
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t("result.totalR")}
                value={`${fmt(result.totalR, 3)} m²·K/W`}
              />
              <Stat
                label={t("result.uLimit")}
                value={`${fmt(result.uLimit, 3)} W/m²·K`}
              />
              <Stat
                label={t("result.status")}
                value={
                  result.pass ? t("status.pass") : t("status.fail")
                }
                tone={result.pass ? "success" : "danger"}
                full
              />
              <Stat
                label={t("result.surplusOrDeficit")}
                value={`${result.surplusOrDeficitR >= 0 ? "+" : ""}${fmt(result.surplusOrDeficitR, 3)} m²·K/W`}
                tone={result.surplusOrDeficitR >= 0 ? "success" : "danger"}
                full
              />
            </dl>

            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                {t("result.layerBreakdown")}
              </h3>
              <ul className="space-y-1 rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-xs text-[color:var(--color-text-secondary)]">
                {result.layers.map((l, i) => (
                  <li key={i} className="flex justify-between gap-3">
                    <span>
                      {i + 1}. {t(`materials.${l.material}`)} · {l.thicknessMM}mm
                    </span>
                    <span className="tabular-nums">
                      R = {fmt(l.R, 3)} m²·K/W
                    </span>
                  </li>
                ))}
              </ul>
            </div>

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
