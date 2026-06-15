"use client";

import { useState } from "react";
import { useForm, Controller, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculateApartmentArea,
  apartmentAreaInputSchema,
  type ApartmentAreaInputResolved,
  type ApartmentAreaResult,
} from "@/lib/calculations/realestate/apartmentArea";
import { formatKrw, formatKoreanMoney, formatNumber } from "@/lib/utils/format";
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
} from "@/components/ui/calc-form";

interface ApartmentAreaFormProps {
  locale: "ko" | "en";
}

const TEXT = {
  ko: {
    section: "면적 · 가격",
    fieldSupply: "공급면적 (㎡)",
    fieldSupplyHint: "매물 광고에 표기되는 면적 (예: 84㎡)",
    fieldExclusive: "전용면적 (㎡)",
    fieldExclusiveHint: "실제 거주 공간 — 방·거실·주방·화장실",
    fieldPrice: "매매·전세가 (원, 선택)",
    fieldPriceHint: "입력하면 평당가까지 계산",
    calculate: "계산하기",
    reset: "초기화",
    resultHeading: "면적 · 평당가 분석",
    resultEmpty: "공급·전용면적을 입력하고 계산하세요.",
    error: "계산 중 오류가 발생했습니다.",
    exclusiveHero: "실제 거주 (전용면적)",
    pyeong: "평",
    won: "원",
    supplyPyeong: "공급면적",
    exclusiveRate: "전용률",
    perPyeongSupply: "평당가 (공급 기준)",
    perPyeongExclusive: "평당가 (전용 기준)",
    sourceTitle: "기준 · 정의",
    sourceLines: [
      "공급면적 = 전용면적 + 주거공용(계단·복도). 매물 광고의 '84㎡'는 보통 공급면적.",
      "전용면적 = 실제 거주 공간. 전용률 = 전용 ÷ 공급 (아파트 70~80%, 오피스텔 50~60%).",
      "1평 = 3.3058㎡. 84㎡ ≈ 25.4평(공급), 전용 59㎡ ≈ 17.8평 = '국민평형'.",
      "평당가는 공급 기준이 일반적이나, 실제 가치는 전용 기준이 더 정확.",
      "참고용 — 등기·계약서의 실제 면적을 확인하세요.",
    ],
  },
  en: {
    section: "Area · Price",
    fieldSupply: "Supply area (㎡)",
    fieldSupplyHint: "The area shown in listings (e.g. 84㎡)",
    fieldExclusive: "Exclusive area (㎡)",
    fieldExclusiveHint: "Your actual living space — rooms, living room, kitchen, bath",
    fieldPrice: "Sale/jeonse price (₩, optional)",
    fieldPriceHint: "Enter to also get price per pyeong",
    calculate: "Calculate",
    reset: "Reset",
    resultHeading: "Area & Price-per-Pyeong",
    resultEmpty: "Enter supply and exclusive area, then calculate.",
    error: "Calculation failed.",
    exclusiveHero: "Actual living space (exclusive)",
    pyeong: "pyeong",
    won: "₩",
    supplyPyeong: "Supply area",
    exclusiveRate: "Exclusive ratio",
    perPyeongSupply: "Price/pyeong (supply)",
    perPyeongExclusive: "Price/pyeong (exclusive)",
    sourceTitle: "Basis · definitions",
    sourceLines: [
      "Supply area = exclusive + shared residential (stairs, hallways). A listing's '84㎡' is usually supply area.",
      "Exclusive area = your actual living space. Exclusive ratio = exclusive ÷ supply (apartments 70–80%, officetels 50–60%).",
      "1 pyeong = 3.3058㎡. 84㎡ ≈ 25.4 pyeong (supply); exclusive 59㎡ ≈ 17.8 pyeong — Korea's 'national size'.",
      "Price per pyeong is usually quoted on supply area, but exclusive-based is more accurate for real value.",
      "Reference only — verify the actual areas on the deed and contract.",
    ],
  },
} as const;

