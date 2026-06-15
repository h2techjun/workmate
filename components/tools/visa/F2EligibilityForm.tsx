"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  checkF2Eligibility,
  f2EligibilityInputSchema,
  type F2EligibilityInputResolved,
  type F2EligibilityResult,
  type F2Blocker,
} from "@/lib/calculations/visa/f2Eligibility";
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
} from "@/components/ui/calc-form";
import { cn } from "@/lib/utils/cn";

interface F2EligibilityFormProps {
  locale: "ko" | "en";
}

const TEXT = {
  ko: {
    sectionType: "신청 유형",
    fieldType: "어느 유형에 해당하나요?",
    types: {
      listedCompany: "상장법인(KOSPI/KOSDAQ) 종사자",
      growthIndustry: "유망산업 종사자 (소득 GNI 1.5배 이상)",
      professional: "전문직(D-5~E-7)으로 3년 이상 연속 합법체류",
      studyTalent: "국내 석사 이상 유학인재",
      potentialTalent: "이공계 석·박사 잠재 우수인재",
      none: "위 어디에도 해당 없음 / 모름",
    },
    sectionReq: "필수 요건",
    reqStayIncome: "3년 연속 합법체류 또는 연소득 4천만원 이상",
    reqConduct: "품행단정 · 결격사유(금고 이상 형 등) 없음",
    reqHealth: "공중보건 요건 (결핵검진 등) 충족",
    calculate: "자격 확인",
    reset: "초기화",
    resultHeading: "F-2-7 기본 자격 체크",
    resultEmpty: "유형과 요건을 선택하고 자격을 확인하세요.",
    error: "확인 중 오류가 발생했습니다.",
    eligibleTitle: "기본 신청 자격 요건 충족",
    notEligibleTitle: "아직 기본 요건 미충족",
    metLabel: "충족",
    blockerHeading: "먼저 충족해야 할 항목",
    blockers: {
      type: "신청 가능 5유형 중 하나에 해당해야 합니다",
      stayIncome: "3년 연속 합법체류 또는 연소득 4천만원 이상 필요",
      conduct: "품행단정·결격사유 없음 요건",
      health: "공중보건 요건(결핵검진 등)",
    },
    nextHeading: "다음 단계",
    nextNote:
      "기본 요건을 채워도 점수제 총점 80점(만점 170)을 별도로 충족해야 합니다. 점수 항목은 아래 가이드 참고 — 단 세부 배점은 비공식이라, 정확한 점수·자격은 hikorea.go.kr 또는 이민정보센터 1345로 확인하세요.",
    sourceTitle: "기준 · 한계",
    sourceLines: [
      "신청 5유형·3년 연속 체류(또는 연소득 4천만)·품행·공중보건은 법무부 비자 내비게이터 기준.",
      "점수제 세부 배점(연령·학력·소득 등)은 법무부 내부 지침으로 비공개·수시 변동 — 본 도구는 점수를 단정하지 않습니다.",
      "80점 충족해도 승인 보장 아님. 개인별 심사관 재량.",
      "참고용 체크리스트. 공식 확인은 hikorea.go.kr / 1345.",
    ],
  },
  en: {
    sectionType: "Applicant type",
    fieldType: "Which category applies to you?",
    types: {
      listedCompany: "Employee of a listed company (KOSPI/KOSDAQ)",
      growthIndustry: "Growth-industry worker (income ≥ 1.5× GNI)",
      professional: "Professional (D-5–E-7) with 3+ years continuous legal stay",
      studyTalent: "Domestic master's degree or higher graduate",
      potentialTalent: "STEM master's/PhD potential talent",
      none: "None of the above / not sure",
    },
    sectionReq: "Core requirements",
    reqStayIncome: "3+ years continuous legal stay OR ₩40M+ annual income",
    reqConduct: "Good conduct, no disqualifying record (imprisonment, etc.)",
    reqHealth: "Public-health requirement met (TB screening, etc.)",
    calculate: "Check eligibility",
    reset: "Reset",
    resultHeading: "F-2-7 basic eligibility",
    resultEmpty: "Select your type and requirements, then check.",
    error: "Check failed.",
    eligibleTitle: "Core requirements met",
    notEligibleTitle: "Core requirements not yet met",
    metLabel: "met",
    blockerHeading: "What to satisfy first",
    blockers: {
      type: "You must fall under one of the 5 eligible categories",
      stayIncome: "Need 3+ years continuous legal stay or ₩40M+ annual income",
      conduct: "Good conduct / no disqualifying record",
      health: "Public-health requirement (TB screening, etc.)",
    },
    nextHeading: "Next step",
    nextNote:
      "Even with the core requirements, you must separately reach 80 points (out of 170) on the points test. See the guide below for the scoring items — but sub-scores are unofficial, so verify your exact points and eligibility at hikorea.go.kr or the Immigration Contact Center (1345).",
    sourceTitle: "Basis · limits",
    sourceLines: [
      "The 5 categories, 3-year stay (or ₩40M income), conduct, and public-health rules follow the Ministry of Justice Visa Navigator.",
      "Point sub-scores (age, education, income, etc.) are an internal, unpublished MOJ manual that changes without notice — this tool does NOT calculate or assert points.",
      "Reaching 80 points does not guarantee approval. Case-by-case officer discretion.",
      "Reference checklist only. Verify officially at hikorea.go.kr / 1345.",
    ],
  },
} as const;

