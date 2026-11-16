"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon, type IconName } from "@/components/simulator/icons";
import { AmountSlider } from "@/components/ui/amount-slider";
import { ScatterBrush, type Brush } from "@/components/ui/bjork-scatter-brush";
import { Avatar, SHORT_SECTOR } from "@/components/workers/avatar";
import { DashIcon, hasDashIcon } from "./icons";
import { JobSidebar } from "@/components/workers/job-sidebar";
import { HelpTip } from "@/components/ui/help-tip";
import { ACTION_LEVELS, pointsFor, summarize, type Summary } from "@/lib/workers/dashboard";
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
function formatAction(v: number) {
  const r = Math.round(v);
  if (Math.abs(v - r) > 0.499 || r < 1 || r > 5) return "";
  return ACTION_LEVELS[r - 1];
}

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

export function Dashboard({
  archetypes,
  people: everyone,
  versionsPerJob,
}: {
  archetypes: Archetype[];
  people: InterviewSummary[];
  /** How many versions each job has (every mix of the five groups). */
  versionsPerJob: number;
}) {
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
  // No "jobs" in the address means every job with interviews; an empty "jobs" means none.
  const allCodes = withInterviews.map((a) => a.code);
  const [jobs, setJobs] = useState<string[]>(() =>
    params.has("jobs")
      ? (params.get("jobs") ?? "")
          .split(",")
          .filter((c) => counts[c])
      : allCodes,
  );
  const allOn = allCodes.length > 0 && allCodes.every((c) => jobs.includes(c));
  const [brush, setBrush] = useState<Brush | null>(null);
  const [showAll, setShowAll] = useState(false);

  // Shareable address bar.
  useEffect(() => {
    const q = new URLSearchParams({ s: scenario, ...(allOn ? {} : { jobs: jobs.join(",") }) }).toString();
    if (q !== window.location.search.slice(1)) window.history.replaceState(null, "", `?${q}`);
  }, [scenario, jobs, allOn]);

  const shown = useMemo(() => everyone.filter((p) => jobs.includes(p.archetype)), [everyone, jobs]);
  const points = useMemo(() => pointsFor(shown, scenario), [shown, scenario]);
  const selected = useMemo(() => points.filter((p) => inBrush(p, brush)).map((p) => p.person), [points, brush]);
  const summary = useMemo(() => summarize(selected, scenario), [selected, scenario]);
  const chartPoints = useMemo(() => points.map(({ id, x, y, label, person }) => ({ id, x, y, label, color: MOOD_ACCENT[person.scenarios[scenario].mood] })), [points, scenario]);

  const toggleJob = (code: string) => {
    setJobs((j) => (j.includes(code) ? j.filter((c) => c !== code) : [...j, code]));
    setBrush(null);
  };
  const setAll = (codes: string[]) => {
    setJobs(codes);
    setBrush(null);
  };
  const sc = scenarioOf(scenario);
  const picked = archetypes.filter((a) => jobs.includes(a.code));
  const detailsHref = `/details?${new URLSearchParams({ ...(jobs[0] ? { job: jobs[0] } : {}), s: scenario })}`;
  const scope =
    picked.length === 0
      ? "No jobs picked"
      : picked.length === 1
        ? `Every version of ${picked[0].job.toLowerCase()}`
        : allOn
          ? `Every version of ${picked.length === 2 ? "both" : `all ${picked.length}`} jobs interviewed so far`
          : `Every version of ${picked.length} jobs`;

  return (
    <div className="db-shell">
      <JobSidebar
        archetypes={archetypes}
        counts={counts}
        page="summary"
        selected={jobs}
        summaryHref={`/?s=${scenario}`}
        detailsHref={detailsHref}
        onToggle={toggleJob}
        onSelectAll={() => setAll(allCodes)}
        onUnselectAll={() => setAll([])}
      />
      <main className="db">
      <header className="db-head">
        <h1 className="t-display">
          Everyone interviewed, at a glance{" "}
          <HelpTip>
            Each job has {versionsPerJob} versions, one for every mix of age, work, savings, outlook and how they handle change.
            The summary takes in every version of the jobs you pick. Drag across the chart to look more closely at a group.
          </HelpTip>
        </h1>
      </header>
      <section className="db-block db-chips-block" aria-labelledby="db-jobs">
        <h2 className="label" id="db-jobs">
          Jobs
        </h2>
        <div className="db-chips">
          <button type="button" className="db-chip db-chip-all" onClick={() => setAll(allCodes)}>
            <span className="db-chip-name">Select all</span>
          </button>
          <button type="button" className="db-chip db-chip-all" onClick={() => setAll([])}>
            <span className="db-chip-name">Unselect all</span>
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
          AI scenario{" "}
          <HelpTip>
            <strong>{sc.name}.</strong> {sc.description}
          </HelpTip>
        </span>
        <AmountSlider stops={STOPS} value={CODES.indexOf(scenario)} onChange={(i) => setScenario(CODES[i])} labelledBy="db-dial" showHeader={false} />
      </section>

      <section className="db-panel" aria-labelledby="db-chart-h">
        <div className="db-panel-head">
          <div>
            <h2 className="db-panel-title" id="db-chart-h">
              How worried people are, and how much they do about it{" "}
              <HelpTip>
                {scope}, in {sc.name}. Each dot is one person. Further right means more worried. Higher up means they take
                stronger action, like retraining or moving.
              </HelpTip>
            </h2>
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
            yLabel="How strongly they act"
            xDomain={[0.5, 5.5]}
            yDomain={[0.5, 5.5]}
            formatX={formatWorry}
            formatY={formatAction}
            brush={brush}
            onBrushChange={(b) => setBrush(b)}
            bins={20}
            height={440}
            tone="light"
            readout={false}
            radius={4.5}
            left={104}
            ariaLabel={`Worry and action taken in ${sc.name}`}
          />
        ) : null}
        {points.length > 0 ? (
          <div className="db-legend" aria-label="Legend">
            <span className="db-legend-title">Dot colour shows how they feel</span>
            {MOODS.map((m) => (
              <span key={m} className="db-legend-item">
                <span className="ws-dot" style={{ background: MOOD_ACCENT[m] }} aria-hidden="true" />
                {MOOD_LABEL[m]}
              </span>
            ))}
          </div>
        ) : (
          <p className="db-panel-sub">{jobs.length ? "No one has been interviewed for these jobs yet." : "Pick at least one job on the left to see the chart."}</p>
        )}
      </section>

      <section className="db-block" aria-labelledby="db-ins-h">
        <div className="db-ins-head">
          <h2 className="t-section" id="db-ins-h">
            {brush ? `Your selection in ${sc.name}` : `Everyone in ${sc.name}`}
          </h2>
          <Link href={detailsHref} className="db-details">
            See details
            <DashIcon name="arrow" size={16} />
          </Link>
        </div>
        <Insights s={summary} archetypes={archetypes} />
        <p className="t-caption fg2">
          Everyone here is simulated: made-up versions of each job, interviewed by an AI interviewer. Shares are the part of
          the group that mentioned each step.
        </p>
      </section>
      </main>
    </div>
  );
}
