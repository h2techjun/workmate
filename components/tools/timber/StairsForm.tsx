"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  calculateStairs,
  stairsInputSchema,
  type StairsResult,
  type StairsStep,
  type StairWarning,
} from "@/lib/calculations/timber/stairs";
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
import { NumberField } from "@/components/ui/NumberField";
import { formatNumber } from "@/lib/utils/format";

const fmt = (n: number, d: number = 1): string => formatNumber(n, d);

export function StairsForm(): React.ReactElement {
  const t = useTranslations("stairsTool");
  const [result, setResult] = useState<StairsResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<
    Record<string, string>
  >({});

  const [totalRise, setTotalRise] = useState(2700);
  const [totalRunRaw, setTotalRunRaw] = useState(0);
  const [hasTotalRun, setHasTotalRun] = useState(false);
  const [preferredRiser, setPreferredRiser] = useState(180);
  const [useType, setUseType] = useState<"residential" | "public">(
    "residential",
  );

  const renderStep = (s: StairsStep): string => {
    switch (s.key) {
      case "numSteps":
        return t("steps.numSteps", {
          totalRise: s.totalRise,
          preferred: s.preferred,
          result: s.result,
        });
      case "actualRiser":
        return t("steps.actualRiser", {
          totalRise: s.totalRise,
          steps: s.steps,
          result: fmt(s.result),
        });
      case "treadFromRun":
        return t("steps.treadFromRun", {
          totalRun: s.totalRun,
          stepsMinus1: s.stepsMinus1,
          result: fmt(s.result),
        });
      case "treadFromBlondel":
        return t("steps.treadFromBlondel", {
          target: s.target,
          riser: fmt(s.riser),
          result: fmt(s.result),
        });
      case "stairLength":
        return t("steps.stairLength", {
          totalRise: s.totalRise,
          runDist: fmt(s.runDist),
          result: fmt(s.result),
        });
      case "angle":
        return t("steps.angle", {
          riser: fmt(s.riser),
          tread: fmt(s.tread),
          result: fmt(s.result, 2),
        });
      case "blondel":
        return t("steps.blondel", {
          riser: fmt(s.riser),
          tread: fmt(s.tread),
          result: fmt(s.result),
          min: s.min,
          max: s.max,
        });
    }
  };

  const renderWarning = (w: StairWarning): string => {
    switch (w.key) {
      case "riserTooHigh":
        return t("warnings.riserTooHigh", {
          actual: fmt(w.actual),
          max: w.max,
        });
      case "treadTooSmall":
        return t("warnings.treadTooSmall", {
          actual: fmt(w.actual),
          min: w.min,
        });
      case "blondelOutOfRange":
        return t("warnings.blondelOutOfRange", {
          value: fmt(w.value),
          min: w.min,
          max: w.max,
        });
      case "preferredRiserExceedsLimit":
        return t("warnings.preferredRiserExceedsLimit", {
          preferred: w.preferred,
          max: w.max,
        });
    }
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setCalcError(null);
    setValidationErrors({});

    const raw = {
      totalRise,
      totalRun: hasTotalRun && totalRunRaw > 0 ? totalRunRaw : undefined,
      preferredRiser,
      useType,
    };

    const parsed = stairsInputSchema.safeParse(raw);
    if (!parsed.success) {
      const errs: Record<string, string> = {};
      parsed.error.errors.forEach((e) => {
        const key = e.path[0]?.toString() ?? "unknown";
        errs[key] = t(e.message as never);
      });
      setValidationErrors(errs);
      return;
    }

    try {
      setResult(calculateStairs(parsed.data));
    } catch {
      setResult(null);
      setCalcError(t("errors.unknown"));
    }
  };

  const onReset = (): void => {
    setTotalRise(2700);
    setTotalRunRaw(0);
    setHasTotalRun(false);
    setPreferredRiser(180);
    setUseType("residential");
    setResult(null);
    setCalcError(null);
    setValidationErrors({});
  };

  return (
    <CalcLayout>
      <FormShell onSubmit={onSubmit}>
        <FieldGroup title={t("sections.geometry")}>
          <Field
            label={t("fields.totalRise")}
            error={validationErrors["totalRise"]}
          >
            <NumberField
              value={totalRise}
              onChange={setTotalRise}
              thousands={false}
              decimals={0}
              min={100}
              max={10000}
              suffix="mm"
              aria-label={t("fields.totalRise")}
            />
          </Field>
          <Field
            label={t("fields.totalRun")}
            hint={t("hints.totalRun")}
            error={validationErrors["totalRun"]}
          >
            <NumberField
              value={totalRunRaw}
              onChange={(v) => {
                setTotalRunRaw(v);
                setHasTotalRun(v > 0);
              }}
              thousands={false}
              decimals={0}
              min={0}
              max={20000}
              suffix="mm"
              aria-label={t("fields.totalRun")}
            />
          </Field>
          <Field
            label={t("fields.preferredRiser")}
            hint={t("hints.preferredRiser")}
            error={validationErrors["preferredRiser"]}
          >
            <NumberField
              value={preferredRiser}
              onChange={setPreferredRiser}
              thousands={false}
              decimals={0}
              min={80}
              max={250}
              suffix="mm"
              aria-label={t("fields.preferredRiser")}
            />
          </Field>
        </FieldGroup>

        <FieldGroup title={t("sections.options")}>
          <Field label={t("fields.useType")}>
            <select
              className="input-base"
              value={useType}
              onChange={(e) =>
                setUseType(e.target.value as "residential" | "public")
              }
            >
              <option value="residential">{t("useType.residential")}</option>
              <option value="public">{t("useType.public")}</option>
            </select>
          </Field>
        </FieldGroup>

        <ActionRow
          primary={
            <button type="submit" className="btn-primary flex-1">
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
              label={t("result.numSteps")}
              value={result.numSteps.toString()}
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t("result.actualRiser")}
                value={`${fmt(result.actualRiser)} mm`}
                tone={result.riserOk ? "success" : "warning"}
              />
              <Stat
                label={t("result.tread")}
                value={`${fmt(result.tread)} mm`}
                tone={result.treadOk ? "success" : "warning"}
              />
              <Stat
                label={t("result.angle")}
                value={`${fmt(result.angleDegrees, 2)}°`}
              />
              <Stat
                label={t("result.stairLength")}
                value={`${fmt(result.stairLength)} mm`}
              />
              <Stat
                label={t("result.blondel")}
                value={`${fmt(result.blondelValue)} mm`}
                tone={result.blondelOk ? "success" : "warning"}
                full
              />
            </dl>
            {result.warnings.length > 0 && (
              <WarningsBox
                title={t("result.warningsTitle")}
                items={result.warnings.map(renderWarning)}
              />
            )}
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
