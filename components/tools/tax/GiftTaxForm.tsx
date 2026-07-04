"use client";

import { useState } from "react";
import {
  calculateGiftTax,
  type GiftTaxResult,
  type DonorRelation,
  DONOR_RELATIONS,
} from "@/lib/calculations/tax/giftTax";
import { NumberField } from "@/components/ui/NumberField";
import { formatKoreanMoney } from "@/lib/utils/format";
import { ResultShell } from "@/components/ui/calc-form";

interface GiftTaxFormProps {
  locale: "ko" | "en" | "vi";
}

const won = (n: number): string => Math.round(n).toLocaleString("ko-KR");

const T = {
  ko: {
    giftAmount: "증여재산가액 (원)",
    donorRelation: "증여자 관계",
    priorGifts: "10년내 기증여 합산액 (원, 선택)",
    priorGiftsHint: "같은 증여자로부터 10년 이내에 받은 증여금액 합계",
    selfReport: "자진신고 세액공제 3% 적용",
    unit: "원",
    result: "예상 납부 증여세",
    finalTax: "납부세액",
    deduction: "증여재산공제",
    taxBase: "과세표준",
    calcTax: "산출세액",
    reportDiscount: "신고세액공제 (3%)",
    marginalRate: "적용세율",
    note: "상속세 및 증여세법 제53·56조 기준 단순 계산. 재산평가·세대생략할증(30%)·가산세는 미반영. 실제 신고는 세무사 또는 국세청 홈택스 이용 권장.",
    donorRelationOptions: {
      spouse: "배우자 (6억 공제)",
      "lineal-adult": "직계존속 → 성년 직계비속 (5천만 공제)",
      "lineal-minor": "직계존속 → 미성년 직계비속 (2천만 공제)",
      "lineal-ancestor": "직계비속 → 직계존속 (5천만 공제)",
      "other-relative": "기타 친족 (1천만 공제)",
      other: "타인 (공제 없음)",
    } satisfies Record<DonorRelation, string>,
  },
  en: {
    giftAmount: "Gift amount (KRW)",
    donorRelation: "Relationship to donor",
    priorGifts: "Prior gifts in past 10 years (KRW, optional)",
    priorGiftsHint: "Total gifts received from same donor within 10 years",
    selfReport: "Apply 3% self-report tax credit",
    unit: "KRW",
    result: "Estimated Gift Tax",
    finalTax: "Tax payable",
    deduction: "Gift deduction",
    taxBase: "Tax base",
    calcTax: "Calculated tax",
    reportDiscount: "Self-report credit (3%)",
    marginalRate: "Applied rate",
    note: "Simplified calculation based on Korean Inheritance & Gift Tax Act §53·56. Property valuation, generation-skipping surcharge (30%), and penalty taxes are not included. Consult a tax accountant or use Hometax for actual filing.",
    donorRelationOptions: {
      spouse: "Spouse (KRW 600M deduction)",
      "lineal-adult": "Ancestor → adult descendant (KRW 50M)",
      "lineal-minor": "Ancestor → minor descendant (KRW 20M)",
      "lineal-ancestor": "Descendant → ancestor (KRW 50M)",
      "other-relative": "Other relative (KRW 10M)",
      other: "Non-relative (no deduction)",
    } satisfies Record<DonorRelation, string>,
  },
  vi: {
    giftAmount: "Giá trị tài sản tặng cho (KRW)",
    donorRelation: "Quan hệ với người tặng",
    priorGifts: "Tổng tài sản đã tặng cho trong 10 năm (KRW, tùy chọn)",
    priorGiftsHint:
      "Tổng giá trị tài sản đã nhận tặng cho từ cùng người tặng trong vòng 10 năm",
    selfReport: "Áp dụng ưu đãi khai thuế tự nguyện 3%",
    unit: "KRW",
    result: "Thuế tặng cho dự kiến phải nộp",
    finalTax: "Thuế thực nộp",
    deduction: "Khấu trừ tài sản tặng cho",
    taxBase: "Cơ sở tính thuế",
    calcTax: "Thuế tính toán",
    reportDiscount: "Ưu đãi khai thuế (3%)",
    marginalRate: "Thuế suất áp dụng",
    note: "Tính toán đơn giản dựa trên Điều 53, 56 Luật Thuế Thừa kế và Thuế Tặng cho (상속세 및 증여세법) của Hàn Quốc. Không phản ánh việc định giá tài sản, phụ thu bỏ qua thế hệ (30%) và các khoản phạt thuế. Vui lòng tham khảo chuyên gia thuế hoặc sử dụng Hometax của Cơ quan Thuế Quốc gia (NTS) để khai báo thực tế.",
    donorRelationOptions: {
      spouse: "Vợ/chồng (khấu trừ 600 triệu KRW)",
      "lineal-adult": "Trực hệ tôn thuộc → con thành niên (khấu trừ 50 triệu KRW)",
      "lineal-minor": "Trực hệ tôn thuộc → con chưa thành niên (khấu trừ 20 triệu KRW)",
      "lineal-ancestor": "Trực hệ ti thuộc → trực hệ tôn thuộc (khấu trừ 50 triệu KRW)",
      "other-relative": "Họ hàng khác (khấu trừ 10 triệu KRW)",
      other: "Người không có quan hệ họ hàng (không khấu trừ)",
    } satisfies Record<DonorRelation, string>,
  },
} as const;

