"use client";

import {
  ACTION_LABEL,
  MOODS,
  MOOD_ACCENT,
  MOOD_LABEL,
  type JobInsights,
  type ScenarioCode,
} from "@/lib/workers/types";
import { Bullets, withBold } from "./bullets";

const pct = (x: number) => `${Math.round(x * 100)}%`;

type PatternProps = {
  insights: JobInsights;
  plural: string;
  scenario: ScenarioCode;
  scenarioName: string;
};

/** The pieces of one job's patterns in one scenario, so the details layouts can place them separately. */
export function jobPatternParts({ insights, plural, scenario, scenarioName }: PatternProps) {
  const ins = insights.scenarios[scenario];
  const st = insights.stats.scenarios[scenario];
  if (!ins || !st) return null;
  const share = (tag: string) => st.actions.find((a) => a.tag === tag)?.share ?? 0;
  const People = plural.charAt(0).toUpperCase() + plural.slice(1);

  const head = (
    <div className="ws-pat-head">
      <span className="label">
        All {st.n} {plural} interviewed
      </span>
      <h2 className="t-title" id="ws-pat-h">
        What {plural} do in {scenarioName}
      </h2>
      <p key={scenario} className="ws-pat-headline swap">
        {ins.headline}
      </p>
    </div>
  );

  const mood = (
    <>
      <div className="ws-moodbar" role="img" aria-label={MOODS.map((m) => `${MOOD_LABEL[m]} ${st.moodMix[m]}`).join(", ")}>
        {MOODS.filter((m) => st.moodMix[m] > 0).map((m) => (
          <span key={m} style={{ flexGrow: st.moodMix[m], background: MOOD_ACCENT[m] }} title={`${MOOD_LABEL[m]}: ${st.moodMix[m]}`} />
        ))}
      </div>
      <div className="ws-moodkey">
        {MOODS.map((m) => (
          <span key={m}>
            <i style={{ background: MOOD_ACCENT[m] }} aria-hidden="true" />
            {MOOD_LABEL[m]} <span className="mono">{st.moodMix[m]}</span>
          </span>
        ))}
      </div>
    </>
  );

  const actions = (
    <div className="ws-pat-do">
      <h3 className="label">Most common actions</h3>
      <ol>
        {ins.whatTheyDo.map((a) => (
          <li key={a.tag}>
            <div className="ws-act-top">
              <span className="ws-act-name">{ACTION_LABEL[a.tag] ?? a.tag}</span>
              <span className="mono">{pct(share(a.tag))}</span>
            </div>
            <span className="ws-act-bar" aria-hidden="true">
              <span style={{ width: pct(share(a.tag)) }} />
            </span>
            <Bullets text={a.text} />
          </li>
        ))}
      </ol>
    </div>
  );

  const voices = (
    [
      ["What they say", ins.whatTheySay],
      ["What they think", ins.whatTheyThink],
      ["How they feel", ins.howTheyFeel],
    ] as const
  ).map(([label, text]) => (
    <div key={label}>
      <h3 className="label">{label}</h3>
      <Bullets text={text} />
    </div>
  ));

  const differences =
    ins.differences.length > 0 ? (
      <div className="ws-pat-diff">
        <h3 className="label">Where {plural} differ</h3>
        <ul>
          {ins.differences.map((d) => (
            <li key={d.group}>
              <strong>{d.group}.</strong> {withBold(Array.isArray(d.text) ? d.text.join(" ") : (d.text as string))}
            </li>
          ))}
        </ul>
      </div>
    ) : null;

  const quotes = (
    <div className="ws-pat-quotes">
      <h3 className="label">In their words</h3>
      <div>
        {ins.quotes.map((q) => (
          <figure key={q.id}>
            <blockquote>“{q.text}”</blockquote>
            <figcaption>{q.name}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  );

  const footnote = (
    <p className="t-caption fg2">
      {People} are simulated: {st.n} made-up versions of the same job, each interviewed by an AI interviewer. Shares are
      the part of those interviews that mention each action.
    </p>
  );

  return { head, mood, actions, voices, differences, quotes, footnote, n: st.n };
}

/** What a job's workers do as a group in one scenario: counts from every interviewed version plus the written patterns. */
export function JobPatterns(props: PatternProps) {
  const p = jobPatternParts(props);
  if (!p) return null;
  return (
    <section className="ws-patterns" aria-labelledby="ws-pat-h">
      {p.head}
      {p.mood}
      <div className="ws-pat-cols">
        {p.actions}
        <div className="ws-pat-voice">{p.voices}</div>
      </div>
      {p.differences}
      {p.quotes}
      {p.footnote}
    </section>
  );
}
