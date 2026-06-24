/**
 * 숫자 입력칸 처리 — 단일 진실원 (NumberField 전용 순수 함수).
 *
 * 기존 `type="number"` + `value={숫자}` + `parseFloat(e) || 0` 패턴의 고질 버그를 해결한다:
 *   "50000000"에서 앞자리 5를 지우면 "0000000" → parseFloat → 0 → value={0} 재렌더 →
 *   나머지 0이 전부 사라져 금액을 처음부터 다시 입력해야 했다.
 *
 * 해결: 입력칸을 `type="text"`로 두고, 사용자가 친 "문자열 그대로"를 상태로 보존한다.
 *   - 선행 0을 편집 도중에는 **무너뜨리지 않는다**("0,000,000" 유지 → 앞에 6 입력 시 60,000,000).
 *   - 콤마는 표시용으로만 삽입하고, 캐럿 위치를 콤마 무시 기준으로 복원한다.
 *   - blur 시점에만 숫자로 정규화(선행 0 제거·min/max clamp).
 */

export interface SanitizeOptions {
  /** 허용 소수 자릿수 (0 = 정수만). 기본 0 */
  decimals?: number;
  /** 음수 허용 여부. 기본 false */
  allowNegative?: boolean;
}

/**
 * 입력 문자열에서 숫자로 의미 있는 문자만 남긴다.
 * 콤마·공백·문자 제거, 소수점은 첫 1개만 유지(decimals>0일 때), 소수 자릿수 제한.
 * **선행 0은 의도적으로 보존**한다(편집 중 자릿수 소실 방지). 정규화는 blur에서 별도 처리.
 */
export function sanitizeNumericInput(
  raw: string,
  opts: SanitizeOptions = {},
): string {
  const decimals = opts.decimals ?? 0;
  const allowNegative = opts.allowNegative ?? false;

  const negative = allowNegative && raw.trim().startsWith("-");
  let s = raw.replace(/[^\d.]/g, "");

  if (decimals <= 0) {
    s = s.replace(/\./g, "");
  } else {
    const firstDot = s.indexOf(".");
    if (firstDot !== -1) {
      const intPart = s.slice(0, firstDot).replace(/\./g, "");
      const fracPart = s
        .slice(firstDot + 1)
        .replace(/\./g, "")
        .slice(0, decimals);
      s = `${intPart}.${fracPart}`;
    }
  }

  // '-' 단독 입력은 편집 중 중간값 — 음수 기호를 보존해 다음 숫자 타이핑을 허용한다.
  if (negative && s === "") return "-";
  return negative && s !== "" ? `-${s}` : s;
}

/**
 * 정리된 숫자 문자열에 천단위 콤마를 삽입한다.
 * 정수부만 그룹화하고 소수부·부호·**선행 0은 그대로 유지**한다.
 * 예: "0000000" → "0,000,000", "1234.5" → "1,234.5", "-1000" → "-1,000".
 */
export function groupThousands(s: string): string {
  if (s === "") return "";
  const negative = s.startsWith("-");
  const body = negative ? s.slice(1) : s;
  const dot = body.indexOf(".");
  const intPart = dot === -1 ? body : body.slice(0, dot);
  const fracPart = dot === -1 ? "" : body.slice(dot); // "." 포함
  const groupedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${negative ? "-" : ""}${groupedInt}${fracPart}`;
}

/** 정리된 숫자 문자열 → number. 빈/부분 입력("", "-", ".")은 0. */
export function parseNumeric(cleaned: string): number {
  if (cleaned === "" || cleaned === "-" || cleaned === ".") return 0;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}

/**
 * 캐럿 좌측의 "콤마가 아닌 문자" 개수를 센다.
 * 콤마는 표시용이므로 재포맷 후 캐럿을 같은 의미 위치로 복원하기 위한 기준값.
 */
export function countSignificantBeforeCaret(raw: string, caret: number): number {
  const end = Math.min(caret, raw.length);
  let n = 0;
  for (let i = 0; i < end; i++) {
    if (raw[i] !== ",") n++;
  }
  return n;
}

/**
 * 재포맷된 문자열에서 "콤마가 아닌 문자" n개를 지난 직후의 캐럿 인덱스를 반환한다.
 * countSignificantBeforeCaret 의 역연산.
 */
export function caretAfterSignificant(formatted: string, n: number): number {
  if (n <= 0) return 0;
  let count = 0;
  for (let i = 0; i < formatted.length; i++) {
    if (formatted[i] !== ",") {
      count++;
      if (count === n) return i + 1;
    }
  }
  return formatted.length;
}

/**
 * number → 입력칸 표시 문자열(콤마 포함). 0/비유한값은 빈 문자열.
 * 외부에서 값이 바뀌었을 때(프리셋 버튼 등) 입력칸을 다시 채우는 데 사용.
 */
export function formatForField(
  value: number,
  thousands: boolean = true,
): string {
  if (!Number.isFinite(value) || value === 0) return "";
  const s = String(value);
  return thousands ? groupThousands(s) : s;
}
