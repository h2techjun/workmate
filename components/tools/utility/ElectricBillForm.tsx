"use client";

import { useState } from "react";
import {
  calculateElectricBill,
  type Voltage,
} from "@/lib/calculations/utility/electricBill";
import { NumberField } from "@/components/ui/NumberField";

interface ElectricBillFormProps {
  locale: "ko" | "en";
}

const won = (n: number): string => Math.round(n).toLocaleString("ko-KR");

const T = {
  ko: {
    usage: "월 사용량 (kWh)",
    voltage: "공급 방식",
    low: "저압 (단독·다세대)",
    high: "고압 (대단지 아파트)",
    summer: "여름철(7~8월) 누진 완화 적용",
    result: "예상 청구금액",
    total: "최종 청구금액",
    unit: "원",
    appliedTier: "적용 누진단계",
    tierUnit: "단계",
    base: "기본요금",
    energy: "전력량요금",
    climate: "기후환경요금",
    fuel: "연료비조정",
    subtotal: "전기요금계",
    vat: "부가가치세 (10%)",
    fund: "전력기금 (3.7%)",
    avg: "평균 단가",
    avgUnit: "원/kWh",
    tierTable: "구간별 전력량요금",
    colTier: "단계",
    colKwh: "사용량",
    colRate: "단가",
    colAmount: "요금",
    note: "한국전력 주택용 전력 2024 기준. 기후환경 9원·연료조정 5원/kWh 가정. 필수사용량보장공제·슈퍼유저 등 특례 미반영.",
  },
  en: {
    usage: "Monthly usage (kWh)",
    voltage: "Supply type",
    low: "Low voltage (house/villa)",
    high: "High voltage (large apt complex)",
    summer: "Apply summer (Jul-Aug) relaxed tiers",
    result: "Estimated bill",
    total: "Total bill",
    unit: "KRW",
    appliedTier: "Applied tier",
    tierUnit: "",
    base: "Base fee",
    energy: "Energy charge",
    climate: "Climate-environment charge",
    fuel: "Fuel adjustment",
    subtotal: "Electricity subtotal",
    vat: "VAT (10%)",
    fund: "Power fund (3.7%)",
    avg: "Average rate",
    avgUnit: "KRW/kWh",
    tierTable: "Energy charge by tier",
    colTier: "Tier",
    colKwh: "Usage",
    colRate: "Rate",
    colAmount: "Charge",
    note: "KEPCO residential 2024 rates. Climate 9 / fuel 5 KRW/kWh assumed. Special discounts not included.",
  },
} as const;

export function ElectricBillForm({
  locale,
}: ElectricBillFormProps): React.ReactElement {
  const t = T[locale];
  const [usage, setUsage] = useState<number>(300);
  const [voltage, setVoltage] = useState<Voltage>("low");
  const [isSummer, setIsSummer] = useState<boolean>(false);

  const result = calculateElectricBill({
    usageKwh: usage,
    voltage,
    isSummer,
    climateRate: 9.0,
    fuelAdjustRate: 5.0,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-5 p-5 md:p-7">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.usage}
          </label>
          <NumberField
            value={usage}
            onChange={setUsage}
            thousands={true}
            decimals={0}
            suffix="kWh"
            min={0}
            aria-label={t.usage}
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.voltage}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["low", "high"] as Voltage[]).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setVoltage(v)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  voltage === v
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white shadow-md shadow-indigo-500/30"
                    : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-indigo-400"
                }`}
              >
                {v === "low" ? t.low : t.high}
              </button>
            ))}
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)]">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={isSummer}
            onChange={(e) => setIsSummer(e.target.checked)}
          />
          {t.summer}
        </label>
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          {t.result}
        </h2>

        <div className="rounded-xl bg-gradient-to-br from-amber-500/15 to-orange-500/10 p-4 ring-1 ring-amber-500/20">
          <dt className="text-xs font-medium text-[color:var(--color-text-tertiary)]">
            {t.total}
          </dt>
          <dd className="mt-1 text-4xl font-bold tabular-nums text-[#eef0f5]">
            {won(result.total)}
            <span className="ml-1 text-base font-medium text-[color:var(--color-text-secondary)]">
              {t.unit}
            </span>
          </dd>
          <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
            {t.appliedTier}: {result.appliedTier}
            {t.tierUnit} · {t.avg} {result.avgRate.toFixed(1)} {t.avgUnit}
          </p>
        </div>

        <dl className="space-y-1.5 text-sm">
          {[
            [t.base, result.baseFee],
            [t.energy, result.energyFee],
            [t.climate, result.climateFee],
            [t.fuel, result.fuelAdjustFee],
          ].map(([label, val]) => (
            <div key={label as string} className="flex justify-between">
              <dt className="text-[color:var(--color-text-tertiary)]">{label}</dt>
              <dd className="tabular-nums text-[color:var(--color-text-secondary)]">
                {won(val as number)} {t.unit}
              </dd>
            </div>
          ))}
          <div className="flex justify-between border-t border-[color:var(--color-border-subtle)] pt-1.5 font-semibold">
            <dt className="text-[color:var(--color-text-secondary)]">{t.subtotal}</dt>
            <dd className="tabular-nums text-[color:var(--color-text-primary)]">
              {won(result.subtotal)} {t.unit}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[color:var(--color-text-tertiary)]">{t.vat}</dt>
            <dd className="tabular-nums text-[color:var(--color-text-secondary)]">
              {won(result.vat)} {t.unit}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-[color:var(--color-text-tertiary)]">{t.fund}</dt>
            <dd className="tabular-nums text-[color:var(--color-text-secondary)]">
              {won(result.powerFund)} {t.unit}
            </dd>
          </div>
        </dl>

        <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-[color:var(--color-border-subtle)] text-[color:var(--color-text-tertiary)]">
                <th className="px-3 py-2 text-left font-medium">{t.colTier}</th>
                <th className="px-3 py-2 text-right font-medium">{t.colKwh}</th>
                <th className="px-3 py-2 text-right font-medium">{t.colRate}</th>
                <th className="px-3 py-2 text-right font-medium">{t.colAmount}</th>
              </tr>
            </thead>
            <tbody className="tabular-nums">
              {result.tierBreakdown.map((row) => (
                <tr
                  key={row.tier}
                  className="border-b border-[color:var(--color-border-subtle)]/50 last:border-0 text-[color:var(--color-text-secondary)]"
                >
                  <td className="px-3 py-1.5">{row.tier}</td>
                  <td className="px-3 py-1.5 text-right">{row.kwh} kWh</td>
                  <td className="px-3 py-1.5 text-right">{row.rate}</td>
                  <td className="px-3 py-1.5 text-right text-[color:var(--color-text-primary)]">
                    {won(row.amount)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
          {t.note}
        </p>
      </section>
    </div>
  );
}
