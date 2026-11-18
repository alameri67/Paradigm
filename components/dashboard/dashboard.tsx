"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Icon, type IconName } from "@/components/simulator/icons";
import { AmountSlider } from "@/components/ui/amount-slider";
import { ScatterBrush, type Brush } from "@/components/ui/bjork-scatter-brush";
import { Avatar } from "@/components/workers/avatar";
import { DashIcon, hasDashIcon } from "./icons";
import { MoodRadar } from "./mood-radar";
import { JobSidebar } from "@/components/workers/job-sidebar";
import { HelpTip } from "@/components/ui/help-tip";
import { GROUP_ICON } from "@/components/workers/group-icons";
import { StatsBand, type Stat } from "@/components/ui/stats-band";
import { ACTION_LEVELS, ACTION_PHRASE, WHO_PHRASE, actionLevel, contrast, pointsFor, summarize, thoughtsFor, type Contrast, type JobNotes, type Segment, type Summary, type ThoughtCount } from "@/lib/workers/dashboard";
import { usePublishScreen } from "@/lib/ask/screen-store";
import type { Screen } from "@/lib/ask/schema";
import {
  ACTION_LABEL,
  MOODS,
  MOOD_ACCENT,
  MOOD_LABEL,
  SCENARIOS,
  type Archetype,
  type Group,
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

/** "life stage, work standing and outlook" */
const listOf = (xs: string[]) => (xs.length < 2 ? xs.join("") : `${xs.slice(0, -1).join(", ")} and ${xs[xs.length - 1]}`);

const cap = (t: string) => t[0].toUpperCase() + t.slice(1);
const pctOf = (k: number, n: number) => (n ? Math.round((k / n) * 100) : 0);
const ofText = (k: number, n: number) => (k === n ? `All ${n}` : `${k} of ${n}`);

/** One end's headline numbers: how big it is, what it shares most, and what it does most. Hover shows the other end. */
function endStats(seg: Segment, other: Segment, total: number, side: "low" | "high"): Stat[] {
  const otherName = side === "low" ? "the most worried" : "the least worried";
  const vs = (k: number) => `Among ${otherName}: ${ofText(k, other.n).toLowerCase()} (${pctOf(k, other.n)}%).`;
  const out: Stat[] = [
    {
      label: "Of everyone shown",
      value: pctOf(seg.n, total),
      suffix: "%",
      // Short captions, one line each, so the tiles' bars line up (the title above already says what it counts).
      detail: `${ofText(seg.n, total)} people`,
      context: `${cap(otherName)} are ${pctOf(other.n, total)}%, ${other.n} people.`,
      visual: { kind: "share", count: seg.n, of: total },
      icon: <DashIcon name={side === "low" ? seg.moods[0] : seg.moods[seg.moods.length - 1]} size={16} />,
    },
  ];
  for (const a of seg.actions.slice(0, 3)) {
    const phrase = ACTION_PHRASE[a.tag] ?? a.tag.replace(/-/g, " ");
    out.push({
      label: cap(phrase.replace(/^will /, "")),
      value: pctOf(a.count, seg.n),
      suffix: "%",
      detail: `${ofText(a.count, seg.n)} people`,
      context: vs(other.acts[a.tag] ?? 0),
      visual: { kind: "share", count: a.count, of: seg.n },
      icon: <DashIcon name={hasDashIcon(a.tag) ? a.tag : "other"} size={16} />,
    });
  }
  return out;
}

/** Short form of a level for a column: "Adapt easily", "In junior roles". */
const shortLevel = (group: string, level: string) => cap((WHO_PHRASE[group]?.[level] ?? level).replace(/^who /, ""));

/** Who this end is: one column per trait group, the groups that move worry most first. */
function WhoCols({ seg, order }: { seg: Segment; order: { key: string; label: string }[] }) {
  return (
    <dl className="db-who">
      {order.map((g) => {
        const counts = Object.entries(seg.levels[g.key] ?? {});
        const [level, k] = counts.reduce((x, y) => (y[1] > x[1] ? y : x), ["", -1] as [string, number]);
        const clear = seg.n > 0 && k / seg.n >= 0.6;
        return (
          <div key={g.key} className={"db-who-col" + (clear ? "" : " is-mixed")}>
            <dt>
              <Icon name={GROUP_ICON[g.key] ?? "user"} size={14} />
              {g.label}
            </dt>
            <dd className="db-who-val">{clear ? shortLevel(g.key, level) : "A mix"}</dd>
            <dd className="db-who-sub">{clear ? `${ofText(k, seg.n)}` : `${k} of ${seg.n} ${shortLevel(g.key, level).toLowerCase()}`}</dd>
          </div>
        );
      })}
    </dl>
  );
}

function End({ seg, other, total, side, order, named }: { seg: Segment; other: Segment; total: number; side: "low" | "high"; /** Trait groups, most telling first. */ order: { key: string; label: string }[]; /** From the job summary, when one job is picked. */ named?: { name: string; story: string } }) {
  const accent = MOOD_ACCENT[side === "low" ? seg.moods[0] : seg.moods[seg.moods.length - 1]];
  const stats = endStats(seg, other, total, side);
  return (
    <div className={"db-end db-end-" + side} style={{ "--end-accent": accent } as CSSProperties}>
      <div className="db-end-head">
        <span className="db-end-ico" aria-hidden="true">
          <DashIcon name={side === "low" ? seg.moods[0] : seg.moods[seg.moods.length - 1]} size={20} />
        </span>
        <span className="db-end-titles">
          <span className="db-end-title">{named ? named.name : side === "low" ? "Least worried" : "Most worried"}</span>
          <span className="db-end-n">
            {people(seg.n)}, feeling {listOf(seg.moods.map((m) => MOOD_LABEL[m].toLowerCase())).replace(/ and /, " or ")}
          </span>
        </span>
      </div>
      {named && <p className="db-end-story">{named.story}</p>}
      <div className="db-end-block db-end-who">
        <div className="db-end-label">Who they are</div>
        <WhoCols seg={seg} order={order} />
      </div>
      <div className="db-end-block db-end-do">
        <div className="db-end-label">What they&apos;ll do</div>
        <StatsBand stats={stats} layout="divided" duration={1.2} className="db-end-kpis" style={{ "--sb-accent-in": accent } as CSSProperties} />
      </div>
      {seg.quote && (
        <figure className="db-end-quote">
          <blockquote>“{seg.quote.text}”</blockquote>
          <figcaption>
            {seg.quote.name}, {seg.quote.job.toLowerCase()}
          </figcaption>
        </figure>
      )}
    </div>
  );
}

/** The least and most worried ends of the selection, side by side, with what separates them on top. */
function Ends({ c, named }: { c: Contrast; named?: { least: { name: string; story: string }; most: { name: string; story: string } } }) {
  // Four columns: the groups that change worry most.
  const order = c.drivers.slice(0, 4);
  return (
    <section className="db-card db-ends" aria-label="Least and most worried">
      <CardHead icon="mood" title="Least and most worried" note={`Out of ${people(c.n)}`} />
      {c.headline && <p className="db-sowhat">{c.headline}</p>}
      <div className="db-ends-row">
        <End seg={c.low} other={c.high} total={c.n} side="low" order={order} named={named?.least} />
        <End seg={c.high} other={c.low} total={c.n} side="high" order={order} named={named?.most} />
      </div>
    </section>
  );
}

/** The thoughts that come up most, as bullets with how many share each. */
function Thinks({ list }: { list: ThoughtCount[] }) {
  const manyJobs = new Set(list.map((t) => t.job)).size > 1;
  return (
    <section className="db-card db-thinks" aria-label="What they think">
      <CardHead icon="quote" title="What they think" />
      <ul className="db-think-list">
        {list.map((t) => (
          <li key={t.job + t.text}>
            <span className="db-think-text">“{t.text}”</span>
            <span className="db-think-n">
              {t.count} of {t.of} {manyJobs ? t.job.toLowerCase() + "s" : "people"}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Insights({ s, c, thinks, named, empty }: { s: Summary; c: Contrast | null; thinks: ThoughtCount[]; named?: Parameters<typeof Ends>[0]["named"]; /** What to say when no one is shown. */ empty: string }) {
  if (!s.n) {
    return (
      <div className="db-cards">
        <div className="db-card db-card-empty">
          <p>{empty}</p>
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
        <MoodRadar moods={s.moods} n={s.n} />
      </section>

      {thinks.length > 0 && <Thinks list={thinks} />}
      {c && <Ends c={c} named={named} />}
    </div>
  );
}

/** The job's portrait in this person's gender. Every job has both; the other one ends in -f or -m. */
function portraitFor(a: Archetype, gender?: string): Archetype {
  if (!gender || !a.portraitUrl || a.portraitGender === gender) return a;
  return { ...a, portraitUrl: a.portraitUrl.replace(/\.jpg$/, `-${gender.toLowerCase()}.jpg`) };
}

/** The five group levels encoded in an ID like A03-12323, as "Group: Level" pairs. */
function levelsOf(id: string, groups: Group[]) {
  const digits = id.split("-")[1] ?? "";
  return groups.map((g, i) => ({ group: g, level: g.levels[Number(digits[i]) - 1] })).filter((x) => x.level);
}

/** A card about one person, opened by clicking their dot on the chart. */
function PersonPop({
  person,
  archetype,
  groups,
  scenario,
  at,
  onClose,
}: {
  person: InterviewSummary;
  archetype?: Archetype;
  groups: Group[];
  scenario: ScenarioCode;
  at: { x: number; y: number };
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const r = person.scenarios[scenario];
  const levels = levelsOf(person.id, groups);
  const href = `/details?${new URLSearchParams({ job: person.archetype, ...Object.fromEntries(levels.map((x) => [x.group.key, x.level.key])), s: scenario })}`;
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener("keydown", onKey);
    // Let the click that opened the card finish before listening for outside clicks.
    const t = setTimeout(() => window.addEventListener("pointerdown", onDown), 0);
    ref.current?.focus();
    return () => {
      clearTimeout(t);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [onClose]);
  return (
    <div
      ref={ref}
      className="db-pop"
      role="dialog"
      aria-label={`${person.name}, ${person.job.toLowerCase()}`}
      tabIndex={-1}
      style={{ ["--px" as string]: `${at.x}px`, ["--py" as string]: `${at.y}px` }}
    >
      <button type="button" className="db-pop-x" aria-label="Close" onClick={onClose}>
        ×
      </button>
      <div className="db-pop-who">
        {archetype && <Avatar a={portraitFor(archetype, person.gender)} size={44} />}
        <div>
          <div className="db-pop-name">{person.name}</div>
          <div className="db-pop-job">{person.job}</div>
        </div>
      </div>
      <div className="db-pop-mood">
        <span className="ws-dot" style={{ background: MOOD_ACCENT[r.mood] }} aria-hidden="true" />
        {MOOD_LABEL[r.mood]} in {scenarioOf(scenario).name} · {ACTION_LEVELS[actionLevel(r.actions ?? []) - 1]}
      </div>
      {r.quote && <p className="db-pop-quote">“{r.quote}”</p>}
      {(r.actions ?? []).length > 0 && (
        <div className="db-pop-block">
          <div className="db-pop-label">What they&apos;d do</div>
          <ul>
            {(r.actions ?? []).map((a) => (
              <li key={a}>{ACTION_LABEL[a] ?? a}</li>
            ))}
          </ul>
        </div>
      )}
      <div className="db-pop-block">
        <div className="db-pop-label">Who they are</div>
        <dl className="db-pop-levels">
          {levels.map(({ group, level }) => (
            <div key={group.key}>
              <dt>{group.label}</dt>
              <dd>{level.label}</dd>
            </div>
          ))}
        </dl>
      </div>
      <Link href={href} className="db-pop-link">
        Read their interview
        <DashIcon name="arrow" size={14} />
      </Link>
    </div>
  );
}

export function Dashboard({
  archetypes,
  groups,
  notes = {},
  people: everyone,
  versionsPerJob,
}: {
  archetypes: Archetype[];
  /** The five groups, to name each person's levels. */
  groups: Group[];
  /** Grouped thoughts and named ends from each job's written summary. */
  notes?: JobNotes;
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
  const [open, setOpen] = useState<{ id: string; view: string; at: { x: number; y: number } } | null>(null);
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
  const ends = useMemo(() => contrast(selected, scenario, groups), [selected, scenario, groups]);
  const thinks = useMemo(() => thoughtsFor(selected, scenario, notes), [selected, scenario, notes]);
  // The job summary names the two ends, so use it only when everyone shown is one job and nothing is dragged.
  const oneJob = selected.length > 0 && selected.every((p) => p.archetype === selected[0].archetype) ? selected[0].archetype : null;
  const named = oneJob && !brush ? notes[oneJob]?.[scenario]?.segments : undefined;
  // The card belongs to the view it was opened in: the dot moves when the scenario or the jobs change.
  const view = `${scenario}|${jobs.join(",")}`;
  const openPerson = open && open.view === view ? points.find((p) => p.person.id === open.id)?.person : undefined;
  const closePop = () => setOpen(null);
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

  // What Ask AI can see: the same counts and sentences this page shows.
  const seg = (x: Segment) => ({
    people: x.n,
    moods: x.moods.map((m) => MOOD_LABEL[m]),
    traits: x.traits,
    mixed: x.mixed,
    actions: x.actions.map((a) => a.text),
    quote: x.quote ? `${x.quote.text} (${x.quote.name}, ${x.quote.job.toLowerCase()})` : null,
  });
  const screen: Screen = {
    page: "summary",
    scenario: { name: sc.name, when: sc.when, description: sc.description },
    jobs: picked.map((a) => a.job),
    summary: {
      scope,
      selection: brush ? `a box dragged on the chart, holding ${selected.length} of the ${people(points.length)} shown` : null,
      people: summary.n,
      moods: MOODS.map((m) => ({ mood: MOOD_LABEL[m], count: summary.moods[m] })),
      topActions: summary.actions.slice(0, 5).map((a) => ({ action: ACTION_LABEL[a.tag] ?? a.tag.replace(/-/g, " "), share: a.share })),
      ends: ends ? { headline: ends.headline, least: seg(ends.low), most: seg(ends.high) } : null,
    },
  };
  usePublishScreen(screen);

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
            ) : points.length ? (
              <span>
                Showing all {people(points.length)}. Drag across the chart to look at a group.
              </span>
            ) : null}
          </div>
        </div>
        {points.length ? (
          <div className="db-chart-wrap">
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
            tipRows={(i) => {
              const r = points[i]?.person.scenarios[scenario];
              return r ? [{ label: "Feels", value: MOOD_LABEL[r.mood] }, { label: "Acts", value: ACTION_LEVELS[actionLevel(r.actions ?? []) - 1] }, { label: "", value: "Click for more" }] : [];
            }}
            onPointClick={(i, at) => points[i] && setOpen({ id: points[i].person.id, view, at })}
          />
          {openPerson && (
            <PersonPop
              person={openPerson}
              archetype={archetypes.find((a) => a.code === openPerson.archetype)}
              groups={groups}
              scenario={scenario}
              at={open!.at}
              onClose={closePop}
            />
          )}
          </div>
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
        <Insights
          s={summary}
          c={ends}
          thinks={thinks}
          named={named}
          empty={
            brush
              ? "No one is inside your selection. Drag a bigger box, or click an empty spot on the chart to start again."
              : jobs.length
                ? "No one has been interviewed for these jobs yet."
                : "Pick at least one job on the left to see what people say."
          }
        />
        <p className="t-caption fg2">
          Everyone here is simulated: made-up versions of each job, interviewed by an AI interviewer. Shares are the part of
          the group that mentioned each step.
        </p>
      </section>
      </main>
    </div>
  );
}
