"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculateBrokerageFee,
  brokerageFeeInputSchema,
  type BrokerageFeeInputResolved,
  type BrokerageFeeResult,
} from "@/lib/calculations/realestate/brokerageFee";
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
import { NumberField } from "@/components/ui/NumberField";

interface BrokerageFeeFormProps {
  locale: "ko" | "en" | "vi" | "zh";
}

const TEXT = {
  ko: {
    sectionType: "거래 정보",
    fieldType: "거래유형",
    typeSale: "매매",
    typeJeonse: "전세",
    typeMonthly: "월세",
    fieldPrice: "매매가 (원)",
    fieldJeonseDeposit: "전세 보증금 (원)",
    fieldMonthlyDeposit: "월세 보증금 (원)",
    fieldMonthlyRent: "월세 (원/월)",
    sectionOptions: "옵션",
    fieldVat: "부가가치세(10%) 포함",
    vatHint: "중개사무소가 일반과세자(연 매출 8천만원 이상)인 경우 부가세 별도",
    calculate: "계산하기",
    reset: "초기화",
    resultHeading: "중개수수료 계산 결과",
    resultEmpty: "거래유형과 금액을 입력하고 계산하세요.",
    error: "계산 중 오류가 발생했습니다.",
    feeLabel: "법정 상한 중개보수",
    won: "원",
    transactionAmount: "거래금액",
    maxRate: "상한요율",
    rateCap: "한도액",
    vat: "부가가치세",
    totalFee: "합계 (VAT 포함)",
    monthlyMultiplier100: "월세 환산 거래금액 = 보증금 + 월세 × 100",
    monthlyMultiplier70: "월세 환산 거래금액 = 보증금 + 월세 × 70 (환산액이 5천만 미만이므로)",
    cappedNotice: "한도액이 적용되었습니다. (상한요율 적용 시 한도액 초과)",
    negotiableNotice: "위 금액은 법정 상한입니다. 실제 중개보수는 협의로 더 낮출 수 있습니다.",
    sourceTitle: "법적 근거 (2021.10.19 시행)",
    sourceLines: [
      "매매·교환: 5천만↑ 0.6%·25만한도 / 5천만~2억 0.5%·80만한도 / 2억~9억 0.4% / 9억~12억 0.5% / 12억~15억 0.6% / 15억↑ 0.7%",
      "임대차: 5천만↑ 0.5%·20만한도 / 5천만~1억 0.4%·30만한도 / 1억~6억 0.3% / 6억~12억 0.4% / 12억~15억 0.5% / 15억↑ 0.6%",
      "월세 환산: 보증금 + 월세×100 (5천만 미만이면 ×70)",
      "출처: 공인중개사법 시행규칙 [별표1], 국토교통부 (2021.10.19 시행)",
      "면책: 법정 상한이며 실제는 협의 가능. 지자체 조례로 구간 세분 가능. 전문가 확인 권장.",
    ],
  },
  en: {
    sectionType: "Transaction",
    fieldType: "Transaction type",
    typeSale: "Sale / purchase",
    typeJeonse: "Jeonse (lump-sum deposit)",
    typeMonthly: "Monthly rent (wolse)",
    fieldPrice: "Sale price (₩)",
    fieldJeonseDeposit: "Jeonse deposit (₩)",
    fieldMonthlyDeposit: "Monthly-rent deposit (₩)",
    fieldMonthlyRent: "Monthly rent (₩/month)",
    sectionOptions: "Options",
    fieldVat: "Include VAT (10%)",
    vatHint: "Add if the agent is a general VAT taxpayer (annual sales ≥ ₩80M)",
    calculate: "Calculate",
    reset: "Reset",
    resultHeading: "Brokerage fee result",
    resultEmpty: "Select a transaction type and enter the amount.",
    error: "Calculation failed.",
    feeLabel: "Legal maximum brokerage fee",
    won: "₩",
    transactionAmount: "Transaction amount",
    maxRate: "Maximum rate",
    rateCap: "Cap",
    vat: "VAT (10%)",
    totalFee: "Total (incl. VAT)",
    monthlyMultiplier100: "Converted amount = deposit + rent × 100",
    monthlyMultiplier70: "Converted amount = deposit + rent × 70 (converted total < ₩50M)",
    cappedNotice: "The cap applies — the rate-based fee exceeded the ceiling.",
    negotiableNotice: "This is the legal maximum. The actual fee can be negotiated lower.",
    sourceTitle: "Legal basis (effective 2021-10-19)",
    sourceLines: [
      "Sale: <₩50M 0.6% cap ₩250K / ₩50M–₩200M 0.5% cap ₩800K / ₩200M–₩900M 0.4% / ₩900M–₩1.2B 0.5% / ₩1.2B–₩1.5B 0.6% / ₩1.5B+ 0.7%",
      "Lease: <₩50M 0.5% cap ₩200K / ₩50M–₩100M 0.4% cap ₩300K / ₩100M–₩600M 0.3% / ₩600M–₩1.2B 0.4% / ₩1.2B–₩1.5B 0.5% / ₩1.5B+ 0.6%",
      "Monthly conversion: deposit + rent×100 (use ×70 if total < ₩50M)",
      "Source: Enforcement Rules of the Licensed Real Estate Agents Act [Annex 1], MOLIT (2021-10-19)",
      "Disclaimer: legal maximum only; actual fee is negotiable and may be lower. Local ordinances may subdivide brackets. Verify with a licensed agent.",
    ],
  },
  vi: {
    sectionType: "Giao dịch",
    fieldType: "Loại giao dịch",
    typeSale: "Mua bán",
    typeJeonse: "Jeonse (đặt cọc trọn gói)",
    typeMonthly: "Thuê trả tiền hàng tháng (wolse)",
    fieldPrice: "Giá mua bán (₩)",
    fieldJeonseDeposit: "Tiền đặt cọc jeonse (₩)",
    fieldMonthlyDeposit: "Tiền đặt cọc wolse (₩)",
    fieldMonthlyRent: "Tiền thuê hàng tháng (₩/tháng)",
    sectionOptions: "Tùy chọn",
    fieldVat: "Bao gồm thuế giá trị gia tăng VAT (10%)",
    vatHint: "Thêm nếu văn phòng môi giới là đối tượng nộp VAT phổ thông (doanh thu năm ≥ 80 triệu ₩)",
    calculate: "Tính toán",
    reset: "Đặt lại",
    resultHeading: "Kết quả phí môi giới",
    resultEmpty: "Chọn loại giao dịch và nhập số tiền để tính toán.",
    error: "Tính toán thất bại.",
    feeLabel: "Phí môi giới tối đa theo luật",
    won: "₩",
    transactionAmount: "Số tiền giao dịch",
    maxRate: "Tỷ lệ tối đa",
    rateCap: "Mức trần",
    vat: "Thuế giá trị gia tăng",
    totalFee: "Tổng cộng (đã gồm VAT)",
    monthlyMultiplier100: "Số tiền quy đổi wolse = tiền đặt cọc + tiền thuê × 100",
    monthlyMultiplier70: "Số tiền quy đổi wolse = tiền đặt cọc + tiền thuê × 70 (vì số tiền quy đổi dưới 50 triệu ₩)",
    cappedNotice: "Đã áp dụng mức trần. (Phí tính theo tỷ lệ vượt quá mức trần)",
    negotiableNotice: "Số tiền trên là mức trần theo luật. Phí môi giới thực tế có thể thỏa thuận thấp hơn.",
    sourceTitle: "Căn cứ pháp lý (có hiệu lực từ 19/10/2021)",
    sourceLines: [
      "Mua bán: <50 triệu₩ 0,6% trần 250 nghìn₩ / 50–200 triệu₩ 0,5% trần 800 nghìn₩ / 200–900 triệu₩ 0,4% / 900 triệu–1,2 tỷ₩ 0,5% / 1,2–1,5 tỷ₩ 0,6% / trên 1,5 tỷ₩ 0,7%",
      "Thuê (jeonse/wolse): <50 triệu₩ 0,5% trần 200 nghìn₩ / 50–100 triệu₩ 0,4% trần 300 nghìn₩ / 100–600 triệu₩ 0,3% / 600 triệu–1,2 tỷ₩ 0,4% / 1,2–1,5 tỷ₩ 0,5% / trên 1,5 tỷ₩ 0,6%",
      "Quy đổi wolse: tiền đặt cọc + tiền thuê×100 (dùng ×70 nếu tổng dưới 50 triệu₩)",
      "Nguồn: Quy tắc thi hành Luật Môi giới bất động sản có chứng chỉ [Phụ lục 1], Bộ Đất đai, Hạ tầng và Giao thông (có hiệu lực từ 19/10/2021)",
      "Miễn trừ trách nhiệm: chỉ là mức trần theo luật; phí thực tế có thể thỏa thuận thấp hơn. Quy định địa phương có thể chia nhỏ các bậc giá. Nên xác nhận với môi giới có chứng chỉ.",
    ],
  },
  zh: {
    sectionType: "交易信息",
    fieldType: "交易类型",
    typeSale: "买卖",
    typeJeonse: "全租",
    typeMonthly: "月租",
    fieldPrice: "买卖价（韩元）",
    fieldJeonseDeposit: "全租保证金（韩元）",
    fieldMonthlyDeposit: "月租保证金（韩元）",
    fieldMonthlyRent: "月租（韩元/月）",
    sectionOptions: "选项",
    fieldVat: "含增值税（10%）",
    vatHint: "若中介事务所为一般纳税人（年营业额8千万韩元以上），增值税另计",
    calculate: "计算",
    reset: "重置",
    resultHeading: "中介费计算结果",
    resultEmpty: "请输入交易类型和金额后计算。",
    error: "计算过程中发生错误。",
    feeLabel: "法定上限中介报酬",
    won: "₩",
    transactionAmount: "交易金额",
    maxRate: "上限费率",
    rateCap: "限额",
    vat: "增值税",
    totalFee: "合计（含增值税）",
    monthlyMultiplier100: "月租折算交易金额 = 保证金 + 月租 × 100",
    monthlyMultiplier70: "月租折算交易金额 = 保证金 + 月租 × 70（因折算额不足5千万韩元）",
    cappedNotice: "已适用限额。（按上限费率计算超过限额）",
    negotiableNotice: "以上金额为法定上限，实际中介报酬可通过协商降低。",
    sourceTitle: "法律依据（自2021.10.19施行）",
    sourceLines: [
      "买卖·交换：5千万以上0.6%·限额25万 / 5千万~2亿0.5%·限额80万 / 2亿~9亿0.4% / 9亿~12亿0.5% / 12亿~15亿0.6% / 15亿以上0.7%",
      "租赁：5千万以上0.5%·限额20万 / 5千万~1亿0.4%·限额30万 / 1亿~6亿0.3% / 6亿~12亿0.4% / 12亿~15亿0.5% / 15亿以上0.6%",
      "月租折算：保证金 + 月租×100（不足5千万则×70）",
      "来源：《房地产经纪人法施行规则》[附表1]，国土交通部（自2021.10.19施行）",
      "免责声明：为法定上限，实际可协商。地方自治条例可细分区间。建议咨询专业人士确认。",
    ],
  },
} as const;

