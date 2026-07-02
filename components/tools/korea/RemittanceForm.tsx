"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculateRemittance,
  remittanceInputSchema,
  type RemittanceInputResolved,
} from "@/lib/calculations/korea/remittance";
import {
  METHOD_DEFAULTS,
  type RemittanceMethod,
} from "@/lib/constants/korea/remittance";
import { formatKrw, formatKoreanMoney } from "@/lib/utils/format";
import {
  CalcLayout,
  EmptyResult,
  Field,
  FieldGroup,
  FormShell,
  HeroResult,
  ResultShell,
  SourceBox,
  Stat,
} from "@/components/ui/calc-form";
import { NumberField } from "@/components/ui/NumberField";

interface RemittanceFormProps {
  locale: "ko" | "en";
}

const TEXT = {
  ko: {
    sectionMethod: "송금 방식",
    fieldMethod: "어떤 경로로 보내나요?",
    methodBank: "은행 창구·앱 (통상 스프레드·수수료 큼)",
    methodSpecialist: "전문 송금업체 (통상 스프레드·수수료 작음)",
    sectionAmount: "금액 · 비용 (편집 가능)",
    fieldAmount: "송금액 (원)",
    fieldMargin: "환율 마진(스프레드) (%)",
    fieldMarginHint: "고시환율과 실제 적용환율의 차이. 업체 안내값으로 바꾸세요.",
    fieldFee: "건당 고정 수수료 (원)",
    heading: "해외송금 비용 추정",
    empty: "송금액을 입력하세요.",
    heroLabel: "실질 비용률",
    totalCost: "총비용",
    fxCost: "환율 마진 비용",
    fixedFee: "고정 수수료",
    afterCost: "실수령 상당액 (원화가치)",
    won: "원",
    note: "'실질 비용'은 눈에 보이는 수수료 + 숨은 환율 마진의 합입니다. 마진은 업체마다 다르니 실제 안내값으로 바꿔 비교하세요.",
    sourceTitle: "기준 · 성격",
    sourceLines: [
      "총비용 = 송금액 × 마진율 + 고정 수수료,  실질률 = 총비용 ÷ 송금액",
      "실시간 환율·특정 업체 요율은 다루지 않습니다(변동). 마진·수수료는 사용자 입력 가정.",
      "방식 선택은 대표 범위값을 채워줄 뿐이며 특정 업체를 권유·비교하지 않습니다.",
      "규정(연간 한도·신고·증빙)은 아래 가이드와 은행·한국은행 공식 안내를 확인하세요.",
      "참고용 추정. 실제 비용은 송금 직전 견적(적용환율·수수료)으로 확정됩니다.",
    ],
  },
  en: {
    sectionMethod: "Method",
    fieldMethod: "How are you sending?",
    methodBank: "Bank branch / app (usually wider spread & fee)",
    methodSpecialist: "Specialist transfer service (usually lower)",
    sectionAmount: "Amount · cost (editable)",
    fieldAmount: "Amount to send (₩)",
    fieldMargin: "FX margin (spread) (%)",
    fieldMarginHint: "Gap between the mid-market and applied rate. Replace with your provider's figure.",
    fieldFee: "Fixed fee per transfer (₩)",
    heading: "Remittance cost estimate",
    empty: "Enter an amount to send.",
    heroLabel: "Effective cost rate",
    totalCost: "Total cost",
    fxCost: "FX margin cost",
    fixedFee: "Fixed fee",
    afterCost: "Value delivered (in KRW terms)",
    won: "₩",
    note: "The real cost is the visible fee PLUS the hidden FX margin. Margins differ by provider — replace them with your quote to compare.",
    sourceTitle: "Basis · nature",
    sourceLines: [
      "Total cost = amount × margin% + fixed fee;  effective rate = total ÷ amount.",
      "No live exchange rates or named provider fees (they move). Margin and fee are your assumptions.",
      "The method choice only prefills representative ranges — it does not recommend or compare specific providers.",
      "Rules (annual limits, reporting, proof) — see the guide below and your bank / Bank of Korea.",
      "Reference estimate. The real cost is fixed by the quote (applied rate + fee) at the moment you send.",
    ],
  },
} as const;

const DEFAULT_METHOD: RemittanceMethod = "bank";

