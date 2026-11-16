"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Icon, type IconName } from "@/components/simulator/icons";
import { AmountSlider } from "@/components/ui/amount-slider";
import { ScatterBrush, type Brush } from "@/components/ui/bjork-scatter-brush";
import { Avatar, SHORT_SECTOR } from "@/components/workers/avatar";
import { DashIcon, hasDashIcon } from "./icons";
import { pointsFor, summarize, type Summary } from "@/lib/workers/dashboard";
import {
  ACTION_LABEL,
  MOODS,
  MOOD_ACCENT,
  MOOD_LABEL,
  SCENARIOS,
  type Archetype,
  type InterviewSummary,
  type ScenarioCode,
} from "@/lib/workers/types";

const CODES = SCENARIOS.map((s) => s.code) as ScenarioCode[];
const SCENARIO_ICON: Record<ScenarioCode, IconName> = { S0: "plateau", S1: "trend", S4: "hourglass", S3: "clock", S2: "zap" };
const STOPS = SCENARIOS.map((s) => ({
  code: s.code,
  name: s.name,
  year: s.when,
  description: s.description,
  icon: <Icon name={SCENARIO_ICON[s.code]} size={18} />,
}));
const scenarioOf = (code: ScenarioCode) => SCENARIOS[CODES.indexOf(code)];
const pct = (x: number) => `${Math.round(x * 100)}%`;
const people = (n: number) => (n === 1 ? "1 person" : `${n} people`);

/** Ticks sit on whole moods; half-way gridlines get no word. Points never land exactly half-way (see JITTER_X). */
function formatWorry(v: number) {
  const r = Math.round(v);
  if (Math.abs(v - r) > 0.499 || r < 1 || r > 5) return "";
  return MOOD_LABEL[MOODS[r - 1]];
}
const formatAction = (v: number) => String(Math.round(v));

function inBrush(p: { x: number; y: number }, b: Brush | null) {
  if (!b) return true;
  return p.x >= Math.min(b.x0, b.x1) && p.x <= Math.max(b.x0, b.x1) && p.y >= Math.min(b.y0, b.y1) && p.y <= Math.max(b.y0, b.y1);
}

function CardHead({ icon, title, note }: { icon: "actions" | "mood" | "jobs" | "quote"; title: string; note?: string }) {
  return (
    <div className="db-card-head">
      <span className="db-card-icon">
        <DashIcon name={icon} size={16} />
      </span>
      <h3 className="db-card-title">{title}</h3>
      {note && <span className="db-card-note">{note}</span>}
    </div>
  );
}

