"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculateRentCap,
  rentCapInputSchema,
  type RentCapInputResolved,
  type RentCapResult,
} from "@/lib/calculations/realestate/rentCap";
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
import { NumberField } from "@/components/ui/NumberField";

interface RentCapFormProps {
  locale: "ko" | "en";
}

const won = (n: number): string => Math.round(n).toLocaleString("ko-KR");

const T = {
  ko: {
    sectionCurrent: "현재 임대 조건",
    sectionProposed: "임대인 제시 조건",
    sectionParams: "환산율 · 한도",
    fieldOldDeposit: "기존 보증금 (원)",
    fieldOldMonthly: "기존 월세 (원)",
    fieldNewDeposit: "신규 보증금 (원)",
    fieldNewMonthly: "신규 월세 (원)",
    fieldConversion: "전월세 전환율 (%)",
    fieldCap: "인상 상한 (%)",
    conversionHint: "주임법 시행령 9조 = 기준금리 + 2%. 2026-05 기준 5.0%.",
    capHint: "주임법 시행령 8조 = 5% 한도 (지자체 조례로 더 낮을 수 있음).",
    calculate: "검증하기",
    reset: "초기화",
    resultHeading: "검증 결과",
    resultEmpty: "현재/신규 조건을 입력하세요.",
    error: "계산 오류",
    heroLabelPass: "한도 통과",
    heroLabelFail: "한도 초과",
    heroUnit: "",
    rateLabel: "제시 인상률",
    oldEquiv: "기존 환산보증금",
    maxEquiv: "5% 한도 환산보증금",
    proposedEquiv: "제시 환산보증금",
    overage: "초과 금액",
    remaining: "여유 금액",
    recommendHeading: "추천: 한도 내 인상 한도",
    recDepositOnly: "월세 유지 시 최대 보증금",
    recMonthlyOnly: "보증금 유지 시 최대 월세",
    sourceTitle: "법령 · 가정",
    sourceLines: [
      "주택임대차보호법 시행령 제8조: 갱신요구권 행사 시 임대료 증액 한도 = 5%.",
      "환산보증금 = 보증금 + (월세 × 12 / 전환율). 월세를 보증금으로 환산한 총액.",
      "전월세 전환율 (시행령 9조) = 한국은행 기준금리 + 2%. 변동 시 직접 입력.",
      "신규 계약·갱신거절 사유 (임대인 거주 등) 시 5% 룰 미적용.",
      "지자체 조례로 더 낮은 상한 (예: 일부 광역시 4%) 가능 → 조례 확인 필요.",
    ],
  },
  en: {
    sectionCurrent: "Current Terms",
    sectionProposed: "Proposed Terms",
    sectionParams: "Conversion · Cap",
    fieldOldDeposit: "Current deposit (₩)",
    fieldOldMonthly: "Current monthly rent (₩)",
    fieldNewDeposit: "Proposed deposit (₩)",
    fieldNewMonthly: "Proposed monthly rent (₩)",
    fieldConversion: "Conversion rate (%)",
    fieldCap: "Increase cap (%)",
    conversionHint: "Bank of Korea base rate + 2%. ~5.0% as of 2026-05.",
    capHint: "Housing Lease Act §8: 5% cap on renewal. Local ordinance may be lower.",
    calculate: "Verify",
    reset: "Reset",
    resultHeading: "Verification",
    resultEmpty: "Enter current and proposed terms.",
    error: "Calculation failed",
    heroLabelPass: "Within cap",
    heroLabelFail: "Exceeds cap",
    heroUnit: "",
    rateLabel: "Proposed increase",
    oldEquiv: "Current equiv. deposit",
    maxEquiv: "5% cap equiv. deposit",
    proposedEquiv: "Proposed equiv. deposit",
    overage: "Excess",
    remaining: "Margin",
    recommendHeading: "Recommended max within cap",
    recDepositOnly: "Max deposit (rent unchanged)",
    recMonthlyOnly: "Max rent (deposit unchanged)",
    sourceTitle: "Law · assumptions",
    sourceLines: [
      "Korean Housing Lease Act §8: max 5% increase on renewal.",
      "Equiv. deposit = deposit + (monthly × 12 / conversion rate).",
      "Conversion rate = BoK base rate + 2% (Act §9, variable).",
      "Cap does not apply to new contracts or owner-occupied renewals.",
      "Local ordinances may set lower cap (e.g., 4% in some cities).",
    ],
  },
} as const;