function MoneyField({
  control,
  name,
  label,
  hint,
  locale,
}: {
  control: Control<ApartmentAreaInputResolved>;
  name: "price";
  label: string;
  hint: string;
  locale: "ko" | "en";
}): React.ReactElement {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field }) => {
        const num = Number(field.value) || 0;
        return (
          <Field label={label} hint={hint}>
            <input
              type="text"
              inputMode="numeric"
              className="input-base"
              value={num > 0 ? num.toLocaleString("ko-KR") : ""}
              placeholder="0"
              onChange={(e) => {
                const raw = e.target.value.replace(/[^0-9]/g, "");
                field.onChange(raw === "" ? 0 : Number(raw));
              }}
              onBlur={field.onBlur}
            />
            {locale === "ko" && num > 0 && (
              <p className="mt-1.5 text-xs font-medium text-[color:var(--color-accent)]">
                = {formatKoreanMoney(num)}
              </p>
            )}
          </Field>
        );
      }}
    />
  );
}

export function ApartmentAreaForm({
  locale,
}: ApartmentAreaFormProps): React.ReactElement {
  const T = TEXT[locale];
  const [result, setResult] = useState<ApartmentAreaResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<ApartmentAreaInputResolved>({
    resolver: zodResolver(apartmentAreaInputSchema),
    defaultValues: { supplyAreaSqm: 84, exclusiveAreaSqm: 59, price: 0 },
  });

  const onSubmit = (values: ApartmentAreaInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateApartmentArea(values));
    } catch {
      setResult(null);
      setCalcError(T.error);
    }
  };
  const onReset = (): void => {
    reset();
    setResult(null);
    setCalcError(null);
  };

  const hasPrice = result !== null && result.pricePerPyeongSupply > 0;

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={T.section}>
          <Field label={T.fieldSupply} hint={T.fieldSupplyHint}>
            <input
              type="number"
              step="1"
              min="0"
              inputMode="decimal"
              className="input-base"
              {...register("supplyAreaSqm", { valueAsNumber: true })}
            />
          </Field>
          <Field label={T.fieldExclusive} hint={T.fieldExclusiveHint}>
            <input
              type="number"
              step="1"
              min="0"
              inputMode="decimal"
              className="input-base"
              {...register("exclusiveAreaSqm", { valueAsNumber: true })}
            />
          </Field>
          <MoneyField
            control={control}
            name="price"
            label={T.fieldPrice}
            hint={T.fieldPriceHint}
            locale={locale}
          />
        </FieldGroup>

        <ActionRow
          primary={
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {T.calculate}
            </button>
          }
          secondary={
            <button type="button" onClick={onReset} className="btn-ghost sm:w-auto">
              {T.reset}
            </button>
          }
        />
      </FormShell>

      <ResultShell heading={T.resultHeading}>
        {calcError && <ErrorBox message={calcError} />}
        {!calcError && !result && <EmptyResult message={T.resultEmpty} />}
        {result && (
          <div className="animate-fade-up space-y-5">
            <HeroResult
              label={T.exclusiveHero}
              value={formatNumber(result.exclusivePyeong, 1)}
              unit={T.pyeong}
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={T.supplyPyeong}
                value={`${formatNumber(result.supplyPyeong, 1)} ${T.pyeong}`}
              />
              <Stat
                label={T.exclusiveRate}
                value={`${formatNumber(result.exclusiveRate * 100, 1)}%`}
                tone="success"
              />
              {hasPrice && (
                <>
                  <Stat
                    label={T.perPyeongSupply}
                    value={`${formatKrw(result.pricePerPyeongSupply)} ${T.won}`}
                  />
                  <Stat
                    label={T.perPyeongExclusive}
                    value={`${formatKrw(result.pricePerPyeongExclusive)} ${T.won}`}
                  />
                </>
              )}
            </dl>

            <SourceBox lines={[T.sourceTitle, ...T.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
