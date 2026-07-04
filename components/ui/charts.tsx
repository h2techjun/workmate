/**
 * 결과 시각화 미니 차트 — 의존성 0 (순수 div/SVG).
 *
 * 색은 globals.css 의 --chart-1 ~ --chart-6 변수를 사용해
 * 라이트/다크 테마에 자동 대응한다 (SVG fill 은 클래스 오버라이드가
 * 안 먹으므로 반드시 CSS 변수로 지정할 것).
 *
 * 데이터는 lib/calculations/* 결과(schedule/monthly/yearly 등)를
 * 그대로 받는다 — 차트 쪽에서 재계산하지 않는다 (단일 진실원).
 */

/* ── 1. BreakdownBar — 수평 스택 바 + 범례 (구성 비율) ─────────────────── */

export interface BreakdownSegment {
  label: string;
  value: number;
  /** CSS color 값 — 반드시 var(--chart-N) 사용 */
  color: string;
}

interface BreakdownBarProps {
  segments: ReadonlyArray<BreakdownSegment>;
  format: (n: number) => string;
  ariaLabel: string;
}

export function BreakdownBar({
  segments,
  format,
  ariaLabel,
}: BreakdownBarProps): React.ReactElement | null {
  const total = segments.reduce((sum, s) => sum + s.value, 0);
  if (total <= 0) return null;
  const visible = segments.filter((s) => s.value > 0);

  return (
    <figure className="space-y-3">
      <div
        className="flex h-6 w-full overflow-hidden rounded-lg"
        role="img"
        aria-label={ariaLabel}
      >
        {visible.map((s) => {
          const pct = (s.value / total) * 100;
          return (
            <div
              key={s.label}
              className="h-full min-w-[3px]"
              style={{ width: `${pct}%`, background: s.color }}
              title={`${s.label}: ${format(s.value)} (${pct.toFixed(1)}%)`}
            />
          );
        })}
      </div>
      <figcaption className="grid grid-cols-1 gap-x-5 gap-y-1.5 sm:grid-cols-2">
        {visible.map((s) => (
          <span
            key={s.label}
            className="flex items-center gap-1.5 text-xs text-[color:var(--color-text-secondary)]"
          >
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-[3px]"
              style={{ background: s.color }}
              aria-hidden="true"
            />
            <span className="truncate">{s.label}</span>
            <span className="ml-auto shrink-0 font-medium tabular-nums text-[color:var(--color-text-primary)]">
              {format(s.value)}
            </span>
          </span>
        ))}
      </figcaption>
    </figure>
  );
}

/* ── 2. BracketScale — 누진 구간 스케일 + 현재 위치 마커 ────────────────── */

export interface BracketStep {
  /** 구간 상한 (null = 최상위 무한 구간) */
  upper: number | null;
  /** 세율 (0.06 = 6%) */
  rate: number;
}

interface BracketScaleProps {
  brackets: ReadonlyArray<BracketStep>;
  /** 현재 값 (과세표준 등) — 마커 위치 */
  value: number;
  /** 마커 옆 라벨 (예: "과세표준 5,000만 원") */
  markerLabel: string;
  ariaLabel: string;
}

/**
 * 구간 폭은 금액 비례가 아닌 균등 분할 — 최상위 구간(10억~)이
 * 화면을 다 차지하는 왜곡을 피하고 모든 세율이 읽히게 한다.
 * 마커는 해당 구간 안에서만 금액 선형 보간.
 */
export function BracketScale({
  brackets,
  value,
  markerLabel,
  ariaLabel,
}: BracketScaleProps): React.ReactElement | null {
  const n = brackets.length;
  if (n === 0) return null;

  const found = brackets.findIndex(
    (b) => b.upper === null || value <= b.upper,
  );
  const active = found === -1 ? n - 1 : found;
  const lower = active === 0 ? 0 : (brackets[active - 1]?.upper ?? 0);
  const upper = brackets[active]?.upper ?? null;
  const frac =
    upper === null || upper <= lower
      ? 0.5
      : Math.min(1, Math.max(0, (value - lower) / (upper - lower)));
  const pos = ((active + frac) / n) * 100;
  // 마커 라벨이 좌우로 잘리지 않게 가장자리에서 안쪽으로 클램프
  const labelPos = Math.min(88, Math.max(12, pos));

  return (
    <figure role="img" aria-label={ariaLabel} className="pt-1">
      <div className="relative">
        <div className="flex h-2.5 w-full gap-px overflow-hidden rounded-full">
          {brackets.map((_, i) => (
            <div
              key={i}
              className="h-full flex-1"
              style={{
                background:
                  i < active
                    ? "var(--chart-1)"
                    : i === active
                      ? "var(--chart-5)"
                      : "var(--chart-grid)",
                opacity: i < active ? 0.45 : 1,
              }}
            />
          ))}
        </div>
        {/* 현재 위치 마커 */}
        <div
          aria-hidden="true"
          className="absolute -top-1 h-4 w-0.5 rounded-full bg-[color:var(--color-text-primary)]"
          style={{ left: `${pos}%` }}
        />
      </div>
      {/* 구간별 세율 눈금 */}
      <div className="mt-1.5 flex" aria-hidden="true">
        {brackets.map((b, i) => (
          <span
            key={i}
            className={`flex-1 text-center text-[10px] tabular-nums ${
              i === active
                ? "font-bold text-[color:var(--color-text-primary)]"
                : "text-[color:var(--color-text-muted)]"
            }`}
          >
            {Math.round(b.rate * 100)}%
          </span>
        ))}
      </div>
      <figcaption
        className="relative mt-1 h-4 text-[11px] font-medium text-[color:var(--color-text-secondary)]"
        aria-hidden="true"
      >
        <span
          className="absolute -translate-x-1/2 whitespace-nowrap"
          style={{ left: `${labelPos}%` }}
        >
          ▲ {markerLabel}
        </span>
      </figcaption>
    </figure>
  );
}

