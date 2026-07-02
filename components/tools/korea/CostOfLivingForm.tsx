"use client";

import { useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculateCostOfLiving,
  costOfLivingInputSchema,
  type CostOfLivingInputResolved,
} from "@/lib/calculations/korea/costOfLiving";
import {
  COST_LINE_KEYS,
  suggestDefaults,
  type CostLineKey,
  type Household,
  type Region,
} from "@/lib/constants/korea/costOfLiving";
import { formatKrw, formatKoreanMoney } from "@/lib/utils/format";
import {
  ActionRow,
  CalcLayout,
  Field,
  FieldGroup,
  FormShell,
  HeroResult,
  ResultShell,
  SourceBox,
  Stat,
} from "@/components/ui/calc-form";
import { NumberField } from "@/components/ui/NumberField";

interface CostOfLivingFormProps {
  locale: "ko" | "en";
}

const TEXT = {
  ko: {
    sectionProfile: "지역 · 가구",
    fieldRegion: "지역",
    fieldHousehold: "가구",
    sectionItems: "월 항목 (모두 편집 가능)",
    calculate: "다시 계산",
    reset: "기본값으로",
    heading: "월 생활비 추정",
    heroLabel: "월 합계 (추정)",
    won: "원",
    annual: "연간 환산",
    perPerson: "1인당 월",
    note: "각 항목은 지역·가구 기준의 일반적 추정 중앙값입니다. 본인 상황에 맞게 직접 수정하세요 — 합계는 입력한 값의 총합입니다.",
    regionOpt: {
      seoulCore: "서울 도심 (강남·마포 등)",
      seoulOuter: "서울 외곽",
      gyeonggi: "경기 (수도권)",
      metro: "광역시 (부산·대구 등)",
      other: "지방 중소도시",
    } as Record<Region, string>,
    householdOpt: {
      single: "1인",
      couple: "커플 (2인)",
      family: "가족 (3~4인)",
    } as Record<Household, string>,
    lineLabel: {
      rent: "월세",
      utilities: "공과금 (전기·가스·수도·관리비)",
      food: "식비",
      transport: "교통",
      mobile: "통신",
      healthInsurance: "건강보험",
      other: "기타 (여가·의류·잡비)",
    } as Record<CostLineKey, string>,
    sourceTitle: "기준 · 성격",
    sourceLines: [
      "합계 = 위 7개 항목의 단순 합 (입력값 그대로).",
      "지역·가구 선택은 편집 가능한 기본값을 채워줄 뿐, '한국은 얼마다'라는 단정이 아닙니다.",
      "월세는 지역·전용면적, 건강보험은 소득·재산·가입유형(직장/지역)에 따라 크게 다릅니다.",
      "USD 환산은 환율 변동으로 오해를 줄 수 있어 원화만 표시합니다.",
      "2026 기준 일반적 추정 범위의 대표값. 참고용 — 실제 계약·고지서로 확인하세요.",
    ],
  },
  en: {
    sectionProfile: "Region · household",
    fieldRegion: "Region",
    fieldHousehold: "Household",
    sectionItems: "Monthly items (all editable)",
    calculate: "Recalculate",
    reset: "Reset defaults",
    heading: "Monthly cost estimate",
    heroLabel: "Monthly total (estimate)",
    won: "₩",
    annual: "Annualized",
    perPerson: "Per person / month",
    note: "Each line is a typical mid-range estimate for the region and household. Edit them to your situation — the total is simply the sum of what you enter.",
    regionOpt: {
      seoulCore: "Central Seoul (Gangnam, Mapo…)",
      seoulOuter: "Outer Seoul",
      gyeonggi: "Gyeonggi (metro area)",
      metro: "Metro city (Busan, Daegu…)",
      other: "Smaller city",
    } as Record<Region, string>,
    householdOpt: {
      single: "Single",
      couple: "Couple (2)",
      family: "Family (3–4)",
    } as Record<Household, string>,
    lineLabel: {
      rent: "Rent",
      utilities: "Utilities (power, gas, water, fees)",
      food: "Food",
      transport: "Transport",
      mobile: "Mobile",
      healthInsurance: "Health insurance",
      other: "Other (leisure, clothes, misc.)",
    } as Record<CostLineKey, string>,
    sourceTitle: "Basis · nature",
    sourceLines: [
      "Total = plain sum of the 7 items above (your inputs).",
      "Region/household only prefill editable defaults — this is not a claim that 'Korea costs X'.",
      "Rent varies by area and size; health insurance varies by income, assets, and scheme (employer vs local).",
      "USD conversion is omitted — exchange rates move and would mislead. KRW only.",
      "Representative mid-range estimates for 2026. Reference only — confirm with real contracts and bills.",
    ],
  },
} as const;

