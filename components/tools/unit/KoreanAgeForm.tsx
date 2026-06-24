"use client";

import { useState } from "react";
import {
  calculateKoreanAge,
  type KoreanAgeResult,
} from "@/lib/calculations/unit/koreanAge";
import { NumberField } from "@/components/ui/NumberField";

interface KoreanAgeFormProps {
  locale: "ko" | "en";
  /** 서버에서 주입한 오늘 날짜 (YYYY-MM-DD) — hydration mismatch 방지 */
  today: { year: number; month: number; day: number };
}

const T = {
  ko: {
    birthLabel: "생년월일",
    yearPh: "연도",
    monthPh: "월",
    dayPh: "일",
    refLabel: "기준일 (오늘)",
    result: "나이 결과",
    international: "만나이",
    intlNote: "2023년 6월부터 한국 법령·행정 공식 나이",
    counting: "세는나이",
    countNote: "전통 한국식 — 태어나면 1살, 1월 1일 +1",
    yearAge: "연나이",
    yearNote: "병역법·청소년보호법 등 일부 법",
    birthdayPassed: "올해 생일",
    passed: "지남",
    notPassed: "아직 안 지남",
    daysLeft: "다음 생일까지",
    daysUnit: "일",
    invalid: "올바른 날짜를 입력하세요",
  },
  en: {
    birthLabel: "Date of birth",
    yearPh: "Year",
    monthPh: "Month",
    dayPh: "Day",
    refLabel: "Reference date (today)",
    result: "Your Korean ages",
    international: "International age (만나이)",
    intlNote: "Korea's official legal age since June 2023",
    counting: "Korean counting age (세는나이)",
    countNote: "Traditional — age 1 at birth, +1 every Jan 1",
    yearAge: "Year age (연나이)",
    yearNote: "Used in military & youth protection laws",
    birthdayPassed: "Birthday this year",
    passed: "passed",
    notPassed: "not yet",
    daysLeft: "Until next birthday",
    daysUnit: "days",
    invalid: "Please enter a valid date",
  },
} as const;

function isValidDate(y: number, m: number, d: number): boolean {
  if (!y || !m || !d) return false;
  if (m < 1 || m > 12 || d < 1 || d > 31) return false;
  const dt = new Date(y, m - 1, d);
  return (
    dt.getFullYear() === y && dt.getMonth() === m - 1 && dt.getDate() === d
  );
}

export function KoreanAgeForm({
  locale,
  today,
}: KoreanAgeFormProps): React.ReactElement {
  const t = T[locale];
  const [birthYear, setBirthYear] = useState<number>(1990);
  const [birthMonth, setBirthMonth] = useState<number>(3);
  const [birthDay, setBirthDay] = useState<number>(15);

  const by = birthYear;
  const bm = birthMonth;
  const bd = birthDay;
  const valid = isValidDate(by, bm, bd);

  let result: KoreanAgeResult | null = null;
  if (valid) {
    result = calculateKoreanAge({
      birthYear: by,
      birthMonth: bm,
      birthDay: bd,
      refYear: today.year,
      refMonth: today.month,
      refDay: today.day,
    });
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-5 p-5 md:p-7">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.birthLabel}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <NumberField
              value={birthYear}
              onChange={setBirthYear}
              thousands={false}
              decimals={0}
              placeholder={t.yearPh}
              aria-label={t.yearPh}
            />
            <NumberField
              value={birthMonth}
              onChange={setBirthMonth}
              thousands={false}
              decimals={0}
              min={1}
              max={12}
              placeholder={t.monthPh}
              aria-label={t.monthPh}
            />
            <NumberField
              value={birthDay}
              onChange={setBirthDay}
              thousands={false}
              decimals={0}
              min={1}
              max={31}
              placeholder={t.dayPh}
              aria-label={t.dayPh}
            />
          </div>
          {!valid && (
            <p className="mt-2 text-xs text-red-400">{t.invalid}</p>
          )}
        </div>

        <div className="rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] px-4 py-3 text-sm text-[color:var(--color-text-tertiary)]">
          {t.refLabel}:{" "}
          <span className="font-semibold tabular-nums text-[color:var(--color-text-secondary)]">
            {today.year}-{String(today.month).padStart(2, "0")}-
            {String(today.day).padStart(2, "0")}
          </span>
        </div>
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          {t.result}
        </h2>

        {result ? (
          <div className="animate-fade-up space-y-3">
            {/* 만나이 — 메인 */}
            <div className="rounded-xl bg-gradient-to-br from-indigo-500/15 to-purple-500/10 p-4 ring-1 ring-indigo-500/20">
              <dt className="text-xs font-medium text-[color:var(--color-text-tertiary)]">
                {t.international}
              </dt>
              <dd className="mt-1 text-4xl font-bold tabular-nums text-[#eef0f5]">
                {result.internationalAge}
              </dd>
              <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
                {t.intlNote}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-3">
                <dt className="text-xs text-[color:var(--color-text-tertiary)]">
                  {t.counting}
                </dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-[color:var(--color-text-primary)]">
                  {result.countingAge}
                </dd>
                <p className="mt-1 text-[11px] leading-snug text-[color:var(--color-text-muted)]">
                  {t.countNote}
                </p>
              </div>
              <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-3">
                <dt className="text-xs text-[color:var(--color-text-tertiary)]">
                  {t.yearAge}
                </dt>
                <dd className="mt-1 text-2xl font-bold tabular-nums text-[color:var(--color-text-primary)]">
                  {result.yearAge}
                </dd>
                <p className="mt-1 text-[11px] leading-snug text-[color:var(--color-text-muted)]">
                  {t.yearNote}
                </p>
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="flex items-center justify-between rounded-lg border border-[color:var(--color-border-subtle)] px-3 py-2">
                <dt className="text-[color:var(--color-text-tertiary)]">
                  {t.birthdayPassed}
                </dt>
                <dd
                  className={`font-semibold ${result.birthdayPassed ? "text-emerald-400" : "text-amber-400"}`}
                >
                  {result.birthdayPassed ? t.passed : t.notPassed}
                </dd>
              </div>
              <div className="flex items-center justify-between rounded-lg border border-[color:var(--color-border-subtle)] px-3 py-2">
                <dt className="text-[color:var(--color-text-tertiary)]">
                  {t.daysLeft}
                </dt>
                <dd className="font-semibold tabular-nums text-[color:var(--color-text-primary)]">
                  {result.daysUntilNextBirthday} {t.daysUnit}
                </dd>
              </div>
            </dl>
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
