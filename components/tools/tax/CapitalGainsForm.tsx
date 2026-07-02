"use client";

import { useState } from "react";
import {
  calculateCapitalGainsTax,
  type CapitalGainsResult,
} from "@/lib/calculations/tax/capitalGainsTax";
import { NumberField } from "@/components/ui/NumberField";
import { formatKoreanMoney } from "@/lib/utils/format";
import { ResultShell } from "@/components/ui/calc-form";

interface CapitalGainsFormProps {
  locale: "ko" | "en";
}

const won = (n: number): string => Math.round(n).toLocaleString("ko-KR");

const T = {
  ko: {
    salePrice: "양도가액 (판매가, 원)",
    purchasePrice: "취득가액 (매입가, 원)",
    expenses: "필요경비 (취득세·중개비 등, 원)",
    holdingYears: "보유기간 (년)",
    residingYears: "거주기간 (년, 1주택)",
    assetType: "자산 종류",
    house: "주택",
    land: "토지·기타",
    oneHouse: "1세대 1주택 (장특공제 우대)",
    result: "예상 양도소득세",
    totalTax: "총 세부담 (소득세+지방세)",
    unit: "원",
    gain: "양도차익",
    ltDeduction: "장기보유특별공제",
    taxBase: "과세표준",
    marginalRate: "적용세율",
    calcTax: "산출세액",
    localTax: "지방소득세",
    netProceeds: "세후 차익",
    effectiveRate: "실효세율",
    shortTermBadge: "단기 양도 (중과)",
    note: "소득세법 2024 기준 단순 계산. 1세대1주택 12억 이하 비과세, 다주택 중과·감면 특례는 미반영. 정확한 신고는 세무사 상담 권장.",
  },
  en: {
    salePrice: "Sale price (KRW)",
    purchasePrice: "Purchase price (KRW)",
    expenses: "Expenses (acquisition tax, fees, KRW)",
    holdingYears: "Holding period (years)",
    residingYears: "Residing period (years, 1-house)",
    assetType: "Asset type",
    house: "House",
    land: "Land / other",
    oneHouse: "Single-house household (better deduction)",
    result: "Estimated capital gains tax",
    totalTax: "Total tax (income + local)",
    unit: "KRW",
    gain: "Capital gain",
    ltDeduction: "Long-term holding deduction",
    taxBase: "Tax base",
    marginalRate: "Applied rate",
    calcTax: "Calculated tax",
    localTax: "Local income tax",
    netProceeds: "After-tax gain",
    effectiveRate: "Effective rate",
    shortTermBadge: "Short-term (penalty rate)",
    note: "Simplified 2024 Income Tax Act calculation. Single-house exemption under KRW 1.2B and multi-house penalties not included. Consult a tax accountant for filing.",
  },
} as const;

