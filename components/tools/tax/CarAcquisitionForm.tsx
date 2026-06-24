"use client";

import { useState } from "react";
import {
  calculateCarAcquisitionTax,
  type CarAcqResult,
} from "@/lib/calculations/tax/carTax";
import { NumberField } from "@/components/ui/NumberField";
import { formatKoreanMoney } from "@/lib/utils/format";

interface CarAcquisitionFormProps {
  locale: "ko" | "en";
}

const won = (n: number): string => Math.round(n).toLocaleString("ko-KR");

const T = {
  ko: {
    price: "취득가액 (부가세 제외, 원)",
    carType: "차종",
    types: {
      passenger: "승용차 (7%)",
      light: "경차 (4%)",
      eco: "친환경차",
      commercial: "승합·화물 (5%)",
    },
    result: "취득세",
    total: "납부 취득세",
    unit: "원",
    rate: "세율",
    tax: "취득세 (감면 전)",
    discount: "친환경 감면",
    note: "지방세법 기준. 신차는 부가세 제외 출고가, 중고차는 실거래가/과표 중 높은 값 기준. 공채매입비·등록 부대비용은 별도. 2025 다자녀 감면(3자녀 면제) 미반영.",
  },
  en: {
    price: "Acquisition price (excl. VAT, KRW)",
    carType: "Vehicle type",
    types: {
      passenger: "Passenger (7%)",
      light: "Light car (4%)",
      eco: "Eco-friendly",
      commercial: "Van/cargo (5%)",
    },
    result: "Acquisition tax",
    total: "Tax payable",
    unit: "KRW",
    rate: "Rate",
    tax: "Tax (before discount)",
    discount: "Eco discount",
    note: "Local Tax Act. New cars use ex-factory price (excl. VAT); used cars the higher of actual price/assessed value. Bond purchase and registration fees are separate.",
  },
} as const;

export function CarAcquisitionForm({
  locale,
}: CarAcquisitionFormProps): React.ReactElement {
  const t = T[locale];
  const [price, setPrice] = useState(30_000_000);
  const [carType, setCarType] = useState<
    "passenger" | "light" | "eco" | "commercial"
  >("passenger");

  const r: CarAcqResult = calculateCarAcquisitionTax({ price, carType });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-5 p-5 md:p-7">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.price}
          </label>
          <NumberField
            value={price}
            onChange={setPrice}
            suffix={t.unit}
            aria-label={t.price}
            className="text-2xl font-bold tabular-nums"
          />
          {locale === "ko" && price > 0 && (
            <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
              {formatKoreanMoney(price)}
            </p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.carType}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["passenger", "light", "eco", "commercial"] as const).map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCarType(c)}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  carType === c
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                    : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-indigo-400"
                }`}
              >
                {t.types[c]}
              </button>
            ))}
          </div>
        </div>
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
            {t.rate} {(r.rate * 100).toFixed(0)}%
          </p>
        </div>
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between">
            <dt className="text-[color:var(--color-text-tertiary)]">{t.tax}</dt>
            <dd className="tabular-nums text-[color:var(--color-text-secondary)]">{won(r.acquisitionTax)} {t.unit}</dd>
          </div>
          {r.ecoDiscount > 0 && (
            <div className="flex justify-between text-emerald-300">
              <dt>{t.discount}</dt>
              <dd className="tabular-nums">−{won(r.ecoDiscount)} {t.unit}</dd>
            </div>
          )}
        </dl>
        <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
          {t.note}
        </p>
      </section>
    </div>
  );
}
