"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import { JobPatterns, jobPatternParts } from "./job-patterns";
import type { JobInsights, ScenarioCode } from "@/lib/workers/types";

/** Which arrangement of the Details page to show: `?layout=a|b|c`, anything else is the default. */
export type DetailsLayout = "default" | "a" | "b" | "c";
export const toLayout = (v: string | null): DetailsLayout => (v === "a" || v === "b" || v === "c" ? v : "default");

/** Everything the Details page shows for one interviewed person, already rendered, so each layout only arranges it. */
export interface DetailsParts {
  card: ReactNode;
  moodline: ReactNode;
  quote: ReactNode;
  voices: { key: string; label: string; body: ReactNode }[];
  note: ReactNode;
  /** The five-scenario buttons (a `.strip`). */
  strip: ReactNode;
  headline: ReactNode;
  who: ReactNode;
  worry: ReactNode;
  help: ReactNode;
  transcript: ReactNode;
  patterns: { insights: JobInsights; plural: string; scenario: ScenarioCode; scenarioName: string } | null;
}

function Voices({ p }: { p: DetailsParts }) {
  return (
    <div className="ws-voices">
      {p.voices.map((v) => (
        <div key={v.key} className="ws-voice">
          <span className="ws-label">{v.label}</span>
          {v.body}
        </div>
      ))}
    </div>
  );
}

function Note({ p }: { p: DetailsParts }) {
  return (
    <div className="ws-note">
      <span className="ws-label">Interviewer&apos;s note</span>
      {p.note}
    </div>
  );
}

function About({ p }: { p: DetailsParts }) {
  return (
    <section className="ws-about" aria-label="About this worker">
      <div>
        <span className="label">In a sentence</span>
        {p.headline}
      </div>
      <div className="ws-about-grid">
        <div>
          <span className="label">Who they are</span>
          {p.who}
        </div>
        <div>
          <span className="label">Biggest worry</span>
          {p.worry}
        </div>
        <div>
          <span className="label">What would help</span>
          {p.help}
        </div>
      </div>
    </section>
  );
}

function Scenarios({ p, title = true }: { p: DetailsParts; title?: boolean }) {
  return (
    <section className="section" aria-labelledby="ws-all">
      <h2 className={title ? "t-section" : "sr-only"} id="ws-all">
        All five scenarios
      </h2>
      {p.strip}
    </section>
  );
}

/** Today's page: one long column. */
function DefaultLayout({ p }: { p: DetailsParts }) {
  return (
    <>
      <section className="ws-hero" aria-label="Worker">
        {p.card}
        <div className="ws-hero-text">
          {p.moodline}
          {p.quote}
          <Voices p={p} />
          <Note p={p} />
        </div>
      </section>
      {p.patterns && <JobPatterns {...p.patterns} />}
      <Scenarios p={p} />
      <About p={p} />
      {p.transcript}
    </>
  );
}

/* ---------- A: hero on top, then tabs ---------- */

