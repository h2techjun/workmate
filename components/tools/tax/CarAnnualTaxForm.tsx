"use client";

import { useState } from "react";
import {
  calculateCarAnnualTax,
  type CarAnnualResult,
} from "@/lib/calculations/tax/carTax";

interface CarAnnualTaxFormProps {
  locale: "ko" | "en";
}

const won = (n: number): string => Math.round(n).toLocaleString("ko-KR");

const T = {
  ko: {
    displacement: "배기량 (cc)",
    carAge: "차령 (년)",
    electric: "전기차 (정액 13만원)",
    result: "연간 자동차세",
    total: "연간 총액",
    unit: "원",
    base: "자동차세 (경감 전)",
    ageDiscount: "차령 경감",
    carTax: "자동차세",
    eduTax: "지방교육세 (30%)",
    half: "반기 납부 (6·12월)",
    note: "비영업용 승용 기준. cc당 1000↓ 80원·1600↓ 140원·1600↑ 200원 + 지방교육세 30%. 3년차부터 매년 5% 경감(최대 50%). 연납 시 약 7% 추가 할인.",
  },
  en: {
    displacement: "Displacement (cc)",
    carAge: "Vehicle age (years)",
    electric: "Electric (flat KRW 130,000)",
    result: "Annual car tax",
    total: "Annual total",
    unit: "KRW",
    base: "Car tax (before reduction)",
    ageDiscount: "Age reduction",
    carTax: "Car tax",
    eduTax: "Local education tax (30%)",
    half: "Half-year (Jun/Dec)",
    note: "Non-commercial passenger. Per cc: ≤1000 80, ≤1600 140, >1600 200 KRW + 30% education tax. 5%/year reduction from year 3 (max 50%). ~7% extra discount for annual prepayment.",
  },
} as const;

export function CarAnnualTaxForm({
  locale,
}: CarAnnualTaxFormProps): React.ReactElement {
  const t = T[locale];
  const [displacement, setDisplacement] = useState(1600);
  const [carAge, setCarAge] = useState(0);
  const [isElectric, setIsElectric] = useState(false);

  const r: CarAnnualResult = calculateCarAnnualTax({
    displacement,
    carAge,
    isElectric,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-4 p-5 md:p-7">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.displacement}
          </label>
          <input
            type="number"
            step={100}
            inputMode="numeric"
            disabled={isElectric}
            className="input-base disabled:opacity-50"
            value={displacement}
            onChange={(e) => setDisplacement(parseInt(e.target.value, 10) || 0)}
          />
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.carAge}
          </label>
          <input
            type="number"
            step={1}
            inputMode="numeric"
            className="input-base"
            value={carAge}
            onChange={(e) => setCarAge(parseInt(e.target.value, 10) || 0)}
          />
        </div>
        <label className="flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)]">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={isElectric}
            onChange={(e) => setIsElectric(e.target.checked)}
          />
          {t.electric}
        </label>
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          {t.result}
        </h2>
        <div className="rounded-xl bg-gradient-to-br from-sky-500/15 to-cyan-500/10 p-4 ring-1 ring-sky-500/20">
          <dt className="text-xs font-medium text-[color:var(--color-text-tertiary)]">
            {t.total}
          </dt>
          <dd className="mt-1 text-4xl font-bold tabular-nums text-[#eef0f5]">
            {won(r.total)}
            <span className="ml-1 text-base font-medium text-[color:var(--color-text-secondary)]">
              {t.unit}
            </span>
          </dd>
          <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
            {t.half} {won(r.halfYear)} {t.unit}
          </p>
        </div>
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-[color:var(--color-text-tertiary)]">{t.base}</dt>
            <dd className="tabular-nums text-[color:var(--color-text-secondary)]">{won(r.baseTax)} {t.unit}</dd>
          </div>
          {r.ageDiscountRate > 0 && (
            <div className="flex justify-between text-emerald-300">
              <dt>{t.ageDiscount}</dt>
              <dd className="tabular-nums">−{(r.ageDiscountRate * 100).toFixed(0)}%</dd>
            </div>
          )}
          <div className="flex justify-between">
            <dt className="text-[color:var(--color-text-tertiary)]">{t.carTax}</dt>
            <dd className="tabular-nums text-[color:var(--color-text-secondary)]">{won(r.carTax)} {t.unit}</dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[color:var(--color-text-tertiary)]">{t.eduTax}</dt>
            <dd className="tabular-nums text-[color:var(--color-text-secondary)]">{won(r.eduTax)} {t.unit}</dd>
          </div>
        </dl>
        <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
          {t.note}
        </p>
      </section>
    </div>
  );
}
