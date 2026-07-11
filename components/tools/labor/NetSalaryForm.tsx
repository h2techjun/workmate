"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { calculateNetSalary } from "@/lib/calculations/labor/netSalary";
import { NumberField } from "@/components/ui/NumberField";
import { ShareResultCard } from "@/components/ui/ShareResultCard";
import { BreakdownBar } from "@/components/ui/charts";
import { segmentBar, buildShareText } from "@/lib/share/emojiBar";
import { formatKoreanMoney } from "@/lib/utils/format";

interface NetSalaryFormProps {
  locale: "ko" | "en" | "zh" | "vi";
}

const won = (n: number): string => Math.round(n).toLocaleString("ko-KR");

const T = {
  ko: {
    annual: "연봉 (원)",
    dependents: "부양가족 수 (본인 포함)",
    children: "20세 이하 자녀 수",
    nonTax: "월 비과세액 (식대 등, 원)",
    result: "월 실수령액",
    monthlyNet: "월 실수령액",
    annualNet: "연 실수령액",
    unit: "원",
    gross: "월 급여 (세전)",
    insurance: "4대보험",
    pension: "국민연금",
    health: "건강보험",
    longTerm: "장기요양",
    employment: "고용보험",
    incomeTax: "소득세",
    localTax: "지방소득세",
    taxTotal: "세금",
    deductionRate: "공제율",
    takeHomeRate: "실수령률",
    chartTitle: "월급 구성",
    note: "2026 4대보험 요율 + 근로소득세 간이 추정. 실제 원천징수는 국세청 간이세액표 기준이라 ±5% 차이 가능. 연말정산으로 정산.",
  },
  en: {
    annual: "Annual salary (KRW)",
    dependents: "Dependents (incl. self)",
    children: "Children under 20",
    nonTax: "Monthly non-taxable (meal, KRW)",
    result: "Monthly take-home",
    monthlyNet: "Monthly take-home",
    annualNet: "Annual take-home",
    unit: "KRW",
    gross: "Monthly gross",
    insurance: "4 insurances",
    pension: "National pension",
    health: "Health insurance",
    longTerm: "Long-term care",
    employment: "Employment ins.",
    incomeTax: "Income tax",
    localTax: "Local income tax",
    taxTotal: "Tax",
    deductionRate: "Deduction rate",
    takeHomeRate: "Take-home rate",
    chartTitle: "Monthly breakdown",
    note: "2026 insurance rates + estimated withholding. Actual withholding follows the NTS simplified table (±5%). Reconciled at year-end settlement.",
  },
  zh: {
    annual: "年薪 (韩元)",
    dependents: "受抚养人数 (含本人)",
    children: "20岁以下子女数",
    nonTax: "月免税额 (伙食费等，韩元)",
    result: "月实领工资",
    monthlyNet: "月实领工资",
    annualNet: "年实领工资",
    unit: "韩元",
    gross: "月薪 (税前)",
    insurance: "四大保险",
    pension: "国民年金",
    health: "健康保险",
    longTerm: "长期疗养保险",
    employment: "雇佣保险",
    incomeTax: "所得税",
    localTax: "地方所得税",
    taxTotal: "税金",
    deductionRate: "扣除比例",
    takeHomeRate: "实领比例",
    chartTitle: "月薪构成",
    note: "按2026年四大保险费率与劳动所得税简易估算。实际代扣代缴以国税厅简易税额表为准，可能相差±5%。准确金额以年末结算为准。",
  },
  vi: {
    annual: "Lương năm (KRW)",
    dependents: "Số người phụ thuộc (kể cả bản thân)",
    children: "Số con dưới 20 tuổi",
    nonTax: "Khoản miễn thuế hàng tháng (tiền ăn, v.v., KRW)",
    result: "Lương thực nhận hàng tháng",
    monthlyNet: "Lương thực nhận hàng tháng",
    annualNet: "Lương thực nhận hàng năm",
    unit: "KRW",
    gross: "Lương gộp hàng tháng",
    insurance: "4 loại bảo hiểm xã hội",
    pension: "Lương hưu Quốc dân (NPS)",
    health: "Bảo hiểm y tế (NHIS)",
    longTerm: "Bảo hiểm chăm sóc dài hạn",
    employment: "Bảo hiểm việc làm",
    incomeTax: "Thuế thu nhập",
    localTax: "Thuế thu nhập địa phương",
    taxTotal: "Thuế",
    deductionRate: "Tỷ lệ khấu trừ",
    takeHomeRate: "Tỷ lệ thực nhận",
    chartTitle: "Cơ cấu lương tháng",
    note: "Theo tỷ lệ bảo hiểm 2026 + ước tính khấu trừ tại nguồn. Khấu trừ thực tế theo bảng thuế đơn giản của Cơ quan Thuế Quốc gia (NTS) (±5%). Được quyết toán vào cuối năm.",
  },
} as const;

/** 결과 요약 headline — 로케일별 단위 간격(ko 는 붙여쓰기) 반영 */
function buildHeadline(
  locale: NetSalaryFormProps["locale"],
  label: string,
  net: string,
  unit: string,
): string {
  const money = locale === "ko" ? `${net}${unit}` : `${net} ${unit}`;
  return `💰 ${label} ${money}`;
}

