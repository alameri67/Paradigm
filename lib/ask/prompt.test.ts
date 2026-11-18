import { describe, expect, it } from "vitest";
import { describeScreen, SYSTEM_PROMPT, userTurn } from "./prompt";
import { AskRequestSchema, type Screen } from "./schema";

const scenario = { name: "AGI by 2028", when: "In 2 years", description: "The singularity hits fast." };

const summary: Screen = {
  page: "summary",
  scenario,
  jobs: ["Farmer", "Buyer"],
  summary: {
    scope: "Every version of 2 jobs",
    selection: null,
    people: 10,
    moods: [
      { mood: "Calm", count: 2 },
      { mood: "Panicked", count: 8 },
    ],
    topActions: [{ action: "Save more or pay down debt", share: 0.6 }],
    ends: {
      headline: "Savings matters most here.",
      least: { people: 2, moods: ["Calm"], traits: ["All 2 have savings."], mixed: [], actions: ["2 of 2 will invest money."], quote: null },
      most: { people: 8, moods: ["Panicked"], traits: [], mixed: ["Life stage"], actions: [], quote: "I can't sleep (Ana, farmer)" },
    },
  },
};

describe("describeScreen", () => {
  it("writes out the summary counts and the two ends", () => {
    const t = describeScreen(summary);
    expect(t.startsWith("<screen>")).toBe(true);
    expect(t).toContain("AI scenario: AGI by 2028");
    expect(t).toContain("Jobs picked: Farmer, Buyer");
    expect(t).toContain("Panicked: 8 (80%)");
    expect(t).toContain("Save more or pay down debt: 60%");
    expect(t).toContain("Savings matters most here.");
    expect(t).toContain("Mixed on: Life stage");
  });

  it("says when a details-page person hasn't been interviewed", () => {
    const t = describeScreen({
      page: "details",
      scenario,
      jobs: ["Farmer"],
      details: {
        name: "Ana Silva", job: "Farmer", sector: "Farming", version: "A01-22222", interviewed: false, age: 44,
        levels: [{ group: "Savings", level: "Some" }], mood: null, quote: null, says: [], thinks: [], does: [], feels: [],
        interviewerNote: [], moodByScenario: [], jobHeadline: null,
      },
    });
    expect(t).toContain("Ana Silva, Farmer (Farming), age 44");
    expect(t).toContain("hasn't been interviewed yet");
    expect(t).not.toContain("Says:");
  });

  it("puts the screen before the question, and keeps the system prompt free of per-request text", () => {
    expect(userTurn(summary, "  Why?  ").endsWith("</screen>\n\nWhy?")).toBe(true);
    expect(SYSTEM_PROMPT).toContain("simulated");
    expect(SYSTEM_PROMPT).not.toContain("<screen>\n");
  });
});

describe("AskRequestSchema", () => {
  it("accepts the panel's request and rejects unknown models", () => {
    const ok = { question: "Why?", model: "claude-sonnet-5-5", history: [], screen: summary };
    expect(AskRequestSchema.safeParse(ok).success).toBe(true);
    expect(AskRequestSchema.safeParse({ ...ok, model: "gpt-5" }).success).toBe(false);
    expect(AskRequestSchema.safeParse({ ...ok, question: "   " }).success).toBe(false);
  });
});
