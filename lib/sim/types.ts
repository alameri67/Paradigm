import type { z } from "zod";
import type {
  levelSchema,
  moodSchema,
  personaSchema,
  sectorSchema,
  simDataSchema,
  templatesSchema,
  traitSchema,
} from "./schema";

export type SimData = z.infer<typeof simDataSchema>;
export type Sector = z.infer<typeof sectorSchema>;
export type Trait = z.infer<typeof traitSchema>;
export type Level = z.infer<typeof levelSchema>;
export type Mood = z.infer<typeof moodSchema>;
export type Persona = z.infer<typeof personaSchema>;
export type Templates = z.infer<typeof templatesSchema>;

export type Tone = Mood["tone"];

/** Selected option index per trait key. */
export type TraitValues = Record<string, number>;

export interface Response {
  say: string;
  think: string;
  do: string;
  feel: string;
  mood: string;
}

export interface ResolvedPersona {
  id: string;
  sectorId: string;
  title: string | null;
  traits: TraitValues;
  responses: Record<string, Response>;
}

export interface Resolution {
  persona: ResolvedPersona;
  /** True when the persona matches the chosen traits exactly. */
  exact: boolean;
  source: "persona" | "template";
}
