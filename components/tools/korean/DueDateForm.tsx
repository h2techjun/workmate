"use client";

import { useState } from "react";
import {
  calculateDueDate,
  type DueDateResult,
} from "@/lib/calculations/korean/dueDate";
import { NumberField } from "@/components/ui/NumberField";

interface DueDateFormProps {
  locale: "ko" | "en";
  today: { year: number; month: number; day: number };
}

const T = {
  ko: {
    lmp: "마지막 생리 시작일 (LMP)",
    year: "연도",
    month: "월",
    day: "일",
    cycle: "평균 생리주기 (일)",
    result: "출산예정일",
    due: "출산예정일",
    weeks: "현재 임신 주수",
    weeksUnit: "주",
    daysUnit: "일",
    trimester: "삼분기",
    trimesterUnit: "기",
    daysToGo: "출산까지",
    progress: "진행률",
    note: "네겔레 법칙(LMP + 280일) 기준. 주기 28일 외는 자동 보정. 실제 예정일은 초음파로 확정하며, 만삭은 37~42주 분포라 예정일은 추정치입니다.",
  },
  en: {
    lmp: "Last menstrual period (LMP)",
    year: "Year",
    month: "Month",
    day: "Day",
    cycle: "Average cycle (days)",
    result: "Due date",
    due: "Estimated due date",
    weeks: "Current pregnancy",
    weeksUnit: "weeks",
    daysUnit: "days",
    trimester: "Trimester",
    trimesterUnit: "",
    daysToGo: "Days to go",
    progress: "Progress",
    note: "Based on Naegele's rule (LMP + 280 days). Cycles other than 28 are auto-adjusted. The actual date is confirmed by ultrasound; term spans 37-42 weeks so the due date is an estimate.",
  },
} as const;

export function DueDateForm({
  locale,
  today,
}: DueDateFormProps): React.ReactElement {
  const t = T[locale];
  const [y, setY] = useState(today.year);
  const [m, setM] = useState(today.month);
  const [d, setD] = useState(1);
  const [cycle, setCycle] = useState(28);

  const valid = y >= 1900 && m >= 1 && m <= 12 && d >= 1 && d <= 31;

  let r: DueDateResult | null = null;
  if (valid) {
    r = calculateDueDate({
      lmpYear: y,
      lmpMonth: m,
      lmpDay: d,
      cycleLength: cycle,
      refYear: today.year,
      refMonth: today.month,
      refDay: today.day,
    });
  }

  const numInputClass = "text-center text-xl font-bold tabular-nums";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-5 p-5 md:p-7">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.lmp}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <NumberField
              value={y}
              onChange={setY}
              thousands={false}
              decimals={0}
              min={1900}
              max={2100}
              placeholder={t.year}
              aria-label={t.year}
              className={numInputClass}
            />
            <NumberField
              value={m}
              onChange={setM}
              thousands={false}
              decimals={0}
              min={1}
              max={12}
              placeholder={t.month}
              aria-label={t.month}
              className={numInputClass}
            />
            <NumberField
              value={d}
              onChange={setD}
              thousands={false}
              decimals={0}
              min={1}
              max={31}
              placeholder={t.day}
              aria-label={t.day}
              className={numInputClass}
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.cycle}
          </label>
          <NumberField
            value={cycle}
            onChange={setCycle}
            thousands={false}
            decimals={0}
            min={1}
            max={60}
            aria-label={t.cycle}
          />
        </div>
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          {t.result}
        </h2>
        {r ? (
          <div className="animate-fade-up space-y-3">
            <div className="rounded-xl bg-gradient-to-br from-pink-500/15 to-rose-500/10 p-4 ring-1 ring-pink-500/20">
              <dt className="text-xs font-medium text-[color:var(--color-text-tertiary)]">
                {t.due}
              </dt>
              <dd className="mt-1 text-3xl font-bold tabular-nums text-[#eef0f5]">
                {r.dueDate.year}-{String(r.dueDate.month).padStart(2, "0")}-
                {String(r.dueDate.day).padStart(2, "0")}
              </dd>
              <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
                {t.daysToGo} {r.daysToGo} {t.daysUnit} · {t.progress}{" "}
                {r.progress}%
              </p>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-3">
                <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.weeks}</dt>
                <dd className="mt-1 text-xl font-bold tabular-nums text-[color:var(--color-text-primary)]">
                  {r.weeks}{t.weeksUnit} {r.days}{t.daysUnit}
                </dd>
              </div>
              <div className="rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-3">
                <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.trimester}</dt>
                <dd className="mt-1 text-xl font-bold tabular-nums text-[color:var(--color-text-primary)]">
                  {r.trimester}{t.trimesterUnit}
                </dd>
              </div>
            </dl>
            <div className="h-2 overflow-hidden rounded-full bg-[color:var(--color-bg-elevated)]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-pink-500 to-rose-500 transition-all"
                style={{ width: `${r.progress}%` }}
              />
            </div>
            <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
              {t.note}
            </p>
          </div>
        ) : (
          <p className="text-sm text-[color:var(--color-text-tertiary)]">{t.lmp}</p>
        )}
      </section>
    </div>
  );
}