function Insights({ s, archetypes }: { s: Summary; archetypes: Archetype[] }) {
  if (!s.n) {
    return (
      <div className="db-cards">
        <div className="db-card db-card-empty">
          <p>No one is inside your selection. Drag a bigger box, or click an empty spot on the chart to start again.</p>
        </div>
      </div>
    );
  }
  const topActions = s.actions.slice(0, 5);
  return (
    <div className="db-cards">
      <section className="db-card" aria-label="What they do most">
        <CardHead icon="actions" title="What they do most" note={`Out of ${people(s.n)}`} />
        <ul className="db-rows">
          {topActions.map((a) => (
            <li key={a.tag} className="db-row">
              <span className="db-row-icon">
                <DashIcon name={hasDashIcon(a.tag) ? a.tag : "other"} size={16} />
              </span>
              <span className="db-row-text">
                <span className="db-row-name">{ACTION_LABEL[a.tag] ?? a.tag.replace(/-/g, " ")}</span>
                <span className="db-bar" aria-hidden="true">
                  <span style={{ width: pct(a.share) }} />
                </span>
              </span>
              <span className="db-row-num mono">{pct(a.share)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="db-card" aria-label="How they feel">
        <CardHead icon="mood" title="How they feel" />
        <div className="ws-moodbar db-moodbar" role="img" aria-label={MOODS.map((m) => `${MOOD_LABEL[m]} ${s.moods[m]}`).join(", ")}>
          {MOODS.filter((m) => s.moods[m] > 0).map((m) => (
            <span key={m} style={{ flexGrow: s.moods[m], background: MOOD_ACCENT[m] }} />
          ))}
        </div>
        <ul className="db-rows">
          {MOODS.map((m) => (
            <li key={m} className={"db-row db-row-mood" + (s.moods[m] ? "" : " none")}>
              <span className="ws-dot" style={{ background: MOOD_ACCENT[m] }} aria-hidden="true" />
              <span className="db-row-name">{MOOD_LABEL[m]}</span>
              <span className="db-row-num mono">
                {s.moods[m]} <span className="fg2">· {pct(s.moods[m] / s.n)}</span>
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section className="db-card" aria-label="Who they are">
        <CardHead icon="jobs" title="Who they are" />
        <ul className="db-rows">
          {s.jobs.map((j) => {
            const a = archetypes.find((x) => x.code === j.code);
            return (
              <li key={j.code} className="db-row">
                {a ? <Avatar a={a} size={32} /> : <span className="db-row-icon" />}
                <span className="db-row-text">
                  <span className="db-row-name">{j.job}</span>
                  <span className="db-row-sub">{a ? (SHORT_SECTOR[a.sector] ?? a.sector) : ""}</span>
                </span>
                <span className="db-row-num mono">
                  {j.count} <span className="fg2">· {pct(j.share)}</span>
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="db-card" aria-label="In their words">
        <CardHead icon="quote" title="In their words" />
        <div className="db-quotes">
          {s.quotes.map((q) => (
            <figure key={q.id} className="db-quote swap">
              <blockquote>“{q.text}”</blockquote>
              <figcaption>
                {q.name}, {q.job.toLowerCase()}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
    </div>
  );
}

export function Dashboard({ archetypes, people: everyone }: { archetypes: Archetype[]; people: InterviewSummary[] }) {
  const params = useSearchParams();
  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const p of everyone) c[p.archetype] = (c[p.archetype] ?? 0) + 1;
    return c;
  }, [everyone]);
  const withInterviews = archetypes.filter((a) => counts[a.code]);
  const without = archetypes.filter((a) => !counts[a.code]);

  const [scenario, setScenario] = useState<ScenarioCode>(() => {
    const s = params.get("s");
    return (CODES as string[]).includes(s ?? "") ? (s as ScenarioCode) : "S2";
  });
  const [jobs, setJobs] = useState<string[]>(() =>
    (params.get("jobs") ?? "")
      .split(",")
      .filter((c) => counts[c]),
  );
  const [brush, setBrush] = useState<Brush | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Shareable address bar.
  useEffect(() => {
    const q = new URLSearchParams({ s: scenario, ...(jobs.length ? { jobs: jobs.join(",") } : {}) }).toString();
    if (q !== window.location.search.slice(1)) window.history.replaceState(null, "", `?${q}`);
  }, [scenario, jobs]);

  const shown = useMemo(() => (jobs.length ? everyone.filter((p) => jobs.includes(p.archetype)) : everyone), [everyone, jobs]);
  const points = useMemo(() => pointsFor(shown, scenario), [shown, scenario]);
  const selected = useMemo(() => points.filter((p) => inBrush(p, brush)).map((p) => p.person), [points, brush]);
  const summary = useMemo(() => summarize(selected, scenario), [selected, scenario]);
  const chartPoints = useMemo(() => points.map(({ id, x, y, label }) => ({ id, x, y, label })), [points]);

  const toggleJob = (code: string) => {
    setJobs((j) => (j.includes(code) ? j.filter((c) => c !== code) : [...j, code]));
    setBrush(null);
  };
  const sc = scenarioOf(scenario);

  return (
    <>
      <section className="db-block" aria-labelledby="db-jobs">
        <h2 className="label" id="db-jobs">
          Jobs
        </h2>
        <div className="db-chips">
          <button
            type="button"
            className={"db-chip db-chip-all" + (jobs.length === 0 ? " on" : "")}
            aria-pressed={jobs.length === 0}
            onClick={() => {
              setJobs([]);
              setBrush(null);
            }}
          >
            <span className="db-chip-name">All jobs</span>
            <span className="db-chip-count mono">{everyone.length}</span>
          </button>
          {withInterviews.map((a) => {
            const on = jobs.includes(a.code);
            return (
              <button key={a.code} type="button" className={"db-chip" + (on ? " on" : "")} aria-pressed={on} onClick={() => toggleJob(a.code)}>
                <Avatar a={a} size={28} />
                <span className="db-chip-name">{a.job}</span>
                <span className="db-chip-count mono" aria-label={`${counts[a.code]} interviewed`}>
                  {counts[a.code]}
                </span>
              </button>
            );
          })}
          {showAll &&
            without.map((a) => (
              <button key={a.code} type="button" className="db-chip" disabled title="No interviews yet">
                <Avatar a={a} size={28} />
                <span className="db-chip-name">{a.job}</span>
                <span className="db-chip-count mono">–</span>
              </button>
            ))}
          {without.length > 0 && (
            <button type="button" className="db-chip-more" aria-expanded={showAll} onClick={() => setShowAll((v) => !v)}>
              {showAll ? "Hide the jobs with no interviews yet" : `${without.length} more jobs, not interviewed yet`}
            </button>
          )}
        </div>
      </section>

      <section className="dialbar db-block">
        <span className="label" id="db-dial">
          AI scenario
        </span>
        <AmountSlider stops={STOPS} value={CODES.indexOf(scenario)} onChange={(i) => setScenario(CODES[i])} labelledBy="db-dial" showHeader={false} />
        <p className="ws-dial-desc" key={scenario}>
          <strong>{sc.name}.</strong> {sc.description}
        </p>
      </section>

      <section className="db-panel" aria-labelledby="db-chart-h">
        <div className="db-panel-head">
          <div>
            <h2 className="db-panel-title" id="db-chart-h">
              How worried people are, and how much they do about it
            </h2>
            <p className="db-panel-sub">
              Each dot is one person in {sc.name}. Further right means more worried. Higher up means they take bigger steps,
              like retraining or moving.
            </p>
          </div>
          <div className="db-panel-status" role="status">
            {brush ? (
              <>
                <span>
                  {selected.length} of {people(points.length)} in your selection
                </span>
                <button type="button" className="db-clear" onClick={() => setBrush(null)}>
                  Show everyone
                </button>
              </>
            ) : (
              <span>
                Showing all {people(points.length)}. Drag across the chart to look at a group.
              </span>
            )}
          </div>
        </div>
        {points.length ? (
          <ScatterBrush
            className="db-chart"
            points={chartPoints}
            xLabel="Worry"
            yLabel="Action taken"
            xDomain={[0.5, 5.5]}
            yDomain={[0, 100]}
            formatX={formatWorry}
            formatY={formatAction}
            brush={brush}
            onBrushChange={(b) => setBrush(b)}
            bins={20}
            height={440}
            tone="dark"
            ariaLabel={`Worry and action taken in ${sc.name}`}
          />
        ) : (
          <p className="db-panel-sub">No one has been interviewed for these jobs yet.</p>
        )}
      </section>

      <section className="db-block" aria-labelledby="db-ins-h">
        <h2 className="t-section" id="db-ins-h">
          {brush ? `Your selection in ${sc.name}` : `Everyone in ${sc.name}`}
        </h2>
        <Insights s={summary} archetypes={archetypes} />
        <p className="t-caption fg2">
          Everyone here is simulated: made-up versions of each job, interviewed by an AI interviewer. Shares are the part of
          the group that mentioned each step.
        </p>
      </section>
    </>
  );
}
