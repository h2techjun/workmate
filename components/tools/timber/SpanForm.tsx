"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  SpanCalculationError,
  calculateSpan,
  spanInputSchema,
  type SpanInputResolved,
  type SpanResult,
  type SpanStep,
  type SpanWarning,
} from "@/lib/calculations/timber/span";
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

const fmt = (n: number, d: number = 2): string =>
  Number.isInteger(n) && Math.abs(n) < 1e6 ? n.toString() : n.toFixed(d);

export function SpanForm(): React.ReactElement {
  const t = useTranslations("spanTool");
  const [result, setResult] = useState<SpanResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<SpanInputResolved>({
    resolver: zodResolver(spanInputSchema),
    defaultValues: {
      memberType: "floorJoist",
      lumberSize: "2x10",
      spacingMM: 400,
      grade: "spf2",
      snowRegion: "seoulMetro",
    },
  });

  const memberType = watch("memberType");

  const renderStep = (s: SpanStep): string => {
    switch (s.key) {
      case "loads":
        return t("steps.loads", {
          live: fmt(s.live, 2),
          dead: fmt(s.dead, 2),
          snow: fmt(s.snow, 2),
          total: fmt(s.total, 2),
        });
      case "lineLoad":
        return t("steps.lineLoad", {
          total: fmt(s.total, 2),
          spacing: s.spacing,
          result: fmt(s.result, 3),
        });
      case "section":
        return t("steps.section", {
          b: s.b,
          d: s.d,
          I: fmt(s.I, 0),
          S: fmt(s.S, 0),
        });
      case "fbAdjusted":
        return t("steps.fbAdjusted", {
          base: fmt(s.base, 2),
          cr: fmt(s.cr, 2),
          result: fmt(s.result, 2),
        });
      case "bendingSpan":
        return t("steps.bendingSpan", {
          fb: fmt(s.fb, 2),
          S: fmt(s.S, 0),
          w: fmt(s.w, 3),
          result: fmt(s.result, 0),
        });
      case "deflectionSpan":
        return t("steps.deflectionSpan", {
          E: s.E,
          I: fmt(s.I, 0),
          w: fmt(s.w, 3),
          k: s.k,
          result: fmt(s.result, 0),
        });
      case "governing":
        return t("steps.governing", {
          bending: fmt(s.bending, 0),
          deflection: fmt(s.deflection, 0),
          result: fmt(s.result, 0),
          check: t(`governing.${s.check}`),
        });
    }
  };

  const renderWarning = (w: SpanWarning): string => {
    switch (w.key) {
      case "spacingUnusual":
        return t("warnings.spacingUnusual", { actual: w.actual });
      case "rafterNeedsSnow":
        return t("warnings.rafterNeedsSnow");
      case "lumberNotFound":
        return t("warnings.lumberNotFound", { size: w.size });
    }
  };

  const onSubmit = (values: SpanInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateSpan(values));
    } catch (err) {
      setResult(null);
      if (err instanceof SpanCalculationError) {
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
  const errMsg = (m?: string) => (m ? t(m as never) : undefined);

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={t("sections.member")}>
          <Field label={t("fields.memberType")}>
            <select className="input-base" {...register("memberType")}>
              <option value="floorJoist">{t("memberType.floorJoist")}</option>
              <option value="ceilingJoist">
                {t("memberType.ceilingJoist")}
              </option>
              <option value="rafter">{t("memberType.rafter")}</option>
              <option value="header">{t("memberType.header")}</option>
            </select>
          </Field>
          <Field label={t("fields.lumberSize")}>
            <select className="input-base" {...register("lumberSize")}>
              <option value="2x4">2×4 (38×89mm)</option>
              <option value="2x6">2×6 (38×140mm)</option>
              <option value="2x8">2×8 (38×184mm)</option>
              <option value="2x10">2×10 (38×235mm)</option>
              <option value="2x12">2×12 (38×286mm)</option>
            </select>
          </Field>
          <Field
            label={t("fields.spacingMM")}
            hint={t("hints.spacing")}
            error={errMsg(errors.spacingMM?.message)}
          >
            <input
              type="number"
              step="50"
              inputMode="numeric"
              className="input-base"
              {...register("spacingMM", { valueAsNumber: true })}
            />
          </Field>
          <Field label={t("fields.grade")}>
            <select className="input-base" {...register("grade")}>
              <option value="spf2">SPF #2</option>
              <option value="spfStud">SPF Stud</option>
              <option value="df2">Douglas Fir-Larch #2</option>
              <option value="hf2">Hem-Fir #2</option>
              <option value="larch2">{t("grade.larch2")}</option>
            </select>
          </Field>
        </FieldGroup>

        {memberType === "rafter" && (
          <FieldGroup title={t("sections.snow")}>
            <Field label={t("fields.snowRegion")} hint={t("hints.snowRegion")}>
              <select className="input-base" {...register("snowRegion")}>
                <option value="seoulMetro">{t("snowRegion.seoulMetro")}</option>
                <option value="gangwonYeongdong">
                  {t("snowRegion.gangwonYeongdong")}
                </option>
                <option value="gangwonYeongseo">
                  {t("snowRegion.gangwonYeongseo")}
                </option>
                <option value="chungcheong">
                  {t("snowRegion.chungcheong")}
                </option>
                <option value="jeolla">{t("snowRegion.jeolla")}</option>
                <option value="gyeongsang">{t("snowRegion.gyeongsang")}</option>
                <option value="jeju">{t("snowRegion.jeju")}</option>
                <option value="ulleung">{t("snowRegion.ulleung")}</option>
              </select>
            </Field>
          </FieldGroup>
        )}

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
              label={t("result.maxSpan")}
              value={fmt(result.maxSpanMM, 0)}
              unit="mm"
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t("result.bendingSpan")}
                value={`${fmt(result.maxSpanByBendingMM, 0)} mm`}
              />
              <Stat
                label={t("result.deflectionSpan")}
                value={`${fmt(result.maxSpanByDeflectionMM, 0)} mm`}
              />
              <Stat
                label={t("result.governing")}
                value={t(`governing.${result.governingCheck}`)}
                tone="warning"
              />
              <Stat
                label={t("result.totalLoad")}
                value={`${fmt(result.totalLoadKnPerM2, 2)} kN/m²`}
              />
              <Stat
                label={t("result.lineLoad")}
                value={`${fmt(result.loadPerLinearMeterKnPerM, 3)} kN/m`}
              />
              <Stat
                label={t("result.section")}
                value={`I=${fmt(result.momentOfInertiaMM4 / 1e6, 2)}×10⁶mm⁴`}
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
