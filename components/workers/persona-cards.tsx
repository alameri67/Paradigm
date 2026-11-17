"use client";

import GlassProfileCard from "@/components/ui/glassmorphism-profile-card";
import Weather, { type WeatherHour, type WeatherKind } from "@/components/ui/weather";
import { openPersonaChat } from "@/lib/ask/chat-store";
import { AnimatedFeatureCard } from "@/components/ui/feature-card-1";
import { toPoints } from "./bullets";
import {
  MOODS,
  MOOD_ACCENT,
  MOOD_LABEL,
  SCENARIOS,
  type Interview,
  type MoodKey,
  type ScenarioCode,
  type Worker,
  type WorkerPortrait,
} from "@/lib/workers/types";

/** Which persona card the details page shows: ?card=current|glass|weather|feature. */
export const CARD_KINDS = ["current", "glass", "weather", "feature"] as const;
export type CardKind = (typeof CARD_KINDS)[number];
export const isCardKind = (v: string | null): v is CardKind => (CARD_KINDS as readonly string[]).includes(v ?? "");

/** Short scenario names, for places with little room (the scenario columns, the weather card's row). */
export const SCENARIO_SHORT: Record<ScenarioCode, string> = {
  S0: "Plateau",
  S1: "Steady",
  S4: "AGI 2036",
  S3: "AGI 2031",
  S2: "AGI 2028",
};

/** Worry on a 1–5 scale: calm is 1, panicked is 5 (the same scale as the Peak Chart card). */
export const worry = (m: MoodKey) => MOODS.indexOf(m) + 1;

/** Mood as weather: the calmer, the clearer the sky. */
const MOOD_SKY: Record<MoodKey, WeatherKind> = {
  calm: "clear",
  uneasy: "partly",
  anxious: "cloud",
  alarmed: "rain",
  panicked: "storm",
};

/** Mood as the feature card's colour, in one place. */
const MOOD_FEATURE_COLOR: Record<MoodKey, "green" | "blue" | "orange" | "red"> = {
  calm: "green",
  uneasy: "blue",
  anxious: "orange",
  alarmed: "red",
  panicked: "red",
};

const plain = (s: string) => s.replace(/\*\*/g, "");
const scenarioOf = (code: ScenarioCode) => SCENARIOS.find((s) => s.code === code)!;

interface PersonaProps {
  worker: Worker;
  iv: Interview;
  scenario: ScenarioCode;
  portrait: WorkerPortrait;
  /** Opens and scrolls to the full interview. */
  onReadInterview: () => void;
}

/** Glass profile card: portrait, name, job, mood in this scenario, their quote for it, and a way to chat with them. */
export function GlassPersona({ worker, iv, scenario, portrait, onReadInterview }: PersonaProps) {
  const sc = iv.scenarios[scenario];
  const s = scenarioOf(scenario);
  return (
    <GlassProfileCard
      key={scenario}
      name={worker.name}
      role={worker.job}
      avatarSrc={portrait.url}
      statusText={MOOD_LABEL[sc.mood]}
      accent={MOOD_ACCENT[sc.mood]}
      metaText={`${s.name} · ${s.when.charAt(0).toLowerCase()}${s.when.slice(1)}`}
      glowText={`“${sc.quote}”`}
      primaryLabel="Read the interview"
      onPrimary={onReadInterview}
      secondaryLabel={`Chat with ${worker.name.split(" ")[0]}`}
      onSecondary={openPersonaChat}
    />
  );
}

/** Emotional weather: their mood as the sky, worry out of 5 as the big number, and a forecast across the five scenarios. */
export function WeatherPersona({ worker, iv, scenario }: Omit<PersonaProps, "portrait" | "onReadInterview">) {
  const sc = iv.scenarios[scenario];
  const s = scenarioOf(scenario);
  const hours: WeatherHour[] = SCENARIOS.map((x) => ({
    label: SCENARIO_SHORT[x.code],
    hour: 13,
    kind: MOOD_SKY[iv.scenarios[x.code].mood],
    temp: worry(iv.scenarios[x.code].mood),
  }));
  return (
    <Weather
      place={worker.name}
      summary={`${worker.job} · ${s.name}`}
      hour={13}
      sky={MOOD_SKY[sc.mood]}
      condition={MOOD_LABEL[sc.mood]}
      temp={worry(sc.mood)}
      format={(n) => `${n}/5`}
      wind={"Worry, out of 5"}
      live={null}
      hours={hours}
      hoursLabel="Worry in each scenario"
      skyLabel={`${worker.name}: ${MOOD_LABEL[sc.mood].toLowerCase()} in ${s.name}, worry ${worry(sc.mood)} out of 5`}
    />
  );
}

/** Feature card: the version id, the job, their one-line story (the scenario quote sits beside the card), and their cutout, coloured by mood. */
export function FeaturePersona({ worker, iv, scenario, portrait }: Omit<PersonaProps, "onReadInterview">) {
  const sc = iv.scenarios[scenario];
  return (
    <AnimatedFeatureCard
      index={worker.id}
      tag={worker.job}
      title={iv.headlineQuote ? `“${iv.headlineQuote}”` : plain(toPoints(iv.biggestWorry)[0] ?? "")}
      imageSrc={portrait.cutout}
      color={MOOD_FEATURE_COLOR[sc.mood]}
      className="h-[460px]"
    />
  );
}
