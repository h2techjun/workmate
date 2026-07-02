"use client";

import { useState } from "react";
import {
  calculateVisaDays,
  type VisaDaysResult,
} from "@/lib/calculations/korean/visaDays";
import { NumberField } from "@/components/ui/NumberField";

interface VisaDaysFormProps {
  locale: "ko" | "en" | "vi";
  today: { year: number; month: number; day: number };
}

const T = {
  ko: {
    entry: "입국일",
    year: "연도",
    month: "월",
    day: "일",
    allowed: "허용 체류일수",
    presets: "자주 쓰는 기간",
    result: "체류 현황",
    daysStayed: "현재 체류 일수",
    daysUnit: "일",
    remaining: "만료까지 남은 일수",
    expiry: "체류 만료일",
    overstay: "초과 체류 (불법)",
    safe: "정상 체류",
    refLabel: "기준일 (오늘)",
    note: "입국일을 1일째로 포함해 계산(출입국 관행). 비자 종류·연장 여부에 따라 다를 수 있으니 정확한 만료일은 하이코리아(HiKorea)·외국인등록증으로 확인하세요.",
  },
  en: {
    entry: "Entry date",
    year: "Year",
    month: "Month",
    day: "Day",
    allowed: "Allowed stay (days)",
    presets: "Common periods",
    result: "Stay status",
    daysStayed: "Days stayed",
    daysUnit: "days",
    remaining: "Days until expiry",
    expiry: "Stay expiry date",
    overstay: "Overstay (illegal)",
    safe: "Valid stay",
    refLabel: "Reference date (today)",
    note: "Entry day counted as day 1 (immigration practice). May vary by visa type/extension — verify the exact expiry on HiKorea or your ARC.",
  },
  vi: {
    entry: "Ngày nhập cảnh",
    year: "Năm",
    month: "Tháng",
    day: "Ngày",
    allowed: "Số ngày được phép lưu trú",
    presets: "Thời hạn thường dùng",
    result: "Tình trạng lưu trú",
    daysStayed: "Số ngày đã lưu trú",
    daysUnit: "ngày",
    remaining: "Số ngày còn lại đến khi hết hạn",
    expiry: "Ngày hết hạn lưu trú",
    overstay: "Cư trú quá hạn (bất hợp pháp)",
    safe: "Đang lưu trú hợp lệ",
    refLabel: "Ngày tham chiếu (hôm nay)",
    note: "Ngày nhập cảnh được tính là ngày thứ 1 (theo thông lệ xuất nhập cảnh). Có thể khác nhau tùy loại visa/gia hạn — hãy xác minh ngày hết hạn chính xác trên HiKorea hoặc thẻ đăng ký người nước ngoài (ARC) của bạn.",
  },
} as const;

const PRESETS = [30, 60, 90, 180];

export function VisaDaysForm({
  locale,
  today,
}: VisaDaysFormProps): React.ReactElement {
  const t = T[locale];
  const [y, setY] = useState(today.year);
  const [m, setM] = useState(today.month);
  const [d, setD] = useState(today.day);
  const [allowed, setAllowed] = useState(90);

  const valid =
    y >= 1900 && m >= 1 && m <= 12 && d >= 1 && d <= 31;

  let r: VisaDaysResult | null = null;
  if (valid) {
    r = calculateVisaDays({
      entryYear: y,
      entryMonth: m,
      entryDay: d,
      allowedDays: allowed,
      refYear: today.year,
      refMonth: today.month,
      refDay: today.day,
    });
  }

  const numInputClass = "text-center text-xl font-bold tabular-nums";

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <section className="surface-card space-y-5 p-5 md:p-7">
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.entry}
          </label>
          <div className="grid grid-cols-3 gap-2">
            <NumberField
              value={y}
              onChange={setY}
              thousands={false}
              decimals={0}
              min={1900}
              max={2100}
              placeholder={t.year}
              aria-label={t.year}
              className={numInputClass}
            />
            <NumberField
              value={m}
              onChange={setM}
              thousands={false}
              decimals={0}
              min={1}
              max={12}
              placeholder={t.month}
              aria-label={t.month}
              className={numInputClass}
            />
            <NumberField
              value={d}
              onChange={setD}
              thousands={false}
              decimals={0}
              min={1}
              max={31}
              placeholder={t.day}
              aria-label={t.day}
              className={numInputClass}
            />
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-semibold text-[color:var(--color-text-primary)]">
            {t.allowed}
          </label>
          <NumberField
            value={allowed}
            onChange={setAllowed}
            thousands={false}
            decimals={0}
            min={1}
            max={365}
            suffix={t.daysUnit}
            aria-label={t.allowed}
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setAllowed(p)}
                className={`rounded-md border px-2.5 py-1 text-xs font-medium transition-colors ${
                  allowed === p
                    ? "border-indigo-500 bg-indigo-500/10 text-indigo-300"
                    : "border-[color:var(--color-border-default)] bg-[color:var(--color-bg-elevated)] text-[color:var(--color-text-secondary)] hover:border-indigo-400"
                }`}
              >
                {p}{t.daysUnit}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] px-4 py-3 text-sm text-[color:var(--color-text-tertiary)]">
          {t.refLabel}:{" "}
          <span className="font-semibold tabular-nums text-[color:var(--color-text-secondary)]">
            {today.year}-{String(today.month).padStart(2, "0")}-
            {String(today.day).padStart(2, "0")}
          </span>
        </div>
      </section>

      <section className="surface-card space-y-4 p-5 md:p-7">
        <h2 className="text-lg font-semibold text-[color:var(--color-text-primary)]">
          {t.result}
        </h2>
        {r ? (
          <div className="animate-fade-up space-y-3">
            <div
              className={`rounded-xl p-4 ring-1 ${
                r.isOverstay
                  ? "bg-gradient-to-br from-red-500/15 to-rose-500/10 ring-red-500/30"
                  : "bg-gradient-to-br from-indigo-500/15 to-purple-500/10 ring-indigo-500/20"
              }`}
            >
              <dt className="text-xs font-medium text-[color:var(--color-text-tertiary)]">
                {r.isOverstay ? t.overstay : t.remaining}
              </dt>
              <dd
                className={`mt-1 text-4xl font-bold tabular-nums ${r.isOverstay ? "text-red-300" : "text-white"}`}
              >
                {Math.abs(r.daysRemaining)} {t.daysUnit}
              </dd>
            </div>
            <dl className="grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-3">
                <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.daysStayed}</dt>
                <dd className="mt-1 text-xl font-bold tabular-nums text-[color:var(--color-text-primary)]">
                  {r.daysStayed} {t.daysUnit}
                </dd>
              </div>
              <div className="rounded-lg border border-[color:var(--color-border-subtle)] bg-[color:var(--color-bg-elevated)] p-3">
                <dt className="text-xs text-[color:var(--color-text-tertiary)]">{t.expiry}</dt>
                <dd className="mt-1 text-xl font-bold tabular-nums text-[color:var(--color-text-primary)]">
                  {r.expiry.year}-{String(r.expiry.month).padStart(2, "0")}-
                  {String(r.expiry.day).padStart(2, "0")}
                </dd>
              </div>
            </dl>
            <p className="text-[11px] leading-relaxed text-[color:var(--color-text-muted)]">
              {t.note}
            </p>
          </div>
        ) : (
          <p className="text-sm text-[color:var(--color-text-tertiary)]">{t.entry}</p>
        )}
      </section>
    </div>
  );
}
