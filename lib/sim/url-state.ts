import type { SimData, TraitValues } from "./types";

export const VIEWS = ["persona", "compare", "overview", "brief"] as const;
export type View = (typeof VIEWS)[number];
export type Order = "list" | "impact";

export interface CompareColumn {
  sectorId: string;
  traits: TraitValues;
}

export interface SimState {
  view: View;
  sectorId: string;
  traits: TraitValues;
  level: number;
  order: Order;
  /** Filled on the first visit to Compare. */
  compare: CompareColumn[] | null;
}

const DEFAULTS = {
  view: "persona" as View,
  sectorId: "health",
  level: 2,
};

/** Read the shareable parts of the state from URL search params, falling back to defaults. */
export function stateFromParams(data: SimData, params: URLSearchParams): SimState {
  const view = (VIEWS as readonly string[]).includes(params.get("view") ?? "")
    ? (params.get("view") as View)
    : DEFAULTS.view;

  const sectorParam = params.get("sector");
  const sectorId = data.sectors.some((s) => s.id === sectorParam)
    ? sectorParam!
    : data.sectors.some((s) => s.id === DEFAULTS.sectorId)
      ? DEFAULTS.sectorId
      : data.sectors[0].id;

  const levelNum = Number(params.get("level"));
  const level =
    params.has("level") && Number.isInteger(levelNum) && levelNum >= 0 && levelNum < data.levels.length
      ? levelNum
      : Math.min(DEFAULTS.level, data.levels.length - 1);

  const traits: TraitValues = {};
  for (const t of data.traits) {
    const v = Number(params.get(t.key));
    traits[t.key] = params.has(t.key) && Number.isInteger(v) && v >= 0 && v < t.options.length ? v : 0;
  }
  // Sensible starting persona for the sample data (Centrist, Mid-career).
  if (!params.has("politics") && data.traits.some((t) => t.key === "politics")) traits.politics = 1;
  if (!params.has("stage") && data.traits.some((t) => t.key === "stage")) traits.stage = 1;

  const order: Order = params.get("order") === "impact" ? "impact" : "list";
  return { view, sectorId, traits, level, order, compare: null };
}

/** Serialise the shareable parts of the state for the address bar. */
export function stateToParams(data: SimData, s: SimState): URLSearchParams {
  const p = new URLSearchParams();
  if (s.view !== DEFAULTS.view) p.set("view", s.view);
  p.set("sector", s.sectorId);
  p.set("level", String(s.level));
  for (const t of data.traits) p.set(t.key, String(s.traits[t.key] ?? 0));
  if (s.order !== "list") p.set("order", s.order);
  return p;
}
