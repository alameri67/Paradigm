"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import TigerTearReveal from "@/components/ui/tiger-tear-reveal";
import { SCENARIOS, type ScenarioCode } from "@/lib/workers/types";

const CODES = SCENARIOS.map((s) => s.code) as ScenarioCode[];
/**
 * How torn the name is at each dial stop, mildest to most extreme (the tear reveal's 0–1 progress):
 * AI Plateau whole, Steady Disruption a crack, then the three AGI scenarios pulling the halves further
 * apart the sooner AGI arrives (fully open from 0.62).
 */
const TEAR = [0, 0.13, 0.32, 0.46, 0.62];

/**
 * The Paradigm name torn in two, with "Shift" over it. It follows the AI scenario dial
 * (kept in the address bar as ?s=), not scrolling. Nothing shows through the gap.
 */
export function ShiftHeader() {
  const s = useSearchParams().get("s");
  // The dial starts at the far right (AGI by 2028) when no scenario is set.
  const at = CODES.includes(s as ScenarioCode) ? CODES.indexOf(s as ScenarioCode) : CODES.length - 1;
  return (
    <header className="hx hx-tear">
      <Link href="/" className="hx-tear-link" aria-label="Paradigm, home">
        <TigerTearReveal
          word="PARADIGM"
          tagline="SHIFT"
          progress={TEAR[at]}
          behind={false}
          hint={false}
          paper="#ffffff"
          ink="#e0532e"
          taglineColor="#0d0d0d"
          fontFamily='var(--font-anton), "Anton", Impact, "Bebas Neue", "Oswald", "Arial Narrow", "Arial Black", sans-serif'
          height="var(--hx-tear-h)"
        />
      </Link>
    </header>
  );
}