export function GiftTaxForm({
  locale,
}: GiftTaxFormProps): React.ReactElement {
  const t = T[locale];

  const [giftAmount, setGiftAmount] = useState(100_000_000);
  const [donorRelation, setDonorRelation] = useState<DonorRelation>("lineal-adult");
  const [priorGifts, setPriorGifts] = useState(0);
  const [selfReport, setSelfReport] = useState(true);

  // 즉시 결과 — 마운트 시 자동 표시
  const result: GiftTaxResult = calculateGiftTax({
    giftAmount,
    donorRelation,
    priorGifts,
    selfReport,
  });

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* 입력 패널 */}
      <section className="surface-card space-y-4 p-5 md:p-7">
        {/* 증여재산가액 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.giftAmount}
          </label>
          <NumberField
            value={giftAmount}
            onChange={setGiftAmount}
            suffix={t.unit}
            aria-label={t.giftAmount}
          />
          {locale === "ko" && giftAmount > 0 && (
            <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
              {formatKoreanMoney(giftAmount)}
            </p>
          )}
        </div>

        {/* 증여자 관계 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.donorRelation}
          </label>
          <select
            value={donorRelation}
            onChange={(e) => setDonorRelation(e.target.value as DonorRelation)}
            className="w-full rounded-lg border border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] px-3 py-2.5 text-sm text-[color:var(--color-text-primary)] focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {DONOR_RELATIONS.map((rel) => (
              <option key={rel} value={rel}>
                {t.donorRelationOptions[rel]}
              </option>
            ))}
          </select>
        </div>

        {/* 10년 기증여 합산 */}
        <div>
          <label className="mb-1.5 block text-sm font-medium text-[color:var(--color-text-secondary)]">
            {t.priorGifts}
          </label>
          <NumberField
            value={priorGifts}
            onChange={setPriorGifts}
            suffix={t.unit}
            aria-label={t.priorGifts}
          />
          <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
            {t.priorGiftsHint}
          </p>
        </div>

        {/* 자진신고 세액공제 */}
        <label className="flex items-center gap-2 text-sm text-[color:var(--color-text-secondary)]">
          <input
            type="checkbox"
            className="h-4 w-4"
            checked={selfReport}
            onChange={(e) => setSelfReport(e.target.checked)}
          />
          {t.selfReport}
        </label>
      </section>

      {/* 결과 패널 */}
      <ResultShell
        heading={t.result}
        locale={locale}
        relatedLinks={
          locale !== "ko"
            ? [
                { label: "Capital Gains Tax", href: "/capital-gains-tax" },
                { label: "Income Tax", href: "/income-tax" },
                { label: "Freelancer Tax", href: "/freelancer-tax" },
              ]
            : [
                { label: "양도소득세 계산기", href: "/capital-gains-tax" },
                { label: "종합소득세 계산기", href: "/income-tax" },
                { label: "프리랜서 세금 계산기", href: "/freelancer-tax" },
              ]
        }
      >
        <div className="space-y-4">
          {/* 납부세액 주요 카드 */}
          <div className="rounded-xl bg-gradient-to-br from-violet-500/15 to-purple-500/10 p-4 ring-1 ring-violet-500/20">
            <dt className="text-xs font-medium text-[color:var(--color-text-tertiary)]">
              {t.finalTax}
            </dt>
            <dd className="mt-1 text-4xl font-bold tabular-nums text-[color:var(--color-text-hero)]">
              {won(result.finalTax)}
              <span className="ml-1 text-base font-medium text-[color:var(--color-text-secondary)]">
                {t.unit}
              </span>
            </dd>
            {result.taxBase > 0 && (
              <p className="mt-1 text-xs text-[color:var(--color-text-tertiary)]">
                {t.marginalRate} {(result.marginalRate * 100).toFixed(0)}%
              </p>
            )}
          </div>

          {/* 상세 항목 */}
          <dl className="space-y-1.5 text-sm">
            {([
              [t.deduction, result.deduction],
              [t.taxBase, result.taxBase],
              [t.calcTax, result.calculatedTax],
              [t.reportDiscount, -result.reportDiscount],
            ] as [string, number][]).map(([label, val]) => (
              <div key={label} className="flex justify-between">
                <dt className="text-[color:var(--color-text-tertiary)]">{label}</dt>
                <dd className="tabular-nums text-[color:var(--color-text-secondary)]">
                  {val < 0
                    ? `−${won(Math.abs(val))} ${t.unit}`
                    : `${won(val)} ${t.unit}`}
                </dd>
              </div>
            ))}
            <div className="flex justify-between border-t border-[color:var(--color-border-subtle)] pt-1.5 font-semibold">
              <dt className="text-violet-300">{t.finalTax}</dt>
              <dd className="tabular-nums text-violet-300">
                {won(result.finalTax)} {t.unit}
              </dd>
            </div>
          </dl>

          <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
            {t.note}
          </p>
        </div>
      </ResultShell>
    </div>
  );
}