const REQ_FIELDS = ["meetsStayOrIncome", "goodConduct", "publicHealth"] as const;

export function F2EligibilityForm({
  locale,
}: F2EligibilityFormProps): React.ReactElement {
  const T = TEXT[locale];
  const [result, setResult] = useState<F2EligibilityResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<F2EligibilityInputResolved>({
    resolver: zodResolver(f2EligibilityInputSchema),
    defaultValues: {
      applicantType: "none",
      meetsStayOrIncome: false,
      goodConduct: false,
      publicHealth: false,
    },
  });

  const onSubmit = (values: F2EligibilityInputResolved): void => {
    setCalcError(null);
    try {
      setResult(checkF2Eligibility(values));
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

  const reqLabels: Record<(typeof REQ_FIELDS)[number], string> = {
    meetsStayOrIncome: T.reqStayIncome,
    goodConduct: T.reqConduct,
    publicHealth: T.reqHealth,
  };

  const eligible = result?.baseEligible ?? false;

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={T.sectionType}>
          <Field label={T.fieldType}>
            <select className="input-base" {...register("applicantType")}>
              <option value="none">{T.types.none}</option>
              <option value="listedCompany">{T.types.listedCompany}</option>
              <option value="growthIndustry">{T.types.growthIndustry}</option>
              <option value="professional">{T.types.professional}</option>
              <option value="studyTalent">{T.types.studyTalent}</option>
              <option value="potentialTalent">{T.types.potentialTalent}</option>
            </select>
          </Field>
        </FieldGroup>

        <FieldGroup title={T.sectionReq}>
          {REQ_FIELDS.map((name) => (
            <label
              key={name}
              className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] px-3.5 py-2.5"
            >
              <input
                type="checkbox"
                className="h-4 w-4 shrink-0 accent-indigo-500"
                {...register(name)}
              />
              <span className="text-sm text-[color:var(--color-text-secondary)]">
                {reqLabels[name]}
              </span>
            </label>
          ))}
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
            <div
              className={cn(
                "rounded-xl p-5 ring-1",
                eligible
                  ? "bg-gradient-to-br from-emerald-500/15 to-transparent ring-emerald-500/20"
                  : "bg-gradient-to-br from-amber-500/15 to-transparent ring-amber-500/20",
              )}
            >
              <p
                className={cn(
                  "text-lg font-bold tracking-tight",
                  eligible ? "text-emerald-300" : "text-amber-300",
                )}
              >
                {eligible ? T.eligibleTitle : T.notEligibleTitle}
              </p>
              <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
                {result.metCount} / 4 {T.metLabel}
              </p>
            </div>

            {result.blockers.length > 0 && (
              <div>
                <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                  {T.blockerHeading}
                </h3>
                <ul className="space-y-1.5 rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 text-sm text-[color:var(--color-text-secondary)]">
                  {result.blockers.map((b: F2Blocker) => (
                    <li key={b} className="flex gap-2">
                      <span className="text-amber-400">•</span>
                      <span>{T.blockers[b]}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div>
              <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                {T.nextHeading}
              </h3>
              <p className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
                {T.nextNote}
              </p>
            </div>

            <SourceBox lines={[T.sourceTitle, ...T.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