const DEFAULTS: BrokerageFeeInputResolved = {
  transactionType: "sale",
  price: 500_000_000,
  monthlyDeposit: 10_000_000,
  monthlyRent: 500_000,
  includeVat: false,
};

export function BrokerageFeeForm({
  locale,
}: BrokerageFeeFormProps): React.ReactElement {
  const T = TEXT[locale];

  const [result, setResult] = useState<BrokerageFeeResult | null>(() => {
    try {
      return calculateBrokerageFee(DEFAULTS);
    } catch {
      return null;
    }
  });
  const [calcError, setCalcError] = useState<string | null>(null);

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<BrokerageFeeInputResolved>({
    resolver: zodResolver(brokerageFeeInputSchema),
    defaultValues: DEFAULTS,
  });

  const transactionType = watch("transactionType");

  const onSubmit = (values: BrokerageFeeInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateBrokerageFee(values));
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
        <FieldGroup title={T.sectionType}>
          {/* 거래유형 select */}
          <Controller
            control={control}
            name="transactionType"
            render={({ field }) => (
              <Field label={T.fieldType}>
                <select
                  className="input-base"
                  value={field.value}
                  onChange={field.onChange}
                >
                  <option value="sale">{T.typeSale}</option>
                  <option value="jeonse">{T.typeJeonse}</option>
                  <option value="monthly">{T.typeMonthly}</option>
                </select>
              </Field>
            )}
          />

          {/* 매매가 or 전세 보증금 */}
          {(transactionType === "sale" || transactionType === "jeonse") && (
            <Controller
              control={control}
              name="price"
              render={({ field }) => (
                <Field
                  label={
                    transactionType === "sale"
                      ? T.fieldPrice
                      : T.fieldJeonseDeposit
                  }
                >
                  <NumberField
                    value={field.value}
                    onChange={field.onChange}
                    thousands
                    decimals={0}
                    suffix={locale === "ko" ? "원" : "₩"}
                    aria-label={
                      transactionType === "sale"
                        ? T.fieldPrice
                        : T.fieldJeonseDeposit
                    }
                  />
                  {locale === "ko" && field.value > 0 && (
                    <p className="mt-1.5 text-xs font-medium text-[color:var(--color-accent)]">
                      = {formatKoreanMoney(field.value)}
                    </p>
                  )}
                </Field>
              )}
            />
          )}

          {/* 월세: 보증금 + 월세 */}
          {transactionType === "monthly" && (
            <>
              <Controller
                control={control}
                name="monthlyDeposit"
                render={({ field }) => (
                  <Field label={T.fieldMonthlyDeposit}>
                    <NumberField
                      value={field.value}
                      onChange={field.onChange}
                      thousands
                      decimals={0}
                      suffix={locale === "ko" ? "원" : "₩"}
                      aria-label={T.fieldMonthlyDeposit}
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
                name="monthlyRent"
                render={({ field }) => (
                  <Field label={T.fieldMonthlyRent}>
                    <NumberField
                      value={field.value}
                      onChange={field.onChange}
                      thousands
                      decimals={0}
                      suffix={locale === "ko" ? "원" : "₩"}
                      aria-label={T.fieldMonthlyRent}
                    />
                    {locale === "ko" && field.value > 0 && (
                      <p className="mt-1.5 text-xs font-medium text-[color:var(--color-accent)]">
                        = {formatKoreanMoney(field.value)}
                      </p>
                    )}
                  </Field>
                )}
              />
            </>
          )}
        </FieldGroup>

        {/* 부가가치세 토글 */}
        <FieldGroup title={T.sectionOptions}>
          <Controller
            control={control}
            name="includeVat"
            render={({ field }) => (
              <Field label={T.fieldVat} hint={T.vatHint}>
                <label className="flex cursor-pointer items-center gap-3">
                  <input
                    type="checkbox"
                    checked={field.value}
                    onChange={(e) => field.onChange(e.target.checked)}
                    className="h-4 w-4 rounded accent-[color:var(--color-accent)]"
                  />
                  <span className="text-sm text-[color:var(--color-text-secondary)]">
                    {T.fieldVat}
                  </span>
                </label>
              </Field>
            )}
          />
        </FieldGroup>

        <ActionRow
          primary={
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary flex-1"
            >
              {T.calculate}
            </button>
          }
          secondary={
            <button
              type="button"
              onClick={onReset}
              className="btn-ghost sm:w-auto"
            >
              {T.reset}
            </button>
          }
        />
      </FormShell>

      <ResultShell
        heading={T.resultHeading}
        locale={locale}
        relatedLinks={
          locale === "ko"
            ? [
                { label: "전·월세 환산기", href: "/jeonse-wolse" },
                { label: "아파트 평형 변환", href: "/apartment-area" },
                { label: "양도소득세 계산기", href: "/capital-gains-tax" },
              ]
            : locale === "zh"
              ? [
                  { label: "全租↔月租换算器", href: "/jeonse-wolse" },
                  { label: "公寓面积与价格", href: "/apartment-area" },
                  { label: "转让所得税计算器", href: "/capital-gains-tax" },
                ]
              : locale === "vi"
                ? [
                    { label: "Quy đổi Jeonse ↔ Wolse", href: "/jeonse-wolse" },
                    { label: "Diện tích & giá căn hộ", href: "/apartment-area" },
                    { label: "Thuế thu nhập từ chuyển nhượng", href: "/capital-gains-tax" },
                  ]
                : [
                    { label: "Jeonse ↔ Wolse Converter", href: "/jeonse-wolse" },
                    { label: "Apartment Area & Price", href: "/apartment-area" },
                    { label: "Capital Gains Tax", href: "/capital-gains-tax" },
                  ]
        }
      >
        {calcError && <ErrorBox message={calcError} />}
        {!calcError && !result && <EmptyResult message={T.resultEmpty} />}
        {result && (
          <div className="animate-fade-up space-y-5">
            {/* 핵심 결과 */}
            <div>
              <HeroResult
                label={T.feeLabel}
                value={formatKrw(result.feeBeforeVat)}
                unit={T.won}
              />
              {locale === "ko" && (
                <p className="mt-2 text-sm font-medium text-[color:var(--color-text-secondary)]">
                  = {formatKoreanMoney(result.feeBeforeVat)}
                </p>
              )}
            </div>

            {/* 세부 스탯 */}
            <dl className="grid grid-cols-2 gap-3">
              <Stat
                label={T.transactionAmount}
                value={`${formatKrw(result.transactionAmount)} ${T.won}`}
              />
              <Stat
                label={T.maxRate}
                value={`${(result.maxRate * 100).toFixed(1)}%`}
              />
              {result.rateCap !== null && (
                <Stat
                  label={T.rateCap}
                  value={`${formatKrw(result.rateCap)} ${T.won}`}
                  tone={result.cappedByLimit ? "warning" : "default"}
                />
              )}
              {result.vatAmount > 0 && (
                <>
                  <Stat
                    label={T.vat}
                    value={`${formatKrw(result.vatAmount)} ${T.won}`}
                  />
                  <Stat
                    label={T.totalFee}
                    value={`${formatKrw(result.totalFee)} ${T.won}`}
                    tone="success"
                  />
                </>
              )}
            </dl>

            {/* 월세 환산 안내 */}
            {result.monthlyMultiplier !== null && (
              <div className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-xs leading-relaxed text-[color:var(--color-text-secondary)]">
                {result.monthlyMultiplier === 100
                  ? T.monthlyMultiplier100
                  : T.monthlyMultiplier70}
              </div>
            )}

            {/* 한도 적용 알림 */}
            {result.cappedByLimit && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-200">
                {T.cappedNotice}
              </div>
            )}

            {/* 협의 가능 안내 */}
            <p className="rounded-xl border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-4 text-xs leading-relaxed text-[color:var(--color-text-tertiary)]">
              {T.negotiableNotice}
            </p>

            <SourceBox lines={[T.sourceTitle, ...T.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
