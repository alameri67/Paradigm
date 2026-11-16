import type {
  Mood,
  Resolution,
  ResolvedPersona,
  Response,
  Sector,
  SimData,
  Trait,
  TraitValues,
} from "./types";

const clamp = (n: number, a: number, b: number) => Math.max(a, Math.min(b, n));

export interface Sim {
  data: SimData;
  sector(id: string): Sector | undefined;
  mood(key: string): Mood & { index: number };
  /** Exact match wins; otherwise the nearest persona; sectors with no personas use the template text. */
  resolve(sectorId: string, traits: TraitValues): Resolution | null;
  response(res: Resolution | null, levelIndex: number): Response | null;
  traitSummary(traits: TraitValues, sep?: string): string;
  defaultTraits(): TraitValues;
}

/** Weighted distance between two trait selections. Missing values cost the full weight. */
export function traitDistance(traits: Trait[], a: TraitValues, b: TraitValues): number {
  let d = 0;
  for (const t of traits) {
    const w = t.weight ?? 1;
    const x = a[t.key];
    const y = b[t.key];
    if (x == null || y == null) {
      d += w;
      continue;
    }
    d += w * (t.ordinal === false ? (x === y ? 0 : 1) : Math.abs(x - y));
  }
  return d;
}

export function createSim(data: SimData): Sim {
  const sectorById = new Map(data.sectors.map((s) => [s.id, s]));
  const traitByKey = new Map(data.traits.map((t) => [t.key, t]));
  const moodByKey = new Map(data.moods.map((m, index) => [m.key, { ...m, index }]));
  const cache = new Map<string, Resolution | null>();

  function templatePersona(sectorId: string, traits: TraitValues): ResolvedPersona | null {
    const T = data.templates;
    const f = T?.sectors[sectorId];
    const s = sectorById.get(sectorId);
    if (!T || !f || !s) return null;

    const idx = (k: string) => (traitByKey.has(k) && traits[k] != null ? traits[k] : null);
    const inc = idx("income");
    const comp = idx("competence");
    const stage = idx("stage");
    const stageKey = (["early", "mid", "late"] as const)[stage ?? 1] ?? "mid";
    const incKey = (["high", "medium", "low"] as const)[inc ?? 1] ?? "medium";
    const shift = clamp(f.shift + (comp === 0 ? -1 : comp === 2 ? 1 : 0) + (inc === 2 ? 1 : 0), -1, 1);
    const vars: Record<string, string> = { role: s.role, plural: f.plural, task: f.task, core: f.core };
    const fill = (str: string) => str.replace(/\{(\w+)\}/g, (_, k: string) => vars[k] ?? "");

    const responses: Record<string, Response> = {};
    data.levels.forEach((lv, i) => {
      const m = i === 0 ? 0 : clamp(i + shift, 0, data.moods.length - 1);
      const mood = data.moods[m].key;
      responses[lv.code] = {
        say: fill(T.say[i]),
        think: fill(T.think[stageKey][i]),
        do: fill(T.do[incKey][i]),
        feel: mood === data.moods[0].key && i >= 2 ? T.feelCalmLater : (T.feel[mood] ?? ""),
        mood,
      };
    });
    return { id: `template-${sectorId}`, sectorId, title: null, traits: { ...traits }, responses };
  }

  function resolve(sectorId: string, traits: TraitValues): Resolution | null {
    const key = sectorId + "|" + data.traits.map((t) => traits[t.key]).join(",");
    const hit = cache.get(key);
    if (hit !== undefined) return hit;

    let res: Resolution | null = null;
    const list = data.personas.filter((p) => p.sectorId === sectorId);
    if (list.length) {
      let best = list[0];
      let bd = Infinity;
      for (const p of list) {
        const d = traitDistance(data.traits, p.traits, traits);
        if (d < bd) {
          bd = d;
          best = p;
        }
      }
      res = {
        persona: { ...best, title: best.title ?? null },
        exact: bd === 0,
        source: "persona",
      };
    } else {
      const persona = templatePersona(sectorId, traits);
      if (persona) res = { persona, exact: true, source: "template" };
    }
    cache.set(key, res);
    return res;
  }

  return {
    data,
    sector: (id) => sectorById.get(id),
    mood: (key) => moodByKey.get(key) ?? { ...data.moods[0], index: 0 },
    resolve,
    response(res, levelIndex) {
      if (!res) return null;
      const lv = data.levels[levelIndex];
      return (lv && res.persona.responses[lv.code]) || null;
    },
    traitSummary(traits, sep = " · ") {
      return data.traits
        .map((t) => `${t.label} ${traits[t.key] == null ? "any" : t.options[traits[t.key]]}`)
        .join(sep);
    },
    defaultTraits() {
      return Object.fromEntries(data.traits.map((t) => [t.key, 0]));
    },
  };
}
