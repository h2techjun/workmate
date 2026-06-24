"use client";

import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculateStuds,
  studsInputSchema,
  type StudsInputResolved,
  type StudsResult,
  type StudsStep,
} from "@/lib/calculations/timber/studs";
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
import { formatNumber } from "@/lib/utils/format";

interface StudsFormProps {
  locale: "ko" | "en";
}

const TEXT = {
  ko: {
    sectionWall: "벽 정보",
    sectionLumber: "각목·기타",
    fieldWallLength: "벽 길이 (m)",
    fieldWallLengthHint: "한 벽 또는 여러 벽의 합계",
    fieldCeiling: "층고 (mm)",
    fieldCeilingHint: "보통 2400~3000mm",
    fieldSpacing: "스터드 간격",
    fieldOpenings: "개구부 (창문/문) 개수",
    fieldOpeningsHint: "개당 jack/king 스터드 4본 + 헤더 2본 추가",
    fieldWaste: "손실률 (%)",
    fieldWasteHint: "절단 손실·여유분, 기본 10%",
    calculate: "계산하기",
    reset: "초기화",
    resultHeading: "계산 결과",
    resultEmpty: "벽 길이를 입력하고 계산하세요.",
    error: "계산 중 오류가 발생했습니다.",
    studCount: "스터드 본수",
    studCountUnit: "본",
    studLength: "1본 길이",
    topPlate: "탑 플레이트 총 길이 (더블)",
    solePlate: "솔 플레이트 총 길이 (싱글)",
    headerCount: "헤더 본수 (개구부 위)",
    nailCount: "못 추정 개수",
    spacing16: "16인치 (406mm)",
    spacing24: "24인치 (610mm)",
    sourceTitle: "출처 · 가정",
    sourceLines: [
      "IRC 2018 Chapter 6 (Wall Construction) — 미국 표준, 한국 목조주택 시공 차용 일반적.",
      "각목 = 2×4 SPF (38×89mm). 탑 플레이트 더블 + 솔 플레이트 싱글 = 총 3장 38mm.",
      "헤더 = 개구부 1개당 2×10 더블 (2본) + 자크·킹 스터드 4본.",
      "못 추정 = 본당 8개 (양 끝 4개씩 토네일).",
    ],
  },
  en: {
    sectionWall: "Wall info",
    sectionLumber: "Framing & misc",
    fieldWallLength: "Wall length (m)",
    fieldWallLengthHint: "Sum of one or multiple walls",
    fieldCeiling: "Ceiling height (mm)",
    fieldCeilingHint: "Typically 2400~3000mm",
    fieldSpacing: "Stud spacing",
    fieldOpenings: "Openings (windows/doors)",
    fieldOpeningsHint: "Each adds 4 jack/king studs + 2 header studs",
    fieldWaste: "Waste factor (%)",
    fieldWasteHint: "Cut loss + buffer, default 10%",
    calculate: "Calculate",
    reset: "Reset",
    resultHeading: "Result",
    resultEmpty: "Enter wall length to calculate.",
    error: "Calculation failed.",
    studCount: "Stud count",
    studCountUnit: "pcs",
    studLength: "Stud length",
    topPlate: "Top plate total (double)",
    solePlate: "Sole plate total (single)",
    headerCount: "Header pieces (over openings)",
    nailCount: "Estimated nails",
    spacing16: "16\" (406mm)",
    spacing24: "24\" (610mm)",
    sourceTitle: "Sources · assumptions",
    sourceLines: [
      "IRC 2018 Chapter 6 (Wall Construction) — US standard, commonly applied in Korean timber framing.",
      "Studs = 2×4 SPF (38×89mm). Double top plate + single sole plate = 3 × 38mm thickness.",
      "Header = 2×10 double per opening (2 pieces) + 4 jack/king studs.",
      "Nails ≈ 8 per stud (4 toenails × 2 ends).",
    ],
  },
} as const;

