"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  calculateForeignStockTax,
  foreignStockTaxInputSchema,
  type ForeignStockTaxInputResolved,
  type ForeignStockTaxResult,
  type ForeignStockTaxStep,
} from "@/lib/calculations/tax/foreignStockTax";
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

const formatKrw = (n: number): string =>
  new Intl.NumberFormat("ko-KR").format(Math.round(n));

export function ForeignStockTaxForm(): React.ReactElement {
  const t = useTranslations("foreignStockTaxTool");
  const [result, setResult] = useState<ForeignStockTaxResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ForeignStockTaxInputResolved>({
    resolver: zodResolver(foreignStockTaxInputSchema),
    defaultValues: {
      buyPriceForeign: 10000,
      buyExchangeRate: 1300,
      sellPriceForeign: 12000,
      sellExchangeRate: 1400,
      transactionCostKrw: 0,
      prevDeductionUsed: 0,
    },
  });

  const renderStep = (s: ForeignStockTaxStep): string => {
    switch (s.key) {
      case "buyKrw":
        return t("steps.buyKrw", {
          foreign: formatKrw(s.foreign),
          rate: s.rate,
          result: formatKrw(s.result),
        });
      case "sellKrw":
        return t("steps.sellKrw", {
          foreign: formatKrw(s.foreign),
          rate: s.rate,
          result: formatKrw(s.result),
        });
      case "gain":
        return t("steps.gain", {
          sell: formatKrw(s.sell),
          buy: formatKrw(s.buy),
          cost: formatKrw(s.cost),
          result: formatKrw(s.result),
        });
      case "deduction":
        return t("steps.deduction", {
          annual: formatKrw(s.annual),
          used: formatKrw(s.used),
          remaining: formatKrw(s.remaining),
        });
      case "taxableBase":
        return t("steps.taxableBase", {
          gain: formatKrw(s.gain),
          deduction: formatKrw(s.deduction),
          result: formatKrw(s.result),
        });
      case "tax":
        return t("steps.tax", {
          base: formatKrw(s.base),
          rate: (s.rate * 100).toFixed(0),
          result: formatKrw(s.result),
        });
      case "netProfit":
        return t("steps.netProfit", {
          gain: formatKrw(s.gain),
          tax: formatKrw(s.tax),
          result: formatKrw(s.result),
        });
    }
  };

  const onSubmit = (values: ForeignStockTaxInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateForeignStockTax(values));
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
        <FieldGroup title={t("sections.buy")}>
          <Controller
            control={control}
            name="buyPriceForeign"
            render={({ field }) => (
              <Field
                label={t("fields.buyPriceForeign")}
                hint={t("hints.foreignCurrency")}
                error={errMsg(errors.buyPriceForeign?.message)}
              >
                <NumberField
                  value={Number(field.value) || 0}
                  onChange={(v) => field.onChange(v)}
                  thousands={false}
                  decimals={2}
                  min={0}
                  aria-label={t("fields.buyPriceForeign")}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="buyExchangeRate"
            render={({ field }) => (
              <Field
                label={t("fields.buyExchangeRate")}
                hint={t("hints.exchangeRate")}
                error={errMsg(errors.buyExchangeRate?.message)}
              >
                <NumberField
                  value={Number(field.value) || 0}
                  onChange={(v) => field.onChange(v)}
                  thousands={false}
                  decimals={2}
                  min={0}
                  aria-label={t("fields.buyExchangeRate")}
                />
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup title={t("sections.sell")}>
          <Controller
            control={control}
            name="sellPriceForeign"
            render={({ field }) => (
              <Field
                label={t("fields.sellPriceForeign")}
                error={errMsg(errors.sellPriceForeign?.message)}
              >
                <NumberField
                  value={Number(field.value) || 0}
                  onChange={(v) => field.onChange(v)}
                  thousands={false}
                  decimals={2}
                  min={0}
                  aria-label={t("fields.sellPriceForeign")}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="sellExchangeRate"
            render={({ field }) => (
              <Field
                label={t("fields.sellExchangeRate")}
                error={errMsg(errors.sellExchangeRate?.message)}
              >
                <NumberField
                  value={Number(field.value) || 0}
                  onChange={(v) => field.onChange(v)}
                  thousands={false}
                  decimals={2}
                  min={0}
                  aria-label={t("fields.sellExchangeRate")}
                />
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup title={t("sections.options")}>
          <Controller
            control={control}
            name="transactionCostKrw"
            render={({ field }) => (
              <Field
                label={t("fields.transactionCostKrw")}
                hint={t("hints.transactionCost")}
                error={errMsg(errors.transactionCostKrw?.message)}
              >
                <NumberField
                  value={Number(field.value) || 0}
                  onChange={(v) => field.onChange(v)}
                  suffix={t("unit.krw")}
                  min={0}
                  aria-label={t("fields.transactionCostKrw")}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="prevDeductionUsed"
            render={({ field }) => (
              <Field
                label={t("fields.prevDeductionUsed")}
                hint={t("hints.prevDeduction")}
                error={errMsg(errors.prevDeductionUsed?.message)}
              >
                <NumberField
                  value={Number(field.value) || 0}
                  onChange={(v) => field.onChange(v)}
                  suffix={t("unit.krw")}
                  min={0}
                  aria-label={t("fields.prevDeductionUsed")}
                />
              </Field>
            )}
          />
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
              label={t("result.tax")}
              value={formatKrw(result.taxKrw)}
              unit={t("unit.krw")}
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t("result.capitalGain")}
                value={`${result.capitalGainKrw >= 0 ? "+" : ""}${formatKrw(result.capitalGainKrw)} ${t("unit.krw")}`}
                tone={result.isLoss ? "danger" : "success"}
              />
              <Stat
                label={t("result.netProfit")}
                value={`${result.netProfitKrw >= 0 ? "+" : ""}${formatKrw(result.netProfitKrw)} ${t("unit.krw")}`}
                tone={result.netProfitKrw < 0 ? "danger" : "success"}
              />
              <Stat
                label={t("result.taxableBase")}
                value={`${formatKrw(result.taxableBaseKrw)} ${t("unit.krw")}`}
              />
              <Stat
                label={t("result.remainingDeduction")}
                value={`${formatKrw(result.remainingDeductionKrw)} ${t("unit.krw")}`}
              />
            </dl>
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
