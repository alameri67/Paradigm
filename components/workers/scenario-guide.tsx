"use client";

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Brain, Footprints, Heart, Info, MessageCircle, X } from "lucide-react";
import { Icon, type IconName } from "@/components/simulator/icons";
import { Bullets } from "./bullets";
import { SCENARIOS, type ScenarioCode } from "@/lib/workers/types";
import {
  CLOSING_QUESTION,
  CORE_QUESTIONS,
  FOLLOW_UPS,
  SCENARIO_GUIDE,
  SHARED_ASSUMPTIONS,
} from "@/lib/workers/scenario-guide";

const SCENARIO_ICON: Record<ScenarioCode, IconName> = { S0: "plateau", S1: "trend", S4: "hourglass", S3: "clock", S2: "zap" };
const Q_ICON = { say: MessageCircle, think: Brain, do: Footprints, feel: Heart } as const;
/** Each scenario takes its colour from its stop on the dial, mildest (green) to most extreme (red). */
const accent = (i: number) => ({ ["--end-accent" as string]: `var(--stop${i})` }) as CSSProperties;

/**
 * The pill beside "AI scenario". It opens the guide to the five scenarios: what each one is,
 * what it assumes, when AI and robots arrive, and what the interviewer asks.
 */
export function ScenarioGuidePill({ current, onPick }: { current: ScenarioCode; onPick?: (s: ScenarioCode) => void }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button type="button" className="db-chip sg-pill" aria-haspopup="dialog" aria-expanded={open} onClick={() => setOpen(true)}>
        <Info size={14} strokeWidth={2} aria-hidden="true" />
        <span className="db-chip-name">About the 5 scenarios</span>
      </button>
      {open && <ScenarioGuide current={current} onPick={onPick} onClose={() => setOpen(false)} />}
    </>
  );
}

function ScenarioGuide({
  current,
  onPick,
  onClose,
}: {
  current: ScenarioCode;
  onPick?: (s: ScenarioCode) => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    // A native modal dialog: focus stays inside, Escape closes it, the page behind can't be clicked.
    if (!d.open) d.showModal();
    const html = document.documentElement;
    const before = html.style.overflow;
    html.style.overflow = "hidden";
    return () => {
      html.style.overflow = before;
    };
  }, []);
  const pick = onPick
    ? (s: ScenarioCode) => {
        onPick(s);
        onClose();
      }
    : undefined;

  return (
    <dialog
      ref={ref}
      className="sg"
      aria-labelledby="sg-title"
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
    >
      <div className="sg-panel">
        <header className="sg-head">
          <div className="sg-head-text">
            <h2 className="t-title" id="sg-title">
              The five AI scenarios
            </h2>
            <p className="db-panel-sub">
              Everyone is interviewed about all five. The interviewer reads each one out as a short card, then asks the same questions. The dial shows them
              from mildest to most extreme.
            </p>
          </div>
          <button type="button" className="ask-x" aria-label="Close" onClick={onClose} autoFocus>
            <X size={18} aria-hidden="true" />
          </button>
        </header>
        <div className="sg-body">
          <TimelineLayout current={current} onPick={pick} />
        </div>
      </div>
    </dialog>
  );
}

type LayoutProps = { current: ScenarioCode; onPick?: (s: ScenarioCode) => void };

/* ---------- Pieces every layout shares ---------- */

/** Icon, name and timing, over a line in the scenario's colour. Same head as the least / most worried cards. */
function ColHead({ code, current }: { code: ScenarioCode; current: ScenarioCode }) {
  const s = SCENARIOS.find((x) => x.code === code)!;
  return (
    <div className="db-end-head">
      {code === current && <span className="sg-now">On the dial</span>}
      <span className="db-end-ico" aria-hidden="true">
        <Icon name={SCENARIO_ICON[code]} size={20} />
      </span>
      <div className="db-end-titles">
        <h3 className="db-end-title">{s.name}</h3>
        <p className="db-end-n">{s.when}</p>
      </div>
    </div>
  );
}

function Block({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="db-end-block">
      <div className="db-end-label">{label}</div>
      {children}
    </div>
  );
}

/** Say, think, do, feel as the same four tiles the details page uses. */
function QuestionTiles() {
  return (
    <div className="sg-tiles">
      {CORE_QUESTIONS.map((q) => {
        const Ico = Q_ICON[q.key];
        return (
          <div key={q.key} className="ws-voice">
            <h4 className="ws-voice-head">
              <span className="ws-voice-ico" aria-hidden="true">
                <Ico size={16} strokeWidth={1.8} />
              </span>
              {q.label}
            </h4>
            <p>“{q.text}”</p>
          </div>
        );
      })}
    </div>
  );
}