/* ── 3. TrendChart — SVG 라인/에어리어 차트 (시계열) ────────────────────── */

export interface TrendPoint {
  x: number;
  y: number;
}

export interface TrendSeries {
  name: string;
  /** CSS color 값 — 반드시 var(--chart-N) 사용 */
  color: string;
  points: ReadonlyArray<TrendPoint>;
  /** true 면 선 아래 은은한 area fill */
  fill?: boolean;
}

interface TrendChartProps {
  series: ReadonlyArray<TrendSeries>;
  formatX: (x: number) => string;
  formatY: (y: number) => string;
  ariaLabel: string;
}

const W = 560;
const H = 236;
const PAD_L = 64;
const PAD_R = 10;
const PAD_T = 14;
const PAD_B = 26;

export function TrendChart({
  series,
  formatX,
  formatY,
  ariaLabel,
}: TrendChartProps): React.ReactElement | null {
  const all = series.flatMap((s) => s.points);
  if (all.length < 2) return null;

  let xMin = Infinity;
  let xMax = -Infinity;
  let yTop = 1;
  for (const p of all) {
    if (p.x < xMin) xMin = p.x;
    if (p.x > xMax) xMax = p.x;
    if (p.y > yTop) yTop = p.y;
  }
  const yMax = yTop * 1.04;
  const xSpan = xMax - xMin || 1;

  const sx = (x: number): number =>
    PAD_L + ((x - xMin) / xSpan) * (W - PAD_L - PAD_R);
  const sy = (y: number): number =>
    PAD_T + (1 - y / yMax) * (H - PAD_T - PAD_B);

  const linePath = (points: ReadonlyArray<TrendPoint>): string =>
    points
      .map((p, i) => `${i === 0 ? "M" : "L"}${sx(p.x).toFixed(1)} ${sy(p.y).toFixed(1)}`)
      .join("");

  const areaPath = (points: ReadonlyArray<TrendPoint>): string => {
    const first = points[0];
    const last = points[points.length - 1];
    if (!first || !last) return "";
    return `${linePath(points)}L${sx(last.x).toFixed(1)} ${sy(0).toFixed(1)}L${sx(first.x).toFixed(1)} ${sy(0).toFixed(1)}Z`;
  };

  const yTicks = [0.25, 0.5, 0.75, 1].map((f) => yTop * f);
  const xTicks: ReadonlyArray<{ x: number; anchor: "start" | "middle" | "end" }> = [
    { x: xMin, anchor: "start" },
    { x: xMin + xSpan / 2, anchor: "middle" },
    { x: xMax, anchor: "end" },
  ];

  return (
    <figure className="space-y-2">
      {series.length > 1 && (
        <figcaption className="flex flex-wrap gap-x-4 gap-y-1">
          {series.map((s) => (
            <span
              key={s.name}
              className="flex items-center gap-1.5 text-xs text-[color:var(--color-text-secondary)]"
            >
              <span
                className="h-0.5 w-4 shrink-0 rounded-full"
                style={{ background: s.color }}
                aria-hidden="true"
              />
              {s.name}
            </span>
          ))}
        </figcaption>
      )}
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label={ariaLabel}
      >
        <title>{ariaLabel}</title>
        {/* 그리드 + y 라벨 */}
        <line
          x1={PAD_L}
          y1={sy(0)}
          x2={W - PAD_R}
          y2={sy(0)}
          stroke="var(--chart-grid)"
          strokeWidth="1"
        />
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={PAD_L}
              y1={sy(t)}
              x2={W - PAD_R}
              y2={sy(t)}
              stroke="var(--chart-grid)"
              strokeWidth="1"
            />
            <text
              x={PAD_L - 8}
              y={sy(t) + 3.5}
              textAnchor="end"
              fontSize="10.5"
              fill="var(--color-text-muted)"
            >
              {formatY(t)}
            </text>
          </g>
        ))}
        {/* x 라벨 */}
        {xTicks.map((t) => (
          <text
            key={t.x}
            x={sx(t.x)}
            y={H - 8}
            textAnchor={t.anchor}
            fontSize="10.5"
            fill="var(--color-text-muted)"
          >
            {formatX(t.x)}
          </text>
        ))}
        {/* 시리즈 */}
        {series.map((s) => (
          <g key={s.name}>
            {s.fill && (
              <path d={areaPath(s.points)} fill={s.color} fillOpacity="0.12" />
            )}
            <path
              d={linePath(s.points)}
              fill="none"
              stroke={s.color}
              strokeWidth="2"
              strokeLinejoin="round"
            />
          </g>
        ))}
      </svg>
    </figure>
  );
}
