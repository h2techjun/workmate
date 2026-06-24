"use client";

import { useEffect, useRef, useState } from "react";
import {
  sanitizeNumericInput,
  groupThousands,
  parseNumeric,
  countSignificantBeforeCaret,
  caretAfterSignificant,
  formatForField,
} from "@/lib/utils/numberInput";

export interface NumberFieldProps {
  /** 현재 숫자 값 */
  value: number;
  /** 값 변경 콜백 (정리된 숫자) */
  onChange: (value: number) => void;
  /** 천단위 콤마 표시. 기본 true */
  thousands?: boolean;
  /** 허용 소수 자릿수 (0 = 정수). 기본 0 */
  decimals?: number;
  /** 음수 허용. 기본 false */
  allowNegative?: boolean;
  /** blur 시 clamp 하한 */
  min?: number;
  /** blur 시 clamp 상한 */
  max?: number;
  placeholder?: string;
  /** 입력칸 우측 단위 표시 (원, %, ㎡, A 등) */
  suffix?: string;
  id?: string;
  "aria-label"?: string;
  disabled?: boolean;
  className?: string;
}

/**
 * 금액·수량 입력 공용 컴포넌트.
 *
 * `type="text"` + 내부 문자열 상태로 두어, 사용자가 친 자릿수를 그대로 보존한다.
 * 앞자리를 편집해도 나머지 숫자가 사라지지 않으며, 천단위 콤마는 표시용으로만
 * 삽입하고 캐럿 위치를 의미 기준으로 복원한다. blur 시 숫자로 정규화·clamp.
 *
 * 기존 `type="number"` + `parseFloat(e)||0` 패턴을 대체한다.
 */
export function NumberField({
  value,
  onChange,
  thousands = true,
  decimals = 0,
  allowNegative = false,
  min,
  max,
  placeholder,
  suffix,
  id,
  "aria-label": ariaLabel,
  disabled,
  className,
}: NumberFieldProps): React.ReactElement {
  const ref = useRef<HTMLInputElement>(null);
  const [text, setText] = useState<string>(() => formatForField(value, thousands));
  const caretRef = useRef<number | null>(null);

  // 외부에서 값이 바뀌면(프리셋·리셋 등) 입력칸을 다시 채운다.
  // 현재 입력칸이 표현하는 숫자와 다를 때만 덮어써 사용자 편집을 방해하지 않는다.
  useEffect(() => {
    const current = parseNumeric(sanitizeNumericInput(text, { decimals, allowNegative }));
    if (current !== value) {
      setText(formatForField(value, thousands));
    }
    // text 는 의도적으로 의존성에서 제외 (외부 value 변화에만 반응)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value, thousands, decimals, allowNegative]);

  // 콤마 재삽입 후 캐럿 위치 복원
  useEffect(() => {
    if (caretRef.current !== null && ref.current) {
      const pos = caretRef.current;
      caretRef.current = null;
      try {
        ref.current.setSelectionRange(pos, pos);
      } catch {
        /* setSelectionRange 미지원 환경 무시 */
      }
    }
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement>): void {
    const el = e.currentTarget;
    const raw = el.value;
    const caret = el.selectionStart ?? raw.length;
    const sig = countSignificantBeforeCaret(raw, caret);

    const cleaned = sanitizeNumericInput(raw, { decimals, allowNegative });
    const formatted = thousands ? groupThousands(cleaned) : cleaned;

    setText(formatted);
    caretRef.current = caretAfterSignificant(formatted, sig);
    onChange(parseNumeric(cleaned));
  }

  function handleBlur(): void {
    let num = parseNumeric(sanitizeNumericInput(text, { decimals, allowNegative }));
    if (min !== undefined && num < min) num = min;
    if (max !== undefined && num > max) num = max;
    const next = formatForField(num, thousands);
    setText(next);
    if (num !== value) onChange(num);
  }

  const input = (
    <input
      ref={ref}
      id={id}
      type="text"
      inputMode={decimals > 0 ? "decimal" : "numeric"}
      autoComplete="off"
      disabled={disabled}
      placeholder={placeholder}
      aria-label={ariaLabel}
      value={text}
      onChange={handleChange}
      onBlur={handleBlur}
      className={`input-base ${suffix ? "pr-12" : ""} ${className ?? ""}`}
    />
  );

  if (!suffix) return input;

  return (
    <div className="relative">
      {input}
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[color:var(--color-text-tertiary)]">
        {suffix}
      </span>
    </div>
  );
}