const INITIAL_REGION: Region = "seoulCore";
const INITIAL_HOUSEHOLD: Household = "single";

function buildDefaults(
  region: Region,
  household: Household,
): CostOfLivingInputResolved {
  return { household, ...suggestDefaults(region, household) };
}

export function CostOfLivingForm({
  locale,
}: CostOfLivingFormProps): React.ReactElement {
  const T = TEXT[locale];
  const [region, setRegion] = useState<Region>(INITIAL_REGION);

  const { control, watch, setValue, reset } =
    useForm<CostOfLivingInputResolved>({
      resolver: zodResolver(costOfLivingInputSchema),
      defaultValues: buildDefaults(INITIAL_REGION, INITIAL_HOUSEHOLD),
      mode: "onChange",
    });

  const values = watch();
  const result = useMemo(() => {
    try {
      return calculateCostOfLiving(costOfLivingInputSchema.parse(values));
    } catch {
      return null;
    }
  }, [values]);

  // 지역·가구 변경 시 편집 가능한 기본값을 다시 채움
  const applyDefaults = (nextRegion: Region, nextHousehold: Household): void => {
    const d = suggestDefaults(nextRegion, nextHousehold);
    for (const key of COST_LINE_KEYS) {
      setValue(key, d[key], { shouldValidate: true });
    }
  };

  const onRegionChange = (next: Region): void => {
    setRegion(next);
    applyDefaults(next, values.household);
  };
  const onHouseholdChange = (next: Household): void => {
    setValue("household", next);
    applyDefaults(region, next);
  };
  const onReset = (): void => {
    setRegion(INITIAL_REGION);
    reset(buildDefaults(INITIAL_REGION, INITIAL_HOUSEHOLD));
  };

  return (
    <CalcLayout>
      <FormShell onSubmit={(e) => e.preventDefault()}>
        <FieldGroup title={T.sectionProfile}>
          <Field label={T.fieldRegion}>
            <select
              className="input-base"
              value={region}
              onChange={(e) => onRegionChange(e.target.value as Region)}
            >
              {(Object.keys(T.regionOpt) as Region[]).map((r) => (
                <option key={r} value={r}>
                  {T.regionOpt[r]}
                </option>
              ))}
            </select>
          </Field>
          <Controller
            control={control}
            name="household"
            render={({ field }) => (
              <Field label={T.fieldHousehold}>
                <select
                  className="input-base"
                  value={field.value}
                  onChange={(e) =>
                    onHouseholdChange(e.target.value as Household)
                  }
                >
                  {(Object.keys(T.householdOpt) as Household[]).map((h) => (
                    <option key={h} value={h}>
                      {T.householdOpt[h]}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup title={T.sectionItems}>
          {COST_LINE_KEYS.map((key) => (
            <Controller
              key={key}
              control={control}
              name={key}
              render={({ field }) => (
                <Field label={T.lineLabel[key]}>
                  <NumberField
                    value={field.value}
                    onChange={field.onChange}
                    thousands
                    decimals={0}
                    suffix="원"
                    aria-label={T.lineLabel[key]}
                  />
                </Field>
              )}
            />
          ))}
        </FieldGroup>

        <ActionRow
          primary={
            <button type="button" onClick={onReset} className="btn-primary flex-1">
              {T.reset}
            </button>
          }
        />
      </FormShell>

      <ResultShell heading={T.heading} locale={locale}>
        {result && (
          <div className="animate-fade-up space-y-5">
            <div>
              <HeroResult
                label={T.heroLabel}
                value={formatKrw(result.monthlyTotal)}
                unit={T.won}
              />
              {locale === "ko" && result.monthlyTotal > 0 && (
                <p className="mt-2 text-sm font-medium text-[color:var(--color-text-secondary)]">
                  = {formatKoreanMoney(result.monthlyTotal)}/월
                </p>
              )}
            </div>

            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={T.annual}
                value={`${formatKrw(result.annualTotal)} ${T.won}`}
              />
              <Stat
                label={T.perPerson}
                value={`${formatKrw(Math.round(result.perPersonMonthly))} ${T.won}`}
              />
            </dl>

            <p className={`rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-xs leading-relaxed text-[color:var(--color-text-tertiary)]`}>
              {T.note}
            </p>

            <SourceBox lines={[T.sourceTitle, ...T.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
