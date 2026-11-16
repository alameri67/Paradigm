"use client";

import { useSyncExternalStore } from "react";
import { briefText } from "@/lib/sim/brief";
import { MoodTag, PortraitImage, VOICES } from "./bits";
import { Icon } from "./icons";
import { useSimulator } from "./simulator-context";

const noop = () => () => {};

/** The one-page executive brief. Also rendered into #print-root for printing. */
export function BriefDocument() {
  const { sim, state } = useSimulator();
  const sec = sim.sector(state.sectorId);
  const res = sim.resolve(state.sectorId, state.traits);
  const r = sim.response(res, state.level);
  const lv = sim.data.levels[state.level];
  // Date is client-only so the server render and hydration agree.
  const date = useSyncExternalStore(
    noop,
    () => new Date().toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }),
    () => "",
  );
  if (!sec || !res || !r) return null;

  return (
    <article className="brief" aria-label="Executive brief">
      <div className="brief-top">
        <span className="label">Executive brief · AI Transition Simulator</span>
        <span className="mono t-caption fg2">{date}</span>
      </div>
      <div className="brief-head">
        <div className="brief-portrait">
          <PortraitImage sector={sec} iconSize={32} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, minWidth: 0, flex: 1 }}>
          <div>
            <h1 className="t-display">{sec.role}</h1>
            <p className="sector-line">
              {sec.name}
              {res.persona.title ? ` · ${res.persona.title}` : ""}
            </p>
          </div>
          <dl className="brief-meta">
            {sim.data.traits.map((t) => (
              <div key={t.key}>
                <dt className="label">{t.label}</dt>
                <dd>{t.options[state.traits[t.key] ?? 0]}</dd>
              </div>
            ))}
            <div>
              <dt className="label">Scenario</dt>
              <dd>
                <span className="mono">{lv.code}</span> · {lv.name} <span className="mono fg2">{lv.year}</span>
              </dd>
            </div>
            <div>
              <dt className="label">Mood</dt>
              <dd>
                <MoodTag mood={r.mood} />
              </dd>
            </div>
          </dl>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="label">Says</span>
        <p className="t-display">“{r.say}”</p>
        <p className="t-ui fg2">{lv.description}.</p>
      </div>
      <div className="brief-cols">
        {VOICES.map(([k, label]) => (
          <div key={k} style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <span className="label">{label}</span>
            <p>{r[k]}</p>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        <span className="label">All five levels</span>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Level</th>
                <th>Year</th>
                <th>Mood</th>
                <th>Says</th>
              </tr>
            </thead>
            <tbody>
              {sim.data.levels.map((l, i) => {
                const ri = sim.response(res, i);
                if (!ri) return null;
                return (
                  <tr key={l.code} className={i === state.level ? "on" : undefined}>
                    <td style={{ whiteSpace: "nowrap" }}>
                      <span className="mono">{l.code}</span> {l.name}
                    </td>
                    <td className="mono">{l.year}</td>
                    <td>
                      <MoodTag mood={ri.mood} sm />
                    </td>
                    <td>“{ri.say}”</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </article>
  );
}

export function BriefView() {
  const { sim, state, setView, toast } = useSimulator();

  async function copy() {
    const text = briefText(sim, state.sectorId, state.traits, state.level);
    try {
      await navigator.clipboard.writeText(text);
      toast("Brief copied");
    } catch {
      toast("Copying is blocked here. Select the brief and copy it yourself.");
    }
  }

  return (
    <>
      <div className="brief-bar">
        <button type="button" className="lq-btn" onClick={() => setView("persona")}>
          <Icon name="back" />
          Back to persona
        </button>
        <div className="group">
          <button type="button" className="lq-btn" onClick={copy}>
            <Icon name="copy" />
            Copy as text
          </button>
          <button type="button" className="lq-btn primary" onClick={() => window.print()}>
            <Icon name="printer" />
            Print
          </button>
        </div>
      </div>
      <BriefDocument />
    </>
  );
}
