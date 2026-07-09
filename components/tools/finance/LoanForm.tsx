"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculateLoan,
  loanInputSchema,
  type LoanInputResolved,
  type LoanResult,
  type LoanType,
} from "@/lib/calculations/finance/loan";
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
import { TrendChart } from "@/components/ui/charts";
import { formatAxisMoney } from "@/lib/utils/format";

interface LoanFormProps {
  locale: "ko" | "en" | "vi" | "zh";
}

const won = (n: number): string => Math.round(n).toLocaleString("ko-KR");

const T = {
  ko: {
    sectionPrincipal: "원금·기간",
    sectionType: "상환 방식",
    fieldPrincipal: "대출 원금 (원)",
    fieldYears: "대출 기간 (년)",
    fieldRate: "연이율 (%)",
    fieldType: "상환 방식 선택",
    types: {
      equalPayment: "원리금균등 — 매월 같은 금액",
      equalPrincipal: "원금균등 — 초반 ↑ 후반 ↓",
      balloon: "만기일시 — 매월 이자만, 만기에 원금",
    } satisfies Record<LoanType, string>,
    calculate: "계산하기",
    reset: "초기화",
    resultHeading: "상환 계획",
    resultEmpty: "원금·이율·기간을 입력하세요.",
    error: "계산 오류",
    monthlyLabel: "월 상환액 (첫 회차)",
    monthlyUnit: "원",
    firstPayment: "첫 회차",
    lastPayment: "마지막 회차",
    totalPrincipal: "총 원금",
    totalInterest: "총 이자",
    totalPayment: "총 상환액",
    chartHeading: "잔금 추이",
    chartMonthSuffix: "개월",
    scheduleHeader: "회차별 상환표",
    scheduleSampleNote: "60회 이상은 6개월 단위 표시",
    colMonth: "회차",
    colPayment: "상환액",
    colPrincipal: "원금",
    colInterest: "이자",
    colBalance: "잔금",
    sourceTitle: "공식 · 가정",
    sourceLines: [
      "원리금균등: M = P × r(1+r)^n / ((1+r)^n − 1). 매월 같은 금액.",
      "원금균등: 매월 원금 = P/n, 이자 = 잔금 × r. 총 이자는 균등보다 약 4~5% 적음.",
      "만기일시: 매월 이자만 P × r, 만기에 원금 일시상환. 한국 신용대출·전세자금대출 보편.",
      "월이율 r = 연이율 / 12. 한국 대출 표준 (단리 환산).",
      "중도상환 수수료·인지세·DSR 한도 등 부대 비용 미반영.",
    ],
  },
  en: {
    sectionPrincipal: "Principal · Period",
    sectionType: "Repayment type",
    fieldPrincipal: "Loan principal (₩)",
    fieldYears: "Loan period (years)",
    fieldRate: "Annual rate (%)",
    fieldType: "Select repayment type",
    types: {
      equalPayment: "Equal payment — same monthly amount",
      equalPrincipal: "Equal principal — high → low monthly",
      balloon: "Balloon — interest only, principal at maturity",
    } satisfies Record<LoanType, string>,
    calculate: "Calculate",
    reset: "Reset",
    resultHeading: "Repayment Plan",
    resultEmpty: "Enter principal, rate, and period.",
    error: "Calculation failed",
    monthlyLabel: "Monthly payment (1st)",
    monthlyUnit: "₩",
    firstPayment: "1st payment",
    lastPayment: "Last payment",
    totalPrincipal: "Total principal",
    totalInterest: "Total interest",
    totalPayment: "Total payment",
    chartHeading: "Balance over time",
    chartMonthSuffix: " mo",
    scheduleHeader: "Schedule",
    scheduleSampleNote: "Long terms sampled every 6 months",
    colMonth: "Month",
    colPayment: "Payment",
    colPrincipal: "Principal",
    colInterest: "Interest",
    colBalance: "Balance",
    sourceTitle: "Formulas · assumptions",
    sourceLines: [
      "Equal payment: M = P × r(1+r)^n / ((1+r)^n − 1).",
      "Equal principal: monthly principal = P/n, interest = balance × r. ~4-5% less total interest.",
      "Balloon: monthly = P × r (interest only), balance + last month interest at maturity.",
      "Monthly rate r = annual / 12 (Korean standard simple-rate division).",
      "Prepayment fees, stamp duty, DSR limits not included.",
    ],
  },
  vi: {
    sectionPrincipal: "Số tiền gốc · thời hạn",
    sectionType: "Phương thức trả nợ",
    fieldPrincipal: "Số tiền vay gốc (원)",
    fieldYears: "Thời hạn vay (năm)",
    fieldRate: "Lãi suất hàng năm (%)",
    fieldType: "Chọn phương thức trả nợ",
    types: {
      equalPayment: "Trả góp đều gốc+lãi — số tiền cố định hàng tháng",
      equalPrincipal: "Trả đều gốc — cao đầu kỳ ↓ thấp cuối kỳ",
      balloon: "Trả cuối kỳ — chỉ trả lãi hàng tháng, trả gốc khi đáo hạn",
    } satisfies Record<LoanType, string>,
    calculate: "Tính toán",
    reset: "Đặt lại",
    resultHeading: "Kế hoạch trả nợ",
    resultEmpty: "Vui lòng nhập số tiền gốc, lãi suất và thời hạn.",
    error: "Lỗi tính toán",
    monthlyLabel: "Số tiền trả hàng tháng (kỳ đầu)",
    monthlyUnit: "원",
    firstPayment: "Kỳ đầu",
    lastPayment: "Kỳ cuối",
    totalPrincipal: "Tổng số tiền gốc",
    totalInterest: "Tổng lãi",
    totalPayment: "Tổng số tiền trả",
    chartHeading: "Số dư còn lại theo thời gian",
    chartMonthSuffix: " th",
    scheduleHeader: "Bảng trả nợ theo từng kỳ",
    scheduleSampleNote: "Từ 60 kỳ trở lên hiển thị theo đơn vị 6 tháng",
    colMonth: "Kỳ",
    colPayment: "Số tiền trả",
    colPrincipal: "Gốc",
    colInterest: "Lãi",
    colBalance: "Số dư",
    sourceTitle: "Công thức · giả định",
    sourceLines: [
      "Trả góp đều gốc+lãi: M = P × r(1+r)^n / ((1+r)^n − 1). Số tiền cố định hàng tháng.",
      "Trả đều gốc: gốc hàng tháng = P/n, lãi = số dư × r. Tổng lãi ít hơn khoảng 4-5% so với trả góp đều gốc+lãi.",
      "Trả cuối kỳ: hàng tháng chỉ trả lãi P × r, trả gốc một lần khi đáo hạn. Phổ biến với vay tín chấp và vay đặt cọc jeonse tại Hàn Quốc.",
      "Lãi suất hàng tháng r = lãi suất hàng năm / 12. Chuẩn tính lãi đơn của Hàn Quốc.",
      "Chưa bao gồm phí trả nợ trước hạn, thuế tem, giới hạn DSR và các chi phí phát sinh khác.",
    ],
  },
  zh: {
    sectionPrincipal: "本金·期限",
    sectionType: "还款方式",
    fieldPrincipal: "贷款本金 (韩元)",
    fieldYears: "贷款期限 (年)",
    fieldRate: "年利率 (%)",
    fieldType: "选择还款方式",
    types: {
      equalPayment: "等额本息 — 每月还款额相同",
      equalPrincipal: "等额本金 — 前期多 ↑ 后期少 ↓",
      balloon: "到期还本付息 — 每月只还利息，到期一次还本",
    } satisfies Record<LoanType, string>,
    calculate: "计算",
    reset: "重置",
    resultHeading: "还款计划",
    resultEmpty: "请输入本金·利率·期限。",
    error: "计算出错",
    monthlyLabel: "月还款额 (首期)",
    monthlyUnit: "韩元",
    firstPayment: "首期",
    lastPayment: "末期",
    totalPrincipal: "本金总额",
    totalInterest: "利息总额",
    totalPayment: "还款总额",
    chartHeading: "余额变化趋势",
    chartMonthSuffix: "个月",
    scheduleHeader: "分期还款表",
    scheduleSampleNote: "超过60期时按6个月为单位显示",
    colMonth: "期数",
    colPayment: "还款额",
    colPrincipal: "本金",
    colInterest: "利息",
    colBalance: "余额",
    sourceTitle: "公式 · 假设条件",
    sourceLines: [
      "等额本息：M = P × r(1+r)^n / ((1+r)^n − 1)。每月还款额相同。",
      "等额本金：每月本金 = P/n，利息 = 余额 × r。总利息比等额本息约少4~5%。",
      "到期还本付息：每月只还利息 P × r，到期一次性还本。韩国信用贷款·传贳保证金贷款常见方式。",
      "月利率 r = 年利率 ÷ 12 (韩国标准单利换算)。",
      "未反映提前还款违约金·印花税·DSR限额等附加费用。",
    ],
  },
} as const;

