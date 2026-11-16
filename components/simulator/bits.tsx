"use client";

import type { ReactNode } from "react";
import type { Sector } from "@/lib/sim/types";
import { Icon } from "./icons";
import { useSimulator } from "./simulator-context";

/** Mood: a coloured dot always beside a word. */
export function MoodTag({ mood, sm }: { mood: string; sm?: boolean }) {
  const { sim } = useSimulator();
  const m = sim.mood(mood);
  return (
    <span className={`mood tone-${m.tone}${sm ? " sm" : ""}`}>
      <span className="dot" aria-hidden="true" />
      <span className="mood-word">{m.label}</span>
    </span>
  );
}

export function PortraitImage({ sector, iconSize = 48 }: { sector: Sector; iconSize?: number }) {
  if (sector.portraitUrl) {
    // Portraits are user-supplied URLs of unknown size; a plain img keeps them flexible.
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={sector.portraitUrl} alt={`${sector.role} portrait`} />;
  }
  return <Icon name="person" size={iconSize} stroke={2} />;
}

/** Text that fades in whenever it changes (keyed remount replays the animation). */
export function Fade({
  as: Tag = "p",
  className = "",
  children,
  text,
}: {
  as?: "p" | "span";
  className?: string;
  children: ReactNode;
  text: string;
}) {
  return (
    <Tag key={text} className={`${className} swap`.trim()}>
      {children}
    </Tag>
  );
}

export const VOICES = [
  ["think", "Thinks"],
  ["do", "Does"],
  ["feel", "Feels"],
] as const;

export const pad2 = (n: number) => (n < 10 ? "0" : "") + n;