/** What every scenario shares: the questions, the follow-ups, the closing question and the common assumptions. */
function SharedBand() {
  return (
    <section className="sg-shared" aria-labelledby="sg-shared-h">
      <h3 className="label" id="sg-shared-h">
        Asked in every scenario, right after the card
      </h3>
      <QuestionTiles />
      <div className="sg-shared-row">
        <Block label="Then two follow-ups, such as">
          <ul className="sg-plain">
            {FOLLOW_UPS.map((f) => (
              <li key={f}>“{f}”</li>
            ))}
          </ul>
        </Block>
        <Block label="And once, at the very end">
          <p className="sg-closing">“{CLOSING_QUESTION}”</p>
        </Block>
        <Block label="True in all five">
          <Bullets text={SHARED_ASSUMPTIONS} />
        </Block>
      </div>
    </section>
  );
}

function PickButton({ code, current, onPick }: { code: ScenarioCode; current: ScenarioCode; onPick?: (s: ScenarioCode) => void }) {
  if (!onPick || code === current) return null;
  return (
    <button type="button" className="db-pop-link sg-pick" onClick={() => onPick(code)}>
      Show this scenario
    </button>
  );
}

/* ---------- A timeline over the five columns ---------- */

const T0 = 2026;
const T1 = 2040;
const pct = (y: number) => `${((y - T0) / (T1 - T0)) * 100}%`;

function TimelineLayout({ current, onPick }: LayoutProps) {
  return (
    <>
      <section className="sg-tl" aria-label="When thinking AI and robots arrive in each scenario">
        <div className="sg-tl-axis" aria-hidden="true">
          {[2026, 2028, 2031, 2034, 2036, 2039].map((y) => (
            <span key={y} className="mono" style={{ left: pct(y) }}>
              {y === 2026 ? "Now" : y}
            </span>
          ))}
        </div>
        {SCENARIOS.map((s, i) => {
          const g = SCENARIO_GUIDE[s.code];
          return (
            <div key={s.code} className={"sg-tl-row" + (s.code === current ? " on" : "")} style={accent(i)}>
              <span className="sg-tl-name">
                <Icon name={SCENARIO_ICON[s.code]} size={14} /> {s.name}
              </span>
              <span className="sg-tl-track">
                {g.agi && g.robots ? (
                  <>
                    <span className="sg-tl-lead" style={{ width: pct(g.agi) }} />
                    <span className="sg-tl-gap" style={{ left: pct(g.agi), width: `calc(${pct(g.robots)} - ${pct(g.agi)})` }} />
                    <span className="sg-tl-dot" style={{ left: pct(g.agi) }} title={`Thinking AI by ${g.agi}`} />
                    <span className="sg-tl-dot hollow" style={{ left: pct(g.robots) }} title={`Robots around ${g.robots}`} />
                    <span className="sg-tl-after" style={{ left: pct(g.robots) }} />
                  </>
                ) : (
                  <span className={"sg-tl-flat" + (s.code === "S1" ? " rising" : "")}>{s.code === "S1" ? "Gradual change, no AGI" : "Little change"}</span>
                )}
              </span>
            </div>
          );
        })}
        <div className="sg-tl-key" aria-hidden="true">
          <span>
            <i className="sg-tl-dot" /> AI can do almost any thinking work
          </span>
          <span>
            <i className="sg-tl-dot hollow" /> Robots catch up on hands-on work
          </span>
        </div>
      </section>
      <div className="sg-cols">
        {SCENARIOS.map((s, i) => (
          <article key={s.code} className={"db-end sg-col" + (s.code === current ? " on" : "")} style={accent(i)}>
            <ColHead code={s.code} current={current} />
            <p className="sg-strong">{SCENARIO_GUIDE[s.code].summary}</p>
            <Block label="Assumptions">
              <Bullets text={SCENARIO_GUIDE[s.code].assumptions} />
            </Block>
            <Block label="Time to prepare">
              <p>{SCENARIO_GUIDE[s.code].runway}</p>
            </Block>
            <PickButton code={s.code} current={current} onPick={onPick} />
          </article>
        ))}
      </div>
      <SharedBand />
    </>
  );
}