function buildDefaults(method: RemittanceMethod): RemittanceInputResolved {
  return {
    sendAmount: 1_000_000,
    fxMarginPercent: METHOD_DEFAULTS[method].fxMarginPercent,
    fixedFee: METHOD_DEFAULTS[method].fixedFee,
  };
}

const pct = (v: number): string => `${v.toFixed(2)}%`;

export function RemittanceForm({
  locale,
}: RemittanceFormProps): React.ReactElement {
  const T = TEXT[locale];
  const [method, setMethod] = useState<RemittanceMethod>(DEFAULT_METHOD);

  const { control, watch, setValue } = useForm<RemittanceInputResolved>({
    resolver: zodResolver(remittanceInputSchema),
    defaultValues: buildDefaults(DEFAULT_METHOD),
    mode: "onChange",
  });

  const values = watch();
  const result = useMemo(() => {
    try {
      return calculateRemittance(remittanceInputSchema.parse(values));
    } catch {
      return null;
    }
  }, [values]);

  const onMethodChange = (next: RemittanceMethod): void => {
    setMethod(next);
    setValue("fxMarginPercent", METHOD_DEFAULTS[next].fxMarginPercent, {
      shouldValidate: true,
    });
    setValue("fixedFee", METHOD_DEFAULTS[next].fixedFee, {
      shouldValidate: true,
    });
  };

  return (
    <CalcLayout>
      <FormShell onSubmit={(e) => e.preventDefault()}>
        <FieldGroup title={T.sectionMethod}>
          <Field label={T.fieldMethod}>
            <select
              className="input-base"
              value={method}
              onChange={(e) =>
                onMethodChange(e.target.value as RemittanceMethod)
              }
            >
              <option value="bank">{T.methodBank}</option>
              <option value="specialist">{T.methodSpecialist}</option>
            </select>
          </Field>
        </FieldGroup>

        <FieldGroup title={T.sectionAmount}>
          <Controller
            control={control}
            name="sendAmount"
            render={({ field }) => (
              <Field label={T.fieldAmount}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands
                  decimals={0}
                  suffix="원"
                  aria-label={T.fieldAmount}
                />
                {locale === "ko" && field.value > 0 && (
                  <p className="mt-1.5 text-xs font-medium text-[color:var(--color-accent)]">
                    = {formatKoreanMoney(field.value)}
                  </p>
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="fxMarginPercent"
            render={({ field }) => (
              <Field label={T.fieldMargin} hint={T.fieldMarginHint}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={2}
                  suffix="%"
                  aria-label={T.fieldMargin}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="fixedFee"
            render={({ field }) => (
              <Field label={T.fieldFee}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands
                  decimals={0}
                  suffix="원"
                  aria-label={T.fieldFee}
                />
              </Field>
            )}
          />
        </FieldGroup>
      </FormShell>

      <ResultShell
        heading={T.heading}
        locale={locale}
        relatedLinks={
          locale === "en"
            ? [
                { label: "Cost of Living in Korea", href: "/cost-of-living" },
                { label: "Pension Refund", href: "/pension-refund" },
                { label: "Foreign Flat Tax (19%)", href: "/foreign-flat-tax" },
              ]
            : [
                { label: "한국 생활비 계산", href: "/cost-of-living" },
                { label: "국민연금 반환일시금", href: "/pension-refund" },
                { label: "외국인 단일세율", href: "/foreign-flat-tax" },
              ]
        }
      >
        {!result || !result.valid ? (
          <EmptyResult message={T.empty} />
        ) : (
          <div className="animate-fade-up space-y-5">
            <HeroResult
              label={T.heroLabel}
              value={pct(result.effectiveCostPercent)}
            />

            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={T.totalCost}
                value={`${formatKrw(result.totalCost)} ${T.won}`}
                tone="warning"
              />
              <Stat
                label={T.afterCost}
                value={`${formatKrw(result.amountAfterCost)} ${T.won}`}
                tone="success"
              />
              <Stat
                label={T.fxCost}
                value={`${formatKrw(result.fxCost)} ${T.won}`}
              />
              <Stat
                label={T.fixedFee}
                value={`${formatKrw(result.fixedFee)} ${T.won}`}
              />
            </dl>

            <p className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-xs leading-relaxed text-[color:var(--color-text-tertiary)]">
              {T.note}
            </p>

            <SourceBox lines={[T.sourceTitle, ...T.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
