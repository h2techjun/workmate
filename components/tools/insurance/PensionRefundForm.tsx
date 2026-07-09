"use client";

import { useState } from "react";
import { useForm, Controller, type Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { NumberField } from "@/components/ui/NumberField";
import {
  calcPensionRefund,
  pensionRefundInputSchema,
  type PensionRefundInputResolved,
  type PensionRefundResult,
} from "@/lib/calculations/insurance/pensionRefund";
import { formatKrw, formatKoreanMoney } from "@/lib/utils/format";
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

interface PensionRefundFormProps {
  locale: "ko" | "en" | "zh" | "vi";
}

const TEXT = {
  ko: {
    sectionInput: "납부 내역",
    fieldSalary: "기준소득월액 (원)",
    fieldSalaryHint: "월 보수(상한 6,370,000원 적용). 회사·본인 합산 9% 기준.",
    fieldMonths: "납부 개월 수",
    fieldMonthsHint: "국민연금에 가입해 보험료를 낸 총 개월 수.",
    fieldRate: "보험료율 (%)",
    fieldRateHint: "1998~2025년 9%. 2026.1부터 9.5%, 이후 매년 0.5%p 인상.",
    fieldDeposit: "근사 이자율 (%)",
    fieldDepositHint: "3년만기 정기예금 이자율(연도별 변동). 2025년 약 2.6%.",
    calculate: "예상 반환액 계산",
    reset: "초기화",
    resultHeading: "예상 반환일시금",
    resultEmpty: "급여와 납부 개월 수를 입력하세요.",
    error: "계산 중 오류가 발생했습니다.",
    heroLabel: "추정 총 반환액",
    won: "원",
    statPrincipal: "원금 (총 납부 보험료)",
    statInterest: "근사 이자",
    statBase: "적용 기준소득월액",
    cappedWarn: "⚠️ 입력 급여가 기준소득월액 상한(6,370,000원)을 초과해 상한값으로 계산했습니다.",
    eligibilityWarn:
      "💡 금액과 별개로 — 외국인은 원칙적으로 반환일시금 대상이 아닙니다. ① 본국이 상호주의를 인정하거나 ② 사회보장협정에 반환일시금 조항이 있거나 ③ E-9·H-2 비자(고용허가제) 가입자여야 수령 가능합니다. 국적·비자별 수령 가능 여부는 아래 가이드와 NPS(국번없이 1355)로 꼭 확인하세요.",
    sourceTitle: "기준 · 한계",
    sourceLines: [
      "추정치입니다 — 실제 반환액은 NPS가 월별 납부액 × 연도별 정기예금 이자율을 복리 누적해 산정합니다.",
      "사업장가입자(직장인)는 본인 4.5%만 냈어도 사용자 부담분 포함 전체 9%가 반환됩니다(국민연금법 §77).",
      "이자는 평균 적립기간(전체기간÷2) 단순이자로 근사 — 실제와 차이날 수 있습니다.",
      "2002년 이후 납부분은 퇴직소득세 원천징수 대상(사망 지급은 비과세).",
      "수령 가능 여부·정확액은 nps.or.kr / 1355 확인.",
    ],
  },
  en: {
    sectionInput: "Your contributions",
    fieldSalary: "Monthly income base (₩)",
    fieldSalaryHint: "Monthly pay (capped at ₩6,370,000). Based on the full 9% (you + employer).",
    fieldMonths: "Months contributed",
    fieldMonthsHint: "Total months you paid into the National Pension.",
    fieldRate: "Contribution rate (%)",
    fieldRateHint: "9% for 1998–2025. From Jan 2026 it's 9.5%, rising 0.5pp a year.",
    fieldDeposit: "Approx. interest rate (%)",
    fieldDepositHint: "3-year deposit rate (varies by year). About 2.6% in 2025.",
    calculate: "Estimate refund",
    reset: "Reset",
    resultHeading: "Estimated lump-sum refund",
    resultEmpty: "Enter your income and months contributed.",
    error: "Calculation failed.",
    heroLabel: "Estimated total refund",
    won: "₩",
    statPrincipal: "Principal (total contributions)",
    statInterest: "Approx. interest",
    statBase: "Income base applied",
    cappedWarn: "⚠️ Your income exceeds the ₩6,370,000 monthly base ceiling, so the ceiling was used.",
    eligibilityWarn:
      "💡 Separately from the amount — foreigners are NOT entitled to a refund by default. You can only claim it if (1) your home country grants reciprocity, (2) a Social Security Agreement includes a lump-sum clause, or (3) you held an E-9 / H-2 (employment-permit) visa. Check your nationality/visa eligibility in the guide below and with NPS (call 1355).",
    sourceTitle: "Basis · limits",
    sourceLines: [
      "This is an estimate — NPS calculates the real refund by compounding each month's contribution at the 3-year deposit rate for that year.",
      "Workplace subscribers get the full 9% back (employer's half included) even though they only paid 4.5% (National Pension Act §77).",
      "Interest is approximated as simple interest over the average accrual period (total ÷ 2) — actual figures may differ.",
      "Contributions since 2002 are subject to retirement-income withholding tax (death payouts are tax-free).",
      "Confirm eligibility and the exact amount at nps.or.kr / 1355.",
    ],
  },
  zh: {
    sectionInput: "缴纳记录",
    fieldSalary: "基准收入月额（韩元）",
    fieldSalaryHint: "月薪（上限6,370,000韩元）。以公司与本人合计9%为基准。",
    fieldMonths: "缴纳月数",
    fieldMonthsHint: "加入国民年金并缴纳保险费的总月数。",
    fieldRate: "保险费率（%）",
    fieldRateHint: "1998~2025年为9%。自2026年1月起为9.5%，此后每年上调0.5个百分点。",
    fieldDeposit: "近似利率（%）",
    fieldDepositHint: "3年期定期存款利率（逐年变动）。2025年约为2.6%。",
    calculate: "计算预计退还金额",
    reset: "重置",
    resultHeading: "预计退还一次性补偿金",
    resultEmpty: "请输入薪资与缴纳月数。",
    error: "计算过程中发生错误。",
    heroLabel: "预估退还总额",
    won: "₩",
    statPrincipal: "本金（总缴纳保险费）",
    statInterest: "近似利息",
    statBase: "适用基准收入月额",
    cappedWarn: "⚠️ 输入薪资超过基准收入月额上限（6,370,000韩元），已按上限值计算。",
    eligibilityWarn:
      "💡 金额之外还需注意——外国人原则上不属于退还一次性补偿金的对象。只有满足以下条件之一才可领取：①本国承认对等原则，②社会保障协定中含有一次性补偿金条款，③持有E-9·H-2签证（雇佣许可制）。按国籍·签证划分的领取资格，请务必参考下方指南并致电NPS（免区号1355）确认。",
    sourceTitle: "依据 · 局限",
    sourceLines: [
      "本结果为估算值——实际退还金额由NPS按月缴纳额 × 各年度定期存款利率进行复利累计计算。",
      "职场加入者（上班族）即使本人只缴纳了4.5%，退还时也包含雇主承担部分在内的全部9%（《国民年金法》第77条）。",
      "利息按平均积累期间（总期间÷2）以单利方式近似计算——可能与实际金额有差异。",
      "2002年以后缴纳部分须代扣代缴退休所得税（死亡给付免税）。",
      "领取资格与准确金额请通过nps.or.kr或1355确认。",
    ],
  },
  vi: {
    sectionInput: "Lịch sử đóng bảo hiểm",
    fieldSalary: "Mức thu nhập chuẩn tháng (원)",
    fieldSalaryHint: "Thu nhập hàng tháng (áp dụng mức trần 6,370,000원). Dựa trên tổng 9% (bạn + công ty).",
    fieldMonths: "Số tháng đã đóng",
    fieldMonthsHint: "Tổng số tháng bạn đã đóng bảo hiểm lương hưu Quốc dân.",
    fieldRate: "Tỷ lệ phí bảo hiểm (%)",
    fieldRateHint: "9% cho giai đoạn 1998–2025. Từ tháng 1/2026 là 9.5%, sau đó tăng 0.5 điểm % mỗi năm.",
    fieldDeposit: "Lãi suất gần đúng (%)",
    fieldDepositHint: "Lãi suất tiền gửi kỳ hạn 3 năm (thay đổi theo năm). Khoảng 2.6% vào năm 2025.",
    calculate: "Tính khoản hoàn trả dự kiến",
    reset: "Đặt lại",
    resultHeading: "Khoản hoàn trả một lần dự kiến",
    resultEmpty: "Nhập thu nhập và số tháng đã đóng.",
    error: "Đã xảy ra lỗi khi tính toán.",
    heroLabel: "Tổng khoản hoàn trả ước tính",
    won: "원",
    statPrincipal: "Tiền gốc (tổng phí bảo hiểm đã đóng)",
    statInterest: "Lãi ước tính",
    statBase: "Mức thu nhập chuẩn tháng áp dụng",
    cappedWarn: "⚠️ Thu nhập bạn nhập vượt quá mức trần thu nhập chuẩn tháng (6,370,000원), nên hệ thống đã tính theo mức trần.",
    eligibilityWarn:
      "💡 Ngoài số tiền — về nguyên tắc, người nước ngoài KHÔNG mặc định thuộc đối tượng nhận hoàn trả một lần. Bạn chỉ có thể nhận nếu (1) quốc gia của bạn công nhận nguyên tắc có đi có lại, (2) Hiệp định An sinh xã hội có điều khoản hoàn trả một lần, hoặc (3) bạn có visa E-9 · H-2 (chế độ cấp phép việc làm). Hãy kiểm tra điều kiện nhận theo quốc tịch/visa của bạn trong hướng dẫn bên dưới và qua NPS (gọi 1355).",
    sourceTitle: "Căn cứ · giới hạn",
    sourceLines: [
      "Đây là số liệu ước tính — NPS tính khoản hoàn trả thực tế bằng cách cộng dồn lãi kép cho từng khoản đóng hàng tháng theo lãi suất tiền gửi kỳ hạn 3 năm của năm đó.",
      "Người tham gia theo hình thức người lao động công ty được nhận lại đủ 9% (bao gồm cả phần công ty đóng) dù bản thân chỉ đóng 4.5% (Điều 77 Luật Lương hưu Quốc dân).",
      "Lãi được ước tính theo lãi đơn dựa trên thời gian tích lũy trung bình (tổng thời gian ÷ 2) — số liệu thực tế có thể khác.",
      "Khoản đóng từ năm 2002 trở đi phải chịu thuế khấu trừ thu nhập hưu trí (khoản chi trả khi tử vong được miễn thuế).",
      "Xác nhận điều kiện nhận và số tiền chính xác tại nps.or.kr / 1355.",
    ],
  },
} as const;

function MoneyField({
  control,
  label,
  hint,
  locale,
}: {
  control: Control<PensionRefundInputResolved>;
  label: string;
  hint?: string;
  locale: "ko" | "en" | "zh" | "vi";
}): React.ReactElement {
  const won = locale === "ko" ? "원" : "₩";
  return (
    <Controller
      control={control}
      name="monthlySalary"
      render={({ field }) => (
        <Field label={label} hint={hint}>
          <NumberField
            value={field.value}
            onChange={field.onChange}
            thousands
            decimals={0}
            min={0}
            suffix={won}
            aria-label={label}
          />
          {locale === "ko" && field.value > 0 && (
            <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
              {formatKoreanMoney(field.value)}
            </p>
          )}
        </Field>
      )}
    />
  );
}

export function PensionRefundForm({
  locale,
}: PensionRefundFormProps): React.ReactElement {
  const T = TEXT[locale];
  const [result, setResult] = useState<PensionRefundResult | null>(null);
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<PensionRefundInputResolved>({
    resolver: zodResolver(pensionRefundInputSchema),
    defaultValues: {
      monthlySalary: 3_000_000,
      months: 24,
      contributionRatePercent: 9,
      depositRatePercent: 2.6,
    },
  });

  const onSubmit = (values: PensionRefundInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calcPensionRefund(values));
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
        <FieldGroup title={T.sectionInput}>
          <MoneyField
            control={control}
            label={T.fieldSalary}
            hint={T.fieldSalaryHint}
            locale={locale}
          />
          <Controller
            control={control}
            name="months"
            render={({ field }) => (
              <Field label={T.fieldMonths} hint={T.fieldMonthsHint}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  min={0}
                  aria-label={T.fieldMonths}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="contributionRatePercent"
            render={({ field }) => (
              <Field label={T.fieldRate} hint={T.fieldRateHint}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={1}
                  min={0}
                  suffix="%"
                  aria-label={T.fieldRate}
                />
              </Field>
            )}
          />
          <Controller
            control={control}
            name="depositRatePercent"
            render={({ field }) => (
              <Field label={T.fieldDeposit} hint={T.fieldDepositHint}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={1}
                  min={0}
                  suffix="%"
                  aria-label={T.fieldDeposit}
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

      <ResultShell heading={T.resultHeading}>
        {calcError && <ErrorBox message={calcError} />}
        {!calcError && !result && <EmptyResult message={T.resultEmpty} />}
        {result && (
          <div className="animate-fade-up space-y-5">
            <div>
              <HeroResult
                label={T.heroLabel}
                value={formatKrw(result.total)}
                unit={T.won}
              />
              {locale === "ko" && result.total > 0 && (
                <p className="mt-2 text-sm font-medium text-[color:var(--color-text-secondary)]">
                  = {formatKoreanMoney(result.total)}
                </p>
              )}
            </div>

            <dl className="grid grid-cols-2 gap-3">
              <Stat label={T.statPrincipal} value={`${formatKrw(result.principal)} ${T.won}`} />
              <Stat label={T.statInterest} value={`${formatKrw(result.interest)} ${T.won}`} />
              <Stat
                label={T.statBase}
                value={`${formatKrw(result.effectiveBase)} ${T.won}`}
                tone={result.capped ? "warning" : "default"}
              />
            </dl>

            {result.capped && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                {T.cappedWarn}
              </div>
            )}

            <p className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-sm leading-relaxed text-[color:var(--color-text-secondary)]">
              {T.eligibilityWarn}
            </p>

            <SourceBox lines={[T.sourceTitle, ...T.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