const LOAN_DEFAULTS: LoanInputResolved = {
  principal: 100_000_000,
  annualRatePercent: 5,
  years: 10,
  loanType: "equalPayment",
};

export function LoanForm({ locale }: LoanFormProps): React.ReactElement {
  const t = T[locale];
  // 의미있는 기본값으로 마운트 시 즉시 결과 노출 (빈 화면 제거)
  const [result, setResult] = useState<LoanResult | null>(() => {
    try {
      return calculateLoan(LOAN_DEFAULTS);
    } catch {
      return null;
    }
  });
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<LoanInputResolved>({
    resolver: zodResolver(loanInputSchema),
    defaultValues: LOAN_DEFAULTS,
  });

  const onSubmit = (values: LoanInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateLoan(values));
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
        <FieldGroup title={t.sectionPrincipal}>
          <Controller
            control={control}
            name="principal"
            render={({ field }) => (
              <Field label={t.fieldPrincipal}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands
                  decimals={0}
                  suffix={locale === "ko" ? "원" : "₩"}
                  aria-label={t.fieldPrincipal}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="years"
            render={({ field }) => (
              <Field label={t.fieldYears}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  min={1}
                  max={50}
                  suffix={locale === "ko" ? "년" : "yr"}
                  aria-label={t.fieldYears}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="annualRatePercent"
            render={({ field }) => (
              <Field label={t.fieldRate}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={2}
                  suffix="%"
                  aria-label={t.fieldRate}
                />
              </Field>
            )}
          />
        </FieldGroup>

        <FieldGroup title={t.sectionType}>
          <Field label={t.fieldType}>
            <select className="input-base" {...register("loanType")}>
              <option value="equalPayment">{t.types.equalPayment}</option>
              <option value="equalPrincipal">{t.types.equalPrincipal}</option>
              <option value="balloon">{t.types.balloon}</option>
            </select>
          </Field>
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
                { label: "Compound Interest", href: "/compound-calc" },
                { label: "Salary Take-Home", href: "/net-salary" },
                { label: "30 vs 15-year mortgage", href: "/blog/loan-30-vs-15-years" },
              ]
            : [
                { label: "복리 계산기", href: "/compound-calc" },
                { label: "연봉 실수령액", href: "/net-salary" },
                { label: "주담대 30년 vs 15년", href: "/blog/loan-30-vs-15-years" },
              ]
        }
      >
        {calcError && <ErrorBox message={calcError} />}
        {!calcError && !result && <EmptyResult message={t.resultEmpty} />}
        {result && (
          <div className="animate-fade-up space-y-5">
            <HeroResult
              label={t.monthlyLabel}
              value={won(result.firstPayment)}
              unit={t.monthlyUnit}
            />
            <dl className="grid grid-cols-2 gap-3">
              <Stat label={t.firstPayment} value={`${won(result.firstPayment)} ${t.monthlyUnit}`} />
              <Stat label={t.lastPayment} value={`${won(result.lastPayment)} ${t.monthlyUnit}`} />
              <Stat label={t.totalPrincipal} value={`${won(result.totalPrincipal)} ${t.monthlyUnit}`} />
              <Stat label={t.totalInterest} value={`${won(result.totalInterest)} ${t.monthlyUnit}`} />
              <Stat label={t.totalPayment} value={`${won(result.totalPayment)} ${t.monthlyUnit}`} />
            </dl>

            <div>
              <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                {t.chartHeading}
              </h3>
              <TrendChart
                series={[
                  {
                    name: t.colBalance,
                    color: "var(--chart-1)",
                    points: [
                      { x: 0, y: result.totalPrincipal },
                      ...result.schedule.map((row) => ({
                        x: row.month,
                        y: row.balance,
                      })),
                    ],
                    fill: true,
                  },
                ]}
                formatX={(m) => `${Math.round(m)}${t.chartMonthSuffix}`}
                formatY={(y) => formatAxisMoney(y, locale)}
                ariaLabel={t.chartHeading}
              />
            </div>

            <div>
              <div className="mb-2.5 flex items-baseline justify-between">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                  {t.scheduleHeader}
                </h3>
                {!result.fullSchedule && (
                  <span className="text-[10px] text-[color:var(--color-text-muted)]">
                    {t.scheduleSampleNote}
                  </span>
                )}
              </div>
              <div className="overflow-x-auto rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)]">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="border-b border-[color:var(--color-border-subtle)] text-[color:var(--color-text-tertiary)]">
                      <th className="px-3 py-2 text-left font-medium">{t.colMonth}</th>
                      <th className="px-3 py-2 text-right font-medium">{t.colPayment}</th>
                      <th className="px-3 py-2 text-right font-medium">{t.colPrincipal}</th>
                      <th className="px-3 py-2 text-right font-medium">{t.colInterest}</th>
                      <th className="px-3 py-2 text-right font-medium">{t.colBalance}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.schedule.map((row) => (
                      <tr
                        key={row.month}
                        className="border-b border-[color:var(--color-border-subtle)]/50 last:border-0 tabular-nums text-[color:var(--color-text-secondary)]"
                      >
                        <td className="px-3 py-1.5">{row.month}</td>
                        <td className="px-3 py-1.5 text-right text-[color:var(--color-text-primary)]">
                          {won(row.payment)}
                        </td>
                        <td className="px-3 py-1.5 text-right">{won(row.principal)}</td>
                        <td className="px-3 py-1.5 text-right">{won(row.interest)}</td>
                        <td className="px-3 py-1.5 text-right">{won(row.balance)}</td>
                      </tr>
                    ))}
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
