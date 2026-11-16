import { z } from "zod";

/**
 * Runtime schema for the simulator dataset. Every word and number the UI shows
 * comes from a value that passes this schema, so swapping in real data only
 * means producing JSON of this shape (see data/sim-data.json).
 */

const response = z.object({
  say: z.string(),
  think: z.string(),
  do: z.string(),
  feel: z.string(),
  mood: z.string(),
});

export const sectorSchema = z.object({
  id: z.string().min(1),
  name: z.string(),
  role: z.string(),
  portraitUrl: z.string().nullable(),
});

export const traitSchema = z.object({
  key: z.string().min(1),
  label: z.string(),
  options: z.array(z.string()).min(1),
  /** Options are ordered, so "nearest" counts steps. Defaults to true. */
  ordinal: z.boolean().optional(),
  /** Weight in the nearest-persona distance. Defaults to 1. */
  weight: z.number().nonnegative().optional(),
});

export const levelSchema = z.object({
  code: z.string(),
  name: z.string(),
  year: z.string(),
  description: z.string(),
});

export const moodSchema = z.object({
  key: z.string(),
  label: z.string(),
  tone: z.enum(["success", "warning", "destructive"]),
});

export const personaSchema = z.object({
  id: z.string(),
  sectorId: z.string(),
  title: z.string().nullable().optional(),
  traits: z.record(z.string(), z.number().int().nonnegative()),
  responses: z.record(z.string(), response),
});

const fiveStrings = z.array(z.string()).length(5);

export const templatesSchema = z.object({
  say: fiveStrings,
  think: z.object({ early: fiveStrings, mid: fiveStrings, late: fiveStrings }),
  do: z.object({ high: fiveStrings, medium: fiveStrings, low: fiveStrings }),
  feel: z.record(z.string(), z.string()),
  feelCalmLater: z.string(),
  sectors: z.record(
    z.string(),
    z.object({
      task: z.string(),
      core: z.string(),
      plural: z.string(),
      /** -1 less exposed than average, 0 average, +1 more exposed. */
      shift: z.number().int().min(-1).max(1),
    }),
  ),
});

export const simDataSchema = z
  .object({
    sectors: z.array(sectorSchema).min(1),
    traits: z.array(traitSchema),
    levels: z.array(levelSchema).length(5),
    moods: z.array(moodSchema).min(1),
    personas: z.array(personaSchema),
    templates: templatesSchema.optional(),
  })
  .superRefine((d, ctx) => {
    const sectorIds = new Set(d.sectors.map((s) => s.id));
    const moodKeys = new Set(d.moods.map((m) => m.key));
    const codes = d.levels.map((l) => l.code);
    d.personas.forEach((p, i) => {
      if (!sectorIds.has(p.sectorId)) {
        ctx.addIssue({ code: "custom", path: ["personas", i, "sectorId"], message: `Unknown sector "${p.sectorId}"` });
      }
      for (const t of d.traits) {
        const v = p.traits[t.key];
        if (v != null && v >= t.options.length) {
          ctx.addIssue({ code: "custom", path: ["personas", i, "traits", t.key], message: `Option ${v} out of range` });
        }
      }
      for (const c of codes) {
        const r = p.responses[c];
        if (!r) ctx.addIssue({ code: "custom", path: ["personas", i, "responses", c], message: `Missing response for ${c}` });
        else if (!moodKeys.has(r.mood)) {
          ctx.addIssue({ code: "custom", path: ["personas", i, "responses", c, "mood"], message: `Unknown mood "${r.mood}"` });
        }
      }
    });
  });
