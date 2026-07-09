"use client";

import { useState, type ReactNode } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculateCompound,
  compoundInputSchema,
  type CompoundInputResolved,
  type CompoundResult,
  calculateRecurring,
  recurringInputSchema,
  type RecurringInputResolved,
  type RecurringResult,
} from "@/lib/calculations/finance/compound";
import {
  formatAxisMoney,
  formatKoreanMoney,
  formatNumber,
} from "@/lib/utils/format";
import { TrendChart } from "@/components/ui/charts";
import {
  ActionRow,
  CalcLayout,
  EmptyResult,
  ErrorBox,
  Field,
  FieldGroup,
  FormShell,
  ResultShell,
  SourceBox,
  Stat,
} from "@/components/ui/calc-form";
import { cn } from "@/lib/utils/cn";
import { NumberField } from "@/components/ui/NumberField";

interface CompoundFormProps {
  locale: "ko" | "en" | "vi" | "zh";
}

type Mode = "basic" | "recurring";

/** 원 단위 정수 콤마 */
const won = (n: number): string => Math.round(n).toLocaleString("ko-KR");

const TEXT = {
  ko: {
    tabBasic: "기본",
    tabRecurring: "적립식",
    // basic
    basicTitle: "복리 계산기",
    fieldPrincipal: "초기 금액 (₩)",
    fieldPeriods: "복리 횟수 (기간)",
    fieldRate: "수익률 (%)",
    calculate: "계산하기",
    reset: "초기화",
    resultEmpty: "금액·복리 횟수·수익률을 입력하고 계산하세요.",
    error: "계산 중 오류가 발생했습니다.",
    totalProfit: "총 수익",
    finalAmount: "최종 금액",
    colNo: "#",
    colProfit: "수익 (₩)",
    colTotal: "총액 (₩)",
    colRate: "수익률",
    truncated: "* 표는 600회차까지만 표시됩니다 (최종 금액은 전체 반영).",
    basicSource: [
      "최종 금액 = 초기 금액 × (1 + 수익률)^횟수",
      "수익률은 한 번 복리될 때 적용. 월복리 연 5%면 회당 약 0.42% × 120회(10년).",
      "이자소득세(15.4%)·인플레이션 미반영 (세전 명목).",
    ],
    // recurring
    recurringTitle: "적립식 복리 계산기",
    fieldStart: "시작 금액 (₩)",
    fieldMonthly: "매월 적립 금액 (₩)",
    fieldMonthlyHint: "* 두 번째 달부터 원금에 가산됩니다.",
    fieldPeriod: "투자 기간",
    fieldInterest: "이자율",
    unitYear: "년",
    unitMonth: "개월",
    rateYear: "년",
    rateMonth: "월",
    fieldCompounding: "복리 방식",
    compAnnual: "연복리",
    compMonthly: "월복리",
    totalInvested: "총 투자금",
    chartHeading: "자산 성장 곡선",
    chartTotal: "총액",
    chartInvested: "투입 원금",
    chartMonthSuffix: "개월",
    viewYear: "년",
    viewMonth: "월",
    colPeriodYear: "년",
    colPeriodMonth: "개월",
    colPrincipal: "원금 (₩)",
    colInterest: "수익 (₩)",
    colFinal: "최종 금액 (₩)",
    recurringEmpty: "시작 금액·매월 적립·기간·이자율을 입력하고 계산하세요.",
    recurringSource: [
      "연복리: 매월 초 적립금은 그 해 남은 개월만큼 단리 이자를 받고 매년 말 복리 자본화 (한국 적금 방식).",
      "월복리: 매월 잔액에 (연이율 ÷ 12)을 복리 적용.",
      "총 투자금 = 시작 금액 + 매월 적립 × (개월 − 1).",
      "이자소득세(15.4%)·인플레이션 미반영 (세전 명목).",
    ],
  },
  en: {
    tabBasic: "Lump sum",
    tabRecurring: "Recurring",
    basicTitle: "Compound Interest",
    fieldPrincipal: "Initial amount (₩)",
    fieldPeriods: "Compounding periods",
    fieldRate: "Rate per period (%)",
    calculate: "Calculate",
    reset: "Reset",
    resultEmpty: "Enter amount, periods, and rate, then calculate.",
    error: "Calculation failed.",
    totalProfit: "Total profit",
    finalAmount: "Final amount",
    colNo: "#",
    colProfit: "Profit (₩)",
    colTotal: "Balance (₩)",
    colRate: "Return",
    truncated: "* Table shows the first 600 periods (final amount reflects all).",
    basicSource: [
      "Final = initial × (1 + rate)^periods",
      "Rate applies each time it compounds. Annual 5% monthly ≈ 0.42% × 120 periods (10y).",
      "Pre-tax nominal. Income tax (15.4%) and inflation excluded.",
    ],
    recurringTitle: "Recurring Compound Interest",
    fieldStart: "Starting amount (₩)",
    fieldMonthly: "Monthly contribution (₩)",
    fieldMonthlyHint: "* Added to principal from the second month.",
    fieldPeriod: "Investment period",
    fieldInterest: "Interest rate",
    unitYear: "years",
    unitMonth: "months",
    rateYear: "/yr",
    rateMonth: "/mo",
    fieldCompounding: "Compounding",
    compAnnual: "Annual",
    compMonthly: "Monthly",
    totalInvested: "Total invested",
    chartHeading: "Growth curve",
    chartTotal: "Balance",
    chartInvested: "Invested",
    chartMonthSuffix: " mo",
    viewYear: "Yearly",
    viewMonth: "Monthly",
    colPeriodYear: "Year",
    colPeriodMonth: "Month",
    colPrincipal: "Principal (₩)",
    colInterest: "Profit (₩)",
    colFinal: "Balance (₩)",
    recurringEmpty: "Enter the amounts, period, and rate, then calculate.",
    recurringSource: [
      "Annual: each month's deposit earns simple interest for the rest of the year, then compounds at year-end (Korean recurring-deposit method).",
      "Monthly: the balance compounds at (annual rate ÷ 12) every month.",
      "Total invested = starting amount + monthly × (months − 1).",
      "Pre-tax nominal. Income tax (15.4%) and inflation excluded.",
    ],
  },
  vi: {
    tabBasic: "Một lần",
    tabRecurring: "Tích lũy",
    basicTitle: "Máy tính lãi kép",
    fieldPrincipal: "Số tiền ban đầu (₩)",
    fieldPeriods: "Số kỳ lãi kép",
    fieldRate: "Lãi suất mỗi kỳ (%)",
    calculate: "Tính toán",
    reset: "Đặt lại",
    resultEmpty: "Nhập số tiền, số kỳ và lãi suất rồi tính toán.",
    error: "Đã xảy ra lỗi khi tính toán.",
    totalProfit: "Tổng lợi nhuận",
    finalAmount: "Số tiền cuối cùng",
    colNo: "#",
    colProfit: "Lợi nhuận (₩)",
    colTotal: "Tổng số dư (₩)",
    colRate: "Tỷ suất sinh lời",
    truncated: "* Bảng chỉ hiển thị tối đa 600 kỳ (số tiền cuối cùng đã tính đầy đủ).",
    basicSource: [
      "Số tiền cuối cùng = Số tiền ban đầu × (1 + lãi suất)^số kỳ",
      "Lãi suất áp dụng mỗi lần lãi kép. Lãi kép hàng tháng ở mức 5%/năm ≈ 0,42% mỗi kỳ × 120 kỳ (10 năm).",
      "Chưa bao gồm thuế thu nhập từ lãi (15,4%) và lạm phát (số danh nghĩa trước thuế).",
    ],
    recurringTitle: "Máy tính lãi kép tích lũy",
    fieldStart: "Số tiền khởi đầu (₩)",
    fieldMonthly: "Số tiền tích lũy hàng tháng (₩)",
    fieldMonthlyHint: "* Được cộng vào gốc kể từ tháng thứ hai.",
    fieldPeriod: "Thời gian đầu tư",
    fieldInterest: "Lãi suất",
    unitYear: "năm",
    unitMonth: "tháng",
    rateYear: "/năm",
    rateMonth: "/tháng",
    fieldCompounding: "Phương thức lãi kép",
    compAnnual: "Lãi kép theo năm",
    compMonthly: "Lãi kép theo tháng",
    totalInvested: "Tổng số tiền đầu tư",
    chartHeading: "Đường tăng trưởng tài sản",
    chartTotal: "Tổng số dư",
    chartInvested: "Vốn đã đầu tư",
    chartMonthSuffix: " th",
    viewYear: "Theo năm",
    viewMonth: "Theo tháng",
    colPeriodYear: "Năm",
    colPeriodMonth: "Tháng",
    colPrincipal: "Gốc (₩)",
    colInterest: "Lợi nhuận (₩)",
    colFinal: "Số tiền cuối cùng (₩)",
    recurringEmpty: "Nhập số tiền khởi đầu, tích lũy hàng tháng, thời gian và lãi suất rồi tính toán.",
    recurringSource: [
      "Lãi kép theo năm: mỗi khoản tích lũy đầu tháng được tính lãi đơn cho số tháng còn lại trong năm, sau đó vốn hóa lãi kép vào cuối mỗi năm (phương thức tiền gửi tích lũy của Hàn Quốc).",
      "Lãi kép theo tháng: số dư hàng tháng được áp dụng lãi kép theo (lãi suất năm ÷ 12).",
      "Tổng số tiền đầu tư = Số tiền khởi đầu + Tích lũy hàng tháng × (số tháng − 1).",
      "Chưa bao gồm thuế thu nhập từ lãi (15,4%) và lạm phát (số danh nghĩa trước thuế).",
    ],
  },
  zh: {
    tabBasic: "基本",
    tabRecurring: "定投",
    // basic
    basicTitle: "复利计算器",
    fieldPrincipal: "初始金额 (韩元)",
    fieldPeriods: "复利次数 (期数)",
    fieldRate: "每期收益率 (%)",
    calculate: "计算",
    reset: "重置",
    resultEmpty: "请输入金额·复利次数·收益率后计算。",
    error: "计算过程中发生错误。",
    totalProfit: "总收益",
    finalAmount: "最终金额",
    colNo: "#",
    colProfit: "收益 (韩元)",
    colTotal: "总额 (韩元)",
    colRate: "收益率",
    truncated: "* 表格仅显示前600期 (最终金额已计入全部期数)。",
    basicSource: [
      "最终金额 = 初始金额 × (1 + 收益率)^期数",
      "收益率按每次复利时适用。月复利年化5%约等于每期0.42% × 120期(10年)。",
      "未反映利息所得税(15.4%)及通货膨胀 (税前名义值)。",
    ],
    // recurring
    recurringTitle: "定投复利计算器",
    fieldStart: "起始金额 (韩元)",
    fieldMonthly: "每月定投金额 (韩元)",
    fieldMonthlyHint: "* 从第二个月起计入本金。",
    fieldPeriod: "投资期限",
    fieldInterest: "利率",
    unitYear: "年",
    unitMonth: "个月",
    rateYear: "年",
    rateMonth: "月",
    fieldCompounding: "复利方式",
    compAnnual: "年复利",
    compMonthly: "月复利",
    totalInvested: "总投入金额",
    chartHeading: "资产增长曲线",
    chartTotal: "总额",
    chartInvested: "投入本金",
    chartMonthSuffix: "个月",
    viewYear: "按年",
    viewMonth: "按月",
    colPeriodYear: "年",
    colPeriodMonth: "月",
    colPrincipal: "本金 (韩元)",
    colInterest: "收益 (韩元)",
    colFinal: "最终金额 (韩元)",
    recurringEmpty: "请输入起始金额·每月定投·期限·利率后计算。",
    recurringSource: [
      "年复利：每月初存入的定投款按当年剩余月份计单利，于每年末一次性资本化复利 (韩国定期存款惯例)。",
      "月复利：每月余额按(年利率 ÷ 12)复利计算。",
      "总投入金额 = 起始金额 + 每月定投 × (月数 − 1)。",
      "未反映利息所得税(15.4%)及通货膨胀 (税前名义值)。",
    ],
  },
} as const;

