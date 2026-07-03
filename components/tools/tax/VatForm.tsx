"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useTranslations, useLocale } from "next-intl";
import {
  calculateVat,
  type SimpleIndustry,
  type VatInput,
  type VatMode,
  type VatResult,
} from "@/lib/calculations/tax/vat";
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

interface FormValues {
  mode: VatMode;
  amount: number;
  purchaseAmount: number;
  industry: SimpleIndustry;
}

const formatKrw = (n: number): string =>
  new Intl.NumberFormat("ko-KR").format(Math.round(n));

const VAT_DEFAULTS: FormValues = {
  mode: "extract",
  amount: 110_000,
  purchaseAmount: 0,
  industry: "retail",
};

export function VatForm(): React.ReactElement {
  const t = useTranslations("vatTool");
  const rawLocale = useLocale();
  const locale =
    rawLocale === "vi" ? "vi" : rawLocale === "ko" ? "ko" : "en";
  // 의미있는 기본값으로 마운트 시 즉시 결과 노출 (빈 화면 제거)
  const [result, setResult] = useState<VatResult | null>(() => {
    try {
      const r = calculateVat({
        mode: VAT_DEFAULTS.mode,
        amount: VAT_DEFAULTS.amount,
      });
      return r.ok ? r : null;
    } catch {
      return null;
    }
  });
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    defaultValues: VAT_DEFAULTS,
  });

  const mode = watch("mode");

  const onSubmit = (values: FormValues): void => {
    setCalcError(null);
    const input: VatInput = {
      mode: values.mode,
      amount: Number(values.amount) || 0,
      purchaseAmount:
        values.mode === "general"
          ? Number(values.purchaseAmount) || 0
          : undefined,
      industry: values.mode === "simple" ? values.industry : undefined,
    };
    try {
      const r = calculateVat(input);
      setResult(r);
      if (!r.ok) setCalcError(t("errors.invalid"));
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

  const errMsg = (m?: string): string | undefined =>
    m ? t(m as never) : undefined;

  const renderStep = (s: { key: string; values?: Record<string, string | number> }): string => {
    const v = s.values ?? {};
    const fmt = (k: string): string => formatKrw(Number(v[k] ?? 0));
    switch (s.key) {
      case "steps.extract":
        return t("steps.extract", {
          total: fmt("total"),
          supply: fmt("supply"),
          vat: fmt("vat"),
        });
      case "steps.add":
        return t("steps.add", {
          supply: fmt("supply"),
          vat: fmt("vat"),
          total: fmt("total"),
        });
      case "steps.general.sales":
        return t("steps.generalSales", {
          total: fmt("total"),
          supply: fmt("supply"),
          vat: fmt("vat"),
        });
      case "steps.general.purchase":
        return t("steps.generalPurchase", {
          purchase: fmt("purchase"),
          purchaseVat: fmt("purchaseVat"),
        });
      case "steps.general.payable":
        return t("steps.generalPayable", {
          salesVat: fmt("salesVat"),
          purchaseVat: fmt("purchaseVat"),
          payable: fmt("payable"),
        });
      case "steps.simple":
        return t("steps.simple", {
          total: fmt("total"),
          industry: t(`industry.${String(v.industry)}` as never),
          rate: String(v.rate ?? 0),
          addedValue: fmt("addedValue"),
          payable: fmt("payable"),
        });
      default:
        return "";
    }
  };

  // 결과 hero 값 (모드별)
  const heroValue = (): { label: string; value: string; unit: string } => {
    if (!result?.ok) return { label: "", value: "", unit: "" };
    const lines = result.lines;
    if (mode === "extract") {
      const vat = lines.find((l) => l.key === "vat")?.amount ?? 0;
      return {
        label: t("result.vatLabel"),
        value: formatKrw(vat),
        unit: t("result.wonSuffix"),
      };
    }
    if (mode === "add") {
      const total = lines.find((l) => l.key === "total")?.amount ?? 0;
      return {
        label: t("result.totalLabel"),
        value: formatKrw(total),
        unit: t("result.wonSuffix"),
      };
    }
    const payable = lines.find((l) => l.key === "payable")?.amount ?? 0;
    return {
      label: t("result.payableLabel"),
      value: formatKrw(payable),
      unit: t("result.wonSuffix"),
    };
  };

  const hero = heroValue();

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={t("sections.mode")}>
          <Field label={t("fields.mode")} hint={t("hints.mode")}>
            <select className="input-base" {...register("mode")}>
              <option value="extract">{t("mode.extract")}</option>
              <option value="add">{t("mode.add")}</option>
              <option value="general">{t("mode.general")}</option>
              <option value="simple">{t("mode.simple")}</option>
            </select>
          </Field>
        </FieldGroup>

        <FieldGroup title={t("sections.amount")}>
          <Controller
            control={control}
            name="amount"
            render={({ field }) => (
              <Field
                label={t(`fields.amount.${mode}`)}
                hint={t(`hints.amount.${mode}`)}
                error={errMsg(errors.amount?.message)}
              >
                <NumberField
                  value={Number(field.value) || 0}
                  onChange={(v) => field.onChange(v)}
                  suffix={t("result.wonSuffix")}
                  min={0}
                  aria-label={t(`fields.amount.${mode}`)}
                />
              </Field>
            )}
          />

          {mode === "general" ? (
            <Controller
              control={control}
              name="purchaseAmount"
              render={({ field }) => (
                <Field
                  label={t("fields.purchaseAmount")}
                  hint={t("hints.purchaseAmount")}
                >
                  <NumberField
                    value={Number(field.value) || 0}
                    onChange={(v) => field.onChange(v)}
                    suffix={t("result.wonSuffix")}
                    min={0}
                    aria-label={t("fields.purchaseAmount")}
                  />
                </Field>
              )}
            />
          ) : null}

          {mode === "simple" ? (
            <Field label={t("fields.industry")} hint={t("hints.industry")}>
              <select className="input-base" {...register("industry")}>
                <option value="retail">{t("industry.retail")}</option>
                <option value="manufacturing">
                  {t("industry.manufacturing")}
                </option>
                <option value="lodging">{t("industry.lodging")}</option>
                <option value="construction">
                  {t("industry.construction")}
                </option>
                <option value="finance">{t("industry.finance")}</option>
              </select>
            </Field>
          ) : null}
        </FieldGroup>

        <ActionRow
          primary={
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full"
            >
              {t("actions.calculate")}
            </button>
          }
          secondary={
            <button type="button" onClick={onReset} className="btn-ghost">
              {t("actions.reset")}
            </button>
          }
        />
      </FormShell>

      <ResultShell
        heading={t("result.heading")}
        locale={locale}
        relatedLinks={
          locale === "ko"
            ? [
                { label: "프리랜서 세금 계산기", href: "/freelancer-tax" },
                { label: "종합소득세 계산기", href: "/income-tax" },
                { label: "사업자번호 조회", href: "/biznum-check" },
              ]
            : locale === "vi"
              ? [
                  { label: "Thuế freelancer", href: "/freelancer-tax" },
                  { label: "Thuế thu nhập", href: "/income-tax" },
                  {
                    label: "Tra cứu mã số doanh nghiệp",
                    href: "/biznum-check",
                  },
                ]
              : [
                  { label: "Freelancer Tax", href: "/freelancer-tax" },
                  { label: "Income Tax", href: "/income-tax" },
                  { label: "Business Number Check", href: "/biznum-check" },
                ]
        }
      >
        {calcError ? <ErrorBox message={calcError} /> : null}

        {!result || !result.ok ? (
          <EmptyResult message={t("result.empty")} />
        ) : (
          <div className="space-y-5">
            <HeroResult label={hero.label} value={hero.value} unit={hero.unit} />

            <div className="grid gap-3 sm:grid-cols-2">
              {result.lines.map((l) => (
                <Stat
                  key={l.key}
                  label={t(`lines.${l.key}` as never)}
                  value={`${formatKrw(l.amount)}${t("result.wonSuffix")}`}
                  tone={l.key === "payable" ? "warning" : "default"}
                />
              ))}
            </div>

            <StepsBox
              title={t("steps.heading")}
              items={result.steps.map(renderStep)}
            />

            <SourceBox lines={[t("source")]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
