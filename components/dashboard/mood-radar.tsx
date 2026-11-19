"use client";

import { percent } from "@/lib/format";
import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { MOODS, MOOD_ACCENT, MOOD_LABEL, type MoodKey } from "@/lib/workers/types";
import { DashIcon } from "./icons";

/**
 * How a group feels, as a radar: one corner per mood, calm at the top and on round the clock to
 * panicked. Each corner shows the mood's face, name and share. Built on the c-chart-24 pattern, with a
 * smooth, round-cornered shape and round grid rings.
 */
const config = { share: { label: "Share", color: "#0d0d0d" } } satisfies ChartConfig;

type Row = { key: MoodKey; mood: string; share: number; count: number };

type Pt = { x: number; y: number };

/**
 * A closed, smooth curve through every point (centripetal Catmull-Rom as cubic Béziers), so the shape
 * has rounded corners but still passes through each mood's dot. The centripetal form never loops or
 * overshoots into a cusp, even when a mood sits at 0% in the middle.
 */
function smoothClosedPath(points: Pt[]) {
  const n = points.length;
  if (n < 3) return "";
  const dist = (a: Pt, b: Pt) => Math.sqrt(Math.hypot(b.x - a.x, b.y - a.y)); // alpha = 0.5
  const tiny = 1e-6;
  let d = `M${points[0].x},${points[0].y}`;
  for (let i = 0; i < n; i++) {
    const p0 = points[(i - 1 + n) % n];
    const p1 = points[i];
    const p2 = points[(i + 1) % n];
    const p3 = points[(i + 2) % n];
    const d1 = dist(p0, p1);
    const d2 = dist(p1, p2);
    const d3 = dist(p2, p3);
    if (d2 < tiny) continue; // the same point twice: nothing to draw
    const c1 =
      d1 < tiny
        ? p1
        : {
            x: (d1 * d1 * p2.x - d2 * d2 * p0.x + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1.x) / (3 * d1 * (d1 + d2)),
            y: (d1 * d1 * p2.y - d2 * d2 * p0.y + (2 * d1 * d1 + 3 * d1 * d2 + d2 * d2) * p1.y) / (3 * d1 * (d1 + d2)),
          };
    const c2 =
      d3 < tiny
        ? p2
        : {
            x: (d3 * d3 * p1.x - d2 * d2 * p3.x + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2.x) / (3 * d3 * (d3 + d2)),
            y: (d3 * d3 * p1.y - d2 * d2 * p3.y + (2 * d3 * d3 + 3 * d3 * d2 + d2 * d2) * p2.y) / (3 * d3 * (d3 + d2)),
          };
    d += ` C${c1.x},${c1.y} ${c2.x},${c2.y} ${p2.x},${p2.y}`;
  }
  return d + "Z";
}

/** The mood shape: a smooth closed curve instead of a sharp-cornered polygon. */
function SmoothShape({ points, fill, stroke, strokeWidth }: { points?: Pt[]; fill?: string; stroke?: string; strokeWidth?: number }) {
  if (!points?.length) return null;
  return <path d={smoothClosedPath(points)} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinejoin="round" />;
}

/** The label at each corner: face, name and share, placed just outside the web. */
function Corner({ x, y, payload, rows }: { x?: number; y?: number; payload?: { value: string }; textAnchor?: string; rows: Row[] }) {
  const r = rows.find((row) => row.mood === payload?.value);
  if (!r || x === undefined || y === undefined) return null;
  const w = 96;
  const h = 46;
  return (
    <foreignObject x={x - w / 2} y={y - h / 2} width={w} height={h} style={{ overflow: "visible" }}>
      <div className="mr-corner">
        <span className="mr-face" style={{ color: MOOD_ACCENT[r.key] }}>
          <DashIcon name={r.key} size={18} stroke={1.9} />
        </span>
        <span className="mr-name">{r.mood}</span>
        <span className="mr-pct">{percent(r.share / 100)}</span>
      </div>
    </foreignObject>
  );
}

export function MoodRadar({ moods, n }: { moods: Record<MoodKey, number>; n: number }) {
  const rows: Row[] = MOODS.map((m) => ({ key: m, mood: MOOD_LABEL[m], count: moods[m], share: n ? (moods[m] / n) * 100 : 0 }));
  // Scale to the biggest share so the shape fills the web, but never past 100%.
  const top = Math.min(100, Math.max(40, Math.ceil(Math.max(...rows.map((r) => r.share)) / 10) * 10));
  return (
    <ChartContainer config={config} className="mx-auto aspect-square w-full max-w-[420px]" aria-label={rows.map((r) => `${r.mood} ${percent(r.share / 100)}`).join(", ")}>
      <RadarChart data={rows} outerRadius="72%" margin={{ top: 18, right: 30, bottom: 18, left: 30 }}>
        <defs>
          <linearGradient id="mood-radar-fill" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-share)" stopOpacity={0.22} />
            <stop offset="100%" stopColor="var(--color-share)" stopOpacity={0.06} />
          </linearGradient>
        </defs>
        <ChartTooltip
          cursor={false}
          content={({ active, payload }) => {
            const r = active ? (payload?.[0]?.payload as Row | undefined) : undefined;
            if (!r) return null;
            return (
              <div className="mr-tip">
                <span className="ws-dot" style={{ background: MOOD_ACCENT[r.key] }} aria-hidden="true" />
                <b>{r.mood}</b> {r.count} of {n} people
              </div>
            );
          }}
        />
        <PolarGrid gridType="circle" strokeDasharray="3 3" stroke="#e4e4e4" />
        <PolarAngleAxis dataKey="mood" tick={(p) => <Corner {...p} rows={rows} />} />
        <PolarRadiusAxis angle={90} domain={[0, top]} tick={false} axisLine={false} />
        <Radar
          dataKey="share"
          fill="url(#mood-radar-fill)"
          stroke="var(--color-share)"
          strokeWidth={2}
          isAnimationActive={false}
          shape={(p: unknown) => <SmoothShape {...(p as { points?: Pt[] })} fill="url(#mood-radar-fill)" stroke="var(--color-share)" strokeWidth={2} />}
          dot={(p: { cx?: number; cy?: number; index?: number }) => {
            // Recharts hands over the point's position; the row comes from its index.
            const r = rows[p.index ?? 0];
            return <circle key={p.index} cx={p.cx} cy={p.cy} r={5} fill={r ? MOOD_ACCENT[r.key] : "#fff"} stroke="#fff" strokeWidth={2} />;
          }}
        />
      </RadarChart>
    </ChartContainer>
  );
}