export function NetSalaryForm({
  locale,
}: NetSalaryFormProps): React.ReactElement {
  const t = T[locale];
  const tShare = useTranslations("share");
  const [annual, setAnnual] = useState(50_000_000);
  const [dependents, setDependents] = useState(1);
  const [children, setChildren] = useState(0);
  const [nonTax, setNonTax] = useState(200_000);

  const r = calculateNetSalary({
    annualSalary: annual,
    dependents,
    childrenUnder20: children,
    monthlyNonTax: nonTax,
  });

  const takeHomeRate = (1 - r.deductionRate) * 100;
  const bar = segmentBar([
    { value: r.monthlyNet, color: "green" },
    { value: r.totalInsurance, color: "blue" },
    { value: r.totalTax, color: "red" },
  ]);
  const rateText = `${t.takeHomeRate} ${takeHomeRate.toFixed(1)}%`;
  const shareText = buildShareText({
    headline: buildHeadline(locale, t.monthlyNet, won(r.monthlyNet), t.unit),
    bar,
    detail: rateText,
  });

  const field = (
    label: string,
    value: number,
    setter: (v: number) => void,
    opts: { money?: boolean; max?: number } = {},
  ) => (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
        {label}
      </label>
      <NumberField
        value={value}
        onChange={setter}
        suffix={opts.money ? t.unit : undefined}
        max={opts.max}
        aria-label={label}
      />
      {opts.money && locale === "ko" && value > 0 && (
        <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
          {formatKoreanMoney(value)}
        </p>
      )}
    </div>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-4 p-5 md:p-7">
        {field(t.annual, annual, setAnnual, { money: true })}
        <div className="grid grid-cols-2 gap-3">
          {field(t.dependents, dependents, setDependents, { max: 20 })}
          {field(t.children, children, setChildren, { max: 20 })}
        </div>
        {field(t.nonTax, nonTax, setNonTax, { money: true })}
      </section>

      <div className="space-y-4">
        {/* 아케이드 결과 카드 — 타일 리빌 + 실수령률 배지 + 이모지 공유 */}
        <ShareResultCard
          key={won(r.monthlyNet)}
          label={t.monthlyNet}
          value={won(r.monthlyNet)}
          unit={t.unit}
          bar={bar}
          barLabel={t.chartTitle}
          badges={[{ text: rateText, tone: "success" }]}
          shareText={shareText}
          shareLabel={tShare("button")}
          copiedLabel={tShare("copied")}
          accent="emerald"
        />

        {/* 상세 분석 카드 — 연 실수령 + 구성 차트 + 공제 내역 */}
        <section className="surface-card space-y-4 p-5 md:p-6">
          <p className="text-sm text-[color:var(--color-text-secondary)]">
            {t.annualNet}{" "}
            <span className="font-semibold tabular-nums text-[color:var(--color-text-primary)]">
              {won(r.annualNet)} {t.unit}
            </span>{" "}
            · {t.deductionRate} {(r.deductionRate * 100).toFixed(1)}%
          </p>

          <div>
            <div className="mb-2.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-[color:var(--color-text-tertiary)]">
              <span>🟩 {t.monthlyNet}</span>
              <span>🟦 {t.insurance}</span>
              <span>🟥 {t.taxTotal}</span>
            </div>
            <BreakdownBar
              segments={[
                { label: t.monthlyNet, value: r.monthlyNet, color: "var(--chart-2)" },
                { label: t.pension, value: r.pension, color: "var(--chart-1)" },
                { label: t.health, value: r.health, color: "var(--chart-5)" },
                { label: t.longTerm, value: r.longTerm, color: "var(--chart-6)" },
                { label: t.employment, value: r.employment, color: "var(--chart-3)" },
                { label: t.incomeTax, value: r.incomeTax, color: "var(--chart-4)" },
                { label: t.localTax, value: r.localTax, color: "var(--color-text-muted)" },
              ]}
              format={won}
              ariaLabel={t.chartTitle}
            />
          </div>

          <dl className="space-y-1.5 text-sm">
            <div className="flex justify-between font-semibold">
              <dt className="text-[color:var(--color-text-secondary)]">{t.gross}</dt>
              <dd className="tabular-nums text-[color:var(--color-text-primary)]">
                {won(r.monthlyGross)} {t.unit}
              </dd>
            </div>
            <div className="flex justify-between text-[color:var(--color-text-tertiary)]">
              <dt>{t.insurance}</dt>
              <dd className="tabular-nums">−{won(r.totalInsurance)}</dd>
            </div>
            {[
              [t.pension, r.pension],
              [t.health, r.health],
              [t.longTerm, r.longTerm],
              [t.employment, r.employment],
            ].map(([label, val]) => (
              <div
                key={label as string}
                className="flex justify-between pl-3 text-xs text-[color:var(--color-text-muted)]"
              >
                <dt>{label}</dt>
                <dd className="tabular-nums">{won(val as number)}</dd>
              </div>
            ))}
            <div className="flex justify-between text-[color:var(--color-text-tertiary)]">
              <dt>{t.incomeTax}</dt>
              <dd className="tabular-nums">−{won(r.incomeTax)}</dd>
            </div>
            <div className="flex justify-between text-[color:var(--color-text-tertiary)]">
              <dt>{t.localTax}</dt>
              <dd className="tabular-nums">−{won(r.localTax)}</dd>
            </div>
          </dl>

          <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
            {t.note}
          </p>
        </section>
      </div>
    </div>
  );
}
