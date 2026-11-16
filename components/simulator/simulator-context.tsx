"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { useSearchParams } from "next/navigation";
import { createSim, type Sim } from "@/lib/sim/engine";
import type { SimData, TraitValues } from "@/lib/sim/types";
import { stateFromParams, stateToParams, type CompareColumn, type Order, type SimState, type View } from "@/lib/sim/url-state";

interface SimulatorApi {
  sim: Sim;
  state: SimState;
  setView(v: View): void;
  setSector(id: string): void;
  setTrait(key: string, value: number): void;
  setLevel(i: number): void;
  setOrder(o: Order): void;
  setCompare(cols: CompareColumn[]): void;
  query: string;
  setQuery(q: string): void;
  toast(msg: string): void;
}

const Ctx = createContext<SimulatorApi | null>(null);

export function useSimulator() {
  const v = useContext(Ctx);
  if (!v) throw new Error("useSimulator must be used inside <SimulatorProvider>");
  return v;
}

function defaultCompare(sim: Sim, s: SimState): CompareColumn[] {
  const has = (id: string) => !!sim.sector(id);
  const other = s.sectorId === "transport" ? "finance" : "transport";
  const second: TraitValues = { ...s.traits };
  // A contrasting persona in the same sector: one step lower on each ordinal trait, earlier career.
  for (const t of sim.data.traits) second[t.key] = Math.min(t.options.length - 1, 1);
  if ("politics" in second) second.politics = 0;
  if ("stage" in second) second.stage = 0;
  return [
    { sectorId: s.sectorId, traits: { ...s.traits } },
    { sectorId: s.sectorId, traits: second },
    { sectorId: has(other) ? other : sim.data.sectors[0].id, traits: { ...s.traits } },
  ];
}

export function SimulatorProvider({ data, children }: { data: SimData; children: ReactNode }) {
  const sim = useMemo(() => createSim(data), [data]);
  const params = useSearchParams();
  const [state, setState] = useState<SimState>(() => stateFromParams(data, new URLSearchParams(params.toString())));
  const [query, setQuery] = useState("");
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Keep the address bar in step so any view can be shared or bookmarked.
  useEffect(() => {
    const qs = stateToParams(data, state).toString();
    if (qs !== window.location.search.slice(1)) window.history.replaceState(null, "", `?${qs}`);
  }, [data, state]);

  // Back/forward and manual edits of the URL.
  useEffect(() => {
    const onPop = () =>
      setState((s) => ({ ...stateFromParams(data, new URLSearchParams(window.location.search)), compare: s.compare }));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, [data]);

  const setView = useCallback(
    (view: View) => {
      setState((s) => {
        if (s.view === view) return s;
        const compare = view === "compare" && !s.compare ? defaultCompare(sim, s) : s.compare;
        return { ...s, view, compare };
      });
      window.scrollTo(0, 0);
    },
    [sim],
  );

  const toast = useCallback((msg: string) => {
    setToastMsg(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToastMsg(null), 2400);
  }, []);

  // Opening Compare straight from a link needs columns too.
  const resolvedState = useMemo(
    () => (state.view === "compare" && !state.compare ? { ...state, compare: defaultCompare(sim, state) } : state),
    [state, sim],
  );

  const api = useMemo<SimulatorApi>(
    () => ({
      sim,
      state: resolvedState,
      setView,
      setSector: (id) => setState((s) => ({ ...s, sectorId: id })),
      setTrait: (key, value) => setState((s) => ({ ...s, traits: { ...s.traits, [key]: value } })),
      setLevel: (i) =>
        setState((s) => {
          const level = Math.max(0, Math.min(sim.data.levels.length - 1, i));
          return level === s.level ? s : { ...s, level };
        }),
      setOrder: (order) => setState((s) => ({ ...s, order })),
      setCompare: (compare) => setState((s) => ({ ...s, compare })),
      query,
      setQuery,
      toast,
    }),
    [sim, resolvedState, setView, query, toast],
  );

  return (
    <Ctx.Provider value={api}>
      {children}
      {toastMsg && (
        <div className="toast" role="status" aria-live="polite">
          {toastMsg}
        </div>
      )}
    </Ctx.Provider>
  );
}
