import type { Sim } from "./engine";
import type { TraitValues } from "./types";

/** Plain-text version of the executive brief, for "Copy as text". */
export function briefText(sim: Sim, sectorId: string, traits: TraitValues, level: number): string {
  const sec = sim.sector(sectorId);
  const res = sim.resolve(sectorId, traits);
  const r = sim.response(res, level);
  const lv = sim.data.levels[level];
  if (!sec || !res || !r || !lv) return "";

  const lines = [
    "Executive brief · Paradigm",
    `${sec.role} · ${sec.name}${res.persona.title ? ` · ${res.persona.title}` : ""}`,
    `Persona: ${sim.traitSummary(traits)}`,
    `Scenario: ${lv.code} · ${lv.name} (${lv.year}) · ${lv.description}`,
    `Mood: ${sim.mood(r.mood).label}`,
    "",
    `Says: “${r.say}”`,
    `Thinks: ${r.think}`,
    `Does: ${r.do}`,
    `Feels: ${r.feel}`,
    "",
    "All five levels:",
  ];
  sim.data.levels.forEach((l, i) => {
    const ri = sim.response(res, i);
    if (ri) lines.push(`${l.code} ${l.name} (${l.year}) · ${sim.mood(ri.mood).label} · “${ri.say}”`);
  });
  return lines.join("\n");
}
