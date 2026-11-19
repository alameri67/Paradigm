import { describe, expect, it } from "vitest";
import { ACTION_LABEL, SCENARIOS, type InterviewSummary, type MoodKey } from "./types";
import { ACTION_WEIGHT, actionLevel, contrast, JITTER_X, JITTER_Y, pointsFor, summarize, thoughtsFor, worryOf } from "./dashboard";

function person(id: string, job: string, mood: MoodKey, actions: string[], quote = `Quote from ${id}`): InterviewSummary {
  const s = { mood, quote, actions };
  return {
    id,
    archetype: id.slice(0, 3),
    job,
    name: `Name ${id}`,
    scenarios: Object.fromEntries(SCENARIOS.map((x) => [x.code, s])) as InterviewSummary["scenarios"],
  };
}

describe("actionLevel", () => {
  it("weights every known action tag", () => {
    expect(Object.keys(ACTION_WEIGHT).sort()).toEqual(Object.keys(ACTION_LABEL).sort());
  });
  it("goes from no action (1) to drastic action (5) by the biggest steps", () => {
    expect(actionLevel([])).toBe(1);
    expect(actionLevel(["wait-and-see", "keep-going"])).toBe(1);
    expect(actionLevel(["not-a-tag"])).toBe(1);
    expect(actionLevel(["save-more", "cut-spending"])).toBe(2);
    expect(actionLevel(["save-more", "learn-ai"])).toBe(3);
    expect(actionLevel(["retrain", "invest"])).toBe(4);
    expect(actionLevel(["retrain", "move", "change-job"])).toBe(5);
  });
});

describe("pointsFor", () => {
  const people = [person("A01-11111", "Farmer", "calm", []), person("A16-22222", "Family doctor", "panicked", ["retrain", "move", "automate", "invest"])];
  it("places worry by mood with a small, stable jitter", () => {
    const a = pointsFor(people, "S2");
    const b = pointsFor(people, "S2");
    expect(a.map((p) => [p.x, p.y])).toEqual(b.map((p) => [p.x, p.y]));
    expect(Math.abs(a[0].x - worryOf("calm"))).toBeLessThanOrEqual(JITTER_X);
    expect(Math.abs(a[1].x - 5)).toBeLessThanOrEqual(JITTER_X);
    expect(Math.abs(a[0].y - 1)).toBeLessThanOrEqual(JITTER_Y);
    expect(Math.abs(a[1].y - 5)).toBeLessThanOrEqual(JITTER_Y);
    expect(a[1].label).toBe("Name A16-22222, family doctor");
  });
});

describe("summarize", () => {
  it("counts actions, moods and jobs, and takes quotes from different jobs first", () => {
    const people = [
      person("A01-11111", "Farmer", "calm", ["save-more", "save-more"]),
      person("A01-11112", "Farmer", "anxious", ["save-more", "retrain"]),
      person("A16-22222", "Family doctor", "anxious", ["retrain"]),
    ];
    const s = summarize(people, "S0");
    expect(s.n).toBe(3);
    expect(s.actions[0]).toEqual({ tag: "retrain", count: 2, share: 2 / 3 });
    expect(s.actions.find((a) => a.tag === "save-more")?.count).toBe(2);
    expect(s.moods).toEqual({ calm: 1, uneasy: 0, anxious: 2, alarmed: 0, panicked: 0 });
    expect(s.jobs.map((j) => [j.code, j.count])).toEqual([
      ["A01", 2],
      ["A16", 1],
    ]);
    expect(s.quotes).toHaveLength(2);
    expect(new Set(s.quotes.map((q) => q.job)).size).toBe(2);
    expect(s.quotes.every((q) => q.text === `Quote from ${q.id}`)).toBe(true);
  });
  it("handles an empty group", () => {
    const s = summarize([], "S1");
    expect(s.n).toBe(0);
    expect(s.actions).toEqual([]);
    expect(s.quotes).toEqual([]);
  });
});

describe("contrast", () => {
  const groups = ["lifeStage", "standing", "cushion", "outlook", "adaptability"].map((key) => ({
    key,
    label: key,
    levels: ["a", "b", "c"].map((k) => ({ key: k, label: k })),
  }));
  const person = (id: string, mood: MoodKey, actions: string[]): InterviewSummary => ({
    id,
    archetype: id.slice(0, 3),
    job: "Lineworker",
    name: id,
    scenarios: Object.fromEntries(SCENARIOS.map((s) => [s.code, { mood, quote: "Owning things is worth more now.", actions }])) as InterviewSummary["scenarios"],
  });
  it("counts each end from the selection and names what moves worry", () => {
    const calm = Array.from({ length: 6 }, (_, i) => person(`A03-1113${(i % 3) + 1}`, "calm", ["invest"]));
    const panicked = Array.from({ length: 6 }, (_, i) => person(`A03-1111${(i % 3) + 1}`, "panicked", ["seek-support", "cut-spending"]));
    const c = contrast([...calm, ...panicked], "S2", groups)!;
    expect(c.low.n).toBe(6);
    expect(c.high.n).toBe(6);
    expect(c.low.actions[0].text).toBe("All 6 will invest money.");
    expect(c.high.actions.map((a) => a.tag)).toEqual(["cut-spending", "seek-support"]);
    expect(c.drivers[0].key).toBe("outlook");
    expect(c.headline).toMatch(/^outlook matters most/);
  });
  it("says nothing when everyone feels the same", () => {
    const same = Array.from({ length: 8 }, (_, i) => person(`A03-1111${(i % 3) + 1}`, "uneasy", []));
    expect(contrast(same, "S2", groups)).toBeNull();
  });
});

describe("thoughtsFor", () => {
  const p = (id: string): InterviewSummary => ({
    id,
    archetype: id.slice(0, 3),
    job: "Lineworker",
    name: id,
    scenarios: Object.fromEntries(SCENARIOS.map((s) => [s.code, { mood: "uneasy", quote: "", actions: [] }])) as unknown as InterviewSummary["scenarios"],
  });
  const notes = { A03: { S2: { thoughts: [{ text: "Savings run out fast", ids: ["A03-11111", "A03-11112", "A03-11113"] }, { text: "Robots can't climb poles", ids: ["A03-11113"] }] } } };
  it("counts only the selected people, out of those whose thoughts were grouped", () => {
    const t = thoughtsFor([p("A03-11111"), p("A03-11113")], "S2", notes);
    expect(t[0]).toMatchObject({ text: "Savings run out fast", code: "A03", ids: ["A03-11111", "A03-11113"], count: 2, of: 2 });
    expect(t[1]).toMatchObject({ text: "Robots can't climb poles", count: 1, of: 2 });
  });
  it("is empty for a job without a summary yet", () => {
    expect(thoughtsFor([p("A03-11111")], "S0", notes)).toEqual([]);
  });
});
