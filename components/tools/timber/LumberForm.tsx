"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations, useLocale } from "next-intl";
import {
  calculateLumber,
  lumberInputSchema,
  type LumberInputResolved,
  type LumberResult,
  type LumberStep,
} from "@/lib/calculations/timber/lumber";
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

export function LumberForm(): React.ReactElement {
  const t = useTranslations("lumberTool");
  const locale = useLocale();
  const [result, setResult] = useState<LumberResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors, isSubmitting },
  } = useForm<LumberInputResolved>({
    resolver: zodResolver(lumberInputSchema),
    defaultValues: {
      widthMM: 89,
      thicknessMM: 38,
      lengthMM: 3600,
      quantity: 10,
      species: "spf",
    },
  });

  const renderStep = (s: LumberStep): string => {
    switch (s.key) {
      case "perPieceVolume":
        return t("steps.perPieceVolume", {
          width: s.width,
          thickness: s.thickness,
          length: s.length,
          result: fmt(s.result, 6),
        });
      case "totalVolume":
        return t("steps.totalVolume", {
          perPiece: fmt(s.perPiece, 6),
          quantity: s.quantity,
          result: fmt(s.result, 4),
        });
      case "boardFeet":
        return t("steps.boardFeet", {
          volumeM3: fmt(s.volumeM3, 4),
          result: fmt(s.result, 2),
        });
      case "sai":
        return t("steps.sai", {
          volumeM3: fmt(s.volumeM3, 4),
          result: fmt(s.result, 2),
        });
      case "weight":
        return t("steps.weight", {
          volumeM3: fmt(s.volumeM3, 4),
          density: s.density,
          species: t(`species.${s.species}`),
          result: fmt(s.result, 1),
        });
    }
  };

  const onSubmit = (values: LumberInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateLumber(values));
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
        <FieldGroup title={t("sections.dimension")}>
          <Field
            label={t("fields.widthMM")}
            hint={t("hints.widthMM")}
            error={errMsg(errors.widthMM?.message)}
          >
            <Controller
              name="widthMM"
              control={control}
              render={({ field: f }) => (
                <NumberField
                  value={f.value}
                  onChange={f.onChange}
                  thousands={false}
                  decimals={1}
                  min={0}
                  suffix="mm"
                  aria-label={t("fields.widthMM")}
                />
              )}
            />
          </Field>
          <Field
            label={t("fields.thicknessMM")}
            hint={t("hints.thicknessMM")}
            error={errMsg(errors.thicknessMM?.message)}
          >
            <Controller
              name="thicknessMM"
              control={control}
              render={({ field: f }) => (
                <NumberField
                  value={f.value}
                  onChange={f.onChange}
                  thousands={false}
                  decimals={1}
                  min={0}
                  suffix="mm"
                  aria-label={t("fields.thicknessMM")}
                />
              )}
            />
          </Field>
          <Field
            label={t("fields.lengthMM")}
            hint={t("hints.lengthMM")}
            error={errMsg(errors.lengthMM?.message)}
          >
            <Controller
              name="lengthMM"
              control={control}
              render={({ field: f }) => (
                <NumberField
                  value={f.value}
                  onChange={f.onChange}
                  thousands={false}
                  decimals={0}
                  min={0}
                  suffix="mm"
                  aria-label={t("fields.lengthMM")}
                />
              )}
            />
          </Field>
          <Field
            label={t("fields.quantity")}
            error={errMsg(errors.quantity?.message)}
          >
            <Controller
              name="quantity"
              control={control}
              render={({ field: f }) => (
                <NumberField
                  value={f.value}
                  onChange={f.onChange}
                  thousands={true}
                  decimals={0}
                  min={1}
                  suffix={locale === "ko" ? "본" : "pcs"}
                  aria-label={t("fields.quantity")}
                />
              )}
            />
          </Field>
        </FieldGroup>

        <FieldGroup title={t("sections.type")}>
          <Field label={t("fields.species")}>
            <select className="input-base" {...register("species")}>
              <option value="spf">{t("species.spf")}</option>
              <option value="pine">{t("species.pine")}</option>
              <option value="larch">{t("species.larch")}</option>
              <option value="cedar">{t("species.cedar")}</option>
              <option value="douglasFir">{t("species.douglasFir")}</option>
              <option value="oak">{t("species.oak")}</option>
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
              label={t("result.totalVolume")}
              value={fmt(result.totalVolumeM3, 4)}
              unit="m³"
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t("result.perPiece")}
                value={`${fmt(result.perPieceVolumeM3, 5)} m³`}
              />
              <Stat
                label={t("result.boardFeet")}
                value={`${fmt(result.boardFeet, 2)} BF`}
              />
              <Stat
                label={t("result.sai")}
                value={`${fmt(result.sai, 2)} 才`}
              />
              <Stat
                label={t("result.weight")}
                value={`${fmt(result.weightKg, 1)} kg`}
              />
              <Stat
                label={t("result.density")}
                value={`${result.density} kg/m³`}
                full
              />
            </dl>
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
