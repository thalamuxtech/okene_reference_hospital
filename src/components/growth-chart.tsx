'use client';

/**
 * Minimal dependency-free growth chart (SVG). Plots a single series of
 * {ageWeeks, value} against a lightly-tinted WHO-style reference band so
 * clinicians can see whether the neonate is tracking within normal limits.
 * Not a replacement for a proper WHO z-score chart, but good enough for
 * a UI glance.
 */
export type GrowthSeriesPoint = { ageWeeks: number; value: number };

export function GrowthChart({
  title,
  unit,
  points,
  low,
  high,
  color = '#0D9488',
  width = 560,
  height = 220
}: {
  title: string;
  unit: string;
  points: GrowthSeriesPoint[];
  /** Reference band ends as (ageWeeks, value) pairs. */
  low: GrowthSeriesPoint[];
  high: GrowthSeriesPoint[];
  color?: string;
  width?: number;
  height?: number;
}) {
  const pad = { l: 40, r: 16, t: 20, b: 28 };
  const innerW = width - pad.l - pad.r;
  const innerH = height - pad.t - pad.b;

  const all = [...points, ...low, ...high];
  const maxX = Math.max(52, ...all.map((p) => p.ageWeeks));
  const maxY = Math.max(1, ...all.map((p) => p.value));
  const minY = Math.max(0, Math.min(...all.map((p) => p.value), 0));

  const x = (v: number) => pad.l + (v / maxX) * innerW;
  const y = (v: number) => pad.t + innerH - ((v - minY) / (maxY - minY || 1)) * innerH;

  const toPath = (pts: GrowthSeriesPoint[]) =>
    pts
      .slice()
      .sort((a, b) => a.ageWeeks - b.ageWeeks)
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.ageWeeks).toFixed(1)} ${y(p.value).toFixed(1)}`)
      .join(' ');

  const bandPath = (() => {
    const sortedLow = [...low].sort((a, b) => a.ageWeeks - b.ageWeeks);
    const sortedHigh = [...high].sort((a, b) => b.ageWeeks - a.ageWeeks);
    if (!sortedLow.length || !sortedHigh.length) return '';
    const lp = sortedLow
      .map((p, i) => `${i === 0 ? 'M' : 'L'} ${x(p.ageWeeks).toFixed(1)} ${y(p.value).toFixed(1)}`)
      .join(' ');
    const hp = sortedHigh
      .map((p) => `L ${x(p.ageWeeks).toFixed(1)} ${y(p.value).toFixed(1)}`)
      .join(' ');
    return `${lp} ${hp} Z`;
  })();

  const yTicks = 4;
  const xTicks = Math.min(8, maxX);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <div className="mb-2 flex items-center justify-between">
        <h4 className="text-sm font-bold text-slate-900">{title}</h4>
        <span className="text-[11px] uppercase tracking-wider text-slate-500">
          Age (weeks) × {unit}
        </span>
      </div>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        {/* Reference band */}
        {bandPath && <path d={bandPath} fill={color} opacity={0.08} />}

        {/* Axes */}
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const val = minY + ((maxY - minY) * i) / yTicks;
          const yy = y(val);
          return (
            <g key={`y${i}`}>
              <line
                x1={pad.l}
                x2={width - pad.r}
                y1={yy}
                y2={yy}
                stroke="#E2E8F0"
                strokeDasharray="2 3"
              />
              <text x={pad.l - 6} y={yy + 3} textAnchor="end" fontSize="10" fill="#64748B">
                {val.toFixed(1)}
              </text>
            </g>
          );
        })}
        {Array.from({ length: xTicks + 1 }).map((_, i) => {
          const val = Math.round((maxX * i) / xTicks);
          const xx = x(val);
          return (
            <text
              key={`x${i}`}
              x={xx}
              y={height - 8}
              textAnchor="middle"
              fontSize="10"
              fill="#64748B"
            >
              {val}
            </text>
          );
        })}

        {/* Line + points */}
        {points.length > 0 && (
          <>
            <path d={toPath(points)} fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
            {points.map((p, i) => (
              <circle
                key={i}
                cx={x(p.ageWeeks)}
                cy={y(p.value)}
                r={3.5}
                fill="white"
                stroke={color}
                strokeWidth={1.8}
              />
            ))}
          </>
        )}
      </svg>
      {points.length === 0 && (
        <p className="mt-2 text-center text-xs text-slate-500">No data yet — add a reading to start the chart.</p>
      )}
    </div>
  );
}

/**
 * Rough weight-for-age reference for term neonates (approx WHO 3rd–97th
 * percentile band, kg). For a UI "tracking" glance only.
 */
export const NEONATE_WEIGHT_REF = {
  low: [
    { ageWeeks: 0, value: 2.5 },
    { ageWeeks: 4, value: 3.4 },
    { ageWeeks: 8, value: 4.3 },
    { ageWeeks: 13, value: 5.2 },
    { ageWeeks: 26, value: 6.4 },
    { ageWeeks: 39, value: 7.1 },
    { ageWeeks: 52, value: 7.7 }
  ],
  high: [
    { ageWeeks: 0, value: 4.3 },
    { ageWeeks: 4, value: 5.7 },
    { ageWeeks: 8, value: 7.0 },
    { ageWeeks: 13, value: 8.3 },
    { ageWeeks: 26, value: 10.0 },
    { ageWeeks: 39, value: 11.0 },
    { ageWeeks: 52, value: 11.8 }
  ]
};

export const NEONATE_HEIGHT_REF = {
  low: [
    { ageWeeks: 0, value: 46 },
    { ageWeeks: 4, value: 50 },
    { ageWeeks: 13, value: 57 },
    { ageWeeks: 26, value: 63 },
    { ageWeeks: 52, value: 70 }
  ],
  high: [
    { ageWeeks: 0, value: 54 },
    { ageWeeks: 4, value: 58 },
    { ageWeeks: 13, value: 66 },
    { ageWeeks: 26, value: 72 },
    { ageWeeks: 52, value: 80 }
  ]
};

export const NEONATE_HEAD_REF = {
  low: [
    { ageWeeks: 0, value: 32 },
    { ageWeeks: 4, value: 35 },
    { ageWeeks: 13, value: 38 },
    { ageWeeks: 26, value: 41 },
    { ageWeeks: 52, value: 43 }
  ],
  high: [
    { ageWeeks: 0, value: 37 },
    { ageWeeks: 4, value: 39 },
    { ageWeeks: 13, value: 43 },
    { ageWeeks: 26, value: 46 },
    { ageWeeks: 52, value: 48 }
  ]
};
