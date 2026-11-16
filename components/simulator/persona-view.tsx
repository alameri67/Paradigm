"use client";

import { TiltCard } from "@/components/ui/card-7";
import { Fade, MoodTag, PortraitImage, VOICES } from "./bits";
import { useSimulator } from "./simulator-context";

export function PersonaView() {
  const { sim, state, setLevel } = useSimulator();
  const sec = sim.sector(state.sectorId)!;
  const res = sim.resolve(state.sectorId, state.traits);
  const r = sim.response(res, state.level);
  const lv = sim.data.levels[state.level];
  if (!res || !r) return <p className="fg2">No responses for this sector yet.</p>;

  return (
    <>
      <section className="hero" aria-label="Persona">
        <div className="tilt">
          <TiltCard className={"portrait" + (sec.portraitUrl ? "" : " empty")}>
            <PortraitImage sector={sec} iconSize={64} />
          </TiltCard>
        </div>
        <div className="hero-body">
          <div className="id">
            <h1 className="t-display">{sec.role}</h1>
            <span className="sector-line">
              {sec.name}
              {res.persona.title ? ` · ${res.persona.title}` : ""}
            </span>
            <div className="mood-line" style={{ marginTop: 6 }}>
              <Fade as="span" text={r.mood}>
                <MoodTag mood={r.mood} />
              </Fade>
              <span className="fg2">
                at <span className="mono">{lv.code}</span> · {lv.description}
              </span>
            </div>
          </div>
          <div className="says">
            <h2 className="label">Says</h2>
            <Fade className="quote" text={r.say}>
              “{r.say}”
            </Fade>
          </div>
          <div className="voice-grid">
            {VOICES.map(([k, label]) => (
              <div className="voice-cell" key={k}>
                <h2 className="label">{label}</h2>
                <Fade className="prose" text={r[k]}>
                  {r[k]}
                </Fade>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" aria-labelledby="lv-h">
        <h2 className="t-section" id="lv-h">
          All five levels
        </h2>
        <div className="strip">
          {sim.data.levels.map((l, i) => {
            const ri = sim.response(res, i);
            const on = i === state.level;
            if (!ri) return null;
            return (
              <button
                key={l.code}
                type="button"
                className={"lvl" + (on ? " on" : "")}
                aria-pressed={on}
                onClick={() => setLevel(i)}
              >
                <span className="lvl-top">
                  <span className="mono">{l.code}</span>
                  <span className="lvl-name">{l.name}</span>
                  <span className="mono lvl-year">{l.year}</span>
                </span>
                <MoodTag mood={ri.mood} />
                <span className="lvl-say">“{ri.say}”</span>
              </button>
            );
          })}
        </div>
      </section>
    </>
  );
}
