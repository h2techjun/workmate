"use client";

import { useState } from "react";
import {
  calculateSchoolGrade,
  type SchoolGradeResult,
  type SchoolLevel,
} from "@/lib/calculations/unit/schoolGrade";

interface SchoolGradeFormProps {
  locale: "ko" | "en";
  /** 서버 주입 오늘 (KST) — hydration mismatch 방지 */
  today: { year: number; month: number };
}

const T = {
  ko: {
    label: "출생 연도",
    yearPh: "예: 2012",
    refLabel: "기준 학년도",
    result: "현재 학년",
    levels: {
      preschool: "미취학",
      elementary: "초등학교",
      middle: "중학교",
      high: "고등학교",
      university: "대학교",
      adult: "성인 (졸업 이후)",
    } as Record<SchoolLevel, string>,
    gradeUnit: "학년",
    milestones: "주요 입학·졸업 (3월 입학 / 2월 졸업)",
    elem: "초등 입학",
    mid: "중학 입학",
    high: "고교 입학",
    grad: "고교 졸업",
    counting: "세는나이",
    invalid: "올바른 출생 연도를 입력하세요.",
    note: "2009년 이후 기준 — 같은 연도(1~12월) 출생자가 같은 학년. 학년도는 3월 시작, 1~2월은 직전 학년도. 대학 학년은 정규 진학 가정(재수·휴학 미반영).",
  },
  en: {
    label: "Birth year",
    yearPh: "e.g. 2012",
    refLabel: "School year basis",
    result: "Current grade",
    levels: {
      preschool: "Pre-school",
      elementary: "Elementary",
      middle: "Middle school",
      high: "High school",
      university: "University",
      adult: "Adult (after graduation)",
    } as Record<SchoolLevel, string>,
    gradeUnit: "grade",
    milestones: "Entry & graduation (enters March / graduates Feb)",
    elem: "Elementary entry",
    mid: "Middle entry",
    high: "High entry",
    grad: "High graduation",
    counting: "Korean counting age",
    invalid: "Enter a valid birth year.",
    note: "Since 2009 — children born in the same calendar year share a grade. The school year starts in March; Jan–Feb belong to the previous one. University grade assumes standard progression.",
  },
} as const;

export function SchoolGradeForm({
  locale,
  today,
}: SchoolGradeFormProps): React.ReactElement {
  const t = T[locale];
  const [birthYear, setBirthYear] = useState("2012");

  const by = parseInt(birthYear, 10);
  const valid = Number.isFinite(by) && by >= 1900 && by <= 2100;

  let result: SchoolGradeResult | null = null;
  if (valid) {
    result = calculateSchoolGrade({
      birthYear: by,
      refYear: today.year,
      refMonth: today.month,
    });
  }

  const isStudent =
    result !== null &&
    result.level !== "preschool" &&
    result.level !== "adult";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-5 p-5 md:p-7">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.label}
          </label>
          <input
            type="number"
            inputMode="numeric"
            placeholder={t.yearPh}
            className="input-base text-center text-2xl font-bold tabular-nums"
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            aria-label={t.label}
          />
          {!valid && <p className="mt-2 text-xs text-red-400">{t.invalid}</p>}
        </div>
        <div className="rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] px-4 py-3 text-sm text-[color:var(--color-text-tertiary)]">
          {t.refLabel}:{" "}
          <span className="font-semibold tabular-nums text-[color:var(--color-text-secondary)]">
            {result ? result.schoolYear : "—"}
          </span>
        </div>
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          {t.result}
        </h2>
        {result ? (
          <div className="animate-fade-up space-y-3">
            <div className="rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/10 p-4 text-center ring-1 ring-indigo-500/20">
              <p className="text-3xl font-bold text-[#eef0f5]">
                {t.levels[result.level]}
                {isStudent ? (
                  <span className="ml-2 tabular-nums">
                    {result.grade}
                    {t.gradeUnit}
                  </span>
                ) : null}
              </p>
              <p className="mt-1.5 text-xs text-[color:var(--color-text-tertiary)]">
                {t.counting}: {result.countingAge}
              </p>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-[color:var(--color-text-tertiary)]">
                {t.milestones}
              </p>
              <dl className="grid grid-cols-2 gap-2 text-sm">
                <Milestone label={t.elem} year={result.elementaryEntryYear} />
                <Milestone label={t.mid} year={result.middleEntryYear} />
                <Milestone label={t.high} year={result.highEntryYear} />
                <Milestone label={t.grad} year={result.highGraduationYear} />
              </dl>
            </div>

            <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
              {t.note}
            </p>
          </div>
        ) : (
          <p className="text-sm text-[color:var(--color-text-tertiary)]">
            {t.invalid}
          </p>
        )}
      </section>
    </div>
  );
}

function Milestone({
  label,
  year,
}: {
  label: string;
  year: number;
}): React.ReactElement {
  return (
    <div className="flex items-center justify-between rounded-lg border border-[color:var(--color-border-subtle)] px-3 py-2">
      <dt className="text-[color:var(--color-text-tertiary)]">{label}</dt>
      <dd className="font-semibold tabular-nums text-[color:var(--color-text-primary)]">
        {year}
      </dd>
    </div>
  );
}
