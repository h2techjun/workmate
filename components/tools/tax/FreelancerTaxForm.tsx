"use client";

import { useState } from "react";
import { calculateFreelancerTax } from "@/lib/calculations/tax/freelancerTax";
import { NumberField } from "@/components/ui/NumberField";
import { formatKoreanMoney } from "@/lib/utils/format";

interface FreelancerTaxFormProps {
  locale: "ko" | "en" | "vi" | "zh";
}

const won = (n: number): string => Math.round(n).toLocaleString("ko-KR");

const T = {
  ko: {
    amount: "금액 (원)",
    basis: "입력 기준",
    gross: "세전 지급액",
    net: "실수령액",
    result: "원천징수 결과",
    grossLabel: "세전 지급액",
    incomeTax: "소득세 (3%)",
    localTax: "지방소득세 (0.3%)",
    withholding: "원천징수 합계 (3.3%)",
    netLabel: "실수령액",
    unit: "원",
    annual: "월 지급 가정 연 환산",
    annualGross: "연 세전",
    annualWithholding: "연 원천징수",
    note: "프리랜서·인적용역 사업소득은 지급 시 3.3%(소득세 3% + 지방세 0.3%) 원천징수. 다음해 5월 종합소득세 신고로 정산하며, 경비 인정 시 환급 가능.",
  },
  en: {
    amount: "Amount (KRW)",
    basis: "Input basis",
    gross: "Gross (before tax)",
    net: "Net (take-home)",
    result: "Withholding result",
    grossLabel: "Gross payment",
    incomeTax: "Income tax (3%)",
    localTax: "Local tax (0.3%)",
    withholding: "Total withholding (3.3%)",
    netLabel: "Net received",
    unit: "KRW",
    annual: "Annualized (monthly basis)",
    annualGross: "Annual gross",
    annualWithholding: "Annual withholding",
    note: "Korean freelance/personal-service income is withheld 3.3% (income 3% + local 0.3%) at payment. Reconciled via the May income tax filing; refunds possible after deducting expenses.",
  },
  vi: {
    amount: "Số tiền (KRW)",
    basis: "Cơ sở nhập liệu",
    gross: "Tổng trước thuế",
    net: "Thực nhận",
    result: "Kết quả khấu trừ tại nguồn",
    grossLabel: "Số tiền trước thuế",
    incomeTax: "Thuế thu nhập (3%)",
    localTax: "Thuế địa phương (0,3%)",
    withholding: "Tổng khấu trừ tại nguồn (3,3%)",
    netLabel: "Số tiền thực nhận",
    unit: "KRW",
    annual: "Quy đổi theo năm (giả định trả hàng tháng)",
    annualGross: "Tổng trước thuế theo năm",
    annualWithholding: "Khấu trừ tại nguồn theo năm",
    note: "Thu nhập kinh doanh của freelancer/dịch vụ cá nhân bị khấu trừ tại nguồn 3,3% (thuế thu nhập 3% + thuế địa phương 0,3%) khi thanh toán. Được quyết toán qua kỳ khai thuế thu nhập tổng hợp vào tháng 5 năm sau; có thể được hoàn thuế nếu được công nhận chi phí.",
  },
  zh: {
    amount: "金额 (韩元)",
    basis: "输入基准",
    gross: "税前支付额",
    net: "实收金额",
    result: "预扣结果",
    grossLabel: "税前支付额",
    incomeTax: "所得税 (3%)",
    localTax: "地方所得税 (0.3%)",
    withholding: "预扣合计 (3.3%)",
    netLabel: "实收金额",
    unit: "韩元",
    annual: "按月支付假设下的年度换算",
    annualGross: "年度税前",
    annualWithholding: "年度预扣税额",
    note: "自由职业者·个人劳务营业所得在支付时按3.3%(所得税3% + 地方所得税0.3%)预扣。次年5月综合所得税申报时统一结算，若认定必要经费可获退税。",
  },
} as const;

export function FreelancerTaxForm({
  locale,
}: FreelancerTaxFormProps): React.ReactElement {
  const t = T[locale];
  const [amount, setAmount] = useState(3_000_000);
  const [basis, setBasis] = useState<"gross" | "net">("gross");

  const r = calculateFreelancerTax({ amount, basis });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-5 p-5 md:p-7">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.amount}
          </label>
          <NumberField
            value={amount}
            onChange={setAmount}
            suffix={t.unit}
            aria-label={t.amount}
            className="text-2xl font-bold tabular-nums"
          />
          {locale === "ko" && amount > 0 && (
            <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
              {formatKoreanMoney(amount)}
            </p>
          )}
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.basis}
          </label>
          <div className="grid grid-cols-2 gap-2">
            {(["gross", "net"] as const).map((b) => (
              <button
                key={b}
                type="button"
                onClick={() => setBasis(b)}
                className={`rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                  basis === b
                    ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                    : "border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-indigo-400"
                }`}
              >
                {b === "gross" ? t.gross : t.net}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          {t.result}
        </h2>
        <div className="rounded-xl bg-gradient-to-br from-emerald-500/15 to-teal-500/10 p-4 ring-1 ring-emerald-500/20">
          <dt className="text-xs font-medium text-[color:var(--color-text-tertiary)]">
            {t.netLabel}
          </dt>
          <dd className="mt-1 text-4xl font-bold tabular-nums text-[color:var(--color-text-hero)]">
            {won(r.net)}
            <span className="ml-1 text-base font-medium text-[color:var(--color-text-secondary)]">
              {t.unit}
            </span>
          </dd>
        </div>
        <dl className="space-y-1.5 text-sm">
          <div className="flex justify-between font-semibold">
            <dt className="text-[color:var(--color-text-secondary)]">{t.grossLabel}</dt>
            <dd className="tabular-nums text-[color:var(--color-text-primary)]">{won(r.gross)} {t.unit}</dd>
          </div>
          <div className="flex justify-between text-[color:var(--color-text-tertiary)]">
            <dt>{t.incomeTax}</dt>
            <dd className="tabular-nums">−{won(r.incomeTax)}</dd>
          </div>
          <div className="flex justify-between text-[color:var(--color-text-tertiary)]">
            <dt>{t.localTax}</dt>
            <dd className="tabular-nums">−{won(r.localTax)}</dd>
          </div>
          <div className="flex justify-between border-t border-[color:var(--color-border-subtle)] pt-1.5 font-semibold">
            <dt className="text-[color:var(--color-text-secondary)]">{t.withholding}</dt>
            <dd className="tabular-nums text-[color:var(--color-text-primary)]">−{won(r.totalWithholding)}</dd>
          </div>
        </dl>
        <div className="rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-3 text-xs">
          <p className="mb-1 font-semibold text-[color:var(--color-text-secondary)]">{t.annual}</p>
          <div className="flex justify-between text-[color:var(--color-text-tertiary)]">
            <span>{t.annualGross}</span>
            <span className="tabular-nums">{won(r.annualGross)} {t.unit}</span>
          </div>
          <div className="flex justify-between text-[color:var(--color-text-tertiary)]">
            <span>{t.annualWithholding}</span>
            <span className="tabular-nums">{won(r.annualWithholding)} {t.unit}</span>
          </div>
        </div>
        <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
          {t.note}
        </p>
      </section>
    </div>
  );
}
