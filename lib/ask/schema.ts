/** What the Ask AI panel sends to /api/ask. The client imports only the types from here. */
import { z } from "zod";
import { ASK_MODELS, type AskModelId } from "./models";

const text = (max = 2000) => z.string().max(max);
const list = (max = 40, each = 2000) => z.array(text(each)).max(max);

const Segment = z.object({
  people: z.number(),
  moods: list(5, 40),
  traits: list(10),
  mixed: list(10, 200),
  actions: list(10),
  quote: text().nullable(),
});

/** The facts the page has on screen right now. The server turns this into plain text for the model. */
export const ScreenSchema = z.object({
  page: z.enum(["summary", "details"]),
  scenario: z.object({ name: text(100), when: text(100), description: text() }),
  jobs: list(40, 200),
  summary: z
    .object({
      scope: text(),
      /** Set when the user has dragged a box on the chart. */
      selection: text().nullable(),
      people: z.number(),
      moods: z.array(z.object({ mood: text(40), count: z.number() })).max(5),
      topActions: z.array(z.object({ action: text(200), share: z.number() })).max(10),
      ends: z.object({ headline: text().nullable(), least: Segment, most: Segment }).nullable(),
    })
    .optional(),
  details: z
    .object({
      name: text(200),
      job: text(200),
      sector: text(200),
      version: text(40),
      interviewed: z.boolean(),
      age: z.number().nullable(),
      levels: z.array(z.object({ group: text(100), level: text(200) })).max(10),
      mood: text(40).nullable(),
      quote: text().nullable(),
      says: list(),
      thinks: list(),
      does: list(),
      feels: list(),
      interviewerNote: list(),
      /** Every scenario's mood for this person, mildest to most extreme. */
      moodByScenario: z.array(z.object({ scenario: text(100), mood: text(40) })).max(5),
      /** The job-wide pattern for this scenario, when one has been written. */
      jobHeadline: text().nullable(),
      /** Their story across the whole interview, for chatting with them. */
      headline: text().nullable().optional(),
      about: list().optional(),
      biggestWorry: list().optional(),
      whatWouldHelp: list().optional(),
    })
    .optional(),
});
export type Screen = z.infer<typeof ScreenSchema>;

export const AskRequestSchema = z.object({
  question: z.string().trim().min(1).max(2000),
  model: z.enum(ASK_MODELS.map((m) => m.id) as [AskModelId, ...AskModelId[]]),
  /** The conversation so far, oldest first, without the new question. */
  history: z
    .array(z.object({ role: z.enum(["user", "assistant"]), content: z.string().max(12000) }))
    .max(40),
  screen: ScreenSchema,
  /** "ask" answers about the page; "persona" answers as the person on the details page. */
  mode: z.enum(["ask", "persona"]).optional(),
  /** Sent along from the composer's toggles. The server doesn't use them yet. */
  search: z.boolean().optional(),
  research: z.boolean().optional(),
});
export type AskRequest = z.infer<typeof AskRequestSchema>;
