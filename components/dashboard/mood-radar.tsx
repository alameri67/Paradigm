"use client";

import { PolarAngleAxis, PolarGrid, PolarRadiusAxis, Radar, RadarChart } from "recharts";
import { ChartContainer, ChartTooltip, type ChartConfig } from "@/components/ui/chart";
import { MOODS, MOOD_ACCENT, MOOD_LABEL, type MoodKey } from "@/lib/workers/types";
import { DashIcon } from "./icons";

/**
 * How a group feels, as a radar: one corner per mood, calm at the top and on round the clock to
 * panicked. Each corner shows the mood's face, name and share. Built on the c-chart-24 pattern.
 */
const config = { share: { label: "Share", color: "#0d0d0d" } } satisfies ChartConfig;

type Row = { key: MoodKey; mood: string; share: number; count: number };

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
        <span className="mr-pct">{Math.round(r.share)}%</span>
      </div>
    </foreignObject>
  );
}

export function MoodRadar({ moods, n }: { moods: Record<MoodKey, number>; n: number }) {
  const rows: Row[] = MOODS.map((m) => ({ key: m, mood: MOOD_LABEL[m], count: moods[m], share: n ? (moods[m] / n) * 100 : 0 }));
  // Scale to the biggest share so the shape fills the web, but never past 100%.
  const top = Math.min(100, Math.max(40, Math.ceil(Math.max(...rows.map((r) => r.share)) / 10) * 10));
  return (
    <ChartContainer config={config} className="mx-auto aspect-square w-full max-w-[420px]" aria-label={rows.map((r) => `${r.mood} ${Math.round(r.share)}%`).join(", ")}>
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
        <PolarGrid strokeDasharray="3 3" stroke="#e4e4e4" />
        <PolarAngleAxis dataKey="mood" tick={(p) => <Corner {...p} rows={rows} />} />
        <PolarRadiusAxis angle={90} domain={[0, top]} tick={false} axisLine={false} />
        <Radar
          dataKey="share"
          fill="url(#mood-radar-fill)"
          stroke="var(--color-share)"
          strokeWidth={2}
          isAnimationActive={false}
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
