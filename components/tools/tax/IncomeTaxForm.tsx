"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BRACKETS_2026,
  calculateIncomeTax,
  incomeTaxInputSchema,
  type IncomeTaxInputResolved,
  type IncomeTaxResult,
} from "@/lib/calculations/tax/incomeTax";
import {
  ActionRow,
  CalcLayout,
  EmptyResult,
  ErrorBox,
  Field,
  FieldGroup,
  FormShell,
  HeroResult,
  ResultShell,
  SourceBox,
  Stat,
} from "@/components/ui/calc-form";
import { NumberField } from "@/components/ui/NumberField";
import { BracketScale } from "@/components/ui/charts";
import { formatAxisMoney, formatKoreanMoney } from "@/lib/utils/format";

interface IncomeTaxFormProps {
  locale: "ko" | "en" | "vi" | "zh";
}

const won = (n: number): string => Math.round(n).toLocaleString("ko-KR");

const T = {
  ko: {
    sectionIncome: "과세표준",
    sectionOptions: "옵션",
    fieldTaxable: "종합소득 과세표준 (원)",
    fieldTaxableHint: "종합소득금액 − 종합소득공제 = 과세표준",
    fieldWageCredit: "근로소득세액공제 적용 (근로자)",
    calculate: "계산하기",
    reset: "초기화",
    resultHeading: "세금 산출",
    resultEmpty: "과세표준을 입력하세요.",
    error: "계산 오류",
    heroLabel: "총 세부담 (소득세 + 지방세)",
    heroUnit: "원",
    marginalRate: "한계세율",
    calculatedTax: "소득세 (산출)",
    wageCredit: "근로소득세액공제",
    finalTax: "결정세액",
    localTax: "지방소득세 (10%)",
    effectiveRate: "실효세율",
    bracketsHeading: "2026 종합소득세 구간",
    chartMarker: "과세표준",
    colBracket: "과세표준",
    colRate: "세율",
    colDeduction: "누진공제",
    sourceTitle: "법령 · 가정",
    sourceLines: [
      "소득세법 §55: 8구간 누진세율 (6%·15%·24%·35%·38%·40%·42%·45%, 2023 개정).",
      "산출세액 = 과세표준 × 한계세율 − 누진공제.",
      "지방소득세 = 결정세액 × 10% (별도 신고지만 자동 산출).",
      "근로소득세액공제 (§59): 산출 130만 이하 55%, 초과 30% + 총급여 한도.",
      "자녀·연금저축·의료비 등 세액공제는 별도 차감 (이 계산기는 미포함).",
    ],
  },
  en: {
    sectionIncome: "Taxable Income",
    sectionOptions: "Options",
    fieldTaxable: "Taxable income (₩)",
    fieldTaxableHint: "Gross income − deductions = taxable base",
    fieldWageCredit: "Apply wage earner credit (employee)",
    calculate: "Calculate",
    reset: "Reset",
    resultHeading: "Tax Breakdown",
    resultEmpty: "Enter taxable income.",
    error: "Calculation failed",
    heroLabel: "Total tax (income + local)",
    heroUnit: "₩",
    marginalRate: "Marginal rate",
    calculatedTax: "Income tax",
    wageCredit: "Wage earner credit",
    finalTax: "Final tax",
    localTax: "Local income tax (10%)",
    effectiveRate: "Effective rate",
    bracketsHeading: "2026 Korean Tax Brackets",
    chartMarker: "Taxable",
    colBracket: "Taxable income",
    colRate: "Rate",
    colDeduction: "Progressive deduction",
    sourceTitle: "Law · assumptions",
    sourceLines: [
      "Korean Income Tax Act §55: 8 progressive brackets (6%/15%/24%/35%/38%/40%/42%/45%).",
      "Tax = base × marginal rate − progressive deduction.",
      "Local income tax = final tax × 10%.",
      "Wage earner credit (§59): 55% of tax up to ₩1.3M, then 30%, capped by gross income.",
      "Child / pension / medical credits are not included here.",
    ],
  },
  vi: {
    sectionIncome: "Cơ sở tính thuế",
    sectionOptions: "Tùy chọn",
    fieldTaxable: "Cơ sở tính thuế thu nhập tổng hợp (₩)",
    fieldTaxableHint: "Tổng thu nhập tổng hợp − Khấu trừ thu nhập tổng hợp = Cơ sở tính thuế",
    fieldWageCredit: "Áp dụng khấu trừ thuế cho người lao động (nhân viên)",
    calculate: "Tính toán",
    reset: "Đặt lại",
    resultHeading: "Kết quả tính thuế",
    resultEmpty: "Vui lòng nhập cơ sở tính thuế.",
    error: "Lỗi tính toán",
    heroLabel: "Tổng gánh nặng thuế (thuế thu nhập + thuế địa phương)",
    heroUnit: "₩",
    marginalRate: "Thuế suất biên",
    calculatedTax: "Thuế thu nhập (tính toán)",
    wageCredit: "Khấu trừ thuế người lao động",
    finalTax: "Thuế quyết định",
    localTax: "Thuế thu nhập địa phương (10%)",
    effectiveRate: "Thuế suất thực tế",
    bracketsHeading: "Bậc thuế thu nhập tổng hợp Hàn Quốc 2026",
    chartMarker: "TNCT",
    colBracket: "Cơ sở tính thuế",
    colRate: "Thuế suất",
    colDeduction: "Khấu trừ lũy tiến",
    sourceTitle: "Căn cứ pháp lý · giả định",
    sourceLines: [
      "Luật Thuế Thu nhập (소득세법) §55: thuế suất lũy tiến 8 bậc (6%·15%·24%·35%·38%·40%·42%·45%, sửa đổi 2023).",
      "Thuế tính toán = Cơ sở tính thuế × Thuế suất biên − Khấu trừ lũy tiến.",
      "Thuế thu nhập địa phương = Thuế quyết định × 10% (khai báo riêng nhưng được tự động tính ra).",
      "Khấu trừ thuế người lao động (§59): 55% nếu thuế tính toán từ 1,3 triệu won trở xuống, 30% phần vượt + giới hạn theo tổng lương.",
      "Các khoản khấu trừ thuế khác như con cái, tiết kiệm hưu trí, chi phí y tế được trừ riêng (công cụ này chưa bao gồm).",
    ],
  },
  zh: {
    sectionIncome: "计税基数",
    sectionOptions: "选项",
    fieldTaxable: "综合所得计税基数 (韩元)",
    fieldTaxableHint: "综合所得金额 − 综合所得扣除额 = 计税基数",
    fieldWageCredit: "适用工资所得税额抵免 (工薪族)",
    calculate: "计算",
    reset: "重置",
    resultHeading: "税额结果",
    resultEmpty: "请输入计税基数。",
    error: "计算出错",
    heroLabel: "总税负 (所得税 + 地方所得税)",
    heroUnit: "韩元",
    marginalRate: "适用边际税率",
    calculatedTax: "所得税 (应纳税额)",
    wageCredit: "工资所得税额抵免",
    finalTax: "最终确定税额",
    localTax: "地方所得税 (10%)",
    effectiveRate: "实际税率",
    bracketsHeading: "2026年综合所得税税率表",
    chartMarker: "计税基数",
    colBracket: "计税基数",
    colRate: "税率",
    colDeduction: "累进扣除额",
    sourceTitle: "法律依据 · 假设条件",
    sourceLines: [
      "《所得税法》第55条：8级累进税率 (6%·15%·24%·35%·38%·40%·42%·45%，2023年修订)。",
      "应纳税额 = 计税基数 × 适用边际税率 − 累进扣除额。",
      "地方所得税 = 最终确定税额 × 10% (单独申报，本工具自动算出)。",
      "工资所得税额抵免 (第59条)：应纳税额130万韩元以下抵免55%，超出部分抵免30%，并按总薪资设上限。",
      "子女、养老金储蓄、医疗费等税额抵免另行扣减 (本计算器未包含)。",
    ],
  },
} as const;

