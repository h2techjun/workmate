"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  calculateRoofArea,
  roofAreaInputSchema,
  type RoofAreaInputResolved,
  type RoofAreaResult,
  type RoofAreaStep,
} from "@/lib/calculations/timber/roofArea";
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

export function RoofAreaForm(): React.ReactElement {
  const t = useTranslations("roofAreaTool");
  const [result, setResult] = useState<RoofAreaResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RoofAreaInputResolved>({
    resolver: zodResolver(roofAreaInputSchema),
    defaultValues: {
      planAreaM2: 100,
      perimeterM: 40,
      angleDegrees: 30,
      eaveOverhangMM: 600,
    },
  });

  const renderStep = (s: RoofAreaStep): string => {
    switch (s.key) {
      case "secCorrection":
        return t("steps.secCorrection", {
          angle: fmt(s.angle, 1),
          result: fmt(s.result, 4),
        });
      case "slopeArea":
        return t("steps.slopeArea", {
          planArea: fmt(s.planArea, 2),
          sec: fmt(s.sec, 4),
          result: fmt(s.result, 2),
        });
      case "eaveArea":
        return t("steps.eaveArea", {
          perimeter: s.perimeter,
          eaveOverhang: s.eaveOverhang,
          sec: fmt(s.sec, 4),
          result: fmt(s.result, 2),
        });
      case "totalArea":
        return t("steps.totalArea", {
          slope: fmt(s.slope, 2),
          eave: fmt(s.eave, 2),
          result: fmt(s.result, 2),
        });
    }
  };

  const onSubmit = (values: RoofAreaInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateRoofArea(values));
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
            label={t("fields.planAreaM2")}
            hint={t("hints.planArea")}
            error={errMsg(errors.planAreaM2?.message)}
          >
            <Controller
              control={control}
              name="planAreaM2"
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={2}
                  min={0}
                  suffix="㎡"
                  aria-label={t("fields.planAreaM2")}
                />
              )}
            />
          </Field>
          <Field
            label={t("fields.angleDegrees")}
            error={errMsg(errors.angleDegrees?.message)}
          >
            <Controller
              control={control}
              name="angleDegrees"
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={1}
                  min={0}
                  max={89}
                  suffix="°"
                  aria-label={t("fields.angleDegrees")}
                />
              )}
            />
          </Field>
        </FieldGroup>

        <FieldGroup title={t("sections.eave")}>
          <Field
            label={t("fields.perimeterM")}
            hint={t("hints.perimeter")}
            error={errMsg(errors.perimeterM?.message)}
          >
            <Controller
              control={control}
              name="perimeterM"
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={1}
                  min={0}
                  suffix="m"
                  aria-label={t("fields.perimeterM")}
                />
              )}
            />
          </Field>
          <Field
            label={t("fields.eaveOverhangMM")}
            error={errMsg(errors.eaveOverhangMM?.message)}
          >
            <Controller
              control={control}
              name="eaveOverhangMM"
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  min={0}
                  suffix="mm"
                  aria-label={t("fields.eaveOverhangMM")}
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
              label={t("result.totalArea")}
              value={fmt(result.totalAreaM2, 2)}
              unit="m²"
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t("result.slopeArea")}
                value={`${fmt(result.slopeAreaM2, 2)} m²`}
              />
              <Stat
                label={t("result.eaveArea")}
                value={`${fmt(result.eaveAreaM2, 2)} m²`}
              />
              <Stat
                label={t("result.secCorrection")}
                value={fmt(result.secCorrection, 4)}
                full
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