export function CapitalGainsForm({
  locale,
}: CapitalGainsFormProps): React.ReactElement {
  const t = T[locale];
  const [salePrice, setSalePrice] = useState(800_000_000);
  const [purchasePrice, setPurchasePrice] = useState(500_000_000);
  const [expenses, setExpenses] = useState(20_000_000);
  const [holdingYears, setHoldingYears] = useState(5);
  const [residingYears, setResidingYears] = useState(5);
  const [assetType, setAssetType] = useState<"house" | "land">("house");
  const [isOneHouse, setIsOneHouse] = useState(false);

  const result: CapitalGainsResult = calculateCapitalGainsTax({
    salePrice,
    purchasePrice,
    expenses,
    holdingYears,
    residingYears,
    assetType,
    isOneHouse,
  });

  const moneyField = (
    label: string,
    value: number,
    setter: (v: number) => void,
  ) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
        {label}
      </label>
      <NumberField
        value={value}
        onChange={setter}
        suffix={t.unit}
        aria-label={label}
      />
      {locale === "ko" && value > 0 && (
        <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
          {formatKoreanMoney(value)}
        </p>
      )}
    </div>
  );

  const yearField = (
    label: string,
    value: number,
    setter: (v: number) => void,
  ) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
        {label}
      </label>
      <NumberField
        value={value}
        onChange={setter}
        thousands={false}
        max={50}
        aria-label={label}
      />
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-4 p-5 md:p-7">
        {moneyField(t.salePrice, salePrice, setSalePrice)}
        {moneyField(t.purchasePrice, purchasePrice, setPurchasePrice)}
        {moneyField(t.expenses, expenses, setExpenses)}
        <div className="grid grid-cols-2 gap-3">
          {yearField(t.holdingYears, holdingYears, setHoldingYears)}
          {yearField(t.residingYears, residingYears, setResidingYears)}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.assetType}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["house", "land"] as const).map((a) => (
              <button
                key={a}
                type="button"
                onClick={() => setAssetType(a)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  assetType === a
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                    : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-indigo-400"
                }`}
              >
                {a === "house" ? t.house : t.land}
              </button>
            ))}
          </div>
        </div>
        <label className="flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)]">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={isOneHouse}
            onChange={(e) => setIsOneHouse(e.target.checked)}
          />
          {t.oneHouse}
        </label>
      </section>

      <ResultShell
        heading={t.result}
        locale={locale}
        relatedLinks={
          locale !== "ko"
            ? [
                { label: "Apartment Area Convert", href: "/apartment-area" },
                { label: "Income Tax", href: "/income-tax" },
                { label: "Korean Pyeong explained", href: "/blog/korean-pyeong-explained-for-foreigners" },
              ]
            : [
                { label: "아파트 평형 변환", href: "/apartment-area" },
                { label: "종합소득세 계산기", href: "/income-tax" },
                { label: "한국 평수 설명 블로그", href: "/blog/korean-pyeong-explained-for-foreigners" },
              ]
        }
      >
        <div className="space-y-4">
          {result.isShortTerm && (
            <span className="inline-block rounded-md bg-red-500/15 px-2 py-0.5 text-[11px] font-semibold text-red-300">
              {t.shortTermBadge}
            </span>
          )}

          <div className="rounded-xl bg-gradient-to-br from-rose-500/15 to-pink-500/10 p-4 ring-1 ring-rose-500/20">
            <dt className="text-xs font-medium text-[color:var(--color-text-tertiary)]">
              {t.totalTax}
            </dt>
            <dd className="mt-1 text-4xl font-bold tabular-nums text-[#eef0f5]">
              {won(result.totalTax)}
              <span className="ml-1 text-base font-medium text-[color:var(--color-text-secondary)]">
                {t.unit}
              </span>
            </dd>
            <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
              {t.effectiveRate} {(result.effectiveRate * 100).toFixed(1)}% ·{" "}
              {t.marginalRate} {(result.marginalRate * 100).toFixed(0)}%
            </p>
          </div>

          <dl className="space-y-1.5 text-sm">
            {[
              [t.gain, result.gain],
              [t.ltDeduction, -result.longTermDeduction],
              [t.taxBase, result.taxBase],
              [t.calcTax, result.calculatedTax],
              [t.localTax, result.localTax],
            ].map(([label, val]) => (
              <div key={label as string} className="flex justify-between">
                <dt className="text-[color:var(--color-text-tertiary)]">{label}</dt>
                <dd className="tabular-nums text-[color:var(--color-text-secondary)]">
                  {won(val as number)} {t.unit}
                </dd>
              </div>
            ))}
            <div className="flex justify-between border-t border-[color:var(--color-border-subtle)] pt-1.5 font-semibold">
              <dt className="text-emerald-300">{t.netProceeds}</dt>
              <dd className="tabular-nums text-emerald-300">
                {won(result.netProceeds)} {t.unit}
              </dd>
            </div>
          </dl>

          <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
            {t.note}
          </p>
        </div>
      </ResultShell>
    </div>
  );
}
