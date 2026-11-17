"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useState } from "react";
import { GlassIconReveal } from "@/components/ui/liquid-glass-logo-reveal";
import { MOODS, MOOD_ACCENT, MOOD_LABEL, SCENARIOS, type ScenarioCode } from "@/lib/workers/types";
import { PARADIGM_MARK } from "./paradigm-mark";

export const HEADERS = ["glass", "masthead", "shift", "mood"] as const;
export type HeaderKind = (typeof HEADERS)[number];
const HEADER_LABEL: Record<HeaderKind, string> = { glass: "Glass", masthead: "Masthead", shift: "Shift", mood: "Mood strip" };

/** How many people feel each mood, per scenario, in MOODS order. */
export type MoodCounts = Record<ScenarioCode, number[]>;

const CODES = SCENARIOS.map((s) => s.code) as ScenarioCode[];

/** Which scenario the page is showing. The dial keeps it in the address bar as ?s=. */
function useScenario(): ScenarioCode {
  const s = useSearchParams().get("s");
  return CODES.includes(s as ScenarioCode) ? (s as ScenarioCode) : "S2";
}

function GlassHeader() {
  return (
    <header className="hx hx-glass">
      <Link href="/" className="hx-glass-link" aria-label="Paradigm, home">
        <GlassIconReveal
          logo={PARADIGM_MARK}
          label="Paradigm"
          background="#ffffff"
          logoColor="#0d0d0d"
          tileSize={92}
          logoScale={0.56}
          finalScale={0.82}
          keepPlate
          iconPlate
          plateColor="#eef1f6"
          loop={false}
          tuning={{ startZoom: 2.2, shadow: 0, ripple: 0.6 }}
          className="hx-glass-tile"
        />
        <span className="hx-glass-word">Paradigm</span>
      </Link>
    </header>
  );
}

function MastheadHeader({ total, jobs }: { total: number; jobs: number }) {
  return (
    <header className="hx hx-mast">
      <div className="hx-mast-top">
        <span>Simulated interviews by the Work Futures Panel</span>
        <span className="mono">{total.toLocaleString("en-US")} people · {jobs} {jobs === 1 ? "job" : "jobs"} so far</span>
      </div>
      <Link href="/" className="hx-mast-name">
        Paradigm
      </Link>
      <div className="hx-mast-bottom">
        <span>How work could change with AI, told by the people doing it</span>
      </div>
    </header>
  );
}

const SHIFT = [0, 0.04, 0.1, 0.17, 0.26];

function ShiftHeader() {
  const scenario = useScenario();
  const i = CODES.indexOf(scenario);
  const sc = SCENARIOS[i];
  return (
    <header className="hx hx-shift" style={{ ["--shift" as string]: `${SHIFT[i]}em` }}>
      <Link href="/" className="hx-shift-name" aria-label="Paradigm">
        <span className="hx-shift-top" aria-hidden="true">Paradigm</span>
        <span className="hx-shift-bottom" aria-hidden="true">Paradigm</span>
      </Link>
      <p className="hx-shift-cap">
        The bigger the change, the further the name splits. Now: <b>{sc.name}</b>
      </p>
    </header>
  );
}

function MoodHeader({ counts, total }: { counts: MoodCounts; total: number }) {
  const scenario = useScenario();
  const sc = SCENARIOS[CODES.indexOf(scenario)];
  const row = counts[scenario];
  return (
    <header className="hx hx-mood">
      <div className="hx-mood-line">
        <Link href="/" className="hx-mood-name">
          Paradigm
        </Link>
        <span className="hx-mood-cap">
          {total.toLocaleString("en-US")} people, if <b>{sc.name}</b> happens
        </span>
      </div>
      <div className="hx-mood-strip" role="img" aria-label={MOODS.map((m, k) => `${row[k]} ${MOOD_LABEL[m].toLowerCase()}`).join(", ")}>
        {MOODS.map((m, k) => (
          <span key={m} style={{ flexGrow: row[k], background: MOOD_ACCENT[m] }} title={`${MOOD_LABEL[m]}: ${row[k]}`} />
        ))}
      </div>
    </header>
  );
}

/**
 * Explore branch only: four header ideas, switched with the pill at the bottom of the page
 * or ?header=glass|masthead|shift|mood.
 */
export function SiteHeader({ counts, total, jobs }: { counts: MoodCounts; total: number; jobs: number }) {
  const params = useSearchParams();
  const [kind, setKind] = useState<HeaderKind>(() => {
    const h = params.get("header");
    return HEADERS.includes(h as HeaderKind) ? (h as HeaderKind) : "glass";
  });
  const pick = (k: HeaderKind) => {
    setKind(k);
    const q = new URLSearchParams(window.location.search);
    q.set("header", k);
    window.history.replaceState(null, "", `?${q}`);
  };
  return (
    <>
      {kind === "glass" && <GlassHeader />}
      {kind === "masthead" && <MastheadHeader total={total} jobs={jobs} />}
      {kind === "shift" && <ShiftHeader />}
      {kind === "mood" && <MoodHeader counts={counts} total={total} />}
      <div className="hx-switch" role="group" aria-label="Header idea">
        {HEADERS.map((k) => (
          <button key={k} type="button" aria-pressed={kind === k} onClick={() => pick(k)}>
            {HEADER_LABEL[k]}
          </button>
        ))}
      </div>
    </>
  );
}
