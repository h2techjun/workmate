/**
 * "오늘의 명소" 선정 — 순수 함수.
 *
 * 전 세계 방문자가 같은 날 같은 명소를 보도록, KST(UTC+9) 날짜 문자열을 해시해
 * 카탈로그 인덱스를 뽑는다. 부작용 없음 → vitest 로 고정 날짜 결정성 검증.
 * (허브의 TodayAttraction 위젯이 클라이언트에서 이 함수를 호출한다.)
 */

/** Date → KST(UTC+9) "YYYY-MM-DD" */
export function kstDateString(date: Date): string {
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  const y = kst.getUTCFullYear();
  const m = String(kst.getUTCMonth() + 1).padStart(2, "0");
  const d = String(kst.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

/** djb2 문자열 해시 (부호 없는 32비트) */
function hashString(s: string): number {
  let h = 5381;
  for (let i = 0; i < s.length; i += 1) {
    h = ((h << 5) + h + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/**
 * 주어진 날짜의 "오늘의 명소"를 결정론적으로 반환.
 * 목록이 비면 null. 같은 KST 날짜는 항상 같은 항목을 돌려준다.
 */
export function pickTodayAttraction<T>(
  list: readonly T[],
  date: Date,
): T | null {
  if (list.length === 0) return null;
  const idx = hashString(kstDateString(date)) % list.length;
  return list[idx] ?? null;
}