function formatBracket(
  upper: number | null,
  prev: number,
  locale: "ko" | "en" | "vi" | "zh",
): string {
  if (locale === "ko") {
    // 만/억 한글 단위 (1.4억·5,000만 등 자연스러운 표기)
    const k = (n: number): string =>
      n >= 100_000_000
        ? `${(n / 100_000_000).toLocaleString("ko-KR")}억`
        : `${(n / 10_000).toLocaleString("ko-KR")}만`;
    if (upper === null) return `${k(prev)}원 초과`;
    return prev === 0 ? `${k(upper)}원 이하` : `${k(prev)} ~ ${k(upper)}원`;
  }
  if (locale === "zh") {
    // 万/亿 한자 단위 (한국어와 동일한 만진법 — formatAxisMoney 의 zh 표기와 통일)
    const k = (n: number): string =>
      n >= 100_000_000
        ? `${(n / 100_000_000).toLocaleString("zh-CN")}亿`
        : `${(n / 10_000).toLocaleString("zh-CN")}万`;
    if (upper === null) return `超过${k(prev)}韩元`;
    return prev === 0 ? `${k(upper)}韩元以下` : `${k(prev)} ~ ${k(upper)}韩元`;
  }
  // en / vi — 백만(M/triệu)·십억(B/tỷ) 국제 표기
  const um = locale === "vi" ? "tr" : "M";
  const ub = locale === "vi" ? "tỷ" : "B";
  const c = (n: number): string =>
    n >= 1_000_000_000
      ? `₩${(n / 1_000_000_000).toLocaleString("en-US")}${ub}`
      : `₩${(n / 1_000_000).toLocaleString("en-US")}${um}`;
  if (upper === null) return locale === "vi" ? `Trên ${c(prev)}` : `Over ${c(prev)}`;
  return prev === 0 ? `≤ ${c(upper)}` : `${c(prev)} – ${c(upper)}`;
}

