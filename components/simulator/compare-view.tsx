"use client";

import { GlowButton } from "@/components/ui/glow-controls";
import { Fade, MoodTag, PortraitImage, VOICES } from "./bits";
import { Icon } from "./icons";
import { useSimulator } from "./simulator-context";

export function CompareView() {
  const { sim, state, setCompare } = useSimulator();
  const cols = state.compare ?? [];
  const n = cols.length;

  function update(ci: number, patch: Partial<(typeof cols)[number]>) {
    setCompare(cols.map((c, i) => (i === ci ? { ...c, ...patch } : c)));
  }
  function add() {
    if (n >= 3) return;
    const used = new Set(cols.map((c) => c.sectorId));
    const next = sim.data.sectors.find((s) => !used.has(s.id));
    setCompare([...cols, { sectorId: next ? next.id : state.sectorId, traits: { ...state.traits } }]);
  }

  return (
    <>
      <div className="view-head">
        <h1 className="t-title">Compare</h1>
        {n < 3 && (
          <GlowButton onClick={add}>
            <Icon name="plus" />
            Add persona
          </GlowButton>
        )}
      </div>
      <div className={`cmp-grid n${n}`}>
        {cols.map((c, ci) => {
          const sec = sim.sector(c.sectorId)!;
          const res = sim.resolve(c.sectorId, c.traits);
          const r = sim.response(res, state.level);
          const letter = String.fromCharCode(65 + ci);
          return (
            <article className="cmp-col" aria-label={`Persona ${letter}`} key={ci}>
              <div className="cmp-controls">
                <div className="cmp-colhead">
                  <span className="label">Persona {letter}</span>
                  {n > 2 && (
                    <GlowButton
                      icon
                      size="sm"
                      aria-label={`Remove persona ${letter}`}
                      onClick={() => setCompare(cols.filter((_, i) => i !== ci))}
                    >
                      <Icon name="x" />
                    </GlowButton>
                  )}
                </div>
                <div className="fields">
                  <label className="field wide">
                    <span className="label">Sector</span>
                    <span className="select">
                      <select value={c.sectorId} onChange={(e) => update(ci, { sectorId: e.target.value })}>
                        {sim.data.sectors.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                      <Icon name="down" />
                    </span>
                  </label>
                  {sim.data.traits.map((t) => (
                    <label className="field" key={t.key}>
                      <span className="label">{t.label}</span>
                      <span className="select">
                        <select
                          value={c.traits[t.key] ?? 0}
                          onChange={(e) => update(ci, { traits: { ...c.traits, [t.key]: +e.target.value } })}
                        >
                          {t.options.map((o, j) => (
                            <option key={o} value={j}>
                              {o}
                            </option>
                          ))}
                        </select>
                        <Icon name="down" />
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="cmp-id">
                <div className="avatar">
                  <PortraitImage sector={sec} iconSize={24} />
                </div>
                <div className="cmp-id-text">
                  <span className="t-section">{sec.role}</span>
                  <span className="t-ui fg2">{res?.persona.title || sec.name}</span>
                </div>
              </div>
              {r ? (
                <>
                  <div className="mood-line">
                    <Fade as="span" text={r.mood}>
                      <MoodTag mood={r.mood} />
                    </Fade>
                  </div>
                  <div className="cmp-voice">
                    <div className="cmp-block">
                      <span className="label">Says</span>
                      <Fade className="cmp-quote" text={r.say}>
                        “{r.say}”
                      </Fade>
                    </div>
                    {VOICES.map(([k, label]) => (
                      <div className="cmp-block" key={k}>
                        <span className="label">{label}</span>
                        <Fade className="t-control" text={r[k]}>
                          {r[k]}
                        </Fade>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="fg2" style={{ gridRow: "span 5" }}>
                  No responses for this sector yet.
                </p>
              )}
            </article>
          );
        })}
      </div>
    </>
  );
}
