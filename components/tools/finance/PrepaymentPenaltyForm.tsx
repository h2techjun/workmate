"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculatePrepaymentPenalty,
  prepaymentPenaltyInputSchema,
  type PrepaymentPenaltyInputResolved,
  type PrepaymentPenaltyResult,
} from "@/lib/calculations/finance/prepaymentPenalty";
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

interface PrepaymentPenaltyFormProps {
  locale: "ko" | "en" | "vi" | "zh";
}

const won = (n: number): string => Math.round(n).toLocaleString("ko-KR");
const pct = (n: number): string => n.toFixed(4);

const T = {
  ko: {
    sectionLoan: "대출 정보",
    fieldPrincipal: "중도상환 원금 (원)",
    fieldRate: "수수료율 (%)",
    fieldElapsed: "경과 기간 (개월)",
    fieldExemption: "면제기준기간 (년)",
    calculate: "계산하기",
    reset: "초기화",
    resultHeading: "중도상환수수료 결과",
    resultEmpty: "중도상환원금·수수료율·경과기간을 입력하세요.",
    error: "계산 오류",
    penaltyLabel: "중도상환수수료",
    penaltyUnit: "원",
    exempt: "면제",
    exemptBadge: "✅ 3년 경과 — 수수료 면제",
    remainingDays: "잔존일수",
    elapsedDays: "경과일수",
    exemptionDays: "면제기준일수",
    effectiveRate: "실효 수수료율",
    sourceTitle: "공식 · 가정",
    sourceLines: [
      "중도상환수수료 = 중도상환원금 × 수수료율 × (잔존일수 / 면제기준기간일수).",
      "잔존일수 = max(0, 면제기준기간일수 − 경과일수). 0 이하면 면제.",
      "면제기준기간일수 = 면제기준기간(년) × 365.",
      "경과일수 = 경과개월 × 30.4 (단순화: 1개월 = 30.4일).",
      "은행·상품·실행시점별 수수료율·면제기간·계산방식 상이. 반드시 해당 은행 약관 확인.",
    ],
  },
  en: {
    sectionLoan: "Loan information",
    fieldPrincipal: "Prepayment principal (₩)",
    fieldRate: "Penalty rate (%)",
    fieldElapsed: "Elapsed period (months)",
    fieldExemption: "Exemption period (years)",
    calculate: "Calculate",
    reset: "Reset",
    resultHeading: "Prepayment Penalty Result",
    resultEmpty: "Enter principal, rate, and elapsed months.",
    error: "Calculation failed",
    penaltyLabel: "Prepayment penalty",
    penaltyUnit: "₩",
    exempt: "Exempt",
    exemptBadge: "✅ Over 3 years — penalty waived",
    remainingDays: "Remaining days",
    elapsedDays: "Elapsed days",
    exemptionDays: "Exemption period (days)",
    effectiveRate: "Effective rate",
    sourceTitle: "Formula · assumptions",
    sourceLines: [
      "Penalty = principal × rate × (remaining days / exemption period days).",
      "Remaining days = max(0, exemption days − elapsed days). 0 = exempt.",
      "Exemption period days = exemption years × 365.",
      "Elapsed days = elapsed months × 30.4 (simplified: 1 month = 30.4 days).",
      "Rates and exemption periods vary by bank, product, and origination date. Always verify with your bank.",
    ],
  },
  vi: {
    sectionLoan: "Thông tin khoản vay",
    fieldPrincipal: "Số tiền gốc trả trước hạn (₩)",
    fieldRate: "Tỷ lệ phí (%)",
    fieldElapsed: "Thời gian đã trôi qua (tháng)",
    fieldExemption: "Kỳ hạn miễn phí (năm)",
    calculate: "Tính toán",
    reset: "Đặt lại",
    resultHeading: "Kết quả phí trả nợ trước hạn",
    resultEmpty: "Nhập số tiền gốc, tỷ lệ phí và số tháng đã trôi qua.",
    error: "Tính toán thất bại",
    penaltyLabel: "Phí trả nợ trước hạn",
    penaltyUnit: "₩",
    exempt: "Miễn phí",
    exemptBadge: "✅ Đã qua 3 năm — được miễn phí",
    remainingDays: "Số ngày còn lại",
    elapsedDays: "Số ngày đã trôi qua",
    exemptionDays: "Kỳ hạn miễn phí (ngày)",
    effectiveRate: "Tỷ lệ phí thực tế",
    sourceTitle: "Công thức · giả định",
    sourceLines: [
      "Phí trả nợ trước hạn = số tiền gốc × tỷ lệ phí × (số ngày còn lại / số ngày của kỳ hạn miễn phí).",
      "Số ngày còn lại = max(0, số ngày kỳ hạn miễn phí − số ngày đã trôi qua). 0 = được miễn phí.",
      "Số ngày của kỳ hạn miễn phí = số năm miễn phí × 365.",
      "Số ngày đã trôi qua = số tháng đã trôi qua × 30,4 (đơn giản hóa: 1 tháng = 30,4 ngày).",
      "Tỷ lệ phí và kỳ hạn miễn phí khác nhau tùy ngân hàng, sản phẩm và ngày giải ngân. Luôn xác nhận với ngân hàng của bạn.",
    ],
  },
  zh: {
    sectionLoan: "贷款信息",
    fieldPrincipal: "提前还款本金 (韩元)",
    fieldRate: "违约金费率 (%)",
    fieldElapsed: "已过期间 (个月)",
    fieldExemption: "免除标准期间 (年)",
    calculate: "计算",
    reset: "重置",
    resultHeading: "提前还款违约金结果",
    resultEmpty: "请输入提前还款本金·费率·已过期间。",
    error: "计算出错",
    penaltyLabel: "提前还款违约金",
    penaltyUnit: "韩元",
    exempt: "免除",
    exemptBadge: "✅ 已满3年 — 免除违约金",
    remainingDays: "剩余天数",
    elapsedDays: "已过天数",
    exemptionDays: "免除标准天数",
    effectiveRate: "实际费率",
    sourceTitle: "公式 · 假设条件",
    sourceLines: [
      "提前还款违约金 = 提前还款本金 × 费率 × (剩余天数 / 免除标准期间天数)。",
      "剩余天数 = max(0, 免除标准期间天数 − 已过天数)。0以下即免除。",
      "免除标准期间天数 = 免除标准期间(年) × 365。",
      "已过天数 = 已过月数 × 30.4 (简化换算：1个月 = 30.4天)。",
      "费率·免除期间·计算方式因银行·产品·放款时点而异，请务必确认相应银行条款。",
    ],
  },
} as const;