function TabsLayout({ p }: { p: DetailsParts }) {
  const tabs = [
    { key: "person", label: "This person" },
    ...(p.patterns ? [{ key: "job", label: `All ${p.patterns.plural}` }] : []),
    { key: "scenarios", label: "Five scenarios" },
  ];
  const [tab, setTab] = useState("person");
  const current = tabs.some((t) => t.key === tab) ? tab : "person";

  function onKey(e: KeyboardEvent, i: number) {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const next = tabs[(i + d + tabs.length) % tabs.length].key;
    setTab(next);
    document.getElementById(`lt-tab-${next}`)?.focus();
  }

  return (
    <>
      <section className="ws-hero lt-hero" aria-label="Worker">
        {p.card}
        <div className="ws-hero-text">
          {p.moodline}
          {p.quote}
          <div className="lt-headline">
            <span className="label">In a sentence</span>
            {p.headline}
          </div>
        </div>
      </section>

      <div className="lt">
        <div className="lt-tabs" role="tablist" aria-label="Details">
          {tabs.map((t, i) => (
            <button
              key={t.key}
              id={`lt-tab-${t.key}`}
              type="button"
              role="tab"
              aria-selected={current === t.key}
              aria-controls={`lt-panel-${t.key}`}
              tabIndex={current === t.key ? 0 : -1}
              className={"lt-tab" + (current === t.key ? " on" : "")}
              onClick={() => setTab(t.key)}
              onKeyDown={(e) => onKey(e, i)}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div key={current} className="lt-panel swap" role="tabpanel" id={`lt-panel-${current}`} aria-labelledby={`lt-tab-${current}`}>
          {current === "person" && (
            <>
              <div className="lt-plate">
                <Voices p={p} />
                <Note p={p} />
              </div>
              <div className="ws-about-grid">
                <div>
                  <span className="label">Who they are</span>
                  {p.who}
                </div>
                <div>
                  <span className="label">Biggest worry</span>
                  {p.worry}
                </div>
                <div>
                  <span className="label">What would help</span>
                  {p.help}
                </div>
              </div>
              {p.transcript}
            </>
          )}
          {current === "job" && p.patterns && <JobPatterns {...p.patterns} />}
          {current === "scenarios" && <Scenarios p={p} title={false} />}
        </div>
      </div>
    </>
  );
}

/* ---------- B: bento grid of cards ---------- */

function BentoLayout({ p }: { p: DetailsParts }) {
  const j = p.patterns ? jobPatternParts(p.patterns) : null;
  return (
    <div className="bn">
      <section className="bn-card bn-hero" aria-label="Worker">
        {p.card}
        <div className="bn-hero-text">
          {p.moodline}
          {p.quote}
        </div>
      </section>

      {p.voices.map((v) => (
        <div key={v.key} className="bn-card bn-voice">
          <span className="ws-label">{v.label}</span>
          {v.body}
        </div>
      ))}

      <div className="bn-card bn-note">
        <span className="ws-label">Interviewer&apos;s note</span>
        {p.note}
      </div>

      <section className="bn-card bn-strip" aria-labelledby="ws-all">
        <h2 className="ws-label" id="ws-all">
          All five scenarios
        </h2>
        {p.strip}
      </section>

      <section className="bn-card bn-about" aria-label="About this worker">
        <div>
          <span className="ws-label">In a sentence</span>
          {p.headline}
        </div>
        <div>
          <span className="ws-label">Who they are</span>
          {p.who}
        </div>
      </section>
      <div className="bn-card bn-half">
        <span className="ws-label">Biggest worry</span>
        {p.worry}
      </div>
      <div className="bn-card bn-half">
        <span className="ws-label">What would help</span>
        {p.help}
      </div>

      {j && (
        <>
          <section className="bn-card bn-jobhead" aria-labelledby="ws-pat-h">
            {j.head}
            {j.mood}
          </section>
          <div className="bn-card bn-half bn-scroll">{j.actions}</div>
          <div className="bn-card bn-half bn-scroll ws-pat-voice">{j.voices}</div>
          {j.differences && <div className="bn-card bn-half bn-scroll">{j.differences}</div>}
          <div className={"bn-card bn-scroll bn-quotes " + (j.differences ? "bn-half" : "bn-wide")}>{j.quotes}</div>
          <div className="bn-foot">{j.footnote}</div>
        </>
      )}

      <div className="bn-card bn-wide bn-transcript">{p.transcript}</div>
    </div>
  );
}

/* ---------- C: person and job side by side, with a sticky section nav ---------- */

function ColumnsLayout({ p }: { p: DetailsParts }) {
  const links = [
    { id: "tc-person", label: "This person" },
    ...(p.patterns ? [{ id: "tc-job", label: `All ${p.patterns.plural}` }] : []),
    { id: "tc-scen", label: "Scenarios" },
    { id: "tc-story", label: "Story" },
  ];
  const [active, setActive] = useState("tc-person");
  const ids = links.map((l) => l.id).join(",");

  // Highlight the section whose heading sits nearest the top of the screen (the columns run side by side, so the lowest
  // one that has reached the top wins). Right after a click, keep the clicked link while the page glides there.
  const lockUntil = useRef(0);
  useEffect(() => {
    const els = ids
      .split(",")
      .map((id) => document.getElementById(id))
      .filter((e): e is HTMLElement => !!e);
    const pick = () => {
      if (Date.now() < lockUntil.current) return;
      let best = els[0];
      let bestTop = -Infinity;
      for (const el of els) {
        const top = el.getBoundingClientRect().top;
        if (top < 140 && top > bestTop) {
          best = el;
          bestTop = top;
        }
      }
      if (best) setActive(best.id);
    };
    pick();
    window.addEventListener("scroll", pick, { passive: true });
    window.addEventListener("resize", pick);
    return () => {
      window.removeEventListener("scroll", pick);
      window.removeEventListener("resize", pick);
    };
  }, [ids]);

  return (
    <div className="tc">
      <nav className="tc-nav" aria-label="On this page">
        {links.map((l) => (
          <a
            key={l.id}
            href={`#${l.id}`}
            className={"tc-link" + (active === l.id ? " on" : "")}
            aria-current={active === l.id ? "location" : undefined}
            onClick={(e) => {
              e.preventDefault();
              document.getElementById(l.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
              lockUntil.current = Date.now() + 1200;
              setActive(l.id);
            }}
          >
            {l.label}
          </a>
        ))}
      </nav>

      <div className="tc-cols">
        <div className="tc-left">
          <section className="tc-person" id="tc-person" aria-label="This person">
            <div className="ws-hero tc-hero">
              {p.card}
              <div className="ws-hero-text">
                {p.moodline}
                {p.quote}
              </div>
            </div>
            <div className="tc-plate">
              <Voices p={p} />
              <Note p={p} />
            </div>
          </section>
          <section className="tc-story" id="tc-story" aria-labelledby="tc-story-h">
            <h2 className="t-section" id="tc-story-h">
              Their story
            </h2>
            <div>
              <span className="label">In a sentence</span>
              {p.headline}
            </div>
            <div>
              <span className="label">Who they are</span>
              {p.who}
            </div>
            <div>
              <span className="label">Biggest worry</span>
              {p.worry}
            </div>
            <div>
              <span className="label">What would help</span>
              {p.help}
            </div>
            {p.transcript}
          </section>
        </div>
        <div className="tc-right">
          {p.patterns && (
            <div className="tc-job" id="tc-job">
              <JobPatterns {...p.patterns} />
            </div>
          )}
          <div className="tc-scen" id="tc-scen">
            <Scenarios p={p} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function DetailsBody({ layout, parts }: { layout: DetailsLayout; parts: DetailsParts }) {
  if (layout === "a") return <TabsLayout p={parts} />;
  if (layout === "b") return <BentoLayout p={parts} />;
  if (layout === "c") return <ColumnsLayout p={parts} />;
  return <DefaultLayout p={parts} />;
}
