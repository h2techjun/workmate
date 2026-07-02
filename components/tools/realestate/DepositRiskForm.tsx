"use client";

import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  calculateDepositRisk,
  depositRiskInputSchema,
  type DepositRiskInputResolved,
  type DepositRiskResult,
} from "@/lib/calculations/realestate/depositRisk";
import type { RiskLevel } from "@/lib/constants/realestate/depositRisk";
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
  type StatTone,
} from "@/components/ui/calc-form";
import { NumberField } from "@/components/ui/NumberField";

interface DepositRiskFormProps {
  locale: "ko" | "en" | "vi";
}

const LEVEL_TONE: Record<RiskLevel, StatTone> = {
  safe: "success",
  caution: "warning",
  danger: "danger",
  critical: "danger",
};

const LEVEL_BANNER: Record<RiskLevel, string> = {
  safe: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
  caution: "border-amber-500/30 bg-amber-500/10 text-amber-200",
  danger: "border-orange-500/30 bg-orange-500/10 text-orange-200",
  critical: "border-red-500/30 bg-red-500/10 text-red-200",
};

const TEXT = {
  ko: {
    section: "집·계약 정보",
    fieldMarket: "매매 시세 (원)",
    fieldMarketHint: "국토부 실거래가·시세 사이트 기준. 매물 호가 아님.",
    fieldSenior: "선순위 채권액 (원)",
    fieldSeniorHint: "등기부 '을구'의 근저당 설정액 등 — 경매 시 나보다 먼저 배당.",
    fieldDeposit: "내 임차보증금 (원)",
    fieldRecovery: "경매 낙찰가율 가정 (%)",
    fieldRecoveryHint: "물건별로 크게 다름(대략 70~90%). 보수적으로 낮춰 시뮬 권장.",
    calculate: "위험도 진단",
    reset: "초기화",
    heading: "보증금 위험도 진단",
    empty: "시세·선순위·보증금을 입력하고 진단하세요.",
    error: "계산 중 오류가 발생했습니다.",
    invalid: "매매 시세를 입력하세요 (0보다 커야 함).",
    heroLabel: "부채비율 (선순위+보증금)÷시세",
    levelLabel: {
      safe: "상대적 안전",
      caution: "주의",
      danger: "위험",
      critical: "매우 위험",
    } as Record<RiskLevel, string>,
    levelMsg: {
      safe: "통상 안전선(부채비율 70% 이하) 안이지만, 등기부·시세는 반드시 직접 확인하세요.",
      caution: "부채비율이 70~80% 구간입니다. 시세 하락 시 보증금 일부 손실 가능 — 보증보험 가입을 권장합니다.",
      danger: "부채비율이 80~90%로 높습니다. 경매 시 보증금 회수가 불확실합니다. 계약 재검토·보증보험 필수.",
      critical: "부채비율이 90%를 넘습니다. 전형적인 '깡통전세' 위험 — 이 조건이라면 계약을 강력히 재고하세요.",
    } as Record<RiskLevel, string>,
    jeonseRatio: "전세가율 (보증금÷시세)",
    recoverable: "경매 시 예상 회수액",
    shortfall: "예상 손실",
    recoveryPct: "보증금 회수 비율",
    won: "원",
    noLoss: "예상 손실 없음",
    checklistCta: "실제 계약 전 단계별 방지 체크리스트 →",
    sourceTitle: "지표 · 기준",
    sourceLines: [
      "전세가율 = 내 보증금 ÷ 매매시세",
      "부채비율 = (선순위 채권 + 내 보증금) ÷ 매매시세  ← 깡통 판정 핵심",
      "경매 회수 = max(0, 시세 × 낙찰가율 − 선순위 채권), 손실 = 보증금 − 회수액",
      "70/80/90% 경계는 업계·HUG 통용 경험칙이며 법정 기준이 아님.",
      "낙찰가율은 물건별로 상이한 가정치. 결과는 참고용 — 등기부등본·HUG·전문가 확인 필수.",
    ],
  },
  en: {
    section: "Property & contract",
    fieldMarket: "Market price (₩)",
    fieldMarketHint: "Use actual transaction/market data, not the asking price.",
    fieldSenior: "Senior debt (₩)",
    fieldSeniorHint: "Mortgages (근저당) in the register — paid before you at auction.",
    fieldDeposit: "My deposit (₩)",
    fieldRecovery: "Assumed auction recovery (%)",
    fieldRecoveryHint: "Varies a lot by property (~70–90%). Simulate conservatively.",
    calculate: "Check risk",
    reset: "Reset",
    heading: "Deposit risk assessment",
    empty: "Enter price, senior debt, and deposit, then check.",
    error: "Calculation failed.",
    invalid: "Enter a market price greater than 0.",
    heroLabel: "Debt ratio (senior + deposit) ÷ price",
    levelLabel: {
      safe: "Relatively safe",
      caution: "Caution",
      danger: "Risky",
      critical: "Very risky",
    } as Record<RiskLevel, string>,
    levelMsg: {
      safe: "Within the usual safe line (debt ratio ≤ 70%), but always verify the register and market price yourself.",
      caution: "Debt ratio is 70–80%. You could lose part of the deposit if prices fall — deposit-return insurance is recommended.",
      danger: "Debt ratio is a high 80–90%. Recovery at auction is uncertain. Re-check the contract and get insurance.",
      critical: "Debt ratio exceeds 90% — a classic 'underwater jeonse' risk. Strongly reconsider signing on these terms.",
    } as Record<RiskLevel, string>,
    jeonseRatio: "Jeonse ratio (deposit ÷ price)",
    recoverable: "Est. recovery at auction",
    shortfall: "Estimated loss",
    recoveryPct: "Deposit recovery rate",
    won: "₩",
    noLoss: "No expected loss",
    checklistCta: "Step-by-step prevention checklist before signing →",
    sourceTitle: "Metrics · basis",
    sourceLines: [
      "Jeonse ratio = my deposit ÷ market price",
      "Debt ratio = (senior debt + my deposit) ÷ market price  ← the key 'underwater' metric",
      "Auction recovery = max(0, price × recovery rate − senior debt); loss = deposit − recovery",
      "The 70/80/90% lines are industry/HUG rules of thumb, not law.",
      "Auction recovery rate is a per-property assumption. Reference only — verify the register, HUG, and a professional.",
    ],
  },
  vi: {
    section: "Thông tin nhà · hợp đồng",
    fieldMarket: "Giá thị trường (₩)",
    fieldMarketHint: "Dùng dữ liệu giao dịch thực tế/thị trường của Bộ Đất đai, không phải giá chào bán.",
    fieldSenior: "Nợ ưu tiên (₩)",
    fieldSeniorHint: "Khoản thế chấp (근저당) trong bản sao đăng ký BĐS — được thanh toán trước bạn khi đấu giá.",
    fieldDeposit: "Tiền đặt cọc của tôi (₩)",
    fieldRecovery: "Giả định tỷ lệ thu hồi khi đấu giá (%)",
    fieldRecoveryHint: "Thay đổi nhiều tùy theo bất động sản (~70–90%). Nên mô phỏng thận trọng.",
    calculate: "Kiểm tra rủi ro",
    reset: "Đặt lại",
    heading: "Đánh giá rủi ro tiền đặt cọc",
    empty: "Nhập giá, nợ ưu tiên và tiền đặt cọc, rồi kiểm tra.",
    error: "Tính toán thất bại.",
    invalid: "Nhập giá thị trường lớn hơn 0.",
    heroLabel: "Tỷ lệ nợ (nợ ưu tiên + tiền đặt cọc) ÷ giá",
    levelLabel: {
      safe: "Tương đối an toàn",
      caution: "Cần thận trọng",
      danger: "Rủi ro",
      critical: "Rất rủi ro",
    } as Record<RiskLevel, string>,
    levelMsg: {
      safe: "Nằm trong ngưỡng an toàn thông thường (tỷ lệ nợ ≤ 70%), nhưng luôn phải tự xác minh bản sao đăng ký BĐS và giá thị trường.",
      caution: "Tỷ lệ nợ ở mức 70–80%. Bạn có thể mất một phần tiền đặt cọc nếu giá nhà giảm — nên đăng ký bảo hiểm hoàn trả tiền đặt cọc.",
      danger: "Tỷ lệ nợ ở mức cao 80–90%. Việc thu hồi tiền khi đấu giá không chắc chắn. Phải xem lại hợp đồng và mua bảo hiểm.",
      critical: "Tỷ lệ nợ vượt quá 90% — rủi ro 'jeonse rỗng' điển hình. Bạn nên cân nhắc nghiêm túc trước khi ký hợp đồng với điều kiện này.",
    } as Record<RiskLevel, string>,
    jeonseRatio: "Tỷ lệ jeonse (tiền đặt cọc ÷ giá)",
    recoverable: "Số tiền dự kiến thu hồi khi đấu giá",
    shortfall: "Thiệt hại dự kiến",
    recoveryPct: "Tỷ lệ thu hồi tiền đặt cọc",
    won: "₩",
    noLoss: "Không có thiệt hại dự kiến",
    checklistCta: "Danh sách phòng chống từng bước trước khi ký hợp đồng thực tế →",
    sourceTitle: "Chỉ số · căn cứ",
    sourceLines: [
      "Tỷ lệ jeonse = tiền đặt cọc của tôi ÷ giá thị trường",
      "Tỷ lệ nợ = (nợ ưu tiên + tiền đặt cọc của tôi) ÷ giá thị trường  ← chỉ số then chốt để xác định 'jeonse rỗng'",
      "Thu hồi khi đấu giá = max(0, giá × tỷ lệ thu hồi − nợ ưu tiên); thiệt hại = tiền đặt cọc − số tiền thu hồi",
      "Các ngưỡng 70/80/90% là kinh nghiệm thông thường của ngành/HUG, không phải quy định pháp luật.",
      "Tỷ lệ thu hồi khi đấu giá là giả định theo từng bất động sản. Chỉ mang tính tham khảo — xác minh bản sao đăng ký BĐS, HUG và chuyên gia.",
    ],
  },
} as const;