/* ---------------------------------------------------------------- helpers */

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: ReadonlyArray<{ value: T; label: string }>;
  onChange: (v: T) => void;
}): React.ReactElement {
  return (
    <div className="inline-flex rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={cn(
            "rounded-md px-3.5 py-1 text-sm transition-colors",
            value === o.value
              ? "bg-indigo-500/20 font-semibold text-indigo-300"
              : "text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-secondary)]",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function DataTable({
  head,
  children,
}: {
  head: ReadonlyArray<string>;
  children: ReactNode;
}): React.ReactElement {
  return (
    <div className="overflow-hidden rounded-xl border border-[color:var(--color-border-subtle)]">
      <div className="max-h-[420px] overflow-y-auto">
        <table className="w-full text-sm tabular-nums">
          <thead className="sticky top-0 z-10 bg-[color:var(--color-bg-elevated)] text-xs text-[color:var(--color-text-tertiary)]">
            <tr>
              {head.map((h, i) => (
                <th
                  key={i}
                  className={cn(
                    "px-3 py-2.5 font-semibold",
                    i === 0 ? "text-left" : "text-right",
                  )}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>{children}</tbody>
        </table>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- basic tab */

const COMPOUND_DEFAULTS: CompoundInputResolved = {
  principal: 1_000_000,
  ratePerPeriodPercent: 5,
  periods: 20,
  periodicContribution: 0,
};

function BasicTab({ locale }: { locale: "ko" | "en" | "vi" | "zh" }): React.ReactElement {
  const T = TEXT[locale];
  // 의미있는 기본값으로 마운트 시 즉시 결과 노출 (빈 화면 제거)
  const [result, setResult] = useState<CompoundResult | null>(() => {
    try {
      return calculateCompound(COMPOUND_DEFAULTS);
    } catch {
      return null;
    }
  });
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<CompoundInputResolved>({
    resolver: zodResolver(compoundInputSchema),
    defaultValues: COMPOUND_DEFAULTS,
  });

  const onSubmit = (values: CompoundInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateCompound(values));
    } catch {
      setResult(null);
      setCalcError(T.error);
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
        <FieldGroup title={T.basicTitle}>
          <Controller
            control={control}
            name="principal"
            render={({ field }) => (
              <Field label={T.fieldPrincipal}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands
                  decimals={0}
                  suffix={locale === "ko" ? "원" : "₩"}
                  aria-label={T.fieldPrincipal}
                />
                {locale === "ko" && field.value > 0 && (
                  <p className="mt-1.5 text-xs font-medium text-[color:var(--color-accent)]">
                    = {formatKoreanMoney(field.value)}
                  </p>
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="periods"
            render={({ field }) => (
              <Field label={T.fieldPeriods}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  min={1}
                  aria-label={T.fieldPeriods}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="ratePerPeriodPercent"
            render={({ field }) => (
              <Field label={T.fieldRate}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={2}
                  suffix="%"
                  aria-label={T.fieldRate}
                />
              </Field>
            )}
          />
        </FieldGroup>

        <ActionRow
          primary={
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {T.calculate}
            </button>
          }
          secondary={
            <button type="button" onClick={onReset} className="btn-ghost sm:w-auto">
              {T.reset}
            </button>
          }
        />
      </FormShell>

      <ResultShell
        heading={T.basicTitle}
        locale={locale}
        relatedLinks={
          locale !== "ko"
            ? [
                { label: "Loan Calculator", href: "/loan-calc" },
                { label: "Salary Take-Home", href: "/net-salary" },
                { label: "30 vs 15-year mortgage", href: "/blog/loan-30-vs-15-years" },
              ]
            : [
                { label: "대출 계산기", href: "/loan-calc" },
                { label: "연봉 실수령액", href: "/net-salary" },
                { label: "주담대 30년 vs 15년", href: "/blog/loan-30-vs-15-years" },
              ]
        }
      >
        {calcError && <ErrorBox message={calcError} />}
        {!calcError && !result && <EmptyResult message={T.resultEmpty} />}
        {result && (
          <div className="animate-fade-up space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                  {T.totalProfit}
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-300 md:text-3xl">
                  ₩{won(result.totalInterest)}
                </p>
              </div>
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                  {T.finalAmount}
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-indigo-300 md:text-3xl">
                  ₩{won(result.finalAmount)}
                </p>
              </div>
            </div>
            {locale === "ko" && (
              <p className="-mt-2 text-sm font-medium text-[color:var(--color-text-secondary)]">
                최종 {formatKoreanMoney(result.finalAmount)} · 수익률{" "}
                {formatNumber(result.totalReturnPercent, 2)}%
              </p>
            )}

            <div>
              <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                {T.chartHeading}
              </h3>
              <TrendChart
                series={[
                  {
                    name: T.chartInvested,
                    color: "var(--chart-2)",
                    points: [
                      { x: 0, y: result.principal },
                      ...result.schedule.map((r) => ({
                        x: r.period,
                        // 투입 원금 = 총액 ÷ (1 + 누적수익률) — 결과값에서 역산
                        y: r.total / (1 + r.cumulativeReturnPercent / 100),
                      })),
                    ],
                  },
                  {
                    name: T.chartTotal,
                    color: "var(--chart-1)",
                    points: [
                      { x: 0, y: result.principal },
                      ...result.schedule.map((r) => ({ x: r.period, y: r.total })),
                    ],
                    fill: true,
                  },
                ]}
                formatX={(x) => String(Math.round(x))}
                formatY={(y) => formatAxisMoney(y, locale)}
                ariaLabel={T.chartHeading}
              />
            </div>

            <DataTable head={[T.colNo, T.colProfit, T.colTotal, T.colRate]}>
              {result.schedule.map((r) => (
                <tr
                  key={r.period}
                  className="border-t border-[color:var(--color-border-subtle)]"
                >
                  <td className="px-3 py-1.5 text-left font-medium text-[color:var(--color-text-tertiary)]">
                    {r.period}
                  </td>
                  <td className="px-3 py-1.5 text-right text-emerald-300">
                    +{won(r.interest)}
                  </td>
                  <td className="px-3 py-1.5 text-right text-[color:var(--color-text-secondary)]">
                    {won(r.total)}
                  </td>
                  <td className="px-3 py-1.5 text-right text-[color:var(--color-text-tertiary)]">
                    {formatNumber(r.cumulativeReturnPercent, 2)}%
                  </td>
                </tr>
              ))}
            </DataTable>
            {result.truncated && (
              <p className="text-xs text-[color:var(--color-text-muted)]">
                {T.truncated}
              </p>
            )}

            <SourceBox lines={[...T.basicSource]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}

/* --------------------------------------------------------- recurring tab */

const RECURRING_DEFAULTS: RecurringInputResolved = {
  startAmount: 100_000,
  monthlyContribution: 100_000,
  periodValue: 3,
  periodUnit: "year",
  ratePercent: 5,
  rateUnit: "year",
  compounding: "annual",
};

function RecurringTab({ locale }: { locale: "ko" | "en" | "vi" | "zh" }): React.ReactElement {
  const T = TEXT[locale];
  // 의미있는 기본값으로 마운트 시 즉시 결과 노출 (빈 화면 제거)
  const [result, setResult] = useState<RecurringResult | null>(() => {
    try {
      return calculateRecurring(RECURRING_DEFAULTS);
    } catch {
      return null;
    }
  });
  const [calcError, setCalcError] = useState<string | null>(null);
  const [view, setView] = useState<"year" | "month">("year");

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<RecurringInputResolved>({
    resolver: zodResolver(recurringInputSchema),
    defaultValues: RECURRING_DEFAULTS,
  });

  const onSubmit = (values: RecurringInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateRecurring(values));
    } catch {
      setResult(null);
      setCalcError(T.error);
    }
  };
  const onReset = (): void => {
    reset();
    setResult(null);
    setCalcError(null);
  };

  const rows = result ? (view === "year" ? result.yearly : result.monthly) : [];
  const periodHead = view === "year" ? T.colPeriodYear : T.colPeriodMonth;

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={T.recurringTitle}>
          <Controller
            control={control}
            name="startAmount"
            render={({ field }) => (
              <Field label={T.fieldStart}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands
                  decimals={0}
                  suffix={locale === "ko" ? "원" : "₩"}
                  aria-label={T.fieldStart}
                />
                {locale === "ko" && field.value > 0 && (
                  <p className="mt-1.5 text-xs font-medium text-[color:var(--color-accent)]">
                    = {formatKoreanMoney(field.value)}
                  </p>
                )}
              </Field>
            )}
          />
          <Controller
            control={control}
            name="monthlyContribution"
            render={({ field }) => (
              <Field label={T.fieldMonthly} hint={T.fieldMonthlyHint}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands
                  decimals={0}
                  suffix={locale === "ko" ? "원" : "₩"}
                  aria-label={T.fieldMonthly}
                />
                {locale === "ko" && field.value > 0 && (
                  <p className="mt-1.5 text-xs font-medium text-[color:var(--color-accent)]">
                    = {formatKoreanMoney(field.value)}
                  </p>
                )}
              </Field>
            )}
          />

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-[color:var(--color-text-secondary)]">
                {T.fieldPeriod}
              </span>
              <Controller
                control={control}
                name="periodUnit"
                render={({ field }) => (
                  <Segmented
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: "year", label: T.unitYear },
                      { value: "month", label: T.unitMonth },
                    ]}
                  />
                )}
              />
            </div>
            <Controller
              control={control}
              name="periodValue"
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  min={1}
                  aria-label={T.fieldPeriod}
                />
              )}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <span className="text-sm font-medium text-[color:var(--color-text-secondary)]">
                {T.fieldInterest}
              </span>
              <Controller
                control={control}
                name="rateUnit"
                render={({ field }) => (
                  <Segmented
                    value={field.value}
                    onChange={field.onChange}
                    options={[
                      { value: "year", label: T.rateYear },
                      { value: "month", label: T.rateMonth },
                    ]}
                  />
                )}
              />
            </div>
            <Controller
              control={control}
              name="ratePercent"
              render={({ field }) => (
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={2}
                  suffix="%"
                  aria-label={T.fieldInterest}
                />
              )}
            />
          </div>

          <Field label={T.fieldCompounding}>
            <select className="input-base" {...register("compounding")}>
              <option value="annual">{T.compAnnual}</option>
              <option value="monthly">{T.compMonthly}</option>
            </select>
          </Field>
        </FieldGroup>

        <ActionRow
          primary={
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {T.calculate}
            </button>
          }
          secondary={
            <button type="button" onClick={onReset} className="btn-ghost sm:w-auto">
              {T.reset}
            </button>
          }
        />
      </FormShell>

      <ResultShell
        heading={T.recurringTitle}
        locale={locale}
        relatedLinks={
          locale !== "ko"
            ? [
                { label: "Loan Calculator", href: "/loan-calc" },
                { label: "Salary Take-Home", href: "/net-salary" },
                { label: "30 vs 15-year mortgage", href: "/blog/loan-30-vs-15-years" },
              ]
            : [
                { label: "대출 계산기", href: "/loan-calc" },
                { label: "연봉 실수령액", href: "/net-salary" },
                { label: "주담대 30년 vs 15년", href: "/blog/loan-30-vs-15-years" },
              ]
        }
      >
        {calcError && <ErrorBox message={calcError} />}
        {!calcError && !result && <EmptyResult message={T.recurringEmpty} />}
        {result && (
          <div className="animate-fade-up space-y-5">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                  {T.totalProfit}
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-emerald-300 md:text-3xl">
                  ₩{won(result.totalInterest)}
                </p>
              </div>
              <div className="rounded-xl border border-indigo-500/20 bg-indigo-500/5 p-4">
                <p className="text-[11px] font-medium uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                  {T.finalAmount}
                </p>
                <p className="mt-1 text-2xl font-bold tabular-nums text-indigo-300 md:text-3xl">
                  ₩{won(result.finalAmount)}
                </p>
              </div>
            </div>
            <Stat
              label={T.totalInvested}
              value={`₩${won(result.totalInvested)}`}
              full
            />

            <div>
              <h3 className="mb-2.5 text-xs font-semibold uppercase tracking-wider text-[color:var(--color-text-tertiary)]">
                {T.chartHeading}
              </h3>
              <TrendChart
                series={[
                  {
                    name: T.chartInvested,
                    color: "var(--chart-2)",
                    points: [
                      { x: 0, y: 0 },
                      ...result.monthly.map((r) => ({
                        x: r.label,
                        y: r.principal,
                      })),
                    ],
                  },
                  {
                    name: T.chartTotal,
                    color: "var(--chart-1)",
                    points: [
                      { x: 0, y: 0 },
                      ...result.monthly.map((r) => ({ x: r.label, y: r.total })),
                    ],
                    fill: true,
                  },
                ]}
                formatX={(m) => `${Math.round(m)}${T.chartMonthSuffix}`}
                formatY={(y) => formatAxisMoney(y, locale)}
                ariaLabel={T.chartHeading}
              />
            </div>

            <div className="flex items-center justify-end">
              <Segmented
                value={view}
                onChange={setView}
                options={[
                  { value: "year", label: T.viewYear },
                  { value: "month", label: T.viewMonth },
                ]}
              />
            </div>

            <DataTable head={[periodHead, T.colPrincipal, T.colInterest, T.colFinal]}>
              {rows.map((r) => (
                <tr
                  key={r.label}
                  className="border-t border-[color:var(--color-border-subtle)]"
                >
                  <td className="px-3 py-1.5 text-left font-medium text-[color:var(--color-text-tertiary)]">
                    {r.label}
                  </td>
                  <td className="px-3 py-1.5 text-right text-[color:var(--color-text-secondary)]">
                    {won(r.principal)}
                  </td>
                  <td className="px-3 py-1.5 text-right text-emerald-300">
                    +{won(r.interest)}
                  </td>
                  <td className="px-3 py-1.5 text-right text-indigo-200">
                    {won(r.total)}
                  </td>
                </tr>
              ))}
            </DataTable>

            <SourceBox lines={[...T.recurringSource]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}

/* ----------------------------------------------------------------- parent */

export function CompoundForm({ locale }: CompoundFormProps): React.ReactElement {
  const T = TEXT[locale];
  const [mode, setMode] = useState<Mode>("basic");

  return (
    <div className="space-y-6">
      <div
        role="tablist"
        className="grid grid-cols-2 border-b border-[color:var(--color-border-subtle)]"
      >
        {(
          [
            ["basic", T.tabBasic],
            ["recurring", T.tabRecurring],
          ] as const
        ).map(([value, label]) => (
          <button
            key={value}
            role="tab"
            aria-selected={mode === value}
            type="button"
            onClick={() => setMode(value)}
            className={cn(
              "-mb-px border-b-2 px-4 py-3 text-sm font-semibold transition-colors md:text-base",
              mode === value
                ? "border-[color:var(--color-accent)] text-[color:var(--color-accent)]"
                : "border-transparent text-[color:var(--color-text-tertiary)] hover:text-[color:var(--color-text-secondary)]",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {mode === "basic" ? (
        <BasicTab locale={locale} />
      ) : (
        <RecurringTab locale={locale} />
      )}
    </div>
  );
}
