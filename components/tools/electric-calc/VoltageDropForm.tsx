"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  calculateVoltageDrop,
  voltageDropInputSchema,
  type VoltageDropInputResolved,
  type VoltageDropResult,
  type VoltageDropStep,
} from "@/lib/calculations/electric/voltageDrop";
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

const KS_SECTIONS = [
  1.5, 2.5, 4, 6, 10, 16, 25, 35, 50, 70, 95, 120, 150, 185, 240, 300, 400, 500,
  630,
] as const;

export function VoltageDropForm(): React.ReactElement {
  const t = useTranslations("voltageDropTool");
  const [result, setResult] = useState<VoltageDropResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VoltageDropInputResolved>({
    resolver: zodResolver(voltageDropInputSchema),
    defaultValues: {
      voltage: 380,
      current: 50,
      distance: 100,
      crossSection: 16,
      phaseType: "three-3wire",
      material: "copper",
    },
  });

  const renderStep = (s: VoltageDropStep): string => {
    switch (s.key) {
      case "coefficient":
        return t("steps.coefficient", {
          base: fmt(s.base, 1),
          material: t(`material.${s.material}`),
          result: fmt(s.result, 2),
        });
      case "drop":
        return t("steps.drop", {
          coefficient: fmt(s.coefficient, 2),
          distance: s.distance,
          current: s.current,
          crossSection: s.crossSection,
          result: fmt(s.result, 3),
        });
      case "dropPercent":
        return t("steps.dropPercent", {
          drop: fmt(s.drop, 3),
          voltage: s.voltage,
          result: fmt(s.result, 2),
        });
      case "receivingVoltage":
        return t("steps.receivingVoltage", {
          voltage: s.voltage,
          drop: fmt(s.drop, 3),
          result: fmt(s.result, 2),
        });
      case "limitCheck":
        return t("steps.limitCheck", {
          distance: s.distance,
          limitPercent: s.limitPercent,
          actualPercent: fmt(s.actualPercent, 2),
          status: s.pass ? t("status.pass") : t("status.fail"),
        });
    }
  };

  const onSubmit = (values: VoltageDropInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateVoltageDrop(values));
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
        <FieldGroup title={t("sections.circuit")}>
          <Field
            label={t("fields.voltage")}
            error={errMsg(errors.voltage?.message)}
          >
            <input
              type="number"
              step="any"
              inputMode="decimal"
              className="input-base"
              {...register("voltage", { valueAsNumber: true })}
            />
          </Field>
          <Field
            label={t("fields.current")}
            error={errMsg(errors.current?.message)}
          >
            <input
              type="number"
              step="any"
              inputMode="decimal"
              className="input-base"
              {...register("current", { valueAsNumber: true })}
            />
          </Field>
          <Field
            label={t("fields.distance")}
            error={errMsg(errors.distance?.message)}
          >
            <input
              type="number"
              step="any"
              inputMode="decimal"
              className="input-base"
              {...register("distance", { valueAsNumber: true })}
            />
          </Field>
          <Field label={t("fields.phaseType")}>
            <select className="input-base" {...register("phaseType")}>
              <option value="single-2wire">{t("phase.single-2wire")}</option>
              <option value="single-3wire">{t("phase.single-3wire")}</option>
              <option value="three-3wire">{t("phase.three-3wire")}</option>
              <option value="three-4wire">{t("phase.three-4wire")}</option>
            </select>
          </Field>
        </FieldGroup>

        <FieldGroup title={t("sections.cable")}>
          <Field label={t("fields.crossSection")}>
            <select
              className="input-base"
              {...register("crossSection", { valueAsNumber: true })}
            >
              {KS_SECTIONS.map((s) => (
                <option key={s} value={s}>
                  {s} mm²
                </option>
              ))}
            </select>
          </Field>
          <Field label={t("fields.material")}>
            <select className="input-base" {...register("material")}>
              <option value="copper">{t("material.copper")}</option>
              <option value="aluminum">{t("material.aluminum")}</option>
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
              label={t("result.dropPercent")}
              value={fmt(result.voltageDropPercent, 2)}
              unit="%"
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t("result.dropV")}
                value={`${fmt(result.voltageDropV, 2)} V`}
              />
              <Stat
                label={t("result.receivingVoltage")}
                value={`${fmt(result.receivingVoltage, 2)} V`}
              />
              <Stat
                label={t("result.limitPercent")}
                value={`${result.limitPercent}%`}
              />
              <Stat
                label={t("result.status")}
                value={result.pass ? t("status.pass") : t("status.fail")}
                tone={result.pass ? "success" : "danger"}
              />
              <Stat
                label={t("result.margin")}
                value={`${result.marginPercent >= 0 ? "+" : ""}${fmt(result.marginPercent, 2)}%`}
                tone={result.marginPercent >= 0 ? "success" : "danger"}
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