export function StudsForm({ locale }: StudsFormProps): React.ReactElement {
  const T = TEXT[locale];
  const [result, setResult] = useState<StudsResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<StudsInputResolved>({
    resolver: zodResolver(studsInputSchema),
    defaultValues: {
      wallLengthM: 8,
      ceilingHeightMm: 2400,
      spacingMm: 406,
      openings: 0,
      wasteFactorPercent: 10,
    },
  });

  const onSubmit = (values: StudsInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateStuds(values));
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

  const renderStep = (s: StudsStep): string => {
    switch (s.key) {
      case "studCount":
        return locale === "ko"
          ? `벽 길이 ${formatNumber(s.wallLength)}m ÷ 간격 ${formatNumber(s.spacing)}mm = 기본 ${formatNumber(s.result)}본 (양 끝 포함)`
          : `${formatNumber(s.wallLength)}m ÷ ${formatNumber(s.spacing)}mm = ${formatNumber(s.result)} studs (incl. both ends)`;
      case "studLength":
        return locale === "ko"
          ? `층고 ${formatNumber(s.ceilingHeight)}mm − 플레이트 ${formatNumber(s.plates)}mm = 1본 길이 ${formatNumber(s.result)}mm`
          : `Ceiling ${formatNumber(s.ceilingHeight)}mm − plates ${formatNumber(s.plates)}mm = stud length ${formatNumber(s.result)}mm`;
      case "plateLength":
        return locale === "ko"
          ? `벽 길이 ${formatNumber(s.wallLength)}m × 3 (더블 탑 + 솔) = 총 ${formatNumber(s.result)}m`
          : `${formatNumber(s.wallLength)}m × 3 (double top + sole) = ${formatNumber(s.result)}m total`;
      case "headerCount":
        return locale === "ko"
          ? `개구부 ${formatNumber(s.openings)}개 × 2 (더블 헤더) = 헤더 ${formatNumber(s.result)}본`
          : `${formatNumber(s.openings)} openings × 2 (double header) = ${formatNumber(s.result)} headers`;
      case "totalStuds":
        return locale === "ko"
          ? `기본 ${formatNumber(s.base)}본 × (1 + ${formatNumber(s.waste)}% 손실) = 총 ${formatNumber(s.result)}본`
          : `Base ${formatNumber(s.base)} × (1 + ${formatNumber(s.waste)}% waste) = ${formatNumber(s.result)} total`;
      case "nails":
        return locale === "ko"
          ? `스터드 ${formatNumber(s.studs)}본 × 본당 ${formatNumber(s.nailsPerStud)}못 = 총 ${formatNumber(s.result)}개`
          : `${formatNumber(s.studs)} studs × ${formatNumber(s.nailsPerStud)} nails/stud = ${formatNumber(s.result)} nails`;
    }
  };

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={T.sectionWall}>
          <Field label={T.fieldWallLength} hint={T.fieldWallLengthHint}>
            <Controller
              control={control}
              name="wallLengthM"
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={1}
                  min={0}
                  suffix="m"
                  aria-label={T.fieldWallLength}
                />
              )}
            />
          </Field>
          <Field label={T.fieldCeiling} hint={T.fieldCeilingHint}>
            <Controller
              control={control}
              name="ceilingHeightMm"
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  min={0}
                  suffix="mm"
                  aria-label={T.fieldCeiling}
                />
              )}
            />
          </Field>
          <Field label={T.fieldSpacing}>
            <select
              className="input-base"
              {...register("spacingMm", { valueAsNumber: true })}
            >
              <option value={406}>{T.spacing16}</option>
              <option value={610}>{T.spacing24}</option>
            </select>
          </Field>
        </FieldGroup>

        <FieldGroup title={T.sectionLumber}>
          <Field label={T.fieldOpenings} hint={T.fieldOpeningsHint}>
            <Controller
              control={control}
              name="openings"
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  min={0}
                  suffix="개"
                  aria-label={T.fieldOpenings}
                />
              )}
            />
          </Field>
          <Field label={T.fieldWaste} hint={T.fieldWasteHint}>
            <Controller
              control={control}
              name="wasteFactorPercent"
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  min={0}
                  max={100}
                  suffix="%"
                  aria-label={T.fieldWaste}
                />
              )}
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
              {T.calculate}
            </button>
          }
          secondary={
            <button
              type="button"
              onClick={onReset}
              className="btn-ghost sm:w-auto"
            >
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
              label={T.studCount}
              value={formatNumber(result.studCount)}
              unit={T.studCountUnit}
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={T.studLength}
                value={`${formatNumber(result.studLengthMm)} mm`}
              />
              <Stat
                label={T.headerCount}
                value={`${formatNumber(result.headerCount)} ${T.studCountUnit}`}
              />
              <Stat
                label={T.topPlate}
                value={`${formatNumber(result.topPlateTotalLengthM)} m`}
              />
              <Stat
                label={T.solePlate}
                value={`${formatNumber(result.solePlateTotalLengthM)} m`}
              />
              <Stat
                label={T.nailCount}
                value={`${formatNumber(result.nailCount)} ${locale === "ko" ? "개" : "pcs"}`}
              />
            </dl>
            <StepsBox
              title={locale === "ko" ? "계산 과정" : "Steps"}
              items={result.steps.map((s) => renderStep(s))}
            />
            <SourceBox lines={[T.sourceTitle, ...T.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
