"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AmountSlider } from "@/components/ui/amount-slider";
import { LiquidGlassNavbar } from "@/components/ui/liquid-glass-navbar";
import { PeakChart } from "@/components/ui/peak-chart";
import { Icon, type IconName } from "@/components/simulator/icons";
import { Avatar, SHORT_SECTOR } from "./avatar";
import { JobSidebar } from "./job-sidebar";
import { HelpTip } from "@/components/ui/help-tip";
import { JobPatterns } from "./job-patterns";
import { GROUP_ICON } from "./group-icons";
import { Bullets, toPoints } from "./bullets";
import { DashIcon } from "@/components/dashboard/icons";
import { Brain, Footprints, Heart, MessageCircle, NotebookPen } from "lucide-react";
import { FeaturePersona, GlassPersona, SCENARIO_SHORT, WeatherPersona, isCardKind, type CardKind } from "./persona-cards";
import { usePublishScreen } from "@/lib/ask/screen-store";
import type { Screen } from "@/lib/ask/schema";
import {
  MOODS,
  MOOD_ACCENT,
  MOOD_LABEL,
  SCENARIOS,
  workerId,
  type Archetype,
  type Group,
  type GroupLevel,
  type Interview,
  type JobInsights,
  type MoodKey,
  type ScenarioCode,
  type Worker,
  type WorkerPortrait,
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
const level = (m: MoodKey) => MOODS.indexOf(m) + 1;

/** The details a level stands for, as one readable line (age, savings, views...). */
function levelDetail(l: GroupLevel) {
  return Object.entries(l)
    .filter(([k]) => k !== "key" && k !== "label")
    .map(([k, v]) => (k === "age" ? `Age ${v}` : String(v).replace(/\.$/, "")))
    .join(". ");
}

/** The worker card: a Peak Chart of worry across S0–S4, with the job's portrait blended inside it. */
function WorkerCard({
  w,
  iv,
  scenario,
  onScenario,
  portrait,
}: {
  w: Worker;
  iv: Interview;
  portrait: WorkerPortrait | null;
  scenario: ScenarioCode;
  onScenario: (s: ScenarioCode) => void;
}) {
  const mood = iv.scenarios[scenario].mood;
  return (
    <div className="ws-card">
      <PeakChart
        width={300}
        data={CODES.map((c) => level(iv.scenarios[c].mood))}
        labels={SCENARIOS.map((s) => s.name)}
        value={level(mood)}
        valueSuffix="/5"
        title={w.name}
        headline={w.job}
        image={portrait?.cutout}
        caption={`${MOOD_LABEL[mood]} · age ${w.profile.age}`}
        updatedText={SHORT_SECTOR[w.sector] ?? w.sector}
        trend="none"
        periods={SCENARIOS.map((s) => s.name)}
        period={scenarioOf(scenario).name}
        onPeriodChange={(v) => onScenario(SCENARIOS.find((s) => s.name === v)!.code)}
        accent={MOOD_ACCENT[mood]}
        formatValue={(v) => MOOD_LABEL[MOODS[Math.max(0, Math.min(4, Math.round(v) - 1))]]}
      />
    </div>
  );
}


/** All five scenarios as one row of columns: the person's mood in each. Clicking one picks that scenario. */
function ScenarioColumns({ iv, scenario, onScenario }: { iv: Interview; scenario: ScenarioCode; onScenario: (s: ScenarioCode) => void }) {
  return (
    <div className="ws-kpis ws-kpis-scen" role="group" aria-label="All five scenarios">
      {SCENARIOS.map((s) => {
        const mood = iv.scenarios[s.code].mood;
        const on = s.code === scenario;
        return (
          <button
            key={s.code}
            type="button"
            className={"ws-kpi" + (on ? " on" : "")}
            aria-pressed={on}
            title={s.name}
            onClick={() => onScenario(s.code)}
            style={{ "--kpi-accent": MOOD_ACCENT[mood] } as CSSProperties}
          >
            <span className="ws-kpi-label">
              <Icon name={SCENARIO_ICON[s.code]} size={14} />
              {SCENARIO_SHORT[s.code]}
            </span>
            <span className="ws-kpi-val">
              <span className="ws-kpi-face" aria-hidden="true">
                <DashIcon name={mood} size={18} />
              </span>
              {MOOD_LABEL[mood]}
            </span>
            <span className="ws-kpi-sub">{s.when}</span>
          </button>
        );
      })}
    </div>
  );
}

/** The interviewer's note as columns: the bold phrase (or first few words) on top, the point under it. */
function NoteColumns({ text }: { text: Interview["scenarios"][ScenarioCode]["fieldNote"] }) {
  const points = toPoints(text).slice(0, 4);
  if (!points.length) return null;
  return (
    <section className="ws-notes" aria-labelledby="ws-note-h">
      <h2 className="ws-label" id="ws-note-h">
        Interviewer&apos;s note
      </h2>
      <dl className={"ws-kpis ws-kpis-note n" + points.length}>
        {points.map((p, i) => {
          const bold = p.match(/\*\*([^*]+)\*\*/);
          const words = p.replace(/\*\*/g, "").split(/\s+/);
          const val = bold ? bold[1] : words.slice(0, 3).join(" ");
          const sub = bold ? p.replace(/\*\*/g, "") : words.slice(3).join(" ");
          return (
            <div key={i} className="ws-kpi">
              <dt className="ws-kpi-label">
                <NotebookPen size={14} strokeWidth={1.8} aria-hidden="true" />
                Note {i + 1}
              </dt>
              <dd className="ws-kpi-val">{val.charAt(0).toUpperCase() + val.slice(1)}</dd>
              {sub && <dd className="ws-kpi-sub">{sub}</dd>}
            </div>
          );
        })}
      </dl>
    </section>
  );
}

const VOICES = [
  ["say", "Says", MessageCircle],
  ["think", "Thinks", Brain],
  ["do", "Does", Footprints],
  ["feel", "Feels", Heart],
] as const;

function ControlPanel({
  groups,
  levels,
  onLevel,
  worker,
}: {
  groups: Group[];
  levels: Record<string, string>;
  onLevel: (group: string, level: string) => void;
  worker: Worker | null;
}) {
  return (
    <aside className="ws-panel" aria-label="Worker details">
      <div className="ws-panel-head">
        <h2 className="t-section">
          Who is this worker? <HelpTip>Pick one option in each group to meet a different version of this job.</HelpTip>
        </h2>
      </div>
      {groups.map((g) => {
        const idx = Math.max(0, g.levels.findIndex((l) => l.key === levels[g.key]));
        return (
          <div className="ws-group" key={g.key}>
            <div className="ws-group-head">
              <span className="ws-group-ico" aria-hidden="true">
                <Icon name={GROUP_ICON[g.key] ?? "user"} size={18} />
              </span>
              <h3 className="ws-group-title" id={`wg-${g.key}`}>
                {g.label}
              </h3>
            </div>
            <LiquidGlassNavbar
              mode="radio"
              size="sm"
              className="ws-pill"
              labelledBy={`wg-${g.key}`}
              items={g.levels.map((l) => ({ label: l.label }))}
              active={idx}
              onChange={(i) => onLevel(g.key, g.levels[i].key)}
            />
            <p className="ws-group-detail">{levelDetail(g.levels[idx]).replace(/\.?$/, ".")}</p>
          </div>
        );
      })}
      {worker && (
        <dl className="ws-facts">
          {(
            [
              ["graduation", "Education", worker.profile.education],
              ["cpu", "AI exposure (comes with the job)", worker.profile.aiExposure],
              ["hash", "Version", worker.id],
            ] as const
          ).map(([icon, label, value]) => (
            <div key={label}>
              <span className="ws-group-ico" aria-hidden="true">
                <Icon name={icon} size={16} />
              </span>
              <span className="ws-fact-text">
                <dt>{label}</dt>
                <dd className={icon === "hash" ? "mono" : undefined}>{value}</dd>
              </span>
            </div>
          ))}
        </dl>
      )}
    </aside>
  );
}

export function WorkerStudio({ archetypes, groups }: { archetypes: Archetype[]; groups: Group[] }) {
  const params = useSearchParams();
  const [job, setJob] = useState(() => {
    const j = params.get("job");
    return archetypes.some((a) => a.code === j) ? j! : "A16";
  });
  const [levels, setLevels] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      groups.map((g) => {
        const v = params.get(g.key);
        return [g.key, g.levels.some((l) => l.key === v) ? v! : g.levels[1].key];
      }),
    ),
  );
  const [scenario, setScenario] = useState<ScenarioCode>(() => {
    const s = params.get("s");
    return (CODES as string[]).includes(s ?? "") ? (s as ScenarioCode) : "S2";
  });
  const [interviewed, setInterviewed] = useState<string[] | null>(null);
  const [result, setResult] = useState<{
    id: string;
    worker: Worker;
    interview: Interview | null;
    portrait: WorkerPortrait | null;
  } | null>(null);
  const [showTranscript, setShowTranscript] = useState(false);
  const [card] = useState<CardKind>(() => {
    const c = params.get("card");
    // The glass card is the chosen design; ?card= still shows the others for comparison.
    return isCardKind(c) ? c : "glass";
  });
  const [insights, setInsights] = useState<{ job: string; data: JobInsights | null } | null>(null);

  const a = archetypes.find((x) => x.code === job)!;
  const id = workerId(job, groups, levels);
  const loading = result?.id !== id;
  const worker = result && !loading ? result.worker : null;
  const iv = result && !loading ? result.interview : null;

  // Shareable address bar.
  useEffect(() => {
    const q = new URLSearchParams({ job, ...levels, s: scenario, ...(card !== "glass" ? { card } : {}) }).toString();
    if (q !== window.location.search.slice(1)) window.history.replaceState(null, "", `?${q}`);
  }, [job, levels, scenario, card]);

  function readInterview() {
    setShowTranscript(true);
    requestAnimationFrame(() => document.getElementById("ws-interview")?.scrollIntoView({ behavior: "smooth", block: "start" }));
  }

  useEffect(() => {
    let live = true;
    const load = () =>
      fetch("/api/workers")
        .then((r) => r.json())
        .then((d) => live && setInterviewed(d.interviewed))
        .catch(() => live && setInterviewed([]));
    load();
    // Interviews are still being added while the study runs.
    const t = setInterval(load, 30000);
    return () => {
      live = false;
      clearInterval(t);
    };
  }, []);

  useEffect(() => {
    let live = true;
    fetch(`/api/workers/${id}`)
      .then((r) => r.json())
      .then((d) => live && setResult({ id, worker: d.worker, interview: d.interview, portrait: d.portrait }));
    return () => {
      live = false;
    };
  }, [id]);

  useEffect(() => {
    let live = true;
    fetch(`/api/workers/insights/${job}`)
      .then((r) => r.json())
      .then((d) => live && setInsights({ job, data: d.insights }));
    return () => {
      live = false;
    };
  }, [job]);
  const jobInsights = insights?.job === job ? insights.data : null;

  const counts = useMemo(() => {
    const c: Record<string, number> = {};
    for (const x of interviewed ?? []) c[x.slice(0, 3)] = (c[x.slice(0, 3)] ?? 0) + 1;
    return c;
  }, [interviewed]);

  /** The interviewed version of this job that differs on the fewest groups. */
  const closest = useMemo(() => {
    const mine = id.slice(4);
    let best: string | null = null;
    let bd = 99;
    for (const x of interviewed ?? []) {
      if (!x.startsWith(job + "-")) continue;
      const d = [...x.slice(4)].filter((ch, i) => ch !== mine[i]).length;
      if (d < bd) {
        bd = d;
        best = x;
      }
    }
    return best;
  }, [interviewed, job, id]);

  function jumpTo(target: string) {
    setLevels(Object.fromEntries(groups.map((g, i) => [g.key, g.levels[Number(target[4 + i]) - 1].key])));
  }
  const diffGroups = (target: string) =>
    groups.filter((g, i) => target[4 + i] !== id[4 + i]).map((g) => g.label.toLowerCase());

  const sc = iv?.scenarios[scenario];

  // What Ask AI can see: this person, their levels, and their bullets for the scenario on screen.
  const scInfo = scenarioOf(scenario);
  const screen: Screen = {
    page: "details",
    scenario: { name: scInfo.name, when: scInfo.when, description: scInfo.description },
    jobs: [a.job],
    details: worker
      ? {
          name: worker.name,
          job: worker.job,
          sector: worker.sector,
          version: worker.id,
          interviewed: !!(iv && sc),
          age: worker.profile?.age ?? null,
          levels: groups.map((g) => ({ group: g.label, level: g.levels.find((l) => l.key === levels[g.key])?.label ?? "" })),
          mood: sc ? MOOD_LABEL[sc.mood] : null,
          quote: sc?.quote || null,
          says: toPoints(sc?.say),
          thinks: toPoints(sc?.think),
          does: toPoints(sc?.do),
          feels: toPoints(sc?.feel),
          interviewerNote: toPoints(sc?.fieldNote),
          moodByScenario: iv ? SCENARIOS.map((x) => ({ scenario: x.name, mood: MOOD_LABEL[iv.scenarios[x.code].mood] })) : [],
          jobHeadline: jobInsights?.scenarios[scenario]?.headline || null,
          headline: iv?.headlineQuote || null,
          about: toPoints(iv?.portrait),
          biggestWorry: toPoints(iv?.biggestWorry),
          whatWouldHelp: toPoints(iv?.whatWouldHelp),
        }
      : undefined,
  };
  usePublishScreen(screen);

  return (
    <div className="ws">
      <JobSidebar
        archetypes={archetypes}
        counts={counts}
        page="details"
        selected={[job]}
        summaryHref={`/?s=${scenario}`}
        detailsHref={`/details?job=${job}&s=${scenario}`}
        onPick={setJob}
      />

      <main className="ws-main">
        <div className="ws-job-row">
          <label className="field ws-job-select">
            <span className="label">Job</span>
            <span className="select">
              <select value={job} onChange={(e) => setJob(e.target.value)}>
                {archetypes.map((x) => (
                  <option key={x.code} value={x.code}>
                    {x.job} · {SHORT_SECTOR[x.sector] ?? x.sector}
                  </option>
                ))}
              </select>
              <Icon name="down" />
            </span>
          </label>
          <Link href={`/?s=${scenario}`} className="ws-dash-link">
            See the summary
          </Link>
        </div>

        <div className="dialbar">
          <span className="label" id="ws-dial">
            AI scenario{" "}
            <HelpTip>
              <strong>{scenarioOf(scenario).name}.</strong> {scenarioOf(scenario).description}
            </HelpTip>
          </span>
          <AmountSlider
            stops={STOPS}
            value={CODES.indexOf(scenario)}
            onChange={(i) => setScenario(CODES[i])}
            labelledBy="ws-dial"
            showHeader={false}
          />
        </div>

        {loading ? (
          <div className="ws-hero">
            <div className="sk ws-sk-kpis" />
            <div className="sk" style={{ width: 300, height: 386, borderRadius: 31 }} />
          </div>
        ) : iv && sc && worker ? (
          <>
            <ScenarioColumns iv={iv} scenario={scenario} onScenario={setScenario} />

            <section className={"ws-hero ws-hero-" + (result?.portrait ? card : "current")} aria-label="Worker">
              <div className="ws-hero-card">
                {card === "glass" && result?.portrait ? (
                  <GlassPersona worker={worker} iv={iv} scenario={scenario} portrait={result.portrait} onReadInterview={readInterview} />
                ) : card === "weather" ? (
                  <WeatherPersona worker={worker} iv={iv} scenario={scenario} />
                ) : card === "feature" && result?.portrait ? (
                  <FeaturePersona worker={worker} iv={iv} scenario={scenario} portrait={result.portrait} />
                ) : (
                  <WorkerCard w={worker} iv={iv} portrait={result?.portrait ?? null} scenario={scenario} onScenario={setScenario} />
                )}
              </div>
              {/* Says, thinks, does, feels: a 2 × 2 beside the card, as tall as it. */}
              <div className="ws-voices" aria-label="What they say, think, do and feel">
                {VOICES.map(([k, label, Ico]) => (
                  <div key={k} className="ws-voice">
                    <h3 className="ws-voice-head">
                      <span className="ws-voice-ico" aria-hidden="true">
                        <Ico size={16} strokeWidth={1.8} />
                      </span>
                      {label}
                    </h3>
                    <Bullets key={String(sc[k])} className="swap" text={sc[k]} />
                  </div>
                ))}
              </div>
            </section>

            <NoteColumns text={sc.fieldNote} />

            {jobInsights && (
              <JobPatterns insights={jobInsights} plural={a.plural} scenario={scenario} scenarioName={scenarioOf(scenario).name} />
            )}

            <section className="ws-about" aria-label="About this worker">
              <div>
                <span className="label">In a sentence</span>
                <p className="ws-headline">“{iv.headlineQuote}”</p>
              </div>
              <div className="ws-about-grid">
                <div>
                  <span className="label">Who they are</span>
                  <Bullets text={iv.portrait} />
                </div>
                <div>
                  <span className="label">Biggest worry</span>
                  <Bullets text={iv.biggestWorry} />
                </div>
                <div>
                  <span className="label">What would help</span>
                  <Bullets text={iv.whatWouldHelp} />
                </div>
              </div>
            </section>

            <section className="section" id="ws-interview">
              <button type="button" className="lq-btn sm" style={{ alignSelf: "flex-start" }} onClick={() => setShowTranscript((v) => !v)}>
                {showTranscript ? "Hide" : "Read"} the full interview for {scenarioOf(scenario).name}
              </button>
              {showTranscript && (
                <div className="ws-transcript">
                  {sc.transcript.map((t, i) => (
                    <p key={i} className={t.speaker === "interviewer" ? "ws-q" : "ws-a"}>
                      <span className="ws-label">{t.speaker === "interviewer" ? "Interviewer" : worker.name.split(" ")[0]}</span>
                      {t.text}
                    </p>
                  ))}
                </div>
              )}
            </section>
          </>
        ) : worker ? (
          <section className="ws-empty">
            <Avatar a={a} size={96} />
            <h1 className="t-display">
              {worker.name}, {worker.job.toLowerCase()}
            </h1>
            <p className="prose fg2">
              This version hasn&apos;t been interviewed yet.{" "}
              {counts[job]
                ? `${counts[job]} of the 243 versions of this job have been interviewed so far.`
                : "No versions of this job have been interviewed yet."}
            </p>
            {closest && (
              <button type="button" className="lq-btn primary" onClick={() => jumpTo(closest)}>
                Show the closest interviewed version
                <span className="fg2 t-ui">(differs in {diffGroups(closest).join(", ")})</span>
              </button>
            )}
          </section>
        ) : null}
      </main>

      <ControlPanel
        groups={groups}
        levels={levels}
        onLevel={(g, l) => setLevels((s) => ({ ...s, [g]: l }))}
        worker={worker}
      />
    </div>
  );
}
