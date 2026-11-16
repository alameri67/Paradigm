"use client";

import Link from "next/link";
import { AmountSlider } from "@/components/ui/amount-slider";
import { LiquidGlassNavbar } from "@/components/ui/liquid-glass-navbar";
import type { View } from "@/lib/sim/url-state";
import { MoodTag, pad2 } from "./bits";
import { BriefDocument, BriefView } from "./brief-view";
import { CompareView } from "./compare-view";
import { Icon, iconSvg } from "./icons";
import { OverviewView } from "./overview-view";
import { PersonaView } from "./persona-view";
import { useSimulator } from "./simulator-context";

const NAV_VIEWS: View[] = ["persona", "compare", "overview"];
const NAV_ITEMS = [
  { label: "Persona", icon: iconSvg("user", 18), fx: "wave" as const },
  { label: "Compare", icon: iconSvg("columns", 18), fx: "pop" as const },
  { label: "Sector overview", icon: iconSvg("grid", 18), fx: "spin" as const },
];

function SectorSidebar() {
  const { sim, state, query, setQuery, setSector, setView } = useSimulator();
  const q = query.trim().toLowerCase();
  const items = sim.data.sectors
    .map((s, i) => ({ s, i }))
    .filter(({ s }) => !q || s.name.toLowerCase().includes(q) || s.role.toLowerCase().includes(q));

  return (
    <nav className="side" aria-label="Sectors">
      <div className="brand">Simulator</div>
      <Link href="/workers" className="srow" style={{ gridTemplateColumns: "20px minmax(0,1fr)" }}>
        <Icon name="user" />
        <span className="srow-name">Workers (new layout)</span>
      </Link>
      <Link href="/explore" className="srow" style={{ gridTemplateColumns: "20px minmax(0,1fr)" }}>
        <Icon name="grid" />
        <span className="srow-name">Persona cards (115 interviews)</span>
      </Link>
      <label className="search">
        <Icon name="search" size={16} stroke={2} />
        <input
          type="search"
          placeholder="Search sectors or roles"
          aria-label="Search sectors"
          autoComplete="off"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>
      <div className="sector-list">
        {items.length === 0 ? (
          <div className="side-empty">
            <span>No sectors match “{query.trim()}”.</span>
            <button type="button" className="lq-btn sm" onClick={() => setQuery("")}>
              Clear search
            </button>
          </div>
        ) : (
          items.map(({ s, i }) => {
            const on = s.id === state.sectorId;
            const r = sim.response(sim.resolve(s.id, state.traits), state.level);
            return (
              <button
                key={s.id}
                type="button"
                className={"srow" + (on ? " on" : "")}
                aria-current={on ? "true" : undefined}
                onClick={() => {
                  setSector(s.id);
                  if (state.view !== "persona") setView("persona");
                }}
              >
                <span className="srow-num">{pad2(i + 1)}</span>
                <span className="srow-name">{s.name}</span>
                {r && <MoodTag mood={r.mood} sm />}
              </button>
            );
          })
        )}
      </div>
    </nav>
  );
}

function TraitBar() {
  const { sim, state, setTrait } = useSimulator();
  return (
    <div className="traitbar">
      {sim.data.traits.map((t) => (
        <div className="trait" key={t.key}>
          <span className="label" id={`tl-${t.key}`}>
            {t.label}
          </span>
          <LiquidGlassNavbar
            mode="radio"
            size="sm"
            labelledBy={`tl-${t.key}`}
            items={t.options.map((o) => ({ label: o }))}
            active={state.traits[t.key] ?? 0}
            onChange={(j) => setTrait(t.key, j)}
          />
        </div>
      ))}
    </div>
  );
}

export function SimulatorShell() {
  const { sim, state, setView, setLevel } = useSimulator();
  const showTraits = state.view === "persona" || state.view === "overview";
  const showDial = state.view !== "brief";

  return (
    <>
      <div className="app">
        <SectorSidebar />
        <div className="main">
          <header className="topbar">
            <LiquidGlassNavbar
              mode="nav"
              ariaLabel="Views"
              compact="auto"
              items={NAV_ITEMS}
              active={NAV_VIEWS.indexOf(state.view === "brief" ? "persona" : state.view)}
              onChange={(i) => setView(NAV_VIEWS[i])}
            />
            {state.view === "persona" && (
              <button type="button" className="lq-btn primary" onClick={() => setView("brief")}>
                <Icon name="file" />
                Export brief
              </button>
            )}
          </header>
          {(showTraits || showDial) && (
            <div className="controls">
              {/* Kept mounted (just hidden) so the liquid pills keep their state between views. */}
              <div hidden={!showTraits}>
                <TraitBar />
              </div>
              <div className="dialbar" hidden={!showDial}>
                <span className="label" id="dial-label">
                  AI aggressiveness
                </span>
                <AmountSlider stops={sim.data.levels} value={state.level} onChange={setLevel} labelledBy="dial-label" />
              </div>
            </div>
          )}
          <main className="view">
            {state.view === "compare" ? (
              <CompareView />
            ) : state.view === "overview" ? (
              <OverviewView />
            ) : state.view === "brief" ? (
              <BriefView />
            ) : (
              <PersonaView />
            )}
          </main>
        </div>
      </div>
      <div id="print-root" aria-hidden="true">
        <BriefDocument />
      </div>
    </>
  );
}
