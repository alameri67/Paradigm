"use client";

import { LiquidGlassNavbar } from "@/components/ui/liquid-glass-navbar";
import { Fade, MoodTag, pad2 } from "./bits";
import { useSimulator } from "./simulator-context";

const ORDER_ITEMS = [{ label: "List order" }, { label: "Most affected" }];

export function OverviewView() {
  const { sim, state, setOrder, setSector, setView } = useSimulator();

  const rows = sim.data.sectors.map((s, i) => {
    const r = sim.response(sim.resolve(s.id, state.traits), state.level);
    return { s, i, r, m: r ? sim.mood(r.mood).index : -1 };
  });
  if (state.order === "impact") rows.sort((a, b) => b.m - a.m || a.i - b.i);
  const counts = sim.data.moods.map((m) => ({ m, n: rows.filter((x) => x.r?.mood === m.key).length }));

  return (
    <>
      <div className="view-head">
        <h1 className="t-title">Sector overview</h1>
        <div className="trait">
          <span className="label" id="ord-l">
            Order
          </span>
          <LiquidGlassNavbar
            mode="radio"
            size="sm"
            labelledBy="ord-l"
            items={ORDER_ITEMS}
            active={state.order === "impact" ? 1 : 0}
            onChange={(i) => setOrder(i ? "impact" : "list")}
          />
        </div>
      </div>
      <div className="ov-summary">
        {counts.map((c) => (
          <span key={c.m.key} style={{ display: "inline-flex", gap: 8, alignItems: "center" }}>
            <MoodTag mood={c.m.key} />
            <span className="mono">{c.n}</span>
          </span>
        ))}
      </div>
      <div className="ov-grid">
        {rows.map((x) => (
          <button
            key={x.s.id}
            type="button"
            className="ov-card"
            onClick={() => {
              setSector(x.s.id);
              setView("persona");
            }}
          >
            <span className="ov-head">
              <span className="mono">{pad2(x.i + 1)}</span>
              <span>{x.s.name}</span>
            </span>
            <span className="ov-role">{x.s.role}</span>
            {x.r && (
              <Fade as="span" className="ov-say" text={x.r.say}>
                “{x.r.say}”
              </Fade>
            )}
            <span className="ov-foot">{x.r ? <MoodTag mood={x.r.mood} /> : <span className="fg2">No data yet</span>}</span>
          </button>
        ))}
      </div>
    </>
  );
}