export function RentCapForm({ locale }: RentCapFormProps): React.ReactElement {
  const t = T[locale];
  const [result, setResult] = useState<RentCapResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<RentCapInputResolved>({
    resolver: zodResolver(rentCapInputSchema),
    defaultValues: {
      oldDeposit: 100_000_000,
      oldMonthlyRent: 500_000,
      proposedDeposit: 100_000_000,
      proposedMonthlyRent: 530_000,
      conversionRatePercent: 5,
      capPercent: 5,
    },
  });

  const onSubmit = (values: RentCapInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateRentCap(values));
    } catch {
      setResult(null);
      setCalcError(t.error);
    }
  };
  const onReset = (): void => {
    reset();
    setResult(null);
    setCalcError(null);
  };

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={t.sectionCurrent}>
          <Controller
            control={control}
            name="oldDeposit"
            render={({ field }) => (
              <Field label={t.fieldOldDeposit}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands
                  decimals={0}
                  suffix="원"
                  aria-label={t.fieldOldDeposit}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="oldMonthlyRent"
            render={({ field }) => (
              <Field label={t.fieldOldMonthly}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands
                  decimals={0}
                  suffix="원"
                  aria-label={t.fieldOldMonthly}
                />
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup title={t.sectionProposed}>
          <Controller
            control={control}
            name="proposedDeposit"
            render={({ field }) => (
              <Field label={t.fieldNewDeposit}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands
                  decimals={0}
                  suffix="원"
                  aria-label={t.fieldNewDeposit}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="proposedMonthlyRent"
            render={({ field }) => (
              <Field label={t.fieldNewMonthly}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands
                  decimals={0}
                  suffix="원"
                  aria-label={t.fieldNewMonthly}
                />
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup title={t.sectionParams}>
          <Controller
            control={control}
            name="conversionRatePercent"
            render={({ field }) => (
              <Field label={t.fieldConversion} hint={t.conversionHint}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={2}
                  suffix="%"
                  aria-label={t.fieldConversion}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="capPercent"
            render={({ field }) => (
              <Field label={t.fieldCap} hint={t.capHint}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={2}
                  suffix="%"
                  aria-label={t.fieldCap}
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
              {t.calculate}
            </button>
          }
          secondary={
            <button type="button" onClick={onReset} className="btn-ghost sm:w-auto">
              {t.reset}
            </button>
          }
        />
      </FormShell>

      <ResultShell heading={t.resultHeading}>
        {calcError && <ErrorBox message={calcError} />}
        {!calcError && !result && <EmptyResult message={t.resultEmpty} />}
        {result && (
          <div className="animate-fade-up space-y-5">
            <HeroResult
              label={result.withinCap ? t.heroLabelPass : t.heroLabelFail}
              value={`${(result.proposedIncreaseRate * 100).toFixed(2)}%`}
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat label={t.oldEquiv} value={`${won(result.oldEquivalentDeposit)} 원`} />
              <Stat label={t.maxEquiv} value={`${won(result.maxEquivalentDeposit)} 원`} />
              <Stat
                label={t.proposedEquiv}
                value={`${won(result.proposedEquivalentDeposit)} 원`}
              />
              {result.withinCap ? (
                <Stat
                  label={t.remaining}
                  tone="success"
                  value={`+${won(result.remaining)} 원`}
                />
              ) : (
                <Stat
                  label={t.overage}
                  tone="danger"
                  value={`−${won(result.overage)} 원`}
                />
              )}
            </dl>

            <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4">
              <h4 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                {t.recommendHeading}
              </h4>
              <dl className="grid grid-cols-2 gap-3">
                <Stat
                  label={t.recDepositOnly}
                  value={`${won(result.recommendedDepositOnly)} 원`}
                />
                <Stat
                  label={t.recMonthlyOnly}
                  value={`${won(result.recommendedMonthlyOnly)} 원`}
                />
              </dl>
            </div>

            <SourceBox lines={[t.sourceTitle, ...t.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
