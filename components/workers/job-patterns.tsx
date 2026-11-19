"use client";

import { percent } from "@/lib/format";
import { useState, type ReactNode } from "react";
import { ArrowLeft, ArrowRight, Brain, ChevronDown, Compass, Footprints, Heart, MessageCircle, Quote, SlidersHorizontal, UsersRound, Wallet, type LucideIcon } from "lucide-react";
import { ACTION_LABEL, MOODS, MOOD_ACCENT, MOOD_LABEL, type JobInsights, type ScenarioCode } from "@/lib/workers/types";
import { Bullets, withBold } from "./bullets";

/** A share as text; see lib/format.ts (never 0% for a few, never 100% for nearly all). */
const pct = percent;

const DIFFERENCE_ICON: Record<string, LucideIcon> = {
  "Money cushion": Wallet,
  Adaptability: SlidersHorizontal,
  Outlook: Compass,
};

function PatternHeading({ icon: Icon, children }: { icon: LucideIcon; children: ReactNode }) {
  return (
    <h3 className="ws-voice-head">
      <span className="ws-voice-ico" aria-hidden="true"><Icon size={16} strokeWidth={1.8} /></span>
      {children}
    </h3>
  );
}

/** What a job's workers do as a group in one scenario: counts from every interviewed version plus the written patterns. */
export function JobPatterns({
  insights,
  plural,
  scenario,
  scenarioName,
}: {
  insights: JobInsights;
  plural: string;
  scenario: ScenarioCode;
  scenarioName: string;
}) {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const ins = insights.scenarios[scenario];
  const st = insights.stats.scenarios[scenario];
  if (!ins || !st) return null;
  const share = (tag: string) => st.actions.find((a) => a.tag === tag)?.share ?? 0;
  const People = plural.charAt(0).toUpperCase() + plural.slice(1);
  const currentQuoteIndex = ins.quotes.length ? quoteIndex % ins.quotes.length : 0;
  const quote = ins.quotes[currentQuoteIndex];

  return (
    <section className="ws-patterns" aria-labelledby="ws-pat-h">
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

      <div className="ws-pat-cols">
        <div className="ws-pat-panel ws-pat-do">
          <div className="ws-pat-section-head"><PatternHeading icon={Footprints}>Most common actions</PatternHeading></div>
          <ol>
            {ins.whatTheyDo.map((a, index) => (
              <li key={a.tag}>
                <details className="ws-pat-action" open={index === 0}>
                  <summary>
                    <span className="ws-act-top">
                      <span>{ACTION_LABEL[a.tag] ?? a.tag}</span>
                      <span className="mono">{pct(share(a.tag))}</span>
                    </span>
                    <span className="ws-act-bar" aria-hidden="true">
                      <span style={{ width: `${share(a.tag) * 100}%` }} />
                    </span>
                  </summary>
                  <Bullets text={a.text} />
                </details>
              </li>
            ))}
          </ol>
        </div>
        <div className="ws-pat-panel ws-pat-voice">
          {(
            [
              ["What they say", ins.whatTheySay, MessageCircle],
              ["What they think", ins.whatTheyThink, Brain],
              ["How they feel", ins.howTheyFeel, Heart],
            ] as const
          ).map(([label, text, Icon]) => (
            <div className="ws-pat-voice-item" key={label}>
              <PatternHeading icon={Icon}>{label}</PatternHeading>
              <Bullets text={text} />
            </div>
          ))}
        </div>
      </div>

      {ins.differences.length > 0 && (
        <div>
          <div className="ws-pat-section-head"><PatternHeading icon={UsersRound}>Where {plural} differ</PatternHeading></div>
          <div className="ws-pat-differences">
            {ins.differences.map((d) => {
              const Icon = DIFFERENCE_ICON[d.group] ?? UsersRound;
              return (
                <details className="ws-pat-difference" key={d.group}>
                  <summary>
                    <span className="ws-pat-difference-label"><span className="ws-voice-ico" aria-hidden="true"><Icon size={16} strokeWidth={1.8} /></span>{d.group}</span>
                    <ChevronDown size={13} aria-hidden="true" />
                  </summary>
                  <p>{withBold(Array.isArray(d.text) ? d.text.join(" ") : d.text)}</p>
                </details>
              );
            })}
          </div>
        </div>
      )}

      {quote && (
        <div>
          <div className="ws-pat-section-head"><PatternHeading icon={Quote}>In their words</PatternHeading></div>
          <div className="ws-pat-quote-row">
            <figure aria-live="polite" aria-atomic="true">
              <blockquote>“{quote.text}”</blockquote>
              <figcaption>{quote.name}</figcaption>
            </figure>
            {ins.quotes.length > 1 && (
              <div className="ws-pat-quote-controls">
                <button type="button" className="lq-btn sm" aria-label="Previous quote" onClick={() => setQuoteIndex((i) => (i - 1 + ins.quotes.length) % ins.quotes.length)}><ArrowLeft size={14} aria-hidden="true" /></button>
                <span aria-label={`Quote ${currentQuoteIndex + 1} of ${ins.quotes.length}`}>{currentQuoteIndex + 1} / {ins.quotes.length}</span>
                <button type="button" className="lq-btn sm" aria-label="Next quote" onClick={() => setQuoteIndex((i) => (i + 1) % ins.quotes.length)}><ArrowRight size={14} aria-hidden="true" /></button>
              </div>
            )}
          </div>
        </div>
      )}
      <p className="t-caption fg2">
        {People} are simulated: {st.n} made-up versions of the same job, each interviewed by an AI interviewer. Shares are
        the part of those interviews that mention each action.
      </p>
    </section>
  );
}
