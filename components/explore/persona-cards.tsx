"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { PeakChart } from "@/components/ui/peak-chart";
import { GlowButton, GlowSegmented } from "@/components/ui/glow-controls";
import { Icon } from "@/components/simulator/icons";
import type { InterviewCard, MoodKey, ScenarioCode } from "@/lib/interviews/data";

const CODES: ScenarioCode[] = ["S0", "S1", "S2", "S3", "S4"];
const NAMES: Record<ScenarioCode, string> = {
  S0: "No major impact",
  S1: "Capable but slow",
  S2: "Moderately fast",
  S3: "Fast",
  S4: "Fast AI and fast robots",
};
const MOODS: MoodKey[] = ["calm", "uneasy", "anxious", "alarmed", "panicked"];
const MOOD_LABEL: Record<MoodKey, string> = {
  calm: "Calm",
  uneasy: "Uneasy",
  anxious: "Anxious",
  alarmed: "Alarmed",
  panicked: "Panicked",
};
/** The card's glow is hue-shifted to this colour, so it reads from calm green to panicked red. */
const MOOD_ACCENT: Record<MoodKey, string> = {
  calm: "#2ec99a",
  uneasy: "#c9b02e",
  anxious: "#e08a2e",
  alarmed: "#e0532e",
  panicked: "#e02e4a",
};
/** Short sector names that fit in the card's top-left corner. */
const SHORT: Record<string, string> = {
  "Agriculture (logging and farm support)": "Agriculture",
  "Mining, oil and gas": "Mining, oil and gas",
  "Transportation and warehousing": "Transport and warehousing",
  "Professional, scientific and technical services": "Professional services",
  "Management of companies": "Management",
  "Administrative and support services": "Admin and support",
  "Health care and social assistance": "Health care",
  "Arts, entertainment and recreation": "Arts and recreation",
  "Accommodation and food services": "Food and hotels",
};

const CARD_W = 300;
const CARD_H = Math.round((CARD_W * 696) / 540);
const level = (m: MoodKey) => MOODS.indexOf(m) + 1;

/** Mounts its children only once they come near the screen; each card paints a heavy canvas. */
function WhenVisible({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: "300px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <div ref={ref} style={{ width: CARD_W, minHeight: CARD_H }}>
      {shown ? children : <div className="pc-placeholder" style={{ width: CARD_W, height: CARD_H }} />}
    </div>
  );
}

function Card({
  p,
  scenario,
  onScenario,
}: {
  p: InterviewCard;
  scenario: ScenarioCode;
  onScenario: (s: ScenarioCode) => void;
}) {
  const s = p.scenarios[scenario];
  return (
    <article className="pc-item" aria-label={`${p.name}, ${p.role}`}>
      <WhenVisible>
        <PeakChart
          width={CARD_W}
          data={CODES.map((c) => level(p.scenarios[c].mood))}
          labels={CODES.map((c) => `${c} · ${NAMES[c]}`)}
          value={level(s.mood)}
          valueSuffix="/5"
          title={p.name}
          caption={p.role}
          updatedText={SHORT[p.group] ?? p.group}
          trend="none"
          periods={CODES}
          period={scenario}
          onPeriodChange={(v) => onScenario(v as ScenarioCode)}
          accent={MOOD_ACCENT[s.mood]}
          formatValue={(v) => MOOD_LABEL[MOODS[Math.max(0, Math.min(4, Math.round(v) - 1))]]}
        />
      </WhenVisible>
      <div className="pc-text">
        <p className="pc-mood">
          <span className="pc-dot" style={{ background: MOOD_ACCENT[s.mood] }} aria-hidden="true" />
          {MOOD_LABEL[s.mood]} in {scenario} · {NAMES[scenario]}
        </p>
        <p className="pc-say">“{s.say}”</p>
        <p className="pc-meta">
          {p.id} · {p.role} · {p.group}
        </p>
      </div>
    </article>
  );
}

export function PersonaCards({ cards, groups }: { cards: InterviewCard[]; groups: string[] }) {
  const [group, setGroup] = useState(groups[0]);
  const [scenario, setScenario] = useState<ScenarioCode>("S2");
  const shown = group === "all" ? cards : cards.filter((c) => c.group === group);

  return (
    <div className="pc-page">
      <header className="pc-head">
        <GlowButton href="/" size="sm">
          <Icon name="back" />
          Simulator
        </GlowButton>
        <div className="pc-title">
          <h1 className="t-title">Persona cards</h1>
          <p className="fg2 t-ui">
            One card per interviewed person. The line shows how worried they get from S0 to S4, and the big number is
            their worry level, from 1 (calm) to 5 (panicked), in the scenario you pick. These are simulated interviews,
            not real people.
          </p>
        </div>
        <div className="pc-controls">
          <label className="field" style={{ minWidth: 260 }}>
            <span className="label">Sector</span>
            <span className="select">
              <select value={group} onChange={(e) => setGroup(e.target.value)}>
                {groups.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
                <option value="all">All 115 people</option>
              </select>
              <Icon name="down" />
            </span>
          </label>
          <div className="field">
            <span className="label" id="pc-scn">
              Scenario
            </span>
            <GlowSegmented
              mode="radio"
              size="sm"
              labelledBy="pc-scn"
              items={CODES.map((c) => ({ label: c }))}
              active={CODES.indexOf(scenario)}
              onChange={(i) => setScenario(CODES[i])}
            />
          </div>
          <p className="t-ui fg2 pc-scn-name">
            {scenario} · {NAMES[scenario]}
          </p>
        </div>
      </header>
      <section className="pc-panel">
        <div className="pc-grid">
          {shown.map((p) => (
            <Card key={p.id} p={p} scenario={scenario} onScenario={setScenario} />
          ))}
        </div>
      </section>
    </div>
  );
}