const DEFAULTS: PrepaymentPenaltyInputResolved = {
  principal: 100_000_000,
  penaltyRatePercent: 1.2,
  elapsedMonths: 12,
  exemptionYears: 3,
};

export function PrepaymentPenaltyForm({
  locale,
}: PrepaymentPenaltyFormProps): React.ReactElement {
  const t = T[locale];

  // 마운트 시 즉시 결과 노출 (LoanForm 패턴)
  const [result, setResult] = useState<PrepaymentPenaltyResult | null>(() => {
    try {
      return calculatePrepaymentPenalty(DEFAULTS);
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
  } = useForm<PrepaymentPenaltyInputResolved>({
    resolver: zodResolver(prepaymentPenaltyInputSchema),
    defaultValues: DEFAULTS,
  });

  const onSubmit = (values: PrepaymentPenaltyInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculatePrepaymentPenalty(values));
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
        <FieldGroup title={t.sectionLoan}>
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
            name="penaltyRatePercent"
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
          <Controller
            control={control}
            name="elapsedMonths"
            render={({ field }) => (
              <Field label={t.fieldElapsed}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  min={0}
                  max={600}
                  suffix={locale === "ko" ? "개월" : "mo"}
                  aria-label={t.fieldElapsed}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="exemptionYears"
            render={({ field }) => (
              <Field label={t.fieldExemption}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  min={1}
                  max={10}
                  suffix={locale === "ko" ? "년" : "yr"}
                  aria-label={t.fieldExemption}
                />
              </Field>
            )}
          />
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
                { label: "Loan Calculator", href: "/loan-calc" },
                { label: "Compound Interest", href: "/compound-calc" },
                { label: "Salary Take-Home", href: "/net-salary" },
              ]
            : [
                { label: "대출 이자 계산기", href: "/loan-calc" },
                { label: "복리 계산기", href: "/compound-calc" },
                { label: "연봉 실수령액", href: "/net-salary" },
              ]
        }
      >
        {calcError && <ErrorBox message={calcError} />}
        {!calcError && !result && <EmptyResult message={t.resultEmpty} />}
        {result && (
          <div className="animate-fade-up space-y-5">
            {result.isExempt ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-4 text-center text-emerald-300 font-semibold text-lg">
                {t.exemptBadge}
              </div>
            ) : (
              <HeroResult
                label={t.penaltyLabel}
                value={won(result.penaltyAmount)}
                unit={t.penaltyUnit}
              />
            )}

            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={t.remainingDays}
                value={`${Math.round(result.remainingDays).toLocaleString("ko-KR")}일`}
              />
              <Stat
                label={t.elapsedDays}
                value={`${Math.round(result.elapsedDays).toLocaleString("ko-KR")}일`}
              />
              <Stat
                label={t.exemptionDays}
                value={`${result.exemptionDays.toLocaleString("ko-KR")}일`}
              />
              <Stat
                label={t.effectiveRate}
                value={`${pct(result.effectiveRatePercent)}%`}
              />
            </dl>

            <SourceBox lines={[t.sourceTitle, ...t.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
