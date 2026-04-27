"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  calculateInsurance,
  insuranceInputSchema,
  type InsuranceInputResolved,
  type InsuranceResult,
  type InsuranceWarning,
} from "@/lib/calculations/insurance/fourMajorInsurance";
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
  WarningsBox,
} from "@/components/ui/calc-form";

const formatKrw = (n: number): string =>
  new Intl.NumberFormat("ko-KR").format(Math.round(n));

export function InsuranceForm(): React.ReactElement {
  const t = useTranslations("insuranceTool");
  const [result, setResult] = useState<InsuranceResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<InsuranceInputResolved>({
    resolver: zodResolver(insuranceInputSchema),
    defaultValues: {
      monthlySalary: 3_000_000,
      industrialAccidentRate: 0.0086,
    },
  });

  const renderWarning = (w: InsuranceWarning): string => {
    switch (w.key) {
      case "pensionCapped":
        return t("warnings.pensionCapped", {
          cap: formatKrw(w.cap),
        });
      case "pensionFloored":
        return t("warnings.pensionFloored", {
          floor: formatKrw(w.floor),
        });
    }
  };

  const onSubmit = (values: InsuranceInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateInsurance(values));
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
        <FieldGroup title={t("sections.salary")}>
          <Field
            label={t("fields.monthlySalary")}
            hint={t("hints.monthlySalary")}
            error={errMsg(errors.monthlySalary?.message)}
          >
            <input
              type="number"
              step="10000"
              inputMode="numeric"
              className="input-base"
              {...register("monthlySalary", { valueAsNumber: true })}
            />
          </Field>
          <Field
            label={t("fields.industrialAccidentRate")}
            hint={t("hints.industrialAccidentRate")}
          >
            <input
              type="number"
              step="0.001"
              inputMode="decimal"
              className="input-base"
              {...register("industrialAccidentRate", { valueAsNumber: true })}
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
              label={t("result.netSalary")}
              value={formatKrw(result.netSalary)}
              unit={t("unit.krw")}
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t("result.totalEmployee")}
                value={`-${formatKrw(result.totalEmployee)} ${t("unit.krw")}`}
                tone="warning"
              />
              <Stat
                label={t("result.totalEmployer")}
                value={`+${formatKrw(result.totalEmployer)} ${t("unit.krw")}`}
              />
              <Stat
                label={t("result.totalCost")}
                value={`${formatKrw(result.totalCost)} ${t("unit.krw")}`}
                full
              />
            </dl>

            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                {t("result.breakdown")}
              </h3>
              <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-[color:var(--color-text-tertiary)]">
                      <th className="px-3 py-2 text-left font-medium">
                        {t("result.col.item")}
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        {t("result.col.employee")}
                      </th>
                      <th className="px-3 py-2 text-right font-medium">
                        {t("result.col.employer")}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-[color:var(--color-text-secondary)]">
                    {result.lines.map((l) => (
                      <tr
                        key={l.key}
                        className="border-t border-[color:var(--color-border-subtle)]"
                      >
                        <td className="px-3 py-2">
                          <div>{t(`lines.${l.key}`)}</div>
                          <div className="text-[10px] text-[color:var(--color-text-muted)]">
                            {l.rateNote}
                          </div>
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {l.employee > 0 ? formatKrw(l.employee) : "—"}
                        </td>
                        <td className="px-3 py-2 text-right tabular-nums">
                          {l.employer > 0 ? formatKrw(l.employer) : "—"}
                        </td>
                      </tr>
                    ))}
                    <tr className="border-t border-[color:var(--color-border-default)] bg-[color:var(--color-bg-card-hover)] font-semibold text-[color:var(--color-text-primary)]">
                      <td className="px-3 py-2">{t("result.col.total")}</td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {formatKrw(result.totalEmployee)}
                      </td>
                      <td className="px-3 py-2 text-right tabular-nums">
                        {formatKrw(result.totalEmployer)}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {result.warnings.length > 0 && (
              <WarningsBox
                title={t("result.warnings")}
                items={result.warnings.map(renderWarning)}
              />
            )}

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
