"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { CheckCircle2, XCircle } from "lucide-react";
import {
  bizNumberInputSchema,
  validateBizNumber,
  type BizNumberInputResolved,
  type BizNumberResult,
  type BizNumberStep,
  type BizNumberWarning,
} from "@/lib/calculations/business/bizNumber";
import {
  ActionRow,
  CalcLayout,
  EmptyResult,
  ErrorBox,
  Field,
  FieldGroup,
  FormShell,
  ResultShell,
  SourceBox,
  Stat,
  StepsBox,
  WarningsBox,
} from "@/components/ui/calc-form";

export function BizNumberForm(): React.ReactElement {
  const t = useTranslations("bizNumberTool");
  const [result, setResult] = useState<BizNumberResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BizNumberInputResolved>({
    resolver: zodResolver(bizNumberInputSchema),
    defaultValues: { number: "220-81-62517" },
  });

  const renderStep = (s: BizNumberStep): string => {
    switch (s.key) {
      case "normalize":
        return t("steps.normalize", { raw: s.raw, result: s.result });
      case "format":
        return t("steps.format", { result: s.result });
      case "weightedSum":
        return t("steps.weightedSum", {
          digits: s.digits.join("·"),
          weights: s.weights.join("·"),
          sum: s.sum,
        });
      case "extraAdd":
        return t("steps.extraAdd", {
          ninth: s.ninth,
          extra: s.extra,
          newSum: s.newSum,
        });
      case "checksum":
        return t("steps.checksum", {
          sum: s.sum,
          computed: s.computed,
          actual: s.actual,
          status: s.match ? t("status.match") : t("status.noMatch"),
        });
      case "personType":
        return t("steps.personType", {
          middle: s.middle,
          result: t(`personType.${s.result}`),
        });
    }
  };

  const renderWarning = (w: BizNumberWarning): string => {
    switch (w.key) {
      case "formatInvalid":
        return t("warnings.formatInvalid");
      case "checksumFailed":
        return t("warnings.checksumFailed", {
          expected: w.expected,
          actual: w.actual,
        });
      case "needsExternalApi":
        return t("warnings.needsExternalApi");
    }
  };

  const onSubmit = (values: BizNumberInputResolved): void => {
    setCalcError(null);
    try {
      setResult(validateBizNumber(values));
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
        <FieldGroup title={t("sections.input")}>
          <Field
            label={t("fields.number")}
            hint={t("hints.number")}
            error={errMsg(errors.number?.message)}
          >
            <input
              type="text"
              inputMode="numeric"
              autoComplete="off"
              spellCheck={false}
              className="input-base font-mono"
              placeholder="000-00-00000"
              {...register("number")}
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
            <div
              className={`rounded-xl p-5 ring-1 ${
                result.isValid
                  ? "bg-gradient-to-br from-emerald-500/15 via-emerald-500/5 to-transparent ring-emerald-500/30"
                  : "bg-gradient-to-br from-red-500/15 via-red-500/5 to-transparent ring-red-500/30"
              }`}
            >
              <div className="flex items-center gap-3">
                {result.isValid ? (
                  <CheckCircle2 className="h-7 w-7 text-emerald-300" />
                ) : (
                  <XCircle className="h-7 w-7 text-red-300" />
                )}
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                    {t("result.status")}
                  </p>
                  <p
                    className={`text-2xl font-bold ${
                      result.isValid ? "text-emerald-200" : "text-red-200"
                    }`}
                  >
                    {result.isValid ? t("status.valid") : t("status.invalid")}
                  </p>
                </div>
              </div>
              <p className="mt-3 font-mono text-lg font-semibold text-white">
                {result.formatted}
              </p>
            </div>

            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t("result.formatValid")}
                value={result.formatValid ? "✓" : "✗"}
                tone={result.formatValid ? "success" : "danger"}
              />
              <Stat
                label={t("result.checksumValid")}
                value={result.checksumValid ? "✓" : "✗"}
                tone={result.checksumValid ? "success" : "danger"}
              />
              <Stat
                label={t("result.personType")}
                value={t(`personType.${result.personType}`)}
                full
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