const DEFAULTS: DepositRiskInputResolved = {
  marketPrice: 300_000_000,
  seniorDebt: 50_000_000,
  myDeposit: 200_000_000,
  auctionRecoveryPercent: 80,
};

const pct = (ratio: number): string => `${(ratio * 100).toFixed(1)}%`;

export function DepositRiskForm({
  locale,
}: DepositRiskFormProps): React.ReactElement {
  const T = TEXT[locale];
  const won = locale === "ko" ? "원" : "₩";
  const [result, setResult] = useState<DepositRiskResult | null>(() => {
    try {
      return calculateDepositRisk(DEFAULTS);
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
  } = useForm<DepositRiskInputResolved>({
    resolver: zodResolver(depositRiskInputSchema),
    defaultValues: DEFAULTS,
  });

  const onSubmit = (values: DepositRiskInputResolved): void => {
    setCalcError(null);
    try {
      setResult(calculateDepositRisk(values));
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

  const moneyField = (
    name: "marketPrice" | "seniorDebt" | "myDeposit",
    label: string,
    hint?: string,
  ): React.ReactElement => (
    <Controller
      control={control}
      name={name}
      render={({ field }) => (
        <Field label={label} hint={hint}>
          <NumberField
            value={field.value}
            onChange={field.onChange}
            thousands
            decimals={0}
            suffix={won}
            aria-label={label}
          />
          {locale === "ko" && field.value > 0 && (
            <p className="mt-1.5 text-xs font-medium text-[color:var(--color-accent)]">
              = {formatKoreanMoney(field.value)}
            </p>
          )}
        </Field>
      )}
    />
  );

  return (
    <CalcLayout>
      <FormShell onSubmit={handleSubmit(onSubmit)}>
        <FieldGroup title={T.section}>
          {moneyField("marketPrice", T.fieldMarket, T.fieldMarketHint)}
          {moneyField("seniorDebt", T.fieldSenior, T.fieldSeniorHint)}
          {moneyField("myDeposit", T.fieldDeposit)}
          <Controller
            control={control}
            name="auctionRecoveryPercent"
            render={({ field }) => (
              <Field label={T.fieldRecovery} hint={T.fieldRecoveryHint}>
                <NumberField
                  value={field.value}
                  onChange={field.onChange}
                  thousands={false}
                  decimals={0}
                  min={1}
                  max={100}
                  suffix="%"
                  aria-label={T.fieldRecovery}
                />
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
            <button type="button" onClick={onReset} className="btn-ghost sm:w-auto">
              {T.reset}
            </button>
          }
        />
      </FormShell>

      <ResultShell
        heading={T.heading}
        locale={locale}
        relatedLinks={
          locale !== "ko"
            ? [
                { label: "Jeonse scam checklist", href: "/jeonse-wolse" },
                { label: "Apartment area & price", href: "/apartment-area" },
                { label: "Rent Cap (5%)", href: "/rent-cap" },
              ]
            : [
                { label: "전세사기 방지 체크리스트", href: "/jeonse-wolse" },
                { label: "전용·공급면적/평당가", href: "/apartment-area" },
                { label: "임대료 5% 상한", href: "/rent-cap" },
              ]
        }
      >
        {calcError && <ErrorBox message={calcError} />}
        {!calcError && !result && <EmptyResult message={T.empty} />}
        {!calcError && result && !result.valid && (
          <EmptyResult message={T.invalid} />
        )}
        {!calcError && result && result.valid && (
          <div className="animate-fade-up space-y-5">
            <HeroResult
              label={T.heroLabel}
              value={pct(result.debtRatio)}
              unit={T.levelLabel[result.level]}
            />

            <div className={`rounded-xl border p-4 text-sm leading-relaxed ${LEVEL_BANNER[result.level]}`}>
              {T.levelMsg[result.level]}
            </div>

            <dl className="grid grid-cols-2 gap-3">
              <Stat label={T.jeonseRatio} value={pct(result.jeonseRatio)} />
              <Stat
                label={T.recoveryPct}
                value={pct(result.recoveryRatioOfDeposit)}
                tone={LEVEL_TONE[result.level]}
              />
              <Stat
                label={T.recoverable}
                value={`${formatKrw(result.recoverableForMe)} ${T.won}`}
              />
              <Stat
                label={T.shortfall}
                value={
                  result.shortfall > 0
                    ? `${formatKrw(result.shortfall)} ${T.won}`
                    : T.noLoss
                }
                tone={result.shortfall > 0 ? "danger" : "success"}
              />
            </dl>

            <a
              href={`/${locale}/jeonse-wolse`}
              className="inline-flex text-sm font-medium text-indigo-300 underline underline-offset-2 hover:text-indigo-200"
            >
              {T.checklistCta}
            </a>

            <SourceBox lines={[T.sourceTitle, ...T.sourceLines]} />
          </div>
        )}
      </ResultShell>
    </CalcLayout>
  );
}