const INCOME_TAX_DEFAULTS: IncomeTaxInputResolved = {
  taxableIncome: 50_000_000,
  applyWageEarnerCredit: false,
};

export function IncomeTaxForm({ locale }: IncomeTaxFormProps): React.ReactElement {
  const t = T[locale];
  // 통화 표기: ko="1,234,567 원", en/vi="₩1,234,567" (값은 동일, 단위만 로케일별)
  const money = (n: number): string =>
    locale === "ko" ? `${won(n)} 원` : `₩${won(n)}`;
  // 의미있는 기본값으로 마운트 시 즉시 결과 노출 (빈 화면 제거)
  const [result, setResult] = useState<IncomeTaxResult | null>(() => {
    try {
      return calculateIncomeTax(INCOME_TAX_DEFAULTS);
    } catch {
      return null;
    }
  });
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<IncomeTaxInputResolved>({
    resolver: zodResolver(incomeTaxInputSchema),
    defaultValues: INCOME_TAX_DEFAULTS,
  });

  const onSubmit = (values: IncomeTaxInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateIncomeTax(values));
    } catch {
      setResult(null);
      setCalcError(t.error);
    }
  };
  const onReset = (): void => {
    reset();
    setResult(null);
    setCalcError(null);
  };

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={t.sectionIncome}>
          <Controller
            control={control}
            name="taxableIncome"
            render={({ field }) => (
              <Field label={t.fieldTaxable} hint={t.fieldTaxableHint}>
                <NumberField
                  value={Number(field.value) || 0}
                  onChange={(v) => field.onChange(v)}
                  suffix={t.heroUnit}
                  min={0}
                  aria-label={t.fieldTaxable}
                />
                {locale === "ko" && Number(field.value) > 0 && (
                  <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
                    {formatKoreanMoney(Number(field.value))}
                  </p>
                )}
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup title={t.sectionOptions}>
          <label className="flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)]">
            <input
              type="checkbox"
              className="h-4 w-4 rounded border-[color:var(--color-border-subtle)] bg-transparent"
              {...register("applyWageEarnerCredit")}
            />
            <span>{t.fieldWageCredit}</span>
          </label>
        </FieldGroup>

        <ActionRow
          primary={
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {t.calculate}
            </button>
          }
          secondary={
            <button type="button" onClick={onReset} className="btn-ghost sm:w-auto">
              {t.reset}
            </button>
          }
        />
      </FormShell>

      <ResultShell
        heading={t.resultHeading}
        locale={locale}
        relatedLinks={
          locale !== "ko"
            ? [
                { label: "Freelancer Tax", href: "/freelancer-tax" },
                { label: "Salary Take-Home", href: "/net-salary" },
                { label: "Korea income tax traps", href: "/blog/income-tax-progressive-trap" },
              ]
            : [
                { label: "프리랜서 세금 계산기", href: "/freelancer-tax" },
                { label: "연봉 실수령액", href: "/net-salary" },
                { label: "누진세 함정 블로그", href: "/blog/income-tax-progressive-trap" },
              ]
        }
      >
        {calcError && <ErrorBox message={calcError} />}
        {!calcError && !result && <EmptyResult message={t.resultEmpty} />}
        {result && (
          <div className="animate-fade-up space-y-5">
            <HeroResult
              label={t.heroLabel}
              value={won(result.totalTax)}
              unit={t.heroUnit}
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t.marginalRate}
                value={`${(result.marginalRate * 100).toFixed(0)}%`}
              />
              <Stat
                label={t.effectiveRate}
                value={`${(result.effectiveRate * 100).toFixed(2)}%`}
              />
              <Stat label={t.calculatedTax} value={money(result.calculatedTax)} />
              {result.wageEarnerCredit > 0 && (
                <Stat
                  label={t.wageCredit}
                  value={`−${money(result.wageEarnerCredit)}`}
                  tone="success"
                />
              )}
              <Stat
                label={t.finalTax}
                value={money(result.finalTax)}
                full={result.wageEarnerCredit === 0}
              />
              <Stat label={t.localTax} value={money(result.localIncomeTax)} />
            </dl>

            <div>
              <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                {t.bracketsHeading}
              </h3>
              <div className="mb-4">
                <BracketScale
                  brackets={BRACKETS_2026}
                  value={result.taxableIncome}
                  markerLabel={`${t.chartMarker} ${formatAxisMoney(result.taxableIncome, locale)}`}
                  ariaLabel={t.bracketsHeading}
                />
              </div>
              <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[color:var(--color-border-subtle)] text-[color:var(--color-text-tertiary)]">
                      <th className="px-3 py-2 text-left font-medium">{t.colBracket}</th>
                      <th className="px-3 py-2 text-right font-medium">{t.colRate}</th>
                      <th className="px-3 py-2 text-right font-medium">
                        {t.colDeduction}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {BRACKETS_2026.map((b, i) => {
                      const prev = i === 0 ? 0 : (BRACKETS_2026[i - 1]?.upper ?? 0);
                      const isActive = b.rate === result.marginalRate;
                      return (
                        <tr
                          key={i}
                          className={`border-b border-[color:var(--color-border-subtle)]/50 last:border-0 tabular-nums ${
                            isActive
                              ? "bg-indigo-500/10 text-[color:var(--color-text-primary)]"
                              : "text-[color:var(--color-text-secondary)]"
                          }`}
                        >
                          <td className="px-3 py-1.5">
                            {formatBracket(b.upper, prev, locale)}
                          </td>
                          <td className="px-3 py-1.5 text-right">
                            {(b.rate * 100).toFixed(0)}%
                          </td>
                          <td className="px-3 py-1.5 text-right">
                            {b.deduction === 0 ? "—" : money(b.deduction)}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <SourceBox lines={[t.sourceTitle, ...t.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
